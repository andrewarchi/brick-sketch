import React from 'react';
import PropTypes from 'prop-types';

// https://eloquentjavascript.net/19_paint.html

const scale = 10;

export class Picture {
  constructor(width, height, pixels) {
    this.width = width;
    this.height = height;
    this.pixels = pixels;
  }

  static empty(width, height, color) {
    const pixels = new Array(width * height).fill(color);
    return new Picture(width, height, pixels);
  }

  pixel(x, y) {
    return this.pixels[x + y * this.width];
  }

  draw(pixels) {
    const copy = [...this.pixels];
    for (const { x, y, color } of pixels) {
      copy[x + y * this.width] = color;
    }
    return new Picture(this.width, this.height, copy);
  }
}

class PictureCanvas extends React.Component {
  componentDidMount() {
    drawPicture(this.props.picture, this.canvas, scale);
  }

  onComponentWillReceiveProps({ picture }) {
    if (this.props.picture === picture) return;
    drawPicture(picture, this.canvas, scale);
  }

  mouse(downEvent, onDown) {
    if (downEvent.button !== 0) return;
    let pos = pointerPosition(downEvent, this.canvas);
    const onMove = onDown(pos);
    if (!onMove) return;
    const handleMove = moveEvent => {
      if (moveEvent.buttons === 0) {
        this.dom.removeEventListener('mousemove', handleMove);
      }
      else {
        const newPos = pointerPosition(moveEvent, this.canvas);
        if (newPos.x === pos.x && newPos.y === pos.y) return;
        pos = newPos;
        onMove(newPos);
      }
    };
    this.canvas.addEventListener('mousemove', handleMove);
  };

  touch(startEvent, onDown) {
    let pos = pointerPosition(startEvent.touches[0], this.canvas);
    const onMove = onDown(pos);
    startEvent.preventDefault();
    if (!onMove) return;
    const handleMove = moveEvent => {
      const newPos = pointerPosition(moveEvent.touches[0], this.canvas);
      if (newPos.x === pos.x && newPos.y === pos.y) return;
      pos = newPos;
      onMove(newPos);
    };
    const handleEnd = () => {
      this.canvas.removeEventListener('touchmove', handleMove);
      this.canvas.removeEventListener('touchend', handleEnd);
    };
    this.canvas.addEventListener('touchmove', handleMove);
    this.canvas.addEventListener('touchend', handleEnd);
  };

  handleMouseDown = event => this.mouse(event, this.props.pointerDown);
  handleTouchStart = event => this.touch(event, this.props.pointerDown);

  render() {
    return (
      <canvas
        ref={canvas => this.canvas = canvas}
        onMouseDown={this.handleMouseDown}
        onTouchStart={this.handleTouchStart}
      />
    );
  }
}

PictureCanvas.propTypes = {
  picture: PropTypes.instanceOf(Picture),
  pointerDown: PropTypes.func
};

export class PixelEditor extends React.Component {
  pointerDown = pos => {
    const tool = this.props.tools[this.props.tool];
    const onMove = tool(pos, this.state, this.props.dispatch); // TODO: dispatch
    if (onMove) {
      return pos => onMove(pos, this.state);
    }
  };

  render() {
    const { picture, tools, controls, dispatch } = this.props;
    return (
      <React.Fragment>
        <PictureCanvas
          picture={this.props.picture}
          pointerDown={this.pointerDown}
        />
        <br />
        {this.props.controls.map(Control =>
          <Control
            picture={picture}
            tools={tools}
            controls={controls}
            dispatch={dispatch}
          />
        )}
      </React.Fragment>
    );
  }
}

PixelEditor.propTypes = {
  picture: PropTypes.instanceOf(Picture),
  tool: PropTypes.string,
  tools: PropTypes.objectOf(PropTypes.func),
  controls: PropTypes.arrayOf(PropTypes.element),
  dispatch: PropTypes.func
};

export class ToolSelect extends React.Component {
  handleChange = event => this.props.dispatch({ tool: event.target.value });

  render() {
    const { tools, tool } = this.props;
    return (
      <label>
        🖌 Tool:
        <select
          value={tool}
          onChange={this.handleChange}
        >
          {Object.keys(tools).map(name =>
            <option selected={name === tool}>{name}</option>
          )}
        </select>
      </label>
    );
  }
}

ToolSelect.propTypes = {
  tools: PropTypes.objectOf(PropTypes.func),
  tool: PropTypes.string,
  dispatch: PropTypes.func
};

export class ColorSelect extends React.Component {
  handleChange = event => this.props.dispatch({ color: event.target.value });

  render() {
    return (
      <label>
        🎨 Color:
        <input
          type="color"
          value={this.props.color}
          onChange={this.handleChange}
        />
      </label>
    );
  }
}

ColorSelect.propTypes = {
  color: PropTypes.string,
  dispatch: PropTypes.func
};

export function updateState(state, action) {
  return { ...state, ...action };
}

function drawPicture(picture, canvas, scale) {
  canvas.width = picture.width * scale;
  canvas.height = picture.height * scale;
  const cx = canvas.getContext('2d');

  for (let y = 0; y < picture.height; y++) {
    for (let x = 0; x < picture.width; x++) {
      cx.fillStyle = picture.pixel(x, y);
      cx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
}

function pointerPosition(pos, domNode) {
  const rect = domNode.getBoundingClientRect();
  return {
    x: Math.floor((pos.clientX - rect.left) / scale),
    y: Math.floor((pos.clientY - rect.top) / scale)
  };
}

export function draw(pos, state, dispatch) {
  function drawPixel({ x, y }, state) {
    const drawn = { x, y, color: state.color };
    dispatch({ picture: state.picture.draw([drawn]) });
  }
  drawPixel(pos, state);
  return drawPixel;
}

export function rectangle(start, state, dispatch) {
  function drawRectangle(pos) {
    const xStart = Math.min(start.x, pos.x);
    const yStart = Math.min(start.y, pos.y);
    const xEnd = Math.max(start.x, pos.x);
    const yEnd = Math.max(start.y, pos.y);
    const drawn = [];
    for (let y = yStart; y <= yEnd; y++) {
      for (let x = xStart; x <= xEnd; x++) {
        drawn.push({ x, y, color: state.color });
      }
    }
    dispatch({ picture: state.picture.draw(drawn) });
  }
  drawRectangle(start);
  return drawRectangle;
}

const around = [
  { dx: -1, dy: 0 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: -1 },
  { dx: 0, dy: 1 }
];

export function fill({ x, y }, state, dispatch) {
  const targetColor = state.picture.pixel(x, y);
  const drawn = [{ x, y, color: state.color }];
  for (let done = 0; done < drawn.length; done++) {
    for (const { dx, dy } of around) {
      const x = drawn[done].x + dx, y = drawn[done].y + dy;
      if (x >= 0 && x < state.picture.width &&
          y >= 0 && y < state.picture.height &&
          state.picture.pixel(x, y) === targetColor &&
          !drawn.some(p => p.x === x && p.y === y)) {
        drawn.push({ x, y, color: state.color });
      }
    }
  }
  dispatch({ picture: state.picture.draw(drawn) });
}

export function pick(pos, state, dispatch) {
  dispatch({ color: state.picture.pixel(pos.x, pos.y) });
}

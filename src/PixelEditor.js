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

class PictureCanvas {
  constructor(picture, pointerDown) {
    this.dom = elt('canvas', {
      onmousedown:  event => this.mouse(event, pointerDown),
      ontouchstart: event => this.touch(event, pointerDown)
    });
    this.syncState(picture);
  }

  syncState(picture) {
    if (this.picture === picture) return;
    this.picture = picture;
    drawPicture(this.picture, this.dom, scale);
  }

  mouse = (downEvent, onDown) => {
    if (downEvent.button !== 0) return;
    let pos = pointerPosition(downEvent, this.dom);
    const onMove = onDown(pos);
    if (!onMove) return;
    const handleMove = moveEvent => {
      if (moveEvent.buttons === 0) {
        this.dom.removeEventListener('mousemove', handleMove);
      }
      else {
        const newPos = pointerPosition(moveEvent, this.dom);
        if (newPos.x === pos.x && newPos.y === pos.y) return;
        pos = newPos;
        onMove(newPos);
      }
    };
    this.dom.addEventListener('mousemove', handleMove);
  };

  touch = (startEvent, onDown) => {
    let pos = pointerPosition(startEvent.touches[0], this.dom);
    const onMove = onDown(pos);
    startEvent.preventDefault();
    if (!onMove) return;
    const handleMove = moveEvent => {
      const newPos = pointerPosition(moveEvent.touches[0], this.dom);
      if (newPos.x === pos.x && newPos.y === pos.y) return;
      pos = newPos;
      onMove(newPos);
    };
    const handleEnd = () => {
      this.dom.removeEventListener('touchmove', handleMove);
      this.dom.removeEventListener('touchend', handleEnd);
    };
    this.dom.addEventListener('touchmove', handleMove);
    this.dom.addEventListener('touchend', handleEnd);
  };
}

export class PixelEditor {
  constructor(state, config) {
    const { tools, controls, dispatch } = config;
    this.state = state;

    this.canvas = new PictureCanvas(state.picture, pos => {
      const tool = tools[this.state.tool];
      const onMove = tool(pos, this.state, dispatch);
      if (onMove) {
        return pos => onMove(pos, this.state);
      }
    });
    this.controls = controls.map(Control => new Control(state, config));
    this.dom = elt('div', {},
      this.canvas.dom,
      elt('br'),
      ...this.controls.reduce((acc, curr) => acc.concat(' ', curr.dom), [])
    );
  }

  syncState(state) {
    this.state = state;
    this.canvas.syncState(state.picture);
    for (const ctrl of this.controls) {
      ctrl.syncState(state);
    }
  }
}

export class ToolSelect {
  constructor(state, { tools, dispatch }) {
    this.select = elt('select', { onchange: () => dispatch({tool: this.select.value}) },
      ...Object.keys(tools).map(name =>
        elt('option', { selected: name === state.tool }, name)
      )
    );
    this.dom = elt('label', null, '🖌 Tool: ', this.select);
  }

  syncState(state) {
    this.select.value = state.tool;
  }
}

export class ColorSelect {
  constructor(state, { dispatch }) {
    this.input = elt('input', {
      type: 'color',
      value: state.color,
      onchange: () => dispatch({ color: this.input.value })
    });
    this.dom = elt('label', null, '🎨 Color: ', this.input);
  }

  syncState(state) {
    this.input.value = state.color;
  }
}

export function updateState(state, action) {
  return { ...state, ...action };
}

function elt(type, props, ...children) {
  const dom = document.createElement(type);
  if (props) {
    Object.assign(dom, props);
  }
  for (const child of children) {
    dom.appendChild(typeof child !== 'string' ? child : document.createTextNode(child));
  }
  return dom;
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

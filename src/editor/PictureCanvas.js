import React from 'react';
import PropTypes from 'prop-types';
import Picture from './Picture';
import { scale, drawPicture, pointerPosition } from './shared';

export default class PictureCanvas extends React.Component {
  canvas = React.createRef();

  componentDidMount() {
    drawPicture(this.props.picture, this.canvas.current, scale);
  }

  componentWillReceiveProps({ picture }) {
    //if (this.props.picture !== picture) {
      drawPicture(picture, this.canvas.current, scale);
    //}
  }

  mouse(downEvent, onDown) {
    if (downEvent.button !== 0) return;
    let pos = pointerPosition(downEvent, this.canvas.current);
    const onMove = onDown(pos);
    if (!onMove) return;
    const move = moveEvent => {
      if (moveEvent.buttons === 0) {
        this.canvas.current.removeEventListener('mousemove', move);
      }
      else {
        const newPos = pointerPosition(moveEvent, this.canvas.current);
        if (newPos.x === pos.x && newPos.y === pos.y) return;
        pos = newPos;
        onMove(newPos);
      }
    };
    this.canvas.current.addEventListener('mousemove', move);
  }

  touch(startEvent, onDown) {
    let pos = pointerPosition(startEvent.touches[0], this.canvas.current);
    const onMove = onDown(pos);
    startEvent.preventDefault();
    if (!onMove) return;
    const move = moveEvent => {
      const newPos = pointerPosition(moveEvent.touches[0], this.canvas.current);
      if (newPos.x === pos.x && newPos.y === pos.y) return;
      pos = newPos;
      onMove(newPos);
    };
    const end = () => {
      this.canvas.current.removeEventListener('touchmove', move);
      this.canvas.current.removeEventListener('touchend', end);
    };
    this.canvas.current.addEventListener('touchmove', move);
    this.canvas.current.addEventListener('touchend', end);
  }

  handleMouseDown = event => this.mouse(event, this.props.pointerDown);
  handleTouchStart = event => this.touch(event, this.props.pointerDown);

  render() {
    return <canvas
      ref={this.canvas}
      onMouseDown={this.handleMouseDown}
      onTouchStart={this.handleTouchStart}
    />;
  }
}

PictureCanvas.propTypes = {
  picture: PropTypes.instanceOf(Picture).isRequired,
  pointerDown: PropTypes.func.isRequired
};

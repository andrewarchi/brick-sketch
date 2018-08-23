import React from 'react';
import PropTypes from 'prop-types';
import Picture from './Picture';

export class LoadButton extends React.Component {
  handleChange = () => startLoad(this.props.dispatch);

  render() {
    return <button onClick={this.handleClick}>📁 Load</button>;
  }
}

LoadButton.propTypes = {
  dispatch: PropTypes.func.isRequired
}

function startLoad(dispatch) {
  const input = document.createElement('input');
  input.type = 'file';
  input.onchange = () => finishLoad(input.files[0], dispatch);
  document.body.appendChild(input); // TODO: Unnecessary?
  input.click();
  input.remove();
}

function finishLoad(file, dispatch) {
  if (file == null) return;
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    const image = document.createElement('img');
    image.src = reader.result;
    image.onload = () => dispatch({ picture: pictureFromImage(image) });
  });
  reader.readAsDataURL(file);
}

function pictureFromImage(image) {
  const width = Math.min(100, image.width);
  const height = Math.min(100, image.height);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const cx = canvas.getContext('2d');
  cx.drawImage(image, 0, 0);
  const pixels = [];
  const { data } = cx.getImageData(0, 0, width, height);

  const hex = n => n.toString(16).padStart(2, '0');
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = data.slice(i, i + 3);
    pixels.push('#' + hex(r) + hex(g) + hex(b));
  }
  return new Picture(width, height, pixels);
}

export default LoadButton;

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { PixelEditor, Picture, ToolSelect, ColorSelect, updateState, draw, fill, rectangle, pick } from './PixelEditor';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <React.Fragment>
    <App />
    <div id="editor"></div>
  </React.Fragment>,
  document.getElementById('root')
);
registerServiceWorker();

let state = {
  tool: 'draw',
  color: '#000000',
  picture: Picture.empty(60, 30, '#f0f0f0')
};
const app = new PixelEditor(state, {
  tools: { draw, fill, rectangle, pick },
  controls: [ToolSelect, ColorSelect],
  dispatch(action) {
    state = updateState(state, action);
    app.syncState(state);
  }
});
document.getElementById('editor').appendChild(app.dom);

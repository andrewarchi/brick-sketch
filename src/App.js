import React from 'react';

import PixelEditor from './editor/PixelEditor';
import { draw, fill, rectangle, pick } from './editor/tools';
import ToolSelect from './editor/ToolSelect';
import ColorSelect from './editor/ColorSelect';
import SaveButton from './editor/SaveButton';
import LoadButton from './editor/LoadButton';
import UndoButton from './editor/UndoButton';
import logo from './logo.svg';
import './App.css';

// https://eloquentjavascript.net/19_paint.html

const tools = { draw, fill, rectangle, pick };
const controls = [ToolSelect, ColorSelect, SaveButton, LoadButton, UndoButton];

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Brick Sketch</h1>
        </header>
        <div id="editor">
          <PixelEditor tools={tools} controls={controls} dispatch={() => {}}/>
        </div>
      </div>
    );
  }
}

export default App;

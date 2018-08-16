import React, { Component } from 'react';
import { PixelEditor, Picture, ToolSelect, ColorSelect, updateState, draw, fill, rectangle, pick } from './editor/PixelEditor';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Brick Sketch</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <PixelEditor
          tool="draw"
          color="#000000"
          picture={Picture.empty(60, 30, '#f0f0f0')}
          tools={{ draw, fill, rectangle, pick }}
          controls={[ToolSelect, ColorSelect]}
          dispatch={action => {
            //state = updateState(state, action);
            //app.syncState(state);
          }}
        />
      </div>
    );
  }
}

export default App;

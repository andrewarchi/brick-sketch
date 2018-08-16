import React, { Component } from 'react';
import { startPixelEditor } from './editor/editor';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  componentDidMount() {
    document.getElementById('editor').appendChild(startPixelEditor());
  }

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
        <div id="editor"></div>
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import './App.css';
import Canvas from './Canvas';

class App extends Component {
  render() {
    return (
      <div>
        <Canvas width = {window.innerWidth} height = {window.innerHeight}/>
      </div>
    );
  }
}

export default App;

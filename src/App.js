import React, { Component } from 'react';
import './App.css';
import Canvas from './Canvas';
import {Route, BrowserRouter as Router} from 'react-router-dom';
import CropEditPage from './components/CropEditPage';

class App extends Component {
  render() {
    return (
      <Router>
        <Route exact={true} path="/" render = {(props) => <Canvas width = {window.innerWidth} height = {window.innerHeight} {...props}/> }/>
        <Route path = "/crop/:cropId" render = {(props) => <CropEditPage {...props} />}/>
      </Router>
    );
  }
}

export default App;

import React, { Component } from 'react';
import './App.css';
import Canvas from './Canvas';
import {Route, BrowserRouter as Router} from 'react-router-dom';
import CropEditPage from './components/CropEditPage';
import GardenList from './components/GardenList';
import NewGardenPage from './components/NewGardenPage';

class App extends Component {
  render() {
    return (
      <Router>
        <Route exact={true} path="/" render = {(props) =>  <GardenList />}/>
        <Route path="/garden/:gardenId" render={props => <Canvas {...props} />}/>
        <Route path = "/crop/:cropId" render = {(props) => <CropEditPage {...props} />}/>
        <Route path = "/creategarden" exact = {true} render = {(props) => <NewGardenPage {...props} /> }/>
      </Router>
    );
  }
}

export default App;

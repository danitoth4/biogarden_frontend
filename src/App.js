import React, { Component } from 'react';
import './App.css';
import Canvas from './Canvas';
import {Route, BrowserRouter as Router} from 'react-router-dom';
import CropEditPage from './components/CropEditPage';
import GardenList from './components/GardenList';
import NewGardenPage from './components/NewGardenPage';
import LoginForm from './components/LoginForm';
import backgroundPath from './backgroundPath.js'
import { Box } from 'grommet';

class App extends Component {
  render() {
    const backgroundStyle = {
      minHeight: "100vh"
    }
    return (
      <Box background={backgroundPath} style={backgroundStyle}>
        <Router>
          <Route exact={true} path="/" render = {(props) =>  <GardenList />}/>
          <Route path="/garden/:gardenId/:contentId" render={props => <Canvas {...props} />}/>
          <Route path = "/crop/:cropId" render = {(props) => <CropEditPage {...props} />}/>
          <Route path = "/creategarden" exact = {true} render = {(props) => <NewGardenPage {...props} /> }/>
          <Route path = "/login" exact = {true} render = {(props) => <LoginForm {...props}/>}/>
        </Router>
      </Box>
    );
  }
}

export default App;

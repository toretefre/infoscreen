import React from 'react';
import './App.css';
import 'moment/locale/nn';
import moment from 'moment';
import { Router } from '@reach/router'
import Home from './containers/home'

export const App = () => {
  moment().locale('nn');

  return (
    <Router>
      <Home path="/" />
      <Home path="/:input" />
    </Router>
  );
}

export default App;

import React from 'react';
import './App.css';
import 'moment/locale/nn';
import moment from 'moment';
import 'moment-timezone';
import { Router } from '@reach/router'
import Home from './containers/home'

export const App = () => {
  moment().locale('nn');

  return (
    <Router>
      <Home path="/" />
    </Router>
  );
}

export default App;

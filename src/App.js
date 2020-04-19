import React from 'react';
import './App.css';
import 'moment/locale/nn';
import moment from 'moment';
import { Router } from '@reach/router'
import Home from './containers/Home'
import Places from './containers/Places';

export const App = () => {
  moment().locale('nn');

  return (
    <Router>
      <Home path="/" />
      <Home path="/:input" />
      <Places path="/tilpass" />
    </Router>
  );
}

export default App;

import React from 'react';
import './App.css';
import 'moment/locale/nn';
import moment from 'moment';
import { Router } from '@reach/router'
import Home from './containers/home'
import Places from './containers/places';

export const App = () => {
  moment().locale('nn');

  return (
    <Router>
      <Home path="/" />
      <Home path="/:input" />
      <Home path="/:lat/:lon" />
      <Home path="/https://www.google.com/maps/:googledetails" />
      <Home path="/https:/www.google.com/maps/:googledetails" />
      <Home path="/https://www.google.com/maps/:irrelephantdata/:irrelepehantdataagain/:googledetails/:evenmoreirrelephantdata" />
      <Home path="/https:/www.google.com/maps/:irrelephantdata/:irrelepehantdataagain/:googledetails/:evenmoreirrelephantdata" />
      <Places path="/tilpass" />
    </Router>
  );
}

export default App;

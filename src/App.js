import React from 'react';
import './App.css';
import 'moment/locale/nn';
import moment from 'moment';
import { Router } from '@reach/router'
import Home from './containers/home'

export const App = () => {
  moment().locale('nn');

  const Help = () => (
    <React.Fragment>
      <h1 className="white">Heisann!</h1>
      <p className="white">Denne infoskjermen fungerer best om du legger til et sted på slutten av nettadressen, f.eks. /k18</p>
    </React.Fragment>
  )

  return (
    <Router>
      <Help path="/" />
      <Home path="/:input" />
    </Router>
  );
}

export default App;

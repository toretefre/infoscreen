import React, { useState, useEffect } from 'react';
import './App.css';
import WeatherCard from './components/WeatherCard';
import BicycleCard from './components/BicycleCard';
import TimeCard from './components/TimeCard';
import BusCard from './components/BusCard';
import 'moment/locale/nn';
import moment from 'moment';

export const App = () => {
  const [time, setTime] = useState();

  useEffect(() => {
    moment().locale('nn');

    setInterval(() => {
      setTime(moment());
    }, 1000);

    setInterval(() => {
      window.location.reload(true);
    }, 1000 * 60 * 6);
  }, []);

  return (
    <article className="article">
      <WeatherCard />
      <TimeCard time={time} />
      <BusCard />
      <BicycleCard />
    </article>
  );
};

export default App;

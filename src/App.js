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
  }, []);
  return (
    <article className="article">
      <BusCard />
      <BicycleCard />
      <WeatherCard />
      <TimeCard time={time} />
    </article>
  );
};

export default App;

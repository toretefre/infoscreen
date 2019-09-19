import React, { useState, useEffect } from 'react';
import './App.css';
import WeatherCard from './components/WeatherCard';
import BicycleCard from './components/BicycleCard';
import MannenCard from './components/MannenCard';
import BusCard from './components/BusCard';

export const App = () => {
  const [time, setTime] = useState();
  useEffect(() => {
    setInterval(() => {
      setTime(new Date());
    }, 1000);
  }, []);
  return (
    <article className="article">
      <BusCard />
      <BicycleCard />
      <WeatherCard />
      <MannenCard time={time} />
    </article>
  );
};

export default App;

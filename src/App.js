import React from 'react';
import './App.css';
import WeatherCard from './components/WeatherCard';
import BicycleCard from './components/BicycleCard';
import MannenCard from './components/MannenCard';
import BusCard from './components/BusCard';

export const App = () => {
  return (
    <article className="article">
      <BusCard />
      <BicycleCard />
      <WeatherCard />
      <MannenCard />
    </article>
  );
};

export default App;

import React from 'react';
import Card from './components/Card';
import './App.css';
import WeatherCard from './components/WeatherCard';
import BicycleCard from './components/BicycleCard';

export const App = () => {
  return (
    <article className="article">
      <Card title="Buss" />
      <BicycleCard />
      <WeatherCard />
      <Card title="Har mannen falt?" />
    </article>
  );
};

export default App;

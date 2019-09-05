import React from 'react';
import Card from './components/Card';
import './App.css';
import WeatherCard from './components/WeatherCard';

export const App = () => {
  return (
    <article class="article">
      <Card title="Buss" />
      <Card title="Bysykkel" />
      <WeatherCard />
      <Card title="Har mannen falt?" />
    </article>
  );
};

export default App;

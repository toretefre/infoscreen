import React from 'react';
import Card from './components/Card';
import './App.css';

export const App = () => {
  return (
    <article class="article">
      <Card title="Buss" />
      <Card title="Bysykkel" />
      <Card title="Vær" />
      <Card title="Har mannen falt?" />
    </article>
  );
};

export default App;

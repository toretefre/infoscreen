import React, { useState, useEffect } from 'react';

export const WeatherCard = () => {
  const [weather, setWeather] = useState();

  useEffect(() => setWeather('nei'), []);

  return (
    <section className="card">
      <h1>Vær</h1>
      <p>Nedbørsfritt neste timen, 19&deg;</p>
    </section>
  );
};

export default WeatherCard;

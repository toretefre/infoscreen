import React, { useState, useEffect } from 'react';

export const WeatherCard = () => {
  const [weather, setWeather] = useState();
  const [precipitation, setPrecipitation] = useState('rainy');

  useEffect(() => {
    const fetchWeatherData = async () => {
      console.log('fetching weather');
      const response = await fetch(
        'https://www.yr.no/stad/Norge/Tr%C3%B8ndelag/Trondheim/Trondheim/varsel_nu.xml'
      );
      const json = await response.json();
      console.log(json);
    };

    fetchWeatherData();
  }, []);

  return (
    <section className="card">
      <img src={icons[precipitation]} alt={precipitation} />
      <h1 className="bigtext">-273.15&deg;</h1>
      <h6>Vêrvarsel frå Yr, levert av NRK og Meteorologisk institutt</h6>
    </section>
  );
};

const icons = {
  sun: 'https://yr.github.io/weather-symbols/png/100/01d.png',
  cloudy: 'https://yr.github.io/weather-symbols/png/100/04.png',
  rainy: 'https://yr.github.io/weather-symbols/png/100/09.png',
  snow: 'https://yr.github.io/weather-symbols/png/100/13.png'
};

export default WeatherCard;

import React, { useState, useEffect } from 'react';
import * as convert from 'xml-js';

export const WeatherCard = () => {
  const [weather, setWeather] = useState();
  const [precipitation, setPrecipitation] = useState('rainy');

  useEffect(() => {
    const fetchWeatherData = async () => {
      const response = await fetch(
        'https://cors-anywhere.herokuapp.com/https://www.yr.no/sted/Norge/Tr%C3%B8ndelag/Trondheim/Trondheim/varsel_nu.xml'
      );
      const xmlfile = await response.text()
      const jsfile = convert.xml2js(xmlfile);
      console.log(jsfile);
    };

    fetchWeatherData();
  }, []);

  return (
    <section className="card">
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

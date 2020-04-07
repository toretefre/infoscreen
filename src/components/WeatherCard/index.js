import React, { useState, useEffect } from 'react';
import moment from 'moment';
import * as convert from 'xml-js';

export const WeatherCard = () => {
  const [weather, setWeather] = useState();
  const [updateTime, setUpdateTime] = useState();
  const [precipitation, setPrecipitation] = useState();

  useEffect(() => {
    const fetchWeatherData = async () => {
      const response = await fetch(
        'https://cors-anywhere.herokuapp.com/https://www.yr.no/sted/Norge/Tr%C3%B8ndelag/Trondheim/Trondheim/varsel_nu.xml'
      );
      const xmlfile = await response.text()
      const jsfile = convert.xml2js(xmlfile);
      const currentWeather = jsfile.elements[0].elements;
      const lastUpdatedTime = currentWeather
        .find(element => element.name === "meta")
        .elements
        .find(element => element.name === "lastupdate")
        .elements[0].text;
      setUpdateTime(moment(lastUpdatedTime));
      const precipitationData = currentWeather
        .find(element => element.name === "forecast")
        .elements;
      const weatherTableRows = precipitationData.map(time =>
        <tr key={time.attributes.from}>
          <td>{moment(time.attributes.from).format('LT')}</td>
          <td>{time.elements.find(element => element.name === "precipitation").attributes.value} mm nedbør</td>
        </tr>
      )
      setPrecipitation(weatherTableRows);
    };

    const fetchTemperatureData = async () => {
      const response = await fetch(
        'https://api.met.no/weatherapi/locationforecast/1.9/.json?lat=63.422937&lon=10.396857&msl=10'
      )
      const temperatureData = await response.json();
      const newestTemperatureData = temperatureData.product.time[0];
      console.log(newestTemperatureData);
      setWeather({
        temperature: newestTemperatureData.location.temperature.value,
        cloudiness: newestTemperatureData.location.cloudiness.percent,
        wind: {
          mps: newestTemperatureData.location.windSpeed.mps,
          name: newestTemperatureData.location.windSpeed.name,
        },
        updated: newestTemperatureData.from,
      })
    };

    fetchWeatherData();
    fetchTemperatureData();
  }, []);

  return (
    <section className="card">
      {weather && <h3>Varsel for kl. {moment(weather.updated).format('LT')}</h3>}

      {weather && <h1 className="bigtext">{weather.temperature}&deg;</h1>}

      {weather && <h2>{Math.round(weather.cloudiness)}% skydekke</h2>}

      {weather && <h2>{weather.wind.name} - {weather.wind.mps} m/s</h2>}

      <h6>Data fra Meteorologisk institutt</h6>

      {precipitation &&
        <table><tbody>
          {precipitation}
        </tbody></table>
      }
      <h6>Nedbørsvarsel frå Yr, levert av NRK og Meteorologisk institutt</h6>
      {updateTime && <h6>Sist oppdatert {updateTime.format('LT')}</h6>}
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

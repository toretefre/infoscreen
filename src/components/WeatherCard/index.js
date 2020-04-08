import React, { useState, useEffect } from 'react';
import moment from 'moment';
import * as convert from 'xml-js';
import * as V from 'victory';

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
      const precipitationChartData = [];
      precipitationData.forEach(time =>
        precipitationChartData.push({
          x: moment(time.attributes.from).diff(moment(), 'minutes'),
          y: parseFloat(time.elements.find(element => element.name === "precipitation").attributes.value)
        }));


      console.log(precipitationChartData)
      setPrecipitation(precipitationChartData);
    };

    const fetchTemperatureData = async () => {
      const response = await fetch(
        'https://api.met.no/weatherapi/locationforecast/1.9/.json?lat=63.422937&lon=10.396857&msl=10'
      )
      const temperatureData = await response.json();
      const newestTemperatureData = temperatureData.product.time[0];
      const symbolData = temperatureData.product.time[1].location.symbol;

      setWeather({
        symbol: {
          code: symbolData.number,
          id: symbolData.id,
        },
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

      {weather && <img src={'https://api.met.no/weatherapi/weathericon/1.1/?content_type=image%2Fpng&symbol=' + weather.symbol.code} alt={weather.symbol.id} />}

      {weather && <h1 className="bigtext">{weather.temperature}&deg;</h1>}

      {weather && <h2>{Math.round(weather.cloudiness)}% skydekke</h2>}

      {weather && <h2>{weather.wind.name} - {weather.wind.mps} m/s</h2>}

      <h6>Data fra Meteorologisk institutt</h6>

      {weather && <V.VictoryChart>
        <V.VictoryArea
          data={precipitation}
          domain={{ y: [0, 10] }}
        />
      </V.VictoryChart>}

      <h6>Nedbørsvarsel frå Yr, levert av NRK og Meteorologisk institutt</h6>
      {updateTime && <h6>Sist oppdatert {updateTime.format('LT')}</h6>}
    </section>
  );
};

export default WeatherCard;

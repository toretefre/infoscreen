import React, { useState, useEffect } from 'react';
import 'moment-timezone';
import directions from './directions';

export const WeatherCard = props => {
  const { geoLocation } = props;
  const [forecast, setForecast] = useState();

  useEffect(() => {
    const fetchForecast = async () => {
      const response = await fetch(
        `https://api.met.no/weatherapi/locationforecast/1.9/.json?lat=${geoLocation.lat}&lon=${geoLocation.lon}&msl=${geoLocation.msl}`
      )
      const temperatureData = await response.json();
      const forecast = temperatureData.product.time[0];
      const symbolData = temperatureData.product.time[1].location.symbol;

      setForecast({
        symbol: {
          code: symbolData.number,
          id: symbolData.id,
        },
        temperature: forecast.location.temperature.value,
        cloudiness: forecast.location.cloudiness.percent,
        wind: {
          mps: forecast.location.windSpeed.mps,
          name: forecast.location.windSpeed.name,
          direction: forecast.location.windDirection.name,
        },
        updated: forecast.from,
      });
    }

    fetchForecast();
  }, [geoLocation.lat, geoLocation.lon, geoLocation.msl]);

  if (!forecast) return <section id="weatherCard" className="card" />

  return (
    <section id="weatherCard" className="card" >
      <img className="weatherSymbol" src={'https://api.met.no/weatherapi/weathericon/1.1/?content_type=image%2Fpng&symbol=' + forecast.symbol.code} alt={forecast.symbol.id} />
      <h2>{forecast.temperature}&deg;</h2>
      <h3>{Math.round(forecast.cloudiness)}% skydekke</h3>
      <h3>{forecast.wind.name} - {Math.round(forecast.wind.mps)} m/s frå {directions[forecast.wind.direction]}</h3>
    </section>
  )
}

export default WeatherCard;

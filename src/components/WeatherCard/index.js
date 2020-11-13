import React, { useState, useEffect } from 'react';
import 'moment-timezone';
import directions from './directions';

export const WeatherCard = props => {
  const { geoLocation } = props;
  const [forecast, setForecast] = useState();

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await fetch(
          `https://api.met.no/weatherapi/locationforecast/2.0/complete?altitude=${geoLocation.msl.toFixed()}&lat=${geoLocation.lat.toFixed(4)}&lon=${geoLocation.lon.toFixed(4)}`
        )
        const temperatureData = await response.json();
        const newForecast = temperatureData.properties;
        const newForecastUpdated = newForecast.meta.updated_at;
        const newForecastData = newForecast.timeseries;
        const newCurrentForecastData = newForecastData[0].data.instant.details;

        setForecast({
          symbol: newForecastData[0].data.next_1_hours.summary.symbol_code,
          temperature: newCurrentForecastData.air_temperature,
          cloudiness: newCurrentForecastData.cloud_area_fraction,
          wind: {
            mps: newCurrentForecastData.wind_speed,
            gust: newCurrentForecastData.wind_speed_of_gust,
            direction: newCurrentForecastData.wind_from_direction,
          },
          updated: newForecastUpdated,
        });
      }
      catch {
        setForecast({
          error: "Henting av vêr feila, truleg er det regn uansett 😥",
        })
      }
    }

    fetchForecast();
  }, [geoLocation.lat, geoLocation.lon, geoLocation.msl]);

  if (!forecast) return <section id="weatherCard" className="card" />

  if (forecast.error) return <section id="weatherCard" className="card">{forecast.error}</section>

  return (
    <section id="weatherCard" className="card" >
      <h2 className="time">{forecast.temperature}&deg;</h2>
      <img
        className="weatherSymbol"
        src={process.env.PUBLIC_URL + '/weather_icons/' + forecast.symbol + '.svg'}
        alt={forecast.symbol.id}
      />
      <h3>{Math.round(forecast.cloudiness)}% skydekke</h3>
      <h3>{forecast.wind.name}</h3>
      <h3>{Math.round(forecast.wind.mps)} m/s frå {Math.round(forecast.wind.direction)} grader ({Math.round(forecast.wind.gust)} m/s vindkast)</h3>
    </section>
  )
}

export default WeatherCard;

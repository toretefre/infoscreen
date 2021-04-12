import React from 'react';
import 'moment-timezone';

export const WeatherCard = props => {
  const { weather } = props;

  if (weather.loading) return (
    <section id="weatherCard" className="card"><p>Laster...</p></section>
  )

  return (
    <section id="weatherCard" className="card" >
      <h2 className="time">{weather.data.airTemperature}&deg;</h2>
      <img
        className="weatherSymbol"
        src={process.env.PUBLIC_URL + '/weather_icons/' + weather.data.symbol + '.svg'}
        alt={`Værsymbol: ${weather.data.symbol}`}
      />
      <h3>{Math.round(weather.data.wind.speed)} m/s frå {Math.round(weather.data.wind.direction)} grader ({Math.round(weather.data.wind.gustSpeed)} m/s vindkast)</h3>
    </section>
  )
}

export default WeatherCard;

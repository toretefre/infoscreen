import React, { useState, useEffect } from 'react';
import moment from 'moment';
import * as V from 'victory';

const directions = {
  SW: "sør-vest",
  SE: "sør-aust",
  NW: "nord-vest",
  NE: "nord-aust",
  W: "vest",
  N: "nord",
  S: "sør",
  E: "aust",
}

export const WeatherCard = () => {
  const [weather, setWeather] = useState();
  const [precipitation, setPrecipitation] = useState();

  useEffect(() => {
    const fetchPrecipitation = async () => {
      const response = await fetch(
        'https://api.met.no/weatherapi/nowcast/0.9/.json?lat=63.422798&lon=10.396867'
      );
      const jsfile = await response.json();
      const lastUpdatedTime = moment(jsfile.created);
      const currentPrecipitation = jsfile.product.time;
      const precipitationChartData = [];

      currentPrecipitation
        .filter(time =>
          moment(time.from).diff(moment(), 'minutes') >= 0
        )
        .forEach(time => {
          precipitationChartData.push({
            x: moment(time.from).diff(moment(), 'minutes'),
            y: parseFloat(time.location.precipitation.value),
          });
        });

      setPrecipitation({
        chartData: precipitationChartData,
        lastUpdated: moment(lastUpdatedTime),
      });
    };

    const fetchForecast = async () => {
      const response = await fetch(
        'https://api.met.no/weatherapi/locationforecast/1.9/.json?lat=63.422937&lon=10.396857&msl=10'
      )
      const temperatureData = await response.json();
      const forecast = temperatureData.product.time[0];
      const symbolData = temperatureData.product.time[1].location.symbol;

      setWeather({
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
    };

    fetchPrecipitation();
    fetchForecast();
  }, []);

  if (!weather || !precipitation) {
    return (
      <section id="weatherCard" className="card" />
    )
  }

  return (
    <section id="weatherCard" className="card" >
      <h3>Varsel for kl. {moment(weather.updated).format('LT')}</h3>
      <img src={'https://api.met.no/weatherapi/weathericon/1.1/?content_type=image%2Fpng&symbol=' + weather.symbol.code} alt={weather.symbol.id} />
      <h1 className="bigtext">{weather.temperature}&deg;</h1>
      <h2>{Math.round(weather.cloudiness)}% skydekke</h2>
      <h2>{weather.wind.name} - {weather.wind.mps} m/s frå {directions[weather.wind.direction]}</h2>
      <h6>Vêrvarsel frå Yr, levert av NRK og Meteorologisk institutt</h6>
      <h6>Sist oppdatert {precipitation.lastUpdated.format('LT')}</h6>

      <V.VictoryChart>
        <V.VictoryArea
          data={precipitation.chartData}
          domain={{ y: [0, 3] }}
        />
      </V.VictoryChart>

    </section>
  );
};

export default WeatherCard;

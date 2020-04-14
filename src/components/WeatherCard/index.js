import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { VictoryArea, VictoryChart, VictoryLabel } from 'victory';
import directions from './directions';

export const WeatherCard = () => {
  const [userLocation, setUserLocation] = useState({
    lat: 63.42279,
    lon: 10.396867,
    msl: 10,
  });
  const [weather, setWeather] = useState();
  const [precipitation, setPrecipitation] = useState();

  useEffect(() => {
    const fetchPrecipitation = async () => {
      const response = await fetch(
        `https://api.met.no/weatherapi/nowcast/0.9/.json?lat=${userLocation.lat}&lon=${userLocation.lon}`
      );
      const fetchedPrecipitationData = await response.json();

      const lastUpdatedTime = fetchedPrecipitationData.created;
      const currentPrecipitation = fetchedPrecipitationData.product.time;
      const precipitationChartData = [];
      let totalPrecipitation = 0

      currentPrecipitation
        .filter(time =>
          moment(time.from).diff(moment(), 'minutes') >= 0
        )
        .forEach(time => {
          const p = parseFloat(time.location.precipitation.value)
          totalPrecipitation += p
          precipitationChartData.push({
            x: moment(time.from).diff(moment(), 'minutes'),
            y: p,
          });
        });

      setPrecipitation({
        chartData: precipitationChartData,
        lastUpdated: moment(lastUpdatedTime),
        total: totalPrecipitation,
      });
    };

    const fetchForecast = async () => {
      const response = await fetch(
        `https://api.met.no/weatherapi/locationforecast/1.9/.json?lat=${userLocation.lat}&lon=${userLocation.lon}&msl=${userLocation.msl}`
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

  if (!weather || !precipitation) return <section id="weatherCard" className="card" />

  return (
    <section id="weatherCard" className="card" >
      <h6>Vêrvarsel frå Yr, levert av NRK og Meteorologisk institutt - nedbør oppdatert {precipitation.lastUpdated.format('LT')}</h6>
      <img src={'https://api.met.no/weatherapi/weathericon/1.1/?content_type=image%2Fpng&symbol=' + weather.symbol.code} alt={weather.symbol.id} />
      <h1>{weather.temperature}&deg;</h1>
      <h2>{Math.round(weather.cloudiness)}% skydekke</h2>
      <h2>{weather.wind.name} - {Math.round(weather.wind.mps)} m/s frå {directions[weather.wind.direction]}</h2>

      {precipitation.total === 0 && <h2>Opphald til {moment().add(precipitation.chartData[precipitation.chartData.length - 1].x, 'minutes').format('LT')}</h2>}
      {precipitation.total > 0 && <VictoryArea
        data={precipitation.chartData}
        style={{
          data: { fill: "#006edb" },
          labels: { fill: "white" },
          tickLabels: { fill: '#ff0000' },
        }}
        maxDomain={{ y: 3 }}
        interpolation="basis"
        labels={({ datum }) => datum.x % 2 ? datum.x : ""}
        labelComponent={<VictoryLabel renderInPortal y={"95%"} />}
      />}

    </section >
  );
};

export default WeatherCard;

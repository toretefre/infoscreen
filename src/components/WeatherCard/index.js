import React, { useState, useEffect, Fragment } from 'react';
import moment from 'moment';
import 'moment-timezone';
import { VictoryArea, VictoryLabel } from 'victory';
import directions from './directions';

export const WeatherCard = props => {
  const { geoLocation } = props;
  const [forecast, setForecast] = useState();
  const [precipitation, setPrecipitation] = useState();

  useEffect(() => {
    const fetchPrecipitation = async () => {
      const response = await fetch(
        `https://api.met.no/weatherapi/nowcast/0.9/.json?lat=${geoLocation.lat}&lon=${geoLocation.lon}`
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
    };

    fetchPrecipitation();
    fetchForecast();
  }, []);

  if (!forecast || !precipitation) return <section id="weatherCard" className="card" />

  return (
    <Fragment>
      <section id="weatherCard" className="card" >
        <h6 className="credits">Vêrvarsel frå Yr, levert av NRK og Meteorologisk institutt</h6>
        <img className="weatherSymbol" src={'https://api.met.no/weatherapi/weathericon/1.1/?content_type=image%2Fpng&symbol=' + forecast.symbol.code} alt={forecast.symbol.id} />
        <h2>{forecast.temperature}&deg;</h2>
        <h3>{Math.round(forecast.cloudiness)}% skydekke</h3>
        <h3>{forecast.wind.name} - {Math.round(forecast.wind.mps)} m/s frå {directions[forecast.wind.direction]}</h3>


      </section >
      <section id="precipitaionCard" className="card">
        {precipitation.total === 0 && <h3>Opphald til {moment().add(precipitation.chartData[precipitation.chartData.length - 1].x, 'minutes').tz('Europe/Oslo').format('LT')}</h3>}
        {precipitation.total > 0 && <VictoryArea
          data={precipitation.chartData}
          style={{
            data: { fill: "#006edb" },
            labels: { fill: "white" },
          }}
          maxDomain={{ y: 3 }}
          interpolation="basis"
          labels={({ datum }) => datum.x % 2 ? (Math.floor(datum.x / 5) * 5) : ""}
          labelComponent={<VictoryLabel renderInPortal y={"95%"} />}
        />}
        <h6>Nedbørsvarsel oppdatert {precipitation.lastUpdated.tz('Europe/Oslo').format('LT')}, levert av Meteorologisk institutt</h6>
      </section>
    </Fragment>
  );
};

export default WeatherCard;

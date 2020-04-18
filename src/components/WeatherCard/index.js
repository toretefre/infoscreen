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
      try {
        const response = await fetch(
          `https://api.met.no/weatherapi/nowcast/0.9/.json?lat=${geoLocation.lat}&lon=${geoLocation.lon}`
        );
        const fetchedPrecipitationData = await response.json();

        const lastUpdatedTime = fetchedPrecipitationData.created;
        const currentPrecipitation = fetchedPrecipitationData.product.time;
        const precipitationChartData = [];
        const startTime = fetchedPrecipitationData.product.time[0].from;
        const endTime = fetchedPrecipitationData.product.time[fetchedPrecipitationData.product.time.length - 1].to;
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
          lastUpdated: lastUpdatedTime,
          startTime: startTime,
          endTime: endTime,
          total: totalPrecipitation,
        });
      }
      catch {
        console.log("Gikk i dass")
        setPrecipitation({
          error: "Nedbørsvarsel er diverre ikkje tilgjengeleg nett no 😢"
        })
      }
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
  }, [geoLocation.lat, geoLocation.lon, geoLocation.msl]);

  if (!forecast || !precipitation) return <section id="weatherCard" className="card" />

  return (
    <Fragment>
      <section id="weatherCard" className="card" >
        <img className="weatherSymbol" src={'https://api.met.no/weatherapi/weathericon/1.1/?content_type=image%2Fpng&symbol=' + forecast.symbol.code} alt={forecast.symbol.id} />
        <h2>{forecast.temperature}&deg;</h2>
        <h3>{Math.round(forecast.cloudiness)}% skydekke</h3>
        <h3>{forecast.wind.name} - {Math.round(forecast.wind.mps)} m/s frå {directions[forecast.wind.direction]}</h3>
      </section >
      <section id="precipitationCard" className="card">
        {precipitation.error && precipitation.error}
        {precipitation.total === 0 && <h3>Opphald til {moment(precipitation.endTime).tz('Europe/Oslo').format('LT')}</h3>}
        {precipitation.total > 0 &&
          <Fragment>
            <VictoryArea
              data={precipitation.chartData}
              style={{
                data: { fill: "#006edb" },
                labels: { fill: "white" },
              }}
              maxDomain={{ y: 3 }}
              interpolation="basis"
              labels={({ datum }) => datum.x % 2 ? (Math.floor(datum.x / 5) * 5) : ""}
              labelComponent={<VictoryLabel renderInPortal y={"95%"} />}
            />
            <h3>Minutt fra {moment(precipitation.startTime).tz('Europe/Oslo').format('LT')}</h3>
          </Fragment>
        }
        <h6>All meteorologisk data fra Meteorologisk institutt - nedbørsvarsel generert {moment(precipitation.lastUpdated).tz('Europe/Oslo').format('LT')}</h6>
      </section>
    </Fragment>
  );
};

export default WeatherCard;

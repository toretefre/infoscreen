import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';

export const TimeCard = props => {
  const { time, geoLocation } = props;
  const [sunData, setSunData] = useState();

  useEffect(() => {
    const fetchSunData = async () => {
      const response = await fetch(`https://api.sunrise-sunset.org/json?lat=${geoLocation.lat}&lng=${geoLocation.lon}&formatted=0`)
      const json = await response.json();
      const results = json.results;

      setSunData({
        sunrise: results.sunrise,
        sunset: results.sunset,
      })
    }

    fetchSunData();
  }, [])

  if (!time) return <section id="timeCard" className="card" />;

  const localTime = time.tz('Europe/Oslo');

  return (
    <section id="timeCard" className="card">
      <h3>Veke {localTime.weeks()}</h3>
      <h3>{localTime.format('dddd Do MMMM')}</h3>
      <h1>{localTime.format('LTS')}</h1>
      <img className="sunSymbol" alt="Soloppgang og solnedgang" src={process.env.PUBLIC_URL + 'sun.png'} />
      <h3>{moment(sunData.sunrise).format('LT')} - {moment(sunData.sunset).format('LT')}</h3>
    </section>
  );
};

export default TimeCard;
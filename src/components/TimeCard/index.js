import React, { useState, useEffect, Fragment } from 'react';
import moment from 'moment';
import 'moment-timezone';
import holidayFile from './holidays.json';

export const TimeCard = props => {
  const { time, geoLocation } = props;
  const [sunData, setSunData] = useState();
  const [holidays, setHolidays] = useState();

  useEffect(() => {
    const fetchSunData = async () => {
      const response = await fetch(`https://api.sunrise-sunset.org/json?lat=${geoLocation.lat}&lng=${geoLocation.lon}&formatted=0`)
      const json = await response.json();
      const results = json.results;

      setSunData({
        sunrise: results.sunrise,
        sunset: results.sunset,
      });
    }

    const findHolidays = () => {
      const now = moment()
      const futureHolidays = holidayFile.filter(holiday => moment(holiday.date, "DD.MM.YYYY").isAfter(now))
      setHolidays(futureHolidays)
    }

    fetchSunData();
    findHolidays();
  }, [])

  if (!time) return <section id="timeCard" className="card" />;

  const localTime = time.tz('Europe/Oslo');

  return (
    <Fragment>
      <section id="timeCard" className="card">
        <h1 className="time">{localTime.format('LTS')}</h1>
      </section>

      <section id="dayCard" className="card">
        <h3>Veke {localTime.weeks()}</h3>
        <h3>{localTime.format('dddd Do MMMM')}</h3>
        {holidays && <h4>Neste heilagdag er {holidays[0].name} {moment(holidays[0].date, "DD.MM.YYYY").format('Do MMMM')}</h4>}
      </section>

      <section id="sunCard" className="card">
        {sunData && <img className="sunSymbol" alt="Soloppgang og solnedgang" src={process.env.PUBLIC_URL + 'sun.png'} />}
        {sunData && <h3>{moment(sunData.sunrise).tz('Europe/Oslo').format('LT')} - {moment(sunData.sunset).tz('Europe/Oslo').format('LT')}</h3>}
        <h6 className="credits">Soldata frå sunrise-sunset.org</h6>
      </section>
    </Fragment>

  );
};

export default TimeCard;
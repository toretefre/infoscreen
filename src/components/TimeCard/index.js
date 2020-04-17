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
      const now = moment()
      const response = await fetch(
        `https://api.met.no/weatherapi/sunrise/2.0/.json?date=${now.format('YYYY-MM-DD')}&lat=${geoLocation.lat}&lon=${geoLocation.lon}&offset=%2B02%3A00`
      )
      const json = await response.json();
      const data = json.location.time[0]

      setSunData({
        sunrise: data.sunrise.time,
        sunset: data.sunset.time,
      })
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
      </section>
    </Fragment>

  );
};

export default TimeCard;
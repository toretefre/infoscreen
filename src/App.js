import React, { useState, useEffect } from 'react';
import './App.css';
import WeatherCard from './components/WeatherCard';
import BicycleCard from './components/BicycleCard';
import TimeCard from './components/TimeCard';
import BusCard from './components/BusCard';
import 'moment/locale/nn';
import moment from 'moment';
import 'moment-timezone';

export const App = () => {
  moment().locale('nn');
  const [time, setTime] = useState();
  const location = 'Europe/Oslo';

  useEffect(() => {
    const fetchTime = async location => {
      const response = await fetch(
        `https://worldtimeapi.org/api/timezone/${location}`
      );
      const json = await response.json();
      setTime(moment.unix(json.unixtime));
    };
    fetchTime(location);

    setInterval(() => {
      setTime(moment(time).add(1, 'second'));
    }, 1000);

    setInterval(() => {
      window.location.reload(true);
    }, 1000 * 60 * 6);
  }, []);

  return (
    <article className="article">
      <WeatherCard />
      <TimeCard time={time} location={location} />
      <BusCard time={time} location={location} />
      <BicycleCard />
    </article>
  );
};

export default App;

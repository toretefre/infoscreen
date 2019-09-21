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
  const [time, setTime] = useState();

  useEffect(() => {
    if (time) {
      setTimeout(() => {
        setTime(time.add(1, 'second'));
      }, 1000);
    }
  }, [time]);

  useEffect(() => {
    moment().locale('nn');

    const fetchTime = async () => {
      let response = await fetch(
        'http://worldtimeapi.org/api/timezone/Europe/Oslo'
      );
      let data = await response.json();
      setTime(moment(data.datetime).tz('Europe/Oslo'));
    };
    fetchTime();

    setInterval(() => {
      window.location.reload(true);
    }, 1000 * 60 * 6);
  }, []);

  return (
    <article className="article">
      <WeatherCard />
      <TimeCard time={time} />
      <BusCard />
      <BicycleCard />
    </article>
  );
};

export default App;

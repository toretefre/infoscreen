import React, { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment-timezone';
import WeatherCard from './../../components/WeatherCard';
import BicycleCard from './../../components/BicycleCard';
import TimeCard from './../../components/TimeCard';
import BusCard from './../../components/BusCard';

export const Home = () => {
    const [time, setTime] = useState();
    const geoLocation = {
        lat: 63.42279,
        lon: 10.396867,
        msl: 10,
        timeZone: 'Europe/Oslo',
    }

    useEffect(() => {
        const fetchTime = async () => {
            const response = await fetch(
                `https://worldtimeapi.org/api/timezone/${geoLocation.timeZone}`
            );
            const json = await response.json();
            setTime(moment.unix(json.unixtime));
        };

        fetchTime(geoLocation);

        setInterval(() => {
            setTime(moment(time).add(1, 'second'));
        }, 1000);

        setInterval(() => {
            window.location.reload(true);
        }, 1000 * 60 * 5);
    }, []);

    return (
        <article className="article" >
            <WeatherCard time={time} geoLocation={geoLocation} />
            <TimeCard time={time} geoLocation={geoLocation} />
            <BusCard time={time} geoLocation={geoLocation} />
            <BicycleCard geoLocation={geoLocation} />
        </article>
    )
}

export default Home;
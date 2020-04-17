import React, { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment-timezone';
import WeatherCard from './../../components/WeatherCard';
import BicycleCard from './../../components/BicycleCard';
import TimeCard from './../../components/TimeCard';
import BusCard from './../../components/BusCard';
import identifiers from '../../identifiers.json'

export const Home = props => {
    const [time, setTime] = useState();

    const user = props.input;
    const correctData = identifiers.find(input => input.identifer === user)
    const geoLocation = {
        lat: correctData.lat,
        lon: correctData.lon,
        msl: correctData.msl,
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
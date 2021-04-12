import React, { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment-timezone';
import { Link } from '@reach/router'
import identifiers from '../../identifiers.json'
import TimeCard from '../../components/TimeCard';
import BusCard from '../../components/BusCard';
import DateCard from '../../components/DateCard';
import MapCard from '../../components/MapCard';
import WeatherModule from '../../components/WeatherModule';

export const Home = props => {
    const [time, setTime] = useState();
    const [geoLocation, setGeoLocation] = useState();

    useEffect(() => {
        if (props.input) {
            const user = props.input;
            const correctData = identifiers.find(input => input.identifier === user)
            if (correctData) {
                setGeoLocation({
                    lat: correctData.lat,
                    lon: correctData.lon,
                    msl: correctData.msl,
                });
            }
        }

        else {
            const options = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            };

            const success = pos => {
                var crd = pos.coords;

                setGeoLocation({
                    lat: crd.latitude,
                    lon: crd.longitude,
                    msl: crd.altitude || 5,
                })
            }

            const error = err => {
                console.warn(`ERROR(${err.code}): ${err.message}`);
            }

            navigator.geolocation.getCurrentPosition(success, error, options);
        }
    }, [props.input])

    useEffect(() => {
        const fetchTime = async () => {
            const response = await fetch(
                `https://worldtimeapi.org/api/timezone/Europe/Oslo`
            );
            const json = await response.json();
            setTime(moment.unix(json.unixtime));
        };

        fetchTime();

        setInterval(() => {
            setTime(moment(time).add(1, 'second'));
        }, 1000);

        setInterval(() => {
            window.location.reload(true);
        }, 1000 * 60 * 5);
    }, []);

    if (!geoLocation) return (
        <article>
            <h1 className="white">Kanskje du vil sjekke data for ein førehandsbestemt stad?</h1>
            <ul>
                {identifiers
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(loc => (
                        <li key={loc.identifier}><Link className="white" to={"/" + loc.identifier}>{loc.name}</Link></li>
                    ))}
            </ul>
        </article>
    )

    return (
        <article className="article" >
            <BusCard time={time} geoLocation={geoLocation} />
            <WeatherModule time={time} geoLocation={geoLocation} />
            <MapCard time={time} geoLocation={geoLocation} />
            <DateCard time={time} />
            <TimeCard time={time} geoLocation={geoLocation} />
        </article>
    )
}

export default Home;
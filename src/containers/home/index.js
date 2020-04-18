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
    const [geoLocation, setGeoLocation] = useState();

    useEffect(() => {
        if (props.input) {
            const user = props.input;
            const correctData = identifiers.find(input => input.identifer === user)
            setGeoLocation({
                lat: correctData.lat,
                lon: correctData.lon,
                msl: correctData.msl,
            });
        }

        else {
            let options = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            };

            const success = pos => {
                var crd = pos.coords;

                console.log('Your current position is:');
                console.log(`Latitude : ${crd.latitude}`);
                console.log(`Longitude: ${crd.longitude}`);
                console.log(`More or less ${crd.accuracy} meters.`);
                console.log(crd.altitude);
                setGeoLocation({
                    lat: crd.latitude,
                    lon: crd.longitude,
                    msl: crd.altitude || 0,
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

    if (!geoLocation) return null;

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
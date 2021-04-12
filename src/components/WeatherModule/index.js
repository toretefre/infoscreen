import React from 'react';
import CurrentWeatherCard from '../CurrentWeatherCard';
import WeatherCard from '../WeatherCard';

export const WeatherModule = props => {
    const { time, geoLocation } = props;
    
    return (
        <>
            <CurrentWeatherCard time={time} geoLocation={geoLocation} />
            <WeatherCard time={time} geoLocation={geoLocation} />
        </>
    )
}

export default WeatherModule;
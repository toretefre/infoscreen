import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import CurrentWeatherCard from '../CurrentWeatherCard';
import WeatherCard from '../WeatherCard';

export const WeatherModule = props => {
    const { time, geoLocation } = props;
    const [weather, setWeather] = useState({
        loading: true,
        error: null,
        lastUpdated: null,
        precipitation: {
            data: null,
            radarCoverage: null,
        },
    });

    useEffect(() => {
        const fetchCurrentWeather = async () => {
            try {
                const response = await fetch(
                    `https://api.met.no/weatherapi/nowcast/2.0/complete?lat=${geoLocation.lat}&lon=${geoLocation.lon}`
                );
                const responseJson = await response.json();
                const fetchedNowcast = responseJson.properties

                const lastUpdatedTime = fetchedNowcast.meta.updated_at;
                const currentData = fetchedNowcast.timeseries;
                const precipitationChartData = [];
                const startTime = fetchedNowcast.timeseries[0].time;
                const endTime = fetchedNowcast.timeseries[fetchedNowcast.timeseries.length - 1].time;
                const radarStatus = fetchedNowcast.meta.radar_coverage;
                const radarCoverage = (radarStatus === "ok") ? true : (radarStatus === "temporarily_unavailable" ? "temporarily_unavailable" : false)
                let totalPrecipitation = 0
                
                currentData
                    .filter(time =>
                        moment(time.time).diff(moment(), 'minutes') >= -5
                    )
                    .forEach(time => {
                        const p = parseFloat(time.data.instant.details.precipitation_rate)
                        totalPrecipitation += p
                        precipitationChartData.push({
                            x: moment(time.time).tz('Europe/Oslo').format('LT'),
                            y: p,
                        });
                    });

                setWeather({
                    loading: false,
                    error: null,
                    lastUpdated: lastUpdatedTime,
                    precipitation: {
                        radarCoverage: radarCoverage,
                        data: {
                            chartData: precipitationChartData,
                            startTime: startTime,
                            endTime: endTime,
                            total: totalPrecipitation,
                        }
                    }
                });
            }
            catch {
                setWeather({
                    error: "Nedbørsvarsel er diverre ikkje tilgjengeleg nett no 😢"
                })
            }
        };
        fetchCurrentWeather();
    }, [geoLocation.lat, geoLocation.lon])
    
    return (
        <>
            <CurrentWeatherCard time={time} geoLocation={geoLocation} weather={weather} />
            <WeatherCard time={time} geoLocation={geoLocation} />
        </>
    )
}

export default WeatherModule;
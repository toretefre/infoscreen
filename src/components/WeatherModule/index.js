import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import CurrentWeatherCard from '../CurrentWeatherCard';
import WeatherCard from '../WeatherCard';

export const WeatherModule = props => {
    const { time, geoLocation } = props;
    const [precipitation, setPrecipitation] = useState({
        loading: true,
        error: null,
        lastUpdated: null,
        precipitation: {
            data: null,
            radarCoverage: null,
        },
    });
    const [weather, setWeather] = useState({
        loading: true,
        error: null,
        lastUpdated: null,
        data: null,
    })

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

                const currentWeatherData = fetchedNowcast.timeseries[0].data
                
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

                setPrecipitation({
                    lastUpdated: lastUpdatedTime,
                    precipitation: {
                        radarCoverage: radarCoverage,
                        data: {
                            chartData: precipitationChartData,
                            startTime: startTime,
                            endTime: endTime,
                            total: totalPrecipitation,
                        }
                    },
                    error: null,
                    loading: false,
                });

                setWeather({
                    lastUpdated: lastUpdatedTime,
                    data: {
                        airTemperature: currentWeatherData.instant.details.air_temperature,
                        humidity: currentWeatherData.instant.details.relative_humidity,
                        symbol: currentWeatherData.next_1_hours.summary.symbol_code,
                        wind: {
                            direction: currentWeatherData.instant.details.wind_from_direction,
                            speed: currentWeatherData.instant.details.wind_speed,
                            gustSpeed: currentWeatherData.instant.details.wind_speed_of_gust,
                        },
                    },
                    error: null,
                    loading: false,
                })
            }
            catch {
                setPrecipitation({
                    error: "Nedbørsvarsel er diverre ikkje tilgjengeleg nett no 😢"
                })
            }
        };
        fetchCurrentWeather();
    }, [geoLocation.lat, geoLocation.lon])
    
    return (
        <>
            <CurrentWeatherCard time={time} geoLocation={geoLocation} weather={precipitation} />
            <WeatherCard time={time} geoLocation={geoLocation} weather={weather} />
        </>
    )
}

export default WeatherModule;
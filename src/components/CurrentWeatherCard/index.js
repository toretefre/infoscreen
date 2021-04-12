import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import { VictoryArea, VictoryChart, VictoryAxis } from 'victory';

export const CurrentWeatherCard = props => {
    const { geoLocation } = props;
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

    if (!weather.precipitation) return <p>Ingen værdata</p>;
    if (weather.loading) return <p>Laster</p>;
    if (weather.error) return <p>Feil</p>;

    const imageSelection = millimeters => {
        if (millimeters === 1) return "🌦️"
        if (millimeters === 2) return "🌧️"
        if (millimeters === 3) return "☔"
        return millimeters
    }

    console.log("weather", weather)

    if (weather.loading) return (
        <section id="precipitationCard" className="card">
            <p>Laster...</p>
        </section>
    )
    if (!weather.precipitation.radarCoverage) return (
        <section id="precipitationCard" className="card">
            <p>Du er utanfor radardekning</p>
        </section>
    )
    if (weather.precipitation.radarCoverage === "temporarily_unavailable") return (
        <section id="precipitationCard" className="card">
            <p>Værradar ute av drift</p>
        </section>
    )

    return (
        <section id="precipitationCard" className="card">
            {weather.precipitation.data.total === 0 && <p className="precipText">Opphald til {moment(weather.precipitation.data.endTime).tz('Europe/Oslo').format('LT')}</p>}
            {weather.precipitation.data.total > 0 &&
                <VictoryChart
                    height={300}
                    style={{
                        labels: { fill: "white" },
                    }}>
                    <VictoryAxis dependentAxis
                        tickCount={3}
                        tickFormat={t => `${t}`}
                        style={{
                            axis: {
                                stroke: 'transparent'
                            },
                            ticks: {
                                stroke: 'transparent'
                            },
                            tickLabels: {
                                fill: "white"
                            }
                        }}
                    />
                    <VictoryAxis
                        tickFormat={t => t.slice(3, 5) % 15 === 0 ? t : null}
                        style={{
                            ticks: {
                                stroke: 'white',
                                size: 2,
                            },
                            tickLabels: {
                                fill: "white",
                                angle: 0,
                            }
                        }}
                    />
                    <VictoryArea
                        height="auto"
                        data={weather.precipitation.data.chartData}
                        domain={{ y: [0, 3] }}
                        style={{
                            data: { fill: "#006edb" },
                            labels: { fill: "white" },

                        }}
                        interpolation="natural"
                    >
                    </VictoryArea>
                </VictoryChart>
            }
            <h6>Meteorologisk data levert av Meteorologisk institutt</h6>
            <h6>Nedbørsvarsel oppdatert {moment(weather.lastUpdated).tz('Europe/Oslo').format('LT')}</h6>
        </section>
    )
}

export default CurrentWeatherCard;
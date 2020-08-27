import React, { useState, useEffect, Fragment } from 'react';
import moment from 'moment';
import 'moment-timezone';
import { VictoryArea, VictoryChart, VictoryLabel, VictoryAxis, VictoryTheme } from 'victory';

export const PrecipitationCard = props => {
    const { geoLocation } = props;
    const [precipitation, setPrecipitation] = useState();

    useEffect(() => {
        const fetchPrecipitation = async () => {
            try {
                const response = await fetch(
                    `https://api.met.no/weatherapi/nowcast/0.9/.json?lat=${geoLocation.lat}&lon=${geoLocation.lon}`
                );
                const fetchedPrecipitationData = await response.json();

                const lastUpdatedTime = fetchedPrecipitationData.created;
                const currentPrecipitation = fetchedPrecipitationData.product.time;
                const precipitationChartData = [];
                const startTime = fetchedPrecipitationData.product.time[0].from;
                const endTime = fetchedPrecipitationData.product.time[fetchedPrecipitationData.product.time.length - 1].to;
                let totalPrecipitation = 0

                currentPrecipitation
                    .filter(time =>
                        moment(time.from).diff(moment(), 'minutes') >= -5
                    )
                    .forEach(time => {
                        const p = parseFloat(time.location.precipitation.value)
                        totalPrecipitation += p
                        precipitationChartData.push({
                            x: moment(time.from).tz('Europe/Oslo').format('LT'),
                            y: p,
                        });
                    });

                setPrecipitation({
                    chartData: precipitationChartData,
                    lastUpdated: lastUpdatedTime,
                    startTime: startTime,
                    endTime: endTime,
                    total: totalPrecipitation,
                });
            }
            catch {
                setPrecipitation({
                    error: "Nedbørsvarsel er diverre ikkje tilgjengeleg nett no 😢"
                })
            }
        };
        fetchPrecipitation();
    }, [geoLocation.lat, geoLocation.lon])

    if (!precipitation) return null;

    if (precipitation.error) return null;

    const imageSelection = millimeters => {
        if (millimeters === 1) return "🌦️"
        if (millimeters === 2) return "🌧️"
        if (millimeters === 3) return "☔"
        return millimeters
    }

    return (
        <section id="precipitationCard" className="card">
            {precipitation.total === 0 && <p className="precipText">Opphald til {moment(precipitation.endTime).tz('Europe/Oslo').format('LT')}</p>}
            {precipitation.total > 0 &&
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
                        data={precipitation.chartData}
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
            <h6>Meteorologisk data levert av Meteorologisk institutt - nedbørsvarsel oppdatert {moment(precipitation.lastUpdated).tz('Europe/Oslo').format('LT')}</h6>
        </section >
    )
}

export default PrecipitationCard;
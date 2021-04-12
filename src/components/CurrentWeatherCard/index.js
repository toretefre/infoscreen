import React from 'react';
import moment from 'moment';
import 'moment-timezone';
import { VictoryArea, VictoryChart, VictoryAxis } from 'victory';

export const CurrentWeatherCard = props => {
    const { weather } = props;

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
    );

    if (weather.error) return (
        <section id="precipitationCard" className="card">
            <p>Feil</p>
        </section>
    );

    if (!weather.precipitation) return (
        <section id="precipitationCard" className="card">
            <p>Værradar ute av drift</p>
        </section>
    );


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
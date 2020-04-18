import React, { useState, useEffect, Fragment } from 'react';
import moment from 'moment';
import 'moment-timezone';
import { VictoryArea, VictoryLabel } from 'victory';

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
                        moment(time.from).diff(moment(), 'minutes') >= 0
                    )
                    .forEach(time => {
                        const p = parseFloat(time.location.precipitation.value)
                        totalPrecipitation += p
                        precipitationChartData.push({
                            x: moment(time.from).diff(moment(), 'minutes'),
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
                console.log("Gikk i dass")
                setPrecipitation({
                    error: "Nedbørsvarsel er diverre ikkje tilgjengeleg nett no 😢"
                })
            }
        };
        fetchPrecipitation();
    }, [geoLocation.lat, geoLocation.lon])

    if (!precipitation) return <section id="precipitationCard" className="card" />

    if (precipitation.error) return <section id="precipitationCard" className="card"><h3>{precipitation.error}</h3></section>

    return (
        <section id="precipitationCard" className="card">
            {precipitation.total === 0 && <h3>Opphald til {moment(precipitation.endTime).tz('Europe/Oslo').format('LT')}</h3>}
            {precipitation.total > 0 &&
                <Fragment>
                    <VictoryArea
                        data={precipitation.chartData}
                        style={{
                            data: { fill: "#006edb" },
                            labels: { fill: "white" },
                        }}
                        maxDomain={{ y: 3 }}
                        interpolation="basis"
                        labels={({ datum }) => datum.x % 2 ? (Math.floor(datum.x / 5) * 5) : ""}
                        labelComponent={<VictoryLabel renderInPortal y={"95%"} />}
                    />
                    <h3>Nedbør i minutt frå {moment(precipitation.startTime).tz('Europe/Oslo').format('LT')}</h3>
                </Fragment>
            }
            <h6>All meteorologisk data frå Meteorologisk institutt - nedbørsvarsel generert {moment(precipitation.lastUpdated).tz('Europe/Oslo').format('LT')}</h6>
        </section>
    )
}

export default PrecipitationCard;
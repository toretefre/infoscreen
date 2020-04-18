import React, { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment-timezone';

export const SunCard = props => {
    const { geoLocation } = props;
    const [sunData, setSunData] = useState();

    useEffect(() => {
        const fetchSunData = async () => {
            const now = moment()
            const response = await fetch(
                `https://api.met.no/weatherapi/sunrise/2.0/.json?date=${now.format('YYYY-MM-DD')}&lat=${geoLocation.lat}&lon=${geoLocation.lon}&offset=%2B02%3A00`
            )
            const json = await response.json();
            const data = json.location.time[0]

            setSunData({
                sunrise: data.sunrise.time,
                sunset: data.sunset.time,
            })
        }

        fetchSunData();
    }, [geoLocation.lat, geoLocation.lon])

    return (
        <section id="sunCard" className="card">
            {sunData && <img className="sunSymbol" alt="Soloppgang og solnedgang" src={process.env.PUBLIC_URL + 'sun.png'} />}
            {sunData && <h3>{moment(sunData.sunrise).tz('Europe/Oslo').format('LT')} - {moment(sunData.sunset).tz('Europe/Oslo').format('LT')}</h3>}
        </section>
    )
}

export default SunCard;
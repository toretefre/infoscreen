import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import holidayFile from './holidays.json';

export const DateCard = props => {
    const { time } = props;
    const [holidays, setHolidays] = useState();

    useEffect(() => {
        const findHolidays = () => {
            const now = moment()
            const futureHolidays = holidayFile.filter(holiday => moment(holiday.date, "DD.MM.YYYY").isAfter(now))
            setHolidays(futureHolidays)
        }

        findHolidays();
    }, [])

    if (!time) return <section id="dateCard" className="card" />

    const localTime = time.tz('Europe/Oslo')

    return (
        <section id="dateCard" className="card">
            <h3>Veke {localTime.weeks()}</h3>
            <h3>{localTime.format('dddd Do MMMM')}</h3>
            {holidays && <h4>Neste heilagdag er {holidays[0].name} {moment(holidays[0].date, "DD.MM.YYYY").format('Do MMMM')}</h4>}
        </section>
    )
}

export default DateCard;
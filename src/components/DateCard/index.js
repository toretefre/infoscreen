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

            if (futureHolidays[0].name === "1. juledag") {
                setHolidays(<h4>Det er {moment("24.12.2020-17:00", "DD.MM.YYYY-hh:mm").diff(now, 'days')} dagar til jul! 🎄</h4>)
            }
            else {
                setHolidays(<h4>Neste heilagdag er {futureHolidays[0].name} {moment(futureHolidays[0].date, "DD.MM.YYYY").format('Do MMMM')}</h4>)
            }
        }
        findHolidays();
    }, [])

    if (!time) return null;

    const localTime = time.tz('Europe/Oslo')

    return (
        <section id="dateCard" className="card">
            <h3>Veke {localTime.weeks()}</h3>
            <h3>{localTime.format('dddd Do MMMM')}</h3>
            {holidays}
        </section>
    )
}

export default DateCard;
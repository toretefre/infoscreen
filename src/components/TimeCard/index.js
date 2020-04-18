import React from 'react';
import 'moment-timezone';

export const TimeCard = props => {
  const { time } = props;

  if (!time) return <section id="timeCard" className="card" />;

  return (
    <section id="timeCard" className="card">
      <h1 className="time">{time.tz('Europe/Oslo').format('LTS')}</h1>
    </section>
  );
};

export default TimeCard;
import React from 'react';
import 'moment-timezone';

export const TimeCard = props => {
  const { time } = props;

  if (!time) return <section id="timeCard" className="card" />;

  return (
    <section id="timeCard" className="card">
      <p className="time">{time.tz('Europe/Oslo').format('LTS')}</p>
    </section>
  );
};

export default TimeCard;
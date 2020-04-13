import React from 'react';
import 'moment-timezone';

export const TimeCard = props => {
  const { time } = props;

  if (!time) return <section id="timeCard" className="card" />;

  const localTime = time.tz('Europe/Oslo');

  return (
    <section id="timeCard" className="card">
      <h3>Veke {localTime.weeks()}</h3>
      <h3>{localTime.format('dddd Do MMMM')}</h3>
      <h1>{localTime.format('LTS')}</h1>
    </section>
  );
};

export default TimeCard;
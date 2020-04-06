import React from 'react';
import 'moment-timezone';

export const TimeCard = props => {
  const { time, location } = props;
  if (!time) return <section className="card" />;

  const localTime = time.tz('Europe/Oslo');

  return (
    <section className="card">
      <h3 className="smalltext">Veke {localTime.weeks()}</h3>
      <h3 className="smalltext">{localTime.format('dddd Do MMMM')}</h3>
      <h1 className="bigtext">{localTime.format('LTS')}</h1>
    </section>
  );
};

export default TimeCard;

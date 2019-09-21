import React from 'react';

export const TimeCard = props => {
  const { time } = props;
  if (!time) return <section className="card" />;

  return (
    <section className="card">
      <h3 className="smalltext">Veke {time.weeks()}</h3>
      <h3 className="smalltext">{time.format('dddd Do MMMM YYYY')}</h3>
      <h1 className="bigtext">{time.format('LTS')}</h1>
    </section>
  );
};

export default TimeCard;

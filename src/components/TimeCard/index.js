import React from 'react';
import moment from 'moment';

export const TimeCard = props => {
  const { time } = props;
  if (!time) return <section className="card" />;

  return (
    <section className="card">
      <h3 className="smalltext">Veke {moment(time).weeks()}</h3>
      <h3 className="smalltext">{moment(time).format('dddd Do MMMM YYYY')}</h3>
      <h1 className="bigtext">{moment(time).format('LTS')}</h1>
    </section>
  );
};

export default TimeCard;

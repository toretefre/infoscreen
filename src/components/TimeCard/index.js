import React from 'react';
import moment from 'moment';

export const TimeCard = props => {
  const { time } = props;
  if (!time) return <section className="card" />;

  return (
    <section className="card">
      <h1 className="watch">{moment(time).format('LTS')}</h1>
      <h3 className="watchDetails">
        {moment(time).format('dddd Do MMMM YYYY')}
      </h3>
      <h3 className="watchDetails">Veke {moment(time).weeks()}</h3>
    </section>
  );
};

export default TimeCard;

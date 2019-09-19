import React from 'react';

export const MannenCard = props => {
  const { time } = props;
  return (
    <section className="card">
      <h1 className="watch">
        {time &&
          time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()}
      </h1>
    </section>
  );
};

export default MannenCard;

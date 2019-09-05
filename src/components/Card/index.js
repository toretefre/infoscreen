import React from 'react';

export const Card = props => {
  const { title } = props;
  return (
    <section className="card">
      <h1>{title}</h1>
    </section>
  );
};

export default Card;

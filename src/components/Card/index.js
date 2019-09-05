import React from 'react';
import styled from 'styled-components/macro';

export const Card = props => {
  const { title } = props;
  return (
    <section>
      <h1>{title}</h1>
    </section>
  );
};

export default Card;

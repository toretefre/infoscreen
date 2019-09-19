import React, { useState, useEffect } from 'react';

export const BusCard = () => {
  const [busData, setBusData] = useState();

  useEffect(() => setBusData('nei'), []);

  return (
    <section className="card">
      <section>
        <h2>3 Lohove</h2>
        <h1 className="bigtext">2</h1>
        <p>min</p>
        <p>Deretter 07:41, 07:48 og 07:55</p>
      </section>
      <section>
        <h2>22 Vestlia</h2>
        <h1 className="bigtext">3</h1>
        <p>min</p>
        <p>Deretter 07:41, 07:48 og 07:55</p>
      </section>
    </section>
  );
};

export default BusCard;

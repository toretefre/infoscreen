import React, { useState, useEffect } from 'react';

export const BusCard = () => {
  const [busData, setBusData] = useState();

  useEffect(() => setBusData('nei'), []);

  return (
    <section className="card">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/b/b4/EnTur_logo.png"
        alt="EnTur logo"
        className="icon"
      />
      <section>
        <h2>3 Lohove</h2>
        <h1 className="bigtext">2 min 7 min 07:51</h1>
      </section>
      <section>
        <h2>22 Vestlia</h2>
        <h1 className="bigtext">4 min 07:50 07:59 08:10</h1>
      </section>
    </section>
  );
};

export default BusCard;

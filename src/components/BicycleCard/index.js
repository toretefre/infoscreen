import React, { useState, useEffect } from 'react';

export const BicycleCard = () => {
  const [bikedata, setBikedata] = useState();

  useEffect(() => {
    const fetchBikedata = async () => {
      return 'hei';
    };
    const newBikedata = fetchBikedata();
    setBikedata(newBikedata);
  }, []);

  return (
    <section className="card">
      <h1>Bysyklar</h1>
      <section>
        <h2>Elgeseter</h2>
        <h4>14 syklar</h4>
        <h4>3 ledige</h4>
      </section>
      <section>
        <h2>Bunnpris</h2>
        <h4>14 syklar</h4>
        <h4>3 ledige</h4>
      </section>
    </section>
  );
};

export default BicycleCard;

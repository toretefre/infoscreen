import React, { useState, useEffect } from 'react';

export const BicycleCard = () => {
  const [bikedata, setBikedata] = useState();

  useEffect(() => {
    const fetchBikedata = async () => {
      const response = await fetch(
        'https://gbfs.urbansharing.com/trondheimbysykkel.no/station_status.json'
      );
      const json = await response.json();
      console.log(json);

      const vollabakken = json.data.stations.find(
        station => station.station_id === '41'
      );
      const samfundet = json.data.stations.find(
        station => station.station_id === '45'
      );
      const newbikedata = { vollabakken, samfundet };
      setBikedata(newbikedata);
      console.log(newbikedata);
    };
    fetchBikedata();
  }, []);

  return (
    <section className="card">
      <h1>Bysyklar</h1>
      <section>
        <h2>Vollabakken</h2>
        <h4>{bikedata && bikedata.vollabakken.num_bikes_available} syklar</h4>
        <h4>{bikedata && bikedata.vollabakken.num_docks_available} ledige</h4>
      </section>
      <section>
        <h2>Samfundet (7-11)</h2>
        <h4>{bikedata && bikedata.samfundet.num_bikes_available} syklar</h4>
        <h4>{bikedata && bikedata.samfundet.num_docks_available} ledige</h4>
      </section>
    </section>
  );
};

export default BicycleCard;

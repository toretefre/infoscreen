import React, { useState, useEffect } from 'react';

export const BicycleCard = () => {
  const [bikedata, setBikedata] = useState();

  useEffect(() => {
    const fetchBikedata = async () => {
      const response = await fetch(
        'https://gbfs.urbansharing.com/trondheimbysykkel.no/station_status.json'
      );
      const json = await response.json();

      const vollabakken = json.data.stations.find(
        station => station.station_id === '41'
      );
      const samfundet = json.data.stations.find(
        station => station.station_id === '45'
      );
      const newbikedata = { vollabakken, samfundet };
      setBikedata(newbikedata);
    };

    // fetch citybike data every 5 minutes
    setInterval(fetchBikedata(), 1000 * 60 * 10);
  }, []);

  if (!bikedata)
    return (
      <section className="card">
        <p>
          Trøbbel med henting av bysykkeldata, været er sikkert dritt uansett :)
        </p>
      </section>
    );

  return (
    <section className="card">
      <img
        className="icon"
        src="https://image.flaticon.com/icons/svg/2050/2050121.svg"
        alt="syklar"
      />
      <section>
        <h2 className="smalltext">Vollabakken</h2>
        <h4 className="bigtext">
          {bikedata.vollabakken.num_bikes_available}{' '}
          {bikedata.samfundet.num_bikes_available === 1
            ? 'bysykkel'
            : 'bysyklar'}
        </h4>
      </section>
      <section>
        <h2 className="smalltext">Elgeseter gate</h2>
        <h4 className="bigtext">
          {bikedata.samfundet.num_bikes_available}{' '}
          {bikedata.samfundet.num_bikes_available === 1
            ? 'bysykkel'
            : 'bysyklar'}
        </h4>
      </section>
    </section>
  );
};

export default BicycleCard;

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
      <section id="bicycleCard" className="card">
        <p>
          Trøbbel med henting av bysykkeldata, været er sikkert dritt uansett :)
        </p>
      </section>
    );

  return (
    <section id="bicycleCard" className="card">
      <img
        className="icon"
        src={process.env.PUBLIC_URL + '/trondheimbysykkel.png'}
        alt="Trondheim bysykkel logo"
      />
      <section>
        <h2 className="smalltext">Vollabakken</h2>
        <h4 className="bigtext">
          {bikedata.vollabakken.num_bikes_available}{' '}
          {bikedata.vollabakken.num_bikes_available === 1 ? 'sykkel' : 'syklar'}
        </h4>
      </section>
      <section>
        <h2 className="smalltext">Elgeseter gate</h2>
        <h4 className="bigtext">
          {bikedata.samfundet.num_bikes_available}{' '}
          {bikedata.samfundet.num_bikes_available === 1 ? 'sykkel' : 'syklar'}
        </h4>
      </section>
    </section>
  );
};

export default BicycleCard;

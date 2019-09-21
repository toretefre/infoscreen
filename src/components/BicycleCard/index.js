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
        src="https://scontent-arn2-1.xx.fbcdn.net/v/t1.0-9/27073156_2014944812096761_593220392364489488_n.png?_nc_cat=104&_nc_oc=AQkWOr1xAqZOTr0sEhNVyKIQfZq7i-xjHT6QHZdMtlp7cO-pb5h8l02CJ0qXh6D4ztE&_nc_ht=scontent-arn2-1.xx&oh=803870b3ae4e453a3a9cc080e8559fd0&oe=5DF1C7CB"
        alt="Trondheim bysykkel logo"
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

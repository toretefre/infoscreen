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

  if (!bikedata) return <section id="bicycleCard" className="card" />

  return (
    <section id="bicycleCard" className="card">
      <table>
        <tbody>
          <tr>
            <th>Vollabakken</th>
            <td>
              {bikedata.vollabakken.num_bikes_available}{' '}
              {bikedata.vollabakken.num_bikes_available === 1 ? 'sykkel' : 'syklar'}
            </td>
          </tr>
          <tr>
            <th>Elgeseter gate</th>
            <td>
              {bikedata.samfundet.num_bikes_available}{' '}
              {bikedata.samfundet.num_bikes_available === 1 ? 'sykkel' : 'syklar'}
            </td>
          </tr>
        </tbody>
      </table>
      <h6>Data frå UIP</h6>
    </section>
  );
};

export default BicycleCard;

import React, { useState, useEffect } from 'react';
import { getDistanceFromLatLonInKm } from './../../utils/distance'

export const ScooterCard = props => {
  const { geoLocation } = props;
  const [scooterData, setScooterData] = useState();

  useEffect(() => {
    const fetchScooters = async () => {
      const response = await fetch(
        `https://api.entur.io/mobility/v1/scooters?lat=${geoLocation.lat}&lon=${geoLocation.lon}&max=3`,
        {
          headers: {
            'ET-Client-Name': 'toretefre - infoscreen'
          }
        },
      )
      const data = await response.json();
      setScooterData(data)
    }

    fetchScooters();
  }, [geoLocation.lat, geoLocation.lon]);

  if (!scooterData) return <section id="scooter" className="card" />

  return (
    <section id="scooterCard" className="card">
      <table>
        <tbody>
          {scooterData.slice(0, 3).map(scooter =>
            (<tr key={scooter.id}>
              <th>
                {scooter.operator.charAt(0).toUpperCase() + scooter.operator.slice(1)}
              </th>
              {scooter.code === "-" ? <td /> : <td>{scooter.code}</td>}
              <td>
                {scooter.battery}%
              </td>
              <td>
                {(getDistanceFromLatLonInKm(geoLocation.lat, geoLocation.lon, scooter.lat, scooter.lon)).toFixed(0)} meter unna
              </td>
            </tr>)
          )}
        </tbody>
      </table>
    </section>
  );
}

export default ScooterCard;
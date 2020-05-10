import React, { useState, useEffect } from 'react';
import { getDistanceFromLatLonInKm } from './../../utils/distance'

export const ScooterCard = props => {
  const { geoLocation } = props;
  const [scooterData, setScooterData] = useState();

  useEffect(() => {
    const fetchScooters = async () => {
      const response = await fetch(
        `https://api.entur.io/mobility/v1/scooters?lat=${geoLocation.lat}&lon=${geoLocation.lon}&display=10`,
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
    <section id="scooter" className="card">
      <table>
        <tbody>
          {scooterData.slice(0, 3).map(scooter =>
            (<tr>
              <th>{scooter.operator}</th>
              <td>
                {scooter.battery}% batteri
              </td>
              <td>
                {(getDistanceFromLatLonInKm(geoLocation.lat, geoLocation.lon, scooter.lat, scooter.lon) * 1000).toFixed(0)} meter unna
              </td>
            </tr>)
          )}
        </tbody>
      </table>
      <h6>Sparkesykkeldata levert av Entur</h6>
    </section>
  );
}

export default ScooterCard;
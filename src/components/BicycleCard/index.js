import React, { useState, useEffect } from 'react';
import 'moment-timezone';
import { getDistanceFromLatLonInKm } from './../../utils/distance'

export const BicycleCard = props => {
  const { geoLocation } = props;
  const [citybikeData, setCitybikeData] = useState();

  useEffect(() => {
    const fetchCitybikeData = async () => {
      const response = await fetch(
        'https://api.entur.io/journey-planner/v2/graphql',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ET-Client-Name': 'toretefre - infoscreen'
          },
          body: JSON.stringify({
            query: `{
                bikeRentalStationsByBbox(minimumLatitude: ${geoLocation.lat -
              0.02}, maximumLatitude: ${geoLocation.lat + 0.02}, minimumLongitude: ${geoLocation.lon -
              0.02}, maximumLongitude: ${geoLocation.lon + 0.02}) {
                  id
                  name
                  bikesAvailable
                  spacesAvailable
                  networks
                  latitude
                  longitude
                  networks
                }
              }`
          })
        }
      );
      const enturJSON = await response.json();
      const data = enturJSON.data.bikeRentalStationsByBbox;

      if (data.length < 1) setCitybikeData({ error: "nobikes" })
      else {
        data.forEach(station => {
          station.distance = getDistanceFromLatLonInKm(geoLocation.lat, geoLocation.lon, station.latitude, station.longitude);
        })
        data.sort((a, b) => a.distance - b.distance);
        setCitybikeData(data);
      }
    }

    fetchCitybikeData()
    setInterval(fetchCitybikeData, 1000 * 60 * 5);
  }, [geoLocation.lat, geoLocation.lon])

  if (!citybikeData) return <section id="bicycleCard" className="card" />

  if (citybikeData.error === "nobikes") return (
    <section id="bicycleCard" className="card">
      Ingen bysyklar i nærleiken, kanskje du ser en traktor?
    </section>
  )

  return (<section id="bicycleCard" className="card">
    <table>
      <tbody>
        {citybikeData.slice(0, 3).map(station => (
          <tr key={station.id}>
            <th>{station.name}</th>
            <td>
              {station.bikesAvailable}{' '}
              {station.bikesAvailable === 1 ? 'sykkel' : 'syklar'}
            </td>
            <td>{station.distance.toFixed(0)} m</td>
          </tr>
        ))}
      </tbody>
    </table>
    <h6>Bysykkeldata levert av Entur</h6>
  </section>)
}

export default BicycleCard;

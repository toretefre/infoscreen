import React, { useState, useEffect } from 'react';
import 'moment-timezone';

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
              0.01}, maximumLatitude: ${geoLocation.lat + 0.01}, minimumLongitude: ${geoLocation.lon -
              0.01}, maximumLongitude: ${geoLocation.lon + 0.01}) {
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
      console.log(data)
      if (data.length < 1) setCitybikeData({ status: "nobikes" })
      setCitybikeData(data);
    }

    fetchCitybikeData()
    setInterval(fetchCitybikeData, 1000 * 60);
  }, [geoLocation.lat, geoLocation.lon])

  if (!citybikeData) return <section id="bicycleCard" className="card" />

  if (citybikeData[0].distance > 10) return (
    <section id="bicycleCard" className="card">
      Du er meir enn 10 kilometer unna næraste bysykkelstativ, kanskje det finst ein traktor i nærleiken?
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
            <td>uvisst km</td>
          </tr>
        ))}
      </tbody>
    </table>
    <h6>Bysykkeldata levert av Entur</h6>
  </section>)
}

export default BicycleCard;

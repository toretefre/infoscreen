import React, { useState, useEffect } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
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


  if ("hey") return (
    <section id="scooterCard" className="card">
      <Map
        center={[geoLocation.lat, geoLocation.lon]}
        zoom={15}
        zoomControl={false}
      >
        <TileLayer
          url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />
        <Marker position={[geoLocation.lat, geoLocation.lon]}>
          <Popup>
            Deg
          </Popup>
        </Marker>
        {scooterData.slice(0, 3).map(scooter =>
          (<Marker
            key={scooter.id}
            position={[scooter.lat, scooter.lon]}
          >
            <Popup>
              Voi
            </Popup>
          </Marker>)
        )}
      </Map>
      <h6>Kartdata levert av OpenStreetMap gjennom Leaflet</h6>
    </section>
  );

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
import React, { useState, useEffect } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import { getDistanceFromLatLonInKm } from '../../utils/distance'

export const MapCard = props => {
  const { geoLocation } = props;
  const [scooterData, setScooterData] = useState();
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

  useEffect(() => {
    const fetchScooters = async () => {
      const response = await fetch(
        `https://api.entur.io/mobility/v1/scooters?lat=${geoLocation.lat}&lon=${geoLocation.lon}&max=100`,
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

  if (!scooterData || !citybikeData) return <section id="scooter" className="card" />

  return (
    <section id="mapCard" className="card">
      <Map
        center={[geoLocation.lat, geoLocation.lon]}
        zoom={16}
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
        {scooterData.map(scooter =>
          (<Marker
            key={scooter.id}
            position={[scooter.lat, scooter.lon]}
          >
            <Popup>
              Voi <br />
              {scooter.code} <br />
              {scooter.battery}% batteri
            </Popup>
          </Marker>)
        )}
        {citybikeData.map(station =>
          (<Marker
            key={station.id}
            position={[station.latitude, station.longitude]}
          >
            <Popup>
              {station.name} bysykkelstativ <br />
              {station.bikesAvailable} tilgjenglige syklar <br />
              {station.spacesAvailable} ledige stativ
            </Popup>
          </Marker>)
        )}
      </Map>
      <h6>Kartdata levert av OpenStreetMap gjennom Leaflet</h6>
    </section>
  );
}

export default MapCard;
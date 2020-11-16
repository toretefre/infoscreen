import React, { useState, useEffect } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { getDistance } from 'geolib';

export const MapCard = props => {
  const { geoLocation } = props;
  const [scooters, setScooters] = useState({
    status: 'fetching',
    data: null,
    error: null,
  });
  const [citybikes, setCitybikes] = useState({
    status: 'fetching',
    data: null,
    error: null,
  });

  useEffect(() => {
    const fetchCitybikes = async () => {
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
      const fetchedData = enturJSON.data.bikeRentalStationsByBbox;

      if (fetchedData.length < 1) setCitybikes({
        ...citybikes,
        status: "complete",
        error: "nodata",
      })
      else {
        fetchedData.forEach(station => {
          station.distance = getDistance(
            { lat: station.latitude, lon: station.longitude },
            { lat: geoLocation.lat, lon: geoLocation.lon }
          )
        })
        fetchedData.sort((a, b) => a.distance - b.distance);
        setCitybikes({
          ...citybikes,
          data: fetchedData,
          status: "complete",
        })
      }
    }

    fetchCitybikes()
  }, [geoLocation.lat, geoLocation.lon])

  useEffect(() => {
    const fetchScooters = async () => {
      const response = await fetch(
        `https://api.entur.io/mobility/v1/scooters?lat=${geoLocation.lat}&lon=${geoLocation.lon}&range=1000&max=50`,
        {
          headers: {
            'ET-Client-Name': 'toretefre - infoscreen'
          }
        },
      )
      const fetchedData = await response.json();
      if (fetchedData.length < 1) setScooters({
        ...scooters,
        status: "complete",
        error: "noscooters"
      })
      else {
        fetchedData.forEach(scooter => {
          scooter.distance = getDistance(
            { lat: geoLocation.lat, lon: geoLocation.lon },
            { lat: scooter.lat, lon: scooter.lon }
          );
        });
        fetchedData.sort((a, b) => a.distance - b.distance);
        setScooters({
          ...scooters,
          data: fetchedData,
          status: "complete",
        })
      }
    }

    fetchScooters();
  }, [geoLocation.lat, geoLocation.lon]);

  if (scooters.status === "fetching" || citybikes.status === "fetching") return <h1>Fetching data...</h1>

  return (
    <section id="mapCard" className="card">
      <Map
        center={[geoLocation.lat, geoLocation.lon]}
        zoom={17}
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
        {!scooters.error && scooters.data.map(scooter =>
          (<Marker
            key={scooter.id}
            position={[scooter.lat, scooter.lon]}
            icon={divIcon({
              className: `scooter-icon ${scooter.operator}-icon`,
              html: ReactDOMServer.renderToString(<p>{scooter.battery}</p>),
              iconSize: null,
              iconAnchor: [13, 0],
            })}
          >
            <Popup>
              {scooter.operator && `${scooter.operator.slice(0, 1).toUpperCase() + scooter.operator.slice(1)} `}<br />
              {scooter.code && `${scooter.code} `}<br />
              {scooter.battery && `${scooter.battery}% batteri`}
            </Popup>
          </Marker>)
        )}
        {!citybikes.error && citybikes.data.map(station =>
          (<Marker
            key={station.id}
            position={[station.latitude, station.longitude]}
            icon={divIcon({
              className: "citybike-icon",
              html: ReactDOMServer.renderToString(<p>{`${station.bikesAvailable}/${station.spacesAvailable + station.bikesAvailable}`}</p>),
              iconSize: null,
              iconAnchor: [18, 20],
              popupAnchor: [0, -20],
            })}
          >
            <Popup>
              {station.name} bysykkelstativ <br />
              {station.bikesAvailable} tilgjengelege syklar <br />
              {station.spacesAvailable} ledige stativ
            </Popup>
          </Marker>)
        )}
      </Map>
      <h6>Kartdata levert av OpenStreetMap gjennom React Leaflet</h6>
    </section >
  );
}

export default MapCard;
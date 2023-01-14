import React from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { divIcon } from "leaflet";
import ReactDOMServer from "react-dom/server";

import moment from "moment";

export const MapCard = ({ geoLocation, scooters, combinedData }) => {
  console.log("received combinedData to map:", combinedData);
  return (
    <section id="mapCard" className="card">
      <Map
        center={[geoLocation.lat, geoLocation.lon]}
        zoom={17}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png" />
        <Marker position={[geoLocation.lat, geoLocation.lon]}>
          <Popup>Deg</Popup>
        </Marker>
        {scooters.data &&
          scooters.data.map((scooter) => (
            <Marker
              key={scooter.distance + scooter.lat + scooter.lon}
              position={[scooter.lat, scooter.lon]}
              icon={divIcon({
                className: `scooter-icon tier-icon`,
                html: ReactDOMServer.renderToString(
                  <p>{scooter.system.name.translation[0].value.slice(0, 3)}</p>
                ),
                iconSize: null,
                iconAnchor: [13, 0],
              })}
            >
              <Popup>
                {scooter.operator &&
                  `${
                    scooter.operator.slice(0, 1).toUpperCase() +
                    scooter.operator.slice(1)
                  }`}
                <br />
                {scooter.currentRangeMeters &&
                  `${scooter.currentRangeMeters / 1000} km `}
                <br />
                {/*scooter.rentalUris?.ios && (
                  <a href={scooter.rentalUris.ios}>Link</a>
                )*/}
              </Popup>
            </Marker>
          ))}
        {combinedData?.data?.length &&
          combinedData.data?.map((vehicleEntry) => {
            const vehicle = vehicleEntry["vmData"];
            const vehicleLocation = vehicle.location;
            return (
              <Marker
                key={vehicle.serviceJourney.id}
                position={[vehicleLocation.latitude, vehicleLocation.longitude]}
                icon={divIcon({
                  className: `scooter-icon vehicle-icon`,
                  html: ReactDOMServer.renderToString(
                    <p>{vehicle.line.lineRef.split("_")[1]}</p>
                  ),
                  iconSize: null,
                  iconAnchor: [13, 0],
                })}
              >
                <Popup>
                  Destinasjon:{" "}
                  {vehicle.line.lineName || "ikke inkludert i data"}
                  <br />
                  Linje {vehicle.line.lineRef.split("_")[1]}
                  <br />
                  Retning: {vehicle.bearing} grader
                  <br />
                  In/out: {vehicle.direction}
                  <br />
                  Hastighet: {vehicle.speed} km/t
                  <br />
                  Forsinkelse: {vehicle.delay} s
                  <br />
                  Sist oppdatert: {moment(vehicle.lastUpdated).format()}
                  <br />
                  SJ: {vehicle.serviceJourney.id}
                  <br />
                  Kjøretøytype: {vehicle.mode}
                  <br />
                  Vehicle ID: {vehicle.vehicleId}
                </Popup>
              </Marker>
            );
          })}
        {/*!citybikes.error &&
          citybikes.data.map((station) => (
            <Marker
              key={station.id}
              position={[station.latitude, station.longitude]}
              icon={divIcon({
                className: "citybike-icon",
                html: ReactDOMServer.renderToString(
                  <p>{`${station.bikesAvailable}/${
                    station.spacesAvailable + station.bikesAvailable
                  }`}</p>
                ),
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
            </Marker>
            ))*/}
      </Map>
      <h6>Kartdata levert av OpenStreetMap gjennom React Leaflet</h6>
    </section>
  );
};

export default MapCard;

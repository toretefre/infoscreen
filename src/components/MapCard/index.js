import React from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { divIcon } from "leaflet";
import ReactDOMServer from "react-dom/server";

import moment from "moment";

export const MapCard = ({ geoLocation, scooters, combinedData, busData }) => {
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
          scooters.data.map((scooter) => {
            const operatorNameForStyles = scooter.system.operator.id.split("Operator:")[1].toLowerCase()
            const readableOperatorName = operatorNameForStyles.slice(0, 1).toUpperCase() + operatorNameForStyles.slice(1).toLowerCase()
            const operatorsWithStyles = ['Tier', 'Ryde', 'voi']
            return (
            <Marker
              key={scooter.distance + scooter.lat + scooter.lon}
              position={[scooter.lat, scooter.lon]}
              icon={divIcon({
                className: `scooter-icon ${operatorNameForStyles}-icon`,
                html: ReactDOMServer.renderToString(
                  <p>{readableOperatorName.slice(0, 1)}</p>
                ),
                iconSize: 16,
                iconAnchor: [10, 0],
              })}
            >
              <Popup>
                {readableOperatorName}
                <br />
                {scooter.isDisabled && "Scooteren er deaktivert" }
                {scooter.isDisabled && <br /> }
                {scooter.currentRangeMeters &&
                  `${Math.floor(scooter.currentRangeMeters / 1000)} km batteri`}
                <br />
                {(scooter.currentRangeMeters && scooter.vehicleType?.maxRangeMeters) && (
                  `${Math.floor((scooter.currentRangeMeters / scooter.vehicleType.maxRangeMeters) * 100)}% av ${Math.floor(scooter.vehicleType.maxRangeMeters / 1000)} km rekkevidde`
                )}
                <br />
                {scooter.rentalUris?.ios && (
                  <a href={scooter.rentalUris.ios}>
                    <button className="scooter-button">Åpne {readableOperatorName}-appen</button>
                  </a>
                )}
              </Popup>
            </Marker>
          )})}
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
                  iconAnchor: [13, 13],
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
        {busData.length && busData.map((quay) => (
          <Marker
            key={quay.id}
            position={[quay.lat, quay.lon]}
            icon={divIcon({
            className: `station-icon`,
            html: ReactDOMServer.renderToString(
              <p className="station-icon-text">Hpl</p>
            ),
            iconSize: null,
            iconAnchor: [13, 13],
            })}>
              <Popup>
                {quay.name} {quay.quayNumber && quay.quayNumber}
                {quay.description && (<br />)}
                {quay.description && quay.description}
                {quay.distance && (<br />)}
                {quay.distance && quay.distance + " meter vekke"}
              </Popup>
          </Marker>
        ))}
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

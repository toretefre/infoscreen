import React from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { divIcon } from "leaflet";
import ReactDOMServer from "react-dom/server";
import moment from "moment";

export const MapCard = ({ geoLocation, scooters, combinedData, busData, vehicles }) => {
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
        {vehicles?.data?.length &&
          vehicles.data.map((vehicleEntry) => {
            const vehicle = vehicleEntry;
            const vehicleLocation = vehicle.location;
            const lineNumber = vehicle.line.lineRef.split(":Line:")[1]
            return (
              <Marker
                key={vehicle.serviceJourney.id}
                position={[vehicleLocation.latitude, vehicleLocation.longitude]}
                icon={divIcon({
                  className: `scooter-icon vehicle-icon`,
                  html: ReactDOMServer.renderToString(
                    <p>{lineNumber.split("_")[1] ? lineNumber.split("_")[1] : (lineNumber.length < 4 ? lineNumber : "?")}</p>
                  ),
                  iconSize: null,
                  iconAnchor: [13, 13],
                })}
              >
                <Popup>
                  Destinasjon:{" "}
                  {vehicle.line.lineName || "ikke inkludert i data"}
                  <br />
                  Linje {lineNumber}
                  <br />
                  Retning: {vehicle.bearing.toFixed(0)} grader
                  <br />
                  In/out: {vehicle.direction}
                  <br />
                  Hastighet: {vehicle.speed} km/t
                  <br />
                  Forsinkelse: {vehicle.delay < 120 ? vehicle.delay + " s" : Math.floor(vehicle.delay / 60) + " min " + (vehicle.delay % 60) + " s"}
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
        {busData.length && busData.map((quay) => {
          let iconPath = undefined;
          console.log(quay.transportMode)
          switch (quay.transportMode) {
            case "bus":
              iconPath = "Bus.svg"
              break;
            case "coach":
              iconPath = "Bus.svg"
              break;
            case "tram":
              iconPath = "Tram.svg"
              break;
            case "rail":
              iconPath = "Train.svg"
              break;
            case "metro":
              iconPath = "Metro.svg"
              break;
            case "water":
              iconPath = "Ferry.svg"
              break;
            case "air":
              iconPath = "Plane.svg"
              break;
            default:
              iconPath = "New.svg"
          }
          return(
          <Marker
            key={quay.id}
            position={[quay.lat, quay.lon]}
            icon={divIcon({
            className: `station-icon`,
            html: ReactDOMServer.renderToString(
              quay.quayNumber 
                ? 
                <p className="station-icon-text">{quay.quayNumber}</p> 
                : 
                <img 
                  className="station-icon" 
                  src={process.env.PUBLIC_URL + "/station_icons/" + iconPath} 
                />
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
        )})}
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

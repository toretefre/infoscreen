import React, { useState, useEffect } from 'react';

// https://stackoverflow.com/a/27943/13248546
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);  // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

const deg2rad = (deg) => {
  return deg * (Math.PI / 180)
}

export const BicycleCard = props => {
  const { geoLocation } = props;
  const [bikedata, setBikedata] = useState();
  const [closestStations, setClosestStations] = useState();

  useEffect(() => {
    const findNearestStation = async () => {
      const response = await fetch(
        'https://gbfs.urbansharing.com/trondheimbysykkel.no/station_information.json'
      )
      const json = await response.json();
      const stations = json.data.stations;

      stations.forEach(station => {
        station.distance = getDistanceFromLatLonInKm(station.lat, station.lon, geoLocation.lat, geoLocation.lon)
      })

      stations.sort((a, b) => a.distance - b.distance)
      setClosestStations(stations)
    }

    findNearestStation();
  }, [geoLocation.lat, geoLocation.lon])

  useEffect(() => {
    if (closestStations) {
      console.log(closestStations)
      const fetchBikedata = async () => {
        const response = await fetch(
          'https://gbfs.urbansharing.com/trondheimbysykkel.no/station_status.json'
        );
        const json = await response.json();

        const closestStation = json.data.stations.find(
          station => station.station_id === closestStations[0].station_id
        );
        const secondClosestStation = json.data.stations.find(
          station => station.station_id === closestStations[1].station_id
        );
        const newbikedata = { closestStation, secondClosestStation };
        setBikedata(newbikedata);
      };

      // fetch citybike data every 5 minutes
      setInterval(fetchBikedata(), 1000 * 60 * 10);
    }
  }, [closestStations]);

  if (!bikedata) return <section id="bicycleCard" className="card" />

  return (
    <section id="bicycleCard" className="card">
      <table>
        <tbody>
          <tr>
            <th>{closestStations[0].name}</th>
            <td>
              {bikedata.closestStation.num_bikes_available}{' '}
              {bikedata.closestStation.num_bikes_available === 1 ? 'sykkel' : 'syklar'}
            </td>
            <td>{closestStations[0].distance.toFixed(2)} km</td>
          </tr>
          <tr>
            <th>{closestStations[1].name}</th>
            <td>
              {bikedata.secondClosestStation.num_bikes_available}{' '}
              {bikedata.secondClosestStation.num_bikes_available === 1 ? 'sykkel' : 'syklar'}
            </td>
            <td>{closestStations[1].distance.toFixed(2)} km</td>
          </tr>
        </tbody>
      </table>
      <h6>Data frå UIP</h6>
    </section>
  );
};

export default BicycleCard;

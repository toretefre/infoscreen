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
  const numberOfStations = 3;

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
      const fetchBikedata = async () => {
        const response = await fetch(
          'https://gbfs.urbansharing.com/trondheimbysykkel.no/station_status.json'
        );
        const json = await response.json();

        json.data.stations.forEach(station => {
          const correctElement = closestStations.find(stationToUpdate => station.station_id === stationToUpdate.station_id)
          correctElement.num_bikes_available = station.num_bikes_available;
          correctElement.num_docks_available = station.num_docks_available;
        })

        setBikedata(closestStations);
      };

      // fetch citybike data every 5 minutes
      setInterval(fetchBikedata(), 1000 * 60 * 10);
    }
  }, [closestStations]);

  if (!bikedata) return <section id="bicycleCard" className="card" />

  if (bikedata[0].distance > 10) return (
    <section id="bicycleCard" className="card">
      Du er meir enn 10 kilometer unna næraste bysykkelstativ, kanskje det finst ein traktor i nærleiken?
    </section>
  )

  return (
    <section id="bicycleCard" className="card">
      <table>
        <tbody>
          {bikedata.slice(0, numberOfStations).map(station => (
            <tr key={station.station_id}>
              <th>{station.name}</th>
              <td>
                {station.num_bikes_available}{' '}
                {station.num_bikes_available === 1 ? 'sykkel' : 'syklar'}
              </td>
              <td>{station.distance.toFixed(1)} km</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h6>Bysykkeldata levert av UIP</h6>
    </section>
  );
};

export default BicycleCard;

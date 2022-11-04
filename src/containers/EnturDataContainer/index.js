import React, { useState, useEffect } from "react";
import "moment-timezone";
import BusCard from "../../components/BusCard";
import MapCard from "../../components/MapCard";
import { getDistance } from "geolib";

export const EnturDataContainer = ({ time, geoLocation }) => {
  const [scooters, setScooters] = useState({
    status: "fetching",
    data: null,
    error: null,
  });
  const [citybikes, setCitybikes] = useState({
    status: "fetching",
    data: null,
    error: null,
  });
  const [vehicles, setVehicles] = useState(null);
  /*
  useEffect(() => {
    const fetchCitybikes = async () => {
      const response = await fetch("https://api.entur.io/mobility/v2/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ET-Client-Name": "toretefre - infoscreen",
        },
        body: JSON.stringify({
          query: `{vehicles(lat:${geoLocation.lat}, lon:${geoLocation.lon}, range: 500, count: 25, formFactors: SCOOTER) {
            lat
            lon
            pricingPlan { description { translation { language value } } }
            system { name { translation { language value } } }
          }}`,
        }),
      });
      const enturJSON = await response.json();
      const fetchedData = enturJSON.data.bikeRentalStationsByBbox;

      if (fetchedData.length < 1)
        setCitybikes({
          ...citybikes,
          status: "complete",
          error: "nodata",
        });
      else {
        fetchedData.forEach((station) => {
          station.distance = getDistance(
            { lat: station.latitude, lon: station.longitude },
            { lat: geoLocation.lat, lon: geoLocation.lon }
          );
        });
        fetchedData.sort((a, b) => a.distance - b.distance);
        setCitybikes({
          ...citybikes,
          data: fetchedData,
          status: "complete",
        });
      }
    };

    fetchCitybikes();
  }, [geoLocation.lat, geoLocation.lon]);
*/

  useEffect(() => {
    const fetchScooters = async () => {
      const response = await fetch("https://api.entur.io/mobility/v2/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ET-Client-Name": "toretefre - infoscreen",
        },
        body: JSON.stringify({
          query: `{vehicles(lat:${geoLocation.lat}, lon:${geoLocation.lon}, range: 500, count: 25, formFactors: SCOOTER) {
            lat
            lon
            rentalUris {
              ios
            }
            currentRangeMeters
            pricingPlan { description { translation { language value } } }
            system { name { translation { language value } } }
          }}`,
        }),
      });
      const enturJSON = await response.json();
      const fetchedData = enturJSON.data.vehicles;
      if (fetchedData.length < 1)
        setScooters({
          ...scooters,
          status: "complete",
          error: "noscooters",
        });
      else {
        console.log("scooters:", fetchedData);
        fetchedData.forEach((scooter) => {
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
        });
      }
    };

    fetchScooters();
  }, [geoLocation.lat, geoLocation.lon]);

  const fetchVehicles = async () => {
    console.log("VM FETCH");
    const response = await fetch(
      "https://api.entur.io/realtime/v1/vehicles/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ET-Client-Name": "toretefre - infoscreen",
        },
        body: JSON.stringify({
          query: `query {
            vehicles(
              codespaceId: "ATB"
            ) {
              line {
                lineRef
                lineName
                publicCode
              }
              lastUpdated
              location {
                latitude
                longitude
              }
              direction
              bearing
              speed
              monitored
              delay
              mode
              vehicleId
              serviceJourney {
                id
              }
            }
          }
          `,
        }),
      }
    );

    const fetchedJSON = await response.json();
    const fetchedData = fetchedJSON.data;
    const fetchedVehicles = fetchedData["vehicles"];

    console.log("received", fetchedVehicles);
    setVehicles({ data: fetchedVehicles, fetching: false });
  };

  useEffect(() => {
    fetchVehicles();
    setInterval(fetchVehicles, 16000);
  }, [geoLocation.lat, geoLocation.lon]);

  return (
    <>
      <BusCard time={time} geoLocation={geoLocation} />
      <MapCard
        time={time}
        geoLocation={geoLocation}
        scooters={scooters}
        vehicles={vehicles}
      />
    </>
  );
};

export default EnturDataContainer;

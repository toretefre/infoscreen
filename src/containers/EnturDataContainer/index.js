import React, { useState, useEffect } from "react";
import "moment-timezone";
import BusCard from "../../components/BusCard";
import MapCard from "../../components/MapCard";
import { getDistance, getCompassDirection } from "geolib";

export const EnturDataContainer = ({ time, geoLocation }) => {
  const [combinedData, setCombinedData] = useState({
    status: "merging",
    data: [],
    error: null,
  });
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
          query: `{vehicles(lat:${geoLocation.lat}, lon:${geoLocation.lon}, range: 500, count: 50, formFactors: SCOOTER) {
            id
            lat
            lon
            isDisabled
            rentalUris {
              ios
            }
            vehicleType {
              maxRangeMeters
            }
            pricingPlan {
              description {
                translation {
                  language
                  value
                }
              }
            }
            currentRangeMeters
            pricingPlan { description { translation { language value } } }
            system { operator { id } } 
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
              boundingBox: {
                minLat: ${geoLocation.lat - 0.1}
                minLon: ${geoLocation.lon - 0.1}
                maxLat: ${geoLocation.lat + 0.1}
                maxLon: ${geoLocation.lon + 0.1}
              }
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
    const fetchedVehicles = fetchedData?.vehicles ? fetchedData["vehicles"] : [];

    setVehicles({ data: fetchedVehicles, fetching: false });
  };

  useEffect(() => {
    fetchVehicles();
    setInterval(fetchVehicles, 16000);
  }, [geoLocation.lat, geoLocation.lon]);

  const [busData, setBusData] = useState([]);
  const [nearestVenue, setNearestVenue] = useState();
  const [nearestVenues, setNearestVenues] = useState();
  const [numberOfQuays, setNumberOfQuays] = useState(4);

  useEffect(() => {
    const fetchVenue = async () => {
      const numberOfVenues = 10;
      const response = await fetch(
        `https://api.entur.io/geocoder/v1/reverse?point.lat=${geoLocation.lat}&point.lon=${geoLocation.lon}&boundary.circle.radius=1&size=${numberOfVenues}&layers=venue`,
        {
          headers: {
            "Content-Type": "application/json",
            "ET-Client-Name": "toretefre - infoscreen",
          },
        }
      );
      const data = await response.json();
      const newVenues = data.features;
      const nearestVenue = data.features[0];
      if (newVenues) setNearestVenues(newVenues);
      if (nearestVenue) setNearestVenue(nearestVenue.properties.id);
    };

    fetchVenue();
  }, [geoLocation.lat, geoLocation.lon]);

  const fetchBusdata = async (venueToSearchFor) => {
    if (venueToSearchFor) {
      const response = await fetch(
        "https://api.entur.io/journey-planner/v3/graphql",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ET-Client-Name": "toretefre - infoscreen",
          },
          body: JSON.stringify({
            query: `{
              stopPlace(id: "${venueToSearchFor}") {
                id
                name
                transportMode
                estimatedCalls(timeRange: 3600, numberOfDepartures: 100) {
                  realtime
                  aimedArrivalTime
                  aimedDepartureTime
                  expectedArrivalTime
                  expectedDepartureTime
                  date
                  forBoarding
                  forAlighting
                  destinationDisplay {
                    frontText
                  }
                  quay {
                    name
                    id
                    latitude
                    longitude
                    publicCode
                    description
                    lines {
                      name
                      transportMode
                      publicCode
                    }
                  }
                  serviceJourney {
                    id
                    journeyPattern {
                      line {
                        publicCode
                        id
                        name
                        transportMode
                      }
                    }
                  }
                }
              }
            }`,
          }),
        }
      );
      const enturJSON = await response.json();
      const data = enturJSON.data.stopPlace;
      const departures = data.estimatedCalls;
      const quaysWithDepartures = [];

      departures.forEach((departure) => {
        if (
          !quaysWithDepartures.some((quay) => quay.id === departure.quay.id)
        ) {
          quaysWithDepartures.push({
            id: departure.quay.id,
            name: departure.quay.name,
            stopId: venueToSearchFor,
            lat: departure.quay.latitude,
            lon: departure.quay.longitude,
            quayNumber: departure.quay.publicCode,
            description: departure.quay.description,
            lines: departure.quay.lines,
            transportMode: departure.quay.lines.length ? departure.quay.lines[0].transportMode : "unknown",
            distance: getDistance(
              { lat: geoLocation.lat, lon: geoLocation.lon },
              { lat: departure.quay.latitude, lon: departure.quay.longitude }
            ),
            bearing: getCompassDirection(
              { lat: geoLocation.lat, lon: geoLocation.lon },
              { lat: departure.quay.latitude, lon: departure.quay.longitude }
            ),
            departures: [],
          });
        }
        quaysWithDepartures
          .find((quay) => quay.id === departure.quay.id)
          .departures.push({
            realtime: departure.realtime,
            frontText: departure.destinationDisplay.frontText,
            line: departure.serviceJourney.journeyPattern.line.publicCode,
            id: departure.serviceJourney.id,
            aimedDepartureTime: departure.aimedDepartureTime,
            expectedArrivalTime: departure.expectedArrivalTime,
            transportMode:
              departure.serviceJourney.journeyPattern.line.transportMode,
          });
      });

      return quaysWithDepartures;
    }
  };

  useEffect(() => {
    fetchBusdata(nearestVenue);
    setInterval(fetchBusdata, 1000 * 60);
  }, [nearestVenue, numberOfQuays]);

  useEffect(() => {
    const fetchManyDepartures = async () => {
      const newDepartures = [];
      nearestVenues.forEach(async (venue) => {
        const newData = await fetchBusdata(venue.properties.id);
        newData.forEach((quay) => {
          newDepartures.push(quay);
        });
      });
      setBusData(newDepartures);
    };

    if (nearestVenues) {
      fetchManyDepartures();
    }
  }, [nearestVenues]);

  useEffect(() => {
    const flattenedDepartureList = [];
    if (vehicles?.data?.length) {
      vehicles.data.forEach((vehicle) => {
        const objectToAdd = {
          vmData: vehicle,
        };
        busData.forEach((quayWithBuses) => {
          quayWithBuses.departures.forEach((departure) => {
            if (vehicle.serviceJourney.id === departure.id) {
              objectToAdd["jpData"] = departure;
              flattenedDepartureList.push(objectToAdd);
              return;
            }
          });
        });
      });

      console.log("completeFlattenedDepartureList", flattenedDepartureList);
      setCombinedData({
        status: "complete",
        data: flattenedDepartureList,
        error: null,
      });
    }
  }, [busData.length]);

  return (
    <>
      <BusCard
        time={time}
        geoLocation={geoLocation}
        busData={busData}
        setNumberOfQuays={setNumberOfQuays}
        numberOfQuays={numberOfQuays}
        combinedData={combinedData}
      />
      <MapCard
        time={time}
        geoLocation={geoLocation}
        scooters={scooters}
        combinedData={combinedData}
        busData={busData}
        vehicles={vehicles}
      />
    </>
  );
};

export default EnturDataContainer;

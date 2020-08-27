import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';

export const BusCard = props => {
  const { geoLocation } = props;
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
            'Content-Type': 'application/json',
            'ET-Client-Name': 'toretefre - infoscreen'
          }
        },
      )
      const data = await response.json();
      const newVenues = data.features;
      const nearestVenue = data.features[0]
      if (newVenues) setNearestVenues(newVenues);
      if (nearestVenue) setNearestVenue(nearestVenue.properties.id)
    }

    fetchVenue();
  }, [geoLocation.lat, geoLocation.lon]);

  const fetchBusdata = async venueToSearchFor => {
    if (venueToSearchFor) {
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
              stopPlace(id: "${venueToSearchFor}") {
                id
                name
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
            }`
          })
        }
      );
      const enturJSON = await response.json();
      const data = enturJSON.data.stopPlace;
      const departures = data.estimatedCalls;
      const quaysWithDepartures = []

      departures.forEach(departure => {
        if (!quaysWithDepartures.some(quay => quay.id === departure.quay.id)) {
          quaysWithDepartures.push({
            name: departure.quay.name,
            id: departure.quay.id,
            stopId: venueToSearchFor,
            departures: [],
          })
        }
        quaysWithDepartures.find(quay => quay.id === departure.quay.id).departures.push({
          realtime: departure.realtime,
          frontText: departure.destinationDisplay.frontText,
          line: departure.serviceJourney.journeyPattern.line.publicCode,
          id: departure.serviceJourney.id,
          aimedDepartureTime: departure.aimedDepartureTime,
          expectedArrivalTime: departure.expectedArrivalTime,
          transportMode: departure.serviceJourney.journeyPattern.line.transportMode,
        })
      })

      return quaysWithDepartures;
    }
  }

  useEffect(() => {
    fetchBusdata(nearestVenue)
    setInterval(fetchBusdata, 1000 * 60);
  }, [nearestVenue, numberOfQuays])

  useEffect(() => {
    const fetchManyDepartures = async () => {
      const newDepartures = [];
      nearestVenues.forEach(async venue => {
        const newData = await fetchBusdata(venue.properties.id)
        newData.forEach(quay => {
          newDepartures.push(quay)
        })
      })
      console.log("new busData set", newDepartures)
      setBusData(newDepartures);
    }

    console.log("nearestVenues", nearestVenues);
    if (nearestVenues) {
      fetchManyDepartures();
    }
  }, [nearestVenues])

  if (busData.length < 1) return <section id="busCard" className="card" />

  console.log("busdata", busData)

  return (
    <section id="busCard" className="card">
      {busData
        .map(quay =>
          <section key={quay.id}>
            <h1>{quay.name}</h1>
            <section className="buses">
              {busData.find(quay2 => quay2.id === quay.id).departures
                .filter(departure => moment(departure.expectedArrivalTime).diff(moment(), "seconds") >= 0)
                .map(departure =>
                  <div className="busContainer" key={departure.id}>
                    <div className="bus">
                      <h3>{departure.line}</h3>
                      <h5>{departure.frontText.split(" ")[0]}</h5>
                    </div>
                    {!departure.realtime && "ca "}
                    {(moment(departure.expectedArrivalTime).diff(moment(), "seconds") <= 120 && (moment(departure.expectedArrivalTime).diff(moment(), "seconds") + " s"))}
                    {(moment(departure.expectedArrivalTime).diff(moment(), "seconds") > 120 && (moment(departure.expectedArrivalTime).diff(moment(), "minutes") + " min"))}
                  </div>)}
            </section>
          </section>
        )}
      <div>
        <input type="range" min="1" max="10" defaultValue={numberOfQuays} onChange={e => setNumberOfQuays(e.target.value)} />
      </div>
      <h6>Mobilitetsdata for {numberOfQuays} holdeplasser levert i sanntid av Entur</h6>
    </section >
  );
};

export default BusCard;

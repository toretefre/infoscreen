import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';

export const BusCard = props => {
  const { geoLocation } = props;
  const [busData, setBusData] = useState();
  const [nearestVenue, setNearestVenue] = useState();

  useEffect(() => {
    const fetchVenue = async () => {
      const numberOfVenues = 1;
      const response = await fetch(
        `https://api.entur.io/geocoder/v1/reverse?point.lat=${geoLocation.lat}&point.lon=${geoLocation.lon}&boundary.circle.radius=1&size=${numberOfVenues}&layers=venue`
      )
      const data = await response.json();
      const nearestVenue = data.features[0]
      setNearestVenue(nearestVenue.properties.id)
    }

    fetchVenue();
  }, [geoLocation.lat, geoLocation.lon]);

  useEffect(() => {
    const fetchBusdata = async () => {
      console.log("nearestVenue:", nearestVenue)
      if (nearestVenue) {
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
                stopPlace(id: "${nearestVenue}") {
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
              departures: [],
            })
          }
          quaysWithDepartures.find(quay => quay.id === departure.quay.id).departures.push({
            realtime: departure.realtime,
            frontText: departure.destinationDisplay.frontText,
            line: departure.serviceJourney.journeyPattern.line.publicCode,
            id: departure.serviceJourney.id,
            aimedDepartureTime: departure.aimedDepartureTime,
            expectedDepartureTime: departure.expectedDepartureTime,
            transportMode: departure.serviceJourney.journeyPattern.line.transportMode,
          })
        })

        setBusData({
          quays: quaysWithDepartures,
          data: data,
        });
      }
    }

    fetchBusdata()
    setInterval(fetchBusdata, 1000 * 15);
  }, [nearestVenue])

  if (!busData) return <section id="busCard" className="card" />

  return (
    <section id="busCard" className="card">
      {busData.quays.map(quay =>
        <section key={quay.id}>
          <h1>{quay.name}</h1>
          <section className="buses">
            {busData.quays.find(quay2 => quay2.id === quay.id).departures
              .filter(departure => moment(departure.expectedDepartureTime).diff(moment(), "seconds") >= 0)
              .map(departure =>
                <div className="busContainer" key={departure.id}>
                  <div className="bus">
                    <h3>{departure.line}</h3>
                    <h5>{departure.frontText.split(" ")[0]}</h5>
                  </div>
                  {!departure.realtime && "ca "}
                  {(moment(departure.expectedDepartureTime).diff(moment(), "seconds") <= 120 && (moment(departure.expectedDepartureTime).diff(moment(), "seconds") + " s"))}
                  {(moment(departure.expectedDepartureTime).diff(moment(), "seconds") > 120 && (moment(departure.expectedDepartureTime).diff(moment(), "minutes") + " min"))}
                </div>)}
          </section>
        </section>
      )
      }
    </section >
  );
};

export default BusCard;

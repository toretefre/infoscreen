import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';

export const BusCard = props => {
  const { time, location } = props;
  const [busData, setBusData] = useState();

  useEffect(() => {
    const fetchBusdata = async () => {
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
              stopPlace(id: "NSR:StopPlace:42660") {
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

      console.log(data)

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
          frontText: departure.destinationDisplay.frontText,
        })
      })

      console.log(quaysWithDepartures)

      setBusData({
        quays: quaysWithDepartures,
        data: data,
      });
    };

    fetchBusdata();
    setInterval(fetchBusdata, 1000 * 15);
  }, []);

  if (!busData) return <section id="busCard" className="card" />

  return (
    <section id="busCard" className="card">
      <h2>Kollektivtransport - {busData.name}</h2>
      {busData.quays.map(quay =>
        <section key={quay.id}>
          <h1>{quay.name}</h1>
          <section className="buses">
            <div className="busContainer">
              <div className="bus">
                3 Lohove
              </div>
              2 min
            </div>
            <div className="busContainer">
              <div className="bus">
                3 Lohove
              </div>
              4 min
            </div>
            <div className="busContainer">
              <div className="bus">
                3 Lohove
              </div>
              9 min
            </div>
            <div className="busContainer">
              <div className="bus">
                3 Lohove
              </div>
              18:54
            </div>
            <div className="busContainer">
              <div className="bus">
                3 Lohove
              </div>
              18:54
            </div>
            <div className="busContainer">
              <div className="bus">
                3 Lohove
              </div>
              18:54
            </div>
            <div className="busContainer">
              <div className="bus">
                3 Lohove
              </div>
              18:54
            </div>
            <div className="busContainer">
              <div className="bus">
                3 Lohove
              </div>
              18:54
            </div>
            <div className="busContainer">
              <div className="bus">
                3 Lohove
              </div>
              18:54
            </div>
            <div className="busContainer">
              <div className="bus">
                3 Lohove
              </div>
              18:54
            </div>
            <div className="busContainer">
              <div className="bus">
                3 Lohove
              </div>
              18:54
            </div>
          </section>
        </section>
      )
      }
    </section >
  );
};

export default BusCard;

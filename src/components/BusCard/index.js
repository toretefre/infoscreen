import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';

export const BusCard = props => {
  const { time, location } = props;
  const [busData, setBusData] = useState();
  const currentLocalISO = moment(time)
    .tz(location)
    .toISOString();

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
              quay(id: "NSR:Quay:73102") {
                name
                estimatedCalls(startTime: "${currentLocalISO}", timeRange: 3600, numberOfDepartures: 20) {
                  notices {
                    text
                    publicCode
                  }
                  realtime
                  aimedDepartureTime
                  expectedDepartureTime
                  destinationDisplay {
                    frontText
                  }
                  serviceJourney {
                    publicCode
                  }
                }
              }
            }`
          })
        }
      );
      const json = await response.json();
      const estimatedCalls = json.data.quay.estimatedCalls;
      setBusData(estimatedCalls);
      console.log(estimatedCalls);
    };
    fetchBusdata();

    setInterval(() => fetchBusdata(), 1000 * 15);
  }, []);

  return (
    <section className="card">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/b/b4/EnTur_logo.png"
        alt="EnTur logo"
        className="icon"
      />
      {busData &&
        busData
          .filter(departure => departure.serviceJourney.publicCode !== '25')
          .map(departure => (
            <section
              key={
                departure.serviceJourney.publicCode +
                departure.expectedDepartureTime
              }
            >
              <h2>
                {departure.serviceJourney.publicCode +
                  ' - ' +
                  departure.destinationDisplay.frontText +
                  ' - ' +
                  moment(departure.expectedDepartureTime)
                    .tz(location)
                    .format('LTS')}
              </h2>
            </section>
          ))}
    </section>
  );
};

export default BusCard;

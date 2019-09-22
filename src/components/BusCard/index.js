import React, { useState, useEffect } from 'react';

export const BusCard = () => {
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
              quay(id: "NSR:Quay:73102") {
                name
                estimatedCalls(timeRange: 72100, numberOfDepartures: 15) {
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
      console.log(json);
    };

    fetchBusdata();
  }, []);

  return (
    <section className="card">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/b/b4/EnTur_logo.png"
        alt="EnTur logo"
        className="icon"
      />
      <section>
        <h2>3 Lohove</h2>
        <h1 className="bigtext">2 min 7 min 07:51</h1>
      </section>
      <section>
        <h2>22 Vestlia</h2>
        <h1 className="bigtext">4 min 07:50 07:59</h1>
      </section>
    </section>
  );
};

export default BusCard;

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
              quay(id: "NSR:Quay:73102") {
                name
                estimatedCalls(startTime: "${moment(time)
                .subtract(10, 'minutes')
                .tz(location)
                .toISOString()}", timeRange: 3600, numberOfDepartures: 20) {
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
                    journeyPattern {
                      line {
                        publicCode
                      }
                    }
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

    setInterval(fetchBusdata, 1000 * 15);
  }, []);

  return (
    <section className="card">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/b/b4/EnTur_logo.png"
        alt="EnTur logo"
        className="icon"
      />
      <table className="busTable">
        {busData &&
          busData.map(departure => (
            <tr key={
              departure.serviceJourney.publicCode +
              departure.expectedDepartureTime
            }
              className={departure.realtime && "realtime"}>
              <td className="rightText">
                {departure.serviceJourney.journeyPattern.line.publicCode}
              </td>
              <td className="leftText">
                {departure.destinationDisplay.frontText}
              </td>
              <td>
                {moment(departure.expectedDepartureTime).fromNow()}
              </td>
              <td>
                {moment(departure.expectedDepartureTime)
                  .tz(location)
                  .format('LTS')}
              </td>
            </tr>
          ))}
      </table>
    </section>
  );
};

export default BusCard;

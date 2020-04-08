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
      const estimatedCalls = json.data.quay.estimatedCalls.filter(departure =>
        !departure.realtime || (departure.realtime && moment().isBefore(moment(departure.expectedDepartureTime)))
      );
      setBusData(estimatedCalls);
    };
    fetchBusdata();

    setInterval(fetchBusdata, 1000 * 15);
  }, []);

  return (
    <section id="busCard" className="card">
      <img
        src={process.env.PUBLIC_URL + 'entur.png'}
        alt="EnTur logo"
        className="icon"
      />
      <table className="busTable">
        <tbody>
          {busData &&
            busData.map(departure => (
              <tr key={
                departure.serviceJourney.publicCode +
                departure.expectedDepartureTime
              }
                className={departure.realtime ? "realtime" : undefined}>
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
                  {!departure.realtime ?
                    moment(departure.expectedDepartureTime)
                      .tz(location)
                      .format('LT') :
                    moment(departure.expectedDepartureTime)
                      .tz(location)
                      .format('LTS')
                  }
                  {!departure.realtime && " -ish"}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </section>
  );
};

export default BusCard;

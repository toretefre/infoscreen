import React from "react";
import moment from "moment";
import "moment-timezone";

export const BusCard = ({ busData, setNumberOfQuays, numberOfQuays }) => {
  if (busData.length < 1)
    return (
      <section id="busCard" className="card">
        <h1>Ingen kollektivavgangar nære deg den neste timen</h1>
      </section>
    );

  return (
    <section id="busCard" className="card">
      <div id="quayAmountSlider">
        <p>Kollektivavgangar frå dine {numberOfQuays} næraste haldeplassar</p>
        <input
          type="range"
          min="1"
          max="10"
          defaultValue={numberOfQuays}
          onChange={(e) => setNumberOfQuays(e.target.value)}
        />
      </div>
      {busData
        .sort((a, b) => a.distance - b.distance)
        .slice(0, numberOfQuays)
        .map((quay) => (
          <section key={quay.id}>
            {quay.quayNumber && (
              <h1>
                {`${quay.name} ${quay.quayNumber}`} - {quay.distance} meter{" "}
                {quay.bearing}
              </h1>
            )}
            {!quay.quayNumber && (
              <h1>
                {quay.name} - {quay.distance} meter {quay.bearing}
              </h1>
            )}

            {quay.description && <p>{quay.description}</p>}
            <section className="buses">
              {busData
                .find((quay2) => quay2.id === quay.id)
                .departures.filter(
                  (departure) =>
                    moment(departure.expectedArrivalTime).diff(
                      moment(),
                      "seconds"
                    ) >= 0
                )
                .map((departure) => (
                  <div className="busContainer" key={departure.id}>
                    <div className="bus">
                      <h3>{departure.line}</h3>
                      {departure.frontText.split(" ")[1] === "S" && (
                        <h5>
                          {departure.frontText.split(" ")[0]}{" "}
                          {departure.frontText.split(" ")[1]}
                        </h5>
                      )}
                      {departure.frontText.split(" ")[1] !== "S" && (
                        <h5>{departure.frontText.split(" ")[0]}</h5>
                      )}
                    </div>
                    {!departure.realtime && "ca "}
                    {moment(departure.expectedArrivalTime).diff(
                      moment(),
                      "seconds"
                    ) <= 120 &&
                      moment(departure.expectedArrivalTime).diff(
                        moment(),
                        "seconds"
                      ) + " s"}
                    {moment(departure.expectedArrivalTime).diff(
                      moment(),
                      "seconds"
                    ) > 120 &&
                      moment(departure.expectedArrivalTime).diff(
                        moment(),
                        "seconds"
                      ) <
                        60 * 10 &&
                      moment(departure.expectedArrivalTime).diff(
                        moment(),
                        "minutes"
                      ) + " min"}
                    {moment(departure.expectedArrivalTime).diff(
                      moment(),
                      "seconds"
                    ) >=
                      60 * 10 &&
                      moment(departure.expectedArrivalTime).format("LTS")}
                  </div>
                ))}
            </section>
          </section>
        ))}
      <h6>
        Mobilitetsdata for {numberOfQuays} haldeplassar levert i sanntid av
        Entur
      </h6>
    </section>
  );
};

export default BusCard;

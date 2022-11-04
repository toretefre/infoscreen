import React, { useEffect, useState } from "react";
import moment from "moment";
import "moment-timezone";
import { Link } from "@reach/router";
import identifiers from "../../identifiers.json";
import TimeCard from "../../components/TimeCard";
import DateCard from "../../components/DateCard";
import WeatherModule from "../../components/WeatherModule";
import EnturDataContainer from "../EnturDataContainer";

export const Home = (props) => {
  const [time, setTime] = useState();
  const [geoLocation, setGeoLocation] = useState();

  useEffect(() => {
    if (props.input) {
      const user = props.input;
      const correctData = identifiers.find(
        (input) => input.identifier === user
      );
      if (correctData) {
        setGeoLocation({
          lat: correctData.lat,
          lon: correctData.lon,
          msl: correctData.msl,
        });
      }
    } else {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      };

      const success = (pos) => {
        var crd = pos.coords;

        setGeoLocation({
          lat: crd.latitude,
          lon: crd.longitude,
          msl: crd.altitude || 5,
        });
      };

      const error = (err) => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      };

      navigator.geolocation.getCurrentPosition(success, error, options);
    }
  }, [props.input]);

  useEffect(() => {
    setInterval(() => {
      setTime(moment(time).add(1, "second"));
    }, 1000);

    setInterval(() => {
      window.location.reload(true);
    }, 1000 * 60 * 5);
  }, []);

  if (!geoLocation)
    return (
      <article className="identifierContainer">
        <h1 className="white">
          Kanskje du vil sjekke data for ein førehandsbestemt stad?
        </h1>
        <ul className="identifiers">
          {identifiers
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((loc) => (
              <Link className="white" to={"/" + loc.identifier}>
                <li className="identifier" key={loc.identifier}>
                  {loc.name}
                </li>
              </Link>
            ))}
        </ul>
      </article>
    );

  return (
    <article className="article">
      <EnturDataContainer time={time} geoLocation={geoLocation} />
      <WeatherModule time={time} geoLocation={geoLocation} />
      <DateCard time={time} />
      <TimeCard time={time} geoLocation={geoLocation} />
    </article>
  );
};

export default Home;

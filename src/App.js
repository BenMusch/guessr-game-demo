import "./App.css";

import "mapbox-gl/dist/mapbox-gl.css";

import { Map, Marker } from "react-map-gl";
import { useState } from "react";
import _ from "lodash";
import allStations from "./data";

const initialViewState = {
  zoom: 10,
  latitude: 42.35,
  longitude: -71.0593,
};

// calculate distance in meters using https://www.movable-type.co.uk/scripts/latlong.html
function distanceInMeters(a, b) {
  const lng1 = a.longitude;
  const lng2 = b.longitude;
  const lat1 = a.latitude;
  const lat2 = b.latitude;

  const a1 = (lat1 * Math.PI) / 180;
  const a2 = (lat2 * Math.PI) / 180;

  const deltaA1A2 = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lng2 - lng1) * Math.PI) / 180;

  const res =
    Math.sin(deltaA1A2 / 2) ** 2 +
    Math.cos(a1) * Math.cos(a2) * Math.sin(deltaLambda / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(res), Math.sqrt(1 - res));
  return 6371e3 * c;
}

/**
 * Calculate the score of a guess with the maximum score of 5,000
 * Scoring uses a quadratic function to reward being very close. At 15,000 meters
 * away, the score becomes 0
 */
export function getScore(guess, actualLocation) {
  const distance = distanceInMeters(guess, actualLocation);

  return Math.round((5000 / 15000 ** 2) * Math.max(15000 - distance, 0) ** 2);
}

function GameplayMap(props) {
  const [guess, setGuess] = useState(null);
  const [isGuessConfirmed, setIsGuessConfirmed] = useState(false);
  const station = props.station;

  let score;
  if (guess) {
    score = getScore(guess, station);
  }

  return (
    <div>
      <h1>{station.name}</h1>

      <Map
        style={{ width: 800, height: 800 }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        initialViewState={initialViewState}
        maxZoom={14}
        minZoom={8.5}
        onClick={(eventData) => {
          if (!isGuessConfirmed) {
            setGuess({
              longitude: eventData.lngLat.lng,
              latitude: eventData.lngLat.lat,
            });
          }
        }}
      >
        {guess && (
          <Marker longitude={guess.longitude} latitude={guess.latitude} />
        )}
        {isGuessConfirmed && (
          <Marker
            longitude={station.longitude}
            latitude={station.latitude}
            color="red"
          />
        )}
      </Map>

      {isGuessConfirmed && <p>Score: {score}</p>}
      {isGuessConfirmed && (
        <button
          onClick={() => {
            setIsGuessConfirmed(false);
            setGuess(null);
            props.onNext({
              latitude: guess.latitude,
              longitude: guess.longitude,
              score: score,
            });
          }}
        >
          Next round
        </button>
      )}
      {!isGuessConfirmed && (
        <button
          disabled={guess === null}
          onClick={() => {
            setIsGuessConfirmed(true);
          }}
        >
          Confirm
        </button>
      )}
    </div>
  );
}

function Game(props) {
  const stations = props.stations;
  const [guesses, setGuesses] = useState([]);

  const currentRound = guesses.length;
  const currentStation = stations[currentRound];
  let currentScore = 0;
  for (const guess of guesses) {
    currentScore += guess.score;
  }

  return (
    <div>
      <h3>Round {currentRound + 1} of 5</h3>
      <h3>Score: {currentScore}</h3>
      <GameplayMap
        station={currentStation}
        onNext={(guessData) => {
          setGuesses([...guesses, guessData]);
        }}
      />
    </div>
  );
}

function App() {
  const stations = _.sampleSize(allStations, 5);

  return (
    <div>
      <Game stations={stations} />
    </div>
  );
}

export default App;

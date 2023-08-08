import "./App.css";

import 'mapbox-gl/dist/mapbox-gl.css';

import { Map, Marker } from "react-map-gl";
import { useState } from "react";

const initialViewState = {
  zoom: 10,
  latitude: 41.8781,
  longitude: -87.6298,
};

function GameplayMap() {
  const [guess, setGuess] = useState(null);

  return (
    <div>
      <Map
        style={{ width: 800, height: 800 }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        initialViewState={initialViewState}
        maxZoom={12}
        minZoom={8.5}
        onClick={(eventData) => {
          setGuess({
            longitude: eventData.lngLat.lng,
            latitude: eventData.lngLat.lat,
          });
        }}
      >
        {guess && (
          <Marker longitude={guess.longitude} latitude={guess.latitude} />
        )}
      </Map>

      {guess && (
        <p>
          Current guess is at longitude={guess.longitude} latitude=
          {guess.latitude}
        </p>
      )}
    </div>
  );
}

function App() {
  return (
    <div>
      <GameplayMap />
    </div>
  );
}

export default App;

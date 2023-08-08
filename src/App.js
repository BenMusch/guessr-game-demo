import "./App.css";

import { Map } from "react-map-gl";

const initialViewState = {
  zoom: 10,
  latitude: 41.8781,
  longitude: -87.6298,
};

function GameplayMap() {
  return (
    <Map
      style={{ width: 600, height: 400 }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      initialViewState={initialViewState}
      maxZoom={12}
      minZoom={8.5}
    />
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

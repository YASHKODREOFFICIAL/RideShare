import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet";
import { useState } from "react";

function LocationMarker({ setLocation }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setLocation(e.latlng);
    }
  });

  return position === null ? null : <Marker position={position} />;
}

function MapSelector({ setLocation }) {
  return (
    <MapContainer center={[18.5204, 73.8567]} zoom={13} style={{ height: "300px" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker setLocation={setLocation} />
    </MapContainer>
  );
}

export default MapSelector;
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";

function LocationPicker({ setLocation }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setLocation(e.latlng);
    }
  });

  return position ? <Marker position={position} /> : null;
}

function MapPopup({ show, onClose, setLocation }) {
  if (!show) return null;

  return (
    <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content p-3">

          <h5>Select Destination</h5>

          <MapContainer
            center={[18.5204, 73.8567]} // Pune default
            zoom={13}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationPicker setLocation={setLocation} />
          </MapContainer>

          <button className="btn btn-success mt-3" onClick={onClose}>
            Confirm Location
          </button>

        </div>
      </div>
    </div>
  );
}

export default MapPopup;
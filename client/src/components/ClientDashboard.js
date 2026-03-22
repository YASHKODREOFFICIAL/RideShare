// import { useState, useEffect } from "react";
// import MapPopup from "./MapPopup";

// function ClientDashboard() {
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [destination, setDestination] = useState(null);
//   const [showMap, setShowMap] = useState(false);
//   const [rides, setRides] = useState([]);

//   // ✅ Get current location automatically
//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setCurrentLocation({
//           lat: pos.coords.latitude,
//           lng: pos.coords.longitude
//         });
//       },
//       () => {
//         alert("Please allow location access");
//       }
//     );
//   }, []);

//   // ✅ Find rides
//   const findRides = async () => {
//     if (!currentLocation || !destination) {
//       alert("Please select destination");
//       return;
//     }

//     const res = await fetch(
//       `http://localhost:5000/api/rides/searchByLocation?slat=${currentLocation.lat}&slng=${currentLocation.lng}&dlat=${destination.lat}&dlng=${destination.lng}`
//     );

//     const data = await res.json();
//     setRides(data);
//   };

//   return (
//     <div className="container mt-4">
//       <h2 className="text-center">Find Ride 🚗</h2>

//       {/* SOURCE */}
//       <div className="card p-3 mt-3 shadow">
//         <h5>📍 Source (Current Location)</h5>

//         {currentLocation ? (
//           <p className="text-success">
//             Lat: {currentLocation.lat} | Lng: {currentLocation.lng}
//           </p>
//         ) : (
//           <p>Getting location...</p>
//         )}
//       </div>

//       {/* DESTINATION */}
//       <div className="card p-3 mt-3 shadow">
//         <h5>🗺️ Destination</h5>

//         <button
//           className="btn btn-info w-100"
//           onClick={() => setShowMap(true)}
//         >
//           Select Destination on Map
//         </button>

//         {destination && (
//           <p className="text-primary mt-2">
//             Lat: {destination.lat} | Lng: {destination.lng}
//           </p>
//         )}
//       </div>

//       {/* FIND BUTTON */}
//       <button
//         className="btn btn-success w-100 mt-3"
//         onClick={findRides}
//       >
//         Find Ride
//       </button>

//       {/* MAP POPUP */}
//       <MapPopup
//         show={showMap}
//         onClose={() => setShowMap(false)}
//         setLocation={setDestination}
//       />

//       {/* RESULTS */}
//       {rides.map((r, i) => (
//         <div key={i} className="card mt-3 p-3 shadow">
//           <h5>{r.source} → {r.destination}</h5>
//           <p>Vehicle: {r.vehicle}</p>
//           <p>Contact: {r.contact}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default ClientDashboard;


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MapPopup from "./MapPopup";

function ClientDashboard() {

  const navigate = useNavigate();

  // 📍 Source
  const [currentLocation, setCurrentLocation] = useState(null);
  const [useManualSource, setUseManualSource] = useState(false);

  const [sourceText, setSourceText] = useState({
    building: "",
    street: "",
    city: "",
    pin: ""
  });

  // 🗺️ Destination
  const [destinationText, setDestinationText] = useState({
    building: "",
    street: "",
    city: "",
    pin: ""
  });

  const [destination, setDestination] = useState(null);
  const [showMap, setShowMap] = useState(false);

  // 🚘 Vehicle Filter
  const [vehicleType, setVehicleType] = useState("");

  // 🚗 Results
  const [rides, setRides] = useState([]);

  // 📍 Get location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      () => {
        setUseManualSource(true);
      }
    );
  }, []);

  // 🔄 Handle input
  const handleChange = (type, field, value) => {
    if (type === "source") {
      setSourceText({ ...sourceText, [field]: value });
    } else {
      setDestinationText({ ...destinationText, [field]: value });
      setDestination(null);
    }
  };

  // 🚀 FIND RIDES
  const findRides = async () => {

    let sourceData = "";
    let url = "";

    // SOURCE
    if (!useManualSource && currentLocation) {
      sourceData = `${currentLocation.lat},${currentLocation.lng}`;
    } else if (sourceText.city) {
      sourceData = `${sourceText.building}, ${sourceText.street}, ${sourceText.city}, ${sourceText.pin}`;
    } else {
      alert("Enter source OR allow location");
      return;
    }

    // DESTINATION
    if (destinationText.city) {
      const dest = `${destinationText.building}, ${destinationText.street}, ${destinationText.city}, ${destinationText.pin}`;

      url = `http://localhost:5000/api/rides/search?source=${encodeURIComponent(sourceData)}&destination=${encodeURIComponent(dest)}&vehicle=${vehicleType}`;
    }
    else if (destination) {
      url = `http://localhost:5000/api/rides/searchByLocation?slat=${currentLocation?.lat}&slng=${currentLocation?.lng}&dlat=${destination.lat}&dlng=${destination.lng}&vehicle=${vehicleType}`;
    }
    else {
      alert("Enter destination OR select from map");
      return;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();
      setRides(data);
    } catch {
      alert("Error fetching rides");
    }
  };

  return (
    <div className="container mt-4">

      <h2 className="text-center mb-4">🚗 Find Ride</h2>

      {/* 🚘 VEHICLE FILTER */}
      <div className="card p-3 shadow mb-3">
        <h5>Select Vehicle Type</h5>

        <select
          className="form-control"
          onChange={(e) => setVehicleType(e.target.value)}
        >
          <option value="">All Vehicles</option>
          <option value="car">Car 🚗</option>
          <option value="bike">Bike 🏍️</option>
          <option value="auto">Auto 🛺</option>
        </select>
      </div>

      {/* 📍 SOURCE */}
      <div className="card p-3 shadow mb-3">
        <h5>Source</h5>

        {!useManualSource && currentLocation ? (
          <>
            <p className="text-success">
              {currentLocation.lat}, {currentLocation.lng}
            </p>

            <button
              className="btn btn-warning btn-sm"
              onClick={() => setUseManualSource(true)}
            >
              Enter Address
            </button>
          </>
        ) : (
          <>
            <input className="form-control mb-2" placeholder="Building"
              onChange={(e)=>handleChange("source","building",e.target.value)} />

            <input className="form-control mb-2" placeholder="Street"
              onChange={(e)=>handleChange("source","street",e.target.value)} />

            <input className="form-control mb-2" placeholder="City"
              onChange={(e)=>handleChange("source","city",e.target.value)} />

            <input className="form-control mb-2" placeholder="PIN"
              onChange={(e)=>handleChange("source","pin",e.target.value)} />

            <button
              className="btn btn-success btn-sm"
              onClick={() => setUseManualSource(false)}
            >
              Use Current Location
            </button>
          </>
        )}
      </div>

      {/* 🗺️ DESTINATION */}
      <div className="card p-3 shadow mb-3">
        <h5>Destination</h5>

        <input className="form-control mb-2" placeholder="Building"
          onChange={(e)=>handleChange("dest","building",e.target.value)} />

        <input className="form-control mb-2" placeholder="Street"
          onChange={(e)=>handleChange("dest","street",e.target.value)} />

        <input className="form-control mb-2" placeholder="City"
          onChange={(e)=>handleChange("dest","city",e.target.value)} />

        <input className="form-control mb-2" placeholder="PIN"
          onChange={(e)=>handleChange("dest","pin",e.target.value)} />

        <p className="text-center fw-bold">OR</p>

        <button
          className="btn btn-info w-100"
          onClick={() => setShowMap(true)}
        >
          Select from Map 📍
        </button>

        {destination && (
          <p className="text-primary mt-2">
            {destination.lat}, {destination.lng}
          </p>
        )}
      </div>

      {/* 🔍 FIND BUTTON */}
      <button className="btn btn-success w-100" onClick={findRides}>
        Find Ride
      </button>

      {/* 🗺️ MAP */}
      <MapPopup
        show={showMap}
        onClose={() => setShowMap(false)}
        setLocation={setDestination}
      />

      {/* 🚗 RESULTS */}
      {rides.map((r) => (
        <div key={r._id} className="card mt-3 p-3 shadow">
          <h5>{r.source} → {r.destination}</h5>

          <p>
            Vehicle:
            <span className="badge bg-primary ms-2">
              {r.vehicle}
            </span>
          </p>

          <p>Contact: {r.contact}</p>

          <button
            className="btn btn-primary w-100"
            onClick={() => navigate(`/ride/${r._id}`)}
          >
            Book Ride 🚀
          </button>
        </div>
      ))}

    </div>
  );
}

export default ClientDashboard;
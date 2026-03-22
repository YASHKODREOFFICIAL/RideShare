// import { useState } from "react";

// function OwnerDashboard() {
//   const [ride, setRide] = useState({});

//   const createRide = async () => {
//     await fetch("http://localhost:5000/api/rides/create", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(ride)
//     });

//     alert("Ride Created!");
//   };

//   return (
//     <div className="container mt-4">
//       <h2>Owner Dashboard 🚗</h2>

//       <input placeholder="Source" className="form-control mb-2"
//         onChange={(e)=>setRide({...ride,source:e.target.value})} />

//       <input placeholder="Destination" className="form-control mb-2"
//         onChange={(e)=>setRide({...ride,destination:e.target.value})} />

//       <input placeholder="Vehicle" className="form-control mb-2"
//         onChange={(e)=>setRide({...ride,vehicle:e.target.value})} />

//       <input placeholder="Seats" className="form-control mb-2"
//         onChange={(e)=>setRide({...ride,seats:e.target.value})} />

//       <input placeholder="Contact" className="form-control mb-2"
//         onChange={(e)=>setRide({...ride,contact:e.target.value})} />

//       <button className="btn btn-primary w-100" onClick={createRide}>
//         Create Ride
//       </button>
//     </div>
//   );
// }

// export default OwnerDashboard;


import { useState } from "react";
import MapPopup from "./MapPopup";

function OwnerDashboard() {

  const [ride, setRide] = useState({
    source: { building:"", street:"", city:"", pin:"" },
    destination: { building:"", street:"", city:"", pin:"" },
    vehicle: "",
    seats: "",
    contact: "",
    cost: ""   // ✅ NEW
  });

  const [sourceMap, setSourceMap] = useState(null);
  const [destMap, setDestMap] = useState(null);

  const [showSourceMap, setShowSourceMap] = useState(false);
  const [showDestMap, setShowDestMap] = useState(false);

  // 🔄 Handle nested input
  const handleChange = (type, field, value) => {
    setRide({
      ...ride,
      [type]: {
        ...ride[type],
        [field]: value
      }
    });
  };

  // 🚀 Create Ride
  const createRide = async () => {

    // ✅ Validation
    if (!ride.vehicle || !ride.seats || !ride.contact || !ride.cost) {
      alert("Please fill all required fields");
      return;
    }

    // 🔥 Convert address
    const sourceAddress = sourceMap
      ? `${sourceMap.lat},${sourceMap.lng}`
      : `${ride.source.building}, ${ride.source.street}, ${ride.source.city}, ${ride.source.pin}`;

    const destinationAddress = destMap
      ? `${destMap.lat},${destMap.lng}`
      : `${ride.destination.building}, ${ride.destination.street}, ${ride.destination.city}, ${ride.destination.pin}`;

    const payload = {
      source: sourceAddress,
      destination: destinationAddress,
      vehicle: ride.vehicle,
      seats: ride.seats,
      contact: ride.contact,
      cost: ride.cost,

      // ✅ SEND MAP DATA
      sourceLocation: sourceMap || { lat: 0, lng: 0 },
      destinationLocation: destMap || { lat: 0, lng: 0 }
    };

    try {
      const res = await fetch("http://localhost:5000/api/rides/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      alert("Ride Created Successfully 🚗");

      // 🔄 Reset form
      setRide({
        source: { building:"", street:"", city:"", pin:"" },
        destination: { building:"", street:"", city:"", pin:"" },
        vehicle: "",
        seats: "",
        contact: "",
        cost: ""
      });

      setSourceMap(null);
      setDestMap(null);

    } catch (err) {
      console.error(err);
      alert("Error creating ride ❌");
    }
  };

  return (
    <div className="container mt-4">

      <h2 className="text-center mb-4">🚗 Owner Dashboard</h2>

      {/* SOURCE */}
      <div className="card p-3 shadow mb-3">
        <h5>📍 Source</h5>

        <input placeholder="Building"
          className="form-control mb-2"
          onChange={(e)=>handleChange("source","building",e.target.value)} />

        <input placeholder="Street"
          className="form-control mb-2"
          onChange={(e)=>handleChange("source","street",e.target.value)} />

        <input placeholder="City"
          className="form-control mb-2"
          onChange={(e)=>handleChange("source","city",e.target.value)} />

        <input placeholder="PIN"
          className="form-control mb-2"
          onChange={(e)=>handleChange("source","pin",e.target.value)} />

        <p className="text-center fw-bold">OR</p>

        <button className="btn btn-info w-100"
          onClick={()=>setShowSourceMap(true)}>
          Select Source from Map 📍
        </button>

        {sourceMap && (
          <p className="text-primary mt-2">
            {sourceMap.lat}, {sourceMap.lng}
          </p>
        )}
      </div>

      {/* DESTINATION */}
      <div className="card p-3 shadow mb-3">
        <h5>🗺️ Destination</h5>

        <input placeholder="Building"
          className="form-control mb-2"
          onChange={(e)=>handleChange("destination","building",e.target.value)} />

        <input placeholder="Street"
          className="form-control mb-2"
          onChange={(e)=>handleChange("destination","street",e.target.value)} />

        <input placeholder="City"
          className="form-control mb-2"
          onChange={(e)=>handleChange("destination","city",e.target.value)} />

        <input placeholder="PIN"
          className="form-control mb-2"
          onChange={(e)=>handleChange("destination","pin",e.target.value)} />

        <p className="text-center fw-bold">OR</p>

        <button className="btn btn-info w-100"
          onClick={()=>setShowDestMap(true)}>
          Select Destination from Map 🗺️
        </button>

        {destMap && (
          <p className="text-primary mt-2">
            {destMap.lat}, {destMap.lng}
          </p>
        )}
      </div>

      {/* RIDE DETAILS */}
      
      {/* 🚗 Vehicle Dropdown */}
      <select className="form-control mb-2"
        onChange={(e)=>setRide({...ride,vehicle:e.target.value})}>
        <option value="">Select Vehicle</option>
        <option value="car">Car 🚗</option>
        <option value="bike">Bike 🏍️</option>
        <option value="auto">Auto 🛺</option>
      </select>

      <input placeholder="Seats"
        type="number"
        className="form-control mb-2"
        onChange={(e)=>setRide({...ride,seats:e.target.value})} />

      <input placeholder="Contact"
        className="form-control mb-2"
        onChange={(e)=>setRide({...ride,contact:e.target.value})} />

      {/* 💰 Cost */}
      <input placeholder="Cost (₹)"
        type="number"
        className="form-control mb-3"
        onChange={(e)=>setRide({...ride,cost:e.target.value})} />

      <button className="btn btn-primary w-100" onClick={createRide}>
        Create Ride
      </button>

      {/* MAP POPUPS */}
      <MapPopup
        show={showSourceMap}
        onClose={()=>setShowSourceMap(false)}
        setLocation={setSourceMap}
      />

      <MapPopup
        show={showDestMap}
        onClose={()=>setShowDestMap(false)}
        setLocation={setDestMap}
      />

    </div>
  );
}

export default OwnerDashboard;
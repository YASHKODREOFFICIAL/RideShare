// import { useParams, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";

// function Payment() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [method, setMethod] = useState("");
//   const [rideCost, setRideCost] = useState(0);

//   const platformFee = 20;

//   // 🔥 Get logged-in user
//   const user = JSON.parse(localStorage.getItem("user"));

//   // 🚀 Fetch ride details
//   useEffect(() => {
//     const fetchRide = async () => {
//       const res = await fetch(`http://localhost:5000/api/rides/${id}`);
//       const data = await res.json();

//       setRideCost(data.cost); // ✅ get cost from DB
//     };

//     fetchRide();
//   }, [id]);

//   const totalPrice = rideCost + platformFee;

//   // 🚀 Booking
// const handleBooking = async () => {

//   if (!method) {
//     alert("Select payment method");
//     return;
//   }

//   if (!user) {
//     alert("Please login first ❌");
//     navigate("/login");
//     return;
//   }

//   await fetch("http://localhost:5000/api/bookings/create", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       rideId: id,
//       userId: user._id,       // ✅ now safe
//       userName: user.name,
//       paymentMethod: method,
//       rideCost,
//       platformFee,
//       totalPrice
//     })
//   });

//   alert("Ride Booked 🎉");
//   navigate("/client");
// };

//   return (
//     <div className="container mt-4">
//       <h3>💳 Payment</h3>

//       {/* 💰 Price Details */}
//       <div className="card p-3 mb-3 shadow">
//         <p>Ride Cost: ₹{rideCost}</p>
//         <p>Platform Fee: ₹{platformFee}</p>
//         <hr />
//         <h5>Total: ₹{totalPrice}</h5>
//       </div>

//       {/* 💳 Payment Method */}
//       <select
//         className="form-control mb-3"
//         onChange={(e) => setMethod(e.target.value)}
//       >
//         <option value="">Select Payment</option>
//         <option value="online">Online</option>
//         <option value="offline">Cash</option>
//       </select>

//       <button className="btn btn-primary w-100" onClick={handleBooking}>
//         Confirm Booking
//       </button>
//     </div>
//   );
// }

// export default Payment;



import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [method, setMethod] = useState("");
  const [rideCost, setRideCost] = useState(0);

  const platformFee = 20;

  // ✅ SAFE USER PARSE (FULL FIX)
  let user = null;

  try {
    const storedUser = localStorage.getItem("user");

    if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser);
    }
  } catch (err) {
    console.error("Invalid user in localStorage:", err);
    user = null;
  }

  // 🚀 Fetch ride details
  useEffect(() => {
    const fetchRide = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/rides/${id}`);
        const data = await res.json();

        setRideCost(data.cost || 0); // ✅ fallback safe
      } catch (err) {
        console.error("Error fetching ride:", err);
      }
    };

    fetchRide();
  }, [id]);

  const totalPrice = Number(rideCost) + platformFee;

  // 🚀 Booking
  const handleBooking = async () => {

    if (!method) {
      alert("Select payment method");
      return;
    }

    if (!user) {
      alert("Please login first ❌");
      navigate("/");
      return;
    }

    try {
      await fetch("http://localhost:5000/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          rideId: id,
          userId: user._id,
          userName: user.name,
          paymentMethod: method,
          rideCost,
          platformFee,
          totalPrice
        })
      });

      alert("Ride Booked 🎉");
      navigate("/client");

    } catch (err) {
      console.error("Booking Error:", err);
      alert("Booking failed ❌");
    }
  };

  return (
    <div className="container mt-4">
      <h3>💳 Payment</h3>

      {/* 💰 Price Details */}
      <div className="card p-3 mb-3 shadow">
        <p>Ride Cost: ₹{rideCost}</p>
        <p>Platform Fee: ₹{platformFee}</p>
        <hr />
        <h5>Total: ₹{totalPrice}</h5>
      </div>

      {/* 💳 Payment Method */}
      <select
        className="form-control mb-3"
        value={method}
        onChange={(e) => setMethod(e.target.value)}
      >
        <option value="">Select Payment</option>
        <option value="online">Online</option>
        <option value="offline">Cash</option>
      </select>

      <button className="btn btn-primary w-100" onClick={handleBooking}>
        Confirm Booking
      </button>
    </div>
  );
}

export default Payment;
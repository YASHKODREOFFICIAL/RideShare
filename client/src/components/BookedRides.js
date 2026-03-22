import { useEffect, useState } from "react";

function BookedRides() {

  const [bookings, setBookings] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchBookings = async () => {
      const res = await fetch(`http://localhost:5000/api/bookings/user/${user._id}`);
      const data = await res.json();

      setBookings(data);
    };

    fetchBookings();
  }, []);

  return (
    <div className="container mt-4">
      <h3>📦 My Bookings</h3>

      {bookings.map((b) => (
        <div className="card p-3 mb-2 shadow" key={b._id}>
          <p>Ride Cost: ₹{b.rideCost}</p>
          <p>Total Paid: ₹{b.totalPrice}</p>
          <p>Payment: {b.paymentMethod}</p>
        </div>
      ))}
    </div>
  );
}

export default BookedRides;
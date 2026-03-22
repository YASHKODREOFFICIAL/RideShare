import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function RideDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/rides/${id}`)
      .then(res => res.json())
      .then(data => setRide(data));
  }, [id]);

  if (!ride) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h3>Ride Details 🚗</h3>

      <p><b>Source:</b> {ride.source}</p>
      <p><b>Destination:</b> {ride.destination}</p>
      <p><b>Vehicle:</b> {ride.vehicle}</p>
      <p><b>Seats:</b> {ride.seats}</p>
      <p><b>Contact:</b> {ride.contact}</p>

      <button
        className="btn btn-success w-100"
        onClick={() => navigate(`/payment/${ride._id}`)}
      >
        Proceed to Payment 💳
      </button>
    </div>
  );
}

export default RideDetails;
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
      <h4 className="text-white me-4">RideShare 🚗</h4>

      <div className="navbar-nav">
        <Link className="nav-link text-white" to="/client">Book Rides</Link>
        <Link className="nav-link text-white" to="/bookings">Booked Rides</Link>
        <Link className="nav-link text-white" to="/profile">Profile</Link>
      </div>

      <div className="ms-auto text-white">
        {user?.name} 👤
        <button className="btn btn-danger ms-3" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
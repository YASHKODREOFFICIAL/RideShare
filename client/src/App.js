import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import OwnerDashboard from "./components/OwnerDashboard";
import ClientDashboard from "./components/ClientDashboard";
import Navbar from "./components/Navbar";

import RideDetails from "./components/RideDetails";
import Payment from "./components/Payment";

// 🔥 NEW PAGES
import BookedRides from "./components/BookedRides";
import Profile from "./components/Profile";

// ✅ Wrapper to control navbar
function Layout() {
  const location = useLocation();

  const hideNavbarRoutes = ["/", "/register"];

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  const user = localStorage.getItem("user");

  return (
    <>
      {/* ✅ Show navbar only if logged in and not login/register */}
      {user && !shouldHideNavbar && <Navbar />}

      <Routes>

        {/* AUTH */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* DASHBOARDS */}
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/client" element={<ClientDashboard />} />

        {/* RIDES */}
        <Route path="/ride/:id" element={<RideDetails />} />
        <Route path="/payment/:id" element={<Payment />} />

        {/* NEW FEATURES */}
        <Route path="/bookings" element={<BookedRides />} />
        <Route path="/profile" element={<Profile />} />

      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
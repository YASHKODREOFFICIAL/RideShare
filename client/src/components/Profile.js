import { useState } from "react";

function Profile() {

  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(storedUser);

  const updateProfile = async () => {

    await fetch(`http://localhost:5000/api/auth/update/${user._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    });

    localStorage.setItem("user", JSON.stringify(user));

    alert("Profile Updated ✅");
  };

  return (
    <div className="container mt-4">
      <h3>👤 Profile</h3>

      <input
        className="form-control mb-2"
        value={user.name}
        onChange={(e)=>setUser({...user,name:e.target.value})}
      />

      <input
        className="form-control mb-2"
        value={user.email}
        onChange={(e)=>setUser({...user,email:e.target.value})}
      />

      <button className="btn btn-success w-100" onClick={updateProfile}>
        Update Profile
      </button>
    </div>
  );
}

export default Profile;
import { useState } from "react";

function Register() {
  const [data, setData] = useState({});

  const register = async () => {
    await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    alert("Registered Successfully!");
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow">
        <h3 className="text-center">Register</h3>

        <input
          placeholder="Name"
          className="form-control mb-2"
          onChange={(e)=>setData({...data,name:e.target.value})}
        />

        <input
          placeholder="Email"
          className="form-control mb-2"
          onChange={(e)=>setData({...data,email:e.target.value})}
        />

        <input
          type="password"
          placeholder="Password"
          className="form-control mb-2"
          onChange={(e)=>setData({...data,password:e.target.value})}
        />

        <select
          className="form-control mb-2"
          onChange={(e)=>setData({...data,role:e.target.value})}
        >
          <option value="">Select Role</option>
          <option value="owner">Car Owner</option>
          <option value="client">Client</option>
        </select>

        <button className="btn btn-success w-100" onClick={register}>
          Register
        </button>
      </div>
    </div>
  );
}

export default Register;
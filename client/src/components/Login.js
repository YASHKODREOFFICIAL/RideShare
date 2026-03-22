import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [data, setData] = useState({});
  const navigate = useNavigate();

const login = async () => {
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const result = await res.json();

  console.log("Login result:", result); // 🔥 DEBUG

  // ✅ Save token
  localStorage.setItem("token", result.token);

  // ✅ SAVE USER (THIS IS THE MAIN FIX)
  if (result.user) {
    localStorage.setItem("user", JSON.stringify(result.user));
  } else {
    console.error("User not received from backend ❌");
  }

  if (result.role === "owner") {
    navigate("/owner");
  } else {
    navigate("/client");
  }
};
  return (
    <div className="container mt-5">
      <div className="card p-4 shadow">
        <h3 className="text-center">Login</h3>

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

        <button className="btn btn-primary w-100" onClick={login}>
          Login
        </button>

        <p className="mt-3 text-center">
          New user? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
// Login.js

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./Register.css"; // Import the same CSS file used for Register

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:4000/user/login", {
        username,
        password,
      });
      const { accessToken } = response.data;
      localStorage.setItem("accessToken", accessToken);

      console.log(localStorage.getItem("accessToken"));
      console.log(jwtDecode(localStorage.getItem("accessToken")).user.username);

      navigate("/MyGames/1");
    } catch (error) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="container">
        {" "}
        {/* Apply the container class */}
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin} className="form">
          <label className="label">
            Username:
            <input
              className="input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label className="label">
            Password:
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit" className="button">
            Login
          </button>
          <Link to="/Register" className="linkButton">
            Register
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;

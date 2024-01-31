// Register.js

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./Register.css";
const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:4000/user/register", {
        username,
        email,
        password,
      });

      const responselogin = await axios.post(
        "http://localhost:4000/user/login",
        {
          username: response.data.username,
          password: response.data.password,
        }
      );

      const { accessToken } = responselogin.data;
      localStorage.setItem("accessToken", accessToken);

      console.log(localStorage.getItem("accessToken"));
      console.log(jwtDecode(localStorage.getItem("accessToken")).user.username);

      navigate("/MyGames/1");
    } catch (error) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="register-container">
      <div className="container">
        <h2>Register</h2>
        {error && <p className="error">{error}</p>}
        <form className="form" onSubmit={handleSignup} autoComplete="off">
          <label className="label">
            Email:
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
          </label>
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
            Register
          </button>
          <Link to="/Login" className="linkButton">
            Login
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Register;

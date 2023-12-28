// Login.js
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
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
      const { accessToken, ...user } = response.data;

      localStorage.setItem("accessToken", accessToken);
      console.log(localStorage.getItem("accessToken", user));
      navigate("/Login");
    } catch (error) {
      setError("Invalid credentials");
    }
  };
  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSignup} autoComplete="off">
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />
        </label>
        <br />
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Register</button>
        <Link to="/Login">
          <button type="button">Login</button>
        </Link>
      </form>
    </div>
  );
};

export default Register;

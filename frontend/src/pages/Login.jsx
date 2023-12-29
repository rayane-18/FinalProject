import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
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
      // You may want to store additional user information in the localStorage or global state
      // Redirect to the dashboard or any other route upon successful login
    } catch (error) {
      setError("Invalid credentials");
    }
  };
  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
        <Link to="/Register">
          <button type="button">Register</button>
        </Link>
      </form>
    </div>
  );
};

export default Login;

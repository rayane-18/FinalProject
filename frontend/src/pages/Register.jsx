// Login.js
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
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
      console.log(response.data);
      //      localStorage.setItem("accessToken", accessToken);
      //
      //    console.log(localStorage.getItem("accessToken").username);
      //  console.log(localStorage.getItem("accessToken").password);
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
      // You may want to store additional user information in the localStorage or global state
      // Redirect to the dashboard or any other route upon successful login
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

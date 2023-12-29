import { useEffect, useState } from "react";
import "./Frontpage.css";
export const Frontpage = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    // Check the login status whenever the component mounts or the login status changes
    const accessToken = localStorage.getItem("accessToken");
    setLoggedIn(!!accessToken);
  }, []);

  const handleLogout = () => {
    // Perform any additional cleanup or API calls for logout if needed

    // Remove the access token from local storage
    localStorage.removeItem("accessToken");

    // Update the state to reflect that the user is not logged in
    setLoggedIn(false);
  };
  return (
    <div className="topnav">
      <a className="active" href="/home">
        Home
      </a>
      <a href="/Mygames/1">Mygames</a>
      <a href="/Browse/1">Browse</a>
      <a href="/Search">Search</a>
      <a href="/Login">
        {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <button>You are logged out.</button>
        )}
      </a>
    </div>
  );
};

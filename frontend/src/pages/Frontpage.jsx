import "./Frontpage.css";
import { useDispatch } from "react-redux";
import { logout } from "../actions/authActions";
export const Frontpage = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Dispatch the logout action
    dispatch(logout());
  };

  // const [Logout, setLogout] = useState("");
  /* const handleLogout = () => {
    // Perform any additional cleanup or API calls for logout if needed

    // Remove the access token from local storage
    localStorage.removeItem("accessToken");

    // Update the state to reflect that the user is not logged in
    setLoggedIn(false);
  };*/
  localStorage.removeItem("accessToken");
  return (
    <div className="topnav">
      <button onClick={handleLogout}>Logout</button>
      <a className="active" href="/home">
        Home
      </a>
      <a href="/Mygames">Mygames</a>
      <a href="/Login">Login</a>
      <a href="/Browse">Browse</a>
    </div>
  );
};
// <button onClick={handleLogout}>Logout</button>

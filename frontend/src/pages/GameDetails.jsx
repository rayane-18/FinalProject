import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Frontpage } from "./Frontpage";
import LocalGameDB from "../assets/switchtdb.json";

const GameDetails = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    gameid: "",
    rating: "",
    status: "",
    timePlayed: "",
  });
  const { id } = useParams();
  const [gameDetails, setGameDetails] = useState(null);
  const handleRemoveGame = async () => {
    try {
      await axios.delete(
        `http://localhost:4000/removeGame/${
          jwtDecode(localStorage.getItem("accessToken")).user.username
        }/${id}`
      );
    } catch (error) {
      console.error("Error removing game:", error);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the API
        const apiResponse = await axios.get(
          `http://localhost:4000/getsingleGameData/${
            jwtDecode(localStorage.getItem("accessToken")).user.username
          }/${id}`
        );
        // Update gameDetails with API data
        setGameDetails(apiResponse.data);
      } catch (error) {
        console.error("Error fetching game details from API:", error);
      }
    };

    // Fetch local data and API data
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const username = jwtDecode(localStorage.getItem("accessToken")).user
        .username;

      const response = await axios.post(
        `http://localhost:4000/addGame/${username}`,
        {
          gameInfo: {
            gameid: id,
            rating: formData.rating,
            status: formData.status,
            timePlayed: formData.timePlayed,
          },
        }
      );
      navigate(0);
      console.log(response.data);
    } catch (error) {
      // Handle errors, e.g., show an error message
      console.error("Error adding game:", error.message);
    }
  };

  if (!gameDetails) {
    // You might want to add loading state or an error message here
    return (
      <div className="game-card">
        <Frontpage />
        <p>Loading...</p>
      </div>
    );
  }

  // Find the local game data based on the ID
  const localGameData = LocalGameDB.find((game) => game.id === id);

  // Merge the details
  const mergedGameDetails = {
    ...localGameData,
    ...gameDetails,
  };
  console.log(mergedGameDetails.exists);

  return (
    <div className="game-card">
      <Frontpage />
      <img
        src={`/src/assets/switch/${mergedGameDetails.id}.jpg`}
        alt={mergedGameDetails.locale.title}
      />
      <h2>{mergedGameDetails.locale.title}</h2>
      {mergedGameDetails.exists ? (
        <button onClick={() => handleRemoveGame(mergedGameDetails.id)}>
          Remove Game
        </button>
      ) : (
        <div>
          <form onSubmit={handleSubmit}>
            <label>
              Rating:
              <input
                type="text"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
              />
            </label>
            <label>
              Status:
              <input
                type="text"
                name="status"
                value={formData.status}
                onChange={handleChange}
              />
            </label>
            <label>
              Time Played:
              <input
                type="text"
                name="timePlayed"
                value={formData.timePlayed}
                onChange={handleChange}
              />
            </label>
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default GameDetails;

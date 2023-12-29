import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Frontpage } from "./Frontpage";
import LocalGameDB from "../assets/switchtdb.json";

const GameDetails = () => {
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
  console.log(mergedGameDetails);

  return (
    <div className="game-card">
      <Frontpage />
      <img
        src={`/src/assets/switch/${mergedGameDetails.id}.jpg`}
        alt={mergedGameDetails.locale.title}
      />
      <h2>{mergedGameDetails.locale.title}</h2>
      {/* Additional details can be displayed here */}{" "}
      <button onClick={() => handleRemoveGame(mergedGameDetails.id)}>
        Remove Game
      </button>
    </div>
  );
};

export default GameDetails;

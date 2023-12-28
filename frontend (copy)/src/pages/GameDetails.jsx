import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import gameData from "../assets/switchtdb.json";
import { Frontpage } from "./Frontpage";
const GameDetails = () => {
  const { id } = useParams();
  const [gameDetails, setGameDetails] = useState(null);
  const yourgameDetails = gameData.find((gameDetails) => id === gameDetails.id);
  console.log(yourgameDetails);
  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/getGameById/${id}`
        );
        setGameDetails(response.data);
      } catch (error) {
        console.error("Error fetching game details:", error);
      }
    };

    fetchGameDetails();
  }, [id]);
  if (!gameDetails) {
    // You might want to add loading state or an error message here
    return (
      <div key={yourgameDetails.id} className="game-card">
        <Frontpage />
        <img
          src={`/src/assets/switch/${yourgameDetails.id}.jpg`}
          alt={yourgameDetails.locale.title}
        />
      </div>
    );
  }
  return (
    <div key={yourgameDetails.id} className="game-card">
      <Frontpage />
      <img
        src={`/src/assets/switch/${yourgameDetails.id}.jpg`}
        alt={yourgameDetails.locale.title}
      />

      <img
        src={`/src/assets/switch/${gameDetails.id}.jpg`}
        onClick={console.log(`./assets/switch/${gameDetails.id}.jpg`)}
        alt={gameDetails.locale.title}
      />
      <h2>{gameDetails.locale.title}</h2>
    </div>
  );
};

export default GameDetails;
/*<p>Region: {gameDetails.region}</p>
      <p>Languages: {gameDetails.languages}</p>
      <p>Developer: {gameDetails.developer}</p>
      <p>Publisher: {gameDetails.publisher}</p>
      <p>Genre: {gameDetails.genre}</p> */

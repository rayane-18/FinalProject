import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Frontpage } from "./Frontpage";
import LocalGameDB from "../assets/switchtdb.json";
import "./GameDetails.css";
const GameDetails = () => {
  const [selectedFeedback, setSelectedFeedback] = useState("good");
  const handleFeedbackClick = (feedback) => {
    if (selectedFeedback !== feedback) {
      document
        .querySelector(`.feedback li.${selectedFeedback}.active`)
        .classList.remove("active");
      setSelectedFeedback(feedback);
    }
  };
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    gameid: "",
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
      navigate(0);
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
            rating: selectedFeedback,
            status: formData.status,
            timePlayed: formData.timePlayed,
          },
        }
      );
      console.log(response);
      navigate(0);
    } catch (error) {
      // Handle errors, e.g., show an error message
      console.error("Error adding game:", error.message);
    }
  };

  if (!gameDetails) {
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

  return (
    <div className="game-cards">
      <Frontpage />
      <div className="game-details-container">
        <div className="image-container">
          <img
            src={`/src/assets/switch/${mergedGameDetails.id}.jpg`}
            alt={mergedGameDetails.locale.title}
          />
        </div>

        {mergedGameDetails.exists ? (
          <div className="details">
            <h2>{mergedGameDetails.locale.title}</h2>{" "}
            <p className="synopsis">
              synopsis :{" "}
              {mergedGameDetails.synopsis &&
              mergedGameDetails.synopsis.length > 0
                ? mergedGameDetails.synopsis
                : "No synopsis available"}
            </p>
            <p className="synopsis">region : {mergedGameDetails.region}</p>
            <p className="synopsis">
              languages : {mergedGameDetails.languages}
            </p>
            <p className="synopsis">
              publisher : {mergedGameDetails.publisher}
            </p>
            <button onClick={() => handleRemoveGame(mergedGameDetails.id)}>
              Remove Game
            </button>
          </div>
        ) : (
          <div className="form-containers">
            <div>
              <h2>{mergedGameDetails.locale.title}</h2>
              <p className="synopsis">
                synopsis : {mergedGameDetails.locale.synopsis}
              </p>
              <p className="synopsis">region : {mergedGameDetails.region}</p>
              <p className="synopsis">
                languages : {mergedGameDetails.languages}
              </p>
              <p className="synopsis">
                publisher : {mergedGameDetails.publisher}
              </p>{" "}
              <form onSubmit={handleSubmit}>
                <label>
                  Rating:
                  <ul className="feedback">
                    <li
                      className={`angry ${
                        selectedFeedback === "angry" ? "active" : ""
                      }`}
                      onClick={() => handleFeedbackClick("angry")}
                    >
                      <div>
                        <svg className="eye left">
                          <use xlinkHref="#eye" />
                        </svg>
                        <svg className="eye right">
                          <use xlinkHref="#eye" />
                        </svg>
                        <svg className="mouth">
                          <use xlinkHref="#mouth" />
                        </svg>
                      </div>
                    </li>
                    <li
                      className={`sad ${
                        selectedFeedback === "sad" ? "active" : ""
                      }`}
                      onClick={() => handleFeedbackClick("sad")}
                    >
                      <div>
                        <svg className="eye left">
                          <use xlinkHref="#eye" />
                        </svg>
                        <svg className="eye right">
                          <use xlinkHref="#eye" />
                        </svg>
                        <svg className="mouth">
                          <use xlinkHref="#mouth" />
                        </svg>
                      </div>
                    </li>
                    <li
                      className={`ok ${
                        selectedFeedback === "ok" ? "active" : ""
                      }`}
                      onClick={() => handleFeedbackClick("ok")}
                    >
                      <div></div>
                    </li>
                    <li
                      className={`good ${
                        selectedFeedback === "good" ? "active" : ""
                      }`}
                      onClick={() => handleFeedbackClick("good")}
                    >
                      <div>
                        <svg className="eye left">
                          <use xlinkHref="#eye" />
                        </svg>
                        <svg className="eye right">
                          <use xlinkHref="#eye" />
                        </svg>
                        <svg className="mouth">
                          <use xlinkHref="#mouth" />
                        </svg>
                      </div>
                    </li>
                    <li
                      className={`happy ${
                        selectedFeedback === "happy" ? "active" : ""
                      }`}
                      onClick={() => handleFeedbackClick("happy")}
                    >
                      <div>
                        <svg className="eye left">
                          <use xlinkHref="#eye" />
                        </svg>
                        <svg className="eye right">
                          <use xlinkHref="#eye" />
                        </svg>
                      </div>
                    </li>
                  </ul>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ display: "none" }}
                  >
                    <symbol
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 7 4"
                      id="eye"
                    >
                      <path d="M1,1 C1.83333333,2.16666667 2.66666667,2.75 3.5,2.75 C4.33333333,2.75 5.16666667,2.16666667 6,1"></path>
                    </symbol>
                    <symbol
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 18 7"
                      id="mouth"
                    >
                      <path d="M1,5.5 C3.66666667,2.5 6.33333333,1 9,1 C11.6666667,1 14.3333333,2.5 17,5.5"></path>
                    </symbol>
                  </svg>
                </label>
                <label>
                  Status:
                  <select
                    className="selects"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    {" "}
                    <option value="" disabled>
                      Select status
                    </option>
                    <option value="playing">playing</option>
                    <option value="completed">completed</option>
                    <option value="plan to play">plan to play</option>
                    <option value="dropped">dropped</option>
                  </select>
                </label>
                <label>
                  Time Played:
                  <input
                    className="inputs"
                    type="text"
                    name="timePlayed"
                    placeholder="must be in seconds"
                    value={formData.timePlayed}
                    onChange={handleChange}
                  />
                </label>
                <button type="submit">Submit</button>
                {!formData.status && (
                  <p className="error">Please select a status</p>
                )}
              </form>
            </div>
          </div>
        )}
      </div>{" "}
    </div>
  );
};

export default GameDetails;

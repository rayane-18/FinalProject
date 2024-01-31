import { useState, useEffect } from "react";

import axios from "axios"; // Don't forget to import axios
import { Frontpage } from "./Frontpage";
import gameData from "../assets/switchtdb.json";
import { Link, useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Browser.css";
const itemsPerPage = 20;
const Browse = () => {
  const [selectedFeedback, setSelectedFeedback] = useState("good");
  console.log(selectedFeedback);

  const handleFeedbackClick = (feedback) => {
    if (selectedFeedback !== feedback) {
      document
        .querySelector(`.feedback li.${selectedFeedback}.active`)
        .classList.remove("active");
      setSelectedFeedback(feedback);
    }
  };
  const navigate = useNavigate();
  const [ids, setids] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/getGameData/" +
            jwtDecode(localStorage.getItem("accessToken")).user.username
        );
        const resp = response.data.ids.control;
        setids(
          resp.map((game) => {
            return {
              id: game.gameid, // Set id to gameid
            };
          })
        );
      } catch (error) {
        console.error("Error fetching game data:", error);
      }
    };
    fetchData();
  }, []);
  function isGameInLibrary(id) {
    const isFound = ids.some((item) => item.id === id);

    // Return the result
    return isFound;
  }
  const [formData, setFormData] = useState({
    gameid: "",
    status: "",
    timePlayed: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [isFormVisible, setFormVisibility] = useState(false);

  const handleToggleForm = (gameId) => {
    setFormVisibility(!isFormVisible);
    setFormData({
      ...formData,
      gameid: gameId, // Set the game's id as the default value for gameid
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const username = jwtDecode(localStorage.getItem("accessToken")).user
        .username;

      const response = await axios.post(
        `http://localhost:4000/addGame/${username}`,
        {
          gameInfo: {
            gameid: formData.gameid,
            rating: selectedFeedback,
            status: formData.status,
            timePlayed: formData.timePlayed,
          },
        }
      );
      navigate(0);
      // Handle success, e.g., show a success message or update the game list
      console.log(response.data);
      setFormVisibility(false);
    } catch (error) {
      // Handle errors, e.g., show an error message
      console.error("Error adding game:", error.message);
    }
  };
  const { page } = useParams();
  const currentPage = parseInt(page, 10) || 1;
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCriteria, setFilterCriteria] = useState(""); // You can set initial filter criteria if needed

  const totalPages = Math.ceil(gameData.length / itemsPerPage);

  const renderGames = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Filter games based on search term and filter criteria
    const filteredGames = gameData
      .filter(
        (game) =>
          game.locale &&
          game.locale.title &&
          game.locale.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (!filterCriteria ||
            (game.region && game.region.includes(filterCriteria)))
      )
      .slice(startIndex, endIndex);
    if (filteredGames.length === 0) {
      // Add a fake game when there are no actual games
      const fakeGame = {
        id: "Game not found",
        locale: { title: "Game not found search somethings else" },
        // Add other fake game properties as needed
      };

      return (
        <div className="game-card">
          <h3>{fakeGame.locale.title}</h3>
          <Link>
            <img src="/src/assets/GameNotFound.png" alt="" />
          </Link>
          <p>Game not found</p>
        </div>
      );
    }
    return filteredGames.map((game) => (
      <div key={game.id} className="game-card">
        <Link to={`/Games/${game.id}`}>
          <img
            src={`/src/assets/switch/${game.id}.jpg`}
            alt={game.locale.title}
          />
        </Link>
        <h3>{game.locale.title}</h3>
        <div className="form-container">
          {isGameInLibrary(game.id) ? (
            <button onClick={() => navigate("/Mygames/1")}>
              Already in library
            </button>
          ) : (
            <button onClick={() => handleToggleForm(game.id)}>Add Game</button>
          )}
        </div>
      </div>
    ));
  };
  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    const maxPrevPages = 5; // Maximum number of previous pages to display

    return (
      <div className="pagination">
        <Link
          to={`/Browse/${currentPage - 1}`}
          disabled={currentPage === 1}
          className="pagination-link"
        >
          {"<< Previous"}
        </Link>

        {pageNumbers.map((pageNumber) => {
          const isWithinRange =
            pageNumber >= currentPage - maxPrevPages &&
            pageNumber <= currentPage + 5;

          if (isWithinRange || pageNumber === totalPages || pageNumber === 1) {
            return (
              <Link
                key={pageNumber}
                to={`/Browse/${pageNumber}`}
                className={`pagination-link ${
                  currentPage === pageNumber ? "active" : ""
                }`}
              >
                {pageNumber}
              </Link>
            );
          } else if (
            pageNumber === currentPage + 6 &&
            currentPage + 6 < totalPages
          ) {
            return <span key="ellipsis">...</span>;
          }

          return null;
        })}

        <Link
          to={`/Browse/${currentPage + 1}`}
          disabled={currentPage === totalPages}
          className="pagination-link"
        >
          {"Next >>"}
        </Link>
      </div>
    );
  };

  return (
    <div className="my-games-container">
      <Frontpage />
      <div>
        <h2>Game List</h2>
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            value={filterCriteria}
            onChange={(e) => setFilterCriteria(e.target.value)}
          >
            <option value="">All Regions</option>
            <option value="USA">USA</option>
            <option value="EUR">EUR</option>
            {/* Add more options based on your regions */}
          </select>
        </div>
        <div className="game-list">{renderGames()}</div>
        {renderPagination()}
      </div>{" "}
      {isFormVisible && (
        <div className="form-overlay">
          <div className="form-card">
            <button
              className="close-button"
              onClick={() => setFormVisibility(false)}
            >
              X
            </button>
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
                Time Played (in seconds):
                <input
                  type="text"
                  name="timePlayed"
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
    </div>
  );
};

export default Browse;

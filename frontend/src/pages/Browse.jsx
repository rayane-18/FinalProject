import { useState, useEffect } from "react";

import axios from "axios"; // Don't forget to import axios
import { Frontpage } from "./Frontpage";
import gameData from "../assets/switchtdb.json";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Correct import statement

const itemsPerPage = 5;
const Browse = () => {
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
  console.log(ids);
  function isGameInLibrary(id) {
    // Check if the id exists in the array
    const isFound = ids.some((item) => item.id === id);
    console.log(isFound);
    // Return the result
    return isFound;
  }
  const [formData, setFormData] = useState({
    gameid: "",
    rating: "",
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
            rating: formData.rating,
            status: formData.status,
            timePlayed: formData.timePlayed,
          },
        }
      );

      // Handle success, e.g., show a success message or update the game list
      console.log(response.data);
      setFormVisibility(false);
    } catch (error) {
      // Handle errors, e.g., show an error message
      console.error("Error adding game:", error.message);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(gameData.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderGames = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return gameData.slice(startIndex, endIndex).map((game) => (
      <div key={game.id} className="game-card">
        <Link to={`/Games/${game.id}`}>
          <img
            src={`./src/assets/switch/${game.id}.jpg`}
            alt={game.locale.title}
          />
        </Link>
        <h3>{game.locale.title}</h3>

        {/* Move Add Game form below each game */}
        <div>
          {" "}
          {isGameInLibrary(gameData.id) ? (
            <button onClick={() => handleToggleForm(game.id)}>
              Already in library
            </button>
          ) : (
            <button onClick={() => handleToggleForm(game.id)}>Add Game</button>
          )}
          {isFormVisible && (
            <div>
              {/* Your form goes here */}
              <form onSubmit={handleSubmit}>
                {/* Remove the gameid field */}
                {/* ... other fields ... */}
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
      </div>
    ));
  };
  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {"<< Previous"}
        </button>

        {pageNumbers.map((pageNumber, index) => {
          if (
            (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2) ||
            index === 0 ||
            index === pageNumbers.length - 1
          ) {
            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={currentPage === pageNumber ? "active" : ""}
              >
                {pageNumber}
              </button>
            );
          } else if (
            index === 1 &&
            pageNumber > currentPage + 2 &&
            pageNumbers.length > 5
          ) {
            return <span key="ellipsis">...</span>;
          } else if (
            index === pageNumbers.length - 2 &&
            pageNumber < currentPage - 2 &&
            pageNumbers.length > 5
          ) {
            return <span key="ellipsis">...</span>;
          }
          return null;
        })}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {"Next >>"}
        </button>
      </div>
    );
  };

  return (
    <div>
      <Frontpage />
      <div>
        <h2>Game List</h2>
        <button onClick={handleToggleForm}>Add Game</button>
        {isFormVisible && (
          <div>
            {/* Your form goes here */}
            <form onSubmit={handleSubmit}>
              <label>
                Game ID:
                <input
                  type="text"
                  name="gameid"
                  value={formData.gameid}
                  onChange={handleChange}
                />
              </label>
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

        <div className="game-list">{renderGames()}</div>
        {renderPagination()}
      </div>
    </div>
  );
};

export default Browse;

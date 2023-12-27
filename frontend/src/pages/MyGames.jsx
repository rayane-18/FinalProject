import { useState, useEffect } from "react";
import axios from "axios";
import "./MyGames.css";
import { Frontpage } from "./Frontpage";
import LocalGameDB from "../assets/switchtdb.json";
//import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
const itemsPerPage = 5;
//console.log(jwtDecode(localStorage.getItem("accessToken")));
const Mygames = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [gameData, setGameData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newGame, setNewGame] = useState({
    // Initialize with default values or leave empty based on your schema
  });
  const [updateGameId, setUpdateGameId] = useState(null);
  const addGame = async () => {
    try {
      // Find the game in the local database using the newGame.id
      const foundGame = LocalGameDB.find((game) => game.id === newGame.id);

      // If the game is found, upload it to the server
      if (foundGame) {
        await axios.post("http://localhost:4000/postGame", foundGame);
        setNewGame({});
      } else {
        console.error("Game not found in local database.");
      }
    } catch (error) {
      console.error("Error adding game:", error);
    }
  };
  const deleteGame = async (id) => {
    console.log(id);
    try {
      await axios.delete(`http://localhost:4000/deleteGame/${id}`);
    } catch (error) {
      console.error("Error deleting game:", error);
    }
  };
  const updateGame = async () => {
    try {
      await axios.put(
        `"http://localhost:4000/updateGame/${updateGameId}`,
        newGame
      );
      setUpdateGameId(null);
      setNewGame({});
    } catch (error) {
      console.error("Error updating game:", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/getAllGames");
        const games = response.data;
        setGameData(games);
        setTotalPages(Math.ceil(games.length / itemsPerPage));
      } catch (error) {
        console.error("Error fetching game data:", error);
      }
    };

    fetchData();
  }, [newGame]); // Update the game data whenever a new game is added

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination">
        <div>
          {isLoggedIn ? "Welcome! You are logged in." : "You are logged out."}
        </div>
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

  const renderGames = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return gameData.slice(startIndex, endIndex).map((game) => (
      <div key={game.id} className="game-card">
        <h3>{game.locale.title}</h3>
        <Link to={`/Games/${game.id}`}>
          {" "}
          <img
            src={`./src/assets/switch/${game.id}.jpg`}
            alt={game.locale.title}
          />
        </Link>
        <p>Region: {game.region}</p>
        <p>Languages: {game.languages}</p>
        <p>Developer: {game.developer}</p>
        <p>Publisher: {game.publisher}</p>
        <p>Genre: {game.genre}</p>
        <button onClick={() => setUpdateGameId(game.id)}>Update</button>
        <button onClick={() => deleteGame(game.id)}>Delete</button>
      </div>
    ));
  };

  return (
    <div>
      <Frontpage />
      <div>
        <h2>Game List</h2>
        {/* Add Game Form */}
        <div>
          <h3>Add Game</h3>
          <form>
            {/* Your input fields for adding a new game */}
            <button type="button" onClick={addGame}>
              Add Game
            </button>
          </form>
        </div>

        {/* Update Game Form */}
        {updateGameId && (
          <div>
            <h3>Update Game</h3>
            <form>
              {/* Your input fields for updating the selected game */}
              <button type="button" onClick={updateGame}>
                Update Game
              </button>
            </form>
          </div>
        )}

        <div className="game-list">{renderGames()}</div>
        {renderPagination()}
      </div>
    </div>
  );
};

export default Mygames;
/*import { useState, useEffect } from "react";
import AddGameForm from "./AddGameForm";
import UpdateGameForm from "./UpdateGameForm";
import { getAllGames, postGame, updateGame } from "localhost:3000/gameApi";

const AdminDashboard = () => {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    // Fetch all games when the component mounts
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await getAllGames();
      setGames(response.data);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  const handleAddGame = async (gameData) => {
    try {
      await postGame(gameData);
      // Refresh the list of games after adding a new one
      fetchGames();
    } catch (error) {
      console.error("Error adding game:", error);
    }
  };

  const handleUpdateGame = async (id, gameData) => {
    try {
      await updateGame(id, gameData);
      // Refresh the list of games after updating
      fetchGames();
    } catch (error) {
      console.error("Error updating game:", error);
    } finally {
      // Clear the selected game after updating
      setSelectedGame(null);
    }
  };

  const handleEditGame = (game) => {
    // Set the selected game when the edit button is clicked
    setSelectedGame(game);
  };

  const handleCancelEdit = () => {
    // Clear the selected game when the cancel button is clicked
    setSelectedGame(null);
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <AddGameForm onAddGame={handleAddGame} />
      {games.map((game) => (
        <div key={game.id}>
          <p>{game.locale.title}</p>
          <button onClick={() => handleEditGame(game)}>Edit</button>
        </div>
      ))}
      {selectedGame && (
        <UpdateGameForm
          game={selectedGame}
          onUpdateGame={(gameData) =>
            handleUpdateGame(selectedGame.id, gameData)
          }
          onCancelEdit={handleCancelEdit}
        />
      )}
    </div>
  );
};

export default AdminDashboard;*/
/*import { useState } from "react";
import "./App.css";
import { Frontpage } from "./components/Frontpage";
import gameData from "./assets/switchtdb.json";

const itemsPerPage = 5;

const App = () => {
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
        <h3>{game.locale.title}</h3>
        <img
          src={`./src/assets/switch/${game.id}.jpg`}
          alt={game.locale.title}
        />
        <p>Region: {game.region}</p>
        <p>Languages: {game.languages}</p>
        <p>Developer: {game.developer}</p>
        <p>Publisher: {game.publisher}</p>
        <p>Genre: {game.genre}</p>
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
        <div className="game-list">{renderGames()}</div>
        {renderPagination()}
      </div>
    </div>
  );
};

export default App;
*/
/* unused stuff for now

import switchTDBData from "./assets/switchtdb.json";

  const gameData = switchTDBData.game; */
/*
    <div>
      <h2>Game List</h2>
      <div className="game-list">
        {gameData.map((game) => (
          <div key={game.id} className="game-card">
            <h3>{game.locale.title}</h3>
            <img
              src={`./src/assets/switch/${game.id}.jpg`}
              alt={game.locale.title}
            />
            <p>Type: {game.type}</p>
            <p>Region: {game.region}</p>
            <p>Languages: {game.languages}</p>
            <p>Developer: {game.developer}</p>
            <p>Publisher: {game.publisher}</p>
            <p>Genre: {game.genre}</p>
          </div>
        ))}
      </div>
    </div> */

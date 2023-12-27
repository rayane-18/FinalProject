import { useState, useEffect } from "react";
import axios from "axios";
import "./MyGames.css";
import { Frontpage } from "./Frontpage";
import LocalGameDB from "../assets/switchtdb.json";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
const itemsPerPage = 5;
const Mygames = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [gameData, setGameData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/getGameData/" +
            jwtDecode(localStorage.getItem("accessToken")).user.username
        );
        //const syaya = LocalGameDB.find((game) => game.id === gameID.ids.gameid);
        //const { yaya } = gaemID;

        //console.log(yaya);
        const resp = response.data.ids.control;
        const games = resp.map((game) => {
          const localGame = LocalGameDB.find((g) => g.id === game.gameid);
          return {
            id: game.gameid, // Set id to gameid
            ...localGame, // Add the local data if found
            ...game,
            locale: {
              title: localGame?.locale?.title || "", // Add default empty value for title if not found
            },
            // Add other fields with default empty values as needed
          };
        });
        console.log(games);
        setGameData(games);
        setTotalPages(Math.ceil(games.length / itemsPerPage));
      } catch (error) {
        console.error("Error fetching game data:", error);
      }
      const accessToken = localStorage.getItem("accessToken");
      setLoggedIn(!!accessToken);
    };

    fetchData();
  }, [gameData]); // Update the game data whenever a new game is added

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
        {game.locale.title && <h3>{game.locale.title}</h3>}
        <Link to={`/Games/${game.id}`}>
          <img
            src={`./src/assets/switch/${game.id}.jpg`}
            alt={game.locale.title}
          />
        </Link>
        {game.region && <p>Region: {game.region}</p>}
        {game.languages && <p>Languages: {game.languages}</p>}
        {game.developer && <p>Developer: {game.developer}</p>}
        {game.publisher && <p>Publisher: {game.publisher}</p>}
        {game.genre && <p>Genre: {game.genre}</p>}
      </div>
    ));
  };

  return isLoggedIn ? (
    <div>
      <Frontpage />
      <div>
        <h2>Game List</h2>
        {/* Add Game Form */}
        <div className="game-list">{renderGames()}</div>
        {renderPagination()}
      </div>
    </div>
  ) : (
    <button>You are logged out.</button>
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

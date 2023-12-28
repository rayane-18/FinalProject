import { useState, useEffect } from "react";
import axios from "axios";
import "./MyGames.css";
import { Frontpage } from "./Frontpage";
import LocalGameDB from "../assets/switchtdb.json";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
const itemsPerPage = 20;
const Mygames = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [gameData, setGameData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/getGameData/" +
          jwtDecode(localStorage.getItem("accessToken")).user.username
      );
      const resp = response.data.ids.control;
      const games = resp.map((game) => {
        const localGame = LocalGameDB.find((g) => g.id === game.gameid);
        return {
          id: game.gameid,
          ...localGame,
          ...game,
          locale: {
            title: localGame?.locale?.title || "",
          },
        };
      });
      setGameData(games);
      setTotalPages(Math.ceil(games.length / itemsPerPage));
    } catch (error) {
      console.error("Error fetching game data:", error);
    }
    const accessToken = localStorage.getItem("accessToken");
    setLoggedIn(!!accessToken);
  };

  const handleRemoveGame = async (gameId) => {
    try {
      await axios.delete(
        `http://localhost:4000/removeGame/${
          jwtDecode(localStorage.getItem("accessToken")).user.username
        }/${gameId}`
      );
      console.log(
        `http://localhost:4000/removeGame/${
          jwtDecode(localStorage.getItem("accessToken")).user.username
        }/${gameId}`
      );
      fetchData(); // Refetch the updated game data
    } catch (error) {
      console.error("Error removing game:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [gameData]);
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
        {/* Remove Game Button */}
        <button onClick={() => handleRemoveGame(game.id)}>Remove Game</button>
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

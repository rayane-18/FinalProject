import { useState, useEffect } from "react";
import axios from "axios";
import "./MyGames.css";
import { Frontpage } from "./Frontpage";
import LocalGameDB from "../assets/switchtdb.json";
import { jwtDecode } from "jwt-decode";
import { Link, useParams, useNavigate } from "react-router-dom";
const itemsPerPage = 20;
const Mygames = () => {
  const navigate = useNavigate();

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [gameData, setGameData] = useState([]);
  const { page } = useParams();
  const currentPage = parseInt(page, 10) || 1;
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCriteria, setFilterCriteria] = useState(""); // You can set initial filter criteria if needed
  const [selectedstatus, setselectedstatus] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/getGameData/" +
          jwtDecode(localStorage.getItem("accessToken")).user.username
      );
      const resp = response.data.ids.control;
      console.log(resp);
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
  const handlestatusChange = (region) => {
    setselectedstatus(region); // Reset page when changing the region
  };
  const handleRemoveGame = async (gameId) => {
    try {
      await axios.delete(
        `http://localhost:4000/removeGame/${
          jwtDecode(localStorage.getItem("accessToken")).user.username
        }/${gameId}`
      );
      navigate(0);
      fetchData(); // Refetch the updated game data
    } catch (error) {
      console.error("Error removing game:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [gameData]);

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    const maxPrevPages = 5;
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

  const renderGames = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const filteredGames = gameData
      .filter(
        (game) =>
          game.locale &&
          game.locale.title &&
          game.locale.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (!selectedstatus ||
            (game.status && game.status.includes(selectedstatus))) &&
          (!filterCriteria ||
            (game.region && game.region.includes(filterCriteria)))
      )
      .slice(startIndex, endIndex);
    return filteredGames.map((game) => (
      <div key={game.id} className="game-card">
        {game.locale.title && <h3>{game.locale.title}</h3>}
        <Link to={`/Games/${game.id}`}>
          <img
            src={`/src/assets/switch/${game.id}.jpg`}
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
        <div className="State-buttons">
          <button
            onClick={() => handlestatusChange("playing")}
            className={selectedstatus === "playing" ? "active" : ""}
          >
            playing
          </button>
          <button
            onClick={() => handlestatusChange("completed")}
            className={selectedstatus === "completed" ? "active" : ""}
          >
            completed
          </button>
          <button
            onClick={() => handlestatusChange("plan to play")}
            className={selectedstatus === "plan to play" ? "active" : ""}
          >
            plan to play
          </button>
          <button
            onClick={() => handlestatusChange("dropped")}
            className={selectedstatus === "dropped" ? "active" : ""}
          >
            dropped
          </button>
        </div>
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
          </select>
        </div>
        <div className="game-list">{renderGames()}</div>
        {renderPagination()}
      </div>
    </div>
  ) : (
    <button>You are logged out.</button>
  );
};
export default Mygames;

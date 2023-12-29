import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import gameData from "../assets/switchtdb.json";
const itemsPerPage = 20;
const Search = () => {
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

    return filteredGames.map((game) => (
      <div key={game.id} className="game-card">
        <Link to={`/Games/${game.id}`}>
          <img
            src={`/src/assets/switch/${game.id}.jpg`}
            alt={game.locale.title}
          />
        </Link>
        <h3>{game.locale.title}</h3>

        {/* Move Add Game form below each game */}
      </div>
    ));
  };
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

  return (
    <div>
      <h2>Game List</h2>
      <div>
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
      </div>
      <div className="game-list">{renderGames()}</div>
      {renderPagination()}
    </div>
  );
};
export default Search;

import { useState } from "react";
import { Frontpage } from "./Frontpage";
import gameData from "../assets/switchtdb.json";
import { Link } from "react-router-dom";
const itemsPerPage = 5;
const Browse = () => {
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
        {/* Use Link instead of a regular anchor tag */}
        <Link to={`/Games/${game.id}`}>
          <img
            src={`./src/assets/switch/${game.id}.jpg`}
            alt={game.locale.title}
          />
        </Link>
        <h3>{game.locale.title}</h3>
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

export default Browse;
/*
<p>Region: {game.region}</p>
<p>Languages: {game.languages}</p>
<p>Developer: {game.developer}</p>
<p>Publisher: {game.publisher}</p>
<p>Genre: {game.genre}</p>
*/

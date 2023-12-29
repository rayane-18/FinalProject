const GameDB = require("../models/GameDB.model.js");

const getGameData = async (req, res) => {
  const { username } = req.params;

  try {
    // Find data for the specified username
    const userData = await GameDB.findOne({ username });

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
async function addGame(req, res) {
  const { username } = req.params;
  const { gameInfo } = req.body;

  try {
    // Find or create data for the specified username
    let userData = await GameDB.findOne({ username });

    if (!userData) {
      userData = new GameDB({ username });
    }

    // Add or update game information
    if (!userData.ids) {
      userData.ids = { control: [] };
    }

    userData.ids.control.push({
      gameid: gameInfo.gameid,
      rating: gameInfo.rating,
      status: gameInfo.status,
      timePlayed: gameInfo.timePlayed,
    });
    // Save the updated user data
    await userData.save();

    res.status(200).json({ message: "Game data added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}
async function checkGame(username, gameid) {
  try {
    const userData = await GameDB.findOne({ username });

    if (!userData) {
      // If user data doesn't exist, the game definitely doesn't exist
      return false;
    }

    const gameExists = userData.ids.control.some(
      (game) => game.gameid === gameid
    );

    return gameExists;
  } catch (err) {
    console.error(err);
    // Handle the error appropriately, you might want to throw it or return a specific value
    throw err;
  }
}

async function removeGame(req, res) {
  const { username, gameid } = req.params;

  try {
    // Check if the game exists
    const exists = await checkGame(username, gameid);

    if (!exists) {
      return res.status(404).json({ message: "Game not found" });
    }

    // Remove the game
    await GameDB.updateOne(
      { username },
      { $pull: { "ids.control": { gameid } } }
    );

    res.status(200).json({ message: "Game removed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function updateGame(req, res) {
  const { username, gameid } = req.params;
  const { rating, status, timePlayed } = req.body;

  try {
    // Check if the game exists
    const { exists } = await checkGame(req, res);
    if (!exists) {
      return res.status(404).json({ message: "Game not found" });
    }

    // Prepare the update fields
    const updateFields = {};
    if (rating) updateFields["ids.control.$.rating"] = rating;
    if (status) updateFields["ids.control.$.status"] = status;
    if (timePlayed) updateFields["ids.control.$.timePlayed"] = timePlayed;

    // Update the game
    await GameDB.updateOne(
      { username: username, "ids.control.gameid": gameid },
      { $set: updateFields }
    );

    res.status(200).json({ message: "Game updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}
async function getsingleGameData(req, res) {
  const { username, gameid } = req.params;

  try {
    const userData = await GameDB.findOne({ username });

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const gameData = userData.ids.control.find(
      (game) => game.gameid === gameid
    );

    if (!gameData) {
      return res.status(404).json({ message: "Game not found for the user" });
    }

    res.status(200).json(gameData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}
module.exports = {
  getGameData,
  getsingleGameData,
  addGame,
  checkGame,
  updateGame,
  removeGame,
};
/*
const getAllGames = async (req, res) => {
  const { username } = req.params;
  try {
    const allData = await GameDB.find({ username });
    res.status(200).json(allData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getAllGames = async (req, res) => {
  const username = req.params.id;
  try {
    const allData = await GameDB.findById({ username: username });
    res.status(200).json(allData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getGameById = async (req, res) => {
  const gameId = req.params.id;

  try {
    const game = await GameDB.findOne({ id: gameId });

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    res.status(200).json(game);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteGame = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await GameDB.findOneAndDelete({ id: id });

    if (!result) {
      // If no document was found and deleted
      return res.status(404).json({ message: "Game not found" });
    }

    res.status(200).json({ message: "Deleted Game" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const updateGame = async (req, res) => {
  const id = req.params.id;
  await GameDB.findByIdAndUpdate(id, { $set: req.body });
  try {
    res.status(200).json({ message: "updated game" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
module.exports = { postGame, getAllGames, deleteGame, updateGame, getGameById };

*/

const GameDB = require("../models/GameDB.model.js");

const postGame = async (req, res) => {
  const addGame = new GameDB(req.body);
  const savedGame = await addGame.save();

  try {
    res.status(200).json(savedGame);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getAllGames = async (req, res) => {
  const allData = await GameDB.find();
  try {
    res.status(200).json(allData);
  } catch (err) {
    res.status(500).json({ message: err });
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

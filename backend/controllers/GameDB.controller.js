const {
  postGame,
  getAllGames,
  deleteGame,
  updateGame,
  getGameById,
} = require("../routes/GameDB.route");

const router = require("express").Router();
router.post("/postGame", postGame);
router.get("/getAllGames", getAllGames);
router.get("/getGameById/:id", getGameById);
router.delete("/deleteGame/:id", deleteGame);
router.put("/updateGame/:id", updateGame);

module.exports = router;

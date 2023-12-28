const {
  getGameData,
  addGame,
  checkGame,
  updateGame,
  removeGame,
} = require("../routes/GameDB.route");
const router = require("express").Router();

// Use a GET request to retrieve data for a specific username
router.get("/getGameData/:username", getGameData);
router.post("/addGame/:username", addGame);
router.get("/checkGame/:username/:gameid", checkGame);
router.delete("/removeGame/:username/:gameid", removeGame);
router.patch("/updateGame/:username/:gameid", updateGame);

module.exports = router;
/*
router.get("/getAllGames", getAllGames);
router.get("/getGameById/:id", getGameById);
router.delete("/deleteGame/:id", deleteGame);
router.put("/updateGame/:id", updateGame);
*/

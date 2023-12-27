const { getGameData } = require("../routes/GameDB.route");
const router = require("express").Router();

// Use a GET request to retrieve data for a specific username
router.get("/getGameData/:username", getGameData);

module.exports = router;
/*
router.get("/getAllGames", getAllGames);
router.get("/getGameById/:id", getGameById);
router.delete("/deleteGame/:id", deleteGame);
router.put("/updateGame/:id", updateGame);
*/

const mongoose = require("mongoose");
const gameDBSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: true, // Add an index on the username field
  },
  ids: {
    control: [
      {
        gameid: {
          type: String,
          required: false,
        },
        rating: {
          type: String,
          required: false,
        },
        status: {
          type: String,
          enum: ["playing", "completed", "plan to play", "dropped"],
          required: false,
        },
        timePlayed: {
          type: Number, // Change to Number for seconds
          required: false,
        },
      },
    ],
  },
});

module.exports = mongoose.model("gameDB", gameDBSchema);

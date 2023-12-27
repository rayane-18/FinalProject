const mongoose = require("mongoose");

const gameDB_model = mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  languages: {
    type: String,
    required: false,
  },
  locale: {
    title: {
      type: String,
      required: false,
    },
    synopsis: {
      type: String,
      required: false,
    },
  },
  publisher: {
    type: String,
    required: false,
  },
  date: {
    type: String,
    required: false,
  },
  wifi: {
    type: String,
    required: false,
  },
  input: {
    control: [
      {
        type: String,
        required: false,
      },
      {
        type: String,
        required: false,
      },
    ],
  },
  mode: {
    type: String,
    required: false,
  },
  rom: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("gameDB", gameDB_model);

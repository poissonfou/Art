const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const artistSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  birthYear: {
    type: Number,
  },
  birthFull: {
    day: String,
    month: String,
    year: String,
  },
  deathYear: {
    type: Number,
  },
  deathFull: {
    day: String,
    month: String,
    year: String,
  },
  country: {
    type: String,
  },
  period: {
    type: String,
  },
});

module.exports = mongoose.model("Artists", artistSchema);

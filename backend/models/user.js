const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  collections: [
    {
      type: Object,
      required: true,
    },
  ],
  paintings: [
    {
      type: Schema.Types.ObjectId,
      ref: "Paintings",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);

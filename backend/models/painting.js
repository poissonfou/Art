const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paintingSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  period: {
    type: String,
  },
  source: {
    type: String,
    required: true,
  },
  artists: [
    {
      type: Schema.Types.ObjectId,
      ref: "Artists",
    },
  ],
});

paintingSchema.index({ name: "text", originalName: "text" });

module.exports = mongoose.model("Paintings", paintingSchema);

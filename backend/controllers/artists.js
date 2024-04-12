const artists = require("../models/artist");

exports.getArtists = (req, res, next) => {
  artists
    .find()
    .then((artists) => {
      if (!artists) {
        const error = new Error("Could not find post.");
        error.statusCode = 400;
        throw error;
      }
      res.json({ message: "Success", artists: artists }).status(200);
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.getArtist = (req, res, next) => {
  const id = req.params.artistId;
  if (id == "") return res.json({ message: "Invalid id." }).status(422);

  artists
    .findById(id)
    .populate("paintings")
    .then((artist) => {
      if (!artist) {
        const error = new Error("Could not find post.");
        error.statusCode = 400;
        throw error;
      }
      res.json({ message: "Success", artist: artist }).status(200);
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

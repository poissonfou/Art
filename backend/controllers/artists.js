const Artists = require("../models/artist");

exports.getArtists = (req, res, next) => {
  Artists.find()
    .then((artists) => {
      if (!artists) {
        const error = new Error("Could not get artists.");
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

  Artists.findById(id)
    .populate("paintings")
    .then((artist) => {
      if (!artist) {
        const error = new Error("Could not find artist.");
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

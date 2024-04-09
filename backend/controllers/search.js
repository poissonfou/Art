const paintings = require("../models/painting");
const artists = require("../models/artist");

exports.search = (req, res, next) => {
  let querry = req.query.q;
  let type = req.query.type;

  if (type == "artists") {
    artists
      .find({ name: querry }, {}, { allowPartialResults: true })
      .then((result) => {
        if (!result.length) {
          const error = new Error("Could not find post.");
          error.statusCode = 400;
          throw error;
        }
        res.json({ message: "Success", result: result }).status(200);
      })
      .catch((err) => {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
      });
  } else {
    paintings
      .find({ name: querry }, {}, { allowPartialResults: true })
      .then((result) => {
        if (!result.length) {
          const error = new Error("Could not find post.");
          error.statusCode = 400;
          throw error;
        }
        res.json({ message: "Success", result: result }).status(200);
      })
      .catch((err) => {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
      });
  }
};

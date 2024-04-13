const Paintings = require("../models/painting");
const Artists = require("../models/artist");

exports.search = (req, res, next) => {
  let querry = req.query.q;
  let paintingsResult;

  Paintings.find({ $text: { $search: querry } })
    .limit(20)
    .populate("artists")
    .then((paintings) => {
      if (!paintings) {
        const error = new Error("Could not get paintings.");
        error.statusCode = 400;
        throw error;
      }

      paintingsResult = paintings;
      return Artists.find({ $text: { $search: querry } }).limit(10);
    })
    .then((artists) => {
      if (!artists) {
        const error = new Error("Could not get artists.");
        error.statusCode = 400;
        throw error;
      }

      res
        .json({
          message: "Success",
          results: { artists, paintings: paintingsResult },
        })
        .status(200);
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

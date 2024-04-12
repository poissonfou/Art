const paintings = require("../models/painting");
const artists = require("../models/artist");

exports.search = (req, res, next) => {
  let querry = req.query.q;
  let paintingsResult;

  paintings
    .find({ $text: { $search: querry } })
    .limit(20)
    .populate("artists")
    .then((paintings) => {
      if (!paintings) {
        const error = new Error("Could not find post.");
        error.statusCode = 400;
        throw error;
      }

      paintingsResult = paintings;
      return artists.find({ $text: { $search: querry } }).limit(10);
    })
    .then((artists) => {
      if (!artists) {
        const error = new Error("Could not find post.");
        error.statusCode = 400;
        throw error;
      }

      console.log({ artists, paintings: paintingsResult });

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

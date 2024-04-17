const Paintings = require("../models/painting");
const Artists = require("../models/artist");

//Sandro Boticelli  -  Boticeli

exports.search = (req, res, next) => {
  let query = req.query.q.toLowerCase();
  let paintingsResult, artistsResults;
  let results = {
    paintings: [],
    artists: [],
  };

  Paintings.find()
    .populate("artists")
    .then((paintings) => {
      if (!paintings) {
        const error = new Error("Could not get paintings.");
        error.statusCode = 400;
        throw error;
      }

      paintingsResult = paintings;
      return Artists.find().populate("paintings");
    })
    .then((artists) => {
      if (!artists) {
        const error = new Error("Could not get artists.");
        error.statusCode = 400;
        throw error;
      }

      artistsResults = artists;
      let indexStr;
      let str;
      let indexQuery = 0;
      let matches = [];
      let imperfectMatch;
      let lastMatchLength = 0;
      let lastStrIndex;

      for (let i = 0; i < paintingsResult.length; i++) {
        indexStr = 0;
        str = paintingsResult[i].name.toLowerCase();
        original = paintingsResult[i].originalName.toLowerCase();
        indexQuery = 0;
        imperfectMatch = false;
        lastMatchLength = 0;
        lastStrIndex = null;
        matches = [];

        while (indexQuery < query.length) {
          if (str[indexStr] == query[indexQuery]) {
            matches.push(str[indexStr]);
            indexQuery++;
            indexStr++;
          } else {
            if (matches.length && !imperfectMatch) {
              lastMatchLength = matches.length;
              lastStrIndex = indexStr;
              imperfectMatch = true;
              indexStr++;
            } else if (imperfectMatch) {
              if (matches.length - 2 >= lastMatchLength) break;

              matches = [];
              imperfectMatch = false;
              indexQuery = 0;
              indexStr = lastStrIndex;
            } else {
              if (indexStr++ - str.length == query.length) break;
              matches = [];
              indexQuery = 0;
            }
          }
        }

        if (matches.length > 1) {
          results.paintings.push(paintingsResult[i]);
          continue;
        }

        indexStr = 0;
        indexQuery = 0;
        matches = [];
        imperfectMatch = false;
        lastMatchLength = 0;
        lastStrIndex = null;

        while (indexQuery < query.length) {
          if (original[indexStr] == query[indexQuery]) {
            matches.push(original[indexStr]);
            indexQuery++;
            indexStr++;
          } else {
            if (matches.length && !imperfectMatch) {
              lastMatchLength = matches.length;
              lastStrIndex = indexStr;
              imperfectMatch = true;
              indexStr++;
            } else if (imperfectMatch) {
              if (matches.length - 2 >= lastMatchLength) break;

              matches = [];
              imperfectMatch = false;
              indexQuery = 0;
              indexStr = lastStrIndex;
            } else {
              if (indexStr++ - original.length == query.length) break;
              matches = [];
              indexQuery = 0;
            }
          }
        }

        if (matches.length > 1) results.paintings.push(paintingsResult[i]);
      }

      for (let i = 0; i < artists.length; i++) {
        indexStr = 0;
        str = artists[i].name.toLowerCase();
        indexQuery = 0;
        imperfectMatch = false;
        lastMatchLength = 0;
        lastStrIndex = null;
        matches = [];

        while (indexQuery < query.length) {
          if (str[indexStr] == query[indexQuery]) {
            matches.push(str[indexStr]);
            indexQuery++;
            indexStr++;
          } else {
            if (matches.length && !imperfectMatch) {
              lastMatchLength = matches.length;
              lastStrIndex = indexStr;
              imperfectMatch = true;
              indexStr++;
            } else if (imperfectMatch) {
              if (matches.length - 2 >= lastMatchLength) break;
              matches = [];
              imperfectMatch = false;
              indexQuery = 0;
              indexStr = lastStrIndex;
            } else {
              if (indexStr++ - str.length == query.length) break;
              matches = [];
              indexQuery = 0;
            }
          }
        }

        if (matches.length > 1) {
          results.artists.push(artists[i]);
          continue;
        }
      }

      return results;
    })
    .then((results) => {
      res
        .json({
          message: "Success",
          results,
        })
        .status(200);
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

const Paintings = require("../models/painting");
const Artists = require("../models/artist");

exports.search = (req, res, next) => {
  let query = req.query.q.toLowerCase();
  let paintingsResult;
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

      if (!artists.length && !paintingsResult.length) return results;

      let index;
      let str;
      let indexQuery = 0;
      let matches = [];
      let imperfectMatch;
      let lastMatchLength = 0;
      let lastIndex;

      for (let i = 0; i < paintingsResult.length; i++) {
        index = 0;
        str = paintingsResult[i].name.toLowerCase();
        originalName = paintingsResult[i].originalName.toLowerCase();

        indexQuery = 0;
        imperfectMatch = false;
        lastMatchLength = 0;
        lastIndex = null;
        matches = [];

        while (indexQuery < query.length) {
          if (str[index] == query[indexQuery]) {
            matches.push(str[index]);
            indexQuery++;
            index++;
          } else {
            if (matches.length && !imperfectMatch) {
              lastMatchLength = matches.length;
              lastIndex = index;
              imperfectMatch = true;
              index++;
            } else if (imperfectMatch) {
              if (matches.length - 2 >= lastMatchLength) break;

              matches = [];
              imperfectMatch = false;
              indexQuery = 0;
              index = lastIndex;
            } else {
              if (index++ - str.length == query.length) break;
              matches = [];
              indexQuery = 0;
            }
          }
        }

        if (matches.length > 1) {
          results.paintings.push(paintingsResult[i]);
          continue;
        }

        index = 0;
        indexQuery = 0;
        matches = [];
        imperfectMatch = false;
        lastMatchLength = 0;
        lastIndex = null;

        while (indexQuery < query.length) {
          if (originalName[index] == query[indexQuery]) {
            matches.push(originalName[index]);
            indexQuery++;
            index++;
          } else {
            if (matches.length && !imperfectMatch) {
              lastMatchLength = matches.length;
              lastIndex = index;
              imperfectMatch = true;
              index++;
            } else if (imperfectMatch) {
              if (matches.length - 2 >= lastMatchLength) break;

              matches = [];
              imperfectMatch = false;
              indexQuery = 0;
              index = lastIndex;
            } else {
              if (index++ - originalName.length == query.length) break;
              matches = [];
              indexQuery = 0;
            }
          }
        }

        if (matches.length > 1) results.paintings.push(paintingsResult[i]);
      }

      for (let i = 0; i < artists.length; i++) {
        index = 0;
        str = artists[i].name.toLowerCase();
        indexQuery = 0;
        imperfectMatch = false;
        lastMatchLength = 0;
        lastIndex = null;
        matches = [];

        while (indexQuery < query.length) {
          if (str[index] == query[indexQuery]) {
            matches.push(str[index]);
            indexQuery++;
            index++;
          } else {
            if (matches.length && !imperfectMatch) {
              lastMatchLength = matches.length;
              lastIndex = index;
              imperfectMatch = true;
              index++;
            } else if (imperfectMatch) {
              if (matches.length - 2 >= lastMatchLength) break;
              matches = [];
              imperfectMatch = false;
              indexQuery = 0;
              index = lastIndex;
            } else {
              if (index++ - str.length == query.length) break;
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

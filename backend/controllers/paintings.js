const paintings = require("../models/painting");
const user = require("../models/user");

exports.getPaintings = (req, res, next) => {
  paintings
    .find()
    .then((paintings) => {
      if (!paintings) {
        const error = new Error("Could not get paintings.");
        error.statusCode = 400;
        throw error;
      }
      res.json({ message: "Success", paintings: paintings });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.getPainting = (req, res, next) => {
  const id = req.params.paintingId;
  if (id == "") res.json({ message: "invalid id" }).status(422);

  paintings
    .findById(id)
    .then((painting) => {
      if (!painting) {
        const error = new Error("Could not find painting.");
        error.statusCode = 400;
        throw error;
      }
      res.json({ message: "Success", painting: painting }).status(200);
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.savePaints = (req, res, next) => {
  let userId = req.userId;
  let paintingId = req.params.paintingId;
  let painting;

  paintings
    .findById(paintingId)
    .then((result) => {
      if (!result) {
        const error = new Error("Could not find .");
        error.statusCode = 400;
        throw error;
      }
      painting = result;
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });

  user
    .findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error("Could not find user.");
        error.statusCode = 400;
        throw error;
      }
      user.paintings.push(painting);
      return user.save();
    })
    .then((result) => {
      res.json({ message: "Success", userUpdated: result }).status(201);
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.deletePaintings = (req, res) => {
  const userId = req.userId;
  const paintingId = req.params.paintingId;
  let index;

  user
    .findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error("Could not find user.");
        error.statusCode = 400;
        throw error;
      }

      for (let i = 0; i < user.paintings.length; i++) {
        if (user.paintings[i]._id == paintingId) {
          index = i;
          break;
        }
      }

      user.paintings.splice(index, 1);
      return user.save();
    })
    .then((result) => {
      res.json({ message: "Success", userUpdated: result }).status(201);
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

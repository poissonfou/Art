const jwp = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const User = require("../models/user");

exports.login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Entered data is incorrect");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  let email = req.body.email;
  let password = req.body.password;
  let currentUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("A user with this email was not found");
        error.statusCode = 401;
        throw error;
      }
      currentUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong password!");
        error.statusCode = 401;
        throw error;
      }

      const token = jwp.sign(
        {
          email: currentUser.email,
          userId: currentUser._id.toString(),
        },
        "secret283917",
        { expiresIn: "3h" }
      );
      res.json({ token, userId: currentUser._id.toString() });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getUser = (req, res, next) => {
  let id = req.params.userId;

  User.find({ _id: id })
    .then((user) => {
      if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 401;
        throw error;
      }

      res.json({ message: "Success", user }).status(200);
    })
    .catch((err) => {
      if (err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Entered data is incorrect");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;

  User.findOne({ email: email }).then((user) => {
    if (user) {
      const error = new Error("This user already exists!");
      error.statusCode = 401;
      throw error;
    }
  });

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });
      return newUser.save();
    })
    .then((result) => {
      res.json({ message: "User created", userId: result._id }).status(201);
    })
    .catch((err) => {
      if (err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.update = (req, res, next) => {
  let name = req.body.name;
  let password = req.body.password;
  let id = req.body.id;
  let currentUser;

  User.findById(id)
    .then((user) => {
      if (!user) {
        const error = new Error("User doesn't exist!");
        error.statusCode = 401;
        throw error;
      }

      currentUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual && password !== "") {
        return bcrypt.hash(password);
      }
      return "";
    })
    .then((hashedPassword) => {
      if (hashedPassword !== "") {
        currentUser.password = hashedPassword;
      }
      return User.findById(id);
    })
    .then((user) => {
      if (name !== "") {
        user.name = name;
      }
      if (password !== "") {
        user.password = currentUser.password;
      }
      user.save();
      res.json({ message: "Sucessfully updated" }).status(200);
    })
    .catch((err) => {
      if (err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

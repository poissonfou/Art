const jwp = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const User = require("../models/user");

exports.login = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    let message = errors.array();
    const error = new Error(message[0].msg);
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  let email = req.body.email.trim();
  let password = req.body.password.trim();

  if (password == "") {
    const error = new Error("Please enter your password.");
    error.statusCode = 422;
    throw error;
  }

  if (email == "") {
    const error = new Error("Please enter your email.");
    error.statusCode = 422;
    throw error;
  }

  if (email.indexOf("@") == -1) {
    const error = new Error("Please entera valid email.");
    error.statusCode = 422;
    throw error;
  }

  let currentUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("A user with this email was not found.");
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

      res.json({ token }).status(200);
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.getUser = (req, res, next) => {
  let id = req.userId;

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
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let message = errors.array();
    const error = new Error(message[0].msg);
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  let name = req.body.name.trim();
  let email = req.body.email.trim();
  let password = req.body.password.trim();
  let confirm = req.body.confirm.trim();

  if (name == "") {
    const error = new Error("Please enter your name.");
    error.statusCode = 422;
    throw error;
  }

  if (password !== confirm) {
    const error = new Error("Password don't match.");
    error.statusCode = 422;
    throw error;
  }

  if (password == "") {
    const error = new Error("Please enter your password.");
    error.statusCode = 422;
    throw error;
  }

  if (email == "") {
    const error = new Error("Please enter your email.");
    error.statusCode = 422;
    throw error;
  }

  if (email.indexOf("@") == -1) {
    const error = new Error("Please entera valid email.");
    error.statusCode = 422;
    throw error;
  }

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
        collections: [],
      });
      return newUser.save();
    })
    .then((result) => {
      res.json({ message: "User created." }).status(201);
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.update = (req, res, next) => {
  let name = req.body.name.trim();
  let password = req.body.password.trim();
  let confirm = req.body.confirm.trim();
  let id = req.userId;
  let currentUser;

  if (name == "" && password == "" && confirm == "") {
    res.json({ message: "No data changed" }).status(200);
  }

  if (password !== "" || confirm !== "") {
    if (password.length < 6) {
      const error = new Error(
        "Please choose a password with more then 6 digits."
      );
      error.statusCode = 422;
      throw error;
    }

    if (password !== confirm) {
      const error = new Error("Passwords don't match.");
      error.statusCode = 422;
      throw error;
    }
  }

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
      res.json({ message: "Success" }).status(200);
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.collection = (req, res, next) => {
  let id = req.userId;
  let collectionName = req.body.name;
  let collection;

  User.findById(id)
    .then((user) => {
      if (!user) {
        const error = new Error("Couldn't get user.");
        error.statusCode = 401;
        throw error;
      }

      for (let i = 0; i < user.collections.length; i++) {
        if (user.collections[i].name == collectionName) {
          collection = user.collections[i];
        }
      }

      if (!collection) {
        const error = new Error("Couldn't get collection.");
        error.statusCode = 401;
        throw error;
      }

      res.json({ message: "Success", collection: collection });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.addCollection = (req, res, next) => {
  let id = req.userId;
  let name = req.body.name;
  let collectionUpdate = req.body.collection;
  let updated = false;

  User.findById(id)
    .then((user) => {
      if (!user) {
        const error = new Error("Couldn't get user.");
        error.statusCode = 401;
        throw error;
      }

      for (let i = 0; i < user.collections.length; i++) {
        if (user.collections[i].name == name) {
          user.collections[i] = collectionUpdate;
          updated = true;
          break;
        }
      }

      if (!updated) {
        const error = new Error("Couldn't find collection.");
        error.statusCode = 401;
        throw error;
      }

      return user.save();
    })
    .then((user) => {
      res
        .json({ message: "Success", collections: user.collections })
        .status(200);
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.collections = (req, res, next) => {
  const id = req.userId;

  User.findById(id)
    .then((user) => {
      if (!user) {
        const error = new Error("Couldn't get user.");
        error.statusCode = 401;
        throw error;
      }

      res
        .json({ message: "Success", collections: user.collections })
        .status(200);
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.addCollections = (req, res, next) => {
  const id = req.userId;
  let collection = req.body.collection;

  User.findById(id)
    .then((user) => {
      if (!user) {
        const error = new Error("Couldn't get user.");
        error.statusCode = 401;
        throw error;
      }

      let titles = user.collections.map(({ name }) => name);

      if (titles.includes(collection.name)) {
        const error = new Error("Please choose a different title.");
        error.statusCode = 401;
        throw error;
      }

      user.collections.push(collection);
      return user.save();
    })
    .then((user) => {
      res.json({ message: "Success", collections: user.collections });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.deleteCollections = (req, res, next) => {
  let id = req.userId;
  let name = req.params.name;
  let index = null;

  User.findById(id)
    .then((user) => {
      if (!user) {
        const error = new Error("Couldn't get user.");
        error.statusCode = 401;
        throw error;
      }

      for (let i = 0; i < user.collections.length; i++) {
        if (user.collections[i].name == name) {
          index = i;
          break;
        }
      }

      if (index == null) {
        const error = new Error("Couldn't find collection.");
        error.statusCode = 401;
        throw error;
      }

      user.collections.splice(index, 1);
      return user.save();
    })
    .then((user) => {
      res
        .json({
          message: "Success",
          collections: user.collections,
        })
        .status(204);
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

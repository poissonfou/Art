const { body } = require("express-validator");
const router = require("express").Router();
const userControllers = require("../controllers/user");
const auth = require("../middleware/auth");

router.get("/", auth, userControllers.getUser);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Invalid password."),
  ],
  userControllers.login
);

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().isString(),
  ],
  userControllers.signup
);

router.post("/update", auth, userControllers.update);

router.get("/collection", auth, userControllers.collection);

router.post("/collection", auth, userControllers.addCollection);

router.get("/collections", auth, userControllers.collections);

router.post("/collections", auth, userControllers.addCollections);

router.delete("/collections/:name", auth, userControllers.deleteCollections);

module.exports = router;

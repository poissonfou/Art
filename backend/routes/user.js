const { body } = require("express-validator");
const router = require("express").Router();
const userControllers = require("../controllers/user");
const auth = require("../middleware/auth");

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
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

router.get("/:userId", userControllers.getUser);

module.exports = router;

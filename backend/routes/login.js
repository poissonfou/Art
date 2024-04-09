const { body } = require("express-validator");
const router = require("express").Router();
const loginControllers = require("../controllers/login");

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
  ],
  loginControllers.login
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
  loginControllers.signup
);

router.get("/:userId", loginControllers.getUser);

module.exports = router;

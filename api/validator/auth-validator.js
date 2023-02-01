const { body } = require("express-validator");
const ValidateRequest = require("../middlewares/validate-request");

module.exports.LoginValidator = [
  body("email")
    .notEmpty()
    .withMessage("username must be entered")
    .isString()
    .withMessage("String"),
  body("password")
    .notEmpty()
    .withMessage("Password must be entered")
    .isString()
    .withMessage("String"),
  (req, res, next) => {
    ValidateRequest(req, res, next);
  },
];

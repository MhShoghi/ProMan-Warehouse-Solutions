const { body } = require("express-validator");
const ValidateRequest = require("../middlewares/validate-request");

module.exports.registerUserValidator = [
  body("first_name").notEmpty().isString(),
  body("last_name").notEmpty().isString(),
  body("username", "Should choose the username").isString(),
  body("email")
    .optional({ nullable: true })
    .isEmail()
    .withMessage("Wrong email"),
  body("password").isStrongPassword().withMessage("Choose stronger password"),

  (req, res, next) => {
    ValidateRequest(req, res, next);
  },
];

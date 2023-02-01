const { body } = require("express-validator");
const ValidateRequest = require("../middlewares/validate-request");

module.exports.AddProjectValidator = [
  body("name", "Field is required").isString(),
  body("owner", "Field is required").isString(),
  body("operator", "Field is required")
    .isMongoId()
    .withMessage("Operator must be an operator ID"),
  body("description", "Field is required").isString(),
  body("address", "Field is required").isString(),
  body("latitude", "Field is required").isString(),
  body("longitude", "Field is required").isString(),
  body("status", "Field is required").isNumeric(),
  body("number", "Field is required").isString(),
  (req, res, next) => {
    ValidateRequest(req, res, next);
  },
];

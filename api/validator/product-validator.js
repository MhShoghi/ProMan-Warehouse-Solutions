const { body } = require("express-validator");
const { errorMessages } = require("../../config/languages");
const ValidateRequest = require("../middlewares/validate-request");

const CreateProductValidator = [
  body("name").isString().withMessage("Product name must be entered"),
  body("description").isString().optional({ nullable: true }),
  body("category")
    .isMongoId()
    .withMessage(errorMessages.REQUIRED_FIELD("'category'")),
  body("unit")
    .notEmpty()
    .withMessage(errorMessages.REQUIRED_FIELD("unit"))
    .isMongoId()
    .withMessage(errorMessages.INCORRECT_FIELD("unit")),

  body("supplier")
    .isMongoId()
    .withMessage(errorMessages.INCORRECT_FIELD("supplier")),
  (req, res, next) => {
    ValidateRequest(req, res, next);
  },
];

const CreateUnitOfMeasurementValidator = [
  body("name")
    .notEmpty()
    .withMessage(errorMessages.REQUIRED_FIELD("name"))
    .isString()
    .withMessage(errorMessages.INCORRECT_FIELD("name")),
  body("abbreviation")
    .notEmpty()
    .withMessage(errorMessages.REQUIRED_FIELD("abbreviation"))
    .isString()
    .withMessage(errorMessages.INCORRECT_FIELD("abbreviation")),
  (req, res, next) => {
    ValidateRequest(req, res, next);
  },
];

module.exports = { CreateProductValidator, CreateUnitOfMeasurementValidator };

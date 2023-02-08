const { body, check } = require("express-validator");
const { errorMessages } = require("../../config/languages");
const ValidateRequest = require("../middlewares/validate-request");

const CreateProductValidator = [
  body("name").isString().withMessage("Product name must be entered"),
  body("description").isString().optional({ nullable: true }),
  body("category")
    .isMongoId()
    .withMessage(errorMessages.REQUIRED_FIELD("'category'")),

  check("units")
    .notEmpty()
    .withMessage(errorMessages.MINIMUM_REQUIRED_FIELD("Unit of measurement"))
    .isArray()
    .withMessage("Unit IDs must be an array"),
  check("units.*").isMongoId().withMessage("Unit IDs must be a valid ID"),

  body("supplier")
    .isMongoId()
    .withMessage(errorMessages.INCORRECT_FIELD("supplier")),

  body("photo")
    .isString()
    .withMessage(errorMessages.INCORRECT_FIELD("Photo url")),

  body("status")
    .isString()
    .withMessage(errorMessages.INCORRECT_FIELD("status")),
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

const UpdateProductValidator = [
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

  body("photo")
    .isString()
    .withMessage(errorMessages.INCORRECT_FIELD("Photo url")),

  body("status")
    .isString()
    .withMessage(errorMessages.INCORRECT_FIELD("status")),
  (req, res, next) => {
    ValidateRequest(req, res, next);
  },
];
module.exports = {
  CreateProductValidator,
  CreateUnitOfMeasurementValidator,
  UpdateProductValidator,
};

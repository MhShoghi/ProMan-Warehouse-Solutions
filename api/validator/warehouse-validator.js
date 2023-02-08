const { body, check, param } = require("express-validator");
const { WAREHOUSE_STATUS } = require("../../config/constants");
const { errorMessages } = require("../../config/languages");
const ValidateRequest = require("../middlewares/validate-request");

const createWarehouseValidation = [
  body("name", "Should not be empty")
    .isString()
    .withMessage(errorMessages.INCORRECT_FIELD("name")),

  body("description")
    .optional()
    .isString()
    .withMessage(errorMessages.INCORRECT_FIELD("description")),

  check("status")
    .optional()
    .isIn([
      WAREHOUSE_STATUS.ACTIVE,
      WAREHOUSE_STATUS.INACTIVE,
      WAREHOUSE_STATUS.OUT_SERVICE,
      WAREHOUSE_STATUS.UNDER_MAINTENANCE,
    ])
    .withMessage(errorMessages.WAREHOUSE_STATUS_ERROR),
  body("location.country")
    .notEmpty()
    .withMessage(errorMessages.REQUIRED_FIELD("country"))
    .isMongoId()
    .withMessage(errorMessages.INCORRECT_FIELD("country")),
  body("location.state")
    .notEmpty()
    .withMessage(errorMessages.REQUIRED_FIELD("state"))
    .isMongoId()
    .withMessage(errorMessages.INCORRECT_FIELD("state")),
  body("location.city")
    .notEmpty()
    .withMessage(errorMessages.REQUIRED_FIELD("city"))
    .isMongoId()
    .withMessage(errorMessages.INCORRECT_FIELD("city")),
  body("location.latitude")
    .notEmpty()
    .withMessage(errorMessages.REQUIRED_FIELD("latitude"))
    .isString()
    .withMessage(errorMessages.INCORRECT_FIELD("latitude")),
  body("location.longitude")
    .notEmpty()
    .withMessage(errorMessages.REQUIRED_FIELD("longitude"))
    .isString()
    .withMessage(errorMessages.INCORRECT_FIELD("longitude")),
  body("location.zipcode")
    .notEmpty()
    .withMessage(errorMessages.REQUIRED_FIELD("zipcode"))
    .isString()
    .withMessage(errorMessages.INCORRECT_FIELD("zipcode")),

  body("photos").isArray().optional({ nullable: true }),
  body("logo").isString().optional({ nullable: true }),
  body("manager.name").isString().optional({ nullable: true }),
  body("manager.phone").isString().optional({ nullable: true }),
  body("manager.email").isString().optional({ nullable: true }),
  body("unique_id").isString().optional({ nullable: true }),

  (req, res, next) => {
    ValidateRequest(req, res, next);
  },
];

const UpdateWarehouseValidation = [
  param("warehouseId")
    .isMongoId()
    .withMessage(errorMessages.REQUIRED_PARAMETER("warehouse ID")),
  (req, res, next) => {
    ValidateRequest(req);
  },
];

const TransferProductValidation = [
  body("from"),
  body("to"),
  body("items"),
  body("type"),
  (req, res, next) => {
    ValidateRequest(req);
  },
];

module.exports = {
  createWarehouseValidation,
  UpdateWarehouseValidation,
  TransferProductValidation,
};

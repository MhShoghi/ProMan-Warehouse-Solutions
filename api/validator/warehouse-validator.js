const { body } = require("express-validator");
const ValidateRequest = require("../middlewares/validate-request");

// FIXME: add a seprate file for translate errors
module.exports.createWarehouseValidation = [
  body("name", "Should not be empty").isString(),
  body("city")
    .isMongoId()
    .withMessage("Just city ID is valid")
    .notEmpty()
    .withMessage("must be enter"),
  body("address").isString().optional({ nullable: true }),
  body("photos").isArray().optional({ nullable: true }),
  body("logo").isString().optional({ nullable: true }),
  body("manager").isString().optional({ nullable: true }),
  body("unique_id").isString().optional({ nullable: true }),
  body("latitude").isString().optional({ nullable: true }),
  body("longitude").isString().optional({ nullable: true }),

  (req, res, next) => {
    ValidateRequest(req, res, next);
  },
];

const { validationResult } = require("express-validator");
const { ValidationError } = require("../../utils/app-errors");

const ValidateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array());
  }

  next();
};

module.exports = ValidateRequest;

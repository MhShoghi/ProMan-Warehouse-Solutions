const errorMessages = require("../config/errorMessages");

const STATUS_CODE = {
  OK: 200,
  BAD_REQUEST: 400,
  UN_AUTHORIZED: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

class AppError extends Error {
  statusCode = null;
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
  serializeErrors() {}
}

// API specific Errors

class APIError extends AppError {
  statusCode = STATUS_CODE.INTERNAL_ERROR;
  constructor(message, errors) {
    super(message);
    this.errors = errors;
  }

  serializeErrors() {
    return { message: this.message, errors: this.errors };
  }
}

// 400
class BadRequestError extends AppError {
  statusCode = STATUS_CODE.BAD_REQUEST;
  constructor(message) {
    super(message);
  }

  serializeErrors() {
    return { message: this.message };
  }
}

// 400 Validation Error
class ValidationError extends AppError {
  statusCode = STATUS_CODE.BAD_REQUEST;

  constructor(errors) {
    super("Invalid request parameters");

    this.errors = errors;
  }
  serializeErrors() {
    return this.errors.map((err) => {
      return { message: err.msg, field: err.param };
    });
  }
}

class UserIsNotExistError extends AppError {
  statusCode = STATUS_CODE.NOT_FOUND;
  constructor(message) {
    super(message);
  }
  serializeErrors() {
    return { message: this.message };
  }
}

class OTPCodeIsWrongError extends AppError {
  statusCode = STATUS_CODE.BAD_REQUEST;
  constructor() {
    super("OTP Code is wrong!");
  }
  serializeErrors() {
    return { message: this.message };
  }
}

class OTPCodeIsExpiredError extends AppError {
  statusCode = STATUS_CODE.BAD_REQUEST;
  constructor() {
    super("OTP Code expired!");
  }
  serializeErrors() {
    return { message: this.message };
  }
}

class UserIsExistError extends AppError {
  statusCode = STATUS_CODE.BAD_REQUEST;
  constructor(message) {
    super(message);
  }

  serializeErrors() {
    return { message: this.message };
  }
}

class EnteredPasswordIsIncorrectError extends AppError {
  statusCode = STATUS_CODE.BAD_REQUEST;
  constructor(message = null) {
    super(message ?? errorMessages.INVALID_PASSWORD);
  }

  serializeErrors() {
    return { message: this.message };
  }
}

class PasswordMismatchError extends AppError {
  statusCode = STATUS_CODE.BAD_REQUEST;

  constructor(message = null) {
    super(message ?? errorMessages.PASSWORD_MISMATCH);
  }
  serializeErrors() {
    return { message: this.message };
  }
}

class CustomError extends AppError {
  constructor(message, statusCode = 400) {
    super(message, statusCode);
    this.statusCode = statusCode;
  }

  serializeErrors() {
    return { message: this.message };
  }
}

module.exports = {
  AppError,
  APIError,
  BadRequestError,
  OTPCodeIsWrongError,
  OTPCodeIsExpiredError,
  EnteredPasswordIsIncorrectError,
  PasswordMismatchError,
  UserIsExistError,
  UserIsNotExistError,
  ValidationError,
  CustomError,
  STATUS_CODE,
};

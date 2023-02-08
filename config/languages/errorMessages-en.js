const { WAREHOUSE_STATUS } = require("../constants");

const errorMessages = {
  // Common Errors
  REQUIRED_FIELD: (field) => `${field} is a required field.`,
  MINIMUM_REQUIRED_FIELD: (field) => `At least one ${field} is required`,
  REQUIRED_PARAMETER: (param) => `${param} is a required parameter.`,
  INCORRECT_FIELD: (field) => `${field} field is not correct`,
  UNABLE_TO_CREATE: (field) => `Unable to create a ${field}`,
  UNABLE_TO_GET: (field) => `Unable to get ${field}`,
  UNABLE_TO_DELETE: (field) => `Unable to delete ${field}`,
  UNABLE_TO_UPDATE: (field) => `Unable to update ${field}`,
  NOT_FOUND: (field) => `${field} not found.`,
  QUERY_PARAM_NOT_FOUND: (field) => `${field} parameters not found.`,
  IS_NOT_VALID: (field) => `${field} is not valid`,

  // AUTH
  UNAUTHORIZED: "You are not allowed to do this.",

  // Users
  INVALID_PASSWORD: "The password is incorrect. Please try again",
  PASSWORD_MISMATCH:
    "The password and confirm password do not match. Please try again",

  PASSWORD_EQUAL:
    "New password cannot be the same as the last password. Please choose a different password!",
  USER_NOT_FOUND: "User not found!",

  // Warehouse
  WAREHOUSE_NOT_FOUND: "Warehouse not found!",
  WAREHOUSE_STATUS_ERROR: `The status of the warehouse should be one of the ${WAREHOUSE_STATUS.ACTIVE}, ${WAREHOUSE_STATUS.INACTIVE}, ${WAREHOUSE_STATUS.OUT_SERVICE} or ${WAREHOUSE_STATUS.UNDER_MAINTENANCE}`,

  // Country
  COUNTRY_NOT_FOUND: "Country not found.",

  //
  STATE_NOT_FOUND: "State not found.",

  CITY_NOT_FOUND: "City not found.",

  CATEGORY_NOT_FOUND: "Category Not Found!",

  SUPPLIER_ID_IS_NOT_VALID: "Supplier ID is not valid",
};

module.exports = errorMessages;

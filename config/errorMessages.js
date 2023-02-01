const errorMessages = {
  INVALID_PASSWORD: "The password is incorrect. Please try again",
  PASSWORD_MISMATCH:
    "The password and confirm password do not match. Please try again",
  REQUIRED_FIELD: (field) => `${field} is a required field.`,
  PASSWORD_EQUAL:
    "New password cannot be the same as the last password. Please choose a different password!",
  USER_NOT_FOUND: "User not found!",

  WAREHOUSE_NOT_FOUND: "Warehouse not found!",

  COUNTRY_NOT_FOUND: "Country not found.",

  STATE_NOT_FOUND: "State not found.",

  CITY_NOT_FOUND: "City not found.",
};

module.exports = errorMessages;

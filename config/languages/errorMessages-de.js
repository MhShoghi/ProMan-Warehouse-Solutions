const errorMessages = {
  // Common Errors
  REQUIRED_FIELD: (field) => `${field} ist ein Pflichtfeld.`,
  INCORRECT_FIELD: (field) => `${field} feld ist nicht korrekt`,
  UNABLE_TO_CREATE: (field) => `Unable to create a ${field}`,
  // Password
  INVALID_PASSWORD: "The password is incorrect. Please try again",
  PASSWORD_MISMATCH:
    "The password and confirm password do not match. Please try again",

  PASSWORD_EQUAL:
    "New password cannot be the same as the last password. Please choose a different password!",
  USER_NOT_FOUND: "User not found!",

  // WAREHOUSE
  WAREHOUSE_NOT_FOUND: "Warehouse not found!",

  // COUNTRY
  COUNTRY_NOT_FOUND: "Country not found.",

  //STATE
  STATE_NOT_FOUND: "State not found.",

  // CITY
  CITY_NOT_FOUND: "City not found.",

  // CATEGORY
  CATEGORY_NOT_FOUND: "Kategorie nicht gefunden",
};

module.exports = errorMessages;

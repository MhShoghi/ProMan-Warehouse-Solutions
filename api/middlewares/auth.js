const jwt = require("jsonwebtoken");

// Internal libraries
const { ACCESS_TOKEN_SECRET } = require("../../config");
const { CustomError } = require("../../utils/app-errors");

module.exports = async (req, res, next) => {
  try {
    const signature = req.get("Authorization") || req.headers.authorization;

    if (!signature) {
      throw new CustomError("No authorization header found", 401);
    }

    jwt.verify(signature.split(" ")[1], ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        if (err instanceof jwt.TokenExpiredError) {
          throw new CustomError("Token expired", 401);
        }

        throw new CustomError("Invalid token", 401);
      }

      req.user = user;

      next();
    });
  } catch (err) {
    next(err);
  }
};

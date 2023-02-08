// External libraries
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { differenceInSeconds } = require("date-fns");

// Internal libraries
const {
  APP_SECRET,
  ACCESS_TOKEN_EXPIRE_TIME,
  REFRESH_TOKEN_EXPIRE_TIME,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  COOKIE_MAX_AGE,
} = require("../config");
const { CustomError } = require("./app-errors");

// Utility Functions
module.exports.GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

module.exports.GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

module.exports.ValidatePassword = async (
  eneteredPassword,
  savedPassword,
  salt
) => {
  return (
    (await this.GeneratePassword(eneteredPassword, salt)) === savedPassword
  );
};

// FIXME: fix the validator
module.exports.ValidateSignature = async (req) => {
  const signature = req.get("Authorization") || req.headers.authorization;

  if (!signature) {
    throw new CustomError("No authorization header found", 401);
  }

  jwt.verify(
    signature.split(" ")[1],
    process.env.ACCESS_TOKEN_SECRET,
    (err, user) => {
      if (err) {
        if (err instanceof jwt.TokenExpiredError) {
          throw new CustomError("Token expired", 401);
          // return res.status(401).json({ message: "Token expired" });
        }

        throw new CustomError("Invalid token", 401);
        // return res.status(401).json({ message: "Invalid token" });
      }

      req.user = user;

      return true;
    }
  );

  return false;
};

module.exports.GenerateAccessToken = async (payload) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRE_TIME,
  });
};

module.exports.GenerateRefreshToken = async (payload) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRE_TIME,
  });
};

module.exports.GenerateUniqueID = async (payload) => {};

module.exports.FormateData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not Found!");
  }
};

module.exports.GenerateOTP = () => {
  let otpCode = "";
  while (otpCode.length < 5) {
    otpCode += "";
    otpCode += Math.floor(1000 + Math.random() * 90000);
  }
  return otpCode;
};

module.exports.CheckInputIsEmailOrPersonalCode = (input) => {
  return input.includes("@")
    ? "email"
    : /^\d/.test(input)
    ? "personalCode"
    : null;
};

module.exports.CheckTimeDiff = (startTime, endTime) => {
  return differenceInSeconds(
    new Date(startTime),
    endTime == null ? new Date() : new Date(endTime)
  );
};

module.exports.SaveCookie = (res, key, value) => {
  // Create secure cookie with refresh token
  res.cookie(key, value, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: COOKIE_MAX_AGE,
  });
};

module.exports.Response = (
  res,
  message,
  data = null,
  error = null,
  statusCode = 200
) => {
  res.status(statusCode).json({
    success: error ? false : true,
    message,
    ...(data && { data }),
    ...(error && { error }),
  });
};

module.exports.GetFilters = (limit, page) => {
  const startIndex = (page - 1) * 10;
  const endIndex = page * limit;

  return { limit, page, startIndex, endIndex };
};

/** Create pagination object based on total count and filters
 * @param {*} param0
 * @param {*} total
 * @returns
 */
module.exports.GetPagination = (
  { page, limit, startIndex, endIndex },
  total
) => {
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  return pagination;
};

/** Select Field
 * @param {*} fields
 * @returns
 */
module.exports.SelectField = (fields = []) => {
  let selectString = "";

  console.log(typeof fields);
  fields.forEach((key, i) => {
    let str = "-" + key + " ";
    selectString += str;
  });

  return selectString.trim();
};

/** Generate JWT Payload based on type (refersh or access)
 * @param {*} user
 * @param {*} type
 * @returns
 */
module.exports.JWTPayload = (user, type) => {
  console.log(user);

  const role = type === "access" ? { role: user.role } : null;
  const email = type === "access" ? { email: user.email } : null;
  return {
    id: user._id,
    ...(role && role),
    ...(email && email),
  };
};

module.exports.IsValidObjectID = (string) => {
  return mongoose.Types.ObjectId.isValid(string);
};

module.exports.Error = ({ message, status, err }) => {
  throw new CustomError(message, status, err);
};

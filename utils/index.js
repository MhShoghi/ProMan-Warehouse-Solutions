const bcrypt = require("bcrypt");
const { differenceInSeconds } = require("date-fns");
const jwt = require("jsonwebtoken");

const {
  APP_SECRET,
  ACCESS_TOKEN_EXPIRE_TIME,
  REFRESH_TOKEN_EXPIRE_TIME,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  COOKIE_MAX_AGE,
} = require("../config");

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

// FIXME: should be fixed
module.exports.GenerateSignature = async (payload) => {
  return await jwt.sign(payload, APP_SECRET, { expiresIn: "1d" });
};

module.exports.ValidateSignature = async (req) => {
  const signature = req.get("Authorization");

  console.log(signature);

  if (signature) {
    const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
    req.user = payload;
    return true;
  }

  return false;
};

module.exports.GenerateAccessToken = async (payload) => {
  return await jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRE_TIME,
  });
};

module.exports.GenerateRefreshToken = async (payload) => {
  return await jwt.sign(payload, REFRESH_TOKEN_SECRET, {
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

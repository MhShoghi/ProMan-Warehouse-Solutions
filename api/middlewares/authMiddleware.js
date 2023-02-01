const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, please login");
    }

    // Verify Token and destructure id from token
    const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Get User by id from token;

    const user = await User.findById(id).select("-password").exec();

    if (!user) {
      res.status(400);
      throw new Error("User not found!");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401);
    throw new Error("Not authorized. Please login!");
  }
});

module.exports = protect;

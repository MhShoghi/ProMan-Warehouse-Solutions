const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET } = require("../../config");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startWith("Bearer ")) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); // Invalid Token
    req.user = decoded.username;
    // FIXME: fix this verify method with correct data
    next();
  });
};

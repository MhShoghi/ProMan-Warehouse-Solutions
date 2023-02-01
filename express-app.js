const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const HandleErrors = require("./utils/error-handler");
const credentials = require("./api/middlewares/credentials");
const corsOptions = require("./config/corsOptions");
const {
  warehouse,
  auth,
  user,
  product,
  supplier,
  project,
  country,
  city,
  state,
} = require("./api");
const morgan = require("morgan");
const router = require("express").Router;

module.exports = async (app) => {
  // Critical Middlewares

  app.use(morgan("common"));
  app.use(credentials);
  app.use(express.json({ limit: "1mb" }));
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  // API

  user(app);

  auth(app);
  warehouse(app);

  country(app);
  state(app);
  city(app);

  product(app);
  supplier(app);
  project(app);

  app.all("*", (req, res) => {
    res.json({ message: "API Base Control System" });
  });

  // Error Handling
  app.use(HandleErrors);
};

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Initialize App
const app = express();

// Initialize PORT
const PORT = process.env.APP_PORT || 5000;

// Connect to DB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`App started on Port ${PORT} `);
    });
  })
  .catch((err) => {
    console.error(err);
  });

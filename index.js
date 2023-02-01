const express = require("express");
const { PORT } = require("./config");
const { databaseConnnection } = require("./database");
const expressApp = require("./express-app");
const router = express.Router();

// StartServer Function
const StartServer = async () => {
  const app = express();

  await databaseConnnection();

  await expressApp(app);

  app
    .listen(PORT, () => {
      console.log(`Listening to port ${PORT}`);
    })
    .on("error", (err) => {
      console.log(err);
      process.exit();
    });
};

StartServer();

const mongoose = require("mongoose");
const { logger, logEvents } = require("../api/middlewares/logger");

const { DB_URL } = require("../config");

module.exports = async () => {
  try {
    await mongoose.connect(DB_URL);

    console.log("DB Connected");
  } catch (error) {
    console.log("========== DB Connection Error ==========");
    console.log(error.message);

    process.exit(1);
  }
};

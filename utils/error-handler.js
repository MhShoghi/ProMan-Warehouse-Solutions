const { createLogger, transports } = require("winston");
const { Response } = require(".");
const { AppError } = require("./app-errors");
const Sentry = require("@sentry/node");

const LogErrors = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ dirname: "logs", filename: "app_error.log" }),
  ],
});

class ErrorLogger {
  constructor() {}

  async logError(err) {
    console.log("============== Start Error Logger ==============");

    LogErrors.log(
      "error",
      `status: ${err.statusCode} - message: ${
        err.message
      } - date: ${new Date()}`
    );
    console.log("============== End Error Logger ==============");

    // log error with Logger plugins

    return false;
  }
}

const ErrorHandler = async (err, req, res, next) => {
  Sentry.captureException(err);
  const errorLogger = new ErrorLogger();

  process.on("uncaughtException", (reason, promise) => {
    console.log(reason, "UNHANDLED");
    throw reason; // need to take care
  });

  process.on("uncaughtException", (error) => {
    if (errorLogger.isTrustError(err)) {
      //process exist // need restart
    }
  });

  if (err) {
    if (err instanceof AppError) {
      await errorLogger.logError(err);

      return Response(
        res,
        "Error",
        null,
        err.serializeErrors(),
        err.statusCode,
        err.message
      );
    }
    return Response(res, "Something went wrong", null, err.message, 500);
  }
};

module.exports = ErrorHandler;

// FIXME: fix error handler to better handler

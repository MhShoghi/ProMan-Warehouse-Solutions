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
  category,
  upload,
} = require("./api");
const morgan = require("morgan");

const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const { ProfilingIntegration } = require("@sentry/profiling-node");

module.exports = async (app) => {
  Sentry.init({
    dsn: "https://b9ae2055b3fb461a81aaa2810da36ba5@o462825.ingest.sentry.io/4504617353084928",
    tracesSampleRate: 1.0,
    integrations: [
      // add profiling integration
      new ProfilingIntegration(),

      new Tracing.Integrations.Express({
        // to trace all requests to the default router
        app,
        // alternatively, you can specify the routes you want to trace:
        // router: someRouter,
      }),
    ],
    profilesSampleRate: 1.0,
  });
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());

  // Critical Middlewares
  app.use(morgan("common"));

  app.use(express.static("/uploads/"));
  app.use(credentials);
  app.use(express.json({ limit: "1mb" }));
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  // API

  const transaction = Sentry.startTransaction({
    op: "transaction",
    name: "My Transaction",
  });

  // Any code executed between startTransaction and transaction.finish
  // will now be automatically profiled.

  user(app);

  auth(app);
  warehouse(app);

  country(app);
  state(app);
  city(app);

  category(app);
  product(app);
  supplier(app);
  project(app);

  upload(app);

  app.all("*", (req, res) => {
    res.json({ message: "API Base Control System" });
  });

  transaction.finish();

  // Your app routes and middleware go here

  // Error Handling
  app.use(HandleErrors);
  app.use(Sentry.Handlers.errorHandler());
};

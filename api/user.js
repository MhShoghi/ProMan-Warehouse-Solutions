const UserService = require("../services/user-service");
const { registerUserValidator } = require("./validator/user-validator");
const router = require("express").Router();
module.exports = (app) => {
  // Import service
  const Service = new UserService();

  // Register User
  app.post("/users", registerUserValidator, async (req, res, next) => {
    try {
      const { data } = await Service.CreateUser(req.body);

      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/users", async (req, res, next) => {
    try {
      const { data } = await Service.GetAllUsers();
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  // ROUTE for Own user
  app.patch("/users/change-password", async (req, res, next) => {
    try {
      await Service.ChangePassword(req.body);
    } catch (err) {
      next(err);
    }
  });

  // ROUTE for ADMIN
  app.post("/users/change-password/:userId", (req, res, next) => {
    try {
    } catch (err) {
      next(err);
    }
  });

  app.use("/api/v1", router);
};

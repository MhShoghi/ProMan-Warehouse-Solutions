const UserService = require("../services/user-service");
const { Response, GetFilters, GetPagination } = require("../utils");
const { CustomError } = require("../utils/app-errors");
const { UserValidator } = require("./validator");
const { errorMessages } = require("../config/languages");
const auth = require("./middlewares/auth");
const Email = require("../utils/Email");

module.exports = (app) => {
  // Import service
  const Service = new UserService();

  // Register User
  app.post(
    "/users",
    UserValidator.registerUserValidator,
    auth,
    async (req, res, next) => {
      try {
        // Get user object from request
        const userObj = req.user;

        // if user is not admin and type === admin throw new Error => Unauthorized
        if (userObj.role !== "admin" && req.body.role === "admin")
          throw new CustomError(errorMessages.UNAUTHORIZED, 401);

        // Create new user
        const user = await Service.CreateUser(req.body);

        // TODO: Send email to user
        // await Email.Send(user.email, "welcome");

        Response(res, "Create new User", user, null, 201);
      } catch (err) {
        next(err);
      }
    }
  );

  app.get("/users", async (req, res, next) => {
    try {
      const limit = req.query.limit || 10;
      const page = req.query.page || 1;
      const filters = GetFilters(limit, page);
      const { users, total } = await Service.GetAllUsers(filters);

      const pagination = GetPagination(filters, total);

      Response(
        res,
        "Get users",
        { pagination, count: users.length, users },
        null,
        200
      );
    } catch (err) {
      next(err);
    }
  });

  // Update a user by id
  app.put("/users/:userId?", auth, async (req, res, next) => {
    const userId =
      req.params.userId || ((!req.params.userId && req.user.id) ?? req.user.id);

    console.log(userId);
    return;
    try {
      const updatedUser = await Service.UpdateUserById(userId, req.body);

      Response(res, "Update user", { user: updatedUser }, null, 200);
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

  app.post("/users/activity/:userId", async (req, res, next) => {
    const userId = req.params.userId;

    try {
      const activities = await Service.GetUserActivities(userId);

      Response(res, "Get user activity", activities, null, 200);
    } catch (err) {
      next(err);
    }
  });
};

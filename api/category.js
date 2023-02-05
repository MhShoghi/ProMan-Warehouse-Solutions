const CategoryService = require("../services/category-service");
const { Response } = require("../utils");

const CategoryValidator = require("./validator/category-validator");

module.exports = (app) => {
  const Service = new CategoryService();

  app.post("/categories", async (req, res, next) => {
    try {
      const category = await Service.AddCategory(req.body);

      Response(res, "Add category successfully added.", category, null, 200);
    } catch (err) {
      console.log(err);
      next(err);
    }
  });

  app.put(
    "/categories/:categoryId",
    CategoryValidator.UpdateCategoryValidator,
    async (req, res, next) => {
      const categoryId = req.params.categoryId;
      const name = req.body.name;
      try {
        const updatedCategory = await Service.UpdateCategoryById(
          categoryId,
          name
        );

        Response(
          res,
          "Updated successfuly",
          { category: updatedCategory },
          null,
          200
        );
      } catch (err) {
        next(err);
      }
    }
  );
};

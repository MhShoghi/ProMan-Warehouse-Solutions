const { CategoryRepository } = require("../database");
const { CustomError } = require("../utils/app-errors");

class CategoryService {
  constructor() {
    this.repository = new CategoryRepository();
  }

  async AddCategory({ name }) {
    // Category is exist
    const isExist = await this.repository.FindCategoryByName(name);

    // throw new error
    if (isExist)
      throw new CustomError("Category with this name is exist!", 400);

    return await this.repository.AddCategory(name);
  }

  async GetCatagories() {
    return await this.repository.Categories();
  }

  async DeleteCategoryById(categoryId) {
    return await this.repository.DeleteCategory(categoryId);
  }

  async UpdateCategoryById(categoryId, name) {
    // Check category name is exist with this name
    const categoryNameIsExist = await this.repository.FindCategoryByName(name);

    console.log(categoryNameIsExist);
    if (categoryNameIsExist)
      throw new CustomError(
        "Category name is exist. Choose another name.",
        400
      );

    return await this.repository.UpdateCategory(categoryId, name);
  }
}

module.exports = CategoryService;

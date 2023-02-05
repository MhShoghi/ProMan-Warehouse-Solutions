const { CustomError } = require("../../utils/app-errors");
const { CategoryModel } = require("../models");
const Category = require("../models/Category");

class CategoryRepository {
  // Category Repository

  async AddCategory(name) {
    try {
      const category = new CategoryModel({
        name,
      });

      return await category.save();
    } catch (err) {
      console.log(err);
      throw new CustomError("Unable to add category");
    }
  }

  async Categories() {
    try {
      return await CategoryModel.find().lean();
    } catch (err) {
      throw new CustomError("Unable to get categories");
    }
  }

  async FindCategoryById(categoryId) {
    try {
      return await CategoryModel.findById(categoryId);
    } catch (err) {
      console.log(err);
      throw new CustomError("Unable to get category");
    }
  }

  async FindCategoryByName(name) {
    try {
      const category = await Category.findOne({ name });
      return category;
    } catch (err) {
      throw new CustomError("Unable to get category");
    }
  }

  async DeleteCategory(categoryId) {
    try {
      await CategoryModel.findByIdAndDelete(categoryId);
    } catch (err) {
      throw new CustomError("Unable to delete category");
    }
  }

  async UpdateCategory(categoryId, name) {
    try {
      const updatedCategory = await CategoryModel.findByIdAndUpdate(
        categoryId,
        { name },
        { new: true }
      );

      return updatedCategory;
    } catch (err) {
      throw new CustomError("Unable to update category");
    }
  }
}

module.exports = CategoryRepository;

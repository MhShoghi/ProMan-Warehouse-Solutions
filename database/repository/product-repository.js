const { APIError } = require("../../utils/app-errors");
const { ProductModel } = require("../models");

class ProductRepository {
  async CreateProduct({
    name,
    description,
    type,
    unit,
    available,
    supplier,
    banner,
  }) {
    try {
      const product = new ProductModel({
        name,
        description,
        type,
        unit,
        available,
        supplier,
        banner,
      });

      const productResult = await product.save();
      return productResult;
    } catch (err) {
      throw APIError("Unable to create Product");
    }
  }

  async GetProducts() {
    try {
      return await ProductModel.find();
    } catch (err) {
      throw APIError("Unable to get Products");
    }
  }

  async FindProductById(id) {
    try {
      return await ProductModel.findById(id);
    } catch (err) {
      throw APIError("Unable to get product");
    }
  }

  async FindSelectedProduct(selectedIds) {
    try {
      const products = await ProductModel.find()
        .where("_id")
        .in(selectedIds.map((_id) => _id))
        .exec();

      return products;
    } catch (err) {
      throw APIError("Unable to Find Product");
    }
  }
}

module.exports = ProductRepository;

const { APIError, CustomError } = require("../../utils/app-errors");
const { ProductModel } = require("../models");

class ProductRepository {
  async CreateProduct(product) {
    try {
      const savedProduct = new ProductModel({
        name: product.name,
        description: product.description,
        unit: product.unit,
        category: product.category,
        status: product.status ?? false,
        supplier: product.supplier,
        photo: product.photo,
      });

      const productResult = await savedProduct.save();
      return productResult;
    } catch (err) {
      throw new CustomError("Unable to create Product");
    }
  }

  async GetProducts(filter) {
    console.log(filter);
    try {
      const products = await ProductModel.find()
        .limit(filter.limit)
        .skip(filter.startIndex);
      const total = await ProductModel.countDocuments();

      return { products, total };
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

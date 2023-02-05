const { errorMessages } = require("../../config/languages");
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
        status: product.status,
        supplier: product.supplier,
        photo: product.photo,
      });

      const productResult = await savedProduct.save();
      return productResult;
    } catch (err) {
      throw new CustomError(
        errorMessages.UNABLE_TO_CREATE("product"),
        500,
        err.message
      );
    }
  }

  async GetProducts(filter) {
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

  async UpdateProduct(productId, input) {
    try {
      return await ProductModel.findByIdAndUpdate(
        productId,
        {
          $set: input,
        },
        { new: true }
      );
    } catch (err) {
      throw new CustomError(errorMessages.UNABLE_TO_UPDATE("product"));
    }
  }

  async DeleteProduct(productId) {
    try {
      return await ProductModel.findOneAndDelete({ _id: productId });
    } catch (err) {
      throw new CustomError(
        errorMessages.UNABLE_TO_DELETE("product"),
        500,
        err.message
      );
    }
  }

  async FindProductsByCondition(condition) {
    console.log(condition);
    try {
      return ProductModel.find(condition);
    } catch (err) {
      throw new CustomError(errorMessages.UNABLE_TO_GET("product"));
    }
  }
}

module.exports = ProductRepository;

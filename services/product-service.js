const { ProductRepository } = require("../database");
const { FormateData } = require("../utils");

class ProductService {
  constructor() {
    this.repository = new ProductRepository();
  }

  async CreateProduct(productInputs) {
    const productResult = await this.repository.CreateProduct(productInputs);
    return FormateData(productResult);
  }

  async GetProductDescription(productId) {
    const product = await this.repository.FindProductById(productId);
    return FormateData(product);
  }

  async GetProducts() {
    const products = await this.repository.GetProducts();

    let categories = {};
    products.map(({ type }) => {
      categories[type] = type;
    });

    return FormateData({
      products,
      categories: Object.keys(categories),
    });
  }

  async TransferProductToWarehouse() {}
}

module.exports = ProductService;

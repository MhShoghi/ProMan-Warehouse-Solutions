const { errorMessages } = require("../config/languages");
const {
  ProductRepository,
  CategoryRepository,
  SupplierRepository,
} = require("../database");
const { FormateData } = require("../utils");
const { CustomError } = require("../utils/app-errors");

class ProductService {
  constructor() {
    this.repository = new ProductRepository();
    this.categoryRepository = new CategoryRepository();
    this.supplierRepository = new SupplierRepository();
  }

  async CreateProduct(productInputs) {
    try {
      // Check category ID is exist or not
      const category = await this.categoryRepository.FindCategoryById(
        productInputs.category
      );
      if (!category) throw new CustomError(errorMessages.CATEGORY_NOT_FOUND);

      // Check supplier Id is exist or not
      const supplier = await this.supplierRepository.FindSupplierById(
        productInputs.supplier
      );
      if (!supplier) throw new CustomError(errorMessages.SUPPLIER_NOT_FOUND);

      // Create new product
      return await this.repository.CreateProduct(productInputs);
    } catch (err) {
      throw new CustomError(err.message, err.statusCode);
    }
  }

  async GetProductDescription(productId) {
    const product = await this.repository.FindProductById(productId);
    return FormateData(product);
  }

  async GetProducts(filter) {
    const { products, total } = await this.repository.GetProducts(filter);

    return { products, total };
  }

  async TransferProductToWarehouse() {}
}

module.exports = ProductService;

const { errorMessages } = require("../config/languages");
const {
  ProductRepository,
  CategoryRepository,
  SupplierRepository,
} = require("../database");
const { FormateData, IsValidObjectID } = require("../utils");
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

  async UpdateProductById(productId, inputs) {
    // Check category ID is exist or not
    const category = await this.categoryRepository.FindCategoryById(
      inputs.category
    );
    if (!category) throw new CustomError(errorMessages.CATEGORY_NOT_FOUND);

    // Check supplier Id is exist or not
    const supplier = await this.supplierRepository.FindSupplierById(
      inputs.supplier
    );
    if (!supplier) throw new CustomError(errorMessages.SUPPLIER_NOT_FOUND);

    // Create new product
    return await this.repository.UpdateProduct(productId, inputs);
  }

  async DeleteProductById(productId) {
    return await this.repository.DeleteProduct(productId);
  }

  async GetProductsBySupplier(supplierId) {
    // Check supplier id is valid or not
    if (!IsValidObjectID(supplierId))
      throw new CustomError(errorMessages.SUPPLIER_ID_IS_NOT_VALID);
    // Check supplier is exist
    const supplier = await this.supplierRepository.FindSupplierById(supplierId);

    console.log(supplier);
    if (!supplier) throw new CustomError(errorMessages.SUPPLIER_NOT_FOUND);

    return await this.repository.FindProductsByCondition({
      supplier: supplier._id,
    });

    // throw error
  }
}

module.exports = ProductService;

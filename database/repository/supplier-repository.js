const { APIError, CustomError } = require("../../utils/app-errors");
const { SupplierModel } = require("../models");

class SupplierRepository {
  async CreateSupplier({ name, address, type, phone, manager }) {
    try {
      const supplier = new SupplierModel({
        name,
        address,
        type,
        phone,
        manager,
      });

      return await supplier.save();
    } catch (err) {
      throw APIError("Unable to create Product");
    }
  }

  async FindSupplierById(supplierId) {
    return await SupplierModel.findById(supplierId);
  }

  async FindSupplierByName(supplierName) {
    return await SupplierModel.find({ name: supplierName });
  }

  async Suppliers(filters) {
    try {
      const results = await SupplierModel.find()
        .limit(filters.limit)
        .skip(filters.startIndex);

      const total = await SupplierModel.countDocuments();

      return { results, total };
    } catch (err) {
      throw new CustomError("Unable to get suppliers");
    }
  }

  async UpdateSupplierById(supplierId, updateDoc) {
    try {
      return await SupplierModel.findByIdAndUpdate(supplierId, updateDoc, {
        new: true,
      });
    } catch (err) {
      throw APIError("Unable to update supplier");
    }
  }
}

module.exports = SupplierRepository;

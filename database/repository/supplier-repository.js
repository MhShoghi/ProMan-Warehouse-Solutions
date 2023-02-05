const { errorMessages } = require("../../config/languages");
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
    try {
      return await SupplierModel.findById(supplierId);
    } catch (err) {
      console.log(err);
      throw new CustomError(errorMessages.UNABLE_TO_GET("supplier"));
    }
  }

  async FindSupplier(key, value) {
    try {
      return await SupplierModel.find({ [key]: value });
    } catch (err) {
      throw new CustomError(errorMessages.UNABLE_TO_GET("supplier"));
    }
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
      throw new CustomError(errorMessages.UNABLE_TO_UPDATE("supplier"));
    }
  }

  async DeleteSupplierById(supplierId) {
    try {
      await SupplierModel.findByIdAndDelete(supplierId);
    } catch (err) {
      throw new CustomError(errorMessages.UNABLE_TO_DELETE("supplier"));
    }
  }

  async FindSupplierByName(query) {
    try {
      return await SupplierModel.find({ name: new RegExp(query, "i") });
    } catch (err) {
      throw new CustomError(errorMessages.UNABLE_TO_GET("supplier"));
    }
  }
}

module.exports = SupplierRepository;

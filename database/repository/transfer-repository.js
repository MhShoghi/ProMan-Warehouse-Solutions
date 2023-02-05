const { errorMessages } = require("../../config/languages");
const { CustomError } = require("../../utils/app-errors");
const { TransferModel } = require("../models");

class TransferRepository {
  async newTransfer(input) {
    try {
      const transfer = new TransferModel({
        products: input.products,
        fromWarehouse: input.fromWarehouse,
        toWarehouse: input.toWarehouse,
        type: input.type,
        ...(input.status && { status: input.status }),
      });

      return await transfer.save();
    } catch (err) {
      throw new CustomError(errorMessages.UNABLE_TO_CREATE("transfer", 500));
    }
  }

  async Transfers(filters) {
    try {
      const transfers = await TransferModel.find()
        .limit(filters.limit)
        .skip(filters.startIndex);

      return transfers;
    } catch (err) {
      throw new CustomError(errorMessages.UNABLE_TO_GET("transfers"));
    }
  }

  async GetTransfersByCondition(condition = {}) {
    try {
      const transfers = await TransferModel.find({ $and: [condition] });

      return transfers;
    } catch (err) {
      throw new CustomError(errorMessages.UNABLE_TO_GET("transfer"));
    }
  }
}

module.exports = TransferRepository;

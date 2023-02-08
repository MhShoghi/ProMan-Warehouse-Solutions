const { errorMessages } = require("../../config/languages");
const { CustomError } = require("../../utils/app-errors");
const { TransferModel } = require("../models");
const uuid = require("uuid");
class TransferRepository {
  async AddTransfer({ products, from, to, type, status }) {
    try {
      const transfer = new TransferModel({
        products,
        from,
        to,
        type,
        transferNumber: uuid.v4(),
        ...(status && { status }),
      });

      return await transfer.save();
    } catch (err) {
      throw new CustomError(
        errorMessages.UNABLE_TO_CREATE("transfer", err.statusCode)
      );
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

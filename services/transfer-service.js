const { TRANSFER_STATUS } = require("../config/constants");
const TransferRepository = require("../database/repository/transfer-repository");

class TransferService {
  constructor() {
    this.repository = new TransferRepository();
  }

  async NewTransfer({ products, from, to, type, status }) {
    const input = { products, from, to, type, status };
    return await this.repository.AddTransfer(input);
  }

  async UpdateTransferById(transferId, inputs) {
    const updatedTransfer = await this.repository.UpdateTranfer(
      transferId,
      inputs
    );

    return updatedTransfer;
  }

  async ChangeStatus(
    transfer,
    status = TRANSFER_STATUS.COMPLETED,
    session = null
  ) {
    try {
      transfer.status = status;
      await transfer.save({ session });
      return { success: true };
    } catch (error) {
      Error({
        message: "Update transfer failed",
        status: err.statusCode,
        err: err.message,
      });
    }
  }
}

module.exports = TransferService;

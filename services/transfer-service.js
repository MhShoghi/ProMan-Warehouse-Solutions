const TransferRepository = require("../database/repository/transfer-repository");

class TransferService {
  constructor() {
    this.repository = new TransferRepository();
  }

  async NewTransfer({ products, from, to, type, status }) {
    const input = { products, from, to, type, status };
    return await this.repository.AddTransfer(input);
  }
}

module.exports = TransferService;

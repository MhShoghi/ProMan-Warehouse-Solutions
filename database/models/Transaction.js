const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TransactionSchema = new Schema(
  {
    amount: Number,
    status: String,
    txnId: String,
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "product" },
        unit: { type: Number },
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

module.exports = mongoose.model("transaction", TransactionSchema);

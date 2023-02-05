const mongoose = require("mongoose");
const uuid = require("uuid");
const { TRANSFER_STATUS, TRANSFER_TYPES } = require("../../config/constants");

const Schema = mongoose.Schema;

const transferSchema = new Schema(
  {
    transferNumber: {
      type: String,
      unique: true,
      default: uuid.v1(),
    },
    fromWarehouse: {
      type: mongoose.SchemaTypes.ObjectId,
    },
    toWarehouse: {
      type: mongoose.SchemaTypes.ObjectId,
    },
    status: {
      type: String,
      enum: [
        TRANSFER_STATUS.PENDING,
        TRANSFER_STATUS.APPROVED,
        TRANSFER_STATUS.EXECUTED,
        TRANSFER_STATUS.REJECTED,
      ],
      default: TRANSFER_STATUS.PENDING,
    },
    products: [
      {
        product: { type: mongoose.SchemaTypes.ObjectId, ref: "product" },
        unit: String,
        quantity: Number,
      },
    ],
    type: {
      type: String,
      enum: [
        TRANSFER_TYPES.STATIC_TO_STATIC,
        TRANSFER_TYPES.STATIC_TO_PORTABLE,
        TRANSFER_TYPES.PORTABLE_TO_STATIC,
        TRANSFER_TYPES.PORTABLE_TO_PORTABLE,
      ],
      default: TRANSFER_TYPES.STATIC_TO_STATIC,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Transfer = mongoose.model("transfer", transferSchema);

transferSchema.pre("save", async function (next) {
  const transfer = this;
  let transferNumber = transfer.transferNumber;
  while (await Transfer.exists({ transferNumber })) {
    transferNumber = uuid.v1();
  }
  transfer.transferNumber = transferNumber;
  next();
});

module.exports = Transfer;

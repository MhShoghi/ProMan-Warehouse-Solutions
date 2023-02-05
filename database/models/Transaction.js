const mongoose = require("mongoose");
const { TRANSFER_STATUS } = require("../../config/constants");

const Schema = mongoose.Schema;

const TransferSchema = new Schema(
  {
    transferNumber: {
      type: Number,
      unique: true,
      index: true,
      default: 1,
    },
    fromWarehouse: {
      type: mongoose.SchemaTypes.ObjectId,
    },
    toWarehouse: {
      type: mongoose.SchemaTypes.ObjectId,
    },
    quantity: {
      value: {
        type: Number,
        required: true,
      },
      unit: { type: String },
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
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "product",
      },
    ],
  },
  {
    versionKey: false,
    collection: "transfers",
    timestamps: true,
    autoIndex: false,
  }
);

TransferSchema.pre("save", function () {});

module.exports = mongoose.model("transfer", TransferSchema);

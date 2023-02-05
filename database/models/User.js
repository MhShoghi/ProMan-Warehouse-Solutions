const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    first_name: {
      type: String,
      required: [true, "Please enter first name"],
    },
    last_name: {
      type: String,
      required: [true, "Please enter last name"],
    },
    username: {
      type: String,
      unique: true,
    },
    phone: {
      type: String,
      default: "+989139740329",
    },
    status: {
      type: Number,
      default: 0,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please etner a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minLength: [6, "Password must be up to 6 characters"],
      maxLength: [64, "Password must not be more than 23 characters"],
    },
    address: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "operator", "manager", "technician"],
      default: "operator",
    },

    bio: {
      type: String,
      maxLength: 1000,
    },
    warehouse: {
      name: {
        type: String,
      },
      products: [
        {
          product: { type: Schema.Types.ObjectId, ref: "product" },
          unit: { type: String },
          Quantity: { type: Number },
        },
      ],
    },
    projects: [
      {
        project: { type: Schema.Types.ObjectId, ref: "project" },
      },
    ],
    photo: {
      type: String,
      required: [true, "Please add a photo"],
      default: "https://i.ibb.co/4pDNDK1/avatar.png",
    },
    otp: {
      code: {
        type: String,
      },
      expire: {
        type: String,
      },
    },
    personal_code: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    salt: {
      type: String,
    },
  },
  {
    versionKey: false,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);
module.exports = mongoose.model("User", UserSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  owner: {
    type: String,
  },
  operator: { type: Schema.Types.ObjectId, ref: "User" },
  description: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  location: {
    latitude: String,
    longitude: String,
  },
  status: {
    type: Number,
    default: 0,
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],

  documents: [
    {
      name: String,
      url: String,
      description: String,
    },
  ],
  photos: [
    {
      name: String,
      url: String,
      description: String,
    },
  ],
  process: [{ title: String, content: String }],
  number: {
    type: String,
  },
  estimated_time_to_complete: String,
});

module.exports = mongoose.model("Project", ProjectSchema);

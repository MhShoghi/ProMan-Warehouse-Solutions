const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
  user_id: {
    type: String,
    required: true,
  },
  type: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  details: { type: Object },
});

module.exports = mongoose.model("activity", ActivitySchema);

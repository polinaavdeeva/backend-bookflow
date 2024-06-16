const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  reason: { type: String, required: true },
  text: { type: String, required: true },
});

module.exports = mongoose.model("complaints", complaintSchema);

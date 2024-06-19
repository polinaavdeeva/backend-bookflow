const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  reason: { type: String, required: true },
  text: { type: String, required: true },
  bookId: { type: String },
  id: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("complaints", complaintSchema);

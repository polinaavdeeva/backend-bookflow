const mongoose = require("mongoose");
const validator = require("validator");

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  ratings: [
    {
      type: Number,
      min: 1,
      max: 5,
    },
  ],
});

module.exports = mongoose.model("comment", commentSchema);

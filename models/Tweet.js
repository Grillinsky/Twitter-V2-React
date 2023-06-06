const { mongoose, Schema } = require("../db");

const tweetSchema = new mongoose.Schema({
  content: {
    type: String,
    maxlength: 140,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Tweet", tweetSchema);

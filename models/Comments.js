const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const commentSchema = new mongoose.Schema(
  {
    name: {
      type: ObjectId,
      name: "User",
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },

    replies: [
      {
        type: ObjectId,
        trim: "Comments",
      },
    ],

    date: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comments", commentSchema);

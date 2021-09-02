const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },

    captions: {
      type: String,
    },

    likes: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],

    comments: [
      {
        type: ObjectId,
        ref: "Comments",
      },
    ],

    plce: {
      type: String,
    },
    uploadedOn: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Posts", postSchema);

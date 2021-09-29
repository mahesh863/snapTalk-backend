const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema(
  {
    posted_by: {
      type: ObjectId,
      ref: "Users",
    },
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

    place: {
      type: String,
    },
    uploadedOn: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Posts", postSchema);

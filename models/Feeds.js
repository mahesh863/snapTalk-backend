const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const feedSchema = new mongoose.Schema({
  feeds: [
    {
      type: ObjectId,
      ref: "Posts",
    },
  ],
});

module.exports = mongoose.Schema("Feeds", feedSchema);

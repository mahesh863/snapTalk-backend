const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
  },

  read: {
    type: Boolean,
    default: false,
  },
});

const notification = mongoose.model("Notifications", notificationSchema);

module.exports = notification;

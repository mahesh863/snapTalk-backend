const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  date: {
    type: String,
  },

  read: {
    type: Boolean,
    default: false,
  },
});

const notification = mongoose.model("Notifications", notificationSchema);

module.exports = notification;

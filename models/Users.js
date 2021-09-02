const mongoose = require("mongoose");
const { v4: uuid } = require("uuid");
const crypto = require("crypto");

const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: 200,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    notifications: [
      {
        type: ObjectId,
        ref: "Notifications",
      },
    ],
    posts: [
      {
        type: ObjectId,
        ref: "Posts",
      },
    ],

    phoneNumber: [
      {
        type: Number,
      },
    ],

    feeds: {
      type: ObjectId,
      ref: "Feeds",
    },

    following: [
      {
        type: ObjectId,
        ref: "Users",
      },
    ],

    followers: [
      {
        type: ObjectId,
        ref: "Users",
      },
    ],

    sentRequest: [
      {
        type: ObjectId,
        ref: "Users",
      },
    ],

    recieveRequest: [
      {
        type: ObjectId,
        ref: "Users",
      },
    ],

    bio: {
      type: String,
    },

    salt: {
      type: String,
    },

    encry_password: {
      type: String,
    },

    authType: {
      type: String,
      default: "email",
    },
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuid();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (password) {
    return this.securePassword(password) === this.encry_password;
  },

  securePassword: function (plainPassword) {
    if (!plainPassword) {
      return "";
    }

    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainPassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

const users = mongoose.model("Users", userSchema);

module.exports = users;

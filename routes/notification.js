const express = require("express");

const {
  getUserById,
  isSignedIn,
  isAuthenticated,
} = require("../controllers/auth");

const { getAllNotification } = require("../controllers/notification");

const router = express.Router();

router.param("userId", getUserById);

//Get All Notifications
router.get(
  "/:userId/all/notification",
  isSignedIn,
  isAuthenticated,
  getAllNotification
);

module.exports = router;

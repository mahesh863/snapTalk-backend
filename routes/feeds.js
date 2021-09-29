const express = require("express");
const {
  isSignedIn,
  isAuthenticated,
  getUserById,
} = require("../controllers/auth");
const { generateFeed } = require("../controllers/feeds");

const router = express.Router();

router.param("userId", getUserById);
router.get(
  "/feeds/generate/:userId",
  isSignedIn,
  isAuthenticated,
  generateFeed
);

module.exports = router;

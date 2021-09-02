const express = require("express");

//Controllers
const {
  viewProfile,
  editProfile,
  deleteProfile,
} = require("../controllers/profile");

const {
  isSignedIn,
  isAuthenticated,
  getUserById,
} = require("../controllers/auth");

const router = express.Router();

//Params
router.param("userId", getUserById);

//Routes

// GET Route
// View Profile
router.get("/:userId/view/profile", isSignedIn, isAuthenticated, viewProfile);

//PUT Route
// Edit Profile
router.put("/:userId/edit/profile", isSignedIn, isAuthenticated, editProfile);

//DELETE Route
// Delete Profile
router.delete(
  "/:userId/delete/profile",
  isSignedIn,
  isAuthenticated,
  deleteProfile
);

module.exports = router;

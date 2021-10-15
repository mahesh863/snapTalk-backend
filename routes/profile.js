const express = require("express");

//Controllers
const {
  viewProfile,
  editProfile,
  deleteProfile,
  getAllPost,
  getAllInteractions,
  changeProfilePicture,
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

//GET Route
// get all posts
router.get("/:userId/get/post", isSignedIn, isAuthenticated, getAllPost);

//GET Route
//get all interectons
router.get(
  "/:userId/get/friends",
  isSignedIn,
  isAuthenticated,
  getAllInteractions
);

//PUT Route
//Change Profile Picture
router.put(
  "/:userId/profile/image",
  isSignedIn,
  isAuthenticated,
  changeProfilePicture
);

module.exports = router;

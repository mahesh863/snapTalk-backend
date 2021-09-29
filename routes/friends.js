const express = require("express");
const router = express.Router();

const {
  getUserById,
  isSignedIn,
  isAuthenticated,
} = require("../controllers/auth");
const {
  addFriendById,
  sendFollowRequest,
  deleteFollowRequest,
  acceptFollowRequest,
  rejectFollowRequest,
  searchFriend,
} = require("../controllers/friends");

router.param("userId", getUserById);
router.param("friendId", addFriendById);

//Send Follow Request Route
router.get("/add/friend/:userId/:friendId", sendFollowRequest);

//Delete Follow Request Route
router.get("/delete/friend/:userId/:friendId", deleteFollowRequest);

//Accept Follow Request Route
router.get("/accept/friend/:userId/:friendId", acceptFollowRequest);

//Reject Follow Request Route
router.get("/reject/friend/:userId/:friendId", rejectFollowRequest);

//Search People Route
router.post("/search", searchFriend);

module.exports = router;

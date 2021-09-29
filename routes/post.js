const express = require("express");

const router = express.Router();

//Controllers
const {
  createPost,
  editPost,
  deletePost,
  getPostById,
  likePost,
  unlikePost,
} = require("../controllers/post");
const {
  getUserById,
  isSignedIn,
  isAuthenticated,
} = require("../controllers/auth");

router.param("userId", getUserById);
router.param("postId", getPostById);

router.post("/create/post/:userId", isSignedIn, isAuthenticated, createPost);
router.put("/edit/post/:userId/:postId", isSignedIn, isAuthenticated, editPost);
router.delete(
  "/delete/post/:userId/:postId",
  isSignedIn,
  isAuthenticated,
  deletePost
);

router.get("/like/post/:userId/:postId", isSignedIn, isAuthenticated, likePost);
router.get(
  "/unlike/post/:userId/:postId",
  isSignedIn,
  isAuthenticated,
  unlikePost
);

module.exports = router;

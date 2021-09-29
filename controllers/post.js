const _ = require("lodash");
const formidable = require("formidable");
const admin = require("firebase-admin");
const { v4: uuid } = require("uuid");
const Posts = require("../models/Posts");
const Notification = require("../models/Notification");
const User = require("../models/Users");

//Create Post
exports.createPost = (req, res) => {
  const form = new formidable.IncomingForm({
    keepExtensions: true,
  });
  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(400).json({
        err: "Failed To Upload!",
      });
    }
    const posts = new Posts(fields);

    if (files.postImage) {
      let path = files.postImage.path;
      const options = {
        destination: `posts/${uuid()}_${files.postImage.name}`,
        predefinedAcl: "publicRead",
        validation: "crc32c",
      };
      admin
        .storage()
        .bucket()
        .upload(path, options, (err, file, apiResponse) => {
          if (err || !file) {
            return res.status(400).json({
              err: "Failed To Upload!",
            });
          }

          if (file) {
            posts.image = file.publicUrl();
            posts.posted_by = req.profile._id;
            posts.save((err, userPost) => {
              if (err || !userPost) {
                console.log(err);
                res.status(400).json({
                  err: " Failed To Save!",
                });
              }

              let user = req.profile;
              user.posts.push(userPost._id);
              user.save((err, user) => {
                if (err || !user) {
                  console.log(err);
                  res.status(400).json({
                    err: "Sorry Something Went Wrong!",
                  });
                }

                res.status(200).json({
                  userPost,
                  user,
                });
              });
            });
          }
        });
    }
  });
};

//Edit Post
exports.editPost = (req, res) => {
  const form = new formidable.IncomingForm({
    keepExtensions: true,
  });
  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(400).json({
        err: "Failed To Update The Post!",
      });
    }

    let post = req.currentPost;

    post = _.extend(post, fields);

    post.save((err, post) => {
      if (err) {
        res.status(400).json({
          err: "Failed To Update The Post!",
        });
      }

      res.status(200).json({
        success: "Post Updated Successfully",
        post,
      });
    });
  });
};

exports.deletePost = (req, res) => {
  let post = req.currentPost;

  Posts.findByIdAndDelete(post._id, (err, cPost) => {
    if (err || !cPost) {
      res.status(400).json({
        err: "Failed To Delete The Post!",
      });
    }
    res.status(200).json({
      success: "Post Deleted Successfully!",
      cPost,
    });
  });
};

//Like Post
exports.likePost = (req, res) => {
  const currentPost = req.currentPost;
  const currentUser = req.profile;

  const newNotification = new Notification();

  let currentDate = new Date().getDate();
  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();

  newNotification.title = `${currentUser.name} liked your post. `;
  newNotification.date = `${currentDate}/${currentMonth}/${currentYear} `;

  currentPost.likes.addToSet(currentUser._id);
  currentUser.likedPosts.addToSet(currentPost._id);

  currentUser.save((err, data) => {
    if (err || !data) {
      return res.status(400).json({
        err: "Please  Try Again",
      });
    }
  });

  newNotification.save((err, data) => {
    User.findById(currentPost.posted_by._id).exec((err, userData) => {
      if (err) {
        console.log("Notification Not Added!");
      }
      console.log(userData);
      userData.notifications.addToSet(data._id);
      userData.save();
    });

    currentPost.save((err, data) => {
      if (err) {
        return res.status(400).json({
          err: "Please  Try Again",
        });
      }
    });
  });
};

//Unlike Post
exports.unlikePost = (req, res) => {
  const currentPost = req.currentPost;
  const currentUser = req.profile;
  currentPost.likes.pull(currentUser._id);
  currentUser.likedPosts.pull(currentPost._id);

  currentPost.save((err, data) => {
    if (err || !data) {
      return res.status(400).json({
        err: "Please  Try Again",
      });
    }

    currentUser.save((err, data) => {
      if (err || !data) {
        return res.status(400).json({
          err: "Please  Try Again",
        });
      }

      res.status(200).json({
        message: "Post Unliked!",
      });
    });
  });
};

//Middleware
exports.getPostById = (req, res, next, id) => {
  Posts.findById(id)
    .populate("posted_by", ["_id"])
    .exec((err, post) => {
      if (err || !post) {
        return res.status(200).json({
          err: "Post not Found In Database!",
        });
      }

      req.currentPost = post;
      next();
    });
};

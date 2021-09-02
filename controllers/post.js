const _ = require("lodash");
const formidable = require("formidable");
const admin = require("firebase-admin");
const { v4: uuid } = require("uuid");
const Posts = require("../models/Posts");

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

exports.getAllPost = (req, res) => {
  Posts.find().exec((err, post) => {
    if (err) {
      res.status(400).json({
        error: "No post found!",
      });
    }

    res.json({
      post,
    });
  });
};

//Middleware
exports.getPostById = (req, res, next, id) => {
  Posts.findById(id, (err, post) => {
    if (err || !post) {
      return res.status(200).json({
        err: "Post not Found In Database!",
      });
    }

    req.currentPost = post;
    next();
  });
};

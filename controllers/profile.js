//Models
const User = require("../models/Users");
const formidable = require("formidable");
const admin = require("firebase-admin");
const { v4: uuid } = require("uuid");

//View Profile
exports.viewProfile = (req, res) => {
  User.findById(req.profile._id)
    .populate("followers", ["_id", "name", "profilePic"])
    .populate("following", ["_id", "name", "profilePic"])
    .populate("sentRequest", ["_id", "name", "profilePic"])
    .populate("recieveRequest", ["_id", "name", "profilePic"])
    .exec((err, user) => {
      if (err) {
        res.status(400).json({
          err: " Failed To Get User",
        });
      }

      var {
        name,
        email,
        followers,
        following,
        posts,
        profilePic,
        bio,
        sentRequest,
        recieveRequest,
        authType,
        notifications,
      } = user;

      res.json({
        user: {
          name,
          email,
          followers,
          following,
          posts,
          profilePic,
          bio,
          sentRequest,
          recieveRequest,
          authType,
          notifications,
        },
      });
    });
};

//Edit Profile
exports.editProfile = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, profile) => {
      if (err || !profile) {
        res.status(400).json({
          err: "Updation failed!",
        });
      }
      res.status(200).json({
        success: "Account Details Updated Successfully!",
      });
    }
  );
};

//Delete Profile
exports.deleteProfile = (req, res) => {
  User.findByIdAndDelete(req.profile._id, (err, user) => {
    if (err || !user) {
      res.status(400).json({
        err: "Failed To Delete Account. Please Try Again After Sometime.",
      });
    }
    res.status(200).json({
      success: "Account Deleted Successfully!",
    });
  });
};

//Get All My Post
exports.getAllPost = (req, res) => {
  User.findById(req.profile._id)
    .select("posts")
    .populate("posts", ["_id", "image"])
    .exec((err, post) => {
      if (err || !post) {
        return res.status(404).json({
          err: "Post Not Found!",
        });
      }

      console.log(post);
      const allPosts = post.posts;
      res.status(200).json({
        posts: allPosts,
      });
    });
};

//Get All Followers, Followings ,Sent Requests and Recieved Requests
exports.getAllInteractions = (req, res) => {
  const userId = req.profile._id;

  User.findById(userId)
    .select(["following", "followers", "sentRequest", "recieveRequest"])
    .populate("followers", ["_id", "name", "profilePic"])
    .populate("following", ["_id", "name", "profilePic"])
    .populate("sentRequest", ["_id", "name", "profilePic"])
    .populate("recieveRequest", ["_id", "name", "profilePic"])
    .exec((err, user) => {
      if (err) {
        return res.status(404).json({
          err: "USer Not Found!",
        });
      }

      res.status(200).json({
        user,
      });
    });
};

exports.changeProfilePicture = (req, res) => {
  const newProfilePic = new formidable.IncomingForm({ keepExtensions: true });

  newProfilePic.parse(req, (err, fields, files) => {
    if (err) {
      res.status(400).json({
        err: "Failed To Upload!",
      });
    }

    if (files.profileImage) {
      let path = files.profileImage.path;
      const options = {
        destination: `profile/${uuid()}_${files.profileImage.name}`,
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
            let user = req.profile;
            user.profilePic = file.publicUrl();
            user.save((err, user) => {
              if (err || !user) {
                console.log(err);
                res.status(400).json({
                  err: "Sorry Something Went Wrong!",
                });
              }
              res.status(200).json({
                message: "Profile Picture Changed!",
              });
            });
          }
        });
    }
  });
};

//Models
const User = require("../models/Users");

//View Profile
exports.viewProfile = (req, res) => {
  const { name, email, friends, posts } = req.profile;
  res.json({
    name,
    email,
    friends,
    posts,
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

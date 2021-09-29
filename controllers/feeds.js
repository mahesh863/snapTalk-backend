const User = require("../models/Users");
const redis = require("redis");

exports.generateFeed = (req, res) => {
  const feed = [];

  const userId = req.profile._id;
  // const subscriberClient = redis.createClient();
  User.findById(userId)
    .select("following")
    .populate({
      path: "following",
      populate: {
        path: "posts",
        select: ["_id", "image", "posted_by", "captions", "likes", "comments"],
        populate: {
          path: "posted_by",
          select: ["_id", "name", "profilePic"],
        },
      },
    })
    .exec((err, user) => {
      if (err) {
        res.json({
          err: "Please Try Again!",
        });
      }
      user.following.map((friend) => {
        const userPosts = friend.posts.slice(-3);
        userPosts.map((post) => {
          post.comments = post.comments.length;
          feed.push(post);
        });
      });

      res.json({
        feed,
      });
    });
};

const User = require("../models/Users");

exports.getAllNotification = (req, res) => {
  let userId = req.profile._id;

  User.findById(userId)
    .select("notifications")
    .populate("notifications")
    .exec((err, notification) => {
      console.log(notification.notifications);

      if (err) {
        return res.status(404).json({
          err: "Sorry Something Went Wrong!",
        });
      }
      let notificationReversed = notification.notifications.slice(-10);
      notificationReversed = notificationReversed.reverse();
      res.status(200).json({
        notifications: notificationReversed,
      });
    });
};

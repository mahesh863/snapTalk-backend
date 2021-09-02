const User = require("../models/Users");
const Notification = require("../models/Notification");

//Send Follow Request
exports.sendFollowRequest = (req, res) => {
  const reciever = req.friend;
  const sender = req.profile;

  const newNotification = new Notification();

  let currentDate = new Date().getDate();
  let currentMonth = new Date().getMonth();

  newNotification.title = `${sender.name} has sent you a follow request. `;
  newNotification.date = `${currentDate} / ${currentMonth}`;

  newNotification.save((err, notification) => {
    if (err) {
      res.status(400).json({
        err: "Failed To Save Notification To Database!",
      });
    }

    console.log(notification);
    reciever.recieveRequest.addToSet(sender._id);
    reciever.notifications.addToSet(notification._id);
    sender.sentRequest.addToSet(reciever._id);

    reciever.save((err, r) => {
      if (err || !r) {
        res.status(400).json({
          err: "Failed To Update Reciever's  Database!",
        });
      }
    });

    sender.save((err, s) => {
      if (err || !s) {
        res.status(400).json({
          err: "Failed To Update Sender's  Database!",
        });
      }
    });
  });

  res.status(200).json({
    message: "Request Send Successfully!",
  });
};

//Delete Follow Request
exports.deleteFollowRequest = (req, res) => {
  const reciever = req.friend;
  const sender = req.profile;

  reciever.recieveRequest.pull(sender._id);
  sender.sentRequest.pull(reciever._id);

  reciever.save((err, r) => {
    if (err || !r) {
      res.status(400).json({
        err: "Failed To Update Reciever's  Database!",
      });
    }
  });

  sender.save((err, s) => {
    if (err || !s) {
      res.status(400).json({
        err: "Failed To Update Sender's  Database!",
      });
    }
  });

  res.status(200).json({
    message: "Request Removed Successfully!",
  });
};

//Accept Follow Request
exports.acceptFollowRequest = (req, res) => {
  const senderProfile = req.friend;
  const myProfile = req.profile;

  const newNotification = new Notification();

  let currentDate = new Date().getDate();
  let currentMonth = new Date().getMonth();

  newNotification.title = `${myProfile.name} has accepted your follow request. `;
  newNotification.date = `${currentDate} / ${currentMonth}`;

  newNotification.save((err, notification) => {
    if (err) {
      res.status(400).json({
        err: "Failed To Save Notification To Database!",
      });
    }

    console.log(notification);
    myProfile.recieveRequest.pull(senderProfile._id);
    myProfile.followers.addToSet(senderProfile._id);

    senderProfile.notifications.addToSet(notification._id);
    senderProfile.sentRequest.pull(myProfile._id);
    senderProfile.following.addToSet(myProfile._id);

    myProfile.save((err, r) => {
      if (err || !r) {
        res.status(400).json({
          err: "Failed To Update Reciever's  Database!",
        });
      }
    });

    senderProfile.save((err, s) => {
      if (err || !s) {
        res.status(400).json({
          err: "Failed To Update Sender's  Database!",
        });
      }
    });
  });

  res.status(200).json({
    message: "Request Accepted  Successfully!",
  });
};

//Reject Follow Request
exports.rejectFollowRequest = (req, res) => {
  const senderProfile = req.friend;
  const myProfile = req.profile;

  myProfile.recieveRequest.pull(senderProfile._id);
  senderProfile.sentRequest.pull(myProfile._id);

  myProfile.save((err, r) => {
    if (err || !r) {
      res.status(400).json({
        err: "Failed To Update Reciever's  Database!",
      });
    }
  });

  senderProfile.save((err, s) => {
    if (err || !s) {
      res.status(400).json({
        err: "Failed To Update Sender's  Database!",
      });
    }
  });

  res.status(200).json({
    message: "Request Rejected!",
  });
};

//Middleware
//Find User By Id
exports.addFriendById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(404).json({
        err: "User Not Found!",
      });
    }

    if (user) {
      req.friend = user;
      next();
    }
  });
};

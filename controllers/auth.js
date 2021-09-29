const User = require("../models/Users");
const expressJwt = require("express-jwt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// exports.getUser = (req, res) => {
//   User.findOne(
//     {
//       email: req.user.email,
//     },
//     (err, user) => {
//       if (!user) {
//         const user = new User({
//           email: req.user.email,
//           name: req.user.displayName,
//           authType: "google",
//         });

//         user.save((err, user) => {
//           if (err || !user) {
//             res.status(400).json({
//               err: "Failed To Save The User!",
//             });
//           }

//           req.profile = user;
//           res.status(200).json({
//             user,
//           });
//         });
//       } else {
//         req.profile = user;
//         res.status(200).json({
//           user,
//         });
//       }
//     }
//   );
// };

//Signin via Email

exports.signUpWithEmailAndPassword = (req, res) => {
  const user = new User(req.body);

  user.save((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        err: "Failed To Create An Account!",
      });
    }
    res.json({
      message: "Account Created Successfully!",
    });
  });
};

//Signup via Email
exports.signInWithEmailAndPassword = (req, res) => {
  const currentUser = req.body;

  User.findOne({ email: currentUser.email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        err: "Please Try Again.",
      });
    }

    if (!user) {
      return res.status(404).json({
        err: "User Not Found!",
      });
    }
    if (user.authenticate(currentUser.password)) {
      const token = jwt.sign({ _id: user._id }, process.env.SECRET);
      res.cookie("token", token, { expire: new Date() + 60 * 60 * 24 * 10 });

      const { name, email, posts, friends, _id } = user;

      res.status(200).json({
        message: "Login Successful!",
        token,
        userId: _id,
      });
    } else {
      res.status(406).json({
        err: "Invalid Credentials",
      });
    }
  });
};

//Signin via Google
exports.loginViaGoogle = (req, res) => {
  const { token } = req.body;

  client
    .verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    .then((ticket) => {
      const { name, email } = ticket.getPayload();
      console.log(email);

      User.findOne({ email: email }).exec((err, user) => {
        if (err || !user) {
          console.log(err);
        }

        if (user) {
          const token = jwt.sign({ _id: user._id }, process.env.SECRET);
          res.cookie("token", token, {
            expire: new Date() + 60 * 60 * 24 * 10,
          });

          return res.status(200).json({
            message: "Account Login!",
            userId: user._id,
            token,
          });
        }

        if (!user) {
          User.create({ email: email, name: name, authType: "google" })
            .then((user) => {
              const token = jwt.sign({ _id: user._id }, process.env.SECRET);
              res.cookie("token", token, {
                expire: new Date() + 60 * 60 * 24 * 10,
              });

              return res.status(200).json({
                message: "Account Login!",
                userId: user._id,
                token,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    })
    .catch((err) => console.log(err));
};

//Signout
exports.signOut = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "SignOut Successful",
  });
};

// {%---------------------------------------------------------------------------------%}
//Middlewares
//Check If Signed In
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
  algorithms: ["HS256"],
});

//Check If Authenticated
exports.isAuthenticated = (req, res, next) => {
  const checker = req.profile && req.auth && req.profile._id == req.auth._id;

  if (!checker) {
    return res.status(401).json({
      err: "Access Denied",
    });
  }

  next();
};

//Get user By ID
exports.getUserById = (req, res, next, id) => {
  User.findById(id, (err, user) => {
    if (err || !user) {
      return res.status(404).json({
        err: "No User Found!",
      });
    }
    req.profile = user;
    next();
  });
};

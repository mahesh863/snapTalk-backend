const express = require("express");
const router = express.Router();

//Controllers
const {
  signUpWithEmailAndPassword,
  signInWithEmailAndPassword,
  loginViaGoogle,
  signOut,
} = require("../controllers/auth");

//Signup With Email
router.post("/auth/signup", signUpWithEmailAndPassword);

//Signin User via Email
router.post("/auth/signin", signInWithEmailAndPassword);

//signup google
router.post("/auth/google", loginViaGoogle);

//SignOut
router.get("/signout", signOut);

module.exports = router;

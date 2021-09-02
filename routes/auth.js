const express = require("express");
const router = express.Router();

//Controllers
const {
  signUpWithEmailAndPassword,
  signInWithEmailAndPassword,
  loginViaGoogle,
} = require("../controllers/auth");

//Signup With Email
router.post("/auth/signup", signUpWithEmailAndPassword);

//Signin User via Email
router.post("/auth/signin", signInWithEmailAndPassword);

//signup google
router.post("/auth/google", loginViaGoogle);

module.exports = router;

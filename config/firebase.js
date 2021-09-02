const admin = require("firebase-admin");
const serviceAccount = require("./firebaseConfig.json");
require("dotenv").config();

module.exports = {
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_URL,
};

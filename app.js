const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();

//middleware
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

//Firebase
const firebaseConfig = require("./config/firebase");
const admin = require("firebase-admin");

//Routes
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");
const profileRoute = require("./routes/profile");
const friendRoute = require("./routes/friends");
const notificationRoute = require("./routes/notification");
const feedsdRoute = require("./routes/feeds");

// const verifyJwt = require("./config/verifyJwt");

const app = express();

admin.initializeApp(firebaseConfig);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//Routes
app.use("/api", authRoute);
app.use("/api", postRoute);
app.use("/api", profileRoute);
app.use("/api", friendRoute);
app.use("/api", notificationRoute);
app.use("/api", feedsdRoute);

mongoose.connect(
  "mongodb://localhost:27017/snaptalk",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    console.log(">>> Database Connected");

    if (err) {
      console.log(err);
    }
  }
);

app.listen(8000, () => {
  console.log(">>> App is running at port 8000");
});

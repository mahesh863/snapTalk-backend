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

const app = express();

const port = process.env.PORT || 8000;

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
  "http:url",
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

app.listen(port, () => {
  console.log(">>> App is running at port 8000");
});

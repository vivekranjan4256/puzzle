//jshint esversion:6
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const saltRounds = 10; //just should be above where it is used,not necessarily here

const app = express();

app.use(express.static("public"));
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());


app.use(
  cors({
    origin: process.env.FRONTEND_URI,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    credentials: true,
  })
);
app.use(function(req, res, next) {
  res.header('Content-Type', 'application/json;charset=UTF-8')
  res.header('Access-Control-Allow-Credentials', true)
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app.use(cookieParser());

// app.use(
//   cookieSession({
//     name: "session",
//     keys: ["eltimus"],
//     maxAge: 24 * 60 * 60 * 1000, //1day
//   })
// );

mongoose.connect("mongodb://127.0.0.1:27017/elitmusDB");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("we are connected to local database!");
  //console.log("we are connected to cloud database!");
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: String,
  name: String,
});

const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.send("home route");
});

app.get("/", function (req, res) {
  res.end();
});

app.get("/register", function (req, res) {
  res.end();
});

app.post("/register", function (req, res) {
  console.log("register post rt", req.body);
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    const newUser = new User({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    });

    newUser
      .save()
      .then(() => {
        res.cookie("cookieName", "cookieValue");
        console.log("register done");
        res.end();
      })
      .catch((err) => console.log(err));
  });
});

app.post("/login", function (req, res) {
  console.log("login post rt", req.body);
  const username = req.body.email;
  const password = req.body.password;

  User.findOne({
    email: username,
  })
    .then((foundUser) => {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function (err, result) {
          console.log("login compare working", result);
          if (result === true) {
            console.log("login compare success");
            // saving the data to the cookies
            res.cookie("cookieName", req.body.email);

            res.send(true);
          }
        });
      } else {
        console.log("no match");
        res.send(false);
      }
    })
    .catch((err) => console.log(err));
});

app.get("/logout", function (req, res) {
  console.log('logout get rt')
  res.clearCookie("cookieName");
  res.end();
});

app.get("/is_linked", function (req, res) {
  console.log(
    "cookie check in is_linked get rt",
    req.cookies,
    req.cookies.cookieName
  );
  if (req.cookies.cookieName != null) {
    res.send(true);
  } else {
    res.send(false);
  }
});

app.get("/is_admin", function (req, res) {
  console.log(
    "cookie check in is_admin get rt",
    req.cookies,
    req.cookies.cookieName
  );
  if (req.cookies.cookieName=='2005416@kiit.ac.in') {
    res.send(true);
  } else {
    res.send(false);
  }
});

port = process.env.PORT;
app.listen(port || 3000, function () {
  console.log(`Server started on port ${port}.`);
});

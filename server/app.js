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
app.use(function (req, res, next) {
  res.header("Content-Type", "application/json;charset=UTF-8");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(cookieParser());

// app.use(
//   cookieSession({
//     name: "session",
//     keys: ["eltimus"],
//     maxAge: 24 * 60 * 60 * 1000, //1day
//   })
// );

//"mongodb://127.0.0.1:27017/elitmusDB"
mongoose.connect(process.env.MONGO_URI).catch((err) => console.log("error connecting to elitmusDB", err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  //console.log("we are connected to local database!");
  console.log("we are connected to cloud database!");
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required:true,
    unique: true
  },
  password: String,
  name:{
    type:String,
    required:true
  }
});

const User = mongoose.model("User", userSchema);

const playerSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  name: String,
  time: Number,
  accuracy: Number,
});

const Player = mongoose.model("Player", playerSchema);

app.get("/", function (req, res) {
  res.send("home route");
});

app.get("/", function (req, res) {
  res.end();
});

app.get("/register", function (req, res) {
  res.end();
});

app.get("/all_user_stats", (req, res) => {
  Player.find()
    .then((users) => {
      users.sort(function (a, b) {
        return a.time-b.time;
      }); //if positive value is returned then swap a,b})
      console.log(users);
      res.send(users);
    })
    .catch((err)=>{console.log("all users stats get rt err", err)});
});

app.post("/user_stats", async (req, res) => {
  console.log("user_stats post rt", req.body);
  const tiar = req.body.time_ar;
  let total_time = 0;
  for (let i = 0; i < tiar.length; i += 1) total_time += tiar[i];
  total_time = Number(total_time.toFixed(3));
  const atar = req.body.attempts_ar;
  let total_attemps = 0;
  for (let i = 0; i < atar.length; i += 1) total_attemps += atar[i];
  let percentage_accuracy = (12 / total_attemps) * 100;
  percentage_accuracy = Number(percentage_accuracy.toFixed(2));
  console.log(typeof percentage_accuracy);
  console.log({ time: total_time, accuracy: percentage_accuracy });

  let mail = req.cookies.cookieName;
  console.log(typeof mail);
  await User.find({ email: mail }).then((users) => {
    console.log(users[0].name);
    Player.findOne({ email: mail }).then((found) => {
      if (found===null) {
        Player.create({
          email: mail,
          time: total_time,
          accuracy: percentage_accuracy,
          name: users[0].name,
        })
          .then((nuser) => console.log("create", nuser))
          .catch((err) => console.log("create err", err));
      } else {
        Player.findOneAndReplace(
          { email: mail },
          {
            email: mail,
            time: total_time,
            accuracy: percentage_accuracy,
            name: users[0].name,
          }
        )
          .then((nuser) =>
            console.log("replace returns the old document", nuser)
          )
          .catch((err) => console.log("find one and replace err", err));
      }
    });
    res.send({email: mail, total_time, accuracy: percentage_accuracy });
  });
  
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
        console.log("register done");
        console.log(req.body.email)
        res.cookie("cookieName", req.body.email);
        res.send(true)
      })
      .catch((err) => {console.log(err),res.send(false)});

     
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
  console.log("logout get rt");
  res.clearCookie("cookieName");
  res.end();
});

app.get("/is_logged", function (req, res) {
  console.log(
    "cookie check in is_logged get rt",
    req.cookies,
    req.cookies.cookieName
  );
  if (req.cookies.cookieName != null) {
    res.send(true);
  } else {
    res.send(false);
  }
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
    req,
    req.cookies,
    req.cookies.cookieName
  );
  if (req.cookies.cookieName == "vivekranjan4256@gmail.com") {
    res.send(true);
  } else {
    res.send(false);
  }
});

port = process.env.PORT;
app.listen(port || 3000, function () {
  console.log(`Server started on port ${port}.`);
});

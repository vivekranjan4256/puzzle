require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieSession = require("cookie-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

//app.use(helmet())

app.use(express.static("public"));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URI,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
  })
);

app.use(
    session({
      secret: "keyboard cat",
      saveUninitialized: false,
      resave: false
    })
  );

// app.use(
//   cookieSession({
//     name: "session",
//     keys: ["eltimus"],
//     maxAge: 24 * 60 * 60 * 1000, //1day
//   })
// );



app.use(passport.initialize());
app.use(passport.session());

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
  }, // values: email address, googleId, facebookId
  password: String,
  provider: String, // values: 'local', 'google', 'facebook'
  secret: String,
  name: String,
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

app.get("/", function (req, res) {
  res.send("login failed");
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

app.get("/login", function (req, res) {});

app.get("/register", function (req, res) {});

app.get("/secrets", function (req, res) {
  //to stop brower from caching secrets page after we logout
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0"
  );

  if (req.isAuthenticated()) {
    User.find({ secret: { $ne: null } }, function (err, foundUsers) {
      if (err) {
        console.log("secrets get rt error", err);
      } else {
        if (foundUsers) {
        }
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.post("/register", function (req, res) {
  console.log("register post rt", req.body);
  const password = req.body.password;

  User.register(
    {
      email: req.body.email,
      name: req.body.name,
      provider: "local",
    },
    password,
    function (err, user) {
      if (err) {
        console.log("register  post rt error", err);
        res.end();
      } else {
        console.log("user in register rt", user);
        req.login(user, function (err) {
            console.log('user in register rt',user)
          //res.status(200);
          res.redirect('/')
        });
      }
    }
  );

});

// app.post('/login',
//     passport.authenticate('local', {
//         successRedirect: '/secrets',
//         failureRedirect: '/login'
//     }));

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/" }), //if the authentication is successful then passport middleware will call the next function
  function (req, res) {
    console.log("login post rt success");
    console.log(req.user);
    console.log(req.body);
    // If this function gets called, authentication was successful.
    // This is just to show that this function is accessbile in case of success
    res.status(200).json({ success: true });
  }
);

app.get("/is_linked", function (req, res) {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    console.log("authenticated");
    res.send(true);
  } else {
    res.send(false);
  }
});

app.post("/submit", function (req, res) {
  const submittedSecret = req.body.secret;

  //Once the user is authenticated and their session gets saved, their user details are saved to req.user.
  console.log(req.user._id);

  User.findById(req.user._id, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        foundUser.secret = submittedSecret;
        foundUser.save(function () {
          res.redirect("/secrets");
        });
      }
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(process.env.PORT || 3000, function () {
  console.log(`Server started on port ${port}!`);
});

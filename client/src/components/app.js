const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cookieSession = require("cookie-session");
const app = express();
var cors = require("cors");
const mongoose = require("mongoose");

require("./auth");

mongoose
  .connect("mongodb://127.0.0.1:27017/ranklistDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => console.log("error connecting to ranklistDb", err));

//.on is an event listener in node js,listening to error event on moongoose connection[0]
//.once is also event listener but it listens to the open event just once after the initial connection
const db = mongoose.connection;
db.once("open", function () {
  console.log("we are connected to local database!");
});
db.on("error", (err) => console.log("error on mongoose connection[0]", err));

const usersDataSchema = new mongoose.Schema({
  email: String,
  name: String,
  cf_handle: String,
  rating: Number,
  image: String,
  maxRating: Number,
  rank: String,
});

UsersData = mongoose.model("UsersData", usersDataSchema);

//connection with frontend

//the methods have some caveat write comments regarding them
app.use(
  cors({
    origin: "http://localhost:4000",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    credentials: true,
  })
);
app.use(
  cookieSession({
    name: "session",
    keys: ["ranklist"],
    maxAge: 24 * 60 * 60 * 1000, //1day
  })
);
const { readFile, writeFile } = require("fs");

const CF_API = "https://codeforces.com/api/user.info?handles=";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:4000",
    failureRedirect: "http://localhost:4000",
  })
);

//  Functions
var list_of_users = [];
async function get_list() {
  readFile("users_data_file.txt", "UTF-8", (err, data) => {
    try {
      // console.log("DATA is");
      // console.log(data);
      list_of_users = JSON.parse(data);
    } catch (err) {
      console.log("get_list fn", err);
    }
  });
}

async function get_list() {
  readFile("users_data_file.txt", "UTF-8", (err, data) => {
    try {
      // console.log("DATA is");
      // console.log(data);
      list_of_users = JSON.parse(data);
    } catch (err) {
      console.log("get_list fn", err);
    }
  });
}

async function write_on_file() {
  console.log("write");
  list_of_users.sort(function (a, b) {
    return b.rating - a.rating;
  });
  writeFile(
    "users_data_file.txt",
    JSON.stringify(list_of_users),
    (err, data) => {
      if (err) {
        console.log("write_on_file fn", err);
      } else {
        // console.log(data);
      }
    }
  );
}
function write_on_admin_file(list_of_admins) {
  writeFile("admin_list.txt", JSON.stringify(list_of_admins), (err, data) => {
    if (err) {
      console.log("write_on_admin_file fn", err);
    } else {
      // console.log(data);
    }
  });
}

async function update_on_file(user, guser, user_id) {
  list_of_users[user_id] = {
    email: guser.email,
    name: guser.name,
    cf_handle: user.handle,
    rating: user.rating,
    image: user.titlePhoto,
    maxRating: user.maxRating,
    rank: user.rank,
  };
  write_on_file();
}
function add_on_file(user, guser) {
  try {
    list_of_users.push({
      email: guser.email,
      name: guser.name,
      cf_handle: user.handle,
      rating: user.rating,
      image: user.titlePhoto,
      maxRating: user.maxRating,
      rank: user.rank,
    });
  } catch (err) {
    console.log("add_on_file fn", err);
  } finally {
    write_on_file();
  }
}
async function add_user(response, guser) {
  await update_list();
  readFile("users_data_file.txt", "UTF-8", (err, data) => {
    try {
      list_of_users = JSON.parse(data);
    } catch (err) {
      console.log("add_user fn", err);
    } finally {
      let user_id = list_of_users.findIndex(
        (user_data) => user_data.email === guser.email
      );
      if (user_id != -1) update_on_file(response.result[0], guser, user_id);
      else add_on_file(response.result[0], guser);
    }
  });
}

async function update_list() {
  console.log("update_list fn", list_of_users.length);
  let list_of_handles = "";
  for (let i = 0; i < list_of_users.length; i++)
    list_of_handles +=
      list_of_users[i].cf_handle + (i == list_of_users.length - 1 ? "" : ";");

  let url = CF_API + list_of_handles;

  if (list_of_handles.length)
    await fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Something went wrong with CF API"); //without this the promise will resolve and try to go to next then
      })
      .then(async (response) => {
        let new_list = response.result;
        for (let i = 0; i < list_of_users.length; i++) {
          list_of_users[i].maxRating = new_list[i].maxRating;
          list_of_users[i].rating = new_list[i].rating ? new_list[i].rating : 0;
          list_of_users[i].image = new_list[i].titlePhoto;
          list_of_users[i].rank = new_list[i].rank;
        }
        write_on_file();
      })
      .catch((error) => {
        console.log(error); //error is thrown and caught here for error handling
      });
  return list_of_users;
}

//setInterval(update_list, 5 * 60 * 1000);

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("http://localhost:4000");
});

//from DB
app.get("/user_list", async (req, res) => {
  readFile("users_data_file.txt", "UTF-8", (err, data) => {
    try {
      list_of_users = JSON.parse(data);
    } catch (err) {
      console.log("user_list rt", err);
    } finally {
      res.send(list_of_users);
    }
  });
});

//#
// updated one
app.get("/user_list_current", (req, res) => {
  readFile("users_data_file.txt", "UTF-8", async (err, data) => {
    try {
      list_of_users = JSON.parse(data);
    } catch (err) {
      console.log("user_list_current rt", err);
    } finally {
      //refresh new data
      list_of_users = await update_list(list_of_users);
      res.send(list_of_users);
    }
  });
});

async function get_admin_list(cb) {
  readFile("admin_list.txt", "UTF-8", (err, data) => {
    try {
      cb(JSON.parse(data));
    } catch (err) {
      console.log("get_admin_list fn", err);
    }
  });
}

async function check_admin(guser, cb) {
  get_admin_list(function (data) {
    if (data.findIndex((user_data) => user_data.email == guser.email) != -1)
      cb(true);
    else cb(false);
  });
}

function verify_admin(guser) {
  // verify if admin present
  get_admin_list(function (data) {
    let id = data.findIndex((user_data) => user_data.email == guser.email);
    if (id != -1 && data[id].verified == false) {
      data[id].verified = true;
      data[id].name = guser.name;
      write_on_admin_file(data);
    }
  });
}
app.get("/user_g_info", (req, res) => {
  if (req.user) {
    verify_admin(req.user._json);
    res.status(200).json({
      error: false,
      message: "Successfully Loged In",
      user: {
        name: req.user._json.name,
        picture: req.user._json.picture,
        email: req.user._json.email,
      },
    });
    // })
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
});
app.get("/all_admins", async (req, res) => {
  await get_admin_list(function (data) {
    res.send(data);
  });
});

//#
async function find_cfuser_email(my_email) {
  await get_list();
  for (let i = 0; i < list_of_users.length; i++)
    if (list_of_users[i].email == my_email) {
      return list_of_users[i];
    }
  return null;
}
//#
app.get("/is_linked", async (req, res) => {
  if (req.user) {
    const cf_data = await find_cfuser_email(req.user._json.email);
    res.status(200).json({
      error: false,
      message: "Successfully Loged In",
      user: cf_data,
    });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
});

async function check_and_add(handle, guser) {
  //handle should not contain ; semicolon
  let is_semicolon_present = false;
  for (let i = 0; i < handle.length; i++)
    if (handle[i] == ";") is_semicolon_present = true;

  let url = CF_API + handle;

  let cf_user = null;
  if (!is_semicolon_present) {
    await fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Something went wrong with CF API");
      })
      .then(async (response) => {
        //console.log(response.result);
        await add_user(response, guser);
        console.log(response.result[0]);
        cf_user = {
          cf_handle: response.result[0].handle,
          email: guser.email,
          image: response.result[0].titlePhoto,
          maxRating: response.result[0].maxRating,
          name: guser.name,
          rank: response.result[0].rank,
          rating: response.result[0].rating,
        };
      })
      .catch((error) => {
        console.error("check_and_add fn", error);
      });
  }
  return cf_user;
}

app.get("/new_cf_user", async (req, res) => {
  if (req.user) {
    console.log(req.query.cf_id);
    const cf_user = await check_and_add(req.query.cf_id, req.user._json);
    if (cf_user) {
      res.status(200).json({
        error: false,
        message: "Successfully Loged In",
        user: cf_user,
      });
    } else {
      res.status(403).json({ error: true, message: "No such user found!" });
    }
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
});

async function remove_from_list(my_email) {
  list_of_users = list_of_users.filter(function (item) {
    return item.email != my_email;
  });
}
async function delete_user(my_email, cb) {
  readFile("users_data_file.txt", "UTF-8", (err, data) => {
    try {
      list_of_users = JSON.parse(data).filter(function (item) {
        return item.email != my_email;
      });
      cb();
    } catch (err) {
      console.log("delete_user fn", err);
    }
  });
}
app.get("/remove_user", (req, res) => {
  // removing , so cf_user must be there(guaranteed)
  console.log("user mail");
  console.log(req.user._json.email);
  delete_user(req.user._json.email, write_on_file);
  res.end();
});

app.post("/remove_user_from_list", async (req, res) => {
  console.log("Params pass : ");
  console.log("rq body", req.body);
  await delete_user(req.body.cf_handle_email, write_on_file);
  res.status(200).json({
    error: false,
    message: "removed Successfully",
    isAdmin: true,
  });
});

async function add_admin(my_email) {
  get_admin_list(function (data) {
    if (
      data.findIndex((value) => {
        value.email == my_email;
      }) == -1
    ) {
      data.push({
        email: my_email,
        verified: false,
        name: "",
      });
      write_on_admin_file(data);
    }
  });
}
app.post("/add_admin", async (req, res) => {
  console.log("add_admin rt", req.body.add_email);
  check_admin(req.body, async function (data) {
    if (data) {
      await add_admin(req.body.add_email);
      res.status(200).json({
        error: false,
        message: "Added Successfully",
        isAdmin: true,
      });
    } else
      res.status(200).json({
        error: false,
        message: "Not Add",
        isAdmin: false,
      });
  });
});
async function remove_admins(emails) {
  get_admin_list(function (data) {
    write_on_admin_file(
      data.filter((val) => {
        console.log(emails.findIndex((value) => value == val.email) == -1);
        return emails.findIndex((value) => value == val.email) == -1;
      })
    );
  });
}
app.post("/remove_admins", (req, res) => {
  console.log(req.body.email);
  console.log(req.body.email_list);
  check_admin(req.body, async function (data) {
    console.log(data);
    if (data) {
      await remove_admins(req.body.email_list);
      res.status(200).json({
        error: false,
        message: "Successfully Removed Admins",
        isAdmin: true,
      });
    } else
      res.status(200).json({
        error: false,
        message: "Not Removed Admins",
        isAdmin: false,
      });
  });
});
app.get("/is_admin", (req, res) => {
  if (req.user)
    check_admin(req.user._json, function (data) {
      res.send(data);
    });
  else res.send(false);
});

app.listen(3000, () => {
  console.log("Server port :3000 ");
});

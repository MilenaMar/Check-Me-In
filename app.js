// ℹ️ To get access to environment
require("dotenv").config();

// ℹ️ Connect to the database
require("./db");

const express = require("express");
const hbs = require("hbs");

const app = express();

//app.use(express.static('public'))
// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require("./config")(app);

const projectName = "Check-Me-In";
const capitalized = (string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with IronGenerator`;
// default value for title local

// 👇 Start handling routes here
const index = require("./routes/index");
app.use("/", index);

const authRoutes = require("./routes/auth");
app.use("/", authRoutes);

const userRoutes = require("./routes/user");
app.use("/user",userRoutes)

const postRoutes = require("./routes/post");
app.use("/post",postRoutes)

// ❗ To handle errors. Routes that dont exist or errors that you handle in specfic routes
require("./error-handling")(app);

module.exports = app;


///https://check-me-in.herokuapp.com/
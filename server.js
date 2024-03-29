"use strict";
exports.__esModule = true;
require("dotenv").config({ silent: true });
var express = require("express");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var index_1 = require("./routes/index");
var users_1 = require("./routes/users");
var trips_1 = require("./routes/trips");
var tripEdit_1 = require("./routes/tripEdit");
var app = express();
app.listen(process.env.PORT || 3000, function () {
  console.log("listening on port:");
});
var social = require("./app/passport/passport")(app, passport);

mongoose
  .connect(process.env.DB_KEY)
  .then(function () {
    console.log("Succesfully Connected to MongoDB");
  })
  ["catch"](function (err) {
    console.log("Not connected to MongoDB" + err);
  });
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/ngApp", express.static(path.join(__dirname, "ngApp")));
app.use("/api", express.static(path.join(__dirname, "api")));
app.use("/", index_1["default"]);
app.use("/api/users", users_1["default"]);
app.use("/trips", trips_1["default"]);
app.use("/tripEdit", tripEdit_1["default"]);
// redirect 404 to home for the sake of AngularJS client-side routes
app.get("/*", function (req, res, next) {
  if (/.js|.html|.css|templates|js|scripts/.test(req.path) || req.xhr) {
    return next({ status: 404, message: "Not Found" });
  } else {
    return res.render("index");
  }
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err["status"] = 404;
  next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    res.status(err["status"] || 500);
    res.render("error", {
      message: err.message,
      error: err,
    });
  });
}
// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err["status"] || 500);
  res.render("error", {
    message: err.message,
    error: {},
  });
});

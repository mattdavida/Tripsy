require('dotenv').config({silent: true});
import * as express from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as ejs from 'ejs';
import * as mongoose from "mongoose";
import * as passport from "passport";
import * as FacebookStrategy from "passport-facebook";

import routes from './routes/index';
import users from './routes/users';
import trips from "./routes/trips";
import tripEdit from "./routes/tripEdit";
import User from "./app/models/user";
import Trip from "./app/models/trip";

let app = express();
app.listen(process.env.PORT || 3000, function() {
  console.log("listening on port:")
})
let social = require("./app/passport/passport")(app, passport);

mongoose.connect(process.env.DB_KEY).then(() => {
  console.log("Succesfully Connected to MongoDB");
}).catch((err) => {
  console.log("Not connected to MongoDB" + err);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/ngApp', express.static(path.join(__dirname, 'ngApp')));
app.use('/api', express.static(path.join(__dirname, 'api')));

app.use('/', routes);
app.use('/api/users', users);
app.use("/trips", trips);
app.use("/tripEdit", tripEdit);

// redirect 404 to home for the sake of AngularJS client-side routes
app.get('/*', function(req, res, next) {
  if (/.js|.html|.css|templates|js|scripts/.test(req.path) || req.xhr) {
    return next({ status: 404, message: 'Not Found' });
  } else {
    return res.render('index');
  }
});


// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err['status'] = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err:Error, req, res, next) => {
    res.status(err['status'] || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err:Error, req, res, next) => {
  res.status(err['status'] || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

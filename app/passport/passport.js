var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require("../models/user");
var session = require("express-session");
var jwt = require("jsonwebtoken");
var secret = "SecretTest";
var token;
module.exports = function (app, passport) {
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({ secret: "testing", resave: false, saveUninitialized: true, cookie: { secure: false } }));
    passport.serializeUser(function (user, done) {
        token = jwt.sign({ _id: user._id, username: user.username, email: user.email, password: user.password }, secret, { expiresIn: "24hr" });
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
    passport.use(new FacebookStrategy({
        clientID: "424854377857684",
        clientSecret: "97c22c8627f82b469de71e4c5d168b5f",
        callbackURL: "https://desolate-wave-35568.herokuapp.com/auth/facebook/callback",
        profileFields: ["id", "displayName", "email"]
    }, function (accessToken, refreshToken, profile, done) {
        User.findOne({ email: profile._json.email }).select("username password email").exec(function (err, user) {
            if (err) {
                done(err);
            }
            if (user && user !== null) {
                done(null, user);
            }
            else {
                done(err);
            }
        });
    }));
    passport.use(new TwitterStrategy({
        consumerKey: "aUr949eBXU0wuPbAKZuCuqfCl",
        consumerSecret: "CHJtv2cumMan5SOZeqHh0BtpNiB3RCV3daditES7CNmjz3gauA",
        callbackURL: "https://desolate-wave-35568.herokuapp.com/auth/twitter/callback",
        userProfileURL: 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
    }, function (token, tokenSecret, profile, done) {
        User.findOne({ email: profile.emails[0].value }).select("username password email").exec(function (err, user) {
            if (err) {
                done(err);
            }
            if (user && user !== null) {
                done(null, user);
            }
            else {
                done(err);
            }
        });
    }));
    passport.use(new GoogleStrategy({
        clientID: "73057292092-nvvnq11masng9f6gec0l57kdcjllp361.apps.googleusercontent.com",
        clientSecret: "hEFKg9aktxsIWwG_mB0nCcCq",
        callbackURL: "https://desolate-wave-35568.herokuapp.com/auth/google/callback",
    }, function (accessToken, refreshToken, profile, done) {
        User.findOne({ email: profile.emails[0].value }).select("username password email").exec(function (err, user) {
            if (err) {
                done(err);
            }
            if (user && user !== null) {
                done(null, user);
            }
            else {
                done(err);
            }
        });
    }));
    app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', "profile", "email"] }));
    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/googleerror' }), function (req, res) {
        res.redirect('/google/' + token);
    });
    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/twittererror ' }), function (req, res) {
        res.redirect("/twitter/" + token);
    });
    app.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/facebookerror" }), function (req, res) {
        res.redirect("/facebook/" + token);
    });
    app.get("/auth/facebook", passport.authenticate("facebook", { scope: "email" }));
    return passport;
};

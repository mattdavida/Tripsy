"use strict";
var express = require("express");
var User = require("../app/models/user");
var jwt = require("jsonwebtoken");
var secret = "SecretTest";
var router = express.Router();
var newName;
var newUsername;
var newEmail;
var newPermission;
router.get("/", function (req, res) {
    User.find().then(function (users) {
        res.json(users);
    }).catch(function (err) {
        res.status(500);
        console.error(err);
    });
});
router.post('/', function (req, res, next) {
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    user.name = req.body.name;
    user.permission = "user";
    if (req.body.username == null || req.body.username == "" || req.body.email == null || req.body.email == "" || req.body.password == null || req.body.password == "" ||
        req.body.name === null || req.body.name === "") {
        res.json({ success: false, message: "Ensure username, password, and email were provided" });
    }
    else {
        user.save(function (err) {
            if (err) {
                if (err.errmsg[46] === "u") {
                    res.json({ success: false, message: "Username already exists in the database" });
                }
                else if (err.errmsg[46] === "e") {
                    res.json({ success: false, message: "Email already exists in the database" });
                }
            }
            else {
                res.json({ success: true, message: "user created" });
            }
        });
    }
});
router.post("/authenticate", function (req, res) {
    User.findOne({ username: req.body.username }).select("_id email username password").exec(function (err, user) {
        console.log(user);
        if (err)
            throw err;
        if (!user) {
            if (!res.headersSent)
                res.json({ success: false, message: "Could not authenticate user" });
        }
        else if (user) {
            if (req.body.password) {
                if (!res.headersSent)
                    var validPassword = user.comparePassword(req.body.password);
                console.log("Valid password is " + validPassword);
            }
            else {
                if (!res.headersSent)
                    res.json({ success: false, message: "No password provided" });
            }
            if (!validPassword) {
                if (!res.headersSent)
                    res.json({ success: false, message: "Could not authenticate password" });
            }
            else if (validPassword) {
                var token_1 = jwt.sign({ _id: user._id, username: user.username, email: user.email }, secret, { expiresIn: "24hr" });
                if (!res.headersSent)
                    res.json({ success: true, message: "User Authenticated", token: token_1 });
            }
        }
    });
});
router.use(function (req, res, next) {
    var token = req.body.token || req.body.query || req.headers["x-access-token"];
    if (token) {
        jwt.verify(token, secret, function (err, decoded) {
            if (err) {
                res.json({ success: false, message: "Token invalid" });
            }
            else {
                req["decoded"] = decoded;
                next();
            }
        });
    }
    else {
        res.json({ success: false, message: "No token provided" });
    }
});
router.post("/current", function (req, res) {
    res.send(req["decoded"]);
});
router.get("/permission", function (req, res) {
    User.findOne({ username: req["decoded"].username }, function (err, user) {
        if (err)
            throw err;
        if (!user) {
            res.json({ success: false, message: "no user was found" });
        }
        else {
            res.json({ success: true, permission: user.permission });
        }
    });
});
router.get("/management", function (req, res) {
    User.find({}, function (err, users) {
        if (err) {
            throw err;
        }
        User.findOne({ username: req["decoded"].username }, function (err, mainUser) {
            if (err) {
                throw err;
            }
            if (!mainUser) {
                res.json({ success: false, message: "No user found" });
            }
            else {
                if (mainUser.permission === "admin" || mainUser.permission === "moderator") {
                    if (!users) {
                        res.json({ success: false, message: "Users not found" });
                    }
                    else {
                        res.json({ success: true, users: users, permission: mainUser.permission });
                    }
                }
                else {
                    res.json({ success: false, message: "Insufficient Permissions" });
                }
            }
        });
    });
});
router.delete("/management/:id", function (req, res) {
    var deletedId = req.params.id;
    User.findOne({ username: req["decoded"].username }, function (err, mainUser) {
        if (err) {
            throw err;
        }
        if (!mainUser) {
            res.json({ success: false, message: "No user found" });
        }
        else {
            if (mainUser.permission !== "admin") {
                res.json({ success: false, message: "Insufficient Permissions" });
            }
            else {
                User.remove({ _id: deletedId }, function (err, user) {
                    if (err) {
                        throw err;
                    }
                    res.json({ success: true });
                });
            }
        }
    });
});
router.get("/edit/:id", function (req, res) {
    var editUser = req.params.id;
    User.findOne({ username: req["decoded"].username }, function (err, mainUser) {
        if (err) {
            throw err;
        }
        if (!mainUser) {
            res.json({ success: false, message: "No user found" });
        }
        else {
            if (mainUser.permission === "admin" || mainUser.permission === "moderator") {
                User.findOne({ _id: editUser }, function (err, user) {
                    if (err) {
                        throw err;
                    }
                    if (!user) {
                        res.json({ success: false, message: "No user found" });
                    }
                    else {
                        res.json({ success: true, user: user });
                    }
                });
            }
            else {
                res.json({ success: false, message: "Insufficient Permissions" });
            }
        }
    });
});
router.put("/edit", function (req, res) {
    var editUser = req.body._id;
    if (req.body.name)
        newName = req.body.name;
    if (req.body.username)
        newUsername = req.body.username;
    if (req.body.email)
        newEmail = req.body.email;
    if (req.body.permission)
        newPermission = req.body.permission;
    User.findOne({ username: req["decoded"].username }, function (err, mainUser) {
        if (err) {
            throw err;
        }
        if (!mainUser) {
            res.json({ success: false, message: "No user found" });
        }
        else {
            if (newName !== null) {
                if (mainUser.permission === "admin" || mainUser.permission === "moderator") {
                    User.findOne({ _id: editUser }, function (err, user) {
                        if (err) {
                            throw err;
                        }
                        if (!user) {
                            res.json({ success: false, message: "No user found" });
                        }
                        else {
                            user.name = newName;
                            user.save(function (err) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    if (!res.headersSent)
                                        res.json({ success: true, message: "Updated" });
                                }
                            });
                        }
                    });
                }
                else {
                    res.json({ success: false, message: "Insufficient Permissions" });
                }
            }
            if (newUsername) {
                if (mainUser.permission === "admin" || mainUser.permission === "moderator") {
                    User.findOne({ _id: editUser }, function (err, user) {
                        if (err) {
                            throw err;
                        }
                        if (!user) {
                            res.json({ success: false, message: "No user found" });
                        }
                        else {
                            user.username = newUsername;
                            user.save(function (err) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    if (!res.headersSent)
                                        res.json({ success: true, message: "Updated" });
                                }
                            });
                        }
                    });
                }
                else {
                    res.json({ success: false, message: "Insufficient Permissions" });
                }
            }
            if (newEmail) {
                if (mainUser.permission === "admin" || mainUser.permission === "moderator") {
                    User.findOne({ _id: editUser }, function (err, user) {
                        if (err) {
                            throw err;
                        }
                        if (!user) {
                            res.json({ success: false, messge: "No user found" });
                        }
                        else {
                            user.email = newEmail;
                            user.save(function (err) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    if (!res.headersSent)
                                        res.json({ success: true, message: "Updated" });
                                }
                            });
                        }
                    });
                }
                else {
                    res.json({ success: false, message: "Insufficient Permissions" });
                }
            }
            if (newPermission) {
                if (mainUser.permission === "admin" || mainUser.permission === "moderator") {
                    User.findOne({ _id: editUser }, function (err, user) {
                        if (err) {
                            throw err;
                        }
                        if (!user) {
                            res.json({ success: false, message: "No user found" });
                        }
                        else {
                            user.permission = newPermission;
                            user.save(function (err) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    if (!res.headersSent)
                                        res.json({ success: true, message: "Updated" });
                                }
                            });
                        }
                    });
                }
                else {
                    res.json({ success: false, message: "Insufficient Permissions" });
                }
            }
        }
    });
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = router;

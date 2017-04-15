import * as express from 'express';
var User             = require("../app/models/user");
import * as jwt from "jsonwebtoken";

let secret = process.env.SECRET_KEY;
let router = express.Router();
let newName;
let newUsername;
let newEmail;
let newPermission;

router.get("/", (req, res) => {
  User.find().then((users) => {
    res.json(users);
  }).catch((err) => {
    res.status(500);
    console.error(err);
  });
});
// USER REGISTRATION //
router.post('/', function(req, res, next) {
  let user = new User();
  user.username = req.body.username;
  user.password = req.body.password;
  user.email = req.body.email;
  user.name = req.body.name;
  user.permission = "user"
  if(req.body.username == null || req.body.username == "" || req.body.email == null || req.body.email == "" || req.body.password == null || req.body.password == "" ||
     req.body.name === null || req.body.name === "") {
        res.json({success: false, message: "Ensure username, password, and email were provided"});
      }
      else {
        user.save(function(err) {
          if(err) {
            if(err.errmsg[46] === "u") {
             res.json({success: false, message: "Username already exists in the database"});
            }
            else if(err.errmsg[46] === "e") {
              res.json({success: false, message:"Email already exists in the database"});
            }
          }
          else {
            res.json({success: true, message: "user created"});
          }
        });
      }
});
// USER LOGIN ROUTE //
router.post("/authenticate", (req, res) => {
  User.findOne({username: req.body.username}).select("_id email username password").exec((err, user) => {
    console.log(user)
    if(err)
      throw err;

      if(!user) {
        if(!res.headersSent)
        res.json({success: false, message: "Could not authenticate user"});
      }
      else if(user) {
        if(req.body.password) {
        if(!res.headersSent)
        var validPassword = user.comparePassword(req.body.password);
        console.log("Valid password is " + validPassword)
        }
        else {
          if(!res.headersSent)
          res.json({success: false, message: "No password provided"});
        }
        if(!validPassword){
          if(!res.headersSent)
          res.json({success: false, message: "Could not authenticate password"});
        }
        else if(validPassword) {
          let token = jwt.sign({_id: user._id, username: user.username, email: user.email}, secret, {expiresIn: "24hr"});
          if(!res.headersSent)
          res.json({success: true, message: "User Authenticated", token: token});
        }
      }
  });
});

router.use((req, res, next) => {
  let token = req.body.token || req.body.query || req.headers["x-access-token"]; //Get token

  if(token) {
    //Verify token
    jwt.verify(token, secret, (err, decoded) => {
      if(err) {
        res.json({success: false, message: "Token invalid"});
      } else {
        req["decoded"] = decoded;
        next();
      }
    });
  }
  else {
    res.json({success: false, message: "No token provided"});
  }
});

router.post("/current", (req, res) => {
  res.send(req["decoded"]);
});

router.get("/permission", (req, res) => {
  User.findOne({username: req["decoded"].username}, (err, user) => {
    if(err)
      throw err;
    if(!user) {
      res.json({success: false, message: "no user was found"});
    }
    else {
      res.json({success: true, permission: user.permission});
    }
  });
});

router.get("/management", (req, res) => {
  User.find({}, (err, users) => {
    if(err) {
      throw err;
    }
    User.findOne({username: req["decoded"].username}, (err, mainUser) => {
        if(err) {
          throw err
        }
        if(!mainUser) {
          res.json({success: false, message: "No user found"});
        }
        else {

          if(mainUser.permission === "admin" || mainUser.permission === "moderator") {
            if(!users) {
              res.json({success: false, message: "Users not found"}); //Catch all
            }
            else {
              res.json({success: true, users: users, permission: mainUser.permission})
            }
          }
          else {
            res.json({success: false, message: "Insufficient Permissions"})
          }

        }
    });
  });
});

router.delete("/management/:id", (req, res) => {
  let deletedId = req.params.id;
  User.findOne({username: req["decoded"].username}, (err, mainUser) => {
    if(err) {
      throw err;
    }
    if(!mainUser) {
      res.json({success: false, message: "No user found"});
    }
    else {
      if(mainUser.permission !== "admin") {
        res.json({success: false, message: "Insufficient Permissions"});
      }
      else {
        User.remove({_id: deletedId}, (err, user) => {
          if(err) {
            throw err;
          }
          res.json({success: true});
        });
      }
    }
  });
});

router.get("/edit/:id", (req, res) => {
  let editUser = req.params.id;
  User.findOne({username: req["decoded"].username}, (err, mainUser) => {
    if(err) {
      throw err;
    }
    if(!mainUser) {
      res.json({success: false, message: "No user found"});
    }
    else {
      if(mainUser.permission === "admin" || mainUser.permission === "moderator") {
        User.findOne({_id: editUser}, (err, user) => {
          if(err) {
            throw err;
          }
          if(!user) {
            res.json({success: false, message: "No user found"});
          }
          else {
            res.json({success: true, user: user});
          }
        });
      }
      else {
        res.json({success: false, message: "Insufficient Permissions"});
      }
    }
  });
});

router.put("/edit", (req, res) => {
  let editUser = req.body._id;
  if(req.body.name)  newName = req.body.name;
  if(req.body.username)  newUsername = req.body.username;
  if(req.body.email)  newEmail = req.body.email;
  if(req.body.permission)  newPermission = req.body.permission;
  User.findOne({username: req["decoded"].username}, (err, mainUser) => {
    if(err) {
      throw err;
    }
    if(!mainUser) {
      res.json({success: false, message: "No user found"});
    }
    else {
      if(newName !== null) {
        if(mainUser.permission === "admin" || mainUser.permission === "moderator") {
          User.findOne({_id: editUser}, (err, user) => {
            if(err) {
              throw err;
            }
            if(!user) {
              res.json({success: false, message: "No user found"});
            }
            else {
              user.name = newName;
              user.save((err) => {
                if(err) {
                  console.log(err)
                }
                else {
                  if(!res.headersSent)
                  res.json({success: true, message: "Updated"});
                }
              });
            }
          });
        }
        else {
          res.json({success: false, message: "Insufficient Permissions"});
        }
      } //End newName check
      if(newUsername) {
        if(mainUser.permission === "admin" || mainUser.permission === "moderator") {
          User.findOne({_id: editUser}, (err, user) => {
            if(err) {
              throw err;
            }
            if(!user) {
              res.json({success: false, message: "No user found"});
            }
            else {
              user.username = newUsername;
              user.save((err) => {
                if(err) {
                  console.log(err);
                }
                else {
                  if(!res.headersSent)
                  res.json({success: true, message: "Updated"})
                }
              });
            }
          });
        }
        else {
          res.json({success: false, message: "Insufficient Permissions"});
        }
      } //End newUsername check
      if(newEmail) {
        if(mainUser.permission === "admin" || mainUser.permission === "moderator") {
          User.findOne({_id: editUser}, (err, user) => {
            if(err) {
              throw err;
            }
            if(!user) {
              res.json({success: false, messge: "No user found"});
            }
            else {
              user.email = newEmail;
              user.save((err) => {
                if(err) {
                  console.log(err);
                }
                else {
                  if(!res.headersSent)
                  res.json({success: true, message: "Updated"})
                }
              });
            }
          });
        }
        else {
          res.json({success: false, message: "Insufficient Permissions"});
        }
      } //End newEmail check

      if(newPermission) {
        if(mainUser.permission === "admin" || mainUser.permission === "moderator") {
          User.findOne({_id: editUser}, (err, user) => {
            if(err) {
              throw err;
            }
            if(!user) {
              res.json({success: false, message: "No user found"});
            }
            else {
              user.permission = newPermission;
              user.save((err) => {
                if(err) {
                  console.log(err);
                }
                else {
                  if(!res.headersSent)
                  res.json({success: true, message: "Updated"})
                }
              });
            }
          });
        }
        else {
          res.json({success: false, message: "Insufficient Permissions"});
        }
      } //End permission check
    }
  });
});


export default router;

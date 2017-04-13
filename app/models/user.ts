import * as mongoose from "mongoose";
import * as bcrypt from "bcrypt-nodejs";
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');
let Schema = mongoose.Schema;

export interface IUser extends mongoose.Document {
  name: {type: String, required: true},
  username: {type: String, lowercase: true, required: true, unique: true},
  password: {type: String, lowercase: true, required: true},
  email: {type: String, lowercase: true, required: true, unique: true},
  permission: {type: String, required: true}
  comparePassword:any
}

let userSchema = new Schema ({
  name: {type: String, required: true},
  username: { type: String, lowercase: true, required: true, unique: true},
  password: { type: String, required: true},
  email:  { type: String, lowercase: true, required: true, unique: true},
  permission: {type: String, required: true}
});

userSchema.pre('save', function(next) {
  bcrypt.hash(this.password, null, null, (err, hash) => {
    if(this.isModified("password"))this.password = hash;
    if(!this.isModified("password")) console.log("Unmodified"); next()
    if(err) return next(err);
    console.log(this.password + "is password")
    next();
  });
});

userSchema.plugin(titlize, {
  paths: [ "name" ]
});

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model<IUser>("User", userSchema);

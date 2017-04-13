"use strict";
var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, lowercase: true, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, lowercase: true, required: true, unique: true },
    permission: { type: String, required: true }
});
userSchema.pre('save', function (next) {
    var _this = this;
    bcrypt.hash(this.password, null, null, function (err, hash) {
        if (_this.isModified("password"))
            _this.password = hash;
        if (!_this.isModified("password"))
            console.log("Unmodified");
        next();
        if (err)
            return next(err);
        console.log(_this.password + "is password");
        next();
    });
});
userSchema.plugin(titlize, {
    paths: ["name"]
});
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};
module.exports = mongoose.model("User", userSchema);

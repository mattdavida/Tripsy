"use strict";
var mongoose = require("mongoose");
;
var tripSchema = new mongoose.Schema({
    location: {
        type: String,
        required: [true, "Location is required"]
    },
    name: {
        type: String,
        required: [true, "You must enter a name"]
    },
    description: {
        type: String,
        required: [true, "You need to describe your trip"]
    },
    estimatedCost: {
        type: Number,
        required: [true, "How much will your trip cost?"]
    },
    user_tag: String
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = mongoose.model("Trip", tripSchema);

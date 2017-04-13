"use strict";
var express = require("express");
var trip_1 = require("../app/models/trip");
var router = express.Router();
router.get("/:id", function (req, res) {
    var tripId = req.params["id"];
    trip_1.default.findById(tripId).then(function (trip) {
        res.json(trip);
    });
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = router;

"use strict";
var express = require("express");
var trip_1 = require("../app/models/trip");
var router = express.Router();
router.get("/:id", function (req, res) {
    var userId = req.params["id"];
    trip_1.default.find({ user_tag: userId }).then(function (trips) {
        res.json(trips);
    }).catch(function (err) {
        res.status(500);
    });
});
router.post("/", function (req, res) {
    var trip = new trip_1.default();
    trip.location = req.body.location;
    trip.name = req.body.name;
    trip.description = req.body.description;
    trip.estimatedCost = req.body.estimatedCost;
    trip.user_tag = req.body.user_tag;
    trip.save().then(function (newTrip) {
        res.json(newTrip);
    }).catch(function (err) {
        if (typeof trip.estimatedCost !== "number") {
            err.errors.estimatedCost.message = "You must enter a number for estimated cost";
        }
        res.status(400).json(err);
    });
});
router.post('/:id', function (req, res) {
    var tripId = req.params.id;
    trip_1.default.findById(tripId).then(function (trip) {
        trip.location = req.body.location;
        trip.name = req.body.name;
        trip.description = req.body.description;
        trip.estimatedCost = req.body.estimatedCost;
        trip.save().then(function (updatedTrip) {
            res.json(updatedTrip);
        }).catch(function (err) {
            res.status(400).json(err);
        });
    }).catch(function (err) {
        res.sendStatus(404);
    });
});
router.delete("/:id", function (req, res) {
    var tripId = req.params.id;
    trip_1.default.remove({ _id: tripId }).then(function () {
        res.json({ message: "Trip Deleted" });
        res.status(200);
    }).catch(function (err) {
        res.status(500);
        console.log(err);
    });
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = router;

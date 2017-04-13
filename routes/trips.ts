import * as express from "express";
import Trip from "../app/models/trip";

let router = express.Router();

router.get("/:id", (req, res) => {

  let userId = req.params["id"];
  Trip.find({user_tag: userId}).then((trips) => {
    res.json(trips);
  }).catch((err) => {
    res.status(500);
  });
});

//create new trip
router.post("/", (req, res) => {
  let trip = new Trip();
  trip.location = req.body.location;
  trip.name = req.body.name;
  trip.description = req.body.description;
  trip.estimatedCost = req.body.estimatedCost;
  trip.user_tag = req.body.user_tag;

  //Save new trip
  trip.save().then((newTrip) => {
    res.json(newTrip);
  }).catch((err) => {
    if(typeof trip.estimatedCost !== "number") {
      err.errors.estimatedCost.message = "You must enter a number for estimated cost"
    }
    res.status(400).json(err);
  });
});


router.post('/:id', (req, res) => {
  let tripId = req.params.id;
  Trip.findById(tripId).then((trip) => {
    trip.location = req.body.location;
    trip.name = req.body.name;
    trip.description = req.body.description;
    trip.estimatedCost = req.body.estimatedCost;

    trip.save().then((updatedTrip) => {
      res.json(updatedTrip);
    }).catch((err) => {
      res.status(400).json(err);
    })
  }).catch((err) => {
    res.sendStatus(404);
  });
});

router.delete("/:id", (req, res) => {
  let tripId = req.params.id;
  Trip.remove({_id:tripId}).then(() => {
    res.json({message: "Trip Deleted"})
    res.status(200);
  }).catch((err) => {
    res.status(500);
    console.log(err);
  });
});

export default router;

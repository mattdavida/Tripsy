import * as express from "express";
import Trip from "../app/models/trip";

let router = express.Router();

router.get("/:id", (req, res) => {
  let tripId = req.params["id"];
  Trip.findById(tripId).then((trip) => {
    res.json(trip);
  });
});


export default router;

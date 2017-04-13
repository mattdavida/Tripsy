import * as mongoose from "mongoose";

export interface ITrip extends mongoose.Document{
  location: {type: String, required: true};
  name: {type: String, required: true};
  description: {type: String, required: true};
  estimatedCost: {type: Number, required: true};
  user_tag: String;
};

let tripSchema = new mongoose.Schema({
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
})

export default mongoose.model<ITrip>("Trip", tripSchema);

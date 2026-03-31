import mongoose from "mongoose";

const RatingsSchema = new mongoose.Schema({
  car: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Car",    
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  review: { type: String },
}, { timestamps: true });

export const Rating = mongoose.model("Rating", RatingsSchema);
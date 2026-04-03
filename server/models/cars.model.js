import mongoose from "mongoose";

const CarsSchema = new mongoose.Schema({
  brand:        { type: String, required: true },
  model:        { type: String, required: true },
  year:         { type: Number, required: true },
  color:        { type: String },
  pricePerDay:  { type: Number, required: true },
  isAvailable:  { type: Boolean, default: true },
  mileage:      { type: Number },
  fuelType:     { type: String, enum: ["Petrol", "Diesel", "Electric", "Hybrid"] },
  transmission: { type: String, enum: ["Automatic", "Manual"] },
  licensePlate: { type: String, required: true, unique: true },
  uploadedBy:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  currentRenter:  { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  rentalStartDate: { type: Date },
  rentalEndDate:   { type: Date },

  // ✅ Bagong fields para sa image
  image:     { type: String, default: "" }, // Cloudinary URL
  imageId:   { type: String, default: "" }, // Cloudinary public_id (para sa delete)
}, { timestamps: true });

export const Car = mongoose.model("Car", CarsSchema);
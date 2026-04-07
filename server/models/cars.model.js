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
  currentRenter:   { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  rentalStartDate: { type: Date },
  rentalEndDate:   { type: Date },
  image:   { type: String, default: "" },
  imageId: { type: String, default: "" },
  

  // ✅ PROMO FIELDS
  isPromo:     { type: Boolean, default: false },
  promoPrice:  { type: Number, default: null },       // discounted price per day
  promoLabel:  { type: String, default: null },        // e.g. "20% OFF", "Summer Deal"
  promoSeason: {
    type: String,
    enum: ["summer", "christmas", "valentines", "halloween", "new_year", "payday", "sale"],
    default: null,
  },
  promoExpiry: { type: Date, default: null },          // auto-expire promo
}, { timestamps: true });

export const Car = mongoose.model("Car", CarsSchema);
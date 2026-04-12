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
// ✅ MAS MATALINONG PROMO FIELDS
isPromo: { 
  type: Boolean, 
  default: false 
},
promoPrice: { 
  type: Number, 
  default: null,
  // Validation: Siguraduhin na hindi mas mahal ang promo sa original price
  validate: {
    validator: function(v) {
      if (this.isPromo && v >= this.pricePerDay) return false;
      return true;
    },
    message: "Promo price must be lower than the original price per day!"
  }
},
promoLabel: { 
  type: String, 
  default: null,
  trim: true 
},
promoSeason: {
  type: String,
  enum: ["summer", "christmas", "valentines", "halloween", "new_year", "payday", "sale", null],
  default: null,
},
promoExpiry: { 
  type: Date, 
  default: null 
},         // auto-expire promo
}, { timestamps: true });

export const Car = mongoose.model("Car", CarsSchema);
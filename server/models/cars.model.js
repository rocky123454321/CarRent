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

  // ✅ ADMIN-SET PROMOS (Manual)
  isPromo: { 
    type: Boolean, 
    default: false 
  },
  promoPrice: { 
    type: Number, 
    default: null,
    validate: {
      validator: function(v) {
        if (this.isPromo && v >= this.pricePerDay) return false;
        return true;
      },
      message: "Promo price must be lower than the original price per day!"
    }
  },
  promoLabel:  { type: String, default: null, trim: true },
  promoSeason: {
    type: String,
    default: null,
  },
  promoExpiry: { type: Date, default: null },

  // ✅ SYSTEM-GENERATED FLASH DEALS (Daily Picks)
  flashDeal: {
    isActive: { type: Boolean, default: false },
    discountedPrice: { type: Number, default: null }, // Usually 10% off computed price
    lastSelected: { type: Date, default: null }      // Date kung kailan siya naging flash deal
  }

}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ✅ VIRTUALS
CarsSchema.virtual('isPromoActive').get(function() {
  if (!this.isPromo) return false;
  if (!this.promoExpiry) return true;
  return new Date(this.promoExpiry) >= new Date();
});

// Virtual para makuha ang "Effective Price" (Alin man ang mas mura)
CarsSchema.virtual('effectivePrice').get(function() {
  if (this.flashDeal?.isActive && this.flashDeal?.discountedPrice) {
    return this.flashDeal.discountedPrice;
  }
  if (this.isPromoActive && this.promoPrice) {
    return this.promoPrice;
  }
  return this.pricePerDay;
});

export const Car = mongoose.model("Car", CarsSchema);
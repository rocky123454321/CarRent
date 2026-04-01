import mongoose from "mongoose";
//done naa..
const RentalSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  car: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Car", 
    required: true 
  },
  rentalStartDate: { type: Date, required: true },
  rentalEndDate: { type: Date, required: true },
  personalDetails: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true }
  },
  status: { 
    type: String, 
    enum: ["pending", "confirmed", "completed", "cancelled"], 
    default: "pending" 
  },
  totalPrice: { type: Number, required: true }
}, { timestamps: true });

export const Rental = mongoose.model("Rental", RentalSchema);

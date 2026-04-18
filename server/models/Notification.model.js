import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["chat", "new-booking", "booking-status"],
      required: true,
    },

    // --- chat ---
    senderId:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    senderName:  { type: String },
    unreadCount: { type: Number, default: 1 },
    message:     { type: String },

    // --- booking ---
    rentalId:     { type: mongoose.Schema.Types.ObjectId, ref: "Rental" },
    userId:       { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userName:     { type: String },
    userEmail:    { type: String },
    carBrand:     { type: String },
    carModel:     { type: String },
    licensePlate: { type: String },
    totalPrice:   { type: Number },
    status:       { type: String },

    read:      { type: Boolean, default: false },
    timestamp: { type: Date,    default: Date.now },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
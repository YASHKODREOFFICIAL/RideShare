const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

  rideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ride"
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  userName: String,

  paymentMethod: String,

  rideCost: Number,
  platformFee: Number,
  totalPrice: Number

}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
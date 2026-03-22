const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Ride = require("../models/Ride");

router.post("/create", async (req, res) => {
  try {
    const {
      rideId,
      userId,
      userName,
      paymentMethod,
      rideCost,
      platformFee,
      totalPrice
    } = req.body;

    const booking = new Booking({
      rideId,
      userId,
      userName,
      paymentMethod,
      rideCost,
      platformFee,
      totalPrice
    });

    await booking.save();

    res.json({ message: "Booking successful 🎉" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Booking failed" });
  }
});

router.get("/user/:id", async (req, res) => {
  const bookings = await Booking.find({ userId: req.params.id });
  res.json(bookings);
});
module.exports = router;
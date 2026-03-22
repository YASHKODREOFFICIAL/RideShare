// const express = require('express');
// const router = express.Router();
// const Ride = require('../models/Ride');

// // Create Ride (Owner)
// router.post('/create', async (req, res) => {
//   const ride = new Ride(req.body);
//   await ride.save();
//   res.json(ride);
// });

// // Get Rides (Client)
// router.get('/search', async (req, res) => {
//   const { source, destination } = req.query;

//   const rides = await Ride.find({
//     source,
//     destination
//   });

//   res.json(rides);
// });

// router.get('/searchByLocation', async (req, res) => {
//   const { slat, slng, dlat, dlng } = req.query;

//   const rides = await Ride.find();

//   const matched = rides.filter(r => {
//     if (!r.sourceLocation || !r.destinationLocation) return false;

//     const sourceDistance = Math.sqrt(
//       Math.pow(r.sourceLocation.lat - slat, 2) +
//       Math.pow(r.sourceLocation.lng - slng, 2)
//     );

//     const destDistance = Math.sqrt(
//       Math.pow(r.destinationLocation.lat - dlat, 2) +
//       Math.pow(r.destinationLocation.lng - dlng, 2)
//     );

//     return sourceDistance < 0.1 && destDistance < 0.1;
//   });

//   res.json(matched);
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');
const axios = require("axios");

// 🌍 Convert address → coordinates
const getCoordinates = async (address) => {

  // 🔥 If already lat,lng → skip API
  if (address.includes(",")) {
    const [lat, lng] = address.split(",");
    return {
      lat: parseFloat(lat),
      lng: parseFloat(lng)
    };
  }

  // ✅ USE ENV VARIABLE
  const apiKey = process.env.OPENCAGE_API_KEY;

  if (!apiKey) {
    throw new Error("API key missing in .env");
  }

  const res = await axios.get(
    `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`
  );

  if (!res.data.results.length) {
    throw new Error("Address not found");
  }

  const data = res.data.results[0];

  return {
    lat: data.geometry.lat,
    lng: data.geometry.lng
  };
};


// 📏 Distance (KM)
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI/180) *
    Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLon/2) *
    Math.sin(dLon/2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
};


// 🚗 CREATE RIDE
router.post("/create", async (req, res) => {
  try {
    console.log("Incoming Data:", req.body);

    const newRide = new Ride({
      source: req.body.source,
      destination: req.body.destination,
      vehicle: req.body.vehicle,
      seats: req.body.seats,
      contact: req.body.contact,
      cost: Number(req.body.cost),
      sourceLocation: req.body.sourceLocation,
      destinationLocation: req.body.destinationLocation
    });

    await newRide.save();

    res.json({ message: "Ride created successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating ride" });
  }
});


// 🔍 SEARCH
router.get('/search', async (req, res) => {
  try {
    const { source, destination, vehicle } = req.query;

    const userSource = await getCoordinates(source);
    const userDest = await getCoordinates(destination);

    const rides = await Ride.find();

    const matched = rides.filter(r => {

      if (vehicle && r.vehicle.toLowerCase() !== vehicle.toLowerCase()) {
        return false;
      }

      const sourceDist = getDistance(
        userSource.lat,
        userSource.lng,
        r.sourceLocation.lat,
        r.sourceLocation.lng
      );

      const destDist = getDistance(
        userDest.lat,
        userDest.lng,
        r.destinationLocation.lat,
        r.destinationLocation.lng
      );

      return sourceDist <= 20 && destDist <= 2;
    });

    res.json(matched);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error" });
  }
});


// 📍 SEARCH BY LOCATION
router.get('/searchByLocation', async (req, res) => {
  try {
    const { slat, slng, dlat, dlng, vehicle } = req.query;

    const rides = await Ride.find();

    const matched = rides.filter(r => {

      if (vehicle && r.vehicle.toLowerCase() !== vehicle.toLowerCase()) {
        return false;
      }

      const sourceDist = getDistance(
        parseFloat(slat),
        parseFloat(slng),
        r.sourceLocation.lat,
        r.sourceLocation.lng
      );

      const destDist = getDistance(
        parseFloat(dlat),
        parseFloat(dlng),
        r.destinationLocation.lat,
        r.destinationLocation.lng
      );

      return sourceDist <= 20 && destDist <= 2;
    });

    res.json(matched);

  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
});


// ✅ SINGLE RIDE (KEEP ONLY ONE)
router.get('/:id', async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    res.json(ride);
  } catch (err) {
    res.status(500).json({ error: "Error fetching ride" });
  }
});

module.exports = router;
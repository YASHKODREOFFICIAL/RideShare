// const mongoose = require('mongoose');

// const rideSchema = new mongoose.Schema({
//   ownerId: String,
//   source: String,
//   destination: String,

//   sourceLocation: {
//     lat: Number,
//     lng: Number
//   },

//   destinationLocation: {
//     lat: Number,
//     lng: Number
//   },

//   vehicle: String,
//   seats: Number,
//   contact: String
// });

// module.exports = mongoose.model('Ride', rideSchema);


const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({

  // 🔥 Full address (string)
  source: String,
  destination: String,

  // 📍 Coordinates
  sourceLocation: {
    lat: Number,
    lng: Number
  },

  destinationLocation: {
    lat: Number,
    lng: Number
  },

  // 🚗 Ride details
  vehicle: String,
  seats: Number,
  contact: String,

  cost: {
    type: Number,
    required: true   // ✅ Make it required
  }

}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);
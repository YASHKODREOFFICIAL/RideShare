const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['owner', 'client']
  }
});

module.exports = mongoose.model('User', userSchema);
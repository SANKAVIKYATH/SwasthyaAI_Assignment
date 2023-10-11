// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userID:{
    type: Number,
    required: true, // You can adjust validation as needed
    unique: true, // Ensure that userID is unique
  },
  username: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);

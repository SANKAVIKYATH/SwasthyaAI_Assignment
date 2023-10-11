const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  blogID:{
    type: Number,
    required: true,
    unique: true,
  },
  title: String,
  content: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
});

module.exports = mongoose.model('Blog', blogSchema);
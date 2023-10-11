const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  commentID:{
    type: Number,
    required: true,
    unique: true,
  },
  content: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: ' User' },
  blogID: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' },
});

module.exports = mongoose.model('Comment', commentSchema);
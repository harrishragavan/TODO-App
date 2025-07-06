const mongoose = require('mongoose');

const sharedTaskSchema = new mongoose.Schema({
  name: String,
  type: String,
  deadline: Date,
  receiverEmail: String,
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('SharedTask', sharedTaskSchema);

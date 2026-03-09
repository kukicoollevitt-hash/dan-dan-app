const mongoose = require('mongoose');

const snackOrderSchema = new mongoose.Schema({
  grade: { type: String, required: true },
  name: { type: String, required: true },
  school: { type: String, default: '' },
  items: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 }
  }],
  totalBadges: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'delivered'],
    default: 'pending'
  },
  deliveredAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SnackOrder', snackOrderSchema);

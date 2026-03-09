const mongoose = require('mongoose');

const bookOrderSchema = new mongoose.Schema({
  academyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Academy',
    required: true
  },
  academyName: {
    type: String,
    required: true
  },
  orderDate: {
    type: Date,
    required: true
  },
  literacyBookCount: {
    type: Number,
    default: 0
  },
  literacyBookPrice: {
    type: Number,
    default: 14000 // 권당 14,000원
  },
  literacyBookTotal: {
    type: Number,
    default: 0
  },
  creativeBookCount: {
    type: Number,
    default: 0
  },
  creativeBookPrice: {
    type: Number,
    default: 24000 // 권당 24,000원
  },
  creativeBookTotal: {
    type: Number,
    default: 0
  },
  totalCost: {
    type: Number,
    default: 0
  },
  confirmed: {
    type: Boolean,
    default: false
  },
  shipped: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 저장 전 금액 자동 계산
bookOrderSchema.pre('save', function(next) {
  this.literacyBookTotal = this.literacyBookCount * this.literacyBookPrice;
  this.creativeBookTotal = this.creativeBookCount * this.creativeBookPrice;
  this.totalCost = this.literacyBookTotal + this.creativeBookTotal;
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('BookOrder', bookOrderSchema);

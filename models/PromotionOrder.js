const mongoose = require('mongoose');

// 개별 홍보물 항목 스키마
const promotionItemSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['briefing', 'flyer', 'banner', 'poster', 'plaque', 'blog', 'briefingSupport'],
    required: true
  },
  categoryName: {
    type: String,
    required: true
    // 설명회, 전단지, 배너, 포스터, 현판
  },
  itemId: {
    type: String,
    required: true
  },
  itemName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  quantity: {
    type: Number,
    min: 1,
    required: true
  },
  unitPrice: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    default: 0
  }
});

// 홍보몰 신청 메인 스키마
const promotionOrderSchema = new mongoose.Schema({
  applicantName: {
    type: String,
    required: true
  },
  branchName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },

  // 주소 정보 (Daum 우편번호 서비스 — 도로명·지번 모두 지원)
  postcode: { type: String, default: '' },
  address: { type: String, default: '' },          // 기본 주소 (도로명 또는 지번)
  addressDetail: { type: String, default: '' },    // 상세 주소

  items: [promotionItemSchema],

  totalQuantity: {
    type: Number,
    default: 0
  },
  subtotalAmount: {
    type: Number,
    default: 0
  },
  vatAmount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: ['신청완료', '확인중', '제작중', '발송완료', '취소'],
    default: '신청완료'
  },

  memo: {
    type: String,
    default: ''
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

promotionOrderSchema.pre('save', function(next) {
  this.items.forEach(item => {
    item.subtotal = item.quantity * item.unitPrice;
  });

  this.totalQuantity = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.subtotalAmount = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  this.vatAmount = Math.round(this.subtotalAmount * 0.1);
  this.totalAmount = this.subtotalAmount + this.vatAmount;
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('PromotionOrder', promotionOrderSchema);

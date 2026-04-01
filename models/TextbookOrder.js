const mongoose = require('mongoose');

// 개별 교재 항목 스키마
const textbookItemSchema = new mongoose.Schema({
  bookType: {
    type: String,
    enum: ['브레인문해력', '고래도서관'],
    required: true
  },
  series: {
    type: String,
    required: true
    // 브레인문해력: 브레인온, 업, 핏, 딥
    // 고래도서관: 시즌1, 시즌2, 시즌3
  },
  issueNumber: {
    type: Number,
    min: 1,
    max: 12,
    required: true
  },
  quantity: {
    type: Number,
    min: 1,
    required: true
  },
  unitPrice: {
    type: Number,
    default: 14000
  },
  subtotal: {
    type: Number,
    default: 0
  }
});

// 교재 신청 메인 스키마
const textbookOrderSchema = new mongoose.Schema({
  // 신청자 정보
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

  // 신청 교재 목록
  items: [textbookItemSchema],

  // 총계
  totalQuantity: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  },

  // 상태
  status: {
    type: String,
    enum: ['신청완료', '확인중', '배송준비', '배송완료', '취소'],
    default: '신청완료'
  },

  // 메모
  memo: {
    type: String,
    default: ''
  },

  // 타임스탬프
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
textbookOrderSchema.pre('save', function(next) {
  // 각 아이템의 소계 계산
  this.items.forEach(item => {
    item.subtotal = item.quantity * item.unitPrice;
  });

  // 총 권수, 총 금액 계산
  this.totalQuantity = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.totalAmount = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('TextbookOrder', textbookOrderSchema);

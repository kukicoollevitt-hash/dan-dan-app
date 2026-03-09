const mongoose = require('mongoose');

/**
 * 공지사항 스키마
 * Live 피드 롤링 배너에 표시되는 공지사항 저장
 */
const noticeSchema = new mongoose.Schema({
  // 아이콘 (이모지)
  icon: {
    type: String,
    required: true,
    default: '📢'
  },

  // 메시지 내용
  message: {
    type: String,
    required: true,
    maxlength: 200
  },

  // 정렬 순서
  order: {
    type: Number,
    default: 0
  },

  // 삭제 여부 (소프트 삭제)
  deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// 인덱스
noticeSchema.index({ deleted: 1, order: 1 });

const Notice = mongoose.model('Notice', noticeSchema);

module.exports = Notice;

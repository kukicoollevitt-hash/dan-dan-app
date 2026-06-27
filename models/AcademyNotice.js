const mongoose = require('mongoose');

/**
 * 학원 대시보드 - 최신 교육 및 업데이트 소식
 * 작성 권한: '브레인문해원_테스트' 관리자 계정만
 * 모든 학원 관리자에게 동일하게 노출
 */
const academyNoticeSchema = new mongoose.Schema({
  // 카테고리: '정기교육' / '업데이트' / '문해력지도사'
  category: {
    type: String,
    required: true,
    enum: ['정기교육', '업데이트', '문해력지도사'],
    index: true
  },

  // 제목
  title: {
    type: String,
    required: true,
    maxlength: 200
  },

  // 본문 (텍스트 + 이미지 URL + YouTube URL 포함)
  content: {
    type: String,
    required: true,
    maxlength: 20000
  },

  // 작성자 표시명 (현재는 항상 '브레인문해력')
  author: {
    type: String,
    default: '브레인문해력'
  },

  // 작성 관리자 ID (감사 추적용)
  createdBy: {
    type: String,
    default: ''
  },

  // 소프트 삭제
  deleted: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true
});

academyNoticeSchema.index({ deleted: 1, category: 1, createdAt: -1 });

module.exports = mongoose.model('AcademyNotice', academyNoticeSchema);

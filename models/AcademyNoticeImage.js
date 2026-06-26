const mongoose = require('mongoose');

/**
 * 학원 대시보드 소식 첨부 이미지
 * Render의 ephemeral filesystem 문제를 피하기 위해 MongoDB에 직접 저장.
 * 최대 10MB까지 Buffer로 보관 (BSON 16MB 한도 내).
 */
const academyNoticeImageSchema = new mongoose.Schema({
  data: { type: Buffer, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number },
  originalName: { type: String, default: '' },
  uploadedBy: { type: String, default: '' }
}, {
  timestamps: true
});

module.exports = mongoose.model('AcademyNoticeImage', academyNoticeImageSchema);

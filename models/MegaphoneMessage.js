const mongoose = require('mongoose');

/**
 * 확성기 메시지 스키마
 * Live 피드에 표시되는 학생 응원 메시지 저장
 */
const megaphoneMessageSchema = new mongoose.Schema({
  // 보낸 학생 정보 (기존 필드명 유지)
  senderPhone: {
    type: String,
    default: ''
  },
  senderName: {
    type: String,
    default: '학생',
    index: true
  },
  senderSchool: {
    type: String,
    default: ''
  },
  senderGrade: {
    type: String,
    default: '',
    index: true
  },
  // 학원명 (학원 학생만 채워짐, 학교 학생은 빈 문자열) — LIVE 티커 학원별 격리용
  senderAcademy: {
    type: String,
    default: '',
    index: true
  },
  // 사용자 타입: school(학교용) / academy(학원용)
  senderUserType: {
    type: String,
    enum: ['school', 'academy'],
    default: 'school'
  },

  // 메시지 내용
  message: {
    type: String,
    required: true,
    maxlength: 50
  },

  // 코인 사용량
  coinUsed: {
    type: Number,
    default: 40
  },

  // 메시지 타입: megaphone(학생 확성기), notice(관리자 공지)
  type: {
    type: String,
    enum: ['megaphone', 'notice'],
    default: 'megaphone'
  },

  // 만료 시간 (24시간 후 자동 삭제)
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24시간 후
    },
    index: { expireAfterSeconds: 0 }
  },

  // 삭제 여부 (소프트 삭제)
  deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// 복합 인덱스
megaphoneMessageSchema.index({ createdAt: -1 });
megaphoneMessageSchema.index({ senderGrade: 1, senderName: 1 });

const MegaphoneMessage = mongoose.model('MegaphoneMessage', megaphoneMessageSchema);

module.exports = MegaphoneMessage;

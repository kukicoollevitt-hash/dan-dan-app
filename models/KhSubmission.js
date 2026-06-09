// models/KhSubmission.js
// BRAIN한국사 — 학생별 강의 학습 기록 (본문/어휘/창의)
const mongoose = require('mongoose');

const KhSubmissionSchema = new mongoose.Schema({
  // 학생 정보
  grade: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, default: '' },
  academyName: { type: String, default: '' },

  // 강의 정보
  unit: { type: String, required: true, index: true },  // "kh_01" ~ "kh_20"

  // ===== 본문학습 =====
  passage: {
    radar: {
      literal:     { type: Number, default: null, min: 0, max: 10 },
      structural:  { type: Number, default: null, min: 0, max: 10 },
      lexical:     { type: Number, default: null, min: 0, max: 10 },
      inferential: { type: Number, default: null, min: 0, max: 10 },
      critical:    { type: Number, default: null, min: 0, max: 10 }
    },
    readingTime:  { type: Number, default: 0 },     // 초 단위
    completed:    { type: Boolean, default: false },
    completedAt:  { type: Date, default: null }
  },

  // ===== 어휘학습 =====
  vocab: {
    answers:     { type: [String], default: [] },   // 학생이 입력한 답안
    score:       { type: Number, default: null },   // 맞은 개수
    total:       { type: Number, default: null },   // 전체 개수
    completed:   { type: Boolean, default: false },
    completedAt: { type: Date, default: null }
  },

  // ===== 창의활동 =====
  creative: {
    question:    { type: String, default: '' },     // 질문 (참고용)
    answer:      { type: String, default: '' },     // 학생 답안 (제출 버튼)
    submitted:   { type: Boolean, default: false },
    submittedAt: { type: Date, default: null }
  },

  // 메타
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 학생 + 강의 조합 유니크 (마지막 상태만 보관 — upsert)
KhSubmissionSchema.index({ grade: 1, name: 1, unit: 1 }, { unique: true });
// 학생별 리포트 조회용
KhSubmissionSchema.index({ grade: 1, name: 1, updatedAt: -1 });

module.exports = mongoose.model('KhSubmission', KhSubmissionSchema);

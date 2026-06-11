// models/KhCertExam.js
// BRAIN한국사 — 예비검정시험 (5급/4급/3급) 응시 결과 (영구 보존)
const mongoose = require('mongoose');

const KhCertExamSchema = new mongoose.Schema({
  // 학생 정보
  grade: { type: String, required: true, index: true },
  name: { type: String, required: true, index: true },
  phone: { type: String, default: '' },
  academyName: { type: String, default: '', index: true },

  // 시험 정보
  level: { type: String, required: true, enum: ['5급', '4급', '3급'], index: true },
  version: { type: String, default: 'v1' },

  // 시험 결과 요약
  score100: { type: Number, required: true, min: 0, max: 100 },  // 100점 환산
  correctCount: { type: Number, required: true },
  total: { type: Number, required: true },
  passed: { type: Boolean, default: false },                      // 90점 이상
  durationSeconds: { type: Number, default: 0 },

  // 시험지 — 학생이 본 그대로 (셔플 없이 원본 순서)
  // 각 문항: { no, type, sourceUnit, question, options[], correctAnswer, pickedAnswer, isCorrect, explanation }
  questions: { type: [mongoose.Schema.Types.Mixed], default: [] },

  // 메타
  startedAt: { type: Date, default: Date.now },
  submittedAt: { type: Date, default: Date.now, index: true },
  createdAt: { type: Date, default: Date.now }
});

// 학생별 시도 이력 (가장 최근 합격 여부 확인용)
KhCertExamSchema.index({ grade: 1, name: 1, level: 1, submittedAt: -1 });
// 학원별 관리자 조회용
KhCertExamSchema.index({ academyName: 1, level: 1, submittedAt: -1 });

module.exports = mongoose.model('KhCertExam', KhCertExamSchema);

// models/KhExamResult.js
// BRAIN한국사 — 단원평가(20문항) 시도별 기록 (영구 보존)
const mongoose = require('mongoose');

const KhExamResultSchema = new mongoose.Schema({
  // 학생 정보
  grade: { type: String, required: true, index: true },
  name: { type: String, required: true, index: true },
  phone: { type: String, default: '' },
  academyName: { type: String, default: '', index: true },

  // 시험 결과 요약
  score100: { type: Number, required: true, min: 0, max: 100 },  // 100점 환산 점수
  correctCount: { type: Number, required: true },                 // 맞힌 개수
  total: { type: Number, required: true },                        // 전체 문항 (보통 20)
  passed: { type: Boolean, default: false },                      // 90점 이상
  durationSeconds: { type: Number, default: 0 },                  // 풀이 시간 (옵션)

  // 영역별 정답률 (q1~q5 카테고리 라벨 기준)
  catStats: {
    type: mongoose.Schema.Types.Mixed,  // { '중심내용': {correct, total}, ... }
    default: {}
  },

  // 시험지 전체 — 시험지 보기용
  // 각 문항: { unitKey, unitNo, unitTitle, qKey, category, questionText, options[],
  //          correctOriginal, pickedOriginal, isCorrect, explain, detail, passage }
  questions: { type: [mongoose.Schema.Types.Mixed], default: [] },

  // 메타
  attemptedAt: { type: Date, default: Date.now, index: true },
  createdAt: { type: Date, default: Date.now }
});

// 학생별 시도 이력 조회용
KhExamResultSchema.index({ grade: 1, name: 1, attemptedAt: -1 });
// 학원별 관리자 조회용
KhExamResultSchema.index({ academyName: 1, attemptedAt: -1 });

module.exports = mongoose.model('KhExamResult', KhExamResultSchema);

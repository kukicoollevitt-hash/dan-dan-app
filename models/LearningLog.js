// models/LearningLog.js
const mongoose = require("mongoose");

const LearningLogSchema = new mongoose.Schema({
  grade: { type: String }, // 학년
  name: { type: String }, // 이름
  phone: { type: String }, // 전화번호 (고유 식별용)
  school: { type: String }, // 학원명
  series: { type: String }, // 시리즈 (예: "BRAIN업")
  unit: { type: String }, // 단원 코드 (예: "geo_01")

  // 레이더 차트 데이터 (5가지 영역 점수)
  radar: {
    literal: { type: Number, default: 0 },      // ① 핵심 이해력
    structural: { type: Number, default: 0 },   // ② 구조 파악력
    lexical: { type: Number, default: 0 },      // ③ 어휘 맥락력
    inferential: { type: Number, default: 0 },  // ④ 추론 통합력
    critical: { type: Number, default: 0 }      // ⑤ 비판 적용력
  },

  completed: { type: Boolean, default: false }, // 학습 완료 여부
  deleted: { type: Boolean, default: false }, // 소프트 삭제 여부

  timestamp: { type: Date, default: Date.now }
});

// grade, name, phone, timestamp으로 인덱스 생성
LearningLogSchema.index({ grade: 1, name: 1, phone: 1, timestamp: -1 });

module.exports = mongoose.model("LearningLog", LearningLogSchema);

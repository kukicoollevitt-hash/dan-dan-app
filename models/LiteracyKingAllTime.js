const mongoose = require('mongoose');

// 문해왕 역대(올타임) 최고 기록 — 월별 완전 리셋(deleteMany) 전에도 역대 기록은 여기 영구 보존
const LiteracyKingAllTimeSchema = new mongoose.Schema({
  grade: { type: String, required: true },
  name: { type: String, required: true },
  academyName: { type: String, default: '' },
  series: { type: String, required: true, index: true },
  unitId: { type: String, required: true, index: true },
  unitTitle: { type: String, default: '' },
  bestScore: { type: Number, required: true },   // 역대 최고 점수
  bestTime: { type: Number, default: 0 },        // 그 점수를 냈을 때의 시간
  maxCombo: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

LiteracyKingAllTimeSchema.index({ grade: 1, name: 1, unitId: 1 }, { unique: true });
LiteracyKingAllTimeSchema.index({ series: 1, unitId: 1, bestScore: -1, bestTime: 1 });

module.exports = mongoose.model('LiteracyKingAllTime', LiteracyKingAllTimeSchema);

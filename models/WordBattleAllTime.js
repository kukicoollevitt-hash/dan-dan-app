const mongoose = require('mongoose');

// 단어월드컵 역대(올타임) 최고 기록 — 월 시즌제 도입(2026-09) 후에도 역대 기록은 여기 영구 보존
// WordBattleRecord.bestTime은 매월 시즌 기록으로 리셋되므로, 역대 최고는 이 컬렉션이 유일한 원본
const WordBattleAllTimeSchema = new mongoose.Schema({
  grade: { type: String, required: true },
  name: { type: String, required: true },
  academyName: { type: String, default: '' },
  unitId: { type: String, required: true, index: true },
  unitTitle: { type: String, default: '' },
  bestTime: { type: Number, required: true },           // 역대 최고 기록 (초)
  updatedAt: { type: Date, default: Date.now }
});

WordBattleAllTimeSchema.index({ grade: 1, name: 1, unitId: 1 }, { unique: true });
WordBattleAllTimeSchema.index({ unitId: 1, bestTime: 1 });

module.exports = mongoose.model('WordBattleAllTime', WordBattleAllTimeSchema);

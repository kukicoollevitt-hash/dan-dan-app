const mongoose = require('mongoose');

const LiteracyKingRecordSchema = new mongoose.Schema({
  grade: { type: String, required: true },
  name: { type: String, required: true },
  academyName: { type: String, default: '' },
  series: { type: String, required: true, index: true },  // 'on' | 'up' | 'fit' | 'deep'
  unitId: { type: String, required: true, index: true },
  unitTitle: { type: String, default: '' },
  bestScore: { type: Number, required: true },           // 최고 점수
  bestTime: { type: Number, default: 0 },                // 최고 점수 기록 시 시간 (동점 시 빠른 순)
  maxCombo: { type: Number, default: 0 },
  attemptCount: { type: Number, default: 1 },
  awardedPoints: { type: Number, default: 0 },           // 이번 달 부여 최대 포인트
  monthKey: { type: String, default: '' },
  lastPlayedAt: { type: Date, default: Date.now }
});

LiteracyKingRecordSchema.index({ grade: 1, name: 1, unitId: 1 }, { unique: true });
LiteracyKingRecordSchema.index({ series: 1, unitId: 1, bestScore: -1, bestTime: 1 });

module.exports = mongoose.model('LiteracyKingRecord', LiteracyKingRecordSchema);

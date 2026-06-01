const mongoose = require('mongoose');

const WordBattleRecordSchema = new mongoose.Schema({
  grade: { type: String, required: true },              // 학년
  name: { type: String, required: true },               // 이름
  academyName: { type: String, default: '' },           // 학원명 (전체 통합 순위지만 식별용)
  unitId: { type: String, required: true, index: true },// 단원 ID (예: on_bio_01)
  unitTitle: { type: String, default: '' },             // 단원명 표시용
  bestTime: { type: Number, required: true },           // 최고 기록 (초) — 영구 보존
  attemptCount: { type: Number, default: 1 },           // 누적 시도 횟수
  awardedPoints: { type: Number, default: 0 },          // 이번 달 부여 최대 포인트 (월별 리셋)
  monthKey: { type: String, default: '' },              // YYYY-MM (월별 리셋 추적용)
  lastPlayedAt: { type: Date, default: Date.now }
});

// 학생당 단원당 1행 (best time만 유지)
WordBattleRecordSchema.index({ grade: 1, name: 1, unitId: 1 }, { unique: true });

// 단원별 순위 조회 인덱스 (단원 + 시간 빠른 순)
WordBattleRecordSchema.index({ unitId: 1, bestTime: 1 });

module.exports = mongoose.model('WordBattleRecord', WordBattleRecordSchema);

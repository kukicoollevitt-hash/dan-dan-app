const mongoose = require('mongoose');

// 월별 단어배틀 챔피언 (TOP 3) 아카이브
const WordBattleChampionSchema = new mongoose.Schema({
  monthKey: { type: String, required: true, index: true }, // YYYY-MM (예: 2026-06)
  rank: { type: Number, required: true },                  // 1, 2, 3
  title: { type: String, required: true },                 // '챔피언' / '준우승' / '동상'
  grade: { type: String, required: true },
  name: { type: String, required: true },
  academyName: { type: String, default: '' },
  totalPoints: { type: Number, required: true },          // 그 달 누적 포인트
  bonusBadges: { type: Number, required: true },          // 지급된 보너스 뱃지 (1000/500/250)
  createdAt: { type: Date, default: Date.now }
});

WordBattleChampionSchema.index({ monthKey: 1, rank: 1 });

module.exports = mongoose.model('WordBattleChampion', WordBattleChampionSchema);

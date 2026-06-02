const mongoose = require('mongoose');

const LiteracyKingChampionSchema = new mongoose.Schema({
  monthKey: { type: String, required: true, index: true },
  series: { type: String, required: true },              // on | up | fit | deep
  rank: { type: Number, required: true },                // 1, 2, 3
  title: { type: String, required: true },               // 챔피언 / 준우승 / 동상
  grade: String, name: String, academyName: String,
  totalPoints: Number,
  bonusBadges: Number,
  createdAt: { type: Date, default: Date.now }
});

LiteracyKingChampionSchema.index({ monthKey: 1, series: 1, rank: 1 });

module.exports = mongoose.model('LiteracyKingChampion', LiteracyKingChampionSchema);

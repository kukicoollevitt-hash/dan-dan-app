const mongoose = require('mongoose');

// 서술형 내신문학 — 학생별 전체 학습 결과(기기 무관) + 통합 리더보드
//   vocab:    bookId -> { pct, correct, total }            (어휘 best)
//   episodes: "bookId::N" -> { pct, v, vt, m, q, qt }       (화별 best + 세부: 어휘/중심/질문)
//   webtoon:  bookId -> true                                (완독)
//   total:    vocab.pct + episodes.pct 누적 합 (웹툰 제외) → 순위 기준
const SeosulScoreSchema = new mongoose.Schema({
  grade: { type: String, required: true },
  name: { type: String, required: true },
  academyName: { type: String, default: '' },
  vocab: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} },
  episodes: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} },
  webtoon: { type: Map, of: Boolean, default: {} },
  total: { type: Number, default: 0, index: true },
  updatedAt: { type: Date, default: Date.now }
});

SeosulScoreSchema.index({ grade: 1, name: 1 }, { unique: true });
SeosulScoreSchema.index({ total: -1, updatedAt: 1 });

module.exports = mongoose.model('SeosulScore', SeosulScoreSchema);

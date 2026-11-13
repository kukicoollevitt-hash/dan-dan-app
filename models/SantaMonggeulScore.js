const mongoose = require("mongoose");

// 🎄 산타 몽글이와 함께하는 크리스마스 — 문학블록팡팡 (120단계 이벤트)
//   학생별 최고기록 1개만 보관: 더 높은 완료단계, 동률이면 더 짧은 총 시간.
//   순위 정렬 = stage 내림차순 → timeMs 오름차순.
const SantaMonggeulScoreSchema = new mongoose.Schema({
  grade: { type: String, required: true },      // 학년
  name: { type: String, required: true },       // 이름
  academyName: { type: String, default: "" },   // 센터
  stage: { type: Number, default: 0 },           // 완료단계(클리어한 단계 수, 0~120)
  words: { type: Number, default: 0 },           // 외운 어휘 수(격파한 블록 누적)
  timeMs: { type: Number, default: 0 },          // 총 소요 시간(ms)
  plays: { type: Number, default: 0 },           // 시도 횟수(참고용)
  updatedAt: { type: Date, default: Date.now },
  at: { type: Date, default: Date.now }          // 최고기록 수립 시각
});

SantaMonggeulScoreSchema.index({ grade: 1, name: 1 }, { unique: true });
SantaMonggeulScoreSchema.index({ stage: -1, timeMs: 1 }); // 리더보드 정렬

module.exports =
  mongoose.models.SantaMonggeulScore ||
  mongoose.model("SantaMonggeulScore", SantaMonggeulScoreSchema);

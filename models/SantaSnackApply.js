const mongoose = require("mongoose");

// 🎁 산타몽글 문학블록팡팡 — 단계 보상 과자 응모(10단계마다 1회)
//   milestone(10·20·…·120)별 학생당 1회만 응모(중복 방지). 응모 건은 기존 CU 응모 풀(SnackOrder, 0뱃지)에 합류.
const SantaSnackApplySchema = new mongoose.Schema({
  grade: { type: String, required: true },
  name: { type: String, required: true },
  academyName: { type: String, default: "" },
  milestone: { type: Number, required: true }, // 10·20·…·120
  itemName: { type: String, default: "" },     // 응모한 과자명
  at: { type: Date, default: Date.now }
});

SantaSnackApplySchema.index({ grade: 1, name: 1, milestone: 1 }, { unique: true });

module.exports =
  mongoose.models.SantaSnackApply ||
  mongoose.model("SantaSnackApply", SantaSnackApplySchema);

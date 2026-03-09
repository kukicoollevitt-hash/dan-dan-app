// models/SentenceRead.js
const mongoose = require("mongoose");

const SentenceReadSchema = new mongoose.Schema({
  // 학생 식별 정보
  grade: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String },

  // 단원 정보
  unit: { type: String, required: true }, // 예: "modern_01"

  // 문장 완독 상태 (선택된 문장 인덱스 배열)
  selectedSentences: { type: [Number], default: [] },

  // 문단별 완료 상태
  completedParagraphs: { type: [Number], default: [] },

  // 독해 시간 정보
  readingTime: {
    start: { type: Date },
    end: { type: Date },
    duration: { type: Number, default: 0 } // 밀리초
  },

  updatedAt: { type: Date, default: Date.now }
});

// 복합 인덱스 (학생 + 단원으로 빠른 조회)
SentenceReadSchema.index({ grade: 1, name: 1, phone: 1, unit: 1 }, { unique: true });

module.exports = mongoose.model("SentenceRead", SentenceReadSchema);

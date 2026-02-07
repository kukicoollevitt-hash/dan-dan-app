const mongoose = require('mongoose');

const SpeedReadingKingSchema = new mongoose.Schema({
  eventName: { type: String, required: true, index: true }, // 이벤트명 (예: "2025년 2월 독서왕")
  bookId: { type: String, required: true },                  // 도서 ID (예: "sonagi")
  bookTitle: { type: String, required: true },               // 도서 제목 (예: "🌧️ 소나기")
  grade: { type: String, required: true },                   // 학년
  name: { type: String, required: true },                    // 이름
  phone: { type: String, required: true },                   // 전화번호 뒤 4자리
  correctCount: { type: Number, required: true },            // 맞힌 개수
  totalQuestions: { type: Number, default: 10 },             // 총 문제 수
  totalTime: { type: Number, required: true },               // 총 소요 시간(초) - 독서 + 퀴즈 포함
  createdAt: { type: Date, default: Date.now }               // 참가 시간
});

// 복합 인덱스: 이벤트별 순위 조회용 (시간이 짧을수록 높은 순위)
SpeedReadingKingSchema.index({ eventName: 1, totalTime: 1 });

module.exports = mongoose.model('SpeedReadingKing', SpeedReadingKingSchema);

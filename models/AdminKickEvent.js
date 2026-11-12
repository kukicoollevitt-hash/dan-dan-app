const mongoose = require("mongoose");

// 🔒 관리자(선생님) 단일세션 킥 이벤트 — 다른 기기 로그인으로 자동 로그아웃된 기록 + 경고 확인 여부
//   미들웨어가 킥 순간(세션 파기 전) 신원을 기록, 로그인 페이지 모달의 '확인하기' 클릭 시 acknowledged 표시.
//   슈퍼관리자 '선생님 계정공유 경고 현황'에서 조회(읽기 전용).
const AdminKickEventSchema = new mongoose.Schema({
  academyName: { type: String, index: true }, // 킥된 센터(관리자 academyName)
  name: String,                                // 선생님 이름
  adminId: String,                             // Admin._id
  ip: String,                                  // 접속 IP (cf-connecting-ip 우선)
  userAgent: String,                           // 기기/브라우저(앞 300자)
  kickedAt: { type: Date, default: Date.now }, // 자동 로그아웃된 시각
  acknowledged: { type: Boolean, default: false }, // 경고 모달 '확인하기' 클릭 여부
  acknowledgedAt: Date                         // 확인 클릭 시각
});

AdminKickEventSchema.index({ academyName: 1, kickedAt: -1 });

module.exports =
  mongoose.models.AdminKickEvent ||
  mongoose.model("AdminKickEvent", AdminKickEventSchema);

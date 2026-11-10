const mongoose = require("mongoose");

// © 교재 PDF 다운로드 저작권 동의 기록 — 센터별 동의 내역(감사/조회 전용)
//   teaching-guide.html 다운로드 시 '동의하고 다운로드' 클릭마다 1건 적재.
const CopyrightConsentSchema = new mongoose.Schema({
  academyName: { type: String, index: true }, // 동의한 센터(정규화된 admin.academyName)
  name: String,                                // 동의한 관리자/선생님 이름
  adminId: String,                             // Admin._id
  action: String,                              // 어떤 다운로드였는지(버튼 onclick 요약, 앞 200자)
  ip: String,                                  // 접속 IP (cf-connecting-ip 우선)
  userAgent: String,                           // 기기/브라우저(앞 300자)
  at: { type: Date, default: Date.now }
});

CopyrightConsentSchema.index({ academyName: 1, at: -1 });

module.exports =
  mongoose.models.CopyrightConsent ||
  mongoose.model("CopyrightConsent", CopyrightConsentSchema);

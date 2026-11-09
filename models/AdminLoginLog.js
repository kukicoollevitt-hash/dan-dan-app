const mongoose = require("mongoose");

// 🛰️ 학원 관리자(선생님) 로그인 IP 관찰 로그 — 계정 공유(동시·원거리 접속) 탐지용
// 지정된 관찰 대상 학원에 대해서만 기록한다 (server.js LOGIN_WATCH_ACADEMIES).
const AdminLoginLogSchema = new mongoose.Schema({
  academyName: { type: String, index: true }, // 관찰 대상 학원명(정규화된 admin.academyName)
  name: String,                                // 로그인한 선생님 이름
  adminId: String,                             // Admin._id
  ip: String,                                  // 실제 접속 IP (cf-connecting-ip 우선)
  country: String,                             // cf-ipcountry (국가코드)
  userAgent: String,                           // 기기/브라우저 식별(앞 300자)
  // 📍 IP 기반 지역 추정 (ip-api, 로그인 직후 백필) — 거리 기반 동시접속 경고용
  region: String,                              // 시/도 추정
  city: String,                                // 시/구 추정
  isp: String,                                 // 통신사
  lat: Number,                                 // 위도
  lon: Number,                                 // 경도
  at: { type: Date, default: Date.now }
});

AdminLoginLogSchema.index({ academyName: 1, at: -1 });

module.exports =
  mongoose.models.AdminLoginLog ||
  mongoose.model("AdminLoginLog", AdminLoginLogSchema);

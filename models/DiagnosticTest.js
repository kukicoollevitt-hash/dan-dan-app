// models/DiagnosticTest.js
const mongoose = require("mongoose");

const DiagnosticTestSchema = new mongoose.Schema({
  // 지점 정보 (학교용)
  branchName: {
    type: String,
    default: ''
  }, // 지점명(학교명)

  // 학원 정보 (학원용)
  academyName: {
    type: String,
    default: ''
  }, // 학원명

  // 사용자 타입: school(학교용) / academy(학원용)
  userType: {
    type: String,
    enum: ["school", "academy"],
    default: "school"
  },

  // 학생 정보
  studentGrade: {
    type: String,
    required: true
  }, // 학년
  studentClassNum: {
    type: String,
    default: ''
  }, // 반
  studentName: {
    type: String,
    required: true
  }, // 학생 이름
  studentPhone: {
    type: String,
    required: true
  }, // 학생 연락처
  parentName: {
    type: String,
    default: ''
  }, // 학부모 성함
  parentPhone: {
    type: String,
    default: ''
  }, // 학부모 연락처

  // 등록 시간
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("DiagnosticTest", DiagnosticTestSchema);

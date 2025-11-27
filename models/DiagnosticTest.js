// models/DiagnosticTest.js
const mongoose = require("mongoose");

const DiagnosticTestSchema = new mongoose.Schema({
  // 학생 정보
  studentGrade: {
    type: String,
    required: true
  }, // 학년
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
    required: true
  }, // 학부모 성함
  parentPhone: {
    type: String,
    required: true
  }, // 학부모 연락처

  // 등록 시간
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("DiagnosticTest", DiagnosticTestSchema);

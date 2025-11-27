// models/CourseApplication.js
const mongoose = require("mongoose");

const CourseApplicationSchema = new mongoose.Schema({
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
  parentPhone: {
    type: String,
    required: true
  }, // 학부모 연락처

  // 진단 결과
  grade: {
    type: String,
    required: true
  }, // 등급
  series: {
    type: String,
    required: true
  }, // 시리즈 (예: "시즌1", "시즌2")

  // 등록 시간
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("CourseApplication", CourseApplicationSchema);

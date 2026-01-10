// models/CourseApplication.js
const mongoose = require("mongoose");

const CourseApplicationSchema = new mongoose.Schema({
  // 지점 정보
  branchName: {
    type: String,
    required: true
  }, // 지점명(학원명)

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

  // 학생 답안 (각 문제별 선택한 답 인덱스, 0-3)
  answers: {
    type: [Number],
    default: []
  },

  // 점수
  score: {
    type: Number,
    default: 0
  },

  // 소요 시간
  duration: {
    type: String,
    default: ''
  },

  // 등록 시간
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("CourseApplication", CourseApplicationSchema);

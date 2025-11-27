// models/Assignment.js
const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
  // 관리자 정보
  assignedBy: {
    type: String,
    required: true
  }, // 관리자 ID 또는 이름

  // 학생 정보 (복수 선택 가능)
  assignedTo: [{
    type: String,
    required: true
  }], // 학생 학년+이름 배열 (예: ["초4 김철수", "초5 이영희"])

  // 주단위 정보
  weekStartDate: {
    type: Date,
    required: true
  }, // 주 시작일 (월요일)

  weekNumber: {
    type: Number
  }, // 몇 주차 (1~52)

  // 과제 날짜
  dueDate: {
    type: Date,
    required: true,
    index: true
  }, // 과제 마감일

  dayOfWeek: {
    type: String
  }, // "월", "화", "수", "목", "금", "토", "일"

  // 학습 내용
  series: {
    type: String,
    required: true
  }, // 시리즈 (예: "BRAINUP", "BRAINON")

  category: {
    type: String,
    required: true
  }, // 카테고리 (예: "social", "korlit")

  subject: {
    type: String,
    required: true
  }, // 과목 (예: "geo", "law")

  units: [{
    type: Number,
    required: true
  }], // 단원 번호 배열 (예: [1, 2, 3])

  // 템플릿 정보 (선택)
  templateName: {
    type: String
  }, // 템플릿 이름 (예: "중1 지리 1주차")

  // 완료 추적
  completedBy: [{
    studentName: { type: String, required: true },
    completedAt: { type: Date, default: Date.now },
    unit: { type: Number } // 완료한 단원 번호
  }],

  // 상태 관리
  status: {
    type: String,
    enum: ["active", "deleted", "trashed"],
    default: "active"
  },

  // 생성/수정 시간
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 복합 인덱스 생성 (성능 최적화)
AssignmentSchema.index({ dueDate: 1, status: 1 });
AssignmentSchema.index({ assignedTo: 1, dueDate: 1 });
AssignmentSchema.index({ weekStartDate: 1, status: 1 });

// 업데이트 시 updatedAt 자동 갱신
AssignmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Assignment", AssignmentSchema);

const mongoose = require('mongoose');

const mockExamResultSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    // 학생 정보
    studentInfo: {
        schoolName: { type: String, required: true },
        grade: { type: String, required: true },
        studentName: { type: String, required: true },
        phoneNumber: { type: String, required: true }
    },
    examId: {
        type: String,
        required: true,
        default: 'korean_mock_1'
    },
    examTitle: {
        type: String,
        default: '국어 모의고사 1회'
    },
    // 등급
    grade: {
        type: Number
    },
    answers: {
        type: Map,
        of: Number,  // { "1": 3, "2": 1, ... }
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    correctCount: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        default: 45
    },
    wrongAnswers: [{
        questionNum: Number,
        userAnswer: Number,
        correctAnswer: Number
    }],
    // 소요시간 (MM:SS 형식)
    elapsedTimeStr: {
        type: String,
        default: '--:--'
    },
    completedAt: {
        type: Date,
        default: Date.now
    },
    // 제출 시점의 예측값 (레이더 차트와 동일: 현재 회차 + 보완학습)
    predictionAtSubmit: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    }
}, {
    timestamps: true
});

// 복합 인덱스: 사용자별 시험 결과 조회 최적화
mockExamResultSchema.index({ userId: 1, examId: 1, completedAt: -1 });

module.exports = mongoose.model('MockExamResult', mockExamResultSchema);

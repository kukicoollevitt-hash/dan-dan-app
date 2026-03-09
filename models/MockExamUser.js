const mongoose = require('mongoose');

const mockExamUserSchema = new mongoose.Schema({
    // 로그인 정보
    phone: {
        type: String,
        required: true,
        unique: true  // 전화번호로 로그인
    },
    password: {
        type: String,
        required: true
    },

    // 학생 정보
    name: {
        type: String,
        required: true
    },
    school: {
        type: String,
        required: true
    },
    grade: {
        type: String,
        required: true
    },

    // 계정 상태
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },

    // 이용권
    tickets: {
        type: Number,
        default: 0
    },

    // AI 추천 보완 학습 목표 점수 (null이면 현재 평균 점수 사용)
    targetScore: {
        type: Number,
        default: null
    },

    // 시험 진행 상태 (회차별)
    examProgress: [{
        examId: { type: String, required: true },  // 'korean_mock_1', 'korean_mock_2' 등
        status: {
            type: String,
            enum: ['not_started', 'in_progress', 'completed'],
            default: 'not_started'
        },
        // 진행 중인 경우 저장되는 데이터
        currentAnswers: {
            type: Map,
            of: Number
        },
        remainingTime: Number,  // 남은 시간 (초)
        startedAt: Date,

        // 완료된 경우의 결과 참조
        resultId: { type: mongoose.Schema.Types.ObjectId, ref: 'MockExamResult' },

        // 오답복습 완료 여부
        wrongReviewCompleted: { type: Boolean, default: false },
        wrongReviewCompletedAt: Date
    }],

    lastLogin: Date,

    deleted: { type: Boolean, default: false },
    deletedAt: Date
}, {
    timestamps: true
});

// 인덱스
mockExamUserSchema.index({ phone: 1 });
mockExamUserSchema.index({ school: 1, grade: 1 });

module.exports = mongoose.model('MockExamUser', mockExamUserSchema);

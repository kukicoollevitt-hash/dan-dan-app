const mongoose = require('mongoose');

const mockExamConsultationSchema = new mongoose.Schema({
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
    phone: {
        type: String,
        required: true
    },

    // 상담 상태
    status: {
        type: String,
        enum: ['pending', 'contacted', 'completed'],
        default: 'pending'
    },

    // 메모
    memo: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// 인덱스
mockExamConsultationSchema.index({ status: 1 });
mockExamConsultationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('MockExamConsultation', mockExamConsultationSchema);

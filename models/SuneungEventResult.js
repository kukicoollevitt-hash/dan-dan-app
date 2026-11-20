const mongoose = require('mongoose');

// 2027학년도 온라인 수학능력시험(이벤트) 응시 결과
const suneungEventResultSchema = new mongoose.Schema({
    // 센터(학원) 고정 — ?id= 로 들어온 academy admin
    academyId: { type: String, default: '' },      // Admin._id (24hex) 문자열
    academyName: { type: String, default: '' },     // 표시명(브레인문해력_OO센터)

    // 응시자 정보
    studentName: { type: String, required: true },
    grade: { type: String, required: true },         // 초3~고3
    phoneNumber: { type: String, default: '' },

    // 채점 결과
    examId: { type: String, default: 'suneung_2027' },
    examTitle: { type: String, default: '2027학년도 온라인 수학능력시험' },
    gradeLevel: { type: Number },                    // 1~9 등급
    score: { type: Number, required: true },         // 100점 만점
    correctCount: { type: Number, required: true },
    totalQuestions: { type: Number, default: 45 },
    answers: { type: Map, of: Number },              // { "1": 3, ... } (미응답 0)
    wrongAnswers: [{
        questionNum: Number,
        userAnswer: Number,
        correctAnswer: Number
    }],
    elapsedTimeStr: { type: String, default: '--:--' },

    completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// 센터별 최신순 조회 최적화
suneungEventResultSchema.index({ academyId: 1, completedAt: -1 });

module.exports = mongoose.model('SuneungEventResult', suneungEventResultSchema);

// models/Writing100Submission.js
// BRAIN입문 쓰기문해 · 100일 · 단원별 학습 기록 + 정답률
const mongoose = require('mongoose');

const AccStatSchema = new mongoose.Schema({
  correct:  { type: Number, default: 0 },
  attempts: { type: Number, default: 0 },
  pct:      { type: Number, default: 0 }
}, { _id: false });

const Writing100SubmissionSchema = new mongoose.Schema({
  grade:       { type: String, required: true },
  name:        { type: String, required: true },
  academyName: { type: String, default: '' },

  day:   { type: Number, required: true, min: 1, max: 100 },
  unit:  { type: String, required: true, index: true },   // "100day_001" ~ "100day_100"
  topic: { type: String, default: '' },

  stagesDone:        { type: [Boolean], default: [] },    // 7단계별 완료 여부
  readingElapsedMs:  { type: Number, default: 0 },

  // 단계별 정답률 (본문학습·글쓰기 제외)
  accuracies: {
    vocab:     { type: AccStatSchema, default: () => ({}) },   // 1단계 어휘학습
    word:      { type: AccStatSchema, default: () => ({}) },   // 3단계 단어학습
    wordApply: { type: AccStatSchema, default: () => ({}) },   // 4단계 단어활용
    sentence:  { type: AccStatSchema, default: () => ({}) },   // 5단계 문장학습
    paraOrder: { type: AccStatSchema, default: () => ({}) },   // 6단계 문단순서
    total:     { type: AccStatSchema, default: () => ({}) }    // 종합
  },

  // 오답 상세 (스테이지별 문항 단위) · 최고 기록 유지 시 함께 병합
  // 각 항목 필드는 스테이지 특성에 맞게 자유롭게 담아 저장 (Mixed)
  wrongAnswers: {
    vocab:     { type: [mongoose.Schema.Types.Mixed], default: [] },  // { idx, meaning, chosen, correct }
    word:      { type: [mongoose.Schema.Types.Mixed], default: [] },  // { idx, sentence, chosen, correct }
    wordApply: { type: [mongoose.Schema.Types.Mixed], default: [] },
    sentence:  { type: [mongoose.Schema.Types.Mixed], default: [] },  // { paraIdx, sentence, chosen, correct }
    paraOrder: { type: [mongoose.Schema.Types.Mixed], default: [] }
  },

  // 글쓰기 응답
  writing:   { type: [{ q: String, a: String }], default: [] },
  composed:  { type: String, default: '' },

  // 학생 낭독 녹음 (2단계 문단별 · 5단계 전체) · 서버 로컬 파일 참조
  recordings: {
    type: [{
      part:      String,     // "문단1", "문단2", "전체" 등
      filename:  String,     // uploads/ 상대 경로 (예: writing100/초3_김윤슬/Day001/문단1_20260705_143022.mp4)
      size:      Number,     // 바이트
      createdAt: { type: Date, default: Date.now }
    }],
    default: []
  },

  // 재학습 판정용 · 7단계 전부 완료된 최초 시점 (upsert 시 최초 1회만 세팅)
  firstCompletedAt: { type: Date, default: null },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: false });

// 학생·단원 단위 유니크
Writing100SubmissionSchema.index({ grade: 1, name: 1, unit: 1 }, { unique: true });

module.exports = mongoose.model('Writing100Submission', Writing100SubmissionSchema);

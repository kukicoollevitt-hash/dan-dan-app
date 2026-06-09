// models/CritiqueSubmission.js
// BRAIN비평 시사문해 — 학생별 매일비평 답안 제출 기록
const mongoose = require('mongoose');

const CritiqueSubmissionSchema = new mongoose.Schema({
  // 학생 정보
  grade: { type: String, required: true },          // "초5학년" 등
  name: { type: String, required: true },           // 학생 이름
  phone: { type: String, default: '' },             // 식별용 (전화번호)
  academyName: { type: String, default: '' },       // 학원명

  // 기사 정보
  date: { type: String, required: true, index: true },    // "2026-06-01" — 기사 날짜
  contentGrade: { type: String, required: true },         // "elem34" | "elem56" | "mid12" | "mid3high1"
  category: { type: String, default: '' },                // 기사 카테고리 (조회용)
  title: { type: String, default: '' },                   // 기사 제목 (조회용)

  // 학생 답안 — 육하원칙
  sixW: {
    who: { type: String, default: '' },
    when: { type: String, default: '' },
    where: { type: String, default: '' },
    what: { type: String, default: '' },
    why: { type: String, default: '' },
    how: { type: String, default: '' }
  },

  // 학생 답안 — 생각 쓰기 3문항
  thinking: {
    q1: { type: String, default: '' },
    q2: { type: String, default: '' },
    q3: { type: String, default: '' }
  },

  // 메타
  submittedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  // ===== AI 채점 결과 =====
  grading: {
    stars: { type: Number, default: null, min: 0, max: 5 },        // 1.0 ~ 5.0 (0.5 단위, 반쪽 별)
    totalScore: { type: Number, default: null, min: 0, max: 100 }, // 종합 점수
    sixWScore: { type: Number, default: null, min: 0, max: 100 },
    thinkingScore: { type: Number, default: null, min: 0, max: 100 },
    criteria: {
      accuracy:   { type: Number, default: null, min: 0, max: 100 },
      logic:      { type: Number, default: null, min: 0, max: 100 },
      creativity: { type: Number, default: null, min: 0, max: 100 }
    },
    encouragement: { type: String, default: '' },  // 칭찬 한 줄
    improvement:   { type: String, default: '' },  // 개선점 한 줄
    gradedAt:      { type: Date, default: null },
    gradedModel:   { type: String, default: '' },  // "gpt-4o-mini" 등
    fallback:      { type: Boolean, default: false } // AI 실패 → 규칙기반 폴백 여부
  }
});

// 학생 + 기사 날짜 조합 유니크 (마지막 제출만 보관 — upsert로 갱신)
CritiqueSubmissionSchema.index({ grade: 1, name: 1, date: 1 }, { unique: true });
// 학생별 조회용 인덱스
CritiqueSubmissionSchema.index({ grade: 1, name: 1, submittedAt: -1 });

module.exports = mongoose.model('CritiqueSubmission', CritiqueSubmissionSchema);

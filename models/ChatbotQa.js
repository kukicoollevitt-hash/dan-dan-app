const mongoose = require('mongoose');

/**
 * 센터 원장·선생님 상담 챗봇 지식베이스 (Q&A)
 *  - 등록/수정/삭제: '브레인문해원_테스트' 관리자 계정만 (학원 공지와 동일 화이트리스트)
 *  - 검색/조회: 모든 센터 관리자
 *
 * 하이브리드 검색:
 *  - B(의미검색): question+answer 를 임베딩(text-embedding-3-small)해 저장 → 쿼리 임베딩과 코사인 유사도
 *  - A(키워드): keywords + question 텍스트의 토큰 겹침
 *  두 점수를 가중합해 추천 답변 여러 개를 순위대로 반환.
 *
 * 첨부 이미지는 기존 /api/academy-notice-image/:id (DB Buffer 저장)를 재사용해 URL만 보관.
 */
const chatbotQaSchema = new mongoose.Schema({
  // 질문 (대표 질문 · 검색·표시용)
  question: {
    type: String,
    required: true,
    maxlength: 1000
  },

  // 답변 본문 (글 · 필요 시 이미지 URL 포함 가능)
  answer: {
    type: String,
    required: true,
    maxlength: 20000
  },

  // 첨부 이미지 URL 목록 (/api/academy-notice-image/:id 형태)
  images: {
    type: [String],
    default: []
  },

  // 키워드 (A · 키워드 매칭 가중치)
  keywords: {
    type: [String],
    default: []
  },

  // 분류 (정산/학습/교재/시스템/기타 등 · 자유 문자열)
  category: {
    type: String,
    default: '',
    index: true
  },

  // 의미검색용 임베딩 벡터 (B)
  embedding: {
    type: [Number],
    default: []
  },
  // 임베딩 대상 텍스트(재생성 판단용) · 사용한 모델명
  embeddingText: { type: String, default: '' },
  embeddingModel: { type: String, default: '' },

  author: { type: String, default: '브레인문해력' },
  createdBy: { type: String, default: '' },

  deleted: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true
});

chatbotQaSchema.index({ deleted: 1, category: 1, createdAt: -1 });

module.exports = mongoose.model('ChatbotQa', chatbotQaSchema);

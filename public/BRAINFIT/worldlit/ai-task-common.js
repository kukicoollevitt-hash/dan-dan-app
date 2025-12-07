/**
 * AI 추천 과제 복습 완료 처리 공통 스크립트
 *
 * 사용법:
 * 1. HTML 파일에 <script src="./ai-task-common.js"></script> 추가
 * 2. submitReport() 함수 끝에 아래 코드 추가:
 *
 *    try {
 *      const unitId = (window.CUR_UNIT || 'geo_01');
 *      await window.markAITaskAsCompleted(stu.grade, stu.name, unitId);
 *    } catch (error) {
 *      console.error('[AI 과제 복습 완료 처리 오류]', error);
 *    }
 */

/**
 * AI 추천 과제 복습 완료 표시
 * - 학습실에서 해당 단원이 AI 추천 과제로 있으면 status를 'completed'로 변경
 *
 * @param {string} grade - 학년 (예: '2학년')
 * @param {string} name - 이름 (예: '이학년')
 * @param {string} unitId - 단원 ID (예: 'geo_01')
 */
window.markAITaskAsCompleted = async function(grade, name, unitId) {
  try {
    const response = await fetch('/api/user-progress/ai-task/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grade, name, unitId })
    });

    const result = await response.json();
    if (result.ok) {
      console.log('[AI 과제 복습 완료]', unitId, result.message);
    } else {
      console.warn('[AI 과제 복습 완료 실패]', unitId, result.message);
    }
  } catch (error) {
    console.error('[AI 과제 복습 완료 API 오류]', error);
  }
};

# Dan-Dan App 프로젝트 가이드

## 프로젝트 구조

```
/public/BRAINUP/
├── science/      # 과학 (physics, chem, bio, earth, on_chem)
├── social/       # 사회 (law, geo, world1, world2, soc)
├── korlit/       # 국어문학 (classic, poem, novel)
├── person/       # 인물 (people1, people2, fit_people)
└── writing/      # 글쓰기
```

---

## 🔴 자주 발생하는 오류 & 해결법

### 1. 어휘학습 채점 - 탭 이동 시 상단 채점 사라짐
- **원인**: `renderVocabFill` 함수가 매번 DOM을 다시 그림 (재렌더링 체크 없음)
- **해결**: `_vocabFillRendered` 플래그 추가
```javascript
// 이미 렌더링되었으면 다시 렌더링하지 않음 (탭 전환 시 상태 유지)
if (_vocabFillRendered) {
  console.log('[renderVocabFill] 이미 렌더링됨, 건너뛰기');
  return;
}
// 렌더링 완료 후
_vocabFillRendered = true;
```
- **주의**: `chem_content.js`에는 이 체크가 없었음! `physics_content.js` 참고

---

### 2. 완독 팝업 - 좌측하단에 뜸 (위치 이상)
- **원인**: `toast-style` ID가 2번 정의됨 (CSS 충돌)
  - 1차: `.complete-toast` 스타일 (함수 외부, 먼저 실행)
  - 2차: `.toast-pop` 스타일 (showCompletionToast 내부)
- **문제**: `if (!document.getElementById('toast-style'))`가 false → `.toast-pop` 스타일 미추가
- **해결**: 중복된 `toast-style` 정의 제거 또는 ID 분리

---

### 3. 지문 하단에 코드가 텍스트로 노출
- **원인**: `</script>` 태그가 닫히고, `<script>` 없이 함수 코드 시작
- **해결**: `<script>` 태그 추가

---

### 4. 글다듬기 제출 버튼 - 중앙에 떠있음
- **원인**: `</div>`가 잘못 닫혀서 `.creative-box`가 너무 일찍 닫힘
- **결과**: `creative-input-wrap`, `creative-actions`가 `.creative-box` 밖으로 나감
- **해결**: div 구조 확인 후 수정

---

### 5. 보완학습 - 맞힌 문제도 나오게
- **해결**: 모든 영역(literal, structural, lexical, inferential, critical)을 `needKeys`에 포함

---

### 6. 중심내용 순서 불일치
- **원인**: `*_content.js`의 `paragraphMain` 순서가 본문(passage) 순서와 다름
- **해결**: 본문 구조 확인 후 `paragraphMain` 순서 재정렬

---

### 7. 창의활동탭 힌트 중복
- **원인**:
  1. HTML 하드코딩: `💡 힌트) 레오나르도는...`
  2. content.js: `hint: '💡 힌트) 레오나르도는...'`
  3. learning-common.js: `'💡 힌트) ' + creative.hint`
- **결과**: "💡 힌트) 💡 힌트) 레오나르도는..."
- **해결**: `learning-common.js`에서 `'💡 힌트) '` 접두사 제거

---

### 8. 분석리포트탭 - 레이더/피드백 오류
- **원인**: `gradeVocab` 함수에서 로컬 `reportState` 사용 (window.reportState와 동기화 안됨)
- **해결**: `reportState` → `window.reportState`로 변경

---

### 9. 레이더 3,4번이 6점으로 고정
- **원인**: `refreshReportTab`이 `restoreReadingStateFromServer`보다 먼저 호출
- **해결**: results 배열 분기에도 `radarScores` 업데이트 추가

---

### 10. 주간분석 모달 - 단원명 누락
- **원인**: `unit_titles.json`에 BRAINUP 시리즈 키 누락
- **해결**: `world1_01`, `world2_01`, `people1_01`, `people2_01` 등 키 추가

---

### 11. 창의활동탭 힌트 안나옴
- **해결**: content.js에 `creative` 블록 추가

---

### 12. unit is not defined 에러
- **위치**: `on_modern_01.html:2622`
- **해결**: `unit` 변수 정의 확인

---

## 🟡 하이라이트 관련 체크리스트

### 문제 원인들
1. ✅ `highlightEvidence()` 함수 없음 → 함수 정의 확인
2. ✅ CSS 누락 (`.evidence-highlight`, `.evidence-q1~q5`) → CSS 추가 + `!important`
3. ✅ CSS 우선순위 → `.passage-text .evidence-highlight` 선택자 사용
4. ✅ `window.CONTENTS` 로드 문제 → 버전 쿼리스트링 추가 `v=20260128`
5. ⭐ **explain 값과 passage 텍스트 불일치 (핵심)**

### explain 값 작성 규칙
| 규칙 | 설명 |
|------|------|
| `<b>` 태그 피하기 | 태그 뒤 텍스트부터 시작 |
| 순수 텍스트 구간 선택 | 중간에 `<b></b>` 없는 부분 |
| 충분히 긴 텍스트 | 2글자 이상, 고유하게 매칭 |

### 수정 예시
| 문항 | 수정 전 ❌ | 수정 후 ✅ |
|------|-----------|-----------|
| q1 | 천장화를 그려 달라고 | 를 그려 달라고 부탁했어요 |
| q2 | 르네상스 시대의 위대한 | 어릴 때부터 그림과 조각에 |
| q3 | 고난을 겪으면서도 | 을 겪으면서도, 그는 단 하루도 |
| q4 | 열정과 재능을 쏟아 | 과 재능을 쏟아 이 대작을 |

---

## 🟢 지문 문장 하이라이트 스타일

```javascript
// 문장 분리: 마침표(.), 물음표(?), 느낌표(!) 기준
// HTML 태그 보존: <b> 등 유지

// 호버 효과
background-color: rgba(211, 90, 26, 0.12);  // 연한 주황
font-weight: 600;

// 클릭 시 선택 유지: 토글 방식
// 저장: localStorage (passage_read_{unitKey})

// 전체 완독 시
// - 중앙 팝업: "지문 완독! 대단해요!" (밝은 노랑 박스)
// - 반짝이 비 효과 (60개, 다양한 모양/색상)
```

---

## 📁 파일별 필수 요소

| 시리즈 | 필수 함수/객체 |
|--------|----------------|
| people1_*.html | highlightPassage, REMEDIAL_BANK |
| people2_*.html | highlightPassage, REMEDIAL_BANK |
| physics_*.html | openRemedial, REMEDIAL_BANK |
| chem_*.html | openRemedial, REMEDIAL_BANK |
| classic_*.html | REMEDIAL_BANK |

---

## 📌 정상 작동 참고 파일 (템플릿)

- people1_01.html
- physics_01.html
- classic_01.html
- on_world2_01.html (레이더 정상)

---

## 추가 메모

<!-- 여기에 추가 내용을 적어주세요 -->


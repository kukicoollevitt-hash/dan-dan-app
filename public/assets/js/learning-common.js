  /* =========================================================
     localStorage 용량 관리 - 자동 정리 (QuotaExceededError 방지)
  ========================================================= */
  (function cleanupLocalStorage() {
    try {
      // 전체 사용량 계산
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length * 2;
        }
      }
      const totalMB = total / 1024 / 1024;

      // 3MB 이상이면 dan-progress 중 큰 항목 정리
      if (totalMB > 3) {
        console.log('[localStorage] 용량 초과 감지:', totalMB.toFixed(2), 'MB - 자동 정리 시작');
        const keys = Object.keys(localStorage);
        let cleaned = 0;

        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          if (key.startsWith('dan-progress:')) {
            const size = localStorage[key].length * 2;
            // 5KB 이상인 dan-progress 항목 삭제 (서버에서 다시 불러옴)
            if (size > 5000) {
              localStorage.removeItem(key);
              cleaned++;
            }
          }
        }

        if (cleaned > 0) {
          console.log('[localStorage] 자동 정리 완료:', cleaned, '개 삭제');
        }
      }
    } catch (e) {
      console.warn('[localStorage] 정리 중 오류:', e.message);
    }
  })();

  /* =========================================================
     단원 자동 인식 (강화) - 다양한 과목 지원
     지원 과목: 사회분야(geo, soc, law, pol), 과학분야(bio, physics, chem, earth),
               한국문학(modern, classic), 세계문학(world1, world2), 인물(people1, people2)
     ✅ on_ 접두사 지원: BRAINON 시리즈 (on_bio, on_earth 등)
     ✅ deep_ 접두사 지원: BRAINDEEP 시리즈 (deep_bio, deep_earth 등)
     우선순위: ?unit=XXX_NN → 파일명 XXX_NN.html → 제목 숫자
  ========================================================= */
  (function () {
    const qs = new URLSearchParams(location.search).get('unit');
    let unit = null;

    // 지원하는 과목 코드들 (사회, 과학, 문학, 인물 등 모두 포함)
    // ✅ on_ 및 deep_ 접두사도 지원
    const subjectPattern = /(on_|deep_)?(geo|soc|law|pol|bio|physics|chem|earth|eco|hist|ethics|modern|classic|world1|world2|people1|people2)[_-]?(\d{1,2})/;

    if (qs) {
      const m = qs.toLowerCase().match(subjectPattern);
      if (m) {
        const prefix = m[1] || '';  // 'on_' 또는 'deep_' 또는 빈 문자열
        unit = `${prefix}${m[2]}_${m[3].padStart(2,'0')}`;
      }
    }

    if (!unit) {
      const m2 = location.pathname.toLowerCase().match(new RegExp(subjectPattern.source + '\\.html'));
      if (m2) {
        const prefix = m2[1] || '';  // 'on_' 또는 'deep_' 또는 빈 문자열
        unit = `${prefix}${m2[2]}_${m2[3].padStart(2,'0')}`;
      }
    }

    if (!unit && document.title) {
      const m3 = document.title.match(/(\d{1,2})/);
      if (m3) unit = `geo_${m3[1].padStart(2,'0')}`;
    }

    window.CUR_UNIT = unit || 'geo_01';
    console.log('[study page] CUR_UNIT =', window.CUR_UNIT);
  })();

  /* =========================================================
     PAGE_KEY 자동 생성 (단원 번호 기반) - 다양한 과목/분야 지원
     ✅ on_ 접두사: BRAINON, deep_ 접두사: BRAINDEEP
  ========================================================= */
  (function () {
    const cur = (window.CUR_UNIT || 'geo_01');
    // ✅ on_ 또는 deep_ 접두사 지원
    const m = cur.match(/(on_|deep_)?([a-z0-9]+)_(\d{1,2})/);
    const prefix = m ? (m[1] || '') : '';
    const subject = m ? m[2] : 'geo';
    const no = m ? m[3].padStart(2,'0') : '01';

    // 과목에 따라 분야(area) 결정
    let area = 'social'; // 기본값
    if (['bio', 'physics', 'chem', 'earth'].includes(subject)) {
      area = 'science';
    } else if (['modern', 'classic'].includes(subject)) {
      area = 'korlit';
    } else if (['world1', 'world2'].includes(subject)) {
      area = 'worldlit';
    } else if (['people1', 'people2'].includes(subject)) {
      area = 'person';
    }

    // ✅ 시리즈 결정: on_ → BRAINON, deep_ → BRAINDEEP, 그 외 → BRAINUP
    let series = 'BRAINUP';
    if (prefix === 'on_') {
      series = 'BRAINON';
    } else if (prefix === 'deep_') {
      series = 'BRAINDEEP';
    }

    window.PAGE_KEY = `${series}_${area}_${prefix}${subject}_${no}`;
    console.log('[study page] PAGE_KEY =', window.PAGE_KEY);
  })();

    // 🔁 공통 키 만드는 함수
    function buildStudentKey(stu) {
      const cleanName = (stu.name || '').trim();
      const cleanGrade = (stu.grade || '').trim().replace('학년', ''); // "학년" 제거
      // 학습실과 동일한 형식 사용: {grade}학년_{name}
      return `${cleanGrade}학년_${cleanName}`;
    }

    // 🔁 현재 학생 가져오기 (로그인에서 저장해둔 거)
    // iframe 내부에서도 부모 창의 localStorage에 접근 시도
    function getCurrentStudent() {
      let saved = null;

      // 1) 먼저 현재 창의 localStorage 확인
      saved = localStorage.getItem('currentStudent');

      // 2) 없으면 부모 창의 localStorage 시도 (iframe인 경우)
      if (!saved && window.parent && window.parent !== window) {
        try {
          saved = window.parent.localStorage.getItem('currentStudent');
          console.log('[getCurrentStudent] 부모 창에서 학생 정보 가져옴');
        } catch (e) {
          console.log('[getCurrentStudent] 부모 창 localStorage 접근 실패:', e.message);
        }
      }

      if (!saved) return null;
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }

    // ★ 서버에 단원별 학습 진행 저장
    async function saveUnitProgressToServer(data) {
      const stu = getCurrentStudent();
      if (!stu) {
        console.log('[saveUnitProgressToServer] 학생 정보 없음, 저장 건너뜀');
        return;
      }
      const unit = window.CUR_UNIT || 'geo_01';
      try {
        const res = await fetch('/api/unit-progress/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            grade: stu.grade,
            name: stu.name,
            unit: unit,
            data: data
          })
        });
        const result = await res.json();
        if (result.success) {
          console.log(`[saveUnitProgressToServer] ${unit} 서버 저장 완료`);
        } else {
          console.error('[saveUnitProgressToServer] 저장 실패:', result.message);
        }
      } catch (err) {
        console.error('[saveUnitProgressToServer] 네트워크 오류:', err);
      }
    }

    // ★ 전역으로 노출 (HTML 페이지에서 접근 가능하도록)
    window.saveUnitProgressToServer = saveUnitProgressToServer;

    // ★ 서버에 학습 로그 전송 (별표 표시용 - /api/log)
    async function sendLearningLog() {
      const stu = getCurrentStudent();
      if (!stu) {
        console.log('[sendLearningLog] 학생 정보 없음, 전송 건너뜀');
        return;
      }
      const unit = window.CUR_UNIT || 'geo_01';
      const rs = window.reportState || (typeof reportState !== 'undefined' ? reportState : null);

      if (!rs) {
        console.log('[sendLearningLog] reportState 없음, 전송 건너뜀');
        return;
      }

      // 🔥 디버깅: reportState 전체 값 출력
      console.log('[sendLearningLog] 🔍 reportState 전체:', JSON.stringify(rs));
      console.log('[sendLearningLog] 🔍 q1ok:', rs.q1ok, 'q2ok:', rs.q2ok, 'q3ok:', rs.q3ok, 'q4ok:', rs.q4ok, 'q5ok:', rs.q5ok);

      // 레이더 점수 계산
      const lexicalRatio = (typeof rs.vocabScoreRatio === 'number') ? rs.vocabScoreRatio : 0;
      const lexicalScore = Math.round(lexicalRatio * 10);

      const radar = {
        literal: rs.q1ok ? 10 : 6,
        structural: rs.q2ok ? 10 : 6,
        lexical: rs.q3ok ? 10 : lexicalScore,
        inferential: rs.q4ok ? 10 : 6,
        critical: rs.q5ok ? 10 : 6
      };

      // 🔥 디버깅: 전송할 radar 값 출력
      console.log('[sendLearningLog] 🔍 전송할 radar:', JSON.stringify(radar));

      try {
        const res = await fetch('/api/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            grade: stu.grade,
            name: stu.name,
            phone: stu.phone || '',
            unit: unit,
            radar: radar,
            completed: true
          })
        });
        const result = await res.json();
        if (result.success || result._id) {
          console.log(`[sendLearningLog] ${unit} 학습 로그 전송 완료`, radar);

          // 🔥 부모 창(menu.html)에 캐시 무효화 메시지 전송
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'INVALIDATE_CACHE' }, window.location.origin);
            console.log('[sendLearningLog] 부모 창에 캐시 무효화 메시지 전송');
          }
        } else {
          console.error('[sendLearningLog] 전송 실패:', result);
        }
      } catch (err) {
        console.error('[sendLearningLog] 네트워크 오류:', err);
      }
    }

    // ★ 전역으로 노출
    window.sendLearningLog = sendLearningLog;

    // ★ 서버에서 단원별 학습 진행 불러오기
    async function loadUnitProgressFromServer() {
      const stu = getCurrentStudent();
      if (!stu) {
        console.log('[loadUnitProgressFromServer] 학생 정보 없음');
        return null;
      }
      const unit = window.CUR_UNIT || 'geo_01';
      console.log('[loadUnitProgressFromServer] 요청 unit:', unit);  // ✅ 디버그 로그 추가
      try {
        const res = await fetch(`/api/unit-progress/load?grade=${encodeURIComponent(stu.grade)}&name=${encodeURIComponent(stu.name)}&unit=${encodeURIComponent(unit)}`);
        const result = await res.json();
        if (result.success && result.data) {
          console.log(`[loadUnitProgressFromServer] ${unit} 서버 데이터 로드 완료`);
          return result.data;
        }
        return null;
      } catch (err) {
        console.error('[loadUnitProgressFromServer] 네트워크 오류:', err);
        return null;
      }
    }

    // ★ 서버 데이터로 본문학습 상태 복원
    function restoreReadingStateFromServer(data) {
      // reportState 구조인 경우 내부 데이터 추출
      if (data && data.reportState) {
        data = data.reportState;
        console.log('[restoreReadingStateFromServer] reportState 구조 감지, 내부 데이터 사용:', data);
      }

      // inputs 객체가 있으면 사용, 없으면 data 자체를 inputs로 사용 (readingState의 flat 구조 지원)
      let inputs = data.inputs;
      if (!inputs && data && (data.q1 !== undefined || data.q3_1 !== undefined)) {
        // readingState가 flat 구조인 경우 (q1, q2, q3_1 등이 직접 있음)
        inputs = data;
        console.log('[restoreReadingStateFromServer] flat 구조 감지, data를 inputs로 사용');
      }

      if (!inputs) {
        console.log('[restoreReadingStateFromServer] 복원할 입력 데이터 없음, data:', data);
        return;
      }
      console.log('[restoreReadingStateFromServer] 입력값 복원 시작:', inputs);

      // 1번, 2번 - 라디오 버튼 복원
      if (inputs.q1) {
        const q1Radio = document.querySelector(`input[name="q1"][value="${inputs.q1}"]`);
        if (q1Radio) q1Radio.checked = true;
      }
      if (inputs.q2) {
        const q2Radio = document.querySelector(`input[name="q2"][value="${inputs.q2}"]`);
        if (q2Radio) q2Radio.checked = true;
      }

      // 3번, 4번 - 라디오 버튼 복원 (fit_ 시리즈 객관식)
      if (inputs.q3 && !inputs.q3_1) {
        const q3Radio = document.querySelector(`input[name="q3"][value="${inputs.q3}"]`);
        if (q3Radio) q3Radio.checked = true;
      }
      if (inputs.q4 && !inputs.q4_1) {
        const q4Radio = document.querySelector(`input[name="q4"][value="${inputs.q4}"]`);
        if (q4Radio) q4Radio.checked = true;
      }

      // 3번, 4번 - 텍스트 입력 복원 (q3_1 또는 q3-1 형식 모두 지원)
      const q3_1 = document.getElementById("q3-1");
      const q3_2 = document.getElementById("q3-2");
      const q4_1 = document.getElementById("q4-1");
      const q4_2 = document.getElementById("q4-2");
      const q5 = document.getElementById("q5");

      if (q3_1 && (inputs.q3_1 || inputs['q3-1'])) q3_1.value = inputs.q3_1 || inputs['q3-1'];
      if (q3_2 && (inputs.q3_2 || inputs['q3-2'])) q3_2.value = inputs.q3_2 || inputs['q3-2'];
      if (q4_1 && (inputs.q4_1 || inputs['q4-1'])) q4_1.value = inputs.q4_1 || inputs['q4-1'];
      if (q4_2 && (inputs.q4_2 || inputs['q4-2'])) q4_2.value = inputs.q4_2 || inputs['q4-2'];
      if (q5 && inputs.q5) q5.value = inputs.q5;

      // 채점 결과 HTML 복원 (있는 경우)
      if (data.resultHTML) {
        const resultBox = document.getElementById("grade-result");
        if (resultBox) {
          resultBox.style.display = "block";
          resultBox.innerHTML = data.resultHTML;
        }
        // 채점 완료 상태로 버튼 표시 (3-버튼, 2-버튼 구조 모두 지원)
        const gradeBtn = document.getElementById("grade-btn");
        const resetBtn = document.getElementById("reset-btn");
        const submitBtn = document.getElementById("submit-btn");
        const saveProgressBtn = document.getElementById("save-progress-btn");

        // 3-버튼 구조
        if (gradeBtn) gradeBtn.style.display = "inline-block";
        if (submitBtn) submitBtn.style.display = "inline-block";

        // 2-버튼 구조: 채점 완료 시 save-progress-btn 숨기고 reset-btn 표시
        if (saveProgressBtn) saveProgressBtn.style.display = "none";
        if (resetBtn) resetBtn.style.display = "inline-block";
      }

      // ★ 채점 표시 (⭕✖) 복원
      // q1ok 등이 있으면 직접 표시, results 배열이 있으면 그것으로 표시, 없고 graded가 true면 자동 재채점
      const hasGradingData = data.q1ok !== undefined || data.q2ok !== undefined;
      const hasResultsArray = data.results && Array.isArray(data.results) && data.results.length > 0;

      if (hasGradingData) {
        // 채점 결과가 있는 경우 직접 표시 (q1ok, q2ok 형식)
        const quizBlocks = document.querySelectorAll('#tab-reading .quiz-block');
        const qokList = [data.q1ok, data.q2ok, data.q3ok, data.q4ok, data.q5ok];

        quizBlocks.forEach((block, idx) => {
          const numEl = block.querySelector('.quiz-num');
          if (!numEl) return;

          let markEl = numEl.querySelector('.mark');
          if (!markEl) {
            markEl = document.createElement('span');
            markEl.className = 'mark';
            numEl.appendChild(markEl);
          }

          numEl.classList.remove('correct', 'wrong');

          if (qokList[idx] === true) {
            numEl.classList.add('correct');
            markEl.textContent = "⭕";
          } else if (qokList[idx] === false) {
            numEl.classList.add('wrong');
            markEl.textContent = "✖";
          } else {
            markEl.textContent = "";
          }
        });
        console.log('[restoreReadingStateFromServer] 채점 결과 직접 복원 완료 (q1ok 형식)');

        // ✅ 레이더 차트 업데이트 (q1ok 형식 기반)
        if (typeof window.drawRadarChart === 'function') {
          window.drawRadarChart({
            literal: data.q1ok ? 10 : 6,
            structural: data.q2ok ? 10 : 6,
            lexical: data.q3ok ? 10 : 6,
            inferential: data.q4ok ? 10 : 6,
            critical: data.q5ok ? 10 : 6
          });
          console.log('[restoreReadingStateFromServer] 레이더 차트 업데이트 완료 (q1ok 형식)');
        }

        // reportState 업데이트
        window.reportState = window.reportState || {};
        window.reportState.q1ok = data.q1ok;
        window.reportState.q2ok = data.q2ok;
        window.reportState.q3ok = data.q3ok;
        window.reportState.q4ok = data.q4ok;
        window.reportState.q5ok = data.q5ok;

        // ✅ 분석리포트 해설 업데이트 (q1ok 형식)
        if (typeof updateReportPanel === 'function') {
          updateReportPanel({
            q1ok: data.q1ok,
            q2ok: data.q2ok,
            q3ok: data.q3ok,
            q4ok: data.q4ok,
            q5ok: data.q5ok
          });
          console.log('[restoreReadingStateFromServer] 분석리포트 해설 업데이트 완료 (q1ok 형식)');
        }
      } else if (hasResultsArray) {
        // results 배열 형식으로 저장된 경우 (pol_01.html 등 새 형식)
        const quizBlocks = document.querySelectorAll('#tab-reading .quiz-block');
        console.log('[restoreReadingStateFromServer] results 배열로 복원 시도:', data.results);

        quizBlocks.forEach((block, idx) => {
          const numEl = block.querySelector('.quiz-num');
          if (!numEl) return;

          let markEl = numEl.querySelector('.mark');
          if (!markEl) {
            markEl = document.createElement('span');
            markEl.className = 'mark';
            numEl.appendChild(markEl);
          }

          numEl.classList.remove('correct', 'wrong');

          const result = data.results[idx];
          if (result) {
            if (result.isCorrect === true) {
              numEl.classList.add('correct');
              markEl.textContent = "⭕";
            } else if (result.isWrong === true) {
              numEl.classList.add('wrong');
              markEl.textContent = "✖";
            } else {
              markEl.textContent = "";
            }
          }
        });
        console.log('[restoreReadingStateFromServer] 채점 결과 직접 복원 완료 (results 배열)');

        // ✅ 레이더 차트 업데이트 (results 배열 기반)
        const q1ok = data.results[0]?.isCorrect === true;
        const q2ok = data.results[1]?.isCorrect === true;
        const q3ok = data.results[2]?.isCorrect === true;
        const q4ok = data.results[3]?.isCorrect === true;
        const q5ok = data.results[4]?.isCorrect === true;

        if (typeof window.drawRadarChart === 'function') {
          window.drawRadarChart({
            literal: q1ok ? 10 : 6,
            structural: q2ok ? 10 : 6,
            lexical: q3ok ? 10 : 6,
            inferential: q4ok ? 10 : 6,
            critical: q5ok ? 10 : 6
          });
          console.log('[restoreReadingStateFromServer] 레이더 차트 업데이트 완료');
        }

        // reportState 업데이트
        window.reportState = window.reportState || {};
        window.reportState.q1ok = q1ok;
        window.reportState.q2ok = q2ok;
        window.reportState.q3ok = q3ok;
        window.reportState.q4ok = q4ok;
        window.reportState.q5ok = q5ok;

        // ✅ 분석리포트 해설 업데이트 (results 배열 형식)
        if (typeof updateReportPanel === 'function') {
          updateReportPanel({
            q1ok: q1ok,
            q2ok: q2ok,
            q3ok: q3ok,
            q4ok: q4ok,
            q5ok: q5ok
          });
          console.log('[restoreReadingStateFromServer] 분석리포트 해설 업데이트 완료 (results 배열)');
        }
      } else if (data.graded || data.isGraded || inputs.graded || inputs.isGraded) {
        // 채점 결과가 없지만 graded=true 또는 isGraded=true인 경우 자동 재채점
        console.log('[restoreReadingStateFromServer] graded/isGraded=true, 자동 재채점 시도');
        setTimeout(() => {
          if (typeof window.gradeQuiz === 'function') {
            try {
              window.gradeQuiz();
              console.log('[restoreReadingStateFromServer] 자동 재채점 완료');
            } catch (e) {
              console.warn('[restoreReadingStateFromServer] 자동 재채점 오류:', e);
            }
          }
        }, 100);
      }

      console.log('[restoreReadingStateFromServer] 복원 완료');
    }

    // ★ 서버 데이터로 어휘학습 상태 복원
    function restoreVocabStateFromServer(vocabState) {
      if (!vocabState || !vocabState.vocabData) {
        console.log('[restoreVocabStateFromServer] 복원할 어휘 데이터 없음');
        return;
      }

      try {
        const blanks = document.querySelectorAll('#tab-vocab .blank-wrap');
        const vocabData = vocabState.vocabData;

        console.log('[restoreVocabStateFromServer] blanks 개수:', blanks.length);
        console.log('[restoreVocabStateFromServer] vocabData 개수:', vocabData.length);

        blanks.forEach((bw, idx) => {
          if (vocabData[idx]) {
            const data = vocabData[idx];
            const input = bw.querySelector('.blank-input');
            const mark = bw.querySelector('.blank-mark');

            if (input) input.value = data.value || '';
            bw.classList.remove('correct', 'wrong');
            if (data.isCorrect) bw.classList.add('correct');
            if (data.isWrong) bw.classList.add('wrong');
            // markText가 없으면 isCorrect/isWrong으로 생성 (하위호환)
            if (mark) {
              if (data.markText) {
                mark.textContent = data.markText;
              } else if (data.isCorrect) {
                mark.textContent = '✔';
              } else if (data.isWrong) {
                mark.textContent = '✖';
              }
            }
          }
        });

        // 결과 박스 복원
        const vocabResultBox = document.getElementById('vocab-result');
        if (vocabResultBox && vocabState.resultHTML) {
          vocabResultBox.style.display = 'block';
          vocabResultBox.innerHTML = vocabState.resultHTML;
        }

        // 채점 완료 상태면 버튼 표시
        if (vocabState.isGraded) {
          const vocabGradeBtn = document.getElementById('vocab-grade');
          const vocabResetBtn = document.getElementById('vocab-reset');
          const vocabSubmitBtn = document.getElementById('vocab-submit');
          const vocabSaveBtn = document.getElementById('vocab-save'); // 새 버튼 구조 (채점 및 제출하기)
          if (vocabGradeBtn) vocabGradeBtn.style.display = 'inline-block';
          if (vocabResetBtn) vocabResetBtn.style.display = 'inline-block';
          if (vocabSubmitBtn) vocabSubmitBtn.style.display = 'inline-block';
          // 새 버튼 구조: 채점 완료 시 vocab-save 숨기고 vocab-reset 보이기
          if (vocabSaveBtn) vocabSaveBtn.style.display = 'none';
          // 입력 비활성화
          const blanks = document.querySelectorAll('#tab-vocab .blank-wrap');
          blanks.forEach(bw => {
            const input = bw.querySelector('.blank-input');
            if (input) input.disabled = true;
          });
        }

        console.log('[restoreVocabStateFromServer] 어휘학습 복원 완료');
      } catch (e) {
        console.error('[restoreVocabStateFromServer] 복원 실패:', e);
      }
    }

    // 페이지 들어올 때 로그인 정보 있으면 학년/이름 자동 채우기(전화 입력칸 숨김)
    document.addEventListener('DOMContentLoaded', () => {
      const stu = getCurrentStudent();
      const gradeInput = document.querySelector('#student-grade');
      const nameInput = document.querySelector('#student-name');
      const phoneWrap = document.querySelector('#student-phone-wrap'); // 있으면 숨김

      console.log('[학습페이지] 현재 학생 정보:', stu);
      console.log('[학습페이지] 학년 입력 필드:', gradeInput);
      console.log('[학습페이지] 이름 입력 필드:', nameInput);

      if (stu) {
        if (gradeInput) {
          gradeInput.value = stu.grade || '';
          console.log('[학습페이지] 학년 자동 입력:', stu.grade);
        }
        if (nameInput) {
          nameInput.value = stu.name || '';
          console.log('[학습페이지] 이름 자동 입력:', stu.name);
        }
        if (phoneWrap) phoneWrap.style.display = 'none';
      } else {
        console.log('[학습페이지] 로그인 정보 없음 - localStorage 확인 필요');
        if (phoneWrap) phoneWrap.style.display = 'none';
      }

      // 현재 날짜로 월/일 자동 채우기
      const today = new Date();
      const monthInput = document.querySelector('#month-input');
      const dayInput = document.querySelector('#day-input');

      if (monthInput) monthInput.value = today.getMonth() + 1; // 월은 0부터 시작하므로 +1
      if (dayInput) dayInput.value = today.getDate();
    });
    // 탭 이름 고정
    document.title = "BRAIN업 | 지리 01 지도를 통해 세상을 이해하다";

    // ===== 타이머 기능 =====
    var timerInterval = null;
    var totalSeconds = 0;
    var isTimerRunning = false;

    function toggleTimer() {
      const timerIcon = document.getElementById('timer-icon');
      if (!timerIcon) return;

      if (isTimerRunning) {
        // 타이머 중지
        isTimerRunning = false;
        clearInterval(timerInterval);
        timerIcon.classList.remove('running');
        updateTimerDisplay();
      } else {
        // 타이머 시작
        isTimerRunning = true;
        timerIcon.classList.add('running');
        timerInterval = setInterval(function() {
          totalSeconds++;
          updateTimerDisplay();
        }, 1000);
      }
    }

    function updateTimerDisplay() {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const minuteInput = document.getElementById('minute-input');
      const secondInput = document.getElementById('second-input');

      if (minuteInput) minuteInput.value = String(minutes).padStart(2, '0');
      if (secondInput) secondInput.value = String(seconds).padStart(2, '0');
    }

    // ===== 달력 팝업 관련 함수들 =====
    var currentCalendarYear = new Date().getFullYear();
    var currentCalendarMonth = new Date().getMonth();
    var selectedDate = null;

    function toggleCalendar() {
      const popup = document.getElementById('calendar-popup');
      const overlay = document.getElementById('calendar-overlay');

      if (popup.classList.contains('show')) {
        closeCalendar();
      } else {
        currentCalendarYear = new Date().getFullYear();
        currentCalendarMonth = new Date().getMonth();
        renderCalendar();
        popup.classList.add('show');
        overlay.classList.add('show');
      }
    }

    function closeCalendar() {
      const popup = document.getElementById('calendar-popup');
      const overlay = document.getElementById('calendar-overlay');
      popup.classList.remove('show');
      overlay.classList.remove('show');
    }

    function changeMonth(direction) {
      currentCalendarMonth += direction;
      if (currentCalendarMonth < 0) {
        currentCalendarMonth = 11;
        currentCalendarYear--;
      } else if (currentCalendarMonth > 11) {
        currentCalendarMonth = 0;
        currentCalendarYear++;
      }
      renderCalendar();
    }

    function renderCalendar() {
      const grid = document.getElementById('calendar-grid');
      const title = document.getElementById('calendar-title');

      // 제목 업데이트
      title.textContent = currentCalendarYear + '년 ' + (currentCalendarMonth + 1) + '월';

      // 기존 날짜 제거 (요일 헤더는 유지)
      const dayElements = grid.querySelectorAll('.calendar-day');
      dayElements.forEach(function(el) { el.remove(); });

      // 해당 월의 첫날과 마지막날
      const firstDay = new Date(currentCalendarYear, currentCalendarMonth, 1);
      const lastDay = new Date(currentCalendarYear, currentCalendarMonth + 1, 0);
      const prevLastDay = new Date(currentCalendarYear, currentCalendarMonth, 0);

      const firstDayOfWeek = firstDay.getDay();
      const lastDate = lastDay.getDate();
      const prevLastDate = prevLastDay.getDate();

      const today = new Date();
      const isCurrentMonth = today.getFullYear() === currentCalendarYear && today.getMonth() === currentCalendarMonth;
      const todayDate = today.getDate();

      // 이전 달 날짜들
      for (var i = firstDayOfWeek - 1; i >= 0; i--) {
        var day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.textContent = prevLastDate - i;
        grid.appendChild(day);
      }

      // 현재 달 날짜들
      for (var date = 1; date <= lastDate; date++) {
        var day = document.createElement('div');
        day.className = 'calendar-day';
        day.textContent = date;

        if (isCurrentMonth && date === todayDate) {
          day.classList.add('today');
        }

        if (selectedDate && selectedDate.year === currentCalendarYear &&
            selectedDate.month === currentCalendarMonth && selectedDate.date === date) {
          day.classList.add('selected');
        }

        (function(d) {
          day.onclick = function() { selectDate(d); };
        })(date);

        grid.appendChild(day);
      }

      // 다음 달 날짜들 (7의 배수가 되도록)
      const totalCells = firstDayOfWeek + lastDate;
      const remainingCells = 7 - (totalCells % 7);
      if (remainingCells < 7) {
        for (var i = 1; i <= remainingCells; i++) {
          var day = document.createElement('div');
          day.className = 'calendar-day other-month';
          day.textContent = i;
          grid.appendChild(day);
        }
      }
    }

    function selectDate(date) {
      selectedDate = {
        year: currentCalendarYear,
        month: currentCalendarMonth,
        date: date
      };

      // 월/일 입력 필드 업데이트
      const monthInput = document.getElementById('month-input');
      const dayInput = document.getElementById('day-input');

      if (monthInput) monthInput.value = currentCalendarMonth + 1;
      if (dayInput) dayInput.value = date;

      closeCalendar();
    }

    // ===== 자동 피드백 생성 함수 =====
    function generateFeedback(scores) {
      const feedback = [];

      if (scores.literal < 7) {
        feedback.push("① 지문의 핵심 문장을 먼저 찾고, 그 문장을 중심으로 세부 내용을 정리해 보세요.");
      }
      if (scores.structural < 7) {
        feedback.push("② 문단의 앞뒤 연결어를 표시하면서 읽으면 구조 파악이 쉬워집니다.");
      }
      if (scores.lexical < 7) {
        feedback.push("③ 모르는 낱말은 문맥으로 뜻을 짐작한 뒤 어휘칸에 정리해 보세요.");
      }
      if (scores.inferential < 7) {
        feedback.push("④ 글쓴이의 의도나 숨은 의미를 '왜 이렇게 말했지?' 하고 추론하는 연습을 해보세요.");
      }
      if (scores.critical < 7) {
        feedback.push("⑤ 주장과 근거를 나누어 표시하고, 근거가 충분한지 살펴보는 비판적 읽기를 해보세요.");
      }

      if (feedback.length === 0) {
        feedback.push("모든 영역이 고르게 잘 나왔어요. 지금처럼 단계별 학습을 이어가면 됩니다 👍");
      }
      return feedback;
    }

    function renderFeedback(scores) {
      const box = document.getElementById('report-feedback');
      if (!box) return;
      const feedbackList = generateFeedback(scores);
      let html = '<h3>보완이 필요한 영역</h3><ul>';
      feedbackList.forEach(msg => {
        html += '<li>' + msg + '</li>';
      });
      html += '</ul>';
      box.innerHTML = html;
    }

    /* ======= (임시 alert 버전 openRemedial 삭제) ======= */
    // ===== 보완학습 문제 뱅크 (객관식 2문제씩) =====
    // window 객체로 선언하여 개별 페이지에서 덮어쓸 수 있도록 함
    window.REMEDIAL_BANK = window.REMEDIAL_BANK || {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { type: "mcq", q: "지도를 만들 때 약속된 기호를 쓰는 까닭은?", options: ["보기 쉽도록", "예쁘게 하려고", "값싸게 하려고", "사진처럼 하려고"], answer: 0 },
          { type: "mcq", q: "이 글의 중심 내용으로 알맞은 것은?", options: ["지도는 장식품이다", "지도는 약속에 따라 정보를 표현한다", "지도는 사진보다 선명하다", "지도는 세계지도를 말한다"], answer: 1 }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { type: "mcq", q: "글에서 '먼저-다음-마지막으로' 순으로 설명하는 것은?", options: ["순서 구조", "비교 구조", "문제해결 구조", "열거 구조"], answer: 0 },
          { type: "mcq", q: "등고선 설명 글의 전개 방식으로 알맞은 것은?", options: ["원인-결과", "설명-예시", "비교-대조", "문제-해결"], answer: 1 }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { type: "mcq", q: "'촘촘하다'와 가장 비슷한 말은?", options: ["드문드문하다", "빽빽하다", "느슨하다", "엉성하다"], answer: 1 },
          { type: "mcq", q: "'경사가 가파르다'의 뜻과 가까운 것은?", options: ["평평하다", "비탈이 심하다", "길다", "넓다"], answer: 1 }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { type: "mcq", q: "이 글을 쓴 사람의 의도로 알맞은 것은?", options: ["지도를 그려 보이려는 것", "지도를 활용하는 법을 알려 주려는 것", "그림을 소개하려는 것", "사진을 비교하려는 것"], answer: 1 },
          { type: "mcq", q: "산과 강의 위치를 함께 보면 알 수 있는 것은?", options: ["마을 위치를 추측할 수 있다", "국가 면적을 알 수 있다", "세계 인구를 안다", "기온을 안다"], answer: 0 }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용형",
        problems: [
          { type: "mcq", q: "관광용 지도를 볼 때 주의할 점으로 알맞은 것은?", options: ["항상 축척이 정확하다", "목적에 따라 내용이 달라질 수 있다", "산이 없다고 볼 수 있다", "기호는 임의로 바꾼다"], answer: 1 },
          { type: "mcq", q: "다음 중 지도를 비판적으로 보는 태도와 거리가 먼 것은?", options: ["누가 만들었는지 살핀다", "어떤 목적인지 본다", "전부 사실이라고 믿는다", "필요한 정보가 있는지 본다"], answer: 2 }
        ]
      }
    };

    // ===== 보완학습 열기(실구현 버전만 유지) =====
    function openRemedial() {
      const needKeys = [];
      if (typeof reportState !== "undefined") {
        if (!window.reportState.q1ok) needKeys.push('literal');
        if (!window.reportState.q2ok) needKeys.push('structural');
        if (!window.reportState.q3ok) needKeys.push('lexical');
        if (!window.reportState.q4ok) needKeys.push('inferential');
        if (!window.reportState.q5ok) needKeys.push('critical');
      }

      const panel = document.getElementById('remedial-panel');
      const body = document.getElementById('remedial-panel-body');
      if (!panel || !body) return;

      if (needKeys.length === 0) {
        body.innerHTML = "<p>보완이 필요한 영역이 없습니다 👏</p>";
        panel.style.display = 'flex';
        return;
      }

      let html = "";
      needKeys.forEach(key => {
        const data = window.REMEDIAL_BANK[key];
        if (!data) return;
        html += `<div style="margin-bottom:16px;">
          <h4 style="margin:4px 0 6px; color:#8b2f2f;">${data.title}</h4>
          <ol style="padding-left:18px;">`;
        (data.problems || []).forEach((p, idx) => {
          html += `<li style="margin-bottom:6px;">${p.q}<br>`;
          p.options.forEach(opt => {
            html += `<label style="display:block;font-weight:normal;"><input type="radio" name="${key}-q${idx}"> ${opt}</label>`;
          });
          html += `</li>`;
        });
        html += `</ol></div>`;
      });

      body.innerHTML = html;
      panel.style.display = 'flex';
    }

    // 보완학습 채점/리셋
    function gradeRemedial() {
      const body = document.getElementById('remedial-panel-body');
      if (!body) return;
      for (const key in REMEDIAL_BANK) {
        const data = window.REMEDIAL_BANK[key];
        if (!data) continue;
        (data.problems || []).forEach((p, idx) => {
          const name = key + '-q' + idx;
          const inputs = body.querySelectorAll(`input[name="${name}"]`);
          if (!inputs.length) return;
          let selected = -1;
          inputs.forEach((inp, i) => { if (inp.checked) selected = i; });
          const li = inputs[0].closest('li');
          if (!li) return;
          const old = li.querySelector('.remed-result');
          if (old) old.remove();
          if (selected === p.answer) {
            li.insertAdjacentHTML('beforeend', '<div class="remed-result" style="margin-top:3px; color:#157347; font-size:12px;">정답입니다 ✅</div>');
          } else {
            const correctText = p.options[p.answer];
            li.insertAdjacentHTML('beforeend', `<div class="remed-result" style="margin-top:3px; color:#b3261e; font-size:12px;">틀렸어요 ❌ 정답: ${correctText}</div>`);
          }
        });
      }
    }
    function resetRemedial() {
      const body = document.getElementById('remedial-panel-body');
      if (!body) return;
      body.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
      body.querySelectorAll('.remed-result').forEach(el => el.remove());
    }
    /* ===== 전역 리포트 상태 ===== */
    // window 객체로 선언하여 개별 페이지에서 덮어쓸 수 있도록 함
    window.reportState = window.reportState || { q1ok:false, q2ok:false, q3ok:false, q4ok:false, q5ok:false, vocabScoreRatio:0 };

    /* ===== 탭 전환 ===== */
    // 분석리포트 새로고침 함수 (서버에서 최신 데이터 가져오기)
    async function refreshReportTab() {
      // 스피너 표시
      let spinner = document.getElementById('report-loading-spinner');
      if (!spinner) {
        spinner = document.createElement('div');
        spinner.id = 'report-loading-spinner';
        spinner.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(255,255,255,0.9);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;';
        spinner.innerHTML = `
          <div style="width:50px;height:50px;border:4px solid #e0e0e0;border-top:4px solid #8b5a2b;border-radius:50%;animation:spin 1s linear infinite;"></div>
          <p style="margin-top:16px;font-size:16px;color:#5a4a3a;font-weight:600;">AI 학습 인식 중...</p>
          <style>@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>
        `;
        document.body.appendChild(spinner);
      }
      spinner.style.display = 'flex';

      try {
        const unit = window.CUR_UNIT || 'geo_01';

        // 학생 정보 가져오기
        const stu = getCurrentStudent();
        if (!stu) {
          console.log('[refreshReportTab] 학생 정보 없음');
          spinner.style.display = 'none';
          return;
        }

        console.log(`[refreshReportTab] unit=${unit}, grade=${stu.grade}, name=${stu.name}`);

        // 서버에서 해당 단원의 최신 학습 기록 가져오기
        const res = await fetch(`/api/unit-grades?grade=${encodeURIComponent(stu.grade)}&name=${encodeURIComponent(stu.name)}`);
        const unitGradesMap = await res.json();

        console.log('[refreshReportTab] 서버 응답:', unitGradesMap);

        // unitGradesMap은 { bio_01: { grade: '양호', radar: {...} }, ... } 형태
        const unitData = unitGradesMap[unit];

        if (unitData && unitData.radar) {
          console.log('[refreshReportTab] 서버에서 가져온 데이터:', unitData);

          // 레이더 차트 업데이트
          if (typeof window.drawRadarChart === 'function') {
            window.drawRadarChart({
              literal: unitData.radar.literal || 0,
              structural: unitData.radar.structural || 0,
              lexical: unitData.radar.lexical || 0,
              inferential: unitData.radar.inferential || 0,
              critical: unitData.radar.critical || 0
            });
          }

          // 리포트 패널 업데이트 (10점이면 ok)
          if (typeof updateReportPanel === 'function') {
            updateReportPanel({
              q1ok: unitData.radar.literal >= 10,
              q2ok: unitData.radar.structural >= 10,
              q3ok: unitData.radar.lexical >= 7,
              q4ok: unitData.radar.inferential >= 10,
              q5ok: unitData.radar.critical >= 10
            });
          }

          console.log('[refreshReportTab] 서버 데이터로 분석리포트 업데이트 완료');
        } else {
          console.log('[refreshReportTab] 서버에 해당 단원 데이터 없음, localStorage 확인');
          refreshReportTabFromLocalStorage(unit, stu);
        }
      } catch(e) {
        console.error('[refreshReportTab] 서버 요청 오류:', e);
        // 서버 오류 시 localStorage에서 읽기
        const unit = window.CUR_UNIT || 'geo_01';
        const stu = getCurrentStudent();
        if (stu) refreshReportTabFromLocalStorage(unit, stu);
      } finally {
        // 스피너 숨기기 (최소 2초 표시)
        setTimeout(() => {
          if (spinner) spinner.style.display = 'none';
        }, 2000);
      }
    }

    // localStorage에서 분석리포트 데이터 읽기 (fallback)
    function refreshReportTabFromLocalStorage(unit, stu) {
      try {
        const stuKey = `${stu.grade}_${stu.name}`;
        const progressKey = `dan-progress:${stuKey}:${unit}`;

        const progressData = localStorage.getItem(progressKey);
        if (progressData) {
          const saved = JSON.parse(progressData);
          if (saved.length > 0) {
            const latest = saved[saved.length - 1];

            updateReportPanel({
              q1ok: latest.q1ok || false,
              q2ok: latest.q2ok || false,
              q3ok: latest.q3ok || false,
              q4ok: latest.q4ok || false,
              q5ok: latest.q5ok || false
            });

            drawRadarChart({
              literal: latest.literal || 0,
              structural: latest.structural || 0,
              lexical: latest.lexical || 0,
              inferential: latest.inferential || 0,
              critical: latest.critical || 0
            });

            console.log('[refreshReportTabFromLocalStorage] localStorage 데이터로 업데이트 완료');
          }
        }
      } catch(e) {
        console.error('[refreshReportTabFromLocalStorage] 오류:', e);
      }
    }

    // AI 로딩 오버레이 생성 (한 번만)
    function createAILoadingOverlay() {
      if (document.getElementById('ai-loading-overlay')) return;

      const overlay = document.createElement('div');
      overlay.id = 'ai-loading-overlay';
      overlay.innerHTML = `
        <div class="ai-loading-content">
          <div class="ai-spinner"></div>
          <p class="ai-loading-text">AI 학습 인식 중...</p>
        </div>
      `;
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.95);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        flex-direction: column;
      `;

      const style = document.createElement('style');
      style.textContent = `
        #ai-loading-overlay .ai-loading-content {
          text-align: center;
        }
        #ai-loading-overlay .ai-spinner {
          width: 60px;
          height: 60px;
          border: 4px solid #f3d3b4;
          border-top: 4px solid #c04a3b;
          border-radius: 50%;
          animation: ai-spin 1s linear infinite;
          margin: 0 auto 20px;
        }
        #ai-loading-overlay .ai-loading-text {
          font-size: 18px;
          color: #5b4334;
          font-weight: 600;
        }
        @keyframes ai-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
      document.body.appendChild(overlay);
    }

    // AI 로딩 표시
    function showAILoading() {
      createAILoadingOverlay();
      const overlay = document.getElementById('ai-loading-overlay');
      if (overlay) {
        overlay.style.display = 'flex';
      }
    }

    // AI 로딩 숨기기
    function hideAILoading() {
      const overlay = document.getElementById('ai-loading-overlay');
      if (overlay) {
        overlay.style.display = 'none';
      }
    }

    // 탭 활성화 함수
    function activateTab(tabName) {
      console.log('[activateTab] 탭 전환:', tabName);

      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

      const targetBtn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
      const targetPanel = document.getElementById('tab-' + tabName);

      if (targetBtn && targetPanel) {
        targetBtn.classList.add('active');
        targetPanel.classList.add('active');

        // 분석리포트 탭인 경우: AI 로딩 표시 후 데이터 새로고침
        if (tabName === 'report') {
          console.log('[activateTab] 분석리포트 탭 감지 - AI 로딩 시작');
          showAILoading();

          // 1.5초 후 로딩 숨기고 레이더 차트 표시
          setTimeout(() => {
            hideAILoading();
            refreshReportTab();
            console.log('[activateTab] AI 로딩 완료 - 분석리포트 표시');
          }, 1500);
        }

        // 어휘학습 탭인 경우 지문 렌더링
        if (tabName === 'vocab') {
          const fn = window.renderVocabFromContent || window.renderVocabFill;
          if (typeof fn === 'function') {
            fn();
          }
        }
      }
    }

  /* ===== ✅ playSubmitCelebration - DOMContentLoaded 외부에서 전역 접근 가능 ===== */
  function playSubmitCelebration() {
    // 폭죽 효과만 (효과음 비활성화)
    const confettiZIndex = 999999;
    if (typeof confetti === 'function') {
      confetti({ particleCount: 100, spread: 70, origin: { x: 0.5, y: 0.6 }, colors: ['#ff0000', '#ff7700', '#ffff00', '#00ff00', '#0099ff', '#6633ff'], zIndex: confettiZIndex });
      setTimeout(() => { confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0, y: 0.6 }, colors: ['#ff69b4', '#ffd700', '#00ffff'], zIndex: confettiZIndex }); }, 200);
      setTimeout(() => { confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors: ['#ff69b4', '#ffd700', '#00ffff'], zIndex: confettiZIndex }); }, 200);
      setTimeout(() => { confetti({ particleCount: 80, spread: 100, origin: { x: 0.5, y: 0.5 }, shapes: ['star'], colors: ['#ffd700', '#ffec8b', '#fff8dc'], zIndex: confettiZIndex }); }, 500);
    }
  }
  // 전역으로 노출
  window.playSubmitCelebration = playSubmitCelebration;

  /* ===== ✅ showSubmitSuccess - DOMContentLoaded 외부에서 전역 접근 가능 ===== */
  function showSubmitSuccess(kind) {
    const { grade, name } = getStudentInfo();
    const who = (grade || name) ? `${grade ? grade + ' ' : ''}${name ? name + ' ' : ''}`.trim() + ' ' : '';
    showSubmitOverlay(`${who}${kind} 제출되었습니다 ✅`);
  }
  // 전역으로 노출
  window.showSubmitSuccess = showSubmitSuccess;

  /* ===== ✅ submitReport - DOMContentLoaded 외부에서 전역 접근 가능 ===== */
  async function submitReport() {
    // 0) 로그인 정보 확인
    const stu = getCurrentStudent();
    if (!stu) {
      alert('로그인한 학생 정보가 없습니다. 먼저 로그인 해주세요.');
      return;
    }

    // 1) 리포트 PDF 저장
    await captureElementToPDF('capture-report', '단단국어_분석리포트.pdf', { withStudentInfo: true });

    // 2) 학생 고유키
    const studentKey = buildStudentKey(stu);

    // 3) 현재 단원 번호와 PAGE_KEY
    const cur = (window.CUR_UNIT || 'geo_01');
    const m = cur.match(/geo_(\d{1,2})/);
    const no = m ? m[1].padStart(2, '0') : '01';
    const pk = window.PAGE_KEY || `BRAINUP_social_geo_${no}`;

    // 4) 과거/변형 키까지 한 번에 흡수
    const legacyPath = `./BRAINUP/social/geo_${no}.html`;
    const pageIds = [pk, legacyPath, `BRAINUP_geo_${no}`, `BRAINUP_social_geo${no}`];
    console.log('[study page] PAGE_IDs =', pageIds);

    // 5) 현재 단원에 해당하는 키에만 저장
    const currentUnitKey = `dan-progress:${studentKey}:${cur}`;
    let saved;
    try {
      saved = JSON.parse(localStorage.getItem(currentUnitKey) || '[]');
      if (!Array.isArray(saved)) saved = [];
    } catch(e) { saved = []; }

    pageIds.forEach(id => { if (!saved.includes(id)) saved.push(id); });
    localStorage.setItem(currentUnitKey, JSON.stringify(saved));
    console.log('[study page] Saved completion to', currentUnitKey, '=>', saved);

    // 6) 부모 창에 완료 메시지 전송
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'UNIT_COMPLETED' }, window.location.origin);
      console.log('[study page] Sent UNIT_COMPLETED to parent');
    }

    // 7) AI 추천 과제 복습 완료 처리
    try {
      if (typeof window.markAITaskAsCompleted === 'function') {
        await window.markAITaskAsCompleted(stu.grade, stu.name, cur);
      }
    } catch (error) { console.error('[AI 과제 복습 완료 처리 오류]', error); }

    // 8) 분석리포트 상태 서버 저장
    const saveFn = window.saveUnitProgressToServer;
    if (typeof saveFn === 'function') {
      const rs = window.reportState || (typeof reportState !== 'undefined' ? reportState : null);
      if (rs) {
        const reportLogEl = document.getElementById('report-log');
        const dataToSave = {
          reportState: {
            q1ok: rs.q1ok || false, q2ok: rs.q2ok || false, q3ok: rs.q3ok || false,
            q4ok: rs.q4ok || false, q5ok: rs.q5ok || false,
            vocabScoreRatio: rs.vocabScoreRatio || 0, radarScores: rs.radarScores || {},
            reportLogHTML: reportLogEl ? reportLogEl.innerHTML : '', isSubmitted: true
          }
        };
        await saveFn(dataToSave);
        console.log('[submitReport] 분석리포트 서버 저장 완료!');
      }
    }

    // 9) 완료 표시 + 축하 효과
    playSubmitCelebration();
    window.showSubmitSuccess('분석리포트');
  }
  // 전역으로 노출
  window.submitReport = submitReport;

  // 페이지 로드 시 탭 이벤트 등록 및 저장된 탭 복원
  window.addEventListener('DOMContentLoaded', async () => {
    // 탭 버튼 클릭 이벤트
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        activateTab(target);
        // 현재 탭을 단원별로 localStorage에 저장
        const unit = window.CUR_UNIT || 'geo_01';
        localStorage.setItem(`current-geo-tab:${unit}`, target);
      });
    });

    // 학생 정보 가져오기
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const grade = user.grade || '';
    const name = user.name || '';
    const phone = user.phone || '';
    const unit = window.CUR_UNIT || 'geo_01';

    let hasLearningRecord = false;

    // 학습 기록이 있는지 확인
    if (grade && name) {
      try {
        const url = phone
          ? `/api/learning-logs?grade=${encodeURIComponent(grade)}&name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}`
          : `/api/learning-logs?grade=${encodeURIComponent(grade)}&name=${encodeURIComponent(name)}`;

        const response = await fetch(url);
        const logs = await response.json();

        // 현재 단원의 학습 기록이 있는지 확인
        hasLearningRecord = logs.some(log => log.unit === unit && log.completed);
        console.log(`[learning-common] 학습 기록 확인: unit=${unit}, hasRecord=${hasLearningRecord}`);
      } catch (err) {
        console.error('[learning-common] 학습 기록 조회 오류:', err);
      }
    }

    // 페이지 로드 시 항상 본문학습 탭으로 시작 (localStorage 탭 기록 무시)
    console.log('[learning-common] 탭 선택: 본문학습으로 시작');
    activateTab('reading');
    // 저장된 탭 기록 초기화
    localStorage.removeItem(`current-geo-tab:${unit}`);

    // ★ 서버에서 학습 진행 데이터 복원
    let hasServerReadingData = false;  // 서버에서 본문학습 데이터 복원 여부
    try {
      console.log('[learning-common] ★ 서버 데이터 로딩 시작...');
      const serverData = await loadUnitProgressFromServer();
      console.log('[learning-common] ★ 서버 데이터 로드 결과:', serverData);
      console.log('[learning-common] ★ 서버 데이터 키 목록:', serverData ? Object.keys(serverData) : 'null');
      if (serverData) {
        // 본문학습 상태 복원 (DOM이 이미 있으므로 즉시 복원)
        // readingState 사용 (reportState는 분석리포트 전용이므로 제외)
        const readingData = serverData.readingState;
        if (readingData) {
          console.log('[learning-common] 서버 데이터 복원 시작:', readingData);
          restoreReadingStateFromServer(readingData);
          hasServerReadingData = true;  // 서버에서 복원 완료
        } else {
          console.log('[learning-common] ★ reportState/readingState 없음 - 본문학습 복원 건너뜀');
        }
        // 어휘학습 상태 복원
        if (serverData.vocabState) {
          console.log('[learning-common] ★★★ 어휘학습 서버 데이터:', serverData.vocabState);
          // ★ 서버 데이터를 영구적으로 저장 (탭 전환 시에도 사용)
          window._persistedVocabServerData = serverData.vocabState;
          // blank-wrap이 이미 있으면 즉시 복원, 없으면 나중에 복원하도록 저장
          const blanks = document.querySelectorAll('#tab-vocab .blank-wrap');
          if (blanks.length > 0) {
            console.log('[learning-common] blank-wrap 이미 있음, 즉시 복원');
            restoreVocabStateFromServer(serverData.vocabState);
          } else {
            console.log('[learning-common] blank-wrap 아직 없음, 나중에 복원');
            window._pendingVocabServerData = serverData.vocabState;
          }
        } else {
          console.log('[learning-common] ★ vocabState 없음');
        }
        // ★ 창의활동 상태 복원
        if (serverData.creativeState) {
          console.log('[learning-common] ★★★ 창의활동 서버 데이터:', serverData.creativeState);
          restoreCreativeStateFromServer(serverData.creativeState);
        } else {
          console.log('[learning-common] ★ creativeState 없음');
        }
      } else {
        console.log('[learning-common] ★ 서버에서 데이터 없음 (null)');
      }
    } catch (err) {
      console.error('[learning-common] 서버 데이터 복원 오류:', err);
    }

    // ★ 나중에 content.js에서 호출할 서버 데이터 복원 함수
    // ★ 탭 전환 시에도 호출 가능 (영구 저장된 데이터 사용)
    window.restoreVocabFromServerData = function() {
      console.log('[restoreVocabFromServerData] 호출됨, pending:', !!window._pendingVocabServerData, ', persisted:', !!window._persistedVocabServerData);
      // 우선 pending 데이터 처리
      if (window._pendingVocabServerData) {
        console.log('[restoreVocabFromServerData] pending 서버 데이터로 어휘학습 복원 시작');
        restoreVocabStateFromServer(window._pendingVocabServerData);
        delete window._pendingVocabServerData;
      }
      // 탭 전환 시: 영구 저장된 데이터로 복원
      else if (window._persistedVocabServerData) {
        console.log('[restoreVocabFromServerData] 영구 저장된 서버 데이터로 어휘학습 복원, isGraded:', window._persistedVocabServerData.isGraded);
        restoreVocabStateFromServer(window._persistedVocabServerData);
      } else {
        console.log('[restoreVocabFromServerData] 복원할 데이터 없음');
      }
    };

    // 어휘학습 버튼 초기화
    initVocabButtons();

    // 창의활동 내용 동적 로드 (content.js에서)
    loadCreativeContent();

    // 창의활동 버튼 초기화
    initCreativeButtons();

    // 시작: 빈 레이더 (서버에서 복원한 경우 건너뜀)
    if (!hasServerReadingData) {
      drawRadarChart({ literal:0, structural:0, lexical:0, inferential:0, critical:0 });
    }

    // ✅ 어휘학습 상태 복원
    loadVocabState();

    // ✅ 창의활동 상태 복원
    loadCreativeState();
});

  /* =========================================================
     창의활동 내용 동적 로드 (content.js에서 가져오기)
  ========================================================= */
  function loadCreativeContent() {
    const unit = window.CUR_UNIT || 'geo_01';
    const pack = window.CONTENTS && window.CONTENTS[unit];

    if (!pack || !pack.creative) {
      console.log('[loadCreativeContent] 창의활동 데이터 없음:', unit);
      return;
    }

    const creative = pack.creative;
    console.log('[loadCreativeContent] 창의활동 로드:', unit, creative.title);

    // 창의활동 제목 업데이트
    const titleEl = document.querySelector('.creative-title');
    if (titleEl && creative.title) {
      titleEl.textContent = 'Ai고래쌤과 함께하는 창의활동 — ' + creative.title;
    }

    // 주제 업데이트
    const topicBox = document.querySelector('.creative-topic-box');
    if (topicBox) {
      const topicText = creative.topic || creative.title || creative.description || creative.subtitle || '';
      const topicDiv = topicBox.querySelector('div:first-child');
      if (topicDiv && topicText) {
        topicDiv.innerHTML = '<strong>주제:</strong> <strong>"' + topicText + '"</strong>';
      }

      // 힌트 업데이트 (있으면)
      const hintDiv = topicBox.querySelector('.creative-hint');
      if (hintDiv) {
        if (creative.hint) {
          hintDiv.textContent = '💡 힌트) ' + creative.hint;
          hintDiv.style.display = 'block';
        } else {
          // 힌트가 없으면 숨김
          hintDiv.style.display = 'none';
        }
      }
    }

    // 예시 업데이트
    const examplesBox = document.querySelector('.creative-examples-box');
    if (examplesBox && creative.examples && creative.examples.length > 0) {
      // 기존 예시 div들 제거 (제목 제외)
      const existingExamples = examplesBox.querySelectorAll('div:not(.example-title)');
      existingExamples.forEach(el => el.remove());

      // 새 예시 추가 (예시 1), 예시 2) 번호 붙이기)
      creative.examples.forEach((ex, i) => {
        const div = document.createElement('div');
        // 이미 "예시"로 시작하면 그대로, 아니면 번호 붙임
        if (ex.startsWith('예시')) {
          div.textContent = ex;
        } else {
          div.textContent = '예시 ' + (i + 1) + ') ' + ex;
        }
        examplesBox.appendChild(div);
      });
    } else if (examplesBox && (creative.example1 || creative.example2 || creative.example3)) {
      // 기존 예시 div들 제거 (제목 제외)
      const existingExamples = examplesBox.querySelectorAll('div:not(.example-title)');
      existingExamples.forEach(el => el.remove());

      // example1, example2, example3 형식 처리
      if (creative.example1) {
        const div1 = document.createElement('div');
        div1.textContent = '예시 1) ' + creative.example1;
        examplesBox.appendChild(div1);
      }
      if (creative.example2) {
        const div2 = document.createElement('div');
        div2.textContent = '예시 2) ' + creative.example2;
        examplesBox.appendChild(div2);
      }
      if (creative.example3) {
        const div3 = document.createElement('div');
        div3.textContent = '예시 3) ' + creative.example3;
        examplesBox.appendChild(div3);
      }
    }
  }

    /* ===== 뒤로 가기 확인 팝업 ===== */
    function showBackConfirm() {
      const overlay = document.getElementById('back-confirm-overlay');
      if (overlay) {
        overlay.classList.add('show');
      }
    }

    function hideBackConfirm() {
      const overlay = document.getElementById('back-confirm-overlay');
      if (overlay) {
        overlay.classList.remove('show');
      }
    }

    function goToMenu() {
      // iframe 내부에서 실행 중인지 확인
      if (window.parent && window.parent !== window) {
        // 부모 창(menu.html)의 모달 닫기 함수 호출
        try {
          if (window.parent.closeUnitModal) {
            window.parent.closeUnitModal();
          }
        } catch (e) {
          console.log('모달 닫기 실패, 페이지 이동:', e);
          window.location.href = '/menu.html';
        }
      } else {
        // 일반 브라우저에서 직접 열었을 때는 메뉴로 이동
        window.location.href = '/menu.html';
      }
    }

    // 브라우저 뒤로 가기 감지
    window.addEventListener('popstate', (e) => {
      e.preventDefault();
      showBackConfirm();
      // 히스토리를 다시 앞으로 밀어서 뒤로 가기를 막음
      history.pushState(null, '', location.href);
    });

    // 페이지 로드 시 히스토리 상태 추가
    window.addEventListener('load', () => {
      history.pushState(null, '', location.href);
    });

    /* ===== 원형 스탑워치 ===== */
    // window 객체로 선언하여 개별 페이지에서 덮어쓸 수 있도록 함
    window.timer = window.timer || null;
    window.seconds = window.seconds || 0;
    window.isRunning = window.isRunning || false;
    window.RADIUS = 45;
    window.CIRCUMFERENCE = 2 * Math.PI * window.RADIUS;
    window.TOTAL_SECONDS = 600; // 10분
    window.formatTime = function(sec){ const m=String(Math.floor(sec/60)).padStart(2,'0'); const s=String(sec%60).padStart(2,'0'); return `${m}:${s}`; };
    window.updateDisplay = function(){ const t=document.getElementById("timer-text"); if (t) t.textContent = window.formatTime(window.seconds); window.updateRing(); };
    window.updateRing = function(){ const c=document.querySelector(".timer-ring .progress"); if(!c) return; const r=(window.seconds%window.TOTAL_SECONDS)/window.TOTAL_SECONDS; c.style.strokeDashoffset = window.CIRCUMFERENCE - r*window.CIRCUMFERENCE; };
    window.startTimer = function(){ if(!window.isRunning){ window.isRunning=true; const b=document.getElementById("timer-display"); b.classList.remove("paused","reset"); b.classList.add("active"); window.timer=setInterval(()=>{ window.seconds++; window.updateDisplay(); },1000);} };
    window.pauseTimer = function(){ clearInterval(window.timer); window.isRunning=false; const b=document.getElementById("timer-display"); b.classList.remove("active"); b.classList.add("paused"); };
    window.resetTimer = function(){ clearInterval(window.timer); window.isRunning=false; const m=document.getElementById("minute-input"), s=document.getElementById("second-input"); if(m) m.value=Math.floor(window.seconds/60); if(s) s.value=window.seconds%60; window.seconds=0; window.updateDisplay(); const b=document.getElementById("timer-display"); b.classList.remove("active","paused"); b.classList.add("reset"); };

    /* ===== 공통: 학생정보/파일명 ===== */
    function getStudentInfo(){ const grade=document.getElementById('student-grade')?.value.trim()||''; const name=document.getElementById('student-name')?.value.trim()||''; return {grade,name}; }
    function ensureStudentInfo(){ const {grade,name}=getStudentInfo(); return grade!=='' && name!==''; }
    function buildFilename(base){ const {grade,name}=getStudentInfo(); let extra=''; if(grade) extra+='_'+grade; if(name) extra+='_'+name; extra=extra.replace(/[\/\\\s]+/g,'_'); return base.replace(/\.pdf$/,'')+extra+'.pdf'; }

    /* ===== 캡처 → PDF ===== */
    async function captureElementToPDF(elementId, filenameBase, options = {}) {
      try {
        window.scrollTo(0,0);
        const target = document.getElementById(elementId);
        if (!target) return;

        const finalFilename = buildFilename(filenameBase);

        const prevPosition = target.style.position;
        let tempInfo = null;
        if (options.withStudentInfo) {
          const { grade, name } = getStudentInfo();
          if (!target.style.position || target.style.position === '') target.style.position = 'relative';

          tempInfo = document.createElement('div');
          tempInfo.innerHTML = `<strong>학년:</strong> ${grade || '-'} &nbsp; | &nbsp; <strong>이름:</strong> ${name || '-'}`;
          tempInfo.style.position = 'absolute';
          tempInfo.style.top = '0'; tempInfo.style.left = '0'; tempInfo.style.right = '0';
          tempInfo.style.background = '#fff7ea'; tempInfo.style.borderBottom = '1px solid #f3d3b4';
          tempInfo.style.padding = '6px 12px'; tempInfo.style.fontSize = '13px'; tempInfo.style.color = '#5b4334';
          tempInfo.style.zIndex = '999'; tempInfo.style.pointerEvents = 'none';
          target.appendChild(tempInfo);
        }

        const canvas = await html2canvas(target, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p','mm','a4');
        const pdfW = pdf.internal.pageSize.getWidth();
        const pdfH = pdf.internal.pageSize.getHeight();

        const imgW = pdfW;
        const imgH = canvas.height * imgW / canvas.width;

        let heightLeft = imgH;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgW, imgH);
        heightLeft -= pdfH;

        while (heightLeft > 0) {
          position = heightLeft - imgH;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgW, imgH);
          heightLeft -= pdfH;
        }

        if (tempInfo) target.removeChild(tempInfo);
        target.style.position = prevPosition;

        pdf.save(finalFilename);
      } catch (e) {
        console.error(e);
        alert("PDF 만드는 중에 이미지 때문에 캡처가 막혔어. BRAINON.png를 빼거나 같은 경로로 옮겨줘!");
      }
    }

    /* ===== 오버레이 ===== */
    function showSubmitOverlay(message) {
      const overlay = document.getElementById("submit-overlay");
      const textBox = document.getElementById("submit-overlay-text");
      textBox.textContent = message;
      overlay.style.display = "flex";
      overlay.classList.add("show");
      setTimeout(() => { overlay.classList.remove("show"); overlay.style.display = "none"; }, 2600);
    }
    // confetti 라이브러리 동적 로드
    if (typeof confetti === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
      document.head.appendChild(script);
    }

    /* ===== 분석리포트 갱신 ===== */
    // 랜덤 피드백 메시지 데이터
    const feedbackMessages = {
      q1: {
        success: [
          '글의 핵심을 정확히 잡아내는 능력이 뛰어나서 어떤 글도 자신 있게 이해할 수 있어요!',
          '중요한 내용을 빠르게 찾아내는 감각이 좋아서 전체 흐름을 안정적으로 파악하고 있어요!',
          '중심 생각을 명확하게 읽어내는 힘이 있어 지문을 깊이 있게 이해하는 데 큰 장점이 있어요!',
          '핵심을 흔들림 없이 정확히 이해해 주어서 읽기 과정이 아주 안정적이에요!',
          '필요한 정보와 그렇지 않은 정보를 구별하는 눈이 뛰어나 글 해석에 큰 강점이 보여요!'
        ],
        warning: [
          '핵심 내용을 찾는 과정이 조금 흔들릴 수 있지만, 중심 문장만 잡아도 훨씬 수월해질 거예요!',
          '중요한 부분이 살짝 흐려졌지만, 요점 정리 연습을 조금만 더 하면 금방 좋아질 실력이에요!',
          '글의 중심이 한 번에 보이지 않을 때도 있지만, 지금처럼 꾸준히 연습하면 확실히 잡힐 거예요!',
          '핵심 이해에서 약간의 혼란이 있었지만, 방향은 맞고 있어서 바로 성장할 여지가 커요!',
          '중심 내용을 선명하게 잡는 연습이 필요하지만, 이미 기본기가 있어 금방 탄탄해질 거예요!'
        ]
      },
      q2: {
        success: [
          '글의 전개 흐름을 매끄럽게 읽어내는 능력이 뛰어나서 전체 구조가 한눈에 보이는 느낌이에요!',
          '설명·전개·예시 구조를 자연스럽게 구분해내는 감각이 아주 좋아요!',
          '글이 어떤 방식으로 구성되었는지 빠르게 파악하는 능력이 돋보여요!',
          '구조적 연결을 잘 읽어내서 글 전체가 정말 명확하게 보이고 있어요!',
          '문단 간 관계를 자연스럽게 이해해 흐름을 읽는 데 강점이 있어요!'
        ],
        warning: [
          '전개 흐름이 헷갈릴 수 있지만, 순서와 목적만 잡으면 구조는 금방 보이기 시작해요!',
          '글의 구성 방식이 조금 어렵게 느껴질 수 있지만, 반복 연습으로 충분히 잡아갈 수 있어요!',
          '구조 파악이 살짝 흔들렸지만, 문단 역할을 하나씩 보면 훨씬 쉬워질 거예요!',
          '흐름 이해가 조금 막혔지만, 이미 기본 틀은 알고 있어서 금방 올라갈 실력이에요!',
          '구조가 복잡하게 느껴질 수 있지만, 차분히 분석하면 충분히 따라갈 수 있어요!'
        ]
      },
      q3: {
        success: [
          '문맥에 따라 단어의 의미를 정확히 파악하는 능력이 좋아서 읽기 안정감이 뛰어나요!',
          '단어가 지문에서 어떤 역할을 하는지 자연스럽게 이해하고 있어요!',
          '어휘 변화를 문맥 속에서 정확하게 잡아내는 감각이 굉장히 좋네요!',
          '낯선 단어도 글의 흐름으로 유추해내는 힘이 있어 독해가 매끄러워요!',
          '어휘가 문맥에 따라 달라지는 의미를 섬세하게 읽어내는 능력이 뛰어나요!'
        ],
        warning: [
          '모르는 단어가 나와도 문맥 힌트를 더 찾는 연습을 하면 이해가 훨씬 쉬워질 거예요!',
          '어휘 의미가 조금 헷갈릴 때도 있지만, 문장 구조를 함께 보면 금방 해결돼요!',
          '단어 의미가 막힐 때가 있었지만, 흐름을 천천히 읽으면 충분히 유추할 수 있어요!',
          '어휘 파악이 어려울 수 있지만, 연습할수록 문맥의 도움을 잘 받을 수 있어요!',
          '낯선 단어가 부담될 수 있지만, 의미를 찾는 기초 감각은 이미 탄탄해요!'
        ]
      },
      q4: {
        success: [
          '여러 정보를 연결해 숨은 의미를 찾아내는 능력이 뛰어나 고난도 문제에도 강해요!',
          '글의 내용 뒤에 숨은 의도를 자연스럽게 이해하는 능력이 돋보여요!',
          '단서를 모아 결론을 도출하는 추론 능력이 정말 탄탄해요!',
          '여러 문장을 통합해 스스로 의미를 정리하는 힘이 매우 좋아요!',
          '글 속에 드러나지 않은 의도까지 잘 캐치해서 통찰력이 뛰어나요!'
        ],
        warning: [
          '깊게 생각해야 하는 부분에서 막힘이 있었지만, 이런 문제는 경험을 쌓으면 훨씬 쉬워져요!',
          '숨은 의미를 찾는 과정이 어려웠지만, 차근차근 단서를 모으면 충분히 해결할 수 있어요!',
          '내용을 통합하는 데 약간 어려움이 있었지만, 전체 흐름을 다시 보면 답이 보여요!',
          '추론 과정이 복잡하게 느껴질 수 있지만, 기본 방향은 잘 잡혀 있었어요!',
          '통합적 사고가 아직 다듬어지지 않았지만, 꾸준히 연습하면 빠르게 성장할 수 있어요!'
        ]
      },
      q5: {
        success: [
          '글의 내용을 자신의 생각과 자연스럽게 연결해 판단하는 능력이 뛰어나요!',
          '제시된 정보를 비판적으로 바라보는 시각이 아주 좋아요!',
          '글의 논리를 분석하고 자기 의견으로 확장하는 능력이 돋보여요!',
          '주어진 상황을 새로운 관점으로 적용하는 힘이 탄탄해요!',
          '글 속 메시지를 자기 삶과 연결해 깊이 있게 해석하는 능력이 뛰어나요!'
        ],
        warning: [
          '비판적 해석이 조금 어려웠지만, 질문을 던지며 읽으면 충분히 더 좋아질 수 있어요!',
          '적용 문제에서 고민이 되었지만, 사고폭을 조금만 넓히면 바로 해결돼요!',
          '자기 의견을 정리하는 과정이 막힐 수 있지만, 구조를 잡아 보면 훨씬 쉬워져요!',
          '비판적 시각이 살짝 흔들렸지만, 이미 기본 감각은 있어서 조금만 다듬으면 돼요!',
          '적용 단계에서 어려움이 있었지만, 내용 이해도를 보면 곧바로 성장할 수 있는 실력이에요!'
        ]
      }
    };

    function getRandomMessage(questionKey, isSuccess) {
      const messages = feedbackMessages[questionKey][isSuccess ? 'success' : 'warning'];
      return messages[Math.floor(Math.random() * messages.length)];
    }

    function updateReportPanel(data) {
      const r1 = document.querySelector('#tab-report .rp-1');
      const r2 = document.querySelector('#tab-report .rp-2');
      const r3 = document.querySelector('#tab-report .rp-3');
      const r4 = document.querySelector('#tab-report .rp-4');
      const r5 = document.querySelector('#tab-report .rp-5');
      const log = document.getElementById('report-log');

      [r1,r2,r3,r4,r5].forEach(el => el && el.classList.remove('ok'));
      if (data.q1ok) r1?.classList.add('ok');
      if (data.q2ok) r2?.classList.add('ok');
      if (data.q3ok) r3?.classList.add('ok');
      if (data.q4ok) r4?.classList.add('ok');
      if (data.q5ok) r5?.classList.add('ok');

      // 박스 형태로 결과 표시 (랜덤 메시지)
      if (log) {
        const items = [
          { label: '① 핵심 이해력', ok: data.q1ok, key: 'q1' },
          { label: '② 구조 파악력', ok: data.q2ok, key: 'q2' },
          { label: '③ 어휘 맥락력', ok: data.q3ok, key: 'q3' },
          { label: '④ 추론·통합력', ok: data.q4ok, key: 'q4' },
          { label: '⑤ 비판·적용력', ok: data.q5ok, key: 'q5' }
        ];

        log.innerHTML = items.map(item => {
          const className = item.ok ? 'success' : 'warning';
          const emoji = item.ok ? '❤️' : '😅';
          const message = getRandomMessage(item.key, item.ok);
          return `<div class="report-log-item ${className}">
            <span>${item.label}: ${message} ${emoji}</span>
          </div>`;
        }).join('');
      }
    }

    /* ===== 레이더 차트 ===== */
    window.drawRadarChart = function drawRadarChart(scores) {
      const canvas = document.getElementById('report-radar');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const cx = w/2, cy = h/2, maxR = 130, steps = 5, maxScore = 10;

      const labels = ["① 핵심 이해력","② 구조 파악력","③ 어휘 맥락력","④ 추론·통합력","⑤ 비판·적용력"];
      const values = [scores.literal, scores.structural, scores.lexical, scores.inferential, scores.critical];

      ctx.strokeStyle = "#d3c9bd"; ctx.lineWidth = 1;
      for (let s=1; s<=steps; s++){
        const r = (maxR/steps)*s; ctx.beginPath();
        for (let i=0;i<5;i++){
          const ang = -Math.PI/2 + (Math.PI*2/5)*i;
          const x = cx + r*Math.cos(ang), y = cy + r*Math.sin(ang);
          if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
        }
        ctx.closePath(); ctx.stroke();
      }

      ctx.fillStyle = "#3b2f27"; ctx.font = "bold 12px sans-serif";
      for (let i=0;i<5;i++){
        const ang = -Math.PI/2 + (Math.PI*2/5)*i;
        const x = cx + maxR*Math.cos(ang), y = cy + maxR*Math.sin(ang);
        ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(x,y); ctx.stroke();
        const lx = cx + (maxR+22)*Math.cos(ang), ly = cy + (maxR+22)*Math.sin(ang);
        ctx.textAlign = "center"; ctx.fillText(labels[i], lx, ly);
      }

      ctx.beginPath();
      for (let i=0;i<5;i++){
        const ang = -Math.PI/2 + (Math.PI*2/5)*i;
        const ratio = Math.max(0, Math.min(values[i]/maxScore, 1));
        const r = maxR * ratio;
        const x = cx + r*Math.cos(ang), y = cy + r*Math.sin(ang);
        if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
      ctx.closePath(); ctx.fillStyle="rgba(192,74,59,0.25)"; ctx.fill();
      ctx.strokeStyle="#c04a3b"; ctx.lineWidth=2; ctx.stroke();

      ctx.fillStyle="#c04a3b";
      for (let i=0;i<5;i++){
        const ang = -Math.PI/2 + (Math.PI*2/5)*i;
        const ratio = Math.max(0, Math.min(values[i]/maxScore, 1));
        const r = maxR * ratio;
        const x = cx + r*Math.cos(ang), y = cy + r*Math.sin(ang);
        ctx.beginPath(); ctx.arc(x,y,3.5,0,Math.PI*2); ctx.fill();
      }
    }

    /* ===== 본문 채점 ===== */
    let fullResultHTML = "";
    function gradeQuiz() {
      // 콘텐츠에서 정답과 해설 가져오기
      const unit = window.CUR_UNIT || 'geo_01';
      const pack = window.CONTENTS && window.CONTENTS[unit];

      // 콘텐츠에서 answerKey 가져오기 (없으면 기본값 사용)
      const answerKey = (pack && pack.answerKey) ? pack.answerKey : {
        q1: "2",
        q2: "3",
        q3_1: ["경계"],
        q3_2: ["일반도"],
        q4_1: ["디지털", "디지털지도", "디지털 지도"],
        q4_2: ["실시간"]
      };

      // 콘텐츠에서 explain 가져오기 (없으면 기본값 사용)
      const explain = (pack && pack.explain) ? pack.explain : {
        q1: "해설: 지도에는 단순 길 안내를 넘어 지역의 생활 모습과 자연환경 정보가 들어 있어 세상을 이해하는 창이 됨.",
        q2: "해설: 주제도는 교통·관광·기후처럼 한 주제에 집중해 정보를 표현하는 지도.",
        q3: "해설: 산과 강, 도시와 나라의 경계를 보여 주는 지도는 '일반도'라고 합니다.",
        q4: "해설: 디지털 지도는 전자기기에서 실시간으로 정보를 확인할 수 있는 지도입니다.",
        q5: "서술형 예시: 지도를 통해 지역의 구조, 사람들의 생활, 자연환경을 함께 읽어내는 사람이라는 뜻."
      };

      const quizBlocks = document.querySelectorAll('#tab-reading .quiz-block');
      const numLabels = ["01","02","03","04","05"];
      quizBlocks.forEach((block, idx) => {
        const numEl = block.querySelector('.quiz-num');
        const markEl = numEl.querySelector('.mark');
        numEl.textContent = numLabels[idx];
        numEl.appendChild(markEl);
        numEl.classList.remove('correct','wrong');
        markEl.textContent = "";
      });

      let score = 0;
      let totalAuto = 4;
      let shortMsgs = [];
      let fullMsgs = [];

      // 1번
      const q1 = document.querySelector('input[name="q1"]:checked');
      const q1Num = quizBlocks[0].querySelector('.quiz-num');
      const q1Mark = q1Num.querySelector('.mark');
      const q1ok = (q1 && q1.value === answerKey.q1);
      if (q1ok) { score++; q1Num.classList.add('correct'); q1Mark.textContent="⭕"; shortMsgs.push("① 정답 ✅"); fullMsgs.push("① 정답 ✅ " + explain.q1); }
      else { q1Num.classList.add('wrong'); q1Mark.textContent="✖"; shortMsgs.push("① 오답 ❌"); fullMsgs.push("① 오답 ❌ " + explain.q1); }

      // 2번
      const q2 = document.querySelector('input[name="q2"]:checked');
      const q2Num = quizBlocks[1].querySelector('.quiz-num');
      const q2Mark = q2Num.querySelector('.mark');
      const q2ok = (q2 && q2.value === answerKey.q2);
      if (q2ok) { score++; q2Num.classList.add('correct'); q2Mark.textContent="⭕"; shortMsgs.push("② 정답 ✅"); fullMsgs.push("② 정답 ✅ " + explain.q2); }
      else { q2Num.classList.add('wrong'); q2Mark.textContent="✖"; shortMsgs.push("② 오답 ❌"); fullMsgs.push("② 오답 ❌ " + explain.q2); }

      // 3번 (객관식 또는 빈칸)
      const q3Num = quizBlocks[2].querySelector('.quiz-num');
      const q3Mark = q3Num.querySelector('.mark');
      let q3ok = false;
      if (answerKey.q3 && typeof answerKey.q3 === 'string') {
        // 객관식: answerKey.q3 = '2' 형태
        const q3Radio = document.querySelector('input[name="q3"]:checked');
        q3ok = (q3Radio && q3Radio.value === answerKey.q3);
      } else if (answerKey.q3_1) {
        // 빈칸: answerKey.q3_1 = ['답'] 형태
        const q3_1 = document.getElementById("q3-1")?.value.trim() || '';
        const q3_2 = document.getElementById("q3-2")?.value.trim() || '';
        const ok3_1 = answerKey.q3_1.some(a => a.replace(/\s+/g,"").toLowerCase() === q3_1.replace(/\s+/g,"").toLowerCase());
        const ok3_2 = answerKey.q3_2.some(a => a.replace(/\s+/g,"").toLowerCase() === q3_2.replace(/\s+/g,"").toLowerCase());
        q3ok = (ok3_1 && ok3_2);
      }
      if (q3ok) { score++; q3Num.classList.add('correct'); q3Mark.textContent="⭕"; shortMsgs.push("③ 정답 ✅"); fullMsgs.push("③ 정답 ✅ " + explain.q3); }
      else { q3Num.classList.add('wrong'); q3Mark.textContent="✖"; shortMsgs.push("③ 오답 ❌"); fullMsgs.push("③ 오답 ❌ " + explain.q3); }

      // 4번 (객관식 또는 빈칸)
      const q4Num = quizBlocks[3].querySelector('.quiz-num');
      const q4Mark = q4Num.querySelector('.mark');
      let q4ok = false;
      if (answerKey.q4 && typeof answerKey.q4 === 'string') {
        // 객관식: answerKey.q4 = '3' 형태
        const q4Radio = document.querySelector('input[name="q4"]:checked');
        q4ok = (q4Radio && q4Radio.value === answerKey.q4);
      } else if (answerKey.q4_1) {
        // 빈칸: answerKey.q4_1 = ['답'] 형태
        const q4_1 = document.getElementById("q4-1")?.value.trim() || '';
        const q4_2 = document.getElementById("q4-2")?.value.trim() || '';
        const ok4_1 = answerKey.q4_1.some(a => a.replace(/\s+/g,"").toLowerCase() === q4_1.replace(/\s+/g,"").toLowerCase());
        const ok4_2 = answerKey.q4_2.some(a => a.replace(/\s+/g,"").toLowerCase() === q4_2.replace(/\s+/g,"").toLowerCase());
        q4ok = (ok4_1 && ok4_2);
      }
      if (q4ok) { score++; q4Num.classList.add('correct'); q4Mark.textContent="⭕"; shortMsgs.push("④ 정답 ✅"); fullMsgs.push("④ 정답 ✅ " + explain.q4); }
      else { q4Num.classList.add('wrong'); q4Mark.textContent="✖"; shortMsgs.push("④ 오답 ❌"); fullMsgs.push("④ 오답 ❌ " + explain.q4); }

      // 5번 서술형
      const essay = document.getElementById("q5").value.trim().toLowerCase();
      const q5Num = quizBlocks[4].querySelector('.quiz-num');
      const q5Mark = q5Num.querySelector('.mark');
      // 콘텐츠에서 essayKeywords 가져오기 (없으면 기본값 사용)
      const essayKeywords = (pack && pack.essayKeywords) ? pack.essayKeywords : ["지도의 정보를 통해","생활","자연환경","구조","공간","세상","다양성","이해","지역","특징","주제도","일반도"];
      let hit = 0;
      essayKeywords.forEach(kw => { if (essay.includes(kw.replace(/\s+/g,""))) hit++; });
      let q5ok = false;

      if (essay.length === 0) {
        q5Num.classList.add('wrong'); q5Mark.textContent="✖";
        shortMsgs.push("⑤ 서술형: 미작성 ❌");
        fullMsgs.push("⑤ 서술형: 미작성 ❌ " + explain.q5);
      } else if (hit >= 1) {
        q5Num.classList.add('correct'); q5Mark.textContent="⭕";
        shortMsgs.push("⑤ 서술형: 핵심어 표현 감지 ✅");
        fullMsgs.push("⑤ 서술형: 핵심어 표현 감지 ✅ " + explain.q5);
        q5ok = true;
      } else {
        q5Num.classList.add('wrong'); q5Mark.textContent="✖";
        shortMsgs.push("⑤ 서술형: 핵심어 표현 부족 ❌");
        fullMsgs.push("⑤ 서술형: 핵심어 표현 부족 ❌ " + explain.q5);
      }

      const box = document.getElementById("grade-result");
      box.style.display = "block";
      box.innerHTML = `<p><strong>점수: ${score} / ${totalAuto}</strong></p>` + shortMsgs.map(m => `<p>${m}</p>`).join("");
      fullResultHTML = `<p><strong>점수: ${score} / ${totalAuto}</strong></p>` + fullMsgs.map(m => `<p>${m}</p>`).join("");

      document.getElementById("grade-btn").style.display = "inline-block";
      document.getElementById("reset-btn").style.display = "inline-block";
      document.getElementById("submit-btn").style.display = "inline-block";

      // ★ 전역 상태에 저장
      window.reportState.q1ok = q1ok;
      window.reportState.q2ok = q2ok;
      window.reportState.q3ok = q3ok;
      window.reportState.q4ok = q4ok;
      window.reportState.q5ok = q5ok;

      // ★ 분석리포트 텍스트/박스 동기화
      updateReportPanel({
        q1ok: window.reportState.q1ok,
        q2ok: window.reportState.q2ok,
        q3ok: window.reportState.q3ok,
        q4ok: window.reportState.q4ok,
        q5ok: window.reportState.q5ok,
        messages: (function(){
          const lexicalRatio = (typeof window.reportState.vocabScoreRatio === "number") ? window.reportState.vocabScoreRatio : 0;
          const lexicalOk = lexicalRatio >= 0.7;
          return [
            "① 핵심 이해력(객관식): " + (window.reportState.q1ok ? "핵심 이해력이 좋아요! ✅" : "보완 필요해요 ❗"),
            "② 구조 파악력(객관식): " + (window.reportState.q2ok ? "구조 파악력이 좋아요! ✅" : "보완 필요해요 ❗"),
            "③ 어휘 맥락력(빈칸): " + (lexicalOk ? "어휘 맥락력이 좋아요! ✅" : "어휘 복습이 필요해요 ❗"),
            "④ 추론·통합력(빈칸): " + (window.reportState.q4ok ? "추론·통합력이 좋아요! ✅" : "보완 필요해요 ❗"),
            "⑤ 비판·적용력(서술형): " + (window.reportState.q5ok ? "비판·적용력이 좋아요! ✅" : "보완 필요해요 ❗")
          ];
        })()
      });

      // 레이더 차트
      drawRadarChart({
        literal:     window.reportState.q1ok ? 10 : 6,
        structural:  window.reportState.q2ok ? 10 : 6,
        lexical:     window.reportState.q3ok ? 10 : 6,
        inferential: window.reportState.q4ok ? 10 : 6,
        critical:    window.reportState.q5ok ? 10 : 6
      });

      // 어휘 피드백 반영
      const lexicalRatio = (typeof window.reportState.vocabScoreRatio === "number") ? window.reportState.vocabScoreRatio : 0;
      const lexicalFromRatio = Math.round(lexicalRatio * 10);
      renderFeedback({
        literal:    window.reportState.q1ok ? 10 : 6,
        structural: window.reportState.q2ok ? 10 : 6,
        lexical:    lexicalFromRatio,
        inferential:window.reportState.q4ok ? 10 : 6,
        critical:   window.reportState.q5ok ? 10 : 6
      });

      // ★ localStorage에 분석리포트 상태 저장 (분석리포트 탭 즉시 반영용)
      // unit 변수는 위에서 이미 선언됨
      const storageKey = `dan-geo-report-state:${unit}`;
      console.log(`[gradeQuiz] unit=${unit}로 localStorage에 저장`);
      const reportDataToSave = {
        q1ok: window.reportState.q1ok,
        q2ok: window.reportState.q2ok,
        q3ok: window.reportState.q3ok,
        q4ok: window.reportState.q4ok,
        q5ok: window.reportState.q5ok,
        vocabScoreRatio: window.reportState.vocabScoreRatio,
        literal: window.reportState.q1ok ? 10 : 6,
        structural: window.reportState.q2ok ? 10 : 6,
        lexical: lexicalFromRatio,
        inferential: window.reportState.q4ok ? 10 : 6,
        critical: window.reportState.q5ok ? 10 : 6,
        // 본문학습 입력값도 저장
        inputs: {
          q1: q1 ? q1.value : '',
          q2: q2 ? q2.value : '',
          q3_1: document.getElementById("q3-1").value,
          q3_2: document.getElementById("q3-2").value,
          q4_1: document.getElementById("q4-1").value,
          q4_2: document.getElementById("q4-2").value,
          q5: document.getElementById("q5").value
        },
        resultHTML: fullResultHTML
      };
      localStorage.setItem(storageKey, JSON.stringify(reportDataToSave));

      // ★ 서버에도 저장
      saveUnitProgressToServer({
        reportState: reportDataToSave
      });

      // ★ 분석리포트 탭 즉시 업데이트
      refreshReportTab();
    }

    function resetQuiz() {
      // 페이지별 커스텀 resetQuiz가 있으면 그것을 호출
      if (window._customResetQuiz) {
        window._customResetQuiz();
        return;
      }

      document.querySelectorAll('#tab-reading input[type="radio"]').forEach(r => r.checked = false);
      const q31 = document.getElementById("q3-1"); if (q31) q31.value = "";
      const q32 = document.getElementById("q3-2"); if (q32) q32.value = "";
      const q41 = document.getElementById("q4-1"); if (q41) q41.value = "";
      const q42 = document.getElementById("q4-2"); if (q42) q42.value = "";
      const q5 = document.getElementById("q5"); if (q5) q5.value = "";

      const quizBlocks = document.querySelectorAll('#tab-reading .quiz-block');
      const numLabels = ["01","02","03","04","05"];
      quizBlocks.forEach((block, idx) => {
        const numEl = block.querySelector('.quiz-num');
        if (!numEl) return;
        const markEl = numEl.querySelector('.mark');
        numEl.textContent = numLabels[idx];
        if (markEl) numEl.appendChild(markEl);
        numEl.classList.remove('correct','wrong');
        if (markEl) markEl.textContent = "";
      });

      const resultBox = document.getElementById("grade-result");
      if (resultBox) {
        resultBox.style.display = "none";
        resultBox.innerHTML = "";
      }
      fullResultHTML = "";

      // solutions-box 제거 (제출하기에서 생성된 해설 박스)
      const solutionsBox = document.getElementById("solutions-box");
      if (solutionsBox) {
        solutionsBox.remove();
      }

      // 버튼 처리 - 페이지에 따라 다른 버튼이 있을 수 있음
      const gradeBtn = document.getElementById("grade-btn");
      const resetBtn = document.getElementById("reset-btn");
      const submitBtn = document.getElementById("submit-btn");
      const saveProgressBtn = document.getElementById("save-progress-btn");

      if (gradeBtn) gradeBtn.style.display = "inline-block";
      if (resetBtn) resetBtn.style.display = "none";
      if (submitBtn) submitBtn.style.display = "none";
      if (saveProgressBtn) saveProgressBtn.style.display = "inline-block";

      reportState = { q1ok:false, q2ok:false, q3ok:false, q4ok:false, q5ok:false, vocabScoreRatio:0 };

      updateReportPanel({ q1ok:false, q2ok:false, q3ok:false, q4ok:false, q5ok:false, messages: ["채점 결과가 초기화되었습니다. 다시 풀고 채점해 주세요."] });

      drawRadarChart({ literal:0, structural:0, lexical:0, inferential:0, critical:0 });
    }

    // 본문 제출
    async function submitQuiz() {
      if (!ensureStudentInfo()) { showSubmitOverlay('학년과 이름을 입력해주세요'); return; }

      // ★ 제출 전에 localStorage에 리포트 상태 저장
      const lexicalRatio = (typeof window.reportState.vocabScoreRatio === "number") ? window.reportState.vocabScoreRatio : 0;
      const lexicalFromRatio = Math.round(lexicalRatio * 10);

      const unit = window.CUR_UNIT || 'geo_01';
      const storageKey = `dan-geo-report-state:${unit}`;
      console.log(`[submitQuiz] unit=${unit}로 localStorage에 저장`);
      localStorage.setItem(storageKey, JSON.stringify({
        q1ok: window.reportState.q1ok,
        q2ok: window.reportState.q2ok,
        q3ok: window.reportState.q3ok,
        q4ok: window.reportState.q4ok,
        q5ok: window.reportState.q5ok,
        vocabScoreRatio: window.reportState.vocabScoreRatio,
        literal: window.reportState.q1ok ? 10 : 6,
        structural: window.reportState.q2ok ? 10 : 6,
        lexical: lexicalFromRatio,
        inferential: window.reportState.q4ok ? 10 : 6,
        critical: window.reportState.q5ok ? 10 : 6
      }));

      console.log('[submitQuiz] localStorage에 리포트 상태 저장 완료');

      await captureElementToPDF('capture-reading', '단단국어_본문학습.pdf', { withStudentInfo: true });
      showSubmitSuccess('본문학습');
      const resultBox = document.getElementById("grade-result");
      resultBox.style.display = "block";
      resultBox.innerHTML = fullResultHTML;
    }

    /* ===== 어휘학습 상태 저장/복원 ===== */
    function saveVocabState() {
      const stu = getCurrentStudent();
      if (!stu) return;
      const stuKey = buildStudentKey(stu);
      const unit = window.CUR_UNIT || 'geo_01';
      const stateKey = `vocab-state:${stuKey}:${unit}`;

      const blanks = document.querySelectorAll('#tab-vocab .blank-wrap');
      const vocabData = [];
      blanks.forEach(bw => {
        const input = bw.querySelector('.blank-input');
        const mark = bw.querySelector('.blank-mark');
        vocabData.push({
          value: input.value,
          isCorrect: bw.classList.contains('correct'),
          isWrong: bw.classList.contains('wrong'),
          markText: mark ? mark.textContent : ''
        });
      });

      // 채점 완료 여부 (correct 또는 wrong 클래스가 하나라도 있으면 채점됨)
      const isGraded = blanks.length > 0 && Array.from(blanks).some(bw =>
        bw.classList.contains('correct') || bw.classList.contains('wrong')
      );

      const vocabStateData = {
        vocabData: vocabData,
        resultHTML: vocabResultBox ? vocabResultBox.innerHTML : '',
        isGraded: isGraded
      };

      localStorage.setItem(stateKey, JSON.stringify(vocabStateData));
      console.log('[saveVocabState] localStorage 저장 완료:', stateKey);

      // ★ 영구 저장 데이터도 업데이트 (탭 전환 시 복원용)
      window._persistedVocabServerData = vocabStateData;
      console.log('[saveVocabState] _persistedVocabServerData 업데이트 완료');

      // ★ 서버에도 저장
      if (typeof saveUnitProgressToServer === 'function') {
        saveUnitProgressToServer({
          vocabState: vocabStateData
        });
        console.log('[saveVocabState] 서버 저장 호출');
      }
    }
    // ★ window에 노출
    window.saveVocabState = saveVocabState;

    function loadVocabState() {
      const stu = getCurrentStudent();
      if (!stu) return;
      const stuKey = buildStudentKey(stu);
      const unit = window.CUR_UNIT || 'geo_01';
      const stateKey = `vocab-state:${stuKey}:${unit}`;

      const saved = localStorage.getItem(stateKey);
      if (!saved) return;

      try {
        const state = JSON.parse(saved);
        const blanks = document.querySelectorAll('#tab-vocab .blank-wrap');

        blanks.forEach((bw, idx) => {
          if (state.vocabData[idx]) {
            const data = state.vocabData[idx];
            const input = bw.querySelector('.blank-input');
            const mark = bw.querySelector('.blank-mark');

            input.value = data.value;
            if (data.isCorrect) bw.classList.add('correct');
            if (data.isWrong) bw.classList.add('wrong');
            if (mark) mark.textContent = data.markText;
          }
        });

        if (state.isGraded) {
          // vocabResultBox가 있으면 결과 표시
          const resultBox = vocabResultBox || document.getElementById('vocab-result');
          if (resultBox) {
            resultBox.innerHTML = state.resultHTML;
            resultBox.style.display = "block";
          }

          // 3버튼 구조 (vocab-grade, vocab-reset, vocab-submit)
          if (vocabGradeBtn) vocabGradeBtn.style.display = "inline-block";
          if (vocabResetBtn) vocabResetBtn.style.display = "inline-block";
          if (vocabSubmitBtn) vocabSubmitBtn.style.display = "inline-block";

          // 2버튼 구조 (vocab-save, vocab-reset)
          const vocabSaveBtn = document.getElementById('vocab-save');
          const vocabResetBtn2 = document.getElementById('vocab-reset');
          if (vocabSaveBtn) vocabSaveBtn.style.display = "none";
          if (vocabResetBtn2) vocabResetBtn2.style.display = "inline-block";
        }

        console.log('[loadVocabState] 복원 완료:', stateKey);
      } catch (e) {
        console.warn('[loadVocabState] 복원 실패:', e);
      }
    }
    // ★ window에 노출
    window.loadVocabState = loadVocabState;

  /* ===== 어휘학습 채점 & 제출 ===== */
  let vocabGradeBtn, vocabResetBtn, vocabSubmitBtn, vocabResultBox;
  let vocabFullResultHTML = "";

  function initVocabButtons() {
    vocabGradeBtn = document.getElementById('vocab-grade');
    vocabResetBtn = document.getElementById('vocab-reset');
    vocabSubmitBtn = document.getElementById('vocab-submit');
    vocabResultBox = document.getElementById('vocab-result');

    // 3버튼 구조가 아닌 경우 (2버튼 구조 - vocab-save, vocab-reset)는 개별 HTML에서 처리
    if (!vocabGradeBtn || !vocabResetBtn || !vocabSubmitBtn || !vocabResultBox) {
      console.log('[initVocabButtons] 3버튼 구조 없음 - 개별 HTML에서 처리됨');
      return;
    }

  vocabGradeBtn.addEventListener('click', () => {
      const blanks = document.querySelectorAll('#tab-vocab .blank-wrap');
      let basicMsgs = [];
      let fullMsgs = [];
      let correctCnt = 0;
      const total = blanks.length;

      blanks.forEach((bw, idx) => {
        const ans = bw.dataset.answer.trim();
        const input = bw.querySelector('.blank-input').value.trim();
        const mark = bw.querySelector('.blank-mark');

        const choMap = {
          "지도": ["ㅈㄷ"],
          "지리적 특징": ["ㅈㄹㅈㅌㅈ", "지리적특징"],
          "일반도": ["ㅇㅂㄷ"],
          "주제도": ["ㅈㅈㄷ"],
          "기후도": ["ㄱㅎㄷ"],
          "인구 분포도": ["ㅇㄱㅂㅍㄷ","인구분포도"],
          "디지털 지도": ["ㄷㅈㅌㅈㄷ","ㄷㅈㅌ지도","디지털지도"],
          "내비게이션": ["ㄴㅂㄱㅇㅅ"],
          "실시간": ["ㅅㅅㄱ"]
        };

        const normIn = input.replace(/\s+/g,"").toLowerCase();
        const normAns = ans.replace(/\s+/g,"").toLowerCase();

        let ok = false;
        if (normIn === normAns) ok = true;
        else if (choMap[ans] && choMap[ans].includes(normIn)) ok = true;

        bw.classList.remove('correct','wrong');
        if (ok) {
          bw.classList.add('correct');
          if (mark) mark.textContent = "⭕";
          correctCnt++;
          basicMsgs.push(`${idx+1}번: 정답 ✅`);
          fullMsgs.push(`${idx+1}번: 정답 ✅ (${ans})`);
        } else {
          bw.classList.add('wrong');
          if (mark) mark.textContent = "✖";
          basicMsgs.push(`${idx+1}번: 오답 ❌`);
          fullMsgs.push(`${idx+1}번: 오답 ❌ (정답: ${ans})`);
        }
      });

      // 채점 즉시 정답(해설) 표시
      const scorePercent = Math.round((correctCnt / total) * 100);
      vocabResultBox.style.display = "block";
      vocabResultBox.innerHTML =
        `<div style="background:#f5f5f5; padding:12px; border-radius:8px; margin-bottom:10px;">
          <p style="font-size:18px; margin:0;"><strong>📊 채점 결과: ${correctCnt} / ${total} (${scorePercent}점)</strong></p>
        </div>
        <div style="background:#fff; padding:10px; border:1px solid #ddd; border-radius:8px;">
          <p style="font-weight:bold; margin:0 0 8px; color:#333;">📝 정답 해설</p>
          ${fullMsgs.map(m => `<p style="margin:4px 0;">${m.replace('정답 ✅', '<span style="color:#2e7d32">정답 ✅</span>').replace('오답 ❌', '<span style="color:#c62828">오답 ❌</span>').replace(/\(정답: ([^)]+)\)/, '<span style="color:#1565c0; font-weight:bold">(정답: $1)</span>')}</p>`).join("")}
        </div>`;

      vocabFullResultHTML = vocabResultBox.innerHTML;

      // ★ 본문 3번(어휘) 1문항까지 합산한 비율
      const mainQ3Correct = window.reportState.q3ok ? 1 : 0;
      const totalCorrect = correctCnt + mainQ3Correct;
      const totalQuestions = total + 1;
      window.reportState.vocabScoreRatio = totalQuestions > 0 ? (totalCorrect / totalQuestions) : 0;

      const lexicalScore = Math.round((window.reportState.vocabScoreRatio || 0) * 10);

      drawRadarChart({
        literal:     window.reportState.q1ok ? 10 : 6,
        structural:  window.reportState.q2ok ? 10 : 6,
        lexical:     lexicalScore,
        inferential: window.reportState.q4ok ? 10 : 6,
        critical:    window.reportState.q5ok ? 10 : 6
      });

      updateReportPanel({
        q1ok: window.reportState.q1ok,
        q2ok: window.reportState.q2ok,
        q3ok: true,
        q4ok: window.reportState.q4ok,
        q5ok: window.reportState.q5ok,
        messages: [
          "① 핵심 이해력(객관식): " + (window.reportState.q1ok ? "좋아요 ✅" : "보완 필요해요 ❗"),
          "② 구조 파악력(객관식): " + (window.reportState.q2ok ? "좋아요 ✅" : "보완 필요해요 ❗"),
          "③ 어휘 맥락력(어휘학습): " + ((window.reportState.vocabScoreRatio || 0) >= 0.7 ? "어휘 맥락력이 좋아요! ✅" : "어휘 복습이 해요 ❗") + " (정답 " + (totalCorrect) + " / " + (total + 1) + ")",
          "④ 추론·통합력(빈칸): " + (window.reportState.q4ok ? "좋아요 ✅" : "보완 필요해요 ❗"),
          "⑤ 비판·적용력(서술형): " + (window.reportState.q5ok ? "좋아요 ✅" : "보완 필요해요 ❗")
        ]
      });

      vocabGradeBtn.style.display = "inline-block";
      vocabResetBtn.style.display = "inline-block";
      vocabSubmitBtn.style.display = "inline-block";

      // ✅ 어휘학습 상태 저장
      saveVocabState();
    });

    vocabResetBtn.addEventListener('click', () => {
      document.querySelectorAll('#tab-vocab .blank-wrap').forEach(bw => {
        bw.classList.remove('correct','wrong');
        const input = bw.querySelector('.blank-input');
        if (input) {
          input.value = "";
          input.disabled = false;  // 입력창 다시 활성화
        }
        const mark = bw.querySelector('.blank-mark');
        if (mark) mark.textContent = "";
      });
      vocabResultBox.style.display = "none";

      // ✅ 어휘학습 상태 삭제
      const stu = getCurrentStudent();
      if (stu) {
        const stuKey = buildStudentKey(stu);
        const unit = window.CUR_UNIT || 'geo_01';
        const stateKey = `vocab-state:${stuKey}:${unit}`;
        localStorage.removeItem(stateKey);
        console.log('[vocabReset] 저장 삭제:', stateKey);
      }

      const baseCorrect = window.reportState.q3ok ? 1 : 0;
      window.reportState.vocabScoreRatio = baseCorrect / 1;
      const lexicalScore = Math.round(window.reportState.vocabScoreRatio * 10);
      drawRadarChart({
        literal:     window.reportState.q1ok ? 10 : 6,
        structural:  window.reportState.q2ok ? 10 : 6,
        lexical:     lexicalScore,
        inferential: window.reportState.q4ok ? 10 : 6,
        critical:    window.reportState.q5ok ? 10 : 6
      });

      vocabGradeBtn.style.display = "inline-block";
      vocabResetBtn.style.display = "none";
      vocabSubmitBtn.style.display = "none";
    });

    // 어휘 제출
    vocabSubmitBtn.addEventListener('click', async () => {
      if (!ensureStudentInfo()) { showSubmitOverlay('학년과 이름을 입력해주세요'); return; }
      await captureElementToPDF('capture-vocab', '단단국어_어휘학습.pdf', { withStudentInfo: true });
      showSubmitSuccess('어휘학습');
      vocabResultBox.style.display = "block";
      vocabResultBox.innerHTML = vocabFullResultHTML;
    });
  }

    /* ===== 창의활동 저장/복원 함수 ===== */
    function saveCreativeState() {
      const stu = getCurrentStudent();
      if (!stu) return;
      const stuKey = buildStudentKey(stu);
      const unit = window.CUR_UNIT || 'geo_01';
      const stateKey = `creative-state:${stuKey}:${unit}`;

      const textarea = document.getElementById('creative-input');
      if (!textarea) return;

      localStorage.setItem(stateKey, textarea.value);
      console.log('[saveCreativeState] 저장 완료:', stateKey);
    }

    function loadCreativeState() {
      const stu = getCurrentStudent();
      if (!stu) return;
      const stuKey = buildStudentKey(stu);
      const unit = window.CUR_UNIT || 'geo_01';
      const stateKey = `creative-state:${stuKey}:${unit}`;

      const saved = localStorage.getItem(stateKey);
      if (!saved) return;

      const textarea = document.getElementById('creative-input');
      if (textarea) {
        textarea.value = saved;
        console.log('[loadCreativeState] 복원 완료:', stateKey);
      }
    }

    // ★ 서버 데이터로 창의활동 상태 복원
    function restoreCreativeStateFromServer(creativeState) {
      if (!creativeState) {
        console.log('[restoreCreativeStateFromServer] 복원할 데이터 없음');
        return;
      }
      console.log('[restoreCreativeStateFromServer] 복원 시작:', creativeState);

      // 1. 텍스트 복원
      const textarea = document.getElementById('creative-input');
      if (textarea && creativeState.text) {
        textarea.value = creativeState.text;
        console.log('[restoreCreativeStateFromServer] 텍스트 복원 완료');
      }

      // 2. 맞춤법 검사 결과 복원
      if (creativeState.resultHTML) {
        const spellingResult = document.getElementById('spelling-result');
        if (spellingResult) {
          spellingResult.innerHTML = creativeState.resultHTML;
          spellingResult.style.display = 'block';
        }
      }

      // 3. 올바른 맞춤법 결과 복원
      if (creativeState.correctHTML) {
        const spellingCorrect = document.getElementById('spelling-correct');
        if (spellingCorrect) {
          spellingCorrect.innerHTML = creativeState.correctHTML;
          spellingCorrect.style.display = 'block';
        }
      }

      console.log('[restoreCreativeStateFromServer] 복원 완료');
    }

    /* ===== 한글 맞춤법 검사 함수 ===== */
    async function checkSpelling(text) {
      try {
        // 서버의 맞춤법 검사 API 호출
        const response = await fetch('/api/spell-check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: text })
        });

        if (!response.ok) {
          throw new Error('서버 응답 오류');
        }

        const data = await response.json();
        return data;

      } catch (error) {
        console.error('맞춤법 검사 오류:', error);
        // API 실패 시 간단한 폴백: 원본 텍스트 반환
        return { errata_count: 0, origin_html: text, html: text, notag_html: text };
      }
    }

  /* ===== 창의활동 제출 ===== */
  let creativeBtn, creativeCheckBtn, creativeTextarea;

  function initCreativeButtons() {
    creativeBtn = document.getElementById('creative-submit-btn');
    creativeCheckBtn = document.getElementById('creative-check-btn');
    creativeTextarea = document.getElementById('creative-input');

    // 입력할 때마다 자동 저장
    if (creativeTextarea) {
      creativeTextarea.addEventListener('input', () => {
        saveCreativeState();
      });
    }

    // 채점하기 버튼 클릭 시
    if (creativeCheckBtn) {
      creativeCheckBtn.addEventListener('click', async () => {
        const text = creativeTextarea ? creativeTextarea.value.trim() : '';

        if (!text) {
          alert('먼저 글을 작성해주세요.');
          return;
        }

        // 로딩 팝업 표시
        const loadingPopup = document.getElementById('spell-check-loading');
        loadingPopup.style.display = 'flex';
        creativeCheckBtn.disabled = true;

        try {
          const result = await checkSpelling(text);

          // 결과 영역 표시
          const spellingResult = document.getElementById('spelling-result');
          const spellingCorrect = document.getElementById('spelling-correct');
          const spellingErrors = document.getElementById('spelling-errors');
          const spellingCorrected = document.getElementById('spelling-corrected');

          if (result.errata_count > 0) {
            // 오류가 있는 경우
            spellingErrors.innerHTML = `
              <div style="margin-bottom:8px; font-weight:600; color:#c04a3b;">
                맞춤법/띄어쓰기 오류 ${result.errata_count}개 발견
              </div>
              <div style="line-height:1.8; white-space:pre-wrap;">${result.html}</div>
            `;

            spellingCorrected.innerHTML = `
              <div class="correct-block">
                <div style="margin-bottom:6px; font-weight:600; color:#3a8755;">
                  ✓ 올바른 맞춤법
                </div>
                <div style="line-height:1.8; white-space:pre-wrap;">${result.corrected_html || result.notag_html}</div>
              </div>
            `;

            spellingResult.style.display = 'block';
            spellingCorrect.style.display = 'block';
          } else {
            // 오류가 없는 경우
            spellingErrors.innerHTML = `
              <div style="font-weight:600; color:#3a8755;">
                ✓ 맞춤법과 띄어쓰기가 정확합니다!
              </div>
            `;

            spellingResult.style.display = 'block';
            spellingCorrect.style.display = 'none';
          }
        } catch (error) {
          alert('맞춤법 검사 중 오류가 발생했습니다. 다시 시도해주세요.');
          console.error('맞춤법 검사 오류:', error);
        } finally {
          // 로딩 팝업 숨기기
          loadingPopup.style.display = 'none';
          // 버튼 복원
          creativeCheckBtn.disabled = false;
        }
      });
    }

    if (creativeBtn) {
      creativeBtn.addEventListener('click', async () => {
        if (!ensureStudentInfo()) { showSubmitOverlay('학년과 이름을 입력해주세요'); return; }

        const text = creativeTextarea ? creativeTextarea.value : '';

        // localStorage 저장
        saveCreativeState();

        // PDF 다운로드
        await captureElementToPDF('capture-creative', '단단국어_창의활동.pdf', { withStudentInfo: true });

        // ★ 서버 저장
        const saveFn = window.saveUnitProgressToServer;
        if (typeof saveFn === 'function') {
          // 맞춤법 검사 결과도 함께 저장
          const spellingResult = document.getElementById('spelling-result');
          const spellingCorrect = document.getElementById('spelling-correct');

          const dataToSave = {
            creativeState: {
              text: text,
              resultHTML: spellingResult ? spellingResult.innerHTML : '',
              correctHTML: spellingCorrect ? spellingCorrect.innerHTML : '',
              isSubmitted: true
            }
          };
          await saveFn(dataToSave);
          console.log('[creative-submit] 서버 저장 완료!');
        }

        showSubmitSuccess('창의활동');
      });
    }
  }

// ===== 뒤로가기 버튼 (나의 학습분석으로 돌아가기) =====
function initBackToAnalysisButton() {
  // 버튼이 이미 존재하면 제거
  const existingBtn = document.getElementById('backToAnalysisBtn');
  if (existingBtn) {
    existingBtn.remove();
  }

  // document.referrer를 확인해서 /my-learning에서 온 경우에만 버튼 표시
  const isFromAnalysis = document.referrer.includes('/my-learning');

  if (isFromAnalysis) {
    const backBtn = document.createElement('button');
    backBtn.id = 'backToAnalysisBtn';
    backBtn.innerHTML = '←';
    backBtn.title = '나의 학습분석으로 돌아가기';
    backBtn.style.display = 'flex';

    backBtn.addEventListener('click', function() {
      // referrer URL로 이동 (나의 학습분석 모달 재오픈)
      let referrerUrl = document.referrer;

      if (referrerUrl) {
        // 현재 페이지의 단원 코드에서 시리즈 판단
        const currentUnit = window.CUR_UNIT || '';
        let targetSeries = 'up'; // 기본값

        if (currentUnit.startsWith('fit_')) {
          targetSeries = 'fit';
        } else if (currentUnit.startsWith('deep_')) {
          targetSeries = 'deep';
        }

        // referrer URL의 series 파라미터를 현재 시리즈로 변경
        const url = new URL(referrerUrl);
        url.searchParams.set('series', targetSeries);

        console.log('🔙 뒤로가기:', { currentUnit, targetSeries, finalUrl: url.toString() });
        window.location.href = url.toString();
      } else {
        // referrer가 없으면 메뉴 페이지로
        window.location.href = '/menu.html';
      }
    });

    document.body.appendChild(backBtn);
    console.log('✅ 뒤로가기 버튼 추가됨');
  }
}

// 페이지 로드 시 버튼 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBackToAnalysisButton);
} else {
  initBackToAnalysisButton();
}

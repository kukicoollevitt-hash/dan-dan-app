  /* =========================================================
     단원 자동 인식 (강화)
     우선순위: ?unit=geo_XX → 파일명 geo_XX.html → 제목 숫자
  ========================================================= */
  (function () {
    const qs = new URLSearchParams(location.search).get('unit');
    let unit = null;

    if (qs) {
      const m = qs.toLowerCase().match(/geo[_-]?(\d{1,2})/);
      if (m) unit = `geo_${m[1].padStart(2,'0')}`;
    }

    if (!unit) {
      const m2 = location.pathname.toLowerCase().match(/geo[_-]?(\d{1,2})\.html/);
      if (m2) unit = `geo_${m2[1].padStart(2,'0')}`;
    }

    if (!unit && document.title) {
      const m3 = document.title.match(/(\d{1,2})/);
      if (m3) unit = `geo_${m3[1].padStart(2,'0')}`;
    }

    window.CUR_UNIT = unit || 'geo_01';
    console.log('[study page] CUR_UNIT =', window.CUR_UNIT);
  })();

  /* =========================================================
     PAGE_KEY 자동 생성 (단원 번호 기반)  ← 이 블록만 남김
  ========================================================= */
  (function () {
    const cur = (window.CUR_UNIT || 'geo_01');
    const m = cur.match(/geo_(\d{1,2})/);
    const no = m ? m[1].padStart(2,'0') : '01';

    window.PAGE_KEY = `BRAINUP_social_geo_${no}`;
    console.log('[study page] PAGE_KEY =', window.PAGE_KEY);
  })();

    // 🔁 공통 키 만드는 함수
    function buildStudentKey(stu) {
      const cleanPhone = (stu.phone || '').replace(/\D/g, '');
      const cleanName = (stu.name || '').trim();
      const cleanGrade = (stu.grade || '').trim();
      return `${cleanGrade}_${cleanName}_${cleanPhone}`;
    }

    // 🔁 현재 학생 가져오기 (로그인에서 저장해둔 거)
    function getCurrentStudent() {
      const saved = localStorage.getItem('currentStudent');
      if (!saved) return null;
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
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
    const REMEDIAL_BANK = {
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
        if (!reportState.q1ok) needKeys.push('literal');
        if (!reportState.q2ok) needKeys.push('structural');
        if (!reportState.q3ok) needKeys.push('lexical');
        if (!reportState.q4ok) needKeys.push('inferential');
        if (!reportState.q5ok) needKeys.push('critical');
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
        const data = REMEDIAL_BANK[key];
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
        const data = REMEDIAL_BANK[key];
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
    let reportState = { q1ok:false, q2ok:false, q3ok:false, q4ok:false, q5ok:false, vocabScoreRatio:0 };

    /* ===== 탭 전환 ===== */
    // 분석리포트 새로고침 함수
    function refreshReportTab() {
      try {
        const unit = window.CUR_UNIT || 'geo_01';
        const storageKey = `dan-geo-report-state:${unit}`;
        const saved = localStorage.getItem(storageKey);
        console.log(`[refreshReportTab] unit=${unit}, localStorage 데이터:`, saved);

        if (saved) {
          const savedReportState = JSON.parse(saved);
          console.log('[refreshReportTab] 파싱된 데이터:', savedReportState);

          // 리포트 패널 업데이트
          updateReportPanel({
            q1ok: savedReportState.q1ok || false,
            q2ok: savedReportState.q2ok || false,
            q3ok: savedReportState.q3ok || false,
            q4ok: savedReportState.q4ok || false,
            q5ok: savedReportState.q5ok || false
          });

          // 레이더 차트 업데이트
          drawRadarChart({
            literal: savedReportState.literal || 0,
            structural: savedReportState.structural || 0,
            lexical: savedReportState.lexical || 0,
            inferential: savedReportState.inferential || 0,
            critical: savedReportState.critical || 0
          });

          console.log('[refreshReportTab] 분석리포트 업데이트 완료');
        } else {
          console.log('[refreshReportTab] localStorage에 저장된 데이터 없음');
        }
      } catch(e) {
        console.error('Failed to refresh report:', e);
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

        // 분석리포트 탭인 경우 데이터 새로고침
        if (tabName === 'report') {
          console.log('[activateTab] 분석리포트 탭 감지 - refreshReportTab() 호출');
          refreshReportTab();
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

    // 학습 기록이 있으면 저장된 탭 복원, 없으면 무조건 본문학습(reading)으로 시작
    const savedTab = hasLearningRecord
      ? (localStorage.getItem(`current-geo-tab:${unit}`) || 'reading')
      : 'reading';

    console.log(`[learning-common] 탭 선택: savedTab=${savedTab}, hasRecord=${hasLearningRecord}`);
    activateTab(savedTab);

    // 어휘학습 버튼 초기화
    initVocabButtons();

    // 창의활동 버튼 초기화
    initCreativeButtons();
});

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
    let timer, seconds = 0, isRunning = false;
    const RADIUS = 45;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
    const TOTAL_SECONDS = 600; // 10분
    function formatTime(sec){ const m=String(Math.floor(sec/60)).padStart(2,'0'); const s=String(sec%60).padStart(2,'0'); return `${m}:${s}`; }
    function updateDisplay(){ const t=document.getElementById("timer-text"); if (t) t.textContent = formatTime(seconds); updateRing(); }
    function updateRing(){ const c=document.querySelector(".timer-ring .progress"); if(!c) return; const r=(seconds%TOTAL_SECONDS)/TOTAL_SECONDS; c.style.strokeDashoffset = CIRCUMFERENCE - r*CIRCUMFERENCE; }
    function startTimer(){ if(!isRunning){ isRunning=true; const b=document.getElementById("timer-display"); b.classList.remove("paused","reset"); b.classList.add("active"); timer=setInterval(()=>{ seconds++; updateDisplay(); },1000);} }
    function pauseTimer(){ clearInterval(timer); isRunning=false; const b=document.getElementById("timer-display"); b.classList.remove("active"); b.classList.add("paused"); }
    function resetTimer(){ clearInterval(timer); isRunning=false; const m=document.getElementById("minute-input"), s=document.getElementById("second-input"); if(m) m.value=Math.floor(seconds/60); if(s) s.value=seconds%60; seconds=0; updateDisplay(); const b=document.getElementById("timer-display"); b.classList.remove("active","paused"); b.classList.add("reset"); }

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
    function showSubmitSuccess(kind) {
      const { grade, name } = getStudentInfo();
      const who = (grade || name) ? `${grade ? grade + ' ' : ''}${name ? name + ' ' : ''}`.trim() + ' ' : '';
      showSubmitOverlay(`${who}${kind} 제출되었습니다 ✅`);
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
    function drawRadarChart(scores) {
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
      const answerKey = {
        q1: "2",
        q2: "3",
        q3_1: ["경계"],
        q3_2: ["일반도"],
        q4_1: ["디지털", "디지털지도", "디지털 지도"],
        q4_2: ["실시간"]
      };
      const explain = {
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

      // 3번
      const q3_1 = document.getElementById("q3-1").value.trim();
      const q3_2 = document.getElementById("q3-2").value.trim();
      const q3Num = quizBlocks[2].querySelector('.quiz-num');
      const q3Mark = q3Num.querySelector('.mark');
      const ok3_1 = answerKey.q3_1.some(a => a.replace(/\s+/g,"").toLowerCase() === q3_1.replace(/\s+/g,"").toLowerCase());
      const ok3_2 = answerKey.q3_2.some(a => a.replace(/\s+/g,"").toLowerCase() === q3_2.replace(/\s+/g,"").toLowerCase());
      const q3ok = (ok3_1 && ok3_2);
      if (q3ok) { score++; q3Num.classList.add('correct'); q3Mark.textContent="⭕"; shortMsgs.push("③ 정답 ✅"); fullMsgs.push("③ 정답 ✅ " + explain.q3); }
      else { q3Num.classList.add('wrong'); q3Mark.textContent="✖"; shortMsgs.push("③ 오답 ❌"); fullMsgs.push("③ 오답 ❌ " + explain.q3); }

      // 4번
      const q4_1 = document.getElementById("q4-1").value.trim();
      const q4_2 = document.getElementById("q4-2").value.trim();
      const q4Num = quizBlocks[3].querySelector('.quiz-num');
      const q4Mark = q4Num.querySelector('.mark');
      const ok4_1 = answerKey.q4_1.some(a => a.replace(/\s+/g,"").toLowerCase() === q4_1.replace(/\s+/g,"").toLowerCase());
      const ok4_2 = answerKey.q4_2.some(a => a.replace(/\s+/g,"").toLowerCase() === q4_2.replace(/\s+/g,"").toLowerCase());
      const q4ok = (ok4_1 && ok4_2);
      if (q4ok) { score++; q4Num.classList.add('correct'); q4Mark.textContent="⭕"; shortMsgs.push("④ 정답 ✅"); fullMsgs.push("④ 정답 ✅ " + explain.q4); }
      else { q4Num.classList.add('wrong'); q4Mark.textContent="✖"; shortMsgs.push("④ 오답 ❌"); fullMsgs.push("④ 오답 ❌ " + explain.q4); }

      // 5번 서술형
      const essay = document.getElementById("q5").value.trim().toLowerCase();
      const q5Num = quizBlocks[4].querySelector('.quiz-num');
      const q5Mark = q5Num.querySelector('.mark');
      const essayKeywords = ["지도의 정보를 통해","생활","자연환경","구조","공간","세상","다양성","이해","지역","특징","주제도","일반도"];
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
      reportState.q1ok = q1ok;
      reportState.q2ok = q2ok;
      reportState.q3ok = q3ok;
      reportState.q4ok = q4ok;
      reportState.q5ok = q5ok;

      // ★ 분석리포트 텍스트/박스 동기화
      updateReportPanel({
        q1ok: reportState.q1ok,
        q2ok: reportState.q2ok,
        q3ok: reportState.q3ok,
        q4ok: reportState.q4ok,
        q5ok: reportState.q5ok,
        messages: (function(){
          const lexicalRatio = (typeof reportState.vocabScoreRatio === "number") ? reportState.vocabScoreRatio : 0;
          const lexicalOk = lexicalRatio >= 0.7;
          return [
            "① 핵심 이해력(객관식): " + (reportState.q1ok ? "핵심 이해력이 좋아요! ✅" : "보완 필요해요 ❗"),
            "② 구조 파악력(객관식): " + (reportState.q2ok ? "구조 파악력이 좋아요! ✅" : "보완 필요해요 ❗"),
            "③ 어휘 맥락력(빈칸): " + (lexicalOk ? "어휘 맥락력이 좋아요! ✅" : "어휘 복습이 필요해요 ❗"),
            "④ 추론·통합력(빈칸): " + (reportState.q4ok ? "추론·통합력이 좋아요! ✅" : "보완 필요해요 ❗"),
            "⑤ 비판·적용력(서술형): " + (reportState.q5ok ? "비판·적용력이 좋아요! ✅" : "보완 필요해요 ❗")
          ];
        })()
      });

      // 레이더 차트
      drawRadarChart({
        literal:     reportState.q1ok ? 10 : 6,
        structural:  reportState.q2ok ? 10 : 6,
        lexical:     reportState.q3ok ? 10 : 6,
        inferential: reportState.q4ok ? 10 : 6,
        critical:    reportState.q5ok ? 10 : 6
      });

      // 어휘 피드백 반영
      const lexicalRatio = (typeof reportState.vocabScoreRatio === "number") ? reportState.vocabScoreRatio : 0;
      const lexicalFromRatio = Math.round(lexicalRatio * 10);
      renderFeedback({
        literal:    reportState.q1ok ? 10 : 6,
        structural: reportState.q2ok ? 10 : 6,
        lexical:    lexicalFromRatio,
        inferential:reportState.q4ok ? 10 : 6,
        critical:   reportState.q5ok ? 10 : 6
      });

      // ★ localStorage에 분석리포트 상태 저장 (분석리포트 탭 즉시 반영용)
      const unit = window.CUR_UNIT || 'geo_01';
      const storageKey = `dan-geo-report-state:${unit}`;
      console.log(`[gradeQuiz] unit=${unit}로 localStorage에 저장`);
      localStorage.setItem(storageKey, JSON.stringify({
        q1ok: reportState.q1ok,
        q2ok: reportState.q2ok,
        q3ok: reportState.q3ok,
        q4ok: reportState.q4ok,
        q5ok: reportState.q5ok,
        vocabScoreRatio: reportState.vocabScoreRatio,
        literal: reportState.q1ok ? 10 : 6,
        structural: reportState.q2ok ? 10 : 6,
        lexical: lexicalFromRatio,
        inferential: reportState.q4ok ? 10 : 6,
        critical: reportState.q5ok ? 10 : 6
      }));

      // ★ 분석리포트 탭 즉시 업데이트
      refreshReportTab();
    }

    function resetQuiz() {
      document.querySelectorAll('#tab-reading input[type="radio"]').forEach(r => r.checked = false);
      document.getElementById("q3-1").value = "";
      document.getElementById("q3-2").value = "";
      document.getElementById("q4-1").value = "";
      document.getElementById("q4-2").value = "";
      document.getElementById("q5").value = "";

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

      const resultBox = document.getElementById("grade-result");
      resultBox.style.display = "none";
      resultBox.innerHTML = "";
      fullResultHTML = "";

      // solutions-box 제거 (제출하기에서 생성된 해설 박스)
      const solutionsBox = document.getElementById("solutions-box");
      if (solutionsBox) {
        solutionsBox.remove();
      }

      document.getElementById("grade-btn").style.display = "inline-block";
      document.getElementById("reset-btn").style.display = "none";
      document.getElementById("submit-btn").style.display = "none";

      reportState = { q1ok:false, q2ok:false, q3ok:false, q4ok:false, q5ok:false, vocabScoreRatio:0 };

      updateReportPanel({ q1ok:false, q2ok:false, q3ok:false, q4ok:false, q5ok:false, messages: ["채점 결과가 초기화되었습니다. 다시 풀고 채점해 주세요."] });

      drawRadarChart({ literal:0, structural:0, lexical:0, inferential:0, critical:0 });
    }

    // 본문 제출
    async function submitQuiz() {
      if (!ensureStudentInfo()) { showSubmitOverlay('학년과 이름을 입력해주세요'); return; }

      // ★ 제출 전에 localStorage에 리포트 상태 저장
      const lexicalRatio = (typeof reportState.vocabScoreRatio === "number") ? reportState.vocabScoreRatio : 0;
      const lexicalFromRatio = Math.round(lexicalRatio * 10);

      const unit = window.CUR_UNIT || 'geo_01';
      const storageKey = `dan-geo-report-state:${unit}`;
      console.log(`[submitQuiz] unit=${unit}로 localStorage에 저장`);
      localStorage.setItem(storageKey, JSON.stringify({
        q1ok: reportState.q1ok,
        q2ok: reportState.q2ok,
        q3ok: reportState.q3ok,
        q4ok: reportState.q4ok,
        q5ok: reportState.q5ok,
        vocabScoreRatio: reportState.vocabScoreRatio,
        literal: reportState.q1ok ? 10 : 6,
        structural: reportState.q2ok ? 10 : 6,
        lexical: lexicalFromRatio,
        inferential: reportState.q4ok ? 10 : 6,
        critical: reportState.q5ok ? 10 : 6
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

      localStorage.setItem(stateKey, JSON.stringify({
        vocabData: vocabData,
        resultHTML: vocabResultBox.innerHTML,
        isGraded: vocabGradeBtn.style.display === "none"
      }));
      console.log('[saveVocabState] 저장 완료:', stateKey);
    }

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
          vocabResultBox.innerHTML = state.resultHTML;
          vocabResultBox.style.display = "block";
          vocabGradeBtn.style.display = "inline-block";
          vocabResetBtn.style.display = "inline-block";
          vocabSubmitBtn.style.display = "inline-block";
        }

        console.log('[loadVocabState] 복원 완료:', stateKey);
      } catch (e) {
        console.warn('[loadVocabState] 복원 실패:', e);
      }
    }

  /* ===== 어휘학습 채점 & 제출 ===== */
  let vocabGradeBtn, vocabResetBtn, vocabSubmitBtn, vocabResultBox;
  let vocabFullResultHTML = "";

  function initVocabButtons() {
    vocabGradeBtn = document.getElementById('vocab-grade');
    vocabResetBtn = document.getElementById('vocab-reset');
    vocabSubmitBtn = document.getElementById('vocab-submit');
    vocabResultBox = document.getElementById('vocab-result');

    if (!vocabGradeBtn || !vocabResetBtn || !vocabSubmitBtn || !vocabResultBox) {
      console.log('[initVocabButtons] 어휘학습 버튼을 찾을 수 없습니다');
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

      vocabResultBox.style.display = "block";
      vocabResultBox.innerHTML =
        `<p><strong>맞은 개수: ${correctCnt} / ${total}</strong></p>` +
        basicMsgs.map(m => `<p>${m}</p>`).join("");

      vocabFullResultHTML =
        `<p><strong>맞은 개수: ${correctCnt} / ${total}</strong></p>` +
        fullMsgs.map(m => `<p>${m}</p>`).join("");

      // ★ 본문 3번(어휘) 1문항까지 합산한 비율
      const mainQ3Correct = reportState.q3ok ? 1 : 0;
      const totalCorrect = correctCnt + mainQ3Correct;
      const totalQuestions = total + 1;
      reportState.vocabScoreRatio = totalQuestions > 0 ? (totalCorrect / totalQuestions) : 0;

      const lexicalScore = Math.round((reportState.vocabScoreRatio || 0) * 10);

      drawRadarChart({
        literal:     reportState.q1ok ? 10 : 6,
        structural:  reportState.q2ok ? 10 : 6,
        lexical:     lexicalScore,
        inferential: reportState.q4ok ? 10 : 6,
        critical:    reportState.q5ok ? 10 : 6
      });

      updateReportPanel({
        q1ok: reportState.q1ok,
        q2ok: reportState.q2ok,
        q3ok: true,
        q4ok: reportState.q4ok,
        q5ok: reportState.q5ok,
        messages: [
          "① 핵심 이해력(객관식): " + (reportState.q1ok ? "좋아요 ✅" : "보완 필요해요 ❗"),
          "② 구조 파악력(객관식): " + (reportState.q2ok ? "좋아요 ✅" : "보완 필요해요 ❗"),
          "③ 어휘 맥락력(어휘학습): " + ((reportState.vocabScoreRatio || 0) >= 0.7 ? "어휘 맥락력이 좋아요! ✅" : "어휘 복습이 해요 ❗") + " (정답 " + (totalCorrect) + " / " + (total + 1) + ")",
          "④ 추론·통합력(빈칸): " + (reportState.q4ok ? "좋아요 ✅" : "보완 필요해요 ❗"),
          "⑤ 비판·적용력(서술형): " + (reportState.q5ok ? "좋아요 ✅" : "보완 필요해요 ❗")
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
        bw.querySelector('.blank-input').value = "";
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

      const baseCorrect = reportState.q3ok ? 1 : 0;
      reportState.vocabScoreRatio = baseCorrect / 1;
      const lexicalScore = Math.round(reportState.vocabScoreRatio * 10);
      drawRadarChart({
        literal:     reportState.q1ok ? 10 : 6,
        structural:  reportState.q2ok ? 10 : 6,
        lexical:     lexicalScore,
        inferential: reportState.q4ok ? 10 : 6,
        critical:    reportState.q5ok ? 10 : 6
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

        // 저장
        saveCreativeState();

        await captureElementToPDF('capture-creative', '단단국어_창의활동.pdf', { withStudentInfo: true });
        showSubmitSuccess('창의활동');
      });
    }
  }

    // 시작: 빈 레이더
    drawRadarChart({ literal:0, structural:0, lexical:0, inferential:0, critical:0 });

    // ✅ 어휘학습 상태 복원
    loadVocabState();

    // ✅ 창의활동 상태 복원
    loadCreativeState();

    /* ===== ✅ 최종본 submitReport()만 남김 (중복/전역 병합 블록 삭제) ===== */
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
      const studentKey = buildStudentKey(stu); // 예: "4학년_사사사_01044444444"

      // 3) 현재 단원 번호와 PAGE_KEY
      const cur = (window.CUR_UNIT || 'geo_01');                  // 예: 'geo_02'
      const m = cur.match(/geo_(\d{1,2})/);
      const no = m ? m[1].padStart(2, '0') : '01';
      const pk = window.PAGE_KEY || `BRAINUP_social_geo_${no}`;   // 예: 'BRAINUP_social_geo_02'

      // 4) 과거/변형 키까지 한 번에 흡수
      const legacyPath = `./BRAINUP/social/geo_${no}.html`;
      const pageIds = [
        pk,
        legacyPath,
        `BRAINUP_geo_${no}`,
        `BRAINUP_social_geo${no}`
      ];
      console.log('[study page] PAGE_IDs =', pageIds);

      // 5) 현재 단원에 해당하는 키에만 저장
      const currentUnitKey = `dan-progress:${studentKey}:${cur}`;
      let saved;
      try {
        saved = JSON.parse(localStorage.getItem(currentUnitKey) || '[]');
        if (!Array.isArray(saved)) saved = [];
      } catch(e) {
        saved = [];
      }

      // pageIds를 saved에 추가 (중복 제거)
      pageIds.forEach(id => {
        if (!saved.includes(id)) saved.push(id);
      });

      localStorage.setItem(currentUnitKey, JSON.stringify(saved));
      console.log('[study page] Saved completion to', currentUnitKey, '=>', saved);

      // 6) 부모 창에 완료 메시지 전송 (코인 지급 및 UI 업데이트)
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: 'UNIT_COMPLETED'
        }, window.location.origin);
        console.log('[study page] Sent UNIT_COMPLETED to parent');
      }

      // 7) AI 추천 과제 복습 완료 처리
      try {
        if (typeof window.markAITaskAsCompleted === 'function') {
          const unitId = cur; // 예: 'geo_03'
          await window.markAITaskAsCompleted(stu.grade, stu.name, unitId);
        }
      } catch (error) {
        console.error('[AI 과제 복습 완료 처리 오류]', error);
      }

      // 8) 완료 표시
      showSubmitSuccess('분석리포트');
    }

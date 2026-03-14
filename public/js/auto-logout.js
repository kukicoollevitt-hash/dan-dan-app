/**
 * 자동 로그아웃 기능
 * - 조건: 로그인 후 학습완료가 1개 이상 있는 경우에만 작동
 * - 2시간(120분) 비활동 시 자동 로그아웃 + 리포트 발송
 * - 활동 감지: 클릭, 키보드, 스크롤, 마우스 이동, 터치
 */
(function() {
  'use strict';

  // 설정 (운영: 120분)
  const AUTO_LOGOUT_MINUTES = 120; // 2시간
  const AUTO_LOGOUT_MS = AUTO_LOGOUT_MINUTES * 60 * 1000;
  const WARNING_BEFORE_MS = 5 * 60 * 1000; // 5분 전 경고

  let logoutTimer = null;
  let warningTimer = null;
  let isLoggedIn = false;

  // 로그인 상태 확인
  function checkLoginStatus() {
    let grade = localStorage.getItem('loginGrade') || sessionStorage.getItem('loginGrade');
    let name = localStorage.getItem('loginName') || sessionStorage.getItem('loginName');

    // Fallback: sessionStorage.user 객체에서 확인 (학원 로그인 방식)
    if (!grade || !name) {
      const userStr = sessionStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          grade = grade || user.grade;
          name = name || user.name;
        } catch (e) {
          console.error('[자동 로그아웃] user 파싱 실패:', e);
        }
      }
    }

    isLoggedIn = !!(grade && name);
    return isLoggedIn;
  }

  // 세션 중 학습완료 여부 확인
  function hasCompletedLearning() {
    const completed = sessionStorage.getItem('hasCompletedLearning');
    return completed === 'true';
  }

  // 학습완료 플래그 설정 (외부에서 호출 가능)
  window.setLearningCompleted = function() {
    sessionStorage.setItem('hasCompletedLearning', 'true');
    console.log('[자동 로그아웃] 학습완료 감지 - 타이머 활성화');
    // 학습완료 시 타이머 시작/리셋
    resetTimer();
  };

  // 자동 로그아웃 실행
  async function performAutoLogout() {
    if (!checkLoginStatus()) return;
    if (!hasCompletedLearning()) {
      console.log('[자동 로그아웃] 학습완료 없음 - 자동 로그아웃 건너뜀');
      return;
    }

    let grade = localStorage.getItem('loginGrade') || sessionStorage.getItem('loginGrade');
    let name = localStorage.getItem('loginName') || sessionStorage.getItem('loginName');

    // Fallback: sessionStorage.user 객체에서 확인
    if (!grade || !name) {
      const userStr = sessionStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          grade = grade || user.grade;
          name = name || user.name;
        } catch (e) {}
      }
    }

    console.log('[자동 로그아웃] 2시간 비활동 + 학습완료 있음 → 자동 로그아웃 실행');

    try {
      // 서버에 자동 로그아웃 요청 (SMS + 리포트 발송 포함)
      await fetch('/api/auto-logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade,
          name,
          reason: 'inactivity',
          hasCompletedLearning: true  // 학습완료 있음 표시
        })
      });
    } catch (err) {
      console.error('[자동 로그아웃] API 호출 실패:', err);
    }

    // 로컬 스토리지 정리
    localStorage.removeItem('loginGrade');
    localStorage.removeItem('loginName');
    localStorage.removeItem('loginPhone');
    sessionStorage.removeItem('loginGrade');
    sessionStorage.removeItem('loginName');
    sessionStorage.removeItem('loginPhone');
    sessionStorage.removeItem('hasCompletedLearning');

    // 로그인 페이지로 이동
    alert('2시간 동안 활동이 없어 자동 로그아웃되었습니다.\n학습 리포트가 발송되었습니다.');
    window.location.href = '/login.html';
  }

  // 경고 표시
  function showWarning() {
    if (!checkLoginStatus()) return;
    if (!hasCompletedLearning()) return; // 학습완료 없으면 경고도 안함

    // 이미 경고창이 있으면 제거
    const existingWarning = document.getElementById('auto-logout-warning');
    if (existingWarning) existingWarning.remove();

    const warningDiv = document.createElement('div');
    warningDiv.id = 'auto-logout-warning';
    warningDiv.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #ff9800;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 99999;
        font-size: 14px;
        text-align: center;
      ">
        <strong>5분 후 자동 로그아웃됩니다</strong><br>
        <small>활동이 감지되면 자동으로 연장됩니다</small>
      </div>
    `;
    document.body.appendChild(warningDiv);

    // 30초 후 경고창 자동 제거
    setTimeout(() => {
      const warning = document.getElementById('auto-logout-warning');
      if (warning) warning.remove();
    }, 30000);
  }

  // 타이머 리셋 (활동 감지 시)
  function resetTimer() {
    if (!checkLoginStatus()) return;

    // 학습완료가 없으면 타이머 설정 안함
    if (!hasCompletedLearning()) {
      console.log('[자동 로그아웃] 학습완료 없음 - 타이머 비활성화 상태');
      return;
    }

    // 경고창 제거
    const warning = document.getElementById('auto-logout-warning');
    if (warning) warning.remove();

    // 기존 타이머 클리어
    if (logoutTimer) clearTimeout(logoutTimer);
    if (warningTimer) clearTimeout(warningTimer);

    // 경고 타이머 설정 (로그아웃 5분 전)
    warningTimer = setTimeout(showWarning, AUTO_LOGOUT_MS - WARNING_BEFORE_MS);

    // 로그아웃 타이머 설정
    logoutTimer = setTimeout(performAutoLogout, AUTO_LOGOUT_MS);

    console.log('[자동 로그아웃] 타이머 리셋 - ' + AUTO_LOGOUT_MINUTES + '분 후 자동 로그아웃');
  }

  // 활동 감지 이벤트 등록
  function setupActivityListeners() {
    const events = ['click', 'keydown', 'scroll', 'mousemove', 'touchstart', 'touchmove'];

    // 디바운스로 과도한 호출 방지
    let debounceTimer = null;
    const debouncedReset = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(resetTimer, 1000); // 1초 디바운스
    };

    events.forEach(event => {
      document.addEventListener(event, debouncedReset, { passive: true });
    });
  }

  // 초기화
  function init() {
    if (!checkLoginStatus()) {
      console.log('[자동 로그아웃] 로그인 상태 아님 - 비활성화');
      return;
    }

    console.log('[자동 로그아웃] 초기화 - 학습완료 시 타이머 활성화됨');
    setupActivityListeners();

    // 이미 학습완료가 있으면 타이머 시작
    if (hasCompletedLearning()) {
      console.log('[자동 로그아웃] 기존 학습완료 있음 - 타이머 시작');
      resetTimer();
    }
  }

  // DOM 로드 후 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

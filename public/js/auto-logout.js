/**
 * 자동 로그아웃 기능
 * - 2시간(120분) 비활동 시 자동 로그아웃
 * - 활동 감지: 클릭, 키보드, 스크롤, 마우스 이동, 터치
 */
(function() {
  'use strict';

  // 설정
  const AUTO_LOGOUT_MINUTES = 120; // 2시간
  const AUTO_LOGOUT_MS = AUTO_LOGOUT_MINUTES * 60 * 1000;
  const WARNING_BEFORE_MS = 5 * 60 * 1000; // 5분 전 경고

  let logoutTimer = null;
  let warningTimer = null;
  let isLoggedIn = false;

  // 로그인 상태 확인
  function checkLoginStatus() {
    const grade = localStorage.getItem('loginGrade') || sessionStorage.getItem('loginGrade');
    const name = localStorage.getItem('loginName') || sessionStorage.getItem('loginName');
    isLoggedIn = !!(grade && name);
    return isLoggedIn;
  }

  // 자동 로그아웃 실행
  async function performAutoLogout() {
    if (!checkLoginStatus()) return;

    const grade = localStorage.getItem('loginGrade') || sessionStorage.getItem('loginGrade');
    const name = localStorage.getItem('loginName') || sessionStorage.getItem('loginName');

    console.log('[자동 로그아웃] 2시간 비활동으로 자동 로그아웃 실행');

    try {
      // 서버에 자동 로그아웃 요청 (SMS 발송 포함)
      await fetch('/api/auto-logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade, name, reason: 'inactivity' })
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

    // 로그인 페이지로 이동
    alert('2시간 동안 활동이 없어 자동 로그아웃되었습니다.');
    window.location.href = '/login.html';
  }

  // 경고 표시
  function showWarning() {
    if (!checkLoginStatus()) return;

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

    console.log('[자동 로그아웃] 활성화 - ' + AUTO_LOGOUT_MINUTES + '분 후 자동 로그아웃');
    setupActivityListeners();
    resetTimer();
  }

  // DOM 로드 후 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

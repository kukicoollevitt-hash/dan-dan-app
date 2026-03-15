/**
 * 자동 로그아웃 기능 (학습완료 기반)
 * - 조건: 학습완료(제출)가 1개 이상 있는 경우에만 작동
 * - 마지막 학습완료 후 1시간 경과 시 자동 로그아웃 + 리포트 발송
 * - 55분 경과 시 경고 팝업 + 연장하기 버튼
 * - 비활동 감지(mousemove 등) 사용 안 함
 */
(function() {
  'use strict';

  // 설정
  const AUTO_LOGOUT_MINUTES = 60; // 1시간
  const AUTO_LOGOUT_MS = AUTO_LOGOUT_MINUTES * 60 * 1000;
  const WARNING_BEFORE_MS = 5 * 60 * 1000; // 5분 전 경고
  const STORAGE_KEY = 'lastLearningCompletedAt';

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

  // 마지막 학습완료 시간 가져오기
  function getLastCompletedTime() {
    const timestamp = localStorage.getItem(STORAGE_KEY);
    return timestamp ? parseInt(timestamp, 10) : null;
  }

  // 학습완료 시간 저장 (외부에서 호출)
  window.setLearningCompleted = function() {
    const now = Date.now();
    localStorage.setItem(STORAGE_KEY, now.toString());
    sessionStorage.setItem('hasCompletedLearning', 'true');
    console.log('[자동 로그아웃] 학습완료 - 타임스탬프 저장:', new Date(now).toLocaleTimeString());
    startTimer();
  };

  // 타이머 연장 (연장하기 버튼용)
  window.extendAutoLogoutTimer = function() {
    const now = Date.now();
    localStorage.setItem(STORAGE_KEY, now.toString());
    console.log('[자동 로그아웃] 타이머 연장 - 1시간 추가');

    // 경고창 제거
    const warning = document.getElementById('auto-logout-warning');
    if (warning) warning.remove();

    startTimer();
  };

  // 자동 로그아웃 실행
  async function performAutoLogout() {
    if (!checkLoginStatus()) return;

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

    console.log('[자동 로그아웃] 마지막 학습완료 후 1시간 경과 → 자동 로그아웃 실행');

    try {
      // 서버에 자동 로그아웃 요청 (SMS + 리포트 발송 포함)
      await fetch('/api/auto-logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade,
          name,
          reason: 'learning_timeout',
          hasCompletedLearning: true
        })
      });
    } catch (err) {
      console.error('[자동 로그아웃] API 호출 실패:', err);
    }

    // 로컬 스토리지 정리
    localStorage.removeItem('loginGrade');
    localStorage.removeItem('loginName');
    localStorage.removeItem('loginPhone');
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem('loginGrade');
    sessionStorage.removeItem('loginName');
    sessionStorage.removeItem('loginPhone');
    sessionStorage.removeItem('hasCompletedLearning');

    // 로그인 페이지로 이동
    alert('마지막 학습 완료 후 1시간이 경과하여 자동 로그아웃되었습니다.\n학습 리포트가 발송되었습니다.');
    window.location.href = '/academy.html';
  }

  // 경고 팝업 표시 (연장하기 버튼 포함)
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
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px 40px;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        z-index: 99999;
        text-align: center;
        min-width: 320px;
      ">
        <div style="font-size: 48px; margin-bottom: 16px;">⏰</div>
        <div style="font-size: 18px; font-weight: bold; color: #d35a1a; margin-bottom: 12px;">
          5분 후 자동 로그아웃됩니다
        </div>
        <div style="font-size: 14px; color: #666; margin-bottom: 24px;">
          계속 학습하시려면 연장하기를 눌러주세요
        </div>
        <button onclick="window.extendAutoLogoutTimer()" style="
          background: linear-gradient(135deg, #d35a1a, #e8732a);
          color: white;
          border: none;
          padding: 14px 36px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(211, 90, 26, 0.3);
        ">
          연장하기 (1시간)
        </button>
      </div>
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 99998;
      " onclick="window.extendAutoLogoutTimer()"></div>
    `;
    document.body.appendChild(warningDiv);
  }

  // 타이머 시작
  function startTimer() {
    // 기존 타이머 클리어
    if (logoutTimer) clearTimeout(logoutTimer);
    if (warningTimer) clearTimeout(warningTimer);

    const lastCompleted = getLastCompletedTime();
    if (!lastCompleted) {
      console.log('[자동 로그아웃] 학습완료 없음 - 타이머 비활성화');
      return;
    }

    const elapsed = Date.now() - lastCompleted;
    const remaining = AUTO_LOGOUT_MS - elapsed;

    if (remaining <= 0) {
      // 이미 1시간 경과
      performAutoLogout();
      return;
    }

    const warningRemaining = remaining - WARNING_BEFORE_MS;

    // 경고 타이머 설정 (5분 전)
    if (warningRemaining > 0) {
      warningTimer = setTimeout(showWarning, warningRemaining);
      console.log('[자동 로그아웃] 경고 예정:', Math.round(warningRemaining / 60000), '분 후');
    } else if (remaining > 0) {
      // 이미 5분 이내
      showWarning();
    }

    // 로그아웃 타이머 설정
    logoutTimer = setTimeout(performAutoLogout, remaining);
    console.log('[자동 로그아웃] 자동 로그아웃 예정:', Math.round(remaining / 60000), '분 후');
  }

  // 페이지 로드 시 & 탭 포커스 시 타이머 체크
  function checkAndStartTimer() {
    if (!checkLoginStatus()) return;

    const lastCompleted = getLastCompletedTime();
    if (lastCompleted) {
      startTimer();
    }
  }

  // 다른 탭에서 학습완료 시 동기화 (localStorage 이벤트)
  function handleStorageChange(e) {
    if (e.key === STORAGE_KEY && e.newValue) {
      console.log('[자동 로그아웃] 다른 탭에서 학습완료 감지');
      startTimer();
    }
  }

  // 초기화
  function init() {
    if (!checkLoginStatus()) {
      console.log('[자동 로그아웃] 로그인 상태 아님 - 비활성화');
      return;
    }

    console.log('[자동 로그아웃] 초기화 - 학습완료 기반 타이머 (1시간)');

    // localStorage 변경 감지 (다른 탭 동기화)
    window.addEventListener('storage', handleStorageChange);

    // 탭 포커스 시 타이머 재확인
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        checkAndStartTimer();
      }
    });

    // 기존 학습완료가 있으면 타이머 시작
    checkAndStartTimer();
  }

  // DOM 로드 후 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

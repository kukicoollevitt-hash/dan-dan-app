/**
 * 자동 로그아웃 기능 (학습완료 기반)
 * - 조건: 학습완료(제출)가 1개 이상 있는 경우에만 작동
 * - 마지막 학습완료 후 1시간 경과 시 자동 로그아웃 + 리포트 발송
 * - 55분 경과 시 경고 팝업 + 연장하기 버튼
 * - 비활동 감지(mousemove 등) 사용 안 함
 */
(function() {
  'use strict';

  // ============================================================
  // 🔒 단일 세션(1계정 = 1기기) 클라이언트 가드
  //   - 서버가 다른 기기 로그인 감지 시 401 { kicked:true } 반환
  //   - 모든 fetch 응답을 감시 + 30초 주기 /api/session 확인 → 즉시 로그아웃
  //   - menu.html 등에서 먼저 설치했으면(window.__ssGuardInstalled) 중복 설치 생략
  // ============================================================
  (function singleSessionGuard() {
    if (window.__ssGuardInstalled) return;
    window.__ssGuardInstalled = true;

    window.handleSessionKicked = function () {
      if (window.__ssKicked) return;
      window.__ssKicked = true;
      try { localStorage.removeItem('currentStudent'); sessionStorage.removeItem('user'); } catch (e) {}
      showKickedModal();
    };

    // 예쁜 로그아웃 안내 모달 (자체 스타일 · 어느 페이지에서든 동작)
    function showKickedModal() {
      var goLogin = function () { location.href = '/'; };
      var body = document.body;
      if (!body) { goLogin(); return; }

      var st = document.createElement('style');
      st.textContent =
        '@keyframes ssFade{from{opacity:0}to{opacity:1}}' +
        '@keyframes ssPop{0%{transform:scale(.82);opacity:0}60%{transform:scale(1.03)}100%{transform:scale(1);opacity:1}}' +
        '@keyframes ssFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}';
      document.head.appendChild(st);

      var ov = document.createElement('div');
      ov.setAttribute('style',
        'position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;' +
        'padding:20px;background:rgba(18,22,38,.55);-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px);' +
        'animation:ssFade .25s ease;font-family:"Noto Sans KR",-apple-system,BlinkMacSystemFont,sans-serif;');

      var card = document.createElement('div');
      card.setAttribute('style',
        'background:#fff;border-radius:26px;max-width:350px;width:100%;padding:34px 26px 24px;text-align:center;' +
        'box-shadow:0 26px 80px rgba(0,0,0,.4);animation:ssPop .4s cubic-bezier(.2,1.3,.4,1);');
      card.innerHTML =
        '<div style="font-size:64px;line-height:1;margin-bottom:8px;animation:ssFloat 2.4s ease-in-out infinite;">📱</div>' +
        '<div style="font-size:22px;font-weight:800;color:#e0533a;margin-bottom:12px;letter-spacing:-.3px;">다른 기기에서 로그인되었어요</div>' +
        '<div style="font-size:15px;font-weight:600;color:#5a6472;line-height:1.7;margin-bottom:24px;">' +
        '한 계정은 <b style="color:#2b2f38;">한 기기에서만</b> 사용할 수 있어요.<br>이 기기는 안전하게 로그아웃됩니다.</div>' +
        '<button id="__ssKickBtn" style="width:100%;border:none;cursor:pointer;font-family:inherit;font-weight:800;' +
        'font-size:16px;color:#fff;background:linear-gradient(135deg,#ff8a3d,#ff5d5d);padding:16px;border-radius:16px;' +
        'box-shadow:0 10px 22px rgba(255,90,60,.38);transition:transform .12s;">로그인 화면으로 이동</button>' +
        '<div style="font-size:12px;color:#9aa3b0;font-weight:600;margin-top:12px;">잠시 후 자동으로 이동합니다…</div>';
      ov.appendChild(card);
      body.appendChild(ov);

      var btn = document.getElementById('__ssKickBtn');
      if (btn) {
        btn.onclick = goLogin;
        btn.onmousedown = function () { btn.style.transform = 'scale(.97)'; };
        btn.onmouseup = function () { btn.style.transform = ''; };
      }
      setTimeout(goLogin, 4000); // 4초 후 자동 이동
    }

    const _origFetch = window.fetch;
    if (_origFetch) {
      window.fetch = function () {
        return _origFetch.apply(this, arguments).then(function (res) {
          try {
            if (res && res.status === 401) {
              res.clone().json().then(function (d) {
                if (d && d.kicked) window.handleSessionKicked();
              }).catch(function () {});
            }
          } catch (e) {}
          return res;
        });
      };
    }

    setInterval(function () {
      try {
        (_origFetch || window.fetch)('/api/session')
          .then(function (r) { return r.json(); })
          .then(function (d) { if (d && d.kicked) window.handleSessionKicked(); })
          .catch(function () {});
      } catch (e) {}
    }, 30000);
  })();

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

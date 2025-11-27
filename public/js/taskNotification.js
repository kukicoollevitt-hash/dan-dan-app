/**
 * 학생 로그인 시 과제 알림 팝업
 * 학습실에 과제가 있을 경우 하루에 한 번만 표시
 */

(function() {
  'use strict';

  // 오늘 날짜 문자열 (YYYY-MM-DD)
  function getTodayString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  // localStorage에서 오늘 이미 알림을 본 적이 있는지 확인
  function hasSeenNotificationToday() {
    const lastSeenDate = localStorage.getItem('taskNotificationLastSeen');
    return lastSeenDate === getTodayString();
  }

  // 알림을 오늘 본 것으로 기록
  function markNotificationAsSeen() {
    localStorage.setItem('taskNotificationLastSeen', getTodayString());
  }

  // 학습실 과제 확인 API 호출
  async function checkStudyRoomTasks() {
    try {
      const response = await fetch('/api/study-room/has-tasks');
      if (!response.ok) {
        return { hasTasks: false, taskCount: 0 };
      }
      return await response.json();
    } catch (error) {
      console.error('과제 확인 중 에러:', error);
      return { hasTasks: false, taskCount: 0 };
    }
  }

  // 알림 모달 HTML 생성
  function createNotificationModal(taskCount) {
    const modalHTML = `
      <div id="taskNotificationModal" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
      ">
        <div style="
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 24px;
          padding: 40px;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          text-align: center;
          animation: slideUp 0.3s ease;
        ">
          <!-- 고래 아이콘 -->
          <div style="font-size: 80px; margin-bottom: 20px;">🐋</div>

          <!-- 제목 -->
          <h2 style="
            color: white;
            font-size: 28px;
            font-weight: 700;
            margin: 0 0 16px;
            font-family: 'Gmarket Sans', sans-serif;
          ">학습실에 과제가 있어요!</h2>

          <!-- 과제 개수 -->
          <p style="
            color: rgba(255, 255, 255, 0.95);
            font-size: 18px;
            margin: 0 0 32px;
            line-height: 1.6;
          ">
            완료하지 않은 과제가 <strong>${taskCount}개</strong> 남아있습니다.<br>
            학습실로 이동하여 과제를 확인해보세요.
          </p>

          <!-- 버튼 그룹 -->
          <div style="display: flex; gap: 12px; flex-direction: column;">
            <button id="goToStudyRoomBtn" style="
              background: white;
              color: #667eea;
              border: none;
              padding: 14px 24px;
              border-radius: 12px;
              font-size: 16px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            ">
              학습실로 이동하기
            </button>

            <button id="closeNotificationBtn" style="
              background: rgba(255, 255, 255, 0.2);
              color: white;
              border: 2px solid rgba(255, 255, 255, 0.3);
              padding: 12px 24px;
              border-radius: 12px;
              font-size: 15px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
            ">
              오늘 다시 보지 않기
            </button>
          </div>
        </div>
      </div>

      <style>
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        #goToStudyRoomBtn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        #goToStudyRoomBtn:active {
          transform: translateY(0);
        }

        #closeNotificationBtn:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
        }

        #closeNotificationBtn:active {
          background: rgba(255, 255, 255, 0.15);
        }
      </style>
    `;

    // 모달 추가
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);

    // 이벤트 리스너 등록
    const goToStudyRoomBtn = document.getElementById('goToStudyRoomBtn');
    const closeNotificationBtn = document.getElementById('closeNotificationBtn');
    const modal = document.getElementById('taskNotificationModal');

    // 학습실로 이동 버튼
    goToStudyRoomBtn.addEventListener('click', () => {
      markNotificationAsSeen();
      window.location.href = '/student_studyroom.html';
    });

    // 오늘 다시 보지 않기 버튼
    closeNotificationBtn.addEventListener('click', () => {
      markNotificationAsSeen();
      closeModal();
    });

    // 모달 배경 클릭 시 닫기 (선택사항)
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // ESC 키로 닫기
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        markNotificationAsSeen();
        closeModal();
        document.removeEventListener('keydown', escHandler);
      }
    });

    function closeModal() {
      modal.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => {
        modalContainer.remove();
      }, 300);
    }

    // fadeOut 애니메이션 추가
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeOut {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // 초기화 함수
  async function init() {
    // 이미 오늘 알림을 본 경우 종료
    if (hasSeenNotificationToday()) {
      console.log('[과제 알림] 오늘 이미 확인함');
      return;
    }

    // 학습실 과제 확인
    const { hasTasks, taskCount } = await checkStudyRoomTasks();

    // 과제가 있으면 모달 표시
    if (hasTasks && taskCount > 0) {
      console.log(`[과제 알림] ${taskCount}개 과제 발견`);
      createNotificationModal(taskCount);
    } else {
      console.log('[과제 알림] 과제 없음');
    }
  }

  // DOMContentLoaded 이후 실행
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 전역 함수로 노출 (테스트용)
  window.taskNotification = {
    init,
    checkNow: async () => {
      localStorage.removeItem('taskNotificationLastSeen');
      await init();
    }
  };
})();

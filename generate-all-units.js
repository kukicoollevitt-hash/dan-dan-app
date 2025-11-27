#!/usr/bin/env node

/**
 * 전체 1,600개 학습 유닛 자동 생성 스크립트
 * - 4개 시리즈 × 5개 분야 × 여러 카테고리
 * - HTML 파일 + Content.js 파일 생성
 */

const fs = require('fs');
const path = require('path');

// 시리즈 목록
const SERIES = ['BRAINON', 'BRAINUP', 'BRAINFIT', 'BRAINDEEP'];

// 분야별 카테고리 정의 (prefix: {name, count})
const CATEGORIES = {
  korilit: {
    classic: { name: '고전문학', count: 40, emoji: '📜' },
    modern: { name: '현대문학', count: 40, emoji: '📖' }
  },
  person: {
    people1: { name: '인물(1)', count: 40, emoji: '👤' },
    people2: { name: '인물(2)', count: 40, emoji: '👥' }
  },
  science: {
    bio: { name: '생물', count: 20, emoji: '🧬' },
    chem: { name: '화학', count: 20, emoji: '⚗️' },
    earth: { name: '지구과학', count: 20, emoji: '🌍' },
    physics: { name: '물리', count: 20, emoji: '⚛️' }
  },
  social: {
    geo: { name: '지리', count: 20, emoji: '🗺️' },
    law: { name: '법', count: 20, emoji: '⚖️' },
    pol: { name: '정치경제', count: 20, emoji: '🏛️' },
    soc: { name: '사회문화', count: 20, emoji: '🌐' }
  },
  worldlit: {
    world1: { name: '세계문학(1)', count: 40, emoji: '🌏' },
    world2: { name: '세계문학(2)', count: 40, emoji: '🌎' }
  }
};

// HTML 템플릿 (geo_01.html 기반)
const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>단단국어 | study_voca</title>

  <!-- 공통 CSS -->
  <link rel="stylesheet" href="/assets/css/learning-common.css">

  <!-- 파비콘 404 방지 -->
  <link rel="icon" href="data:,">

  <!-- 공통 JavaScript -->
  <script src="/assets/js/learning-common.js"></script>

  <!-- AI 과제 복습 완료 처리 -->
  <script src="./ai-task-common.js"></script>

  <!-- 캡처 라이브러리 -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
</head>
<body>

  <!-- 로딩 오버레이 -->
  <div id="loadingOverlay" class="show">
    <div class="loading-spinner"></div>
    <div class="loading-text">콘텐츠를 불러오는 중...</div>
  </div>

  <!-- 상단 탭 -->
  <div class="top-tabs">
    <div class="tab-btn active" data-tab="reading">✏️ 본문학습</div>
    <div class="tab-btn" data-tab="vocab">📖 어휘학습</div>
    <div class="tab-btn" data-tab="creative">💡 창의활동</div>
    <div class="tab-btn tab-report" data-tab="report">🔍 분석리포트</div>

    <!-- 오른쪽 고정 학생정보 -->
    <div class="student-info">
      <label>학년 :</label>
      <input type="text" id="student-grade" placeholder="예: 5학년">
      <label>이름 :</label>
      <input type="text" id="student-name" placeholder="이름">
    </div>
  </div>

  <!-- Content will be loaded by learning-common.js -->
  <div id="tab-reading" class="tab-panel active"></div>
  <div id="tab-vocab" class="tab-panel"></div>
  <div id="tab-creative" class="tab-panel"></div>
  <div id="tab-report" class="tab-panel"></div>

  <!-- 뒤로가기 확인 팝업 -->
  <div class="back-confirm-overlay" id="back-confirm-overlay">
    <div class="back-confirm-box">
      <p>학습을 종료하고 메뉴로 돌아가시겠습니까?</p>
      <div class="back-confirm-buttons">
        <button onclick="hideBackConfirm()">취소</button>
        <button onclick="goToMenu()" class="btn-primary">확인</button>
      </div>
    </div>
  </div>

  <script>
    /* ===== 전역 리포트 상태 ===== */
    let reportState = { q1ok:false, q2ok:false, q3ok:false, q4ok:false, q5ok:false, vocabScoreRatio:0 };

    /* ===== 탭 전환 ===== */
    function refreshReportTab() {
      try {
        const saved = localStorage.getItem('dan-__PREFIX__-report-state');
        if (saved) {
          const savedReportState = JSON.parse(saved);
          updateReportPanel({
            q1ok: savedReportState.q1ok || false,
            q2ok: savedReportState.q2ok || false,
            q3ok: savedReportState.q3ok || false,
            q4ok: savedReportState.q4ok || false,
            q5ok: savedReportState.q5ok || false
          });
          drawRadarChart({
            literal: savedReportState.literal || 0,
            structural: savedReportState.structural || 0,
            lexical: savedReportState.lexical || 0,
            inferential: savedReportState.inferential || 0,
            critical: savedReportState.critical || 0
          });
        }
      } catch(e) {
        console.error('Failed to refresh report:', e);
      }
    }

    function activateTab(tabName) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

      const targetBtn = document.querySelector(\`.tab-btn[data-tab="\${tabName}"]\`);
      const targetPanel = document.getElementById('tab-' + tabName);

      if (targetBtn && targetPanel) {
        targetBtn.classList.add('active');
        targetPanel.classList.add('active');

        if (tabName === 'report') {
          refreshReportTab();
        }

        if (tabName === 'vocab') {
          const fn = window.renderVocabFromContent || window.renderVocabFill;
          if (typeof fn === 'function') {
            fn();
          }
        }
      }
    }

    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        activateTab(target);
        const unit = window.CUR_UNIT || '__PREFIX___01';
        localStorage.setItem(\`current-__PREFIX__-tab:\${unit}\`, target);
      });
    });

    window.addEventListener('DOMContentLoaded', async () => {
      const unit = window.CUR_UNIT || '__PREFIX___01';
      const user = JSON.parse(sessionStorage.getItem('user') || '{}');
      const grade = user.grade || '';
      const name = user.name || '';
      const phone = user.phone || '';

      let hasLearningRecord = false;

      if (grade && name) {
        try {
          const url = phone
            ? \`/api/learning-logs?grade=\${encodeURIComponent(grade)}&name=\${encodeURIComponent(name)}&phone=\${encodeURIComponent(phone)}\`
            : \`/api/learning-logs?grade=\${encodeURIComponent(grade)}&name=\${encodeURIComponent(name)}\`;

          const response = await fetch(url);
          const logs = await response.json();

          hasLearningRecord = logs.some(log => log.unit === unit && log.completed);
          console.log(\`[__PREFIX___01] 학습 기록 확인: unit=\${unit}, hasRecord=\${hasLearningRecord}\`);
        } catch (err) {
          console.error('[__PREFIX___01] 학습 기록 조회 오류:', err);
        }
      }

      const savedTab = hasLearningRecord
        ? (localStorage.getItem(\`current-__PREFIX__-tab:\${unit}\`) || 'reading')
        : 'reading';

      console.log(\`[__PREFIX___01] 탭 선택: savedTab=\${savedTab}, hasRecord=\${hasLearningRecord}\`);
      activateTab(savedTab);
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
      if (window.parent && window.parent !== window) {
        try {
          if (window.parent.closeUnitModal) {
            window.parent.closeUnitModal();
          }
        } catch (e) {
          console.log('모달 닫기 실패, 페이지 이동:', e);
          window.location.href = '/menu.html';
        }
      } else {
        window.location.href = '/menu.html';
      }
    }

    window.addEventListener('popstate', (e) => {
      e.preventDefault();
      showBackConfirm();
      history.pushState(null, '', location.href);
    });

    window.addEventListener('load', () => {
      history.pushState(null, '', location.href);
    });
  </script>

  <!-- 외부 JS: 단원 콘텐츠 로드 -->
  <script src="./__PREFIX___content.js?v=20251127" defer></script>
</body>
</html>
`;

// Content.js 템플릿 (샘플 데이터 포함)
function generateContentJS(prefix, categoryInfo, count) {
  let content = `/**
 * ${categoryInfo.name} 콘텐츠 (${count}개 유닛)
 */

(function () {
  const qs = new URLSearchParams(location.search).get('unit');
  let unit = null;

  if (qs) {
    const m = qs.toLowerCase().match(/${prefix}[_-]?(\\d{1,2})/);
    if (m) unit = \`${prefix}_\${m[1].padStart(2, '0')}\`;
  }

  if (!unit) {
    const m2 = location.pathname.toLowerCase().match(/${prefix}[_-]?(\\d{1,2})\\.html/);
    if (m2) unit = \`${prefix}_\${m2[1].padStart(2, '0')}\`;
  }

  if (!unit && document.title) {
    const m3 = document.title.match(/(\\d{1,2})/);
    if (m3) unit = \`${prefix}_\${m3[1].padStart(2, '0')}\`;
  }

  window.CUR_UNIT = unit || '${prefix}_01';
})();

window.CONTENTS = window.CONTENTS || {};

window.CONTENTS = Object.assign(window.CONTENTS, {\n`;

  for (let i = 1; i <= count; i++) {
    const unitId = `${prefix}_${String(i).padStart(2, '0')}`;
    content += `  /* ===== ${unitId} : "${categoryInfo.emoji} ${categoryInfo.name} ${i}" ===== */
  ${unitId}: {
    labelNo: '${String(i).padStart(2, '0')}',
    title: '${categoryInfo.emoji} ${categoryInfo.name} ${i}',
    passage: [
      '이것은 ${categoryInfo.name} ${i}번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '① 오답 1',
        '② 정답',
        '③ 오답 2',
        '④ 오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '① 오답 1',
        '② 오답 2',
        '③ 정답',
        '④ 오답 3'
      ],
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
    }
  }${i < count ? ',' : ''}\n\n`;
  }

  content += '});\n';
  return content;
}

// 메인 생성 함수
function generateAllUnits() {
  let totalFiles = 0;
  let totalContentJS = 0;

  console.log('🚀 전체 유닛 파일 생성 시작...\n');

  SERIES.forEach(series => {
    console.log(`📁 ${series} 시리즈 생성 중...`);

    Object.entries(CATEGORIES).forEach(([folder, categories]) => {
      const folderPath = path.join(__dirname, 'public', series, folder);

      Object.entries(categories).forEach(([prefix, info]) => {
        console.log(`  └─ ${info.name} (${prefix}): ${info.count}개 유닛`);

        // HTML 파일 생성
        for (let i = 1; i <= info.count; i++) {
          const num = String(i).padStart(2, '0');
          const filename = `${prefix}_${num}.html`;
          const filepath = path.join(folderPath, filename);

          const html = HTML_TEMPLATE
            .replace(/__PREFIX__/g, prefix);

          fs.writeFileSync(filepath, html, 'utf8');
          totalFiles++;
        }

        // Content.js 파일 생성
        const contentJS = generateContentJS(prefix, info, info.count);
        const contentPath = path.join(folderPath, `${prefix}_content.js`);
        fs.writeFileSync(contentPath, contentJS, 'utf8');
        totalContentJS++;
      });
    });

    console.log(`✅ ${series} 완료\n`);
  });

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✨ 생성 완료!`);
  console.log(`📄 HTML 파일: ${totalFiles}개`);
  console.log(`📦 Content.js 파일: ${totalContentJS}개`);
  console.log(`🎯 총 파일: ${totalFiles + totalContentJS}개`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

// 실행
generateAllUnits();

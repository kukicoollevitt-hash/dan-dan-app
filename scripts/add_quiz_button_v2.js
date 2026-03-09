/**
 * 관문평가 버튼이 없는 이야기 파일에 버튼 추가 (v2)
 * nav-buttons 섹션이 없는 파일에는 섹션 자체를 추가
 */

const fs = require('fs');
const path = require('path');

const creativeBookDir = path.join(__dirname, '../public/creative-book');

// 관문평가 버튼이 없는 파일 목록 (수동 확인 필요했던 파일들)
const filesNeedManual = [
  'bio07', 'bio08', 'bio10', 'bio11', 'bio12', 'bio13',
  'earth03',
  'korperson01', 'korperson02', 'korperson03', 'korperson04', 'korperson05', 'korperson06',
  'physics07', 'physics08', 'physics09', 'physics10', 'physics11', 'physics12', 'physics13', 'physics14', 'physics15',
  'politics03', 'politics04', 'politics05', 'politics06',
  'worldlit01', 'worldlit02', 'worldlit03', 'worldlit04', 'worldlit05', 'worldlit06'
];

// quiz 파일 존재 여부 확인
function quizFileExists(storyId) {
  const quizPath = path.join(creativeBookDir, `${storyId}_season1_quiz.html`);
  return fs.existsSync(quizPath);
}

// nav-buttons 섹션과 버튼 HTML 생성
function getNavButtonsHtml(storyId) {
  return `
  <!-- 네비게이션 버튼 -->
  <div class="nav-buttons" style="position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 15px; z-index: 100;">
    <button class="nav-btn" style="padding: 12px 24px; border-radius: 25px; border: none; background: rgba(255,255,255,0.9); color: #333; font-weight: 600; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.2);" onclick="goBack()">← 목록으로</button>
    <button class="nav-btn" style="padding: 12px 24px; border-radius: 25px; border: none; background: linear-gradient(135deg, #f39c12 0%, #e74c3c 100%); color: white; font-weight: 600; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.2);" onclick="goToQuiz()">📝 관문평가</button>
  </div>
`;
}

// goBack과 goToQuiz 함수
function getNavigationFunctions(storyId) {
  return `
    function goBack() {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'closeStory' }, '*');
      } else {
        window.history.back();
      }
    }

    function goToQuiz() {
      window.location.href = '/creative-book/${storyId}_season1_quiz.html?season=season1';
    }
`;
}

// 파일에 관문평가 버튼 추가
function addQuizButton(storyId) {
  const filePath = path.join(creativeBookDir, `${storyId}_season1_34.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${storyId}: 파일 없음`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf-8');

  // 이미 관문평가 버튼이 있는지 확인
  if (content.includes('관문평가')) {
    console.log(`[SKIP] ${storyId}: 이미 버튼 있음`);
    return false;
  }

  const hasQuiz = quizFileExists(storyId);

  // nav-buttons가 없는 경우: </div> (content 닫는 태그) 앞에 추가
  // 패턴: </div>\s*<script> (마지막 content div 닫고 script 시작)
  const navButtonsHtml = getNavButtonsHtml(storyId);
  const navFunctions = getNavigationFunctions(storyId);

  // </div>\s*\n\s*<script> 패턴 찾기 (마지막 content div)
  const pattern = /(<\/div>)\s*\n\s*(<script>)/;

  if (pattern.test(content)) {
    // nav-buttons 추가
    content = content.replace(pattern, `$1\n${navButtonsHtml}\n  $2`);

    // goBack 함수가 이미 있는지 확인
    if (content.includes('function goBack()')) {
      // goToQuiz만 추가
      const goToQuizOnly = `
    function goToQuiz() {
      window.location.href = '/creative-book/${storyId}_season1_quiz.html?season=season1';
    }
`;
      // </script> 앞에 goToQuiz 추가
      content = content.replace(/([\s\S]*)(  <\/script>)/, `$1${goToQuizOnly}$2`);
    } else if (content.includes('function closeStory()')) {
      // closeStory를 goBack으로 변환하고 goToQuiz 추가
      // closeStory 호출을 goBack으로 변경
      content = content.replace(/onclick="closeStory\(\)"/g, 'onclick="goBack()"');
      // closeStory 함수 이름을 goBack으로 변경
      content = content.replace(/function closeStory\(\)/g, 'function goBack()');
      // goToQuiz 추가
      const goToQuizOnly = `
    function goToQuiz() {
      window.location.href = '/creative-book/${storyId}_season1_quiz.html?season=season1';
    }
`;
      content = content.replace(/([\s\S]*)(  <\/script>)/, `$1${goToQuizOnly}$2`);
    } else {
      // 둘 다 없으면 전체 함수 추가
      content = content.replace(/([\s\S]*)(  <\/script>)/, `$1${navFunctions}$2`);
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`[ADDED] ${storyId}${hasQuiz ? '' : ' (⚠️ quiz 파일 없음!)'}`);
    return true;
  } else {
    console.log(`[MANUAL] ${storyId}: 패턴 매칭 실패`);
    return false;
  }
}

// 메인 실행
function main() {
  console.log(`총 ${filesNeedManual.length}개 파일에 관문평가 버튼 추가 시도\n`);

  let addedCount = 0;
  let skippedCount = 0;
  let manualCount = 0;

  for (const storyId of filesNeedManual) {
    const filePath = path.join(creativeBookDir, `${storyId}_season1_34.html`);
    if (!fs.existsSync(filePath)) {
      console.log(`[SKIP] ${storyId}: 파일 없음`);
      skippedCount++;
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    if (content.includes('관문평가')) {
      console.log(`[SKIP] ${storyId}: 이미 버튼 있음`);
      skippedCount++;
      continue;
    }

    const result = addQuizButton(storyId);
    if (result) {
      addedCount++;
    } else {
      manualCount++;
    }
  }

  console.log(`\n=== 완료 ===`);
  console.log(`추가됨: ${addedCount}개`);
  console.log(`이미 있음/파일없음: ${skippedCount}개`);
  console.log(`수동 확인 필요: ${manualCount}개`);
}

main();

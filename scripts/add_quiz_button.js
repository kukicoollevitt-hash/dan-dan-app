/**
 * 관문평가 버튼이 없는 이야기 파일에 버튼 추가
 */

const fs = require('fs');
const path = require('path');

const creativeBookDir = path.join(__dirname, '../public/creative-book');

// 파일명에서 storyId 추출
function getStoryId(fileName) {
  const match = fileName.match(/^([a-z]+\d+)_season1_34\.html$/);
  return match ? match[1] : null;
}

// 관문평가 버튼이 없는 파일 목록 (grep -L "관문평가" 결과)
const filesWithoutButton = [
  'bio07', 'bio08', 'bio09', 'bio10', 'bio11', 'bio12', 'bio13', 'bio14', 'bio15', 'bio16', 'bio17', 'bio18', 'bio19', 'bio20',
  'earth01', 'earth02', 'earth03', 'earth04', 'earth05', 'earth06',
  'korperson01', 'korperson02', 'korperson03', 'korperson04', 'korperson05', 'korperson06',
  'law01', 'law02', 'law03', 'law04', 'law05', 'law06',
  'physics01', 'physics02', 'physics03', 'physics04', 'physics05', 'physics06',
  'physics07', 'physics08', 'physics09', 'physics10', 'physics11', 'physics12', 'physics13', 'physics14', 'physics15',
  'pol02', 'politic01', 'politics03', 'politics04', 'politics05', 'politics06',
  'social01', 'social02', 'social03', 'social04', 'social05', 'social06',
  'worldlit01', 'worldlit02', 'worldlit03', 'worldlit04', 'worldlit05', 'worldlit06',
  'worldperson01', 'worldperson02'
];

// quiz 파일 존재 여부 확인
function quizFileExists(storyId) {
  const quizPath = path.join(creativeBookDir, `${storyId}_season1_quiz.html`);
  return fs.existsSync(quizPath);
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

  // quiz 파일 존재 여부 확인
  const hasQuiz = quizFileExists(storyId);

  // 패턴 1: nav-buttons 내에 목록으로 버튼만 있는 경우
  // <button class="nav-btn" onclick="goBack()">← 목록으로</button>
  // </div>
  const pattern1 = /(<button[^>]*onclick="goBack\(\)"[^>]*>[^<]*목록[^<]*<\/button>)\s*(<\/div>)/i;

  // 패턴 2: nav-btn back과 closing div
  // <button class="nav-btn back" onclick="goBack()">← 목록으로</button>
  const pattern2 = /(<button[^>]*class="nav-btn[^"]*"[^>]*onclick="goBack\(\)"[^>]*>[^<]*<\/button>)\s*(<\/div>\s*<\/section>)/i;

  // 패턴 3: <a> 태그 사용
  const pattern3 = /(<a[^>]*class="nav-btn back"[^>]*>[^<]*<\/a>)\s*(<\/div>)/i;

  let modified = false;

  // 관문평가 버튼 HTML
  const quizButton = `\n    <button class="nav-btn" style="background: linear-gradient(135deg, #f39c12 0%, #e74c3c 100%);" onclick="goToQuiz()">📝 관문평가</button>`;

  // goToQuiz 함수
  const goToQuizFunction = `
    function goToQuiz() {
      window.location.href = '/creative-book/${storyId}_season1_quiz.html?season=season1';
    }`;

  if (pattern1.test(content)) {
    content = content.replace(pattern1, `$1${quizButton}\n  $2`);
    modified = true;
  } else if (pattern2.test(content)) {
    content = content.replace(pattern2, `$1${quizButton}\n      $2`);
    modified = true;
  } else if (pattern3.test(content)) {
    // a 태그를 button으로 변환하고 quiz 버튼 추가
    const quizAnchor = `\n        <a href="/creative-book/${storyId}_season1_quiz.html?season=season1" class="nav-btn quiz">📝 관문평가</a>`;
    content = content.replace(pattern3, `$1${quizAnchor}\n      $2`);
    modified = true;
  }

  // goToQuiz 함수 추가 (버튼이 추가된 경우에만)
  if (modified && content.includes('onclick="goToQuiz()"') && !content.includes('function goToQuiz')) {
    // </script> 바로 앞에 함수 추가
    content = content.replace(/([\s\S]*)(  <\/script>)/, `$1${goToQuizFunction}\n$2`);
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`[ADDED] ${storyId}${hasQuiz ? '' : ' (quiz 파일 없음!)'}`);
    return true;
  } else {
    console.log(`[MANUAL] ${storyId}: 패턴 매칭 실패 - 수동 확인 필요`);
    return false;
  }
}

// 메인 실행
function main() {
  console.log(`총 ${filesWithoutButton.length}개 파일에 관문평가 버튼 추가 시도\n`);

  let addedCount = 0;
  let skippedCount = 0;
  let manualCount = 0;
  const noQuizFiles = [];

  for (const storyId of filesWithoutButton) {
    const result = addQuizButton(storyId);
    if (result) {
      addedCount++;
      if (!quizFileExists(storyId)) {
        noQuizFiles.push(storyId);
      }
    } else if (fs.existsSync(path.join(creativeBookDir, `${storyId}_season1_34.html`))) {
      const content = fs.readFileSync(path.join(creativeBookDir, `${storyId}_season1_34.html`), 'utf-8');
      if (content.includes('관문평가')) {
        skippedCount++;
      } else {
        manualCount++;
      }
    } else {
      skippedCount++;
    }
  }

  console.log(`\n=== 완료 ===`);
  console.log(`추가됨: ${addedCount}개`);
  console.log(`이미 있음/파일없음: ${skippedCount}개`);
  console.log(`수동 확인 필요: ${manualCount}개`);

  if (noQuizFiles.length > 0) {
    console.log(`\n⚠️ quiz 파일이 없는 이야기: ${noQuizFiles.join(', ')}`);
  }
}

main();

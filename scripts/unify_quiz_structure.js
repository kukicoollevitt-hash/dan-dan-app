/**
 * 3,4학년 creative-book quiz 파일들을 bio01 구조로 통일하는 스크립트
 *
 * 주요 변경사항:
 * 1. 배경 이미지를 표지 이미지로 설정
 * 2. postMessage의 season을 getSeasonFromUrl()로 통일
 */

const fs = require('fs');
const path = require('path');

const creativeBookDir = path.join(__dirname, '../public/creative-book');

// storyId에서 배경 이미지 경로 생성
function getBackgroundImagePath(storyId) {
  const categoryMap = {
    'bio': '창작생물',
    'chem': '창작화학',
    'physics': '창작물리',
    'earth': '창작지구',
    'geo': '창작지리',
    'law': '창작법',
    'social': '창작사회문화',
    'classic': '창작고전',
    'worldlit': '창작세계문학',
    'korperson': '창작한국인물',
    'worldperson': '창작세계인물',
    'politic': '창작정치',
    'politics': '창작정치',
    'pol': '창작정치'
  };

  // storyId에서 카테고리와 번호 추출 (예: bio01 -> bio, 01)
  const match = storyId.match(/^([a-z]+)(\d+)$/);
  if (!match) return null;

  const [, category, num] = match;
  const folderName = categoryMap[category];
  if (!folderName) return null;

  // 폴더명 패턴 생성 (예: 창작생물01, 창작화학02 등)
  const numPadded = num.padStart(2, '0');
  return `/images/창작도서/${folderName}${numPadded}/00.jpg`;
}

// 파일에서 storyId 추출
function extractStoryId(content) {
  // storyId: 'bio01' 패턴 찾기
  const match = content.match(/storyId:\s*['"]([^'"]+)['"]/);
  return match ? match[1] : null;
}

// quiz 파일 수정
function processQuizFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath);
  let modified = false;
  const changes = [];

  // storyId 추출
  const storyId = extractStoryId(content);
  if (!storyId) {
    console.log(`[SKIP] ${fileName}: storyId를 찾을 수 없음`);
    return { modified: false, changes: [] };
  }

  // 1. 배경 이미지 설정 확인 및 수정
  // linear-gradient 배경을 이미지로 변경
  const bgImagePath = getBackgroundImagePath(storyId);
  if (bgImagePath) {
    // background: linear-gradient 패턴을 찾아서 이미지로 변경
    const gradientPattern = /background:\s*linear-gradient\(135deg,\s*#[a-f0-9]+\s*0%,\s*#[a-f0-9]+\s*100%\);/gi;
    if (gradientPattern.test(content)) {
      content = content.replace(gradientPattern, `background: url('${bgImagePath}');`);
      modified = true;
      changes.push('배경을 linear-gradient에서 이미지로 변경');
    }
  }

  // 2. postMessage의 season: 'season1'을 season: getSeasonFromUrl()로 변경
  // 패턴: season: 'season1' 또는 season: "season1"
  const hardcodedSeasonPattern = /season:\s*['"]season\d+['"]/g;
  if (hardcodedSeasonPattern.test(content)) {
    // showCongratulations 함수 내의 postMessage 부분에서만 변경
    // 이미 getSeasonFromUrl()을 사용하는 경우는 제외
    const beforeContent = content;
    content = content.replace(
      /(window\.parent\.postMessage\(\{[^}]*action:\s*['"]quizComplete['"][^}]*,\s*)season:\s*['"]season\d+['"]/g,
      '$1season: getSeasonFromUrl()'
    );
    if (content !== beforeContent) {
      modified = true;
      changes.push('postMessage season을 getSeasonFromUrl()로 변경');
    }
  }

  // 파일 저장
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`[MODIFIED] ${fileName}: ${changes.join(', ')}`);
  } else {
    console.log(`[NO CHANGE] ${fileName}`);
  }

  return { modified, changes };
}

// 메인 실행
function main() {
  // quiz 파일 목록 가져오기
  const files = fs.readdirSync(creativeBookDir)
    .filter(f => f.endsWith('_season1_quiz.html'))
    .map(f => path.join(creativeBookDir, f));

  console.log(`총 ${files.length}개의 quiz 파일 발견\n`);

  let modifiedCount = 0;
  let skippedCount = 0;

  for (const filePath of files) {
    const result = processQuizFile(filePath);
    if (result.modified) {
      modifiedCount++;
    } else {
      skippedCount++;
    }
  }

  console.log(`\n=== 완료 ===`);
  console.log(`수정됨: ${modifiedCount}개`);
  console.log(`변경없음: ${skippedCount}개`);
}

main();

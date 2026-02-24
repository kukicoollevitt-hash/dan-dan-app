/**
 * quiz 파일의 잘못된 CSS 수정
 * body의 background만 이미지로, 나머지 linear-gradient는 복원
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

  const match = storyId.match(/^([a-z]+)(\d+)$/);
  if (!match) return null;

  const [, category, num] = match;
  const folderName = categoryMap[category];
  if (!folderName) return null;

  const numPadded = num.padStart(2, '0');
  return `/images/창작도서/${folderName}${numPadded}/00.jpg`;
}

// 파일에서 storyId 추출
function extractStoryId(content) {
  const match = content.match(/storyId:\s*['"]([^'"]+)['"]/);
  return match ? match[1] : null;
}

// quiz 파일 수정
function processQuizFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath);

  const storyId = extractStoryId(content);
  if (!storyId) {
    console.log(`[SKIP] ${fileName}: storyId를 찾을 수 없음`);
    return;
  }

  const bgImagePath = getBackgroundImagePath(storyId);
  if (!bgImagePath) {
    console.log(`[SKIP] ${fileName}: 배경 이미지 경로 생성 실패`);
    return;
  }

  // 1. body의 background를 이미지로 설정 (올바른 위치에만)
  // body { ... background: ... } 부분만 수정
  content = content.replace(
    /(body\s*\{[^}]*?)background:\s*url\([^)]+\);/,
    `$1background: url('${bgImagePath}');`
  );

  // 2. .gate-number의 background를 linear-gradient로 복원
  content = content.replace(
    /\.quiz-header \.gate-number\s*\{([^}]*?)background:\s*url\([^)]+\);/,
    '.quiz-header .gate-number {$1background: linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%);'
  );

  // 3. .category-badge의 background를 linear-gradient로 복원
  content = content.replace(
    /\.quiz-header \.category-badge\s*\{([^}]*?)background:\s*url\([^)]+\);/,
    '.quiz-header .category-badge {$1background: linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%);'
  );

  // 4. .progress-bar의 background를 linear-gradient로 복원
  content = content.replace(
    /\.progress-bar\s*\{([^}]*?)background:\s*url\([^)]+\);/,
    '.progress-bar {$1background: linear-gradient(90deg, #2d6a4f 0%, #1b4332 100%);'
  );

  // 5. .option-btn.selected의 background를 linear-gradient로 복원
  content = content.replace(
    /\.option-btn\.selected\s*\{([^}]*?)background:\s*url\([^)]+\);/,
    '.option-btn.selected {$1background: linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%);'
  );

  // 6. .submit-btn의 background를 linear-gradient로 복원
  content = content.replace(
    /\.submit-btn\s*\{([^}]*?)background:\s*url\([^)]+\);/,
    '.submit-btn {$1background: linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%);'
  );

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`[FIXED] ${fileName}`);
}

// 메인 실행
function main() {
  const files = fs.readdirSync(creativeBookDir)
    .filter(f => f.endsWith('_season1_quiz.html'))
    .map(f => path.join(creativeBookDir, f));

  console.log(`총 ${files.length}개의 quiz 파일 수정 중...\n`);

  for (const filePath of files) {
    processQuizFile(filePath);
  }

  console.log(`\n=== 완료 ===`);
}

main();

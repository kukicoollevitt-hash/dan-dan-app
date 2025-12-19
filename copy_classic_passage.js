const fs = require('fs');

// 파일 읽기
const classicPath = '/Users/dandan/Desktop/dan-dan-app_1217/public/BRAINUP/korlit/classic_content.js';
const onClassicPath = '/Users/dandan/Desktop/dan-dan-app_1217/public/BRAINUP/korlit/on_classic_content.js';

let classicContent = fs.readFileSync(classicPath, 'utf8');
let onClassicContent = fs.readFileSync(onClassicPath, 'utf8');

// 09~40까지 처리
for (let i = 9; i <= 40; i++) {
  const num = i.toString().padStart(2, '0');

  // classic_XX에서 passage 추출
  const classicPassageRegex = new RegExp(
    `classic_${num}:\\s*\\{[\\s\\S]*?passage:\\s*\\[([\\s\\S]*?)\\],\\s*vocab:`,
    'g'
  );

  const classicMatch = classicPassageRegex.exec(classicContent);
  if (!classicMatch) {
    console.log(`classic_${num}: passage 추출 실패`);
    continue;
  }

  const classicPassage = classicMatch[1].trim();

  // on_classic_XX에서 passage 부분을 찾아서 교체
  const onClassicPassageRegex = new RegExp(
    `(on_classic_${num}:\\s*\\{[\\s\\S]*?passage:\\s*\\[)[\\s\\S]*?(\\],\\s*vocab:)`,
    'g'
  );

  const newOnClassicContent = onClassicContent.replace(onClassicPassageRegex, `$1${classicPassage}$2`);

  if (newOnClassicContent !== onClassicContent) {
    onClassicContent = newOnClassicContent;
    console.log(`on_classic_${num}: passage 복사 완료`);
  } else {
    console.log(`on_classic_${num}: 변경 없음 또는 실패`);
  }
}

// 결과 저장
fs.writeFileSync(onClassicPath, onClassicContent, 'utf8');
console.log('\n완료! on_classic_content.js 저장됨');

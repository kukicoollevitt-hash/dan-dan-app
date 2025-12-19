const fs = require('fs');

// 파일 읽기
const world1Path = '/Users/dandan/Desktop/dan-dan-app_1217/public/BRAINUP/worldlit/world1_content.js';
const onWorld1Path = '/Users/dandan/Desktop/dan-dan-app_1217/public/BRAINUP/worldlit/on_world1_content.js';

let world1Content = fs.readFileSync(world1Path, 'utf8');
let onWorld1Content = fs.readFileSync(onWorld1Path, 'utf8');

// 02~40까지 처리
for (let i = 2; i <= 40; i++) {
  const num = i.toString().padStart(2, '0');

  // world1_XX에서 passage 추출
  const world1PassageRegex = new RegExp(
    `world1_${num}:\\s*\\{[\\s\\S]*?passage:\\s*\\[([\\s\\S]*?)\\],\\s*vocab:`,
    'g'
  );

  const world1Match = world1PassageRegex.exec(world1Content);
  if (!world1Match) {
    console.log(`world1_${num}: passage 추출 실패`);
    continue;
  }

  const world1Passage = world1Match[1].trim();

  // on_world1_XX에서 passage 부분을 찾아서 교체
  const onWorld1PassageRegex = new RegExp(
    `(on_world1_${num}:\\s*\\{[\\s\\S]*?passage:\\s*\\[)[\\s\\S]*?(\\],\\s*vocab:)`,
    'g'
  );

  const newOnWorld1Content = onWorld1Content.replace(onWorld1PassageRegex, `$1${world1Passage}$2`);

  if (newOnWorld1Content !== onWorld1Content) {
    onWorld1Content = newOnWorld1Content;
    console.log(`on_world1_${num}: passage 복사 완료`);
  } else {
    console.log(`on_world1_${num}: 변경 없음 또는 실패`);
  }
}

// 결과 저장
fs.writeFileSync(onWorld1Path, onWorld1Content, 'utf8');
console.log('\n완료! on_world1_content.js 저장됨');

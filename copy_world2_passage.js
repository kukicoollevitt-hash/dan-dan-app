const fs = require('fs');

// 파일 읽기
const world2Path = '/Users/dandan/Desktop/dan-dan-app_1217/public/BRAINUP/worldlit/world2_content.js';
const onWorld2Path = '/Users/dandan/Desktop/dan-dan-app_1217/public/BRAINUP/worldlit/on_world2_content.js';

let world2Content = fs.readFileSync(world2Path, 'utf8');
let onWorld2Content = fs.readFileSync(onWorld2Path, 'utf8');

// 01~40까지 처리
for (let i = 1; i <= 40; i++) {
  const num = i.toString().padStart(2, '0');

  // world2_XX에서 passage 추출
  const world2PassageRegex = new RegExp(
    `world2_${num}:\\s*\\{[\\s\\S]*?passage:\\s*\\[([\\s\\S]*?)\\],\\s*vocab:`,
    'g'
  );

  const world2Match = world2PassageRegex.exec(world2Content);
  if (!world2Match) {
    console.log(`world2_${num}: passage 추출 실패`);
    continue;
  }

  const world2Passage = world2Match[1].trim();

  // on_world2_XX에서 passage 부분을 찾아서 교체
  const onWorld2PassageRegex = new RegExp(
    `(on_world2_${num}:\\s*\\{[\\s\\S]*?passage:\\s*\\[)[\\s\\S]*?(\\],\\s*vocab:)`,
    'g'
  );

  const newOnWorld2Content = onWorld2Content.replace(onWorld2PassageRegex, `$1${world2Passage}$2`);

  if (newOnWorld2Content !== onWorld2Content) {
    onWorld2Content = newOnWorld2Content;
    console.log(`on_world2_${num}: passage 복사 완료`);
  } else {
    console.log(`on_world2_${num}: 변경 없음 또는 실패`);
  }
}

// 결과 저장
fs.writeFileSync(onWorld2Path, onWorld2Content, 'utf8');
console.log('\n완료! on_world2_content.js 저장됨');

const fs = require('fs');

// 파일 읽기
const people1Path = '/Users/dandan/Desktop/dan-dan-app_1217/public/BRAINUP/person/people1_content.js';
const onPeople1Path = '/Users/dandan/Desktop/dan-dan-app_1217/public/BRAINUP/person/on_people1_content.js';

let people1Content = fs.readFileSync(people1Path, 'utf8');
let onPeople1Content = fs.readFileSync(onPeople1Path, 'utf8');

// 02~40까지 처리
for (let i = 2; i <= 40; i++) {
  const num = i.toString().padStart(2, '0');

  // people1_XX에서 passage 추출
  const people1PassageRegex = new RegExp(
    `people1_${num}:\\s*\\{[\\s\\S]*?passage:\\s*\\[([\\s\\S]*?)\\],\\s*vocab:`,
    'g'
  );

  const people1Match = people1PassageRegex.exec(people1Content);
  if (!people1Match) {
    console.log(`people1_${num}: passage 추출 실패`);
    continue;
  }

  const people1Passage = people1Match[1].trim();

  // on_people1_XX에서 passage 부분을 찾아서 교체
  const onPeople1PassageRegex = new RegExp(
    `(on_people1_${num}:\\s*\\{[\\s\\S]*?passage:\\s*\\[)[\\s\\S]*?(\\],\\s*vocab:)`,
    'g'
  );

  const newOnPeople1Content = onPeople1Content.replace(onPeople1PassageRegex, `$1${people1Passage}$2`);

  if (newOnPeople1Content !== onPeople1Content) {
    onPeople1Content = newOnPeople1Content;
    console.log(`on_people1_${num}: passage 복사 완료`);
  } else {
    console.log(`on_people1_${num}: 변경 없음 또는 실패`);
  }
}

// 결과 저장
fs.writeFileSync(onPeople1Path, onPeople1Content, 'utf8');
console.log('\n완료! on_people1_content.js 저장됨');

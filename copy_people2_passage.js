const fs = require('fs');

// 파일 읽기
const people2Path = '/Users/dandan/Desktop/dan-dan-app_1217/public/BRAINUP/person/people2_content.js';
const onPeople2Path = '/Users/dandan/Desktop/dan-dan-app_1217/public/BRAINUP/person/on_people2_content.js';

let people2Content = fs.readFileSync(people2Path, 'utf8');
let onPeople2Content = fs.readFileSync(onPeople2Path, 'utf8');

// 02~40까지 처리
for (let i = 2; i <= 40; i++) {
  const num = i.toString().padStart(2, '0');

  // people2_XX에서 passage 추출
  const people2PassageRegex = new RegExp(
    `people2_${num}:\\s*\\{[\\s\\S]*?passage:\\s*\\[([\\s\\S]*?)\\],\\s*vocab:`,
    'g'
  );

  const people2Match = people2PassageRegex.exec(people2Content);
  if (!people2Match) {
    console.log(`people2_${num}: passage 추출 실패`);
    continue;
  }

  const people2Passage = people2Match[1].trim();

  // on_people2_XX에서 passage 부분을 찾아서 교체
  const onPeople2PassageRegex = new RegExp(
    `(on_people2_${num}:\\s*\\{[\\s\\S]*?passage:\\s*\\[)[\\s\\S]*?(\\],\\s*vocab:)`,
    'g'
  );

  const newOnPeople2Content = onPeople2Content.replace(onPeople2PassageRegex, `$1${people2Passage}$2`);

  if (newOnPeople2Content !== onPeople2Content) {
    onPeople2Content = newOnPeople2Content;
    console.log(`on_people2_${num}: passage 복사 완료`);
  } else {
    console.log(`on_people2_${num}: 변경 없음 또는 실패`);
  }
}

// 결과 저장
fs.writeFileSync(onPeople2Path, onPeople2Content, 'utf8');
console.log('\n완료! on_people2_content.js 저장됨');

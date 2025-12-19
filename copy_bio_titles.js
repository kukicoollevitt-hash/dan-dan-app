const fs = require('fs');
const bioPath = '/Users/dandan/Desktop/dan-dan-app_1217/public/BRAINUP/science/bio_content.js';
const onBioPath = '/Users/dandan/Desktop/dan-dan-app_1217/public/BRAINUP/science/on_bio_content.js';

let bioContent = fs.readFileSync(bioPath, 'utf8');
let onBioContent = fs.readFileSync(onBioPath, 'utf8');

// bio_01 ~ bio_20의 title 추출 및 복사
for (let i = 1; i <= 20; i++) {
  const num = i.toString().padStart(2, '0');

  // bio_XX에서 title 추출
  const bioTitleRegex = new RegExp(`bio_${num}:\\s*\\{[\\s\\S]*?title:\\s*'([^']+)'`);
  const bioMatch = bioContent.match(bioTitleRegex);

  if (!bioMatch) {
    console.log(`bio_${num}: title 추출 실패`);
    continue;
  }

  const bioTitle = bioMatch[1];

  // on_bio_XX에서 title 교체
  const onBioTitleRegex = new RegExp(`(on_bio_${num}:\\s*\\{[\\s\\S]*?title:\\s*')[^']+'`);
  const newOnBioContent = onBioContent.replace(onBioTitleRegex, `$1${bioTitle}'`);

  if (newOnBioContent !== onBioContent) {
    onBioContent = newOnBioContent;
    console.log(`on_bio_${num}: '${bioTitle}' 복사 완료`);
  } else {
    console.log(`on_bio_${num}: 변경 없음 또는 실패`);
  }
}

fs.writeFileSync(onBioPath, onBioContent, 'utf8');
console.log('\n완료! on_bio_content.js 저장됨');

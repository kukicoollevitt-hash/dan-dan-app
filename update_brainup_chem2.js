const fs = require('fs');
const path = require('path');

const baseDir = '/Users/dandan/Desktop/dan-dan-app_1229 복사본/public/BRAINUP/science';

let totalUpdated = 0;

console.log('\n📁 처리 중: science/chem_*');

for (let unit = 2; unit <= 20; unit++) {
  const unitStr = unit.toString().padStart(2, '0');
  const fileName = `chem_${unitStr}.html`;
  const filePath = path.join(baseDir, fileName);

  if (!fs.existsSync(filePath)) {
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf-8');

  // 웹툰 폴더명과 이미지 접두사
  const webtoonFolderName = `화학${unitStr}`;
  const imgPrefix = '화학_';

  // 빈 div 패턴 찾기
  const oldPattern = /<div class="webtoon-dropdown-body" id="webtoonBody">\s*<\/div>/;

  const newImages = `<div class="webtoon-dropdown-body" id="webtoonBody">
                <img data-src="/images/웹툰/${webtoonFolderName}/${imgPrefix}01.jpg" alt="웹툰 힌트 1">
                <img data-src="/images/웹툰/${webtoonFolderName}/${imgPrefix}02.jpg" alt="웹툰 힌트 2">
                <img data-src="/images/웹툰/${webtoonFolderName}/${imgPrefix}03.jpg" alt="웹툰 힌트 3">
                <img data-src="/images/웹툰/${webtoonFolderName}/${imgPrefix}04.jpg" alt="웹툰 힌트 4">
                <img data-src="/images/웹툰/${webtoonFolderName}/${imgPrefix}05.jpg" alt="웹툰 힌트 5">
                <img data-src="/images/웹툰/${webtoonFolderName}/${imgPrefix}06.jpg" alt="웹툰 힌트 6">
                <img data-src="/images/웹툰/${webtoonFolderName}/${imgPrefix}07.jpg" alt="웹툰 힌트 7">
                <img data-src="/images/웹툰/${webtoonFolderName}/${imgPrefix}08.jpg" alt="웹툰 힌트 8">
                <img data-src="/images/웹툰/${webtoonFolderName}/${imgPrefix}09.jpg" alt="웹툰 힌트 9">
              </div>`;

  if (oldPattern.test(content)) {
    const newContent = content.replace(oldPattern, newImages);
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`   ✅ ${fileName} → ${webtoonFolderName}`);
    totalUpdated++;
  } else {
    console.log(`   ⚠️ ${fileName} 패턴 불일치`);
  }
}

console.log(`\n✅ 완료! 업데이트: ${totalUpdated}개`);

const fs = require('fs');
const path = require('path');

const baseDir = '/Users/dandan/Desktop/dan-dan-app_1229 복사본/public/BRAINUP/korlit';

let totalUpdated = 0;

console.log('\n📁 처리 중: korlit/modern_*');

for (let unit = 1; unit <= 40; unit++) {
  const unitStr = unit.toString().padStart(2, '0');
  const fileName = `modern_${unitStr}.html`;
  const filePath = path.join(baseDir, fileName);

  if (!fs.existsSync(filePath)) {
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf-8');

  // 40단원 시리즈: 1-20 → 01-20, 21-40 → 01-20
  const webtoonUnit = unit <= 20 ? unit : unit - 20;
  const webtoonUnitStr = webtoonUnit.toString().padStart(2, '0');
  const webtoonFolderName = `현대문학${webtoonUnitStr}`;
  // 파일명: 현대문학01_01.png 형식
  const imgPrefix = `현대문학${webtoonUnitStr}_`;

  // 이미지 태그 생성 (9개, png)
  let imgTags = [];
  for (let i = 1; i <= 9; i++) {
    const numStr = i.toString().padStart(2, '0');
    imgTags.push(`                <img data-src="/images/웹툰/${webtoonFolderName}/${imgPrefix}${numStr}.png" alt="웹툰 힌트 ${i}">`);
  }

  const newImages = `<div class="webtoon-dropdown-body" id="webtoonBody">\n${imgTags.join('\n')}\n              </div>`;

  // 기존 패턴 찾아서 교체
  const oldPattern = /<div class="webtoon-dropdown-body" id="webtoonBody">\s*(?:<img[^>]+>\s*){1,10}<\/div>/;

  if (oldPattern.test(content)) {
    const newContent = content.replace(oldPattern, newImages);
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`   ✅ ${fileName} → ${webtoonFolderName}/${imgPrefix}XX.png`);
    totalUpdated++;
  } else {
    console.log(`   ⚠️ ${fileName} 패턴 불일치`);
  }
}

console.log(`\n✅ 완료! 업데이트: ${totalUpdated}개`);

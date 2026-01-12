const fs = require('fs');
const path = require('path');

const baseDir = '/Users/dandan/Desktop/dan-dan-app_1229 복사본/public/BRAINUP';

// 각 과목별 정확한 파일명 형식
// imgPattern: 파일명 패턴 (UNIT = 단원번호, NUM = 이미지번호)
const fileConfigs = [
  // science
  { folder: 'science', prefix: 'earth_', webtoonPrefix: '지구과학', imgPattern: '딥지구과학NUM', ext: 'jpg', count: 10 },
  { folder: 'science', prefix: 'bio_', webtoonPrefix: '생물', imgPattern: '생물UNIT_NUM', ext: 'jpg', count: 9 },
  { folder: 'science', prefix: 'chem_', webtoonPrefix: '화학', imgPattern: '화학UNIT_NUM', ext: 'jpg', count: 8 },
  { folder: 'science', prefix: 'physics_', webtoonPrefix: '물리', imgPattern: '물리UNITSHORT_NUM', ext: 'jpg', count: 9 },
  // social
  { folder: 'social', prefix: 'geo_', webtoonPrefix: '지리', imgPattern: '지리UNIT_NUM', ext: 'png', count: 8 },
  { folder: 'social', prefix: 'pol_', webtoonPrefix: '정치경제', imgPattern: '정치경제UNIT_NUM', ext: 'png', count: 8 },
  { folder: 'social', prefix: 'soc_', webtoonPrefix: '사회문화', imgPattern: '사회문화UNIT_NUM', ext: 'jpeg', count: 8 },
  { folder: 'social', prefix: 'law_', webtoonPrefix: '법', imgPattern: '법UNIT_NUM', ext: 'png', count: 8 },
];

let totalUpdated = 0;

for (const config of fileConfigs) {
  console.log(`\n📁 처리 중: ${config.folder}/${config.prefix}*`);

  for (let unit = 1; unit <= 20; unit++) {
    const unitStr = unit.toString().padStart(2, '0');
    const unitShort = unit.toString(); // 0 없는 버전
    const fileName = `${config.prefix}${unitStr}.html`;
    const filePath = path.join(baseDir, config.folder, fileName);

    if (!fs.existsSync(filePath)) {
      continue;
    }

    let content = fs.readFileSync(filePath, 'utf-8');

    // 웹툰 폴더명
    const webtoonFolderName = `${config.webtoonPrefix}${unitStr}`;

    // 이미지 태그 생성
    let imgTags = [];
    for (let i = 1; i <= config.count; i++) {
      const numStr = i.toString().padStart(2, '0');
      let imgName = config.imgPattern
        .replace('UNITSHORT', unitShort)
        .replace('UNIT', unitStr)
        .replace('NUM', numStr);
      imgTags.push(`                <img data-src="/images/웹툰/${webtoonFolderName}/${imgName}.${config.ext}" alt="웹툰 힌트 ${i}">`);
    }

    const newImages = `<div class="webtoon-dropdown-body" id="webtoonBody">\n${imgTags.join('\n')}\n              </div>`;

    // 기존 패턴 (9개 이미지) 찾아서 교체
    const oldPattern = /<div class="webtoon-dropdown-body" id="webtoonBody">\s*(?:<img[^>]+>\s*){1,10}<\/div>/;

    if (oldPattern.test(content)) {
      const newContent = content.replace(oldPattern, newImages);
      fs.writeFileSync(filePath, newContent, 'utf-8');
      console.log(`   ✅ ${fileName} → ${config.count}개 이미지 (${config.ext})`);
      totalUpdated++;
    } else {
      console.log(`   ⚠️ ${fileName} 패턴 불일치`);
    }
  }
}

console.log(`\n✅ 완료! 업데이트: ${totalUpdated}개`);

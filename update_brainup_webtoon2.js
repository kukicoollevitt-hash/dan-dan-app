const fs = require('fs');
const path = require('path');

const baseDir = '/Users/dandan/Desktop/dan-dan-app_1229 복사본/public/BRAINUP';

// social/science 파일 매핑 (<!-- 이미지 준비 중 --> 패턴용)
const fileConfigs = [
  // social
  { folder: 'social', prefix: 'geo_', webtoonPrefix: '지리', units: 20 },
  { folder: 'social', prefix: 'pol_', webtoonPrefix: '정치경제', units: 20 },
  { folder: 'social', prefix: 'soc_', webtoonPrefix: '사회문화', units: 20 },
  { folder: 'social', prefix: 'law_', webtoonPrefix: '법', units: 20 },
  // science
  { folder: 'science', prefix: 'bio_', webtoonPrefix: '생물', units: 20 },
  { folder: 'science', prefix: 'chem_', webtoonPrefix: '화학', units: 20 },
  { folder: 'science', prefix: 'earth_', webtoonPrefix: '지구과학', units: 20 },
  { folder: 'science', prefix: 'physics_', webtoonPrefix: '물리', units: 20 },
];

let totalUpdated = 0;
let totalSkipped = 0;

for (const config of fileConfigs) {
  console.log(`\n📁 처리 중: ${config.folder}/${config.prefix}*`);

  for (let unit = 1; unit <= config.units; unit++) {
    const unitStr = unit.toString().padStart(2, '0');
    const fileName = `${config.prefix}${unitStr}.html`;
    const filePath = path.join(baseDir, config.folder, fileName);

    if (!fs.existsSync(filePath)) {
      continue;
    }

    let content = fs.readFileSync(filePath, 'utf-8');

    // 웹툰 폴더명과 이미지 접두사
    const webtoonFolderName = `${config.webtoonPrefix}${unitStr}`;
    const imgPrefix = `${config.webtoonPrefix}_`;

    // <!-- 이미지 준비 중 --> 패턴 찾기
    const oldPattern = /<div class="webtoon-dropdown-body" id="webtoonBody">\s*<!--\s*이미지 준비 중\s*-->\s*<\/div>/;

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
      totalSkipped++;
    }
  }
}

console.log(`\n✅ 완료! 업데이트: ${totalUpdated}개, 스킵: ${totalSkipped}개`);

const fs = require('fs');
const path = require('path');

const baseDir = '/Users/dandan/Desktop/dan-dan-app_1229 복사본/public/BRAINUP';

// 브레인업 파일 매핑 (파일 접두사 → 웹툰 폴더명)
const fileConfigs = [
  // worldlit
  { folder: 'worldlit', prefix: 'world1_', webtoonPrefix: '세계문학1_', units: 40 },
  { folder: 'worldlit', prefix: 'world2_', webtoonPrefix: '세계문학2_', units: 40 },
  // korlit
  { folder: 'korlit', prefix: 'classic_', webtoonPrefix: '고전문학', units: 40 },
  { folder: 'korlit', prefix: 'modern_', webtoonPrefix: '현대문학', units: 40 },
  // person
  { folder: 'person', prefix: 'people1_', webtoonPrefix: '한국인물', units: 40 },
  { folder: 'person', prefix: 'people2_', webtoonPrefix: '세계인물', units: 40 },
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

    // 웹툰 폴더 단원 계산 (40단원 시리즈는 1-20, 21-40 → 01-20 매핑)
    let webtoonUnit = unit;
    if (config.units === 40) {
      webtoonUnit = unit <= 20 ? unit : unit - 20;
    }
    const webtoonUnitStr = webtoonUnit.toString().padStart(2, '0');

    // 폴더명과 파일명 접두사 결정
    let webtoonFolderName, imgPrefix;
    if (config.webtoonPrefix.includes('_')) {
      // 세계문학1_, 세계문학2_ 형태
      webtoonFolderName = `${config.webtoonPrefix}${webtoonUnitStr}`;
      imgPrefix = config.webtoonPrefix;
    } else {
      // 고전문학, 현대문학, 지리, 물리 등
      webtoonFolderName = `${config.webtoonPrefix}${webtoonUnitStr}`;
      imgPrefix = `${config.webtoonPrefix}_`;
    }

    // 기존 5개 이미지를 찾아서 9개로 교체
    const oldPattern = /<div class="webtoon-dropdown-body" id="webtoonBody">\s*<img[^>]+>\s*<img[^>]+>\s*<img[^>]+>\s*<img[^>]+>\s*<img[^>]+>\s*<\/div>/;

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

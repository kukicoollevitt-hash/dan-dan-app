const fs = require('fs');
const path = require('path');

const baseDir = '/Users/dandan/Desktop/dan-dan-app_1229 복사본/public/BRAINUP';

// 실제 파일명 형식 (브레인업에서 검증됨)
// 과목 | 폴더명 | 파일명 형식 | 확장자 | 개수
// 지구과학 | 지구과학01 | 딥지구과학01.jpg (번호만) | jpg | 10
// 생물 | 생물01 | 생물01_01.jpg | jpg | 9
// 화학 | 화학01 | 화학01_01.jpg | jpg | 8
// 물리 | 물리01 | 물리1_01.jpg (0없음) | jpg | 9
// 지리 | 지리01 | 지리01_01.png | png | 8
// 정치경제 | 정치경제01 | 정치경제01_01.png | png | 8
// 사회문화 | 사회문화01 | 사회문화01_01.jpeg | jpeg | 8
// 법 | 법01 | 법01_01.png | png | 8
// 현대문학 | 현대문학01 | 현대문학01_01.png | png | 9
// 고전문학 | 고전문학01 | 고전문학_01.jpg | jpg | 9
// 한국인물 | 한국인물01 | 한국인물_01.jpg | jpg | 9
// 세계인물 | 세계인물01 | 세계인물_01.jpg | jpg | 9
// 세계문학1 | 세계문학1_01 | 세계문학1_01.jpg | jpg | 9
// 세계문학2 | 세계문학2_01 | 세계문학2_01.jpg | jpg | 9

const configs = [
  // science
  {
    folder: 'science',
    prefix: 'fit_earth_',
    maxUnit: 20,
    wrapAt20: false,
    genImgPath: (unit, imgNum) => {
      const unitStr = unit.toString().padStart(2, '0');
      const numStr = imgNum.toString().padStart(2, '0');
      return `/images/웹툰/지구과학${unitStr}/딥지구과학${numStr}.jpg`;
    },
    count: 10
  },
  {
    folder: 'science',
    prefix: 'fit_bio_',
    maxUnit: 20,
    wrapAt20: false,
    genImgPath: (unit, imgNum) => {
      const unitStr = unit.toString().padStart(2, '0');
      const numStr = imgNum.toString().padStart(2, '0');
      return `/images/웹툰/생물${unitStr}/생물${unitStr}_${numStr}.jpg`;
    },
    count: 9
  },
  {
    folder: 'science',
    prefix: 'fit_chem_',
    maxUnit: 20,
    wrapAt20: false,
    genImgPath: (unit, imgNum) => {
      const unitStr = unit.toString().padStart(2, '0');
      const numStr = imgNum.toString().padStart(2, '0');
      return `/images/웹툰/화학${unitStr}/화학${unitStr}_${numStr}.jpg`;
    },
    count: 8
  },
  {
    folder: 'science',
    prefix: 'fit_physics_',
    maxUnit: 20,
    wrapAt20: false,
    genImgPath: (unit, imgNum) => {
      const unitStr = unit.toString().padStart(2, '0');
      const numStr = imgNum.toString().padStart(2, '0');
      // 물리는 폴더는 01이지만 파일명은 1 (0 없음)
      return `/images/웹툰/물리${unitStr}/물리${unit}_${numStr}.jpg`;
    },
    count: 9
  },

  // social
  {
    folder: 'social',
    prefix: 'fit_geo_',
    maxUnit: 20,
    wrapAt20: false,
    genImgPath: (unit, imgNum) => {
      const unitStr = unit.toString().padStart(2, '0');
      const numStr = imgNum.toString().padStart(2, '0');
      return `/images/웹툰/지리${unitStr}/지리${unitStr}_${numStr}.png`;
    },
    count: 8
  },
  {
    folder: 'social',
    prefix: 'fit_pol_',
    maxUnit: 20,
    wrapAt20: false,
    genImgPath: (unit, imgNum) => {
      const unitStr = unit.toString().padStart(2, '0');
      const numStr = imgNum.toString().padStart(2, '0');
      return `/images/웹툰/정치경제${unitStr}/정치경제${unitStr}_${numStr}.png`;
    },
    count: 8
  },
  {
    folder: 'social',
    prefix: 'fit_soc_',
    maxUnit: 20,
    wrapAt20: false,
    genImgPath: (unit, imgNum) => {
      const unitStr = unit.toString().padStart(2, '0');
      const numStr = imgNum.toString().padStart(2, '0');
      return `/images/웹툰/사회문화${unitStr}/사회문화${unitStr}_${numStr}.jpeg`;
    },
    count: 8
  },
  {
    folder: 'social',
    prefix: 'fit_law_',
    maxUnit: 20,
    wrapAt20: false,
    genImgPath: (unit, imgNum) => {
      const unitStr = unit.toString().padStart(2, '0');
      const numStr = imgNum.toString().padStart(2, '0');
      return `/images/웹툰/법${unitStr}/법${unitStr}_${numStr}.png`;
    },
    count: 8
  },

  // korlit
  {
    folder: 'korlit',
    prefix: 'fit_modern_',
    maxUnit: 40,
    wrapAt20: true,
    genImgPath: (unit, imgNum, webtoonUnit) => {
      const wtUnitStr = webtoonUnit.toString().padStart(2, '0');
      const numStr = imgNum.toString().padStart(2, '0');
      return `/images/웹툰/현대문학${wtUnitStr}/현대문학${wtUnitStr}_${numStr}.png`;
    },
    count: 9
  },
  {
    folder: 'korlit',
    prefix: 'fit_classic_',
    maxUnit: 40,
    wrapAt20: true,
    genImgPath: (unit, imgNum, webtoonUnit) => {
      const wtUnitStr = webtoonUnit.toString().padStart(2, '0');
      const numStr = imgNum.toString().padStart(2, '0');
      return `/images/웹툰/고전문학${wtUnitStr}/고전문학_${numStr}.jpg`;
    },
    count: 9
  },

  // person
  {
    folder: 'person',
    prefix: 'fit_people1_',
    maxUnit: 40,
    wrapAt20: true,
    genImgPath: (unit, imgNum, webtoonUnit) => {
      const wtUnitStr = webtoonUnit.toString().padStart(2, '0');
      const numStr = imgNum.toString().padStart(2, '0');
      return `/images/웹툰/한국인물${wtUnitStr}/한국인물_${numStr}.jpg`;
    },
    count: 9
  },
  {
    folder: 'person',
    prefix: 'fit_people2_',
    maxUnit: 40,
    wrapAt20: true,
    genImgPath: (unit, imgNum, webtoonUnit) => {
      const wtUnitStr = webtoonUnit.toString().padStart(2, '0');
      const numStr = imgNum.toString().padStart(2, '0');
      return `/images/웹툰/세계인물${wtUnitStr}/세계인물_${numStr}.jpg`;
    },
    count: 9
  },

  // worldlit
  {
    folder: 'worldlit',
    prefix: 'fit_world1_',
    maxUnit: 40,
    wrapAt20: true,
    genImgPath: (unit, imgNum, webtoonUnit) => {
      const wtUnitStr = webtoonUnit.toString().padStart(2, '0');
      const numStr = imgNum.toString().padStart(2, '0');
      return `/images/웹툰/세계문학1_${wtUnitStr}/세계문학1_${numStr}.jpg`;
    },
    count: 9
  },
  {
    folder: 'worldlit',
    prefix: 'fit_world2_',
    maxUnit: 40,
    wrapAt20: true,
    genImgPath: (unit, imgNum, webtoonUnit) => {
      const wtUnitStr = webtoonUnit.toString().padStart(2, '0');
      const numStr = imgNum.toString().padStart(2, '0');
      return `/images/웹툰/세계문학2_${wtUnitStr}/세계문학2_${numStr}.jpg`;
    },
    count: 9
  },
];

let totalUpdated = 0;

for (const config of configs) {
  const folderPath = path.join(baseDir, config.folder);
  console.log(`\n📁 처리 중: ${config.folder}/${config.prefix}*`);

  for (let unit = 1; unit <= config.maxUnit; unit++) {
    const unitStr = unit.toString().padStart(2, '0');
    const fileName = `${config.prefix}${unitStr}.html`;
    const filePath = path.join(folderPath, fileName);

    if (!fs.existsSync(filePath)) {
      continue;
    }

    let content = fs.readFileSync(filePath, 'utf-8');

    // 웹툰 이미지가 없으면 스킵
    if (!content.includes('webtoon-dropdown-body')) {
      continue;
    }

    // 웹툰 단원 번호 계산
    let webtoonUnit = unit;
    if (config.wrapAt20 && unit > 20) {
      webtoonUnit = unit - 20;
    }

    // 새 이미지 태그 생성
    let imgTags = [];
    for (let i = 1; i <= config.count; i++) {
      const imgPath = config.genImgPath(unit, i, webtoonUnit);
      imgTags.push(`                <img data-src="${imgPath}" alt="웹툰 힌트 ${i}">`);
    }

    const newBody = `<div class="webtoon-dropdown-body" id="webtoonBody">\n${imgTags.join('\n')}\n              </div>`;

    // 기존 웹툰 바디 교체
    const oldBodyPattern = /<div class="webtoon-dropdown-body" id="webtoonBody">[\s\S]*?<\/div>/;

    if (oldBodyPattern.test(content)) {
      const newContent = content.replace(oldBodyPattern, newBody);
      if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf-8');
        console.log(`   ✅ ${fileName}`);
        totalUpdated++;
      }
    }
  }
}

console.log(`\n✅ 완료! 이미지 경로 수정: ${totalUpdated}개`);

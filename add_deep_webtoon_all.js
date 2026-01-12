const fs = require('fs');
const path = require('path');

const baseDir = '/Users/dandan/Desktop/dan-dan-app_1229 복사본/public/BRAINUP';

// 웹툰 스크립트 (bio 파일과 동일)
const webtoonScript = `
<!-- 웹툰힌트 드롭다운 스크립트 -->
<script>
let webtoonImagesLoaded = false;

function loadWebtoonImages() {
  if (webtoonImagesLoaded) return;
  const images = document.querySelectorAll('#webtoonBody img[data-src]');
  images.forEach(img => {
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
  });
  webtoonImagesLoaded = true;
}

function toggleWebtoonDropdown() {
  const btn = document.getElementById('webtoonHintBtn');
  const dropdown = document.getElementById('webtoonDropdown');
  const isOpening = !dropdown.classList.contains('active');

  btn.classList.toggle('active');
  dropdown.classList.toggle('active');

  if (isOpening) {
    loadWebtoonImages();
  }
}
function closeWebtoonDropdown() {
  const btn = document.getElementById('webtoonHintBtn');
  const dropdown = document.getElementById('webtoonDropdown');
  btn.classList.remove('active');
  dropdown.classList.remove('active');
}
document.addEventListener('click', function(e) {
  const container = document.querySelector('.webtoon-hint-container');
  if (container && !container.contains(e.target)) {
    closeWebtoonDropdown();
  }
});
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeWebtoonDropdown();
});
</script>
`;

// 설정: 폴더, prefix, 이미지 경로 생성 함수
const configs = [
  // korlit
  {
    folder: 'korlit',
    prefix: 'deep_modern_',
    maxUnit: 40,
    wrapAt20: true,
    genImgPath: (unit, imgNum, webtoonUnit) => {
      const wtUnitStr = webtoonUnit.toString().padStart(2, '0');
      const numStr = imgNum.toString().padStart(2, '0');
      return '/images/웹툰/현대문학' + wtUnitStr + '/현대문학' + wtUnitStr + '_' + numStr + '.png';
    },
    count: 9
  },
  {
    folder: 'korlit',
    prefix: 'deep_classic_',
    maxUnit: 40,
    wrapAt20: true,
    genImgPath: (unit, imgNum, webtoonUnit) => {
      const wtUnitStr = webtoonUnit.toString().padStart(2, '0');
      const numStr = imgNum.toString().padStart(2, '0');
      return '/images/웹툰/고전문학' + wtUnitStr + '/고전문학_' + numStr + '.jpg';
    },
    count: 9
  },
  // person
  {
    folder: 'person',
    prefix: 'deep_people1_',
    maxUnit: 40,
    wrapAt20: true,
    genImgPath: (unit, imgNum, webtoonUnit) => {
      const wtUnitStr = webtoonUnit.toString().padStart(2, '0');
      const numStr = imgNum.toString().padStart(2, '0');
      return '/images/웹툰/한국인물' + wtUnitStr + '/한국인물_' + numStr + '.jpg';
    },
    count: 9
  },
  {
    folder: 'person',
    prefix: 'deep_people2_',
    maxUnit: 40,
    wrapAt20: true,
    genImgPath: (unit, imgNum, webtoonUnit) => {
      const wtUnitStr = webtoonUnit.toString().padStart(2, '0');
      const numStr = imgNum.toString().padStart(2, '0');
      return '/images/웹툰/세계인물' + wtUnitStr + '/세계인물_' + numStr + '.jpg';
    },
    count: 9
  },
  // worldlit
  {
    folder: 'worldlit',
    prefix: 'deep_world1_',
    maxUnit: 40,
    wrapAt20: true,
    genImgPath: (unit, imgNum, webtoonUnit) => {
      const wtUnitStr = webtoonUnit.toString().padStart(2, '0');
      const numStr = imgNum.toString().padStart(2, '0');
      return '/images/웹툰/세계문학1_' + wtUnitStr + '/세계문학1_' + numStr + '.jpg';
    },
    count: 9
  },
  {
    folder: 'worldlit',
    prefix: 'deep_world2_',
    maxUnit: 40,
    wrapAt20: true,
    genImgPath: (unit, imgNum, webtoonUnit) => {
      const wtUnitStr = webtoonUnit.toString().padStart(2, '0');
      const numStr = imgNum.toString().padStart(2, '0');
      return '/images/웹툰/세계문학2_' + wtUnitStr + '/세계문학2_' + numStr + '.jpg';
    },
    count: 9
  },
];

function getWebtoonHtml(config, unit) {
  let webtoonUnit = unit;
  if (config.wrapAt20 && unit > 20) {
    webtoonUnit = unit - 20;
  }

  let imgTags = [];
  for (let i = 1; i <= config.count; i++) {
    const imgPath = config.genImgPath(unit, i, webtoonUnit);
    imgTags.push('                <img data-src="' + imgPath + '" alt="웹툰 힌트 ' + i + '">');
  }

  return `
          <!-- 웹툰 힌트 -->
          <div class="webtoon-hint-container">
            <a href="#" class="webtoon-hint-btn" id="webtoonHintBtn" onclick="toggleWebtoonDropdown(); return false;">웹툰힌트 <span class="arrow">▼</span></a>
            <div class="webtoon-dropdown" id="webtoonDropdown">
              <div class="webtoon-dropdown-header">
                <span>📖 배경지식 쉽게 익히기</span>
                <button class="webtoon-dropdown-close" onclick="closeWebtoonDropdown()">&times;</button>
              </div>
              <div class="webtoon-dropdown-body" id="webtoonBody">
` + imgTags.join('\n') + `
              </div>
            </div>
          </div>`;
}

let totalUpdated = 0;

for (const config of configs) {
  const folderPath = path.join(baseDir, config.folder);
  console.log('\n📁 처리 중: ' + config.folder + '/' + config.prefix + '*');

  for (let unit = 1; unit <= config.maxUnit; unit++) {
    const unitStr = unit.toString().padStart(2, '0');
    const fileName = config.prefix + unitStr + '.html';
    const filePath = path.join(folderPath, fileName);

    if (!fs.existsSync(filePath)) {
      continue;
    }

    let content = fs.readFileSync(filePath, 'utf-8');
    let changed = false;

    // 1. 이미 웹툰 버튼이 있으면 스킵
    if (content.includes('<div class="webtoon-hint-container">')) {
      continue;
    }

    // 2. passage-wrap 뒤에 웹툰 HTML 추가
    const webtoonHtml = getWebtoonHtml(config, unit);

    if (content.includes('<div class="passage-wrap">')) {
      content = content.replace(
        '<div class="passage-wrap">',
        '<div class="passage-wrap">' + webtoonHtml
      );
      changed = true;
    }

    // 3. 웹툰 스크립트 추가 (없으면)
    if (!content.includes('<!-- 웹툰힌트 드롭다운 스크립트 -->') && content.includes('</body>')) {
      content = content.replace('</body>', webtoonScript + '\n</body>');
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log('   ✅ ' + fileName);
      totalUpdated++;
    }
  }
}

console.log('\n✅ 완료! 추가: ' + totalUpdated + '개');

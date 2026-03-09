const fs = require('fs');
const path = require('path');

const baseDir = '/Users/dandan/Desktop/dan-dan-app_1229 복사본/public/BRAINUP';

// 브레인온 스타일 CSS
const webtoonCss = `
/* ===== 웹툰 힌트 스타일 ===== */
.webtoon-hint-container {
  position: absolute;
  top: 12px;
  right: 12px;
}
.webtoon-hint-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: linear-gradient(135deg, #ff6b6b, #ffa502);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(255,107,107,0.3);
  transition: all 0.2s;
}
.webtoon-hint-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255,107,107,0.4);
}
.webtoon-hint-btn.active {
  background: linear-gradient(135deg, #ee5a5a, #ff8c00);
}
.webtoon-dropdown { position: absolute; top: 100%; right: 0; width: 600px; max-height: 0; overflow: hidden; background: #fffbe6; border-radius: 0 0 16px 16px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15); transition: max-height 0.4s ease, opacity 0.3s ease; opacity: 0; }
.webtoon-dropdown.active { max-height: 70vh; opacity: 1; border: 2px solid #e6b800; border-top: none; }
.webtoon-dropdown-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #fff8cc; border-bottom: 1px solid #e6b800; position: sticky; top: 0; z-index: 1; }
.webtoon-dropdown-header span { font-size: 14px; font-weight: 600; color: #6b5000; }
.webtoon-dropdown-close { background: rgba(0,0,0,0.1); border: none; width: 28px; height: 28px; border-radius: 50%; font-size: 18px; color: #6b5000; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.webtoon-dropdown-close:hover { background: rgba(0,0,0,0.2); }
.webtoon-dropdown-body { max-height: calc(70vh - 50px); overflow-y: auto; -webkit-overflow-scrolling: touch; }
.webtoon-dropdown-body img { display: block; width: 100%; height: auto; }
@media (max-width: 600px) { .webtoon-dropdown { width: 90vw; right: -10px; } }
`;

// 웹툰 스크립트
const webtoonScript = `
<!-- 웹툰 힌트 스크립트 -->
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
  if (isOpening) loadWebtoonImages();
}
function closeWebtoonDropdown() {
  const btn = document.getElementById('webtoonHintBtn');
  const dropdown = document.getElementById('webtoonDropdown');
  btn.classList.remove('active');
  dropdown.classList.remove('active');
}
document.addEventListener('click', function(e) {
  const container = document.querySelector('.webtoon-hint-container');
  if (container && !container.contains(e.target)) { closeWebtoonDropdown(); }
});
</script>
`;

// 파일 설정 (브레인업에서 검증된 실제 파일명 형식)
const fileConfigs = [
  // science
  { folder: 'science', prefix: 'fit_earth_', webtoonFolder: '지구과학', imgPattern: '딥지구과학', ext: 'jpg', count: 10, maxUnit: 20, useUnitInImg: false },
  { folder: 'science', prefix: 'fit_bio_', webtoonFolder: '생물', imgPattern: '생물', ext: 'jpg', count: 9, maxUnit: 20, useUnitInImg: true },
  { folder: 'science', prefix: 'fit_chem_', webtoonFolder: '화학', imgPattern: '화학', ext: 'jpg', count: 8, maxUnit: 20, useUnitInImg: true },
  { folder: 'science', prefix: 'fit_physics_', webtoonFolder: '물리', imgPattern: '물리', ext: 'jpg', count: 9, maxUnit: 20, useUnitInImg: true, noZeroPadUnit: true },

  // social
  { folder: 'social', prefix: 'fit_geo_', webtoonFolder: '지리', imgPattern: '지리', ext: 'png', count: 8, maxUnit: 20, useUnitInImg: true },
  { folder: 'social', prefix: 'fit_pol_', webtoonFolder: '정치경제', imgPattern: '정치경제', ext: 'png', count: 8, maxUnit: 20, useUnitInImg: true },
  { folder: 'social', prefix: 'fit_soc_', webtoonFolder: '사회문화', imgPattern: '사회문화', ext: 'jpeg', count: 8, maxUnit: 20, useUnitInImg: true },
  { folder: 'social', prefix: 'fit_law_', webtoonFolder: '법', imgPattern: '법', ext: 'png', count: 8, maxUnit: 20, useUnitInImg: true },

  // korlit
  { folder: 'korlit', prefix: 'fit_modern_', webtoonFolder: '현대문학', imgPattern: '현대문학', ext: 'png', count: 9, maxUnit: 40, useUnitInImg: true, wrapAt20: true },
  { folder: 'korlit', prefix: 'fit_classic_', webtoonFolder: '고전문학', imgPattern: '고전문학_', ext: 'jpg', count: 9, maxUnit: 40, useUnitInImg: false, wrapAt20: true },

  // person
  { folder: 'person', prefix: 'fit_people1_', webtoonFolder: '한국인물', imgPattern: '한국인물_', ext: 'jpg', count: 9, maxUnit: 40, useUnitInImg: false, wrapAt20: true },
  { folder: 'person', prefix: 'fit_people2_', webtoonFolder: '세계인물', imgPattern: '세계인물_', ext: 'jpg', count: 9, maxUnit: 40, useUnitInImg: false, wrapAt20: true },

  // worldlit
  { folder: 'worldlit', prefix: 'fit_world1_', webtoonFolder: '세계문학1_', imgPattern: '세계문학1_', ext: 'jpg', count: 9, maxUnit: 40, useUnitInImg: false, wrapAt20: true },
  { folder: 'worldlit', prefix: 'fit_world2_', webtoonFolder: '세계문학2_', imgPattern: '세계문학2_', ext: 'jpg', count: 9, maxUnit: 40, useUnitInImg: false, wrapAt20: true },
];

let totalUpdated = 0;
let totalSkipped = 0;

for (const config of fileConfigs) {
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

    // 이미 적용되어 있으면 스킵
    if (content.includes('webtoon-hint-container')) {
      totalSkipped++;
      continue;
    }

    // 웹툰 폴더 번호 계산 (40단원 시리즈는 21-40이 01-20으로 매핑)
    let webtoonUnit = unit;
    if (config.wrapAt20 && unit > 20) {
      webtoonUnit = unit - 20;
    }
    const webtoonUnitStr = webtoonUnit.toString().padStart(2, '0');

    // 폴더명 생성
    const webtoonFolderName = `${config.webtoonFolder}${webtoonUnitStr}`;

    // 이미지 태그 생성
    let imgTags = [];
    for (let i = 1; i <= config.count; i++) {
      const numStr = i.toString().padStart(2, '0');
      let imgName;

      if (config.useUnitInImg) {
        // 생물01_01.jpg 형식
        if (config.noZeroPadUnit) {
          imgName = `${config.imgPattern}${webtoonUnit}_${numStr}.${config.ext}`;
        } else {
          imgName = `${config.imgPattern}${webtoonUnitStr}_${numStr}.${config.ext}`;
        }
      } else if (config.imgPattern === '딥지구과학') {
        // 딥지구과학01.jpg 형식 (번호만)
        imgName = `${config.imgPattern}${numStr}.${config.ext}`;
      } else {
        // 고전문학_01.jpg, 세계인물_01.jpg 형식
        imgName = `${config.imgPattern}${numStr}.${config.ext}`;
      }

      imgTags.push(`                <img data-src="/images/웹툰/${webtoonFolderName}/${imgName}" alt="웹툰 힌트 ${i}">`);
    }

    const webtoonHtml = `
          <!-- 웹툰 힌트 -->
          <div class="webtoon-hint-container">
            <button class="webtoon-hint-btn" id="webtoonHintBtn" onclick="toggleWebtoonDropdown()">
              📖 웹툰보기
            </button>
            <div class="webtoon-dropdown" id="webtoonDropdown">
              <div class="webtoon-dropdown-header">
                <span>📖 배경지식 쉽게 익히기</span>
                <button class="webtoon-dropdown-close" onclick="closeWebtoonDropdown()">&times;</button>
              </div>
              <div class="webtoon-dropdown-body" id="webtoonBody">
${imgTags.join('\n')}
              </div>
            </div>
          </div>`;

    let changed = false;

    // 1. CSS 추가 (</style> 앞에)
    if (!content.includes('.webtoon-hint-container')) {
      content = content.replace('</style>', webtoonCss + '\n</style>');
      changed = true;
    }

    // 2. HTML 추가 (passage-wrap 시작 후)
    const patterns = [
      /<div class="passage-wrap">\s*\n\s*<!-- ✅ 라벨/,
      /<div class="passage-wrap">\s*\n\s*<div class="passage-label">/
    ];

    for (const pattern of patterns) {
      if (pattern.test(content)) {
        const replacement = pattern.source.includes('<!-- ✅ 라벨')
          ? `<div class="passage-wrap">${webtoonHtml}\n          <!-- ✅ 라벨`
          : `<div class="passage-wrap">${webtoonHtml}\n          <div class="passage-label">`;
        content = content.replace(pattern, replacement);
        changed = true;
        break;
      }
    }

    // 3. 스크립트 추가 (</body> 앞에)
    if (!content.includes('function toggleWebtoonDropdown')) {
      content = content.replace('</body>', webtoonScript + '\n</body>');
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`   ✅ ${fileName} → ${webtoonFolderName}`);
      totalUpdated++;
    }
  }
}

console.log(`\n✅ 완료! 업데이트: ${totalUpdated}개, 스킵(이미 적용): ${totalSkipped}개`);

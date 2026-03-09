const fs = require('fs');
const path = require('path');

const baseDir = '/Users/dandan/Desktop/dan-dan-app_1229 복사본/public/BRAINFIT/person';

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

let totalUpdated = 0;

console.log('\n📁 처리 중: BRAINFIT/person/fit_people2_*');

for (let unit = 1; unit <= 40; unit++) {
  const unitStr = unit.toString().padStart(2, '0');
  const fileName = `fit_people2_${unitStr}.html`;
  const filePath = path.join(baseDir, fileName);

  if (!fs.existsSync(filePath)) {
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf-8');

  // 이미 적용되어 있으면 스킵
  if (content.includes('webtoon-hint-container')) {
    console.log(`   ⏭️ ${fileName} (이미 적용됨)`);
    continue;
  }

  // fit_people2는 세계인물 콘텐츠
  // 단원 번호: 1-20은 세계인물01-20, 21-40은 세계인물21-40 (그러나 실제 이미지 폴더가 01-20까지만 있으면 조정 필요)
  // 기존 브레인업 로직: people2 단원은 세계인물, 단원번호 그대로 사용
  const webtoonFolderName = `세계인물${unitStr}`;

  // 이미지 태그 생성 (9개, jpg)
  let imgTags = [];
  for (let i = 1; i <= 9; i++) {
    const numStr = i.toString().padStart(2, '0');
    imgTags.push(`                <img data-src="/images/웹툰/${webtoonFolderName}/세계인물_${numStr}.jpg" alt="웹툰 힌트 ${i}">`);
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
  const passageWrapPattern = /<div class="passage-wrap">\s*\n\s*<!-- ✅ 라벨/;
  if (passageWrapPattern.test(content)) {
    content = content.replace(passageWrapPattern, `<div class="passage-wrap">${webtoonHtml}\n          <!-- ✅ 라벨`);
    changed = true;
  } else {
    // 다른 패턴 시도
    const passageWrapPattern2 = /<div class="passage-wrap">\s*\n\s*<div class="passage-label">/;
    if (passageWrapPattern2.test(content)) {
      content = content.replace(passageWrapPattern2, `<div class="passage-wrap">${webtoonHtml}\n          <div class="passage-label">`);
      changed = true;
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

console.log(`\n✅ 완료! 업데이트: ${totalUpdated}개`);

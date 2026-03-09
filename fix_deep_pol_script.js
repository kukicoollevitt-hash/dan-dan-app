const fs = require('fs');
const path = require('path');

const baseDir = '/Users/dandan/Desktop/dan-dan-app_1229 복사본/public/BRAINUP/social';

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

  // 열릴 때만 이미지 로딩
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
// 외부 클릭시 닫기
document.addEventListener('click', function(e) {
  const container = document.querySelector('.webtoon-hint-container');
  if (container && !container.contains(e.target)) {
    closeWebtoonDropdown();
  }
});
// ESC 키로 닫기
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeWebtoonDropdown();
});
</script>
`;

let totalUpdated = 0;

for (let unit = 1; unit <= 20; unit++) {
  const unitStr = unit.toString().padStart(2, '0');
  const fileName = 'deep_pol_' + unitStr + '.html';
  const filePath = path.join(baseDir, fileName);

  if (!fs.existsSync(filePath)) {
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf-8');

  // 1. 기존 스크립트 안의 웹툰 함수 블록 제거 (// === 웹툰 힌트 드롭다운 === 부터 끝까지)
  const oldScriptPattern = /\n\s*\/\/ === 웹툰 힌트 드롭다운 ===[\s\S]*?closeWebtoonDropdown\(\);\s*\}\s*\}\);/g;
  if (oldScriptPattern.test(content)) {
    content = content.replace(oldScriptPattern, '');
  }

  // window. 버전도 제거
  const windowPattern = /\n\s*window\.webtoonImagesLoaded[\s\S]*?window\.closeWebtoonDropdown\(\);\s*\}\s*\}\);/g;
  if (windowPattern.test(content)) {
    content = content.replace(windowPattern, '');
  }

  // 2. 이미 별도 스크립트가 있으면 스킵
  if (content.includes('<!-- 웹툰힌트 드롭다운 스크립트 -->')) {
    console.log('   ⏭️ ' + fileName + ' (이미 있음)');
    continue;
  }

  // 3. </body> 앞에 웹툰 스크립트 추가
  if (content.includes('</body>')) {
    content = content.replace('</body>', webtoonScript + '\n</body>');
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('   ✅ ' + fileName);
    totalUpdated++;
  }
}

console.log('\n✅ 완료! 수정: ' + totalUpdated + '개');

const fs = require('fs');
const path = require('path');

const baseDir = '/Users/dandan/Desktop/dan-dan-app_1229 복사본/public/BRAINUP/social';

let totalUpdated = 0;

for (let unit = 1; unit <= 20; unit++) {
  const unitStr = unit.toString().padStart(2, '0');
  const fileName = 'deep_pol_' + unitStr + '.html';
  const filePath = path.join(baseDir, fileName);

  if (!fs.existsSync(filePath)) {
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf-8');

  // 기존 웹툰 함수들이 있으면 전역으로 변경
  // function toggleWebtoonDropdown -> window.toggleWebtoonDropdown = function
  if (content.includes('function toggleWebtoonDropdown()') && !content.includes('window.toggleWebtoonDropdown')) {
    content = content.replace(
      'let webtoonImagesLoaded = false;',
      'window.webtoonImagesLoaded = false;'
    );
    content = content.replace(
      'function loadWebtoonImages()',
      'window.loadWebtoonImages = function()'
    );
    content = content.replace(
      'function toggleWebtoonDropdown()',
      'window.toggleWebtoonDropdown = function()'
    );
    content = content.replace(
      'function closeWebtoonDropdown()',
      'window.closeWebtoonDropdown = function()'
    );
    content = content.replace(
      /if \(isOpening\) \{ loadWebtoonImages\(\); \}/g,
      'if (isOpening) { window.loadWebtoonImages(); }'
    );

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('   ✅ ' + fileName);
    totalUpdated++;
  } else {
    console.log('   ⏭️ ' + fileName + ' (이미 수정됨 또는 함수 없음)');
  }
}

console.log('\n✅ 완료! 수정: ' + totalUpdated + '개');

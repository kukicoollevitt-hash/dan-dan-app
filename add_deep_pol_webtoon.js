const fs = require('fs');
const path = require('path');

const baseDir = '/Users/dandan/Desktop/dan-dan-app_1229 복사본/public/BRAINUP/social';

// 웹툰 HTML 템플릿
function getWebtoonHtml(unit) {
  const unitStr = unit.toString().padStart(2, '0');
  let imgTags = [];
  for (let i = 1; i <= 8; i++) {
    const numStr = i.toString().padStart(2, '0');
    imgTags.push('                <img data-src="/images/웹툰/정치경제' + unitStr + '/정치경제' + unitStr + '_' + numStr + '.png" alt="웹툰 힌트 ' + i + '">');
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

for (let unit = 1; unit <= 20; unit++) {
  const unitStr = unit.toString().padStart(2, '0');
  const fileName = 'deep_pol_' + unitStr + '.html';
  const filePath = path.join(baseDir, fileName);

  if (!fs.existsSync(filePath)) {
    console.log('   ⚠️ ' + fileName + ' 파일 없음');
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf-8');

  // 이미 웹툰 버튼이 있으면 스킵
  if (content.includes('<div class="webtoon-hint-container">')) {
    console.log('   ⏭️ ' + fileName + ' (이미 있음)');
    continue;
  }

  // passage-wrap 뒤에 웹툰 HTML 추가
  const webtoonHtml = getWebtoonHtml(unit);

  // <div class="passage-wrap"> 바로 뒤에 추가
  if (content.includes('<div class="passage-wrap">')) {
    content = content.replace(
      '<div class="passage-wrap">',
      '<div class="passage-wrap">' + webtoonHtml
    );
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('   ✅ ' + fileName);
    totalUpdated++;
  } else {
    console.log('   ⚠️ ' + fileName + ' (passage-wrap 없음)');
  }
}

console.log('\n✅ 완료! 추가: ' + totalUpdated + '개');

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

  // <a href="#" ...> 를 <button ...>으로 변경
  if (content.includes('<a href="#" class="webtoon-hint-btn"')) {
    content = content.replace(
      /<a href="#" class="webtoon-hint-btn" id="webtoonHintBtn" onclick="toggleWebtoonDropdown\(\); return false;">웹툰힌트 <span class="arrow">▼<\/span><\/a>/g,
      '<button class="webtoon-hint-btn" id="webtoonHintBtn" onclick="toggleWebtoonDropdown()">웹툰힌트 <span class="arrow">▼</span></button>'
    );
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('   ✅ ' + fileName);
    totalUpdated++;
  }
}

console.log('\n✅ 완료! 수정: ' + totalUpdated + '개');

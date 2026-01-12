const fs = require('fs');
const path = require('path');

const baseDir = '/Users/dandan/Desktop/dan-dan-app_1229 복사본/public/BRAINUP/korlit';

let totalUpdated = 0;

const files = fs.readdirSync(baseDir).filter(f => f.startsWith('classic_') && f.endsWith('.html'));

console.log(`\n📁 처리 중: korlit/classic_* (${files.length}개 파일)`);

for (const file of files) {
  const filePath = path.join(baseDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;

  // h4 → span 교체
  if (content.includes('<h4>📖 웹툰 힌트</h4>')) {
    content = content.replace('<h4>📖 웹툰 힌트</h4>', '<span>📖 배경지식 쉽게 익히기</span>');
    changed = true;
  }

  // webtoon-close-btn → webtoon-dropdown-close 교체
  if (content.includes('webtoon-close-btn')) {
    content = content.replace(/class="webtoon-close-btn"/g, 'class="webtoon-dropdown-close"');
    content = content.replace(/>✕<\/button>/, '>&times;</button>');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`   ✅ ${file}`);
    totalUpdated++;
  }
}

console.log(`\n✅ 완료! 업데이트: ${totalUpdated}개`);

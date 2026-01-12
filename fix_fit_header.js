const fs = require('fs');
const path = require('path');

const baseDir = '/Users/dandan/Desktop/dan-dan-app_1229 복사본/public/BRAINUP';
const folders = ['science', 'social', 'korlit', 'person', 'worldlit'];

let totalUpdated = 0;

for (const folder of folders) {
  const folderPath = path.join(baseDir, folder);
  const files = fs.readdirSync(folderPath).filter(f => f.startsWith('fit_') && f.endsWith('.html'));

  console.log(`\n📁 처리 중: ${folder} (${files.length}개 fit_ 파일)`);

  for (const file of files) {
    const filePath = path.join(folderPath, file);
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
      content = content.replace(/>✕<\/button>/g, '>&times;</button>');
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`   ✅ ${file}`);
      totalUpdated++;
    }
  }
}

console.log(`\n✅ 완료! 헤더 수정: ${totalUpdated}개`);

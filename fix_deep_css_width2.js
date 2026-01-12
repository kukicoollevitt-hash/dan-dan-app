const fs = require('fs');
const path = require('path');

const baseDir = '/Users/dandan/Desktop/dan-dan-app_1229 복사본/public/BRAINUP';
const folders = ['science', 'social', 'korlit', 'person', 'worldlit'];

let totalUpdated = 0;

for (const folder of folders) {
  const folderPath = path.join(baseDir, folder);
  const files = fs.readdirSync(folderPath).filter(f => f.startsWith('deep_') && f.endsWith('.html') && !f.includes('backup'));

  console.log(`\n📁 처리 중: ${folder} (${files.length}개)`);

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    let changed = false;

    // 480px → 600px 수정 (여러 줄 CSS에서)
    if (content.includes('width: 480px')) {
      content = content.replace(/width: 480px/g, 'width: 600px');
      changed = true;
    }
    
    // 320px → 600px 수정
    if (content.includes('width: 320px')) {
      content = content.replace(/width: 320px/g, 'width: 600px');
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`   ✅ ${file}`);
      totalUpdated++;
    }
  }
}

console.log(`\n✅ 완료! 수정: ${totalUpdated}개`);

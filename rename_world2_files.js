const fs = require('fs');
const path = require('path');

const baseDir = '/Users/dandan/Desktop/dan-dan-app_1229 복사본/public/images/웹툰';

// 04부터 20까지 처리
for (let unit = 4; unit <= 20; unit++) {
  const unitStr = unit.toString().padStart(2, '0');
  const folderName = `세계문학2_${unitStr}`;
  const folderPath = path.join(baseDir, folderName);

  if (!fs.existsSync(folderPath)) {
    console.log(`❌ 폴더 없음: ${folderName}`);
    continue;
  }

  console.log(`\n📁 처리 중: ${folderName}`);

  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    // 세계문학(2)_01.jpg → 세계문학2_01.jpg
    if (file.startsWith('세계문학(2)_') && file.endsWith('.jpg')) {
      const imgNum = file.replace('세계문학(2)_', '').replace('.jpg', '');
      const newFileName = `세계문학2_${imgNum}.jpg`;
      const oldPath = path.join(folderPath, file);
      const newPath = path.join(folderPath, newFileName);

      fs.renameSync(oldPath, newPath);
      console.log(`   ✅ ${file} → ${newFileName}`);
    }
  }
}

console.log('\n✅ 파일명 변경 완료!');

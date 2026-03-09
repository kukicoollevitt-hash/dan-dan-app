const fs = require('fs');
const path = require('path');

const baseDir = '/Users/dandan/Desktop/dan-dan-app_1229 복사본/public/BRAINFIT/person';

let totalUpdated = 0;

console.log('\n📁 수정 중: BRAINFIT/person/fit_people2_21~40 이미지 경로');

// 21-40 단원은 01-20 이미지 사용 (브레인업과 동일)
for (let unit = 21; unit <= 40; unit++) {
  const unitStr = unit.toString().padStart(2, '0');
  const fileName = `fit_people2_${unitStr}.html`;
  const filePath = path.join(baseDir, fileName);

  if (!fs.existsSync(filePath)) {
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf-8');

  // 21-40 → 01-20 매핑
  const mappedUnit = unit - 20;
  const mappedUnitStr = mappedUnit.toString().padStart(2, '0');

  // 기존 잘못된 경로 (세계인물21~40)
  const oldFolder = `세계인물${unitStr}`;
  // 올바른 경로 (세계인물01~20)
  const newFolder = `세계인물${mappedUnitStr}`;

  if (content.includes(oldFolder)) {
    content = content.replace(new RegExp(oldFolder, 'g'), newFolder);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`   ✅ ${fileName}: ${oldFolder} → ${newFolder}`);
    totalUpdated++;
  }
}

console.log(`\n✅ 완료! 수정: ${totalUpdated}개`);

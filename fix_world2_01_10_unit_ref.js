const fs = require('fs');
const path = require('path');

// world2_01~10 파일에서 ${unit} 참조를 ${window.CUR_UNIT}으로 수정

for (let i = 1; i <= 10; i++) {
  const num = String(i).padStart(2, '0');
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'worldlit', `world2_${num}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // vocab-state 패턴 수정
  const oldVocabPattern = 'const stateKey = `vocab-state:${stuKey}:${unit}`;';
  const newVocabPattern = 'const stateKey = `vocab-state:${stuKey}:${window.CUR_UNIT}`;';

  if (content.includes(oldVocabPattern)) {
    content = content.replace(new RegExp(oldVocabPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newVocabPattern);
    console.log(`[OK] world2_${num} vocab-state \${unit} → window.CUR_UNIT`);
    modified = true;
  }

  // current-geo-tab 패턴 수정
  const oldGeoPattern = 'localStorage.setItem(`current-geo-tab:${unit}`, target);';
  const newGeoPattern = 'localStorage.setItem(`current-geo-tab:${window.CUR_UNIT}`, target);';

  if (content.includes(oldGeoPattern)) {
    content = content.replace(new RegExp(oldGeoPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newGeoPattern);
    console.log(`[OK] world2_${num} current-geo-tab \${unit} → window.CUR_UNIT`);
    modified = true;
  }

  // creative-state 패턴 수정 (있을 경우)
  const oldCreativePattern = 'const stateKey = `creative-state:${stuKey}:${unit}`;';
  const newCreativePattern = 'const stateKey = `creative-state:${stuKey}:${window.CUR_UNIT}`;';

  if (content.includes(oldCreativePattern)) {
    content = content.replace(new RegExp(oldCreativePattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newCreativePattern);
    console.log(`[OK] world2_${num} creative-state \${unit} → window.CUR_UNIT`);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
  } else {
    console.log(`[SKIP] world2_${num} 이미 수정되었거나 패턴 불일치`);
  }
}

console.log('\n✅ world2_01~10 unit 참조 수정 완료!');

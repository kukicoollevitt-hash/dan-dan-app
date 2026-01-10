const fs = require('fs');
const path = require('path');

// classic 파일들에서 ${unit} → ${window.CUR_UNIT} 수정
// loadVocabState, saveVocabState 함수에서 unit 변수가 스코프 밖에 있어서 오류 발생

const files = fs.readdirSync(path.join(__dirname, 'public', 'BRAINUP', 'korlit'))
  .filter(f => f.startsWith('classic_') && f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'korlit', file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // vocab-state:${stuKey}:${unit} → vocab-state:${stuKey}:${window.CUR_UNIT}
  const oldPattern = 'vocab-state:${stuKey}:${unit}';
  const newPattern = 'vocab-state:${stuKey}:${window.CUR_UNIT}';

  if (content.includes(oldPattern)) {
    content = content.replace(new RegExp(oldPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newPattern);
    console.log(`[OK] ${file} - unit → window.CUR_UNIT 수정`);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
  } else {
    console.log(`[SKIP] ${file} - 이미 수정되었거나 패턴 없음`);
  }
});

console.log('\n✅ unit 참조 수정 완료!');

const fs = require('fs');
const path = require('path');

// classic 파일들에서 모든 ${unit} → ${window.CUR_UNIT} 수정

const files = fs.readdirSync(path.join(__dirname, 'public', 'BRAINUP', 'korlit'))
  .filter(f => f.startsWith('classic_') && f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'korlit', file);
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // 모든 ${unit} → ${window.CUR_UNIT} 변경 (백틱 문자열 내에서)
  content = content.replace(/\$\{unit\}/g, '${window.CUR_UNIT}');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[OK] ${file} - 남은 \${unit} 패턴 수정`);
  } else {
    console.log(`[SKIP] ${file} - 남은 패턴 없음`);
  }
});

console.log('\n✅ 모든 ${unit} 참조 수정 완료!');

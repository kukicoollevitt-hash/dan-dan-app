const fs = require('fs');
const path = require('path');

// world2_01~10 파일에서 중복 인라인 REMEDIAL_BANK 제거 및 참조 수정

for (let i = 1; i <= 10; i++) {
  const num = String(i).padStart(2, '0');
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'worldlit', `world2_${num}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  const inlineRemedialPattern = /\/\/ ===== 보완학습 문제 뱅크 \(객관식 2문제씩\) =====\s*(?:const |window\.)?REMEDIAL_BANK = \{[\s\S]*?\};\s*(?=\/\/|function|let|const|var|\n\s*\n)/;

  if (inlineRemedialPattern.test(content)) {
    content = content.replace(inlineRemedialPattern, '');
    console.log(`[OK] world2_${num} 인라인 REMEDIAL_BANK 블록 제거`);
    modified = true;
  }

  const oldRef1 = 'const data = REMEDIAL_BANK[key];';
  const newRef1 = 'const data = window.REMEDIAL_BANK[key];';

  if (content.includes(oldRef1)) {
    content = content.replace(new RegExp(oldRef1.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newRef1);
    console.log(`[OK] world2_${num} REMEDIAL_BANK[key] → window.REMEDIAL_BANK[key]`);
    modified = true;
  }

  const oldRef2 = 'for (const key in REMEDIAL_BANK)';
  const newRef2 = 'for (const key in window.REMEDIAL_BANK)';

  if (content.includes(oldRef2)) {
    content = content.replace(new RegExp(oldRef2.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newRef2);
    console.log(`[OK] world2_${num} for...in REMEDIAL_BANK → window.REMEDIAL_BANK`);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
  } else {
    console.log(`[SKIP] world2_${num} 이미 정리되었거나 패턴 불일치`);
  }
}

console.log('\n✅ world2_01~10 REMEDIAL_BANK 정리 완료!');

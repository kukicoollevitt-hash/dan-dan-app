const fs = require('fs');
const path = require('path');

// classic_21~30 파일에서:
// 1. 기존 인라인 REMEDIAL_BANK 블록 제거
// 2. REMEDIAL_BANK → window.REMEDIAL_BANK로 변경

for (let i = 21; i <= 30; i++) {
  const num = String(i).padStart(2, '0');
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'korlit', `classic_${num}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  const inlineRemedialPattern = /\/\/ ===== 보완학습 문제 뱅크 \(객관식 2문제씩\) =====\s*(?:const |window\.)?REMEDIAL_BANK = \{[\s\S]*?\};\s*(?=\/\/|function|let|const|var|\n\s*\n)/;

  if (inlineRemedialPattern.test(content)) {
    content = content.replace(inlineRemedialPattern, '');
    console.log(`[OK] classic_${num} 인라인 REMEDIAL_BANK 블록 제거`);
    modified = true;
  }

  const oldRef1 = 'const data = REMEDIAL_BANK[key];';
  const newRef1 = 'const data = window.REMEDIAL_BANK[key];';

  if (content.includes(oldRef1)) {
    content = content.replace(new RegExp(oldRef1.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newRef1);
    console.log(`[OK] classic_${num} REMEDIAL_BANK[key] → window.REMEDIAL_BANK[key]`);
    modified = true;
  }

  const oldRef2 = 'for (const key in REMEDIAL_BANK)';
  const newRef2 = 'for (const key in window.REMEDIAL_BANK)';

  if (content.includes(oldRef2)) {
    content = content.replace(new RegExp(oldRef2.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newRef2);
    console.log(`[OK] classic_${num} for...in REMEDIAL_BANK → window.REMEDIAL_BANK`);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
  } else {
    console.log(`[SKIP] classic_${num} 이미 정리되었거나 패턴 불일치`);
  }
}

console.log('\n✅ classic_21~30 REMEDIAL_BANK 정리 완료!');

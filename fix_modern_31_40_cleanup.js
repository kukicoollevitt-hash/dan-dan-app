const fs = require('fs');
const path = require('path');

// modern_31~40 파일에서:
// 1. 기존 인라인 window.REMEDIAL_BANK = {...} 블록 제거 (중복)
// 2. 인라인 함수에서 REMEDIAL_BANK → window.REMEDIAL_BANK로 변경

for (let i = 31; i <= 40; i++) {
  const num = String(i).padStart(2, '0');
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'korlit', `modern_${num}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. 인라인 스크립트 내의 기존 REMEDIAL_BANK 블록 제거 (const 또는 window.)
  // 패턴: // ===== 보완학습 문제 뱅크 ... REMEDIAL_BANK = {...};
  const inlineRemedialPattern = /\/\/ ===== 보완학습 문제 뱅크 \(객관식 2문제씩\) =====\s*(?:const |window\.)?REMEDIAL_BANK = \{[\s\S]*?\};\s*(?=\/\/|function|let|const|var|\n\s*\n)/;

  if (inlineRemedialPattern.test(content)) {
    content = content.replace(inlineRemedialPattern, '');
    console.log(`[OK] modern_${num} 인라인 REMEDIAL_BANK 블록 제거`);
    modified = true;
  }

  // 2. 인라인 함수에서 REMEDIAL_BANK → window.REMEDIAL_BANK 변경 (window. 없는 것만)
  // const data = REMEDIAL_BANK[key]; → const data = window.REMEDIAL_BANK[key];
  const oldRef1 = 'const data = REMEDIAL_BANK[key];';
  const newRef1 = 'const data = window.REMEDIAL_BANK[key];';

  if (content.includes(oldRef1)) {
    content = content.replace(new RegExp(oldRef1.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newRef1);
    console.log(`[OK] modern_${num} REMEDIAL_BANK[key] → window.REMEDIAL_BANK[key]`);
    modified = true;
  }

  // for (const key in REMEDIAL_BANK) → for (const key in window.REMEDIAL_BANK)
  const oldRef2 = 'for (const key in REMEDIAL_BANK)';
  const newRef2 = 'for (const key in window.REMEDIAL_BANK)';

  if (content.includes(oldRef2)) {
    content = content.replace(new RegExp(oldRef2.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newRef2);
    console.log(`[OK] modern_${num} for...in REMEDIAL_BANK → window.REMEDIAL_BANK`);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
  } else {
    console.log(`[SKIP] modern_${num} 이미 정리되었거나 패턴 불일치`);
  }
}

console.log('\n✅ modern_31~40 REMEDIAL_BANK 정리 완료!');

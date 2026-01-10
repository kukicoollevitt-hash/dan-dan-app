const fs = require('fs');
const path = require('path');

for (let i = 11; i <= 20; i++) {
  const num = String(i).padStart(2, '0');
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'science', `fit_bio_${num}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. 중복 인라인 REMEDIAL_BANK 블록 제거 (const REMEDIAL_BANK = { ... };)
  // 패턴: const REMEDIAL_BANK = { 로 시작하는 블록 찾기
  const inlineRemedialPattern = /\/\/ =+ 보완학습 문제 뱅크[\s\S]*?const REMEDIAL_BANK = \{[\s\S]*?\n\s*\};\s*\n/g;

  if (inlineRemedialPattern.test(content)) {
    content = content.replace(inlineRemedialPattern, '');
    console.log(`[OK] fit_bio_${num} 중복 인라인 REMEDIAL_BANK 제거`);
    modified = true;
  }

  // 2. ${unit} → ${window.CUR_UNIT} 변경 (REMEDIAL_BANK 참조 시)
  // 패턴: const bank = REMEDIAL_BANK || window.REMEDIAL_BANK;
  const oldBankPattern = 'const bank = REMEDIAL_BANK || window.REMEDIAL_BANK;';
  const newBankPattern = 'const bank = window.REMEDIAL_BANK;';

  if (content.includes(oldBankPattern)) {
    content = content.replace(oldBankPattern, newBankPattern);
    console.log(`[OK] fit_bio_${num} REMEDIAL_BANK 참조 수정`);
    modified = true;
  }

  // 3. 단독 const bank = REMEDIAL_BANK; → window.REMEDIAL_BANK 변경
  const oldBankPattern2 = 'const bank = REMEDIAL_BANK;';
  const newBankPattern2 = 'const bank = window.REMEDIAL_BANK;';

  if (content.includes(oldBankPattern2)) {
    content = content.replace(new RegExp(oldBankPattern2.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newBankPattern2);
    console.log(`[OK] fit_bio_${num} REMEDIAL_BANK 단독 참조 수정`);
    modified = true;
  }

  // 4. gradeRemedial에서 REMEDIAL_BANK 직접 참조 → window.REMEDIAL_BANK
  const oldGradeBank = 'const bank = REMEDIAL_BANK || {};';
  const newGradeBank = 'const bank = window.REMEDIAL_BANK || {};';

  if (content.includes(oldGradeBank)) {
    content = content.replace(oldGradeBank, newGradeBank);
    console.log(`[OK] fit_bio_${num} gradeRemedial 내 REMEDIAL_BANK 참조 수정`);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
  } else {
    console.log(`[SKIP] fit_bio_${num} 이미 정리되었거나 패턴 불일치`);
  }
}

console.log('\n✅ fit_bio_11~20 중복 제거 및 참조 정리 완료!');

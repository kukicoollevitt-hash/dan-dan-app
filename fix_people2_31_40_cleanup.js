const fs = require('fs');
const path = require('path');

// people2_31~40 파일에서 중복 인라인 REMEDIAL_BANK 제거 및 참조 수정

for (let i = 31; i <= 40; i++) {
  const num = String(i).padStart(2, '0');
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'person', `people2_${num}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 인라인 REMEDIAL_BANK 블록 제거
  const inlineRemedialPattern = /\/\/ ===== 보완학습 문제 뱅크 \(객관식 2문제씩\) =====\s*(?:const |window\.)?REMEDIAL_BANK = \{[\s\S]*?\};\s*(?=\/\/|function|let|const|var|\n\s*\n)/;

  if (inlineRemedialPattern.test(content)) {
    content = content.replace(inlineRemedialPattern, '');
    console.log(`[OK] people2_${num} 인라인 REMEDIAL_BANK 블록 제거`);
    modified = true;
  }

  // REMEDIAL_BANK 참조를 window.REMEDIAL_BANK로 수정
  const oldRef1 = 'const data = REMEDIAL_BANK[key];';
  const newRef1 = 'const data = window.REMEDIAL_BANK[key];';

  if (content.includes(oldRef1)) {
    content = content.replace(new RegExp(oldRef1.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newRef1);
    console.log(`[OK] people2_${num} REMEDIAL_BANK[key] → window.REMEDIAL_BANK[key]`);
    modified = true;
  }

  const oldRef2 = 'for (const key in REMEDIAL_BANK)';
  const newRef2 = 'for (const key in window.REMEDIAL_BANK)';

  if (content.includes(oldRef2)) {
    content = content.replace(new RegExp(oldRef2.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newRef2);
    console.log(`[OK] people2_${num} for...in REMEDIAL_BANK → window.REMEDIAL_BANK`);
    modified = true;
  }

  // ${unit} 참조를 ${window.CUR_UNIT}으로 수정 (people2용)
  const oldVocabPattern = 'const stateKey = `vocab-state:${stuKey}:${unit}`;';
  const newVocabPattern = 'const stateKey = `vocab-state:${stuKey}:${window.CUR_UNIT}`;';

  if (content.includes(oldVocabPattern)) {
    content = content.replace(new RegExp(oldVocabPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newVocabPattern);
    console.log(`[OK] people2_${num} vocab-state \${unit} → window.CUR_UNIT`);
    modified = true;
  }

  // current-people2-tab:${unit} → ${window.CUR_UNIT}
  const oldTabPattern = 'localStorage.setItem(`current-people2-tab:${unit}`, target);';
  const newTabPattern = 'localStorage.setItem(`current-people2-tab:${window.CUR_UNIT}`, target);';

  if (content.includes(oldTabPattern)) {
    content = content.replace(new RegExp(oldTabPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newTabPattern);
    console.log(`[OK] people2_${num} current-people2-tab \${unit} → window.CUR_UNIT`);
    modified = true;
  }

  // current-geo-tab:${unit} → ${window.CUR_UNIT} (혹시 있을 경우)
  const oldGeoPattern = 'localStorage.setItem(`current-geo-tab:${unit}`, target);';
  const newGeoPattern = 'localStorage.setItem(`current-geo-tab:${window.CUR_UNIT}`, target);';

  if (content.includes(oldGeoPattern)) {
    content = content.replace(new RegExp(oldGeoPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newGeoPattern);
    console.log(`[OK] people2_${num} current-geo-tab \${unit} → window.CUR_UNIT`);
    modified = true;
  }

  // savedTab 에러 수정
  const oldSavedTab = `    // 분석리포트 탭으로 새로고침된 경우 로딩 텍스트 변경
    if (savedTab === 'report') {`;
  const newSavedTab = `    // 분석리포트 탭으로 새로고침된 경우 로딩 텍스트 변경
    const savedTab = localStorage.getItem(\`current-people2-tab:\${window.CUR_UNIT}\`);
    if (savedTab === 'report') {`;

  if (content.includes(oldSavedTab)) {
    content = content.replace(oldSavedTab, newSavedTab);
    console.log(`[OK] people2_${num} savedTab 정의 추가`);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
  } else {
    console.log(`[SKIP] people2_${num} 이미 정리되었거나 패턴 불일치`);
  }
}

console.log('\n✅ people2_31~40 정리 완료!');

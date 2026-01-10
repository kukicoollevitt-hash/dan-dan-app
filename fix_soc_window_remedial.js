const fs = require('fs');
const path = require('path');

// soc_01~10 파일에서 const REMEDIAL_BANK를 window.REMEDIAL_BANK로 변경

for (let i = 1; i <= 10; i++) {
  const num = String(i).padStart(2, '0');
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'social', `soc_${num}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. const REMEDIAL_BANK -> window.REMEDIAL_BANK
  if (content.includes('const REMEDIAL_BANK = {')) {
    content = content.replace('const REMEDIAL_BANK = {', 'window.REMEDIAL_BANK = {');
    console.log(`[OK] soc_${num} const -> window.REMEDIAL_BANK 변경`);
    modified = true;
  }

  // 2. openRemedial 함수 내 REMEDIAL_BANK[key] -> window.REMEDIAL_BANK[key]
  // gradeRemedial에서도 window.REMEDIAL_BANK 사용하도록 변경
  if (content.includes('const data = REMEDIAL_BANK[key];')) {
    content = content.replace(/const data = REMEDIAL_BANK\[key\];/g, 'const data = window.REMEDIAL_BANK[key];');
    console.log(`[OK] soc_${num} REMEDIAL_BANK[key] -> window.REMEDIAL_BANK[key]`);
    modified = true;
  }

  // 3. for (const key in REMEDIAL_BANK) -> for (const key in window.REMEDIAL_BANK)
  if (content.includes('for (const key in REMEDIAL_BANK)')) {
    content = content.replace(/for \(const key in REMEDIAL_BANK\)/g, 'for (const key in window.REMEDIAL_BANK)');
    console.log(`[OK] soc_${num} for...in REMEDIAL_BANK -> window.REMEDIAL_BANK`);
    modified = true;
  }

  if (!modified) {
    console.log(`[SKIP] soc_${num} 이미 수정되어 있거나 패턴 불일치`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

console.log('\n✅ soc_01~10 window.REMEDIAL_BANK 변경 완료!');

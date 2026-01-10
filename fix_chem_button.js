const fs = require('fs');
const path = require('path');

// chem_01~10 파일의 보완학습 버튼 visibility 수정

for (let i = 1; i <= 10; i++) {
  const num = String(i).padStart(2, '0');
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'science', `chem_${num}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. style="display:none;" 제거
  if (content.includes('class="report-btn-remedial"') && content.includes('style="display:none;"')) {
    const oldLine = '<button class="report-btn-remedial" onclick="openRemedial && openRemedial()" style="display:none;">';
    const newLine = '<button class="report-btn-remedial" onclick="openRemedial()">';

    if (content.includes(oldLine)) {
      content = content.replace(oldLine, newLine);
      console.log(`[OK] chem_${num} 보완학습 버튼 수정 완료`);
      modified = true;
    }
  }

  if (!modified) {
    console.log(`[SKIP] chem_${num} 이미 수정되어 있음`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

console.log('\n✅ chem_01~10 보완학습 버튼 visibility 수정 완료!');

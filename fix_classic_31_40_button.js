const fs = require('fs');
const path = require('path');

// classic_31~40 파일의 보완학습 버튼 활성화

for (let i = 31; i <= 40; i++) {
  const num = String(i).padStart(2, '0');
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'korlit', `classic_${num}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 패턴1: display:none 스타일이 있는 버튼
  const oldPattern1 = '<button class="report-btn-remedial" onclick="openRemedial && openRemedial()" style="display:none;">';
  const newPattern1 = '<button class="report-btn-remedial" onclick="openRemedial()">';

  if (content.includes(oldPattern1)) {
    content = content.replace(oldPattern1, newPattern1);
    console.log(`[OK] classic_${num} 보완학습 버튼 활성화 (패턴1)`);
    modified = true;
  }

  // 패턴2: openRemedial && openRemedial() 형태
  const oldPattern2 = 'onclick="openRemedial && openRemedial()"';
  const newPattern2 = 'onclick="openRemedial()"';

  if (content.includes(oldPattern2)) {
    content = content.replace(new RegExp(oldPattern2.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newPattern2);
    console.log(`[OK] classic_${num} onclick 패턴 수정`);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
  } else {
    console.log(`[SKIP] classic_${num} 이미 활성화되어 있거나 패턴 불일치`);
  }
}

console.log('\n✅ classic_31~40 보완학습 버튼 활성화 완료!');

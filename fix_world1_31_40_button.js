const fs = require('fs');
const path = require('path');

for (let i = 31; i <= 40; i++) {
  const num = String(i).padStart(2, '0');
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'worldlit', `world1_${num}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  const oldPattern1 = '<button class="report-btn-remedial" onclick="openRemedial && openRemedial()" style="display:none;">';
  const newPattern1 = '<button class="report-btn-remedial" onclick="openRemedial()">';

  if (content.includes(oldPattern1)) {
    content = content.replace(oldPattern1, newPattern1);
    console.log(`[OK] world1_${num} 보완학습 버튼 활성화`);
    modified = true;
  }

  const oldPattern2 = 'onclick="openRemedial && openRemedial()"';
  const newPattern2 = 'onclick="openRemedial()"';

  if (content.includes(oldPattern2)) {
    content = content.replace(new RegExp(oldPattern2.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newPattern2);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
  } else {
    console.log(`[SKIP] world1_${num} 이미 활성화되어 있거나 패턴 불일치`);
  }
}

console.log('\n✅ world1_31~40 보완학습 버튼 활성화 완료!');

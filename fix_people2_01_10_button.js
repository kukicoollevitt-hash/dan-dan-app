const fs = require('fs');
const path = require('path');

for (let i = 1; i <= 10; i++) {
  const num = String(i).padStart(2, '0');
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'person', `people2_${num}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 패턴 1: display:none이 있는 보완학습 버튼 활성화
  const oldPattern1 = '<button class="report-btn-remedial" onclick="openRemedial && openRemedial()" style="display:none;">';
  const newPattern1 = '<button class="report-btn-remedial" onclick="openRemedial()">';

  if (content.includes(oldPattern1)) {
    content = content.replace(oldPattern1, newPattern1);
    console.log(`[OK] people2_${num} 보완학습 버튼 활성화 (패턴1)`);
    modified = true;
  }

  // 패턴 2: openRemedial && openRemedial() → openRemedial()
  const oldPattern2 = 'onclick="openRemedial && openRemedial()"';
  const newPattern2 = 'onclick="openRemedial()"';

  if (content.includes(oldPattern2)) {
    content = content.replace(new RegExp(oldPattern2.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newPattern2);
    console.log(`[OK] people2_${num} onclick 패턴 수정`);
    modified = true;
  }

  // 패턴 3: style="display:none;" 제거
  const oldPattern3 = /<button class="report-btn-remedial"([^>]*) style="display:none;">/g;
  const newPattern3 = '<button class="report-btn-remedial"$1>';

  if (oldPattern3.test(content)) {
    content = content.replace(oldPattern3, newPattern3);
    console.log(`[OK] people2_${num} display:none 제거`);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
  } else {
    console.log(`[SKIP] people2_${num} 이미 활성화되어 있거나 패턴 불일치`);
  }
}

console.log('\n✅ people2_01~10 보완학습 버튼 활성화 완료!');

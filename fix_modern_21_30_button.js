const fs = require('fs');
const path = require('path');

// modern_21~30 파일의 보완학습 버튼 활성화

for (let i = 21; i <= 30; i++) {
  const num = String(i).padStart(2, '0');
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'korlit', `modern_${num}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. style="display:none;" 제거 및 onclick 수정
  const oldPattern1 = '<button class="report-btn-remedial" onclick="openRemedial && openRemedial()" style="display:none;">';
  const newPattern1 = '<button class="report-btn-remedial" onclick="openRemedial()">';

  if (content.includes(oldPattern1)) {
    content = content.replace(oldPattern1, newPattern1);
    console.log(`[OK] modern_${num} 보완학습 버튼 활성화 (패턴1)`);
    modified = true;
  }

  // 2. 다른 패턴도 시도
  const oldPattern2 = 'class="report-btn-remedial" onclick="openRemedial && openRemedial()" style="display:none;"';
  const newPattern2 = 'class="report-btn-remedial" onclick="openRemedial()"';

  if (!modified && content.includes(oldPattern2)) {
    content = content.replace(oldPattern2, newPattern2);
    console.log(`[OK] modern_${num} 보완학습 버튼 활성화 (패턴2)`);
    modified = true;
  }

  // 3. display:none만 제거
  if (!modified && content.includes('report-btn-remedial') && content.includes('style="display:none;"')) {
    content = content.replace(
      /(<button class="report-btn-remedial"[^>]*) style="display:none;"/g,
      '$1'
    );
    console.log(`[OK] modern_${num} 보완학습 버튼 display:none 제거`);
    modified = true;
  }

  if (!modified) {
    console.log(`[SKIP] modern_${num} 이미 활성화되어 있거나 패턴 불일치`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

console.log('\n✅ modern_21~30 보완학습 버튼 활성화 완료!');

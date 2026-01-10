const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'public', 'BRAINUP', 'person');

let successCount = 0;
let failCount = 0;

for (let i = 1; i <= 20; i++) {
  const unit = String(i).padStart(2, '0');
  const filePath = path.join(DIR, `on_people2_${unit}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ 파일 없음: on_people2_${unit}.html`);
    failCount++;
    continue;
  }

  let html = fs.readFileSync(filePath, 'utf8');

  // 보완학습 버튼 활성화 (display:none 제거)
  const oldButton = `<button class="report-btn-remedial" onclick="openRemedial && openRemedial()" style="display:none;">`;
  const newButton = `<button class="report-btn-remedial" onclick="openRemedial()">`;

  if (html.includes(oldButton)) {
    html = html.replace(oldButton, newButton);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✅ 보완학습 버튼 활성화: on_people2_${unit}.html`);
    successCount++;
  } else {
    if (html.includes('report-btn-remedial')) {
      console.log(`ℹ️ 이미 활성화됨 또는 다른 형태: on_people2_${unit}.html`);
    } else {
      console.log(`⚠️ 버튼을 찾을 수 없음: on_people2_${unit}.html`);
    }
    failCount++;
  }
}

console.log(`\n🎉 온세계인물 01~20 보완학습 버튼 활성화 완료!`);
console.log(`   성공: ${successCount}개, 실패: ${failCount}개`);

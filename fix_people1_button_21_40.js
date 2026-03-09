const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'public', 'BRAINUP', 'person');

for (let i = 21; i <= 40; i++) {
  const no = String(i).padStart(2, '0');
  const filePath = path.join(DIR, `on_people1_${no}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ 파일 없음: on_people1_${no}.html`);
    continue;
  }

  let html = fs.readFileSync(filePath, 'utf8');

  // 보완학습 버튼의 display:none 제거
  const oldButton = `<button class="report-btn-remedial" onclick="openRemedial && openRemedial()" style="display:none;">`;
  const newButton = `<button class="report-btn-remedial" onclick="openRemedial()">`;

  if (html.includes(oldButton)) {
    html = html.replace(oldButton, newButton);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✅ 버튼 수정 완료: on_people1_${no}.html`);
  } else {
    // 다른 형태의 버튼도 확인
    const altButton1 = `<button class="report-btn-remedial" onclick="openRemedial && openRemedial()">`;
    if (html.includes(altButton1)) {
      html = html.replace(altButton1, newButton);
      fs.writeFileSync(filePath, html, 'utf8');
      console.log(`✅ 버튼 수정 완료 (alt): on_people1_${no}.html`);
    } else {
      console.log(`⚠️ 버튼을 찾을 수 없음: on_people1_${no}.html`);
    }
  }
}

console.log('\n🎉 온한국인물 21~40 보완학습 버튼 수정 완료!');

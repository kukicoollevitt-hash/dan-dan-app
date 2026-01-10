const fs = require('fs');
const path = require('path');

// classic_21~30 파일의 openRemedial, gradeRemedial 함수에서
// ①②③④ 동그라미 번호와 해설 추가

for (let i = 21; i <= 30; i++) {
  const num = String(i).padStart(2, '0');
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'korlit', `classic_${num}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  const oldOpenPattern1 = `p.options.forEach(opt => {
            html += \`<label style="display:block;font-weight:normal;"><input type="radio" name="\${key}-q\${idx}"> \${opt}</label>\`;
          });`;

  const newOpenPattern1 = `p.options.forEach((opt, optIdx) => {
            html += \`<label style="display:block;font-weight:normal;"><input type="radio" name="\${key}-q\${idx}" value="\${optIdx}"> \${["①","②","③","④"][optIdx]} \${opt}</label>\`;
          });`;

  if (content.includes(oldOpenPattern1)) {
    content = content.replace(oldOpenPattern1, newOpenPattern1);
    console.log(`[OK] classic_${num} openRemedial 동그라미 번호 추가`);
    modified = true;
  }

  const oldGradePattern1 = `inputs.forEach((inp, i) => { if (inp.checked) selected = i; });`;
  const newGradePattern1 = `inputs.forEach((inp, i) => { if (inp.checked) selected = parseInt(inp.value); });`;

  if (content.includes(oldGradePattern1)) {
    content = content.replace(oldGradePattern1, newGradePattern1);
    console.log(`[OK] classic_${num} gradeRemedial selected 값 수정`);
    modified = true;
  }

  const oldCorrectPattern = `li.insertAdjacentHTML('beforeend', '<div class="remed-result" style="margin-top:3px; color:#157347; font-size:12px;">정답입니다 ✅</div>');`;
  const newCorrectPattern = `li.insertAdjacentHTML('beforeend', '<div class="remed-result" style="margin-top:3px; color:#157347; font-size:12px;">정답입니다 ✅ <span style="color:#555;">| ' + (p.explanation || '') + '</span></div>');`;

  if (content.includes(oldCorrectPattern)) {
    content = content.replace(oldCorrectPattern, newCorrectPattern);
    console.log(`[OK] classic_${num} gradeRemedial 정답 해설 추가`);
    modified = true;
  }

  const oldWrongPattern = 'li.insertAdjacentHTML(\'beforeend\', `<div class="remed-result" style="margin-top:3px; color:#b3261e; font-size:12px;">틀렸어요 ❌ 정답: ${correctText}</div>`);';
  const newWrongPattern = 'li.insertAdjacentHTML(\'beforeend\', `<div class="remed-result" style="margin-top:3px; color:#b3261e; font-size:12px;">틀렸어요 ❌ 정답: ${correctText} <span style="color:#555;">| ${p.explanation || \'\'}</span></div>`);';

  if (content.includes(oldWrongPattern)) {
    content = content.replace(oldWrongPattern, newWrongPattern);
    console.log(`[OK] classic_${num} gradeRemedial 오답 해설 추가`);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
  } else {
    console.log(`[SKIP] classic_${num} 이미 수정되었거나 패턴 불일치`);
  }
}

console.log('\n✅ classic_21~30 보완학습 UI 수정 완료!');

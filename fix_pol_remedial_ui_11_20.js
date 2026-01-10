const fs = require('fs');
const path = require('path');

// pol_11~20 파일의 보완학습 선지에 동그라미 번호 추가 및 해설 한 줄 처리

const circleNumbers = ['①', '②', '③', '④'];

for (let i = 11; i <= 20; i++) {
  const num = String(i).padStart(2, '0');
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'social', `pol_${num}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. 선지에 동그라미 번호 추가
  // 기존: html += `<label style="display:block;font-weight:normal;"><input type="radio" name="${key}-q${idx}" value="${optIdx}"> ${opt}</label>`;
  // 변경: 동그라미 번호 추가
  const oldOptionLine = 'html += `<label style="display:block;font-weight:normal;"><input type="radio" name="${key}-q${idx}" value="${optIdx}"> ${opt}</label>`;';
  const newOptionLine = 'html += `<label style="display:block;font-weight:normal;"><input type="radio" name="${key}-q${idx}" value="${optIdx}"> ${["①","②","③","④"][optIdx]} ${opt}</label>`;';

  if (content.includes(oldOptionLine)) {
    content = content.replace(oldOptionLine, newOptionLine);
    console.log(`[OK] pol_${num} 선지 동그라미 번호 추가`);
    modified = true;
  }

  // 2. 해설 한 줄 처리 (정답일 때)
  // 기존: li.insertAdjacentHTML('beforeend', '<div class="remed-result" style="margin-top:3px; color:#157347; font-size:12px;">정답입니다 ✅</div>');
  // 변경: 해설 추가
  const oldCorrectLine = `li.insertAdjacentHTML('beforeend', '<div class="remed-result" style="margin-top:3px; color:#157347; font-size:12px;">정답입니다 ✅</div>');`;
  const newCorrectLine = `li.insertAdjacentHTML('beforeend', '<div class="remed-result" style="margin-top:3px; color:#157347; font-size:12px;">정답입니다 ✅ <span style="color:#555;">| ' + (p.explanation || '') + '</span></div>');`;

  if (content.includes(oldCorrectLine)) {
    content = content.replace(oldCorrectLine, newCorrectLine);
    console.log(`[OK] pol_${num} 정답 해설 추가`);
    modified = true;
  }

  // 3. 해설 한 줄 처리 (오답일 때)
  // 기존: li.insertAdjacentHTML('beforeend', `<div class="remed-result" style="margin-top:3px; color:#b3261e; font-size:12px;">틀렸어요 ❌ 정답: ${correctText}</div>`);
  // 변경: 해설 추가
  const oldWrongLine = 'li.insertAdjacentHTML(\'beforeend\', `<div class="remed-result" style="margin-top:3px; color:#b3261e; font-size:12px;">틀렸어요 ❌ 정답: ${correctText}</div>`);';
  const newWrongLine = 'li.insertAdjacentHTML(\'beforeend\', `<div class="remed-result" style="margin-top:3px; color:#b3261e; font-size:12px;">틀렸어요 ❌ 정답: ${correctText} <span style="color:#555;">| ${p.explanation || \'\'}</span></div>`);';

  if (content.includes(oldWrongLine)) {
    content = content.replace(oldWrongLine, newWrongLine);
    console.log(`[OK] pol_${num} 오답 해설 추가`);
    modified = true;
  }

  if (!modified) {
    console.log(`[SKIP] pol_${num} 이미 수정되어 있거나 패턴 불일치`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

console.log('\n✅ pol_11~20 보완학습 UI 수정 완료!');

const fs = require('fs');
const path = require('path');

// world2_31~40 파일에서 openRemedial, gradeRemedial, resetRemedial 함수를 전역에 노출

for (let i = 31; i <= 40; i++) {
  const num = String(i).padStart(2, '0');
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'worldlit', `world2_${num}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // function openRemedial() → window.openRemedial = function()
  const oldOpenRemedial = 'function openRemedial()';
  const newOpenRemedial = 'window.openRemedial = function()';

  if (content.includes(oldOpenRemedial) && !content.includes('window.openRemedial')) {
    content = content.replace(oldOpenRemedial, newOpenRemedial);
    console.log(`[OK] world2_${num} openRemedial → window.openRemedial`);
    modified = true;
  }

  // function gradeRemedial() → window.gradeRemedial = function()
  const oldGradeRemedial = 'function gradeRemedial()';
  const newGradeRemedial = 'window.gradeRemedial = function()';

  if (content.includes(oldGradeRemedial) && !content.includes('window.gradeRemedial')) {
    content = content.replace(oldGradeRemedial, newGradeRemedial);
    console.log(`[OK] world2_${num} gradeRemedial → window.gradeRemedial`);
    modified = true;
  }

  // function resetRemedial() → window.resetRemedial = function()
  const oldResetRemedial = 'function resetRemedial()';
  const newResetRemedial = 'window.resetRemedial = function()';

  if (content.includes(oldResetRemedial) && !content.includes('window.resetRemedial')) {
    content = content.replace(oldResetRemedial, newResetRemedial);
    console.log(`[OK] world2_${num} resetRemedial → window.resetRemedial`);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
  } else {
    console.log(`[SKIP] world2_${num} 이미 전역화되어 있거나 패턴 불일치`);
  }
}

console.log('\n✅ world2_31~40 함수 전역화 완료!');

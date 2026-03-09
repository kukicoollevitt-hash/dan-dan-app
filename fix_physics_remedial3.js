const fs = require('fs');
const path = require('path');

// physics_01~10 파일의 openRemedial 함수에서 optIdx 문제 수정
// p.options.forEach(opt => ... -> p.options.forEach((opt, optIdx) => ...

for (let i = 1; i <= 10; i++) {
  const num = String(i).padStart(2, '0');
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'science', `physics_${num}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // p.options.forEach(opt => { -> p.options.forEach((opt, optIdx) => {
  const oldPattern = /p\.options\.forEach\(opt => \{/g;
  const newPattern = `p.options.forEach((opt, optIdx) => {`;

  if (oldPattern.test(content)) {
    content = content.replace(oldPattern, newPattern);
    console.log(`[OK] physics_${num} openRemedial optIdx 수정`);
  } else {
    console.log(`[SKIP] physics_${num} 이미 수정되어 있음`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

console.log('\n✅ physics_01~10 openRemedial optIdx 수정 완료!');

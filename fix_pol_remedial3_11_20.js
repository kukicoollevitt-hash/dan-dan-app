const fs = require('fs');
const path = require('path');

// pol_11~20 파일의 openRemedial 함수에서 optIdx 문제 수정

for (let i = 11; i <= 20; i++) {
  const num = String(i).padStart(2, '0');
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'social', `pol_${num}.html`);

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
    console.log(`[OK] pol_${num} openRemedial optIdx 수정`);
  } else {
    console.log(`[SKIP] pol_${num} 이미 수정되어 있음`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

console.log('\n✅ pol_11~20 openRemedial optIdx 수정 완료!');

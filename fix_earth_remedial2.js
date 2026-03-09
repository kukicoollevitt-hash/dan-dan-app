const fs = require('fs');
const path = require('path');

// earth_01~10 파일의 gradeRemedial 함수에서 value 처리 수정
// bio_01처럼 parseInt(inp.value)로 처리해야 함

for (let i = 1; i <= 10; i++) {
  const num = String(i).padStart(2, '0');
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'science', `earth_${num}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // 1. gradeRemedial에서 selected = i 를 selected = parseInt(inp.value)로 변경
  const oldPattern = /inputs\.forEach\(\(inp, i\) => \{ if \(inp\.checked\) selected = i; \}\);/g;
  const newPattern = `inputs.forEach((inp, i) => { if (inp.checked) selected = parseInt(inp.value); });`;

  if (oldPattern.test(content)) {
    content = content.replace(oldPattern, newPattern);
    console.log(`[OK] earth_${num} gradeRemedial value 처리 수정`);
  }

  // 2. openRemedial에서 radio value 추가 확인
  // value="${optIdx}"가 있는지 확인
  if (!content.includes('value="${optIdx}"')) {
    // radio input에 value 추가
    const oldRadioPattern = /<input type="radio" name="\$\{key\}-q\$\{idx\}">/g;
    const newRadioPattern = `<input type="radio" name="\${key}-q\${idx}" value="\${optIdx}">`;

    if (content.includes('<input type="radio" name="${key}-q${idx}">')) {
      content = content.replace(/<input type="radio" name="\$\{key\}-q\$\{idx\}">/g, newRadioPattern);
      console.log(`[OK] earth_${num} radio value 추가`);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

console.log('\n✅ earth_01~10 gradeRemedial 수정 완료!');

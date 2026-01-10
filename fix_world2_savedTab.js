const fs = require('fs');
const path = require('path');

// world2_01~20 파일에서 savedTab 에러 수정
// savedTab 변수 사용 전에 정의 추가

for (let i = 1; i <= 20; i++) {
  const num = String(i).padStart(2, '0');
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'worldlit', `world2_${num}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // savedTab 사용 전에 정의 추가
  const oldPattern = `    // 분석리포트 탭으로 새로고침된 경우 로딩 텍스트 변경
    if (savedTab === 'report') {`;

  const newPattern = `    // 분석리포트 탭으로 새로고침된 경우 로딩 텍스트 변경
    const savedTab = localStorage.getItem(\`current-geo-tab:\${window.CUR_UNIT}\`);
    if (savedTab === 'report') {`;

  if (content.includes(oldPattern)) {
    content = content.replace(oldPattern, newPattern);
    console.log(`[OK] world2_${num} savedTab 정의 추가`);
    modified = true;
  } else {
    // 이미 수정되었거나 패턴이 다른 경우
    console.log(`[SKIP] world2_${num} 이미 수정되었거나 패턴 불일치`);
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

console.log('\n✅ world2_01~20 savedTab 에러 수정 완료!');

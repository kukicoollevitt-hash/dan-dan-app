const fs = require('fs');
const path = require('path');

// world2_31~40을 world2_01 구조와 동일하게 수정
// 1. const REMEDIAL_BANK → window.REMEDIAL_BANK
// 2. window.openRemedial = function() → function openRemedial()
// 3. learning-common.js 태그 추가

for (let i = 31; i <= 40; i++) {
  const num = String(i).padStart(2, '0');
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'worldlit', `world2_${num}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. const REMEDIAL_BANK → window.REMEDIAL_BANK
  if (content.includes('const REMEDIAL_BANK = {') && !content.includes('window.REMEDIAL_BANK = {')) {
    content = content.replace('const REMEDIAL_BANK = {', 'window.REMEDIAL_BANK = {');
    console.log(`[OK] world2_${num} const REMEDIAL_BANK → window.REMEDIAL_BANK`);
    modified = true;
  }

  // 2. window.openRemedial = function() → function openRemedial()
  if (content.includes('window.openRemedial = function()')) {
    content = content.replace('window.openRemedial = function()', 'function openRemedial()');
    console.log(`[OK] world2_${num} window.openRemedial → function openRemedial`);
    modified = true;
  }

  // 3. window.gradeRemedial = function() → function gradeRemedial()
  if (content.includes('window.gradeRemedial = function()')) {
    content = content.replace('window.gradeRemedial = function()', 'function gradeRemedial()');
    console.log(`[OK] world2_${num} window.gradeRemedial → function gradeRemedial`);
    modified = true;
  }

  // 4. window.resetRemedial = function() → function resetRemedial()
  if (content.includes('window.resetRemedial = function()')) {
    content = content.replace('window.resetRemedial = function()', 'function resetRemedial()');
    console.log(`[OK] world2_${num} window.resetRemedial → function resetRemedial`);
    modified = true;
  }

  // 5. learning-common.js 태그가 없으면 추가 (</head> 앞에)
  if (!content.includes('learning-common.js')) {
    const headEndPattern = '</head>';
    if (content.includes(headEndPattern)) {
      content = content.replace(headEndPattern, `<script src="/assets/js/learning-common.js?v=20251202h"></script>\n</head>`);
      console.log(`[OK] world2_${num} learning-common.js 태그 추가`);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
  } else {
    console.log(`[SKIP] world2_${num} 이미 수정되었거나 패턴 불일치`);
  }
}

console.log('\n✅ world2_31~40 구조 수정 완료!');

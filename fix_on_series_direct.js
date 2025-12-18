const fs = require('fs');
const path = require('path');

// on_*.html 파일 찾기
function findOnFiles(dir) {
  let results = [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(findOnFiles(filePath));
    } else if (file.startsWith('on_') && file.endsWith('.html')) {
      results.push(filePath);
    }
  }
  return results;
}

const brainupDir = '/Users/dandan/Desktop/dan-dan-app_1217/public/BRAINUP';
const files = findOnFiles(brainupDir);

console.log(`Found ${files.length} on_*.html files\n`);

let updated = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // 이미 window.CUR_SERIES = 'BRAIN온' 이 있으면 스킵
  if (content.includes("window.CUR_SERIES = 'BRAIN온'")) {
    continue;
  }

  // window.CUR_UNIT = unit || 'on_xxx_xx'; 다음 줄에 CUR_SERIES 추가
  const pattern = /(window\.CUR_UNIT = unit \|\| 'on_[a-z0-9]+_\d{2}';)/g;
  const replacement = `$1\n    window.CUR_SERIES = 'BRAIN온';  // ✅ 시리즈 직접 설정`;

  if (content.match(pattern)) {
    content = content.replace(pattern, replacement);
    fs.writeFileSync(file, content);
    updated++;
    console.log(`Updated: ${path.basename(file)}`);
  }
}

console.log(`\n========== Summary ==========`);
console.log(`Total updated: ${updated} files`);
console.log(`Total processed: ${files.length} files`);

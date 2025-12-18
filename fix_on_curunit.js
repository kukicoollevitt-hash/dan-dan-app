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
let alreadyCorrect = 0;

for (const file of files) {
  const filename = path.basename(file);
  // on_bio_01.html -> on_bio_01
  const unitName = filename.replace('.html', '');
  // on_bio_01 -> bio_01 (현재 잘못된 형태)
  const wrongUnit = unitName.replace('on_', '');

  let content = fs.readFileSync(file, 'utf8');

  // 패턴1: window.CUR_UNIT = unit || 'bio_01'; -> window.CUR_UNIT = unit || 'on_bio_01';
  const pattern1 = `window.CUR_UNIT = unit || '${wrongUnit}';`;
  const replacement1 = `window.CUR_UNIT = unit || '${unitName}';`;

  if (content.includes(pattern1)) {
    content = content.replace(new RegExp(pattern1.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement1);

    // 파일 내의 다른 곳에서도 잘못된 기본값이 있는지 확인하고 수정
    // 예: const cur = (window.CUR_UNIT || 'bio_01');
    const pattern2 = new RegExp(`\\(window\\.CUR_UNIT \\|\\| '${wrongUnit}'\\)`, 'g');
    const replacement2 = `(window.CUR_UNIT || '${unitName}')`;
    content = content.replace(pattern2, replacement2);

    // 예: window.CUR_UNIT || 'bio_01' 형태
    const pattern3 = new RegExp(`window\\.CUR_UNIT\\|\\|'${wrongUnit}'`, 'g');
    const replacement3 = `window.CUR_UNIT||'${unitName}'`;
    content = content.replace(pattern3, replacement3);

    fs.writeFileSync(file, content);
    updated++;
    console.log(`Updated: ${filename}`);
  } else if (content.includes(replacement1)) {
    alreadyCorrect++;
  } else {
    console.log(`SKIP (pattern not found): ${filename}`);
  }
}

console.log(`\n========== Summary ==========`);
console.log(`Total updated: ${updated} files`);
console.log(`Already correct: ${alreadyCorrect} files`);
console.log(`Total processed: ${files.length} files`);

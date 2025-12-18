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
  const filename = path.basename(file);
  // on_bio_01.html -> bio
  const match = filename.match(/^on_([a-z0-9]+)_(\d{2})\.html$/);
  if (!match) {
    console.log(`SKIP (pattern not match): ${filename}`);
    continue;
  }

  const subject = match[1]; // bio, earth, chem, physics, etc.

  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // 패턴 1: URL 파라미터에서 unit 파싱 (on_ prefix 없이 설정하는 부분)
  // if (m) unit = `bio_${m[1].padStart(2,'0')}`;
  // -> if (m) unit = `on_bio_${m[1].padStart(2,'0')}`;
  const pattern1 = new RegExp(`if \\(m\\) unit = \\\`${subject}_\\$\\{m\\[1\\]\\.padStart\\(2,'0'\\)\\}\\\`;`, 'g');
  const replacement1 = `if (m) unit = \`on_${subject}_\${m[1].padStart(2,'0')}\`;`;

  if (content.match(pattern1)) {
    content = content.replace(pattern1, replacement1);
    changed = true;
  }

  // 패턴 2: 파일명에서 unit 파싱
  // if (m2) unit = `bio_${m2[1].padStart(2,'0')}`;
  const pattern2 = new RegExp(`if \\(m2\\) unit = \\\`${subject}_\\$\\{m2\\[1\\]\\.padStart\\(2,'0'\\)\\}\\\`;`, 'g');
  const replacement2 = `if (m2) unit = \`on_${subject}_\${m2[1].padStart(2,'0')}\`;`;

  if (content.match(pattern2)) {
    content = content.replace(pattern2, replacement2);
    changed = true;
  }

  // 패턴 3: 제목에서 unit 파싱
  // if (m3) unit = `bio_${m3[1].padStart(2,'0')}`;
  const pattern3 = new RegExp(`if \\(m3\\) unit = \\\`${subject}_\\$\\{m3\\[1\\]\\.padStart\\(2,'0'\\)\\}\\\`;`, 'g');
  const replacement3 = `if (m3) unit = \`on_${subject}_\${m3[1].padStart(2,'0')}\`;`;

  if (content.match(pattern3)) {
    content = content.replace(pattern3, replacement3);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    updated++;
    console.log(`Updated: ${filename}`);
  }
}

console.log(`\n========== Summary ==========`);
console.log(`Total updated: ${updated} files`);
console.log(`Total processed: ${files.length} files`);

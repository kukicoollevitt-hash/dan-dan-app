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
  // on_bio_01.html -> bio, 01
  const match = filename.match(/^on_([a-z0-9]+)_(\d{2})\.html$/);
  if (!match) {
    console.log(`SKIP (pattern not match): ${filename}`);
    continue;
  }

  const subject = match[1]; // bio, earth, chem, physics, etc.

  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // 모든 `xxx_${...}` 형태를 `on_subject_${...}` 형태로 수정 (단, on_이 없는 경우만)
  // 패턴: if (m) unit = `xxx_${m[1].padStart(2,'0')}`;
  // 단, 이미 on_xxx_로 시작하면 스킵

  // m 변수 사용하는 경우
  const mPatterns = [
    /if \(m\) unit = `(?!on_)[a-z]+_\$\{m\[1\]\.padStart\(2,'0'\)\}`;/g,
    /if \(m2\) unit = `(?!on_)[a-z]+_\$\{m2\[1\]\.padStart\(2,'0'\)\}`;/g,
    /if \(m3\) unit = `(?!on_)[a-z]+_\$\{m3\[1\]\.padStart\(2,'0'\)\}`;/g
  ];

  const replacements = [
    `if (m) unit = \`on_${subject}_\${m[1].padStart(2,'0')}\`;`,
    `if (m2) unit = \`on_${subject}_\${m2[1].padStart(2,'0')}\`;`,
    `if (m3) unit = \`on_${subject}_\${m3[1].padStart(2,'0')}\`;`
  ];

  for (let i = 0; i < mPatterns.length; i++) {
    if (content.match(mPatterns[i])) {
      content = content.replace(mPatterns[i], replacements[i]);
      changed = true;
    }
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

const fs = require('fs');
const path = require('path');

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

// 이전 CSS
const oldCSS = `.vocab-message {
      background: #ea720f;
      border: none;
      border-radius: 16px;
      padding: 16px 32px;
      color: #fff;
      font-size: 18px;
      font-weight: 700;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      text-align: center;
    }`;

// 새로운 예쁜 CSS
const newCSS = `.vocab-message {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%);
      border: none;
      border-radius: 50px;
      padding: 18px 40px;
      color: #fff;
      font-size: 17px;
      font-weight: 700;
      box-shadow: 0 6px 20px rgba(217, 119, 6, 0.4), inset 0 1px 0 rgba(255,255,255,0.2);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      text-align: center;
      position: relative;
      letter-spacing: 0.5px;
      text-shadow: 0 1px 2px rgba(0,0,0,0.2);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .vocab-message:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(217, 119, 6, 0.5), inset 0 1px 0 rgba(255,255,255,0.2);
    }
    .vocab-message::before {
      content: '';
      position: absolute;
      top: 3px;
      left: 20px;
      right: 20px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
      border-radius: 50%;
    }`;

let updated = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  if (content.includes(oldCSS)) {
    content = content.replace(oldCSS, newCSS);
    fs.writeFileSync(file, content);
    updated++;
    console.log(`Updated: ${path.basename(file)}`);
  }
}

console.log(`\nTotal updated: ${updated} files`);

const fs = require('fs');
const path = require('path');

function findAllHtmlFiles(dir) {
  let results = [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(findAllHtmlFiles(filePath));
    } else if (file.endsWith('.html') && (file.startsWith('deep_') || file.startsWith('on_'))) {
      results.push(filePath);
    }
  }
  return results;
}

const brainupDir = '/Users/dandan/Desktop/dan-dan-app_1217/public/BRAINUP';
const files = findAllHtmlFiles(brainupDir);

console.log(`Found ${files.length} HTML files\n`);

// ========== 1. 제목 박스 (vocab-message) 수정 ==========
const oldVocabMessage = `.vocab-message {
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

const newVocabMessage = `.vocab-message {
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

// ========== 2. 채점 결과 CSS 수정 ==========
const oldVocabResult = `.vocab-result { margin-top: 20px; background: #fff4ee; border: 1px solid #f3c8b4; border-radius: 10px; padding: 10px 12px; font-size: 13px; display: none; }`;

const newVocabResultCSS = `.vocab-result { margin-top: 24px; background: #fff9f5; border: 2px solid #e8d4c4; border-radius: 16px; padding: 0; font-size: 14px; display: none; box-shadow: 0 4px 15px rgba(192, 74, 59, 0.1); overflow: hidden; }
    .vocab-result-header { background: linear-gradient(135deg, #d35400 0%, #e67e22 100%); padding: 16px 20px; color: white; }
    .vocab-result-header .score-title { font-size: 13px; font-weight: 500; opacity: 0.9; margin-bottom: 4px; }
    .vocab-result-header .score-main { font-size: 26px; font-weight: 700; display: flex; align-items: baseline; gap: 8px; }
    .vocab-result-header .score-main .score-percent { font-size: 15px; opacity: 0.85; }
    .vocab-result-body { padding: 16px 20px; background: #fffcfa; }
    .vocab-result-body .answer-title { font-size: 14px; font-weight: 700; color: #5d4e37; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
    .vocab-result-body .answer-title::before { content: ''; width: 4px; height: 16px; background: linear-gradient(135deg, #d35400 0%, #e67e22 100%); border-radius: 2px; }
    .vocab-answer-item { display: flex; align-items: center; padding: 10px 14px; margin-bottom: 8px; border-radius: 10px; font-size: 13.5px; transition: transform 0.15s ease; }
    .vocab-answer-item:hover { transform: translateX(4px); }
    .vocab-answer-item:last-child { margin-bottom: 0; }
    .vocab-answer-item.correct { background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%); border-left: 3px solid #4caf50; }
    .vocab-answer-item.wrong { background: linear-gradient(135deg, #fff4ee 0%, #ffebe0 100%); border-left: 3px solid #c04a3b; }
    .vocab-answer-item .item-num { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px; margin-right: 12px; flex-shrink: 0; }
    .vocab-answer-item.correct .item-num { background: #4caf50; color: white; }
    .vocab-answer-item.wrong .item-num { background: #c04a3b; color: white; }
    .vocab-answer-item .item-icon { font-size: 16px; margin-right: 8px; }
    .vocab-answer-item .item-text { flex: 1; color: #5d4e37; }
    .vocab-answer-item.wrong .correct-answer { color: #d35400; font-weight: 600; margin-left: 4px; }`;

let titleUpdated = 0;
let cssUpdated = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // 1. 제목 박스 수정
  if (content.includes(oldVocabMessage)) {
    content = content.replace(oldVocabMessage, newVocabMessage);
    titleUpdated++;
    changed = true;
  }

  // 2. 채점 결과 CSS 수정
  if (content.includes(oldVocabResult)) {
    content = content.replace(oldVocabResult, newVocabResultCSS);
    cssUpdated++;
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Updated: ${path.basename(file)}`);
  }
}

console.log(`\n========== Summary ==========`);
console.log(`Title box updated: ${titleUpdated} files`);
console.log(`Result CSS updated: ${cssUpdated} files`);
console.log(`Total files processed: ${files.length}`);

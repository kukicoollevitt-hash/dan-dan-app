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

// 이전 CSS (보라색)
const oldCSS = `.vocab-result { margin-top: 24px; background: linear-gradient(135deg, #fefefe 0%, #f8f9fa 100%); border: none; border-radius: 16px; padding: 0; font-size: 14px; display: none; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden; }
    .vocab-result-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 18px 20px; color: white; }
    .vocab-result-header .score-title { font-size: 13px; font-weight: 500; opacity: 0.9; margin-bottom: 6px; }
    .vocab-result-header .score-main { font-size: 28px; font-weight: 700; display: flex; align-items: baseline; gap: 8px; }
    .vocab-result-header .score-main .score-percent { font-size: 16px; opacity: 0.85; }
    .vocab-result-body { padding: 16px 20px; }
    .vocab-result-body .answer-title { font-size: 14px; font-weight: 700; color: #333; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
    .vocab-result-body .answer-title::before { content: ''; width: 4px; height: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 2px; }
    .vocab-answer-item { display: flex; align-items: center; padding: 10px 14px; margin-bottom: 8px; border-radius: 10px; font-size: 13.5px; transition: transform 0.15s ease; }
    .vocab-answer-item:hover { transform: translateX(4px); }
    .vocab-answer-item:last-child { margin-bottom: 0; }
    .vocab-answer-item.correct { background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%); border-left: 3px solid #4caf50; }
    .vocab-answer-item.wrong { background: linear-gradient(135deg, #ffebee 0%, #fce4ec 100%); border-left: 3px solid #ef5350; }
    .vocab-answer-item .item-num { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px; margin-right: 12px; flex-shrink: 0; }
    .vocab-answer-item.correct .item-num { background: #4caf50; color: white; }
    .vocab-answer-item.wrong .item-num { background: #ef5350; color: white; }
    .vocab-answer-item .item-icon { font-size: 16px; margin-right: 8px; }
    .vocab-answer-item .item-text { flex: 1; color: #333; }
    .vocab-answer-item.wrong .correct-answer { color: #1565c0; font-weight: 600; margin-left: 4px; }`;

// 새 CSS (주황/베이지 톤)
const newCSS = `.vocab-result { margin-top: 24px; background: #fff9f5; border: 2px solid #e8d4c4; border-radius: 16px; padding: 0; font-size: 14px; display: none; box-shadow: 0 4px 15px rgba(192, 74, 59, 0.1); overflow: hidden; }
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

let updated = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  if (content.includes(oldCSS)) {
    content = content.replace(oldCSS, newCSS);
    fs.writeFileSync(file, content);
    updated++;
    console.log(`Updated CSS: ${path.basename(file)}`);
  }
}

console.log(`\nTotal CSS updated: ${updated} files`);

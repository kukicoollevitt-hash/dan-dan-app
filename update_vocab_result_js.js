const fs = require('fs');
const path = require('path');

// 이전 JS 패턴 (멀티라인)
const oldPattern = /vocabResultBox\.innerHTML =\s*`<div style="background:#f5f5f5; padding:12px; border-radius:8px; margin-bottom:10px;">\s*<p style="font-size:18px; margin:0;"><strong>📊 채점 결과: \$\{correctCnt\} \/ \$\{total\} \(\$\{scorePercent\}점\)<\/strong><\/p>\s*<\/div>\s*<div style="background:#fff; padding:10px; border:1px solid #ddd; border-radius:8px;">\s*<p style="font-weight:bold; margin:0 0 8px; color:#333;">📝 정답 해설<\/p>\s*\$\{fullMsgs\.map\(m => `<p style="margin:4px 0;">\$\{m\}<\/p>`\)\.join\(""\)\}\s*<\/div>`;/g;

// 새 JS 코드
const newCode = `// 각 문항별 결과 아이템 생성
            const answerItems = answers.map((ans, idx) => {
              const isCorrect = results[idx];
              const itemClass = isCorrect ? 'correct' : 'wrong';
              const icon = isCorrect ? '✓' : '✗';
              const correctAnswerHtml = isCorrect ? '' : \`<span class="correct-answer">(정답: \${ans})</span>\`;
              return \`<div class="vocab-answer-item \${itemClass}">
                <span class="item-num">\${idx + 1}</span>
                <span class="item-icon">\${icon}</span>
                <span class="item-text">\${isCorrect ? '정답' : '오답'} \${correctAnswerHtml}</span>
              </div>\`;
            }).join('');

            vocabResultBox.innerHTML =
              \`<div class="vocab-result-header">
                <div class="score-title">채점 결과</div>
                <div class="score-main">
                  <span class="score-num">\${correctCnt} / \${total}</span>
                  <span class="score-percent">(\${scorePercent}점)</span>
                </div>
              </div>
              <div class="vocab-result-body">
                <div class="answer-title">정답 해설</div>
                \${answerItems}
              </div>\`;`;

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

let updated = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  if (content.includes('채점 결과: ${correctCnt} / ${total}') && content.includes('📝 정답 해설')) {
    // 더 간단한 패턴으로 교체
    const simpleOld = /vocabResultBox\.innerHTML =[\s\S]*?`<div style="background:#f5f5f5[^`]*📊 채점 결과[^`]*📝 정답 해설[^`]*<\/div>`;/g;

    if (simpleOld.test(content)) {
      content = content.replace(simpleOld, newCode);
      fs.writeFileSync(file, content);
      updated++;
      console.log(`Updated: ${file}`);
    }
  }
}

console.log(`\nTotal updated: ${updated} files`);

const fs = require('fs');
const path = require('path');

function findUpFiles(dir) {
  let results = [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(findUpFiles(filePath));
    } else if (file.endsWith('.html') &&
               !file.startsWith('deep_') &&
               !file.startsWith('fit_') &&
               !file.startsWith('on_') &&
               !file.includes('template') &&
               !file.includes('backup') &&
               !file.includes('OLD') &&
               /^[a-z]+_\d+\.html$/.test(file)) {
      results.push(filePath);
    }
  }
  return results;
}

const brainupDir = '/Users/dandan/Desktop/dan-dan-app_1217/public/BRAINUP';
const files = findUpFiles(brainupDir);

console.log(`Found ${files.length} UP series HTML files\n`);

// 구식 패턴 - fullMsgs를 사용하는 인라인 스타일 HTML 생성 코드
const oldPattern = `// 결과 + 정답(해설) 바로 표시
            if (vocabResultBox) {
              vocabResultBox.style.display = "block";
              const scorePercent = Math.round((correctCnt / total) * 100);
              vocabResultBox.innerHTML =
                \`<div style="background:#f5f5f5; padding:12px; border-radius:8px; margin-bottom:10px;">
                  <p style="font-size:18px; margin:0;"><strong>📊 채점 결과: \${correctCnt} / \${total} (\${scorePercent}점)</strong></p>
                </div>
                <div style="background:#fff; padding:10px; border:1px solid #ddd; border-radius:8px;">
                  <p style="font-weight:bold; margin:0 0 8px; color:#333;">📝 정답 해설</p>
                  \${fullMsgs.map(m => \`<p style="margin:4px 0;">\${m}</p>\`).join("")}
                </div>\`;
            }`;

// 새 패턴 - 새 디자인 CSS 클래스를 사용하는 HTML 생성 코드
const newPattern = `// 결과 + 정답(해설) 바로 표시
            if (vocabResultBox) {
              vocabResultBox.style.display = "block";
              const scorePercent = Math.round((correctCnt / total) * 100);

              // 각 문항별 결과 아이템 생성
              const answerItems = Array.from(blanks).map((bw, idx) => {
                const ans = bw.dataset.answer ? bw.dataset.answer.trim() : '';
                const isCorrect = bw && bw.classList.contains('correct');
                const itemClass = isCorrect ? 'correct' : 'wrong';
                const icon = isCorrect ? '✓' : '✗';
                const correctAnswerHtml = isCorrect ? '' : \`<span class="correct-answer">(정답: \${ans})</span>\`;
                return \`<div class="vocab-answer-item \${itemClass}">
                  <span class="item-num">\${idx + 1}</span>
                  <span class="item-icon">\${icon}</span>
                  <span class="item-text">\${isCorrect ? '정답' : '오답'} \${correctAnswerHtml}</span>
                </div>\`;
              }).join('');

              vocabResultBox.innerHTML = \`
                <div class="vocab-result-header">
                  <div class="score-title">채점 결과</div>
                  <div class="score-main">\${correctCnt} / \${total} <span class="score-percent">(\${scorePercent}점)</span></div>
                </div>
                <div class="vocab-result-body">
                  <div class="answer-title">정답 확인</div>
                  \${answerItems}
                </div>
              \`;
            }`;

let updated = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  if (content.includes(oldPattern)) {
    content = content.replace(oldPattern, newPattern);
    fs.writeFileSync(file, content);
    updated++;
    console.log(`Updated: ${path.basename(file)}`);
  }
}

console.log(`\n========== Summary ==========`);
console.log(`Total updated: ${updated} files`);
console.log(`Total processed: ${files.length} files`);

const fs = require('fs');
const path = require('path');

function findSocialUpFiles(dir) {
  let results = [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(findSocialUpFiles(filePath));
    } else if ((file.match(/^geo_\d+\.html$/) || file.match(/^soc_\d+\.html$/))) {
      results.push(filePath);
    }
  }
  return results;
}

const brainupDir = '/Users/dandan/Desktop/dan-dan-app_1217/public/BRAINUP';
const files = findSocialUpFiles(brainupDir);

console.log(`Found ${files.length} social UP series HTML files\n`);

// 구식 패턴 - msgs를 사용하는 간단한 HTML
const oldPattern = `const score = total > 0 ? Math.round((correctCnt / total) * 100) : 0;
        vocabResultBox.innerHTML = \`<p><strong>점수: \${correctCnt} / \${total} (\${score}점)</strong></p><p>\${msgs.join('<br>')}</p>\`;
        vocabResultBox.style.display = 'block';`;

// 새 패턴 - 새 디자인 CSS 클래스를 사용
const newPattern = `const score = total > 0 ? Math.round((correctCnt / total) * 100) : 0;

        // 각 문항별 결과 아이템 생성
        const answerItems = Array.from(blanks).map((bw, idx) => {
          const ans = bw.dataset.answer ? bw.dataset.answer.split(',')[0].trim() : '';
          const isCorrect = bw.classList.contains('correct');
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
            <div class="score-main">\${correctCnt} / \${total} <span class="score-percent">(\${score}점)</span></div>
          </div>
          <div class="vocab-result-body">
            <div class="answer-title">정답 확인</div>
            \${answerItems}
          </div>
        \`;
        vocabResultBox.style.display = 'block';`;

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

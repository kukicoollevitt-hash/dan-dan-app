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

// 문제: answers 변수가 정의되지 않음
// 해결: answers.map 대신 blanks에서 직접 answer를 가져오도록 수정

const oldCode = `// 각 문항별 결과 아이템 생성
              const answerItems = answers.map((ans, idx) => {
                const bw = blanks[idx];
                const isCorrect = bw && bw.classList.contains('correct');
                const itemClass = isCorrect ? 'correct' : 'wrong';
                const icon = isCorrect ? '✓' : '✗';
                const correctAnswerHtml = isCorrect ? '' : \`<span class="correct-answer">(정답: \${ans})</span>\`;
                return \`<div class="vocab-answer-item \${itemClass}">
                  <span class="item-num">\${idx + 1}</span>
                  <span class="item-icon">\${icon}</span>
                  <span class="item-text">\${isCorrect ? '정답' : '오답'} \${correctAnswerHtml}</span>
                </div>\`;
              }).join('');`;

const newCode = `// 각 문항별 결과 아이템 생성
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
              }).join('');`;

let updated = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  if (content.includes(oldCode)) {
    content = content.replace(oldCode, newCode);
    fs.writeFileSync(file, content);
    updated++;
    console.log(`Fixed: ${path.basename(file)}`);
  }
}

console.log(`\nTotal fixed: ${updated} files`);

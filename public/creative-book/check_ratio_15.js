const fs = require('fs');
const path = require('path');

const dir = '/Users/dandan/Desktop/brainmoon_academy0402/public/creative-book';
const files = fs.readdirSync(dir).filter(f => f.endsWith('_season1_quiz.html'));

let issues = [];

files.forEach(file => {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');

  // Extract quizDataSeason1
  const match = content.match(/const\s+quizDataSeason1\s*=\s*\[([\s\S]*?)\];/);
  if (!match) return;

  try {
    // Parse the quiz data
    const quizStr = '[' + match[1] + ']';
    const cleaned = quizStr
      .replace(/\/\/[^\n]*/g, '') // remove comments
      .replace(/,(\s*[}\]])/g, '$1'); // remove trailing commas

    const quizData = eval(cleaned);

    quizData.forEach((q, idx) => {
      if (!q.options || q.options.length < 2) return;

      const correctIdx = q.correct;
      const correctLen = q.options[correctIdx].length;

      // Find shortest wrong answer
      let shortestWrong = Infinity;
      let shortestWrongText = '';
      q.options.forEach((opt, i) => {
        if (i !== correctIdx && opt.length < shortestWrong) {
          shortestWrong = opt.length;
          shortestWrongText = opt;
        }
      });

      if (shortestWrong > 0) {
        const ratio = correctLen / shortestWrong;
        if (ratio >= 1.5) {
          issues.push({
            file,
            gate: q.gate,
            category: q.category,
            question: q.question.substring(0, 40),
            correct: q.options[correctIdx],
            correctLen,
            shortestWrong: shortestWrongText,
            shortestWrongLen: shortestWrong,
            ratio: ratio.toFixed(2)
          });
        }
      }
    });
  } catch (e) {
    console.error(`Error parsing ${file}: ${e.message}`);
  }
});

console.log(`\n=== 1.5x 비율 이상 문제 (${issues.length}개) ===\n`);

issues.sort((a, b) => parseFloat(b.ratio) - parseFloat(a.ratio));

issues.forEach(i => {
  console.log(`📁 ${i.file} | gate ${i.gate} (${i.category})`);
  console.log(`   Q: ${i.question}...`);
  console.log(`   ✅ 정답(${i.correctLen}자): ${i.correct}`);
  console.log(`   ❌ 최단오답(${i.shortestWrongLen}자): ${i.shortestWrong}`);
  console.log(`   📊 비율: ${i.ratio}x`);
  console.log('');
});

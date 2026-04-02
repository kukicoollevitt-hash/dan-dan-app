const fs = require('fs');
const path = require('path');
const dir = './public/creative-book';

let problems = [];
let total = 0;

fs.readdirSync(dir).filter(f => f.endsWith('_quiz.html')).forEach(file => {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  const match = content.match(/const quizDataSeason2 = (\[[\s\S]*?\]);/);
  if (!match) return;

  try {
    const quiz = eval(match[1]);
    quiz.forEach((q, i) => {
      if (!q.options || q.options.length !== 4) return;
      const correctLen = q.options[q.correct].length;
      const wrongLens = q.options.filter((_, idx) => idx !== q.correct).map(o => o.length);
      const avgWrong = wrongLens.reduce((a,b) => a+b, 0) / 3;
      const diff = Math.round(correctLen - avgWrong);
      if (diff > 10) {
        problems.push({file, q: i+1, diff, correctLen, avgWrong: Math.round(avgWrong)});
        total++;
      }
    });
  } catch(e) {}
});

problems.sort((a,b) => b.diff - a.diff);
console.log('=== 10자 이상 차이 문제 (상위 30개) ===');
problems.slice(0, 30).forEach(p => {
  console.log(`${p.file} Q${p.q}: 정답 ${p.correctLen}자, 오답평균 ${p.avgWrong}자 (차이 ${p.diff}자)`);
});
console.log('');
console.log(`10자 이상 차이: ${total}개`);

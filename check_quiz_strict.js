const fs = require('fs');
const path = '/Users/dandan/Desktop/brainmoon_academy0402/public/creative-book';
const files = fs.readdirSync(path).filter(f => f.endsWith('_season1_quiz.html')).sort();

let issues = [];

files.forEach(file => {
  const content = fs.readFileSync(path + '/' + file, 'utf8');
  const match = content.match(/quizDataSeason1\s*=\s*\[([\s\S]*?)\];/);
  if (!match) return;

  try {
    const quizStr = match[1];
    const questions = quizStr.match(/\{[^{}]+\}/g);
    if (!questions) return;

    questions.forEach((q, idx) => {
      const optMatch = q.match(/options:\s*\[([^\]]+)\]/);
      if (!optMatch) return;
      const optStr = optMatch[1];
      const opts = optStr.match(/"[^"]+"/g);
      if (!opts || opts.length !== 4) return;
      const correctMatch = q.match(/correct:\s*(\d)/);
      if (!correctMatch) return;
      const correctIdx = parseInt(correctMatch[1]);
      const lengths = opts.map(o => o.replace(/"/g, '').length);
      const correctLen = lengths[correctIdx];
      const avgWrongLen = lengths.filter((l, i) => i !== correctIdx).reduce((a,b) => a+b, 0) / 3;

      // 1.5배 이상 차이나면 표시
      if (correctLen > avgWrongLen * 1.5 && correctLen > 15) {
        issues.push({
          file: file,
          gate: idx + 1,
          correctLen,
          avgWrongLen: Math.round(avgWrongLen),
          ratio: (correctLen / avgWrongLen).toFixed(2),
          options: opts.map(o => o.replace(/"/g, '')),
          correctIdx
        });
      }
    });
  } catch(e) {}
});

console.log('=== 정답/오답 길이 비율 1.5배 이상 (정답 15자 초과) ===');
console.log('총 ' + issues.length + '개 발견\n');
issues.forEach(i => {
  console.log('📁 ' + i.file + ' - 관문 ' + i.gate + ' (비율: ' + i.ratio + 'x)');
  console.log('   정답(' + (i.correctIdx+1) + '번): ' + i.correctLen + '자, 오답 평균: ' + i.avgWrongLen + '자');
  i.options.forEach((o, idx) => {
    const marker = idx === i.correctIdx ? '✅' : '  ';
    console.log('   ' + marker + (idx + 1) + '. ' + o.substring(0, 50) + (o.length > 50 ? '...' : '') + ' (' + o.length + '자)');
  });
  console.log('');
});

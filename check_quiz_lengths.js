const fs = require('fs');
const path = '/Users/dandan/Desktop/brainmoon_academy0402/public/creative-book';
const files = fs.readdirSync(path).filter(f => f.endsWith('_season1_quiz.html')).sort();

let issues = [];

files.forEach(file => {
  const content = fs.readFileSync(path + '/' + file, 'utf8');

  // quizDataSeason1 추출
  const match = content.match(/quizDataSeason1\s*=\s*\[([\s\S]*?)\];/);
  if (!match) return;

  try {
    // 각 문제 추출
    const quizStr = match[1];
    const questions = quizStr.match(/\{[^{}]+\}/g);

    if (!questions) return;

    questions.forEach((q, idx) => {
      // options 추출
      const optMatch = q.match(/options:\s*\[([^\]]+)\]/);
      if (!optMatch) return;

      const optStr = optMatch[1];
      const opts = optStr.match(/"[^"]+"/g);
      if (!opts || opts.length !== 4) return;

      // correct 추출
      const correctMatch = q.match(/correct:\s*(\d)/);
      if (!correctMatch) return;
      const correctIdx = parseInt(correctMatch[1]);

      // 길이 비교
      const lengths = opts.map(o => o.replace(/"/g, '').length);
      const correctLen = lengths[correctIdx];
      const avgWrongLen = lengths.filter((l, i) => i !== correctIdx).reduce((a,b) => a+b, 0) / 3;

      // 정답이 오답 평균보다 2배 이상 길면 문제
      if (correctLen > avgWrongLen * 2 && correctLen > 20) {
        issues.push({
          file: file,
          gate: idx + 1,
          correctLen,
          avgWrongLen: Math.round(avgWrongLen),
          correctIdx: correctIdx + 1,
          options: opts.map(o => o.replace(/"/g, ''))
        });
      }
    });
  } catch(e) {
    console.error('Error in ' + file + ': ' + e.message);
  }
});

console.log('=== 정답이 오답보다 현저히 긴 문제들 (시즌1) ===');
console.log('총 ' + issues.length + '개 발견\n');

issues.forEach(i => {
  console.log('📁 ' + i.file + ' - 관문 ' + i.gate);
  console.log('   정답(' + i.correctIdx + '번) 길이: ' + i.correctLen + '자, 오답 평균: ' + i.avgWrongLen + '자');
  i.options.forEach((o, idx) => {
    const marker = idx + 1 === i.correctIdx ? '✅' : '  ';
    console.log('   ' + marker + (idx + 1) + '. ' + o.substring(0, 60) + (o.length > 60 ? '...' : ''));
  });
  console.log('');
});

console.log('\n총 검사 파일: ' + files.length + '개');

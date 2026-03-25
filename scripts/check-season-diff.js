const fs = require('fs');
const glob = require('glob');

const files = glob.sync('/Users/dandan/Desktop/brainmoon_academy0325/public/creative-book/*_season1_quiz.html');

const identical = [];
const different = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');

  // Season1 첫 질문 추출
  const s1Match = content.match(/quizDataSeason1\s*=\s*\[[\s\S]*?question:\s*"([^"]+)"/);
  const s2Match = content.match(/quizDataSeason2\s*=\s*\[[\s\S]*?question:\s*"([^"]+)"/);

  if (s1Match && s2Match) {
    const s1q = s1Match[1];
    const s2q = s2Match[1];

    // 문장 끝의 인가요/입니까만 다른지 확인
    const s1Clean = s1q.replace(/인가요\?|입니까\?|입니까|인가요|\?/g, '').trim();
    const s2Clean = s2q.replace(/인가요\?|입니까\?|입니까|인가요|\?/g, '').trim();

    const filename = file.split('/').pop();

    if (s1Clean === s2Clean) {
      identical.push({
        file: filename,
        s1: s1q,
        s2: s2q
      });
    } else {
      different.push(filename);
    }
  }
});

console.log('=== Season 1/2 동일한 파일 (문제 있음) ===');
identical.forEach(item => {
  console.log(`\n⚠️ ${item.file}`);
  console.log(`  S1: ${item.s1.substring(0, 60)}...`);
  console.log(`  S2: ${item.s2.substring(0, 60)}...`);
});

console.log(`\n\n=== Season 1/2 차별화된 파일 (정상) ===`);
console.log(different.join(', '));

console.log(`\n\n총계: 동일(문제) ${identical.length}개, 차별화(정상) ${different.length}개`);

const fs = require('fs');
const path = require('path');

const quizDir = path.join(__dirname, '../public/creative-book');

// 퀴즈 파일 목록 가져오기
const quizFiles = fs.readdirSync(quizDir)
  .filter(f => f.endsWith('_season1_quiz.html'))
  .sort();

console.log(`총 ${quizFiles.length}개 퀴즈 파일 분석\n`);

const issues = [];

quizFiles.forEach((file, fileIdx) => {
  const filePath = path.join(quizDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  // 시즌1, 시즌2, 시즌3 데이터 추출
  const seasons = ['quizDataSeason1', 'quizDataSeason2', 'quizDataSeason3'];

  seasons.forEach(seasonVar => {
    // 해당 시즌 데이터 블록 찾기
    const regex = new RegExp(`const ${seasonVar} = \\[([\\s\\S]*?)\\];`, 'm');
    const match = content.match(regex);

    if (!match) return;

    const dataBlock = match[1];

    // 각 문제 추출
    const questionRegex = /\{\s*gate:\s*(\d+),\s*category:\s*"([^"]+)",\s*question:\s*"([^"]+)",\s*options:\s*\[([\s\S]*?)\],\s*correct:\s*(\d+)\s*\}/g;

    let qMatch;
    while ((qMatch = questionRegex.exec(dataBlock)) !== null) {
      const gate = parseInt(qMatch[1]);
      const category = qMatch[2];
      const question = qMatch[3];
      const optionsBlock = qMatch[4];
      const correctIdx = parseInt(qMatch[5]);

      // 옵션들 추출
      const optionRegex = /"([^"]+)"/g;
      const options = [];
      let oMatch;
      while ((oMatch = optionRegex.exec(optionsBlock)) !== null) {
        options.push(oMatch[1]);
      }

      if (options.length !== 4) return;

      // 각 옵션의 길이 계산
      const lengths = options.map(o => o.length);
      const correctLen = lengths[correctIdx];
      const wrongLens = lengths.filter((_, i) => i !== correctIdx);

      const avgWrongLen = wrongLens.reduce((a, b) => a + b, 0) / wrongLens.length;
      const maxWrongLen = Math.max(...wrongLens);
      const minWrongLen = Math.min(...wrongLens);

      // 정답이 다른 선지보다 현저히 긴 경우 (1.5배 이상)
      const ratio = correctLen / avgWrongLen;

      // 심각한 문제만 체크:
      // 정답이 가장 길고, 정답 길이가 오답 평균의 2배 이상인 경우

      const isCorrectLongest = correctLen === Math.max(...lengths);
      const isSerious = isCorrectLongest && ratio >= 2.0 && correctLen > 25;

      if (isSerious) {
        const seasonNum = seasonVar.replace('quizDataSeason', '');
        issues.push({
          file,
          season: seasonNum,
          gate,
          category,
          question: question.substring(0, 40) + '...',
          options: options.map((o, i) => ({
            idx: i,
            text: o,
            len: o.length,
            isCorrect: i === correctIdx
          })),
          correctLen,
          avgWrongLen: avgWrongLen.toFixed(1),
          ratio: ratio.toFixed(2)
        });
      }
    }
  });
});

console.log(`\n========================================`);
console.log(`정답 선지가 현저히 긴 문항: ${issues.length}개`);
console.log(`========================================\n`);

issues.forEach((issue, idx) => {
  console.log(`\n[${idx + 1}] ${issue.file} - 시즌${issue.season} - ${issue.gate}번 (${issue.category})`);
  console.log(`   질문: ${issue.question}`);
  console.log(`   선지 길이:`);
  issue.options.forEach(o => {
    const marker = o.isCorrect ? '★정답' : '     ';
    console.log(`     ${marker} ${o.idx + 1}) [${o.len}자] ${o.text.substring(0, 50)}${o.text.length > 50 ? '...' : ''}`);
  });
  console.log(`   정답길이: ${issue.correctLen}, 오답평균: ${issue.avgWrongLen}, 비율: ${issue.ratio}배`);
});

if (issues.length === 0) {
  console.log('모든 퀴즈의 선지 길이가 적절합니다.');
}

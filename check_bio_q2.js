const fs = require('fs');

const content = fs.readFileSync('public/BRAINUP/science/on_bio_content.js', 'utf8');

const unitPattern = /on_bio_(\d+):\s*\{/g;
let match;
const issues = [];

while ((match = unitPattern.exec(content)) !== null) {
  const unitNum = match[1];
  const num = parseInt(unitNum);
  if (num < 1 || num > 20) continue;

  const unitKey = 'on_bio_' + unitNum.padStart(2, '0');
  const startIdx = match.index;
  const unitBlock = content.slice(startIdx, startIdx + 8000);

  // paragraphMain 추출
  const pmMatch = unitBlock.match(/paragraphMain:\s*\[([\s\S]*?)\]/);
  if (!pmMatch) continue;
  const paragraphMain = pmMatch[1].split(/'\s*,\s*'/).map(p => p.replace(/'/g, '').trim());

  // q2_opts 추출
  const q2OptsMatch = unitBlock.match(/q2_opts:\s*\[([\s\S]*?)\]/);
  if (!q2OptsMatch) continue;
  const q2Opts = q2OptsMatch[1].split(/'\s*,\s*'/).map(p => p.replace(/'/g, '').trim());

  // answerKey q2 추출
  const answerMatch = unitBlock.match(/answerKey:\s*\{[^}]*q2:\s*['"](\\d)['"]/);
  if (!answerMatch) continue;
  const q2Answer = parseInt(answerMatch[1]);

  console.log(`\n=== ${unitKey} ===`);
  console.log('paragraphMain:');
  paragraphMain.forEach((p, i) => console.log(`  ${i+1}문단: ${p.substring(0, 50)}...`));
  console.log('q2_opts:');
  q2Opts.forEach((opt, i) => {
    const isAnswer = (i + 1) === q2Answer ? ' ✅정답' : '';
    console.log(`  ${i+1}번: ${opt.substring(0, 60)}...${isAnswer}`);
  });

  // 각 보기가 실제 문단과 맞는지 체크
  for (let i = 0; i < q2Opts.length; i++) {
    const opt = q2Opts[i];
    const optParagraphMatch = opt.match(/(\d)문단/);
    if (!optParagraphMatch) continue;
    const claimedParagraph = parseInt(optParagraphMatch[1]);

    // 보기의 내용 추출 (: 이후)
    const colonIdx = opt.indexOf(':');
    if (colonIdx === -1) continue;
    const claimedContent = opt.slice(colonIdx + 1).trim();

    // 실제 해당 문단의 내용
    const actualContent = paragraphMain[claimedParagraph - 1] || '';

    // 유사도 체크 (키워드 기반)
    const claimedWords = claimedContent.replace(/[^가-힣a-zA-Z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 1);
    const actualWords = actualContent.replace(/[^가-힣a-zA-Z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 1);

    let matchCount = 0;
    for (const word of claimedWords) {
      if (actualWords.some(aw => aw.includes(word) || word.includes(aw))) {
        matchCount++;
      }
    }

    const similarity = claimedWords.length > 0 ? matchCount / claimedWords.length : 0;

    if (i + 1 !== q2Answer && similarity > 0.5) {
      console.log(`  ⚠️ ${i+1}번 보기가 실제 ${claimedParagraph}문단 내용과 유사함! (유사도: ${(similarity*100).toFixed(0)}%)`);
      issues.push(`${unitKey} - ${i+1}번 보기`);
    }
  }
}

console.log('\n========================================');
if (issues.length > 0) {
  console.log(`총 ${issues.length}개 잠재적 문제 발견:`);
  issues.forEach(i => console.log(`  - ${i}`));
} else {
  console.log('✅ 문제 없음');
}

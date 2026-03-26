const fs = require('fs');

const content = fs.readFileSync('public/BRAINUP/worldlit/on_world1_content.js', 'utf8');

const unitPattern = /on_world1_(\d+):\s*\{/g;
let match;
const issues = [];

while ((match = unitPattern.exec(content)) !== null) {
  const unitNum = match[1];
  const num = parseInt(unitNum);
  if (num < 1 || num > 40) continue;

  const unitKey = 'on_world1_' + unitNum.padStart(2, '0');
  const startIdx = match.index;
  const unitBlock = content.slice(startIdx, startIdx + 10000);

  // paragraphMain 추출
  const pmMatch = unitBlock.match(/paragraphMain:\s*\[([\s\S]*?)\]/);
  if (!pmMatch) continue;

  // paragraphMain 배열 파싱
  const pmRaw = pmMatch[1];
  const paragraphMain = [];
  const pmItems = pmRaw.match(/'[^']+'/g);
  if (pmItems) {
    pmItems.forEach(item => {
      paragraphMain.push(item.replace(/'/g, '').trim());
    });
  }

  // q2_opts 추출
  const q2OptsMatch = unitBlock.match(/q2_opts:\s*\[([\s\S]*?)\]/);
  if (!q2OptsMatch) continue;

  const optsRaw = q2OptsMatch[1];
  const q2Opts = [];
  const optItems = optsRaw.match(/'[^']+'/g);
  if (optItems) {
    optItems.forEach(item => {
      q2Opts.push(item.replace(/'/g, '').trim());
    });
  }

  // answerKey q2 추출
  const answerMatch = unitBlock.match(/answerKey:\s*\{[^}]*q2:\s*['"](\\d)['"]/);
  if (!answerMatch) continue;
  const q2Answer = parseInt(answerMatch[1]);

  console.log('\n=== ' + unitKey + ' ===');
  console.log('paragraphMain:');
  paragraphMain.forEach((p, i) => console.log('  ' + (i+1) + '문단: ' + p.substring(0, 40) + '...'));
  console.log('정답: ' + q2Answer + '번');
  console.log('q2_opts:');

  let hasIssue = false;
  q2Opts.forEach((opt, i) => {
    const isAnswer = (i + 1) === q2Answer ? ' ✅정답' : '';

    // 보기에서 문단 번호 추출
    const paragraphNumMatch = opt.match(/(\d)문단/);
    if (!paragraphNumMatch) {
      console.log('  ' + (i+1) + '번: ' + opt.substring(0, 50) + '...' + isAnswer);
      return;
    }
    const claimedParagraph = parseInt(paragraphNumMatch[1]);

    // 보기 내용 추출 (: 이후)
    const colonIdx = opt.indexOf(':');
    const claimedContent = colonIdx !== -1 ? opt.slice(colonIdx + 1).trim() : opt;

    // 실제 해당 문단의 내용
    const actualContent = paragraphMain[claimedParagraph - 1] || '';

    // 키워드 매칭 체크
    const claimedWords = claimedContent.replace(/[^가-힣a-zA-Z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 1);
    const actualWords = actualContent.replace(/[^가-힣a-zA-Z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 1);

    let matchCount = 0;
    for (const word of claimedWords) {
      if (actualWords.some(aw => aw.includes(word) || word.includes(aw))) {
        matchCount++;
      }
    }

    const similarity = claimedWords.length > 0 ? matchCount / claimedWords.length : 0;

    // 오답인데 실제 내용과 일치하면 문제
    if ((i + 1) !== q2Answer && similarity > 0.4) {
      console.log('  ' + (i+1) + '번: ' + opt.substring(0, 50) + '... ⚠️실제' + claimedParagraph + '문단과 일치!(' + (similarity*100).toFixed(0) + '%)');
      hasIssue = true;
    } else {
      console.log('  ' + (i+1) + '번: ' + opt.substring(0, 50) + '...' + isAnswer);
    }
  });

  if (hasIssue) {
    issues.push(unitKey);
  }
}

console.log('\n========================================');
if (issues.length > 0) {
  console.log('총 ' + issues.length + '개 유닛에서 문제 발견:');
  issues.forEach(i => console.log('  - ' + i));
} else {
  console.log('✅ on_world1 01~40: 모든 q2 보기가 정상입니다.');
}

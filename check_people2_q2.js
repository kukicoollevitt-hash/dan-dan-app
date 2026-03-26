const fs = require('fs');

const content = fs.readFileSync('public/BRAINUP/person/on_people2_content.js', 'utf8');

const unitPattern = /on_people2_(\d+):\s*\{/g;
let match;
const errors = [];

while ((match = unitPattern.exec(content)) !== null) {
  const unitNum = match[1];
  const num = parseInt(unitNum);
  if (num < 1 || num > 40) continue;

  const unitKey = 'on_people2_' + unitNum.padStart(2, '0');
  const startIdx = match.index;
  const unitBlock = content.slice(startIdx, startIdx + 15000);

  // passage 추출 (4개 문단)
  const passageMatch = unitBlock.match(/passage:\s*\[([\s\S]*?)\]/);
  if (!passageMatch) continue;

  const passageRaw = passageMatch[1];
  const paragraphs = passageRaw.split(/'\s*,\s*'/).map(p =>
    p.replace(/<[^>]*>/g, '').replace(/'/g, '').trim()
  );

  // answerKey에서 q2 정답 추출
  const answerMatch = unitBlock.match(/answerKey:\s*\{[^}]*q2:\s*['"](\\d)['"]/);
  if (!answerMatch) continue;
  const q2Answer = parseInt(answerMatch[1]);

  // explain에서 q2 값 추출
  const explainMatch = unitBlock.match(/explain:\s*\{[\s\S]*?q2:\s*['"]([^'"]+)['"]/);
  if (!explainMatch) continue;
  const q2Explain = explainMatch[1];

  // q2 정답이 가리키는 문단 번호 확인
  const q2OptsMatch = unitBlock.match(/q2_opts:\s*\[([\s\S]*?)\]/);
  if (!q2OptsMatch) continue;

  const opts = q2OptsMatch[1].split(/'\s*,\s*'/);
  const correctOpt = opts[q2Answer - 1] || '';
  const paragraphNumMatch = correctOpt.match(/(\d)문단/);
  if (!paragraphNumMatch) continue;
  const correctParagraphNum = parseInt(paragraphNumMatch[1]);

  // explain이 해당 문단에 있는지 확인
  const targetParagraph = paragraphs[correctParagraphNum - 1] || '';

  if (!targetParagraph.includes(q2Explain)) {
    // 어느 문단에 있는지 찾기
    let foundIn = 0;
    for (let i = 0; i < paragraphs.length; i++) {
      if (paragraphs[i].includes(q2Explain)) {
        foundIn = i + 1;
        break;
      }
    }

    console.log('❌ ' + unitKey + ': q2 정답=' + q2Answer + '번(' + correctParagraphNum + '문단), 하이라이트는 ' + (foundIn ? foundIn + '문단' : '없음'));
    console.log('   explain: "' + q2Explain.substring(0, 50) + '..."');
    errors.push(unitKey);
  }
}

if (errors.length === 0) {
  console.log('✅ on_people2 01~40: 모든 q2 하이라이트가 정답 문단과 일치합니다.');
} else {
  console.log('\n총 ' + errors.length + '개 불일치 발견');
}

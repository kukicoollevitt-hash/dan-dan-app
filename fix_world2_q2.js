const fs = require('fs');

let content = fs.readFileSync('public/BRAINUP/worldlit/on_world2_content.js', 'utf8');

const unitPattern = /on_world2_(\d+):\s*\{/g;
let match;
const fixes = [];

while ((match = unitPattern.exec(content)) !== null) {
  const unitNum = match[1];
  const num = parseInt(unitNum);
  if (num < 1 || num > 40) continue;

  const unitKey = 'on_world2_' + unitNum.padStart(2, '0');
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
  const answerMatch = unitBlock.match(/answerKey:\s*\{[^}]*q2:\s*['"](\d)['"]/);
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
    // 정답 문단에서 적절한 하이라이트 텍스트 추출 (20~60자 정도)
    // <b> 태그 뒤부터 시작하는 텍스트를 찾음
    const cleanParagraph = targetParagraph;
    
    // 문장 중간에서 고유한 텍스트 추출 (30~50자)
    let newExplain = '';
    if (cleanParagraph.length > 40) {
      // 첫 번째 마침표까지의 내용 또는 적절한 길이
      const firstSentence = cleanParagraph.match(/[^.!?]+[.!?]/);
      if (firstSentence && firstSentence[0].length > 20) {
        newExplain = firstSentence[0].trim();
      } else {
        newExplain = cleanParagraph.substring(0, 50);
      }
    } else {
      newExplain = cleanParagraph;
    }
    
    fixes.push({
      unitKey,
      correctParagraphNum,
      oldExplain: q2Explain,
      newExplain: newExplain,
      targetParagraph: cleanParagraph.substring(0, 100)
    });
  }
}

// 결과 출력
fixes.forEach(f => {
  console.log('=== ' + f.unitKey + ' (정답: ' + f.correctParagraphNum + '문단) ===');
  console.log('OLD: ' + f.oldExplain);
  console.log('NEW: ' + f.newExplain);
  console.log('문단: ' + f.targetParagraph + '...');
  console.log('');
});

console.log('총 ' + fixes.length + '개 수정 필요');

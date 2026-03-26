const fs = require('fs');

const content = fs.readFileSync('public/BRAINUP/korlit/on_classic_content.js', 'utf8');

const unitPattern = /on_classic_(\d+):\s*\{/g;
let match;
const errors = [];

while ((match = unitPattern.exec(content)) !== null) {
  const unitNum = match[1];
  const num = parseInt(unitNum);
  if (num < 21 || num > 40) continue; // 21~40만 체크

  const unitKey = `on_classic_${unitNum}`;
  const startIdx = match.index;

  // 해당 유닛의 passage 추출
  const passageMatch = content.slice(startIdx, startIdx + 10000).match(/passage:\s*\[([\s\S]*?)\]/);
  if (!passageMatch) continue;

  const passageRaw = passageMatch[1];
  const plainPassage = passageRaw
    .replace(/<[^>]*>/g, '')
    .replace(/'/g, '')
    .replace(/\\'/g, "'")
    .replace(/,\s*$/gm, '')
    .replace(/\n/g, ' ');

  // explain 추출
  const explainMatch = content.slice(startIdx, startIdx + 10000).match(/explain:\s*\{([\s\S]*?)\n\s*\}/);
  if (!explainMatch) continue;

  const explainBlock = explainMatch[1];

  // q1~q4 추출
  ['q1', 'q2', 'q3', 'q4'].forEach(q => {
    const qMatch = explainBlock.match(new RegExp(`${q}:\\s*['"]([^'"]+)['"]`));
    if (!qMatch) return;

    const explainText = qMatch[1];

    // 마침표가 중간에 있는지 체크 (문장 경계 문제)
    const hasMidPeriod = /\.\s*[^$]/.test(explainText);
    if (hasMidPeriod) {
      console.log(`⚠️ ${unitKey} ${q}: 마침표 중간에 있음`);
      console.log(`   explain: "${explainText.substring(0, 80)}"`);
      errors.push(unitKey + ' ' + q + ' (마침표)');
    }

    if (!plainPassage.includes(explainText)) {
      console.log(`❌ ${unitKey} ${q}: passage에 없음`);
      console.log(`   explain: "${explainText.substring(0, 80)}"`);
      const keywords = explainText.substring(0, 15);
      const idx = plainPassage.indexOf(keywords.substring(0, 8));
      if (idx >= 0) {
        console.log(`   passage 유사: "${plainPassage.substring(idx, idx + 100)}"`);
      }
      errors.push(unitKey + ' ' + q);
    }
  });
}

if (errors.length === 0) {
  console.log('✅ on_classic 21~40: 모든 explain 값이 정상입니다.');
} else {
  console.log(`\n총 ${errors.length}개 오류 발견`);
}

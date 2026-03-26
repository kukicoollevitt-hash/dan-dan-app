const fs = require('fs');
const content = fs.readFileSync('public/BRAINUP/worldlit/on_world1_content.js', 'utf8');

const unitPattern = /on_world1_(\d+):\s*\{/g;
let match;
const errors = [];

while ((match = unitPattern.exec(content)) !== null) {
  const unitNum = match[1];
  const num = parseInt(unitNum);
  if (num < 1 || num > 40) continue;

  const unitKey = `on_world1_${unitNum.padStart(2, '0')}`;
  const startIdx = match.index;

  const passageMatch = content.slice(startIdx, startIdx + 10000).match(/passage:\s*\[([\s\S]*?)\]/);
  if (!passageMatch) continue;

  const passageRaw = passageMatch[1];
  const plainPassage = passageRaw
    .replace(/<[^>]*>/g, '')
    .replace(/'/g, '')
    .replace(/\\'/g, "'")
    .replace(/,\s*$/gm, '')
    .replace(/\n/g, ' ');

  const explainMatch = content.slice(startIdx, startIdx + 10000).match(/explain:\s*\{([\s\S]*?)\n\s*\}/);
  if (!explainMatch) continue;

  const explainBlock = explainMatch[1];

  ['q1', 'q2', 'q3', 'q4'].forEach(q => {
    const qMatch = explainBlock.match(new RegExp(`${q}:\\s*['"]([^'"]+)['"]`));
    if (!qMatch) return;

    const explainText = qMatch[1];

    // 중복 매칭 체크
    let count = 0;
    let idx = 0;
    while ((idx = plainPassage.indexOf(explainText, idx)) !== -1) {
      count++;
      idx += 1;
    }

    if (count > 1) {
      console.log(`❌ ${unitKey} ${q}: ${count}군데 중복 매칭 - "${explainText.slice(0, 40)}..."`);
      errors.push(unitKey + ' ' + q);
    } else if (count === 0) {
      console.log(`⚠️ ${unitKey} ${q}: 매칭 안됨 - "${explainText.slice(0, 40)}"`);
      errors.push(unitKey + ' ' + q);
    }
  });
}

if (errors.length === 0) {
  console.log('✅ on_world1 01~40: 모든 explain 값이 고유하게 매칭됩니다.');
} else {
  console.log(`\n총 ${errors.length}개 오류 발견`);
}

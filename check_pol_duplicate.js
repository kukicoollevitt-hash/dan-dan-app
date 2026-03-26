const fs = require('fs');
const content = fs.readFileSync('public/BRAINUP/social/on_pol_content.js', 'utf8');

const unitPattern = /on_pol_(\d+):\s*\{/g;
let match;

while ((match = unitPattern.exec(content)) !== null) {
  const unitNum = match[1];
  if (parseInt(unitNum) < 8) continue; // 08~20만 체크

  const unitKey = `on_pol_${unitNum}`;
  const startIdx = match.index;

  const passageMatch = content.slice(startIdx, startIdx + 8000).match(/passage:\s*\[([\s\S]*?)\]/);
  if (!passageMatch) continue;

  const passageRaw = passageMatch[1];
  const plainPassage = passageRaw
    .replace(/<[^>]*>/g, '')
    .replace(/'/g, '')
    .replace(/\\'/g, "'")
    .replace(/,\s*$/gm, '')
    .replace(/\n/g, ' ');

  const explainMatch = content.slice(startIdx, startIdx + 8000).match(/explain:\s*\{([\s\S]*?)\n\s*\}/);
  if (!explainMatch) continue;

  const explainBlock = explainMatch[1];

  ['q1', 'q2', 'q3', 'q4'].forEach(q => {
    const qMatch = explainBlock.match(new RegExp(`${q}:\\s*['"]([^'"]+)['"]`));
    if (!qMatch) return;

    const explainText = qMatch[1];

    // 짧은 explain 체크 (15자 미만)
    if (explainText.length < 15) {
      console.log(`⚠️ ${unitKey} ${q}: 짧음 (${explainText.length}자) - "${explainText}"`);
    }

    // 중복 매칭 체크
    let count = 0;
    let idx = 0;
    while ((idx = plainPassage.indexOf(explainText, idx)) !== -1) {
      count++;
      idx += 1;
    }
    if (count > 1) {
      console.log(`❌ ${unitKey} ${q}: ${count}군데 중복 매칭 - "${explainText.slice(0, 40)}..."`);
    }
  });
}

console.log('\n점검 완료');

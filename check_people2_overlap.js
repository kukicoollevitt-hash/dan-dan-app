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

  // explain 블록 추출
  const explainMatch = unitBlock.match(/explain:\s*\{([\s\S]*?)\n\s*\}/);
  if (!explainMatch) continue;

  const explainBlock = explainMatch[1];

  // q1~q4 explain 값 추출
  const explains = {};
  ['q1', 'q2', 'q3', 'q4'].forEach(q => {
    const qMatch = explainBlock.match(new RegExp(`${q}:\\s*['"]([^'"]+)['"]`));
    if (qMatch) {
      explains[q] = qMatch[1];
    }
  });

  // 겹침 체크: 한 explain이 다른 explain을 포함하는지
  const keys = Object.keys(explains);
  for (let i = 0; i < keys.length; i++) {
    for (let j = 0; j < keys.length; j++) {
      if (i === j) continue;
      const a = explains[keys[i]];
      const b = explains[keys[j]];
      if (a && b && b.includes(a) && a.length >= 3) {
        console.log(`❌ ${unitKey}: ${keys[i]} "${a.substring(0, 30)}..." 가 ${keys[j]} 안에 포함됨`);
        errors.push(`${unitKey} ${keys[i]}-${keys[j]}`);
      }
    }
  }
}

if (errors.length === 0) {
  console.log('✅ on_people2 01~40: 하이라이트 겹침 없음');
} else {
  console.log('\n총 ' + errors.length + '개 겹침 발견');
}

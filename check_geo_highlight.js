const fs = require('fs');

const content = fs.readFileSync('public/BRAINUP/social/on_geo_content.js', 'utf8');

const unitPattern = /on_geo_(\d+):\s*\{/g;
let match;
const errors = [];

while ((match = unitPattern.exec(content)) !== null) {
  const unitNum = match[1];
  const num = parseInt(unitNum);
  if (num < 3 || num > 20) continue; // 03~20만 체크

  const unitKey = `on_geo_${unitNum.padStart(2, '0')}`;
  const startIdx = match.index;

  // 해당 유닛의 passage 추출
  const passageMatch = content.slice(startIdx, startIdx + 10000).match(/passage:\s*\[([\s\S]*?)\]/);
  if (!passageMatch) continue;

  const passageRaw = passageMatch[1];
  // HTML 태그 제거하고 텍스트만 추출
  const plainPassage = passageRaw
    .replace(/<[^>]*>/g, '')  // HTML 태그 제거
    .replace(/'/g, '')         // 작은따옴표 제거
    .replace(/\\'/g, "'")      // 이스케이프된 따옴표 처리
    .replace(/,\s*$/gm, '')    // 줄 끝의 콤마 제거
    .replace(/\n/g, ' ');      // 줄바꿈을 공백으로

  // explain 추출
  const explainMatch = content.slice(startIdx, startIdx + 10000).match(/explain:\s*\{([\s\S]*?)\n\s*\}/);
  if (!explainMatch) continue;

  const explainBlock = explainMatch[1];

  // q1~q4 추출
  ['q1', 'q2', 'q3', 'q4'].forEach(q => {
    const qMatch = explainBlock.match(new RegExp(`${q}:\\s*['"]([^'"]+)['"]`));
    if (!qMatch) return;

    const explainText = qMatch[1];

    // 마침표가 중간에 있는지 체크 (문장 경계 규칙)
    const periodIdx = explainText.indexOf('.');
    if (periodIdx > 0 && periodIdx < explainText.length - 1) {
      console.log(`⚠️ ${unitKey} ${q}: 마침표가 중간에 있음 - "${explainText.substring(0, 50)}..."`);
      errors.push(unitKey + ' ' + q + ' (마침표)');
      return;
    }

    if (!plainPassage.includes(explainText)) {
      console.log(`❌ ${unitKey} ${q}:`);
      console.log(`   explain: "${explainText.substring(0, 60)}"`);
      // passage에서 비슷한 부분 찾기
      const keywords = explainText.substring(0, 10);
      const idx = plainPassage.indexOf(keywords.substring(0, 5));
      if (idx >= 0) {
        console.log(`   passage 유사: "${plainPassage.substring(idx, idx + 80)}"`);
      }
      errors.push(unitKey + ' ' + q);
    }
  });
}

if (errors.length === 0) {
  console.log('✅ on_geo 03~20: 모든 explain 값이 정상입니다.');
} else {
  console.log(`\n총 ${errors.length}개 오류 발견`);
}

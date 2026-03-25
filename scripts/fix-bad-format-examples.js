const fs = require('fs');
const path = require('path');

const vocabDataPath = path.join(__dirname, '..', 'public/brainfit-vocab-data.js');

let content = fs.readFileSync(vocabDataPath, 'utf-8');
const lines = content.split('\n');

let updatedCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // "example": "단어: XXX, 의미: YYY" 형식 찾기
  const badMatch = line.match(/"example":\s*"단어:\s*[^,]+,\s*의미:\s*[^"]+"/);
  if (badMatch) {
    // 비어있는 예시로 설정 (나중에 다시 생성)
    lines[i] = '    "example": ""';
    updatedCount++;
    console.log(`수정: ${line.substring(0, 60)}...`);
  }
}

console.log(`\n${updatedCount}개 잘못된 형식 제거 완료`);

fs.writeFileSync(vocabDataPath, lines.join('\n'), 'utf-8');
console.log('파일 저장 완료');

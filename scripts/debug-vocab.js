const fs = require('fs');
const path = require('path');

const vocabDataPath = path.join(__dirname, '..', 'public/brainfit-vocab-data.js');
let vocabData = fs.readFileSync(vocabDataPath, 'utf-8');

// 가격하한제 항목 찾기
const regex = /"word":\s*"가격하한제"[\s\S]*?"explanation":\s*"([^"]+)"/;
const match = vocabData.match(regex);
if (match) {
  console.log('explanation:', match[1]);
  
  const explainParts = match[1].match(/은\(는\)\s*(.+?)을\(를\)/);
  if (explainParts) {
    console.log('explainMeaning:', explainParts[1]);
  } else {
    console.log('explainParts not found');
    // 다른 패턴 시도
    console.log('전체 explanation:', match[1]);
  }
}

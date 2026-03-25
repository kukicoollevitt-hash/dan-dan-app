const fs = require('fs');
const path = require('path');

const vocabDataPath = path.join(__dirname, '..', 'public/brainfit-vocab-data.js');
let vocabData = fs.readFileSync(vocabDataPath, 'utf-8');

// 문제가 있는 explanation 패턴 찾기
// "\"단어\"은(는) 띄어쓰기된단어을(를) 의미합니다."
// 여기서 띄어쓰기된단어 = 단어에 띄어쓰기만 추가된 형태

let updatedCount = 0;

// 모든 항목 찾기
const regex = /\{\s*"word":\s*"([^"]+)",[\s\S]*?"meaning":\s*"([^"]+)",[\s\S]*?"explanation":\s*"([^"]+)"/g;

let match;
while ((match = regex.exec(vocabData)) !== null) {
  const word = match[1];
  const meaning = match[2];
  const explanation = match[3];
  
  const wordNoSpace = word.replace(/\s+/g, '');
  const meaningNoSpace = meaning.replace(/\s+/g, '');
  
  // explanation에서 의미 부분 추출
  const explainParts = explanation.match(/은\(는\)\s*(.+?)을\(를\)/);
  if (!explainParts) continue;
  
  const explainMeaning = explainParts[1];
  const explainMeaningNoSpace = explainMeaning.replace(/\s+/g, '');
  
  // explanation의 의미가 단어와 같고(단순 띄어쓰기), meaning은 다른 경우
  if (explainMeaningNoSpace === wordNoSpace && meaningNoSpace !== wordNoSpace) {
    const newExplanation = `\\"${word}\\"은(는) ${meaning}을(를) 의미합니다.`;
    vocabData = vocabData.replace(
      `"explanation": "${explanation}"`,
      `"explanation": "${newExplanation}"`
    );
    updatedCount++;
    console.log(`${word}: "${explainMeaning}" -> "${meaning}"`);
  }
}

console.log(`\nexplanation 업데이트: ${updatedCount}개`);

fs.writeFileSync(vocabDataPath, vocabData, 'utf-8');
console.log('파일 저장 완료');

const fs = require('fs');
const path = require('path');

const vocabDataPath = path.join(__dirname, '..', 'public/brainfit-vocab-data.js');
let vocabData = fs.readFileSync(vocabDataPath, 'utf-8');

let updatedCount = 0;

// 줄별로 처리
const lines = vocabData.split('\n');
let currentWord = '';
let currentMeaning = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // word 추출
  const wordMatch = line.match(/"word":\s*"([^"]+)"/);
  if (wordMatch) {
    currentWord = wordMatch[1];
  }
  
  // meaning 추출
  const meaningMatch = line.match(/"meaning":\s*"([^"]+)"/);
  if (meaningMatch) {
    currentMeaning = meaningMatch[1];
  }
  
  // explanation 찾아서 수정
  const explainMatch = line.match(/"explanation":\s*"([^"]+)"/);
  if (explainMatch && currentWord && currentMeaning) {
    const currentExplanation = explainMatch[1];
    const wordNoSpace = currentWord.replace(/\s+/g, '');
    const meaningNoSpace = currentMeaning.replace(/\s+/g, '');
    
    // explanation에서 의미 추출
    const explainMeaningMatch = currentExplanation.match(/은\(는\)\s*(.+?)을\(를\)/);
    if (explainMeaningMatch) {
      const explainMeaning = explainMeaningMatch[1];
      const explainMeaningNoSpace = explainMeaning.replace(/\s+/g, '');
      
      // explanation의 의미가 단순 띄어쓰기(단어와 같음)이고, meaning은 다른 경우
      if (explainMeaningNoSpace === wordNoSpace && meaningNoSpace !== wordNoSpace) {
        const newExplanation = `\\"${currentWord}\\"은(는) ${currentMeaning}을(를) 의미합니다.`;
        lines[i] = line.replace(
          `"explanation": "${currentExplanation}"`,
          `"explanation": "${newExplanation}"`
        );
        updatedCount++;
      }
    }
  }
}

console.log(`explanation 업데이트: ${updatedCount}개`);

fs.writeFileSync(vocabDataPath, lines.join('\n'), 'utf-8');
console.log('파일 저장 완료');

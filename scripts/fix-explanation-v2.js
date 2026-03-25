const fs = require('fs');

let content = fs.readFileSync('public/brainfit-vocab-data.js', 'utf-8');

// 각 항목에서 word, meaning, explanation 추출하고 수정
const lines = content.split('\n');
let currentItem = {};
let currentExplainLineIdx = -1;
let updatedCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  const wordMatch = line.match(/"word":\s*"([^"]+)"/);
  const meaningMatch = line.match(/"meaning":\s*"([^"]+)"/);
  const explainMatch = line.match(/"explanation":\s*"(.+)"/);
  
  if (wordMatch) currentItem.word = wordMatch[1];
  if (meaningMatch) currentItem.meaning = meaningMatch[1];
  if (explainMatch) {
    currentItem.explanation = explainMatch[1];
    currentExplainLineIdx = i;
    
    if (currentItem.word && currentItem.meaning) {
      const wordNoSpace = currentItem.word.replace(/\s+/g, '');
      const meaningNoSpace = currentItem.meaning.replace(/\s+/g, '');
      
      // explanation에서 의미 부분 추출
      const explainMeaning = currentItem.explanation.match(/은\(는\)\s*(.+?)을\(를\)/);
      if (explainMeaning) {
        const explainMeaningClean = explainMeaning[1].replace(/\s+/g, '');
        
        // explanation의 의미가 단어와 같고(단순 띄어쓰기), meaning은 다른 경우
        if (explainMeaningClean === wordNoSpace && meaningNoSpace !== wordNoSpace) {
          // explanation 수정
          const newExplanation = `\\"${currentItem.word}\\"은(는) ${currentItem.meaning}을(를) 의미합니다.`;
          lines[i] = line.replace(currentItem.explanation, newExplanation);
          updatedCount++;
        }
      }
      
      currentItem = {};
    }
  }
}

console.log(`explanation 업데이트: ${updatedCount}개`);

fs.writeFileSync('public/brainfit-vocab-data.js', lines.join('\n'), 'utf-8');
console.log('파일 저장 완료');

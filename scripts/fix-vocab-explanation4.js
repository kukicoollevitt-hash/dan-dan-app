const fs = require('fs');
const path = require('path');

const vocabDataPath = path.join(__dirname, '..', 'public/brainfit-vocab-data.js');
let vocabData = fs.readFileSync(vocabDataPath, 'utf-8');

let updatedCount = 0;
const updates = [];

// 라인별로 파싱해서 블록 단위로 처리
const lines = vocabData.split('\n');
let block = [];
let blockStart = -1;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes('"word":')) {
    block = [line];
    blockStart = i;
  } else if (blockStart >= 0) {
    block.push(line);
    
    // 블록 끝 (}, 또는 }로 끝나는 줄)
    if (line.trim().startsWith('}')) {
      const blockStr = block.join('\n');
      
      // word, meaning, explanation 추출
      const wordMatch = blockStr.match(/"word":\s*"([^"]+)"/);
      const meaningMatch = blockStr.match(/"meaning":\s*"([^"]+)"/);
      const explainMatch = blockStr.match(/"explanation":\s*"([^"]+)"/);
      
      if (wordMatch && meaningMatch && explainMatch) {
        const word = wordMatch[1];
        const meaning = meaningMatch[1];
        const explanation = explainMatch[1];
        
        const wordNoSpace = word.replace(/\s+/g, '');
        const meaningNoSpace = meaning.replace(/\s+/g, '');
        
        // explanation에서 의미 부분 추출
        const explainParts = explanation.match(/은\(는\)\s*(.+?)을\(를\)/);
        if (explainParts) {
          const explainMeaning = explainParts[1];
          const explainMeaningNoSpace = explainMeaning.replace(/\s+/g, '');
          
          // explanation의 의미가 단어와 같고(단순 띄어쓰기), meaning은 다른 경우
          if (explainMeaningNoSpace === wordNoSpace && meaningNoSpace !== wordNoSpace) {
            // explanation 라인 찾아서 수정
            for (let j = blockStart; j <= i; j++) {
              if (lines[j].includes('"explanation":')) {
                const newExplanation = `\\"${word}\\"은(는) ${meaning}을(를) 의미합니다.`;
                lines[j] = lines[j].replace(
                  `"explanation": "${explanation}"`,
                  `"explanation": "${newExplanation}"`
                );
                updatedCount++;
                updates.push({ word, old: explainMeaning, new: meaning });
                break;
              }
            }
          }
        }
      }
      
      block = [];
      blockStart = -1;
    }
  }
}

console.log(`explanation 업데이트: ${updatedCount}개`);
console.log('\n샘플 (처음 20개):');
updates.slice(0, 20).forEach(u => {
  console.log(`  ${u.word}: "${u.old}" -> "${u.new}"`);
});

fs.writeFileSync(vocabDataPath, lines.join('\n'), 'utf-8');
console.log('\n파일 저장 완료');

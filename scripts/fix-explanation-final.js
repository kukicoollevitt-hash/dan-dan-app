const fs = require('fs');
const path = require('path');

const vocabDataPath = path.join(__dirname, '..', 'public/brainfit-vocab-data.js');
let vocabData = fs.readFileSync(vocabDataPath, 'utf-8');

let updatedCount = 0;

// JSON 블록을 찾아서 처리 - 개선된 방식
// 각 항목의 word, meaning을 찾고, explanation에서 단순 띄어쓰기 의미인 경우 수정

const items = [];
let braceCount = 0;
let itemStart = -1;
let inItem = false;

for (let i = 0; i < vocabData.length; i++) {
  const char = vocabData[i];
  
  if (char === '{') {
    braceCount++;
    if (braceCount === 1 || (braceCount === 2 && vocabData.substring(i-10, i).includes('"word"'))) {
      // 새 아이템 시작
    }
    if (!inItem && braceCount >= 1) {
      // 배열 내의 객체 시작 가능
      const prev100 = vocabData.substring(Math.max(0, i - 100), i);
      if (prev100.includes('"word"') || prev100.match(/\[\s*$/)) {
        itemStart = i;
        inItem = true;
      }
    }
  } else if (char === '}') {
    if (inItem && braceCount === 1) {
      // 아이템 끝
      const itemStr = vocabData.substring(itemStart, i + 1);
      
      // word, meaning, explanation 추출
      const wordMatch = itemStr.match(/"word":\s*"([^"]+)"/);
      const meaningMatch = itemStr.match(/"meaning":\s*"([^"]+)"/);
      const explainMatch = itemStr.match(/"explanation":\s*"(\\?"[^"]*\\?"은\(는\)[^"]+)"/);
      
      if (wordMatch && meaningMatch && explainMatch) {
        const word = wordMatch[1];
        const meaning = meaningMatch[1];
        const explanation = explainMatch[1];
        
        const wordNoSpace = word.replace(/\s+/g, '');
        const meaningNoSpace = meaning.replace(/\s+/g, '');
        
        // explanation에서 의미 추출 (\"단어\"은(는) 의미을(를) 의미합니다.)
        const explainMeaningMatch = explanation.match(/은\(는\)\s*(.+?)을\(를\)/);
        if (explainMeaningMatch) {
          const explainMeaning = explainMeaningMatch[1];
          const explainMeaningNoSpace = explainMeaning.replace(/\s+/g, '');
          
          // explanation의 의미가 단어와 같고, meaning은 다른 경우
          if (explainMeaningNoSpace === wordNoSpace && meaningNoSpace !== wordNoSpace) {
            items.push({ word, meaning, explanation, start: itemStart, end: i + 1 });
          }
        }
      }
      
      inItem = false;
    }
    braceCount--;
  }
}

console.log(`수정 대상 항목: ${items.length}개`);

// 뒤에서부터 수정 (인덱스 변경 방지)
for (let i = items.length - 1; i >= 0; i--) {
  const item = items[i];
  const itemStr = vocabData.substring(item.start, item.end);
  
  const newExplanation = `\\"${item.word}\\"은(는) ${item.meaning}을(를) 의미합니다.`;
  const newItemStr = itemStr.replace(
    /"explanation":\s*"[^"]+"/,
    `"explanation": "${newExplanation}"`
  );
  
  vocabData = vocabData.substring(0, item.start) + newItemStr + vocabData.substring(item.end);
  updatedCount++;
}

console.log(`explanation 업데이트: ${updatedCount}개`);

if (items.length > 0) {
  console.log('\n샘플 (처음 10개):');
  items.slice(0, 10).forEach(item => {
    console.log(`  ${item.word}: -> "${item.meaning}"`);
  });
}

fs.writeFileSync(vocabDataPath, vocabData, 'utf-8');
console.log('\n파일 저장 완료');

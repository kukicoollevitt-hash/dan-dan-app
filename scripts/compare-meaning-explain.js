const fs = require('fs');

const content = fs.readFileSync('public/brainfit-vocab-data.js', 'utf-8');

// 각 항목에서 word, meaning, explanation 추출
const items = [];

// 문자열로 파싱
const lines = content.split('\n');
let currentItem = {};

for (const line of lines) {
  const wordMatch = line.match(/"word":\s*"([^"]+)"/);
  const meaningMatch = line.match(/"meaning":\s*"([^"]+)"/);
  const explainMatch = line.match(/"explanation":\s*"(.+)"/);
  
  if (wordMatch) currentItem.word = wordMatch[1];
  if (meaningMatch) currentItem.meaning = meaningMatch[1];
  if (explainMatch) {
    currentItem.explanation = explainMatch[1];
    
    if (currentItem.word && currentItem.meaning) {
      const wordNoSpace = currentItem.word.replace(/\s+/g, '');
      const meaningNoSpace = currentItem.meaning.replace(/\s+/g, '');
      
      // explanation에서 의미 부분 추출
      const explainMeaning = currentItem.explanation.match(/은\(는\)\s*(.+?)을\(를\)/);
      if (explainMeaning) {
        const explainMeaningClean = explainMeaning[1].replace(/\s+/g, '');
        
        // explanation의 의미가 단어와 같고(단순 띄어쓰기), meaning은 다른 경우
        if (explainMeaningClean === wordNoSpace && meaningNoSpace !== wordNoSpace) {
          items.push({
            word: currentItem.word,
            meaning: currentItem.meaning,
            explainMeaning: explainMeaning[1]
          });
        }
      }
      
      currentItem = {};
    }
  }
}

console.log(`문제 있는 항목: ${items.length}개`);
console.log('\n처음 10개:');
items.slice(0, 10).forEach(item => {
  console.log(`  ${item.word}: explain="${item.explainMeaning}" vs meaning="${item.meaning}"`);
});

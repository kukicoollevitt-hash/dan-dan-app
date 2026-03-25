const fs = require('fs');
const path = require('path');

const vocabDataPath = path.join(__dirname, '..', 'public/brainfit-vocab-data.js');
const vocabData = fs.readFileSync(vocabDataPath, 'utf-8');

// 단어와 meaning이 유사한 항목 찾기
const badMeanings = [];
let currentWord = '';
let currentMeaning = '';
let lineNum = 0;

const lines = vocabData.split('\n');
for (const line of lines) {
  lineNum++;

  const wordMatch = line.match(/"word":\s*"([^"]+)"/);
  if (wordMatch) {
    currentWord = wordMatch[1];
  }

  const meaningMatch = line.match(/"meaning":\s*"([^"]+)"/);
  if (meaningMatch && currentWord) {
    currentMeaning = meaningMatch[1];

    // 단어에서 공백 제거한 버전
    const wordNoSpace = currentWord.replace(/\s+/g, '');
    const meaningNoSpace = currentMeaning.replace(/\s+/g, '');

    // 의미가 단어와 같거나, 단순 띄어쓰기 차이인 경우
    // 띄어쓰기만 차이나는 경우 (예: "비판적사고" vs "비판적 사고")
    const isJustSpacing = wordNoSpace === meaningNoSpace;

    if (isJustSpacing) {
      badMeanings.push({
        lineNum,
        word: currentWord,
        meaning: currentMeaning,
        type: '단순 띄어쓰기'
      });
    }
  }
}

console.log(`문제 있는 meaning: ${badMeanings.length}개\n`);

// 전체 목록 출력
badMeanings.forEach((item, idx) => {
  console.log(`${idx + 1}. ${item.word} -> "${item.meaning}"`);
});

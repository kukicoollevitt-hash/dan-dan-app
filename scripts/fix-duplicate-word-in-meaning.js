const fs = require('fs');
const path = require('path');

const vocabDataPath = path.join(__dirname, '..', 'public/brainfit-vocab-data.js');

let content = fs.readFileSync(vocabDataPath, 'utf-8');
const lines = content.split('\n');

let currentWord = '';
let updatedCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  const wordMatch = line.match(/"word":\s*"([^"]+)"/);
  if (wordMatch) {
    currentWord = wordMatch[1];
  }

  const meaningMatch = line.match(/"meaning":\s*"([^"]+)"/);
  if (meaningMatch && currentWord) {
    const meaning = meaningMatch[1];

    // "단어: 의미" 형태인 경우 "단어: " 제거
    // 띄어쓰기 유무 모두 체크
    const wordNoSpace = currentWord.replace(/\s+/g, '');
    const patterns = [
      currentWord + ': ',
      currentWord + ':',
      wordNoSpace + ': ',
      wordNoSpace + ':'
    ];

    for (const pattern of patterns) {
      if (meaning.startsWith(pattern)) {
        const newMeaning = meaning.substring(pattern.length).trim();
        lines[i] = line.replace(
          /"meaning":\s*"[^"]+"/,
          `"meaning": "${newMeaning}"`
        );
        console.log(`${currentWord}: "${meaning.substring(0, 40)}..." → "${newMeaning.substring(0, 40)}..."`);
        updatedCount++;
        break;
      }
    }
  }
}

console.log(`\n${updatedCount}개 중복 단어 제거 완료`);

fs.writeFileSync(vocabDataPath, lines.join('\n'), 'utf-8');
console.log('파일 저장 완료');

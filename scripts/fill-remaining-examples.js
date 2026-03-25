const fs = require('fs');
const path = require('path');

// 한글 받침 확인 함수
function hasFinalConsonant(char) {
  if (!char) return false;
  const code = char.charCodeAt(0);
  if (code < 44032 || code > 55203) return false;
  return (code - 44032) % 28 !== 0;
}

// 조사 선택 함수
function getJosa(word, type) {
  const lastChar = word.replace(/[^가-힣]/g, '').slice(-1);
  if (!lastChar) return type === '은는' ? '은' : '을'; // 영어 끝나면 받침 있다고 간주

  const hasBatchim = hasFinalConsonant(lastChar);
  switch(type) {
    case '은는': return hasBatchim ? '은' : '는';
    case '을를': return hasBatchim ? '을' : '를';
    case '이가': return hasBatchim ? '이' : '가';
    case '라고이라고': return hasBatchim ? '이라고' : '라고';
    default: return '';
  }
}

// meaning을 예시 문장으로 변환
function meaningToExample(word, meaning) {
  // 끝 조사 처리
  let cleanMeaning = meaning
    .replace(/\.+$/, '')
    .replace(/[을를이가]$/, '')
    .trim();

  const josa = getJosa(cleanMeaning, '을를');
  const wordJosa = getJosa(word, '라고이라고');

  return `${cleanMeaning}${josa} ${word}${wordJosa} 한다.`;
}

const vocabDataPath = path.join(__dirname, '..', 'public/brainfit-vocab-data.js');
let vocabData = fs.readFileSync(vocabDataPath, 'utf-8');
const lines = vocabData.split('\n');

let currentWord = '';
let currentMeaning = '';
let updatedCount = 0;

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

  // example 업데이트 (빈 example만)
  const exampleMatch = line.match(/"example":\s*"([^"]*)"/);
  if (exampleMatch && currentWord && currentMeaning) {
    const currentExample = exampleMatch[1];

    // 비어있거나 너무 짧은 경우에만 업데이트
    if (currentExample.length < 5) {
      const newExample = meaningToExample(currentWord, currentMeaning);

      // 특수문자 이스케이프
      const escapedExample = newExample
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"');

      lines[i] = line.replace(
        /"example":\s*"[^"]*"/,
        `"example": "${escapedExample}"`
      );
      updatedCount++;

      console.log(`${currentWord}: ${newExample}`);
    }
  }
}

console.log(`\n${updatedCount}개 example 업데이트됨`);

// 파일 저장
fs.writeFileSync(vocabDataPath, lines.join('\n'), 'utf-8');
console.log('파일 저장 완료');

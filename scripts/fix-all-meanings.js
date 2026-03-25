const fs = require('fs');
const path = require('path');

// 모든 content.js 파일에서 vocab 배열의 단어-의미 추출
const contentDirs = ['science', 'social', 'korlit', 'worldlit', 'person'];
const wordMeanings = {};

contentDirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', 'public/BRAINUP', dir);
  if (!fs.existsSync(dirPath)) return;

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('_content.js'));

  files.forEach(file => {
    const content = fs.readFileSync(path.join(dirPath, file), 'utf-8');

    // vocab 배열에서 추출: ['단어', '의미'] 또는 ['단어(영어)', '의미']
    const vocabRegex = /\[\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*\]/g;
    let match;
    while ((match = vocabRegex.exec(content)) !== null) {
      let word = match[1];
      const meaning = match[2];

      // 괄호 안 영어 제거: 축척(scale) -> 축척
      const wordClean = word.replace(/\([^)]+\)/g, '').trim();
      // 띄어쓰기 제거한 키
      const wordKey = wordClean.replace(/\s+/g, '');

      if (wordKey && meaning && meaning.length > 3) {
        // 더 긴 정의를 우선
        if (!wordMeanings[wordKey] || meaning.length > wordMeanings[wordKey].length) {
          wordMeanings[wordKey] = meaning;
        }
        // 띄어쓰기 있는 버전도 저장
        if (wordClean !== wordKey && (!wordMeanings[wordClean] || meaning.length > wordMeanings[wordClean].length)) {
          wordMeanings[wordClean] = meaning;
        }
      }
    }

    // vocabFill 배열에서도 추출: { text: '...', answer: '...' }
    const vocabFillRegex = /\{\s*no:\s*\d+,\s*text:\s*['"]([^'"]+)['"],\s*answer:\s*['"]([^'"]+)['"]/g;
    while ((match = vocabFillRegex.exec(content)) !== null) {
      const text = match[1];
      const answer = match[2];

      // answer에서 띄어쓰기 제거한 버전을 키로 사용
      const wordKey = answer.replace(/\s+/g, '');

      // text에서 의미 추출 (괄호 앞부분이 의미)
      let meaning = text
        .replace(/\s*\([^)]*\)\s*(라고|이라고|를|을|은|는|라|이라).*$/, '')
        .replace(/\s*\([^)]*\).*$/, '')
        .trim();

      // 끝에 "을", "를", "이다", "하다" 등 제거
      meaning = meaning.replace(/[을를이가]$/, '');
      meaning = meaning.replace(/이다$|하다$|한다$|해요$/, '');

      if (meaning.length < 5) continue;
      if (meaning === answer || meaning.replace(/\s+/g, '') === wordKey) continue;

      // 더 긴 정의를 우선
      if (!wordMeanings[wordKey] || meaning.length > wordMeanings[wordKey].length) {
        wordMeanings[wordKey] = meaning;
      }
    }
  });
});

console.log(`총 ${Object.keys(wordMeanings).length}개의 단어-의미 추출됨`);

// brainfit-vocab-data.js 읽기
const vocabDataPath = path.join(__dirname, '..', 'public/brainfit-vocab-data.js');
let vocabData = fs.readFileSync(vocabDataPath, 'utf-8');

// 한글 받침 확인 함수
function hasFinalConsonant(char) {
  if (!char) return false;
  const code = char.charCodeAt(0);
  if (code < 44032 || code > 55203) return false;
  return (code - 44032) % 28 !== 0;
}

function getJosa(word, type) {
  const lastChar = word.replace(/[^가-힣]/g, '').slice(-1);
  const hasBatchim = hasFinalConsonant(lastChar);
  switch(type) {
    case '은는': return hasBatchim ? '은' : '는';
    case '을를': return hasBatchim ? '을' : '를';
    default: return '';
  }
}

// 라인별로 처리
const lines = vocabData.split('\n');
let currentWord = '';
let currentWordKey = '';
let updatedMeanings = 0;
let updatedExplanations = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // word 추출
  const wordMatch = line.match(/"word":\s*"([^"]+)"/);
  if (wordMatch) {
    currentWord = wordMatch[1];
    currentWordKey = currentWord.replace(/\s+/g, '');
  }

  // meaning 수정
  const meaningMatch = line.match(/"meaning":\s*"([^"]+)"/);
  if (meaningMatch && currentWord) {
    const currentMeaning = meaningMatch[1];
    const currentMeaningKey = currentMeaning.replace(/\s+/g, '');

    // 현재 의미가 단어와 같거나 너무 짧은 경우 (단순 띄어쓰기 or 동의어)
    const realMeaning = wordMeanings[currentWordKey] || wordMeanings[currentWord];

    if (realMeaning && (
      currentMeaningKey === currentWordKey ||
      currentMeaning.length < 15 ||
      currentMeaning === currentWord
    )) {
      // meaning 업데이트
      lines[i] = line.replace(
        /"meaning":\s*"[^"]+"/,
        `"meaning": "${realMeaning}"`
      );
      updatedMeanings++;

      // explanation도 함께 업데이트 (다음 몇 줄 내에 있음)
      for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
        if (lines[j].includes('"explanation":')) {
          const josa1 = getJosa(currentWord, '은는');
          const josa2 = getJosa(realMeaning, '을를');
          const newExplanation = `\\"${currentWord}\\"${josa1} ${realMeaning}${josa2} 의미합니다.`;
          lines[j] = `    "explanation": "${newExplanation}",`;
          updatedExplanations++;
          break;
        }
      }
    }
  }
}

console.log(`\nupdated meanings: ${updatedMeanings}개`);
console.log(`updated explanations: ${updatedExplanations}개`);

// 파일 저장
fs.writeFileSync(vocabDataPath, lines.join('\n'), 'utf-8');
console.log('\n파일 저장 완료');

// 검증: 아직 문제 있는 항목 확인
let remaining = 0;
currentWord = '';
for (const line of lines) {
  const wordMatch = line.match(/"word":\s*"([^"]+)"/);
  if (wordMatch) currentWord = wordMatch[1];

  const meaningMatch = line.match(/"meaning":\s*"([^"]+)"/);
  if (meaningMatch && currentWord) {
    const meaning = meaningMatch[1];
    const wordKey = currentWord.replace(/\s+/g, '');
    const meaningKey = meaning.replace(/\s+/g, '');
    if (wordKey === meaningKey || meaning.length < 10) {
      remaining++;
    }
  }
}
console.log(`\n남은 문제 항목: ${remaining}개`);

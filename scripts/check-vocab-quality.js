const fs = require('fs');
const path = require('path');

const vocabDataPath = path.join(__dirname, '..', 'public/brainfit-vocab-data.js');
const vocabData = fs.readFileSync(vocabDataPath, 'utf-8');
const lines = vocabData.split('\n');

let currentWord = '';
let currentMeaning = '';
let currentExample = '';
let meaningLineNum = 0;
let exampleLineNum = 0;

const problems = {
  englishMeaning: [],      // 영어로 된 의미
  incompleteMeaning: [],   // 불완전한 의미 (단어만 반복)
  emptyExample: [],        // 빈 예시
  noWordInExample: [],     // 단어 미포함 예시
  definitionExample: [],   // 정의 형태 예시 (~라고 한다)
  duplicateMeaningExample: [] // 의미와 예시가 동일
};

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  const wordMatch = line.match(/"word":\s*"([^"]+)"/);
  if (wordMatch) {
    currentWord = wordMatch[1];
  }

  const meaningMatch = line.match(/"meaning":\s*"([^"]*)"/);
  if (meaningMatch && currentWord) {
    currentMeaning = meaningMatch[1];
    meaningLineNum = i;

    // 1. 영어로 된 의미 체크
    if (/^[A-Z][a-z]/.test(currentMeaning) && /[a-zA-Z\s]{10,}/.test(currentMeaning)) {
      problems.englishMeaning.push({ lineNum: i, word: currentWord, meaning: currentMeaning });
    }

    // 2. 불완전한 의미 (단어만 반복, 띄어쓰기만 다름)
    const wordNoSpace = currentWord.replace(/\s+/g, '');
    const meaningNoSpace = currentMeaning.replace(/\s+/g, '');
    if (wordNoSpace === meaningNoSpace || currentMeaning.length < 3) {
      problems.incompleteMeaning.push({ lineNum: i, word: currentWord, meaning: currentMeaning });
    }
  }

  const exampleMatch = line.match(/"example":\s*"([^"]*)"/);
  if (exampleMatch && currentWord && currentMeaning) {
    currentExample = exampleMatch[1];
    exampleLineNum = i;

    // 3. 빈 예시
    if (!currentExample || currentExample.length < 5) {
      problems.emptyExample.push({ lineNum: i, word: currentWord, example: currentExample });
    } else {
      // 4. 단어 미포함 체크 (어간 활용형 포함)
      const wordNoSpace = currentWord.replace(/\s+/g, '');
      const exampleNoSpace = currentExample.replace(/\s+/g, '');

      let hasWord = currentExample.includes(currentWord) ||
                    currentExample.includes(wordNoSpace) ||
                    exampleNoSpace.includes(wordNoSpace);

      // 동사/형용사 어간
      if (!hasWord) {
        const suffixes = ['하다', '되다', '나다', '치다', '지다', '보다'];
        for (const suffix of suffixes) {
          if (currentWord.endsWith(suffix)) {
            const stem1 = currentWord.slice(0, -1);
            const stem2 = currentWord.slice(0, -2);
            if ((stem1 && currentExample.includes(stem1)) ||
                (stem2 && currentExample.includes(stem2))) {
              hasWord = true;
              break;
            }
          }
        }
      }

      // 불완전 어간
      if (!hasWord && currentWord.endsWith('하')) {
        const stem = currentWord.slice(0, -1);
        if (stem && currentExample.includes(stem)) hasWord = true;
      }

      // 한자 표기 제거
      if (!hasWord && currentWord.includes('(')) {
        const wordWithoutHanja = currentWord.replace(/\([^)]+\)/g, '').trim();
        if (currentExample.includes(wordWithoutHanja)) hasWord = true;
      }

      if (!hasWord) {
        problems.noWordInExample.push({ lineNum: i, word: currentWord, example: currentExample });
      }

      // 5. 정의 형태 예시 체크 (~라고 한다, ~을 말한다, ~을 의미한다)
      if (currentExample.includes('라고 한다') ||
          currentExample.includes('을 말한다') ||
          currentExample.includes('를 말한다') ||
          currentExample.includes('을 의미한다') ||
          currentExample.includes('를 의미한다') ||
          currentExample.includes('이라 한다') ||
          currentExample.includes('라 한다')) {
        problems.definitionExample.push({ lineNum: i, word: currentWord, example: currentExample });
      }

      // 6. 의미와 예시가 거의 동일한 경우
      const meaningNorm = currentMeaning.replace(/[^\w가-힣]/g, '');
      const exampleNorm = currentExample.replace(/[^\w가-힣]/g, '');
      if (meaningNorm.length > 5 && exampleNorm.includes(meaningNorm)) {
        problems.duplicateMeaningExample.push({
          lineNum: i, word: currentWord, meaning: currentMeaning, example: currentExample
        });
      }
    }

    currentWord = '';
    currentMeaning = '';
  }
}

console.log('=== 어휘 데이터 품질 점검 결과 ===\n');

console.log('1. 영어로 된 의미: ' + problems.englishMeaning.length + '개');
problems.englishMeaning.slice(0, 10).forEach((p, idx) => {
  console.log('   ' + (idx + 1) + '. ' + p.word + ': ' + p.meaning.substring(0, 50) + '...');
});

console.log('\n2. 불완전한 의미 (단어만 반복): ' + problems.incompleteMeaning.length + '개');
problems.incompleteMeaning.slice(0, 10).forEach((p, idx) => {
  console.log('   ' + (idx + 1) + '. ' + p.word + ': "' + p.meaning + '"');
});

console.log('\n3. 빈 예시: ' + problems.emptyExample.length + '개');
problems.emptyExample.slice(0, 10).forEach((p, idx) => {
  console.log('   ' + (idx + 1) + '. ' + p.word);
});

console.log('\n4. 단어 미포함 예시: ' + problems.noWordInExample.length + '개');
problems.noWordInExample.slice(0, 10).forEach((p, idx) => {
  console.log('   ' + (idx + 1) + '. ' + p.word + ': ' + p.example.substring(0, 40) + '...');
});

console.log('\n5. 정의 형태 예시 (~라고 한다): ' + problems.definitionExample.length + '개');
problems.definitionExample.slice(0, 10).forEach((p, idx) => {
  console.log('   ' + (idx + 1) + '. ' + p.word + ': ' + p.example.substring(0, 50) + '...');
});

console.log('\n6. 의미와 예시 중복: ' + problems.duplicateMeaningExample.length + '개');
problems.duplicateMeaningExample.slice(0, 10).forEach((p, idx) => {
  console.log('   ' + (idx + 1) + '. ' + p.word);
  console.log('      의미: ' + p.meaning.substring(0, 30) + '...');
  console.log('      예시: ' + p.example.substring(0, 30) + '...');
});

// JSON 저장
const outputPath = path.join(__dirname, 'vocab-quality-issues.json');
fs.writeFileSync(outputPath, JSON.stringify(problems, null, 2), 'utf-8');
console.log('\n문제 목록 저장: ' + outputPath);

const total = Object.values(problems).reduce((sum, arr) => sum + arr.length, 0);
console.log('\n=== 총 문제 항목: ' + total + '개 ===');

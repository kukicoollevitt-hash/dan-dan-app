const fs = require('fs');
const path = require('path');

const vocabDataPath = path.join(__dirname, '..', 'public/brainfit-vocab-data.js');
const vocabData = fs.readFileSync(vocabDataPath, 'utf-8');

const lines = vocabData.split('\n');

let currentWord = '';
let currentMeaning = '';
let currentExample = '';
let lineNum = 0;

const problems = {
  empty: [],      // 예시가 없는 것
  noWord: [],     // 단어가 포함되지 않은 것
  tooShort: []    // 너무 짧은 것
};

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  const wordMatch = line.match(/"word":\s*"([^"]+)"/);
  if (wordMatch) {
    currentWord = wordMatch[1];
    lineNum = i;
  }

  const meaningMatch = line.match(/"meaning":\s*"([^"]+)"/);
  if (meaningMatch) {
    currentMeaning = meaningMatch[1];
  }

  const exampleMatch = line.match(/"example":\s*"([^"]*)"/);
  if (exampleMatch && currentWord) {
    currentExample = exampleMatch[1];

    // 1. 예시가 비어있거나 너무 짧은 경우
    if (!currentExample || currentExample.length < 5) {
      problems.empty.push({
        lineNum: i,
        word: currentWord,
        meaning: currentMeaning,
        example: currentExample
      });
    }
    // 2. 단어가 예시에 포함되지 않은 경우
    else {
      // 띄어쓰기 제거 버전도 체크
      const wordNoSpace = currentWord.replace(/\s+/g, '');
      const exampleNoSpace = currentExample.replace(/\s+/g, '');

      // 기본 체크
      let hasWord = currentExample.includes(currentWord) ||
                    currentExample.includes(wordNoSpace) ||
                    exampleNoSpace.includes(wordNoSpace);

      // 동사/형용사 어간 활용형 체크 (~하다, ~되다 등)
      if (!hasWord) {
        // "~하다" → 어간 추출 후 활용형 체크
        const verbSuffixes = ['하다', '되다', '나다', '치다', '지다', '보다'];
        for (const suffix of verbSuffixes) {
          if (currentWord.endsWith(suffix)) {
            // "~하다" → "~하" (활용: ~했다, ~해서, ~하고)
            const stem1 = currentWord.slice(0, -1);
            // "~하다" → "~" + 어간만 (활용: ~한, ~할)
            const stem2 = currentWord.slice(0, -2);
            const stems = [stem1, stem2].filter(s => s.length > 0);

            for (const stem of stems) {
              const stemNoSpace = stem.replace(/\s+/g, '');
              if (currentExample.includes(stem) || exampleNoSpace.includes(stemNoSpace)) {
                hasWord = true;
                break;
              }
            }
            if (hasWord) break;
          }
        }
      }

      // 불완전한 단어 어간 체크 (엉뚱하, 순박하 등)
      if (!hasWord && currentWord.endsWith('하')) {
        const stem = currentWord.slice(0, -1); // "엉뚱하" → "엉뚱"
        if (stem.length > 0) {
          const stemNoSpace = stem.replace(/\s+/g, '');
          if (currentExample.includes(stem) || exampleNoSpace.includes(stemNoSpace)) {
            hasWord = true;
          }
        }
      }

      // 한자 표기 제거 후 체크 (연회(宴會) → 연회)
      if (!hasWord && currentWord.includes('(')) {
        const wordWithoutHanja = currentWord.replace(/\([^)]+\)/g, '').trim();
        if (currentExample.includes(wordWithoutHanja) ||
            exampleNoSpace.includes(wordWithoutHanja.replace(/\s+/g, ''))) {
          hasWord = true;
        }
      }

      if (!hasWord) {
        problems.noWord.push({
          lineNum: i,
          word: currentWord,
          meaning: currentMeaning,
          example: currentExample
        });
      }
    }

    currentWord = '';
    currentMeaning = '';
  }
}

console.log('=== 예시 문장 문제 점검 결과 ===\n');

console.log(`1. 예시가 없거나 너무 짧음: ${problems.empty.length}개`);
if (problems.empty.length > 0) {
  console.log('   처음 30개:');
  problems.empty.slice(0, 30).forEach((p, idx) => {
    console.log(`   ${idx + 1}. ${p.word} (${p.meaning.substring(0, 20)}...)`);
  });
}

console.log(`\n2. 단어가 예시에 포함되지 않음: ${problems.noWord.length}개`);
if (problems.noWord.length > 0) {
  console.log('   처음 50개:');
  problems.noWord.slice(0, 50).forEach((p, idx) => {
    console.log(`   ${idx + 1}. ${p.word}`);
    console.log(`      예시: ${p.example.substring(0, 50)}...`);
  });
}

// 문제 목록을 JSON으로 저장
const outputPath = path.join(__dirname, 'bad-examples.json');
fs.writeFileSync(outputPath, JSON.stringify(problems, null, 2), 'utf-8');
console.log(`\n문제 목록 저장: ${outputPath}`);

console.log(`\n=== 총 문제 항목: ${problems.empty.length + problems.noWord.length}개 ===`);

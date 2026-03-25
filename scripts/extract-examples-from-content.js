const fs = require('fs');
const path = require('path');

// 모든 content.js 파일 경로
const contentDirs = ['science', 'social', 'korlit', 'worldlit', 'person'];
const prefixes = ['fit_', 'on_', 'deep_', ''];
const subjects = {
  science: ['bio', 'physics', 'earth', 'chem'],
  social: ['geo', 'law', 'pol', 'soc'],
  korlit: ['classic', 'modern'],
  worldlit: ['world1', 'world2'],
  person: ['people1', 'people2']
};

// 단어 -> 예시 문장 매핑
const wordExamples = {};

// content.js 파일들에서 vocabFill 추출
contentDirs.forEach(dir => {
  const subjectList = subjects[dir];

  subjectList.forEach(subject => {
    prefixes.forEach(prefix => {
      const fileName = `${prefix}${subject}_content.js`;
      const filePath = path.join(__dirname, '..', 'public/BRAINUP', dir, fileName);

      if (!fs.existsSync(filePath)) return;

      const content = fs.readFileSync(filePath, 'utf-8');

      // vocabFill 패턴: { no: N, text: '...', answer: '...' }
      const regex = /\{\s*no:\s*\d+,\s*text:\s*['"]([^'"]+)['"],\s*answer:\s*['"]([^'"]+)['"]/g;

      let match;
      while ((match = regex.exec(content)) !== null) {
        const text = match[1];
        const answer = match[2];

        // answer에서 띄어쓰기 제거한 키
        const wordKey = answer.replace(/\s+/g, '');

        // text를 예시 문장으로 변환
        // "(      )" 부분을 실제 단어로 대체
        let example = text
          .replace(/\(\s*\)/g, answer)
          .replace(/\([\s_]+\)/g, answer)
          .trim();

        // 이미 있으면 더 긴 것 선택
        if (!wordExamples[wordKey] || example.length > wordExamples[wordKey].length) {
          wordExamples[wordKey] = example;
        }

        // 띄어쓰기 있는 버전도 저장
        if (answer !== wordKey && (!wordExamples[answer] || example.length > wordExamples[answer].length)) {
          wordExamples[answer] = example;
        }
      }
    });
  });
});

console.log(`총 ${Object.keys(wordExamples).length}개의 예시 문장 추출됨`);

// 샘플 출력
console.log('\n샘플 (처음 20개):');
Object.entries(wordExamples).slice(0, 20).forEach(([word, example]) => {
  console.log(`  ${word}: ${example}`);
});

// brainfit-vocab-data.js 업데이트
const vocabDataPath = path.join(__dirname, '..', 'public/brainfit-vocab-data.js');
let vocabData = fs.readFileSync(vocabDataPath, 'utf-8');
const lines = vocabData.split('\n');

let currentWord = '';
let currentWordKey = '';
let updatedCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // word 추출
  const wordMatch = line.match(/"word":\s*"([^"]+)"/);
  if (wordMatch) {
    currentWord = wordMatch[1];
    currentWordKey = currentWord.replace(/\s+/g, '');
  }

  // example 업데이트 (빈 example만)
  const exampleMatch = line.match(/"example":\s*"([^"]*)"/);
  if (exampleMatch && currentWord) {
    const currentExample = exampleMatch[1];

    // 비어있거나 너무 짧은 경우에만 업데이트
    if (currentExample.length < 5) {
      const newExample = wordExamples[currentWordKey] || wordExamples[currentWord];

      if (newExample) {
        // 특수문자 이스케이프
        const escapedExample = newExample
          .replace(/\\/g, '\\\\')
          .replace(/"/g, '\\"');

        lines[i] = line.replace(
          /"example":\s*"[^"]*"/,
          `"example": "${escapedExample}"`
        );
        updatedCount++;
      }
    }
  }
}

console.log(`\n${updatedCount}개 example 업데이트됨`);

// 파일 저장
fs.writeFileSync(vocabDataPath, lines.join('\n'), 'utf-8');
console.log('파일 저장 완료');

// 검증
let remaining = 0;
currentWord = '';
for (const line of lines) {
  const wordMatch = line.match(/"word":\s*"([^"]+)"/);
  if (wordMatch) currentWord = wordMatch[1];

  const exampleMatch = line.match(/"example":\s*"([^"]*)"/);
  if (exampleMatch && currentWord) {
    if (exampleMatch[1].length < 5) {
      remaining++;
    }
  }
}
console.log(`\n남은 빈 example: ${remaining}개`);

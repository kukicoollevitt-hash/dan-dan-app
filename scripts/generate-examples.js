const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const client = new Anthropic();

const vocabDataPath = path.join(__dirname, '..', 'public/brainfit-vocab-data.js');

// 단어 데이터 추출
function extractWords() {
  const content = fs.readFileSync(vocabDataPath, 'utf-8');
  const words = [];

  const lines = content.split('\n');
  let currentWord = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const wordMatch = line.match(/"word":\s*"([^"]+)"/);
    if (wordMatch) {
      currentWord = { word: wordMatch[1], lineNum: i };
    }

    const meaningMatch = line.match(/"meaning":\s*"([^"]+)"/);
    if (meaningMatch && currentWord) {
      currentWord.meaning = meaningMatch[1];
    }

    const subjectMatch = line.match(/"subject":\s*"([^"]+)"/);
    if (subjectMatch && currentWord) {
      currentWord.subject = subjectMatch[1];
    }

    const exampleMatch = line.match(/"example":\s*"([^"]*)"/);
    if (exampleMatch && currentWord) {
      currentWord.example = exampleMatch[1];
      currentWord.exampleLineNum = i;

      // 빈 example만 수집
      if (currentWord.example === '') {
        words.push(currentWord);
      }
      currentWord = null;
    }
  }

  return words;
}

// 배치로 예시 문장 생성
async function generateExamples(words, batchSize = 30) {
  const results = [];

  for (let i = 0; i < words.length; i += batchSize) {
    const batch = words.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(words.length / batchSize);

    console.log(`배치 ${batchNum}/${totalBatches} 처리 중... (${batch.length}개)`);

    const prompt = batch.map((w, idx) =>
      `${idx + 1}. 단어: ${w.word}\n   의미: ${w.meaning}`
    ).join('\n');

    try {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `다음 단어들에 대해 초등~중등 학생 수준의 자연스러운 예시 문장을 각각 1개씩 작성해주세요.
예시 문장은 해당 단어를 사용하여 의미를 이해하기 쉽게 만들어주세요.
문장은 20~40자 정도로 간결하게 작성해주세요.

형식:
1. 예시 문장
2. 예시 문장
...

${prompt}`
        }]
      });

      const text = response.content[0].text;
      const examples = parseExamples(text, batch.length);

      batch.forEach((w, idx) => {
        results.push({
          ...w,
          generatedExample: examples[idx] || ''
        });
      });

      // API 속도 제한 방지
      if (i + batchSize < words.length) {
        await new Promise(r => setTimeout(r, 500));
      }
    } catch (error) {
      console.error(`배치 ${batchNum} 오류:`, error.message);
      batch.forEach(w => {
        results.push({ ...w, generatedExample: '' });
      });
    }
  }

  return results;
}

// AI 응답에서 예시 문장 파싱
function parseExamples(text, expectedCount) {
  const examples = [];
  const lines = text.split('\n');

  for (const line of lines) {
    // "1. 예시문장" 또는 "1) 예시문장" 형식 파싱
    const match = line.match(/^\d+[\.\)]\s*(.+)/);
    if (match) {
      let example = match[1].trim();
      // 앞뒤 따옴표 제거
      example = example.replace(/^["']|["']$/g, '');
      examples.push(example);
    }
  }

  // 부족한 경우 빈 문자열로 채움
  while (examples.length < expectedCount) {
    examples.push('');
  }

  return examples;
}

// 파일에 저장
function saveExamples(results) {
  let content = fs.readFileSync(vocabDataPath, 'utf-8');
  const lines = content.split('\n');

  let updatedCount = 0;

  results.forEach(r => {
    if (r.generatedExample && r.exampleLineNum) {
      // 특수문자 이스케이프
      const escapedExample = r.generatedExample
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"');

      lines[r.exampleLineNum] = `    "example": "${escapedExample}"`;
      updatedCount++;
    }
  });

  fs.writeFileSync(vocabDataPath, lines.join('\n'), 'utf-8');
  console.log(`\n${updatedCount}개 예시 문장 저장 완료`);
}

// 메인 실행
async function main() {
  console.log('단어 데이터 추출 중...');
  const words = extractWords();
  console.log(`빈 example 항목: ${words.length}개\n`);

  if (words.length === 0) {
    console.log('처리할 항목이 없습니다.');
    return;
  }

  // 테스트: 처음 30개만
  const testWords = words.slice(0, 30);
  console.log(`테스트: 처음 ${testWords.length}개만 처리\n`);

  const results = await generateExamples(testWords);

  console.log('\n생성된 예시 문장 샘플:');
  results.slice(0, 10).forEach(r => {
    console.log(`  ${r.word}: ${r.generatedExample}`);
  });

  saveExamples(results);
}

main().catch(console.error);

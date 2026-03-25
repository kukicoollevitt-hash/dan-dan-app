const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

const client = new OpenAI();

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

      // "~라고 한다" 또는 "~이라 한다" 형태는 교체 필요
      const needsUpdate = currentWord.example.includes('라고 한다') ||
                          currentWord.example.includes('이라 한다') ||
                          currentWord.example.includes('라 한다') ||
                          currentWord.example.length < 10;

      if (needsUpdate) {
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
      const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `다음 단어들에 대해 초등~중등 학생이 이해할 수 있는 자연스러운 예시 문장을 각각 1개씩 작성해주세요.

중요:
- "~라고 한다", "~이라 한다" 같은 정의 형태가 아닌, 단어가 실제로 사용되는 자연스러운 문장
- 문장은 15~35자 정도로 간결하게
- 단어의 의미를 자연스럽게 이해할 수 있는 예문

출력 형식 (반드시 이 형식으로):
1. [예시 문장만]
2. [예시 문장만]
...

예시:
단어: 광합성, 의미: 식물이 햇빛으로 양분을 만드는 과정
→ 1. 나무는 광합성을 통해 산소를 만들어낸다.

${prompt}`
        }]
      });

      const text = response.choices[0].message.content;
      const examples = parseExamples(text, batch.length);

      batch.forEach((w, idx) => {
        results.push({
          ...w,
          generatedExample: examples[idx] || ''
        });
      });

      // API 속도 제한 방지
      if (i + batchSize < words.length) {
        await new Promise(r => setTimeout(r, 300));
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
  console.log(`업데이트 필요한 example: ${words.length}개\n`);

  if (words.length === 0) {
    console.log('처리할 항목이 없습니다.');
    return;
  }

  // 전체 처리
  console.log(`전체 ${words.length}개 처리 시작\n`);

  const results = await generateExamples(words);

  console.log('\n생성된 예시 문장 샘플:');
  results.slice(0, 15).forEach(r => {
    console.log(`  ${r.word}: ${r.generatedExample}`);
  });

  saveExamples(results);
}

main().catch(console.error);

const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

const client = new OpenAI();

const vocabDataPath = path.join(__dirname, '..', 'public/brainfit-vocab-data.js');

// 문제 있는 예시 찾기
function findBadExamples() {
  const vocabData = fs.readFileSync(vocabDataPath, 'utf-8');
  const lines = vocabData.split('\n');

  let currentWord = '';
  let currentMeaning = '';
  const problems = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const wordMatch = line.match(/"word":\s*"([^"]+)"/);
    if (wordMatch) {
      currentWord = wordMatch[1];
    }

    const meaningMatch = line.match(/"meaning":\s*"([^"]+)"/);
    if (meaningMatch) {
      currentMeaning = meaningMatch[1];
    }

    const exampleMatch = line.match(/"example":\s*"([^"]*)"/);
    if (exampleMatch && currentWord && currentMeaning) {
      const example = exampleMatch[1];

      // 띄어쓰기 제거 버전
      const wordNoSpace = currentWord.replace(/\s+/g, '');
      const exampleNoSpace = example.replace(/\s+/g, '');

      const isEmpty = !example || example.length < 5;
      const hasWord = example.includes(currentWord) ||
                      example.includes(wordNoSpace) ||
                      exampleNoSpace.includes(wordNoSpace);

      if (isEmpty || !hasWord) {
        problems.push({
          lineNum: i,
          word: currentWord,
          meaning: currentMeaning,
          example: example,
          type: isEmpty ? 'empty' : 'noWord'
        });
      }

      currentWord = '';
      currentMeaning = '';
    }
  }

  return problems;
}

// 배치로 예시 문장 생성
async function generateExamples(words, batchSize = 40) {
  const results = [];

  for (let i = 0; i < words.length; i += batchSize) {
    const batch = words.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(words.length / batchSize);

    console.log(`배치 ${batchNum}/${totalBatches} 처리 중... (${batch.length}개)`);

    const prompt = batch.map((w, idx) =>
      `${idx + 1}. 단어: ${w.word}, 의미: ${w.meaning}`
    ).join('\n');

    try {
      const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `다음 단어들을 사용한 예시 문장을 작성해주세요.

규칙:
1. 반드시 해당 단어가 문장에 포함되어야 함
2. "~라고 한다" 같은 정의 형태 금지
3. 15~35자의 자연스러운 문장
4. 번호와 문장만 출력 (단어, 의미 반복 금지)

올바른 출력 예시:
1. 나무는 광합성을 통해 산소를 만든다.
2. DNA는 유전 정보를 담고 있다.

잘못된 출력 예시 (절대 하지 말 것):
1. 단어: 광합성, 의미: 식물이...
1. 광합성: 식물이...

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
    const match = line.match(/^\d+[\.\)]\s*(.+)/);
    if (match) {
      let example = match[1].trim();
      // 앞뒤 따옴표 제거
      example = example.replace(/^["']|["']$/g, '');
      // "단어: XXX, 의미: YYY" 형태가 포함되어 있으면 제거
      if (example.startsWith('단어:') || example.includes(', 의미:')) {
        example = ''; // 잘못된 형식이므로 빈 문자열 처리
      }
      examples.push(example);
    }
  }

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

  for (const result of results) {
    if (!result.generatedExample) continue;

    const lineNum = result.lineNum;
    const line = lines[lineNum];

    if (line && line.includes('"example"')) {
      const escapedExample = result.generatedExample
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"');

      lines[lineNum] = line.replace(
        /"example":\s*"[^"]*"/,
        `"example": "${escapedExample}"`
      );
      updatedCount++;
    }
  }

  fs.writeFileSync(vocabDataPath, lines.join('\n'), 'utf-8');
  console.log(`\n${updatedCount}개 예시 문장 업데이트 완료`);
}

// 메인 실행
async function main() {
  console.log('문제 있는 예시 찾는 중...');
  const badExamples = findBadExamples();
  console.log(`문제 있는 예시: ${badExamples.length}개\n`);

  if (badExamples.length === 0) {
    console.log('처리할 항목이 없습니다.');
    return;
  }

  // 중복 제거 (같은 단어가 여러 번 나올 수 있음)
  const uniqueWords = [];
  const seen = new Set();
  for (const item of badExamples) {
    const key = `${item.word}_${item.lineNum}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueWords.push(item);
    }
  }

  console.log(`중복 제거 후: ${uniqueWords.length}개\n`);

  const results = await generateExamples(uniqueWords);

  console.log('\n생성된 예시 문장 샘플:');
  results.slice(0, 20).forEach(r => {
    console.log(`  ${r.word}: ${r.generatedExample}`);
  });

  saveExamples(results);
}

main().catch(console.error);

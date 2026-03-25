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
          example: example
        });
      }

      currentWord = '';
      currentMeaning = '';
    }
  }

  return problems;
}

// 한 번에 하나씩 예시 생성
async function generateSingleExample(word, meaning) {
  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 100,
      messages: [{
        role: 'user',
        content: `"${word}"를 사용한 예시 문장 1개만 작성해.
규칙: "${word}"라는 단어가 반드시 문장에 포함되어야 함. 15~35자의 자연스러운 문장. 번호 없이 문장만 출력.
예시 입력: 광합성
예시 출력: 식물은 광합성을 통해 양분을 만든다.`
      }]
    });

    let example = response.choices[0].message.content.trim();
    // 앞뒤 따옴표 제거
    example = example.replace(/^["']|["']$/g, '');
    // 번호 제거
    example = example.replace(/^\d+[\.\)]\s*/, '');

    return example;
  } catch (error) {
    console.error(`오류 (${word}):`, error.message);
    return '';
  }
}

// 배치 처리 (병렬 요청)
async function generateExamplesParallel(problems, concurrency = 10) {
  const results = [];

  for (let i = 0; i < problems.length; i += concurrency) {
    const batch = problems.slice(i, i + concurrency);
    const batchNum = Math.floor(i / concurrency) + 1;
    const totalBatches = Math.ceil(problems.length / concurrency);

    console.log(`배치 ${batchNum}/${totalBatches} 처리 중... (${batch.length}개)`);

    const promises = batch.map(p => generateSingleExample(p.word, p.meaning));
    const examples = await Promise.all(promises);

    batch.forEach((p, idx) => {
      results.push({
        ...p,
        generatedExample: examples[idx] || ''
      });
    });

    // 속도 제한
    if (i + concurrency < problems.length) {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  return results;
}

// 파일에 저장
function saveExamples(results) {
  let content = fs.readFileSync(vocabDataPath, 'utf-8');
  const lines = content.split('\n');

  let updatedCount = 0;
  let stillBadCount = 0;

  for (const result of results) {
    if (!result.generatedExample) {
      stillBadCount++;
      continue;
    }

    // 단어가 예시에 포함되어 있는지 확인
    const wordNoSpace = result.word.replace(/\s+/g, '');
    const exampleNoSpace = result.generatedExample.replace(/\s+/g, '');
    const hasWord = result.generatedExample.includes(result.word) ||
                    result.generatedExample.includes(wordNoSpace) ||
                    exampleNoSpace.includes(wordNoSpace);

    if (!hasWord) {
      stillBadCount++;
      continue;
    }

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
  console.log(`${stillBadCount}개는 여전히 문제 있음 (단어 미포함)`);
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

  const results = await generateExamplesParallel(badExamples);

  console.log('\n생성된 예시 문장 샘플:');
  results.slice(0, 20).forEach(r => {
    const hasWord = r.generatedExample.includes(r.word) ||
                    r.generatedExample.includes(r.word.replace(/\s+/g, ''));
    const mark = hasWord ? '✓' : '✗';
    console.log(`  ${mark} ${r.word}: ${r.generatedExample}`);
  });

  saveExamples(results);
}

main().catch(console.error);

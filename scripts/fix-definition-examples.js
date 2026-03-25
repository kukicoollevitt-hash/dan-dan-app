const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

const client = new OpenAI();

const vocabDataPath = path.join(__dirname, '..', 'public/brainfit-vocab-data.js');
const issuesPath = path.join(__dirname, 'vocab-quality-issues.json');

async function generateExamples(words) {
  const results = [];

  // 개별 요청으로 정확도 높이기
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    console.log((i + 1) + '/' + words.length + ': ' + w.word);

    try {
      const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        max_tokens: 100,
        messages: [{
          role: 'user',
          content: '"' + w.word + '"를 사용한 자연스러운 예시 문장 1개만 작성해.\n\n규칙:\n- "' + w.word + '"라는 단어가 반드시 문장에 포함되어야 함\n- "~라고 한다", "~을 말한다", "~을 의미한다" 같은 정의 형태 금지\n- 실제로 사용되는 자연스러운 문장 (15~35자)\n- 번호 없이 문장만 출력\n\n예시:\n단어: 광합성\n좋은 예: 식물은 광합성을 통해 산소를 만든다.\n나쁜 예: 광합성은 식물이 양분을 만드는 과정을 말한다. (X)'
        }]
      });

      let example = response.choices[0].message.content.trim();
      example = example.replace(/^["']|["']$/g, '');
      example = example.replace(/^\d+[\.\)]\s*/, '');

      results.push({
        ...w,
        generatedExample: example
      });

      // 속도 제한
      if (i < words.length - 1) {
        await new Promise(r => setTimeout(r, 100));
      }
    } catch (error) {
      console.error('  오류:', error.message);
      results.push({ ...w, generatedExample: '' });
    }
  }

  return results;
}

function saveExamples(results) {
  let content = fs.readFileSync(vocabDataPath, 'utf-8');
  const lines = content.split('\n');

  let updatedCount = 0;

  for (const result of results) {
    if (!result.generatedExample) continue;

    // 정의 형태 체크
    if (result.generatedExample.includes('라고 한다') ||
        result.generatedExample.includes('을 말한다') ||
        result.generatedExample.includes('를 말한다') ||
        result.generatedExample.includes('을 의미한다') ||
        result.generatedExample.includes('를 의미한다')) {
      console.log('  여전히 정의 형태: ' + result.word);
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
        '"example": "' + escapedExample + '"'
      );
      updatedCount++;
    }
  }

  fs.writeFileSync(vocabDataPath, lines.join('\n'), 'utf-8');
  console.log('\n' + updatedCount + '개 example 업데이트 완료');
}

async function main() {
  const issues = JSON.parse(fs.readFileSync(issuesPath, 'utf-8'));

  // 정의 형태 예시 + 의미-예시 중복 합치기
  const badExamples = [
    ...issues.definitionExample,
    ...issues.duplicateMeaningExample
  ];

  // 중복 제거 (같은 lineNum)
  const uniqueExamples = [];
  const seen = new Set();
  for (const item of badExamples) {
    if (!seen.has(item.lineNum)) {
      seen.add(item.lineNum);
      uniqueExamples.push(item);
    }
  }

  console.log('수정할 예시: ' + uniqueExamples.length + '개\n');

  if (uniqueExamples.length === 0) {
    console.log('처리할 항목이 없습니다.');
    return;
  }

  const results = await generateExamples(uniqueExamples);

  console.log('\n생성된 예시 샘플:');
  results.slice(0, 10).forEach(r => {
    console.log('  ' + r.word + ': ' + r.generatedExample);
  });

  saveExamples(results);
}

main().catch(console.error);

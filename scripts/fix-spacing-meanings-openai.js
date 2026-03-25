const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

const client = new OpenAI();

const vocabDataPath = path.join(__dirname, '..', 'public/brainfit-vocab-data.js');

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
  if (!lastChar) return type === '은는' ? '은' : '을';

  const hasBatchim = hasFinalConsonant(lastChar);
  switch(type) {
    case '은는': return hasBatchim ? '은' : '는';
    case '을를': return hasBatchim ? '을' : '를';
    default: return '';
  }
}

// 띄어쓰기만 된 meaning 찾기
function findBadMeanings() {
  const vocabData = fs.readFileSync(vocabDataPath, 'utf-8');
  const badMeanings = [];
  let currentWord = '';
  let currentMeaning = '';
  let lineNum = 0;

  const lines = vocabData.split('\n');
  for (const line of lines) {
    lineNum++;

    const wordMatch = line.match(/"word":\s*"([^"]+)"/);
    if (wordMatch) {
      currentWord = wordMatch[1];
    }

    const meaningMatch = line.match(/"meaning":\s*"([^"]+)"/);
    if (meaningMatch && currentWord) {
      currentMeaning = meaningMatch[1];

      const wordNoSpace = currentWord.replace(/\s+/g, '');
      const meaningNoSpace = currentMeaning.replace(/\s+/g, '');

      // 띄어쓰기만 차이나는 경우
      if (wordNoSpace === meaningNoSpace) {
        badMeanings.push({
          lineNum,
          word: currentWord,
          meaning: currentMeaning
        });
      }
    }
  }

  return badMeanings;
}

// 배치로 의미 생성
async function generateMeanings(words, batchSize = 40) {
  const results = [];

  for (let i = 0; i < words.length; i += batchSize) {
    const batch = words.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(words.length / batchSize);

    console.log(`배치 ${batchNum}/${totalBatches} 처리 중... (${batch.length}개)`);

    const prompt = batch.map((w, idx) =>
      `${idx + 1}. ${w.word}`
    ).join('\n');

    try {
      const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `다음 단어들의 뜻을 초등~중등 학생이 이해할 수 있도록 간결하게 설명해주세요.

중요:
- 각 단어의 실제 의미를 15~40자 정도로 설명
- "~이다", "~것" 같은 어미로 끝나도록
- 단어 자체를 반복하지 말고 뜻만 설명

출력 형식 (반드시 이 형식으로):
1. [의미만]
2. [의미만]
...

예시:
단어: 광합성
→ 1. 식물이 햇빛을 이용해 양분을 만드는 과정

${prompt}`
        }]
      });

      const text = response.choices[0].message.content;
      const meanings = parseMeanings(text, batch.length);

      batch.forEach((w, idx) => {
        results.push({
          ...w,
          generatedMeaning: meanings[idx] || ''
        });
      });

      // API 속도 제한 방지
      if (i + batchSize < words.length) {
        await new Promise(r => setTimeout(r, 300));
      }
    } catch (error) {
      console.error(`배치 ${batchNum} 오류:`, error.message);
      batch.forEach(w => {
        results.push({ ...w, generatedMeaning: '' });
      });
    }
  }

  return results;
}

// AI 응답에서 의미 파싱
function parseMeanings(text, expectedCount) {
  const meanings = [];
  const lines = text.split('\n');

  for (const line of lines) {
    const match = line.match(/^\d+[\.\)]\s*(.+)/);
    if (match) {
      let meaning = match[1].trim();
      meaning = meaning.replace(/^["']|["']$/g, '');
      meanings.push(meaning);
    }
  }

  while (meanings.length < expectedCount) {
    meanings.push('');
  }

  return meanings;
}

// 파일에 저장
function saveMeanings(results) {
  let content = fs.readFileSync(vocabDataPath, 'utf-8');
  const lines = content.split('\n');

  let updatedCount = 0;
  let currentWord = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const wordMatch = line.match(/"word":\s*"([^"]+)"/);
    if (wordMatch) {
      currentWord = wordMatch[1];
    }

    const meaningMatch = line.match(/"meaning":\s*"([^"]+)"/);
    if (meaningMatch && currentWord) {
      const result = results.find(r => r.word === currentWord && r.generatedMeaning);

      if (result) {
        const escapedMeaning = result.generatedMeaning
          .replace(/\\/g, '\\\\')
          .replace(/"/g, '\\"');

        lines[i] = line.replace(
          /"meaning":\s*"[^"]+"/,
          `"meaning": "${escapedMeaning}"`
        );
        updatedCount++;

        // explanation도 업데이트
        if (i + 1 < lines.length && lines[i + 1].includes('"explanation"')) {
          const josa1 = getJosa(currentWord, '은는');
          const josa2 = getJosa(result.generatedMeaning, '을를');
          const newExplanation = `\\"${currentWord}\\"${josa1} ${escapedMeaning}${josa2} 의미합니다.`;
          lines[i + 1] = `    "explanation": "${newExplanation}",`;
        }
      }
    }
  }

  fs.writeFileSync(vocabDataPath, lines.join('\n'), 'utf-8');
  console.log(`\n${updatedCount}개 meaning 업데이트 완료`);
}

// 메인 실행
async function main() {
  console.log('띄어쓰기만 된 meaning 찾는 중...');
  const badMeanings = findBadMeanings();
  console.log(`문제 있는 meaning: ${badMeanings.length}개\n`);

  if (badMeanings.length === 0) {
    console.log('처리할 항목이 없습니다.');
    return;
  }

  // 중복 제거 (같은 단어가 여러 번 나올 수 있음)
  const uniqueWords = [];
  const seen = new Set();
  for (const item of badMeanings) {
    if (!seen.has(item.word)) {
      seen.add(item.word);
      uniqueWords.push(item);
    }
  }

  console.log(`중복 제거 후: ${uniqueWords.length}개\n`);

  const results = await generateMeanings(uniqueWords);

  console.log('\n생성된 의미 샘플:');
  results.slice(0, 20).forEach(r => {
    console.log(`  ${r.word}: ${r.generatedMeaning}`);
  });

  saveMeanings(results);
}

main().catch(console.error);

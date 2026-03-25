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

// 영어로 된 meaning 찾기
function findEnglishMeanings() {
  const vocabData = fs.readFileSync(vocabDataPath, 'utf-8');
  const englishMeanings = [];
  let currentWord = '';
  let lineNum = 0;

  const lines = vocabData.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    lineNum = i;

    const wordMatch = line.match(/"word":\s*"([^"]+)"/);
    if (wordMatch) {
      currentWord = wordMatch[1];
    }

    const meaningMatch = line.match(/"meaning":\s*"([^"]+)"/);
    if (meaningMatch && currentWord) {
      const meaning = meaningMatch[1];

      // 영어로 시작하는 meaning (대문자로 시작하고 영어 문장인 경우)
      if (/^[A-Z][a-z]/.test(meaning) && /[a-zA-Z\s]{10,}/.test(meaning)) {
        englishMeanings.push({
          lineNum: i,
          word: currentWord,
          meaning: meaning
        });
      }
    }
  }

  return englishMeanings;
}

// 배치로 의미 생성
async function generateMeanings(words, batchSize = 30) {
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
          content: `다음 한국어 단어들의 뜻을 초등~중등 학생이 이해할 수 있도록 한국어로 간결하게 설명해주세요.

중요:
- 반드시 한국어로 작성
- 각 단어의 실제 의미를 15~40자 정도로 설명
- "~이다", "~것", "~과정" 같은 어미로 끝나도록

출력 형식:
1. [한국어 의미]
2. [한국어 의미]
...

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

  for (const result of results) {
    if (!result.generatedMeaning) continue;

    const lineNum = result.lineNum;
    const line = lines[lineNum];

    if (line && line.includes('"meaning"')) {
      const escapedMeaning = result.generatedMeaning
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"');

      lines[lineNum] = line.replace(
        /"meaning":\s*"[^"]+"/,
        `"meaning": "${escapedMeaning}"`
      );
      updatedCount++;

      // explanation도 업데이트
      if (lineNum + 1 < lines.length && lines[lineNum + 1].includes('"explanation"')) {
        const josa1 = getJosa(result.word, '은는');
        const josa2 = getJosa(result.generatedMeaning, '을를');
        const newExplanation = `\\"${result.word}\\"${josa1} ${escapedMeaning}${josa2} 의미합니다.`;
        lines[lineNum + 1] = `    "explanation": "${newExplanation}",`;
      }

      console.log(`  ${result.word}: ${result.generatedMeaning}`);
    }
  }

  fs.writeFileSync(vocabDataPath, lines.join('\n'), 'utf-8');
  console.log(`\n${updatedCount}개 영어 meaning을 한국어로 변환 완료`);
}

// 메인 실행
async function main() {
  console.log('영어로 된 meaning 찾는 중...');
  const englishMeanings = findEnglishMeanings();
  console.log(`영어 meaning: ${englishMeanings.length}개\n`);

  if (englishMeanings.length === 0) {
    console.log('처리할 항목이 없습니다.');
    return;
  }

  console.log('영어 meaning 목록:');
  englishMeanings.forEach((item, idx) => {
    console.log(`  ${idx + 1}. ${item.word}: ${item.meaning.substring(0, 50)}...`);
  });
  console.log('');

  const results = await generateMeanings(englishMeanings);

  console.log('\n변환 결과:');
  saveMeanings(results);
}

main().catch(console.error);

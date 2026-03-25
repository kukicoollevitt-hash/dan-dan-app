const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

const client = new OpenAI();

const vocabDataPath = path.join(__dirname, '..', 'public/brainfit-vocab-data.js');
const issuesPath = path.join(__dirname, 'vocab-quality-issues.json');

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

async function generateMeanings(words, batchSize = 30) {
  const results = [];

  for (let i = 0; i < words.length; i += batchSize) {
    const batch = words.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(words.length / batchSize);

    console.log('배치 ' + batchNum + '/' + totalBatches + ' 처리 중... (' + batch.length + '개)');

    const prompt = batch.map((w, idx) =>
      (idx + 1) + '. ' + w.word + ' (현재 의미: ' + w.meaning + ')'
    ).join('\n');

    try {
      const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: '다음 단어들의 뜻을 초등~중등 학생이 이해할 수 있도록 한국어로 설명해주세요.\n\n중요:\n- 현재 의미가 동의어나 약어만 있으므로, 실제 뜻풀이로 바꿔주세요\n- 15~40자 정도로 간결하게 설명\n- "~이다", "~것", "~과정" 같은 어미로 끝나도록\n\n출력 형식:\n1. [한국어 의미]\n2. [한국어 의미]\n...\n\n' + prompt
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
      console.error('배치 ' + batchNum + ' 오류:', error.message);
      batch.forEach(w => {
        results.push({ ...w, generatedMeaning: '' });
      });
    }
  }

  return results;
}

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
        /"meaning":\s*"[^"]*"/,
        '"meaning": "' + escapedMeaning + '"'
      );
      updatedCount++;

      // explanation도 업데이트
      if (lineNum + 3 < lines.length) {
        for (let j = lineNum + 1; j <= lineNum + 5 && j < lines.length; j++) {
          if (lines[j].includes('"explanation"')) {
            const josa1 = getJosa(result.word, '은는');
            const josa2 = getJosa(result.generatedMeaning, '을를');
            const newExplanation = '\\"' + result.word + '\\"' + josa1 + ' ' + escapedMeaning + josa2 + ' 의미합니다.';
            lines[j] = '    "explanation": "' + newExplanation + '",';
            break;
          }
        }
      }
    }
  }

  fs.writeFileSync(vocabDataPath, lines.join('\n'), 'utf-8');
  console.log('\n' + updatedCount + '개 meaning 업데이트 완료');
}

async function main() {
  const issues = JSON.parse(fs.readFileSync(issuesPath, 'utf-8'));
  const incompleteMeanings = issues.incompleteMeaning;

  console.log('불완전한 meaning: ' + incompleteMeanings.length + '개\n');

  if (incompleteMeanings.length === 0) {
    console.log('처리할 항목이 없습니다.');
    return;
  }

  const results = await generateMeanings(incompleteMeanings);

  console.log('\n생성된 의미 샘플:');
  results.slice(0, 15).forEach(r => {
    console.log('  ' + r.word + ': ' + r.generatedMeaning);
  });

  saveMeanings(results);
}

main().catch(console.error);

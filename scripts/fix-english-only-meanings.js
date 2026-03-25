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

// 영어만 있는 meaning 찾기
function findEnglishOnlyMeanings() {
  const vocabData = fs.readFileSync(vocabDataPath, 'utf-8');
  const lines = vocabData.split('\n');
  const results = [];

  let currentWord = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const wordMatch = line.match(/"word":\s*"([^"]+)"/);
    if (wordMatch) {
      currentWord = wordMatch[1];
    }

    const meaningMatch = line.match(/"meaning":\s*"([^"]+)"/);
    if (meaningMatch && currentWord) {
      const meaning = meaningMatch[1];

      // 영어만 있는지 체크 (한글이 없음)
      if (!/[가-힣]/.test(meaning) && /[a-zA-Z]/.test(meaning)) {
        results.push({
          lineNum: i,
          word: currentWord,
          meaning: meaning
        });
      }
    }
  }

  return results;
}

async function generateMeanings(words) {
  const results = [];

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    console.log((i + 1) + '/' + words.length + ': ' + w.word + ' (' + w.meaning + ')');

    try {
      const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        max_tokens: 100,
        messages: [{
          role: 'user',
          content: '"' + w.word + '"의 뜻을 초등~중등 학생이 이해할 수 있도록 한국어로 간결하게 설명해주세요.\n\n규칙:\n- 15~40자 정도로 설명\n- "~이다", "~것", "~기관" 같은 어미로 끝나도록\n- 번호 없이 설명만 출력'
        }]
      });

      let meaning = response.choices[0].message.content.trim();
      meaning = meaning.replace(/^["']|["']$/g, '');
      meaning = meaning.replace(/^\d+[\.\)]\s*/, '');

      results.push({
        ...w,
        generatedMeaning: meaning
      });

      if (i < words.length - 1) {
        await new Promise(r => setTimeout(r, 100));
      }
    } catch (error) {
      console.error('  오류:', error.message);
      results.push({ ...w, generatedMeaning: '' });
    }
  }

  return results;
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
      for (let j = lineNum + 1; j <= lineNum + 5 && j < lines.length; j++) {
        if (lines[j].includes('"explanation"')) {
          const josa1 = getJosa(result.word, '은는');
          const josa2 = getJosa(result.generatedMeaning, '을를');
          const newExplanation = '\\"' + result.word + '\\"' + josa1 + ' ' + escapedMeaning + josa2 + ' 의미합니다.';
          lines[j] = '    "explanation": "' + newExplanation + '",';
          break;
        }
      }

      console.log('  → ' + result.generatedMeaning);
    }
  }

  fs.writeFileSync(vocabDataPath, lines.join('\n'), 'utf-8');
  console.log('\n' + updatedCount + '개 meaning 업데이트 완료');
}

async function main() {
  console.log('영어만 있는 meaning 찾는 중...\n');
  const englishMeanings = findEnglishOnlyMeanings();
  console.log('영어만 있는 meaning: ' + englishMeanings.length + '개\n');

  if (englishMeanings.length === 0) {
    console.log('처리할 항목이 없습니다.');
    return;
  }

  englishMeanings.forEach((item, idx) => {
    console.log((idx + 1) + '. ' + item.word + ': ' + item.meaning);
  });
  console.log('');

  const results = await generateMeanings(englishMeanings);
  saveMeanings(results);
}

main().catch(console.error);

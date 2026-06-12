// BRAIN비평 어휘 — 단순 문자열 어휘에 GPT-4o-mini로 초등 눈높이 뜻 자동 생성
//
// 사용법:
//   node scripts/generate-vocab-meanings.js                # 전체 (이미 뜻 있는 객체형은 건너뜀)
//   node scripts/generate-vocab-meanings.js 2026-06-01     # 특정 날짜만
//
// 동작:
//   - critique-articles.json 의 vocabulary 배열을 순회
//   - 문자열 항목만 골라 기사 제목·카테고리 컨텍스트와 함께 GPT-4o-mini에 요청
//   - 응답 JSON을 받아 { word, meaning } 객체로 교체
//   - 한 기사 끝날 때마다 즉시 저장 (중단 안전)

const fs = require('fs');
const path = require('path');
require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const JSON_PATH = path.join(__dirname, '..', 'public', 'data', 'critique-articles.json');

const MODEL = 'gpt-4o-mini';

async function generateMeanings(title, category, words) {
  const prompt =
    `초등학교 3~6학년 어린이가 읽는 시사 기사의 핵심 어휘 뜻을 풀어 써 주세요.\n\n` +
    `기사 제목: "${title}"\n` +
    `카테고리: ${category || '(없음)'}\n\n` +
    `다음 단어들에 대해, 어린이 눈높이로 한 줄(20~50자) 풀어 설명해 주세요.\n` +
    `반드시 JSON 형식으로만 답하세요. 다른 텍스트는 출력하지 마세요.\n` +
    `형식: { "단어1": "뜻1", "단어2": "뜻2", ... }\n\n` +
    `단어 목록: ${JSON.stringify(words, null, 0)}`;

  const resp = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: '당신은 초등학생용 시사 어휘 사전 편집자입니다. 어려운 말은 풀어서, 부드럽고 친근하게 한 줄로 설명합니다. 출력은 JSON만 합니다.' },
      { role: 'user', content: prompt }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.5
  });

  const raw = resp.choices[0].message.content;
  return JSON.parse(raw);
}

(async () => {
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY 가 .env 에 없어요.');
    process.exit(1);
  }

  const root = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  const articles = root.articles;
  const argDates = process.argv.slice(2).filter(s => /^\d{4}-\d{2}-\d{2}$/.test(s));
  const targets = argDates.length ? argDates : Object.keys(articles);

  let totalArticles = 0;
  let totalWords = 0;
  let totalUpdated = 0;
  let totalSkipped = 0;
  let failArticles = 0;

  console.log(`📝 대상 기사 ${targets.length}건 — ${MODEL}\n`);

  for (const date of targets) {
    const article = articles[date];
    if (!article || !Array.isArray(article.vocabulary) || article.vocabulary.length === 0) {
      continue;
    }
    // 문자열 어휘만 추출
    const stringWords = article.vocabulary
      .map((v, i) => ({ v, i }))
      .filter(({ v }) => typeof v === 'string');

    if (stringWords.length === 0) {
      totalSkipped++;
      continue;
    }

    totalArticles++;
    totalWords += stringWords.length;
    const wordList = stringWords.map(({ v }) => v);

    process.stdout.write(`[${date}] ${(article.title || '').substring(0, 35)}... ${stringWords.length}개 → `);

    try {
      const meanings = await generateMeanings(article.title || '', article.category || '', wordList);
      let updated = 0;
      for (const { v, i } of stringWords) {
        const meaning = meanings[v];
        if (meaning && typeof meaning === 'string' && meaning.trim()) {
          article.vocabulary[i] = { word: v, meaning: meaning.trim() };
          updated++;
        }
      }
      totalUpdated += updated;
      // 한 기사 끝날 때마다 즉시 저장
      fs.writeFileSync(JSON_PATH, JSON.stringify(root, null, 2));
      console.log(`✅ ${updated}/${stringWords.length} 갱신`);
    } catch (e) {
      console.log(`❌ ${e.message}`);
      failArticles++;
    }
    // rate-limit 여유
    await new Promise(r => setTimeout(r, 600));
  }

  console.log(`\n✨ 완료 — 처리 기사 ${totalArticles} · 총 단어 ${totalWords} · 갱신 ${totalUpdated} · 실패 ${failArticles} · 객체형만 있던 기사 건너뜀 ${totalSkipped}`);
})();

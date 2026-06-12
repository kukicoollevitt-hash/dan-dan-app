// BRAIN비평 시사문해 — 기사별 DALL-E 3 실사 톤 이미지 생성기
//
// 사용법:
//   node scripts/generate-critique-images.js             # 전체 76건 (skip 안전)
//   node scripts/generate-critique-images.js 2026-04-07  # 단일 날짜
//   node scripts/generate-critique-images.js 2026-04-07 2026-05-30 2026-06-12
//
// - 이미 public/images/critique/{date}.png 가 있으면 건너뜀 (이어 돌리기 안전)
// - articles[date].image 필드를 즉시 저장 → 중간 중단되어도 진행분 보존
// - 비용 (DALL-E 3 HD 1792×1024): 1건 약 $0.08

const fs = require('fs');
const path = require('path');
require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const JSON_PATH = path.join(__dirname, '..', 'public', 'data', 'critique-articles.json');
const OUT_DIR = path.join(__dirname, '..', 'public', 'images', 'critique');
const WEB_PREFIX = '/images/critique';

const QUALITY = 'high';          // 'low' | 'medium' | 'high' | 'auto'
const SIZE = '1536x1024';        // gpt-image-2 와이드 (3:2)
const MODEL = 'gpt-image-2';     // 계정 권한 모델 (DALL-E 3 미허용)
const OUTPUT_FORMAT = 'jpeg';    // 'png' | 'jpeg' | 'webp' — JPG가 용량 절반 이하
const FILE_EXT = OUTPUT_FORMAT === 'jpeg' ? 'jpg' : OUTPUT_FORMAT;

// 인물 안전 규칙 + 어린이용 톤 가이드
const STYLE_TAIL =
  ' Professional photojournalism style, natural lighting, sharp focus, ' +
  'documentary editorial photograph, DSLR camera quality, cinematic wide composition. ' +
  'No text, no letters, no logos, no watermarks. ' +
  'No specific identifiable people; if people appear, show only hands, back view, or distant figures with no clear faces. ' +
  'Child-appropriate, calm and informative atmosphere.';

function buildPrompt(article) {
  const title = (article.title || '').trim();
  const category = (article.category || '').trim();
  return [
    'High-quality editorial photograph illustrating a news story for children.',
    title ? `Topic: ${title}.` : '',
    category ? `Theme category: ${category}.` : '',
    STYLE_TAIL
  ].filter(Boolean).join(' ');
}

async function downloadToFile(url, outPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outPath, buf);
}

async function generateOne(date, article) {
  const fileName = `${date}.${FILE_EXT}`;
  const outPath = path.join(OUT_DIR, fileName);
  if (fs.existsSync(outPath)) {
    return { date, skipped: true, web: `${WEB_PREFIX}/${fileName}` };
  }
  const prompt = buildPrompt(article);
  const resp = await openai.images.generate({
    model: MODEL,
    prompt,
    n: 1,
    size: SIZE,
    quality: QUALITY,
    output_format: OUTPUT_FORMAT
  });
  const item = resp.data[0];
  if (item.url) {
    await downloadToFile(item.url, outPath);
  } else if (item.b64_json) {
    fs.writeFileSync(outPath, Buffer.from(item.b64_json, 'base64'));
  } else {
    throw new Error('응답에 url/b64_json 없음');
  }
  return { date, skipped: false, web: `${WEB_PREFIX}/${fileName}`, prompt };
}

(async () => {
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY 가 .env 에 없어요.');
    process.exit(1);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const root = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  const articles = root.articles;
  const argDates = process.argv.slice(2).filter(s => /^\d{4}-\d{2}-\d{2}$/.test(s));
  const targets = argDates.length ? argDates : Object.keys(articles);

  let ok = 0, skip = 0, fail = 0;
  console.log(`📰 대상 ${targets.length}건 — ${MODEL} ${SIZE} ${QUALITY}\n`);

  for (const date of targets) {
    const article = articles[date];
    if (!article) {
      console.log(`⚠️  ${date} : JSON 에 없음, 건너뜀`);
      continue;
    }
    process.stdout.write(`[${date}] ${(article.title || '').substring(0, 40)}... `);
    try {
      const r = await generateOne(date, article);
      if (r.skipped) {
        console.log('⏭️  이미 존재');
        skip++;
      } else {
        article.image = r.web;
        // 한 건 끝날 때마다 즉시 저장 (중단 안전)
        fs.writeFileSync(JSON_PATH, JSON.stringify(root, null, 2));
        console.log('✅', r.web);
        ok++;
      }
    } catch (e) {
      console.log('❌', e.message);
      fail++;
    }
    // rate-limit 여유
    await new Promise(r => setTimeout(r, 1200));
  }

  console.log(`\n✨ 완료 — 생성 ${ok} · 건너뜀 ${skip} · 실패 ${fail}`);
})();

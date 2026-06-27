/**
 * 문해어휘학습장 응용 활용 페이지용 — GPT-4o로 어휘별 자연스러운 예문 일괄 생성.
 * 결과: public/BRAINUP/vocab-sentences.json (한 번 생성 후 영구 사용)
 *
 * 재실행 안전: 기존 JSON에 있는 단원은 자동 스킵.
 *
 * 실행:
 *   node generate-vocab-sentences.js
 *   node generate-vocab-sentences.js --force  # 기존 결과 무시하고 전체 재생성
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const FORCE = process.argv.includes('--force');
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = 'gpt-4o';
const CONCURRENT = 4; // 동시 호출 수

const SUBJECTS = {
  bio: 'science', earth: 'science', physics: 'science', chem: 'science',
  soc: 'social', geo: 'social', law: 'social', pol: 'social',
  modern: 'korlit', classic: 'korlit',
  world1: 'worldlit', world2: 'worldlit',
  people1: 'person', people2: 'person'
};
const SUBJECT_NAME = {
  bio: '생물', earth: '지구과학', physics: '물리', chem: '화학',
  soc: '사회문화', geo: '지리', law: '법', pol: '정치경제',
  modern: '현대문학', classic: '고전문학',
  world1: '세계문학1', world2: '세계문학2',
  people1: '한국인물', people2: '세계인물'
};

const BASE_DIR = path.join(__dirname, 'public', 'BRAINUP');
const OUT_FILE = path.join(BASE_DIR, 'vocab-sentences.json');

// 기존 결과 로드
let store = { version: '1', model: MODEL, generated_at: '', data: {} };
if (!FORCE && fs.existsSync(OUT_FILE)) {
  try {
    store = JSON.parse(fs.readFileSync(OUT_FILE, 'utf8'));
    if (!store.data) store.data = {};
    console.log(`📂 기존 파일 로드: ${Object.keys(store.data).length}개 단원 캐시됨`);
  } catch {}
}

function stripHanjaParen(s) {
  return String(s || '').replace(/\s*\([一-鿿·\s]+\)\s*/g, '').trim();
}

function extractVocabFromFile(file) {
  const code = fs.readFileSync(file, 'utf8');
  const units = {};
  const re = /(on_[a-z]+\d?_\d{2})\s*:\s*\{/g;
  const starts = [];
  let m;
  while ((m = re.exec(code)) !== null) starts.push({ key: m[1], pos: m.index });
  for (let i = 0; i < starts.length; i++) {
    const start = starts[i].pos;
    const end = i + 1 < starts.length ? starts[i+1].pos : code.length;
    const body = code.slice(start, end);
    const vm = body.match(/vocab\s*:\s*\[([\s\S]*?)\n\s*\]/);
    if (!vm) continue;
    const vocab = [];
    const itemRe = /\[\s*['"`]([^'"`]+)['"`]\s*,\s*['"`]([^'"`]+)['"`]\s*\]/g;
    let im;
    while ((im = itemRe.exec(vm[1])) !== null) {
      const word = stripHanjaParen(im[1]);
      const def = im[2];
      if (word && def) vocab.push({ word, def });
      if (vocab.length >= 8) break;
    }
    const tm = body.match(/title\s*:\s*['"`]([^'"`\n]+)['"`]/);
    const title = tm ? tm[1].replace(/<[^>]+>/g, '').trim() : '';
    units[starts[i].key] = { title, vocab };
  }
  return units;
}

async function generateForUnit(unitKey, unitData) {
  const subj = unitKey.match(/^on_([a-z]+\d?)_/)[1];
  const subjName = SUBJECT_NAME[subj] || subj;
  const vocabList = unitData.vocab.map(v => `- ${v.word}: ${v.def}`).join('\n');

  const prompt = `초등 5~6학년 학생용 문해어휘 학습장입니다.
단원: ${subjName} · ${unitData.title}

다음 어휘들 각각에 대해 자연스러운 활용 예문을 1개씩 만들어 주세요.

어휘:
${vocabList}

조건:
- 각 문장 30~55자 (짧고 명확하게)
- 초등학생이 이해하기 쉬운 일상·학습 맥락
- 어휘를 원형 그대로 한 번만 포함
- 사전 정의 형식("○○는 ...이다")이 아니라 실제 사용 예문
- 어휘 본래 뜻과 맥락이 잘 맞을 것
- 단원 주제와 자연스럽게 어울리되, 너무 어렵지 않게

JSON 형식으로만 응답 (다른 설명 없이):
{ "어휘1": "예문", "어휘2": "예문", ... }`;

  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: '당신은 한국 초등학생용 어휘 학습 교재 전문가입니다. 자연스럽고 학습에 도움이 되는 예문을 작성합니다. JSON으로만 응답합니다.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' }
  });

  const text = response.choices[0].message.content;
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    throw new Error('JSON parse 실패: ' + text.slice(0, 100));
  }
  // 응답 키 정합성 검증 — 어휘에 포함된 단어만 보존
  const cleaned = {};
  for (const v of unitData.vocab) {
    if (parsed[v.word] && typeof parsed[v.word] === 'string') {
      cleaned[v.word] = parsed[v.word].trim();
    }
  }
  return cleaned;
}

function saveStore() {
  store.generated_at = new Date().toISOString();
  fs.writeFileSync(OUT_FILE, JSON.stringify(store, null, 2), 'utf8');
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY 환경변수가 없습니다');
    process.exit(1);
  }

  // 14과목 × 24단원 = 336단원 추출
  const allUnits = {};
  for (const [subj, folder] of Object.entries(SUBJECTS)) {
    const file = path.join(BASE_DIR, folder, `on_${subj}_content.js`);
    if (!fs.existsSync(file)) continue;
    const units = extractVocabFromFile(file);
    for (const k of Object.keys(units)) {
      const num = parseInt(k.split('_').pop(), 10);
      if (num >= 1 && num <= 24) allUnits[k] = units[k];
    }
  }

  const allKeys = Object.keys(allUnits).sort();
  console.log(`📊 총 ${allKeys.length} 단원 (14과목 × 24강)`);
  console.log(`🤖 모델: ${MODEL}, 동시 ${CONCURRENT} 호출`);

  const todoKeys = FORCE ? allKeys : allKeys.filter(k => !store.data[k] || Object.keys(store.data[k]).length === 0);
  console.log(`🎯 처리 대상: ${todoKeys.length}개 (스킵 ${allKeys.length - todoKeys.length}개)`);

  if (todoKeys.length === 0) {
    console.log('✅ 모든 단원 이미 생성 완료');
    return;
  }

  let done = 0, failed = 0;
  const startTime = Date.now();

  async function processUnit(key) {
    try {
      const result = await generateForUnit(key, allUnits[key]);
      store.data[key] = result;
      done++;
      const cnt = Object.keys(result).length;
      const expected = allUnits[key].vocab.length;
      console.log(`  ✅ [${done + failed}/${todoKeys.length}] ${key} (${cnt}/${expected})`);
      if (done % 10 === 0) saveStore();
    } catch (err) {
      failed++;
      console.error(`  ❌ [${done + failed}/${todoKeys.length}] ${key}: ${err.message}`);
    }
  }

  // 배치 동시 실행
  for (let i = 0; i < todoKeys.length; i += CONCURRENT) {
    const batch = todoKeys.slice(i, i + CONCURRENT);
    await Promise.all(batch.map(processUnit));
  }

  saveStore();
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n🎉 완료! 성공 ${done}개, 실패 ${failed}개 (${elapsed}s)`);
  console.log(`📁 저장 위치: ${OUT_FILE}`);
}

main().catch(err => { console.error('FATAL:', err); process.exit(1); });

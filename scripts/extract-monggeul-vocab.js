// 🥚 몽글 도감 P1 — BRAIN업(접두사 없음) 14과목 어휘 추출
//   각 *_content.js 를 vm 샌드박스(window/location mock)로 실행해 vocab 을 뽑아
//   public/monggeul/vocab_up.json 으로 저장. (읽기 전용 — 원본 무수정)
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..", "public", "BRAINUP");
const SUBJECTS = [
  { key: "bio",     file: "science/bio_content.js",     name: "생물",     field: "과학" },
  { key: "earth",   file: "science/earth_content.js",   name: "지구과학", field: "과학" },
  { key: "physics", file: "science/physics_content.js", name: "물리",     field: "과학" },
  { key: "chem",    file: "science/chem_content.js",    name: "화학",     field: "과학" },
  { key: "soc",     file: "social/soc_content.js",      name: "사회문화", field: "사회" },
  { key: "geo",     file: "social/geo_content.js",      name: "지리",     field: "사회" },
  { key: "law",     file: "social/law_content.js",      name: "법",       field: "사회" },
  { key: "pol",     file: "social/pol_content.js",      name: "정치경제", field: "사회" },
  { key: "modern",  file: "korlit/modern_content.js",   name: "현대문학", field: "한국문학" },  // korlit = 실사용 (korilit은 샘플)
  { key: "classic", file: "korlit/classic_content.js",  name: "고전문학", field: "한국문학" },
  { key: "world1",  file: "worldlit/world1_content.js", name: "세계문학1", field: "세계문학" },
  { key: "world2",  file: "worldlit/world2_content.js", name: "세계문학2", field: "세계문학" },
  { key: "people1", file: "person/people1_content.js",  name: "한국인물", field: "인물" },
  { key: "people2", file: "person/people2_content.js",  name: "세계인물", field: "인물" },
];

function runInSandbox(code) {
  // 브라우저 전역 mock — content.js 가 참조하는 것들만 최소로
  const windowMock = { CONTENTS: {} };
  const sandbox = {
    window: windowMock,
    location: { search: "", pathname: "/", href: "" },
    URLSearchParams: URLSearchParams,
    document: { addEventListener() {}, querySelector() { return null; }, querySelectorAll() { return []; }, getElementById() { return null; }, createElement() { return { style: {}, setAttribute() {}, appendChild() {} }; }, head: { appendChild() {} }, body: { appendChild() {} } },
    console: { log() {}, warn() {}, error() {} },
    localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
    setTimeout() {}, setInterval() {}, clearTimeout() {}, clearInterval() {},
    fetch() { return Promise.resolve({ json: () => Promise.resolve({}) }); },
    navigator: {}, alert() {},
    CustomEvent: class CustomEvent { constructor(type, opts) { this.type = type; this.detail = opts && opts.detail; } },
    Event: class Event { constructor(type) { this.type = type; } },
    dispatchEvent() {},
  };
  sandbox.window.location = sandbox.location;
  sandbox.window.document = sandbox.document;
  sandbox.window.localStorage = sandbox.localStorage;
  sandbox.window.addEventListener = () => {}; sandbox.window.dispatchEvent = () => {}; sandbox.window.CustomEvent = sandbox.CustomEvent;
  sandbox.globalThis = sandbox.window;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { timeout: 10000 });
  return windowMock.CONTENTS;
}

const out = { series: "up", builtAt: new Date().toISOString().slice(0, 10), subjects: {} };
let totalWords = 0, totalUnits = 0;
const issues = [];

for (const s of SUBJECTS) {
  const fp = path.join(ROOT, s.file);
  let contents;
  try {
    contents = runInSandbox(fs.readFileSync(fp, "utf8"));
  } catch (e) {
    issues.push(`❌ ${s.key}: 실행 실패 — ${e.message}`);
    continue;
  }
  const units = {};
  const unitKeys = Object.keys(contents).filter(k => k.startsWith(s.key + "_")).sort();
  for (const uk of unitKeys) {
    const pack = contents[uk];
    if (!pack || !Array.isArray(pack.vocab)) { issues.push(`⚠️ ${uk}: vocab 없음`); continue; }
    const words = pack.vocab
      .filter(v => Array.isArray(v) && v[0] && v[1])
      .map(v => ({ w: String(v[0]).trim(), m: String(v[1]).trim().replace(/\.$/, "") }));
    if (!words.length) { issues.push(`⚠️ ${uk}: vocab 비어있음`); continue; }
    units[uk] = { title: String(pack.title || "").trim(), words };
    totalWords += words.length; totalUnits++;
  }
  out.subjects[s.key] = { name: s.name, field: s.field, units };
  console.log(`✅ ${s.name.padEnd(5)} (${s.key}): 단원 ${Object.keys(units).length}개 · 단어 ${Object.values(units).reduce((a, u) => a + u.words.length, 0)}개`);
}

const outDir = path.join(__dirname, "..", "public", "monggeul");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "vocab_up.json");
fs.writeFileSync(outPath, JSON.stringify(out));
console.log(`\n📦 저장: ${outPath}`);
console.log(`   총 ${SUBJECTS.length}과목 · ${totalUnits}단원 · ${totalWords}단어 · ${(fs.statSync(outPath).size / 1024).toFixed(0)}KB`);
if (issues.length) { console.log(`\n주의 (${issues.length}건):`); issues.slice(0, 20).forEach(i => console.log("  " + i)); }

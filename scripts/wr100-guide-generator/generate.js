#!/usr/bin/env node
/**
 * Day N의 HTML 파일에서 DATA 를 추출해 학생용/교사용 PDF 두 개를 생성
 * 사용법:
 *   node scripts/wr100-guide-generator/generate.js 1
 *   node scripts/wr100-guide-generator/generate.js 1 5 10   (여러 개)
 *   node scripts/wr100-guide-generator/generate.js all      (100개 전체)
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const puppeteer = require('puppeteer');
const { buildHtml } = require('./template');

const ROOT = path.join(__dirname, '..', '..');
const HTML_DIR = path.join(ROOT, 'public', '100day');
const OUT_DIR = path.join(ROOT, 'uploads', 'wr100-guides');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function extractData(day) {
  const dayStr = String(day).padStart(3, '0');
  const fp = path.join(HTML_DIR, `100day_${dayStr}.html`);
  if (!fs.existsSync(fp)) throw new Error(`Day ${day} 파일 없음: ${fp}`);
  const src = fs.readFileSync(fp, 'utf8');
  // const DATA = { ... }; 형식 매칭 (여러 줄)
  const m = src.match(/const\s+DATA\s*=\s*(\{[\s\S]*?\n\s*\})\s*;\s*\n/);
  if (!m) throw new Error(`Day ${day} · DATA 파싱 실패`);
  const ctx = { result: null };
  vm.createContext(ctx);
  vm.runInContext(`result = (${m[1]});`, ctx);
  return ctx.result;
}

// 이미지 파일 → base64 data URI 변환 (Puppeteer 이미지 로드 이슈 원천 차단)
// 확장자별 mime · jpg/jpeg/png/gif/webp 대응
const imgCache = new Map();
const MIME_BY_EXT = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp'
};
function inlineImageDataUri(filename) {
  if (imgCache.has(filename)) return imgCache.get(filename);
  const fp = path.join(ROOT, 'public', 'images', '100day', filename);
  if (!fs.existsSync(fp)) {
    console.warn(`⚠ 이미지 없음: ${filename}`);
    imgCache.set(filename, '');
    return '';
  }
  const ext = path.extname(filename).toLowerCase();
  const mime = MIME_BY_EXT[ext] || 'image/jpeg';
  const buf = fs.readFileSync(fp);
  const uri = `data:${mime};base64,${buf.toString('base64')}`;
  imgCache.set(filename, uri);
  return uri;
}

async function generateOne(browser, day) {
  console.log(`\n▶ Day ${day} 생성 시작`);
  const DATA = extractData(day);

  for (const mode of ['student', 'teacher']) {
    let html = buildHtml(DATA, mode);
    // 템플릿의 상대 경로 이미지 → base64 data URI 로 인라인 변환
    // 예: ../../public/images/100day/1day_01.jpg → data:image/jpeg;base64,...
    html = html.replace(
      /src="\.\.\/\.\.\/public\/images\/100day\/([^"]+)"/g,
      (_, filename) => `src="${inlineImageDataUri(filename)}"`
    );

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const dayStr = String(day).padStart(3, '0');
    const outfile = path.join(OUT_DIR, `100day_${dayStr}_${mode}.pdf`);
    await page.pdf({
      path: outfile,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true
    });
    await page.close();
    console.log(`  ✅ ${mode} · ${path.basename(outfile)}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  let days = [];
  if (args.length === 0 || args[0] === 'all') {
    days = Array.from({ length: 100 }, (_, i) => i + 1);
  } else {
    days = args.map(a => parseInt(a, 10)).filter(n => Number.isInteger(n) && n >= 1 && n <= 100);
  }
  if (days.length === 0) {
    console.error('생성할 Day 없음');
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    for (const d of days) {
      try {
        await generateOne(browser, d);
      } catch (err) {
        console.error(`❌ Day ${d} 실패:`, err.message);
      }
    }
  } finally {
    await browser.close();
  }
  console.log('\n✨ 완료');
}

main().catch(err => { console.error(err); process.exit(1); });

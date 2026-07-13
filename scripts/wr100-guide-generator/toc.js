/**
 * 시즌 통합 PDF · 목차 페이지 생성
 * - 2페이지 · 각 페이지 10 Day · 2컬럼 × 5행
 * - Puppeteer로 A4 세로 PDF 렌더 → 서버에서 pdf-lib으로 Day PDF들과 병합
 * - buildTocPdfBytes(seasonInfo, dayEntries) → Uint8Array
 */
const fs = require('fs');
const path = require('path');

// 폰트 · base64 임베드 (template.js와 동일)
const FONT_DIR_DUNGGEUN = path.join(__dirname, '..', '..', 'public', 'images', '학교안심 둥근미소');
const FONT_DIR_NANUM = path.join(__dirname, '..', '..', 'public', 'images', 'nanum-square');

function fontDataUri(fp) {
  try {
    const buf = fs.readFileSync(fp);
    return `data:font/otf;base64,${buf.toString('base64')}`;
  } catch (_) {
    return '';
  }
}

const FONT_URIS = {
  dunggeunB: fontDataUri(path.join(FONT_DIR_DUNGGEUN, 'Hakgyoansim Dunggeunmiso OTF B.otf')),
  dunggeunR: fontDataUri(path.join(FONT_DIR_DUNGGEUN, 'Hakgyoansim Dunggeunmiso OTF R.otf')),
  nanumB: fontDataUri(path.join(FONT_DIR_NANUM, 'NanumSquareB.otf')),
  nanumR: fontDataUri(path.join(FONT_DIR_NANUM, 'NanumSquareR.otf'))
};

// 시즌별 이름·아이콘 (컬러는 통일 · 진노란 파스텔로 표지 톤과 매칭)
const SEASON_STYLES = {
  1: { icon: '🌳', name: '숲의 문해마을' },
  2: { icon: '🌊', name: '바다의 문해마을' },
  3: { icon: '🔥', name: '얼음과 불의 문해마을' },
  4: { icon: '🌌', name: '우주의 문해마을' },
  5: { icon: '☁️', name: '하늘의 문해마을' }
};

// 진노란 파스텔 · 표지 색감 (앞·뒷표지)과 통일
const AMBER = {
  main: '#f59e0b',      // Amber 500 · 대표
  deep: '#78350f',      // Amber 900 · 진한 텍스트
  dark: '#b45309',      // Amber 700 · 배지 그라디언트 어두운 쪽
  border: '#fbbf24',    // Amber 400 · 테두리
  light: '#fef3c7',     // Amber 100 · pill 배경
  veryLight: '#fffbeb', // Amber 50 · 매우 옅은 배경
  shadow: 'rgba(245, 158, 11, 0.22)'
};

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

/**
 * dayEntries · [{ day, topic, writingType, startPage }]
 * seasonInfo · { season: 1~5, kindLabel: '학생용'|'교사용' }
 */
function buildTocHtml(seasonInfo, dayEntries) {
  const { season, kindLabel } = seasonInfo;
  const S = SEASON_STYLES[season] || SEASON_STYLES[1];
  const A = AMBER;

  // 10 Day씩 나눔 · 페이지 1: Day 0-9, 페이지 2: Day 10-19
  const page1Entries = dayEntries.slice(0, 10);
  const page2Entries = dayEntries.slice(10, 20);

  const renderEntry = (e) => `
    <div class="toc-item">
      <div class="toc-item-num">Day ${e.day}</div>
      <div class="toc-item-topic">${esc(e.topic || '준비 중')}</div>
      <div class="toc-item-genre">${esc(e.writingType || '')}</div>
    </div>
  `;

  const renderPage = (entries) => `
    <section class="toc-page">
      <header class="toc-header">
        <div class="toc-title-badge">
          <span class="toc-icon">${S.icon}</span>
          <span class="toc-name">시즌${season} · ${S.name}</span>
        </div>
        <div class="toc-sub">
          <span class="toc-kind">목차</span>
          <span class="toc-range">Day ${entries[0].day} ~ ${entries[entries.length-1].day}</span>
        </div>
      </header>
      <div class="toc-list">
        ${entries.map(renderEntry).join('')}
      </div>
    </section>
  `;

  const css = `
    @page { size: A4 portrait; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    @font-face { font-family: 'HakgyoansimDunggeunmiso'; font-weight: 700; src: url(${FONT_URIS.dunggeunB}) format('opentype'); }
    @font-face { font-family: 'HakgyoansimDunggeunmiso'; font-weight: 400; src: url(${FONT_URIS.dunggeunR}) format('opentype'); }
    @font-face { font-family: 'NanumSquare'; font-weight: 700; src: url(${FONT_URIS.nanumB}) format('opentype'); }
    @font-face { font-family: 'NanumSquare'; font-weight: 400; src: url(${FONT_URIS.nanumR}) format('opentype'); }
    html, body {
      font-family: 'NanumSquare', 'HakgyoansimDunggeunmiso', 'Malgun Gothic', sans-serif;
      color: #1f2937;
      -webkit-font-smoothing: antialiased;
      background: #fff;
    }
    .toc-page {
      width: 210mm;
      height: 297mm;
      padding: 32mm 30mm;      /* 상하 32mm · 좌우 30mm · 여백 넉넉 */
      background: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;  /* 헤더+리스트 전체 블록을 상하 중앙 정렬 */
      page-break-after: always;
      position: relative;
    }
    .toc-page:last-child { page-break-after: auto; }

    /* 상단 헤더 · 시즌 제목을 큰 배지(pill) 형태로 */
    .toc-header {
      padding-bottom: 6mm;
      margin-bottom: 6mm;
      border-bottom: 2px solid ${A.border};
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3mm;
    }
    .toc-title-badge {
      display: inline-flex;
      align-items: center;
      gap: 3mm;
      padding: 3mm 10mm;
      background: linear-gradient(135deg, ${A.main} 0%, ${A.dark} 100%);
      color: #fff;
      border-radius: 999px;
      box-shadow: 0 4px 12px ${A.shadow};
      letter-spacing: -0.3px;
    }
    .toc-icon {
      font-size: 18pt;
      line-height: 1;
    }
    .toc-name {
      font-family: 'HakgyoansimDunggeunmiso', sans-serif;
      font-size: 17pt;
      font-weight: 700;
      color: #fff;
      letter-spacing: -0.3px;
    }
    .toc-sub {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 0 2mm;
      font-size: 11pt;
      font-weight: 500;
    }
    .toc-kind {
      font-family: 'HakgyoansimDunggeunmiso', sans-serif;
      font-weight: 700;
      color: ${A.deep};
      letter-spacing: -0.3px;
      background: ${A.light};
      padding: 1.3mm 5mm;
      border-radius: 999px;
      font-size: 10.5pt;
    }
    .toc-range {
      background: #fff;
      color: ${A.deep};
      border: 1.5px solid ${A.border};
      padding: 1.3mm 5mm;
      border-radius: 999px;
      font-size: 10.5pt;
      font-weight: 700;
      letter-spacing: -0.2px;
    }

    /* 1컬럼 × 10행 · Day별 한 줄 · 컴팩트 · 단원명·갈래 잘림 없이 완전 노출 */
    .toc-list {
      display: flex;
      flex-direction: column;
      gap: 2mm;
    }
    .toc-item {
      display: grid;
      grid-template-columns: 22mm 1fr auto;
      align-items: center;
      gap: 4mm;
      padding: 2.2mm 5mm;
      background: #f5f5f4;
      border-left: 3px solid ${A.border};
      border-radius: 6px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
    }
    .toc-item-num {
      font-family: 'HakgyoansimDunggeunmiso', sans-serif;
      font-size: 13pt;
      font-weight: 700;
      color: ${A.deep};
      letter-spacing: -0.5px;
    }
    .toc-item-topic {
      font-size: 11.5pt;
      font-weight: 800;
      color: #1f2937;
      letter-spacing: -0.3px;
      word-break: keep-all;
      line-height: 1.25;
    }
    .toc-item-genre {
      font-family: 'HakgyoansimDunggeunmiso', sans-serif;
      font-size: 9.5pt;
      font-weight: 700;
      color: ${A.dark};
      background: #fff;
      border: 1.2px solid ${A.border};
      padding: 1mm 3.5mm;
      border-radius: 999px;
      letter-spacing: -0.3px;
      flex-shrink: 0;
      white-space: nowrap;
    }
  `;

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>시즌${season} 목차</title>
<style>${css}</style>
</head>
<body>
${renderPage(page1Entries)}
${renderPage(page2Entries)}
</body>
</html>`;
}

/**
 * TOC PDF 바이트 생성 · Puppeteer 렌더
 * @param {object} seasonInfo · { season, kindLabel }
 * @param {array} dayEntries · [{ day, topic, writingType, startPage }]
 * @returns {Promise<Uint8Array>}
 */
async function buildTocPdfBytes(seasonInfo, dayEntries) {
  const puppeteer = require('puppeteer');
  const html = buildTocHtml(seasonInfo, dayEntries);
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBytes = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true
    });
    return pdfBytes;
  } finally {
    await browser.close();
  }
}

module.exports = { buildTocPdfBytes, buildTocHtml, SEASON_STYLES };

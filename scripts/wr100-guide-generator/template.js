/**
 * 브레인입문 쓰기문해 100Day · 학생용/교사용 PDF 템플릿
 * - buildHtml(DATA, mode) -> HTML 문자열 (A4 세로 · 7페이지)
 * - mode: 'student' | 'teacher'
 *   · student · 빈 칸 · 필사용 옅은 오렌지 글씨 · 학생 채우기
 *   · teacher · 정답이 모두 채워짐 · 나머지 레이아웃은 학생용과 동일
 */

const fs = require('fs');
const path = require('path');

// 폰트 base64 임베드 · Puppeteer 파일 접근 이슈 원천 차단
// 학교안심 둥근미소체 (B/R) + 나눔스퀘어 (B/R) 를 인라인
const FONT_DIR_DUNGGEUN = path.join(__dirname, '..', '..', 'public', 'images', '학교안심 둥근미소');
const FONT_DIR_NANUM = path.join(__dirname, '..', '..', 'public', 'images', 'nanum-square');

function fontDataUri(fp, mime = 'font/otf') {
  try {
    const buf = fs.readFileSync(fp);
    return `data:${mime};base64,${buf.toString('base64')}`;
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

// 스티커고래 워터마크 (1~4) · 메모 페이지 중앙 · Day 순차 (day → (day-1) % 4 + 1)
const WHALE_DIR = path.join(__dirname, '..', '..', 'public', 'images', '100day');
function whaleDataUri(idx) {
  const fp = path.join(WHALE_DIR, `스티커고래${idx}.png`);
  try {
    const buf = fs.readFileSync(fp);
    return `data:image/png;base64,${buf.toString('base64')}`;
  } catch (_) {
    return '';
  }
}
const WHALE_URIS_MEMO = [1, 2, 3, 4].map(whaleDataUri);
function whaleForDay(day) {
  const n = Math.max(1, Number(day) || 1);
  return WHALE_URIS_MEMO[(n - 1) % WHALE_URIS_MEMO.length] || '';
}


const chosungOf = (str) => {
  const CS = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
  return str.split('').map(ch => {
    const c = ch.charCodeAt(0);
    if (c >= 0xAC00 && c <= 0xD7A3) return CS[Math.floor((c - 0xAC00) / (21 * 28))];
    return ch;
  }).join('');
};

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

// 뜻 간추리기 (줄잇기용) · " · " 앞부분만 사용
const shortMeaning = (m) => {
  if (!m) return '';
  const parts = m.split(/\s*·\s*/);
  return parts[0].trim();
};

// 배열 셔플 (시드 없이 · 결정적일 필요는 없음)
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// stage2·stage3 문장 렌더 · 정답 자리(칸) 큰 초성 or 정답
function renderFillSentence(text, target, mode) {
  const parts = Array.isArray(text) ? text : [text];
  const chars = target.split('');
  const boxes = chars.map(ch => {
    const chosung = chosungOf(ch);
    if (mode === 'student') {
      // 학생용 · 초성만 크게 · 중앙
      return `<span class="fill-box">
        <span class="fill-chosung">${chosung}</span>
      </span>`;
    }
    // 교사용 · 정답만 · 중앙
    return `<span class="fill-box filled">
      <span class="fill-ans">${esc(ch)}</span>
    </span>`;
  }).join('');
  return `<span class="fill-sent">${esc(parts[0] || '')}<span class="fill-slot">${boxes}</span>${esc(parts[1] || '')}</span>`;
}

// 브레인온 wbHeader 스타일 이식 · pill-right / leaf / right-rounded 선택 가능
// leftLine1/leftLine2 · 좌측 컬러 박스 2줄
// subtitle · 우측 흰 배경에 얇게 뜨는 안내 부제
// shape · 'pill-right' | 'leaf' | 'right-rounded' (기본 pill-right)
function pageHeader(leftLine1, leftLine2, subtitle, shape = 'pill-right') {
  return `
    <header class="page-header ph-shape-${shape}">
      <div class="ph-leftbox">
        <div class="ph-line1">${esc(leftLine1)}</div>
        <div class="ph-line2">${esc(leftLine2)}</div>
      </div>
      <div class="ph-right">
        <div class="ph-subtitle">${esc(subtitle)}</div>
      </div>
    </header>
  `;
}

function pageFooter(/* pageNum */) {
  // 페이지 번호 제거 · 하단 공간 확보
  return '';
}

/* ═══ 표지 페이지 · Day 대문자 + 토픽 배지 (어휘학습장 Day 표지 스타일 이식) ═══ */
// field/subField 아이콘 매핑
const FIELD_ICONS = {
  science: '🧬',
  society: '🏛️',
  literature: '📖',
  person: '👤',
  humanity: '👤'
};
function pageDayCover(DATA) {
  const day = DATA.day || 1;
  const topic = DATA.topic || '';
  const subField = DATA.subField || '';
  const writingType = DATA.writingType || '';
  const fieldIcon = FIELD_ICONS[DATA.field] || '📚';
  return `
    <section class="page page-cover">
      <div class="cover-inner">
        <div class="cover-subfield">${fieldIcon} ${esc(subField)}</div>
        <div class="cover-day-label">Day</div>
        <div class="cover-day-num">${day}</div>
        <div class="cover-topic-pill">${esc(topic)}</div>
        ${writingType ? `<div class="cover-writing-type">${esc(writingType)}</div>` : ''}
      </div>
    </section>
  `;
}

/* ═══ 페이지 1 · 어휘 익히기 ═══ */
function page1(DATA, mode) {
  const vocab = DATA.vocab || [];
  // 상단 · 어휘 8개 나열 (연한 오렌지 필사)
  const vocabList = vocab.map(v => `
    <div class="vocab-card">
      <div class="vocab-word">${esc(v.word)}</div>
      <div class="vocab-meaning">${esc(v.meaning)}</div>
      <div class="vocab-trace-row">
        <span class="vocab-trace-label">따라 쓰기</span>
        <span class="vocab-trace-box vocab-trace-box-solid"><span class="vocab-trace-ghost">${esc(v.word)}</span></span>
        <span class="vocab-trace-box vocab-trace-box-dashed"><span class="vocab-trace-ghost">${esc(v.word)}</span></span>
      </div>
    </div>
  `).join('');

  // 하단 · 줄잇기 (좌 어휘 랜덤 / 우 뜻 랜덤 · 간추림)
  const wordShuffled = shuffle(vocab);
  const meaningShuffled = shuffle(vocab);
  const linkRowsLeft = wordShuffled.map(v => `
    <div class="link-item">
      <span class="link-text">${esc(v.word)}</span>
      <span class="link-dot"></span>
    </div>
  `).join('');
  const linkRowsRight = meaningShuffled.map(v => `
    <div class="link-item link-item-right">
      <span class="link-dot"></span>
      <span class="link-text link-text-meaning">${esc(shortMeaning(v.meaning))}</span>
    </div>
  `).join('');
  // 교사용 · 정답 매핑 표시 (원본 순서 기준)
  const answerNote = mode === 'teacher' ? `
    <div class="teacher-note">
      <div class="teacher-note-title">📝 정답 (교사용)</div>
      <div class="teacher-note-body">
        ${vocab.map(v => `<span class="teacher-note-pair"><b>${esc(v.word)}</b> · ${esc(shortMeaning(v.meaning))}</span>`).join('')}
      </div>
    </div>
  ` : '';

  return `
    <section class="page">
      ${pageHeader('어휘', '익히기', '오늘의 어휘를 예쁘게 따라 쓰고 · 뜻을 줄로 연결해 봐요', 'pill-right')}
      <div class="page-body">
        <div class="section-box">
          <div class="section-box-title">✨ 오늘의 어휘 8개 · 따라 써봐요</div>
          <div class="vocab-grid">${vocabList}</div>
        </div>
        <div class="section-box">
          <div class="section-box-title">🔗 줄잇기 · 어휘와 뜻을 연결해봐요</div>
          <div class="link-grid">
            <div class="link-col">${linkRowsLeft}</div>
            <div class="link-col-space"></div>
            <div class="link-col">${linkRowsRight}</div>
          </div>
          ${answerNote}
        </div>
      </div>
      ${pageFooter(1)}
    </section>
  `;
}

/* ═══ 페이지 2 · 문장 적어보기 · 4문단 한 페이지 통합 ═══ */
function pageWriting(DATA, mode, pageNum) {
  const paragraphs = DATA.paragraphs || [];
  const items = paragraphs.map((p, i) => {
    const imgIdx = String(i + 1).padStart(2, '0');
    const sentencesHtml = (p.sentences || []).map((s, si) => `
      <div class="trace-line">
        <span class="trace-line-num">${si + 1}</span>
        <span class="trace-line-text">${esc(s)}</span>
      </div>
    `).join('');
    // 지그재그 · 짝수 문단(0-index i=1,3)은 이미지 우측 배치 → 좌우 리듬
    const reverse = i % 2 === 1;
    return `
      <div class="write-block ${reverse ? 'write-block-reverse' : ''}">
        <div class="write-img-wrap">
          <div class="write-img-cap">문단 ${i + 1}</div>
          <img src="../../public/images/100day/${DATA.day}day_${imgIdx}.jpg" alt="문단 ${i + 1} 이미지" class="write-img">
        </div>
        <div class="write-text-wrap">
          ${sentencesHtml}
        </div>
      </div>
    `;
  }).join('');
  return `
    <section class="page">
      ${pageHeader('문장', '적어보기', '옅은 글자 위에 예쁘게 따라 써봐요', 'pill-right')}
      <div class="page-body">
        <div class="write-guide-banner">
          <span class="write-guide-icon">✏️</span>
          <span class="write-guide-text">옅은 <b>오렌지 글자 위에</b> 예쁘게 따라 쓰고, 아래 <b>빈 줄</b>에 한 번 더 써봐요</span>
        </div>
        ${items}
      </div>
      ${pageFooter(pageNum)}
    </section>
  `;
}

/* ═══ 페이지 4·5 · 단어문맥 / 단어활용 ═══ */
function pageFillStage(DATA, mode, pageNum, stageKey, leftLine1, leftLine2, subtitle, shape) {
  let stage = DATA[stageKey] || [];
  // 단어활용(stage3) · 문장 순서 랜덤 셔플 (본문 순서 유추 방지)
  // 단어문맥(stage2) · 본문 순서 유지 (문단 흐름과 일치)
  if (stageKey === 'stage3') {
    stage = shuffle(stage);
  }
  // vocab에서 target 어휘의 유의어/반의어 조회 (있는 것만 · 문장 끝에 인라인)
  const vocabByWord = Object.fromEntries((DATA.vocab || []).map(v => [v.word, v]));
  const relChips = (v) => {
    if (!v) return '';
    const chips = [];
    if (v.syn) chips.push(`<span class="rel-chip rel-syn"><span class="rel-label">유의어</span><span class="rel-word">${esc(v.syn)}</span></span>`);
    if (v.ant) chips.push(`<span class="rel-chip rel-ant"><span class="rel-label">반의어</span><span class="rel-word">${esc(v.ant)}</span></span>`);
    return chips.join('');
  };
  const rows = stage.map((s, i) => {
    // renderFillSentence 결과 · 닫는 </span> 앞에 chip 삽입 · 문장 마침표 뒤 자연 인라인
    let sentence = renderFillSentence(s.text, s.target, mode);
    const chips = relChips(vocabByWord[s.target]);
    if (chips) sentence = sentence.replace(/<\/span>\s*$/, chips + '</span>');
    return `
      <div class="fill-row-plain">
        <div class="fill-row-line">
          <span class="fill-num">${i + 1}</span>
          ${sentence}
        </div>
      </div>
    `;
  }).join('');
  return `
    <section class="page">
      ${pageHeader(leftLine1, leftLine2, subtitle, shape)}
      <div class="page-body">
        <div class="fill-guide">🎯 초성을 보고 · 빈 칸에 알맞은 어휘를 써봐요</div>
        <div class="fill-list-plain">${rows}</div>
      </div>
      ${pageFooter(pageNum)}
    </section>
  `;
}

/* ═══ 페이지 6 · 중심내용 찾기 ═══ */
function page6(DATA, mode) {
  const paragraphs = DATA.paragraphs || [];
  const rows = paragraphs.map((p, i) => {
    const sentencesHtml = (p.sentences || []).map(s => `<li>${esc(s)}</li>`).join('');
    const centerLine = mode === 'teacher'
      ? `<div class="center-line center-line-filled">${esc(p.centerAnswer || '')}</div>`
      : `<div class="center-line"></div>`;
    return `
      <div class="center-block">
        <div class="center-block-title">
          <span class="center-block-badge">문단 ${i + 1}</span>
          ${esc(p.title || '')}
        </div>
        <div class="center-block-sentences">
          <ul>${sentencesHtml}</ul>
        </div>
        <div class="center-block-question">💡 이 문단의 중심내용은?</div>
        ${centerLine}
      </div>
    `;
  }).join('');
  return `
    <section class="page">
      ${pageHeader('중심내용', '찾기', '각 문단을 읽고 · 이 문단의 중심 내용을 한 문장으로 정리해 봐요', 'pill-right')}
      <div class="page-body">
        <div class="center-grid">${rows}</div>
      </div>
      ${pageFooter(5)}
    </section>
  `;
}

/* ═══ 페이지 6 · 갈래별 글쓰기 ═══ */
function page7(DATA, mode) {
  const wt = DATA.writingType || '설명하는 글';
  const guide = (DATA.writing && DATA.writing.guide) || '';
  return `
    <section class="page">
      ${pageHeader('갈래별', '글쓰기', 'AI가 완성한 글을 예쁘게 옮겨 쓰고 · 나만의 생각으로 자유롭게 써봐요', 'pill-right')}
      <div class="page-body">
        <div class="write-guide">
          <span class="write-guide-tag">${esc(wt)}</span>
          ${esc(guide)}
        </div>
        <div class="section-box wg-fill">
          <div class="section-box-title">📝 필사해보기 · AI가 완성한 내 글을 예쁘게 옮겨 써봐요</div>
          <div class="write-box">
            <div class="write-lines">${'<div class="write-line"></div>'.repeat(6)}</div>
          </div>
        </div>
        <div class="section-box wg-fill">
          <div class="section-box-title">✨ 나도 도전하기 · 내 생각으로 자유롭게 써봐요</div>
          <div class="write-box">
            <div class="write-lines">${'<div class="write-line"></div>'.repeat(6)}</div>
          </div>
        </div>
      </div>
      ${pageFooter(6)}
    </section>
  `;
}

/* ═══ 페이지 8 · 더보기 · 활동하기 (갈래별 새 글 + 어휘 숨은 그림 찾기) ═══ */
// 총 페이지가 짝수(8)로 끝나도록 마지막에 배치
// 구조 · 상단 이미지 + 하단 새 글 (오늘 배운 8어휘 자연 포함) · 학생은 배운 어휘에 ○ 표시
function pageActivity(DATA, mode = 'student') {
  const activity = DATA.activity || {};
  const paragraphs = Array.isArray(activity.paragraphs) ? activity.paragraphs : [];
  const vocabWords = (DATA.vocab || []).map(v => v.word).filter(Boolean);
  const wt = DATA.writingType || '';
  const isTeacher = mode === 'teacher';
  const subtitle = isTeacher
    ? '지문에서 오늘의 어휘 8개를 별도 표시로 확인할 수 있어요'
    : `새로 만난 ${wt || '글'}을 읽고 · 오늘 배운 어휘를 찾아 동그라미 쳐봐요`;

  // 상단 이미지 (준비 전에는 안내 박스)
  const imgHtml = activity.image
    ? `<img class="activity-img" src="../../public/images/100day/${activity.image}" alt="더보기 이미지">`
    : `<div class="activity-img-placeholder">🖼️ 이미지 준비 중</div>`;

  // 어휘 안내 · 학생/교사 문구 다름
  const vocabReminder = isTeacher
    ? `
      <div class="activity-vocab-line">
        <span class="activity-vocab-label">📌 오늘의 어휘 표시</span>
        <span class="activity-vocab-guide">지문에서 배운 어휘 <b>${vocabWords.length}개</b>를 노란 형광으로 표시했어요</span>
      </div>
    `
    : `
      <div class="activity-vocab-line">
        <span class="activity-vocab-label">🔍 숨은 어휘 찾기</span>
        <span class="activity-vocab-guide">배운 어휘를 찾아 모두 동그라미 쳐보세요</span>
      </div>
    `;

  // 글 제목 · 갈래 태그 + 주제 (상단 중앙 배치)
  const topic = DATA.topic || '';
  const titleBlock = (wt || topic)
    ? `<div class="activity-title-row">
         ${wt ? `<span class="activity-genre-tag">${esc(wt)}</span>` : ''}
         ${topic ? `<h2 class="activity-title">${esc(topic)}</h2>` : ''}
       </div>`
    : '';

  // 교사용은 지문 내 어휘를 형광 마킹 · 긴 어휘부터 매칭해서 부분어휘 삼킴 방지
  const markVocab = (text) => {
    if (!isTeacher || !vocabWords.length) return esc(text);
    const sorted = [...vocabWords].sort((a, b) => b.length - a.length);
    const pattern = sorted
      .map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|');
    const re = new RegExp('(' + pattern + ')', 'g');
    // esc 먼저 하면 어휘가 escape 될 수 있으므로 마킹 후 부분별 esc
    const parts = text.split(re);
    return parts.map((part, i) => {
      // split with capture group → 홀수 인덱스가 매칭된 어휘
      if (i % 2 === 1) return `<mark class="vocab-mark">${esc(part)}</mark>`;
      return esc(part);
    }).join('');
  };

  const body = paragraphs.length
    ? `<div class="activity-text">${titleBlock}${paragraphs.map(p => `<p>${markVocab(p)}</p>`).join('')}</div>`
    : `<div class="activity-empty">더보기 글이 준비되지 않았어요.</div>`;

  return `
    <section class="page">
      ${pageHeader('더보기', '활동하기', subtitle, 'pill-right')}
      <div class="page-body activity-body">
        ${imgHtml}
        ${vocabReminder}
        ${body}
      </div>
    </section>
  `;
}

/* ══════════════════ 시즌별 · 색상 팔레트 ══════════════════ */
// 시즌 1 (Day 1-20) 숲 · 진녹색 파스텔
// 시즌 2 (Day 21-40) 바다 · 진파랑 파스텔
// 시즌 3 (Day 41-60) 도시/불꽃 · 진오렌지 파스텔 (기본)
// 시즌 4 (Day 61-80) 우주 · 진보라 파스텔
// 시즌 5 (Day 81-100) 태양 · 진황금 파스텔
const THEMES = {
  1: {
    deep: '#1b5e20', dark: '#2e7d32', dark2: '#1b5e20',
    main: '#74bc57',  /* 메인 그린 · 사용자 지정 */
    border: '#81c784', borderLight: '#a5d6a7',
    veryLight: '#c8e6c9',
    bgTint: '#f1f8e9',    /* 박스 배경 · 아주 연한 연두 */
    bgTintSoft: '#f6faf0', /* 더 옅은 톤 (셀·리스트) */
    textDark: '#1b3a1e', textMid: '#2e4c30', textLight: '#6b8f6f',
    brandDim: '#7a9a7c',
    shadowRgba: '27,94,32'
  },
  2: {
    deep: '#0d47a1', dark: '#1565c0', dark2: '#0d47a1',
    main: '#24a5ae',  /* 메인 블루-티일 · 사용자 지정 */
    border: '#64b5f6', borderLight: '#90caf9',
    veryLight: '#bbdefb',
    bgTint: '#e3f2fd', bgTintSoft: '#f0f7ff',
    textDark: '#14314f', textMid: '#2a4661', textLight: '#6b8ba8',
    brandDim: '#7a99b8',
    shadowRgba: '13,71,161'
  },
  3: {
    /* 진주홍 파스텔톤 · Material Deep Orange 계열 · main #ff5722(주홍) */
    deep: '#a63113', dark: '#c2410c', dark2: '#e64a19',
    main: '#ff5722', border: '#ff7043', borderLight: '#ffab91',
    veryLight: '#ffccbc',
    bgTint: '#fbe9e7', bgTintSoft: '#fff4f1',
    textDark: '#3f1a10', textMid: '#5a2a1e', textLight: '#a17b6b',
    brandDim: '#b28e7f',
    shadowRgba: '166,49,19'
  },
  4: {
    /* 진앰버(노랑) 파스텔 · main #ffc839 기준 · Material Amber 계열 통일 */
    deep: '#78350f',       /* amber-900 · 진한 브라운앰버 · 제목·텍스트 */
    dark: '#b45309',       /* amber-700 · 다크 앰버 · 서브 제목 */
    dark2: '#d97706',      /* amber-600 · 그라디언트 끝 */
    main: '#ffc839',       /* 사용자 지정 · 브라이트 앰버 */
    border: '#fbbf24',     /* amber-400 · 파스텔 border */
    borderLight: '#fcd34d',/* amber-300 */
    veryLight: '#fde68a',  /* amber-200 */
    bgTint: '#fef3c7',     /* amber-100 · 아주 옅은 앰버 */
    bgTintSoft: '#fffbeb', /* amber-50 */
    textDark: '#3f2f0a',   /* 매우 어두운 앰버브라운 · 본문 */
    textMid: '#5c4820',
    textLight: '#a08b5a',
    brandDim: '#b09863',
    shadowRgba: '245,158,11'  /* amber-500 */
  },
  5: {
    /* 진빨강 계열 통일 · Material Red 700 기준 · main #dc2626 */
    deep: '#7f1d1d',       /* red-900 · 가장 진한 크림슨 */
    dark: '#991b1b',       /* red-800 */
    dark2: '#b91c1c',      /* red-700-dark */
    main: '#dc2626',       /* red-600 · 진빨강 메인 */
    border: '#ef4444',     /* red-500 */
    borderLight: '#f87171',/* red-400 */
    veryLight: '#fca5a5',  /* red-300 */
    bgTint: '#fee2e2',     /* red-100 */
    bgTintSoft: '#fef2f2', /* red-50 */
    textDark: '#3a1414',
    textMid: '#5a2020',
    textLight: '#a17070',
    brandDim: '#b58888',
    shadowRgba: '220,38,38'  /* red-600 */
  }
};

// 테마 선택 · DATA.theme 명시 우선 · 없으면 field 기반 기본
// 1 초록(자연) · 2 파랑(사회) · 3 주홍(현대문학) · 4 보라(세계문학·인물)
const FIELD_TO_THEME = {
  science: 1,
  society: 2,
  literature: 3,
  person: 4,
  humanity: 4
};
function themeOf(DATA) {
  if (DATA && Number.isInteger(DATA.theme) && DATA.theme >= 1 && DATA.theme <= 5) {
    return DATA.theme;
  }
  return FIELD_TO_THEME[DATA && DATA.field] || 1;
}

/* ══════════════════ 최상위 · 전체 HTML ══════════════════ */
function buildHtml(DATA, mode = 'student') {
  const modeLabel = mode === 'teacher' ? '교사용' : '학생용';
  const season = themeOf(DATA);
  const T = THEMES[season];
  const css = `
    @page { size: A4 portrait; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    /* 학교안심 둥근미소 · 학생 손글씨 톤 · 배지·제목·부제 */
    @font-face {
      font-family: 'HakgyoansimDunggeunmiso';
      font-weight: 700;
      font-style: normal;
      src: url(${FONT_URIS.dunggeunB}) format('opentype');
    }
    @font-face {
      font-family: 'HakgyoansimDunggeunmiso';
      font-weight: 400;
      font-style: normal;
      src: url(${FONT_URIS.dunggeunR}) format('opentype');
    }
    /* 나눔스퀘어 · 본문·문장·어휘 · 가독성 */
    @font-face {
      font-family: 'NanumSquare';
      font-weight: 700;
      font-style: normal;
      src: url(${FONT_URIS.nanumB}) format('opentype');
    }
    @font-face {
      font-family: 'NanumSquare';
      font-weight: 400;
      font-style: normal;
      src: url(${FONT_URIS.nanumR}) format('opentype');
    }
    html, body {
      font-family: 'NanumSquare', 'HakgyoansimDunggeunmiso', 'Malgun Gothic', sans-serif;
      color: #333;
      -webkit-font-smoothing: antialiased;
    }
    body { background: #fff; }
    :root {
      --deep: ${T.deep};
      --dark: ${T.dark};
      --dark2: ${T.dark2};
      --main: ${T.main};
      --border: ${T.border};
      --border-light: ${T.borderLight};
      --very-light: ${T.veryLight};
      --bg-tint: ${T.bgTint};
      --bg-tint-soft: ${T.bgTintSoft};
      --text-dark: ${T.textDark};
      --text-mid: ${T.textMid};
      --text-light: ${T.textLight};
      --brand-dim: ${T.brandDim};
      --shadow-rgba: ${T.shadowRgba};
      /* 색감 다이어트 · 카드/박스 테두리는 회색 통일 · 시즌 컬러는 제목·배지·좌측바에만 */
      --soft-line: #e5e7eb;
      --soft-line-dashed: #d4d4d8;
    }
    .page {
      width: 210mm;
      height: 297mm;
      padding: 12mm 14mm;
      background: #fff;
      display: flex;
      flex-direction: column;
      page-break-after: always;
      position: relative;
    }
    .page:last-child { page-break-after: auto; }
    /* ─── 표지 페이지 · Day 대문자 + 토픽 배지 (어휘학습장 스타일) ─── */
    .page-cover {
      padding: 0;
      align-items: center;
      justify-content: center;
      background: #fff;   /* 표지 배경 · 순수 흰색 (색감은 배지·테두리·글씨로만) */
    }
    .cover-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-family: 'HakgyoansimDunggeunmiso', 'NanumSquare', sans-serif;
      padding: 30mm 20mm;
    }
    .cover-subfield {
      font-size: 20pt;
      font-weight: 700;
      color: var(--dark);
      letter-spacing: 1px;
      margin-bottom: 12mm;
      padding: 3mm 12mm;
      background: #fff;
      border: 2px solid var(--border);
      border-radius: 999px;
      box-shadow: 0 3px 10px rgba(var(--shadow-rgba), 0.15);
    }
    .cover-day-label {
      font-size: 42pt;
      font-weight: 400;
      color: var(--main);
      letter-spacing: 8px;
      margin-bottom: 2mm;
      line-height: 1;
    }
    .cover-day-num {
      font-size: 160pt;
      font-weight: 700;
      color: var(--deep);
      line-height: 1;
      letter-spacing: -6px;
      text-shadow: 0 6px 16px rgba(var(--shadow-rgba), 0.20);
      margin-bottom: 14mm;
    }
    .cover-topic-pill {
      font-size: 26pt;
      font-weight: 700;
      color: var(--deep);
      padding: 5mm 16mm;
      background: rgba(255,255,255,0.92);
      border: 3px solid var(--main);
      border-radius: 999px;
      box-shadow: 0 6px 20px rgba(var(--shadow-rgba), 0.25);
      max-width: 160mm;
    }
    .cover-writing-type {
      margin-top: 8mm;
      font-size: 15pt;
      font-weight: 400;
      color: var(--text-mid);
      letter-spacing: 1px;
    }
    /* ─── 페이지 8 · 더보기 · 활동하기 (상단 이미지 + 어휘 안내 + 하단 새 글) ─── */
    .activity-body {
      gap: 4mm;
    }
    .activity-img {
      width: 100%;
      height: 82mm;                    /* 상하 축소 · 16:9 원본 살짝 crop · 본문 공간 확보 */
      object-fit: cover;
      border-radius: 10px;
      border: 1.5px solid var(--soft-line);
      box-shadow: 0 3px 10px rgba(var(--shadow-rgba), 0.10);
    }
    .activity-img-placeholder {
      width: 100%;
      height: 82mm;                    /* 이미지 없을 때도 동일 크기 */
      background: repeating-linear-gradient(
        45deg,
        #f5f5f4 0 6mm,
        #fafaf9 6mm 12mm
      );
      border: 1.5px dashed var(--soft-line-dashed);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'HakgyoansimDunggeunmiso', 'NanumSquare', sans-serif;
      font-size: 13pt;
      font-weight: 700;
      color: var(--text-light);
      letter-spacing: -0.3px;
    }
    /* 어휘 안내 · 문구 한 줄 (배지 없음 · 학생이 스스로 찾음) */
    .activity-vocab-line {
      display: flex;
      align-items: center;
      gap: 4mm;
      padding: 3mm 5mm;
      background: #f5f5f4;   /* 연회색 · 시즌 색은 border/text로만 */
      border: 1.5px solid var(--soft-line);
      border-radius: 8px;
    }
    .activity-vocab-label {
      font-family: 'HakgyoansimDunggeunmiso', 'NanumSquare', sans-serif;
      font-size: 12pt;
      font-weight: 700;
      color: var(--dark);
      flex-shrink: 0;
    }
    .activity-vocab-guide {
      font-family: 'HakgyoansimDunggeunmiso', 'NanumSquare', sans-serif;
      font-size: 11.5pt;
      font-weight: 400;
      color: var(--text-mid);
      letter-spacing: -0.2px;
    }
    /* 본문 새 글 · 4문단 · 박스 높이는 내용 길이에 맞게 · 하단 여백 자연스럽게 */
    .activity-text {
      display: flex;
      flex-direction: column;
      gap: 3mm;
      padding: 5mm 5mm 4mm;
      background: #fff;
      border: 1.5px solid var(--soft-line);
      border-radius: 10px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    }
    /* 글 제목 · 상단 중앙 · 갈래 태그 + 주제 */
    .activity-title-row {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2mm;
      padding-bottom: 3mm;
      margin-bottom: 1mm;
      border-bottom: 1.5px dashed var(--soft-line-dashed);
      font-family: 'HakgyoansimDunggeunmiso', 'NanumSquare', sans-serif;
    }
    .activity-genre-tag {
      display: inline-block;
      padding: 1mm 5mm;
      background: var(--main);
      color: #fff;
      border-radius: 999px;
      font-size: 10.5pt;
      font-weight: 700;
      letter-spacing: -0.2px;
      box-shadow: 0 2px 5px rgba(var(--shadow-rgba), 0.20);
    }
    .activity-title {
      font-size: 16pt;
      font-weight: 700;
      color: var(--deep);
      letter-spacing: -0.5px;
      line-height: 1.2;
      text-align: center;
      margin: 0;
    }
    .activity-text p {
      font-size: 13pt;
      line-height: 2.0;              /* 넉넉한 행간 · O 그리기 공간 확보 */
      color: var(--text-dark);
      font-weight: 500;
      letter-spacing: -0.2px;
      word-break: keep-all;
    }
    .activity-empty {
      text-align: center;
      color: var(--text-light);
      font-size: 11pt;
      padding: 20mm;
    }
    /* 교사용 · 지문 내 오늘의 어휘 형광 마킹 */
    .vocab-mark {
      background: linear-gradient(180deg, transparent 45%, #fde68a 45%, #fde68a 92%, transparent 92%);
      color: inherit;
      font-weight: 700;
      padding: 0 1px;
      border-radius: 2px;
    }
    /* 헤더 · 좌측 컬러 박스 + 우측 subtitle · 브레인온 wbHeader 스타일 이식 */
    .page-header {
      /* 페이지 좌우/상단 여백까지 밀착 · 음수 마진으로 확장 */
      margin: -12mm -14mm 6mm;
      display: flex;
      align-items: stretch;
      min-height: 22mm;
      border-bottom: 2px solid var(--main);
    }
    .ph-leftbox {
      flex-shrink: 0;
      min-width: 38mm;
      background: var(--main);
      padding: 4mm 8mm 4mm 14mm;    /* 좌측 여백은 페이지 padding(14mm)만큼 */
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
    }
    /* shape · pill-right · 우측 완전 반원 캡슐 */
    .ph-shape-pill-right .ph-leftbox {
      border-radius: 0 9999px 9999px 0;
      box-shadow: 2px 2px 8px rgba(0,0,0,0.09);
    }
    /* shape · leaf · 우하 크게 라운드 (나뭇잎) */
    .ph-shape-leaf .ph-leftbox {
      border-radius: 0 0 20mm 6mm;
      box-shadow: 2px 3px 8px rgba(0,0,0,0.10);
    }
    /* shape · right-rounded · 우측만 큰 라운드 · 단정 */
    .ph-shape-right-rounded .ph-leftbox {
      border-radius: 0 6mm 6mm 0;
      box-shadow: 2px 2px 6px rgba(0,0,0,0.08);
    }
    .ph-line1, .ph-line2 {
      font-family: 'HakgyoansimDunggeunmiso', 'NanumSquare', sans-serif;
      font-size: 15pt;
      font-weight: 700;
      color: #fff;
      line-height: 1;
      letter-spacing: -0.3px;
    }
    .ph-line2 { margin-top: 1.5mm; }
    .ph-right {
      flex: 1;
      min-width: 0;
      background: #fff;
      padding: 3mm 14mm 3mm 8mm;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;   /* 하단 정렬 · 밑줄 가까이 뜨는 부제 느낌 */
    }
    .ph-subtitle {
      font-family: 'HakgyoansimDunggeunmiso', 'NanumSquare', sans-serif;
      font-size: 12pt;
      font-weight: 400;
      color: var(--text-mid);
      letter-spacing: -0.3px;
      line-height: 1.45;
    }
    /* 하단 · 페이지 번호 중앙 */
    .page-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 3mm;
      margin-top: 2mm;
    }
    .page-no {
      background: #fff;
      color: var(--deep);
      border: 1.5px solid var(--soft-line);
      padding: 1.8mm 6mm;
      border-radius: 999px;
      font-size: 11pt;
      font-weight: 800;
      letter-spacing: 0.5px;
    }
    /* 페이지 본문 */
    .page-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 9mm;              /* 섹션 사이 여백 넓게 */
      overflow: hidden;
    }
    /* 섹션 · 박스 제거 · 좌측 시즌 컬러바만 · 컴팩트하고 넓게 */
    .section-box {
      background: transparent;
      border: none;
      border-left: 3px solid var(--main);
      border-radius: 0;
      padding: 1mm 2mm 2mm 5mm;
      box-shadow: none;
    }
    /* 인접한 두 섹션 사이 · 점선 구분선 */
    .section-box + .section-box {
      border-top: 1.2px dashed var(--soft-line-dashed);
      padding-top: 5mm;
    }
    .section-box-title {
      font-family: 'HakgyoansimDunggeunmiso', 'NanumSquare', sans-serif;
      font-size: 13.5pt;
      font-weight: 700;
      color: var(--dark);
      margin-bottom: 3mm;
      letter-spacing: -0.3px;
    }
    /* 페이지 하단 · 시리즈명만 표시 */
    .page-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 4mm;
      border-top: 1px dashed var(--soft-line-dashed);
      margin-top: 4mm;
    }
    .brand-dim { font-size: 8pt; color: var(--brand-dim); font-weight: 600; }

    /* ─── 페이지 1 · 어휘 ─── */
    .vocab-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2mm;
    }
    .vocab-card {
      background: #fff;
      border: 1.5px solid var(--soft-line);
      border-radius: 8px;
      padding: 2mm 3mm;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }
    .vocab-word {
      font-family: 'HakgyoansimDunggeunmiso', 'NanumSquare', sans-serif;
      font-size: 13.5pt;
      font-weight: 700;
      color: var(--deep);
      margin-bottom: 0.5mm;
    }
    .vocab-meaning {
      font-size: 9.5pt;
      color: var(--text-mid);
      line-height: 1.3;
      margin-bottom: 1.2mm;
    }
    .vocab-trace-row {
      display: flex;
      align-items: center;
      gap: 5mm;              /* 간격 더 넓게 */
      margin-top: 1.5mm;
    }
    .vocab-trace-label {
      font-size: 10pt;
      color: var(--text-light);
      font-weight: 700;
      flex-shrink: 0;
    }
    .vocab-trace-box {
      flex: 1;
      padding: 1mm 2mm;
      min-height: 7mm;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;   /* 중앙정렬 */
    }
    .vocab-trace-box-solid { border-bottom: 1.8px solid var(--border); }
    .vocab-trace-box-dashed { border-bottom: 1.8px dashed var(--border); }
    .vocab-trace-ghost {
      font-size: 15pt;
      font-weight: 700;
      color: var(--very-light);   /* 좌측 · 옅은 파스텔 톤 */
      letter-spacing: 2px;
      text-align: center;
    }
    /* 우측 박스 · 글자도 점선(외곽선)으로 · 학생이 안쪽을 채우도록 */
    .vocab-trace-box-dashed .vocab-trace-ghost {
      color: transparent;
      -webkit-text-stroke: 0.7px var(--border-light);
    }
    /* 줄잇기 · 좌(어휘) 좁게 · 우(뜻) 넓게 · 공간 확보 후 글자 확대 */
    .link-grid {
      display: grid;
      grid-template-columns: 32mm 30mm 1fr;
      gap: 3mm;
      align-items: stretch;
    }
    .link-col {
      display: flex;
      flex-direction: column;
      gap: 1.3mm;
    }
    .link-col-space {}
    .link-item {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 6px;
      background: #fff;
      border: 1.5px solid var(--soft-line);
      border-radius: 6px;
      padding: 1.5mm 3mm;
      min-height: 7mm;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .link-item-right {
      justify-content: flex-start;
    }
    .link-text {
      font-size: 14pt;
      color: var(--text-dark);
      font-weight: 800;
    }
    .link-text-meaning {
      font-weight: 600;
      font-size: 12pt;
      line-height: 1.35;
    }
    .link-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: var(--main);
      display: inline-block;
      flex-shrink: 0;
    }
    /* 교사용 정답 노트 */
    .teacher-note {
      margin-top: 4mm;
      background: #fff;
      border: 1.5px dashed var(--soft-line-dashed);
      border-radius: 8px;
      padding: 3mm 4mm;
    }
    .teacher-note-title {
      font-size: 9pt;
      font-weight: 900;
      color: var(--deep);
      margin-bottom: 1mm;
    }
    .teacher-note-body {
      display: flex;
      flex-wrap: wrap;
      gap: 2mm 3mm;
    }
    .teacher-note-pair {
      font-size: 8.5pt;
      color: var(--text-mid);
      background: #fff;
      border: 1px solid var(--soft-line);
      padding: 1mm 2mm;
      border-radius: 4px;
    }
    .teacher-note-pair b { color: var(--deep); }

    /* ─── 페이지 2 · 문장 적어보기 · 4문단 통합 ─── */
    .write-guide-banner {
      display: flex;
      align-items: center;
      gap: 3mm;
      background: #f5f5f4;   /* 연회색 · 시즌 색은 border/text로만 */
      border: 1.5px solid var(--soft-line);
      border-left: 4px solid var(--main);
      padding: 3mm 5mm;
      border-radius: 6px;
      margin-bottom: 3mm;
      flex-shrink: 0;
    }
    .write-guide-icon {
      font-size: 16pt;
      flex-shrink: 0;
    }
    .write-guide-text {
      font-size: 12pt;
      color: var(--text-mid);
      font-weight: 700;
    }
    .write-guide-text b { color: var(--dark); font-weight: 900; }
    .write-block {
      display: grid;
      grid-template-columns: 50mm 1fr;
      gap: 4mm;
      background: #f5f5f4;                /* 연한 회색 · 시즌 색과 대비 */
      border: 1.5px solid #d6d3d1;        /* 연한 회색 테두리 */
      border-radius: 10px;
      padding: 3mm 4mm;
      flex: 1;
      min-height: 0;
      align-items: stretch;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
    }
    .write-block + .write-block { margin-top: 2.5mm; }
    /* 지그재그 · 짝수 문단은 이미지 우측 · 텍스트 좌측 · order 로 스왑 */
    .write-block-reverse {
      grid-template-columns: 1fr 50mm;
    }
    .write-block-reverse .write-text-wrap { order: 1; padding-right: 2mm; padding-left: 0.5mm; }
    .write-block-reverse .write-img-wrap { order: 2; }
    /* 좌우 이미지 캡션 위치 · 우측 이미지에선 캡션도 우측 상단으로 이동해 시선 자연스럽게 */
    .write-block-reverse .write-img-cap {
      left: auto;
      right: 2mm;
    }
    .write-img-wrap {
      position: relative;   /* 배지 절대 위치 기준 */
      height: 100%;
    }
    .write-img {
      width: 100%;
      height: 100%;
      max-height: 48mm;
      object-fit: cover;
      border-radius: 8px;
      border: 1.5px solid var(--soft-line);
      display: block;
    }
    /* 이미지 좌측 상단 · 문단 번호 배지 오버레이 */
    .write-img-cap {
      position: absolute;
      top: 2mm;
      left: 2mm;
      background: linear-gradient(135deg, var(--main), var(--dark2));
      color: #fff;
      padding: 1.5mm 3.5mm;
      border-radius: 999px;
      font-size: 11pt;
      font-weight: 900;
      letter-spacing: -0.2px;
      box-shadow: 0 2px 4px rgba(var(--shadow-rgba),0.35);
      z-index: 1;
    }
    .write-text-wrap {
      padding: 0.5mm 1mm;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .trace-line {
      display: flex;
      gap: 3mm;
      align-items: flex-start;   /* 번호를 문장 시작 위치에 정렬 */
      font-size: 16pt;
      line-height: 1.7;
      letter-spacing: 0.8px;
      margin-bottom: 3mm;
    }
    .trace-line-num {
      background: var(--main);
      color: #fff;
      width: 7mm; height: 7mm;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 9pt;
      font-weight: 900;
      flex-shrink: 0;
      margin-top: 1.5mm;   /* 첫 줄 텍스트 세로 중앙에 맞춤 */
    }
    /* 문장 · 점선 외곽선(hollow) 스타일 · 학생이 안쪽 채우도록 */
    .trace-line-text {
      color: transparent;
      -webkit-text-stroke: 0.7px var(--border-light);
      font-weight: 700;
      flex: 1;
    }

    /* ─── 페이지 3·4 · 단어문맥/활용 · 박스 없이 라인 divider · 시원한 노트 톤 ─── */
    .fill-guide {
      font-family: 'HakgyoansimDunggeunmiso', 'NanumSquare', sans-serif;
      font-size: 13.5pt;
      font-weight: 700;
      color: var(--dark);
      letter-spacing: -0.3px;
      padding: 0 2mm 3mm;
      border-bottom: 2px dashed var(--soft-line-dashed);
      margin-bottom: 3mm;
    }
    .fill-list-plain {
      flex: 1;                       /* 페이지 하단까지 확장 */
      display: flex;
      flex-direction: column;
      justify-content: space-between;/* 균등 분포 */
      padding-bottom: 24mm;          /* 마지막 행이 하단에 너무 밀착 안하도록 · 살짝 위로 */
    }
    .fill-row-plain {
      display: flex;
      flex-direction: column;
      padding: 3mm 3mm;
      border-bottom: 1.2px dashed var(--soft-line-dashed);
    }
    .fill-row-plain:last-child { border-bottom: none; }
    .fill-row-line {
      display: flex;
      align-items: center;
      gap: 4mm;
    }
    /* 유의어/반의어 · 문장 끝 인라인 칩 · 컬러 포인트 · 시즌색과 독립 */
    .rel-chip {
      display: inline-flex;
      align-items: center;
      gap: 0;
      margin-left: 3mm;
      padding: 0.4mm 0.4mm;
      border-radius: 999px;
      font-family: 'HakgyoansimDunggeunmiso', 'NanumSquare', sans-serif;
      font-size: 10pt;
      font-weight: 700;
      letter-spacing: -0.2px;
      vertical-align: middle;
      white-space: nowrap;
    }
    .rel-label {
      padding: 0.8mm 2.5mm;
      border-radius: 999px;
      font-size: 8.5pt;
      font-weight: 800;
      letter-spacing: -0.2px;
    }
    .rel-word {
      padding: 0 3mm 0 2mm;
    }
    /* 유의어 · 살짝 푸른 톤 그레이 · 튀지 않는 포인트 */
    .rel-syn {
      background: #f8fafc;
      color: #64748b;                    /* 슬레이트 · 회색 톤 · 아주 낮은 채도 */
    }
    .rel-syn .rel-label {
      background: #e0f2fe;               /* 아주 연한 하늘 힌트 */
      color: #0369a1;                    /* 가독성 위해 라벨만 진한 스카이 */
    }
    /* 반의어 · 살짝 붉은 톤 그레이 · 튀지 않는 포인트 */
    .rel-ant {
      background: #fafaf9;
      color: #78716c;                    /* 스톤 · 회색 톤 · 아주 낮은 채도 */
    }
    .rel-ant .rel-label {
      background: #fee2e2;               /* 아주 연한 로즈 힌트 */
      color: #b91c1c;                    /* 가독성 위해 라벨만 진한 로즈 */
    }
    /* 기존 박스형 (하위 호환) · 사용 안함 */
    .fill-list {
      display: flex;
      flex-direction: column;
      gap: 6mm;
    }
    .fill-row {
      display: flex;
      align-items: center;
      gap: 4mm;
      background: #fff;
      border: 1.5px solid var(--soft-line);
      border-radius: 8px;
      padding: 3.5mm 4mm;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }
    .fill-num {
      background: linear-gradient(135deg, var(--main), var(--dark2));
      color: #fff;
      width: 7mm; height: 7mm;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 9pt;
      font-weight: 900;
      flex-shrink: 0;
    }
    .fill-sent {
      font-size: 13pt;
      line-height: 2.4;             /* 박스 높이 감안해 넉넉히 */
      color: var(--text-dark);
      font-weight: 600;
      display: block;
      flex: 1;
      word-break: keep-all;         /* 한글 어절 단위 · '것을' 분리 방지 */
    }
    .fill-slot {
      display: inline-block;
      vertical-align: middle;
      margin: 0 1mm;
      white-space: nowrap;          /* 초성 박스 세트는 붙어있게 */
    }
    .fill-box {
      width: 11mm; height: 11mm;
      border: 2px solid var(--main);
      background: #fff;
      border-radius: 4px;
      display: inline-flex;         /* 텍스트 흐름 안에서 인라인 · 내부만 flex */
      align-items: center;
      justify-content: center;
      vertical-align: middle;
      margin-right: 1.5mm;
    }
    .fill-box:last-child { margin-right: 0; }
    .fill-box.filled {
      background: #fff;
    }
    .fill-chosung {
      font-size: 16pt;             /* 크게 · 박스 중앙 */
      font-weight: 900;
      color: var(--very-light);    /* 연한 파스텔 · 학생이 위/옆에 답 씀 */
      line-height: 1;
    }
    .fill-ans {
      font-size: 16pt;             /* 초성과 동일 크기 · 박스 중앙 */
      font-weight: 900;
      color: var(--deep);
      line-height: 1;
    }

    /* ─── 페이지 5 · 중심내용 · 4문단 세로 나열 · 한 페이지 안착 ─── */
    .center-grid {
      display: flex;
      flex-direction: column;
      gap: 2mm;
    }
    .center-block {
      background: #f5f5f4;   /* 연회색 · 시즌 색은 border/text로만 */
      border: 1.5px solid var(--soft-line);
      border-radius: 10px;
      padding: 2.5mm 4mm;
      box-shadow: 0 2px 6px rgba(var(--shadow-rgba), 0.10);
    }
    .center-block-title {
      font-family: 'HakgyoansimDunggeunmiso', 'NanumSquare', sans-serif;
      font-size: 12.5pt;
      font-weight: 700;
      color: var(--deep);
      margin-bottom: 1.2mm;
      display: flex;
      align-items: center;
      gap: 3mm;
    }
    .center-block-badge {
      background: linear-gradient(135deg, var(--main), var(--dark2));
      color: #fff;
      padding: 1.5px 10px;
      border-radius: 999px;
      font-size: 9.5pt;
      font-weight: 800;
    }
    .center-block-sentences ul {
      list-style: none;
      padding: 2mm 3mm;
      background: #fff;
      border: 1px solid var(--soft-line);
      border-radius: 6px;
      margin-bottom: 2mm;
    }
    .center-block-sentences li {
      font-size: 11pt;
      line-height: 1.5;
      color: var(--text-mid);
      font-weight: 600;
      padding-left: 10px;
      position: relative;
      word-break: keep-all;
    }
    .center-block-sentences li::before {
      content: '·';
      position: absolute;
      left: 0;
      color: var(--main);
      font-weight: 900;
    }
    .center-block-question {
      font-size: 11pt;
      font-weight: 800;
      color: var(--dark);
      margin-bottom: 1.2mm;
    }
    .center-line {
      min-height: 22mm;              /* 하단 여백 활용 · 학생 쓰기 공간 넉넉히 */
      border: 1.5px dashed var(--soft-line-dashed);
      border-radius: 6px;
      background: #fff;
      padding: 2.5mm 3mm;
      display: flex;
      align-items: center;
    }
    .center-line-filled {
      background: #fff;
      color: var(--deep);
      font-weight: 700;
      font-size: 11pt;
      line-height: 1.4;
    }

    /* ─── 페이지 7 · 갈래별 글쓰기 ─── */
    .write-guide {
      background: #f5f5f4;   /* 연회색 · 시즌 색은 border/text로만 */
      border: 1.5px solid var(--soft-line);
      border-left: 4px solid var(--main);
      padding: 3mm 4mm;
      border-radius: 6px;
      font-size: 12pt;
      font-weight: 700;
      color: var(--text-mid);
      display: flex;
      align-items: center;
      gap: 3mm;
    }
    .write-guide-tag {
      background: var(--dark2);
      color: #fff;
      padding: 1.5mm 4mm;
      border-radius: 999px;
      font-size: 11pt;
      font-weight: 900;
    }
    .q-mini-list {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 1.5mm;
    }
    .q-mini {
      display: flex;
      gap: 3mm;
      align-items: baseline;
    }
    .q-mini-num {
      background: var(--main);
      color: #fff;
      padding: 1mm 3mm;
      border-radius: 4px;
      font-size: 10pt;
      font-weight: 900;
      flex-shrink: 0;
    }
    .q-mini-text {
      font-size: 12pt;
      color: var(--text-dark);
      font-weight: 600;
    }
    .write-box {
      background: #fff;
      border: 1.5px dashed var(--soft-line-dashed);
      border-radius: 8px;
      padding: 5mm 4mm;
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    }
    .write-lines {
      display: flex;
      flex-direction: column;
      gap: 13mm;                 /* 저학년 손글씨 크기 감안 · 넓게 */
    }
    .write-line {
      border-bottom: 1.2px solid #ccc;
      height: 2mm;               /* 밑줄만 · 실제 쓰기 공간은 위 gap 이 담당 */
    }
  `;

  // 교사용은 어휘익히기/문장적어보기/갈래별글쓰기 3페이지 생략 · 나머지 유지
  const isTeacher = mode === 'teacher';
  const pageList = isTeacher
    ? [
        pageDayCover(DATA),
        pageFillStage(DATA, mode, 3, 'stage2', '단어', '문맥쓰기', '본문 순서대로 · 초성 힌트를 보고 알맞은 어휘를 채워봐요', 'right-rounded'),
        pageFillStage(DATA, mode, 4, 'stage3', '단어', '활용하기', '문장 순서를 섞었어요 · 초성 힌트로 어휘를 찾아 채워봐요', 'right-rounded'),
        page6(DATA, mode),
        pageActivity(DATA, mode)
      ]
    : [
        pageDayCover(DATA),
        page1(DATA, mode),
        pageWriting(DATA, mode, 2),
        pageFillStage(DATA, mode, 3, 'stage2', '단어', '문맥쓰기', '본문 순서대로 · 초성 힌트를 보고 알맞은 어휘를 채워봐요', 'right-rounded'),
        pageFillStage(DATA, mode, 4, 'stage3', '단어', '활용하기', '문장 순서를 섞었어요 · 초성 힌트로 어휘를 찾아 채워봐요', 'right-rounded'),
        page6(DATA, mode),
        page7(DATA, mode),
        pageActivity(DATA, mode)
      ];
  const pages = pageList.join('');

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>Day 1 · ${esc(modeLabel)} · 브레인입문 쓰기문해</title>
<style>${css}</style>
</head>
<body>
${pages}
</body>
</html>`;
}

module.exports = { buildHtml };

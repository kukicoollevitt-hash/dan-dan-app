const fs = require('fs');

const lawContent = fs.readFileSync('/Users/dandan/Desktop/dan-dan-app_1217/public/BRAINUP/social/law_content.js', 'utf8');
const onLawContent = fs.readFileSync('/Users/dandan/Desktop/dan-dan-app_1217/public/BRAINUP/social/on_law_content.js', 'utf8');

// law_content.js에서 각 단원 추출을 위한 정규식
function extractUnit(content, unitNum) {
  const num = unitNum.toString().padStart(2, '0');
  const regex = new RegExp(`\\/\\* ===== law_${num}[^]*?\\*\\/\\s*law_${num}:\\s*\\{([\\s\\S]*?)\\n  \\},?\\s*(?=\\/\\*|$)`, 'g');
  const match = regex.exec(content);
  if (!match) return null;
  return match[1];
}

// 단원 데이터 파싱
function parseUnit(unitContent) {
  // title 추출
  const titleMatch = unitContent.match(/title:\s*'([^']+)'/);
  const title = titleMatch ? titleMatch[1] : '';

  // passage 추출 (3개만)
  const passageMatch = unitContent.match(/passage:\s*\[([\s\S]*?)\],\s*vocab:/);
  let passages = [];
  if (passageMatch) {
    const passageContent = passageMatch[1];
    const passageItems = passageContent.match(/'[^']*'/g);
    if (passageItems) {
      passages = passageItems.slice(0, 3).map(p => p.slice(1, -1));
    }
  }

  // vocab 추출 (8개만)
  const vocabMatch = unitContent.match(/vocab:\s*\[([\s\S]*?)\],\s*(?:\/\*|vocabFill)/);
  let vocab = [];
  if (vocabMatch) {
    const vocabContent = vocabMatch[1];
    const vocabItems = vocabContent.match(/\[['"][^'"]+['"],\s*['"][^'"]+['"]\]/g);
    if (vocabItems) {
      vocab = vocabItems.slice(0, 8);
    }
  }

  // vocabFill items 추출 (8개만)
  const vocabFillMatch = unitContent.match(/vocabFill:\s*\{[\s\S]*?items:\s*\[([\s\S]*?)\]\s*\}/);
  let vocabFillItems = [];
  if (vocabFillMatch) {
    const itemsContent = vocabFillMatch[1];
    const items = itemsContent.match(/\{\s*no:\s*\d+[\s\S]*?\}/g);
    if (items) {
      vocabFillItems = items.slice(0, 8);
    }
  }

  // quiz q1, q2 추출
  const q1TextMatch = unitContent.match(/q1_text:\s*'([^']+)'/);
  const q1Text = q1TextMatch ? q1TextMatch[1] : '';

  const q1OptsMatch = unitContent.match(/q1_opts:\s*\[([\s\S]*?)\],\s*q2_text/);
  let q1Opts = [];
  if (q1OptsMatch) {
    q1Opts = q1OptsMatch[1].match(/'[^']+'/g) || [];
  }

  const q2TextMatch = unitContent.match(/q2_text:\s*'([^']+)'/);
  const q2Text = q2TextMatch ? q2TextMatch[1] : '';

  const q2OptsMatch = unitContent.match(/q2_opts:\s*\[([\s\S]*?)\],?\s*(?:q3|$)/);
  let q2Opts = [];
  if (q2OptsMatch) {
    q2Opts = q2OptsMatch[1].match(/'[^']+'/g) || [];
  }

  // answerKey 추출
  const answerKeyMatch = unitContent.match(/answerKey:\s*\{([^}]+)\}/);
  let q1Ans = '2', q2Ans = '1';
  if (answerKeyMatch) {
    const q1AnsMatch = answerKeyMatch[1].match(/q1:\s*'(\d)'/);
    const q2AnsMatch = answerKeyMatch[1].match(/q2:\s*'(\d)'/);
    if (q1AnsMatch) q1Ans = q1AnsMatch[1];
    if (q2AnsMatch) q2Ans = q2AnsMatch[1];
  }

  // explain q1, q2 추출
  const explainQ1Match = unitContent.match(/q1:\s*'해설:\s*([^']+)'/);
  const explainQ1 = explainQ1Match ? explainQ1Match[1] : '';

  const explainQ2Match = unitContent.match(/q2:\s*'해설:\s*([^']+)'/);
  const explainQ2 = explainQ2Match ? explainQ2Match[1] : '';

  return {
    title,
    passages,
    vocab,
    vocabFillItems,
    q1Text,
    q1Opts,
    q2Text,
    q2Opts,
    q1Ans,
    q2Ans,
    explainQ1,
    explainQ2
  };
}

// on_law 단원 생성
function createOnLawUnit(num, data) {
  const labelNo = num.toString().padStart(2, '0');

  // vocab 배열에서 첫 두 어휘 추출 (q3용)
  let vocab1 = '', vocab1Def = '', vocab2 = '', vocab2Def = '';
  if (data.vocab.length >= 2) {
    const v1Match = data.vocab[0].match(/\['([^']+)',\s*'([^']+)'\]/);
    const v2Match = data.vocab[1].match(/\['([^']+)',\s*'([^']+)'\]/);
    if (v1Match) { vocab1 = v1Match[1]; vocab1Def = v1Match[2]; }
    if (v2Match) { vocab2 = v2Match[1]; vocab2Def = v2Match[2]; }
  }

  return `  /* ===== on_law_${labelNo} : "${data.title.replace(/^[^\s]+\s*/, '')}" ===== */
  on_law_${labelNo}: {
    labelNo: '${labelNo}',
    title: '${data.title}',
    passage: [
      '${data.passages[0] || ''}',
      '${data.passages[1] || ''}',
      '${data.passages[2] || ''}'
    ],
    vocab: [
      ${data.vocab.join(',\n      ')}
    ],
    vocabFill: {
      instructions: '',
      items: [
        ${data.vocabFillItems.join(',\n        ')}
      ]
    },
    quiz: {
      q1_text: '${data.q1Text}',
      q1_opts: [
        ${data.q1Opts.join(',\n        ')}
      ],
      q2_text: '${data.q2Text}',
      q2_opts: [
        ${data.q2Opts.join(',\n        ')}
      ],
      q3_text: '다음 중 어휘와 그 뜻이 바르게 연결된 것은 무엇인가요?',
      q3_opts: [
        '① ${vocab1} - ${vocab2Def}',
        '② ${vocab2} - ${vocab1Def}',
        '③ ${vocab1} - ${vocab1Def}',
        '④ ${vocab2} - 잘못된 뜻'
      ],
      q4_text: '이 글을 읽고 추론한 내용으로 가장 알맞은 것은 무엇인가요?',
      q4_opts: [
        '① 첫 번째 선택지',
        '② 두 번째 선택지 (정답)',
        '③ 세 번째 선택지',
        '④ 네 번째 선택지'
      ]
    },
    answerKey: { q1:'${data.q1Ans}', q2:'${data.q2Ans}', q3:'3', q4:'2' },
    explain: {
      q1:'해설: ${data.explainQ1}',
      q2:'해설: ${data.explainQ2}',
      q3:'정답: ③\\n해설: ${vocab1}은(는) ${vocab1Def}',
      q4:'정답: ②\\n해설: 본문의 내용을 바탕으로 추론하면 ②번이 가장 알맞습니다.'
    }
  }`;
}

// 메인 실행
console.log('법 콘텐츠 변환 시작...');

for (let i = 2; i <= 20; i++) {
  const unitContent = extractUnit(lawContent, i);
  if (unitContent) {
    const data = parseUnit(unitContent);
    console.log(`law_${i.toString().padStart(2, '0')}: ${data.title}`);
    console.log(`  - passages: ${data.passages.length}`);
    console.log(`  - vocab: ${data.vocab.length}`);
    console.log(`  - vocabFill: ${data.vocabFillItems.length}`);
  } else {
    console.log(`law_${i.toString().padStart(2, '0')}: NOT FOUND`);
  }
}

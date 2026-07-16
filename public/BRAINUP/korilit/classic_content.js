/**
 * 고전문학 콘텐츠 (40개 유닛)
 */

(function () {
  const qs = new URLSearchParams(location.search).get('unit');
  let unit = null;

  if (qs) {
    const m = qs.toLowerCase().match(/classic[_-]?(\d{1,2})/);
    if (m) unit = `classic_${m[1].padStart(2, '0')}`;
}

  if (!unit) {
    const m2 = location.pathname.toLowerCase().match(/classic[_-]?(\d{1,2})\.html/);
    if (m2) unit = `classic_${m2[1].padStart(2, '0')}`;
}

  if (!unit && document.title) {
    const m3 = document.title.match(/(\d{1,2})/);
    if (m3) unit = `classic_${m3[1].padStart(2, '0')}`;
}

  window.CUR_UNIT = unit || 'classic_01';
})();

window.CONTENTS = window.CONTENTS || {};

window.CONTENTS = Object.assign(window.CONTENTS, {
  /* ===== classic_01 : "📜 고전문학 1" ===== */
  classic_01: {
    labelNo: '01',
    title: '📜 고전문학 1',
    passage: [
      '이것은 고전문학 1번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `남원에 월매라는 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㅅ">이 살았고, <input class="inline-input" id="q3-2" type="text" placeholder="ㄷㅇ">날 춘향은 그네를 타러 광한루에 나갔다.`,
      q4_html: `몽룡은 <input class="inline-input" id="q4-1" type="text" placeholder="ㅎㅇ">에 가서 <input class="inline-input" id="q4-2" type="text" placeholder="ㅂㅅ">에 오르면 꼭 돌아와 춘향을 데려가겠다고 약속했다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_02 : "📜 고전문학 2" ===== */
  classic_02: {
    labelNo: '02',
    title: '📜 고전문학 2',
    passage: [
      '이것은 고전문학 2번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `이도령은 과거 시험에서 으뜸으로 급제해 <input class="inline-input" id="q3-1" type="text" placeholder="ㅇㅎㅇㅅ"> 임무를 받았고, 춘향이 <input class="inline-input" id="q3-2" type="text" placeholder="ㅅㅊ">을 거절해 감옥에 갇혔다는 소식을 들었다.`,
      q4_html: `임금은 춘향에게 <input class="inline-input" id="q4-1" type="text" placeholder="ㅈㄹㅂㅇ">이라는 칭호를 내렸는데, 이는 <input class="inline-input" id="q4-2" type="text" placeholder="ㅈㄱ">를 지킨 여인에게 주는 이름이다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_03 : "📜 고전문학 3" ===== */
  classic_03: {
    labelNo: '03',
    title: '📜 고전문학 3',
    passage: [
      '이것은 고전문학 3번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_04 : "📜 고전문학 4" ===== */
  classic_04: {
    labelNo: '04',
    title: '📜 고전문학 4',
    passage: [
      '이것은 고전문학 4번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_05 : "📜 고전문학 5" ===== */
  classic_05: {
    labelNo: '05',
    title: '📜 고전문학 5',
    passage: [
      '이것은 고전문학 5번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_06 : "📜 고전문학 6" ===== */
  classic_06: {
    labelNo: '06',
    title: '📜 고전문학 6',
    passage: [
      '이것은 고전문학 6번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_07 : "📜 고전문학 7" ===== */
  classic_07: {
    labelNo: '07',
    title: '📜 고전문학 7',
    passage: [
      '이것은 고전문학 7번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_08 : "📜 고전문학 8" ===== */
  classic_08: {
    labelNo: '08',
    title: '📜 고전문학 8',
    passage: [
      '이것은 고전문학 8번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_09 : "📜 고전문학 9" ===== */
  classic_09: {
    labelNo: '09',
    title: '📜 고전문학 9',
    passage: [
      '이것은 고전문학 9번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_10 : "📜 고전문학 10" ===== */
  classic_10: {
    labelNo: '10',
    title: '📜 고전문학 10',
    passage: [
      '이것은 고전문학 10번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_11 : "📜 고전문학 11" ===== */
  classic_11: {
    labelNo: '11',
    title: '📜 고전문학 11',
    passage: [
      '이것은 고전문학 11번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_12 : "📜 고전문학 12" ===== */
  classic_12: {
    labelNo: '12',
    title: '📜 고전문학 12',
    passage: [
      '이것은 고전문학 12번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_13 : "📜 고전문학 13" ===== */
  classic_13: {
    labelNo: '13',
    title: '📜 고전문학 13',
    passage: [
      '이것은 고전문학 13번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_14 : "📜 고전문학 14" ===== */
  classic_14: {
    labelNo: '14',
    title: '📜 고전문학 14',
    passage: [
      '이것은 고전문학 14번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_15 : "📜 고전문학 15" ===== */
  classic_15: {
    labelNo: '15',
    title: '📜 고전문학 15',
    passage: [
      '이것은 고전문학 15번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_16 : "📜 고전문학 16" ===== */
  classic_16: {
    labelNo: '16',
    title: '📜 고전문학 16',
    passage: [
      '이것은 고전문학 16번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_17 : "📜 고전문학 17" ===== */
  classic_17: {
    labelNo: '17',
    title: '📜 고전문학 17',
    passage: [
      '이것은 고전문학 17번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_18 : "📜 고전문학 18" ===== */
  classic_18: {
    labelNo: '18',
    title: '📜 고전문학 18',
    passage: [
      '이것은 고전문학 18번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_19 : "📜 고전문학 19" ===== */
  classic_19: {
    labelNo: '19',
    title: '📜 고전문학 19',
    passage: [
      '이것은 고전문학 19번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_20 : "📜 고전문학 20" ===== */
  classic_20: {
    labelNo: '20',
    title: '📜 고전문학 20',
    passage: [
      '이것은 고전문학 20번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_21 : "📜 고전문학 21" ===== */
  classic_21: {
    labelNo: '21',
    title: '📜 고전문학 21',
    passage: [
      '이것은 고전문학 21번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_22 : "📜 고전문학 22" ===== */
  classic_22: {
    labelNo: '22',
    title: '📜 고전문학 22',
    passage: [
      '이것은 고전문학 22번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_23 : "📜 고전문학 23" ===== */
  classic_23: {
    labelNo: '23',
    title: '📜 고전문학 23',
    passage: [
      '이것은 고전문학 23번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_24 : "📜 고전문학 24" ===== */
  classic_24: {
    labelNo: '24',
    title: '📜 고전문학 24',
    passage: [
      '이것은 고전문학 24번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_25 : "📜 고전문학 25" ===== */
  classic_25: {
    labelNo: '25',
    title: '📜 고전문학 25',
    passage: [
      '이것은 고전문학 25번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_26 : "📜 고전문학 26" ===== */
  classic_26: {
    labelNo: '26',
    title: '📜 고전문학 26',
    passage: [
      '이것은 고전문학 26번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_27 : "📜 고전문학 27" ===== */
  classic_27: {
    labelNo: '27',
    title: '📜 고전문학 27',
    passage: [
      '이것은 고전문학 27번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_28 : "📜 고전문학 28" ===== */
  classic_28: {
    labelNo: '28',
    title: '📜 고전문학 28',
    passage: [
      '이것은 고전문학 28번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_29 : "📜 고전문학 29" ===== */
  classic_29: {
    labelNo: '29',
    title: '📜 고전문학 29',
    passage: [
      '이것은 고전문학 29번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_30 : "📜 고전문학 30" ===== */
  classic_30: {
    labelNo: '30',
    title: '📜 고전문학 30',
    passage: [
      '이것은 고전문학 30번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_31 : "📜 고전문학 31" ===== */
  classic_31: {
    labelNo: '31',
    title: '📜 고전문학 31',
    passage: [
      '이것은 고전문학 31번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_32 : "📜 고전문학 32" ===== */
  classic_32: {
    labelNo: '32',
    title: '📜 고전문학 32',
    passage: [
      '이것은 고전문학 32번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_33 : "📜 고전문학 33" ===== */
  classic_33: {
    labelNo: '33',
    title: '📜 고전문학 33',
    passage: [
      '이것은 고전문학 33번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_34 : "📜 고전문학 34" ===== */
  classic_34: {
    labelNo: '34',
    title: '📜 고전문학 34',
    passage: [
      '이것은 고전문학 34번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_35 : "📜 고전문학 35" ===== */
  classic_35: {
    labelNo: '35',
    title: '📜 고전문학 35',
    passage: [
      '이것은 고전문학 35번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_36 : "📜 고전문학 36" ===== */
  classic_36: {
    labelNo: '36',
    title: '📜 고전문학 36',
    passage: [
      '이것은 고전문학 36번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_37 : "📜 고전문학 37" ===== */
  classic_37: {
    labelNo: '37',
    title: '📜 고전문학 37',
    passage: [
      '이것은 고전문학 37번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_38 : "📜 고전문학 38" ===== */
  classic_38: {
    labelNo: '38',
    title: '📜 고전문학 38',
    passage: [
      '이것은 고전문학 38번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_39 : "📜 고전문학 39" ===== */
  classic_39: {
    labelNo: '39',
    title: '📜 고전문학 39',
    passage: [
      '이것은 고전문학 39번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
  },

  /* ===== classic_40 : "📜 고전문학 40" ===== */
  classic_40: {
    labelNo: '40',
    title: '📜 고전문학 40',
    passage: [
      '이것은 고전문학 40번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
      '두 번째 문단입니다. 학생들이 읽고 이해할 수 있는 내용으로 채워질 것입니다.',
      '세 번째 문단입니다. 문해력 향상을 위한 양질의 텍스트가 들어갈 예정입니다.'
    ],
    vocab: [
      ['샘플단어1','샘플 단어 1의 뜻'],
      ['샘플단어2','샘플 단어 2의 뜻'],
      ['샘플단어3','샘플 단어 3의 뜻'],
      ['샘플단어4','샘플 단어 4의 뜻'],
      ['샘플단어5','샘플 단어 5의 뜻'],
      ['샘플단어6','샘플 단어 6의 뜻'],
      ['샘플단어7','샘플 단어 7의 뜻'],
      ['샘플단어8','샘플 단어 8의 뜻']
    ],
    vocabFill: {
      instructions: '빈칸에 알맞은 낱말을 쓰세요.',
      items: [
        { no: 1, text: '이것은 (      )입니다.', answer: '샘플단어1', initials: 'ㅅㅍㄷㅇ1', aliases: ['샘플단어1'] },
        { no: 2, text: '이것은 (      )입니다.', answer: '샘플단어2', initials: 'ㅅㅍㄷㅇ2', aliases: ['샘플단어2'] },
        { no: 3, text: '이것은 (      )입니다.', answer: '샘플단어3', initials: 'ㅅㅍㄷㅇ3', aliases: ['샘플단어3'] },
        { no: 4, text: '이것은 (      )입니다.', answer: '샘플단어4', initials: 'ㅅㅍㄷㅇ4', aliases: ['샘플단어4'] },
        { no: 5, text: '이것은 (      )입니다.', answer: '샘플단어5', initials: 'ㅅㅍㄷㅇ5', aliases: ['샘플단어5'] },
        { no: 6, text: '이것은 (      )입니다.', answer: '샘플단어6', initials: 'ㅅㅍㄷㅇ6', aliases: ['샘플단어6'] },
        { no: 7, text: '이것은 (      )입니다.', answer: '샘플단어7', initials: 'ㅅㅍㄷㅇ7', aliases: ['샘플단어7'] },
        { no: 8, text: '이것은 (      )입니다.', answer: '샘플단어8', initials: 'ㅅㅍㄷㅇ8', aliases: ['샘플단어8'] }
      ]
    },
    quiz: {
      q1_text: '샘플 객관식 문제 1번입니다. 정답은 2번입니다.',
      q1_opts: [
        '오답 1',
        '정답',
        '오답 2',
        '오답 3'
      ],
      q2_text: '샘플 객관식 문제 2번입니다. 정답은 3번입니다.',
      q2_opts: [
        '오답 1',
        '오답 2',
        '정답',
        '오답 3'
      ],
      q3_html: `산과 강, 도시와 나라의 <input class="inline-input" id="q3-1" type="text" placeholder="ㄱㄱ"> 을(를) 보여주는 지도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅇㅂㄷ"> 라고 합니다.`,
      q4_html: `요즘은 기술의 발달로 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅈㅌ"> 형태의 지도를 사용하여 <input class="inline-input" id="q4-2" type="text" placeholder="ㅅㅅㄱ"> 정보를 확인할 수 있습니다.`,
      q3_1_ph: 'ㅅㅍ1', q3_2_ph: 'ㅅㅍ2',
      q4_1_ph: 'ㅅㅍ3', q4_2_ph: 'ㅅㅍ4',
      q5_text: '샘플 서술형 문제입니다. 자유롭게 답변하세요.'
    },
    answerKey: {
      q1:'2',
      q2:'3',
      q3_1:['샘플답1'],
      q3_2:['샘플답2'],
      q4_1:['샘플답3'],
      q4_2:['샘플답4']
    },
    essayKeywords: ['샘플','키워드','학습','문해력'],
    explain: {
      q1:'해설: 샘플 문제 1번 해설입니다.',
      q2:'해설: 샘플 문제 2번 해설입니다.',
      q3:'해설: 샘플 문제 3번 해설입니다.',
      q4:'해설: 샘플 문제 4번 해설입니다.',
      q5:'예시: 샘플 서술형 답변 예시입니다.'
  }
}

});

/**
 * 현대문학 콘텐츠 (40개 유닛)
 */

(function () {
  const qs = new URLSearchParams(location.search).get('unit');
  let unit = null;

  if (qs) {
    const m = qs.toLowerCase().match(/modern[_-]?(\d{1,2})/);
    if (m) unit = `modern_${m[1].padStart(2, '0')}`;
}

  if (!unit) {
    const m2 = location.pathname.toLowerCase().match(/modern[_-]?(\d{1,2})\.html/);
    if (m2) unit = `modern_${m2[1].padStart(2, '0')}`;
}

  if (!unit && document.title) {
    const m3 = document.title.match(/(\d{1,2})/);
    if (m3) unit = `modern_${m3[1].padStart(2, '0')}`;
}

  window.CUR_UNIT = unit || 'modern_01';
})();

window.CONTENTS = window.CONTENTS || {};

window.CONTENTS = Object.assign(window.CONTENTS, {
  /* ===== modern_01 : "📖 현대문학 1" ===== */
  modern_01: {
    labelNo: '01',
    title: '📖 현대문학 1',
    passage: [
      '이것은 현대문학 1번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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
      q3_html: `동이가 허 생원과 똑같이 <input class="inline-input" id="q3-1" type="text" placeholder="ㅇㅅㅈㅇ">이고, 어머니가 <input class="inline-input" id="q3-2" type="text" placeholder="ㅂㅍ"> 출신이다.`,
      q4_html: `허 생원은 <input class="inline-input" id="q4-1" type="text" placeholder="ㄷㅂ"> 아래에서 동이가 자신의 <input class="inline-input" id="q4-2" type="text" placeholder="ㅇㄷ">일 수 있다는 생각이 들었다.`,
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

  /* ===== modern_02 : "📖 현대문학 2" ===== */
  modern_02: {
    labelNo: '02',
    title: '📖 현대문학 2',
    passage: [
      '이것은 현대문학 2번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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
      q3_html: `두 사람은 <input class="inline-input" id="q3-1" type="text" placeholder="ㅅㄴㄱ">를 맞으며 더 가까워졌고, <input class="inline-input" id="q3-2" type="text" placeholder="ㅅㅈ"> 조각은 첫 만남의 장면이다.`,
      q4_html: `<input class="inline-input" id="q4-1" type="text" placeholder="ㅂㅎㅅ"> 스웨터는 소나기를 맞던 그날의 <input class="inline-input" id="q4-2" type="text" placeholder="ㅊㅇ">을 상징한다.`,
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

  /* ===== modern_03 : "📖 현대문학 3" ===== */
  modern_03: {
    labelNo: '03',
    title: '📖 현대문학 3',
    passage: [
      '이것은 현대문학 3번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_04 : "📖 현대문학 4" ===== */
  modern_04: {
    labelNo: '04',
    title: '📖 현대문학 4',
    passage: [
      '이것은 현대문학 4번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_05 : "📖 현대문학 5" ===== */
  modern_05: {
    labelNo: '05',
    title: '📖 현대문학 5',
    passage: [
      '이것은 현대문학 5번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_06 : "📖 현대문학 6" ===== */
  modern_06: {
    labelNo: '06',
    title: '📖 현대문학 6',
    passage: [
      '이것은 현대문학 6번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_07 : "📖 현대문학 7" ===== */
  modern_07: {
    labelNo: '07',
    title: '📖 현대문학 7',
    passage: [
      '이것은 현대문학 7번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_08 : "📖 현대문학 8" ===== */
  modern_08: {
    labelNo: '08',
    title: '📖 현대문학 8',
    passage: [
      '이것은 현대문학 8번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_09 : "📖 현대문학 9" ===== */
  modern_09: {
    labelNo: '09',
    title: '📖 현대문학 9',
    passage: [
      '이것은 현대문학 9번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_10 : "📖 현대문학 10" ===== */
  modern_10: {
    labelNo: '10',
    title: '📖 현대문학 10',
    passage: [
      '이것은 현대문학 10번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_11 : "📖 현대문학 11" ===== */
  modern_11: {
    labelNo: '11',
    title: '📖 현대문학 11',
    passage: [
      '이것은 현대문학 11번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_12 : "📖 현대문학 12" ===== */
  modern_12: {
    labelNo: '12',
    title: '📖 현대문학 12',
    passage: [
      '이것은 현대문학 12번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_13 : "📖 현대문학 13" ===== */
  modern_13: {
    labelNo: '13',
    title: '📖 현대문학 13',
    passage: [
      '이것은 현대문학 13번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_14 : "📖 현대문학 14" ===== */
  modern_14: {
    labelNo: '14',
    title: '📖 현대문학 14',
    passage: [
      '이것은 현대문학 14번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_15 : "📖 현대문학 15" ===== */
  modern_15: {
    labelNo: '15',
    title: '📖 현대문학 15',
    passage: [
      '이것은 현대문학 15번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_16 : "📖 현대문학 16" ===== */
  modern_16: {
    labelNo: '16',
    title: '📖 현대문학 16',
    passage: [
      '이것은 현대문학 16번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_17 : "📖 현대문학 17" ===== */
  modern_17: {
    labelNo: '17',
    title: '📖 현대문학 17',
    passage: [
      '이것은 현대문학 17번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_18 : "📖 현대문학 18" ===== */
  modern_18: {
    labelNo: '18',
    title: '📖 현대문학 18',
    passage: [
      '이것은 현대문학 18번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_19 : "📖 현대문학 19" ===== */
  modern_19: {
    labelNo: '19',
    title: '📖 현대문학 19',
    passage: [
      '이것은 현대문학 19번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_20 : "📖 현대문학 20" ===== */
  modern_20: {
    labelNo: '20',
    title: '📖 현대문학 20',
    passage: [
      '이것은 현대문학 20번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_21 : "📖 현대문학 21" ===== */
  modern_21: {
    labelNo: '21',
    title: '📖 현대문학 21',
    passage: [
      '이것은 현대문학 21번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_22 : "📖 현대문학 22" ===== */
  modern_22: {
    labelNo: '22',
    title: '📖 현대문학 22',
    passage: [
      '이것은 현대문학 22번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_23 : "📖 현대문학 23" ===== */
  modern_23: {
    labelNo: '23',
    title: '📖 현대문학 23',
    passage: [
      '이것은 현대문학 23번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_24 : "📖 현대문학 24" ===== */
  modern_24: {
    labelNo: '24',
    title: '📖 현대문학 24',
    passage: [
      '이것은 현대문학 24번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_25 : "📖 현대문학 25" ===== */
  modern_25: {
    labelNo: '25',
    title: '📖 현대문학 25',
    passage: [
      '이것은 현대문학 25번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_26 : "📖 현대문학 26" ===== */
  modern_26: {
    labelNo: '26',
    title: '📖 현대문학 26',
    passage: [
      '이것은 현대문학 26번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_27 : "📖 현대문학 27" ===== */
  modern_27: {
    labelNo: '27',
    title: '📖 현대문학 27',
    passage: [
      '이것은 현대문학 27번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_28 : "📖 현대문학 28" ===== */
  modern_28: {
    labelNo: '28',
    title: '📖 현대문학 28',
    passage: [
      '이것은 현대문학 28번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_29 : "📖 현대문학 29" ===== */
  modern_29: {
    labelNo: '29',
    title: '📖 현대문학 29',
    passage: [
      '이것은 현대문학 29번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_30 : "📖 현대문학 30" ===== */
  modern_30: {
    labelNo: '30',
    title: '📖 현대문학 30',
    passage: [
      '이것은 현대문학 30번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_31 : "📖 현대문학 31" ===== */
  modern_31: {
    labelNo: '31',
    title: '📖 현대문학 31',
    passage: [
      '이것은 현대문학 31번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_32 : "📖 현대문학 32" ===== */
  modern_32: {
    labelNo: '32',
    title: '📖 현대문학 32',
    passage: [
      '이것은 현대문학 32번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_33 : "📖 현대문학 33" ===== */
  modern_33: {
    labelNo: '33',
    title: '📖 현대문학 33',
    passage: [
      '이것은 현대문학 33번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_34 : "📖 현대문학 34" ===== */
  modern_34: {
    labelNo: '34',
    title: '📖 현대문학 34',
    passage: [
      '이것은 현대문학 34번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_35 : "📖 현대문학 35" ===== */
  modern_35: {
    labelNo: '35',
    title: '📖 현대문학 35',
    passage: [
      '이것은 현대문학 35번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_36 : "📖 현대문학 36" ===== */
  modern_36: {
    labelNo: '36',
    title: '📖 현대문학 36',
    passage: [
      '이것은 현대문학 36번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_37 : "📖 현대문학 37" ===== */
  modern_37: {
    labelNo: '37',
    title: '📖 현대문학 37',
    passage: [
      '이것은 현대문학 37번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_38 : "📖 현대문학 38" ===== */
  modern_38: {
    labelNo: '38',
    title: '📖 현대문학 38',
    passage: [
      '이것은 현대문학 38번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_39 : "📖 현대문학 39" ===== */
  modern_39: {
    labelNo: '39',
    title: '📖 현대문학 39',
    passage: [
      '이것은 현대문학 39번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

  /* ===== modern_40 : "📖 현대문학 40" ===== */
  modern_40: {
    labelNo: '40',
    title: '📖 현대문학 40',
    passage: [
      '이것은 현대문학 40번 유닛의 샘플 지문입니다. 실제 내용은 나중에 교체될 예정입니다.',
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

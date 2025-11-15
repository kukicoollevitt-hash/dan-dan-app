/**
 * ✅ 단원 자동 인식 (강화)
 * 우선순위: ?unit=geo_XX → 파일명 geo_XX.html → 제목 숫자
 */
(function () {
  const qs = new URLSearchParams(location.search).get('unit');
  let unit = null;

  if (qs) {
    const m = qs.toLowerCase().match(/geo[_-]?(\d{1,2})/);
    if (m) unit = `geo_${m[1].padStart(2, '0')}`;
  }

  if (!unit) {
    const m2 = location.pathname.toLowerCase().match(/geo[_-]?(\d{1,2})\.html/);
    if (m2) unit = `geo_${m2[1].padStart(2, '0')}`;
  }

  if (!unit && document.title) {
    const m3 = document.title.match(/(\d{1,2})/);
    if (m3) unit = `geo_${m3[1].padStart(2, '0')}`;
  }

  window.CUR_UNIT = unit || 'geo_01';
})();

/* ===============================
   ✅ 전역 CONTENTS 준비 (단일화)
   =============================== */
window.CONTENTS = window.CONTENTS || {};

/* ===== 콘텐츠 팩: 단원별 지문/어휘/문제/정답 =====
   ✅ 기존 const CONTENTS = {...} → window.CONTENTS 에 합치기
*/
window.CONTENTS = Object.assign(window.CONTENTS, {
  /* ===== geo_01 : “지도를 통해 세상을 이해하다” ===== */
  geo_01: {
    labelNo: '01',
    title: '🗺️ 지도를 통해 세상을 이해하다',
    passage: [
      '우리가 낯선 곳을 가거나 여행을 떠날 때 가장 먼저 확인하는 것은 지도예요. 지도는 단순히 길을 찾는 도구가 아니라, 세상의 구조와 사람들의 삶을 한눈에 볼 수 있게 해 주는 정보의 그림이에요. 지도 속에는 산의 높이와 모양, 강의 흐름, 도로와 건물의 위치가 표시되어 있어요. 그래서 지도만 봐도 그 지역의 <b>지리적 특징</b>과 생활 환경을 짐작할 수 있지요.',
      '지도는 목적에 따라 여러 종류로 나뉘어요. 산과 강, 도시와 나라의 경계를 보여주는 <b>일반도</b>가 있고, 특정한 정보를 중심으로 만든 <b>주제도</b>가 있어요. 예를 들어 관광 지도는 여행지를 안내하고, 교통 지도는 도로망이나 지하철 노선을 보여 줍니다. 또, <b>기후도</b>나 <b>인구 분포도</b>처럼 한 가지 주제를 깊이 다루는 지도도 있지요.',
      '요즘은 종이 지도 대신 <b>디지털 지도</b>를 자주 사용합니다. 스마트폰이나 자동차 <b>내비게이션</b>을 통해 <b>실시간</b>으로 길을 안내받을 수 있지요. 지도는 이제 단순한 종이 한 장이 아니라, 세상을 연결하는 디지털 창이 되었습니다. 지도를 잘 읽는 사람은 길을 아는 사람을 넘어, 세상을 이해하는 사람입니다.'
    ],
    vocab: [
      ['지도','땅 위의 여러 장소의 위치와 모습을 그림이나 기호로 나타낸 것.'],
      ['지리적 특징','자연/인문환경의 고유 성격.'],
      ['일반도','지형과 경계를 중심으로 표현한 지도.'],
      ['주제도','특정 주제를 중심으로 만든 지도.'],
      ['기후도','기온·강수량 등 기후 특성 지도.'],
      ['인구 분포도','인구 밀도/구조 시각화 지도.'],
      ['디지털 지도','전자기기에서 보는 지도.'],
      ['내비게이션','경로 안내 장치.'],
      ['실시간','지연 없이 즉시.']
    ],
    vocabFill: {
      instructions: '[사회·지도 관련 어휘]',
      items: [
        { no: 1, text: '지도는 땅 위의 여러 장소의 위치와 모습을 그림이나 기호로 나타낸 (      ) 예요.', answer: '지도', initials: 'ㅈㄷ', aliases: ['지도'] },
        { no: 2, text: '지도만 잘 봐도 한 지역의 (           )과 생활 모습을 짐작할 수 있어요.', answer: '지리적 특징', initials: 'ㅈㄹㅈ ㅌㅈ', aliases: ['지리적특징'] },
        { no: 3, text: '산, 강, 도시, 국경처럼 전체 모습을 보여 주는 지도는 (      )라고 하고,', answer: '일반도', initials: 'ㅇㅂㄷ', aliases: ['일반도'] },
        { no: 4, text: '교통, 인구, 기후 등 특정 주제를 중심으로 제작한 지도는 (      )라고 해요.', answer: '주제도', initials: 'ㅈㅈㄷ', aliases: ['주제도'] },
        { no: 5, text: '어떤 지도는 날씨를 보여 주기 위해 (      )를 사용하고,', answer: '기후도', initials: 'ㄱㅎㄷ', aliases: ['기후도'] },
        { no: 6, text: '어떤 지도는 사람들의 분포를 보여 주기 위해 (          )를 사용해요.', answer: '인구 분포도', initials: 'ㅇㄱ ㅂㅍㄷ', aliases: ['인구분포도'] },
        { no: 7, text: '요즘에는 스마트폰으로 보는 (          )와', answer: '디지털 지도', initials: 'ㄷㅈㅌ ㅈㄷ', aliases: ['디지털지도'] },
        { no: 8, text: '목적지까지 안내해 주는 (        )을 사용하면', answer: '내비게이션', initials: 'ㄴㅂㄱㅅ', aliases: ['네비게이션','내비게이숀'] },
        { no: 9, text: '(      )으로 길 안내를 받을 수 있어요.', answer: '실시간', initials: 'ㅅㅅㄱ', aliases: ['실시간'] }
      ]
    }, 
    quiz: {
      q1_text: '글쓴이가 지도를 ‘세상을 이해하는 도구’라고 표현한 이유로 가장 알맞은 것은 무엇인가요?',
      q1_opts: [
        '① 지도는 우리가 가야 할 길을 빠르게 안내해 주기 때문이다.',
        '② 지도에는 지역의 위치와 거리뿐 아니라 사람들의 생활 모습과 자연의 특징이 담겨 있기 때문이다.',
        '③ 지도는 기술의 발전으로 스마트폰에서 쉽게 사용할 수 있기 때문이다.',
        '④ 지도는 여행지의 관광 명소를 자세히 알려 주기 때문이다.'
      ],
      q2_text: '다음 중 ‘주제도’의 특징을 바르게 설명한 것은 무엇인가요?',
      q2_opts: [
        '① 자연환경을 중심으로 만든 지도이다.',
        '② 모든 지역의 정보를 한눈에 볼 수 있게 만든 지도이다.',
        '③ 교통, 인구, 기후 등 특정한 주제를 중심으로 제작된 지도이다.',
        '④ 지도 중 가장 오래된 형태로 나라의 경계를 표시한다.'
      ],
      q3_1_ph: 'ㄱㄱ', q3_2_ph: 'ㅇㅂㄷ',
      q4_1_ph: 'ㄷㅈㅌ', q4_2_ph: 'ㅅㅅㄱ',
      q5_text: '지도는 단순한 길 안내 도구를 넘어 세상을 이해하는 도구라고 했습니다. 이 말의 의미를 자신의 말로 설명해 보세요.'
    },
    answerKey: { q1:'2', q2:'3', q3_1:['경계'], q3_2:['일반도'], q4_1:['디지털','디지털지도','디지털 지도'], q4_2:['실시간'] },
    essayKeywords: ['지도','세상','이해','정보','삶','구조'],
    explain: {
      q1:'해설: 지도에는 생활/자연 정보가 담겨 세상을 이해하는 창이 됨.',
      q2:'해설: 주제도는 교통·관광·기후 등 한 주제를 중심으로 표현.',
      q3:'해설: 산과 강, 도시와 나라의 경계를 보여주는 지도는 일반도.',
      q4:'해설: 디지털 지도는 전자기기에서 실시간 정보 확인.',
      q5:'예시: 지도를 통해 구조·생활·자연환경을 함께 읽어낼 수 있음.지도에는 생활/자연 정보가 담겨 세상을 이해하는 창이 됨. 주제도는 교통·관광·기후 등 한 주제를 중심으로 표현. 등 '
    }
  },

  /* ===== geo_02 : “지도에 담긴 약속과 표현” ===== */
  geo_02: {
    labelNo: '02',
    title: '🗺️ 지도에 담긴 약속과 표현',
    passage: [
      '지도는 사람이 복잡한 공간을 이해하기 위해 만든 정보의 표현 도구이다. 현실의 땅을 그대로 그리면 복잡하고 알아보기 어려우므로, 사람들은 기호, 색채, 축척 등의 약속을 정해 땅의 모습을 단순하고 정확하게 표현한다.',
      '지도에는 산맥, 하천, 도로, 건물과 같은 요소가 <b>기호(symbol)</b>로 표시된다. 이 기호는 누구나 같은 의미로 이해할 수 있도록 정해진 약속이다. 예를 들어 학교는 모양 그림, 강은 파란색 선, 도로는 굵은 선으로 나타낸다.',
      '또 지도에는 <b>축척(scale)</b>이 표시되어 실제 거리와 지도 거리의 관계를 알려준다. ‘5만 분의 1 지도’는 실제 거리 5만 미터가 지도에서는 1미터로 나타난다는 뜻이다. 이 덕분에 사람들은 지도 위에서도 거리나 위치를 계산할 수 있다.',
      '지형의 높낮이는 <b>등고선(contour line)</b>과 색깔로 표현한다. 등고선 간격이 좁으면 경사가 급하고, 넓으면 완만하다. 색은 초록 → 노랑 → 갈색 → 고동색 순으로 낮은 곳에서 높은 곳으로 바뀌며 지형의 고도를 알려준다.',
      '마지막으로 <b>방위표(compass rose)</b>는 지도에서 동서남북의 방향을 알려주는 기준이다. 방위표가 없을 때는 위쪽이 북쪽, 오른쪽이 동쪽으로 간주한다.'
    ],
    vocab: [
      ['지도','공간의 모습을 기호, 색채, 축척으로 단순화한 표현'],
      ['기호(symbol)','사물/장소를 약속된 그림으로 나타낸 것'],
      ['축척(scale)','실제 거리와 지도 거리의 비율'],
      ['등고선(contour line)','같은 높이를 잇는 선'],
      ['방위표(compass rose)','지도의 방향을 알려주는 기준']
    ],
    /* ✅ 어휘학습(빈칸) */
    vocabFill: {
      instructions: '[지도 약속과 표현 어휘].',
      items: [
        { no: 1, text: '현실의 복잡한 공간을 단순화해 표현한 정보를 (      )라고 한다. ', answer: '지도', initials: 'ㅈㄷ', aliases: ['지도'] },
        { no: 2, text: '산맥·하천·도로·건물 등을 약속된 표시로 나타낸 것을 (      )라고 한다. ', answer: '기호', initials: 'ㄱㅎ', aliases: ['기호','symbol','심벌'] },
        { no: 3, text: '실제 거리와 지도 거리의 관계를 나타내는 약속은 (      )이다. ', answer: '축척', initials: 'ㅊㅊ', aliases: ['축척','scale'] },
        { no: 4, text: '같은 높이를 연결한 선으로 지형의 고도를 나타내는 것은 (      )이다. ', answer: '등고선', initials: 'ㄷㄱㅅ', aliases: ['등고선','contour line','컨투어'] },
        { no: 5, text: '지도에서 동서남북의 방향을 알려 주는 기준은 (      )이다. ', answer: '방위표', initials: 'ㅂㅇㅍ', aliases: ['방위표','compass rose'] },
        { no: 6, text: '등고선 간격이 좁으면 경사는 (      )고, 넓으면 완만하다. ', answer: '가파르', initials: 'ㄱㅍㄹ', aliases: ['급하다','급경사'] },
        { no: 7, text: '색은 초록→노랑→갈색→고동색으로 갈수록 (      ) 곳을 뜻한다. ', answer: '높은', initials: 'ㄴㅇ', aliases: ['높다','높은'] },
        { no: 8, text: '“5만 분의 1”은 실제 5만 m가 지도에서 (      ) m로 나타난다는 뜻이다.', answer: '1', initials: '숫자', aliases: ['1','일'] }
      ]
    },
    quiz: {
      q1_text: '지도에서 산, 강, 도로, 건물 등 다양한 지형 요소를 약속된 표시로 나타낸 것에 대한 설명으로 가장 알맞은 것은 무엇인가요?',
      q1_opts: [
        '① 지도의 기호는 색깔 대신 그림을 이용해 지형을 예쁘게 꾸미는 것을 말한다.',
        '② 지도의 기호는 사람마다 다르게 사용할 수 있는 개인적인 약속을 의미한다.',
        '③ 지도의 기호는 산, 강, 도로, 건물 등을 일정한 약속에 따라 단순화하여 표시한 것이다.',
        '④ 지도의 기호는 실제 사진처럼 자세히 그려서 현실의 모습을 그대로 보여 주는 것이다.'
      ],
      q2_text: '다음 중 지도에서 높낮이의 차이를 표현하는 방법으로 가장 적절한 것은 무엇인가요?',
      q2_opts: [
        '① 지도에 글씨 크기를 다르게 써서 높은 지역을 표시한다.',
        '② 색깔과 등고선을 이용해 지형의 고도를 시각적으로 표현한다.',
        '③ 축척을 크게 하여 높은 곳과 낮은 곳의 거리를 계산한다.',
        '④ 방향표를 이용하여 높은 곳과 낮은 곳의 방향을 구분한다.'
      ],
      q3_html: `지도에는 실제 거리와 지도상의 거리를 일정한
                <input class="inline-input" id="q3-1" type="text" placeholder="ㅂㅇ"> 로 줄여서 나타내는 약속이 있습니다.
                이 비율을 <input class="inline-input" id="q3-2" type="text" placeholder="ㅊㅊ"> 이라고 합니다.`,
      q4_html: `지도에는 동서남북의 방향을 알려주는
                <input class="inline-input" id="q4-1" type="text" placeholder="ㅍㅅ"> 가 있습니다.
                이것을 <input class="inline-input" id="q4-2" type="text" placeholder="ㅂㅇㅍ"> 라고 합니다.`,
      q3_1_ph: 'ㅂㅇ', q3_2_ph: 'ㅊㅊ',
      q4_1_ph: 'ㅍㅅ', q4_2_ph: 'ㅂㅇㅍ',
      q5_text: '등고선의 간격이 좁은 곳과 넓은 곳은 어떤 차이가 있나요? 이를 지형의 특징과 관련지어 자신의 말로 설명해 보세요.'
    },
    answerKey: { q1:'3', q2:'2', q3_1:['비율'], q3_2:['축척'], q4_1:['표시'], q4_2:['방위표'] },
    essayKeywords: ['등고선','간격','좁','넓','급경사','완만','경사','높이','높다','낮다'],
    explain: {
      q1:'해설: 지도 기호는 지형 요소를 약속에 따라 단순화해 표시.',
      q2:'해설: 높낮이는 등고선과 색으로 표현.',
      q3:'해설: 실제/지도 거리의 관계=축척, 성격=비율.',
      q4:'해설: 방향을 알려주는 표식=방위표.',
      q5:'예시: 간격 좁음=급경사, 넓음=완경사.'
    }
  },

  /* ===== geo_03 : “우리 고장의 상징과 유래” ===== */
  geo_03: {
    labelNo: '03',
    title: '🏙️ 우리 고장의 상징과 유래',
    passage: [
      '우리가 사는 고장은 여러 장소가 어우러져 만들어진 생활의 공간이다. 집과 학교, 시장 같은 생활 시설뿐 아니라 산과 강, 공원 같은 자연 환경도 함께 존재하며 이 모든 요소가 어우러져 고유한 지역의 모습을 형성한다.',
      '고장을 <b>탐방</b>할 때 지도를 활용하면 주요 장소의 위치를 쉽게 파악할 수 있다. 지도 속 정보를 실제 모습과 비교해 보면 우리 지역의 구조와 특징을 더 정확히 이해할 수 있다. 지도는 단순히 길을 찾는 도구가 아니라 공간의 질서를 이해하게 하는 시각적 약속이다.',
      '각 지역에는 그 지역을 상징하는 <b>상징물</b>이나 <b>문화유산</b>이 있다. 예를 들어 강화도의 고인돌은 선사시대의 흔적을, 공주의 무령왕릉은 백제의 찬란한 문화를, 원주의 치악산은 자연의 아름다움과 사람들의 삶을 담고 있다.',
      '답사를 하다 보면 <b>지명의 유래</b>와 전설을 만날 때도 있다. 김해의 ‘구지봉’은 거북이를 뜻하는 한자 ‘구(龜)’에서 유래했고, 춘천의 ‘효자동’은 효자가 살던 마을의 이야기를 담고 있다.',
      '결국 지역의 <b>상징물</b>과 옛이야기를 탐구하는 일은 그 고장의 <b>정체성</b>을 이해하는 과정이며, 사람들에게 자신이 사는 곳을 사랑하고 자부심을 가지게 한다.'
    ],
    vocab: [
      ['탐방', '어떤 장소를 직접 찾아가 살펴보는 것'],
      ['상징물', '지역의 문화를 대표하는 존재'],
      ['문화유산', '옛사람들이 남긴 귀중한 자취'],
      ['지명의 유래', '이름이 생긴 이유나 배경'],
      ['정체성', '지역이 가진 고유한 특성']
    ],
    /* ✅ 어휘학습(빈칸) */
    vocabFill: {
      instructions: '[지역 상징·유래 관련 어휘]',
      items: [
        { no: 1, text: '어떤 장소를 직접 찾아가 살펴보는 활동을 (      )이라고 한다.', answer: '탐방', initials: 'ㅌㅂ', aliases: ['탐방'] },
        { no: 2, text: '지역의 문화를 대표하는 존재를 (      )이라고 한다.', answer: '상징물', initials: 'ㅅㅈㅁ', aliases: ['상징물'] },
        { no: 3, text: '옛사람들이 남긴 귀중한 자취를 (      )이라 한다.', answer: '문화유산', initials: 'ㅁㅎㅇㅅ', aliases: ['문화유산'] },
        { no: 4, text: '지명이 생긴 이유나 배경을 (        )라고 한다.', answer: '지명의 유래', initials: 'ㅈㅁㅇ ㅇㄹ', aliases: ['지명의유래'] },
        { no: 5, text: '한 지역이 가진 고유한 특성과 성격을 (      )이라 한다.', answer: '정체성', initials: 'ㅈㅊㅅ', aliases: ['정체성'] },
        { no: 6, text: '강화도의 고인돌·공주의 무령왕릉 같은 대상은 지역의 (      ) 예시다.', answer: '상징물', initials: 'ㅅㅈㅁ', aliases: ['상징물'] },
        { no: 7, text: '지도를 활용하면 지역의 구조와 특징을 더 정확히 (      ) 수 있다.', answer: '이해할', initials: 'ㅇㅎㅎ', aliases: ['이해하다','이해할 수'] }
      ]
    },
    quiz: {
      q1_text: '상징물이 지역 문화에 미치는 영향으로 가장 적절한 것은 무엇인가요?',
      q1_opts: [
        '① 지역의 생활 공간을 단조롭게 만든다.',
        '② 지역의 문화를 이해하는 데 도움을 준다.',
        '③ 지역의 옛이야기를 모두 대신한다.',
        '④ 지역의 이름을 바꾸는 역할을 한다.'
      ],
      q2_text: '지명을 통해 알 수 있는 것은 무엇인가요?',
      q2_opts: [ '① 옛사람들의 생활과 가치관', '② 고장의 상징물의 개수', '③ 시장의 위치', '④ 산의 높이' ],
      q3_html: `지역의 대표적 문화재나 자연물을 <input class="inline-input" id="q3-1" type="text" placeholder="상징물">이라 하며, 이것은 지역의 역사와 문화를 보여주는 중요한 <input class="inline-input" id="q3-2" type="text" placeholder="단서">이다.`,
      q4_html: `김해의 ‘구지봉’은 거북이를 뜻하는 <input class="inline-input" id="q4-1" type="text" placeholder="한자">에서, 춘천의 ‘효자동’은 <input class="inline-input" id="q4-2" type="text" placeholder="효자">의 이야기에서 유래했다.`,
      q3_1_ph: 'ㅅㅈㅁ', q3_2_ph: 'ㄷㅅ', q4_1_ph: 'ㅎㅈ', q4_2_ph: 'ㅎㅈ',
      q5_text: '답사를 통해 지역의 상징물과 지명의 유래를 배우는 것은 왜 의미가 있을까요?'
    },
    answerKey: { q1:'2', q2:'1', q3_1:['상징물'], q3_2:['단서'], q4_1:['한자'], q4_2:['효자'] },
    essayKeywords: ['상징물','지명','유래','문화유산','전설','정체성','문화','생활','가치관'],
    explain: {
      q1:'해설: 상징물은 지역의 역사·문화를 이해하게 함.',
      q2:'해설: 지명은 당시 사람들의 생활과 가치관을 반영.',
      q3:'해설: 상징물은 문화 해석의 단서.',
      q4:'해설: 특정 지명은 고유한 이야기에서 유래.',
      q5:'예시: 상징·유래 탐구는 지역 정체성 이해와 자부심 형성에 도움.'
    }
  },

  /* ===== geo_04 : “지도의 좌표와 경위도” ===== */
  geo_04: {
    labelNo: '04',
    title: '🧭 지도의 좌표와 경위도',
    passage: [
      '지도의 위치를 정확하게 나타내기 위해 좌표 체계를 사용한다. 가장 널리 쓰이는 방식이 지구를 둘러싼 가상의 선인 <b>경선</b>과 <b>위선</b>이다.',
      '<b>위도(latitude)</b>는 적도를 기준으로 북쪽(+), 남쪽(-)으로 얼마나 떨어져 있는지를 나타내며, 0°에서 90°까지 표기한다. <b>경도(longitude)</b>는 본초 자오선(영국 그리니치 천문대를 지나는 경선)을 기준으로 동쪽(+), 서쪽(-)으로 0°에서 180°까지 나타낸다.',
      '어떤 장소의 <b>위도와 경도</b>를 함께 쓰면 지구상에서 그 지점을 하나로 지정할 수 있다. 예를 들어 서울 도심의 좌표는 대략 37°N, 127°E처럼 표현한다.',
      '종이 지도에서는 격자(grid)나 눈금을 사용해 좌표를 읽고, 디지털 지도에서는 터치로 좌표를 복사하거나 검색창에 위도·경도를 입력해 위치를 찾을 수 있다.'
    ],
    vocab: [
      ['좌표', '공간에서 위치를 숫자 쌍(또는 셋)으로 나타낸 값'],
      ['위도(latitude)', '적도 기준 북/남의 각도(0°~90°)'],
      ['경도(longitude)', '본초 자오선 기준 동/서의 각도(0°~180°)'],
      ['본초 자오선', '경도 0°로 약속된 기준 경선'],
      ['격자(grid)', '지도를 일정 간격으로 나눈 선들의 모음']
    ],
    /* ✅ 어휘학습(빈칸) */
    vocabFill: {
      instructions: '[좌표·경위도 관련 어휘]',
      items: [
        { no: 1, text: '공간에서 위치를 수로 나타낸 값을 (      )라고 한다.', answer: '좌표', initials: 'ㅈㅍ', aliases: ['좌표'] },
        { no: 2, text: '위도는 (      )를 기준으로 북/남의 각도를 잰다.', answer: '적도', initials: 'ㅈㄷ', aliases: ['적도'] },
        { no: 3, text: '경도는 (        )을 기준으로 동/서의 각도를 잰다.', answer: '본초 자오선', initials: 'ㅂㅊ ㅈㅇㅅ', aliases: ['본초자오선'] },
        { no: 4, text: '서울 도심 좌표 표기는 대략 37° (  ) , 127° (  ) 이다.', answer: 'N/E', initials: 'ㅂ/ㄷ', aliases: ['N,E','북/동','북위/동경','N / E'] },
        { no: 5, text: '지도를 일정 간격으로 나눈 선들의 모음을 (      )라고 한다.', answer: '격자', initials: 'ㄱㅈ', aliases: ['격자','grid'] },
        { no: 6, text: '위도·경도 두 값이 교차하는 (  )이 곧 한 장소를 정확히 지정한다.', answer: '한 점', initials: 'ㅎ ㅈ', aliases: ['한점','한 지점','점'] },
        { no: 7, text: '경도 0°는 (        )을, 위도 0°는 적도를 의미한다.', answer: '본초 자오선/적도', initials: 'ㅂㅊ ㅈㅇㅅ ', aliases: ['본초자오선'] }
      ]
    },
    quiz: {
      q1_text: '위도에 대한 설명으로 가장 알맞은 것은 무엇인가요?',
      q1_opts: [
        '① 본초 자오선을 기준으로 동/서를 나타낸다.',
        '② 적도를 기준으로 북/남의 각도를 나타낸다.',
        '③ 지도 눈금의 길이를 정해 놓은 비율이다.',
        '④ 산의 높낮이를 표현하는 선이다.'
      ],
      q2_text: '경도 0°의 기준이 되는 선은 무엇인가요?',
      q2_opts: [ '① 적도', '② 북회귀선', '③ 본초 자오선', '④ 국제 날짜변경선' ],
      q3_html: `위도는 <input class="inline-input" id="q3-1" type="text" placeholder="ㅈㄷ">를 기준으로,
                경도는 <input class="inline-input" id="q3-2" type="text" placeholder="ㅂㅊ ㅈㅇㅅ">을 기준으로 각도를 잰다.`,
      q4_html: `서울 도심 좌표는 대략 37° <input class="inline-input" id="q4-1" type="text" placeholder="N/북">,
                127° <input class="inline-input" id="q4-2" type="text" placeholder="E/동"> 로 표기할 수 있다.`,
      q3_1_ph: 'ㅈㄷ', q3_2_ph: 'ㅂㅊ ㅈㅇㅅ', q4_1_ph: 'N', q4_2_ph: 'E',
      q5_text: '왜 위도·경도 두 값이 함께 있어야 특정 위치를 정확히 찾을 수 있을까요? 자신의 말로 설명해 보세요.'
    },
    answerKey: { q1:'2', q2:'3', q3_1:['적도'], q3_2:['본초자오선','본초 자오선'], q4_1:['N','북','북위','north'], q4_2:['E','동','동경','east'] },
    essayKeywords: ['위도','경도','좌표','기준','한 점','정확','표시','교차'],
    explain: {
      q1:'해설: 위도는 적도를 기준으로 북/남의 각도를 나타낸다.',
      q2:'해설: 경도 0°는 본초 자오선이다.',
      q3:'해설: 위도 기준=적도, 경도 기준=본초 자오선.',
      q4:'해설: 서울은 북반구·동반구 → N, E 표기.',
      q5:'예시: 위도와 경도는 서로 수직인 기준이어서 두 값이 교차하는 “한 점”이 정확한 위치를 지정.'
    }
  },
});

/* ===============================
   ★ 어휘 빈칸 렌더러 & 탭 이벤트
=================================*/
function getCurrentUnit() {
  return (window.CUR_UNIT || 'geo_01');
}

window.renderVocabFill = function () {
  const unit = window.CUR_UNIT || 'geo_01';
  const pack = window.CONTENTS?.[unit];
  const root = document.getElementById('vocab-fill') 
            || document.querySelector('.vocab-fill-text');

  if (!root || !pack?.vocabFill?.items?.length) {
    console.warn('[vocab] root or items missing:', { root: !!root, unit, items: pack?.vocabFill?.items?.length });
    return;
  }

  const html = (pack.vocabFill.items || []).map(({ no, text, answer, initials }) => {
    const slot = `
      <span class="blank-wrap" data-answer="${answer}">
        <span class="blank-icon">${no}</span>
        <span class="blank-mark"></span>
        <input type="text" class="blank-input" placeholder="${initials || ''}">
      </span>
    `;
    const p = text.replace(/\(\s*[-＿—\u00A0]*\s*\)/, slot);
    return `<p>${p}</p>`;
  }).join('');

  root.innerHTML = `
    <div class="vocab-instruction">${pack.vocabFill.instructions || ''}</div>
    <div class="vocab-inline">${html}</div>
  `;

  (function ensureVocabInlineStyle(){
    if (document.getElementById('vocab-inline-style')) return;
    const st = document.createElement('style');
    st.id = 'vocab-inline-style';
    st.textContent = `
      /* vocab 영역에서만 줄글 처리 */
      .vocab-box .vocab-inline > p { display:inline !important; margin:0 !important; }
      .vocab-box .vocab-inline > p + p::before { content:" "; }

      #vocab-fill .vocab-inline > p,
      .vocab-fill-text .vocab-inline > p { display:inline !important; margin:0 !important; }
      #vocab-fill .vocab-inline > p + p::before,
      .vocab-fill-text .vocab-inline > p + p::before { content:" "; }

      /* 🔶 줄 간격 조정 */
      .vocab-inline { line-height: 5.0 !important; }
    `;
    document.head.appendChild(st);
  })();

  window.reportState = window.reportState || {};
  window.reportState.vocabTotal = pack.vocabFill.items.length;
};

function _bindTabEvents() {
  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('[data-tab]');
    if (!btn) return;
    const tab = btn.getAttribute('data-tab');
    if (tab === 'vocab') renderVocabFill();
  });
}

/* ===== 텍스트 주입 (HTML 구조/ids 유지) ===== */
function applyContentPack(unitKey) {
  const pack = window.CONTENTS[unitKey];
  if (!pack) return;

  const labelNoEl = document.querySelector('.passage-label strong');
  const titleEl   = document.querySelector('.passage-title');
  if (labelNoEl) labelNoEl.textContent = pack.labelNo;
  if (titleEl)   titleEl.innerHTML = pack.title;

  const passageBox = document.querySelector('.passage-text');
  if (passageBox) passageBox.innerHTML = pack.passage.map(p => `<p>${p}</p>`).join('');

  const vocabBox = document.querySelector('.passage-vocab ol');
  if (vocabBox)  vocabBox.innerHTML = pack.vocab.map(([w,d]) => `<li><b>${w}</b>: ${d}</li>`).join('');

  const blocks = Array.from(document.querySelectorAll('#tab-reading .quiz-block'));

  // Q1
  if (blocks[0]) {
    const q1Text = blocks[0].querySelector('.quiz-q');
    const q1Lis  = blocks[0].querySelectorAll('.quiz-options li');
    if (q1Text) q1Text.textContent = pack.quiz.q1_text;
    if (q1Lis.length === 4) {
      q1Lis.forEach((li,i)=> li.innerHTML = `<input type="radio" name="q1" value="${i+1}"> ${pack.quiz.q1_opts[i]}`);
    }
  }

  // Q2
  if (blocks[1]) {
    const q2Text = blocks[1].querySelector('.quiz-q');
    const q2Lis  = blocks[1].querySelectorAll('.quiz-options li');
    if (q2Text) q2Text.textContent = pack.quiz.q2_text;
    if (q2Lis.length === 4) {
      q2Lis.forEach((li,i)=> li.innerHTML = `<input type="radio" name="q2" value="${i+1}"> ${pack.quiz.q2_opts[i]}`);
    }
  }

  // Q3
  if (blocks[2]) {
    const q3P = blocks[2].querySelector('.quiz-q');
    if (q3P && pack.quiz.q3_html) q3P.innerHTML = pack.quiz.q3_html;
    const q3_1 = document.getElementById('q3-1');
    const q3_2 = document.getElementById('q3-2');
    if (q3_1 && pack.quiz.q3_1_ph) q3_1.placeholder = pack.quiz.q3_1_ph;
    if (q3_2 && pack.quiz.q3_2_ph) q3_2.placeholder = pack.quiz.q3_2_ph;
  }

  // Q4
  if (blocks[3]) {
    const q4P = blocks[3].querySelector('.quiz-q');
    if (q4P && pack.quiz.q4_html) q4P.innerHTML = pack.quiz.q4_html;
    const q4_1 = document.getElementById('q4-1');
    const q4_2 = document.getElementById('q4-2');
    if (q4_1 && pack.quiz.q4_1_ph) q4_1.placeholder = pack.quiz.q4_1_ph;
    if (q4_2 && pack.quiz.q4_2_ph) q4_2.placeholder = pack.quiz.q4_2_ph;
  }

  // Q5
  if (blocks[4]) {
    const q5Text = blocks[4].querySelector('.quiz-q');
    if (q5Text && pack.quiz.q5_text) q5Text.textContent = pack.quiz.q5_text;
  }
}

/* ==== 본문학습 상태 저장/복원 (✅ 학생별 분리 저장) ==== */

/* 🔐 현재 로그인 학생 정보 가져오기 */
function getCurrentStudentForReading() {
  const saved = localStorage.getItem('currentStudent');
  if (!saved) return null;
  try { return JSON.parse(saved); } catch (e) { return null; }
}

/* 🔐 학생키 만들기: 학년_이름_전화숫자 */
function buildStudentKeyForReading(stu) {
  const cleanPhone = (stu.phone || '').replace(/\D/g, '');
  const cleanName  = (stu.name  || '').trim();
  const cleanGrade = (stu.grade || '').trim();
  return `${cleanGrade}_${cleanName}_${cleanPhone}`;
}

/* 🔐 단원별 + 학생별 로컬스토리지 키 */
function getReadingStateKey(unit) {
  const stu = getCurrentStudentForReading();
  if (!stu) {
    // 로그인 안 되어 있으면 예전처럼 단원 단독 키 사용
    return `dan-reading-state:${unit}`;
  }
  const studentKey = buildStudentKeyForReading(stu);
  return `dan-reading-state:${studentKey}:${unit}`;
}

function saveReadingState() {
  try {
    const unit = window.CUR_UNIT || 'geo_01';
    const key  = getReadingStateKey(unit);   // ✅ 학생별 + 단원별 키

    const q1   = document.querySelector('input[name="q1"]:checked');
    const q2   = document.querySelector('input[name="q2"]:checked');
    const q3_1 = document.getElementById('q3-1');
    const q3_2 = document.getElementById('q3-2');
    const q4_1 = document.getElementById('q4-1');
    const q4_2 = document.getElementById('q4-2');
    const q5   = document.getElementById('q5');

    const state = {
      graded: true,
      q1:   q1   ? q1.value   : '',
      q2:   q2   ? q2.value   : '',
      q3_1: q3_1 ? q3_1.value : '',
      q3_2: q3_2 ? q3_2.value : '',
      q4_1: q4_1 ? q4_1.value : '',
      q4_2: q4_2 ? q4_2.value : '',
      q5:   q5   ? q5.value   : ''
    };

    localStorage.setItem(key, JSON.stringify(state));
  } catch (e) {
    console.warn('saveReadingState error', e);
  }
}

function loadReadingState() {
  try {
    const unit = window.CUR_UNIT || 'geo_01';
    const key  = getReadingStateKey(unit);   // ✅ 학생별 + 단원별 키
    const raw  = localStorage.getItem(key);
    if (!raw) return;

    const state = JSON.parse(raw);
    if (!state) return;

    if (state.q1) {
      const r1 = document.querySelector(`input[name="q1"][value="${state.q1}"]`);
      if (r1) r1.checked = true;
    }
    if (state.q2) {
      const r2 = document.querySelector(`input[name="q2"][value="${state.q2}"]`);
      if (r2) r2.checked = true;
    }

    const q3_1 = document.getElementById('q3-1');
    const q3_2 = document.getElementById('q3-2');
    const q4_1 = document.getElementById('q4-1');
    const q4_2 = document.getElementById('q4-2');
    const q5   = document.getElementById('q5');

    if (q3_1 && state.q3_1 !== undefined) q3_1.value = state.q3_1;
    if (q3_2 && state.q3_2 !== undefined) q3_2.value = state.q3_2;
    if (q4_1 && state.q4_1 !== undefined) q4_1.value = state.q4_1;
    if (q4_2 && state.q4_2 !== undefined) q4_2.value = state.q4_2;
    if (q5   && state.q5   !== undefined) q5.value   = state.q5;

    if (state.graded && typeof window.gradeQuiz === 'function') {
      setTimeout(() => {
        try { window.gradeQuiz(); } catch (e) {
          console.warn('auto re-grade reading error', e);
        }
      }, 0);
    }
  } catch (e) {
    console.warn('loadReadingState error', e);
  }
}

/* ===== 통합 채점기 ===== */
window.gradeQuiz = function () {
  const pack = window.CONTENTS[window.CUR_UNIT] || window.CONTENTS.geo_01;
  const A = pack.answerKey;
  const EX = pack.explain;

  const quizBlocks = document.querySelectorAll('#tab-reading .quiz-block');
  const numLabels = ["01","02","03","04","05"];
  quizBlocks.forEach((block, idx) => {
    const numEl = block.querySelector('.quiz-num');
    if (!numEl) return;
    let markEl = numEl.querySelector('.mark');
    if (!markEl) {
      markEl = document.createElement('div');
      markEl.className = 'mark';
      numEl.appendChild(markEl);
    }
    numEl.textContent = numLabels[idx];
    numEl.appendChild(markEl);
    numEl.classList.remove('correct','wrong');
    markEl.textContent = '';
  });

  let score = 0;
  const totalAuto = 4;
  const shortMsgs = [];
  const fullMsgs = [];

  function norm(s){ return (s||'').toString().replace(/\s+/g,'').toLowerCase(); }
  function mark(idx, ok, label, ex, isEssay=false){
    const num = quizBlocks[idx]?.querySelector('.quiz-num');
    const markEl = num?.querySelector('.mark');
    if (ok) {
      score++;
      num?.classList.add('correct');
      if(markEl) markEl.textContent='⭕';
      shortMsgs.push(`${label} 정답 ✅`);
      fullMsgs.push(`${label} 정답 ✅ ${ex||''}`);
    } else {
      num?.classList.add('wrong');
      if(markEl) markEl.textContent='✖';
      shortMsgs.push(`${label} ${isEssay?'서술형: ':''}오답 ❌`);
      fullMsgs.push(`${label} ${isEssay?'서술형: ':''}오답 ❌ ${ex||''}`);
    }
  }

  // 1
  const q1 = document.querySelector('input[name="q1"]:checked');
  const q1ok = (q1 && q1.value === A.q1);
  mark(0, q1ok, '①', EX.q1);

  // 2
  const q2 = document.querySelector('input[name="q2"]:checked');
  const q2ok = (q2 && q2.value === A.q2);
  mark(1, q2ok, '②', EX.q2);

  // 3
  const q3New = document.getElementById('q3');
  const q3Old1 = document.getElementById('q3-1');
  const q3Old2 = document.getElementById('q3-2');
  const q3Text1 = q3New ? q3New.value.trim() : (q3Old1?.value || '').trim();
  const q3Text2 = q3New ? '' : (q3Old2?.value || '').trim();
  const ok3_1 = A.q3_1.some(a => norm(a) === norm(q3Text1));
  const ok3_2 = A.q3_2 ? A.q3_2.some(a => norm(a) === norm(q3Text2)) : true;
  const q3ok = ok3_1 && ok3_2;
  mark(2, q3ok, '③', EX.q3);

  // 4
  const q4New = document.getElementById('q4');
  const q4Old1 = document.getElementById('q4-1');
  const q4Old2 = document.getElementById('q4-2');
  const q4Text1 = q4New ? q4New.value.trim() : (q4Old1?.value || '').trim();
  const q4Text2 = q4New ? '' : (q4Old2?.value || '').trim();
  const ok4_1 = A.q4_1.some(a => norm(a) === norm(q4Text1));
  const ok4_2 = A.q4_2 ? A.q4_2.some(a => norm(a) === norm(q4Text2)) : true;
  const q4ok = ok4_1 && ok4_2;
  mark(3, q4ok, '④', EX.q4);

  // 5 (서술형)
  const essay = (document.getElementById('q5')?.value || '').trim().toLowerCase();
  const keys = (pack.essayKeywords && Array.isArray(pack.essayKeywords) && pack.essayKeywords.length)
    ? pack.essayKeywords
    : ["등고선","간격","좁","넓","급경사","완만","경사"];
  let hit = 0;
  keys.forEach(k => { if (essay.includes(k)) hit++; });
  const q5ok = essay.length && hit >= 2;
  mark(4, q5ok, '⑤', EX.q5, true);

  const box = document.getElementById('grade-result');
  if (box) {
    box.style.display = 'block';
    box.innerHTML = `<p><strong>점수: ${score} / ${totalAuto}</strong></p>` + shortMsgs.map(m => `<p>${m}</p>`).join('');
  }
  window.fullResultHTML = `<p><strong>점수: ${score} / ${totalAuto}</strong></p>` + fullMsgs.map(m => `<p>${m}</p>`).join('');

  const g=document.getElementById('grade-btn');
  const r=document.getElementById('reset-btn');
  const s=document.getElementById('submit-btn');
  if (g) g.style.display='inline-block';
  if (r) r.style.display='inline-block';
  if (s) s.style.display='inline-block';

  window.reportState = window.reportState || {};
  window.reportState.q1ok=q1ok;
  window.reportState.q2ok=q2ok;
  window.reportState.q3ok=q3ok;
  window.reportState.q4ok=q4ok;
  window.reportState.q5ok=q5ok;

  if (typeof updateReportPanel==='function') {
    const lexicalRatio = (typeof window.reportState.vocabScoreRatio==='number') ? window.reportState.vocabScoreRatio : 0;
    const lexicalOk = lexicalRatio >= 0.7;
    updateReportPanel({
      q1ok,q2ok,q3ok,q4ok,q5ok,
      messages:[
        "① 핵심 이해력: " + (q1ok?"좋아요! ✅":"보완 필요 ❗"),
        "② 구조 파악력: " + (q2ok?"좋아요! ✅":"보완 필요 ❗"),
        "③ 어휘 맥락력: " + (lexicalOk?"좋아요! ✅":"어휘 복습 필요 ❗"),
        "④ 추론·통합력: " + (q4ok?"좋아요! ✅":"보완 필요 ❗"),
        "⑤ 비판·적용력: " + (q5ok?"좋아요! ✅":"보완 필요 ❗")
      ]
    });
  }

  // ✅ 레이더 점수 객체로 빼두기
  const radarScores = {
    literal:     q1ok ? 10 : 6,
    structural:  q2ok ? 10 : 6,
    lexical:     q3ok ? 10 : 6,
    inferential: q4ok ? 10 : 6,
    critical:    q5ok ? 10 : 6
  };

  // ✅ 화면 레이더 차트 그리기
  if (typeof drawRadarChart === 'function') {
    drawRadarChart(radarScores);
  }

  // ✅ 서버 로그용으로 보관
  window.reportState = window.reportState || {};
  window.reportState.radarScores = radarScores;

  if (typeof saveReadingState === 'function') {
    saveReadingState();
  }
};

/* === 정답·해설 패널 렌더러 === */
function renderSolutions(pack) {
  const A = pack.answerKey, EX = pack.explain;
  const q1Text = pack.quiz.q1_opts[Number(A.q1) - 1] || '';
  const q2Text = pack.quiz.q2_opts[Number(A.q2) - 1] || '';

  const anchor = document.getElementById('grade-result') || document.body;
  let box = document.getElementById('solutions-box');
  if (!box) {
    box = document.createElement('div');
    box.id = 'solutions-box';
    box.style.marginTop = '16px';
    box.style.background = '#fffaf3';
    box.style.border = '1px solid #e5d4c1';
    box.style.borderRadius = '12px';
    box.style.padding = '16px';
    box.style.lineHeight = '1.6';
    anchor.insertAdjacentElement('afterend', box);
  }

  box.innerHTML = `
    <h3 style="margin:0 0 10px; font-size:16px; color:#8b2f2f;">정답 · 해설</h3>
    <ol style="margin:0; padding-left:18px;">
      <li style="margin-bottom:8px;">
        <b>① 정답:</b> ${A.q1} — ${q1Text}<br>
        <span style="color:#6b5a48;">${EX.q1 || ''}</span>
      </li>
      <li style="margin-bottom:8px;">
        <b>② 정답:</b> ${A.q2} — ${q2Text}<br>
        <span style="color:#6b5a48;">${EX.q2 || ''}</span>
      </li>
      <li style="margin-bottom:8px;">
        <b>③ 정답(두 칸):</b> ${Array.isArray(A.q3_1)?A.q3_1[0]:A.q3_1} / ${Array.isArray(A.q3_2)?A.q3_2[0]:A.q3_2}<br>
        <span style="color:#6b5a48;">${EX.q3 || ''}</span>
      </li>
      <li style="margin-bottom:8px;">
        <b>④ 정답(두 칸):</b> ${Array.isArray(A.q4_1)?A.q4_1[0]:A.q4_1} / ${Array.isArray(A.q4_2)?A.q4_2[0]:A.q4_2}<br>
        <span style="color:#6b5a48;">${EX.q4 || ''}</span>
      </li>
      <li>
        <b>⑤ 서술형 예시:</b> <span style="color:#6b5a48;">${EX.q5 || '핵심어 2개 이상 포함 시 정답 처리'}</span>
      </li>
    </ol>
  `;
  box.style.display = 'block';
}

/* ========== 공통 진행도 매니저 (단일화 호환) ========== */
window.DanDan = window.DanDan || {};

(function () {
  if (window.DanDan.ProgressManager) return;

  function detectUnit() {
    let unitParam = new URLSearchParams(location.search).get('unit');
    if (!unitParam) {
      const m = location.pathname.match(/geo_(\d+)\.html/i);
      if (m) unitParam = `geo_${m[1].padStart(2, '0')}`;
    }
    return (unitParam || (window.CUR_UNIT || 'geo_01')).toLowerCase();
  }

  function buildPageKey() {
    const PAGE_GROUP = 'jeongjo_social';
    const CUR_UNIT   = detectUnit();
    return `${PAGE_GROUP}_${CUR_UNIT}`;
  }

  function buildStudentKey(stu) {
    const cleanPhone = (stu.phone || '').replace(/\D/g, '');
    const cleanName  = (stu.name  || '').trim();
    const cleanGrade = (stu.grade || '').trim();
    return `${cleanGrade}_${cleanName}_${cleanPhone}`;
  }

  function getCurrentStudent() {
    const saved = localStorage.getItem('currentStudent');
    if (!saved) return null;
    try { return JSON.parse(saved); } catch { return null; }
  }

  function readDoneList() {
    const stu = getCurrentStudent();
    if (!stu) return { key: null, list: [] };
    const skey = `dan-progress:${buildStudentKey(stu)}`;
    const list = JSON.parse(localStorage.getItem(skey) || '[]');
    return { key: skey, list };
  }

  function writeDoneList(list) {
    const stu = getCurrentStudent();
    if (!stu) return false;
    const skey = `dan-progress:${buildStudentKey(stu)}`;
    localStorage.setItem(skey, JSON.stringify(list));
    return true;
  }

 const ProgressManager = {
    getPageKey: buildPageKey,
    markComplete() {
      const pageKey = buildPageKey();
      const { list } = readDoneList();
      if (!list.includes(pageKey)) {
        list.push(pageKey);
        writeDoneList(list);
      }
      return pageKey;
    },
    isCompleted(pageKey) {
      const { list } = readDoneList();
      return list.includes(pageKey || buildPageKey());
    },
    getStudentProgress() {
      return readDoneList();
    }
  };

  window.DanDan.ProgressManager = ProgressManager;

  // 🔽 여기 부분만 잘 봐줘
  (function hookSubmitReport() {
    const original = window.submitReport;

    window.submitReport = async function (...args) {
      const stu = getCurrentStudent();
      if (!stu) {
        alert('로그인한 학생 정보가 없습니다. 먼저 로그인 해주세요.');
        return;
      }

      // 1) 원래 submitReport 로직 실행 (PDF 생성 등)
      if (typeof original === 'function') {
        await original.apply(this, args);
      } else if (typeof window.captureElementToPDF === 'function') {
        await captureElementToPDF(
          'capture-report',
          '단단국어_분석리포트.pdf',
          { withStudentInfo: true }
        );
      }

      // 2) 학습완료 플래그 저장
      const key = ProgressManager.markComplete();
      if (typeof window.showSubmitSuccess === 'function') {
        showSubmitSuccess('분석리포트');
      } else {
        alert(`학습완료 처리됨: ${key}`);
      }

      // 3) ✅ 여기서만 학습 이력 로그 전송
      if (typeof window.sendLearningLog === 'function') {
        try {
          await window.sendLearningLog();
        } catch (e) {
          console.warn('[submitReport] sendLearningLog 실패', e);
        }
      }
    };
  })();
})();

/* ===========================
 * ✅ 학습 이력 서버로 보내기 (테스트 버전)
 * =========================== */
window.sendLearningLog = async function () {
  try {
    const unit = window.CUR_UNIT || 'geo_02';

    // 1) localStorage 에서 현재 로그인 학생 가져오기
    let stu = null;
    try {
      const raw = localStorage.getItem('currentStudent');
      if (raw) stu = JSON.parse(raw);
    } catch (e) {
      console.warn('[sendLearningLog] currentStudent 파싱 실패', e);
    }

    if (!stu) {
      console.warn('[sendLearningLog] 학생 정보 없음 → 로그 전송 스킵');
      return;
    }

    // ✅ gradeQuiz 에서 저장해 둔 레이더 점수 꺼내기
    const radar =
      (window.reportState && window.reportState.radarScores)
      ? window.reportState.radarScores
      : null;

    const payload = {
      grade:  stu.grade  || '',
      name:   stu.name   || '',
      school: stu.school || '',
      series: 'BRAIN업',      // 필요하면 '정조편' 등으로 바꿔도 됨
      unit:   unit,
      radar:  radar        // ✅ 여기 추가!
    };

    console.log('[sendLearningLog] payload =', payload);

    const res = await fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    let data = {};
    try {
      data = await res.json();
    } catch (_) {
      data = {};
    }
    console.log('[sendLearningLog] result =', data);
  } catch (e) {
    console.warn('sendLearningLog outer error', e);
  }
};


/* ===== 로드 시 실행 + 버튼 타입 안전패치 ===== */
document.addEventListener('DOMContentLoaded', () => {
  // 1) 본문 내용 채우기
  applyContentPack(window.CUR_UNIT);

  // 2) 탭 이벤트 + 어휘 자동 렌더
  _bindTabEvents();
  if (location.hash.includes('어휘학습') || document.querySelector('#vocab-fill')) {
    renderVocabFill();
  }

  // 3) 버튼 type=button 통일
  ['grade-btn','reset-btn','submit-btn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.type = 'button';
  });

  // 4) 제출하기 = 채점 + 해설 표시 (한 번만 등록)
  const submitBtn = document.getElementById('submit-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      try {
        if (typeof window.gradeQuiz === 'function') {
          gradeQuiz();
        }
        const pack = window.CONTENTS[window.CUR_UNIT] || window.CONTENTS.geo_01;
        renderSolutions(pack);
      } catch (e) {
        console.warn('submit-btn handler error', e);
      }
    });
  }

  // 5) 지난번 채점/입력 상태 복원 (✅ 학생별로 분리된 키 기준)
  if (typeof loadReadingState === 'function') {
    loadReadingState();
  }

});

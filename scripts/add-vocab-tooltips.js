/**
 * 시즌2 창작도서 vocab-tip 자동 추가 스크립트
 * 사용: node scripts/add-vocab-tooltips.js
 */

const fs = require('fs');
const path = require('path');

const CREATIVE_BOOK_DIR = path.join(__dirname, '../public/creative-book');

// 각 시리즈별 어휘 목록 (단어: 뜻풀이)
const VOCAB_BY_SERIES = {
  // 고전문학
  classic: {
    '퇴기': '기생 일을 그만둔 여자',
    '절개': '옳다고 믿는 것을 끝까지 지키는 마음',
    '수청': '높은 관리의 시중을 드는 일',
    '암행어사': '몰래 지방을 다니며 관리를 감찰하는 벼슬',
    '백년가약': '평생 함께 살겠다는 약속, 결혼',
    '과거': '조선시대 관리를 뽑는 시험',
    '급제': '과거 시험에 합격함',
    '부사': '고을을 다스리는 관리',
    '규수': '집안에서 예절을 배우며 자란 처녀',
    '양반': '조선시대 귀족 신분',
    '천민': '가장 낮은 신분의 사람들',
    '오작교': '견우와 직녀가 만나는 다리, 이별의 장소',
    '광한루': '남원에 있는 유명한 누각',
    '관장': '고을의 최고 책임자인 관리',
    '벼슬': '나라에서 주는 공무원 직책',
    '도령': '양반집 미혼 남자를 부르는 말',
    '낭자': '결혼하지 않은 젊은 여자를 부르는 말',
    '맹세': '굳게 약속함',
    '의로운': '옳고 바른 것을 지키려는',
    '탐욕': '재물이나 권력을 지나치게 탐함'
  },

  // 지구과학
  earth: {
    '성운': '우주에 떠도는 가스와 먼지 구름',
    '원시 지구': '46억 년 전 막 태어난 지구',
    '미행성': '행성이 되기 전의 작은 천체',
    '마그마': '땅속에서 녹아 있는 뜨거운 암석',
    '지각': '지구의 가장 바깥 층',
    '맨틀': '지각 아래 두꺼운 암석층',
    '핵': '지구의 가장 안쪽 부분',
    '대기': '지구를 둘러싼 공기층',
    '수증기': '물이 기체 상태로 변한 것',
    '산소': '생물이 숨 쉬는 데 필요한 기체',
    '광합성': '식물이 빛으로 양분을 만드는 과정',
    '지진': '땅이 흔들리는 현상',
    '화산': '마그마가 분출하는 산',
    '판': '지각을 이루는 거대한 암석 조각',
    '대륙': '바다로 둘러싸인 넓은 땅덩어리',
    '해저': '바다 밑바닥',
    '화석': '옛날 생물의 흔적이 돌에 남은 것',
    '퇴적암': '모래나 진흙이 쌓여 굳어진 암석',
    '지층': '퇴적물이 층층이 쌓인 것',
    '풍화': '바위가 부서지는 현상',
    '침식': '물이나 바람이 땅을 깎는 것'
  },

  // 물리학
  physics: {
    '만유인력': '모든 물체가 서로 끌어당기는 힘',
    '중력': '지구가 물체를 끌어당기는 힘',
    '가속도': '속도가 변하는 정도',
    '관성': '물체가 현재 상태를 유지하려는 성질',
    '질량': '물체가 가진 물질의 양',
    '힘': '물체의 상태를 바꾸는 것',
    '운동': '위치가 변하는 것',
    '속도': '빠르기와 방향을 함께 나타낸 것',
    '속력': '단위 시간에 이동한 거리',
    '마찰력': '물체 사이에서 운동을 방해하는 힘',
    '에너지': '일을 할 수 있는 능력',
    '위치 에너지': '높은 곳에 있어서 가진 에너지',
    '운동 에너지': '움직이는 물체가 가진 에너지',
    '열에너지': '온도와 관련된 에너지',
    '전기': '전자의 흐름으로 생기는 에너지',
    '자기': '자석이 물체를 끌어당기는 성질',
    '파동': '에너지가 퍼져나가는 움직임',
    '진동': '같은 동작을 반복하는 움직임',
    '빛': '우리 눈에 보이는 전자기파',
    '소리': '공기의 진동으로 전달되는 파동',
    '반사': '파동이 부딪혀 되돌아오는 것',
    '굴절': '파동이 다른 물질로 들어갈 때 꺾이는 것',
    '전류': '전기가 흐르는 것',
    '전압': '전기를 흐르게 하는 힘',
    '저항': '전류의 흐름을 방해하는 정도'
  },

  // 지리
  geo: {
    '지도': '땅의 모습을 줄여서 그린 그림',
    '축척': '실제 거리를 지도에 줄인 비율',
    '방위': '동서남북의 방향',
    '등고선': '높이가 같은 곳을 이은 선',
    '위도': '적도에서 남북으로 떨어진 정도',
    '경도': '본초 자오선에서 동서로 떨어진 정도',
    '기후': '오랜 기간의 날씨 특성',
    '날씨': '짧은 시간의 대기 상태',
    '계절': '일 년을 나눈 네 시기',
    '지형': '땅의 생김새',
    '평야': '넓고 평평한 땅',
    '산맥': '산들이 길게 이어진 것',
    '하천': '땅 위를 흐르는 물줄기',
    '해안': '바다와 육지가 만나는 곳',
    '인구': '일정 지역에 사는 사람 수',
    '도시': '사람이 많이 모여 사는 곳',
    '촌락': '농사짓는 사람들이 모여 사는 마을',
    '교통': '사람이나 물건이 오가는 것',
    '무역': '나라 사이에 물건을 사고파는 것',
    '자원': '사람에게 쓸모 있는 자연물'
  },

  // 한국인물
  korperson: {
    '독립운동': '나라의 자유를 되찾기 위한 활동',
    '일제강점기': '일본이 우리나라를 지배하던 시기',
    '항일': '일본에 맞서 싸움',
    '순국': '나라를 위해 목숨을 바침',
    '의병': '나라를 지키려고 스스로 나선 군인',
    '계몽': '깨우쳐 알게 함',
    '민족': '같은 역사와 문화를 가진 사람들',
    '애국': '나라를 사랑함',
    '혁명': '사회를 크게 바꾸는 것',
    '선각자': '남보다 앞서 깨달은 사람',
    '헌신': '몸과 마음을 바쳐 힘씀',
    '업적': '이루어 낸 큰일',
    '유산': '후세에 남긴 것',
    '정신': '마음가짐이나 생각',
    '가치': '소중하게 여길 만한 것'
  },

  // 법
  law: {
    '헌법': '나라의 가장 높은 법',
    '법률': '국회에서 만든 규칙',
    '권리': '마땅히 누려야 할 것',
    '의무': '마땅히 해야 할 것',
    '자유': '스스로 결정하고 행동할 수 있는 것',
    '평등': '차별 없이 같게 대우받는 것',
    '인권': '사람이라면 누구나 가지는 권리',
    '민주주의': '국민이 주인인 정치',
    '선거': '대표를 뽑는 것',
    '투표': '의견을 표시하는 것',
    '국회': '법을 만드는 기관',
    '정부': '나라의 일을 맡아 하는 기관',
    '법원': '재판을 하는 기관',
    '재판': '옳고 그름을 가리는 것',
    '판결': '재판의 결론',
    '범죄': '법을 어기는 행위',
    '형벌': '죄를 지은 사람에게 주는 벌',
    '계약': '서로 약속을 정하는 것',
    '소유권': '물건을 가질 수 있는 권리',
    '공익': '많은 사람에게 이로운 것'
  },

  // 현대문학
  modern: {
    '시': '짧은 글로 감정을 표현한 것',
    '소설': '지어낸 이야기를 글로 쓴 것',
    '수필': '자유롭게 쓴 산문',
    '희곡': '연극으로 공연하려고 쓴 글',
    '운율': '시에서 느껴지는 리듬',
    '비유': '다른 것에 빗대어 표현함',
    '은유': '~은 ~이다 형식의 비유',
    '직유': '~처럼, ~같이를 써서 비유함',
    '상징': '어떤 뜻을 다른 것으로 나타냄',
    '주제': '글에서 말하고자 하는 중심 생각',
    '화자': '시에서 말하는 사람',
    '서술자': '소설에서 이야기를 전하는 사람',
    '배경': '이야기가 일어나는 때와 장소',
    '갈등': '마음속 대립이나 다툼',
    '심상': '마음속에 떠오르는 감각적 그림',
    '정서': '느끼는 기분이나 감정',
    '어조': '말하는 투나 태도',
    '문체': '글쓴이 특유의 표현 방식',
    '서정': '개인의 감정을 표현함',
    '서사': '사건을 시간 순서로 이야기함'
  },

  // 정치
  politics: {
    '정치': '공동체의 일을 결정하고 운영하는 것',
    '국가': '일정한 땅에 사는 사람들의 집단',
    '주권': '나라의 최고 결정권',
    '국민': '한 나라에 속한 사람',
    '시민': '도시에 사는 사람, 권리를 가진 사람',
    '민주주의': '국민이 주인인 정치',
    '독재': '한 사람이 모든 권력을 가진 정치',
    '삼권분립': '권력을 셋으로 나눈 것',
    '입법부': '법을 만드는 기관',
    '행정부': '법을 실행하는 기관',
    '사법부': '법을 적용하여 판단하는 기관',
    '정당': '비슷한 생각을 가진 사람들의 모임',
    '선거': '대표를 뽑는 것',
    '여론': '많은 사람의 의견',
    '언론': '뉴스를 전하는 곳',
    '외교': '다른 나라와 관계를 맺는 일',
    '국제기구': '여러 나라가 함께 만든 기관',
    '조약': '나라 사이의 약속',
    '분쟁': '의견이 달라 다투는 것',
    '평화': '전쟁이나 다툼이 없는 상태'
  },
  pol: {}, // politics와 같은 어휘 사용
  politic: {},

  // 사회
  social: {
    '사회': '사람들이 모여 사는 집단',
    '문화': '사람들의 생활 방식',
    '전통': '예로부터 내려오는 것',
    '관습': '오래된 습관',
    '제도': '사회를 운영하는 규칙',
    '경제': '재화와 서비스를 생산하고 소비하는 활동',
    '생산': '물건이나 서비스를 만드는 것',
    '소비': '물건이나 서비스를 사용하는 것',
    '시장': '물건을 사고파는 곳',
    '가격': '물건의 값',
    '노동': '일하여 가치를 만드는 것',
    '임금': '일한 대가로 받는 돈',
    '기업': '물건을 만들어 파는 조직',
    '세금': '나라에 내는 돈',
    '복지': '국민의 행복한 삶을 돕는 것',
    '불평등': '고르지 않고 차이가 남',
    '다양성': '여러 가지로 다름',
    '차별': '다르게 대우함',
    '인권': '사람이라면 누구나 가지는 권리',
    '환경': '생물을 둘러싼 자연과 조건'
  },

  // 세계문학
  worldlit: {
    '고전': '오래되어 가치 있는 작품',
    '신화': '신과 영웅에 관한 옛이야기',
    '전설': '옛날부터 전해 내려오는 이야기',
    '서사시': '영웅의 이야기를 노래한 긴 시',
    '비극': '슬픈 결말의 이야기',
    '희극': '웃기고 즐거운 이야기',
    '풍자': '웃음으로 잘못을 비판함',
    '우화': '동물을 통해 교훈을 주는 이야기',
    '로맨스': '사랑 이야기',
    '모험': '위험을 무릅쓴 여행',
    '영웅': '뛰어난 능력으로 사람을 돕는 사람',
    '운명': '정해진 것처럼 피할 수 없는 일',
    '성장': '몸과 마음이 커가는 것',
    '갈등': '마음속 대립이나 다툼',
    '화해': '다툼을 풀고 사이좋게 됨',
    '희생': '남을 위해 자신을 바침',
    '구원': '어려움에서 구해 냄',
    '교훈': '배울 점이나 가르침',
    '인류': '온 세상 사람들',
    '보편': '누구에게나 해당되는 것'
  },

  // 세계인물
  worldperson: {
    '업적': '이루어 낸 큰일',
    '발명': '새로운 것을 만들어 냄',
    '발견': '몰랐던 것을 찾아냄',
    '혁명': '사회를 크게 바꾸는 것',
    '이론': '현상을 설명하는 체계적인 생각',
    '사상': '세상을 보는 깊은 생각',
    '철학': '삶의 근본을 탐구하는 학문',
    '과학': '자연을 연구하는 학문',
    '예술': '아름다움을 표현하는 활동',
    '문학': '언어로 표현하는 예술',
    '음악': '소리로 표현하는 예술',
    '미술': '그림이나 조각으로 표현하는 예술',
    '인류': '온 세상 사람들',
    '공헌': '힘을 보태어 도움을 줌',
    '유산': '후세에 남긴 것',
    '영향': '다른 것에 작용을 미침',
    '선구자': '남보다 먼저 길을 연 사람',
    '천재': '뛰어난 재능을 가진 사람',
    '노력': '힘을 들여 애씀',
    '열정': '뜨겁게 좋아하는 마음'
  }
};

// politics/pol/politic는 politics 어휘 사용
VOCAB_BY_SERIES.pol = VOCAB_BY_SERIES.politics;
VOCAB_BY_SERIES.politic = VOCAB_BY_SERIES.politics;

// vocab-tip CSS 스타일
const VOCAB_TIP_CSS = `
    .vocab-tip {
      position: relative;
      color: #e67e22;
      border-bottom: 1px dotted #e67e22;
      cursor: help;
    }
    .vocab-tip::after {
      content: attr(data-meaning);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: #333;
      color: #fff;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 13px;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s;
      z-index: 100;
    }
    .vocab-tip:hover::after {
      opacity: 1;
    }
`;

function getSeriesName(filename) {
  // 파일명에서 시리즈명 추출 (예: classic01_season1.html -> classic)
  const match = filename.match(/^([a-z]+)/i);
  return match ? match[1].toLowerCase() : null;
}

function addVocabTipCSS(content) {
  // 이미 vocab-tip CSS가 있으면 건너뛰기
  if (content.includes('.vocab-tip')) {
    return content;
  }

  // </style> 태그 앞에 CSS 추가
  return content.replace('</style>', VOCAB_TIP_CSS + '\n  </style>');
}

function addVocabTips(content, vocabMap) {
  let modifiedContent = content;

  // 한글 범위 정규식
  const koreanChar = /[가-힣]/;

  // 긴 단어 먼저 처리 (역사상 → 사상 순서로 처리되도록)
  const sortedWords = Object.entries(vocabMap)
    .sort((a, b) => b[0].length - a[0].length);

  for (const [word, meaning] of sortedWords) {
    // 1글자 단어는 오탐이 많으므로 건너뛰기
    if (word.length < 2) {
      continue;
    }

    // 이미 vocab-tip으로 감싸진 경우 건너뛰기
    if (modifiedContent.includes(`">${word}</span>`)) {
      continue;
    }

    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // <p> 태그 내의 텍스트에서만 첫 번째 등장을 교체
    // HTML 태그 내부(속성)는 제외
    const regex = new RegExp(`(>[^<]*)(${escapedWord})([^<]*<)`, 'g');
    let replaced = false;

    modifiedContent = modifiedContent.replace(regex, (match, before, foundWord, after) => {
      if (replaced) return match;

      // vocab-tip이나 data-meaning 속성 안이면 건너뛰기
      if (before.includes('vocab-tip') || before.includes('data-meaning')) {
        return match;
      }

      // 단어 경계 체크: 앞이나 뒤에 한글이 있으면 건너뛰기
      // (역사상 → 사상 X, 자원봉사 → 자원 X)
      // 단, 뒤에 조사는 허용
      const charBefore = before.slice(-1);
      const charAfter = after.charAt(0);
      const isParticle = /^[을를이가은는에의로와과도만요다고며면서니나야라어아죠]$/.test(charAfter);

      if (koreanChar.test(charBefore)) {
        return match;
      }
      if (koreanChar.test(charAfter) && !isParticle) {
        return match;
      }

      replaced = true;
      return `${before}<span class="vocab-tip" data-meaning="${meaning}">${foundWord}</span>${after}`;
    });
  }

  return modifiedContent;
}

function processFile(filePath) {
  const filename = path.basename(filePath);
  const seriesName = getSeriesName(filename);

  if (!seriesName || !VOCAB_BY_SERIES[seriesName]) {
    console.log(`⚠️  ${filename}: 어휘 목록 없음 (${seriesName})`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // 이미 vocab-tip이 있으면 건너뛰기
  if (content.includes('class="vocab-tip"')) {
    console.log(`⏭️  ${filename}: 이미 vocab-tip 있음`);
    return false;
  }

  const vocabMap = VOCAB_BY_SERIES[seriesName];

  // CSS 추가
  content = addVocabTipCSS(content);

  // 어휘 툴팁 추가
  content = addVocabTips(content, vocabMap);

  // 파일 저장
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ ${filename}: vocab-tip 추가 완료`);

  return true;
}

function main() {
  // 시즌2 파일 목록 (숫자 없는 _season1.html)
  const files = fs.readdirSync(CREATIVE_BOOK_DIR)
    .filter(f => f.endsWith('_season1.html') && !f.match(/_season1_\d+\.html$/))
    .map(f => path.join(CREATIVE_BOOK_DIR, f));

  console.log(`\n📚 시즌2 창작도서 vocab-tip 추가 시작\n`);
  console.log(`총 ${files.length}개 파일 발견\n`);

  let processed = 0;
  let skipped = 0;

  for (const file of files) {
    if (processFile(file)) {
      processed++;
    } else {
      skipped++;
    }
  }

  console.log(`\n📊 결과: ${processed}개 처리, ${skipped}개 건너뜀\n`);
}

main();

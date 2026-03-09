const fs = require('fs');
const path = require('path');

// 세계인물 31~40 인물 정보
const PERSON_DATA = {
  '31': {
    name: '클레오파트라',
    title: '이집트의 마지막 여왕, 클레오파트라',
    problems: {
      literal: {
        title: '사실적 이해',
        problems: [
          { q: '클레오파트라가 다스린 나라는?', options: ['그리스', '로마', '이집트', '페르시아'], answer: 2, explanation: '클레오파트라는 이집트의 마지막 파라오(여왕)였습니다.' },
          { q: '클레오파트라가 동맹을 맺은 로마의 지도자가 아닌 사람은?', options: ['카이사르', '안토니우스', '아우구스투스', '옥타비아누스와는 적대'], answer: 2, explanation: '클레오파트라는 카이사르, 안토니우스와 동맹을 맺었습니다.' }
        ]
      },
      structural: {
        title: '구조적 이해',
        problems: [
          { q: '이 글의 전개 순서로 알맞은 것은?', options: ['즉위 → 로마와의 관계 → 최후', '최후 → 즉위 → 로마', '로마 → 최후 → 즉위', '즉위 → 최후 → 로마'], answer: 0, explanation: '즉위부터 로마와의 관계, 최후까지 시간순으로 전개됩니다.' },
          { q: '클레오파트라를 설명하는 방식은?', options: ['비판적 분석만', '지혜와 외교력 등 능력 강조', '외모만 강조', '단점만 나열'], answer: 1, explanation: '지혜, 언어 능력, 외교력 등 뛰어난 능력을 강조합니다.' }
        ]
      },
      lexical: {
        title: '어휘적 이해',
        problems: [
          { q: '"파라오"의 뜻으로 알맞은 것은?', options: ['군인', '고대 이집트의 왕', '신관', '상인'], answer: 1, explanation: '파라오는 고대 이집트의 왕을 뜻합니다.' },
          { q: '"외교"가 의미하는 것은?', options: ['전쟁하는 것', '나라 간의 관계를 맺고 협상하는 것', '무역하는 것', '여행하는 것'], answer: 1, explanation: '외교는 국가 간 관계를 다루는 활동입니다.' }
        ]
      },
      inferential: {
        title: '추론적 이해',
        problems: [
          { q: '클레오파트라가 로마 지도자들과 동맹을 맺은 이유는?', options: ['사랑 때문에만', '이집트를 지키기 위한 외교 전략', '로마에 가고 싶어서', '명령받아서'], answer: 1, explanation: '강대국 로마에 대항해 이집트를 지키기 위한 전략이었습니다.' },
          { q: '클레오파트라가 여러 언어를 할 수 있었던 것이 중요한 이유는?', options: ['여행하기 좋아서', '외교와 통치에 유리했기 때문에', '책을 읽으려고', '노래하려고'], answer: 1, explanation: '언어 능력은 외교와 통치에 큰 도움이 되었습니다.' }
        ]
      },
      critical: {
        title: '비판적 이해',
        problems: [
          { q: '클레오파트라의 삶에서 배울 수 있는 점은?', options: ['미모만 중요하다', '지혜와 외교력으로 나라를 지키려 했다', '전쟁만 해야 한다', '포기해야 한다'], answer: 1, explanation: '클레오파트라는 지혜와 능력으로 나라를 지키려 했습니다.' },
          { q: '이 글이 전하려는 메시지는?', options: ['이집트가 최고다', '지혜와 리더십의 가치', '로마가 나쁘다', '여왕이 되어야 한다'], answer: 1, explanation: '어려운 상황에서도 지혜로운 리더십의 가치를 전합니다.' }
        ]
      }
    }
  },
  '32': {
    name: '징기스칸',
    title: '세계 최대 제국을 세운 징기스칸',
    problems: {
      literal: {
        title: '사실적 이해',
        problems: [
          { q: '징기스칸이 세운 제국은?', options: ['로마 제국', '몽골 제국', '페르시아 제국', '오스만 제국'], answer: 1, explanation: '징기스칸은 역사상 가장 큰 몽골 제국을 세웠습니다.' },
          { q: '징기스칸의 본명은?', options: ['칸', '테무친', '쿠빌라이', '오고타이'], answer: 1, explanation: '징기스칸의 본명은 테무친입니다.' }
        ]
      },
      structural: {
        title: '구조적 이해',
        problems: [
          { q: '이 글의 구조로 알맞은 것은?', options: ['어린 시절 → 부족 통일 → 제국 건설 → 영향', '영향 → 어린 시절 → 통일', '제국 → 어린 시절 → 영향', '통일 → 영향 → 어린 시절'], answer: 0, explanation: '어린 시절부터 제국 건설, 영향까지 순서대로 전개됩니다.' },
          { q: '징기스칸의 업적을 설명하는 방식은?', options: ['비판만', '정복 범위와 제도 등 구체적 업적', '전쟁만 강조', '부정적 면만'], answer: 1, explanation: '정복 범위, 법률, 통신 체계 등 다양한 업적을 설명합니다.' }
        ]
      },
      lexical: {
        title: '어휘적 이해',
        problems: [
          { q: '"칸"의 뜻으로 알맞은 것은?', options: ['왕자', '유목민 국가의 군주 칭호', '장군', '상인'], answer: 1, explanation: '칸은 몽골과 튀르크 유목민의 군주 칭호입니다.' },
          { q: '"유목민"이 의미하는 것은?', options: ['농사짓는 사람', '가축을 몰고 이동하며 사는 사람', '도시에 사는 사람', '바다에서 사는 사람'], answer: 1, explanation: '유목민은 가축과 함께 이동하며 생활하는 사람들입니다.' }
        ]
      },
      inferential: {
        title: '추론적 이해',
        problems: [
          { q: '징기스칸이 거대한 제국을 세울 수 있었던 이유는?', options: ['운이 좋아서', '뛰어난 군사 전략과 조직력 때문에', '적이 약해서', '무기가 좋아서만'], answer: 1, explanation: '뛰어난 전략, 조직력, 리더십이 있었습니다.' },
          { q: '몽골 제국이 동서 교류에 미친 영향은?', options: ['교류 단절', '실크로드를 통한 문화 교류 촉진', '변화 없음', '전쟁만'], answer: 1, explanation: '안정된 통치로 동서양의 교류가 활발해졌습니다.' }
        ]
      },
      critical: {
        title: '비판적 이해',
        problems: [
          { q: '징기스칸의 삶에서 배울 수 있는 점은?', options: ['정복만 해야 한다', '비전과 조직력으로 큰 목표를 이룰 수 있다', '전쟁이 최고다', '유목만 해야 한다'], answer: 1, explanation: '큰 비전과 조직력의 중요성을 배울 수 있습니다.' },
          { q: '이 글이 전하려는 메시지는?', options: ['전쟁이 좋다', '리더십과 비전의 힘', '몽골이 최고다', '정복해야 한다'], answer: 1, explanation: '리더십과 비전으로 역사를 바꾼 이야기입니다.' }
        ]
      }
    }
  },
  '33': {
    name: '찰스 다윈',
    title: '진화론을 발견한 찰스 다윈',
    problems: {
      literal: {
        title: '사실적 이해',
        problems: [
          { q: '다윈이 발표한 이론은?', options: ['상대성 이론', '진화론', '만유인력', '지동설'], answer: 1, explanation: '다윈은 진화론을 발표했습니다.' },
          { q: '다윈이 탐험한 배의 이름은?', options: ['타이타닉', '비글호', '메이플라워', '산타마리아'], answer: 1, explanation: '다윈은 비글호를 타고 탐험했습니다.' }
        ]
      },
      structural: {
        title: '구조적 이해',
        problems: [
          { q: '이 글의 전개 방식으로 알맞은 것은?', options: ['어린 시절 → 비글호 탐험 → 진화론 발표 → 영향', '진화론 → 탐험 → 어린 시절', '영향 → 진화론 → 탐험', '탐험 → 영향 → 진화론'], answer: 0, explanation: '어린 시절부터 탐험, 진화론 발표까지 순서대로 전개됩니다.' },
          { q: '진화론을 설명하는 방식은?', options: ['비판만', '갈라파고스 핀치새 등 구체적 관찰 사례', '이론만 설명', '반대 의견만'], answer: 1, explanation: '갈라파고스 섬의 관찰 사례로 진화론을 설명합니다.' }
        ]
      },
      lexical: {
        title: '어휘적 이해',
        problems: [
          { q: '"진화"의 뜻으로 알맞은 것은?', options: ['변하지 않는 것', '생물이 오랜 시간에 걸쳐 변화하는 것', '빨라지는 것', '작아지는 것'], answer: 1, explanation: '진화는 생물이 세대를 거쳐 변화하는 것입니다.' },
          { q: '"자연선택"이 의미하는 것은?', options: ['인간이 선택하는 것', '환경에 적합한 개체가 살아남는 것', '자연이 아름다운 것', '선택하지 않는 것'], answer: 1, explanation: '자연선택은 환경에 적응한 개체가 살아남는 현상입니다.' }
        ]
      },
      inferential: {
        title: '추론적 이해',
        problems: [
          { q: '다윈이 비글호 탐험을 통해 깨달은 것은?', options: ['바다가 넓다', '다양한 환경에 맞춰 생물이 변화한다', '여행이 좋다', '배가 빠르다'], answer: 1, explanation: '서로 다른 환경의 생물 차이를 관찰하고 진화를 깨달았습니다.' },
          { q: '다윈이 진화론 발표를 오래 미룬 이유는?', options: ['게을러서', '기존 믿음에 반하는 이론이라 논쟁이 예상되어서', '시간이 없어서', '흥미가 없어서'], answer: 1, explanation: '종교적 믿음과 충돌할 것을 우려했습니다.' }
        ]
      },
      critical: {
        title: '비판적 이해',
        problems: [
          { q: '다윈의 삶에서 배울 수 있는 점은?', options: ['여행만 해야 한다', '관찰과 탐구로 진실을 발견할 수 있다', '남들 말을 따라야 한다', '빨리 발표해야 한다'], answer: 1, explanation: '꼼꼼한 관찰과 탐구의 중요성을 보여줍니다.' },
          { q: '이 글이 전하려는 메시지는?', options: ['진화론만 옳다', '과학적 탐구와 용기의 가치', '여행이 좋다', '배를 타야 한다'], answer: 1, explanation: '과학적 탐구 정신과 진실을 밝히는 용기의 가치입니다.' }
        ]
      }
    }
  },
  '34': {
    name: '코코 샤넬',
    title: '패션을 바꾼 여성, 코코 샤넬',
    problems: {
      literal: {
        title: '사실적 이해',
        problems: [
          { q: '코코 샤넬이 창시한 분야는?', options: ['요리', '패션', '음악', '미술'], answer: 1, explanation: '코코 샤넬은 현대 패션의 혁명을 일으켰습니다.' },
          { q: '샤넬의 대표적인 제품이 아닌 것은?', options: ['샤넬 No.5 향수', '리틀 블랙 드레스', '샤넬 슈트', '청바지'], answer: 3, explanation: '청바지는 샤넬의 대표 제품이 아닙니다.' }
        ]
      },
      structural: {
        title: '구조적 이해',
        problems: [
          { q: '이 글의 구조로 알맞은 것은?', options: ['어려운 어린 시절 → 디자이너로 성공 → 패션 혁명 → 영향', '성공 → 어린 시절 → 영향', '영향 → 성공 → 어린 시절', '혁명 → 어린 시절 → 성공'], answer: 0, explanation: '어려운 어린 시절부터 성공, 패션 혁명까지 전개됩니다.' },
          { q: '샤넬의 혁신을 설명하는 방식은?', options: ['비판만', '코르셋 탈피, 바지 등 구체적 변화', '가격만 언급', '부정적 면만'], answer: 1, explanation: '여성을 코르셋에서 해방한 구체적 변화를 설명합니다.' }
        ]
      },
      lexical: {
        title: '어휘적 이해',
        problems: [
          { q: '"혁명"의 뜻으로 알맞은 것은?', options: ['조금 바꾸는 것', '근본적으로 완전히 바꾸는 것', '그대로 두는 것', '되돌리는 것'], answer: 1, explanation: '혁명은 기존 것을 완전히 새롭게 바꾸는 것입니다.' },
          { q: '"실용적"이 의미하는 것은?', options: ['예쁘기만 한', '실제로 쓰기에 편리한', '비싼', '오래된'], answer: 1, explanation: '실용적은 실제 사용에 편리하고 유용한 것입니다.' }
        ]
      },
      inferential: {
        title: '추론적 이해',
        problems: [
          { q: '샤넬이 여성 패션을 바꾼 이유는?', options: ['돈을 벌려고만', '여성의 자유롭고 편한 삶을 위해', '남성처럼 보이려고', '유행을 따르려고'], answer: 1, explanation: '불편한 옷에서 여성을 해방시키려 했습니다.' },
          { q: '샤넬이 어려운 환경에서 성공한 이유는?', options: ['운이 좋아서', '재능과 끈기, 독창적인 생각 때문에', '부모가 도와줘서', '쉬운 일이어서'], answer: 1, explanation: '고아원 출신이지만 재능과 끈기로 성공했습니다.' }
        ]
      },
      critical: {
        title: '비판적 이해',
        problems: [
          { q: '샤넬의 삶에서 배울 수 있는 점은?', options: ['환경 탓만 해야 한다', '어려운 환경도 극복하고 자신만의 길을 갈 수 있다', '패션만 해야 한다', '부자여야 성공한다'], answer: 1, explanation: '어려운 환경을 극복하고 혁신을 이룬 삶입니다.' },
          { q: '이 글이 전하려는 메시지는?', options: ['패션이 최고다', '독창성과 끈기가 세상을 바꾼다', '프랑스가 좋다', '옷이 중요하다'], answer: 1, explanation: '독창적 생각과 끈기로 세상을 바꾼 이야기입니다.' }
        ]
      }
    }
  },
  '35': {
    name: '빌 게이츠',
    title: '컴퓨터 혁명을 이끈 빌 게이츠',
    problems: {
      literal: {
        title: '사실적 이해',
        problems: [
          { q: '빌 게이츠가 창업한 회사는?', options: ['애플', '마이크로소프트', '구글', '아마존'], answer: 1, explanation: '빌 게이츠는 마이크로소프트를 창업했습니다.' },
          { q: '빌 게이츠가 만든 대표적인 제품은?', options: ['아이폰', '윈도우', '맥북', '구글 검색'], answer: 1, explanation: '윈도우는 마이크로소프트의 대표 운영체제입니다.' }
        ]
      },
      structural: {
        title: '구조적 이해',
        problems: [
          { q: '이 글의 전개 방식으로 알맞은 것은?', options: ['어린 시절 → 창업 → 성공 → 자선 활동', '자선 → 창업 → 어린 시절', '성공 → 어린 시절 → 자선', '창업 → 자선 → 성공'], answer: 0, explanation: '어린 시절부터 창업, 성공, 자선까지 순서대로 전개됩니다.' },
          { q: '빌 게이츠의 업적을 설명하는 방식은?', options: ['비판만', '윈도우 개발과 자선 활동 등 구체적 업적', '돈만 강조', '부정적 면만'], answer: 1, explanation: '컴퓨터 혁명과 자선 활동 등 다양한 업적을 설명합니다.' }
        ]
      },
      lexical: {
        title: '어휘적 이해',
        problems: [
          { q: '"운영체제"의 뜻으로 알맞은 것은?', options: ['게임 프로그램', '컴퓨터를 작동시키는 기본 프로그램', '인터넷', '하드웨어'], answer: 1, explanation: '운영체제는 컴퓨터의 기본 작동을 관리하는 프로그램입니다.' },
          { q: '"자선"이 의미하는 것은?', options: ['돈을 버는 것', '어려운 사람들을 돕는 것', '투자하는 것', '저축하는 것'], answer: 1, explanation: '자선은 어려운 이웃을 돕는 활동입니다.' }
        ]
      },
      inferential: {
        title: '추론적 이해',
        problems: [
          { q: '빌 게이츠가 대학을 중퇴하고 창업한 이유는?', options: ['공부가 싫어서', '컴퓨터 산업의 기회를 놓치지 않으려고', '돈이 없어서', '친구 때문에'], answer: 1, explanation: '새로운 산업의 기회를 빨리 잡기 위해서였습니다.' },
          { q: '빌 게이츠가 재산을 기부하는 이유는?', options: ['세금 때문에', '사회에 환원하고 인류 문제 해결에 기여하려고', '명예 때문에', '법 때문에'], answer: 1, explanation: '번 돈을 사회에 환원하려는 철학이 있습니다.' }
        ]
      },
      critical: {
        title: '비판적 이해',
        problems: [
          { q: '빌 게이츠의 삶에서 배울 수 있는 점은?', options: ['돈만 벌면 된다', '성공 후 사회에 기여하는 것이 중요하다', '대학을 그만둬야 한다', '컴퓨터만 해야 한다'], answer: 1, explanation: '성공과 함께 사회 공헌의 가치를 보여줍니다.' },
          { q: '이 글이 전하려는 메시지는?', options: ['컴퓨터가 최고다', '혁신과 나눔의 가치', '돈이 중요하다', '미국이 좋다'], answer: 1, explanation: '기술 혁신과 사회 환원의 가치를 전합니다.' }
        ]
      }
    }
  },
  '36': {
    name: '마이클 조던',
    title: '농구의 신, 마이클 조던',
    problems: {
      literal: {
        title: '사실적 이해',
        problems: [
          { q: '마이클 조던이 활약한 스포츠는?', options: ['야구', '축구', '농구', '테니스'], answer: 2, explanation: '마이클 조던은 NBA 농구 선수입니다.' },
          { q: '조던이 소속된 대표 팀은?', options: ['LA 레이커스', '시카고 불스', '보스턴 셀틱스', '마이애미 히트'], answer: 1, explanation: '조던은 시카고 불스에서 전성기를 보냈습니다.' }
        ]
      },
      structural: {
        title: '구조적 이해',
        problems: [
          { q: '이 글의 구조로 알맞은 것은?', options: ['어린 시절 → 고교 탈락 → NBA 성공 → 레전드', '성공 → 어린 시절 → 탈락', '레전드 → 성공 → 어린 시절', '탈락 → 레전드 → 성공'], answer: 0, explanation: '어린 시절 좌절부터 성공, 레전드가 되기까지 전개됩니다.' },
          { q: '조던의 성공을 설명하는 방식은?', options: ['재능만 강조', '노력과 극복 과정을 구체적으로 설명', '운만 강조', '팀만 강조'], answer: 1, explanation: '고교 팀 탈락을 극복한 노력을 강조합니다.' }
        ]
      },
      lexical: {
        title: '어휘적 이해',
        problems: [
          { q: '"레전드"의 뜻으로 알맞은 것은?', options: ['초보자', '전설적인 인물', '평범한 사람', '실패한 사람'], answer: 1, explanation: '레전드는 해당 분야에서 전설적인 존재입니다.' },
          { q: '"MVP"가 의미하는 것은?', options: ['가장 비싼 선수', '가장 가치 있는 선수', '가장 키 큰 선수', '가장 빠른 선수'], answer: 1, explanation: 'MVP는 Most Valuable Player, 최우수 선수입니다.' }
        ]
      },
      inferential: {
        title: '추론적 이해',
        problems: [
          { q: '조던이 고교 팀 탈락 후 성공할 수 있었던 이유는?', options: ['운이 좋아서', '좌절을 딛고 더 열심히 노력했기 때문에', '코치가 바뀌어서', '키가 갑자기 커서'], answer: 1, explanation: '실패를 동기로 삼아 더 열심히 연습했습니다.' },
          { q: '조던이 "나는 수천 번 실패했다"고 말한 의미는?', options: ['실력이 없다', '실패를 통해 성장했다', '농구를 그만둬야 한다', '슬프다'], answer: 1, explanation: '실패가 성공의 밑거름이 됨을 강조한 말입니다.' }
        ]
      },
      critical: {
        title: '비판적 이해',
        problems: [
          { q: '조던의 삶에서 배울 수 있는 점은?', options: ['재능만 있으면 된다', '실패를 두려워하지 않고 노력하면 성공한다', '포기해야 한다', '농구만 해야 한다'], answer: 1, explanation: '실패를 극복하는 노력의 중요성을 보여줍니다.' },
          { q: '이 글이 전하려는 메시지는?', options: ['농구가 최고다', '끈기와 노력이 꿈을 이루게 한다', '키가 중요하다', '미국이 좋다'], answer: 1, explanation: '좌절을 극복하는 끈기와 노력의 가치입니다.' }
        ]
      }
    }
  },
  '37': {
    name: '아서왕',
    title: '전설의 왕, 아서왕',
    problems: {
      literal: {
        title: '사실적 이해',
        problems: [
          { q: '아서왕이 뽑았다고 전해지는 것은?', options: ['금화', '바위에 박힌 검(엑스칼리버)', '보석', '왕관'], answer: 1, explanation: '아서왕은 바위에서 검을 뽑아 왕이 되었다고 전해집니다.' },
          { q: '아서왕의 기사단 이름은?', options: ['템플 기사단', '원탁의 기사', '십자군', '검은 기사단'], answer: 1, explanation: '아서왕의 기사들은 원탁의 기사라 불립니다.' }
        ]
      },
      structural: {
        title: '구조적 이해',
        problems: [
          { q: '이 글의 구조로 알맞은 것은?', options: ['출생의 비밀 → 검을 뽑음 → 왕국 통치 → 전설', '전설 → 출생 → 검', '통치 → 전설 → 출생', '검 → 통치 → 출생'], answer: 0, explanation: '출생부터 왕이 되고 전설이 되기까지 전개됩니다.' },
          { q: '아서왕 이야기를 설명하는 방식은?', options: ['역사적 사실만', '전설과 상징적 의미 설명', '비판만', '부정적 면만'], answer: 1, explanation: '전설의 내용과 상징적 의미를 설명합니다.' }
        ]
      },
      lexical: {
        title: '어휘적 이해',
        problems: [
          { q: '"전설"의 뜻으로 알맞은 것은?', options: ['역사적 사실', '옛날부터 전해오는 이야기', '최근 일어난 일', '과학적 사실'], answer: 1, explanation: '전설은 오래전부터 전해 내려오는 이야기입니다.' },
          { q: '"기사도"가 의미하는 것은?', options: ['싸우는 기술', '기사가 지켜야 할 용기, 명예, 정의의 정신', '말 타는 기술', '검술'], answer: 1, explanation: '기사도는 용기, 명예, 정의를 중시하는 정신입니다.' }
        ]
      },
      inferential: {
        title: '추론적 이해',
        problems: [
          { q: '원탁이 둥근 이유로 추측할 수 있는 것은?', options: ['공간이 좁아서', '모든 기사가 평등하다는 의미', '예뻐서', '전통이어서'], answer: 1, explanation: '둥근 탁자는 상석이 없어 평등을 상징합니다.' },
          { q: '아서왕 전설이 오랫동안 사랑받는 이유는?', options: ['실화여서', '정의, 용기, 충성 등 보편적 가치를 담고 있어서', '영국 이야기여서', '검이 나와서'], answer: 1, explanation: '정의와 용기 같은 보편적 가치가 담겨 있습니다.' }
        ]
      },
      critical: {
        title: '비판적 이해',
        problems: [
          { q: '아서왕 이야기에서 배울 수 있는 점은?', options: ['검이 중요하다', '정의와 용기, 리더십의 가치', '왕이 되어야 한다', '전쟁을 해야 한다'], answer: 1, explanation: '정의, 용기, 진정한 리더십의 가치를 담고 있습니다.' },
          { q: '이 글이 전하려는 메시지는?', options: ['영국이 최고다', '이상적인 리더십과 정의의 가치', '검술이 중요하다', '전설은 거짓이다'], answer: 1, explanation: '정의로운 리더십의 이상을 전하는 전설입니다.' }
        ]
      }
    }
  },
  '38': {
    name: '투탕카멘',
    title: '황금 마스크의 주인, 투탕카멘',
    problems: {
      literal: {
        title: '사실적 이해',
        problems: [
          { q: '투탕카멘이 파라오가 된 나이는?', options: ['5살', '9살', '15살', '20살'], answer: 1, explanation: '투탕카멘은 약 9살에 파라오가 되었습니다.' },
          { q: '투탕카멘의 무덤을 발견한 사람은?', options: ['나폴레옹', '하워드 카터', '콜럼버스', '다윈'], answer: 1, explanation: '1922년 하워드 카터가 무덤을 발견했습니다.' }
        ]
      },
      structural: {
        title: '구조적 이해',
        problems: [
          { q: '이 글의 구조로 알맞은 것은?', options: ['투탕카멘의 생애 → 죽음 → 무덤 발견 → 의의', '발견 → 생애 → 죽음', '의의 → 발견 → 생애', '죽음 → 의의 → 발견'], answer: 0, explanation: '생애부터 무덤 발견, 의의까지 순서대로 전개됩니다.' },
          { q: '투탕카멘의 무덤을 설명하는 방식은?', options: ['비판만', '황금 마스크 등 유물의 화려함 묘사', '부정적 면만', '가격만'], answer: 1, explanation: '황금 마스크 등 화려한 유물을 설명합니다.' }
        ]
      },
      lexical: {
        title: '어휘적 이해',
        problems: [
          { q: '"미라"의 뜻으로 알맞은 것은?', options: ['살아있는 왕', '방부 처리하여 보존된 시신', '동상', '그림'], answer: 1, explanation: '미라는 방부 처리로 보존된 시신입니다.' },
          { q: '"고고학"이 의미하는 것은?', options: ['미래를 연구하는 학문', '옛 유물과 유적을 연구하는 학문', '별을 연구하는 학문', '생물을 연구하는 학문'], answer: 1, explanation: '고고학은 과거의 유물과 유적을 연구합니다.' }
        ]
      },
      inferential: {
        title: '추론적 이해',
        problems: [
          { q: '투탕카멘의 무덤이 중요한 이유는?', options: ['금이 많아서', '도굴되지 않아 고대 이집트 문화를 온전히 보여주기 때문에', '크기 때문에', '위치 때문에'], answer: 1, explanation: '도굴되지 않은 채 발견되어 연구 가치가 높습니다.' },
          { q: '투탕카멘이 어린 나이에 죽은 이유로 추측되는 것은?', options: ['사고', '질병이나 유전적 문제', '전쟁', '노환'], answer: 1, explanation: '질병이나 유전적 문제로 추측됩니다.' }
        ]
      },
      critical: {
        title: '비판적 이해',
        problems: [
          { q: '투탕카멘의 이야기에서 배울 수 있는 점은?', options: ['금이 중요하다', '역사 연구의 가치와 과거 문명의 지혜', '어린 왕은 안 된다', '이집트만 좋다'], answer: 1, explanation: '고대 문명 연구의 가치를 알 수 있습니다.' },
          { q: '이 글이 전하려는 메시지는?', options: ['이집트가 최고다', '역사와 고고학 연구의 중요성', '황금이 중요하다', '무덤이 좋다'], answer: 1, explanation: '과거 문명 연구의 중요성과 가치를 전합니다.' }
        ]
      }
    }
  },
  '39': {
    name: '갈릴레오 갈릴레이',
    title: '지동설의 아버지, 갈릴레오 갈릴레이',
    problems: {
      literal: {
        title: '사실적 이해',
        problems: [
          { q: '갈릴레오가 주장한 것은?', options: ['천동설', '지동설', '진화론', '상대성이론'], answer: 1, explanation: '갈릴레오는 지구가 태양 주위를 돈다는 지동설을 주장했습니다.' },
          { q: '갈릴레오가 개량한 도구는?', options: ['현미경', '망원경', '나침반', '시계'], answer: 1, explanation: '갈릴레오는 망원경을 개량하여 천체를 관측했습니다.' }
        ]
      },
      structural: {
        title: '구조적 이해',
        problems: [
          { q: '이 글의 전개 방식으로 알맞은 것은?', options: ['어린 시절 → 발견 → 종교재판 → 명예회복', '명예회복 → 발견 → 어린 시절', '종교재판 → 명예회복 → 발견', '발견 → 어린 시절 → 종교재판'], answer: 0, explanation: '어린 시절부터 발견, 재판, 명예회복까지 전개됩니다.' },
          { q: '갈릴레오의 업적을 설명하는 방식은?', options: ['비판만', '망원경 관측과 지동설 증거 제시', '종교적 해석만', '부정적 면만'], answer: 1, explanation: '망원경으로 관측한 증거로 업적을 설명합니다.' }
        ]
      },
      lexical: {
        title: '어휘적 이해',
        problems: [
          { q: '"지동설"의 뜻으로 알맞은 것은?', options: ['지구가 우주의 중심이라는 설', '지구가 태양 주위를 돈다는 설', '달이 중심이라는 설', '해가 움직인다는 설'], answer: 1, explanation: '지동설은 지구가 태양 주위를 돈다는 이론입니다.' },
          { q: '"진리"가 의미하는 것은?', options: ['거짓', '변하지 않는 올바른 사실', '의견', '추측'], answer: 1, explanation: '진리는 참되고 변하지 않는 사실입니다.' }
        ]
      },
      inferential: {
        title: '추론적 이해',
        problems: [
          { q: '갈릴레오가 종교재판을 받은 이유는?', options: ['범죄를 저질러서', '당시 교회의 가르침에 반하는 주장을 해서', '돈 때문에', '왕을 비판해서'], answer: 1, explanation: '지동설이 당시 교회의 천동설과 충돌했기 때문입니다.' },
          { q: '"그래도 지구는 돈다"라고 말했다고 전해지는 의미는?', options: ['지구가 진짜 돈다', '진리는 권력으로 막을 수 없다', '포기했다', '농담이다'], answer: 1, explanation: '진리에 대한 신념을 포기하지 않았다는 의미입니다.' }
        ]
      },
      critical: {
        title: '비판적 이해',
        problems: [
          { q: '갈릴레오의 삶에서 배울 수 있는 점은?', options: ['권력에 굴복해야 한다', '진리를 위해 용기 있게 나서야 한다', '과학을 하면 안 된다', '교회 말만 들어야 한다'], answer: 1, explanation: '진리를 향한 용기와 신념의 중요성을 보여줍니다.' },
          { q: '이 글이 전하려는 메시지는?', options: ['종교가 나쁘다', '과학적 탐구와 진리를 향한 용기', '이탈리아가 좋다', '망원경이 중요하다'], answer: 1, explanation: '과학적 진리를 향한 탐구와 용기의 가치입니다.' }
        ]
      }
    }
  },
  '40': {
    name: '니콜라 테슬라',
    title: '전기의 마법사, 니콜라 테슬라',
    problems: {
      literal: {
        title: '사실적 이해',
        problems: [
          { q: '테슬라가 개발한 전기 시스템은?', options: ['직류(DC)', '교류(AC)', '태양열', '원자력'], answer: 1, explanation: '테슬라는 교류(AC) 전기 시스템을 개발했습니다.' },
          { q: '테슬라와 전기 전쟁을 벌인 사람은?', options: ['아인슈타인', '에디슨', '벨', '라이트 형제'], answer: 1, explanation: '테슬라는 에디슨과 직류 vs 교류 전쟁을 벌였습니다.' }
        ]
      },
      structural: {
        title: '구조적 이해',
        problems: [
          { q: '이 글의 구조로 알맞은 것은?', options: ['어린 시절 → 발명 활동 → 에디슨과의 경쟁 → 업적', '업적 → 어린 시절 → 경쟁', '경쟁 → 업적 → 어린 시절', '발명 → 어린 시절 → 업적'], answer: 0, explanation: '어린 시절부터 발명, 경쟁, 업적까지 전개됩니다.' },
          { q: '테슬라의 천재성을 설명하는 방식은?', options: ['비판만', '수많은 발명과 아이디어 나열', '에디슨만 강조', '부정적 면만'], answer: 1, explanation: '교류 시스템 등 수많은 발명으로 천재성을 설명합니다.' }
        ]
      },
      lexical: {
        title: '어휘적 이해',
        problems: [
          { q: '"교류(AC)"의 뜻으로 알맞은 것은?', options: ['한 방향으로 흐르는 전기', '방향이 주기적으로 바뀌는 전기', '전기가 없는 것', '태양 에너지'], answer: 1, explanation: '교류는 전류의 방향이 주기적으로 바뀌는 전기입니다.' },
          { q: '"천재"가 의미하는 것은?', options: ['보통 사람', '뛰어난 재능을 가진 사람', '노력하는 사람', '운 좋은 사람'], answer: 1, explanation: '천재는 탁월한 재능을 가진 사람입니다.' }
        ]
      },
      inferential: {
        title: '추론적 이해',
        problems: [
          { q: '테슬라의 교류 시스템이 현재 사용되는 이유는?', options: ['테슬라가 유명해서', '먼 거리 전송에 효율적이기 때문에', '에디슨이 포기해서', '싸서'], answer: 1, explanation: '교류는 장거리 전송에 효율적입니다.' },
          { q: '테슬라가 생전에 충분히 인정받지 못한 이유는?', options: ['발명을 안 해서', '시대를 앞서간 아이디어와 사업 능력 부족', '외국인이어서', '발명이 별로여서'], answer: 1, explanation: '뛰어난 발명가였지만 사업적 성공은 거두지 못했습니다.' }
        ]
      },
      critical: {
        title: '비판적 이해',
        problems: [
          { q: '테슬라의 삶에서 배울 수 있는 점은?', options: ['돈이 가장 중요하다', '창의적 아이디어가 세상을 바꾼다', '경쟁에서 져야 한다', '혼자만 해야 한다'], answer: 1, explanation: '창의적 발명이 인류에 공헌할 수 있음을 보여줍니다.' },
          { q: '이 글이 전하려는 메시지는?', options: ['전기가 최고다', '창의성과 혁신의 가치', '에디슨이 나쁘다', '돈이 중요하다'], answer: 1, explanation: '창의적 발명과 혁신이 인류를 발전시킵니다.' }
        ]
      }
    }
  }
};

// learning-common.js 로드 전에 REMEDIAL_BANK 삽입
for (let i = 31; i <= 40; i++) {
  const num = String(i).padStart(2, '0');
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'person', `people2_${num}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // 이미 REMEDIAL_BANK가 있는지 확인
  if (content.includes('window.REMEDIAL_BANK')) {
    console.log(`[SKIP] people2_${num} 이미 REMEDIAL_BANK 존재`);
    continue;
  }

  const personData = PERSON_DATA[num];
  if (!personData) {
    console.log(`[SKIP] people2_${num} 인물 데이터 없음`);
    continue;
  }

  // learning-common.js 로드 패턴 찾기
  const learningCommonPattern = /(<script src="\/assets\/js\/learning-common\.js[^"]*"><\/script>)/;
  const match = content.match(learningCommonPattern);

  if (!match) {
    console.log(`[SKIP] people2_${num} learning-common.js 패턴 없음`);
    continue;
  }

  // REMEDIAL_BANK 데이터 생성
  const remedialScript = `<!-- ✅ 보완학습 데이터 (learning-common.js 로드 전에 정의) -->
<script>
window.REMEDIAL_BANK = ${JSON.stringify(personData.problems, null, 2)};
</script>

${match[0]}`;

  content = content.replace(learningCommonPattern, remedialScript);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`[OK] people2_${num} (${personData.name}) REMEDIAL_BANK 삽입 완료`);
}

console.log('\n✅ people2_31~40 보완학습 데이터 삽입 완료!');

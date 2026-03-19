// 수능 필수 어휘 데이터
// 총 1000개 어휘 (100개씩 10세트)
// 생성일: 2026-03-19

const SUNEUNG_VOCAB_DATA = [
  // ===== 1~100번 어휘 =====
  {
    word: '경외',
    question: '<span class="word-highlight">경외</span>의 뜻은?',
    hint: '공경하고 두려워함',
    choices: ['무시하다', '공경하고 두려워하다', '싫어하다', '버리다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"경외"는 공경하면서도 두려워하는 마음을 의미합니다.',
    example: '예문: 그는 자연의 위대함에 경외심을 느꼈다.'
  },
  {
    word: '고취',
    question: '<span class="word-highlight">고취</span>의 뜻은?',
    hint: '정신이나 기운을 북돋움',
    choices: ['억누르다', '북돋아 일으키다', '숨기다', '없애다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"고취"는 정신이나 사기를 북돋아 일으키는 것을 의미합니다.',
    example: '예문: 애국심을 고취하는 연설이었다.'
  },
  {
    word: '고찰',
    question: '<span class="word-highlight">고찰</span>의 뜻은?',
    hint: '깊이 생각하고 조사함',
    choices: ['대충 보다', '깊이 생각하여 살피다', '무시하다', '잊어버리다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"고찰"은 어떤 것을 깊이 생각하고 조사하여 살피는 것을 의미합니다.',
    example: '예문: 이 문제에 대한 심도 있는 고찰이 필요하다.'
  },
  {
    word: '관조',
    question: '<span class="word-highlight">관조</span>의 뜻은?',
    hint: '고요히 바라봄',
    choices: ['적극적으로 참여하다', '고요한 마음으로 바라보다', '외면하다', '비판하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"관조"는 고요한 마음으로 사물이나 현상을 바라보는 것을 의미합니다.',
    example: '예문: 그는 세상을 관조하는 자세로 살았다.'
  },
  {
    word: '구축',
    question: '<span class="word-highlight">구축</span>의 뜻은?',
    hint: '기초를 닦아 세움',
    choices: ['허물다', '쌓아 올려 만들다', '버리다', '감추다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"구축"은 토대나 기초를 닦아 세우는 것을 의미합니다.',
    example: '예문: 신뢰 관계를 구축하는 데 오랜 시간이 걸렸다.'
  },
  {
    word: '귀결',
    question: '<span class="word-highlight">귀결</span>의 뜻은?',
    hint: '결국 어떤 결론에 이름',
    choices: ['시작하다', '결국 어떤 결론에 이르다', '돌아가다', '멀어지다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"귀결"은 논의나 사건이 결국 어떤 결론에 이르는 것을 의미합니다.',
    example: '예문: 모든 논쟁은 결국 이 문제로 귀결된다.'
  },
  {
    word: '귀납',
    question: '<span class="word-highlight">귀납</span>의 뜻은?',
    hint: '개별 사실에서 일반 원리를 이끌어 냄',
    choices: ['일반에서 개별로', '개별에서 일반으로', '위에서 아래로', '안에서 밖으로'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"귀납"은 개별적인 사실들로부터 일반적인 원리를 이끌어 내는 추론 방법입니다.',
    example: '예문: 귀납적 방법으로 결론을 도출했다.'
  },
  {
    word: '규명',
    question: '<span class="word-highlight">규명</span>의 뜻은?',
    hint: '자세히 따져 밝힘',
    choices: ['숨기다', '자세히 따져 밝히다', '무시하다', '회피하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"규명"은 사실이나 진상을 자세히 따져서 밝히는 것을 의미합니다.',
    example: '예문: 사고 원인을 규명하기 위한 조사가 진행 중이다.'
  },
  {
    word: '기저',
    question: '<span class="word-highlight">기저</span>의 뜻은?',
    hint: '사물의 밑바탕',
    choices: ['표면', '밑바탕', '꼭대기', '가장자리'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"기저"는 사물의 밑바탕이나 기초가 되는 부분을 의미합니다.',
    example: '예문: 이 현상의 기저에는 경제적 요인이 있다.'
  },
  {
    word: '내포',
    question: '<span class="word-highlight">내포</span>의 뜻은?',
    hint: '속에 품고 있음',
    choices: ['밖으로 드러내다', '속에 품고 있다', '버리다', '피하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"내포"는 겉으로 드러나지 않게 속에 품고 있는 것을 의미합니다.',
    example: '예문: 그 말에는 여러 의미가 내포되어 있다.'
  },
  {
    word: '논거',
    question: '<span class="word-highlight">논거</span>의 뜻은?',
    hint: '주장의 근거',
    choices: ['반박', '주장을 뒷받침하는 근거', '결론', '서론'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"논거"는 논의나 주장을 뒷받침하는 근거나 이유를 의미합니다.',
    example: '예문: 그의 주장에는 충분한 논거가 있었다.'
  },
  {
    word: '당위',
    question: '<span class="word-highlight">당위</span>의 뜻은?',
    hint: '마땅히 해야 함',
    choices: ['해도 되고 안 해도 됨', '마땅히 해야 함', '하지 말아야 함', '할 수 없음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"당위"는 마땅히 그렇게 해야 하는 것을 의미합니다.',
    example: '예문: 이것은 선택이 아닌 당위의 문제이다.'
  },
  {
    word: '도출',
    question: '<span class="word-highlight">도출</span>의 뜻은?',
    hint: '이끌어 냄',
    choices: ['감추다', '이끌어 내다', '없애다', '막다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"도출"은 어떤 결과나 결론을 이끌어 내는 것을 의미합니다.',
    example: '예문: 실험을 통해 새로운 결론을 도출했다.'
  },
  {
    word: '맥락',
    question: '<span class="word-highlight">맥락</span>의 뜻은?',
    hint: '사물의 서로 이어지는 관계',
    choices: ['단절', '서로 이어지는 관계나 흐름', '시작', '끝'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"맥락"은 사물이나 현상이 서로 이어지는 관계나 흐름을 의미합니다.',
    example: '예문: 전후 맥락을 파악해야 한다.'
  },
  {
    word: '면밀',
    question: '<span class="word-highlight">면밀</span>의 뜻은?',
    hint: '빈틈없이 자세함',
    choices: ['대충', '빈틈없이 자세하다', '소홀하다', '느슨하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"면밀"은 빈틈이 없이 자세하고 꼼꼼한 것을 의미합니다.',
    example: '예문: 면밀한 검토가 필요하다.'
  },
  {
    word: '명시',
    question: '<span class="word-highlight">명시</span>의 뜻은?',
    hint: '분명하게 드러냄',
    choices: ['숨기다', '분명하게 드러내어 보이다', '모호하게 하다', '지우다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"명시"는 분명하게 드러내어 보이는 것을 의미합니다.',
    example: '예문: 계약서에 조건이 명시되어 있다.'
  },
  {
    word: '모색',
    question: '<span class="word-highlight">모색</span>의 뜻은?',
    hint: '방법이나 방향을 찾음',
    choices: ['포기하다', '방법이나 방향을 찾다', '무시하다', '거부하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"모색"은 일을 해결할 방법이나 방향을 찾는 것을 의미합니다.',
    example: '예문: 해결책을 모색하고 있다.'
  },
  {
    word: '반박',
    question: '<span class="word-highlight">반박</span>의 뜻은?',
    hint: '남의 의견에 반대하여 공격함',
    choices: ['동의하다', '반대하여 공격하다', '무시하다', '따르다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"반박"은 남의 의견이나 주장에 반대하여 말로 공격하는 것을 의미합니다.',
    example: '예문: 그의 주장을 조목조목 반박했다.'
  },
  {
    word: '범주',
    question: '<span class="word-highlight">범주</span>의 뜻은?',
    hint: '동일한 성질의 부류',
    choices: ['개별', '동일한 성질을 가진 부류', '전체', '하나'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"범주"는 동일한 성질을 가진 부류나 영역을 의미합니다.',
    example: '예문: 이것은 예술의 범주에 속한다.'
  },
  {
    word: '변별',
    question: '<span class="word-highlight">변별</span>의 뜻은?',
    hint: '서로 구별하여 가려냄',
    choices: ['섞다', '구별하여 가려내다', '합치다', '무시하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"변별"은 서로 다른 것을 구별하여 가려내는 것을 의미합니다.',
    example: '예문: 진품과 가품을 변별하는 능력이 필요하다.'
  },
  {
    word: '부각',
    question: '<span class="word-highlight">부각</span>의 뜻은?',
    hint: '두드러지게 나타냄',
    choices: ['숨기다', '두드러지게 나타내다', '없애다', '줄이다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"부각"은 어떤 것을 두드러지게 나타내는 것을 의미합니다.',
    example: '예문: 문제의 심각성이 부각되었다.'
  },
  {
    word: '부연',
    question: '<span class="word-highlight">부연</span>의 뜻은?',
    hint: '덧붙여 설명함',
    choices: ['생략하다', '덧붙여 설명하다', '삭제하다', '요약하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"부연"은 이미 말한 것에 덧붙여 자세히 설명하는 것을 의미합니다.',
    example: '예문: 이 점에 대해 부연 설명하겠다.'
  },
  {
    word: '사변',
    question: '<span class="word-highlight">사변</span>의 뜻은?',
    hint: '순수한 이론적 사고',
    choices: ['실천', '순수한 이론적 사고', '행동', '실험'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"사변"은 경험에 의하지 않고 순수한 이론적 사고만으로 하는 것을 의미합니다.',
    example: '예문: 사변적 철학에 대한 비판이 있었다.'
  },
  {
    word: '상관',
    question: '<span class="word-highlight">상관</span>의 뜻은?',
    hint: '서로 관련됨',
    choices: ['무관하다', '서로 관련되다', '독립적이다', '분리되다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"상관"은 둘 이상의 것이 서로 관련되어 있는 것을 의미합니다.',
    example: '예문: 이 두 변수는 높은 상관관계를 보인다.'
  },
  {
    word: '상충',
    question: '<span class="word-highlight">상충</span>의 뜻은?',
    hint: '서로 맞지 않아 충돌함',
    choices: ['일치하다', '서로 맞지 않아 충돌하다', '조화롭다', '어울리다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"상충"은 서로 맞지 않아 충돌하는 것을 의미합니다.',
    example: '예문: 두 주장이 상충한다.'
  },
  {
    word: '소거',
    question: '<span class="word-highlight">소거</span>의 뜻은?',
    hint: '없애 버림',
    choices: ['추가하다', '없애 버리다', '늘리다', '보존하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"소거"는 있던 것을 없애 버리는 것을 의미합니다.',
    example: '예문: 소거법으로 정답을 찾았다.'
  },
  {
    word: '수렴',
    question: '<span class="word-highlight">수렴</span>의 뜻은?',
    hint: '한 점으로 모임',
    choices: ['퍼지다', '한 점으로 모이다', '흩어지다', '분산되다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"수렴"은 여러 것이 한 점으로 모이는 것을 의미합니다.',
    example: '예문: 다양한 의견을 수렴했다.'
  },
  {
    word: '시사',
    question: '<span class="word-highlight">시사</span>의 뜻은?',
    hint: '미리 알려주어 깨닫게 함',
    choices: ['숨기다', '미리 알려주어 깨닫게 하다', '모르게 하다', '잊게 하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"시사"는 어떤 것을 미리 알려주어 깨닫게 하는 것을 의미합니다.',
    example: '예문: 이 사건은 많은 것을 시사한다.'
  },
  {
    word: '심층',
    question: '<span class="word-highlight">심층</span>의 뜻은?',
    hint: '깊은 속',
    choices: ['표면', '깊은 속', '겉', '바깥'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"심층"은 겉이 아닌 깊은 속을 의미합니다.',
    example: '예문: 심층 분석이 필요하다.'
  },
  {
    word: '양상',
    question: '<span class="word-highlight">양상</span>의 뜻은?',
    hint: '사물의 모양이나 상태',
    choices: ['내용', '모양이나 상태', '원인', '결과'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"양상"은 사물이나 현상의 모양이나 상태를 의미합니다.',
    example: '예문: 전쟁의 양상이 바뀌었다.'
  },
  {
    word: '연역',
    question: '<span class="word-highlight">연역</span>의 뜻은?',
    hint: '일반 원리에서 개별 사실을 이끌어 냄',
    choices: ['개별에서 일반으로', '일반에서 개별로', '아래에서 위로', '밖에서 안으로'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"연역"은 일반적인 원리에서 개별적인 사실을 이끌어 내는 추론 방법입니다.',
    example: '예문: 연역적 추론을 통해 결론을 내렸다.'
  },
  {
    word: '영위',
    question: '<span class="word-highlight">영위</span>의 뜻은?',
    hint: '생활을 꾸려 나감',
    choices: ['포기하다', '생활을 꾸려 나가다', '중단하다', '그만두다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"영위"는 생활이나 사업 등을 꾸려 나가는 것을 의미합니다.',
    example: '예문: 평화로운 삶을 영위하고 싶다.'
  },
  {
    word: '외연',
    question: '<span class="word-highlight">외연</span>의 뜻은?',
    hint: '개념이 적용되는 범위',
    choices: ['내용', '개념이 적용되는 범위', '핵심', '중심'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"외연"은 어떤 개념이 적용되는 대상의 범위를 의미합니다.',
    example: '예문: 이 개념의 외연을 넓혀야 한다.'
  },
  {
    word: '용인',
    question: '<span class="word-highlight">용인</span>의 뜻은?',
    hint: '너그럽게 받아들임',
    choices: ['거부하다', '너그럽게 받아들이다', '비난하다', '반대하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"용인"은 너그럽게 받아들이거나 허용하는 것을 의미합니다.',
    example: '예문: 사회가 용인하는 범위 내에서 행동해야 한다.'
  },
  {
    word: '유추',
    question: '<span class="word-highlight">유추</span>의 뜻은?',
    hint: '비슷한 것을 바탕으로 미루어 추측함',
    choices: ['정확히 알다', '비슷한 것으로 미루어 추측하다', '확인하다', '검증하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"유추"는 비슷한 점을 바탕으로 미루어 추측하는 것을 의미합니다.',
    example: '예문: 과거 사례에서 유추할 수 있다.'
  },
  {
    word: '이면',
    question: '<span class="word-highlight">이면</span>의 뜻은?',
    hint: '겉으로 드러나지 않은 부분',
    choices: ['표면', '겉으로 드러나지 않은 부분', '전면', '정면'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"이면"은 겉으로 드러나지 않은 안쪽 부분을 의미합니다.',
    example: '예문: 사건의 이면을 파헤쳤다.'
  },
  {
    word: '자명',
    question: '<span class="word-highlight">자명</span>의 뜻은?',
    hint: '설명 없이도 분명함',
    choices: ['불분명하다', '설명 없이도 분명하다', '모호하다', '애매하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"자명"은 설명이 없어도 그 자체로 분명한 것을 의미합니다.',
    example: '예문: 이것은 자명한 사실이다.'
  },
  {
    word: '저변',
    question: '<span class="word-highlight">저변</span>의 뜻은?',
    hint: '밑바탕이 되는 부분',
    choices: ['꼭대기', '밑바탕이 되는 부분', '표면', '상층'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"저변"은 어떤 현상이나 사물의 밑바탕이 되는 부분을 의미합니다.',
    example: '예문: 문화의 저변이 확대되었다.'
  },
  {
    word: '전제',
    question: '<span class="word-highlight">전제</span>의 뜻은?',
    hint: '미리 내세우는 조건',
    choices: ['결론', '미리 내세우는 조건', '결과', '마무리'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"전제"는 어떤 일을 하기 위해 미리 내세우는 조건을 의미합니다.',
    example: '예문: 이 논의는 자유의지를 전제로 한다.'
  },
  {
    word: '정립',
    question: '<span class="word-highlight">정립</span>의 뜻은?',
    hint: '바로 세움',
    choices: ['허물다', '바로 세우다', '무너뜨리다', '흔들다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"정립"은 이론이나 체계 등을 바로 세우는 것을 의미합니다.',
    example: '예문: 새로운 이론을 정립했다.'
  },
  {
    word: '조망',
    question: '<span class="word-highlight">조망</span>의 뜻은?',
    hint: '넓게 바라봄',
    choices: ['가까이 보다', '넓게 바라보다', '무시하다', '외면하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"조망"은 넓은 시야로 바라보는 것을 의미합니다.',
    example: '예문: 역사 전체를 조망하다.'
  },
  {
    word: '준거',
    question: '<span class="word-highlight">준거</span>의 뜻은?',
    hint: '표준이 되는 근거',
    choices: ['예외', '표준이 되는 근거', '변칙', '일탈'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"준거"는 표준이나 기준이 되는 근거를 의미합니다.',
    example: '예문: 평가의 준거를 마련했다.'
  },
  {
    word: '지양',
    question: '<span class="word-highlight">지양</span>의 뜻은?',
    hint: '더 높은 단계로 오르면서 버림',
    choices: ['유지하다', '더 높은 단계로 오르면서 버리다', '고수하다', '강화하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"지양"은 더 높은 단계로 오르면서 버리는 것을 의미합니다.',
    example: '예문: 단순한 이분법적 사고를 지양해야 한다.'
  },
  {
    word: '지향',
    question: '<span class="word-highlight">지향</span>의 뜻은?',
    hint: '어떤 목표로 향함',
    choices: ['회피하다', '어떤 목표로 향하다', '포기하다', '거부하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"지향"은 어떤 목표나 방향으로 향하는 것을 의미합니다.',
    example: '예문: 평화를 지향하는 정책이다.'
  },
  {
    word: '지평',
    question: '<span class="word-highlight">지평</span>의 뜻은?',
    hint: '시야나 사고의 범위',
    choices: ['한계', '시야나 사고의 범위', '끝', '경계'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"지평"은 시야나 사고가 미치는 범위를 의미합니다.',
    example: '예문: 새로운 지평을 열었다.'
  },
  {
    word: '착안',
    question: '<span class="word-highlight">착안</span>의 뜻은?',
    hint: '어떤 점에 주의를 기울임',
    choices: ['무시하다', '어떤 점에 주의를 기울이다', '넘기다', '간과하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"착안"은 어떤 점에 주의를 기울여 생각하는 것을 의미합니다.',
    example: '예문: 이 점에 착안하여 연구를 시작했다.'
  },
  {
    word: '천착',
    question: '<span class="word-highlight">천착</span>의 뜻은?',
    hint: '깊이 파고들어 연구함',
    choices: ['대충 보다', '깊이 파고들어 연구하다', '포기하다', '그만두다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"천착"은 어떤 문제를 깊이 파고들어 연구하는 것을 의미합니다.',
    example: '예문: 한 분야에 천착해 왔다.'
  },
  {
    word: '추론',
    question: '<span class="word-highlight">추론</span>의 뜻은?',
    hint: '미루어 생각함',
    choices: ['확인하다', '미루어 생각하다', '직접 보다', '경험하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"추론"은 알려진 것을 바탕으로 미루어 생각하는 것을 의미합니다.',
    example: '예문: 논리적 추론을 통해 결론을 내렸다.'
  },
  {
    word: '추상',
    question: '<span class="word-highlight">추상</span>의 뜻은?',
    hint: '공통된 특성을 뽑아냄',
    choices: ['구체화하다', '공통된 특성을 뽑아내다', '자세히 하다', '세분화하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"추상"은 여러 사물에서 공통된 특성만 뽑아내는 것을 의미합니다.',
    example: '예문: 추상적 개념을 이해하기 어렵다.'
  },
  {
    word: '촉발',
    question: '<span class="word-highlight">촉발</span>의 뜻은?',
    hint: '어떤 일을 일으킴',
    choices: ['막다', '어떤 일을 일으키다', '억제하다', '방지하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"촉발"은 어떤 일이 일어나도록 자극하는 것을 의미합니다.',
    example: '예문: 이 사건이 논쟁을 촉발했다.'
  },
  {
    word: '통찰',
    question: '<span class="word-highlight">통찰</span>의 뜻은?',
    hint: '예리하게 꿰뚫어 봄',
    choices: ['대충 보다', '예리하게 꿰뚫어 보다', '무시하다', '외면하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"통찰"은 사물의 본질을 예리하게 꿰뚫어 보는 것을 의미합니다.',
    example: '예문: 그는 뛰어난 통찰력을 가졌다.'
  },
  {
    word: '파생',
    question: '<span class="word-highlight">파생</span>의 뜻은?',
    hint: '갈라져 나옴',
    choices: ['합쳐지다', '갈라져 나오다', '사라지다', '없어지다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"파생"은 어떤 것에서 갈라져 나오는 것을 의미합니다.',
    example: '예문: 여러 문제가 파생되었다.'
  },
  {
    word: '표방',
    question: '<span class="word-highlight">표방</span>의 뜻은?',
    hint: '주의나 주장을 내세움',
    choices: ['숨기다', '주의나 주장을 내세우다', '감추다', '포기하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"표방"은 어떤 주의나 주장을 겉으로 내세우는 것을 의미합니다.',
    example: '예문: 민주주의를 표방하는 국가이다.'
  },
  {
    word: '함의',
    question: '<span class="word-highlight">함의</span>의 뜻은?',
    hint: '속에 담긴 뜻',
    choices: ['겉뜻', '속에 담긴 뜻', '표면적 의미', '직접적 의미'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"함의"는 말이나 글 속에 담긴 뜻을 의미합니다.',
    example: '예문: 이 작품의 함의를 파악해야 한다.'
  },
  {
    word: '함축',
    question: '<span class="word-highlight">함축</span>의 뜻은?',
    hint: '속에 포함하여 간직함',
    choices: ['드러내다', '속에 포함하여 간직하다', '펼치다', '풀어놓다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"함축"은 많은 내용을 속에 포함하여 간직하는 것을 의미합니다.',
    example: '예문: 함축적인 표현을 사용했다.'
  },
  {
    word: '향유',
    question: '<span class="word-highlight">향유</span>의 뜻은?',
    hint: '누리어 가짐',
    choices: ['빼앗기다', '누리어 가지다', '잃다', '포기하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"향유"는 권리나 이익, 문화 등을 누리어 가지는 것을 의미합니다.',
    example: '예문: 문화를 향유할 권리가 있다.'
  },
  {
    word: '환기',
    question: '<span class="word-highlight">환기</span>의 뜻은?',
    hint: '주의를 불러일으킴',
    choices: ['잊게 하다', '주의를 불러일으키다', '무시하다', '넘기다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"환기"는 주의나 관심을 불러일으키는 것을 의미합니다.',
    example: '예문: 문제의 심각성을 환기시켰다.'
  },
  {
    word: '환원',
    question: '<span class="word-highlight">환원</span>의 뜻은?',
    hint: '본래의 상태로 돌림',
    choices: ['변화시키다', '본래의 상태로 돌리다', '발전시키다', '바꾸다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"환원"은 어떤 것을 본래의 상태로 돌리는 것을 의미합니다.',
    example: '예문: 문제를 단순하게 환원해서는 안 된다.'
  },
  {
    word: '획일',
    question: '<span class="word-highlight">획일</span>의 뜻은?',
    hint: '모두 같은 기준으로 통일함',
    choices: ['다양화하다', '모두 같은 기준으로 통일하다', '개성화하다', '차별화하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"획일"은 모두 같은 기준으로 통일하는 것을 의미합니다.',
    example: '예문: 획일적인 교육 방식을 지양해야 한다.'
  },
  {
    word: '가감',
    question: '<span class="word-highlight">가감</span>의 뜻은?',
    hint: '더하거나 빼는 것',
    choices: ['곱하기', '더하거나 빼기', '나누기', '제곱'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"가감"은 더하거나 빼는 것을 의미합니다.',
    example: '예문: 원문에 가감 없이 전달했다.'
  },
  {
    word: '각인',
    question: '<span class="word-highlight">각인</span>의 뜻은?',
    hint: '깊이 새겨 넣음',
    choices: ['잊다', '깊이 새겨 넣다', '지우다', '없애다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"각인"은 마음이나 기억에 깊이 새겨 넣는 것을 의미합니다.',
    example: '예문: 그 장면이 뇌리에 각인되었다.'
  },
  {
    word: '간과',
    question: '<span class="word-highlight">간과</span>의 뜻은?',
    hint: '대수롭지 않게 보아 넘김',
    choices: ['중시하다', '대수롭지 않게 보아 넘기다', '집중하다', '강조하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"간과"는 대수롭지 않게 보아 넘기는 것을 의미합니다.',
    example: '예문: 이 점을 간과해서는 안 된다.'
  },
  {
    word: '갈등',
    question: '<span class="word-highlight">갈등</span>의 뜻은?',
    hint: '서로 대립하여 다툼',
    choices: ['화합', '서로 대립하여 다투다', '협력', '조화'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"갈등"은 서로 대립하여 다투는 것을 의미합니다.',
    example: '예문: 세대 간 갈등이 심화되었다.'
  },
  {
    word: '갈파',
    question: '<span class="word-highlight">갈파</span>의 뜻은?',
    hint: '속시원하게 밝히어 말함',
    choices: ['숨기다', '속시원하게 밝히어 말하다', '감추다', '모호하게 하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"갈파"는 요점이나 핵심을 속시원하게 밝히어 말하는 것을 의미합니다.',
    example: '예문: 문제의 본질을 갈파했다.'
  },
  {
    word: '강구',
    question: '<span class="word-highlight">강구</span>의 뜻은?',
    hint: '깊이 생각하여 연구함',
    choices: ['포기하다', '깊이 생각하여 연구하다', '무시하다', '넘기다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"강구"는 방법이나 대책을 깊이 생각하여 연구하는 것을 의미합니다.',
    example: '예문: 대책을 강구해야 한다.'
  },
  {
    word: '개괄',
    question: '<span class="word-highlight">개괄</span>의 뜻은?',
    hint: '대강 추려서 말함',
    choices: ['자세히 설명하다', '대강 추려서 말하다', '생략하다', '숨기다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"개괄"은 대강 추려서 말하는 것을 의미합니다.',
    example: '예문: 역사를 개괄적으로 살펴보겠다.'
  },
  {
    word: '개진',
    question: '<span class="word-highlight">개진</span>의 뜻은?',
    hint: '의견을 펼쳐 말함',
    choices: ['숨기다', '의견을 펼쳐 말하다', '포기하다', '철회하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"개진"은 자기의 의견이나 생각을 펼쳐서 말하는 것을 의미합니다.',
    example: '예문: 자신의 견해를 개진했다.'
  },
  {
    word: '거론',
    question: '<span class="word-highlight">거론</span>의 뜻은?',
    hint: '문제 삼아 말함',
    choices: ['무시하다', '문제 삼아 말하다', '넘기다', '생략하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"거론"은 어떤 것을 문제 삼아 말하는 것을 의미합니다.',
    example: '예문: 그 문제가 다시 거론되었다.'
  },
  {
    word: '격화',
    question: '<span class="word-highlight">격화</span>의 뜻은?',
    hint: '점점 심해짐',
    choices: ['완화되다', '점점 심해지다', '누그러지다', '진정되다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"격화"는 상황이나 감정이 점점 심해지는 것을 의미합니다.',
    example: '예문: 갈등이 격화되었다.'
  },
  {
    word: '견지',
    question: '<span class="word-highlight">견지</span>의 뜻은?',
    hint: '자기 입장을 굳게 지킴',
    choices: ['포기하다', '자기 입장을 굳게 지키다', '바꾸다', '변경하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"견지"는 자기의 입장이나 태도를 굳게 지키는 것을 의미합니다.',
    example: '예문: 중립적인 입장을 견지했다.'
  },
  {
    word: '결부',
    question: '<span class="word-highlight">결부</span>의 뜻은?',
    hint: '서로 연결하여 묶음',
    choices: ['분리하다', '서로 연결하여 묶다', '떼어내다', '구분하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"결부"는 서로 관련시켜 연결하는 것을 의미합니다.',
    example: '예문: 이 문제를 정치와 결부시켜서는 안 된다.'
  },
  {
    word: '경도',
    question: '<span class="word-highlight">경도</span>의 뜻은?',
    hint: '한쪽으로 치우침',
    choices: ['균형 잡히다', '한쪽으로 치우치다', '중립적이다', '공정하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"경도"는 어떤 사상이나 경향으로 한쪽으로 치우치는 것을 의미합니다.',
    example: '예문: 극단적인 사상에 경도되었다.'
  },
  {
    word: '경시',
    question: '<span class="word-highlight">경시</span>의 뜻은?',
    hint: '가볍게 봄',
    choices: ['중시하다', '가볍게 보다', '존중하다', '강조하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"경시"는 가볍게 보거나 업신여기는 것을 의미합니다.',
    example: '예문: 기본을 경시해서는 안 된다.'
  },
  {
    word: '고수',
    question: '<span class="word-highlight">고수</span>의 뜻은?',
    hint: '굳게 지킴',
    choices: ['포기하다', '굳게 지키다', '버리다', '바꾸다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"고수"는 자기 입장이나 원칙을 굳게 지키는 것을 의미합니다.',
    example: '예문: 원칙을 고수했다.'
  },
  {
    word: '고양',
    question: '<span class="word-highlight">고양</span>의 뜻은?',
    hint: '정신이나 기운을 높임',
    choices: ['낮추다', '정신이나 기운을 높이다', '억누르다', '꺾다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"고양"은 정신이나 기운을 높이는 것을 의미합니다.',
    example: '예문: 사기를 고양시켰다.'
  },
  {
    word: '공론',
    question: '<span class="word-highlight">공론</span>의 뜻은?',
    hint: '공개적으로 논의함',
    choices: ['비밀리에 하다', '공개적으로 논의하다', '숨기다', '감추다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"공론"은 공개적으로 논의하거나 여론을 의미합니다.',
    example: '예문: 이 문제를 공론화해야 한다.'
  },
  {
    word: '공존',
    question: '<span class="word-highlight">공존</span>의 뜻은?',
    hint: '함께 존재함',
    choices: ['혼자 존재하다', '함께 존재하다', '따로 살다', '배척하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"공존"은 둘 이상이 함께 존재하는 것을 의미합니다.',
    example: '예문: 다양한 문화가 공존한다.'
  },
  {
    word: '과도',
    question: '<span class="word-highlight">과도</span>의 뜻은?',
    hint: '정도가 지나침',
    choices: ['적절하다', '정도가 지나치다', '부족하다', '모자라다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"과도"는 정도가 지나친 것을 의미합니다.',
    example: '예문: 과도한 업무에 시달렸다.'
  },
  {
    word: '과시',
    question: '<span class="word-highlight">과시</span>의 뜻은?',
    hint: '자랑하여 드러냄',
    choices: ['숨기다', '자랑하여 드러내다', '감추다', '겸손하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"과시"는 자기의 능력이나 재물을 자랑하여 드러내는 것을 의미합니다.',
    example: '예문: 자신의 능력을 과시했다.'
  },
  {
    word: '과잉',
    question: '<span class="word-highlight">과잉</span>의 뜻은?',
    hint: '필요 이상으로 넘침',
    choices: ['부족', '필요 이상으로 넘치다', '모자람', '결핍'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"과잉"은 필요 이상으로 넘치는 것을 의미합니다.',
    example: '예문: 정보의 과잉으로 혼란스럽다.'
  },
  {
    word: '괴리',
    question: '<span class="word-highlight">괴리</span>의 뜻은?',
    hint: '서로 어긋나 동떨어짐',
    choices: ['일치하다', '서로 어긋나 동떨어지다', '조화롭다', '어울리다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"괴리"는 서로 어긋나서 동떨어지는 것을 의미합니다.',
    example: '예문: 이상과 현실 사이의 괴리가 크다.'
  },
  {
    word: '교착',
    question: '<span class="word-highlight">교착</span>의 뜻은?',
    hint: '서로 뒤엉켜 움직이지 못함',
    choices: ['순조롭게 진행되다', '서로 뒤엉켜 움직이지 못하다', '해결되다', '풀리다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"교착"은 서로 뒤엉키어 움직이지 못하는 상태를 의미합니다.',
    example: '예문: 협상이 교착 상태에 빠졌다.'
  },
  {
    word: '구현',
    question: '<span class="word-highlight">구현</span>의 뜻은?',
    hint: '실제로 나타냄',
    choices: ['숨기다', '실제로 나타내다', '감추다', '없애다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"구현"은 생각이나 계획을 실제로 나타내는 것을 의미합니다.',
    example: '예문: 이상을 구현하기 위해 노력했다.'
  },
  {
    word: '군림',
    question: '<span class="word-highlight">군림</span>의 뜻은?',
    hint: '높은 자리에서 지배함',
    choices: ['복종하다', '높은 자리에서 지배하다', '따르다', '굴복하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"군림"은 높은 자리에서 지배하는 것을 의미합니다.',
    example: '예문: 그 분야에서 군림하고 있다.'
  },
  {
    word: '궁극',
    question: '<span class="word-highlight">궁극</span>의 뜻은?',
    hint: '더 이상 나아갈 수 없는 마지막',
    choices: ['시작', '더 이상 나아갈 수 없는 마지막', '중간', '과정'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"궁극"은 더 이상 나아갈 수 없는 마지막 단계를 의미합니다.',
    example: '예문: 궁극적인 목표는 행복이다.'
  },
  {
    word: '권위',
    question: '<span class="word-highlight">권위</span>의 뜻은?',
    hint: '남을 복종시키는 힘이나 자격',
    choices: ['무력', '남을 복종시키는 힘이나 자격', '폭력', '강압'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"권위"는 남을 복종시킬 수 있는 힘이나 자격을 의미합니다.',
    example: '예문: 그는 이 분야의 권위자이다.'
  },
  {
    word: '균열',
    question: '<span class="word-highlight">균열</span>의 뜻은?',
    hint: '갈라져 틈이 생김',
    choices: ['단단해지다', '갈라져 틈이 생기다', '합쳐지다', '붙다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"균열"은 갈라져서 틈이 생기는 것을 의미합니다.',
    example: '예문: 관계에 균열이 생겼다.'
  },
  {
    word: '극복',
    question: '<span class="word-highlight">극복</span>의 뜻은?',
    hint: '어려움을 이겨 냄',
    choices: ['굴복하다', '어려움을 이겨 내다', '포기하다', '지다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"극복"은 어려움이나 장애를 이겨 내는 것을 의미합니다.',
    example: '예문: 역경을 극복했다.'
  },
  {
    word: '근간',
    question: '<span class="word-highlight">근간</span>의 뜻은?',
    hint: '뿌리와 줄기, 기본이 되는 것',
    choices: ['지엽', '뿌리와 줄기, 기본이 되는 것', '곁가지', '부수적인 것'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"근간"은 어떤 일의 기본이 되는 핵심을 의미합니다.',
    example: '예문: 민주주의는 사회의 근간이다.'
  },
  {
    word: '기반',
    question: '<span class="word-highlight">기반</span>의 뜻은?',
    hint: '기초가 되는 바탕',
    choices: ['지붕', '기초가 되는 바탕', '꼭대기', '상층'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"기반"은 기초가 되는 바탕을 의미합니다.',
    example: '예문: 경제적 기반을 다졌다.'
  },
  {
    word: '기인',
    question: '<span class="word-highlight">기인</span>의 뜻은?',
    hint: '원인이 됨',
    choices: ['결과가 되다', '원인이 되다', '끝나다', '마무리되다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"기인"은 어떤 일의 원인이 되는 것을 의미합니다.',
    example: '예문: 이 문제는 소통 부재에 기인한다.'
  }
];

  // ===== 101~200번 어휘 =====
  {
    word: '난해',
    question: '<span class="word-highlight">난해</span>의 뜻은?',
    hint: '이해하기 어려움',
    choices: ['쉽다', '이해하기 어렵다', '간단하다', '명확하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"난해"는 이해하기 어려운 것을 의미합니다.',
    example: '예문: 난해한 철학서를 읽었다.'
  },
  {
    word: '누적',
    question: '<span class="word-highlight">누적</span>의 뜻은?',
    hint: '차곡차곡 쌓임',
    choices: ['줄어들다', '차곡차곡 쌓이다', '없어지다', '소멸하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"누적"은 겹겹이 차곡차곡 쌓이는 것을 의미합니다.',
    example: '예문: 피로가 누적되었다.'
  },
  {
    word: '다각',
    question: '<span class="word-highlight">다각</span>의 뜻은?',
    hint: '여러 방면',
    choices: ['한 방면', '여러 방면', '단일', '하나'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"다각"은 여러 방면이나 측면을 의미합니다.',
    example: '예문: 다각적인 접근이 필요하다.'
  },
  {
    word: '다양',
    question: '<span class="word-highlight">다양</span>의 뜻은?',
    hint: '여러 가지 모양이나 종류',
    choices: ['단일하다', '여러 가지 모양이나 종류가 많다', '획일적이다', '똑같다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"다양"은 여러 가지 모양이나 종류가 많은 것을 의미합니다.',
    example: '예문: 다양한 의견을 수렴했다.'
  },
  {
    word: '단편',
    question: '<span class="word-highlight">단편</span>의 뜻은?',
    hint: '전체 중 한 부분',
    choices: ['전체', '전체 중 한 부분', '완전', '전부'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"단편"은 전체 중의 한 부분이나 조각을 의미합니다.',
    example: '예문: 단편적인 정보만으로는 판단할 수 없다.'
  },
  {
    word: '담론',
    question: '<span class="word-highlight">담론</span>의 뜻은?',
    hint: '어떤 주제에 대한 이야기나 논의',
    choices: ['침묵', '어떤 주제에 대한 이야기나 논의', '비밀', '독백'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"담론"은 어떤 주제에 대해 이야기하거나 논의하는 것을 의미합니다.',
    example: '예문: 새로운 담론이 형성되었다.'
  },
  {
    word: '대두',
    question: '<span class="word-highlight">대두</span>의 뜻은?',
    hint: '어떤 세력이 일어남',
    choices: ['사라지다', '어떤 세력이 일어나다', '줄어들다', '쇠퇴하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"대두"는 어떤 세력이나 현상이 새롭게 일어나는 것을 의미합니다.',
    example: '예문: 새로운 문제가 대두되었다.'
  },
  {
    word: '대비',
    question: '<span class="word-highlight">대비</span>의 뜻은?',
    hint: '서로 맞대어 비교함',
    choices: ['무시하다', '서로 맞대어 비교하다', '같다고 하다', '동일시하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"대비"는 둘 이상의 것을 서로 맞대어 비교하는 것을 의미합니다.',
    example: '예문: 과거와 현재를 대비했다.'
  },
  {
    word: '대안',
    question: '<span class="word-highlight">대안</span>의 뜻은?',
    hint: '어떤 안을 대신하는 다른 안',
    choices: ['원래 안', '어떤 안을 대신하는 다른 안', '같은 안', '동일한 안'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"대안"은 어떤 안을 대신할 수 있는 다른 안을 의미합니다.',
    example: '예문: 대안을 마련해야 한다.'
  },
  {
    word: '대조',
    question: '<span class="word-highlight">대조</span>의 뜻은?',
    hint: '서로 비교하여 살핌',
    choices: ['무시하다', '서로 비교하여 살피다', '같다고 하다', '일치시키다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"대조"는 둘 이상의 것을 서로 비교하여 살피는 것을 의미합니다.',
    example: '예문: 원본과 사본을 대조했다.'
  },
  {
    word: '도모',
    question: '<span class="word-highlight">도모</span>의 뜻은?',
    hint: '어떤 일을 이루려고 꾀함',
    choices: ['포기하다', '어떤 일을 이루려고 꾀하다', '그만두다', '중단하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"도모"는 어떤 일을 이루기 위해 꾀하거나 계획하는 것을 의미합니다.',
    example: '예문: 발전을 도모하다.'
  },
  {
    word: '도약',
    question: '<span class="word-highlight">도약</span>의 뜻은?',
    hint: '높이 뛰어오름',
    choices: ['추락하다', '높이 뛰어오르다', '내려가다', '떨어지다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"도약"은 높이 뛰어오르거나 크게 발전하는 것을 의미합니다.',
    example: '예문: 경제가 도약했다.'
  },
  {
    word: '도입',
    question: '<span class="word-highlight">도입</span>의 뜻은?',
    hint: '끌어들여 들여옴',
    choices: ['내보내다', '끌어들여 들여오다', '버리다', '제거하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"도입"은 새로운 것을 끌어들여 들여오는 것을 의미합니다.',
    example: '예문: 새로운 제도를 도입했다.'
  },
  {
    word: '독자',
    question: '<span class="word-highlight">독자</span>의 뜻은?',
    hint: '홀로 특별함',
    choices: ['공통적', '홀로 특별함', '일반적', '평범함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"독자"는 홀로 특별하거나 유일한 것을 의미합니다.',
    example: '예문: 독자적인 기술을 개발했다.'
  },
  {
    word: '동인',
    question: '<span class="word-highlight">동인</span>의 뜻은?',
    hint: '어떤 일을 일으키게 하는 원인',
    choices: ['결과', '어떤 일을 일으키게 하는 원인', '끝', '마무리'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"동인"은 어떤 일을 일으키게 하는 원인이나 동기를 의미합니다.',
    example: '예문: 변화의 동인을 분석했다.'
  },
  {
    word: '동조',
    question: '<span class="word-highlight">동조</span>의 뜻은?',
    hint: '남의 주장에 같이함',
    choices: ['반대하다', '남의 주장에 같이하다', '비판하다', '거부하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"동조"는 남의 주장이나 행동에 함께하는 것을 의미합니다.',
    example: '예문: 그의 의견에 동조했다.'
  },
  {
    word: '두각',
    question: '<span class="word-highlight">두각</span>의 뜻은?',
    hint: '뛰어난 재능이 드러남',
    choices: ['숨기다', '뛰어난 재능이 드러나다', '감추다', '묻히다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"두각"은 뛰어난 재능이 남보다 두드러지게 드러나는 것을 의미합니다.',
    example: '예문: 그 분야에서 두각을 나타냈다.'
  },
  {
    word: '등장',
    question: '<span class="word-highlight">등장</span>의 뜻은?',
    hint: '무대에 나타남',
    choices: ['사라지다', '무대에 나타나다', '퇴장하다', '없어지다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"등장"은 무대나 현장에 나타나는 것을 의미합니다.',
    example: '예문: 새로운 기술이 등장했다.'
  },
  {
    word: '만연',
    question: '<span class="word-highlight">만연</span>의 뜻은?',
    hint: '널리 퍼짐',
    choices: ['사라지다', '널리 퍼지다', '줄어들다', '없어지다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"만연"은 좋지 않은 현상이 널리 퍼지는 것을 의미합니다.',
    example: '예문: 부정부패가 만연했다.'
  },
  {
    word: '망라',
    question: '<span class="word-highlight">망라</span>의 뜻은?',
    hint: '빠짐없이 다 모음',
    choices: ['일부만', '빠짐없이 다 모으다', '생략하다', '제외하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"망라"는 빠짐없이 모두 모으는 것을 의미합니다.',
    example: '예문: 모든 자료를 망라했다.'
  },
  {
    word: '매개',
    question: '<span class="word-highlight">매개</span>의 뜻은?',
    hint: '둘 사이를 연결함',
    choices: ['분리하다', '둘 사이를 연결하다', '끊다', '차단하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"매개"는 둘 사이를 연결하거나 이어주는 것을 의미합니다.',
    example: '예문: 언어는 소통의 매개체이다.'
  },
  {
    word: '맹목',
    question: '<span class="word-highlight">맹목</span>의 뜻은?',
    hint: '분별없이 덮어놓고 함',
    choices: ['신중하다', '분별없이 덮어놓고 하다', '조심스럽다', '생각하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"맹목"은 옳고 그름을 분별하지 않고 덮어놓고 하는 것을 의미합니다.',
    example: '예문: 맹목적인 추종은 위험하다.'
  },
  {
    word: '명료',
    question: '<span class="word-highlight">명료</span>의 뜻은?',
    hint: '분명하고 또렷함',
    choices: ['모호하다', '분명하고 또렷하다', '흐리다', '불분명하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"명료"는 분명하고 또렷한 것을 의미합니다.',
    example: '예문: 명료한 설명이 필요하다.'
  },
  {
    word: '명분',
    question: '<span class="word-highlight">명분</span>의 뜻은?',
    hint: '일을 하는 이유나 구실',
    choices: ['실리', '일을 하는 이유나 구실', '이익', '실제'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"명분"은 일을 하는 이유나 구실이 되는 도리를 의미합니다.',
    example: '예문: 명분 없는 전쟁이었다.'
  },
  {
    word: '명제',
    question: '<span class="word-highlight">명제</span>의 뜻은?',
    hint: '판단의 내용을 말로 나타낸 것',
    choices: ['질문', '판단의 내용을 말로 나타낸 것', '의문', '물음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"명제"는 판단의 내용을 말이나 문장으로 나타낸 것을 의미합니다.',
    example: '예문: 이 명제의 참과 거짓을 판단하라.'
  },
  {
    word: '모순',
    question: '<span class="word-highlight">모순</span>의 뜻은?',
    hint: '앞뒤가 맞지 않음',
    choices: ['일치하다', '앞뒤가 맞지 않다', '조화롭다', '어울리다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"모순"은 앞뒤가 서로 맞지 않거나 어긋나는 것을 의미합니다.',
    example: '예문: 그의 말에는 모순이 있다.'
  },
  {
    word: '모호',
    question: '<span class="word-highlight">모호</span>의 뜻은?',
    hint: '뚜렷하지 않음',
    choices: ['명확하다', '뚜렷하지 않다', '분명하다', '확실하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"모호"는 뚜렷하지 않고 흐릿한 것을 의미합니다.',
    example: '예문: 모호한 표현을 피해야 한다.'
  },
  {
    word: '묵시',
    question: '<span class="word-highlight">묵시</span>의 뜻은?',
    hint: '말없이 뜻을 나타냄',
    choices: ['명시하다', '말없이 뜻을 나타내다', '분명히 말하다', '선언하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"묵시"는 말로 하지 않고 암암리에 뜻을 나타내는 것을 의미합니다.',
    example: '예문: 묵시적인 동의가 있었다.'
  },
  {
    word: '반증',
    question: '<span class="word-highlight">반증</span>의 뜻은?',
    hint: '반대되는 증거',
    choices: ['지지하는 증거', '반대되는 증거', '같은 증거', '동일한 증거'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"반증"은 어떤 주장에 반대되는 증거를 의미합니다.',
    example: '예문: 이것이 그 가설의 반증이다.'
  },
  {
    word: '발현',
    question: '<span class="word-highlight">발현</span>의 뜻은?',
    hint: '나타나 드러남',
    choices: ['숨기다', '나타나 드러나다', '감추다', '없어지다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"발현"은 겉으로 나타나 드러나는 것을 의미합니다.',
    example: '예문: 잠재력이 발현되었다.'
  },
  {
    word: '방기',
    question: '<span class="word-highlight">방기</span>의 뜻은?',
    hint: '내버려 둠',
    choices: ['돌보다', '내버려 두다', '관리하다', '책임지다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"방기"는 내버려 두거나 돌보지 않는 것을 의미합니다.',
    example: '예문: 의무를 방기했다.'
  },
  {
    word: '방만',
    question: '<span class="word-highlight">방만</span>의 뜻은?',
    hint: '절제 없이 늘어짐',
    choices: ['절제하다', '절제 없이 늘어지다', '긴축하다', '단속하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"방만"은 절제하지 않고 늘어지는 것을 의미합니다.',
    example: '예문: 방만한 경영으로 적자가 났다.'
  },
  {
    word: '배격',
    question: '<span class="word-highlight">배격</span>의 뜻은?',
    hint: '물리쳐 내침',
    choices: ['받아들이다', '물리쳐 내치다', '환영하다', '수용하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"배격"은 물리쳐서 내치는 것을 의미합니다.',
    example: '예문: 부당한 요구를 배격했다.'
  },
  {
    word: '배제',
    question: '<span class="word-highlight">배제</span>의 뜻은?',
    hint: '제외하여 물리침',
    choices: ['포함하다', '제외하여 물리치다', '넣다', '받아들이다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"배제"는 제외하여 물리치는 것을 의미합니다.',
    example: '예문: 가능성을 배제할 수 없다.'
  },
  {
    word: '배치',
    question: '<span class="word-highlight">배치</span>의 뜻은?',
    hint: '서로 어긋남',
    choices: ['일치하다', '서로 어긋나다', '조화롭다', '맞다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"배치"는 서로 어긋나거나 맞지 않는 것을 의미합니다.',
    example: '예문: 그의 행동은 원칙에 배치된다.'
  },
  {
    word: '배타',
    question: '<span class="word-highlight">배타</span>의 뜻은?',
    hint: '남을 물리침',
    choices: ['포용하다', '남을 물리치다', '받아들이다', '환영하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"배타"는 남이나 다른 것을 물리치는 것을 의미합니다.',
    example: '예문: 배타적인 태도는 좋지 않다.'
  },
  {
    word: '변용',
    question: '<span class="word-highlight">변용</span>의 뜻은?',
    hint: '형태나 내용을 바꾸어 씀',
    choices: ['그대로 유지하다', '형태나 내용을 바꾸어 쓰다', '보존하다', '지키다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"변용"은 형태나 내용을 바꾸어 쓰는 것을 의미합니다.',
    example: '예문: 전통을 현대적으로 변용했다.'
  },
  {
    word: '보편',
    question: '<span class="word-highlight">보편</span>의 뜻은?',
    hint: '모든 것에 두루 미침',
    choices: ['특수하다', '모든 것에 두루 미치다', '개별적이다', '제한적이다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"보편"은 모든 것에 두루 미치거나 통하는 것을 의미합니다.',
    example: '예문: 보편적인 가치를 추구한다.'
  },
  {
    word: '부재',
    question: '<span class="word-highlight">부재</span>의 뜻은?',
    hint: '있지 아니함',
    choices: ['존재하다', '있지 아니하다', '있다', '존재한다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"부재"는 있지 아니하거나 없는 것을 의미합니다.',
    example: '예문: 리더십의 부재가 문제다.'
  },
  {
    word: '부합',
    question: '<span class="word-highlight">부합</span>의 뜻은?',
    hint: '서로 꼭 맞음',
    choices: ['어긋나다', '서로 꼭 맞다', '다르다', '틀리다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"부합"은 서로 꼭 맞거나 들어맞는 것을 의미합니다.',
    example: '예문: 기준에 부합한다.'
  },
  {
    word: '분기',
    question: '<span class="word-highlight">분기</span>의 뜻은?',
    hint: '갈라져 나뉨',
    choices: ['합치다', '갈라져 나뉘다', '모이다', '뭉치다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"분기"는 갈라져서 나뉘는 것을 의미합니다.',
    example: '예문: 여기서 길이 분기된다.'
  },
  {
    word: '분석',
    question: '<span class="word-highlight">분석</span>의 뜻은?',
    hint: '쪼개어 살핌',
    choices: ['합치다', '쪼개어 살피다', '모으다', '뭉치다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"분석"은 복잡한 것을 쪼개어 살피는 것을 의미합니다.',
    example: '예문: 데이터를 분석했다.'
  },
  {
    word: '비견',
    question: '<span class="word-highlight">비견</span>의 뜻은?',
    hint: '서로 견주어 봄',
    choices: ['비교할 수 없다', '서로 견주어 보다', '다르다', '비슷하지 않다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"비견"은 서로 견주어 비교할 수 있을 정도로 비슷한 것을 의미합니다.',
    example: '예문: 그 누구와도 비견할 수 없다.'
  },
  {
    word: '비유',
    question: '<span class="word-highlight">비유</span>의 뜻은?',
    hint: '직접 말하지 않고 다른 것에 빗대어 표현함',
    choices: ['직접 말하다', '다른 것에 빗대어 표현하다', '그대로 말하다', '사실대로 말하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"비유"는 직접 말하지 않고 다른 비슷한 것에 빗대어 표현하는 것을 의미합니다.',
    example: '예문: 인생을 여행에 비유했다.'
  },
  {
    word: '비판',
    question: '<span class="word-highlight">비판</span>의 뜻은?',
    hint: '잘잘못을 가려 판단함',
    choices: ['무조건 칭찬하다', '잘잘못을 가려 판단하다', '무시하다', '넘어가다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"비판"은 사물의 옳고 그름을 가려서 판단하는 것을 의미합니다.',
    example: '예문: 건설적인 비판이 필요하다.'
  },
  {
    word: '사고',
    question: '<span class="word-highlight">사고</span>의 뜻은?',
    hint: '생각하고 궁리함',
    choices: ['행동하다', '생각하고 궁리하다', '실천하다', '움직이다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"사고"는 생각하고 궁리하는 것을 의미합니다.',
    example: '예문: 비판적 사고가 중요하다.'
  },
  {
    word: '사례',
    question: '<span class="word-highlight">사례</span>의 뜻은?',
    hint: '전에 있었던 예',
    choices: ['처음', '전에 있었던 예', '미래', '예정'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"사례"는 전에 실제로 있었던 예를 의미합니다.',
    example: '예문: 성공 사례를 분석했다.'
  },
  {
    word: '사상',
    question: '<span class="word-highlight">사상</span>의 뜻은?',
    hint: '사회나 인생에 대한 생각',
    choices: ['행동', '사회나 인생에 대한 생각', '실천', '운동'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"사상"은 사회나 인생에 대한 일정한 견해나 생각을 의미합니다.',
    example: '예문: 그의 사상은 시대를 앞섰다.'
  },
  {
    word: '상대',
    question: '<span class="word-highlight">상대</span>의 뜻은?',
    hint: '서로 맞서거나 마주함',
    choices: ['절대', '서로 맞서거나 마주하다', '독립', '유일'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"상대"는 서로 맞서거나 비교되는 대상을 의미합니다.',
    example: '예문: 상대적인 관점에서 봐야 한다.'
  },
  {
    word: '상반',
    question: '<span class="word-highlight">상반</span>의 뜻은?',
    hint: '서로 반대됨',
    choices: ['일치하다', '서로 반대되다', '같다', '동일하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"상반"은 서로 반대되거나 어긋나는 것을 의미합니다.',
    example: '예문: 상반된 의견이 충돌했다.'
  },
  {
    word: '상존',
    question: '<span class="word-highlight">상존</span>의 뜻은?',
    hint: '항상 존재함',
    choices: ['사라지다', '항상 존재하다', '없어지다', '소멸하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"상존"은 항상 존재하는 것을 의미합니다.',
    example: '예문: 위험은 항상 상존한다.'
  },
  {
    word: '상호',
    question: '<span class="word-highlight">상호</span>의 뜻은?',
    hint: '서로',
    choices: ['한쪽', '서로', '일방', '단독'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"상호"는 서로 관계되는 것을 의미합니다.',
    example: '예문: 상호 협력이 필요하다.'
  },
  {
    word: '생성',
    question: '<span class="word-highlight">생성</span>의 뜻은?',
    hint: '새로 생겨남',
    choices: ['소멸하다', '새로 생겨나다', '없어지다', '사라지다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"생성"은 새로 생겨나거나 만들어지는 것을 의미합니다.',
    example: '예문: 새로운 문화가 생성되었다.'
  },
  {
    word: '서술',
    question: '<span class="word-highlight">서술</span>의 뜻은?',
    hint: '순서대로 적어 나타냄',
    choices: ['생략하다', '순서대로 적어 나타내다', '숨기다', '감추다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"서술"은 차례대로 적어서 나타내는 것을 의미합니다.',
    example: '예문: 사건을 객관적으로 서술했다.'
  },
  {
    word: '선결',
    question: '<span class="word-highlight">선결</span>의 뜻은?',
    hint: '먼저 결정함',
    choices: ['나중에 하다', '먼저 결정하다', '미루다', '연기하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"선결"은 다른 것보다 먼저 결정하거나 해결하는 것을 의미합니다.',
    example: '예문: 선결 과제를 해결해야 한다.'
  },
  {
    word: '선행',
    question: '<span class="word-highlight">선행</span>의 뜻은?',
    hint: '앞서 행함',
    choices: ['뒤따르다', '앞서 행하다', '나중에 하다', '따라가다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"선행"은 다른 것보다 앞서 행하는 것을 의미합니다.',
    example: '예문: 선행 연구를 검토했다.'
  },
  {
    word: '성립',
    question: '<span class="word-highlight">성립</span>의 뜻은?',
    hint: '이루어짐',
    choices: ['무너지다', '이루어지다', '실패하다', '붕괴되다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"성립"은 일이나 관계가 이루어지는 것을 의미합니다.',
    example: '예문: 계약이 성립되었다.'
  },
  {
    word: '소멸',
    question: '<span class="word-highlight">소멸</span>의 뜻은?',
    hint: '사라져 없어짐',
    choices: ['생기다', '사라져 없어지다', '나타나다', '발생하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"소멸"은 사라져 없어지는 것을 의미합니다.',
    example: '예문: 권리가 소멸되었다.'
  },
  {
    word: '소외',
    question: '<span class="word-highlight">소외</span>의 뜻은?',
    hint: '따돌려 멀리함',
    choices: ['포함하다', '따돌려 멀리하다', '받아들이다', '환영하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"소외"는 따돌려서 멀리하거나 관계를 끊는 것을 의미합니다.',
    example: '예문: 소외된 계층을 돌봐야 한다.'
  },
  {
    word: '속성',
    question: '<span class="word-highlight">속성</span>의 뜻은?',
    hint: '사물의 본질적인 성질',
    choices: ['외형', '사물의 본질적인 성질', '겉모습', '외관'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"속성"은 사물의 본질적인 성질이나 특성을 의미합니다.',
    example: '예문: 물질의 속성을 연구했다.'
  },
  {
    word: '수반',
    question: '<span class="word-highlight">수반</span>의 뜻은?',
    hint: '어떤 일과 함께 따름',
    choices: ['따로 일어나다', '어떤 일과 함께 따르다', '분리되다', '독립하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"수반"은 어떤 일과 함께 따르는 것을 의미합니다.',
    example: '예문: 변화에는 고통이 수반된다.'
  },
  {
    word: '수용',
    question: '<span class="word-highlight">수용</span>의 뜻은?',
    hint: '받아들임',
    choices: ['거부하다', '받아들이다', '배척하다', '반대하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"수용"은 받아들이는 것을 의미합니다.',
    example: '예문: 의견을 수용했다.'
  },
  {
    word: '순응',
    question: '<span class="word-highlight">순응</span>의 뜻은?',
    hint: '환경에 맞추어 적응함',
    choices: ['저항하다', '환경에 맞추어 적응하다', '반발하다', '거부하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"순응"은 환경이나 변화에 맞추어 적응하는 것을 의미합니다.',
    example: '예문: 시대에 순응했다.'
  },
  {
    word: '승화',
    question: '<span class="word-highlight">승화</span>의 뜻은?',
    hint: '더 높은 상태로 발전함',
    choices: ['퇴보하다', '더 높은 상태로 발전하다', '떨어지다', '낮아지다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"승화"는 더 높은 상태나 단계로 발전하는 것을 의미합니다.',
    example: '예문: 고통을 예술로 승화시켰다.'
  },
  {
    word: '실증',
    question: '<span class="word-highlight">실증</span>의 뜻은?',
    hint: '실제로 증명함',
    choices: ['추측하다', '실제로 증명하다', '상상하다', '가정하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"실증"은 실제로 증명하거나 확인하는 것을 의미합니다.',
    example: '예문: 실증적인 연구가 필요하다.'
  },
  {
    word: '심화',
    question: '<span class="word-highlight">심화</span>의 뜻은?',
    hint: '정도가 깊어짐',
    choices: ['완화되다', '정도가 깊어지다', '약해지다', '줄어들다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"심화"는 정도가 더 깊어지는 것을 의미합니다.',
    example: '예문: 갈등이 심화되었다.'
  },
  {
    word: '양립',
    question: '<span class="word-highlight">양립</span>의 뜻은?',
    hint: '둘이 함께 성립함',
    choices: ['충돌하다', '둘이 함께 성립하다', '대립하다', '배척하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"양립"은 두 가지가 함께 성립하거나 존재하는 것을 의미합니다.',
    example: '예문: 자유와 평등은 양립할 수 있다.'
  },
  {
    word: '양분',
    question: '<span class="word-highlight">양분</span>의 뜻은?',
    hint: '둘로 나눔',
    choices: ['합치다', '둘로 나누다', '하나로 만들다', '통합하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"양분"은 둘로 나누는 것을 의미합니다.',
    example: '예문: 여론이 양분되었다.'
  },
  {
    word: '양산',
    question: '<span class="word-highlight">양산</span>의 뜻은?',
    hint: '많이 만들어 냄',
    choices: ['적게 만들다', '많이 만들어 내다', '중단하다', '줄이다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"양산"은 많이 만들어 내는 것을 의미합니다.',
    example: '예문: 유사한 제품이 양산되었다.'
  },
  {
    word: '역설',
    question: '<span class="word-highlight">역설</span>의 뜻은?',
    hint: '겉보기에 모순되나 진리를 담고 있음',
    choices: ['평범한 진리', '겉보기에 모순되나 진리를 담고 있다', '단순한 사실', '당연한 말'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"역설"은 겉보기에는 모순되어 보이지만 그 안에 진리를 담고 있는 것을 의미합니다.',
    example: '예문: 삶의 역설을 깨달았다.'
  },
  {
    word: '역행',
    question: '<span class="word-highlight">역행</span>의 뜻은?',
    hint: '거꾸로 감',
    choices: ['따르다', '거꾸로 가다', '순응하다', '동의하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"역행"은 방향이나 흐름을 거슬러 가는 것을 의미합니다.',
    example: '예문: 시대에 역행하는 정책이다.'
  },
  {
    word: '연관',
    question: '<span class="word-highlight">연관</span>의 뜻은?',
    hint: '서로 관련됨',
    choices: ['무관하다', '서로 관련되다', '독립적이다', '분리되다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"연관"은 서로 관련되어 있는 것을 의미합니다.',
    example: '예문: 두 사건은 연관이 있다.'
  },
  {
    word: '연원',
    question: '<span class="word-highlight">연원</span>의 뜻은?',
    hint: '사물의 근원',
    choices: ['결과', '사물의 근원', '끝', '종결'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"연원"은 사물이 비롯된 근원을 의미합니다.',
    example: '예문: 이 풍습의 연원을 찾았다.'
  },
  {
    word: '염두',
    question: '<span class="word-highlight">염두</span>의 뜻은?',
    hint: '마음속',
    choices: ['잊다', '마음속에 두다', '무시하다', '넘기다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"염두"는 마음속에 두는 것을 의미합니다.',
    example: '예문: 그 점을 염두에 두어야 한다.'
  },
  {
    word: '영속',
    question: '<span class="word-highlight">영속</span>의 뜻은?',
    hint: '오래도록 이어짐',
    choices: ['단절되다', '오래도록 이어지다', '끊기다', '멈추다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"영속"은 오래도록 계속 이어지는 것을 의미합니다.',
    example: '예문: 평화의 영속을 기원한다.'
  },
  {
    word: '예시',
    question: '<span class="word-highlight">예시</span>의 뜻은?',
    hint: '예를 들어 보임',
    choices: ['숨기다', '예를 들어 보이다', '생략하다', '감추다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"예시"는 예를 들어 보이는 것을 의미합니다.',
    example: '예문: 구체적인 예시가 필요하다.'
  },
  {
    word: '왜곡',
    question: '<span class="word-highlight">왜곡</span>의 뜻은?',
    hint: '사실과 다르게 해석함',
    choices: ['있는 그대로', '사실과 다르게 해석하다', '정확하게', '바르게'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"왜곡"은 사실과 다르게 뒤틀어서 해석하는 것을 의미합니다.',
    example: '예문: 사실을 왜곡해서는 안 된다.'
  },
  {
    word: '요인',
    question: '<span class="word-highlight">요인</span>의 뜻은?',
    hint: '주요한 원인',
    choices: ['결과', '주요한 원인', '마무리', '끝'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"요인"은 어떤 일의 주요한 원인이 되는 것을 의미합니다.',
    example: '예문: 성공 요인을 분석했다.'
  },
  {
    word: '우려',
    question: '<span class="word-highlight">우려</span>의 뜻은?',
    hint: '근심하고 걱정함',
    choices: ['안심하다', '근심하고 걱정하다', '편안하다', '기쁘다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"우려"는 근심하고 걱정하는 것을 의미합니다.',
    example: '예문: 부작용이 우려된다.'
  },
  {
    word: '원용',
    question: '<span class="word-highlight">원용</span>의 뜻은?',
    hint: '이론 등을 끌어다 씀',
    choices: ['버리다', '이론 등을 끌어다 쓰다', '무시하다', '제외하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"원용"은 이론이나 학설 등을 끌어다 쓰는 것을 의미합니다.',
    example: '예문: 다양한 이론을 원용했다.'
  },
  {
    word: '위배',
    question: '<span class="word-highlight">위배</span>의 뜻은?',
    hint: '어기고 반함',
    choices: ['따르다', '어기고 반하다', '지키다', '준수하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"위배"는 규칙이나 법 등을 어기고 반하는 것을 의미합니다.',
    example: '예문: 원칙에 위배된다.'
  },
  {
    word: '유기',
    question: '<span class="word-highlight">유기</span>의 뜻은?',
    hint: '서로 밀접하게 관련됨',
    choices: ['독립적', '서로 밀접하게 관련되다', '분리된', '떨어진'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"유기"는 서로 밀접하게 관련되어 있는 것을 의미합니다.',
    example: '예문: 유기적으로 연결되어 있다.'
  },
  {
    word: '유발',
    question: '<span class="word-highlight">유발</span>의 뜻은?',
    hint: '어떤 일을 일으킴',
    choices: ['막다', '어떤 일을 일으키다', '방지하다', '예방하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"유발"은 어떤 일이 일어나도록 일으키는 것을 의미합니다.',
    example: '예문: 알레르기를 유발할 수 있다.'
  },
  {
    word: '유보',
    question: '<span class="word-highlight">유보</span>의 뜻은?',
    hint: '결정을 미루어 둠',
    choices: ['결정하다', '결정을 미루어 두다', '즉시 하다', '바로 하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"유보"는 결정이나 행동을 미루어 두는 것을 의미합니다.',
    example: '예문: 판단을 유보했다.'
  },
  {
    word: '유사',
    question: '<span class="word-highlight">유사</span>의 뜻은?',
    hint: '서로 비슷함',
    choices: ['다르다', '서로 비슷하다', '틀리다', '상반되다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"유사"는 서로 비슷한 것을 의미합니다.',
    example: '예문: 유사한 사례가 있다.'
  },
  {
    word: '유지',
    question: '<span class="word-highlight">유지</span>의 뜻은?',
    hint: '어떤 상태를 계속 지킴',
    choices: ['바꾸다', '어떤 상태를 계속 지키다', '변경하다', '바꾸다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"유지"는 어떤 상태를 계속해서 지키는 것을 의미합니다.',
    example: '예문: 건강을 유지하다.'
  },
  {
    word: '융합',
    question: '<span class="word-highlight">융합</span>의 뜻은?',
    hint: '녹아 하나로 합쳐짐',
    choices: ['분리되다', '녹아 하나로 합쳐지다', '나뉘다', '갈라지다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"융합"은 둘 이상의 것이 녹아 하나로 합쳐지는 것을 의미합니다.',
    example: '예문: 기술의 융합이 이루어졌다.'
  },
  {
    word: '의거',
    question: '<span class="word-highlight">의거</span>의 뜻은?',
    hint: '근거로 삼음',
    choices: ['무시하다', '근거로 삼다', '버리다', '제외하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"의거"는 어떤 것을 근거로 삼는 것을 의미합니다.',
    example: '예문: 법에 의거하여 처리했다.'
  },
  {
    word: '의의',
    question: '<span class="word-highlight">의의</span>의 뜻은?',
    hint: '뜻이나 가치',
    choices: ['무의미', '뜻이나 가치', '무가치', '쓸모없음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"의의"는 말이나 사물의 뜻이나 가치를 의미합니다.',
    example: '예문: 이 연구의 의의는 크다.'
  },
  {
    word: '이행',
    question: '<span class="word-highlight">이행</span>의 뜻은?',
    hint: '약속이나 의무를 실제로 행함',
    choices: ['어기다', '약속이나 의무를 실제로 행하다', '무시하다', '위반하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"이행"은 약속이나 의무를 실제로 행하는 것을 의미합니다.',
    example: '예문: 계약을 이행했다.'
  },
  {
    word: '인과',
    question: '<span class="word-highlight">인과</span>의 뜻은?',
    hint: '원인과 결과',
    choices: ['우연', '원인과 결과', '뜻밖', '예상 밖'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"인과"는 원인과 결과의 관계를 의미합니다.',
    example: '예문: 인과 관계를 밝혔다.'
  },
  {
    word: '인용',
    question: '<span class="word-highlight">인용</span>의 뜻은?',
    hint: '남의 말이나 글을 끌어다 씀',
    choices: ['직접 쓰다', '남의 말이나 글을 끌어다 쓰다', '창작하다', '만들다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"인용"은 남의 말이나 글을 끌어다 쓰는 것을 의미합니다.',
    example: '예문: 유명한 말을 인용했다.'
  },
  {
    word: '일관',
    question: '<span class="word-highlight">일관</span>의 뜻은?',
    hint: '처음부터 끝까지 한결같음',
    choices: ['변덕스럽다', '처음부터 끝까지 한결같다', '바뀌다', '달라지다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"일관"은 처음부터 끝까지 한결같은 것을 의미합니다.',
    example: '예문: 일관된 태도를 유지했다.'
  },
  {
    word: '일맥상통',
    question: '<span class="word-highlight">일맥상통</span>의 뜻은?',
    hint: '어떤 점에서 서로 통함',
    choices: ['전혀 다르다', '어떤 점에서 서로 통하다', '무관하다', '상관없다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"일맥상통"은 어떤 점에서 서로 통하거나 관련이 있는 것을 의미합니다.',
    example: '예문: 두 주장은 일맥상통한다.'
  },
  {
    word: '일축',
    question: '<span class="word-highlight">일축</span>의 뜻은?',
    hint: '단번에 물리침',
    choices: ['받아들이다', '단번에 물리치다', '수용하다', '동의하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"일축"은 단번에 물리치거나 거부하는 것을 의미합니다.',
    example: '예문: 그의 제안을 일축했다.'
  },
  {
    word: '일환',
    question: '<span class="word-highlight">일환</span>의 뜻은?',
    hint: '한 부분',
    choices: ['전체', '한 부분', '전부', '모두'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"일환"은 전체 중의 한 부분을 의미합니다.',
    example: '예문: 계획의 일환으로 추진했다.'
  },
  {
    word: '임의',
    question: '<span class="word-highlight">임의</span>의 뜻은?',
    hint: '일정한 규칙 없이 마음대로',
    choices: ['규칙적', '일정한 규칙 없이 마음대로', '체계적', '계획적'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"임의"는 일정한 규칙 없이 마음대로 하는 것을 의미합니다.',
    example: '예문: 임의로 판단해서는 안 된다.'
  },
  {
    word: '입각',
    question: '<span class="word-highlight">입각</span>의 뜻은?',
    hint: '어떤 것에 기초를 둠',
    choices: ['무시하다', '어떤 것에 기초를 두다', '버리다', '제외하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"입각"은 어떤 것에 기초를 두는 것을 의미합니다.',
    example: '예문: 사실에 입각한 판단이다.'
  },
  {
    word: '입증',
    question: '<span class="word-highlight">입증</span>의 뜻은?',
    hint: '증거를 세워 증명함',
    choices: ['부정하다', '증거를 세워 증명하다', '숨기다', '감추다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"입증"은 증거를 세워 증명하는 것을 의미합니다.',
    example: '예문: 그의 주장이 입증되었다.'
  }
];

  // ===== 201~300번 어휘 =====
  {
    word: '자율',
    question: '<span class="word-highlight">자율</span>의 뜻은?',
    hint: '스스로 규율함',
    choices: ['타율', '스스로 규율하다', '강제', '통제'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"자율"은 남의 지배나 구속 없이 스스로 규율하는 것을 의미합니다.',
    example: '예문: 자율적인 학습이 중요하다.'
  },
  {
    word: '자초',
    question: '<span class="word-highlight">자초</span>의 뜻은?',
    hint: '스스로 불러일으킴',
    choices: ['피하다', '스스로 불러일으키다', '막다', '방지하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"자초"는 어떤 일을 스스로 불러일으키는 것을 의미합니다.',
    example: '예문: 화를 자초했다.'
  },
  {
    word: '잠재',
    question: '<span class="word-highlight">잠재</span>의 뜻은?',
    hint: '겉으로 드러나지 않고 숨어 있음',
    choices: ['드러나다', '겉으로 드러나지 않고 숨어 있다', '나타나다', '보이다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"잠재"는 겉으로 드러나지 않고 숨어 있는 것을 의미합니다.',
    example: '예문: 잠재력이 크다.'
  },
  {
    word: '잠정',
    question: '<span class="word-highlight">잠정</span>의 뜻은?',
    hint: '정식으로 결정되기 전 임시로',
    choices: ['영구적', '정식으로 결정되기 전 임시로', '확정적', '최종적'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"잠정"은 정식으로 결정되기 전에 임시로 정하는 것을 의미합니다.',
    example: '예문: 잠정적인 결론을 내렸다.'
  },
  {
    word: '재고',
    question: '<span class="word-highlight">재고</span>의 뜻은?',
    hint: '다시 생각함',
    choices: ['그대로 두다', '다시 생각하다', '무시하다', '넘기다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"재고"는 다시 한번 생각하는 것을 의미합니다.',
    example: '예문: 계획을 재고해야 한다.'
  },
  {
    word: '재정립',
    question: '<span class="word-highlight">재정립</span>의 뜻은?',
    hint: '다시 바로 세움',
    choices: ['그대로 두다', '다시 바로 세우다', '허물다', '무너뜨리다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"재정립"은 다시 바로 세우는 것을 의미합니다.',
    example: '예문: 기준을 재정립했다.'
  },
  {
    word: '저해',
    question: '<span class="word-highlight">저해</span>의 뜻은?',
    hint: '막아서 해를 끼침',
    choices: ['돕다', '막아서 해를 끼치다', '촉진하다', '도움을 주다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"저해"는 막아서 해를 끼치는 것을 의미합니다.',
    example: '예문: 발전을 저해하는 요소이다.'
  },
  {
    word: '적용',
    question: '<span class="word-highlight">적용</span>의 뜻은?',
    hint: '알맞게 이용하거나 맞추어 씀',
    choices: ['무시하다', '알맞게 이용하거나 맞추어 쓰다', '제외하다', '배제하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"적용"은 어떤 것을 알맞게 이용하거나 맞추어 쓰는 것을 의미합니다.',
    example: '예문: 이론을 실제에 적용했다.'
  },
  {
    word: '적합',
    question: '<span class="word-highlight">적합</span>의 뜻은?',
    hint: '꼭 알맞음',
    choices: ['부적합', '꼭 알맞다', '맞지 않다', '어울리지 않다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"적합"은 꼭 알맞거나 들어맞는 것을 의미합니다.',
    example: '예문: 조건에 적합하다.'
  },
  {
    word: '전개',
    question: '<span class="word-highlight">전개</span>의 뜻은?',
    hint: '펼쳐 나감',
    choices: ['접다', '펼쳐 나가다', '멈추다', '중단하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"전개"는 펼쳐 나가는 것을 의미합니다.',
    example: '예문: 논리를 전개했다.'
  },
  {
    word: '전도',
    question: '<span class="word-highlight">전도</span>의 뜻은?',
    hint: '앞으로 나아갈 길',
    choices: ['과거', '앞으로 나아갈 길', '지나간 일', '옛날'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"전도"는 앞으로 나아갈 길이나 장래를 의미합니다.',
    example: '예문: 전도가 유망하다.'
  },
  {
    word: '전반',
    question: '<span class="word-highlight">전반</span>의 뜻은?',
    hint: '전체에 걸침',
    choices: ['일부', '전체에 걸치다', '부분', '조각'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"전반"은 전체에 걸치는 것을 의미합니다.',
    example: '예문: 사회 전반에 영향을 미쳤다.'
  },
  {
    word: '전환',
    question: '<span class="word-highlight">전환</span>의 뜻은?',
    hint: '다른 방향으로 바꿈',
    choices: ['유지하다', '다른 방향으로 바꾸다', '그대로 두다', '지키다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"전환"은 다른 방향이나 상태로 바꾸는 것을 의미합니다.',
    example: '예문: 정책을 전환했다.'
  },
  {
    word: '절충',
    question: '<span class="word-highlight">절충</span>의 뜻은?',
    hint: '서로 다른 의견을 알맞게 조절함',
    choices: ['고집하다', '서로 다른 의견을 알맞게 조절하다', '우기다', '밀어붙이다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"절충"은 서로 다른 의견이나 주장을 알맞게 조절하는 것을 의미합니다.',
    example: '예문: 절충안을 마련했다.'
  },
  {
    word: '점검',
    question: '<span class="word-highlight">점검</span>의 뜻은?',
    hint: '낱낱이 검사함',
    choices: ['무시하다', '낱낱이 검사하다', '넘기다', '생략하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"점검"은 낱낱이 살펴서 검사하는 것을 의미합니다.',
    example: '예문: 안전을 점검했다.'
  },
  {
    word: '점진',
    question: '<span class="word-highlight">점진</span>의 뜻은?',
    hint: '차츰차츰 나아감',
    choices: ['급격히', '차츰차츰 나아가다', '갑자기', '단번에'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"점진"은 차츰차츰 나아가는 것을 의미합니다.',
    example: '예문: 점진적인 변화가 필요하다.'
  },
  {
    word: '정당',
    question: '<span class="word-highlight">정당</span>의 뜻은?',
    hint: '이치에 맞아 옳음',
    choices: ['부당하다', '이치에 맞아 옳다', '잘못되다', '틀리다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"정당"은 이치에 맞아 옳은 것을 의미합니다.',
    example: '예문: 정당한 요구이다.'
  },
  {
    word: '정설',
    question: '<span class="word-highlight">정설</span>의 뜻은?',
    hint: '올바른 것으로 인정된 학설',
    choices: ['이설', '올바른 것으로 인정된 학설', '가설', '추측'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"정설"은 올바른 것으로 널리 인정된 학설을 의미합니다.',
    example: '예문: 이것이 정설로 받아들여진다.'
  },
  {
    word: '정체',
    question: '<span class="word-highlight">정체</span>의 뜻은?',
    hint: '발전하지 못하고 제자리에 머물러 있음',
    choices: ['발전하다', '발전하지 못하고 제자리에 머물러 있다', '진보하다', '나아가다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"정체"는 발전하지 못하고 제자리에 머물러 있는 것을 의미합니다.',
    example: '예문: 경제가 정체 상태이다.'
  },
  {
    word: '제고',
    question: '<span class="word-highlight">제고</span>의 뜻은?',
    hint: '수준을 더 높임',
    choices: ['낮추다', '수준을 더 높이다', '떨어뜨리다', '감소시키다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"제고"는 수준을 더 높이는 것을 의미합니다.',
    example: '예문: 효율을 제고해야 한다.'
  },
  {
    word: '제시',
    question: '<span class="word-highlight">제시</span>의 뜻은?',
    hint: '내어 보임',
    choices: ['숨기다', '내어 보이다', '감추다', '숨기다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"제시"는 어떤 것을 내어 보이는 것을 의미합니다.',
    example: '예문: 대안을 제시했다.'
  },
  {
    word: '제약',
    question: '<span class="word-highlight">제약</span>의 뜻은?',
    hint: '조건을 붙여 제한함',
    choices: ['자유롭게 하다', '조건을 붙여 제한하다', '풀다', '허용하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"제약"은 조건을 붙여 제한하는 것을 의미합니다.',
    example: '예문: 시간의 제약이 있다.'
  },
  {
    word: '조장',
    question: '<span class="word-highlight">조장</span>의 뜻은?',
    hint: '좋지 않은 일을 부추김',
    choices: ['막다', '좋지 않은 일을 부추기다', '억제하다', '방지하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"조장"은 좋지 않은 일을 부추기는 것을 의미합니다.',
    example: '예문: 갈등을 조장해서는 안 된다.'
  },
  {
    word: '조절',
    question: '<span class="word-highlight">조절</span>의 뜻은?',
    hint: '알맞게 맞추어 정함',
    choices: ['그대로 두다', '알맞게 맞추어 정하다', '방치하다', '내버려두다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"조절"은 알맞게 맞추어 정하는 것을 의미합니다.',
    example: '예문: 온도를 조절했다.'
  },
  {
    word: '조화',
    question: '<span class="word-highlight">조화</span>의 뜻은?',
    hint: '서로 잘 어울림',
    choices: ['충돌하다', '서로 잘 어울리다', '부딪치다', '맞지 않다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"조화"는 서로 잘 어울리는 것을 의미합니다.',
    example: '예문: 색의 조화가 아름답다.'
  },
  {
    word: '존립',
    question: '<span class="word-highlight">존립</span>의 뜻은?',
    hint: '존재하여 서 있음',
    choices: ['사라지다', '존재하여 서 있다', '무너지다', '붕괴되다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"존립"은 존재하여 서 있는 것을 의미합니다.',
    example: '예문: 국가의 존립이 위태롭다.'
  },
  {
    word: '존속',
    question: '<span class="word-highlight">존속</span>의 뜻은?',
    hint: '존재하여 계속됨',
    choices: ['소멸하다', '존재하여 계속되다', '없어지다', '사라지다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"존속"은 존재하여 계속되는 것을 의미합니다.',
    example: '예문: 전통이 존속되고 있다.'
  },
  {
    word: '종결',
    question: '<span class="word-highlight">종결</span>의 뜻은?',
    hint: '끝맺음',
    choices: ['시작하다', '끝맺다', '출발하다', '개시하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"종결"은 끝을 맺는 것을 의미합니다.',
    example: '예문: 재판이 종결되었다.'
  },
  {
    word: '종속',
    question: '<span class="word-highlight">종속</span>의 뜻은?',
    hint: '다른 것에 딸려 붙음',
    choices: ['독립하다', '다른 것에 딸려 붙다', '자립하다', '분리되다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"종속"은 다른 것에 딸려 붙거나 의존하는 것을 의미합니다.',
    example: '예문: 경제적으로 종속되어 있다.'
  },
  {
    word: '주관',
    question: '<span class="word-highlight">주관</span>의 뜻은?',
    hint: '자기만의 생각이나 관점',
    choices: ['객관', '자기만의 생각이나 관점', '보편', '일반'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"주관"은 자기만의 생각이나 관점을 의미합니다.',
    example: '예문: 주관적인 판단을 피해야 한다.'
  },
  {
    word: '주도',
    question: '<span class="word-highlight">주도</span>의 뜻은?',
    hint: '주동이 되어 이끎',
    choices: ['따르다', '주동이 되어 이끌다', '따라가다', '뒤따르다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"주도"는 주동이 되어 이끄는 것을 의미합니다.',
    example: '예문: 시장을 주도하고 있다.'
  },
  {
    word: '주류',
    question: '<span class="word-highlight">주류</span>의 뜻은?',
    hint: '주된 흐름이나 경향',
    choices: ['비주류', '주된 흐름이나 경향', '소수', '변방'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"주류"는 주된 흐름이나 경향을 의미합니다.',
    example: '예문: 주류 문화에 편입되었다.'
  },
  {
    word: '주목',
    question: '<span class="word-highlight">주목</span>의 뜻은?',
    hint: '관심을 가지고 주의 깊게 봄',
    choices: ['무시하다', '관심을 가지고 주의 깊게 보다', '넘기다', '간과하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"주목"은 관심을 가지고 주의 깊게 보는 것을 의미합니다.',
    example: '예문: 이 현상에 주목해야 한다.'
  },
  {
    word: '주장',
    question: '<span class="word-highlight">주장</span>의 뜻은?',
    hint: '자기 의견을 굳게 내세움',
    choices: ['양보하다', '자기 의견을 굳게 내세우다', '물러서다', '포기하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"주장"은 자기 의견을 굳게 내세우는 것을 의미합니다.',
    example: '예문: 그는 끝까지 자기 주장을 굽히지 않았다.'
  },
  {
    word: '주체',
    question: '<span class="word-highlight">주체</span>의 뜻은?',
    hint: '행동의 중심이 되는 것',
    choices: ['객체', '행동의 중심이 되는 것', '대상', '피동자'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"주체"는 어떤 행동의 중심이 되는 것을 의미합니다.',
    example: '예문: 국민이 나라의 주체이다.'
  },
  {
    word: '중시',
    question: '<span class="word-highlight">중시</span>의 뜻은?',
    hint: '중요하게 여김',
    choices: ['경시하다', '중요하게 여기다', '가볍게 보다', '무시하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"중시"는 중요하게 여기는 것을 의미합니다.',
    example: '예문: 효율을 중시한다.'
  },
  {
    word: '중추',
    question: '<span class="word-highlight">중추</span>의 뜻은?',
    hint: '중심이 되는 중요한 부분',
    choices: ['주변', '중심이 되는 중요한 부분', '가장자리', '변두리'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"중추"는 중심이 되는 중요한 부분을 의미합니다.',
    example: '예문: 경제의 중추적 역할을 한다.'
  },
  {
    word: '증대',
    question: '<span class="word-highlight">증대</span>의 뜻은?',
    hint: '늘어나서 커짐',
    choices: ['감소하다', '늘어나서 커지다', '줄어들다', '작아지다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"증대"는 늘어나서 커지는 것을 의미합니다.',
    example: '예문: 수요가 증대되었다.'
  },
  {
    word: '지속',
    question: '<span class="word-highlight">지속</span>의 뜻은?',
    hint: '끊이지 않고 계속됨',
    choices: ['멈추다', '끊이지 않고 계속되다', '중단되다', '그치다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"지속"은 끊이지 않고 계속되는 것을 의미합니다.',
    example: '예문: 노력을 지속해야 한다.'
  },
  {
    word: '지엽',
    question: '<span class="word-highlight">지엽</span>의 뜻은?',
    hint: '곁가지나 부차적인 것',
    choices: ['핵심', '곁가지나 부차적인 것', '중심', '본질'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"지엽"은 곁가지처럼 부차적이고 사소한 것을 의미합니다.',
    example: '예문: 지엽적인 문제에 매달리지 마라.'
  },
  {
    word: '직관',
    question: '<span class="word-highlight">직관</span>의 뜻은?',
    hint: '판단이나 추리 없이 대상을 직접 파악함',
    choices: ['분석', '판단이나 추리 없이 대상을 직접 파악하다', '논리', '추론'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"직관"은 판단이나 추리 없이 대상을 직접 파악하는 것을 의미합니다.',
    example: '예문: 직관적으로 알았다.'
  },
  {
    word: '진위',
    question: '<span class="word-highlight">진위</span>의 뜻은?',
    hint: '참과 거짓',
    choices: ['같음', '참과 거짓', '동일함', '일치'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"진위"는 참과 거짓을 의미합니다.',
    example: '예문: 진위를 가려야 한다.'
  },
  {
    word: '집약',
    question: '<span class="word-highlight">집약</span>의 뜻은?',
    hint: '모아서 한데 묶음',
    choices: ['분산하다', '모아서 한데 묶다', '흩뜨리다', '나누다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"집약"은 모아서 한데 묶는 것을 의미합니다.',
    example: '예문: 자원을 집약적으로 사용했다.'
  },
  {
    word: '차별',
    question: '<span class="word-highlight">차별</span>의 뜻은?',
    hint: '둘 이상을 각각 다르게 대우함',
    choices: ['동등하게 대하다', '둘 이상을 각각 다르게 대우하다', '평등하게', '공평하게'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"차별"은 둘 이상을 각각 다르게 대우하는 것을 의미합니다.',
    example: '예문: 차별 없는 사회를 만들어야 한다.'
  },
  {
    word: '차용',
    question: '<span class="word-highlight">차용</span>의 뜻은?',
    hint: '빌려서 씀',
    choices: ['직접 만들다', '빌려서 쓰다', '창작하다', '고안하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"차용"은 남의 것을 빌려서 쓰는 것을 의미합니다.',
    example: '예문: 외래어를 차용했다.'
  },
  {
    word: '참여',
    question: '<span class="word-highlight">참여</span>의 뜻은?',
    hint: '어떤 일에 끼어들어 관계함',
    choices: ['빠지다', '어떤 일에 끼어들어 관계하다', '물러나다', '제외되다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"참여"는 어떤 일에 끼어들어 관계하는 것을 의미합니다.',
    example: '예문: 적극적으로 참여했다.'
  },
  {
    word: '창출',
    question: '<span class="word-highlight">창출</span>의 뜻은?',
    hint: '새로 만들어 냄',
    choices: ['없애다', '새로 만들어 내다', '파괴하다', '제거하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"창출"은 새로 만들어 내는 것을 의미합니다.',
    example: '예문: 일자리를 창출했다.'
  },
  {
    word: '척결',
    question: '<span class="word-highlight">척결</span>의 뜻은?',
    hint: '뿌리째 뽑아 없앰',
    choices: ['방치하다', '뿌리째 뽑아 없애다', '내버려두다', '묵인하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"척결"은 좋지 않은 것을 뿌리째 뽑아 없애는 것을 의미합니다.',
    example: '예문: 부패를 척결해야 한다.'
  },
  {
    word: '체계',
    question: '<span class="word-highlight">체계</span>의 뜻은?',
    hint: '일정한 원리에 따라 짜인 조직',
    choices: ['혼란', '일정한 원리에 따라 짜인 조직', '무질서', '산만함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"체계"는 일정한 원리에 따라 짜인 조직을 의미합니다.',
    example: '예문: 체계적인 접근이 필요하다.'
  },
  {
    word: '체득',
    question: '<span class="word-highlight">체득</span>의 뜻은?',
    hint: '몸으로 직접 경험하여 앎',
    choices: ['이론으로 배우다', '몸으로 직접 경험하여 알다', '들어서 알다', '책으로 배우다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"체득"은 몸으로 직접 경험하여 아는 것을 의미합니다.',
    example: '예문: 경험을 통해 체득했다.'
  },
  {
    word: '초래',
    question: '<span class="word-highlight">초래</span>의 뜻은?',
    hint: '어떤 결과를 가져옴',
    choices: ['막다', '어떤 결과를 가져오다', '방지하다', '예방하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"초래"는 어떤 결과를 가져오는 것을 의미합니다.',
    example: '예문: 문제를 초래했다.'
  },
  {
    word: '초월',
    question: '<span class="word-highlight">초월</span>의 뜻은?',
    hint: '어떤 한계를 뛰어넘음',
    choices: ['머무르다', '어떤 한계를 뛰어넘다', '갇히다', '제한받다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"초월"은 어떤 한계나 범위를 뛰어넘는 것을 의미합니다.',
    example: '예문: 시대를 초월한 작품이다.'
  },
  {
    word: '총체',
    question: '<span class="word-highlight">총체</span>의 뜻은?',
    hint: '모든 것을 하나로 합친 전체',
    choices: ['일부', '모든 것을 하나로 합친 전체', '부분', '조각'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"총체"는 모든 것을 하나로 합친 전체를 의미합니다.',
    example: '예문: 총체적인 관점에서 봐야 한다.'
  },
  {
    word: '추구',
    question: '<span class="word-highlight">추구</span>의 뜻은?',
    hint: '목적을 이루려고 쫓아 구함',
    choices: ['포기하다', '목적을 이루려고 쫓아 구하다', '단념하다', '그만두다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"추구"는 목적을 이루려고 쫓아 구하는 것을 의미합니다.',
    example: '예문: 행복을 추구한다.'
  },
  {
    word: '추동',
    question: '<span class="word-highlight">추동</span>의 뜻은?',
    hint: '밀어서 움직이게 함',
    choices: ['막다', '밀어서 움직이게 하다', '멈추다', '억제하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"추동"은 밀어서 움직이게 하는 것을 의미합니다.',
    example: '예문: 변화를 추동하는 힘이다.'
  },
  {
    word: '추세',
    question: '<span class="word-highlight">추세</span>의 뜻은?',
    hint: '어떤 방향으로 나아가는 형편',
    choices: ['정체', '어떤 방향으로 나아가는 형편', '멈춤', '고정'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"추세"는 어떤 방향으로 나아가는 형편이나 경향을 의미합니다.',
    example: '예문: 증가 추세이다.'
  },
  {
    word: '축소',
    question: '<span class="word-highlight">축소</span>의 뜻은?',
    hint: '줄여서 작게 함',
    choices: ['확대하다', '줄여서 작게 하다', '늘리다', '키우다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"축소"는 줄여서 작게 하는 것을 의미합니다.',
    example: '예문: 규모를 축소했다.'
  },
  {
    word: '충돌',
    question: '<span class="word-highlight">충돌</span>의 뜻은?',
    hint: '서로 맞부딪침',
    choices: ['조화롭다', '서로 맞부딪치다', '화합하다', '어울리다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"충돌"은 서로 맞부딪치는 것을 의미합니다.',
    example: '예문: 의견이 충돌했다.'
  },
  {
    word: '취사선택',
    question: '<span class="word-highlight">취사선택</span>의 뜻은?',
    hint: '취할 것은 취하고 버릴 것은 버려 골라 잡음',
    choices: ['다 받아들이다', '취할 것은 취하고 버릴 것은 버려 골라 잡다', '다 버리다', '무조건 수용하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"취사선택"은 취할 것은 취하고 버릴 것은 버려서 골라 잡는 것을 의미합니다.',
    example: '예문: 정보를 취사선택해야 한다.'
  },
  {
    word: '침체',
    question: '<span class="word-highlight">침체</span>의 뜻은?',
    hint: '활기를 잃고 가라앉음',
    choices: ['활기차다', '활기를 잃고 가라앉다', '번성하다', '번창하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"침체"는 활기를 잃고 가라앉는 것을 의미합니다.',
    example: '예문: 경기가 침체되었다.'
  },
  {
    word: '타개',
    question: '<span class="word-highlight">타개</span>의 뜻은?',
    hint: '어려운 상황을 극복함',
    choices: ['악화시키다', '어려운 상황을 극복하다', '방치하다', '포기하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"타개"는 어려운 상황을 극복하는 것을 의미합니다.',
    example: '예문: 국면을 타개했다.'
  },
  {
    word: '타당',
    question: '<span class="word-highlight">타당</span>의 뜻은?',
    hint: '이치에 맞아 옳음',
    choices: ['부당하다', '이치에 맞아 옳다', '잘못되다', '틀리다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"타당"은 이치에 맞아 옳은 것을 의미합니다.',
    example: '예문: 타당한 근거가 있다.'
  },
  {
    word: '타파',
    question: '<span class="word-highlight">타파</span>의 뜻은?',
    hint: '때려 부숨',
    choices: ['유지하다', '때려 부수다', '지키다', '보존하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"타파"는 때려 부수거나 없애 버리는 것을 의미합니다.',
    example: '예문: 관습을 타파했다.'
  },
  {
    word: '탈피',
    question: '<span class="word-highlight">탈피</span>의 뜻은?',
    hint: '허물을 벗고 변화함',
    choices: ['유지하다', '허물을 벗고 변화하다', '그대로이다', '머무르다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"탈피"는 낡은 것에서 벗어나 새롭게 변화하는 것을 의미합니다.',
    example: '예문: 틀에서 탈피해야 한다.'
  },
  {
    word: '토대',
    question: '<span class="word-highlight">토대</span>의 뜻은?',
    hint: '기초가 되는 바탕',
    choices: ['지붕', '기초가 되는 바탕', '꼭대기', '상부'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"토대"는 사물의 기초가 되는 바탕을 의미합니다.',
    example: '예문: 토대를 다졌다.'
  },
  {
    word: '통념',
    question: '<span class="word-highlight">통념</span>의 뜻은?',
    hint: '일반적으로 통하는 생각',
    choices: ['특별한 생각', '일반적으로 통하는 생각', '새로운 생각', '독특한 생각'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"통념"은 일반적으로 통하는 생각이나 관념을 의미합니다.',
    example: '예문: 통념을 깨뜨렸다.'
  },
  {
    word: '통용',
    question: '<span class="word-highlight">통용</span>의 뜻은?',
    hint: '일반적으로 두루 씀',
    choices: ['제한적으로 쓰다', '일반적으로 두루 쓰다', '특수하게 쓰다', '한정되게 쓰다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"통용"은 일반적으로 두루 쓰이는 것을 의미합니다.',
    example: '예문: 널리 통용되는 말이다.'
  },
  {
    word: '통합',
    question: '<span class="word-highlight">통합</span>의 뜻은?',
    hint: '둘 이상을 하나로 합침',
    choices: ['분리하다', '둘 이상을 하나로 합치다', '나누다', '쪼개다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"통합"은 둘 이상의 것을 하나로 합치는 것을 의미합니다.',
    example: '예문: 조직을 통합했다.'
  },
  {
    word: '투영',
    question: '<span class="word-highlight">투영</span>의 뜻은?',
    hint: '비추어 나타남',
    choices: ['숨기다', '비추어 나타나다', '감추다', '가리다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"투영"은 비추어 나타나는 것을 의미합니다.',
    example: '예문: 작품에 작가의 삶이 투영되어 있다.'
  },
  {
    word: '특수',
    question: '<span class="word-highlight">특수</span>의 뜻은?',
    hint: '일반과 다르게 특별함',
    choices: ['보편적', '일반과 다르게 특별하다', '일반적', '평범하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"특수"는 일반적인 것과 다르게 특별한 것을 의미합니다.',
    example: '예문: 특수한 상황이다.'
  },
  {
    word: '파급',
    question: '<span class="word-highlight">파급</span>의 뜻은?',
    hint: '영향이 차차 다른 데로 퍼져 미침',
    choices: ['제한되다', '영향이 차차 다른 데로 퍼져 미치다', '한정되다', '국한되다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"파급"은 영향이 차차 다른 데로 퍼져 미치는 것을 의미합니다.',
    example: '예문: 파급 효과가 크다.'
  },
  {
    word: '파악',
    question: '<span class="word-highlight">파악</span>의 뜻은?',
    hint: '확실하게 이해함',
    choices: ['모르다', '확실하게 이해하다', '헷갈리다', '혼동하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"파악"은 어떤 대상을 확실하게 이해하는 것을 의미합니다.',
    example: '예문: 상황을 파악했다.'
  },
  {
    word: '판단',
    question: '<span class="word-highlight">판단</span>의 뜻은?',
    hint: '사물을 인식하여 결정함',
    choices: ['방치하다', '사물을 인식하여 결정하다', '미루다', '보류하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"판단"은 사물을 인식하여 결정하는 것을 의미합니다.',
    example: '예문: 올바른 판단을 내렸다.'
  },
  {
    word: '편재',
    question: '<span class="word-highlight">편재</span>의 뜻은?',
    hint: '한쪽으로 치우쳐 있음',
    choices: ['고르게 퍼지다', '한쪽으로 치우쳐 있다', '균등하다', '평등하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"편재"는 한쪽으로 치우쳐 있는 것을 의미합니다.',
    example: '예문: 자원이 편재해 있다.'
  },
  {
    word: '편향',
    question: '<span class="word-highlight">편향</span>의 뜻은?',
    hint: '한쪽으로 치우침',
    choices: ['균형 잡히다', '한쪽으로 치우치다', '공정하다', '중립적이다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"편향"은 한쪽으로 치우치는 것을 의미합니다.',
    example: '예문: 편향된 시각을 가지고 있다.'
  },
  {
    word: '평준',
    question: '<span class="word-highlight">평준</span>의 뜻은?',
    hint: '고르고 가지런함',
    choices: ['차이나다', '고르고 가지런하다', '불균등하다', '편차가 크다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"평준"은 고르고 가지런한 것을 의미합니다.',
    example: '예문: 교육의 평준화가 이루어졌다.'
  },
  {
    word: '포괄',
    question: '<span class="word-highlight">포괄</span>의 뜻은?',
    hint: '일정한 범위 안에 모두 끌어넣음',
    choices: ['제외하다', '일정한 범위 안에 모두 끌어넣다', '배제하다', '빼다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"포괄"은 일정한 범위 안에 모두 끌어넣는 것을 의미합니다.',
    example: '예문: 다양한 분야를 포괄한다.'
  },
  {
    word: '포섭',
    question: '<span class="word-highlight">포섭</span>의 뜻은?',
    hint: '끌어들여 자기편으로 만듦',
    choices: ['배척하다', '끌어들여 자기편으로 만들다', '내쫓다', '밀어내다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"포섭"은 끌어들여 자기편으로 만드는 것을 의미합니다.',
    example: '예문: 다양한 의견을 포섭했다.'
  },
  {
    word: '폐기',
    question: '<span class="word-highlight">폐기</span>의 뜻은?',
    hint: '쓸모없게 되어 버림',
    choices: ['보존하다', '쓸모없게 되어 버리다', '지키다', '유지하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"폐기"는 쓸모없게 되어 버리는 것을 의미합니다.',
    example: '예문: 낡은 제도를 폐기했다.'
  },
  {
    word: '표출',
    question: '<span class="word-highlight">표출</span>의 뜻은?',
    hint: '겉으로 드러내 나타냄',
    choices: ['숨기다', '겉으로 드러내 나타내다', '감추다', '숨기다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"표출"은 겉으로 드러내어 나타내는 것을 의미합니다.',
    example: '예문: 감정을 표출했다.'
  },
  {
    word: '피력',
    question: '<span class="word-highlight">피력</span>의 뜻은?',
    hint: '생각을 말로 나타냄',
    choices: ['숨기다', '생각을 말로 나타내다', '감추다', '비밀로 하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"피력"은 자기 생각이나 의견을 말로 나타내는 것을 의미합니다.',
    example: '예문: 의견을 피력했다.'
  },
  {
    word: '필연',
    question: '<span class="word-highlight">필연</span>의 뜻은?',
    hint: '반드시 그렇게 됨',
    choices: ['우연', '반드시 그렇게 되다', '뜻밖', '예상 밖'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"필연"은 반드시 그렇게 되는 것을 의미합니다.',
    example: '예문: 필연적인 결과였다.'
  },
  {
    word: '하락',
    question: '<span class="word-highlight">하락</span>의 뜻은?',
    hint: '떨어져 내림',
    choices: ['상승하다', '떨어져 내리다', '오르다', '올라가다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"하락"은 떨어져 내리는 것을 의미합니다.',
    example: '예문: 주가가 하락했다.'
  },
  {
    word: '한계',
    question: '<span class="word-highlight">한계</span>의 뜻은?',
    hint: '사물의 범위나 능력의 끝',
    choices: ['무한', '사물의 범위나 능력의 끝', '시작', '출발'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"한계"는 사물의 범위나 능력의 끝을 의미합니다.',
    example: '예문: 한계에 부딪쳤다.'
  },
  {
    word: '한정',
    question: '<span class="word-highlight">한정</span>의 뜻은?',
    hint: '수량이나 범위를 제한함',
    choices: ['무제한', '수량이나 범위를 제한하다', '자유롭게', '마음대로'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"한정"은 수량이나 범위를 제한하는 것을 의미합니다.',
    example: '예문: 수량을 한정했다.'
  },
  {
    word: '함양',
    question: '<span class="word-highlight">함양</span>의 뜻은?',
    hint: '실력이나 품성을 기름',
    choices: ['잃다', '실력이나 품성을 기르다', '버리다', '없애다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"함양"은 실력이나 품성을 기르는 것을 의미합니다.',
    example: '예문: 인성을 함양해야 한다.'
  },
  {
    word: '합리',
    question: '<span class="word-highlight">합리</span>의 뜻은?',
    hint: '이치에 맞음',
    choices: ['불합리', '이치에 맞다', '비합리', '불합리'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"합리"는 이치에 맞거나 도리에 맞는 것을 의미합니다.',
    example: '예문: 합리적인 판단이 필요하다.'
  },
  {
    word: '해명',
    question: '<span class="word-highlight">해명</span>의 뜻은?',
    hint: '밝혀서 설명함',
    choices: ['숨기다', '밝혀서 설명하다', '감추다', '모호하게 하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"해명"은 밝혀서 설명하는 것을 의미합니다.',
    example: '예문: 의혹을 해명했다.'
  },
  {
    word: '해소',
    question: '<span class="word-highlight">해소</span>의 뜻은?',
    hint: '풀어 없앰',
    choices: ['악화시키다', '풀어 없애다', '심화시키다', '늘리다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"해소"는 풀어서 없애는 것을 의미합니다.',
    example: '예문: 스트레스를 해소했다.'
  },
  {
    word: '핵심',
    question: '<span class="word-highlight">핵심</span>의 뜻은?',
    hint: '사물의 가장 중요한 부분',
    choices: ['주변', '사물의 가장 중요한 부분', '가장자리', '곁'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"핵심"은 사물의 가장 중요한 부분을 의미합니다.',
    example: '예문: 핵심을 파악했다.'
  },
  {
    word: '현안',
    question: '<span class="word-highlight">현안</span>의 뜻은?',
    hint: '현재 당면한 문제',
    choices: ['과거 문제', '현재 당면한 문제', '미래 문제', '옛날 일'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"현안"은 현재 당면하여 해결해야 할 문제를 의미합니다.',
    example: '예문: 현안을 해결해야 한다.'
  },
  {
    word: '현저',
    question: '<span class="word-highlight">현저</span>의 뜻은?',
    hint: '뚜렷하게 드러남',
    choices: ['미미하다', '뚜렷하게 드러나다', '사소하다', '작다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"현저"는 뚜렷하게 드러나는 것을 의미합니다.',
    example: '예문: 현저한 차이가 있다.'
  },
  {
    word: '형성',
    question: '<span class="word-highlight">형성</span>의 뜻은?',
    hint: '모양을 이룸',
    choices: ['파괴하다', '모양을 이루다', '무너뜨리다', '허물다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"형성"은 모양을 이루거나 만들어지는 것을 의미합니다.',
    example: '예문: 여론이 형성되었다.'
  },
  {
    word: '호응',
    question: '<span class="word-highlight">호응</span>의 뜻은?',
    hint: '불러서 대답하거나 어울려 응함',
    choices: ['무시하다', '불러서 대답하거나 어울려 응하다', '외면하다', '거부하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"호응"은 불러서 대답하거나 어울려 응하는 것을 의미합니다.',
    example: '예문: 좋은 호응을 얻었다.'
  },
  {
    word: '혼재',
    question: '<span class="word-highlight">혼재</span>의 뜻은?',
    hint: '뒤섞여 있음',
    choices: ['분리되다', '뒤섞여 있다', '나뉘다', '구분되다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"혼재"는 여러 가지가 뒤섞여 있는 것을 의미합니다.',
    example: '예문: 다양한 요소가 혼재해 있다.'
  },
  {
    word: '화두',
    question: '<span class="word-highlight">화두</span>의 뜻은?',
    hint: '이야기의 첫머리나 화제',
    choices: ['결론', '이야기의 첫머리나 화제', '마무리', '끝'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"화두"는 이야기의 첫머리나 화제를 의미합니다.',
    example: '예문: 새로운 화두가 등장했다.'
  },
  {
    word: '화합',
    question: '<span class="word-highlight">화합</span>의 뜻은?',
    hint: '서로 어울려 하나가 됨',
    choices: ['분열하다', '서로 어울려 하나가 되다', '갈라지다', '다투다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"화합"은 서로 어울려 하나가 되는 것을 의미합니다.',
    example: '예문: 사회의 화합이 필요하다.'
  },
  {
    word: '확립',
    question: '<span class="word-highlight">확립</span>의 뜻은?',
    hint: '확실하게 세움',
    choices: ['무너뜨리다', '확실하게 세우다', '허물다', '없애다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"확립"은 확실하게 세우는 것을 의미합니다.',
    example: '예문: 원칙을 확립했다.'
  },
  {
    word: '확산',
    question: '<span class="word-highlight">확산</span>의 뜻은?',
    hint: '널리 퍼짐',
    choices: ['집중되다', '널리 퍼지다', '모이다', '줄어들다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"확산"은 널리 퍼지는 것을 의미합니다.',
    example: '예문: 소문이 확산되었다.'
  },
  {
    word: '확충',
    question: '<span class="word-highlight">확충</span>의 뜻은?',
    hint: '넓히고 늘림',
    choices: ['축소하다', '넓히고 늘리다', '줄이다', '감소시키다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"확충"은 넓히고 늘리는 것을 의미합니다.',
    example: '예문: 시설을 확충했다.'
  },
  {
    word: '효용',
    question: '<span class="word-highlight">효용</span>의 뜻은?',
    hint: '쓸모 있음',
    choices: ['쓸모없다', '쓸모 있다', '무가치하다', '무용하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"효용"은 쓸모가 있거나 이로운 것을 의미합니다.',
    example: '예문: 효용 가치가 높다.'
  },
  {
    word: '후퇴',
    question: '<span class="word-highlight">후퇴</span>의 뜻은?',
    hint: '뒤로 물러남',
    choices: ['전진하다', '뒤로 물러나다', '나아가다', '앞으로 가다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"후퇴"는 뒤로 물러나는 것을 의미합니다.',
    example: '예문: 한 발 후퇴했다.'
  }
];

  // ===== 301~400번 어휘 =====
  {
    word: '가공',
    question: '<span class="word-highlight">가공</span>의 뜻은?',
    hint: '원료를 인공적으로 처리함',
    choices: ['자연 그대로', '원료를 인공적으로 처리하다', '날것', '생것'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"가공"은 원료를 인공적으로 처리하여 제품을 만드는 것을 의미합니다.',
    example: '예문: 가공 식품을 줄여야 한다.'
  },
  {
    word: '가용',
    question: '<span class="word-highlight">가용</span>의 뜻은?',
    hint: '쓸 수 있음',
    choices: ['쓸 수 없다', '쓸 수 있다', '불가능하다', '안 된다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"가용"은 쓸 수 있거나 이용할 수 있는 것을 의미합니다.',
    example: '예문: 가용 자원을 활용했다.'
  },
  {
    word: '간극',
    question: '<span class="word-highlight">간극</span>의 뜻은?',
    hint: '사이의 틈',
    choices: ['일치', '사이의 틈', '합일', '하나'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"간극"은 사이의 틈이나 차이를 의미합니다.',
    example: '예문: 세대 간극이 크다.'
  },
  {
    word: '간섭',
    question: '<span class="word-highlight">간섭</span>의 뜻은?',
    hint: '남의 일에 끼어듦',
    choices: ['방관하다', '남의 일에 끼어들다', '무관심', '내버려두다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"간섭"은 남의 일에 끼어드는 것을 의미합니다.',
    example: '예문: 내정에 간섭해서는 안 된다.'
  },
  {
    word: '간주',
    question: '<span class="word-highlight">간주</span>의 뜻은?',
    hint: '~로 봄',
    choices: ['무시하다', '~로 보다', '외면하다', '넘기다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"간주"는 어떤 것을 ~로 보거나 여기는 것을 의미합니다.',
    example: '예문: 침묵을 동의로 간주했다.'
  },
  {
    word: '갈망',
    question: '<span class="word-highlight">갈망</span>의 뜻은?',
    hint: '몹시 바람',
    choices: ['포기하다', '몹시 바라다', '단념하다', '체념하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"갈망"은 몹시 바라는 것을 의미합니다.',
    example: '예문: 자유를 갈망했다.'
  },
  {
    word: '감수',
    question: '<span class="word-highlight">감수</span>의 뜻은?',
    hint: '달게 받아들임',
    choices: ['거부하다', '달게 받아들이다', '피하다', '회피하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"감수"는 어려움이나 고통을 달게 받아들이는 것을 의미합니다.',
    example: '예문: 위험을 감수했다.'
  },
  {
    word: '감안',
    question: '<span class="word-highlight">감안</span>의 뜻은?',
    hint: '참작하여 생각함',
    choices: ['무시하다', '참작하여 생각하다', '넘기다', '외면하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"감안"은 여러 사정을 참작하여 생각하는 것을 의미합니다.',
    example: '예문: 상황을 감안해야 한다.'
  },
  {
    word: '강화',
    question: '<span class="word-highlight">강화</span>의 뜻은?',
    hint: '더 세게 함',
    choices: ['약화시키다', '더 세게 하다', '줄이다', '낮추다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"강화"는 더 세게 하거나 튼튼하게 하는 것을 의미합니다.',
    example: '예문: 규제를 강화했다.'
  },
  {
    word: '개념',
    question: '<span class="word-highlight">개념</span>의 뜻은?',
    hint: '사물의 본질을 생각한 것',
    choices: ['실체', '사물의 본질을 생각한 것', '물질', '구체적인 것'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"개념"은 사물의 본질을 생각으로 파악한 것을 의미합니다.',
    example: '예문: 개념을 정의했다.'
  },
  {
    word: '개연',
    question: '<span class="word-highlight">개연</span>의 뜻은?',
    hint: '그렇게 될 가능성',
    choices: ['확실함', '그렇게 될 가능성', '필연', '반드시'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"개연"은 그렇게 될 가능성이 있는 것을 의미합니다.',
    example: '예문: 개연성이 높다.'
  },
  {
    word: '개입',
    question: '<span class="word-highlight">개입</span>의 뜻은?',
    hint: '일에 끼어듦',
    choices: ['빠지다', '일에 끼어들다', '물러나다', '피하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"개입"은 어떤 일에 끼어드는 것을 의미합니다.',
    example: '예문: 정부가 개입했다.'
  },
  {
    word: '객관',
    question: '<span class="word-highlight">객관</span>의 뜻은?',
    hint: '주관에 의하지 않고 있는 그대로',
    choices: ['주관', '주관에 의하지 않고 있는 그대로', '개인적', '사적'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"객관"은 주관에 의하지 않고 있는 그대로 보는 것을 의미합니다.',
    example: '예문: 객관적으로 판단해야 한다.'
  },
  {
    word: '거부',
    question: '<span class="word-highlight">거부</span>의 뜻은?',
    hint: '받아들이지 않음',
    choices: ['수용하다', '받아들이지 않다', '받다', '승낙하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"거부"는 받아들이지 않는 것을 의미합니다.',
    example: '예문: 요청을 거부했다.'
  },
  {
    word: '건전',
    question: '<span class="word-highlight">건전</span>의 뜻은?',
    hint: '생각이나 행동이 바르고 건강함',
    choices: ['불건전', '생각이나 행동이 바르고 건강하다', '부정적', '나쁜'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"건전"은 생각이나 행동이 바르고 건강한 것을 의미합니다.',
    example: '예문: 건전한 문화를 만들어야 한다.'
  },
  {
    word: '검증',
    question: '<span class="word-highlight">검증</span>의 뜻은?',
    hint: '검사하여 증명함',
    choices: ['무시하다', '검사하여 증명하다', '넘기다', '생략하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"검증"은 검사하여 증명하는 것을 의미합니다.',
    example: '예문: 실험을 통해 검증했다.'
  },
  {
    word: '격차',
    question: '<span class="word-highlight">격차</span>의 뜻은?',
    hint: '수준이나 등급의 차이',
    choices: ['같음', '수준이나 등급의 차이', '동등', '평등'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"격차"는 수준이나 등급의 차이를 의미합니다.',
    example: '예문: 빈부 격차가 심하다.'
  },
  {
    word: '결여',
    question: '<span class="word-highlight">결여</span>의 뜻은?',
    hint: '있어야 할 것이 없음',
    choices: ['충분하다', '있어야 할 것이 없다', '넉넉하다', '풍부하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"결여"는 있어야 할 것이 없는 것을 의미합니다.',
    example: '예문: 책임감이 결여되어 있다.'
  },
  {
    word: '경감',
    question: '<span class="word-highlight">경감</span>의 뜻은?',
    hint: '줄여서 덜어냄',
    choices: ['늘리다', '줄여서 덜어내다', '증가시키다', '더하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"경감"은 줄여서 덜어내는 것을 의미합니다.',
    example: '예문: 부담을 경감시켰다.'
  },
  {
    word: '경쟁',
    question: '<span class="word-highlight">경쟁</span>의 뜻은?',
    hint: '서로 이기거나 앞서려고 다툼',
    choices: ['협력하다', '서로 이기거나 앞서려고 다투다', '돕다', '양보하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"경쟁"은 같은 목적을 두고 서로 이기거나 앞서려고 다투는 것을 의미합니다.',
    example: '예문: 치열한 경쟁을 펼쳤다.'
  },
  {
    word: '경향',
    question: '<span class="word-highlight">경향</span>의 뜻은?',
    hint: '현상이 어느 방향으로 기울어짐',
    choices: ['고정', '현상이 어느 방향으로 기울어지다', '정체', '변함없음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"경향"은 현상이 어느 방향으로 기울어지는 것을 의미합니다.',
    example: '예문: 그런 경향이 있다.'
  },
  {
    word: '계기',
    question: '<span class="word-highlight">계기</span>의 뜻은?',
    hint: '어떤 일이 일어나게 되는 기회',
    choices: ['결과', '어떤 일이 일어나게 되는 기회', '마무리', '끝'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"계기"는 어떤 일이 일어나게 되는 기회나 원인을 의미합니다.',
    example: '예문: 이것을 계기로 변화가 시작되었다.'
  },
  {
    word: '계층',
    question: '<span class="word-highlight">계층</span>의 뜻은?',
    hint: '사회를 이루는 층',
    choices: ['전체', '사회를 이루는 층', '하나', '통일'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"계층"은 사회를 이루는 층이나 집단을 의미합니다.',
    example: '예문: 다양한 계층이 존재한다.'
  },
  {
    word: '고려',
    question: '<span class="word-highlight">고려</span>의 뜻은?',
    hint: '여러 가지를 생각함',
    choices: ['무시하다', '여러 가지를 생각하다', '넘기다', '간과하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"고려"는 여러 가지를 생각하여 헤아리는 것을 의미합니다.',
    example: '예문: 상황을 고려해야 한다.'
  },
  {
    word: '고유',
    question: '<span class="word-highlight">고유</span>의 뜻은?',
    hint: '본래부터 가지고 있음',
    choices: ['외래', '본래부터 가지고 있다', '들여온', '빌린'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"고유"는 본래부터 가지고 있는 것을 의미합니다.',
    example: '예문: 한국 고유의 문화이다.'
  },
  {
    word: '고정',
    question: '<span class="word-highlight">고정</span>의 뜻은?',
    hint: '한곳에 정해 둠',
    choices: ['변동하다', '한곳에 정해 두다', '움직이다', '바뀌다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"고정"은 한곳에 정해 두어 변하지 않게 하는 것을 의미합니다.',
    example: '예문: 고정 관념을 버려야 한다.'
  },
  {
    word: '공감',
    question: '<span class="word-highlight">공감</span>의 뜻은?',
    hint: '남의 감정을 함께 느낌',
    choices: ['반감', '남의 감정을 함께 느끼다', '반대', '거부'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"공감"은 남의 감정이나 의견을 함께 느끼는 것을 의미합니다.',
    example: '예문: 공감을 얻었다.'
  },
  {
    word: '공유',
    question: '<span class="word-highlight">공유</span>의 뜻은?',
    hint: '함께 가짐',
    choices: ['독점하다', '함께 가지다', '혼자 쓰다', '차지하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"공유"는 함께 가지거나 나누는 것을 의미합니다.',
    example: '예문: 정보를 공유했다.'
  },
  {
    word: '과소',
    question: '<span class="word-highlight">과소</span>의 뜻은?',
    hint: '지나치게 적음',
    choices: ['과다', '지나치게 적다', '넘치다', '많다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"과소"는 지나치게 적은 것을 의미합니다.',
    example: '예문: 과소평가해서는 안 된다.'
  },
  {
    word: '관건',
    question: '<span class="word-highlight">관건</span>의 뜻은?',
    hint: '가장 중요한 것',
    choices: ['사소한 것', '가장 중요한 것', '부수적인 것', '덜 중요한 것'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"관건"은 어떤 일의 가장 중요한 부분을 의미합니다.',
    example: '예문: 성공의 관건은 노력이다.'
  },
  {
    word: '관망',
    question: '<span class="word-highlight">관망</span>의 뜻은?',
    hint: '형세를 살핌',
    choices: ['적극 참여', '형세를 살피다', '뛰어들다', '행동하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"관망"은 적극적으로 참여하지 않고 형세를 살피는 것을 의미합니다.',
    example: '예문: 관망 자세를 취하고 있다.'
  },
  {
    word: '관여',
    question: '<span class="word-highlight">관여</span>의 뜻은?',
    hint: '어떤 일에 관계하여 참견함',
    choices: ['빠지다', '어떤 일에 관계하여 참견하다', '물러나다', '무관하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"관여"는 어떤 일에 관계하여 참견하는 것을 의미합니다.',
    example: '예문: 이 일에 관여하지 마라.'
  },
  {
    word: '관점',
    question: '<span class="word-highlight">관점</span>의 뜻은?',
    hint: '사물을 보는 입장',
    choices: ['보지 않음', '사물을 보는 입장', '무시', '외면'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"관점"은 사물을 보거나 생각하는 입장이나 처지를 의미합니다.',
    example: '예문: 다양한 관점에서 봐야 한다.'
  },
  {
    word: '광범',
    question: '<span class="word-highlight">광범</span>의 뜻은?',
    hint: '범위가 넓음',
    choices: ['좁다', '범위가 넓다', '제한적', '한정적'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"광범"은 범위가 넓은 것을 의미합니다.',
    example: '예문: 광범위하게 퍼졌다.'
  },
  {
    word: '교류',
    question: '<span class="word-highlight">교류</span>의 뜻은?',
    hint: '서로 오고 감',
    choices: ['단절', '서로 오고 가다', '끊기다', '멀어지다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"교류"는 서로 오고 가며 주고받는 것을 의미합니다.',
    example: '예문: 문화 교류가 활발하다.'
  },
  {
    word: '교섭',
    question: '<span class="word-highlight">교섭</span>의 뜻은?',
    hint: '어떤 일을 이루려고 상대와 의논함',
    choices: ['단독 결정', '어떤 일을 이루려고 상대와 의논하다', '일방적 통보', '명령'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"교섭"은 어떤 일을 이루려고 상대와 의논하는 것을 의미합니다.',
    example: '예문: 임금 교섭을 진행했다.'
  },
  {
    word: '구별',
    question: '<span class="word-highlight">구별</span>의 뜻은?',
    hint: '성질이나 종류에 따라 가름',
    choices: ['섞다', '성질이나 종류에 따라 가르다', '합치다', '모으다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"구별"은 성질이나 종류에 따라 가르는 것을 의미합니다.',
    example: '예문: 선악을 구별해야 한다.'
  },
  {
    word: '구성',
    question: '<span class="word-highlight">구성</span>의 뜻은?',
    hint: '몇 가지 부분을 모아 전체를 이룸',
    choices: ['해체하다', '몇 가지 부분을 모아 전체를 이루다', '분해하다', '나누다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"구성"은 몇 가지 부분을 모아 전체를 이루는 것을 의미합니다.',
    example: '예문: 팀을 구성했다.'
  },
  {
    word: '구체',
    question: '<span class="word-highlight">구체</span>의 뜻은?',
    hint: '실제로 일정한 형태를 갖춤',
    choices: ['추상적', '실제로 일정한 형태를 갖추다', '막연하다', '모호하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"구체"는 실제로 일정한 형태를 갖추는 것을 의미합니다.',
    example: '예문: 구체적인 계획이 필요하다.'
  },
  {
    word: '국한',
    question: '<span class="word-highlight">국한</span>의 뜻은?',
    hint: '일정한 범위에 한정함',
    choices: ['확대하다', '일정한 범위에 한정하다', '넓히다', '퍼뜨리다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"국한"은 일정한 범위에 한정하는 것을 의미합니다.',
    example: '예문: 문제가 여기에 국한되지 않는다.'
  },
  {
    word: '권고',
    question: '<span class="word-highlight">권고</span>의 뜻은?',
    hint: '어떤 것을 하도록 권함',
    choices: ['강제하다', '어떤 것을 하도록 권하다', '명령하다', '지시하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"권고"는 어떤 것을 하도록 권하는 것을 의미합니다.',
    example: '예문: 사직을 권고받았다.'
  },
  {
    word: '권장',
    question: '<span class="word-highlight">권장</span>의 뜻은?',
    hint: '권하여 장려함',
    choices: ['금지하다', '권하여 장려하다', '막다', '제한하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"권장"은 권하여 장려하는 것을 의미합니다.',
    example: '예문: 독서를 권장한다.'
  },
  {
    word: '규범',
    question: '<span class="word-highlight">규범</span>의 뜻은?',
    hint: '지켜야 할 본보기',
    choices: ['자유', '지켜야 할 본보기', '무질서', '혼란'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"규범"은 마땅히 지켜야 할 본보기를 의미합니다.',
    example: '예문: 사회적 규범을 따라야 한다.'
  },
  {
    word: '규정',
    question: '<span class="word-highlight">규정</span>의 뜻은?',
    hint: '규칙으로 정함',
    choices: ['풀어주다', '규칙으로 정하다', '자유롭게 하다', '허용하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"규정"은 규칙으로 정하는 것을 의미합니다.',
    example: '예문: 법으로 규정되어 있다.'
  },
  {
    word: '균등',
    question: '<span class="word-highlight">균등</span>의 뜻은?',
    hint: '고르고 같음',
    choices: ['불균등', '고르고 같다', '차별', '차이'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"균등"은 고르고 같은 것을 의미합니다.',
    example: '예문: 기회를 균등하게 주어야 한다.'
  },
  {
    word: '균형',
    question: '<span class="word-highlight">균형</span>의 뜻은?',
    hint: '어느 한쪽으로 치우치지 않음',
    choices: ['편향', '어느 한쪽으로 치우치지 않다', '치우침', '불균형'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"균형"은 어느 한쪽으로 치우치지 않는 것을 의미합니다.',
    example: '예문: 균형 잡힌 시각이 필요하다.'
  },
  {
    word: '근거',
    question: '<span class="word-highlight">근거</span>의 뜻은?',
    hint: '어떤 것의 바탕이나 토대',
    choices: ['막연함', '어떤 것의 바탕이나 토대', '추측', '상상'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"근거"는 어떤 것의 바탕이나 토대가 되는 것을 의미합니다.',
    example: '예문: 근거 없는 주장이다.'
  },
  {
    word: '근본',
    question: '<span class="word-highlight">근본</span>의 뜻은?',
    hint: '사물의 뿌리가 되는 것',
    choices: ['지엽', '사물의 뿌리가 되는 것', '곁가지', '표면'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"근본"은 사물의 뿌리가 되는 본질을 의미합니다.',
    example: '예문: 근본적인 해결이 필요하다.'
  },
  {
    word: '긍정',
    question: '<span class="word-highlight">긍정</span>의 뜻은?',
    hint: '그렇다고 인정함',
    choices: ['부정', '그렇다고 인정하다', '반대', '거부'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"긍정"은 그렇다고 인정하는 것을 의미합니다.',
    example: '예문: 긍정적인 태도가 중요하다.'
  },
  {
    word: '기능',
    question: '<span class="word-highlight">기능</span>의 뜻은?',
    hint: '하는 구실이나 작용',
    choices: ['무용', '하는 구실이나 작용', '쓸모없음', '무가치'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"기능"은 하는 구실이나 작용을 의미합니다.',
    example: '예문: 중요한 기능을 한다.'
  },
  {
    word: '기대',
    question: '<span class="word-highlight">기대</span>의 뜻은?',
    hint: '어떤 일이 이루어지기를 바람',
    choices: ['포기', '어떤 일이 이루어지기를 바라다', '단념', '체념'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"기대"는 어떤 일이 이루어지기를 바라는 것을 의미합니다.',
    example: '예문: 큰 기대를 걸고 있다.'
  },
  {
    word: '기법',
    question: '<span class="word-highlight">기법</span>의 뜻은?',
    hint: '기술적인 방법',
    choices: ['결과', '기술적인 방법', '목표', '목적'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"기법"은 기술적인 방법이나 수법을 의미합니다.',
    example: '예문: 새로운 기법을 적용했다.'
  },
  {
    word: '기술',
    question: '<span class="word-highlight">기술</span>의 뜻은?',
    hint: '사물을 잘 다루는 방법이나 능력',
    choices: ['미숙', '사물을 잘 다루는 방법이나 능력', '서투름', '무능'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"기술"은 사물을 잘 다루는 방법이나 능력을 의미합니다.',
    example: '예문: 기술이 발전했다.'
  },
  {
    word: '기준',
    question: '<span class="word-highlight">기준</span>의 뜻은?',
    hint: '기본이 되는 표준',
    choices: ['예외', '기본이 되는 표준', '변칙', '일탈'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"기준"은 기본이 되는 표준을 의미합니다.',
    example: '예문: 판단의 기준을 세웠다.'
  },
  {
    word: '기초',
    question: '<span class="word-highlight">기초</span>의 뜻은?',
    hint: '사물의 밑바탕',
    choices: ['꼭대기', '사물의 밑바탕', '정상', '상층'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"기초"는 사물의 밑바탕이 되는 것을 의미합니다.',
    example: '예문: 기초를 다져야 한다.'
  },
  {
    word: '기피',
    question: '<span class="word-highlight">기피</span>의 뜻은?',
    hint: '꺼려서 피함',
    choices: ['좋아하다', '꺼려서 피하다', '즐기다', '선호하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"기피"는 꺼려서 피하는 것을 의미합니다.',
    example: '예문: 기피 대상이 되었다.'
  },
  {
    word: '기획',
    question: '<span class="word-highlight">기획</span>의 뜻은?',
    hint: '일을 꾸미어 계획함',
    choices: ['우연', '일을 꾸미어 계획하다', '즉흥', '무계획'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"기획"은 일을 꾸미어 계획하는 것을 의미합니다.',
    example: '예문: 행사를 기획했다.'
  },
  {
    word: '긴밀',
    question: '<span class="word-highlight">긴밀</span>의 뜻은?',
    hint: '빈틈없이 밀접함',
    choices: ['느슨하다', '빈틈없이 밀접하다', '멀다', '소원하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"긴밀"은 빈틈없이 밀접한 것을 의미합니다.',
    example: '예문: 긴밀하게 협력하고 있다.'
  },
  {
    word: '긴박',
    question: '<span class="word-highlight">긴박</span>의 뜻은?',
    hint: '일이 매우 급함',
    choices: ['여유롭다', '일이 매우 급하다', '느긋하다', '한가하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"긴박"은 일이 매우 급하고 다급한 것을 의미합니다.',
    example: '예문: 긴박한 상황이다.'
  },
  {
    word: '긴장',
    question: '<span class="word-highlight">긴장</span>의 뜻은?',
    hint: '마음을 조이고 정신을 바짝 차림',
    choices: ['이완', '마음을 조이고 정신을 바짝 차리다', '느슨하다', '풀리다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"긴장"은 마음을 조이고 정신을 바짝 차리는 것을 의미합니다.',
    example: '예문: 긴장을 풀어라.'
  },
  {
    word: '나열',
    question: '<span class="word-highlight">나열</span>의 뜻은?',
    hint: '죽 벌여 늘어놓음',
    choices: ['정리하다', '죽 벌여 늘어놓다', '요약하다', '압축하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"나열"은 죽 벌여 늘어놓는 것을 의미합니다.',
    example: '예문: 예시를 나열했다.'
  },
  {
    word: '낙관',
    question: '<span class="word-highlight">낙관</span>의 뜻은?',
    hint: '인생이나 사물을 밝게 봄',
    choices: ['비관', '인생이나 사물을 밝게 보다', '암울하게 보다', '부정적으로 보다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"낙관"은 인생이나 사물을 밝고 희망적으로 보는 것을 의미합니다.',
    example: '예문: 낙관적인 전망을 내놓았다.'
  },
  {
    word: '내재',
    question: '<span class="word-highlight">내재</span>의 뜻은?',
    hint: '안에 들어 있음',
    choices: ['외부에 있다', '안에 들어 있다', '드러나다', '밖으로 나오다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"내재"는 안에 들어 있는 것을 의미합니다.',
    example: '예문: 문제가 내재되어 있다.'
  },
  {
    word: '논리',
    question: '<span class="word-highlight">논리</span>의 뜻은?',
    hint: '사물의 이치에 맞는 말이나 글의 줄기',
    choices: ['비논리', '사물의 이치에 맞는 말이나 글의 줄기', '감정', '직감'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"논리"는 사물의 이치에 맞는 말이나 글의 줄기를 의미합니다.',
    example: '예문: 논리적으로 설명했다.'
  },
  {
    word: '논박',
    question: '<span class="word-highlight">논박</span>의 뜻은?',
    hint: '상대의 논리를 비판하며 공격함',
    choices: ['동의하다', '상대의 논리를 비판하며 공격하다', '따르다', '수긍하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"논박"은 상대의 논리를 비판하며 공격하는 것을 의미합니다.',
    example: '예문: 그의 주장을 논박했다.'
  },
  {
    word: '논증',
    question: '<span class="word-highlight">논증</span>의 뜻은?',
    hint: '옳고 그름을 논하여 증명함',
    choices: ['주장만 하다', '옳고 그름을 논하여 증명하다', '추측하다', '상상하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"논증"은 옳고 그름을 논하여 증명하는 것을 의미합니다.',
    example: '예문: 논증 과정이 타당하다.'
  },
  {
    word: '논쟁',
    question: '<span class="word-highlight">논쟁</span>의 뜻은?',
    hint: '서로 다른 의견을 가지고 다툼',
    choices: ['합의', '서로 다른 의견을 가지고 다투다', '화해', '타협'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"논쟁"은 서로 다른 의견을 가지고 다투는 것을 의미합니다.',
    example: '예문: 논쟁이 벌어졌다.'
  },
  {
    word: '단순',
    question: '<span class="word-highlight">단순</span>의 뜻은?',
    hint: '복잡하지 않고 간단함',
    choices: ['복잡하다', '복잡하지 않고 간단하다', '어렵다', '까다롭다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"단순"은 복잡하지 않고 간단한 것을 의미합니다.',
    example: '예문: 단순한 문제가 아니다.'
  },
  {
    word: '단절',
    question: '<span class="word-highlight">단절</span>의 뜻은?',
    hint: '끊어짐',
    choices: ['연결되다', '끊어지다', '이어지다', '계속되다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"단절"은 끊어지는 것을 의미합니다.',
    example: '예문: 세대 간 단절이 심각하다.'
  },
  {
    word: '단정',
    question: '<span class="word-highlight">단정</span>의 뜻은?',
    hint: '확실하게 결정하여 정함',
    choices: ['유보하다', '확실하게 결정하여 정하다', '미루다', '보류하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"단정"은 확실하게 결정하여 정하는 것을 의미합니다.',
    example: '예문: 섣불리 단정 짓지 마라.'
  },
  {
    word: '달성',
    question: '<span class="word-highlight">달성</span>의 뜻은?',
    hint: '목적한 것을 이룸',
    choices: ['실패하다', '목적한 것을 이루다', '포기하다', '단념하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"달성"은 목적한 것을 이루는 것을 의미합니다.',
    example: '예문: 목표를 달성했다.'
  },
  {
    word: '담지',
    question: '<span class="word-highlight">담지</span>의 뜻은?',
    hint: '담아서 지님',
    choices: ['버리다', '담아서 지니다', '없애다', '비우다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"담지"는 담아서 지니는 것을 의미합니다.',
    example: '예문: 의미를 담지하고 있다.'
  },
  {
    word: '대등',
    question: '<span class="word-highlight">대등</span>의 뜻은?',
    hint: '서로 맞먹음',
    choices: ['차이나다', '서로 맞먹다', '달리다', '낮다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"대등"은 수준이나 정도가 서로 맞먹는 것을 의미합니다.',
    example: '예문: 대등한 관계를 유지했다.'
  },
  {
    word: '대립',
    question: '<span class="word-highlight">대립</span>의 뜻은?',
    hint: '서로 반대되는 것이 맞섬',
    choices: ['화합', '서로 반대되는 것이 맞서다', '협력', '조화'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"대립"은 서로 반대되는 것이 맞서는 것을 의미합니다.',
    example: '예문: 의견이 대립되었다.'
  },
  {
    word: '대상',
    question: '<span class="word-highlight">대상</span>의 뜻은?',
    hint: '어떤 일의 목표나 목적이 되는 것',
    choices: ['주체', '어떤 일의 목표나 목적이 되는 것', '행위자', '실행자'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"대상"은 어떤 일의 목표나 목적이 되는 것을 의미합니다.',
    example: '예문: 연구 대상을 선정했다.'
  },
  {
    word: '대처',
    question: '<span class="word-highlight">대처</span>의 뜻은?',
    hint: '어떤 일에 알맞게 행동함',
    choices: ['방치하다', '어떤 일에 알맞게 행동하다', '무시하다', '넘기다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"대처"는 어떤 일에 알맞게 행동하는 것을 의미합니다.',
    example: '예문: 상황에 대처해야 한다.'
  },
  {
    word: '대체',
    question: '<span class="word-highlight">대체</span>의 뜻은?',
    hint: '다른 것으로 바꿈',
    choices: ['유지하다', '다른 것으로 바꾸다', '그대로 두다', '보존하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"대체"는 다른 것으로 바꾸는 것을 의미합니다.',
    example: '예문: 대체 방안을 찾아야 한다.'
  },
  {
    word: '도태',
    question: '<span class="word-highlight">도태</span>의 뜻은?',
    hint: '경쟁에서 뒤져 쓸려 나감',
    choices: ['살아남다', '경쟁에서 뒤져 쓸려 나가다', '성공하다', '앞서다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"도태"는 경쟁에서 뒤져 쓸려 나가는 것을 의미합니다.',
    example: '예문: 적자는 도태된다.'
  },
  {
    word: '독립',
    question: '<span class="word-highlight">독립</span>의 뜻은?',
    hint: '남에게 의지하지 않고 스스로 함',
    choices: ['의존', '남에게 의지하지 않고 스스로 하다', '종속', '예속'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"독립"은 남에게 의지하지 않고 스스로 하는 것을 의미합니다.',
    example: '예문: 경제적으로 독립했다.'
  },
  {
    word: '독창',
    question: '<span class="word-highlight">독창</span>의 뜻은?',
    hint: '혼자 처음으로 생각해 냄',
    choices: ['모방', '혼자 처음으로 생각해 내다', '따라하다', '베끼다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"독창"은 남을 본뜨지 않고 혼자 처음으로 생각해 내는 것을 의미합니다.',
    example: '예문: 독창적인 아이디어이다.'
  },
  {
    word: '돌파',
    question: '<span class="word-highlight">돌파</span>의 뜻은?',
    hint: '장애물을 뚫고 나아감',
    choices: ['막히다', '장애물을 뚫고 나아가다', '좌절하다', '포기하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"돌파"는 장애물을 뚫고 나아가는 것을 의미합니다.',
    example: '예문: 위기를 돌파했다.'
  },
  {
    word: '동기',
    question: '<span class="word-highlight">동기</span>의 뜻은?',
    hint: '어떤 일을 일으키게 하는 원인',
    choices: ['결과', '어떤 일을 일으키게 하는 원인', '마무리', '끝'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"동기"는 어떤 일을 일으키게 하는 원인이나 계기를 의미합니다.',
    example: '예문: 범행 동기를 밝혔다.'
  },
  {
    word: '동반',
    question: '<span class="word-highlight">동반</span>의 뜻은?',
    hint: '함께 따름',
    choices: ['혼자 가다', '함께 따르다', '떠나다', '분리되다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"동반"은 함께 따르는 것을 의미합니다.',
    example: '예문: 성장을 동반하는 발전이다.'
  },
  {
    word: '동시',
    question: '<span class="word-highlight">동시</span>의 뜻은?',
    hint: '같은 때',
    choices: ['다른 때', '같은 때', '이전', '이후'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"동시"는 같은 때나 시간을 의미합니다.',
    example: '예문: 동시에 진행된다.'
  },
  {
    word: '동일',
    question: '<span class="word-highlight">동일</span>의 뜻은?',
    hint: '같음',
    choices: ['다르다', '같다', '차이나다', '별개'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"동일"은 같은 것을 의미합니다.',
    example: '예문: 동일한 조건이다.'
  },
  {
    word: '동질',
    question: '<span class="word-highlight">동질</span>의 뜻은?',
    hint: '같은 성질',
    choices: ['이질', '같은 성질', '다른 성질', '차이'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"동질"은 같은 성질을 의미합니다.',
    example: '예문: 동질성을 회복해야 한다.'
  },
  {
    word: '동화',
    question: '<span class="word-highlight">동화</span>의 뜻은?',
    hint: '닮아서 같아짐',
    choices: ['차이나다', '닮아서 같아지다', '달라지다', '구별되다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"동화"는 서로 닮아서 같아지는 것을 의미합니다.',
    example: '예문: 현지 문화에 동화되었다.'
  }
];

  // ===== 401~500번 어휘 =====
  {
    word: '득실',
    question: '<span class="word-highlight">득실</span>의 뜻은?',
    hint: '이익과 손해',
    choices: ['이익만', '이익과 손해', '손해만', '중립'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"득실"은 이익과 손해를 의미합니다.',
    example: '예문: 득실을 따져봐야 한다.'
  },
  {
    word: '명맥',
    question: '<span class="word-highlight">명맥</span>의 뜻은?',
    hint: '이어지는 혈통이나 계통',
    choices: ['끊어짐', '이어지는 혈통이나 계통', '단절', '소멸'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"명맥"은 이어지는 혈통이나 계통을 의미합니다.',
    example: '예문: 명맥을 유지하고 있다.'
  },
  {
    word: '목도',
    question: '<span class="word-highlight">목도</span>의 뜻은?',
    hint: '직접 눈으로 봄',
    choices: ['듣다', '직접 눈으로 보다', '상상하다', '추측하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"목도"는 직접 눈으로 보는 것을 의미합니다.',
    example: '예문: 그 장면을 목도했다.'
  },
  {
    word: '무분별',
    question: '<span class="word-highlight">무분별</span>의 뜻은?',
    hint: '분별력이 없음',
    choices: ['신중하다', '분별력이 없다', '조심스럽다', '생각이 깊다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"무분별"은 분별력이 없는 것을 의미합니다.',
    example: '예문: 무분별한 개발이 문제다.'
  },
  {
    word: '물색',
    question: '<span class="word-highlight">물색</span>의 뜻은?',
    hint: '여기저기 살펴서 찾음',
    choices: ['포기하다', '여기저기 살펴서 찾다', '무시하다', '넘기다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"물색"은 여기저기 살펴서 찾는 것을 의미합니다.',
    example: '예문: 후보를 물색 중이다.'
  },
  {
    word: '민감',
    question: '<span class="word-highlight">민감</span>의 뜻은?',
    hint: '자극에 빨리 반응함',
    choices: ['둔감하다', '자극에 빨리 반응하다', '무관심', '무반응'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"민감"은 자극에 빨리 반응하는 것을 의미합니다.',
    example: '예문: 민감한 문제이다.'
  },
  {
    word: '밀접',
    question: '<span class="word-highlight">밀접</span>의 뜻은?',
    hint: '아주 가깝게 맞닿음',
    choices: ['멀다', '아주 가깝게 맞닿다', '떨어지다', '분리되다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"밀접"은 아주 가깝게 맞닿아 있는 것을 의미합니다.',
    example: '예문: 밀접한 관계가 있다.'
  },
  {
    word: '박탈',
    question: '<span class="word-highlight">박탈</span>의 뜻은?',
    hint: '남의 것을 강제로 빼앗음',
    choices: ['주다', '남의 것을 강제로 빼앗다', '돌려주다', '나누다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"박탈"은 남의 것을 강제로 빼앗는 것을 의미합니다.',
    example: '예문: 권리를 박탈당했다.'
  },
  {
    word: '발휘',
    question: '<span class="word-highlight">발휘</span>의 뜻은?',
    hint: '재능이나 힘을 충분히 나타냄',
    choices: ['감추다', '재능이나 힘을 충분히 나타내다', '숨기다', '억누르다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"발휘"는 재능이나 힘을 충분히 나타내는 것을 의미합니다.',
    example: '예문: 실력을 발휘했다.'
  },
  {
    word: '방관',
    question: '<span class="word-highlight">방관</span>의 뜻은?',
    hint: '곁에서 보기만 하고 간섭하지 않음',
    choices: ['참여하다', '곁에서 보기만 하고 간섭하지 않다', '적극 개입', '행동하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"방관"은 곁에서 보기만 하고 간섭하지 않는 것을 의미합니다.',
    example: '예문: 방관자로 남았다.'
  },
  {
    word: '방지',
    question: '<span class="word-highlight">방지</span>의 뜻은?',
    hint: '막아서 일어나지 않게 함',
    choices: ['방치하다', '막아서 일어나지 않게 하다', '내버려두다', '무시하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"방지"는 막아서 일어나지 않게 하는 것을 의미합니다.',
    example: '예문: 사고를 방지해야 한다.'
  },
  {
    word: '복원',
    question: '<span class="word-highlight">복원</span>의 뜻은?',
    hint: '원래대로 되돌림',
    choices: ['파괴하다', '원래대로 되돌리다', '바꾸다', '변형하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"복원"은 원래대로 되돌리는 것을 의미합니다.',
    example: '예문: 생태계를 복원했다.'
  },
  {
    word: '본말',
    question: '<span class="word-highlight">본말</span>의 뜻은?',
    hint: '근본과 지엽',
    choices: ['전부 같다', '근본과 지엽', '중요한 것만', '사소한 것만'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"본말"은 근본이 되는 것과 지엽적인 것을 의미합니다.',
    example: '예문: 본말이 전도되었다.'
  },
  {
    word: '본질',
    question: '<span class="word-highlight">본질</span>의 뜻은?',
    hint: '사물의 근본 바탕',
    choices: ['겉모습', '사물의 근본 바탕', '표면', '외관'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"본질"은 사물의 근본적인 바탕이나 성질을 의미합니다.',
    example: '예문: 문제의 본질을 파악했다.'
  },
  {
    word: '봉착',
    question: '<span class="word-highlight">봉착</span>의 뜻은?',
    hint: '어려운 상황에 부딪힘',
    choices: ['피하다', '어려운 상황에 부딪치다', '넘기다', '회피하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"봉착"은 어려운 상황에 부딪히는 것을 의미합니다.',
    example: '예문: 난관에 봉착했다.'
  },
  {
    word: '부응',
    question: '<span class="word-highlight">부응</span>의 뜻은?',
    hint: '기대나 요구에 맞게 응함',
    choices: ['거부하다', '기대나 요구에 맞게 응하다', '무시하다', '외면하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"부응"은 기대나 요구에 맞게 응하는 것을 의미합니다.',
    example: '예문: 기대에 부응했다.'
  },
  {
    word: '부정',
    question: '<span class="word-highlight">부정</span>의 뜻은?',
    hint: '옳지 않다고 함',
    choices: ['긍정', '옳지 않다고 하다', '찬성', '동의'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"부정"은 옳지 않다고 하는 것을 의미합니다.',
    example: '예문: 그 사실을 부정했다.'
  },
  {
    word: '부조리',
    question: '<span class="word-highlight">부조리</span>의 뜻은?',
    hint: '이치에 맞지 않음',
    choices: ['합리적', '이치에 맞지 않다', '논리적', '타당하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"부조리"는 이치에 맞지 않는 것을 의미합니다.',
    example: '예문: 사회의 부조리를 비판했다.'
  },
  {
    word: '부진',
    question: '<span class="word-highlight">부진</span>의 뜻은?',
    hint: '발전하지 못하고 침체됨',
    choices: ['활발하다', '발전하지 못하고 침체되다', '번성하다', '성장하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"부진"은 발전하지 못하고 침체된 것을 의미합니다.',
    example: '예문: 경기가 부진하다.'
  },
  {
    word: '부차',
    question: '<span class="word-highlight">부차</span>의 뜻은?',
    hint: '주된 것에 딸린 것',
    choices: ['주된 것', '주된 것에 딸린 것', '핵심', '본질'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"부차"는 주된 것에 딸린 부수적인 것을 의미합니다.',
    example: '예문: 부차적인 문제이다.'
  },
  {
    word: '부흥',
    question: '<span class="word-highlight">부흥</span>의 뜻은?',
    hint: '쇠퇴했던 것이 다시 일어남',
    choices: ['쇠퇴하다', '쇠퇴했던 것이 다시 일어나다', '몰락하다', '멸망하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"부흥"은 쇠퇴했던 것이 다시 일어나는 것을 의미합니다.',
    example: '예문: 문화가 부흥했다.'
  },
  {
    word: '분담',
    question: '<span class="word-highlight">분담</span>의 뜻은?',
    hint: '나누어 맡음',
    choices: ['혼자 맡다', '나누어 맡다', '독점하다', '차지하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"분담"은 나누어 맡는 것을 의미합니다.',
    example: '예문: 역할을 분담했다.'
  },
  {
    word: '분리',
    question: '<span class="word-highlight">분리</span>의 뜻은?',
    hint: '나누어 떼어 놓음',
    choices: ['합치다', '나누어 떼어 놓다', '붙이다', '연결하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"분리"는 나누어 떼어 놓는 것을 의미합니다.',
    example: '예문: 쓰레기를 분리해야 한다.'
  },
  {
    word: '분명',
    question: '<span class="word-highlight">분명</span>의 뜻은?',
    hint: '확실하고 틀림없음',
    choices: ['모호하다', '확실하고 틀림없다', '불분명', '애매하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"분명"은 확실하고 틀림없는 것을 의미합니다.',
    example: '예문: 분명한 사실이다.'
  },
  {
    word: '분산',
    question: '<span class="word-highlight">분산</span>의 뜻은?',
    hint: '나뉘어 흩어짐',
    choices: ['집중하다', '나뉘어 흩어지다', '모이다', '뭉치다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"분산"은 나뉘어 흩어지는 것을 의미합니다.',
    example: '예문: 관심이 분산되었다.'
  },
  {
    word: '분야',
    question: '<span class="word-highlight">분야</span>의 뜻은?',
    hint: '활동이나 연구의 범위',
    choices: ['전체', '활동이나 연구의 범위', '통합', '하나'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"분야"는 활동이나 연구의 범위를 의미합니다.',
    example: '예문: 다양한 분야에서 활동한다.'
  },
  {
    word: '분쟁',
    question: '<span class="word-highlight">분쟁</span>의 뜻은?',
    hint: '갈라져 다툼',
    choices: ['화해', '갈라져 다투다', '화합', '협력'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"분쟁"은 갈라져 다투는 것을 의미합니다.',
    example: '예문: 분쟁이 발생했다.'
  },
  {
    word: '분포',
    question: '<span class="word-highlight">분포</span>의 뜻은?',
    hint: '일정한 범위에 흩어져 있음',
    choices: ['한곳에 모이다', '일정한 범위에 흩어져 있다', '집중되다', '모여있다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"분포"는 일정한 범위에 흩어져 있는 것을 의미합니다.',
    example: '예문: 전국에 분포해 있다.'
  },
  {
    word: '불가피',
    question: '<span class="word-highlight">불가피</span>의 뜻은?',
    hint: '피할 수 없음',
    choices: ['피할 수 있다', '피할 수 없다', '선택 가능', '자유롭다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"불가피"는 피할 수 없는 것을 의미합니다.',
    example: '예문: 불가피한 선택이었다.'
  },
  {
    word: '불변',
    question: '<span class="word-highlight">불변</span>의 뜻은?',
    hint: '변하지 않음',
    choices: ['변하다', '변하지 않다', '달라지다', '바뀌다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"불변"은 변하지 않는 것을 의미합니다.',
    example: '예문: 불변의 진리이다.'
  },
  {
    word: '비례',
    question: '<span class="word-highlight">비례</span>의 뜻은?',
    hint: '한쪽이 늘면 다른 쪽도 같은 비율로 늘어남',
    choices: ['반비례', '한쪽이 늘면 다른 쪽도 같은 비율로 늘어나다', '무관하다', '상관없다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"비례"는 한쪽이 늘면 다른 쪽도 같은 비율로 늘어나는 것을 의미합니다.',
    example: '예문: 노력에 비례하여 성과가 나온다.'
  },
  {
    word: '비롯',
    question: '<span class="word-highlight">비롯</span>의 뜻은?',
    hint: '처음 시작됨',
    choices: ['끝나다', '처음 시작되다', '마무리', '종료'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"비롯"은 처음 시작되는 것을 의미합니다.',
    example: '예문: 여기에서 비롯되었다.'
  },
  {
    word: '비약',
    question: '<span class="word-highlight">비약</span>의 뜻은?',
    hint: '갑자기 크게 발전함',
    choices: ['정체되다', '갑자기 크게 발전하다', '침체되다', '후퇴하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"비약"은 갑자기 크게 발전하는 것을 의미합니다.',
    example: '예문: 비약적인 성장을 이루었다.'
  },
  {
    word: '사양',
    question: '<span class="word-highlight">사양</span>의 뜻은?',
    hint: '겸손하게 거절함',
    choices: ['수락하다', '겸손하게 거절하다', '받다', '요구하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"사양"은 겸손하게 거절하는 것을 의미합니다.',
    example: '예문: 제안을 사양했다.'
  },
  {
    word: '산발',
    question: '<span class="word-highlight">산발</span>의 뜻은?',
    hint: '여기저기 흩어져 일어남',
    choices: ['집중되다', '여기저기 흩어져 일어나다', '모이다', '뭉치다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"산발"은 여기저기 흩어져 일어나는 것을 의미합니다.',
    example: '예문: 산발적으로 발생했다.'
  },
  {
    word: '산재',
    question: '<span class="word-highlight">산재</span>의 뜻은?',
    hint: '흩어져 있음',
    choices: ['모여있다', '흩어져 있다', '집중되다', '한곳에 있다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"산재"는 흩어져 있는 것을 의미합니다.',
    example: '예문: 문제가 산재해 있다.'
  },
  {
    word: '상당',
    question: '<span class="word-highlight">상당</span>의 뜻은?',
    hint: '꽤 많음',
    choices: ['적다', '꽤 많다', '부족하다', '모자라다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"상당"은 꽤 많거나 정도가 높은 것을 의미합니다.',
    example: '예문: 상당한 비용이 들었다.'
  },
  {
    word: '상쇄',
    question: '<span class="word-highlight">상쇄</span>의 뜻은?',
    hint: '서로 덜어서 없앰',
    choices: ['늘리다', '서로 덜어서 없애다', '더하다', '증가시키다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"상쇄"는 서로 덜어서 없애는 것을 의미합니다.',
    example: '예문: 손실을 상쇄시켰다.'
  },
  {
    word: '상응',
    question: '<span class="word-highlight">상응</span>의 뜻은?',
    hint: '서로 알맞게 응함',
    choices: ['맞지 않다', '서로 알맞게 응하다', '어긋나다', '다르다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"상응"은 서로 알맞게 응하는 것을 의미합니다.',
    example: '예문: 노력에 상응하는 보상을 받았다.'
  },
  {
    word: '상이',
    question: '<span class="word-highlight">상이</span>의 뜻은?',
    hint: '서로 다름',
    choices: ['같다', '서로 다르다', '동일하다', '일치하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"상이"는 서로 다른 것을 의미합니다.',
    example: '예문: 견해가 상이하다.'
  },
  {
    word: '상정',
    question: '<span class="word-highlight">상정</span>의 뜻은?',
    hint: '어떤 상황을 가정함',
    choices: ['사실로 확정', '어떤 상황을 가정하다', '확인하다', '검증하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"상정"은 어떤 상황을 가정하는 것을 의미합니다.',
    example: '예문: 최악의 상황을 상정했다.'
  },
  {
    word: '선도',
    question: '<span class="word-highlight">선도</span>의 뜻은?',
    hint: '앞장서서 이끎',
    choices: ['따라가다', '앞장서서 이끌다', '뒤따르다', '따르다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"선도"는 앞장서서 이끄는 것을 의미합니다.',
    example: '예문: 기술을 선도하고 있다.'
  },
  {
    word: '선발',
    question: '<span class="word-highlight">선발</span>의 뜻은?',
    hint: '가려서 뽑음',
    choices: ['모두 뽑다', '가려서 뽑다', '전부 받다', '다 수용하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"선발"은 가려서 뽑는 것을 의미합니다.',
    example: '예문: 대표를 선발했다.'
  },
  {
    word: '선별',
    question: '<span class="word-highlight">선별</span>의 뜻은?',
    hint: '가려서 따로 나눔',
    choices: ['섞다', '가려서 따로 나누다', '합치다', '뭉치다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"선별"은 가려서 따로 나누는 것을 의미합니다.',
    example: '예문: 정보를 선별해야 한다.'
  },
  {
    word: '선정',
    question: '<span class="word-highlight">선정</span>의 뜻은?',
    hint: '가려서 정함',
    choices: ['무작위', '가려서 정하다', '아무거나', '임의로'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"선정"은 가려서 정하는 것을 의미합니다.',
    example: '예문: 후보를 선정했다.'
  },
  {
    word: '선제',
    question: '<span class="word-highlight">선제</span>의 뜻은?',
    hint: '먼저 제압함',
    choices: ['뒤따르다', '먼저 제압하다', '반응하다', '대응하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"선제"는 먼저 제압하는 것을 의미합니다.',
    example: '예문: 선제 공격을 했다.'
  },
  {
    word: '선호',
    question: '<span class="word-highlight">선호</span>의 뜻은?',
    hint: '다른 것보다 더 좋아함',
    choices: ['싫어하다', '다른 것보다 더 좋아하다', '기피하다', '멀리하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"선호"는 다른 것보다 더 좋아하는 것을 의미합니다.',
    example: '예문: 그것을 선호한다.'
  },
  {
    word: '설정',
    question: '<span class="word-highlight">설정</span>의 뜻은?',
    hint: '새로 마련하여 정함',
    choices: ['없애다', '새로 마련하여 정하다', '제거하다', '삭제하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"설정"은 새로 마련하여 정하는 것을 의미합니다.',
    example: '예문: 목표를 설정했다.'
  },
  {
    word: '섭취',
    question: '<span class="word-highlight">섭취</span>의 뜻은?',
    hint: '음식물을 먹어서 몸에 받아들임',
    choices: ['배출하다', '음식물을 먹어서 몸에 받아들이다', '내보내다', '버리다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"섭취"는 음식물을 먹어서 몸에 받아들이는 것을 의미합니다.',
    example: '예문: 영양소를 섭취했다.'
  },
  {
    word: '성찰',
    question: '<span class="word-highlight">성찰</span>의 뜻은?',
    hint: '자기의 마음을 반성함',
    choices: ['외면하다', '자기의 마음을 반성하다', '무시하다', '넘기다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"성찰"은 자기의 마음을 반성하고 살피는 것을 의미합니다.',
    example: '예문: 깊은 성찰이 필요하다.'
  },
  {
    word: '소급',
    question: '<span class="word-highlight">소급</span>의 뜻은?',
    hint: '지나간 과거에 거슬러 올라감',
    choices: ['미래로 가다', '지나간 과거에 거슬러 올라가다', '앞으로 가다', '전진하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"소급"은 지나간 과거에 거슬러 올라가는 것을 의미합니다.',
    example: '예문: 소급 적용되지 않는다.'
  },
  {
    word: '소극',
    question: '<span class="word-highlight">소극</span>의 뜻은?',
    hint: '스스로 나서지 않음',
    choices: ['적극적', '스스로 나서지 않다', '능동적', '활발하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"소극"은 스스로 나서지 않는 것을 의미합니다.',
    example: '예문: 소극적인 태도이다.'
  },
  {
    word: '소산',
    question: '<span class="word-highlight">소산</span>의 뜻은?',
    hint: '생겨난 결과물',
    choices: ['원인', '생겨난 결과물', '시작', '출발'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"소산"은 생겨난 결과물을 의미합니다.',
    example: '예문: 노력의 소산이다.'
  },
  {
    word: '소용',
    question: '<span class="word-highlight">소용</span>의 뜻은?',
    hint: '쓸모',
    choices: ['쓸모없음', '쓸모', '무용', '무가치'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"소용"은 쓸모나 효과를 의미합니다.',
    example: '예문: 소용이 없다.'
  },
  {
    word: '소재',
    question: '<span class="word-highlight">소재</span>의 뜻은?',
    hint: '있는 곳 또는 재료',
    choices: ['없다', '있는 곳 또는 재료', '사라지다', '부재'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"소재"는 있는 곳 또는 재료를 의미합니다.',
    example: '예문: 작품의 소재가 되었다.'
  },
  {
    word: '소지',
    question: '<span class="word-highlight">소지</span>의 뜻은?',
    hint: '가지고 있음 또는 가능성',
    choices: ['없다', '가지고 있다 또는 가능성', '부재', '불가능'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"소지"는 가지고 있거나 가능성이 있는 것을 의미합니다.',
    example: '예문: 오해의 소지가 있다.'
  },
  {
    word: '소통',
    question: '<span class="word-highlight">소통</span>의 뜻은?',
    hint: '막힘없이 통함',
    choices: ['단절', '막힘없이 통하다', '차단', '막히다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"소통"은 막힘없이 통하는 것을 의미합니다.',
    example: '예문: 소통이 중요하다.'
  },
  {
    word: '손상',
    question: '<span class="word-highlight">손상</span>의 뜻은?',
    hint: '해를 입어 상함',
    choices: ['완전하다', '해를 입어 상하다', '온전하다', '멀쩡하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"손상"은 해를 입어 상하는 것을 의미합니다.',
    example: '예문: 명예가 손상되었다.'
  },
  {
    word: '송두리째',
    question: '<span class="word-highlight">송두리째</span>의 뜻은?',
    hint: '한꺼번에 모조리',
    choices: ['일부만', '한꺼번에 모조리', '조금', '약간'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"송두리째"는 한꺼번에 모조리 전부를 의미합니다.',
    example: '예문: 송두리째 잃었다.'
  },
  {
    word: '쇄신',
    question: '<span class="word-highlight">쇄신</span>의 뜻은?',
    hint: '낡은 것을 새롭게 고침',
    choices: ['그대로 두다', '낡은 것을 새롭게 고치다', '유지하다', '보존하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"쇄신"은 낡은 것을 새롭게 고치는 것을 의미합니다.',
    example: '예문: 조직을 쇄신했다.'
  },
  {
    word: '수립',
    question: '<span class="word-highlight">수립</span>의 뜻은?',
    hint: '계획이나 제도를 세움',
    choices: ['허물다', '계획이나 제도를 세우다', '무너뜨리다', '폐지하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"수립"은 계획이나 제도를 세우는 것을 의미합니다.',
    example: '예문: 계획을 수립했다.'
  },
  {
    word: '수반',
    question: '<span class="word-highlight">수반</span>의 뜻은?',
    hint: '어떤 일과 함께 따름',
    choices: ['따로 일어나다', '어떤 일과 함께 따르다', '별개이다', '무관하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"수반"은 어떤 일과 함께 따르는 것을 의미합니다.',
    example: '예문: 고통이 수반된다.'
  },
  {
    word: '수월',
    question: '<span class="word-highlight">수월</span>의 뜻은?',
    hint: '일이 힘들지 않고 쉬움',
    choices: ['어렵다', '일이 힘들지 않고 쉽다', '힘들다', '곤란하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"수월"은 일이 힘들지 않고 쉬운 것을 의미합니다.',
    example: '예문: 일이 수월해졌다.'
  },
  {
    word: '수정',
    question: '<span class="word-highlight">수정</span>의 뜻은?',
    hint: '고쳐서 바로잡음',
    choices: ['그대로 두다', '고쳐서 바로잡다', '유지하다', '놔두다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"수정"은 고쳐서 바로잡는 것을 의미합니다.',
    example: '예문: 계획을 수정했다.'
  },
  {
    word: '수치',
    question: '<span class="word-highlight">수치</span>의 뜻은?',
    hint: '수로 나타낸 값',
    choices: ['감정', '수로 나타낸 값', '느낌', '인상'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"수치"는 수로 나타낸 값을 의미합니다.',
    example: '예문: 정확한 수치가 필요하다.'
  },
  {
    word: '수행',
    question: '<span class="word-highlight">수행</span>의 뜻은?',
    hint: '일을 해냄',
    choices: ['포기하다', '일을 해내다', '중단하다', '그만두다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"수행"은 일을 해내는 것을 의미합니다.',
    example: '예문: 임무를 수행했다.'
  },
  {
    word: '숙고',
    question: '<span class="word-highlight">숙고</span>의 뜻은?',
    hint: '깊이 생각함',
    choices: ['대충 생각하다', '깊이 생각하다', '가볍게 넘기다', '무시하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"숙고"는 깊이 생각하는 것을 의미합니다.',
    example: '예문: 숙고 끝에 결정했다.'
  },
  {
    word: '숙지',
    question: '<span class="word-highlight">숙지</span>의 뜻은?',
    hint: '잘 알아 익힘',
    choices: ['모르다', '잘 알아 익히다', '잊다', '무시하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"숙지"는 잘 알아 익히는 것을 의미합니다.',
    example: '예문: 내용을 숙지해야 한다.'
  },
  {
    word: '순환',
    question: '<span class="word-highlight">순환</span>의 뜻은?',
    hint: '돌고 돎',
    choices: ['멈추다', '돌고 돌다', '정지하다', '끝나다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"순환"은 돌고 도는 것을 의미합니다.',
    example: '예문: 혈액이 순환한다.'
  },
  {
    word: '시도',
    question: '<span class="word-highlight">시도</span>의 뜻은?',
    hint: '어떤 일을 해 봄',
    choices: ['포기하다', '어떤 일을 해 보다', '단념하다', '그만두다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"시도"는 어떤 일을 해 보는 것을 의미합니다.',
    example: '예문: 새로운 시도를 했다.'
  },
  {
    word: '시사점',
    question: '<span class="word-highlight">시사점</span>의 뜻은?',
    hint: '알려주는 바',
    choices: ['무의미', '알려주는 바', '쓸모없음', '무가치'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"시사점"은 어떤 것이 알려주는 바나 의미를 말합니다.',
    example: '예문: 중요한 시사점을 준다.'
  },
  {
    word: '시행',
    question: '<span class="word-highlight">시행</span>의 뜻은?',
    hint: '실제로 행함',
    choices: ['계획만 하다', '실제로 행하다', '구상하다', '머릿속에만'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"시행"은 실제로 행하는 것을 의미합니다.',
    example: '예문: 정책을 시행했다.'
  },
  {
    word: '신뢰',
    question: '<span class="word-highlight">신뢰</span>의 뜻은?',
    hint: '굳게 믿고 의지함',
    choices: ['의심하다', '굳게 믿고 의지하다', '불신하다', '의혹을 품다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"신뢰"는 굳게 믿고 의지하는 것을 의미합니다.',
    example: '예문: 신뢰 관계를 쌓았다.'
  },
  {
    word: '신속',
    question: '<span class="word-highlight">신속</span>의 뜻은?',
    hint: '매우 빠름',
    choices: ['느리다', '매우 빠르다', '더디다', '늦다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"신속"은 매우 빠른 것을 의미합니다.',
    example: '예문: 신속하게 처리했다.'
  },
  {
    word: '실용',
    question: '<span class="word-highlight">실용</span>의 뜻은?',
    hint: '실제로 쓰기에 알맞음',
    choices: ['비실용적', '실제로 쓰기에 알맞다', '쓸모없다', '무용하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"실용"은 실제로 쓰기에 알맞은 것을 의미합니다.',
    example: '예문: 실용적인 제품이다.'
  },
  {
    word: '실천',
    question: '<span class="word-highlight">실천</span>의 뜻은?',
    hint: '생각한 것을 실제로 행함',
    choices: ['생각만 하다', '생각한 것을 실제로 행하다', '계획만 하다', '구상만'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"실천"은 생각한 것을 실제로 행하는 것을 의미합니다.',
    example: '예문: 실천이 중요하다.'
  },
  {
    word: '실현',
    question: '<span class="word-highlight">실현</span>의 뜻은?',
    hint: '꿈이나 계획을 실제로 이룸',
    choices: ['포기하다', '꿈이나 계획을 실제로 이루다', '단념하다', '실패하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"실현"은 꿈이나 계획을 실제로 이루는 것을 의미합니다.',
    example: '예문: 꿈을 실현했다.'
  },
  {
    word: '심각',
    question: '<span class="word-highlight">심각</span>의 뜻은?',
    hint: '정도가 매우 깊고 무거움',
    choices: ['가볍다', '정도가 매우 깊고 무겁다', '사소하다', '별것 아니다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"심각"은 정도가 매우 깊고 무거운 것을 의미합니다.',
    example: '예문: 심각한 문제이다.'
  },
  {
    word: '심리',
    question: '<span class="word-highlight">심리</span>의 뜻은?',
    hint: '마음의 작용이나 상태',
    choices: ['행동', '마음의 작용이나 상태', '외적인 것', '겉모습'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"심리"는 마음의 작용이나 상태를 의미합니다.',
    example: '예문: 심리 상태가 불안하다.'
  },
  {
    word: '심의',
    question: '<span class="word-highlight">심의</span>의 뜻은?',
    hint: '자세히 조사하여 토의함',
    choices: ['대충 보다', '자세히 조사하여 토의하다', '무시하다', '넘기다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"심의"는 자세히 조사하여 토의하는 것을 의미합니다.',
    example: '예문: 심의를 거쳤다.'
  },
  {
    word: '아울러',
    question: '<span class="word-highlight">아울러</span>의 뜻은?',
    hint: '함께',
    choices: ['따로', '함께', '별도로', '분리해서'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"아울러"는 함께 또는 더불어를 의미합니다.',
    example: '예문: 아울러 감사드립니다.'
  },
  {
    word: '악용',
    question: '<span class="word-highlight">악용</span>의 뜻은?',
    hint: '나쁜 목적에 이용함',
    choices: ['올바르게 쓰다', '나쁜 목적에 이용하다', '선용하다', '좋게 쓰다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"악용"은 나쁜 목적에 이용하는 것을 의미합니다.',
    example: '예문: 제도를 악용했다.'
  },
  {
    word: '안주',
    question: '<span class="word-highlight">안주</span>의 뜻은?',
    hint: '편안하게 머물러 있음',
    choices: ['발전하다', '편안하게 머물러 있다', '나아가다', '도전하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"안주"는 편안하게 머물러 있는 것을 의미합니다.',
    example: '예문: 현실에 안주해서는 안 된다.'
  },
  {
    word: '압도',
    question: '<span class="word-highlight">압도</span>의 뜻은?',
    hint: '기세로 눌러 제압함',
    choices: ['지다', '기세로 눌러 제압하다', '밀리다', '패하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"압도"는 기세로 눌러 제압하는 것을 의미합니다.',
    example: '예문: 상대를 압도했다.'
  },
  {
    word: '압축',
    question: '<span class="word-highlight">압축</span>의 뜻은?',
    hint: '내용을 줄임',
    choices: ['늘리다', '내용을 줄이다', '확대하다', '펼치다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"압축"은 내용을 줄이는 것을 의미합니다.',
    example: '예문: 내용을 압축했다.'
  },
  // 501~600번 어휘
  {
    word: '애매',
    question: '<span class="word-highlight">애매</span>의 뜻은?',
    hint: '분명하지 않음',
    choices: ['명확하다', '분명하지 않다', '확실하다', '뚜렷하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"애매"는 분명하지 않은 것을 의미합니다.',
    example: '예문: 애매한 표현이다.'
  },
  {
    word: '양상',
    question: '<span class="word-highlight">양상</span>의 뜻은?',
    hint: '상태나 모양',
    choices: ['내용', '상태나 모양', '결과', '원인'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"양상"은 사물이나 현상의 상태나 모양을 의미합니다.',
    example: '예문: 새로운 양상이 나타났다.'
  },
  {
    word: '양식',
    question: '<span class="word-highlight">양식</span>의 뜻은?',
    hint: '일정한 형식이나 방식',
    choices: ['내용', '일정한 형식이나 방식', '음식', '재료'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"양식"은 일정한 형식이나 방식을 의미합니다.',
    example: '예문: 서양 양식의 건물이다.'
  },
  {
    word: '양심',
    question: '<span class="word-highlight">양심</span>의 뜻은?',
    hint: '옳고 그름을 판단하는 마음',
    choices: ['무관심', '옳고 그름을 판단하는 마음', '욕심', '이기심'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"양심"은 옳고 그름을 판단하는 마음을 의미합니다.',
    example: '예문: 양심에 따라 행동했다.'
  },
  {
    word: '양보',
    question: '<span class="word-highlight">양보</span>의 뜻은?',
    hint: '자기 것을 다른 사람에게 미룸',
    choices: ['고집하다', '자기 것을 다른 사람에게 미루다', '빼앗다', '차지하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"양보"는 자기 것을 다른 사람에게 미루는 것을 의미합니다.',
    example: '예문: 자리를 양보했다.'
  },
  {
    word: '양산',
    question: '<span class="word-highlight">양산</span>의 뜻은?',
    hint: '대량으로 생산함',
    choices: ['소량 생산', '대량으로 생산하다', '중단하다', '수입하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"양산"은 대량으로 생산하는 것을 의미합니다.',
    example: '예문: 제품을 양산하다.'
  },
  {
    word: '양적',
    question: '<span class="word-highlight">양적</span>의 뜻은?',
    hint: '분량에 관한',
    choices: ['질에 관한', '분량에 관한', '형태에 관한', '색에 관한'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"양적"은 분량에 관한 것을 의미합니다.',
    example: '예문: 양적 성장을 이루었다.'
  },
  {
    word: '어긋나다',
    question: '<span class="word-highlight">어긋나다</span>의 뜻은?',
    hint: '서로 맞지 않다',
    choices: ['맞다', '서로 맞지 않다', '일치하다', '부합하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"어긋나다"는 서로 맞지 않는 것을 의미합니다.',
    example: '예문: 예상이 어긋났다.'
  },
  {
    word: '억압',
    question: '<span class="word-highlight">억압</span>의 뜻은?',
    hint: '강제로 누름',
    choices: ['자유롭게 하다', '강제로 누르다', '풀어주다', '해방하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"억압"은 강제로 누르는 것을 의미합니다.',
    example: '예문: 억압에서 벗어났다.'
  },
  {
    word: '억제',
    question: '<span class="word-highlight">억제</span>의 뜻은?',
    hint: '감정이나 행동을 누름',
    choices: ['표출하다', '감정이나 행동을 누르다', '드러내다', '발산하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"억제"는 감정이나 행동을 누르는 것을 의미합니다.',
    example: '예문: 감정을 억제했다.'
  },
  {
    word: '언급',
    question: '<span class="word-highlight">언급</span>의 뜻은?',
    hint: '말로 나타냄',
    choices: ['침묵하다', '말로 나타내다', '숨기다', '모르다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"언급"은 말로 나타내는 것을 의미합니다.',
    example: '예문: 그 문제에 대해 언급했다.'
  },
  {
    word: '엄격',
    question: '<span class="word-highlight">엄격</span>의 뜻은?',
    hint: '매우 엄하고 철저함',
    choices: ['느슨하다', '매우 엄하고 철저하다', '관대하다', '부드럽다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"엄격"은 매우 엄하고 철저한 것을 의미합니다.',
    example: '예문: 엄격한 규칙이다.'
  },
  {
    word: '엄밀',
    question: '<span class="word-highlight">엄밀</span>의 뜻은?',
    hint: '엄격하고 치밀함',
    choices: ['대충', '엄격하고 치밀하다', '느슨하다', '허술하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"엄밀"은 엄격하고 치밀한 것을 의미합니다.',
    example: '예문: 엄밀히 말하면 다르다.'
  },
  {
    word: '엄연히',
    question: '<span class="word-highlight">엄연히</span>의 뜻은?',
    hint: '분명히 존재하는 모양',
    choices: ['없다', '분명히 존재하다', '모호하다', '불분명하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"엄연히"는 분명히 존재하는 모양을 의미합니다.',
    example: '예문: 엄연히 사실이다.'
  },
  {
    word: '여건',
    question: '<span class="word-highlight">여건</span>의 뜻은?',
    hint: '주어진 조건',
    choices: ['결과', '주어진 조건', '목표', '계획'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"여건"은 주어진 조건을 의미합니다.',
    example: '예문: 여건이 마련되었다.'
  },
  {
    word: '여과',
    question: '<span class="word-highlight">여과</span>의 뜻은?',
    hint: '걸러냄',
    choices: ['섞다', '걸러내다', '합치다', '더하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"여과"는 걸러내는 것을 의미합니다.',
    example: '예문: 물을 여과했다.'
  },
  {
    word: '여론',
    question: '<span class="word-highlight">여론</span>의 뜻은?',
    hint: '사회 대중의 의견',
    choices: ['개인 의견', '사회 대중의 의견', '비밀', '소문'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"여론"은 사회 대중의 의견을 의미합니다.',
    example: '예문: 여론이 좋지 않다.'
  },
  {
    word: '여지',
    question: '<span class="word-highlight">여지</span>의 뜻은?',
    hint: '남은 가능성이나 공간',
    choices: ['확정', '남은 가능성이나 공간', '끝', '완료'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"여지"는 남은 가능성이나 공간을 의미합니다.',
    example: '예문: 개선의 여지가 있다.'
  },
  {
    word: '여파',
    question: '<span class="word-highlight">여파</span>의 뜻은?',
    hint: '어떤 일이 끝난 뒤의 영향',
    choices: ['원인', '어떤 일이 끝난 뒤의 영향', '시작', '준비'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"여파"는 어떤 일이 끝난 뒤의 영향을 의미합니다.',
    example: '예문: 경제 위기의 여파가 컸다.'
  },
  {
    word: '역설',
    question: '<span class="word-highlight">역설</span>의 뜻은?',
    hint: '모순되는 듯하나 진리가 있는 말',
    choices: ['당연한 말', '모순되는 듯하나 진리가 있는 말', '거짓말', '농담'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"역설"은 모순되는 듯하나 진리가 있는 말을 의미합니다.',
    example: '예문: 역설적이게도 그가 옳았다.'
  },
  {
    word: '역행',
    question: '<span class="word-highlight">역행</span>의 뜻은?',
    hint: '거꾸로 감',
    choices: ['순행하다', '거꾸로 가다', '따르다', '진보하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"역행"은 거꾸로 가는 것을 의미합니다.',
    example: '예문: 시대에 역행하다.'
  },
  {
    word: '연계',
    question: '<span class="word-highlight">연계</span>의 뜻은?',
    hint: '서로 관련을 맺음',
    choices: ['단절하다', '서로 관련을 맺다', '분리하다', '끊다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"연계"는 서로 관련을 맺는 것을 의미합니다.',
    example: '예문: 여러 기관이 연계되어 있다.'
  },
  {
    word: '연대',
    question: '<span class="word-highlight">연대</span>의 뜻은?',
    hint: '함께 힘을 합침',
    choices: ['분열하다', '함께 힘을 합치다', '갈라지다', '대립하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"연대"는 함께 힘을 합치는 것을 의미합니다.',
    example: '예문: 시민들이 연대했다.'
  },
  {
    word: '연루',
    question: '<span class="word-highlight">연루</span>의 뜻은?',
    hint: '어떤 일에 관련되어 휘말림',
    choices: ['무관하다', '어떤 일에 관련되어 휘말리다', '벗어나다', '자유롭다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"연루"는 어떤 일에 관련되어 휘말리는 것을 의미합니다.',
    example: '예문: 사건에 연루되었다.'
  },
  {
    word: '연속',
    question: '<span class="word-highlight">연속</span>의 뜻은?',
    hint: '끊이지 않고 이어짐',
    choices: ['단절', '끊이지 않고 이어지다', '중단', '멈춤'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"연속"은 끊이지 않고 이어지는 것을 의미합니다.',
    example: '예문: 연속으로 성공했다.'
  },
  {
    word: '연유',
    question: '<span class="word-highlight">연유</span>의 뜻은?',
    hint: '사건의 원인이나 까닭',
    choices: ['결과', '사건의 원인이나 까닭', '목적', '목표'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"연유"는 사건의 원인이나 까닭을 의미합니다.',
    example: '예문: 그 연유를 알 수 없다.'
  },
  {
    word: '연장',
    question: '<span class="word-highlight">연장</span>의 뜻은?',
    hint: '기간이나 길이를 늘림',
    choices: ['줄이다', '기간이나 길이를 늘리다', '단축하다', '끝내다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"연장"은 기간이나 길이를 늘리는 것을 의미합니다.',
    example: '예문: 계약을 연장했다.'
  },
  {
    word: '열의',
    question: '<span class="word-highlight">열의</span>의 뜻은?',
    hint: '뜨거운 의욕',
    choices: ['무관심', '뜨거운 의욕', '냉담', '무기력'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"열의"는 뜨거운 의욕을 의미합니다.',
    example: '예문: 열의를 가지고 임했다.'
  },
  {
    word: '염두',
    question: '<span class="word-highlight">염두</span>의 뜻은?',
    hint: '마음속에 두고 생각함',
    choices: ['잊다', '마음속에 두고 생각하다', '무시하다', '모르다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"염두"는 마음속에 두고 생각하는 것을 의미합니다.',
    example: '예문: 항상 염두에 두다.'
  },
  {
    word: '염려',
    question: '<span class="word-highlight">염려</span>의 뜻은?',
    hint: '걱정함',
    choices: ['안심하다', '걱정하다', '기뻐하다', '즐기다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"염려"는 걱정하는 것을 의미합니다.',
    example: '예문: 염려가 되다.'
  },
  {
    word: '영속',
    question: '<span class="word-highlight">영속</span>의 뜻은?',
    hint: '오래도록 계속됨',
    choices: ['일시적', '오래도록 계속되다', '짧은', '순간적'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"영속"은 오래도록 계속되는 것을 의미합니다.',
    example: '예문: 영속적인 가치를 지닌다.'
  },
  {
    word: '영위',
    question: '<span class="word-highlight">영위</span>의 뜻은?',
    hint: '생활을 꾸려 나감',
    choices: ['포기하다', '생활을 꾸려 나가다', '중단하다', '그만두다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"영위"는 생활을 꾸려 나가는 것을 의미합니다.',
    example: '예문: 삶을 영위하다.'
  },
  {
    word: '영향',
    question: '<span class="word-highlight">영향</span>의 뜻은?',
    hint: '어떤 것에 미치는 작용',
    choices: ['무관', '어떤 것에 미치는 작용', '독립', '분리'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"영향"은 어떤 것에 미치는 작용을 의미합니다.',
    example: '예문: 영향을 미쳤다.'
  },
  {
    word: '예견',
    question: '<span class="word-highlight">예견</span>의 뜻은?',
    hint: '미리 내다봄',
    choices: ['모르다', '미리 내다보다', '뒤늦게 알다', '지나치다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"예견"은 미리 내다보는 것을 의미합니다.',
    example: '예문: 결과를 예견했다.'
  },
  {
    word: '예방',
    question: '<span class="word-highlight">예방</span>의 뜻은?',
    hint: '미리 막음',
    choices: ['방치하다', '미리 막다', '내버려두다', '무시하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"예방"은 미리 막는 것을 의미합니다.',
    example: '예문: 질병을 예방하다.'
  },
  {
    word: '예시',
    question: '<span class="word-highlight">예시</span>의 뜻은?',
    hint: '예를 들어 보임',
    choices: ['숨기다', '예를 들어 보이다', '감추다', '생략하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"예시"는 예를 들어 보이는 것을 의미합니다.',
    example: '예문: 예시를 들었다.'
  },
  {
    word: '예외',
    question: '<span class="word-highlight">예외</span>의 뜻은?',
    hint: '일반적인 것에서 벗어남',
    choices: ['일반적', '일반적인 것에서 벗어나다', '보통', '평범하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"예외"는 일반적인 것에서 벗어나는 것을 의미합니다.',
    example: '예문: 예외 없이 적용된다.'
  },
  {
    word: '예정',
    question: '<span class="word-highlight">예정</span>의 뜻은?',
    hint: '미리 정함',
    choices: ['즉흥적', '미리 정하다', '갑작스럽다', '뜻밖'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"예정"은 미리 정하는 것을 의미합니다.',
    example: '예문: 내일 출발 예정이다.'
  },
  {
    word: '예측',
    question: '<span class="word-highlight">예측</span>의 뜻은?',
    hint: '미리 헤아려 짐작함',
    choices: ['모르다', '미리 헤아려 짐작하다', '뒤늦게 알다', '무관심하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"예측"은 미리 헤아려 짐작하는 것을 의미합니다.',
    example: '예문: 날씨를 예측하다.'
  },
  {
    word: '오류',
    question: '<span class="word-highlight">오류</span>의 뜻은?',
    hint: '잘못된 점',
    choices: ['정확하다', '잘못된 점', '올바르다', '맞다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"오류"는 잘못된 점을 의미합니다.',
    example: '예문: 오류를 수정했다.'
  },
  {
    word: '오용',
    question: '<span class="word-highlight">오용</span>의 뜻은?',
    hint: '잘못 사용함',
    choices: ['올바르게 쓰다', '잘못 사용하다', '제대로 쓰다', '선용하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"오용"은 잘못 사용하는 것을 의미합니다.',
    example: '예문: 단어를 오용했다.'
  },
  {
    word: '오해',
    question: '<span class="word-highlight">오해</span>의 뜻은?',
    hint: '잘못 이해함',
    choices: ['정확히 알다', '잘못 이해하다', '이해하다', '파악하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"오해"는 잘못 이해하는 것을 의미합니다.',
    example: '예문: 오해가 생겼다.'
  },
  {
    word: '옹호',
    question: '<span class="word-highlight">옹호</span>의 뜻은?',
    hint: '감싸고 보호함',
    choices: ['비판하다', '감싸고 보호하다', '공격하다', '비난하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"옹호"는 감싸고 보호하는 것을 의미합니다.',
    example: '예문: 그의 입장을 옹호했다.'
  },
  {
    word: '완곡',
    question: '<span class="word-highlight">완곡</span>의 뜻은?',
    hint: '부드럽고 에둘러 말함',
    choices: ['직접적', '부드럽고 에둘러 말하다', '거칠다', '날카롭다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"완곡"은 부드럽고 에둘러 말하는 것을 의미합니다.',
    example: '예문: 완곡하게 거절했다.'
  },
  {
    word: '완고',
    question: '<span class="word-highlight">완고</span>의 뜻은?',
    hint: '고집이 세고 융통성이 없음',
    choices: ['유연하다', '고집이 세고 융통성이 없다', '부드럽다', '열린 마음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"완고"는 고집이 세고 융통성이 없는 것을 의미합니다.',
    example: '예문: 완고한 태도를 보였다.'
  },
  {
    word: '완료',
    question: '<span class="word-highlight">완료</span>의 뜻은?',
    hint: '완전히 끝냄',
    choices: ['시작하다', '완전히 끝내다', '진행 중', '중단하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"완료"는 완전히 끝내는 것을 의미합니다.',
    example: '예문: 작업이 완료되었다.'
  },
  {
    word: '완벽',
    question: '<span class="word-highlight">완벽</span>의 뜻은?',
    hint: '흠이 없이 완전함',
    choices: ['불완전하다', '흠이 없이 완전하다', '부족하다', '모자라다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"완벽"은 흠이 없이 완전한 것을 의미합니다.',
    example: '예문: 완벽하게 해냈다.'
  },
  {
    word: '완화',
    question: '<span class="word-highlight">완화</span>의 뜻은?',
    hint: '누그러뜨림',
    choices: ['강화하다', '누그러뜨리다', '심화하다', '악화시키다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"완화"는 누그러뜨리는 것을 의미합니다.',
    example: '예문: 긴장을 완화시켰다.'
  },
  {
    word: '왜곡',
    question: '<span class="word-highlight">왜곡</span>의 뜻은?',
    hint: '사실을 비틀어 다르게 함',
    choices: ['사실대로', '사실을 비틀어 다르게 하다', '정직하다', '솔직하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"왜곡"은 사실을 비틀어 다르게 하는 것을 의미합니다.',
    example: '예문: 사실이 왜곡되었다.'
  },
  {
    word: '외면',
    question: '<span class="word-highlight">외면</span>의 뜻은?',
    hint: '관심을 두지 않음',
    choices: ['주목하다', '관심을 두지 않다', '집중하다', '응시하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"외면"은 관심을 두지 않는 것을 의미합니다.',
    example: '예문: 그를 외면했다.'
  },
  {
    word: '요건',
    question: '<span class="word-highlight">요건</span>의 뜻은?',
    hint: '필요한 조건',
    choices: ['불필요한 것', '필요한 조건', '선택 사항', '부가 사항'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"요건"은 필요한 조건을 의미합니다.',
    example: '예문: 자격 요건을 갖추다.'
  },
  {
    word: '요소',
    question: '<span class="word-highlight">요소</span>의 뜻은?',
    hint: '사물을 이루는 성분',
    choices: ['전체', '사물을 이루는 성분', '완성품', '결과물'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"요소"는 사물을 이루는 성분을 의미합니다.',
    example: '예문: 중요한 요소이다.'
  },
  {
    word: '요약',
    question: '<span class="word-highlight">요약</span>의 뜻은?',
    hint: '간추려 정리함',
    choices: ['상세히 하다', '간추려 정리하다', '길게 늘이다', '확장하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"요약"은 간추려 정리하는 것을 의미합니다.',
    example: '예문: 내용을 요약했다.'
  },
  {
    word: '요인',
    question: '<span class="word-highlight">요인</span>의 뜻은?',
    hint: '어떤 일의 원인이 되는 것',
    choices: ['결과', '어떤 일의 원인이 되는 것', '목적', '목표'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"요인"은 어떤 일의 원인이 되는 것을 의미합니다.',
    example: '예문: 성공의 요인이다.'
  },
  {
    word: '요청',
    question: '<span class="word-highlight">요청</span>의 뜻은?',
    hint: '필요한 것을 달라고 청함',
    choices: ['거절하다', '필요한 것을 달라고 청하다', '주다', '제공하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"요청"은 필요한 것을 달라고 청하는 것을 의미합니다.',
    example: '예문: 도움을 요청했다.'
  },
  {
    word: '용도',
    question: '<span class="word-highlight">용도</span>의 뜻은?',
    hint: '쓰이는 곳',
    choices: ['쓸모없음', '쓰이는 곳', '버리다', '방치'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"용도"는 쓰이는 곳을 의미합니다.',
    example: '예문: 용도가 다양하다.'
  },
  {
    word: '용어',
    question: '<span class="word-highlight">용어</span>의 뜻은?',
    hint: '특정 분야에서 쓰는 말',
    choices: ['일반어', '특정 분야에서 쓰는 말', '방언', '속어'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"용어"는 특정 분야에서 쓰는 말을 의미합니다.',
    example: '예문: 전문 용어를 사용했다.'
  },
  {
    word: '우려',
    question: '<span class="word-highlight">우려</span>의 뜻은?',
    hint: '걱정함',
    choices: ['안심하다', '걱정하다', '기대하다', '희망하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"우려"는 걱정하는 것을 의미합니다.',
    example: '예문: 우려가 현실이 되었다.'
  },
  {
    word: '우발',
    question: '<span class="word-highlight">우발</span>의 뜻은?',
    hint: '뜻하지 않게 일어남',
    choices: ['계획적', '뜻하지 않게 일어나다', '예상대로', '의도적'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"우발"은 뜻하지 않게 일어나는 것을 의미합니다.',
    example: '예문: 우발적인 사고였다.'
  },
  {
    word: '우선',
    question: '<span class="word-highlight">우선</span>의 뜻은?',
    hint: '다른 것보다 먼저',
    choices: ['나중에', '다른 것보다 먼저', '마지막에', '끝에'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"우선"은 다른 것보다 먼저를 의미합니다.',
    example: '예문: 우선 이것부터 하자.'
  },
  {
    word: '우세',
    question: '<span class="word-highlight">우세</span>의 뜻은?',
    hint: '형세가 나음',
    choices: ['열세', '형세가 나음', '밀리다', '뒤처지다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"우세"는 형세가 나은 것을 의미합니다.',
    example: '예문: 우세를 점했다.'
  },
  {
    word: '우위',
    question: '<span class="word-highlight">우위</span>의 뜻은?',
    hint: '남보다 나은 위치',
    choices: ['열위', '남보다 나은 위치', '아래', '밑'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"우위"는 남보다 나은 위치를 의미합니다.',
    example: '예문: 우위를 차지했다.'
  },
  {
    word: '우월',
    question: '<span class="word-highlight">우월</span>의 뜻은?',
    hint: '다른 것보다 뛰어남',
    choices: ['열등하다', '다른 것보다 뛰어나다', '못하다', '부족하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"우월"은 다른 것보다 뛰어난 것을 의미합니다.',
    example: '예문: 우월감을 느끼다.'
  },
  {
    word: '운용',
    question: '<span class="word-highlight">운용</span>의 뜻은?',
    hint: '움직여 씀',
    choices: ['방치하다', '움직여 쓰다', '버리다', '무시하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"운용"은 움직여 쓰는 것을 의미합니다.',
    example: '예문: 자금을 운용하다.'
  },
  {
    word: '원동력',
    question: '<span class="word-highlight">원동력</span>의 뜻은?',
    hint: '활동의 근본이 되는 힘',
    choices: ['결과', '활동의 근본이 되는 힘', '방해', '장애'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"원동력"은 활동의 근본이 되는 힘을 의미합니다.',
    example: '예문: 성공의 원동력이다.'
  },
  {
    word: '원만',
    question: '<span class="word-highlight">원만</span>의 뜻은?',
    hint: '모나지 않고 부드러움',
    choices: ['각지다', '모나지 않고 부드럽다', '날카롭다', '험하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"원만"은 모나지 않고 부드러운 것을 의미합니다.',
    example: '예문: 원만하게 해결되었다.'
  },
  {
    word: '원인',
    question: '<span class="word-highlight">원인</span>의 뜻은?',
    hint: '어떤 일이 일어나게 한 것',
    choices: ['결과', '어떤 일이 일어나게 한 것', '목적', '목표'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"원인"은 어떤 일이 일어나게 한 것을 의미합니다.',
    example: '예문: 원인을 분석했다.'
  },
  {
    word: '원칙',
    question: '<span class="word-highlight">원칙</span>의 뜻은?',
    hint: '기본이 되는 규칙',
    choices: ['예외', '기본이 되는 규칙', '변칙', '특수'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"원칙"은 기본이 되는 규칙을 의미합니다.',
    example: '예문: 원칙을 지키다.'
  },
  {
    word: '위기',
    question: '<span class="word-highlight">위기</span>의 뜻은?',
    hint: '위험한 고비',
    choices: ['안정', '위험한 고비', '평온', '평화'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"위기"는 위험한 고비를 의미합니다.',
    example: '예문: 위기를 극복했다.'
  },
  {
    word: '위반',
    question: '<span class="word-highlight">위반</span>의 뜻은?',
    hint: '규칙을 어김',
    choices: ['준수하다', '규칙을 어기다', '따르다', '지키다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"위반"은 규칙을 어기는 것을 의미합니다.',
    example: '예문: 규정을 위반했다.'
  },
  {
    word: '위상',
    question: '<span class="word-highlight">위상</span>의 뜻은?',
    hint: '어떤 사물이 다른 사물과의 관계에서 차지하는 위치',
    choices: ['무관하다', '관계에서 차지하는 위치', '분리', '독립'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"위상"은 다른 것과의 관계에서 차지하는 위치를 의미합니다.',
    example: '예문: 국제적 위상이 높아졌다.'
  },
  {
    word: '위축',
    question: '<span class="word-highlight">위축</span>의 뜻은?',
    hint: '기세가 꺾여 줄어듦',
    choices: ['확장하다', '기세가 꺾여 줄어들다', '성장하다', '발전하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"위축"은 기세가 꺾여 줄어드는 것을 의미합니다.',
    example: '예문: 경기가 위축되었다.'
  },
  {
    word: '위협',
    question: '<span class="word-highlight">위협</span>의 뜻은?',
    hint: '겁을 주어 협박함',
    choices: ['안심시키다', '겁을 주어 협박하다', '보호하다', '돕다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"위협"은 겁을 주어 협박하는 것을 의미합니다.',
    example: '예문: 위협을 느꼈다.'
  },
  {
    word: '유기적',
    question: '<span class="word-highlight">유기적</span>의 뜻은?',
    hint: '서로 밀접하게 관련된',
    choices: ['분리된', '서로 밀접하게 관련된', '독립적', '개별적'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"유기적"은 서로 밀접하게 관련된 것을 의미합니다.',
    example: '예문: 유기적으로 연결되어 있다.'
  },
  {
    word: '유념',
    question: '<span class="word-highlight">유념</span>의 뜻은?',
    hint: '마음에 새겨 둠',
    choices: ['잊다', '마음에 새겨 두다', '무시하다', '방심하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"유념"은 마음에 새겨 두는 것을 의미합니다.',
    example: '예문: 항상 유념하세요.'
  },
  {
    word: '유래',
    question: '<span class="word-highlight">유래</span>의 뜻은?',
    hint: '사물의 내력이나 근원',
    choices: ['결과', '사물의 내력이나 근원', '끝', '종말'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"유래"는 사물의 내력이나 근원을 의미합니다.',
    example: '예문: 유래를 알아보다.'
  },
  {
    word: '유발',
    question: '<span class="word-highlight">유발</span>의 뜻은?',
    hint: '어떤 일이 일어나게 함',
    choices: ['막다', '어떤 일이 일어나게 하다', '방지하다', '예방하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"유발"은 어떤 일이 일어나게 하는 것을 의미합니다.',
    example: '예문: 문제를 유발했다.'
  },
  {
    word: '유사',
    question: '<span class="word-highlight">유사</span>의 뜻은?',
    hint: '서로 비슷함',
    choices: ['다르다', '서로 비슷하다', '반대되다', '상반되다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"유사"는 서로 비슷한 것을 의미합니다.',
    example: '예문: 유사한 경우가 있다.'
  },
  {
    word: '유용',
    question: '<span class="word-highlight">유용</span>의 뜻은?',
    hint: '쓸모가 있음',
    choices: ['무용하다', '쓸모가 있다', '쓸모없다', '소용없다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"유용"은 쓸모가 있는 것을 의미합니다.',
    example: '예문: 유용한 정보이다.'
  },
  {
    word: '유인',
    question: '<span class="word-highlight">유인</span>의 뜻은?',
    hint: '어떤 행동을 하도록 꾀어 끎',
    choices: ['밀어내다', '어떤 행동을 하도록 꾀어 끌다', '거부하다', '막다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"유인"은 어떤 행동을 하도록 꾀어 끄는 것을 의미합니다.',
    example: '예문: 유인책을 쓰다.'
  },
  {
    word: '유지',
    question: '<span class="word-highlight">유지</span>의 뜻은?',
    hint: '어떤 상태를 그대로 보존함',
    choices: ['바꾸다', '어떤 상태를 그대로 보존하다', '변경하다', '교체하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"유지"는 어떤 상태를 그대로 보존하는 것을 의미합니다.',
    example: '예문: 건강을 유지하다.'
  },
  {
    word: '유추',
    question: '<span class="word-highlight">유추</span>의 뜻은?',
    hint: '비슷한 점을 바탕으로 미루어 추측함',
    choices: ['확신하다', '비슷한 점을 바탕으로 미루어 추측하다', '단정짓다', '확정하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"유추"는 비슷한 점을 바탕으로 미루어 추측하는 것을 의미합니다.',
    example: '예문: 유추해 볼 수 있다.'
  },
  {
    word: '유형',
    question: '<span class="word-highlight">유형</span>의 뜻은?',
    hint: '같은 특성을 가진 종류',
    choices: ['개별적', '같은 특성을 가진 종류', '무작위', '불규칙'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"유형"은 같은 특성을 가진 종류를 의미합니다.',
    example: '예문: 여러 유형이 있다.'
  },
  {
    word: '유효',
    question: '<span class="word-highlight">유효</span>의 뜻은?',
    hint: '효력이 있음',
    choices: ['무효', '효력이 있다', '쓸모없다', '효과 없다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"유효"는 효력이 있는 것을 의미합니다.',
    example: '예문: 유효 기간이 남아있다.'
  },
  {
    word: '융합',
    question: '<span class="word-highlight">융합</span>의 뜻은?',
    hint: '다른 것이 녹아 하나로 합쳐짐',
    choices: ['분리하다', '다른 것이 녹아 하나로 합쳐지다', '나누다', '갈라지다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"융합"은 다른 것이 녹아 하나로 합쳐지는 것을 의미합니다.',
    example: '예문: 기술과 예술이 융합되었다.'
  },
  {
    word: '의거',
    question: '<span class="word-highlight">의거</span>의 뜻은?',
    hint: '어떤 것을 근거로 삼음',
    choices: ['무시하다', '어떤 것을 근거로 삼다', '어기다', '위반하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"의거"는 어떤 것을 근거로 삼는 것을 의미합니다.',
    example: '예문: 법에 의거하여 처리하다.'
  },
  {
    word: '의도',
    question: '<span class="word-highlight">의도</span>의 뜻은?',
    hint: '무엇을 하고자 하는 생각',
    choices: ['우연', '무엇을 하고자 하는 생각', '실수', '모름'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"의도"는 무엇을 하고자 하는 생각을 의미합니다.',
    example: '예문: 의도가 무엇인가?'
  },
  {
    word: '의무',
    question: '<span class="word-highlight">의무</span>의 뜻은?',
    hint: '마땅히 해야 할 일',
    choices: ['권리', '마땅히 해야 할 일', '선택', '자유'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"의무"는 마땅히 해야 할 일을 의미합니다.',
    example: '예문: 의무를 다하다.'
  },
  {
    word: '의의',
    question: '<span class="word-highlight">의의</span>의 뜻은?',
    hint: '가치나 중요성',
    choices: ['무의미', '가치나 중요성', '하찮음', '사소함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"의의"는 가치나 중요성을 의미합니다.',
    example: '예문: 의의가 크다.'
  },
  {
    word: '의존',
    question: '<span class="word-highlight">의존</span>의 뜻은?',
    hint: '다른 것에 기대어 살아감',
    choices: ['독립하다', '다른 것에 기대어 살아가다', '자립하다', '홀로서다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"의존"은 다른 것에 기대어 살아가는 것을 의미합니다.',
    example: '예문: 수입에 의존하다.'
  },
  {
    word: '의지',
    question: '<span class="word-highlight">의지</span>의 뜻은?',
    hint: '무엇을 이루려는 마음',
    choices: ['포기', '무엇을 이루려는 마음', '나태', '무기력'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"의지"는 무엇을 이루려는 마음을 의미합니다.',
    example: '예문: 의지가 강하다.'
  },
  // 601~700번 어휘
  {
    word: '이견',
    question: '<span class="word-highlight">이견</span>의 뜻은?',
    hint: '다른 의견',
    choices: ['같은 의견', '다른 의견', '동의', '찬성'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"이견"은 다른 의견을 의미합니다.',
    example: '예문: 이견이 없다.'
  },
  {
    word: '이례적',
    question: '<span class="word-highlight">이례적</span>의 뜻은?',
    hint: '전례가 없이 드문',
    choices: ['평범한', '전례가 없이 드문', '흔한', '보통의'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"이례적"은 전례가 없이 드문 것을 의미합니다.',
    example: '예문: 이례적인 결정이다.'
  },
  {
    word: '이론',
    question: '<span class="word-highlight">이론</span>의 뜻은?',
    hint: '사물의 이치를 논리적으로 설명한 것',
    choices: ['실천', '사물의 이치를 논리적으로 설명한 것', '행동', '경험'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"이론"은 사물의 이치를 논리적으로 설명한 것을 의미합니다.',
    example: '예문: 이론을 세우다.'
  },
  {
    word: '이면',
    question: '<span class="word-highlight">이면</span>의 뜻은?',
    hint: '겉으로 드러나지 않은 속',
    choices: ['표면', '겉으로 드러나지 않은 속', '겉모습', '외관'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"이면"은 겉으로 드러나지 않은 속을 의미합니다.',
    example: '예문: 화려함 이면의 고통.'
  },
  {
    word: '이상',
    question: '<span class="word-highlight">이상</span>의 뜻은?',
    hint: '생각할 수 있는 가장 완전한 상태',
    choices: ['현실', '생각할 수 있는 가장 완전한 상태', '실제', '사실'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"이상"은 생각할 수 있는 가장 완전한 상태를 의미합니다.',
    example: '예문: 이상을 추구하다.'
  },
  {
    word: '이식',
    question: '<span class="word-highlight">이식</span>의 뜻은?',
    hint: '옮겨 심음',
    choices: ['제거하다', '옮겨 심다', '뽑다', '없애다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"이식"은 옮겨 심는 것을 의미합니다.',
    example: '예문: 장기를 이식하다.'
  },
  {
    word: '이완',
    question: '<span class="word-highlight">이완</span>의 뜻은?',
    hint: '긴장이 풀림',
    choices: ['긴장하다', '긴장이 풀리다', '경직되다', '굳어지다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"이완"은 긴장이 풀리는 것을 의미합니다.',
    example: '예문: 근육이 이완되다.'
  },
  {
    word: '이의',
    question: '<span class="word-highlight">이의</span>의 뜻은?',
    hint: '다른 의견이나 반대',
    choices: ['동의', '다른 의견이나 반대', '찬성', '수긍'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"이의"는 다른 의견이나 반대를 의미합니다.',
    example: '예문: 이의를 제기하다.'
  },
  {
    word: '이점',
    question: '<span class="word-highlight">이점</span>의 뜻은?',
    hint: '유리한 점',
    choices: ['단점', '유리한 점', '약점', '결점'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"이점"은 유리한 점을 의미합니다.',
    example: '예문: 이점이 많다.'
  },
  {
    word: '이질',
    question: '<span class="word-highlight">이질</span>의 뜻은?',
    hint: '성질이 다름',
    choices: ['동질', '성질이 다름', '같음', '비슷함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"이질"은 성질이 다른 것을 의미합니다.',
    example: '예문: 이질적인 문화.'
  },
  {
    word: '이행',
    question: '<span class="word-highlight">이행</span>의 뜻은?',
    hint: '실제로 행함',
    choices: ['무시하다', '실제로 행하다', '어기다', '위반하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"이행"은 실제로 행하는 것을 의미합니다.',
    example: '예문: 약속을 이행하다.'
  },
  {
    word: '인과',
    question: '<span class="word-highlight">인과</span>의 뜻은?',
    hint: '원인과 결과',
    choices: ['무관', '원인과 결과', '우연', '독립'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"인과"는 원인과 결과를 의미합니다.',
    example: '예문: 인과 관계가 있다.'
  },
  {
    word: '인내',
    question: '<span class="word-highlight">인내</span>의 뜻은?',
    hint: '참고 견딤',
    choices: ['포기하다', '참고 견디다', '화내다', '분노하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"인내"는 참고 견디는 것을 의미합니다.',
    example: '예문: 인내심이 강하다.'
  },
  {
    word: '인식',
    question: '<span class="word-highlight">인식</span>의 뜻은?',
    hint: '사물을 분별하고 판단함',
    choices: ['모르다', '사물을 분별하고 판단하다', '무시하다', '간과하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"인식"은 사물을 분별하고 판단하는 것을 의미합니다.',
    example: '예문: 문제를 인식하다.'
  },
  {
    word: '인용',
    question: '<span class="word-highlight">인용</span>의 뜻은?',
    hint: '남의 말이나 글을 끌어다 씀',
    choices: ['창작하다', '남의 말이나 글을 끌어다 쓰다', '독창적', '새로 만들다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"인용"은 남의 말이나 글을 끌어다 쓰는 것을 의미합니다.',
    example: '예문: 명언을 인용하다.'
  },
  {
    word: '인정',
    question: '<span class="word-highlight">인정</span>의 뜻은?',
    hint: '확실하다고 여김',
    choices: ['부정하다', '확실하다고 여기다', '거부하다', '무시하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"인정"은 확실하다고 여기는 것을 의미합니다.',
    example: '예문: 실력을 인정받다.'
  },
  {
    word: '일관',
    question: '<span class="word-highlight">일관</span>의 뜻은?',
    hint: '처음부터 끝까지 한결같음',
    choices: ['변하다', '처음부터 끝까지 한결같다', '달라지다', '바뀌다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"일관"은 처음부터 끝까지 한결같은 것을 의미합니다.',
    example: '예문: 일관된 태도를 유지하다.'
  },
  {
    word: '일괄',
    question: '<span class="word-highlight">일괄</span>의 뜻은?',
    hint: '한데 묶어서 처리함',
    choices: ['개별적', '한데 묶어서 처리하다', '따로따로', '나눠서'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"일괄"은 한데 묶어서 처리하는 것을 의미합니다.',
    example: '예문: 일괄 처리하다.'
  },
  {
    word: '일단',
    question: '<span class="word-highlight">일단</span>의 뜻은?',
    hint: '우선 먼저',
    choices: ['나중에', '우선 먼저', '마지막에', '끝에'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"일단"은 우선 먼저를 의미합니다.',
    example: '예문: 일단 시작하자.'
  },
  {
    word: '일률',
    question: '<span class="word-highlight">일률</span>의 뜻은?',
    hint: '한 가지 기준으로 똑같이',
    choices: ['다양하게', '한 가지 기준으로 똑같이', '개별적', '다르게'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"일률"은 한 가지 기준으로 똑같이 하는 것을 의미합니다.',
    example: '예문: 일률적으로 적용하다.'
  },
  {
    word: '일면',
    question: '<span class="word-highlight">일면</span>의 뜻은?',
    hint: '한 측면',
    choices: ['전체', '한 측면', '전부', '모두'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"일면"은 한 측면을 의미합니다.',
    example: '예문: 이것은 일면에 불과하다.'
  },
  {
    word: '일방',
    question: '<span class="word-highlight">일방</span>의 뜻은?',
    hint: '한쪽',
    choices: ['양쪽', '한쪽', '모두', '전체'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"일방"은 한쪽을 의미합니다.',
    example: '예문: 일방적인 통보.'
  },
  {
    word: '일상',
    question: '<span class="word-highlight">일상</span>의 뜻은?',
    hint: '날마다의 생활',
    choices: ['특별한', '날마다의 생활', '비일상', '이례적'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"일상"은 날마다의 생활을 의미합니다.',
    example: '예문: 일상으로 돌아가다.'
  },
  {
    word: '일시',
    question: '<span class="word-highlight">일시</span>의 뜻은?',
    hint: '한때, 잠깐',
    choices: ['영구적', '한때, 잠깐', '항상', '계속'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"일시"는 한때, 잠깐을 의미합니다.',
    example: '예문: 일시적인 현상이다.'
  },
  {
    word: '일체',
    question: '<span class="word-highlight">일체</span>의 뜻은?',
    hint: '모든 것',
    choices: ['일부', '모든 것', '조금', '약간'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"일체"는 모든 것을 의미합니다.',
    example: '예문: 비용 일체를 부담하다.'
  },
  {
    word: '일환',
    question: '<span class="word-highlight">일환</span>의 뜻은?',
    hint: '여러 가지 중 한 부분',
    choices: ['전체', '여러 가지 중 한 부분', '전부', '모두'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"일환"은 여러 가지 중 한 부분을 의미합니다.',
    example: '예문: 정책의 일환으로 진행하다.'
  },
  {
    word: '임시',
    question: '<span class="word-highlight">임시</span>의 뜻은?',
    hint: '얼마 동안만',
    choices: ['영구적', '얼마 동안만', '항구적', '계속'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"임시"는 얼마 동안만을 의미합니다.',
    example: '예문: 임시 조치를 취하다.'
  },
  {
    word: '입각',
    question: '<span class="word-highlight">입각</span>의 뜻은?',
    hint: '어떤 것을 기초로 삼음',
    choices: ['무시하다', '어떤 것을 기초로 삼다', '어기다', '벗어나다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"입각"은 어떤 것을 기초로 삼는 것을 의미합니다.',
    example: '예문: 사실에 입각하다.'
  },
  {
    word: '입장',
    question: '<span class="word-highlight">입장</span>의 뜻은?',
    hint: '처해 있는 위치나 상황',
    choices: ['무관하다', '처해 있는 위치나 상황', '떠나다', '벗어나다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"입장"은 처해 있는 위치나 상황을 의미합니다.',
    example: '예문: 상대방의 입장을 고려하다.'
  },
  {
    word: '입증',
    question: '<span class="word-highlight">입증</span>의 뜻은?',
    hint: '증거를 대어 증명함',
    choices: ['부정하다', '증거를 대어 증명하다', '반박하다', '숨기다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"입증"은 증거를 대어 증명하는 것을 의미합니다.',
    example: '예문: 사실을 입증하다.'
  },
  {
    word: '자각',
    question: '<span class="word-highlight">자각</span>의 뜻은?',
    hint: '스스로 깨달음',
    choices: ['모르다', '스스로 깨닫다', '무시하다', '간과하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"자각"은 스스로 깨닫는 것을 의미합니다.',
    example: '예문: 문제를 자각하다.'
  },
  {
    word: '자발',
    question: '<span class="word-highlight">자발</span>의 뜻은?',
    hint: '스스로 하고자 함',
    choices: ['강제적', '스스로 하고자 하다', '억지로', '떠밀려'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"자발"은 스스로 하고자 하는 것을 의미합니다.',
    example: '예문: 자발적으로 참여하다.'
  },
  {
    word: '자생',
    question: '<span class="word-highlight">자생</span>의 뜻은?',
    hint: '스스로 자라남',
    choices: ['키워지다', '스스로 자라나다', '인위적', '재배되다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"자생"은 스스로 자라나는 것을 의미합니다.',
    example: '예문: 자생력을 키우다.'
  },
  {
    word: '자아',
    question: '<span class="word-highlight">자아</span>의 뜻은?',
    hint: '자기 자신',
    choices: ['타인', '자기 자신', '남', '다른 사람'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"자아"는 자기 자신을 의미합니다.',
    example: '예문: 자아를 찾다.'
  },
  {
    word: '자율',
    question: '<span class="word-highlight">자율</span>의 뜻은?',
    hint: '자기 스스로 다스림',
    choices: ['타율', '자기 스스로 다스리다', '강제', '통제'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"자율"은 자기 스스로 다스리는 것을 의미합니다.',
    example: '예문: 자율적으로 행동하다.'
  },
  {
    word: '자제',
    question: '<span class="word-highlight">자제</span>의 뜻은?',
    hint: '자기를 억제함',
    choices: ['방종하다', '자기를 억제하다', '마음대로 하다', '풀어놓다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"자제"는 자기를 억제하는 것을 의미합니다.',
    example: '예문: 감정을 자제하다.'
  },
  {
    word: '자초',
    question: '<span class="word-highlight">자초</span>의 뜻은?',
    hint: '스스로 불러들임',
    choices: ['피하다', '스스로 불러들이다', '막다', '방지하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"자초"는 스스로 불러들이는 것을 의미합니다.',
    example: '예문: 화를 자초하다.'
  },
  {
    word: '자취',
    question: '<span class="word-highlight">자취</span>의 뜻은?',
    hint: '지나간 흔적',
    choices: ['미래', '지나간 흔적', '앞으로', '나중'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"자취"는 지나간 흔적을 의미합니다.',
    example: '예문: 자취를 감추다.'
  },
  {
    word: '작용',
    question: '<span class="word-highlight">작용</span>의 뜻은?',
    hint: '다른 것에 영향을 미침',
    choices: ['무관하다', '다른 것에 영향을 미치다', '독립적', '분리되다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"작용"은 다른 것에 영향을 미치는 것을 의미합니다.',
    example: '예문: 상호 작용하다.'
  },
  {
    word: '잔존',
    question: '<span class="word-highlight">잔존</span>의 뜻은?',
    hint: '남아서 존재함',
    choices: ['사라지다', '남아서 존재하다', '없어지다', '소멸하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"잔존"은 남아서 존재하는 것을 의미합니다.',
    example: '예문: 잔존 세력.'
  },
  {
    word: '잠재',
    question: '<span class="word-highlight">잠재</span>의 뜻은?',
    hint: '겉으로 드러나지 않고 숨어 있음',
    choices: ['드러나다', '겉으로 드러나지 않고 숨어 있다', '명확하다', '확실하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"잠재"는 겉으로 드러나지 않고 숨어 있는 것을 의미합니다.',
    example: '예문: 잠재력이 크다.'
  },
  {
    word: '장기',
    question: '<span class="word-highlight">장기</span>의 뜻은?',
    hint: '오랜 기간',
    choices: ['단기', '오랜 기간', '짧은', '일시적'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"장기"는 오랜 기간을 의미합니다.',
    example: '예문: 장기적인 계획을 세우다.'
  },
  {
    word: '장악',
    question: '<span class="word-highlight">장악</span>의 뜻은?',
    hint: '완전히 손에 넣음',
    choices: ['빼앗기다', '완전히 손에 넣다', '잃다', '놓치다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"장악"은 완전히 손에 넣는 것을 의미합니다.',
    example: '예문: 권력을 장악하다.'
  },
  {
    word: '재고',
    question: '<span class="word-highlight">재고</span>의 뜻은?',
    hint: '다시 생각함',
    choices: ['확정하다', '다시 생각하다', '단정짓다', '결정하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"재고"는 다시 생각하는 것을 의미합니다.',
    example: '예문: 재고의 여지가 있다.'
  },
  {
    word: '재기',
    question: '<span class="word-highlight">재기</span>의 뜻은?',
    hint: '쇠퇴했다가 다시 일어남',
    choices: ['쇠퇴하다', '쇠퇴했다가 다시 일어나다', '망하다', '실패하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"재기"는 쇠퇴했다가 다시 일어나는 것을 의미합니다.',
    example: '예문: 재기에 성공하다.'
  },
  {
    word: '재량',
    question: '<span class="word-highlight">재량</span>의 뜻은?',
    hint: '자기 판단에 따라 처리함',
    choices: ['규정대로', '자기 판단에 따라 처리하다', '지시대로', '명령대로'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"재량"은 자기 판단에 따라 처리하는 것을 의미합니다.',
    example: '예문: 재량권을 행사하다.'
  },
  {
    word: '재편',
    question: '<span class="word-highlight">재편</span>의 뜻은?',
    hint: '다시 편성함',
    choices: ['유지하다', '다시 편성하다', '그대로 두다', '보존하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"재편"은 다시 편성하는 것을 의미합니다.',
    example: '예문: 조직을 재편하다.'
  },
  {
    word: '재현',
    question: '<span class="word-highlight">재현</span>의 뜻은?',
    hint: '다시 나타냄',
    choices: ['사라지다', '다시 나타내다', '없어지다', '지우다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"재현"은 다시 나타내는 것을 의미합니다.',
    example: '예문: 과거를 재현하다.'
  },
  {
    word: '저변',
    question: '<span class="word-highlight">저변</span>의 뜻은?',
    hint: '밑바탕이 되는 부분',
    choices: ['표면', '밑바탕이 되는 부분', '겉', '외면'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"저변"은 밑바탕이 되는 부분을 의미합니다.',
    example: '예문: 저변 확대.'
  },
  {
    word: '저해',
    question: '<span class="word-highlight">저해</span>의 뜻은?',
    hint: '막아서 해침',
    choices: ['돕다', '막아서 해치다', '촉진하다', '지원하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"저해"는 막아서 해치는 것을 의미합니다.',
    example: '예문: 발전을 저해하다.'
  },
  {
    word: '적용',
    question: '<span class="word-highlight">적용</span>의 뜻은?',
    hint: '알맞게 이용하거나 맞추어 씀',
    choices: ['배제하다', '알맞게 이용하거나 맞추어 쓰다', '제외하다', '빼다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"적용"은 알맞게 이용하거나 맞추어 쓰는 것을 의미합니다.',
    example: '예문: 새 규정을 적용하다.'
  },
  {
    word: '적정',
    question: '<span class="word-highlight">적정</span>의 뜻은?',
    hint: '알맞고 올바름',
    choices: ['부적절', '알맞고 올바르다', '과도하다', '모자라다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"적정"은 알맞고 올바른 것을 의미합니다.',
    example: '예문: 적정 수준을 유지하다.'
  },
  {
    word: '적절',
    question: '<span class="word-highlight">적절</span>의 뜻은?',
    hint: '꼭 알맞음',
    choices: ['부적절', '꼭 알맞다', '어울리지 않다', '맞지 않다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"적절"은 꼭 알맞은 것을 의미합니다.',
    example: '예문: 적절한 표현이다.'
  },
  {
    word: '전개',
    question: '<span class="word-highlight">전개</span>의 뜻은?',
    hint: '펼쳐 나감',
    choices: ['접다', '펼쳐 나가다', '멈추다', '중단하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"전개"는 펼쳐 나가는 것을 의미합니다.',
    example: '예문: 사업을 전개하다.'
  },
  {
    word: '전달',
    question: '<span class="word-highlight">전달</span>의 뜻은?',
    hint: '전하여 알림',
    choices: ['숨기다', '전하여 알리다', '감추다', '비밀로 하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"전달"은 전하여 알리는 것을 의미합니다.',
    example: '예문: 메시지를 전달하다.'
  },
  {
    word: '전략',
    question: '<span class="word-highlight">전략</span>의 뜻은?',
    hint: '목표를 이루기 위한 계획',
    choices: ['무계획', '목표를 이루기 위한 계획', '즉흥', '무작정'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"전략"은 목표를 이루기 위한 계획을 의미합니다.',
    example: '예문: 전략을 세우다.'
  },
  {
    word: '전망',
    question: '<span class="word-highlight">전망</span>의 뜻은?',
    hint: '앞날을 내다봄',
    choices: ['회고하다', '앞날을 내다보다', '돌아보다', '과거를 보다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"전망"은 앞날을 내다보는 것을 의미합니다.',
    example: '예문: 전망이 밝다.'
  },
  {
    word: '전반',
    question: '<span class="word-highlight">전반</span>의 뜻은?',
    hint: '전체에 걸침',
    choices: ['일부', '전체에 걸치다', '부분', '국소적'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"전반"은 전체에 걸치는 것을 의미합니다.',
    example: '예문: 사회 전반에 영향을 미치다.'
  },
  {
    word: '전승',
    question: '<span class="word-highlight">전승</span>의 뜻은?',
    hint: '전하여 이어받음',
    choices: ['단절하다', '전하여 이어받다', '끊다', '잃다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"전승"은 전하여 이어받는 것을 의미합니다.',
    example: '예문: 문화를 전승하다.'
  },
  {
    word: '전제',
    question: '<span class="word-highlight">전제</span>의 뜻은?',
    hint: '어떤 일이 성립하기 위한 앞선 조건',
    choices: ['결론', '어떤 일이 성립하기 위한 앞선 조건', '결과', '마무리'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"전제"는 어떤 일이 성립하기 위한 앞선 조건을 의미합니다.',
    example: '예문: 그것을 전제로 하다.'
  },
  {
    word: '전환',
    question: '<span class="word-highlight">전환</span>의 뜻은?',
    hint: '다르게 바꿈',
    choices: ['유지하다', '다르게 바꾸다', '그대로 두다', '보존하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"전환"은 다르게 바꾸는 것을 의미합니다.',
    example: '예문: 방향을 전환하다.'
  },
  {
    word: '절감',
    question: '<span class="word-highlight">절감</span>의 뜻은?',
    hint: '아끼어 줄임',
    choices: ['낭비하다', '아끼어 줄이다', '쓰다', '소비하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"절감"은 아끼어 줄이는 것을 의미합니다.',
    example: '예문: 비용을 절감하다.'
  },
  {
    word: '절대',
    question: '<span class="word-highlight">절대</span>의 뜻은?',
    hint: '어떤 조건에도 관계없이',
    choices: ['상대적', '어떤 조건에도 관계없이', '조건적', '경우에 따라'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"절대"는 어떤 조건에도 관계없는 것을 의미합니다.',
    example: '예문: 절대적인 기준.'
  },
  {
    word: '절실',
    question: '<span class="word-highlight">절실</span>의 뜻은?',
    hint: '매우 간절함',
    choices: ['무관심', '매우 간절하다', '담담하다', '덤덤하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"절실"은 매우 간절한 것을 의미합니다.',
    example: '예문: 절실히 필요하다.'
  },
  {
    word: '절정',
    question: '<span class="word-highlight">절정</span>의 뜻은?',
    hint: '최고의 상태',
    choices: ['최저', '최고의 상태', '바닥', '저점'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"절정"은 최고의 상태를 의미합니다.',
    example: '예문: 절정에 달하다.'
  },
  {
    word: '절충',
    question: '<span class="word-highlight">절충</span>의 뜻은?',
    hint: '서로 다른 것을 알맞게 조절함',
    choices: ['고집하다', '서로 다른 것을 알맞게 조절하다', '대립하다', '충돌하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"절충"은 서로 다른 것을 알맞게 조절하는 것을 의미합니다.',
    example: '예문: 절충안을 마련하다.'
  },
  {
    word: '점유',
    question: '<span class="word-highlight">점유</span>의 뜻은?',
    hint: '차지하여 가짐',
    choices: ['빼앗기다', '차지하여 가지다', '잃다', '놓치다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"점유"는 차지하여 가지는 것을 의미합니다.',
    example: '예문: 시장 점유율.'
  },
  {
    word: '점진',
    question: '<span class="word-highlight">점진</span>의 뜻은?',
    hint: '조금씩 나아감',
    choices: ['급격히', '조금씩 나아가다', '갑자기', '한꺼번에'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"점진"은 조금씩 나아가는 것을 의미합니다.',
    example: '예문: 점진적인 변화.'
  },
  {
    word: '정당',
    question: '<span class="word-highlight">정당</span>의 뜻은?',
    hint: '이치에 맞아 올바름',
    choices: ['부당하다', '이치에 맞아 올바르다', '틀리다', '잘못되다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"정당"은 이치에 맞아 올바른 것을 의미합니다.',
    example: '예문: 정당한 권리.'
  },
  {
    word: '정립',
    question: '<span class="word-highlight">정립</span>의 뜻은?',
    hint: '바로 세움',
    choices: ['무너뜨리다', '바로 세우다', '허물다', '파괴하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"정립"은 바로 세우는 것을 의미합니다.',
    example: '예문: 이론을 정립하다.'
  },
  {
    word: '정밀',
    question: '<span class="word-highlight">정밀</span>의 뜻은?',
    hint: '정확하고 치밀함',
    choices: ['대충', '정확하고 치밀하다', '엉성하다', '허술하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"정밀"은 정확하고 치밀한 것을 의미합니다.',
    example: '예문: 정밀 검사.'
  },
  {
    word: '정비',
    question: '<span class="word-highlight">정비</span>의 뜻은?',
    hint: '제대로 갖추어 준비함',
    choices: ['방치하다', '제대로 갖추어 준비하다', '내버려두다', '무시하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"정비"는 제대로 갖추어 준비하는 것을 의미합니다.',
    example: '예문: 시설을 정비하다.'
  },
  {
    word: '정산',
    question: '<span class="word-highlight">정산</span>의 뜻은?',
    hint: '셈을 맞추어 계산함',
    choices: ['대충', '셈을 맞추어 계산하다', '어림잡다', '추측하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"정산"은 셈을 맞추어 계산하는 것을 의미합니다.',
    example: '예문: 비용을 정산하다.'
  },
  {
    word: '정설',
    question: '<span class="word-highlight">정설</span>의 뜻은?',
    hint: '올바른 학설이나 이론',
    choices: ['이설', '올바른 학설이나 이론', '가설', '억측'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"정설"은 올바른 학설이나 이론을 의미합니다.',
    example: '예문: 정설로 받아들여지다.'
  },
  {
    word: '정수',
    question: '<span class="word-highlight">정수</span>의 뜻은?',
    hint: '가장 중요한 부분',
    choices: ['부수적', '가장 중요한 부분', '하찮은', '사소한'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"정수"는 가장 중요한 부분을 의미합니다.',
    example: '예문: 문화의 정수.'
  },
  {
    word: '정체',
    question: '<span class="word-highlight">정체</span>의 뜻은?',
    hint: '나아가지 못하고 그 상태에 머무름',
    choices: ['발전하다', '나아가지 못하고 그 상태에 머무르다', '진보하다', '성장하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"정체"는 나아가지 못하고 그 상태에 머무르는 것을 의미합니다.',
    example: '예문: 경기가 정체되다.'
  },
  {
    word: '정착',
    question: '<span class="word-highlight">정착</span>의 뜻은?',
    hint: '일정한 곳에 자리 잡음',
    choices: ['떠돌다', '일정한 곳에 자리 잡다', '유랑하다', '이동하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"정착"은 일정한 곳에 자리 잡는 것을 의미합니다.',
    example: '예문: 제도가 정착되다.'
  },
  {
    word: '제고',
    question: '<span class="word-highlight">제고</span>의 뜻은?',
    hint: '더 높임',
    choices: ['낮추다', '더 높이다', '줄이다', '감소시키다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"제고"는 더 높이는 것을 의미합니다.',
    example: '예문: 효율성을 제고하다.'
  },
  {
    word: '제기',
    question: '<span class="word-highlight">제기</span>의 뜻은?',
    hint: '내어 놓음',
    choices: ['숨기다', '내어 놓다', '감추다', '철회하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"제기"는 내어 놓는 것을 의미합니다.',
    example: '예문: 문제를 제기하다.'
  },
  {
    word: '제도',
    question: '<span class="word-highlight">제도</span>의 뜻은?',
    hint: '사회적으로 정해진 규범',
    choices: ['무질서', '사회적으로 정해진 규범', '자유', '방종'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"제도"는 사회적으로 정해진 규범을 의미합니다.',
    example: '예문: 제도를 개혁하다.'
  },
  {
    word: '제시',
    question: '<span class="word-highlight">제시</span>의 뜻은?',
    hint: '내어 보임',
    choices: ['숨기다', '내어 보이다', '감추다', '비밀로 하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"제시"는 내어 보이는 것을 의미합니다.',
    example: '예문: 대안을 제시하다.'
  },
  {
    word: '제약',
    question: '<span class="word-highlight">제약</span>의 뜻은?',
    hint: '조건을 붙여 제한함',
    choices: ['자유롭다', '조건을 붙여 제한하다', '풀어주다', '해방하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"제약"은 조건을 붙여 제한하는 것을 의미합니다.',
    example: '예문: 제약이 많다.'
  },
  {
    word: '제한',
    question: '<span class="word-highlight">제한</span>의 뜻은?',
    hint: '범위를 정하여 한정함',
    choices: ['무제한', '범위를 정하여 한정하다', '자유', '열림'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"제한"은 범위를 정하여 한정하는 것을 의미합니다.',
    example: '예문: 제한을 두다.'
  },
  {
    word: '조건',
    question: '<span class="word-highlight">조건</span>의 뜻은?',
    hint: '어떤 일이 이루어지기 위해 필요한 것',
    choices: ['무조건', '어떤 일이 이루어지기 위해 필요한 것', '결과', '목표'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"조건"은 어떤 일이 이루어지기 위해 필요한 것을 의미합니다.',
    example: '예문: 조건을 충족하다.'
  },
  {
    word: '조망',
    question: '<span class="word-highlight">조망</span>의 뜻은?',
    hint: '멀리 바라봄',
    choices: ['무시하다', '멀리 바라보다', '외면하다', '안 보다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"조망"은 멀리 바라보는 것을 의미합니다.',
    example: '예문: 미래를 조망하다.'
  },
  {
    word: '조성',
    question: '<span class="word-highlight">조성</span>의 뜻은?',
    hint: '만들어서 이룸',
    choices: ['파괴하다', '만들어서 이루다', '허물다', '무너뜨리다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"조성"은 만들어서 이루는 것을 의미합니다.',
    example: '예문: 분위기를 조성하다.'
  },
  // 701~800번 어휘
  {
    word: '조율',
    question: '<span class="word-highlight">조율</span>의 뜻은?',
    hint: '서로 맞게 조정함',
    choices: ['충돌하다', '서로 맞게 조정하다', '대립하다', '거부하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"조율"은 서로 맞게 조정하는 것을 의미합니다.',
    example: '예문: 의견을 조율하다.'
  },
  {
    word: '조장',
    question: '<span class="word-highlight">조장</span>의 뜻은?',
    hint: '부추기어 자라게 함',
    choices: ['억제하다', '부추기어 자라게 하다', '막다', '방지하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"조장"은 부추기어 자라게 하는 것을 의미합니다.',
    example: '예문: 갈등을 조장하다.'
  },
  {
    word: '조절',
    question: '<span class="word-highlight">조절</span>의 뜻은?',
    hint: '알맞게 맞추어 바로잡음',
    choices: ['방치하다', '알맞게 맞추어 바로잡다', '내버려두다', '무시하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"조절"은 알맞게 맞추어 바로잡는 것을 의미합니다.',
    example: '예문: 온도를 조절하다.'
  },
  {
    word: '조정',
    question: '<span class="word-highlight">조정</span>의 뜻은?',
    hint: '어긋난 것을 바로잡음',
    choices: ['그대로 두다', '어긋난 것을 바로잡다', '유지하다', '고정하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"조정"은 어긋난 것을 바로잡는 것을 의미합니다.',
    example: '예문: 일정을 조정하다.'
  },
  {
    word: '조직',
    question: '<span class="word-highlight">조직</span>의 뜻은?',
    hint: '일정한 목적을 위해 구성된 집단',
    choices: ['개인', '일정한 목적을 위해 구성된 집단', '혼자', '단독'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"조직"은 일정한 목적을 위해 구성된 집단을 의미합니다.',
    example: '예문: 조직을 구성하다.'
  },
  {
    word: '조치',
    question: '<span class="word-highlight">조치</span>의 뜻은?',
    hint: '필요한 대응을 취함',
    choices: ['방관하다', '필요한 대응을 취하다', '무시하다', '외면하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"조치"는 필요한 대응을 취하는 것을 의미합니다.',
    example: '예문: 적절한 조치를 취하다.'
  },
  {
    word: '조화',
    question: '<span class="word-highlight">조화</span>의 뜻은?',
    hint: '서로 잘 어울림',
    choices: ['불화', '서로 잘 어울리다', '충돌', '부조화'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"조화"는 서로 잘 어울리는 것을 의미합니다.',
    example: '예문: 조화를 이루다.'
  },
  {
    word: '존립',
    question: '<span class="word-highlight">존립</span>의 뜻은?',
    hint: '존재하여 있음',
    choices: ['소멸하다', '존재하여 있다', '사라지다', '없어지다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"존립"은 존재하여 있는 것을 의미합니다.',
    example: '예문: 국가의 존립.'
  },
  {
    word: '존속',
    question: '<span class="word-highlight">존속</span>의 뜻은?',
    hint: '계속하여 존재함',
    choices: ['단절되다', '계속하여 존재하다', '끝나다', '사라지다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"존속"은 계속하여 존재하는 것을 의미합니다.',
    example: '예문: 제도가 존속하다.'
  },
  {
    word: '존재',
    question: '<span class="word-highlight">존재</span>의 뜻은?',
    hint: '있음',
    choices: ['없음', '있다', '부재', '결여'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"존재"는 있는 것을 의미합니다.',
    example: '예문: 존재 가치.'
  },
  {
    word: '종결',
    question: '<span class="word-highlight">종결</span>의 뜻은?',
    hint: '일이 끝남',
    choices: ['시작', '일이 끝나다', '개시', '착수'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"종결"은 일이 끝나는 것을 의미합니다.',
    example: '예문: 사건이 종결되다.'
  },
  {
    word: '종래',
    question: '<span class="word-highlight">종래</span>의 뜻은?',
    hint: '지금까지',
    choices: ['앞으로', '지금까지', '미래에', '나중에'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"종래"는 지금까지를 의미합니다.',
    example: '예문: 종래의 방식.'
  },
  {
    word: '종합',
    question: '<span class="word-highlight">종합</span>의 뜻은?',
    hint: '여러 가지를 한데 모음',
    choices: ['분리하다', '여러 가지를 한데 모으다', '나누다', '쪼개다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"종합"은 여러 가지를 한데 모으는 것을 의미합니다.',
    example: '예문: 정보를 종합하다.'
  },
  {
    word: '좌우',
    question: '<span class="word-highlight">좌우</span>의 뜻은?',
    hint: '결정적인 영향을 미침',
    choices: ['무관하다', '결정적인 영향을 미치다', '관계없다', '상관없다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"좌우"는 결정적인 영향을 미치는 것을 의미합니다.',
    example: '예문: 운명을 좌우하다.'
  },
  {
    word: '주관',
    question: '<span class="word-highlight">주관</span>의 뜻은?',
    hint: '자기만의 견해',
    choices: ['객관', '자기만의 견해', '일반적', '보편적'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"주관"은 자기만의 견해를 의미합니다.',
    example: '예문: 주관적인 판단.'
  },
  {
    word: '주도',
    question: '<span class="word-highlight">주도</span>의 뜻은?',
    hint: '앞장서서 이끎',
    choices: ['따르다', '앞장서서 이끌다', '뒤따르다', '순응하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"주도"는 앞장서서 이끄는 것을 의미합니다.',
    example: '예문: 시장을 주도하다.'
  },
  {
    word: '주목',
    question: '<span class="word-highlight">주목</span>의 뜻은?',
    hint: '눈여겨봄',
    choices: ['무시하다', '눈여겨보다', '외면하다', '모르다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"주목"은 눈여겨보는 것을 의미합니다.',
    example: '예문: 세간의 주목을 받다.'
  },
  {
    word: '주요',
    question: '<span class="word-highlight">주요</span>의 뜻은?',
    hint: '중요한',
    choices: ['사소한', '중요한', '하찮은', '미미한'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"주요"는 중요한 것을 의미합니다.',
    example: '예문: 주요 원인.'
  },
  {
    word: '주장',
    question: '<span class="word-highlight">주장</span>의 뜻은?',
    hint: '자기 의견을 내세움',
    choices: ['침묵하다', '자기 의견을 내세우다', '동조하다', '따르다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"주장"은 자기 의견을 내세우는 것을 의미합니다.',
    example: '예문: 주장을 펼치다.'
  },
  {
    word: '준거',
    question: '<span class="word-highlight">준거</span>의 뜻은?',
    hint: '판단의 기준',
    choices: ['무기준', '판단의 기준', '무질서', '자유'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"준거"는 판단의 기준을 의미합니다.',
    example: '예문: 준거가 되다.'
  },
  {
    word: '준수',
    question: '<span class="word-highlight">준수</span>의 뜻은?',
    hint: '규칙을 지켜 따름',
    choices: ['위반하다', '규칙을 지켜 따르다', '어기다', '무시하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"준수"는 규칙을 지켜 따르는 것을 의미합니다.',
    example: '예문: 법을 준수하다.'
  },
  {
    word: '중대',
    question: '<span class="word-highlight">중대</span>의 뜻은?',
    hint: '매우 중요함',
    choices: ['사소하다', '매우 중요하다', '하찮다', '미미하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"중대"는 매우 중요한 것을 의미합니다.',
    example: '예문: 중대한 결정.'
  },
  {
    word: '중립',
    question: '<span class="word-highlight">중립</span>의 뜻은?',
    hint: '어느 편에도 치우치지 않음',
    choices: ['편파적', '어느 편에도 치우치지 않다', '한쪽 편', '편들다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"중립"은 어느 편에도 치우치지 않는 것을 의미합니다.',
    example: '예문: 중립을 지키다.'
  },
  {
    word: '중시',
    question: '<span class="word-highlight">중시</span>의 뜻은?',
    hint: '중요하게 여김',
    choices: ['경시하다', '중요하게 여기다', '무시하다', '가볍게 보다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"중시"는 중요하게 여기는 것을 의미합니다.',
    example: '예문: 안전을 중시하다.'
  },
  {
    word: '중재',
    question: '<span class="word-highlight">중재</span>의 뜻은?',
    hint: '분쟁을 조정함',
    choices: ['방관하다', '분쟁을 조정하다', '외면하다', '무시하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"중재"는 분쟁을 조정하는 것을 의미합니다.',
    example: '예문: 중재에 나서다.'
  },
  {
    word: '중점',
    question: '<span class="word-highlight">중점</span>의 뜻은?',
    hint: '가장 중요하게 여기는 점',
    choices: ['부차적', '가장 중요하게 여기는 점', '사소한', '하찮은'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"중점"은 가장 중요하게 여기는 점을 의미합니다.',
    example: '예문: 중점을 두다.'
  },
  {
    word: '증가',
    question: '<span class="word-highlight">증가</span>의 뜻은?',
    hint: '수나 양이 늘어남',
    choices: ['감소', '수나 양이 늘어나다', '줄다', '하락'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"증가"는 수나 양이 늘어나는 것을 의미합니다.',
    example: '예문: 인구가 증가하다.'
  },
  {
    word: '증거',
    question: '<span class="word-highlight">증거</span>의 뜻은?',
    hint: '사실을 증명하는 근거',
    choices: ['추측', '사실을 증명하는 근거', '짐작', '예상'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"증거"는 사실을 증명하는 근거를 의미합니다.',
    example: '예문: 증거를 확보하다.'
  },
  {
    word: '증대',
    question: '<span class="word-highlight">증대</span>의 뜻은?',
    hint: '더 커짐',
    choices: ['축소', '더 커지다', '줄다', '감소'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"증대"는 더 커지는 것을 의미합니다.',
    example: '예문: 역할이 증대되다.'
  },
  {
    word: '증명',
    question: '<span class="word-highlight">증명</span>의 뜻은?',
    hint: '사실임을 밝힘',
    choices: ['숨기다', '사실임을 밝히다', '감추다', '부정하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"증명"은 사실임을 밝히는 것을 의미합니다.',
    example: '예문: 무죄를 증명하다.'
  },
  {
    word: '증진',
    question: '<span class="word-highlight">증진</span>의 뜻은?',
    hint: '더 좋아지게 함',
    choices: ['악화시키다', '더 좋아지게 하다', '나빠지다', '퇴보하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"증진"은 더 좋아지게 하는 것을 의미합니다.',
    example: '예문: 건강을 증진하다.'
  },
  {
    word: '지각',
    question: '<span class="word-highlight">지각</span>의 뜻은?',
    hint: '감각을 통해 알아차림',
    choices: ['모르다', '감각을 통해 알아차리다', '무시하다', '간과하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"지각"은 감각을 통해 알아차리는 것을 의미합니다.',
    example: '예문: 위험을 지각하다.'
  },
  {
    word: '지속',
    question: '<span class="word-highlight">지속</span>의 뜻은?',
    hint: '계속 이어짐',
    choices: ['중단', '계속 이어지다', '멈춤', '끊김'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"지속"은 계속 이어지는 것을 의미합니다.',
    example: '예문: 지속적인 노력.'
  },
  {
    word: '지양',
    question: '<span class="word-highlight">지양</span>의 뜻은?',
    hint: '더 높은 단계로 오름',
    choices: ['지향과 같다', '더 높은 단계로 오르다', '피하다', '버리다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"지양"은 더 높은 단계로 오르는 것을 의미합니다.',
    example: '예문: 낡은 방식을 지양하다.'
  },
  {
    word: '지적',
    question: '<span class="word-highlight">지적</span>의 뜻은?',
    hint: '잘못된 것을 가리켜 말함',
    choices: ['묵인하다', '잘못된 것을 가리켜 말하다', '넘어가다', '무시하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"지적"은 잘못된 것을 가리켜 말하는 것을 의미합니다.',
    example: '예문: 문제를 지적하다.'
  },
  {
    word: '지지',
    question: '<span class="word-highlight">지지</span>의 뜻은?',
    hint: '편을 들어 도움',
    choices: ['반대하다', '편을 들어 돕다', '비판하다', '거부하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"지지"는 편을 들어 돕는 것을 의미합니다.',
    example: '예문: 지지를 얻다.'
  },
  {
    word: '지향',
    question: '<span class="word-highlight">지향</span>의 뜻은?',
    hint: '목표로 삼고 나아감',
    choices: ['포기하다', '목표로 삼고 나아가다', '버리다', '회피하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"지향"은 목표로 삼고 나아가는 것을 의미합니다.',
    example: '예문: 발전을 지향하다.'
  },
  {
    word: '직면',
    question: '<span class="word-highlight">직면</span>의 뜻은?',
    hint: '문제를 바로 마주함',
    choices: ['피하다', '문제를 바로 마주하다', '회피하다', '도망치다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"직면"은 문제를 바로 마주하는 것을 의미합니다.',
    example: '예문: 위기에 직면하다.'
  },
  {
    word: '직접',
    question: '<span class="word-highlight">직접</span>의 뜻은?',
    hint: '중간에 아무것도 거치지 않음',
    choices: ['간접', '중간에 아무것도 거치지 않다', '대리', '통해'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"직접"은 중간에 아무것도 거치지 않는 것을 의미합니다.',
    example: '예문: 직접 만나다.'
  },
  {
    word: '진단',
    question: '<span class="word-highlight">진단</span>의 뜻은?',
    hint: '상태를 판단함',
    choices: ['모르다', '상태를 판단하다', '무시하다', '간과하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"진단"은 상태를 판단하는 것을 의미합니다.',
    example: '예문: 문제를 진단하다.'
  },
  {
    word: '진보',
    question: '<span class="word-highlight">진보</span>의 뜻은?',
    hint: '앞으로 나아감',
    choices: ['퇴보', '앞으로 나아가다', '후퇴', '정체'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"진보"는 앞으로 나아가는 것을 의미합니다.',
    example: '예문: 사회가 진보하다.'
  },
  {
    word: '진술',
    question: '<span class="word-highlight">진술</span>의 뜻은?',
    hint: '사실을 말함',
    choices: ['침묵하다', '사실을 말하다', '숨기다', '거짓말하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"진술"은 사실을 말하는 것을 의미합니다.',
    example: '예문: 진술을 하다.'
  },
  {
    word: '진위',
    question: '<span class="word-highlight">진위</span>의 뜻은?',
    hint: '참과 거짓',
    choices: ['확실함', '참과 거짓', '당연함', '명백함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"진위"는 참과 거짓을 의미합니다.',
    example: '예문: 진위를 가리다.'
  },
  {
    word: '진전',
    question: '<span class="word-highlight">진전</span>의 뜻은?',
    hint: '일이 앞으로 나아감',
    choices: ['정체', '일이 앞으로 나아가다', '퇴보', '후퇴'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"진전"은 일이 앞으로 나아가는 것을 의미합니다.',
    example: '예문: 진전이 있다.'
  },
  {
    word: '진출',
    question: '<span class="word-highlight">진출</span>의 뜻은?',
    hint: '앞으로 나아가 활동함',
    choices: ['후퇴하다', '앞으로 나아가 활동하다', '물러나다', '철수하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"진출"은 앞으로 나아가 활동하는 것을 의미합니다.',
    example: '예문: 해외에 진출하다.'
  },
  {
    word: '진취',
    question: '<span class="word-highlight">진취</span>의 뜻은?',
    hint: '적극적으로 나아감',
    choices: ['소극적', '적극적으로 나아가다', '수동적', '안주하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"진취"는 적극적으로 나아가는 것을 의미합니다.',
    example: '예문: 진취적인 자세.'
  },
  {
    word: '진행',
    question: '<span class="word-highlight">진행</span>의 뜻은?',
    hint: '앞으로 나아감',
    choices: ['멈추다', '앞으로 나아가다', '중단하다', '정지하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"진행"은 앞으로 나아가는 것을 의미합니다.',
    example: '예문: 계획대로 진행하다.'
  },
  {
    word: '질적',
    question: '<span class="word-highlight">질적</span>의 뜻은?',
    hint: '성질에 관한',
    choices: ['양에 관한', '성질에 관한', '양적', '수량적'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"질적"은 성질에 관한 것을 의미합니다.',
    example: '예문: 질적 성장.'
  },
  {
    word: '집약',
    question: '<span class="word-highlight">집약</span>의 뜻은?',
    hint: '한데 모아 요약함',
    choices: ['흩뜨리다', '한데 모아 요약하다', '분산하다', '퍼뜨리다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"집약"은 한데 모아 요약하는 것을 의미합니다.',
    example: '예문: 내용을 집약하다.'
  },
  {
    word: '집중',
    question: '<span class="word-highlight">집중</span>의 뜻은?',
    hint: '한 곳에 모음',
    choices: ['분산', '한 곳에 모으다', '흩뜨리다', '나누다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"집중"은 한 곳에 모으는 것을 의미합니다.',
    example: '예문: 집중력을 발휘하다.'
  },
  {
    word: '차별',
    question: '<span class="word-highlight">차별</span>의 뜻은?',
    hint: '등급이나 수준의 차이를 둠',
    choices: ['평등', '등급이나 수준의 차이를 두다', '동등', '같게'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"차별"은 등급이나 수준의 차이를 두는 것을 의미합니다.',
    example: '예문: 차별을 없애다.'
  },
  {
    word: '차이',
    question: '<span class="word-highlight">차이</span>의 뜻은?',
    hint: '서로 다른 정도',
    choices: ['같음', '서로 다른 정도', '동일', '일치'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"차이"는 서로 다른 정도를 의미합니다.',
    example: '예문: 차이가 있다.'
  },
  {
    word: '착수',
    question: '<span class="word-highlight">착수</span>의 뜻은?',
    hint: '일에 손을 댐',
    choices: ['마무리하다', '일에 손을 대다', '끝내다', '완료하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"착수"는 일에 손을 대는 것을 의미합니다.',
    example: '예문: 사업에 착수하다.'
  },
  {
    word: '찬성',
    question: '<span class="word-highlight">찬성</span>의 뜻은?',
    hint: '좋다고 동의함',
    choices: ['반대', '좋다고 동의하다', '거부', '부정'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"찬성"은 좋다고 동의하는 것을 의미합니다.',
    example: '예문: 찬성표를 던지다.'
  },
  {
    word: '참여',
    question: '<span class="word-highlight">참여</span>의 뜻은?',
    hint: '어떤 일에 끼어듦',
    choices: ['빠지다', '어떤 일에 끼어들다', '불참', '배제'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"참여"는 어떤 일에 끼어드는 것을 의미합니다.',
    example: '예문: 적극적으로 참여하다.'
  },
  {
    word: '창안',
    question: '<span class="word-highlight">창안</span>의 뜻은?',
    hint: '새로 생각해 냄',
    choices: ['모방하다', '새로 생각해 내다', '따라하다', '복제하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"창안"은 새로 생각해 내는 것을 의미합니다.',
    example: '예문: 새로운 방법을 창안하다.'
  },
  {
    word: '창의',
    question: '<span class="word-highlight">창의</span>의 뜻은?',
    hint: '새로운 의견이나 생각',
    choices: ['모방', '새로운 의견이나 생각', '따라함', '답습'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"창의"는 새로운 의견이나 생각을 의미합니다.',
    example: '예문: 창의적인 아이디어.'
  },
  {
    word: '창출',
    question: '<span class="word-highlight">창출</span>의 뜻은?',
    hint: '새로 만들어 냄',
    choices: ['파괴하다', '새로 만들어 내다', '없애다', '지우다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"창출"은 새로 만들어 내는 것을 의미합니다.',
    example: '예문: 일자리를 창출하다.'
  },
  {
    word: '채택',
    question: '<span class="word-highlight">채택</span>의 뜻은?',
    hint: '골라서 씀',
    choices: ['버리다', '골라서 쓰다', '배제하다', '제외하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"채택"은 골라서 쓰는 것을 의미합니다.',
    example: '예문: 안건이 채택되다.'
  },
  {
    word: '처리',
    question: '<span class="word-highlight">처리</span>의 뜻은?',
    hint: '일을 마무리함',
    choices: ['방치하다', '일을 마무리하다', '내버려두다', '무시하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"처리"는 일을 마무리하는 것을 의미합니다.',
    example: '예문: 업무를 처리하다.'
  },
  {
    word: '처방',
    question: '<span class="word-highlight">처방</span>의 뜻은?',
    hint: '문제 해결을 위한 방법을 제시함',
    choices: ['방치하다', '문제 해결을 위한 방법을 제시하다', '무시하다', '외면하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"처방"은 문제 해결을 위한 방법을 제시하는 것을 의미합니다.',
    example: '예문: 처방을 내리다.'
  },
  {
    word: '철저',
    question: '<span class="word-highlight">철저</span>의 뜻은?',
    hint: '빈틈없이 완전함',
    choices: ['대충', '빈틈없이 완전하다', '허술하다', '엉성하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"철저"는 빈틈없이 완전한 것을 의미합니다.',
    example: '예문: 철저하게 준비하다.'
  },
  {
    word: '철회',
    question: '<span class="word-highlight">철회</span>의 뜻은?',
    hint: '거둬들임',
    choices: ['밀고 나가다', '거둬들이다', '추진하다', '강행하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"철회"는 거둬들이는 것을 의미합니다.',
    example: '예문: 제안을 철회하다.'
  },
  {
    word: '첨가',
    question: '<span class="word-highlight">첨가</span>의 뜻은?',
    hint: '덧붙여 더함',
    choices: ['빼다', '덧붙여 더하다', '제거하다', '삭제하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"첨가"는 덧붙여 더하는 것을 의미합니다.',
    example: '예문: 재료를 첨가하다.'
  },
  {
    word: '첨단',
    question: '<span class="word-highlight">첨단</span>의 뜻은?',
    hint: '가장 앞선',
    choices: ['뒤처진', '가장 앞선', '낙후된', '오래된'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"첨단"은 가장 앞선 것을 의미합니다.',
    example: '예문: 첨단 기술.'
  },
  {
    word: '체계',
    question: '<span class="word-highlight">체계</span>의 뜻은?',
    hint: '일정한 원리로 짜인 통일된 조직',
    choices: ['무질서', '일정한 원리로 짜인 통일된 조직', '혼란', '뒤죽박죽'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"체계"는 일정한 원리로 짜인 통일된 조직을 의미합니다.',
    example: '예문: 체계를 세우다.'
  },
  {
    word: '체감',
    question: '<span class="word-highlight">체감</span>의 뜻은?',
    hint: '몸으로 직접 느낌',
    choices: ['무감각', '몸으로 직접 느끼다', '모르다', '못 느끼다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"체감"은 몸으로 직접 느끼는 것을 의미합니다.',
    example: '예문: 체감 온도.'
  },
  {
    word: '체결',
    question: '<span class="word-highlight">체결</span>의 뜻은?',
    hint: '계약을 맺음',
    choices: ['파기하다', '계약을 맺다', '취소하다', '해지하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"체결"은 계약을 맺는 것을 의미합니다.',
    example: '예문: 협정을 체결하다.'
  },
  {
    word: '체득',
    question: '<span class="word-highlight">체득</span>의 뜻은?',
    hint: '몸으로 익혀 앎',
    choices: ['잊다', '몸으로 익혀 알다', '모르다', '망각하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"체득"은 몸으로 익혀 아는 것을 의미합니다.',
    example: '예문: 기술을 체득하다.'
  },
  {
    word: '체류',
    question: '<span class="word-highlight">체류</span>의 뜻은?',
    hint: '머무름',
    choices: ['떠나다', '머무르다', '이동하다', '출발하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"체류"는 머무르는 것을 의미합니다.',
    example: '예문: 해외 체류.'
  },
  {
    word: '체화',
    question: '<span class="word-highlight">체화</span>의 뜻은?',
    hint: '몸에 완전히 배게 함',
    choices: ['잊다', '몸에 완전히 배게 하다', '망각하다', '버리다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"체화"는 몸에 완전히 배게 하는 것을 의미합니다.',
    example: '예문: 지식을 체화하다.'
  },
  {
    word: '초래',
    question: '<span class="word-highlight">초래</span>의 뜻은?',
    hint: '어떤 결과를 가져옴',
    choices: ['막다', '어떤 결과를 가져오다', '방지하다', '예방하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"초래"는 어떤 결과를 가져오는 것을 의미합니다.',
    example: '예문: 문제를 초래하다.'
  },
  {
    word: '초월',
    question: '<span class="word-highlight">초월</span>의 뜻은?',
    hint: '범위를 벗어남',
    choices: ['속하다', '범위를 벗어나다', '포함되다', '갇히다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"초월"은 범위를 벗어나는 것을 의미합니다.',
    example: '예문: 한계를 초월하다.'
  },
  {
    word: '초점',
    question: '<span class="word-highlight">초점</span>의 뜻은?',
    hint: '관심이 모이는 중심',
    choices: ['분산', '관심이 모이는 중심', '흩어짐', '무관심'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"초점"은 관심이 모이는 중심을 의미합니다.',
    example: '예문: 초점을 맞추다.'
  },
  {
    word: '촉구',
    question: '<span class="word-highlight">촉구</span>의 뜻은?',
    hint: '강하게 요구함',
    choices: ['허용하다', '강하게 요구하다', '양보하다', '포기하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"촉구"는 강하게 요구하는 것을 의미합니다.',
    example: '예문: 해결을 촉구하다.'
  },
  {
    word: '촉발',
    question: '<span class="word-highlight">촉발</span>의 뜻은?',
    hint: '어떤 일이 일어나게 함',
    choices: ['막다', '어떤 일이 일어나게 하다', '방지하다', '억제하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"촉발"은 어떤 일이 일어나게 하는 것을 의미합니다.',
    example: '예문: 논쟁을 촉발하다.'
  },
  {
    word: '촉진',
    question: '<span class="word-highlight">촉진</span>의 뜻은?',
    hint: '재촉하여 빠르게 함',
    choices: ['늦추다', '재촉하여 빠르게 하다', '지연시키다', '미루다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"촉진"은 재촉하여 빠르게 하는 것을 의미합니다.',
    example: '예문: 성장을 촉진하다.'
  },
  {
    word: '총체',
    question: '<span class="word-highlight">총체</span>의 뜻은?',
    hint: '모두 합한 전체',
    choices: ['부분', '모두 합한 전체', '일부', '조각'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"총체"는 모두 합한 전체를 의미합니다.',
    example: '예문: 총체적인 난국.'
  },
  {
    word: '최소',
    question: '<span class="word-highlight">최소</span>의 뜻은?',
    hint: '가장 적음',
    choices: ['최대', '가장 적다', '최고', '가장 많다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"최소"는 가장 적은 것을 의미합니다.',
    example: '예문: 최소한의 비용.'
  },
  {
    word: '최적',
    question: '<span class="word-highlight">최적</span>의 뜻은?',
    hint: '가장 알맞음',
    choices: ['최악', '가장 알맞다', '부적합', '부적절'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"최적"은 가장 알맞은 것을 의미합니다.',
    example: '예문: 최적의 조건.'
  },
  {
    word: '추구',
    question: '<span class="word-highlight">추구</span>의 뜻은?',
    hint: '목적을 이루려고 뒤쫓음',
    choices: ['포기하다', '목적을 이루려고 뒤쫓다', '버리다', '그만두다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"추구"는 목적을 이루려고 뒤쫓는 것을 의미합니다.',
    example: '예문: 행복을 추구하다.'
  },
  {
    word: '추론',
    question: '<span class="word-highlight">추론</span>의 뜻은?',
    hint: '미루어 생각함',
    choices: ['확신하다', '미루어 생각하다', '단정하다', '확정하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"추론"은 미루어 생각하는 것을 의미합니다.',
    example: '예문: 결론을 추론하다.'
  },
  {
    word: '추세',
    question: '<span class="word-highlight">추세</span>의 뜻은?',
    hint: '일이 흘러가는 형편',
    choices: ['고정', '일이 흘러가는 형편', '정체', '변화 없음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"추세"는 일이 흘러가는 형편을 의미합니다.',
    example: '예문: 최근 추세.'
  },
  {
    word: '추이',
    question: '<span class="word-highlight">추이</span>의 뜻은?',
    hint: '시간에 따른 변화',
    choices: ['고정', '시간에 따른 변화', '불변', '정체'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"추이"는 시간에 따른 변화를 의미합니다.',
    example: '예문: 추이를 살피다.'
  },
  {
    word: '추진',
    question: '<span class="word-highlight">추진</span>의 뜻은?',
    hint: '밀어서 나아가게 함',
    choices: ['중단하다', '밀어서 나아가게 하다', '멈추다', '포기하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"추진"은 밀어서 나아가게 하는 것을 의미합니다.',
    example: '예문: 사업을 추진하다.'
  },
  {
    word: '추출',
    question: '<span class="word-highlight">추출</span>의 뜻은?',
    hint: '뽑아냄',
    choices: ['넣다', '뽑아내다', '집어넣다', '추가하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"추출"은 뽑아내는 것을 의미합니다.',
    example: '예문: 성분을 추출하다.'
  },
  {
    word: '축소',
    question: '<span class="word-highlight">축소</span>의 뜻은?',
    hint: '줄여서 작게 함',
    choices: ['확대', '줄여서 작게 하다', '늘리다', '키우다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"축소"는 줄여서 작게 하는 것을 의미합니다.',
    example: '예문: 규모를 축소하다.'
  },
  {
    word: '축적',
    question: '<span class="word-highlight">축적</span>의 뜻은?',
    hint: '쌓아서 모음',
    choices: ['소비하다', '쌓아서 모으다', '쓰다', '낭비하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"축적"은 쌓아서 모으는 것을 의미합니다.',
    example: '예문: 경험을 축적하다.'
  },
  {
    word: '출현',
    question: '<span class="word-highlight">출현</span>의 뜻은?',
    hint: '나타남',
    choices: ['사라지다', '나타나다', '숨다', '없어지다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"출현"은 나타나는 것을 의미합니다.',
    example: '예문: 새로운 기술이 출현하다.'
  },
  {
    word: '충격',
    question: '<span class="word-highlight">충격</span>의 뜻은?',
    hint: '강하게 부딪침',
    choices: ['평온', '강하게 부딪치다', '안정', '평화'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"충격"은 강하게 부딪치는 것을 의미합니다.',
    example: '예문: 충격을 받다.'
  },
  {
    word: '충돌',
    question: '<span class="word-highlight">충돌</span>의 뜻은?',
    hint: '서로 맞부딪침',
    choices: ['화해하다', '서로 맞부딪치다', '타협하다', '조화되다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"충돌"은 서로 맞부딪치는 것을 의미합니다.',
    example: '예문: 의견이 충돌하다.'
  },
  {
    word: '충분',
    question: '<span class="word-highlight">충분</span>의 뜻은?',
    hint: '넉넉함',
    choices: ['부족', '넉넉하다', '모자라다', '불충분'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"충분"은 넉넉한 것을 의미합니다.',
    example: '예문: 시간이 충분하다.'
  },
  {
    word: '충족',
    question: '<span class="word-highlight">충족</span>의 뜻은?',
    hint: '필요한 만큼 채움',
    choices: ['부족하다', '필요한 만큼 채우다', '모자라다', '비다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"충족"은 필요한 만큼 채우는 것을 의미합니다.',
    example: '예문: 조건을 충족하다.'
  },
  {
    word: '취득',
    question: '<span class="word-highlight">취득</span>의 뜻은?',
    hint: '얻어서 가짐',
    choices: ['잃다', '얻어서 가지다', '빼앗기다', '포기하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"취득"은 얻어서 가지는 것을 의미합니다.',
    example: '예문: 자격을 취득하다.'
  },
  {
    word: '취약',
    question: '<span class="word-highlight">취약</span>의 뜻은?',
    hint: '약하여 무너지기 쉬움',
    choices: ['강하다', '약하여 무너지기 쉽다', '튼튼하다', '견고하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"취약"은 약하여 무너지기 쉬운 것을 의미합니다.',
    example: '예문: 취약점을 보완하다.'
  },
  {
    word: '취지',
    question: '<span class="word-highlight">취지</span>의 뜻은?',
    hint: '어떤 일을 하려는 목적',
    choices: ['무목적', '어떤 일을 하려는 목적', '우연', '아무 생각 없이'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"취지"는 어떤 일을 하려는 목적을 의미합니다.',
    example: '예문: 취지에 맞게 운영하다.'
  },
  // 801~900번 어휘
  {
    word: '취향',
    question: '<span class="word-highlight">취향</span>의 뜻은?',
    hint: '좋아하는 경향',
    choices: ['무관심', '좋아하는 경향', '싫어함', '거부'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"취향"은 좋아하는 경향을 의미합니다.',
    example: '예문: 취향이 다르다.'
  },
  {
    word: '측면',
    question: '<span class="word-highlight">측면</span>의 뜻은?',
    hint: '여러 면 중 한 면',
    choices: ['전체', '여러 면 중 한 면', '전부', '모두'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"측면"은 여러 면 중 한 면을 의미합니다.',
    example: '예문: 다른 측면에서 보다.'
  },
  {
    word: '측정',
    question: '<span class="word-highlight">측정</span>의 뜻은?',
    hint: '재어 정함',
    choices: ['추측', '재어 정하다', '짐작', '어림'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"측정"은 재어 정하는 것을 의미합니다.',
    example: '예문: 온도를 측정하다.'
  },
  {
    word: '침묵',
    question: '<span class="word-highlight">침묵</span>의 뜻은?',
    hint: '말을 하지 않음',
    choices: ['말하다', '말을 하지 않다', '떠들다', '소리치다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"침묵"은 말을 하지 않는 것을 의미합니다.',
    example: '예문: 침묵을 지키다.'
  },
  {
    word: '침투',
    question: '<span class="word-highlight">침투</span>의 뜻은?',
    hint: '스며들어 감',
    choices: ['빠져나오다', '스며들어 가다', '나오다', '탈출하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"침투"는 스며들어 가는 것을 의미합니다.',
    example: '예문: 문화가 침투하다.'
  },
  {
    word: '침해',
    question: '<span class="word-highlight">침해</span>의 뜻은?',
    hint: '침범하여 해침',
    choices: ['보호하다', '침범하여 해치다', '지키다', '존중하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"침해"는 침범하여 해치는 것을 의미합니다.',
    example: '예문: 권리를 침해하다.'
  },
  {
    word: '타개',
    question: '<span class="word-highlight">타개</span>의 뜻은?',
    hint: '어려운 국면을 헤쳐 나감',
    choices: ['포기하다', '어려운 국면을 헤쳐 나가다', '좌절하다', '실패하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"타개"는 어려운 국면을 헤쳐 나가는 것을 의미합니다.',
    example: '예문: 국면을 타개하다.'
  },
  {
    word: '타당',
    question: '<span class="word-highlight">타당</span>의 뜻은?',
    hint: '사리에 맞아 옳음',
    choices: ['부당하다', '사리에 맞아 옳다', '틀리다', '잘못되다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"타당"은 사리에 맞아 옳은 것을 의미합니다.',
    example: '예문: 타당한 근거.'
  },
  {
    word: '타산',
    question: '<span class="word-highlight">타산</span>의 뜻은?',
    hint: '이익과 손해를 계산함',
    choices: ['무시하다', '이익과 손해를 계산하다', '모르다', '관심 없다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"타산"은 이익과 손해를 계산하는 것을 의미합니다.',
    example: '예문: 타산적인 태도.'
  },
  {
    word: '타파',
    question: '<span class="word-highlight">타파</span>의 뜻은?',
    hint: '부숴 없앰',
    choices: ['유지하다', '부숴 없애다', '보존하다', '지키다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"타파"는 부숴 없애는 것을 의미합니다.',
    example: '예문: 관습을 타파하다.'
  },
  {
    word: '타협',
    question: '<span class="word-highlight">타협</span>의 뜻은?',
    hint: '서로 양보하여 합의함',
    choices: ['고집하다', '서로 양보하여 합의하다', '대립하다', '충돌하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"타협"은 서로 양보하여 합의하는 것을 의미합니다.',
    example: '예문: 타협점을 찾다.'
  },
  {
    word: '탁월',
    question: '<span class="word-highlight">탁월</span>의 뜻은?',
    hint: '뛰어나게 훌륭함',
    choices: ['평범하다', '뛰어나게 훌륭하다', '보통이다', '흔하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"탁월"은 뛰어나게 훌륭한 것을 의미합니다.',
    example: '예문: 탁월한 능력.'
  },
  {
    word: '탈피',
    question: '<span class="word-highlight">탈피</span>의 뜻은?',
    hint: '벗어남',
    choices: ['머무르다', '벗어나다', '갇히다', '속하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"탈피"는 벗어나는 것을 의미합니다.',
    example: '예문: 고정관념에서 탈피하다.'
  },
  {
    word: '탐구',
    question: '<span class="word-highlight">탐구</span>의 뜻은?',
    hint: '깊이 살피고 연구함',
    choices: ['무관심', '깊이 살피고 연구하다', '모르다', '무시하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"탐구"는 깊이 살피고 연구하는 것을 의미합니다.',
    example: '예문: 진리를 탐구하다.'
  },
  {
    word: '탐색',
    question: '<span class="word-highlight">탐색</span>의 뜻은?',
    hint: '찾아 살핌',
    choices: ['무시하다', '찾아 살피다', '외면하다', '모르다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"탐색"은 찾아 살피는 것을 의미합니다.',
    example: '예문: 정보를 탐색하다.'
  },
  {
    word: '태도',
    question: '<span class="word-highlight">태도</span>의 뜻은?',
    hint: '어떤 일에 대한 자세',
    choices: ['무관심', '어떤 일에 대한 자세', '모름', '무지'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"태도"는 어떤 일에 대한 자세를 의미합니다.',
    example: '예문: 태도를 바꾸다.'
  },
  {
    word: '태만',
    question: '<span class="word-highlight">태만</span>의 뜻은?',
    hint: '게으르고 소홀함',
    choices: ['부지런하다', '게으르고 소홀하다', '열심히 하다', '성실하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"태만"은 게으르고 소홀한 것을 의미합니다.',
    example: '예문: 직무 태만.'
  },
  {
    word: '통계',
    question: '<span class="word-highlight">통계</span>의 뜻은?',
    hint: '수량을 모아 정리한 것',
    choices: ['추측', '수량을 모아 정리한 것', '짐작', '어림'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"통계"는 수량을 모아 정리한 것을 의미합니다.',
    example: '예문: 통계 자료.'
  },
  {
    word: '통념',
    question: '<span class="word-highlight">통념</span>의 뜻은?',
    hint: '일반적으로 통하는 생각',
    choices: ['새로운 생각', '일반적으로 통하는 생각', '독창적', '창의적'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"통념"은 일반적으로 통하는 생각을 의미합니다.',
    example: '예문: 통념을 깨다.'
  },
  {
    word: '통상',
    question: '<span class="word-highlight">통상</span>의 뜻은?',
    hint: '보통, 일반적으로',
    choices: ['특별히', '보통, 일반적으로', '예외적', '드물게'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"통상"은 보통, 일반적으로를 의미합니다.',
    example: '예문: 통상적인 절차.'
  },
  {
    word: '통솔',
    question: '<span class="word-highlight">통솔</span>의 뜻은?',
    hint: '거느려 이끎',
    choices: ['따르다', '거느려 이끌다', '복종하다', '순응하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"통솔"은 거느려 이끄는 것을 의미합니다.',
    example: '예문: 군대를 통솔하다.'
  },
  {
    word: '통용',
    question: '<span class="word-highlight">통용</span>의 뜻은?',
    hint: '일반적으로 쓰임',
    choices: ['특수하다', '일반적으로 쓰이다', '한정되다', '제한되다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"통용"은 일반적으로 쓰이는 것을 의미합니다.',
    example: '예문: 전국에서 통용되다.'
  },
  {
    word: '통제',
    question: '<span class="word-highlight">통제</span>의 뜻은?',
    hint: '규제하여 다스림',
    choices: ['풀어주다', '규제하여 다스리다', '해방하다', '자유롭게 하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"통제"는 규제하여 다스리는 것을 의미합니다.',
    example: '예문: 교통을 통제하다.'
  },
  {
    word: '통찰',
    question: '<span class="word-highlight">통찰</span>의 뜻은?',
    hint: '예리하게 꿰뚫어 봄',
    choices: ['모르다', '예리하게 꿰뚫어 보다', '무시하다', '간과하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"통찰"은 예리하게 꿰뚫어 보는 것을 의미합니다.',
    example: '예문: 통찰력이 뛰어나다.'
  },
  {
    word: '통합',
    question: '<span class="word-highlight">통합</span>의 뜻은?',
    hint: '둘 이상을 합쳐 하나로 만듦',
    choices: ['분리하다', '둘 이상을 합쳐 하나로 만들다', '나누다', '쪼개다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"통합"은 둘 이상을 합쳐 하나로 만드는 것을 의미합니다.',
    example: '예문: 시스템을 통합하다.'
  },
  {
    word: '퇴보',
    question: '<span class="word-highlight">퇴보</span>의 뜻은?',
    hint: '뒤로 물러남',
    choices: ['진보', '뒤로 물러나다', '발전', '성장'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"퇴보"는 뒤로 물러나는 것을 의미합니다.',
    example: '예문: 기술이 퇴보하다.'
  },
  {
    word: '투영',
    question: '<span class="word-highlight">투영</span>의 뜻은?',
    hint: '비추어 나타냄',
    choices: ['숨기다', '비추어 나타내다', '감추다', '가리다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"투영"은 비추어 나타내는 것을 의미합니다.',
    example: '예문: 현실을 투영하다.'
  },
  {
    word: '투입',
    question: '<span class="word-highlight">투입</span>의 뜻은?',
    hint: '집어넣음',
    choices: ['빼다', '집어넣다', '제거하다', '빠뜨리다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"투입"은 집어넣는 것을 의미합니다.',
    example: '예문: 자원을 투입하다.'
  },
  {
    word: '투자',
    question: '<span class="word-highlight">투자</span>의 뜻은?',
    hint: '이익을 얻기 위해 자본을 댐',
    choices: ['소비하다', '이익을 얻기 위해 자본을 대다', '낭비하다', '쓰다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"투자"는 이익을 얻기 위해 자본을 대는 것을 의미합니다.',
    example: '예문: 주식에 투자하다.'
  },
  {
    word: '특수',
    question: '<span class="word-highlight">특수</span>의 뜻은?',
    hint: '특별하고 다름',
    choices: ['보통', '특별하고 다르다', '일반적', '평범한'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"특수"는 특별하고 다른 것을 의미합니다.',
    example: '예문: 특수한 상황.'
  },
  {
    word: '특징',
    question: '<span class="word-highlight">특징</span>의 뜻은?',
    hint: '다른 것과 구별되는 점',
    choices: ['공통점', '다른 것과 구별되는 점', '같은 점', '유사점'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"특징"은 다른 것과 구별되는 점을 의미합니다.',
    example: '예문: 특징을 파악하다.'
  },
  {
    word: '파괴',
    question: '<span class="word-highlight">파괴</span>의 뜻은?',
    hint: '부숴 없앰',
    choices: ['건설하다', '부숴 없애다', '만들다', '세우다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"파괴"는 부숴 없애는 것을 의미합니다.',
    example: '예문: 환경을 파괴하다.'
  },
  {
    word: '파급',
    question: '<span class="word-highlight">파급</span>의 뜻은?',
    hint: '영향이 차차 퍼져 나감',
    choices: ['멈추다', '영향이 차차 퍼져 나가다', '제한되다', '한정되다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"파급"은 영향이 차차 퍼져 나가는 것을 의미합니다.',
    example: '예문: 파급 효과가 크다.'
  },
  {
    word: '파생',
    question: '<span class="word-highlight">파생</span>의 뜻은?',
    hint: '어떤 것에서 갈라져 나옴',
    choices: ['본래', '어떤 것에서 갈라져 나오다', '원래', '근본'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"파생"은 어떤 것에서 갈라져 나오는 것을 의미합니다.',
    example: '예문: 파생 상품.'
  },
  {
    word: '파악',
    question: '<span class="word-highlight">파악</span>의 뜻은?',
    hint: '확실히 알아냄',
    choices: ['모르다', '확실히 알아내다', '무시하다', '간과하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"파악"은 확실히 알아내는 것을 의미합니다.',
    example: '예문: 상황을 파악하다.'
  },
  {
    word: '판단',
    question: '<span class="word-highlight">판단</span>의 뜻은?',
    hint: '생각하여 결정함',
    choices: ['무지', '생각하여 결정하다', '모르다', '방치하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"판단"은 생각하여 결정하는 것을 의미합니다.',
    example: '예문: 올바른 판단을 내리다.'
  },
  {
    word: '판명',
    question: '<span class="word-highlight">판명</span>의 뜻은?',
    hint: '사실이 밝혀짐',
    choices: ['숨겨지다', '사실이 밝혀지다', '감춰지다', '모르다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"판명"은 사실이 밝혀지는 것을 의미합니다.',
    example: '예문: 진상이 판명되다.'
  },
  {
    word: '판별',
    question: '<span class="word-highlight">판별</span>의 뜻은?',
    hint: '가려서 구별함',
    choices: ['혼동하다', '가려서 구별하다', '뒤섞다', '헷갈리다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"판별"은 가려서 구별하는 것을 의미합니다.',
    example: '예문: 진위를 판별하다.'
  },
  {
    word: '팽배',
    question: '<span class="word-highlight">팽배</span>의 뜻은?',
    hint: '어떤 분위기가 가득 참',
    choices: ['사라지다', '어떤 분위기가 가득 차다', '없어지다', '줄다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"팽배"는 어떤 분위기가 가득 차는 것을 의미합니다.',
    example: '예문: 불안감이 팽배하다.'
  },
  {
    word: '편견',
    question: '<span class="word-highlight">편견</span>의 뜻은?',
    hint: '치우친 견해',
    choices: ['공정하다', '치우친 견해', '균형 잡힌', '중립적'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"편견"은 치우친 견해를 의미합니다.',
    example: '예문: 편견을 버리다.'
  },
  {
    word: '편성',
    question: '<span class="word-highlight">편성</span>의 뜻은?',
    hint: '조직을 짜서 만듦',
    choices: ['해체하다', '조직을 짜서 만들다', '해산하다', '없애다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"편성"은 조직을 짜서 만드는 것을 의미합니다.',
    example: '예문: 예산을 편성하다.'
  },
  {
    word: '편의',
    question: '<span class="word-highlight">편의</span>의 뜻은?',
    hint: '편리함',
    choices: ['불편', '편리함', '어려움', '곤란'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"편의"는 편리함을 의미합니다.',
    example: '예문: 편의를 제공하다.'
  },
  {
    word: '편재',
    question: '<span class="word-highlight">편재</span>의 뜻은?',
    hint: '한쪽에 치우쳐 있음',
    choices: ['고르게 분포', '한쪽에 치우쳐 있다', '균등하다', '평등하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"편재"는 한쪽에 치우쳐 있는 것을 의미합니다.',
    example: '예문: 자원이 편재되어 있다.'
  },
  {
    word: '평가',
    question: '<span class="word-highlight">평가</span>의 뜻은?',
    hint: '가치를 따져 매김',
    choices: ['무시하다', '가치를 따져 매기다', '외면하다', '모르다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"평가"는 가치를 따져 매기는 것을 의미합니다.',
    example: '예문: 성과를 평가하다.'
  },
  {
    word: '평범',
    question: '<span class="word-highlight">평범</span>의 뜻은?',
    hint: '특별하지 않고 보통임',
    choices: ['특별하다', '특별하지 않고 보통이다', '독특하다', '뛰어나다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"평범"은 특별하지 않고 보통인 것을 의미합니다.',
    example: '예문: 평범한 일상.'
  },
  {
    word: '포괄',
    question: '<span class="word-highlight">포괄</span>의 뜻은?',
    hint: '모두 싸서 품음',
    choices: ['배제하다', '모두 싸서 품다', '제외하다', '빼다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"포괄"은 모두 싸서 품는 것을 의미합니다.',
    example: '예문: 포괄적인 계획.'
  },
  {
    word: '포기',
    question: '<span class="word-highlight">포기</span>의 뜻은?',
    hint: '하려던 것을 그만둠',
    choices: ['계속하다', '하려던 것을 그만두다', '유지하다', '지속하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"포기"는 하려던 것을 그만두는 것을 의미합니다.',
    example: '예문: 꿈을 포기하지 마라.'
  },
  {
    word: '포용',
    question: '<span class="word-highlight">포용</span>의 뜻은?',
    hint: '널리 받아들임',
    choices: ['배척하다', '널리 받아들이다', '거부하다', '밀어내다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"포용"은 널리 받아들이는 것을 의미합니다.',
    example: '예문: 포용력이 있다.'
  },
  {
    word: '포착',
    question: '<span class="word-highlight">포착</span>의 뜻은?',
    hint: '잡아냄',
    choices: ['놓치다', '잡아내다', '빠뜨리다', '지나치다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"포착"은 잡아내는 것을 의미합니다.',
    example: '예문: 기회를 포착하다.'
  },
  {
    word: '포함',
    question: '<span class="word-highlight">포함</span>의 뜻은?',
    hint: '안에 넣음',
    choices: ['제외하다', '안에 넣다', '빼다', '배제하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"포함"은 안에 넣는 것을 의미합니다.',
    example: '예문: 비용에 포함되다.'
  },
  {
    word: '표명',
    question: '<span class="word-highlight">표명</span>의 뜻은?',
    hint: '의사를 밝힘',
    choices: ['숨기다', '의사를 밝히다', '감추다', '비밀로 하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"표명"은 의사를 밝히는 것을 의미합니다.',
    example: '예문: 입장을 표명하다.'
  },
  {
    word: '표면',
    question: '<span class="word-highlight">표면</span>의 뜻은?',
    hint: '겉',
    choices: ['속', '겉', '내면', '안'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"표면"은 겉을 의미합니다.',
    example: '예문: 표면적인 관계.'
  },
  {
    word: '표방',
    question: '<span class="word-highlight">표방</span>의 뜻은?',
    hint: '어떤 것을 내세움',
    choices: ['숨기다', '어떤 것을 내세우다', '감추다', '비밀로 하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"표방"은 어떤 것을 내세우는 것을 의미합니다.',
    example: '예문: 민주주의를 표방하다.'
  },
  {
    word: '표출',
    question: '<span class="word-highlight">표출</span>의 뜻은?',
    hint: '겉으로 드러냄',
    choices: ['숨기다', '겉으로 드러내다', '감추다', '억누르다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"표출"은 겉으로 드러내는 것을 의미합니다.',
    example: '예문: 감정을 표출하다.'
  },
  {
    word: '표현',
    question: '<span class="word-highlight">표현</span>의 뜻은?',
    hint: '생각을 겉으로 나타냄',
    choices: ['숨기다', '생각을 겉으로 나타내다', '감추다', '억누르다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"표현"은 생각을 겉으로 나타내는 것을 의미합니다.',
    example: '예문: 자신을 표현하다.'
  },
  {
    word: '풍부',
    question: '<span class="word-highlight">풍부</span>의 뜻은?',
    hint: '넉넉하고 많음',
    choices: ['부족', '넉넉하고 많다', '빈약', '결핍'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"풍부"는 넉넉하고 많은 것을 의미합니다.',
    example: '예문: 자원이 풍부하다.'
  },
  {
    word: '풍자',
    question: '<span class="word-highlight">풍자</span>의 뜻은?',
    hint: '빗대어 비웃음',
    choices: ['칭찬하다', '빗대어 비웃다', '존경하다', '찬양하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"풍자"는 빗대어 비웃는 것을 의미합니다.',
    example: '예문: 사회를 풍자하다.'
  },
  {
    word: '피력',
    question: '<span class="word-highlight">피력</span>의 뜻은?',
    hint: '생각을 드러내어 말함',
    choices: ['숨기다', '생각을 드러내어 말하다', '감추다', '비밀로 하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"피력"은 생각을 드러내어 말하는 것을 의미합니다.',
    example: '예문: 의견을 피력하다.'
  },
  {
    word: '피상',
    question: '<span class="word-highlight">피상</span>의 뜻은?',
    hint: '겉만 보고 깊이가 없음',
    choices: ['심오하다', '겉만 보고 깊이가 없다', '깊다', '깊이있다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"피상"은 겉만 보고 깊이가 없는 것을 의미합니다.',
    example: '예문: 피상적인 이해.'
  },
  {
    word: '필연',
    question: '<span class="word-highlight">필연</span>의 뜻은?',
    hint: '반드시 그렇게 됨',
    choices: ['우연', '반드시 그렇게 되다', '뜻밖', '예상 밖'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"필연"은 반드시 그렇게 되는 것을 의미합니다.',
    example: '예문: 필연적인 결과.'
  },
  {
    word: '필요',
    question: '<span class="word-highlight">필요</span>의 뜻은?',
    hint: '꼭 있어야 함',
    choices: ['불필요', '꼭 있어야 하다', '쓸모없다', '필요 없다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"필요"는 꼭 있어야 하는 것을 의미합니다.',
    example: '예문: 필요한 물건.'
  },
  {
    word: '하락',
    question: '<span class="word-highlight">하락</span>의 뜻은?',
    hint: '떨어짐',
    choices: ['상승', '떨어지다', '오르다', '증가'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"하락"은 떨어지는 것을 의미합니다.',
    example: '예문: 주가가 하락하다.'
  },
  {
    word: '한계',
    question: '<span class="word-highlight">한계</span>의 뜻은?',
    hint: '더 이상 나아갈 수 없는 선',
    choices: ['무한', '더 이상 나아갈 수 없는 선', '끝없음', '제한 없음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"한계"는 더 이상 나아갈 수 없는 선을 의미합니다.',
    example: '예문: 한계에 부딪히다.'
  },
  {
    word: '한정',
    question: '<span class="word-highlight">한정</span>의 뜻은?',
    hint: '범위를 정하여 제한함',
    choices: ['무제한', '범위를 정하여 제한하다', '열림', '자유'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"한정"은 범위를 정하여 제한하는 것을 의미합니다.',
    example: '예문: 한정 판매.'
  },
  {
    word: '함축',
    question: '<span class="word-highlight">함축</span>의 뜻은?',
    hint: '뜻을 간략하게 담음',
    choices: ['늘어놓다', '뜻을 간략하게 담다', '길게 설명하다', '상세히 하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"함축"은 뜻을 간략하게 담는 것을 의미합니다.',
    example: '예문: 함축적인 표현.'
  },
  {
    word: '합리',
    question: '<span class="word-highlight">합리</span>의 뜻은?',
    hint: '이치에 맞음',
    choices: ['비합리', '이치에 맞다', '불합리', '모순'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"합리"는 이치에 맞는 것을 의미합니다.',
    example: '예문: 합리적인 선택.'
  },
  {
    word: '합의',
    question: '<span class="word-highlight">합의</span>의 뜻은?',
    hint: '의견이 맞음',
    choices: ['불일치', '의견이 맞다', '대립', '갈등'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"합의"는 의견이 맞는 것을 의미합니다.',
    example: '예문: 합의에 도달하다.'
  },
  {
    word: '항상',
    question: '<span class="word-highlight">항상</span>의 뜻은?',
    hint: '언제나',
    choices: ['가끔', '언제나', '때때로', '드물게'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"항상"은 언제나를 의미합니다.',
    example: '예문: 항상 노력하다.'
  },
  {
    word: '해결',
    question: '<span class="word-highlight">해결</span>의 뜻은?',
    hint: '어려운 일을 처리함',
    choices: ['방치하다', '어려운 일을 처리하다', '외면하다', '무시하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"해결"은 어려운 일을 처리하는 것을 의미합니다.',
    example: '예문: 문제를 해결하다.'
  },
  {
    word: '해당',
    question: '<span class="word-highlight">해당</span>의 뜻은?',
    hint: '그것에 들어맞음',
    choices: ['무관', '그것에 들어맞다', '상관없다', '관계없다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"해당"은 그것에 들어맞는 것을 의미합니다.',
    example: '예문: 해당 조건에 맞다.'
  },
  {
    word: '해명',
    question: '<span class="word-highlight">해명</span>의 뜻은?',
    hint: '밝혀 설명함',
    choices: ['숨기다', '밝혀 설명하다', '감추다', '모르쇠하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"해명"은 밝혀 설명하는 것을 의미합니다.',
    example: '예문: 의혹을 해명하다.'
  },
  {
    word: '해석',
    question: '<span class="word-highlight">해석</span>의 뜻은?',
    hint: '풀어서 설명함',
    choices: ['모르다', '풀어서 설명하다', '무시하다', '간과하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"해석"은 풀어서 설명하는 것을 의미합니다.',
    example: '예문: 다양한 해석이 가능하다.'
  },
  {
    word: '해소',
    question: '<span class="word-highlight">해소</span>의 뜻은?',
    hint: '풀어 없앰',
    choices: ['유지하다', '풀어 없애다', '보존하다', '지속하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"해소"는 풀어 없애는 것을 의미합니다.',
    example: '예문: 스트레스를 해소하다.'
  },
  {
    word: '해체',
    question: '<span class="word-highlight">해체</span>의 뜻은?',
    hint: '뜯어 나눔',
    choices: ['결합하다', '뜯어 나누다', '합치다', '모으다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"해체"는 뜯어 나누는 것을 의미합니다.',
    example: '예문: 조직이 해체되다.'
  },
  {
    word: '핵심',
    question: '<span class="word-highlight">핵심</span>의 뜻은?',
    hint: '가장 중요한 부분',
    choices: ['부차적', '가장 중요한 부분', '주변적', '사소한'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"핵심"은 가장 중요한 부분을 의미합니다.',
    example: '예문: 핵심을 파악하다.'
  },
  {
    word: '행사',
    question: '<span class="word-highlight">행사</span>의 뜻은?',
    hint: '권리 등을 사용함',
    choices: ['포기하다', '권리 등을 사용하다', '버리다', '양도하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"행사"는 권리 등을 사용하는 것을 의미합니다.',
    example: '예문: 권리를 행사하다.'
  },
  {
    word: '행위',
    question: '<span class="word-highlight">행위</span>의 뜻은?',
    hint: '의지에 따른 행동',
    choices: ['무행동', '의지에 따른 행동', '정지', '멈춤'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"행위"는 의지에 따른 행동을 의미합니다.',
    example: '예문: 부정 행위.'
  },
  {
    word: '향상',
    question: '<span class="word-highlight">향상</span>의 뜻은?',
    hint: '더 나아짐',
    choices: ['퇴보', '더 나아지다', '저하', '악화'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"향상"은 더 나아지는 것을 의미합니다.',
    example: '예문: 실력이 향상되다.'
  },
  {
    word: '허용',
    question: '<span class="word-highlight">허용</span>의 뜻은?',
    hint: '허락하여 받아들임',
    choices: ['금지', '허락하여 받아들이다', '거부', '불허'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"허용"은 허락하여 받아들이는 것을 의미합니다.',
    example: '예문: 허용 범위.'
  },
  {
    word: '현상',
    question: '<span class="word-highlight">현상</span>의 뜻은?',
    hint: '겉으로 나타나는 모습',
    choices: ['본질', '겉으로 나타나는 모습', '내면', '속'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"현상"은 겉으로 나타나는 모습을 의미합니다.',
    example: '예문: 사회 현상.'
  },
  {
    word: '현실',
    question: '<span class="word-highlight">현실</span>의 뜻은?',
    hint: '실제로 있는 상태',
    choices: ['이상', '실제로 있는 상태', '꿈', '상상'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"현실"은 실제로 있는 상태를 의미합니다.',
    example: '예문: 현실을 직시하다.'
  },
  {
    word: '현저',
    question: '<span class="word-highlight">현저</span>의 뜻은?',
    hint: '뚜렷하게 드러남',
    choices: ['미미하다', '뚜렷하게 드러나다', '사소하다', '모호하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"현저"는 뚜렷하게 드러나는 것을 의미합니다.',
    example: '예문: 현저한 차이.'
  },
  {
    word: '혁신',
    question: '<span class="word-highlight">혁신</span>의 뜻은?',
    hint: '묵은 것을 완전히 바꿈',
    choices: ['유지', '묵은 것을 완전히 바꾸다', '보존', '고수'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"혁신"은 묵은 것을 완전히 바꾸는 것을 의미합니다.',
    example: '예문: 기술 혁신.'
  },
  {
    word: '협력',
    question: '<span class="word-highlight">협력</span>의 뜻은?',
    hint: '힘을 합하여 도움',
    choices: ['대립', '힘을 합하여 돕다', '경쟁', '갈등'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"협력"은 힘을 합하여 돕는 것을 의미합니다.',
    example: '예문: 협력 관계.'
  },
  {
    word: '협의',
    question: '<span class="word-highlight">협의</span>의 뜻은?',
    hint: '서로 의논함',
    choices: ['일방적', '서로 의논하다', '독단', '고집'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"협의"는 서로 의논하는 것을 의미합니다.',
    example: '예문: 협의를 거치다.'
  },
  {
    word: '형성',
    question: '<span class="word-highlight">형성</span>의 뜻은?',
    hint: '이루어 만듦',
    choices: ['파괴', '이루어 만들다', '해체', '무너뜨리다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"형성"은 이루어 만드는 것을 의미합니다.',
    example: '예문: 습관을 형성하다.'
  },
  {
    word: '형태',
    question: '<span class="word-highlight">형태</span>의 뜻은?',
    hint: '생긴 모양',
    choices: ['내용', '생긴 모양', '본질', '속성'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"형태"는 생긴 모양을 의미합니다.',
    example: '예문: 다양한 형태.'
  },
  // 901~1000번 어휘
  {
    word: '호응',
    question: '<span class="word-highlight">호응</span>의 뜻은?',
    hint: '서로 맞아 응함',
    choices: ['무시', '서로 맞아 응하다', '외면', '거부'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"호응"은 서로 맞아 응하는 것을 의미합니다.',
    example: '예문: 좋은 호응을 얻다.'
  },
  {
    word: '호전',
    question: '<span class="word-highlight">호전</span>의 뜻은?',
    hint: '상태가 좋아짐',
    choices: ['악화', '상태가 좋아지다', '나빠지다', '퇴보'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"호전"은 상태가 좋아지는 것을 의미합니다.',
    example: '예문: 상황이 호전되다.'
  },
  {
    word: '혼란',
    question: '<span class="word-highlight">혼란</span>의 뜻은?',
    hint: '뒤죽박죽이 됨',
    choices: ['정돈', '뒤죽박죽이 되다', '질서', '정리'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"혼란"은 뒤죽박죽이 되는 것을 의미합니다.',
    example: '예문: 혼란에 빠지다.'
  },
  {
    word: '혼용',
    question: '<span class="word-highlight">혼용</span>의 뜻은?',
    hint: '섞어서 씀',
    choices: ['구분하다', '섞어서 쓰다', '분리하다', '나누다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"혼용"은 섞어서 쓰는 것을 의미합니다.',
    example: '예문: 두 단어를 혼용하다.'
  },
  {
    word: '혼재',
    question: '<span class="word-highlight">혼재</span>의 뜻은?',
    hint: '뒤섞여 있음',
    choices: ['분리되다', '뒤섞여 있다', '정돈되다', '구분되다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"혼재"는 뒤섞여 있는 것을 의미합니다.',
    example: '예문: 여러 요소가 혼재하다.'
  },
  {
    word: '확대',
    question: '<span class="word-highlight">확대</span>의 뜻은?',
    hint: '넓혀 크게 함',
    choices: ['축소', '넓혀 크게 하다', '줄이다', '작게 하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"확대"는 넓혀 크게 하는 것을 의미합니다.',
    example: '예문: 규모를 확대하다.'
  },
  {
    word: '확립',
    question: '<span class="word-highlight">확립</span>의 뜻은?',
    hint: '확실하게 세움',
    choices: ['무너뜨리다', '확실하게 세우다', '허물다', '파괴하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"확립"은 확실하게 세우는 것을 의미합니다.',
    example: '예문: 원칙을 확립하다.'
  },
  {
    word: '확보',
    question: '<span class="word-highlight">확보</span>의 뜻은?',
    hint: '확실하게 가짐',
    choices: ['잃다', '확실하게 가지다', '놓치다', '빼앗기다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"확보"는 확실하게 가지는 것을 의미합니다.',
    example: '예문: 자원을 확보하다.'
  },
  {
    word: '확산',
    question: '<span class="word-highlight">확산</span>의 뜻은?',
    hint: '널리 퍼짐',
    choices: ['집중', '널리 퍼지다', '모이다', '축소'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"확산"은 널리 퍼지는 것을 의미합니다.',
    example: '예문: 바이러스가 확산되다.'
  },
  {
    word: '확신',
    question: '<span class="word-highlight">확신</span>의 뜻은?',
    hint: '굳게 믿음',
    choices: ['의심', '굳게 믿다', '불신', '회의'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"확신"은 굳게 믿는 것을 의미합니다.',
    example: '예문: 확신을 갖다.'
  },
  {
    word: '확인',
    question: '<span class="word-highlight">확인</span>의 뜻은?',
    hint: '틀림없이 그러함을 알아봄',
    choices: ['무시하다', '틀림없이 그러함을 알아보다', '간과하다', '넘어가다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"확인"은 틀림없이 그러함을 알아보는 것을 의미합니다.',
    example: '예문: 사실을 확인하다.'
  },
  {
    word: '확장',
    question: '<span class="word-highlight">확장</span>의 뜻은?',
    hint: '넓히고 늘림',
    choices: ['축소', '넓히고 늘리다', '줄이다', '좁히다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"확장"은 넓히고 늘리는 것을 의미합니다.',
    example: '예문: 사업을 확장하다.'
  },
  {
    word: '확정',
    question: '<span class="word-highlight">확정</span>의 뜻은?',
    hint: '확실하게 정함',
    choices: ['미정', '확실하게 정하다', '보류', '유보'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"확정"은 확실하게 정하는 것을 의미합니다.',
    example: '예문: 일정이 확정되다.'
  },
  {
    word: '환경',
    question: '<span class="word-highlight">환경</span>의 뜻은?',
    hint: '둘러싸고 있는 상황',
    choices: ['내면', '둘러싸고 있는 상황', '본질', '핵심'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"환경"은 둘러싸고 있는 상황을 의미합니다.',
    example: '예문: 환경을 보호하다.'
  },
  {
    word: '환기',
    question: '<span class="word-highlight">환기</span>의 뜻은?',
    hint: '다시 생각나게 함',
    choices: ['잊게 하다', '다시 생각나게 하다', '망각시키다', '무시하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"환기"는 다시 생각나게 하는 것을 의미합니다.',
    example: '예문: 주의를 환기시키다.'
  },
  {
    word: '환원',
    question: '<span class="word-highlight">환원</span>의 뜻은?',
    hint: '원래대로 돌림',
    choices: ['바꾸다', '원래대로 돌리다', '변경하다', '수정하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"환원"은 원래대로 돌리는 것을 의미합니다.',
    example: '예문: 이익을 사회에 환원하다.'
  },
  {
    word: '활성',
    question: '<span class="word-highlight">활성</span>의 뜻은?',
    hint: '활발하게 됨',
    choices: ['침체', '활발하게 되다', '정체', '둔화'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"활성"은 활발하게 되는 것을 의미합니다.',
    example: '예문: 경제가 활성화되다.'
  },
  {
    word: '활용',
    question: '<span class="word-highlight">활용</span>의 뜻은?',
    hint: '충분히 이용함',
    choices: ['방치하다', '충분히 이용하다', '버리다', '무시하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"활용"은 충분히 이용하는 것을 의미합니다.',
    example: '예문: 자원을 활용하다.'
  },
  {
    word: '회복',
    question: '<span class="word-highlight">회복</span>의 뜻은?',
    hint: '원래 상태로 돌아옴',
    choices: ['악화', '원래 상태로 돌아오다', '나빠지다', '퇴보'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"회복"은 원래 상태로 돌아오는 것을 의미합니다.',
    example: '예문: 건강을 회복하다.'
  },
  {
    word: '회의',
    question: '<span class="word-highlight">회의</span>의 뜻은?',
    hint: '의심을 품음',
    choices: ['확신', '의심을 품다', '신뢰', '믿음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"회의"는 의심을 품는 것을 의미합니다.',
    example: '예문: 회의적인 시각.'
  },
  {
    word: '획득',
    question: '<span class="word-highlight">획득</span>의 뜻은?',
    hint: '힘써 얻음',
    choices: ['잃다', '힘써 얻다', '빼앗기다', '놓치다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"획득"은 힘써 얻는 것을 의미합니다.',
    example: '예문: 금메달을 획득하다.'
  },
  {
    word: '획일',
    question: '<span class="word-highlight">획일</span>의 뜻은?',
    hint: '하나의 기준으로 똑같게 함',
    choices: ['다양하다', '하나의 기준으로 똑같게 하다', '다르다', '개성적'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"획일"은 하나의 기준으로 똑같게 하는 것을 의미합니다.',
    example: '예문: 획일적인 교육.'
  },
  {
    word: '효과',
    question: '<span class="word-highlight">효과</span>의 뜻은?',
    hint: '나타나는 결과',
    choices: ['무효', '나타나는 결과', '무의미', '쓸모없음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"효과"는 나타나는 결과를 의미합니다.',
    example: '예문: 효과가 있다.'
  },
  {
    word: '효율',
    question: '<span class="word-highlight">효율</span>의 뜻은?',
    hint: '들인 노력에 비해 얻는 결과의 정도',
    choices: ['낭비', '들인 노력에 비해 얻는 결과의 정도', '비효율', '손실'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"효율"은 들인 노력에 비해 얻는 결과의 정도를 의미합니다.',
    example: '예문: 효율을 높이다.'
  },
  {
    word: '후속',
    question: '<span class="word-highlight">후속</span>의 뜻은?',
    hint: '뒤이어 이어짐',
    choices: ['선행', '뒤이어 이어지다', '먼저', '앞서'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"후속"은 뒤이어 이어지는 것을 의미합니다.',
    example: '예문: 후속 조치를 취하다.'
  },
  {
    word: '희망',
    question: '<span class="word-highlight">희망</span>의 뜻은?',
    hint: '바라고 원함',
    choices: ['절망', '바라고 원하다', '포기', '체념'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"희망"은 바라고 원하는 것을 의미합니다.',
    example: '예문: 희망을 품다.'
  },
  {
    word: '희석',
    question: '<span class="word-highlight">희석</span>의 뜻은?',
    hint: '묽게 함',
    choices: ['진하게 하다', '묽게 하다', '농축하다', '강화하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"희석"은 묽게 하는 것을 의미합니다.',
    example: '예문: 의미가 희석되다.'
  },
  {
    word: '기반',
    question: '<span class="word-highlight">기반</span>의 뜻은?',
    hint: '기초가 되는 토대',
    choices: ['결과', '기초가 되는 토대', '목적', '결론'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"기반"은 기초가 되는 토대를 의미합니다.',
    example: '예문: 경제 기반을 다지다.'
  },
  {
    word: '기여',
    question: '<span class="word-highlight">기여</span>의 뜻은?',
    hint: '도움이 되게 함',
    choices: ['방해하다', '도움이 되게 하다', '해치다', '손상시키다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"기여"는 도움이 되게 하는 것을 의미합니다.',
    example: '예문: 발전에 기여하다.'
  },
  {
    word: '기인',
    question: '<span class="word-highlight">기인</span>의 뜻은?',
    hint: '원인이 됨',
    choices: ['결과', '원인이 되다', '목적', '목표'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"기인"은 원인이 되는 것을 의미합니다.',
    example: '예문: 실패는 부주의에 기인한다.'
  },
  {
    word: '난관',
    question: '<span class="word-highlight">난관</span>의 뜻은?',
    hint: '어려운 고비',
    choices: ['쉬운 일', '어려운 고비', '순탄함', '평탄함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"난관"은 어려운 고비를 의미합니다.',
    example: '예문: 난관을 극복하다.'
  },
  {
    word: '논거',
    question: '<span class="word-highlight">논거</span>의 뜻은?',
    hint: '주장의 근거',
    choices: ['결론', '주장의 근거', '결과', '목적'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"논거"는 주장의 근거를 의미합니다.',
    example: '예문: 논거를 제시하다.'
  },
  {
    word: '논의',
    question: '<span class="word-highlight">논의</span>의 뜻은?',
    hint: '의견을 나눔',
    choices: ['침묵', '의견을 나누다', '독백', '혼잣말'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"논의"는 의견을 나누는 것을 의미합니다.',
    example: '예문: 안건을 논의하다.'
  },
  {
    word: '논점',
    question: '<span class="word-highlight">논점</span>의 뜻은?',
    hint: '논쟁의 중심이 되는 점',
    choices: ['결론', '논쟁의 중심이 되는 점', '결과', '마무리'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"논점"은 논쟁의 중심이 되는 점을 의미합니다.',
    example: '예문: 논점을 벗어나다.'
  },
  {
    word: '당면',
    question: '<span class="word-highlight">당면</span>의 뜻은?',
    hint: '바로 마주함',
    choices: ['피하다', '바로 마주하다', '회피하다', '도망치다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"당면"은 바로 마주하는 것을 의미합니다.',
    example: '예문: 당면 과제.'
  },
  {
    word: '당위',
    question: '<span class="word-highlight">당위</span>의 뜻은?',
    hint: '마땅히 그래야 함',
    choices: ['선택', '마땅히 그래야 하다', '임의', '자유'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"당위"는 마땅히 그래야 하는 것을 의미합니다.',
    example: '예문: 당위성을 강조하다.'
  },
  {
    word: '대두',
    question: '<span class="word-highlight">대두</span>의 뜻은?',
    hint: '두드러지게 나타남',
    choices: ['사라지다', '두드러지게 나타나다', '숨다', '없어지다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"대두"는 두드러지게 나타나는 것을 의미합니다.',
    example: '예문: 새로운 문제가 대두되다.'
  },
  {
    word: '대립',
    question: '<span class="word-highlight">대립</span>의 뜻은?',
    hint: '서로 맞서 다툼',
    choices: ['화해', '서로 맞서 다투다', '타협', '협력'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"대립"은 서로 맞서 다투는 것을 의미합니다.',
    example: '예문: 의견이 대립하다.'
  },
  {
    word: '대비',
    question: '<span class="word-highlight">대비</span>의 뜻은?',
    hint: '서로 비교함',
    choices: ['무관하다', '서로 비교하다', '상관없다', '독립적'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"대비"는 서로 비교하는 것을 의미합니다.',
    example: '예문: 대비를 이루다.'
  },
  {
    word: '대안',
    question: '<span class="word-highlight">대안</span>의 뜻은?',
    hint: '다른 방안',
    choices: ['원안', '다른 방안', '최초안', '기존안'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"대안"은 다른 방안을 의미합니다.',
    example: '예문: 대안을 마련하다.'
  },
  {
    word: '대응',
    question: '<span class="word-highlight">대응</span>의 뜻은?',
    hint: '맞서 응함',
    choices: ['무시하다', '맞서 응하다', '외면하다', '방관하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"대응"은 맞서 응하는 것을 의미합니다.',
    example: '예문: 상황에 대응하다.'
  },
  {
    word: '대조',
    question: '<span class="word-highlight">대조</span>의 뜻은?',
    hint: '견주어 비교함',
    choices: ['무관하다', '견주어 비교하다', '상관없다', '독립적'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"대조"는 견주어 비교하는 것을 의미합니다.',
    example: '예문: 대조적인 모습.'
  },
  {
    word: '대처',
    question: '<span class="word-highlight">대처</span>의 뜻은?',
    hint: '상황에 맞게 행동함',
    choices: ['무시하다', '상황에 맞게 행동하다', '방관하다', '외면하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"대처"는 상황에 맞게 행동하는 것을 의미합니다.',
    example: '예문: 위기에 대처하다.'
  },
  {
    word: '도모',
    question: '<span class="word-highlight">도모</span>의 뜻은?',
    hint: '꾀하여 이루려 함',
    choices: ['포기하다', '꾀하여 이루려 하다', '그만두다', '단념하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"도모"는 꾀하여 이루려 하는 것을 의미합니다.',
    example: '예문: 발전을 도모하다.'
  },
  {
    word: '도입',
    question: '<span class="word-highlight">도입</span>의 뜻은?',
    hint: '끌어들여 씀',
    choices: ['배제하다', '끌어들여 쓰다', '제외하다', '빼다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"도입"은 끌어들여 쓰는 것을 의미합니다.',
    example: '예문: 새 제도를 도입하다.'
  },
  {
    word: '도출',
    question: '<span class="word-highlight">도출</span>의 뜻은?',
    hint: '이끌어 냄',
    choices: ['숨기다', '이끌어 내다', '감추다', '억누르다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"도출"은 이끌어 내는 것을 의미합니다.',
    example: '예문: 결론을 도출하다.'
  },
  {
    word: '동반',
    question: '<span class="word-highlight">동반</span>의 뜻은?',
    hint: '함께 따름',
    choices: ['혼자', '함께 따르다', '따로', '분리'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"동반"은 함께 따르는 것을 의미합니다.',
    example: '예문: 성장을 동반하다.'
  },
  {
    word: '동원',
    question: '<span class="word-highlight">동원</span>의 뜻은?',
    hint: '모아서 씀',
    choices: ['분산하다', '모아서 쓰다', '흩뜨리다', '나누다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"동원"은 모아서 쓰는 것을 의미합니다.',
    example: '예문: 인력을 동원하다.'
  },
  {
    word: '동조',
    question: '<span class="word-highlight">동조</span>의 뜻은?',
    hint: '같은 의견으로 따름',
    choices: ['반대하다', '같은 의견으로 따르다', '비판하다', '거부하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"동조"는 같은 의견으로 따르는 것을 의미합니다.',
    example: '예문: 여론에 동조하다.'
  },
  {
    word: '뚜렷',
    question: '<span class="word-highlight">뚜렷</span>의 뜻은?',
    hint: '분명하게 나타남',
    choices: ['모호하다', '분명하게 나타나다', '애매하다', '불분명하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"뚜렷"은 분명하게 나타나는 것을 의미합니다.',
    example: '예문: 뚜렷한 차이.'
  },
  {
    word: '만연',
    question: '<span class="word-highlight">만연</span>의 뜻은?',
    hint: '널리 퍼짐',
    choices: ['사라지다', '널리 퍼지다', '줄다', '감소하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"만연"은 널리 퍼지는 것을 의미합니다.',
    example: '예문: 불신이 만연하다.'
  },
  {
    word: '명료',
    question: '<span class="word-highlight">명료</span>의 뜻은?',
    hint: '분명하고 또렷함',
    choices: ['모호', '분명하고 또렷하다', '불분명', '애매'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"명료"는 분명하고 또렷한 것을 의미합니다.',
    example: '예문: 명료한 설명.'
  },
  {
    word: '명확',
    question: '<span class="word-highlight">명확</span>의 뜻은?',
    hint: '분명하고 확실함',
    choices: ['모호', '분명하고 확실하다', '불분명', '애매'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"명확"은 분명하고 확실한 것을 의미합니다.',
    example: '예문: 명확한 기준.'
  },
  {
    word: '모순',
    question: '<span class="word-highlight">모순</span>의 뜻은?',
    hint: '앞뒤가 맞지 않음',
    choices: ['일치', '앞뒤가 맞지 않다', '부합', '합치'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"모순"은 앞뒤가 맞지 않는 것을 의미합니다.',
    example: '예문: 논리적 모순.'
  },
  {
    word: '모색',
    question: '<span class="word-highlight">모색</span>의 뜻은?',
    hint: '방법을 찾음',
    choices: ['포기하다', '방법을 찾다', '단념하다', '그만두다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"모색"은 방법을 찾는 것을 의미합니다.',
    example: '예문: 해결책을 모색하다.'
  },
  {
    word: '무력',
    question: '<span class="word-highlight">무력</span>의 뜻은?',
    hint: '힘이 없음',
    choices: ['강력하다', '힘이 없다', '유능하다', '능력 있다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"무력"은 힘이 없는 것을 의미합니다.',
    example: '예문: 무력하게 느끼다.'
  },
  {
    word: '미비',
    question: '<span class="word-highlight">미비</span>의 뜻은?',
    hint: '갖추어지지 않음',
    choices: ['완비', '갖추어지지 않다', '충분', '완전'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"미비"는 갖추어지지 않은 것을 의미합니다.',
    example: '예문: 제도가 미비하다.'
  },
  {
    word: '미흡',
    question: '<span class="word-highlight">미흡</span>의 뜻은?',
    hint: '충분하지 못함',
    choices: ['충분', '충분하지 못하다', '넉넉', '만족'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"미흡"은 충분하지 못한 것을 의미합니다.',
    example: '예문: 대책이 미흡하다.'
  },
  {
    word: '발현',
    question: '<span class="word-highlight">발현</span>의 뜻은?',
    hint: '드러나 나타남',
    choices: ['숨다', '드러나 나타나다', '감추어지다', '사라지다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"발현"은 드러나 나타나는 것을 의미합니다.',
    example: '예문: 재능이 발현되다.'
  },
  {
    word: '범주',
    question: '<span class="word-highlight">범주</span>의 뜻은?',
    hint: '같은 종류의 범위',
    choices: ['개별', '같은 종류의 범위', '단독', '특수'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"범주"는 같은 종류의 범위를 의미합니다.',
    example: '예문: 그 범주에 속하다.'
  },
  {
    word: '변모',
    question: '<span class="word-highlight">변모</span>의 뜻은?',
    hint: '모습이 바뀜',
    choices: ['유지', '모습이 바뀌다', '보존', '고수'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"변모"는 모습이 바뀌는 것을 의미합니다.',
    example: '예문: 완전히 변모하다.'
  },
  {
    word: '변용',
    question: '<span class="word-highlight">변용</span>의 뜻은?',
    hint: '바꾸어 씀',
    choices: ['그대로', '바꾸어 쓰다', '유지', '보존'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"변용"은 바꾸어 쓰는 것을 의미합니다.',
    example: '예문: 전통을 변용하다.'
  },
  {
    word: '보급',
    question: '<span class="word-highlight">보급</span>의 뜻은?',
    hint: '널리 퍼뜨림',
    choices: ['회수하다', '널리 퍼뜨리다', '거두다', '모으다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"보급"은 널리 퍼뜨리는 것을 의미합니다.',
    example: '예문: 기술이 보급되다.'
  },
  {
    word: '보완',
    question: '<span class="word-highlight">보완</span>의 뜻은?',
    hint: '부족한 것을 채움',
    choices: ['부족하게 하다', '부족한 것을 채우다', '빼다', '줄이다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"보완"은 부족한 것을 채우는 것을 의미합니다.',
    example: '예문: 부족한 점을 보완하다.'
  },
  {
    word: '보편',
    question: '<span class="word-highlight">보편</span>의 뜻은?',
    hint: '모두에게 널리 통함',
    choices: ['특수', '모두에게 널리 통하다', '개별', '특별'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"보편"은 모두에게 널리 통하는 것을 의미합니다.',
    example: '예문: 보편적인 가치.'
  },
  {
    word: '보존',
    question: '<span class="word-highlight">보존</span>의 뜻은?',
    hint: '잘 간직함',
    choices: ['파괴', '잘 간직하다', '없애다', '버리다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"보존"은 잘 간직하는 것을 의미합니다.',
    example: '예문: 문화재를 보존하다.'
  },
  {
    word: '부각',
    question: '<span class="word-highlight">부각</span>의 뜻은?',
    hint: '두드러지게 드러남',
    choices: ['숨기다', '두드러지게 드러나다', '감추다', '가리다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"부각"은 두드러지게 드러나는 것을 의미합니다.',
    example: '예문: 문제가 부각되다.'
  },
  {
    word: '부재',
    question: '<span class="word-highlight">부재</span>의 뜻은?',
    hint: '없음',
    choices: ['존재', '없다', '있음', '현존'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"부재"는 없는 것을 의미합니다.',
    example: '예문: 대안의 부재.'
  },
  {
    word: '부합',
    question: '<span class="word-highlight">부합</span>의 뜻은?',
    hint: '서로 들어맞음',
    choices: ['어긋나다', '서로 들어맞다', '맞지 않다', '불일치'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"부합"은 서로 들어맞는 것을 의미합니다.',
    example: '예문: 기준에 부합하다.'
  },
  {
    word: '분류',
    question: '<span class="word-highlight">분류</span>의 뜻은?',
    hint: '종류에 따라 나눔',
    choices: ['합치다', '종류에 따라 나누다', '섞다', '모으다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"분류"는 종류에 따라 나누는 것을 의미합니다.',
    example: '예문: 자료를 분류하다.'
  },
  {
    word: '분석',
    question: '<span class="word-highlight">분석</span>의 뜻은?',
    hint: '나누어 살핌',
    choices: ['합치다', '나누어 살피다', '모으다', '합하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"분석"은 나누어 살피는 것을 의미합니다.',
    example: '예문: 데이터를 분석하다.'
  },
  {
    word: '불가피',
    question: '<span class="word-highlight">불가피</span>의 뜻은?',
    hint: '피할 수 없음',
    choices: ['피할 수 있다', '피할 수 없다', '선택적', '자유'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"불가피"는 피할 수 없는 것을 의미합니다.',
    example: '예문: 불가피한 선택.'
  },
  {
    word: '비롯',
    question: '<span class="word-highlight">비롯</span>의 뜻은?',
    hint: '처음 시작함',
    choices: ['끝나다', '처음 시작하다', '마무리', '종결'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"비롯"은 처음 시작하는 것을 의미합니다.',
    example: '예문: 여기서 비롯되다.'
  },
  {
    word: '비유',
    question: '<span class="word-highlight">비유</span>의 뜻은?',
    hint: '다른 것에 빗대어 표현함',
    choices: ['직접 말하다', '다른 것에 빗대어 표현하다', '직설', '명백히'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"비유"는 다른 것에 빗대어 표현하는 것을 의미합니다.',
    example: '예문: 비유적인 표현.'
  },
  {
    word: '비판',
    question: '<span class="word-highlight">비판</span>의 뜻은?',
    hint: '잘잘못을 따져 평가함',
    choices: ['무조건 칭찬', '잘잘못을 따져 평가하다', '무비판', '맹목적 동의'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"비판"은 잘잘못을 따져 평가하는 것을 의미합니다.',
    example: '예문: 비판적 시각.'
  },
  {
    word: '사례',
    question: '<span class="word-highlight">사례</span>의 뜻은?',
    hint: '실제로 있었던 예',
    choices: ['추상', '실제로 있었던 예', '가상', '상상'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"사례"는 실제로 있었던 예를 의미합니다.',
    example: '예문: 성공 사례.'
  },
  {
    word: '사안',
    question: '<span class="word-highlight">사안</span>의 뜻은?',
    hint: '문제가 되는 일',
    choices: ['해결된 일', '문제가 되는 일', '완료된 일', '종결된 일'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"사안"은 문제가 되는 일을 의미합니다.',
    example: '예문: 중요한 사안.'
  },
  {
    word: '산출',
    question: '<span class="word-highlight">산출</span>의 뜻은?',
    hint: '계산해 냄',
    choices: ['숨기다', '계산해 내다', '감추다', '모르다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"산출"은 계산해 내는 것을 의미합니다.',
    example: '예문: 결과를 산출하다.'
  },
  {
    word: '상관',
    question: '<span class="word-highlight">상관</span>의 뜻은?',
    hint: '서로 관계됨',
    choices: ['무관', '서로 관계되다', '독립', '분리'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"상관"은 서로 관계되는 것을 의미합니다.',
    example: '예문: 상관관계.'
  },
  {
    word: '상반',
    question: '<span class="word-highlight">상반</span>의 뜻은?',
    hint: '서로 반대됨',
    choices: ['일치', '서로 반대되다', '같다', '동일'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"상반"은 서로 반대되는 것을 의미합니다.',
    example: '예문: 상반된 의견.'
  },
  {
    word: '상쇄',
    question: '<span class="word-highlight">상쇄</span>의 뜻은?',
    hint: '서로 지워 없앰',
    choices: ['더하다', '서로 지워 없애다', '강화하다', '증가시키다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"상쇄"는 서로 지워 없애는 것을 의미합니다.',
    example: '예문: 효과가 상쇄되다.'
  },
  {
    word: '상정',
    question: '<span class="word-highlight">상정</span>의 뜻은?',
    hint: '어떤 상황을 가정함',
    choices: ['확정하다', '어떤 상황을 가정하다', '단정하다', '확신하다'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"상정"은 어떤 상황을 가정하는 것을 의미합니다.',
    example: '예문: 최악을 상정하다.'
  },
  {
    word: '상충',
    question: '<span class="word-highlight">상충</span>의 뜻은?',
    hint: '서로 부딪침',
    choices: ['일치', '서로 부딪치다', '조화', '합치'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"상충"은 서로 부딪치는 것을 의미합니다.',
    example: '예문: 이익이 상충되다.'
  },
  {
    word: '상호',
    question: '<span class="word-highlight">상호</span>의 뜻은?',
    hint: '서로',
    choices: ['일방', '서로', '한쪽', '단독'],
    correct: 1,
    koreanLevel: 6,
    explanation: '"상호"는 서로를 의미합니다.',
    example: '예문: 상호 작용.'
  }
];

console.log('수능 필수 어휘 데이터 로드 완료:', SUNEUNG_VOCAB_DATA.length, '개');

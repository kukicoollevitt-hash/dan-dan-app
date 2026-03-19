// 한자성어 500개 데이터
const HANJA_IDIOM_DATA = [
  // 1~50번 한자성어
  {
    word: '가담항설(街談巷說)',
    question: '<span class="word-highlight">가담항설(街談巷說)</span>의 뜻은?',
    hint: '거리와 골목의 이야기',
    choices: ['근거 없는 소문', '진실된 이야기', '역사적 사실', '공식 발표'],
    correct: 0,
    koreanLevel: 6,
    explanation: '街(거리 가) 談(말씀 담) 巷(골목 항) 說(말씀 설) - 거리와 골목에 떠도는 소문이나 이야기',
    example: '예문: 그것은 가담항설에 불과하다.'
  },
  {
    word: '가렴주구(苛斂誅求)',
    question: '<span class="word-highlight">가렴주구(苛斂誅求)</span>의 뜻은?',
    hint: '세금을 가혹하게 거둠',
    choices: ['세금을 면제함', '가혹하게 세금을 거둠', '공평하게 분배함', '재산을 나눔'],
    correct: 1,
    koreanLevel: 6,
    explanation: '苛(가혹할 가) 斂(거둘 렴) 誅(벨 주) 求(구할 구) - 세금을 가혹하게 거두어들이고 무리하게 빼앗음',
    example: '예문: 가렴주구로 백성들이 고통받았다.'
  },
  {
    word: '각골난망(刻骨難忘)',
    question: '<span class="word-highlight">각골난망(刻骨難忘)</span>의 뜻은?',
    hint: '뼈에 새겨 잊기 어려움',
    choices: ['쉽게 잊음', '은혜를 깊이 새겨 잊지 못함', '원한을 품음', '무관심함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '刻(새길 각) 骨(뼈 골) 難(어려울 난) 忘(잊을 망) - 입은 은혜가 뼈에 새길 만큼 깊어 잊기 어려움',
    example: '예문: 선생님의 은혜는 각골난망입니다.'
  },
  {
    word: '각주구검(刻舟求劍)',
    question: '<span class="word-highlight">각주구검(刻舟求劍)</span>의 뜻은?',
    hint: '배에 표시하고 검을 찾음',
    choices: ['융통성 있게 행동함', '어리석고 융통성 없음', '지혜롭게 대처함', '신중하게 판단함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '刻(새길 각) 舟(배 주) 求(구할 구) 劍(칼 검) - 배에서 칼을 떨어뜨리고 배에 표시해 두었다가 나중에 그 자리에서 찾으려 함. 융통성 없이 어리석은 행동',
    example: '예문: 그런 방법은 각주구검이다.'
  },
  {
    word: '간담상조(肝膽相照)',
    question: '<span class="word-highlight">간담상조(肝膽相照)</span>의 뜻은?',
    hint: '간과 쓸개가 서로 비춤',
    choices: ['서로 미워함', '서로 속마음을 터놓고 사귐', '경쟁함', '무관심함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '肝(간 간) 膽(쓸개 담) 相(서로 상) 照(비출 조) - 간과 쓸개를 서로 비춘다는 뜻으로, 서로 속마음을 터놓고 친하게 사귐',
    example: '예문: 우리는 간담상조하는 사이다.'
  },
  {
    word: '감언이설(甘言利說)',
    question: '<span class="word-highlight">감언이설(甘言利說)</span>의 뜻은?',
    hint: '달콤한 말과 이로운 말',
    choices: ['솔직한 충고', '귀가 솔깃하도록 남을 꾀는 말', '진심어린 조언', '비판적 의견'],
    correct: 1,
    koreanLevel: 6,
    explanation: '甘(달 감) 言(말씀 언) 利(이로울 리) 說(말씀 설) - 귀가 솔깃하도록 달콤하고 이로운 말로 남을 꾀는 것',
    example: '예문: 감언이설에 속지 마라.'
  },
  {
    word: '감지덕지(感之德之)',
    question: '<span class="word-highlight">감지덕지(感之德之)</span>의 뜻은?',
    hint: '감사하고 덕으로 여김',
    choices: ['원망함', '매우 고맙게 여김', '무관심함', '불만족함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '感(느낄 감) 之(갈 지) 德(덕 덕) 之(갈 지) - 고맙게 여기고 덕으로 여긴다는 뜻',
    example: '예문: 도와주셔서 감지덕지합니다.'
  },
  {
    word: '개과천선(改過遷善)',
    question: '<span class="word-highlight">개과천선(改過遷善)</span>의 뜻은?',
    hint: '잘못을 고치고 착하게 됨',
    choices: ['계속 잘못함', '지난 잘못을 고치고 착하게 됨', '남을 비난함', '변화 없음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '改(고칠 개) 過(지날 과) 遷(옮길 천) 善(착할 선) - 지난날의 잘못을 고치고 착하게 됨',
    example: '예문: 그는 개과천선하여 새 사람이 되었다.'
  },
  {
    word: '견물생심(見物生心)',
    question: '<span class="word-highlight">견물생심(見物生心)</span>의 뜻은?',
    hint: '물건을 보고 마음이 생김',
    choices: ['무관심함', '물건을 보면 욕심이 생김', '물건에 집착하지 않음', '배려심이 생김'],
    correct: 1,
    koreanLevel: 6,
    explanation: '見(볼 견) 物(물건 물) 生(날 생) 心(마음 심) - 물건을 보면 갖고 싶은 욕심이 생김',
    example: '예문: 견물생심이라고 그 차를 보니 갖고 싶어졌다.'
  },
  {
    word: '견원지간(犬猿之間)',
    question: '<span class="word-highlight">견원지간(犬猿之間)</span>의 뜻은?',
    hint: '개와 원숭이의 사이',
    choices: ['친한 사이', '서로 사이가 매우 나쁜 관계', '협력하는 관계', '무관한 사이'],
    correct: 1,
    koreanLevel: 6,
    explanation: '犬(개 견) 猿(원숭이 원) 之(갈 지) 間(사이 간) - 개와 원숭이처럼 사이가 매우 나쁜 관계',
    example: '예문: 두 사람은 견원지간이다.'
  },
  {
    word: '결자해지(結者解之)',
    question: '<span class="word-highlight">결자해지(結者解之)</span>의 뜻은?',
    hint: '맺은 자가 풀어야 함',
    choices: ['남이 해결해야 함', '맺은 사람이 풀어야 함', '포기해야 함', '무시해야 함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '結(맺을 결) 者(놈 자) 解(풀 해) 之(갈 지) - 맺은 사람이 풀어야 한다. 자기가 저지른 일은 자기가 해결해야 함',
    example: '예문: 결자해지라고, 네가 시작한 일이니 네가 끝내라.'
  },
  {
    word: '경거망동(輕擧妄動)',
    question: '<span class="word-highlight">경거망동(輕擧妄動)</span>의 뜻은?',
    hint: '가볍게 행동함',
    choices: ['신중하게 행동함', '생각 없이 가볍게 행동함', '계획적으로 행동함', '조심스럽게 행동함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '輕(가벼울 경) 擧(들 거) 妄(망령될 망) 動(움직일 동) - 깊이 생각하지 않고 가볍게 망령되이 행동함',
    example: '예문: 경거망동하지 말고 신중히 행동하라.'
  },
  {
    word: '경국지색(傾國之色)',
    question: '<span class="word-highlight">경국지색(傾國之色)</span>의 뜻은?',
    hint: '나라를 기울게 하는 미색',
    choices: ['못생긴 여자', '나라를 기울게 할 만큼 뛰어난 미인', '평범한 외모', '추한 모습'],
    correct: 1,
    koreanLevel: 6,
    explanation: '傾(기울 경) 國(나라 국) 之(갈 지) 色(빛 색) - 임금이 빠져들어 나라가 기울 정도로 뛰어난 미인',
    example: '예문: 그녀는 경국지색의 미인이었다.'
  },
  {
    word: '고장난명(孤掌難鳴)',
    question: '<span class="word-highlight">고장난명(孤掌難鳴)</span>의 뜻은?',
    hint: '외손뼉은 울리기 어려움',
    choices: ['혼자서도 잘함', '혼자 힘으로는 일을 이루기 어려움', '독립적임', '자립심이 강함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '孤(외로울 고) 掌(손바닥 장) 難(어려울 난) 鳴(울 명) - 외손뼉은 소리가 나지 않듯이 혼자 힘으로는 일을 이루기 어려움',
    example: '예문: 고장난명이니 협력해야 한다.'
  },
  {
    word: '고진감래(苦盡甘來)',
    question: '<span class="word-highlight">고진감래(苦盡甘來)</span>의 뜻은?',
    hint: '쓴 것이 다하면 단 것이 옴',
    choices: ['항상 고통스러움', '고생 끝에 즐거움이 옴', '행복 후에 고통', '변화 없음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '苦(쓸 고) 盡(다할 진) 甘(달 감) 來(올 래) - 쓴 것이 다하면 단 것이 온다. 고생 끝에 즐거움이 옴',
    example: '예문: 고진감래라고 힘든 시간이 지나면 좋은 날이 올 것이다.'
  },
  {
    word: '과유불급(過猶不及)',
    question: '<span class="word-highlight">과유불급(過猶不及)</span>의 뜻은?',
    hint: '지나침은 미치지 못함과 같음',
    choices: ['많을수록 좋음', '지나침은 부족함과 같음', '적을수록 좋음', '차이가 없음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '過(지날 과) 猶(오히려 유) 不(아닐 불) 及(미칠 급) - 지나친 것은 모자란 것과 같다',
    example: '예문: 과유불급이니 적당히 해라.'
  },
  {
    word: '괄목상대(刮目相對)',
    question: '<span class="word-highlight">괄목상대(刮目相對)</span>의 뜻은?',
    hint: '눈을 비비고 다시 봄',
    choices: ['무시함', '상대의 발전을 다시 보아야 할 정도로 달라짐', '변화 없음', '퇴보함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '刮(긁을 괄) 目(눈 목) 相(서로 상) 對(대할 대) - 눈을 비비고 다시 본다. 상대의 학식이나 재주가 놀랄 만큼 발전함',
    example: '예문: 그의 실력은 괄목상대할 만하다.'
  },
  {
    word: '교언영색(巧言令色)',
    question: '<span class="word-highlight">교언영색(巧言令色)</span>의 뜻은?',
    hint: '교묘한 말과 꾸민 얼굴빛',
    choices: ['솔직한 태도', '남에게 아첨하는 태도', '무뚝뚝한 태도', '진실한 모습'],
    correct: 1,
    koreanLevel: 6,
    explanation: '巧(공교로울 교) 言(말씀 언) 令(하여금 령) 色(빛 색) - 말을 교묘하게 꾸미고 얼굴빛을 좋게 하여 남에게 아첨함',
    example: '예문: 교언영색하는 자를 멀리하라.'
  },
  {
    word: '구밀복검(口蜜腹劍)',
    question: '<span class="word-highlight">구밀복검(口蜜腹劍)</span>의 뜻은?',
    hint: '입에는 꿀, 배에는 칼',
    choices: ['속마음과 겉이 같음', '말은 달콤하나 속마음은 해칠 생각', '솔직함', '정직함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '口(입 구) 蜜(꿀 밀) 腹(배 복) 劍(칼 검) - 입에는 꿀이 있고 배에는 칼이 있다. 겉으로는 친절하나 속으로는 해칠 생각을 품음',
    example: '예문: 그는 구밀복검의 인물이다.'
  },
  {
    word: '구사일생(九死一生)',
    question: '<span class="word-highlight">구사일생(九死一生)</span>의 뜻은?',
    hint: '아홉 번 죽을 뻔하고 한 번 삶',
    choices: ['쉽게 살아남음', '여러 번 죽을 고비를 넘기고 겨우 살아남음', '위험이 없음', '안전함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '九(아홉 구) 死(죽을 사) 一(한 일) 生(날 생) - 아홉 번 죽을 뻔하다 한 번 살아남. 여러 차례 죽을 고비를 넘기고 겨우 살아남음',
    example: '예문: 구사일생으로 살아났다.'
  },
  {
    word: '군계일학(群鷄一鶴)',
    question: '<span class="word-highlight">군계일학(群鷄一鶴)</span>의 뜻은?',
    hint: '닭 무리 속의 학 한 마리',
    choices: ['평범한 사람', '많은 사람 중에 뛰어난 한 사람', '열등한 사람', '무능한 사람'],
    correct: 1,
    koreanLevel: 6,
    explanation: '群(무리 군) 鷄(닭 계) 一(한 일) 鶴(학 학) - 닭의 무리 속에 있는 한 마리의 학. 많은 평범한 사람 중에 뛰어난 한 사람',
    example: '예문: 그는 군계일학의 인재다.'
  },
  {
    word: '권모술수(權謀術數)',
    question: '<span class="word-highlight">권모술수(權謀術數)</span>의 뜻은?',
    hint: '권세와 꾀와 술책',
    choices: ['정직한 방법', '목적을 위해 수단과 방법을 가리지 않는 모략', '공정한 경쟁', '정당한 수단'],
    correct: 1,
    koreanLevel: 6,
    explanation: '權(권세 권) 謀(꾀 모) 術(재주 술) 數(셈 수) - 목적을 달성하기 위해 수단과 방법을 가리지 않는 온갖 모략이나 술책',
    example: '예문: 권모술수로 성공한 자는 오래가지 못한다.'
  },
  {
    word: '권선징악(勸善懲惡)',
    question: '<span class="word-highlight">권선징악(勸善懲惡)</span>의 뜻은?',
    hint: '선을 권하고 악을 징계함',
    choices: ['악을 권함', '착한 일을 권하고 악한 일을 징계함', '선과 악을 구분하지 않음', '악을 묵인함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '勸(권할 권) 善(착할 선) 懲(징계할 징) 惡(악할 악) - 착한 일을 권하고 악한 일을 징계함',
    example: '예문: 이 이야기의 주제는 권선징악이다.'
  },
  {
    word: '금과옥조(金科玉條)',
    question: '<span class="word-highlight">금과옥조(金科玉條)</span>의 뜻은?',
    hint: '금으로 된 규정, 옥으로 된 조항',
    choices: ['무시해도 되는 것', '귀중하게 여겨 꼭 지켜야 할 규칙', '쓸모없는 규칙', '임시 규정'],
    correct: 1,
    koreanLevel: 6,
    explanation: '金(쇠 금) 科(과목 과) 玉(구슬 옥) 條(가지 조) - 금이나 옥처럼 귀중하게 여겨 꼭 지켜야 할 법칙이나 규정',
    example: '예문: 그것을 금과옥조처럼 여기다.'
  },
  {
    word: '금상첨화(錦上添花)',
    question: '<span class="word-highlight">금상첨화(錦上添花)</span>의 뜻은?',
    hint: '비단 위에 꽃을 더함',
    choices: ['불필요한 것을 더함', '좋은 일 위에 좋은 일이 더해짐', '나쁜 일이 겹침', '손해를 봄'],
    correct: 1,
    koreanLevel: 6,
    explanation: '錦(비단 금) 上(위 상) 添(더할 첨) 花(꽃 화) - 비단 위에 꽃을 더한다. 좋은 일 위에 또 좋은 일이 더해짐',
    example: '예문: 승진에 상여금까지, 금상첨화다.'
  },
  {
    word: '금시초문(今始初聞)',
    question: '<span class="word-highlight">금시초문(今始初聞)</span>의 뜻은?',
    hint: '이제 비로소 처음 들음',
    choices: ['오래 전부터 알았음', '이제야 처음 들음', '여러 번 들었음', '익히 알고 있음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '今(이제 금) 始(비로소 시) 初(처음 초) 聞(들을 문) - 이제 비로소 처음 들음',
    example: '예문: 그 소식은 금시초문이다.'
  },
  {
    word: '기고만장(氣高萬丈)',
    question: '<span class="word-highlight">기고만장(氣高萬丈)</span>의 뜻은?',
    hint: '기세가 만 길이나 높음',
    choices: ['겸손함', '기세가 대단히 높고 뽐냄', '의기소침함', '조용함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '氣(기운 기) 高(높을 고) 萬(일만 만) 丈(길 장) - 기운이 만 길이나 높다. 의기양양하여 뽐냄',
    example: '예문: 승리 후 그는 기고만장했다.'
  },
  {
    word: '기상천외(奇想天外)',
    question: '<span class="word-highlight">기상천외(奇想天外)</span>의 뜻은?',
    hint: '기이한 생각이 하늘 밖에 있음',
    choices: ['평범한 생각', '생각이 매우 기발하고 엉뚱함', '논리적인 사고', '상식적인 판단'],
    correct: 1,
    koreanLevel: 6,
    explanation: '奇(기이할 기) 想(생각 상) 天(하늘 천) 外(바깥 외) - 생각이 보통 사람이 생각할 수 있는 범위를 벗어남. 매우 기발하고 엉뚱함',
    example: '예문: 기상천외한 아이디어다.'
  },
  {
    word: '난형난제(難兄難弟)',
    question: '<span class="word-highlight">난형난제(難兄難弟)</span>의 뜻은?',
    hint: '형도 어렵고 아우도 어려움',
    choices: ['실력 차이가 큼', '우열을 가리기 어려울 정도로 비슷함', '형이 훨씬 나음', '아우가 더 나음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '難(어려울 난) 兄(형 형) 難(어려울 난) 弟(아우 제) - 누가 형이고 누가 아우인지 분별하기 어려움. 우열을 가리기 어려울 정도로 비슷함',
    example: '예문: 두 선수는 난형난제다.'
  },
  {
    word: '남가일몽(南柯一夢)',
    question: '<span class="word-highlight">남가일몽(南柯一夢)</span>의 뜻은?',
    hint: '남쪽 가지의 한 꿈',
    choices: ['현실', '헛된 한때의 꿈', '영원한 행복', '확실한 미래'],
    correct: 1,
    koreanLevel: 6,
    explanation: '南(남녘 남) 柯(가지 가) 一(한 일) 夢(꿈 몽) - 남쪽 나뭇가지 아래에서 꾼 한바탕 꿈. 헛된 한때의 꿈이나 부귀영화',
    example: '예문: 그 영화는 남가일몽처럼 사라졌다.'
  },
  {
    word: '남부여대(男負女戴)',
    question: '<span class="word-highlight">남부여대(男負女戴)</span>의 뜻은?',
    hint: '남자는 지고 여자는 임',
    choices: ['평화로운 가정', '온 가족이 짐을 지고 떠돌아다님', '정착하여 삶', '풍요로운 생활'],
    correct: 1,
    koreanLevel: 6,
    explanation: '男(사내 남) 負(질 부) 女(계집 여) 戴(일 대) - 남자는 짐을 등에 지고 여자는 머리에 인다. 가난하여 온 가족이 떠돌아다님',
    example: '예문: 전쟁 후 남부여대하며 피난했다.'
  },
  {
    word: '낭중지추(囊中之錐)',
    question: '<span class="word-highlight">낭중지추(囊中之錐)</span>의 뜻은?',
    hint: '주머니 속의 송곳',
    choices: ['숨겨진 재능', '뛰어난 재능은 저절로 드러남', '평범한 능력', '알려지지 않은 사람'],
    correct: 1,
    koreanLevel: 6,
    explanation: '囊(주머니 낭) 中(가운데 중) 之(갈 지) 錐(송곳 추) - 주머니 속의 송곳. 송곳이 주머니를 뚫고 나오듯 뛰어난 재능은 숨겨도 저절로 드러남',
    example: '예문: 낭중지추처럼 그의 재능은 드러났다.'
  },
  {
    word: '노심초사(勞心焦思)',
    question: '<span class="word-highlight">노심초사(勞心焦思)</span>의 뜻은?',
    hint: '마음을 수고롭게 하고 생각을 태움',
    choices: ['편안한 마음', '몹시 마음을 써서 걱정함', '무관심함', '태평함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '勞(수고로울 로) 心(마음 심) 焦(탈 초) 思(생각 사) - 마음을 수고롭게 하고 생각을 태운다. 몹시 마음을 써서 걱정함',
    example: '예문: 부모님은 자녀 걱정에 노심초사하신다.'
  },
  {
    word: '누란지세(累卵之勢)',
    question: '<span class="word-highlight">누란지세(累卵之勢)</span>의 뜻은?',
    hint: '쌓은 알의 형세',
    choices: ['안정된 상황', '매우 위태로운 형세', '평화로운 상태', '발전하는 형세'],
    correct: 1,
    koreanLevel: 6,
    explanation: '累(쌓을 누) 卵(알 란) 之(갈 지) 勢(형세 세) - 쌓아놓은 알처럼 매우 위태로운 형세',
    example: '예문: 나라가 누란지세에 처했다.'
  },
  {
    word: '다다익선(多多益善)',
    question: '<span class="word-highlight">다다익선(多多益善)</span>의 뜻은?',
    hint: '많으면 많을수록 더욱 좋음',
    choices: ['적을수록 좋음', '많으면 많을수록 좋음', '적당한 것이 좋음', '없는 것이 나음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '多(많을 다) 多(많을 다) 益(더할 익) 善(착할 선) - 많으면 많을수록 더욱 좋음',
    example: '예문: 후원금은 다다익선이다.'
  },
  {
    word: '단도직입(單刀直入)',
    question: '<span class="word-highlight">단도직입(單刀直入)</span>의 뜻은?',
    hint: '한 자루의 칼로 바로 쳐들어감',
    choices: ['에둘러 말함', '곧바로 핵심을 찌름', '주저함', '돌아서 말함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '單(홑 단) 刀(칼 도) 直(곧을 직) 入(들 입) - 한 자루의 칼을 들고 곧장 적진으로 쳐들어감. 에두르지 않고 바로 핵심을 찌름',
    example: '예문: 단도직입적으로 말하겠다.'
  },
  {
    word: '당랑거철(螳螂拒轍)',
    question: '<span class="word-highlight">당랑거철(螳螂拒轍)</span>의 뜻은?',
    hint: '사마귀가 수레바퀴를 막음',
    choices: ['현명한 대응', '자기 힘을 모르고 강자에게 덤빔', '신중한 행동', '용맹한 행동'],
    correct: 1,
    koreanLevel: 6,
    explanation: '螳(사마귀 당) 螂(사마귀 랑) 拒(막을 거) 轍(바퀴 자국 철) - 사마귀가 앞발을 들어 수레바퀴를 막으려 함. 자기 힘을 모르고 강자에게 덤비는 무모한 행동',
    example: '예문: 당랑거철의 어리석은 짓이다.'
  },
  {
    word: '대기만성(大器晩成)',
    question: '<span class="word-highlight">대기만성(大器晩成)</span>의 뜻은?',
    hint: '큰 그릇은 늦게 이루어짐',
    choices: ['일찍 성공함', '크게 될 사람은 늦게 이루어짐', '빨리 실패함', '젊어서 성공함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '大(큰 대) 器(그릇 기) 晩(늦을 만) 成(이룰 성) - 큰 그릇은 만드는 데 오래 걸린다. 크게 될 사람은 늦게 이루어짐',
    example: '예문: 그는 대기만성형 인재다.'
  },
  {
    word: '대동소이(大同小異)',
    question: '<span class="word-highlight">대동소이(大同小異)</span>의 뜻은?',
    hint: '크게 같고 작게 다름',
    choices: ['완전히 다름', '대체로 같고 조금 다름', '완전히 같음', '크게 다름'],
    correct: 1,
    koreanLevel: 6,
    explanation: '大(큰 대) 同(같을 동) 小(작을 소) 異(다를 이) - 크게 같고 작게 다름. 대체로 비슷함',
    example: '예문: 두 제품은 대동소이하다.'
  },
  {
    word: '독불장군(獨不將軍)',
    question: '<span class="word-highlight">독불장군(獨不將軍)</span>의 뜻은?',
    hint: '홀로 장군이 될 수 없음',
    choices: ['협력을 잘함', '혼자서 모든 일을 처리하려는 사람', '겸손한 사람', '협동하는 사람'],
    correct: 1,
    koreanLevel: 6,
    explanation: '獨(홀로 독) 不(아닐 불) 將(장수 장) 軍(군사 군) - 혼자서는 장군이 될 수 없다. 남과 어울리지 못하고 혼자 행동하는 사람',
    example: '예문: 독불장군처럼 굴지 마라.'
  },
  {
    word: '독야청청(獨也靑靑)',
    question: '<span class="word-highlight">독야청청(獨也靑靑)</span>의 뜻은?',
    hint: '홀로 푸르고 푸름',
    choices: ['남과 같이 변함', '홀로 절개를 지켜 변하지 않음', '쉽게 변함', '주변과 어울림'],
    correct: 1,
    koreanLevel: 6,
    explanation: '獨(홀로 독) 也(어조사 야) 靑(푸를 청) 靑(푸를 청) - 홀로 푸르고 푸르다. 주위 환경에 관계없이 홀로 절개를 지킴',
    example: '예문: 독야청청하는 선비 정신.'
  },
  {
    word: '동고동락(同苦同樂)',
    question: '<span class="word-highlight">동고동락(同苦同樂)</span>의 뜻은?',
    hint: '함께 괴롭고 함께 즐거움',
    choices: ['혼자 고생함', '괴로움과 즐거움을 함께함', '따로 생활함', '각자 행동함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '同(같을 동) 苦(괴로울 고) 同(같을 동) 樂(즐거울 락) - 괴로움도 즐거움도 함께한다',
    example: '예문: 우리는 동고동락해 온 사이다.'
  },
  {
    word: '동문서답(東問西答)',
    question: '<span class="word-highlight">동문서답(東問西答)</span>의 뜻은?',
    hint: '동쪽을 묻는데 서쪽을 대답함',
    choices: ['정확한 대답', '묻는 말에 전혀 상관없는 대답', '자세한 설명', '논리적 답변'],
    correct: 1,
    koreanLevel: 6,
    explanation: '東(동녘 동) 問(물을 문) 西(서녘 서) 答(대답 답) - 동쪽을 물으면 서쪽으로 대답한다. 묻는 말에 전혀 상관없는 엉뚱한 대답',
    example: '예문: 동문서답하지 말고 제대로 대답해라.'
  },
  {
    word: '동병상련(同病相憐)',
    question: '<span class="word-highlight">동병상련(同病相憐)</span>의 뜻은?',
    hint: '같은 병자끼리 서로 불쌍히 여김',
    choices: ['무관심함', '같은 처지의 사람끼리 서로 동정함', '경쟁함', '비난함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '同(같을 동) 病(병 병) 相(서로 상) 憐(불쌍히 여길 련) - 같은 병을 앓는 사람끼리 서로 불쌍히 여김. 어려운 처지에 있는 사람끼리 서로 동정함',
    example: '예문: 같은 고민을 가진 우리는 동병상련이다.'
  },
  {
    word: '동분서주(東奔西走)',
    question: '<span class="word-highlight">동분서주(東奔西走)</span>의 뜻은?',
    hint: '동쪽으로 뛰고 서쪽으로 달림',
    choices: ['한가롭게 지냄', '이리저리 바쁘게 돌아다님', '한곳에 머무름', '느긋하게 행동함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '東(동녘 동) 奔(달릴 분) 西(서녘 서) 走(달릴 주) - 동쪽으로 뛰고 서쪽으로 달린다. 이리저리 바쁘게 돌아다님',
    example: '예문: 일 때문에 동분서주하고 있다.'
  },
  {
    word: '동상이몽(同床異夢)',
    question: '<span class="word-highlight">동상이몽(同床異夢)</span>의 뜻은?',
    hint: '같은 자리에서 다른 꿈을 꿈',
    choices: ['같은 생각을 함', '겉으로는 같이 행동하나 속으로는 다른 생각', '완전히 일치함', '협력함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '同(같을 동) 床(평상 상) 異(다를 이) 夢(꿈 몽) - 같은 자리에 자면서 다른 꿈을 꾼다. 겉으로는 같이 행동하나 속으로는 다른 생각을 품음',
    example: '예문: 두 사람은 동상이몽이었다.'
  },
  {
    word: '등화가친(燈火可親)',
    question: '<span class="word-highlight">등화가친(燈火可親)</span>의 뜻은?',
    hint: '등불을 가까이 할 만함',
    choices: ['여름철', '가을밤 등불 아래서 글 읽기 좋은 때', '겨울철', '봄철'],
    correct: 1,
    koreanLevel: 6,
    explanation: '燈(등 등) 火(불 화) 可(가할 가) 親(친할 친) - 등불을 가까이 할 만하다. 서늘한 가을밤 등불 아래서 글 읽기 좋은 때',
    example: '예문: 등화가친의 계절이 돌아왔다.'
  },
  {
    word: '마이동풍(馬耳東風)',
    question: '<span class="word-highlight">마이동풍(馬耳東風)</span>의 뜻은?',
    hint: '말 귀에 동풍',
    choices: ['귀담아 들음', '남의 말을 귀담아듣지 않고 흘려버림', '경청함', '이해함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '馬(말 마) 耳(귀 이) 東(동녘 동) 風(바람 풍) - 말의 귀에 동풍이 분다. 남의 말을 귀담아듣지 않고 흘려버림',
    example: '예문: 충고해도 마이동풍이다.'
  },
  // 51~100번 한자성어
  {
    word: '막역지우(莫逆之友)',
    question: '<span class="word-highlight">막역지우(莫逆之友)</span>의 뜻은?',
    hint: '거스름이 없는 벗',
    choices: ['적대적인 관계', '허물없이 친한 벗', '경쟁하는 사이', '알지 못하는 사이'],
    correct: 1,
    koreanLevel: 6,
    explanation: '莫(없을 막) 逆(거스를 역) 之(갈 지) 友(벗 우) - 서로 거스름이 없는 친구. 허물없이 아주 친한 친구',
    example: '예문: 그와 나는 막역지우다.'
  },
  {
    word: '만시지탄(晩時之歎)',
    question: '<span class="word-highlight">만시지탄(晩時之歎)</span>의 뜻은?',
    hint: '때가 늦었음을 탄식함',
    choices: ['제때 함', '때늦은 것을 한탄함', '서두름', '미리 준비함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '晩(늦을 만) 時(때 시) 之(갈 지) 歎(탄식할 탄) - 때가 늦었음을 탄식함. 기회를 놓친 것을 안타까워함',
    example: '예문: 지금 후회해도 만시지탄이다.'
  },
  {
    word: '망양보뢰(亡羊補牢)',
    question: '<span class="word-highlight">망양보뢰(亡羊補牢)</span>의 뜻은?',
    hint: '양을 잃고 우리를 고침',
    choices: ['미리 대비함', '일을 그르친 뒤에야 대비함', '예방을 잘함', '신중하게 행동함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '亡(잃을 망) 羊(양 양) 補(기울 보) 牢(우리 뢰) - 양을 잃고 나서 우리를 고친다. 일이 잘못된 뒤에야 뒤늦게 대비함',
    example: '예문: 지금이라도 망양보뢰해야 한다.'
  },
  {
    word: '맹모삼천(孟母三遷)',
    question: '<span class="word-highlight">맹모삼천(孟母三遷)</span>의 뜻은?',
    hint: '맹자 어머니가 세 번 이사함',
    choices: ['이사를 자주함', '교육 환경의 중요성', '집을 여러 채 가짐', '여행을 자주함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '孟(맏 맹) 母(어미 모) 三(석 삼) 遷(옮길 천) - 맹자의 어머니가 교육을 위해 세 번 이사했다는 고사. 교육 환경의 중요성',
    example: '예문: 맹모삼천의 정신으로 교육에 힘썼다.'
  },
  {
    word: '명경지수(明鏡止水)',
    question: '<span class="word-highlight">명경지수(明鏡止水)</span>의 뜻은?',
    hint: '밝은 거울과 고요한 물',
    choices: ['혼란한 마음', '맑고 고요한 마음', '분노한 상태', '동요하는 마음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '明(밝을 명) 鏡(거울 경) 止(그칠 지) 水(물 수) - 맑은 거울과 고요한 물. 맑고 고요한 마음 상태',
    example: '예문: 명경지수의 마음으로 임한다.'
  },
  {
    word: '명실상부(名實相符)',
    question: '<span class="word-highlight">명실상부(名實相符)</span>의 뜻은?',
    hint: '이름과 실제가 서로 부합함',
    choices: ['이름과 실제가 다름', '이름과 실제가 들어맞음', '허세를 부림', '과장함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '名(이름 명) 實(열매 실) 相(서로 상) 符(부절 부) - 이름과 실제가 서로 부합함',
    example: '예문: 명실상부한 세계 최고의 팀이다.'
  },
  {
    word: '목불인견(目不忍見)',
    question: '<span class="word-highlight">목불인견(目不忍見)</span>의 뜻은?',
    hint: '눈으로 차마 볼 수 없음',
    choices: ['아름다운 광경', '차마 눈으로 볼 수 없을 정도로 참혹함', '볼 만한 광경', '즐거운 장면'],
    correct: 1,
    koreanLevel: 6,
    explanation: '目(눈 목) 不(아닐 불) 忍(참을 인) 見(볼 견) - 눈으로 차마 볼 수 없을 정도로 참혹한 상태',
    example: '예문: 사고 현장은 목불인견이었다.'
  },
  {
    word: '무릉도원(武陵桃源)',
    question: '<span class="word-highlight">무릉도원(武陵桃源)</span>의 뜻은?',
    hint: '무릉의 복숭아꽃 피는 곳',
    choices: ['현실 세계', '이상적인 별천지', '전쟁터', '험한 곳'],
    correct: 1,
    koreanLevel: 6,
    explanation: '武(굳셀 무) 陵(언덕 릉) 桃(복숭아 도) 源(근원 원) - 도연명의 시에 나오는 이상향. 속세를 떠난 별천지',
    example: '예문: 그곳은 마치 무릉도원 같았다.'
  },
  {
    word: '무용지물(無用之物)',
    question: '<span class="word-highlight">무용지물(無用之物)</span>의 뜻은?',
    hint: '쓸모없는 물건',
    choices: ['유용한 것', '아무 쓸모가 없는 것', '귀중한 것', '필수품'],
    correct: 1,
    koreanLevel: 6,
    explanation: '無(없을 무) 用(쓸 용) 之(갈 지) 物(물건 물) - 아무 쓸모가 없는 물건이나 사람',
    example: '예문: 고장 난 기계는 무용지물이다.'
  },
  {
    word: '문전성시(門前成市)',
    question: '<span class="word-highlight">문전성시(門前成市)</span>의 뜻은?',
    hint: '문 앞에 시장을 이룸',
    choices: ['한산함', '찾아오는 사람이 많아 북적거림', '손님이 없음', '조용함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '門(문 문) 前(앞 전) 成(이룰 성) 市(저자 시) - 문 앞이 시장을 이룬다. 찾아오는 사람이 많아 매우 북적거림',
    example: '예문: 개업 첫날 문전성시를 이뤘다.'
  },
  {
    word: '문일지십(聞一知十)',
    question: '<span class="word-highlight">문일지십(聞一知十)</span>의 뜻은?',
    hint: '하나를 듣고 열을 앎',
    choices: ['둔함', '하나를 듣고 열을 알 만큼 총명함', '무지함', '배움이 없음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '聞(들을 문) 一(한 일) 知(알 지) 十(열 십) - 하나를 들으면 열을 안다. 매우 총명함을 이름',
    example: '예문: 그 학생은 문일지십의 재능이 있다.'
  },
  {
    word: '미봉책(彌縫策)',
    question: '<span class="word-highlight">미봉책(彌縫策)</span>의 뜻은?',
    hint: '기워서 꿰매는 방책',
    choices: ['근본적 해결책', '임시변통으로 눈앞만 모면하는 대책', '완벽한 대안', '장기적 계획'],
    correct: 1,
    koreanLevel: 6,
    explanation: '彌(미칠 미) 縫(꿰맬 봉) 策(꾀 책) - 기워서 꿰매는 방책. 빈틈이나 결점을 임시로 감추는 대책',
    example: '예문: 미봉책으로는 문제를 해결할 수 없다.'
  },
  {
    word: '박장대소(拍掌大笑)',
    question: '<span class="word-highlight">박장대소(拍掌大笑)</span>의 뜻은?',
    hint: '손뼉을 치며 크게 웃음',
    choices: ['울음', '손뼉을 치며 크게 웃음', '슬픔', '분노'],
    correct: 1,
    koreanLevel: 6,
    explanation: '拍(칠 박) 掌(손바닥 장) 大(큰 대) 笑(웃을 소) - 손뼉을 치면서 크게 웃음',
    example: '예문: 그 이야기에 모두 박장대소했다.'
  },
  {
    word: '반신반의(半信半疑)',
    question: '<span class="word-highlight">반신반의(半信半疑)</span>의 뜻은?',
    hint: '반은 믿고 반은 의심함',
    choices: ['완전히 믿음', '반은 믿고 반은 의심함', '전혀 안 믿음', '확신함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '半(반 반) 信(믿을 신) 半(반 반) 疑(의심할 의) - 반은 믿고 반은 의심함',
    example: '예문: 그 소문을 반신반의했다.'
  },
  {
    word: '배수진(背水陣)',
    question: '<span class="word-highlight">배수진(背水陣)</span>의 뜻은?',
    hint: '물을 등지고 친 진',
    choices: ['여유 있는 상황', '물러설 곳 없이 결사적으로 싸우는 상황', '안전한 위치', '방어적 자세'],
    correct: 1,
    koreanLevel: 6,
    explanation: '背(등 배) 水(물 수) 陣(진 칠 진) - 물을 등지고 진을 침. 더 이상 물러설 곳이 없는 결사적 상황',
    example: '예문: 배수진을 치고 싸웠다.'
  },
  {
    word: '백년하청(百年河淸)',
    question: '<span class="word-highlight">백년하청(百年河淸)</span>의 뜻은?',
    hint: '백 년을 기다려도 황하가 맑아지지 않음',
    choices: ['빨리 이루어짐', '아무리 기다려도 이루어지기 어려움', '확실한 일', '쉬운 일'],
    correct: 1,
    koreanLevel: 6,
    explanation: '百(일백 백) 年(해 년) 河(물 하) 淸(맑을 청) - 황하가 맑아지기를 백 년 기다려도 안 됨. 아무리 기다려도 이루어지기 어려운 일',
    example: '예문: 그 약속은 백년하청이다.'
  },
  {
    word: '백문불여일견(百聞不如一見)',
    question: '<span class="word-highlight">백문불여일견(百聞不如一見)</span>의 뜻은?',
    hint: '백 번 듣는 것이 한 번 보는 것만 못함',
    choices: ['듣는 것이 중요함', '백 번 듣는 것이 한 번 보는 것만 못함', '보는 것이 중요하지 않음', '경험이 필요 없음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '百(일백 백) 聞(들을 문) 不(아닐 불) 如(같을 여) 一(한 일) 見(볼 견) - 백 번 듣는 것이 한 번 보는 것만 못함',
    example: '예문: 백문불여일견이니 직접 가 봐라.'
  },
  {
    word: '백미(白眉)',
    question: '<span class="word-highlight">백미(白眉)</span>의 뜻은?',
    hint: '흰 눈썹',
    choices: ['열등한 것', '여럿 중에서 가장 뛰어난 것', '평범한 것', '흔한 것'],
    correct: 1,
    koreanLevel: 6,
    explanation: '白(흰 백) 眉(눈썹 미) - 흰 눈썹. 마량이 형제 중 가장 뛰어나 그의 눈썹이 희다고 한 데서 유래. 여럿 중 가장 뛰어난 것',
    example: '예문: 이 작품이 전시회의 백미다.'
  },
  {
    word: '백발백중(百發百中)',
    question: '<span class="word-highlight">백발백중(百發百中)</span>의 뜻은?',
    hint: '백 번 쏘아 백 번 맞힘',
    choices: ['실패함', '쏘는 것마다 맞힘', '가끔 맞힘', '자주 빗나감'],
    correct: 1,
    koreanLevel: 6,
    explanation: '百(일백 백) 發(쏠 발) 百(일백 백) 中(맞을 중) - 백 번 쏘아 백 번 맞힘. 무엇이든 실패 없이 해냄',
    example: '예문: 그의 예측은 백발백중이다.'
  },
  {
    word: '백절불굴(百折不屈)',
    question: '<span class="word-highlight">백절불굴(百折不屈)</span>의 뜻은?',
    hint: '백 번 꺾여도 굴하지 않음',
    choices: ['쉽게 포기함', '백 번 좌절해도 굴하지 않음', '빨리 포기함', '약함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '百(일백 백) 折(꺾을 절) 不(아닐 불) 屈(굽힐 굴) - 백 번 꺾여도 굴하지 않음. 어떤 어려움에도 굴하지 않음',
    example: '예문: 백절불굴의 정신으로 도전했다.'
  },
  {
    word: '부화뇌동(附和雷同)',
    question: '<span class="word-highlight">부화뇌동(附和雷同)</span>의 뜻은?',
    hint: '붙어서 화답하고 우레처럼 같이함',
    choices: ['주관이 뚜렷함', '자기 주관 없이 남의 의견에 따라감', '독립적임', '신중하게 판단함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '附(붙을 부) 和(화할 화) 雷(우레 뢰) 同(같을 동) - 우레가 치면 만물이 따라 울리듯 자기 주관 없이 남의 의견에 따라감',
    example: '예문: 부화뇌동하지 말고 주관을 가져라.'
  },
  {
    word: '분골쇄신(粉骨碎身)',
    question: '<span class="word-highlight">분골쇄신(粉骨碎身)</span>의 뜻은?',
    hint: '뼈가 가루가 되고 몸이 부서짐',
    choices: ['노력하지 않음', '온몸을 바쳐 노력함', '쉽게 함', '적당히 함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '粉(가루 분) 骨(뼈 골) 碎(부술 쇄) 身(몸 신) - 뼈가 가루가 되고 몸이 부서진다. 있는 힘을 다해 노력함',
    example: '예문: 분골쇄신의 노력을 다하겠습니다.'
  },
  {
    word: '불가사의(不可思議)',
    question: '<span class="word-highlight">불가사의(不可思議)</span>의 뜻은?',
    hint: '생각하고 헤아릴 수 없음',
    choices: ['이해하기 쉬움', '생각으로 미루어 헤아릴 수 없음', '명백함', '간단함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '不(아닐 불) 可(가할 가) 思(생각 사) 議(의논할 의) - 생각으로 미루어 헤아릴 수 없음. 이상하고 신비함',
    example: '예문: 불가사의한 현상이다.'
  },
  {
    word: '불구대천(不俱戴天)',
    question: '<span class="word-highlight">불구대천(不俱戴天)</span>의 뜻은?',
    hint: '함께 하늘을 이지 못함',
    choices: ['친한 사이', '한 하늘 아래 같이 살 수 없을 정도로 원한이 깊음', '무관한 사이', '동료'],
    correct: 1,
    koreanLevel: 6,
    explanation: '不(아닐 불) 俱(함께 구) 戴(일 대) 天(하늘 천) - 함께 하늘을 이고 살 수 없음. 원수와 같이 살 수 없다는 뜻',
    example: '예문: 불구대천의 원수다.'
  },
  {
    word: '불문곡직(不問曲直)',
    question: '<span class="word-highlight">불문곡직(不問曲直)</span>의 뜻은?',
    hint: '굽고 곧음을 묻지 않음',
    choices: ['자세히 따짐', '옳고 그름을 따지지 않음', '공정하게 판단함', '신중하게 조사함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '不(아닐 불) 問(물을 문) 曲(굽을 곡) 直(곧을 직) - 옳고 그름을 따지지 않음',
    example: '예문: 불문곡직하고 처벌했다.'
  },
  {
    word: '불치하문(不恥下問)',
    question: '<span class="word-highlight">불치하문(不恥下問)</span>의 뜻은?',
    hint: '아래에 묻는 것을 부끄러워하지 않음',
    choices: ['질문하지 않음', '손아랫사람에게 묻는 것을 부끄러워하지 않음', '물어보기를 싫어함', '가르침을 거부함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '不(아닐 불) 恥(부끄러울 치) 下(아래 하) 問(물을 문) - 아래에 묻는 것을 부끄러워하지 않음. 배움에 겸손한 자세',
    example: '예문: 불치하문의 자세로 배워라.'
  },
  {
    word: '비일비재(非一非再)',
    question: '<span class="word-highlight">비일비재(非一非再)</span>의 뜻은?',
    hint: '한 번도 아니고 두 번도 아님',
    choices: ['드문 일', '같은 일이 여러 번 있음', '처음 있는 일', '한 번만 일어남'],
    correct: 1,
    koreanLevel: 6,
    explanation: '非(아닐 비) 一(한 일) 非(아닐 비) 再(두 재) - 한두 번이 아니다. 같은 일이 여러 번 있음',
    example: '예문: 그런 실수는 비일비재하다.'
  },
  {
    word: '사고무친(四顧無親)',
    question: '<span class="word-highlight">사고무친(四顧無親)</span>의 뜻은?',
    hint: '사방을 돌아보아도 친한 사람이 없음',
    choices: ['친구가 많음', '의지할 곳 없이 외로움', '가족이 많음', '교우관계가 좋음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '四(넉 사) 顧(돌아볼 고) 無(없을 무) 親(친할 친) - 사방을 둘러보아도 친한 사람이 없음. 의지할 곳 없이 외로움',
    example: '예문: 사고무친의 처지에 놓였다.'
  },
  {
    word: '사면초가(四面楚歌)',
    question: '<span class="word-highlight">사면초가(四面楚歌)</span>의 뜻은?',
    hint: '사방에서 초나라 노래가 들림',
    choices: ['많은 응원', '사방이 적에게 둘러싸여 고립됨', '즐거운 상황', '안전한 상태'],
    correct: 1,
    koreanLevel: 6,
    explanation: '四(넉 사) 面(낯 면) 楚(초나라 초) 歌(노래 가) - 사방에서 초나라 노래가 들린다. 사방이 적에게 둘러싸인 고립 상태',
    example: '예문: 그는 사면초가에 빠졌다.'
  },
  {
    word: '사분오열(四分五裂)',
    question: '<span class="word-highlight">사분오열(四分五裂)</span>의 뜻은?',
    hint: '넷으로 나뉘고 다섯으로 찢어짐',
    choices: ['단결함', '여러 갈래로 흩어져 분열됨', '통합됨', '하나로 모임'],
    correct: 1,
    koreanLevel: 6,
    explanation: '四(넉 사) 分(나눌 분) 五(다섯 오) 裂(찢을 열) - 넷으로 나뉘고 다섯으로 찢어짐. 여러 갈래로 흩어져 분열됨',
    example: '예문: 조직이 사분오열되었다.'
  },
  {
    word: '사생결단(死生決斷)',
    question: '<span class="word-highlight">사생결단(死生決斷)</span>의 뜻은?',
    hint: '죽고 사는 것을 결단함',
    choices: ['신중함', '죽기 아니면 살기로 결심함', '포기함', '적당히 함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '死(죽을 사) 生(날 생) 決(결정할 결) 斷(끊을 단) - 죽고 사는 것을 결단한다. 죽기 살기로 결심함',
    example: '예문: 사생결단의 각오로 임했다.'
  },
  {
    word: '사필귀정(事必歸正)',
    question: '<span class="word-highlight">사필귀정(事必歸正)</span>의 뜻은?',
    hint: '일은 반드시 바른 데로 돌아감',
    choices: ['정의가 이기지 못함', '모든 일은 반드시 바른 대로 돌아감', '불의가 승리함', '혼란이 계속됨'],
    correct: 1,
    koreanLevel: 6,
    explanation: '事(일 사) 必(반드시 필) 歸(돌아갈 귀) 正(바를 정) - 모든 일은 반드시 바른 대로 돌아감',
    example: '예문: 사필귀정이니 걱정하지 마라.'
  },
  {
    word: '산전수전(山戰水戰)',
    question: '<span class="word-highlight">산전수전(山戰水戰)</span>의 뜻은?',
    hint: '산에서의 싸움, 물에서의 싸움',
    choices: ['경험이 없음', '세상의 온갖 고난을 다 겪음', '평탄한 인생', '순조로움'],
    correct: 1,
    koreanLevel: 6,
    explanation: '山(뫼 산) 戰(싸움 전) 水(물 수) 戰(싸움 전) - 산에서도 물에서도 싸웠다. 세상의 온갖 고난을 다 겪음',
    example: '예문: 산전수전 다 겪은 사람이다.'
  },
  {
    word: '살신성인(殺身成仁)',
    question: '<span class="word-highlight">살신성인(殺身成仁)</span>의 뜻은?',
    hint: '몸을 죽여 인을 이룸',
    choices: ['이기적으로 행동함', '자신을 희생하여 옳은 일을 함', '자신만 챙김', '남을 해침'],
    correct: 1,
    koreanLevel: 6,
    explanation: '殺(죽일 살) 身(몸 신) 成(이룰 성) 仁(어질 인) - 자신의 몸을 희생하여 인을 이룬다. 옳은 일을 위해 자신을 희생함',
    example: '예문: 살신성인의 정신이 필요하다.'
  },
  {
    word: '삼고초려(三顧草廬)',
    question: '<span class="word-highlight">삼고초려(三顧草廬)</span>의 뜻은?',
    hint: '초가집을 세 번 찾아감',
    choices: ['한 번 방문함', '인재를 얻기 위해 여러 번 찾아감', '무관심함', '포기함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '三(석 삼) 顧(돌아볼 고) 草(풀 초) 廬(오두막 려) - 초가집을 세 번 찾아간다. 유비가 제갈량을 얻기 위해 세 번 방문한 고사',
    example: '예문: 삼고초려 끝에 인재를 얻었다.'
  },
  {
    word: '새옹지마(塞翁之馬)',
    question: '<span class="word-highlight">새옹지마(塞翁之馬)</span>의 뜻은?',
    hint: '변방 늙은이의 말',
    choices: ['항상 좋은 일만 있음', '인생의 길흉화복은 변화가 많아 예측하기 어려움', '나쁜 일만 일어남', '변화 없음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '塞(변방 새) 翁(늙은이 옹) 之(갈 지) 馬(말 마) - 변방 노인의 말. 인생의 길흉화복은 변화가 많아 예측하기 어려움',
    example: '예문: 새옹지마라고 희망을 잃지 마라.'
  },
  {
    word: '선견지명(先見之明)',
    question: '<span class="word-highlight">선견지명(先見之明)</span>의 뜻은?',
    hint: '먼저 보는 밝음',
    choices: ['단견', '앞일을 미리 내다보는 밝은 지혜', '과거에 집착함', '현재만 봄'],
    correct: 1,
    koreanLevel: 6,
    explanation: '先(먼저 선) 見(볼 견) 之(갈 지) 明(밝을 명) - 먼저 보는 밝음. 앞일을 미리 내다보는 밝은 지혜',
    example: '예문: 선견지명이 있어 대비했다.'
  },
  {
    word: '설상가상(雪上加霜)',
    question: '<span class="word-highlight">설상가상(雪上加霜)</span>의 뜻은?',
    hint: '눈 위에 서리를 더함',
    choices: ['좋은 일이 겹침', '어려운 일이 겹침', '평탄해짐', '나아짐'],
    correct: 1,
    koreanLevel: 6,
    explanation: '雪(눈 설) 上(위 상) 加(더할 가) 霜(서리 상) - 눈 위에 서리를 더한다. 불행 위에 불행이 겹침',
    example: '예문: 설상가상으로 비까지 왔다.'
  },
  {
    word: '속수무책(束手無策)',
    question: '<span class="word-highlight">속수무책(束手無策)</span>의 뜻은?',
    hint: '손을 묶고 방책이 없음',
    choices: ['대안이 많음', '손을 쓸 방법이 없음', '해결책이 있음', '쉽게 해결함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '束(묶을 속) 手(손 수) 無(없을 무) 策(꾀 책) - 손이 묶여 방책이 없음. 어찌할 방법이 없음',
    example: '예문: 속수무책으로 당했다.'
  },
  {
    word: '송구영신(送舊迎新)',
    question: '<span class="word-highlight">송구영신(送舊迎新)</span>의 뜻은?',
    hint: '묵은해를 보내고 새해를 맞음',
    choices: ['과거에 머무름', '묵은해를 보내고 새해를 맞이함', '변화를 거부함', '새것을 싫어함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '送(보낼 송) 舊(옛 구) 迎(맞을 영) 新(새 신) - 묵은해를 보내고 새해를 맞이함',
    example: '예문: 송구영신의 밤을 보냈다.'
  },
  {
    word: '수구초심(首丘初心)',
    question: '<span class="word-highlight">수구초심(首丘初心)</span>의 뜻은?',
    hint: '여우가 죽을 때 머리를 언덕으로 함',
    choices: ['고향을 잊음', '고향을 그리워하는 마음', '타향을 좋아함', '방랑함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '首(머리 수) 丘(언덕 구) 初(처음 초) 心(마음 심) - 여우가 죽을 때 머리를 자기가 살던 언덕 쪽으로 둔다. 고향을 그리워하는 마음',
    example: '예문: 수구초심의 마음으로 돌아왔다.'
  },
  {
    word: '수수방관(袖手傍觀)',
    question: '<span class="word-highlight">수수방관(袖手傍觀)</span>의 뜻은?',
    hint: '소매에 손을 넣고 곁에서 봄',
    choices: ['적극적으로 나섬', '팔짱을 끼고 구경만 함', '도움을 줌', '참여함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '袖(소매 수) 手(손 수) 傍(곁 방) 觀(볼 관) - 소매에 손을 넣고 곁에서 구경만 함. 간섭하지 않고 바라만 봄',
    example: '예문: 수수방관할 수 없어 나섰다.'
  },
  {
    word: '수어지교(水魚之交)',
    question: '<span class="word-highlight">수어지교(水魚之交)</span>의 뜻은?',
    hint: '물과 물고기의 사귐',
    choices: ['원수 사이', '물과 물고기처럼 떼어놓을 수 없는 친밀한 사이', '무관한 관계', '경쟁관계'],
    correct: 1,
    koreanLevel: 6,
    explanation: '水(물 수) 魚(물고기 어) 之(갈 지) 交(사귈 교) - 물과 물고기의 관계. 떼어놓을 수 없는 친밀한 사이',
    example: '예문: 두 사람은 수어지교다.'
  },
  {
    word: '식자우환(識字憂患)',
    question: '<span class="word-highlight">식자우환(識字憂患)</span>의 뜻은?',
    hint: '글자를 알아 근심이 됨',
    choices: ['무식함이 좋음', '아는 것이 도리어 걱정거리가 됨', '지식이 항상 좋음', '배움이 유익함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '識(알 식) 字(글자 자) 憂(근심 우) 患(근심 환) - 글을 알아서 근심이 된다. 아는 것이 도리어 걱정거리가 됨',
    example: '예문: 식자우환이라더니 정말 그렇네.'
  },
  {
    word: '신출귀몰(神出鬼沒)',
    question: '<span class="word-highlight">신출귀몰(神出鬼沒)</span>의 뜻은?',
    hint: '귀신처럼 나타나고 사라짐',
    choices: ['예측 가능함', '귀신처럼 나타났다 사라지며 그 변화를 헤아릴 수 없음', '느림', '둔함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '神(귀신 신) 出(날 출) 鬼(귀신 귀) 沒(빠질 몰) - 귀신처럼 나타났다 사라진다. 출몰이 자유자재하여 예측할 수 없음',
    example: '예문: 그는 신출귀몰한 인물이다.'
  },
  {
    word: '심사숙고(深思熟考)',
    question: '<span class="word-highlight">심사숙고(深思熟考)</span>의 뜻은?',
    hint: '깊이 생각하고 익히 생각함',
    choices: ['급히 결정함', '깊이 생각하고 잘 헤아림', '가볍게 생각함', '즉흥적으로 결정함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '深(깊을 심) 思(생각 사) 熟(익을 숙) 考(생각할 고) - 깊이 생각하고 잘 헤아림',
    example: '예문: 심사숙고한 끝에 결정했다.'
  },
  // 101~150번 한자성어
  {
    word: '십시일반(十匙一飯)',
    question: '<span class="word-highlight">십시일반(十匙一飯)</span>의 뜻은?',
    hint: '열 숟가락이 한 그릇 밥이 됨',
    choices: ['혼자 해결함', '여럿이 힘을 합하면 한 사람을 돕기 쉬움', '개인주의', '이기주의'],
    correct: 1,
    koreanLevel: 6,
    explanation: '十(열 십) 匙(숟가락 시) 一(한 일) 飯(밥 반) - 열 숟가락이 한 그릇 밥이 된다. 여럿이 힘을 합하면 한 사람 돕기 쉬움',
    example: '예문: 십시일반으로 도와주자.'
  },
  {
    word: '아전인수(我田引水)',
    question: '<span class="word-highlight">아전인수(我田引水)</span>의 뜻은?',
    hint: '내 논에 물 대기',
    choices: ['공평하게 나눔', '자기에게 유리하게 생각하거나 행동함', '남을 먼저 배려함', '양보함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '我(나 아) 田(밭 전) 引(끌 인) 水(물 수) - 내 논에 물 대기. 자기에게 유리하게 생각하거나 행동함',
    example: '예문: 아전인수 격의 해석이다.'
  },
  {
    word: '안빈낙도(安貧樂道)',
    question: '<span class="word-highlight">안빈낙도(安貧樂道)</span>의 뜻은?',
    hint: '가난을 편안히 여기고 도를 즐김',
    choices: ['부자가 되려 함', '가난한 생활을 편안히 여기고 도를 즐김', '돈을 좋아함', '사치함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '安(편안할 안) 貧(가난할 빈) 樂(즐거울 락) 道(길 도) - 가난한 생활을 편안히 여기고 도를 즐김',
    example: '예문: 안빈낙도의 삶을 살았다.'
  },
  {
    word: '안하무인(眼下無人)',
    question: '<span class="word-highlight">안하무인(眼下無人)</span>의 뜻은?',
    hint: '눈 아래 사람이 없음',
    choices: ['겸손함', '남을 업신여기고 교만함', '배려함', '존중함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '眼(눈 안) 下(아래 하) 無(없을 무) 人(사람 인) - 눈 아래 사람이 없다. 남을 업신여기고 교만하게 행동함',
    example: '예문: 안하무인 격으로 행동하다.'
  },
  {
    word: '암중모색(暗中摸索)',
    question: '<span class="word-highlight">암중모색(暗中摸索)</span>의 뜻은?',
    hint: '어둠 속에서 더듬어 찾음',
    choices: ['확실히 앎', '어둠 속에서 더듬어 찾듯이 어림짐작으로 찾음', '명확하게 앎', '분명히 파악함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '暗(어두울 암) 中(가운데 중) 摸(더듬을 모) 索(찾을 색) - 어둠 속에서 더듬어 찾는다. 확실한 방법 없이 어림짐작으로 일을 해 나감',
    example: '예문: 암중모색 끝에 해결책을 찾았다.'
  },
  {
    word: '양두구육(羊頭狗肉)',
    question: '<span class="word-highlight">양두구육(羊頭狗肉)</span>의 뜻은?',
    hint: '양 머리를 걸고 개고기를 팜',
    choices: ['정직함', '겉과 속이 다름', '일치함', '성실함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '羊(양 양) 頭(머리 두) 狗(개 구) 肉(고기 육) - 양의 머리를 걸어 놓고 개고기를 판다. 겉과 속이 다름',
    example: '예문: 양두구육의 상술이다.'
  },
  {
    word: '어부지리(漁父之利)',
    question: '<span class="word-highlight">어부지리(漁父之利)</span>의 뜻은?',
    hint: '어부의 이익',
    choices: ['열심히 노력해서 얻음', '둘이 싸우는 사이에 제삼자가 이득을 봄', '정당한 대가', '손해를 봄'],
    correct: 1,
    koreanLevel: 6,
    explanation: '漁(고기잡을 어) 父(아비 부) 之(갈 지) 利(이로울 리) - 어부의 이익. 둘이 다투는 사이 제삼자가 이익을 취함',
    example: '예문: 어부지리로 이득을 봤다.'
  },
  {
    word: '언중유골(言中有骨)',
    question: '<span class="word-highlight">언중유골(言中有骨)</span>의 뜻은?',
    hint: '말 속에 뼈가 있음',
    choices: ['무의미한 말', '예사로운 말 속에 단단한 뜻이 담겨 있음', '가벼운 말', '농담'],
    correct: 1,
    koreanLevel: 6,
    explanation: '言(말씀 언) 中(가운데 중) 有(있을 유) 骨(뼈 골) - 말 속에 뼈가 있다. 예사로운 말 속에 단단한 뜻이나 비꼬는 의미가 있음',
    example: '예문: 언중유골의 충고였다.'
  },
  {
    word: '역지사지(易地思之)',
    question: '<span class="word-highlight">역지사지(易地思之)</span>의 뜻은?',
    hint: '처지를 바꾸어 생각함',
    choices: ['자기중심적', '상대의 처지에서 생각함', '이기적', '무관심함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '易(바꿀 역) 地(땅 지) 思(생각 사) 之(갈 지) - 처지를 바꾸어 생각한다. 상대방의 입장에서 생각해 봄',
    example: '예문: 역지사지의 자세가 필요하다.'
  },
  {
    word: '연목구어(緣木求魚)',
    question: '<span class="word-highlight">연목구어(緣木求魚)</span>의 뜻은?',
    hint: '나무에 올라 물고기를 구함',
    choices: ['올바른 방법', '도저히 불가능한 일을 하려 함', '효과적인 방법', '쉬운 일'],
    correct: 1,
    koreanLevel: 6,
    explanation: '緣(인연 연) 木(나무 목) 求(구할 구) 魚(물고기 어) - 나무에 올라가 물고기를 구한다. 불가능한 일을 하려 함',
    example: '예문: 그 방법은 연목구어다.'
  },
  {
    word: '오비이락(烏飛梨落)',
    question: '<span class="word-highlight">오비이락(烏飛梨落)</span>의 뜻은?',
    hint: '까마귀 날자 배 떨어짐',
    choices: ['인과관계가 분명함', '우연한 일치로 억울하게 의심을 받음', '원인과 결과가 있음', '필연적 관계'],
    correct: 1,
    koreanLevel: 6,
    explanation: '烏(까마귀 오) 飛(날 비) 梨(배 이) 落(떨어질 락) - 까마귀 날자 배가 떨어진다. 우연한 일치로 의심을 받음',
    example: '예문: 오비이락으로 누명을 썼다.'
  },
  {
    word: '오월동주(吳越同舟)',
    question: '<span class="word-highlight">오월동주(吳越同舟)</span>의 뜻은?',
    hint: '오나라와 월나라 사람이 같은 배를 탐',
    choices: ['친한 사이', '원수 사이도 같은 어려움에는 협력함', '적대관계', '경쟁관계'],
    correct: 1,
    koreanLevel: 6,
    explanation: '吳(오나라 오) 越(월나라 월) 同(같을 동) 舟(배 주) - 원수인 오나라와 월나라 사람이 같은 배를 탄다. 서로 미워하는 사이도 어려움에는 협력함',
    example: '예문: 오월동주의 처지다.'
  },
  {
    word: '온고지신(溫故知新)',
    question: '<span class="word-highlight">온고지신(溫故知新)</span>의 뜻은?',
    hint: '옛것을 익히고 새것을 앎',
    choices: ['옛것을 버림', '옛것을 익혀 새것을 앎', '새것만 추구함', '과거를 잊음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '溫(따뜻할 온) 故(옛 고) 知(알 지) 新(새 신) - 옛것을 익히어 새것을 안다. 옛것을 연구하여 새로운 것을 창조함',
    example: '예문: 온고지신의 자세로 배운다.'
  },
  {
    word: '와신상담(臥薪嘗膽)',
    question: '<span class="word-highlight">와신상담(臥薪嘗膽)</span>의 뜻은?',
    hint: '섶에 눕고 쓸개를 맛봄',
    choices: ['편안한 생활', '복수를 위해 고난을 참음', '포기함', '즐거운 생활'],
    correct: 1,
    koreanLevel: 6,
    explanation: '臥(누울 와) 薪(섶 신) 嘗(맛볼 상) 膽(쓸개 담) - 섶에 눕고 쓸개를 맛본다. 복수를 위해 온갖 고난을 참고 견딤',
    example: '예문: 와신상담의 각오로 노력했다.'
  },
  {
    word: '완물상지(玩物喪志)',
    question: '<span class="word-highlight">완물상지(玩物喪志)</span>의 뜻은?',
    hint: '물건을 가지고 놀다 뜻을 잃음',
    choices: ['목표를 달성함', '쓸데없는 것에 빠져 본업을 잊음', '집중함', '성공함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '玩(희롱할 완) 物(물건 물) 喪(잃을 상) 志(뜻 지) - 쓸데없는 일에 정신이 팔려 본뜻을 잃음',
    example: '예문: 완물상지하지 않도록 조심해라.'
  },
  {
    word: '용두사미(龍頭蛇尾)',
    question: '<span class="word-highlight">용두사미(龍頭蛇尾)</span>의 뜻은?',
    hint: '용의 머리와 뱀의 꼬리',
    choices: ['끝까지 잘함', '처음은 좋으나 끝이 흐지부지함', '시작과 끝이 같음', '완벽하게 마무리함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '龍(용 용) 頭(머리 두) 蛇(뱀 사) 尾(꼬리 미) - 용의 머리와 뱀의 꼬리. 처음은 좋으나 끝이 흐지부지함',
    example: '예문: 용두사미가 되지 않도록 하자.'
  },
  {
    word: '우문현답(愚問賢答)',
    question: '<span class="word-highlight">우문현답(愚問賢答)</span>의 뜻은?',
    hint: '어리석은 질문에 현명한 답',
    choices: ['어리석은 답', '어리석은 질문에 현명한 대답', '현명한 질문', '무의미한 대화'],
    correct: 1,
    koreanLevel: 6,
    explanation: '愚(어리석을 우) 問(물을 문) 賢(어질 현) 答(대답할 답) - 어리석은 질문에 현명한 대답을 한다',
    example: '예문: 그의 대답은 우문현답이었다.'
  },
  {
    word: '우왕좌왕(右往左往)',
    question: '<span class="word-highlight">우왕좌왕(右往左往)</span>의 뜻은?',
    hint: '오른쪽으로 갔다 왼쪽으로 갔다 함',
    choices: ['방향이 확실함', '이리저리 갈팡질팡함', '결정력 있음', '신속하게 결정함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '右(오른 우) 往(갈 왕) 左(왼 좌) 往(갈 왕) - 이리저리 갈팡질팡함',
    example: '예문: 우왕좌왕하지 말고 결정해라.'
  },
  {
    word: '우유부단(優柔不斷)',
    question: '<span class="word-highlight">우유부단(優柔不斷)</span>의 뜻은?',
    hint: '어질고 부드러워 결단을 못함',
    choices: ['결단력 있음', '어물쩍거리며 결단을 내리지 못함', '과감함', '신속함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '優(넉넉할 우) 柔(부드러울 유) 不(아닐 불) 斷(끊을 단) - 어물쩍거리며 결단을 내리지 못함',
    example: '예문: 우유부단한 태도를 버려라.'
  },
  {
    word: '유구무언(有口無言)',
    question: '<span class="word-highlight">유구무언(有口無言)</span>의 뜻은?',
    hint: '입이 있어도 말이 없음',
    choices: ['할 말이 많음', '입이 있어도 할 말이 없음', '많이 말함', '논쟁함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '有(있을 유) 口(입 구) 無(없을 무) 言(말씀 언) - 입이 있어도 할 말이 없다. 변명할 말이 없음',
    example: '예문: 유구무언으로 잠자코 있었다.'
  },
  {
    word: '유명무실(有名無實)',
    question: '<span class="word-highlight">유명무실(有名無實)</span>의 뜻은?',
    hint: '이름만 있고 실속이 없음',
    choices: ['명실상부함', '이름만 있고 실속이 없음', '실력이 있음', '내실이 있음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '有(있을 유) 名(이름 명) 無(없을 무) 實(열매 실) - 이름만 있고 실속이 없음',
    example: '예문: 유명무실한 제도다.'
  },
  {
    word: '유비무환(有備無患)',
    question: '<span class="word-highlight">유비무환(有備無患)</span>의 뜻은?',
    hint: '준비가 있으면 걱정이 없음',
    choices: ['준비 없이 행동함', '미리 준비하면 걱정할 것 없음', '무계획적임', '급하게 행동함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '有(있을 유) 備(갖출 비) 無(없을 무) 患(근심 환) - 준비가 있으면 걱정이 없다. 미리 준비하면 걱정할 것이 없음',
    example: '예문: 유비무환의 자세로 대비하자.'
  },
  {
    word: '유유자적(悠悠自適)',
    question: '<span class="word-highlight">유유자적(悠悠自適)</span>의 뜻은?',
    hint: '느긋하게 스스로 알맞게 지냄',
    choices: ['급하게 행동함', '속세를 떠나 한가롭게 지냄', '바쁘게 생활함', '분주하게 움직임'],
    correct: 1,
    koreanLevel: 6,
    explanation: '悠(멀 유) 悠(멀 유) 自(스스로 자) 適(맞을 적) - 느긋하고 한가롭게 자기 마음대로 지냄',
    example: '예문: 유유자적한 생활을 꿈꾸다.'
  },
  {
    word: '은인자중(隱忍自重)',
    question: '<span class="word-highlight">은인자중(隱忍自重)</span>의 뜻은?',
    hint: '숨어 참으며 스스로 무겁게 함',
    choices: ['경솔하게 행동함', '마음을 드러내지 않고 신중하게 행동함', '성급함', '가볍게 행동함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '隱(숨을 은) 忍(참을 인) 自(스스로 자) 重(무거울 중) - 마음을 드러내지 않고 참으며 몸가짐을 신중히 함',
    example: '예문: 은인자중하며 때를 기다렸다.'
  },
  {
    word: '음덕양보(陰德陽報)',
    question: '<span class="word-highlight">음덕양보(陰德陽報)</span>의 뜻은?',
    hint: '숨은 덕에 드러난 갚음',
    choices: ['악행에 보답함', '남모르게 쌓은 덕은 드러나게 보답받음', '나쁜 일에 보복', '숨겨진 악행'],
    correct: 1,
    koreanLevel: 6,
    explanation: '陰(그늘 음) 德(덕 덕) 陽(볕 양) 報(갚을 보) - 남몰래 쌓은 덕은 반드시 드러나게 보답을 받는다',
    example: '예문: 음덕양보라고 좋은 일이 생겼다.'
  },
  {
    word: '의기양양(意氣揚揚)',
    question: '<span class="word-highlight">의기양양(意氣揚揚)</span>의 뜻은?',
    hint: '의기가 오르고 올라감',
    choices: ['의기소침함', '의기가 드높아 매우 자랑스러워함', '침울함', '우울함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '意(뜻 의) 氣(기운 기) 揚(오를 양) 揚(오를 양) - 의기가 드높아 매우 자랑스러워하는 모양',
    example: '예문: 승리 후 의기양양했다.'
  },
  {
    word: '의기소침(意氣銷沈)',
    question: '<span class="word-highlight">의기소침(意氣銷沈)</span>의 뜻은?',
    hint: '의기가 사라지고 가라앉음',
    choices: ['의기양양함', '기운이 꺾여 풀이 죽음', '활기참', '기운이 넘침'],
    correct: 1,
    koreanLevel: 6,
    explanation: '意(뜻 의) 氣(기운 기) 銷(사라질 소) 沈(가라앉을 침) - 기운이 꺾여 풀이 죽음',
    example: '예문: 실패 후 의기소침해졌다.'
  },
  {
    word: '이구동성(異口同聲)',
    question: '<span class="word-highlight">이구동성(異口同聲)</span>의 뜻은?',
    hint: '다른 입에서 같은 소리',
    choices: ['의견이 다름', '여러 사람이 한결같이 같은 말을 함', '서로 다른 말을 함', '논쟁함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '異(다를 이) 口(입 구) 同(같을 동) 聲(소리 성) - 다른 입에서 같은 소리. 여러 사람이 한결같이 같은 말을 함',
    example: '예문: 이구동성으로 찬성했다.'
  },
  {
    word: '이심전심(以心傳心)',
    question: '<span class="word-highlight">이심전심(以心傳心)</span>의 뜻은?',
    hint: '마음으로 마음을 전함',
    choices: ['말로 전달함', '마음에서 마음으로 전함', '문서로 전달함', '공식 발표함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '以(써 이) 心(마음 심) 傳(전할 전) 心(마음 심) - 마음에서 마음으로 전한다. 말하지 않아도 서로 뜻이 통함',
    example: '예문: 이심전심으로 알았다.'
  },
  {
    word: '이열치열(以熱治熱)',
    question: '<span class="word-highlight">이열치열(以熱治熱)</span>의 뜻은?',
    hint: '열로써 열을 다스림',
    choices: ['차가운 것으로 더위를 이김', '열은 열로써 다스림', '시원한 방법', '차가운 것을 사용함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '以(써 이) 熱(더울 열) 治(다스릴 치) 熱(더울 열) - 열은 열로써 다스린다. 더위에는 오히려 뜨거운 것으로 이김',
    example: '예문: 이열치열로 더위를 이기자.'
  },
  {
    word: '인과응보(因果應報)',
    question: '<span class="word-highlight">인과응보(因果應報)</span>의 뜻은?',
    hint: '원인과 결과가 응하고 갚음',
    choices: ['관계없음', '원인에 따라 결과가 반드시 따름', '우연의 일치', '무관함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '因(인할 인) 果(열매 과) 應(응할 응) 報(갚을 보) - 좋은 일에는 좋은 결과, 나쁜 일에는 나쁜 결과가 따름',
    example: '예문: 인과응보로 벌을 받았다.'
  },
  {
    word: '인산인해(人山人海)',
    question: '<span class="word-highlight">인산인해(人山人海)</span>의 뜻은?',
    hint: '사람이 산이고 사람이 바다',
    choices: ['한산함', '사람이 매우 많이 모임', '사람이 없음', '한적함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '人(사람 인) 山(뫼 산) 人(사람 인) 海(바다 해) - 사람이 산을 이루고 바다를 이룬다. 사람이 매우 많이 모임',
    example: '예문: 행사장은 인산인해였다.'
  },
  {
    word: '일거양득(一擧兩得)',
    question: '<span class="word-highlight">일거양득(一擧兩得)</span>의 뜻은?',
    hint: '한 번 들어 두 가지를 얻음',
    choices: ['손해를 봄', '한 가지 일로 두 가지 이득을 봄', '헛수고함', '시간 낭비'],
    correct: 1,
    koreanLevel: 6,
    explanation: '一(한 일) 擧(들 거) 兩(두 량) 得(얻을 득) - 한 가지 일로 두 가지 이익을 얻음',
    example: '예문: 일거양득의 효과가 있다.'
  },
  {
    word: '일망타진(一網打盡)',
    question: '<span class="word-highlight">일망타진(一網打盡)</span>의 뜻은?',
    hint: '한 그물로 쳐서 다 잡음',
    choices: ['일부만 잡음', '한꺼번에 모조리 잡음', '놓침', '실패함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '一(한 일) 網(그물 망) 打(칠 타) 盡(다할 진) - 한 그물로 쳐서 다 잡는다. 한꺼번에 모조리 잡음',
    example: '예문: 범인들을 일망타진했다.'
  },
  {
    word: '일맥상통(一脈相通)',
    question: '<span class="word-highlight">일맥상통(一脈相通)</span>의 뜻은?',
    hint: '한 맥으로 서로 통함',
    choices: ['관련 없음', '서로 통하는 바가 있음', '완전히 다름', '단절됨'],
    correct: 1,
    koreanLevel: 6,
    explanation: '一(한 일) 脈(맥 맥) 相(서로 상) 通(통할 통) - 한 맥으로 서로 통한다. 서로 통하는 바가 있음',
    example: '예문: 두 이론은 일맥상통한다.'
  },
  {
    word: '일목요연(一目瞭然)',
    question: '<span class="word-highlight">일목요연(一目瞭然)</span>의 뜻은?',
    hint: '한눈에 환히 앎',
    choices: ['이해하기 어려움', '한눈에 알아볼 수 있을 정도로 분명함', '복잡함', '혼란스러움'],
    correct: 1,
    koreanLevel: 6,
    explanation: '一(한 일) 目(눈 목) 瞭(밝을 료) 然(그러할 연) - 한눈에 환히 안다. 매우 분명하고 명백함',
    example: '예문: 일목요연하게 정리되었다.'
  },
  {
    word: '일사천리(一瀉千里)',
    question: '<span class="word-highlight">일사천리(一瀉千里)</span>의 뜻은?',
    hint: '한번 쏟으면 천 리를 감',
    choices: ['느리게 진행됨', '막힘없이 빠르게 진행됨', '멈춤', '중단됨'],
    correct: 1,
    koreanLevel: 6,
    explanation: '一(한 일) 瀉(쏟을 사) 千(일천 천) 里(마을 리) - 물이 한번 쏟아지면 천 리를 간다. 막힘없이 빠르게 진행됨',
    example: '예문: 일사천리로 일이 풀렸다.'
  },
  {
    word: '일석이조(一石二鳥)',
    question: '<span class="word-highlight">일석이조(一石二鳥)</span>의 뜻은?',
    hint: '한 돌로 두 새를 잡음',
    choices: ['손해를 봄', '한 가지 일로 두 가지 이득을 봄', '헛수고함', '실패함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '一(한 일) 石(돌 석) 二(두 이) 鳥(새 조) - 돌 하나로 새 두 마리를 잡는다. 한 가지 일로 두 가지 이득을 봄',
    example: '예문: 일석이조의 효과가 있다.'
  },
  {
    word: '일취월장(日就月將)',
    question: '<span class="word-highlight">일취월장(日就月將)</span>의 뜻은?',
    hint: '날로 이루고 달로 나아감',
    choices: ['퇴보함', '나날이 발전하고 달마다 성장함', '정체됨', '변화 없음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '日(날 일) 就(이룰 취) 月(달 월) 將(장차 장) - 나날이 이루고 달마다 나아간다. 끊임없이 발전함',
    example: '예문: 일취월장하는 실력이다.'
  },
  {
    word: '일파만파(一波萬波)',
    question: '<span class="word-highlight">일파만파(一波萬波)</span>의 뜻은?',
    hint: '한 물결이 만 물결이 됨',
    choices: ['변화 없음', '한 사건이 점점 퍼져 많은 영향을 미침', '축소됨', '줄어듦'],
    correct: 1,
    koreanLevel: 6,
    explanation: '一(한 일) 波(물결 파) 萬(일만 만) 波(물결 파) - 한 물결이 만 물결이 된다. 한 사건이 점점 퍼져 영향을 미침',
    example: '예문: 일파만파로 퍼져나갔다.'
  },
  {
    word: '일편단심(一片丹心)',
    question: '<span class="word-highlight">일편단심(一片丹心)</span>의 뜻은?',
    hint: '한 조각의 붉은 마음',
    choices: ['변하는 마음', '한결같이 충성스러운 마음', '흔들리는 마음', '이중적 마음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '一(한 일) 片(조각 편) 丹(붉을 단) 心(마음 심) - 한 조각의 붉은 마음. 한결같이 충성스럽고 변함없는 마음',
    example: '예문: 일편단심으로 모셨다.'
  },
  {
    word: '임기응변(臨機應變)',
    question: '<span class="word-highlight">임기응변(臨機應變)</span>의 뜻은?',
    hint: '기회에 임하여 변화에 응함',
    choices: ['미리 계획함', '그때그때 상황에 따라 대처함', '변하지 않음', '융통성 없음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '臨(임할 임) 機(틀 기) 應(응할 응) 變(변할 변) - 그때그때 상황에 따라 적절하게 대처함',
    example: '예문: 임기응변으로 위기를 넘겼다.'
  },
  {
    word: '자승자박(自繩自縛)',
    question: '<span class="word-highlight">자승자박(自繩自縛)</span>의 뜻은?',
    hint: '스스로 새끼로 스스로 묶음',
    choices: ['남을 구속함', '자기 말이나 행동에 자기가 구속됨', '남에게 도움을 받음', '자유로움'],
    correct: 1,
    koreanLevel: 6,
    explanation: '自(스스로 자) 繩(새끼 승) 自(스스로 자) 縛(묶을 박) - 자기 말이나 행동에 자기 자신이 구속됨',
    example: '예문: 자승자박이 되었다.'
  },
  {
    word: '자업자득(自業自得)',
    question: '<span class="word-highlight">자업자득(自業自得)</span>의 뜻은?',
    hint: '자기가 지은 일을 자기가 받음',
    choices: ['남의 탓', '자기가 저지른 일의 결과를 자기가 받음', '운이 나쁨', '불공평함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '自(스스로 자) 業(업 업) 自(스스로 자) 得(얻을 득) - 자기가 저지른 일의 결과를 자기가 받음',
    example: '예문: 자업자득이니 어쩔 수 없다.'
  },
  {
    word: '자초지종(自初至終)',
    question: '<span class="word-highlight">자초지종(自初至終)</span>의 뜻은?',
    hint: '처음부터 끝까지',
    choices: ['일부만', '처음부터 끝까지의 과정', '중간만', '결론만'],
    correct: 1,
    koreanLevel: 6,
    explanation: '自(스스로 자) 初(처음 초) 至(이를 지) 終(끝 종) - 처음부터 끝까지. 일의 전말',
    example: '예문: 자초지종을 말해 봐라.'
  },
  {
    word: '자포자기(自暴自棄)',
    question: '<span class="word-highlight">자포자기(自暴自棄)</span>의 뜻은?',
    hint: '스스로 해치고 스스로 버림',
    choices: ['희망을 가짐', '절망하여 자신을 포기함', '노력함', '분발함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '自(스스로 자) 暴(사나울 폭) 自(스스로 자) 棄(버릴 기) - 절망하여 자신을 스스로 해치고 돌보지 않음',
    example: '예문: 자포자기하지 말고 힘내라.'
  },
  // 151~200번 한자성어
  {
    word: '작심삼일(作心三日)',
    question: '<span class="word-highlight">작심삼일(作心三日)</span>의 뜻은?',
    hint: '마음먹은 것이 사흘을 못 감',
    choices: ['결심이 오래 감', '결심이 사흘을 못 감', '꾸준히 노력함', '인내심이 강함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '作(지을 작) 心(마음 심) 三(석 삼) 日(날 일) - 결심한 것이 사흘을 가지 못함. 결심이 오래 가지 못함',
    example: '예문: 다이어트가 작심삼일로 끝났다.'
  },
  {
    word: '적반하장(賊反荷杖)',
    question: '<span class="word-highlight">적반하장(賊反荷杖)</span>의 뜻은?',
    hint: '도둑이 도리어 매를 든다',
    choices: ['잘못을 인정함', '도리어 화를 내며 큰소리침', '사과함', '반성함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '賊(도적 적) 反(도리어 반) 荷(짐질 하) 杖(지팡이 장) - 도둑이 오히려 매를 든다. 잘못한 사람이 도리어 화를 냄',
    example: '예문: 그 사람이 적반하장으로 나왔다.'
  },
  {
    word: '전무후무(前無後無)',
    question: '<span class="word-highlight">전무후무(前無後無)</span>의 뜻은?',
    hint: '앞에도 없고 뒤에도 없음',
    choices: ['흔한 일', '전에도 없고 앞으로도 없을 일', '자주 있는 일', '평범한 일'],
    correct: 1,
    koreanLevel: 6,
    explanation: '前(앞 전) 無(없을 무) 後(뒤 후) 無(없을 무) - 전에도 없었고 앞으로도 없을 유일한 일',
    example: '예문: 전무후무한 기록을 세웠다.'
  },
  {
    word: '전전긍긍(戰戰兢兢)',
    question: '<span class="word-highlight">전전긍긍(戰戰兢兢)</span>의 뜻은?',
    hint: '두려워 떨며 조심함',
    choices: ['대범하게 행동함', '몹시 두려워 조심함', '당당하게 나섬', '태연함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '戰(싸움 전) 戰(싸움 전) 兢(두려워할 긍) 兢(두려워할 긍) - 몹시 두렵고 조심스러워함',
    example: '예문: 전전긍긍하며 결과를 기다렸다.'
  },
  {
    word: '전화위복(轉禍爲福)',
    question: '<span class="word-highlight">전화위복(轉禍爲福)</span>의 뜻은?',
    hint: '화가 바뀌어 복이 됨',
    choices: ['화가 계속됨', '화가 변하여 복이 됨', '복이 화가 됨', '변함없음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '轉(구를 전) 禍(재앙 화) 爲(할 위) 福(복 복) - 재앙이 바뀌어 복이 됨',
    example: '예문: 실패가 전화위복이 되었다.'
  },
  {
    word: '절차탁마(切磋琢磨)',
    question: '<span class="word-highlight">절차탁마(切磋琢磨)</span>의 뜻은?',
    hint: '자르고 갈고 쪼고 닦음',
    choices: ['포기함', '학문과 덕행을 닦음', '게으름', '태만함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '切(끊을 절) 磋(갈 차) 琢(쪼을 탁) 磨(갈 마) - 옥돌을 자르고 갈아 빛나게 하듯 학문과 덕행을 닦음',
    example: '예문: 절차탁마하여 실력을 쌓았다.'
  },
  {
    word: '점입가경(漸入佳境)',
    question: '<span class="word-highlight">점입가경(漸入佳境)</span>의 뜻은?',
    hint: '점점 좋은 경지에 들어감',
    choices: ['점점 나빠짐', '점점 재미있는 상황으로 됨', '변함없음', '급격히 변함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '漸(점점 점) 入(들 입) 佳(아름다울 가) 境(지경 경) - 점점 더 재미있거나 좋은 상황으로 됨',
    example: '예문: 이야기가 점입가경이다.'
  },
  {
    word: '정중동(靜中動)',
    question: '<span class="word-highlight">정중동(靜中動)</span>의 뜻은?',
    hint: '고요함 속에 움직임',
    choices: ['항상 움직임', '겉은 고요하나 속은 활동적임', '완전히 정지', '무기력함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '靜(고요할 정) 中(가운데 중) 動(움직일 동) - 겉으로는 고요하지만 내면은 활동적임',
    example: '예문: 정중동의 자세로 기회를 노렸다.'
  },
  {
    word: '조령모개(朝令暮改)',
    question: '<span class="word-highlight">조령모개(朝令暮改)</span>의 뜻은?',
    hint: '아침에 명령하고 저녁에 고침',
    choices: ['일관성 있음', '법령이 자주 바뀜', '신중함', '변하지 않음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '朝(아침 조) 令(명령 령) 暮(저녁 모) 改(고칠 개) - 아침에 내린 명령을 저녁에 바꿈. 일관성이 없음',
    example: '예문: 조령모개로 혼란스럽다.'
  },
  {
    word: '조삼모사(朝三暮四)',
    question: '<span class="word-highlight">조삼모사(朝三暮四)</span>의 뜻은?',
    hint: '아침에 셋 저녁에 넷',
    choices: ['공평한 분배', '간사한 꾀로 남을 속임', '정직함', '변함없음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '朝(아침 조) 三(석 삼) 暮(저녁 모) 四(넉 사) - 간사한 꾀로 남을 속여 희롱함. 결과는 같은데 눈앞의 것만 보고 속음',
    example: '예문: 그것은 조삼모사에 불과하다.'
  },
  {
    word: '좌불안석(坐不安席)',
    question: '<span class="word-highlight">좌불안석(坐不安席)</span>의 뜻은?',
    hint: '앉아도 자리가 편하지 않음',
    choices: ['편안함', '마음이 불안하여 한자리에 못 앉음', '안정됨', '차분함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '坐(앉을 좌) 不(아닐 불) 安(편안 안) 席(자리 석) - 마음이 불안하여 한자리에 앉아 있지 못함',
    example: '예문: 좌불안석으로 서성거렸다.'
  },
  {
    word: '좌우명(座右銘)',
    question: '<span class="word-highlight">좌우명(座右銘)</span>의 뜻은?',
    hint: '자리 오른쪽에 새긴 글',
    choices: ['장식품', '늘 곁에 두고 경계하는 말', '일시적 구호', '남의 격언'],
    correct: 1,
    koreanLevel: 6,
    explanation: '座(자리 좌) 右(오른쪽 우) 銘(새길 명) - 늘 곁에 두고 스스로를 경계하는 글귀나 말',
    example: '예문: 성실이 내 좌우명이다.'
  },
  {
    word: '주경야독(晝耕夜讀)',
    question: '<span class="word-highlight">주경야독(晝耕夜讀)</span>의 뜻은?',
    hint: '낮에 농사짓고 밤에 책 읽음',
    choices: ['놀기만 함', '낮에 일하고 밤에 공부함', '공부만 함', '일만 함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '晝(낮 주) 耕(밭갈 경) 夜(밤 야) 讀(읽을 독) - 낮에는 일하고 밤에는 공부함. 어려운 여건 속에서도 공부함',
    example: '예문: 주경야독으로 학문을 쌓았다.'
  },
  {
    word: '주객전도(主客顚倒)',
    question: '<span class="word-highlight">주객전도(主客顚倒)</span>의 뜻은?',
    hint: '주인과 손님이 뒤바뀜',
    choices: ['순서가 맞음', '주된 것과 종된 것이 뒤바뀜', '질서 있음', '체계적임'],
    correct: 1,
    koreanLevel: 6,
    explanation: '主(주인 주) 客(손님 객) 顚(넘어질 전) 倒(넘어질 도) - 주인과 손님이 뒤바뀜. 사물의 경중이 뒤바뀜',
    example: '예문: 주객전도된 상황이다.'
  },
  {
    word: '주마간산(走馬看山)',
    question: '<span class="word-highlight">주마간산(走馬看山)</span>의 뜻은?',
    hint: '달리는 말 위에서 산을 봄',
    choices: ['자세히 살핌', '대충 훑어봄', '정밀하게 관찰함', '신중히 판단함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '走(달릴 주) 馬(말 마) 看(볼 간) 山(뫼 산) - 달리는 말 위에서 산을 봄. 대충 보고 지나침',
    example: '예문: 주마간산으로 여행했다.'
  },
  {
    word: '죽마고우(竹馬故友)',
    question: '<span class="word-highlight">죽마고우(竹馬故友)</span>의 뜻은?',
    hint: '대나무 말을 타던 옛 친구',
    choices: ['새 친구', '어린 시절부터의 친한 친구', '직장 동료', '선후배'],
    correct: 1,
    koreanLevel: 6,
    explanation: '竹(대나무 죽) 馬(말 마) 故(옛 고) 友(벗 우) - 대나무 말을 타고 놀던 어린 시절 친구. 오래된 친한 친구',
    example: '예문: 그는 나의 죽마고우이다.'
  },
  {
    word: '중언부언(重言復言)',
    question: '<span class="word-highlight">중언부언(重言復言)</span>의 뜻은?',
    hint: '말을 거듭함',
    choices: ['간결한 말', '같은 말을 되풀이함', '새로운 표현', '창의적 언어'],
    correct: 1,
    koreanLevel: 6,
    explanation: '重(거듭 중) 言(말씀 언) 復(다시 부) 言(말씀 언) - 같은 말을 자꾸 되풀이함',
    example: '예문: 중언부언하지 마라.'
  },
  {
    word: '지록위마(指鹿爲馬)',
    question: '<span class="word-highlight">지록위마(指鹿爲馬)</span>의 뜻은?',
    hint: '사슴을 가리켜 말이라 함',
    choices: ['진실을 말함', '윗사람을 속여 권세를 마음대로 함', '정직함', '솔직함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '指(가리킬 지) 鹿(사슴 록) 爲(할 위) 馬(말 마) - 사슴을 가리켜 말이라 함. 윗사람을 농락하여 권세를 마음대로 함',
    example: '예문: 지록위마와 같은 행태다.'
  },
  {
    word: '지성감천(至誠感天)',
    question: '<span class="word-highlight">지성감천(至誠感天)</span>의 뜻은?',
    hint: '지극한 정성은 하늘을 감동시킴',
    choices: ['노력이 소용없음', '지극한 정성이면 하늘도 감동함', '하늘이 무심함', '운이 없음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '至(지극할 지) 誠(정성 성) 感(느낄 감) 天(하늘 천) - 지극한 정성이면 하늘도 감동한다',
    example: '예문: 지성감천이라더니 결국 성공했다.'
  },
  {
    word: '지피지기(知彼知己)',
    question: '<span class="word-highlight">지피지기(知彼知己)</span>의 뜻은?',
    hint: '적을 알고 나를 앎',
    choices: ['적만 앎', '적을 알고 나를 알아야 함', '나만 앎', '모르는 것이 좋음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '知(알 지) 彼(저 피) 知(알 지) 己(자기 기) - 적을 알고 나를 알면 백전백승',
    example: '예문: 지피지기면 백전백승이다.'
  },
  {
    word: '진퇴양난(進退兩難)',
    question: '<span class="word-highlight">진퇴양난(進退兩難)</span>의 뜻은?',
    hint: '나아가기도 물러서기도 어려움',
    choices: ['쉬운 상황', '이러지도 저러지도 못하는 상황', '여유로움', '선택이 쉬움'],
    correct: 1,
    koreanLevel: 6,
    explanation: '進(나아갈 진) 退(물러날 퇴) 兩(둘 양) 難(어려울 난) - 나아가기도 물러서기도 어려운 상황',
    example: '예문: 진퇴양난에 빠졌다.'
  },
  {
    word: '차일피일(此日彼日)',
    question: '<span class="word-highlight">차일피일(此日彼日)</span>의 뜻은?',
    hint: '이 날 저 날',
    choices: ['즉시 행동', '이 날 저 날 미룸', '계획적', '신속함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '此(이 차) 日(날 일) 彼(저 피) 日(날 일) - 이 날 저 날 미루며 질질 끎',
    example: '예문: 차일피일 미루다 기한이 지났다.'
  },
  {
    word: '천고마비(天高馬肥)',
    question: '<span class="word-highlight">천고마비(天高馬肥)</span>의 뜻은?',
    hint: '하늘이 높고 말이 살찜',
    choices: ['여름', '가을의 좋은 계절을 이름', '겨울', '봄'],
    correct: 1,
    koreanLevel: 6,
    explanation: '天(하늘 천) 高(높을 고) 馬(말 마) 肥(살찔 비) - 하늘이 높고 말이 살찜. 가을의 좋은 계절',
    example: '예문: 천고마비의 계절이다.'
  },
  {
    word: '천려일득(千慮一得)',
    question: '<span class="word-highlight">천려일득(千慮一得)</span>의 뜻은?',
    hint: '천 번 생각에 한 번 얻음',
    choices: ['어리석은 자도 가끔은 좋은 생각을 함', '천재적 발상', '항상 실패', '노력이 무용'],
    correct: 0,
    koreanLevel: 6,
    explanation: '千(천 천) 慮(생각할 려) 一(한 일) 得(얻을 득) - 어리석은 사람도 많은 생각 중에 하나는 좋은 것이 있음',
    example: '예문: 천려일득으로 좋은 아이디어가 나왔다.'
  },
  {
    word: '천리안(千里眼)',
    question: '<span class="word-highlight">천리안(千里眼)</span>의 뜻은?',
    hint: '천 리를 보는 눈',
    choices: ['근시', '멀리 보고 잘 헤아리는 눈', '보통 시력', '눈이 나쁨'],
    correct: 1,
    koreanLevel: 6,
    explanation: '千(천 천) 里(마을 리) 眼(눈 안) - 멀리까지 내다보고 판단할 수 있는 안목',
    example: '예문: 천리안을 가진 지도자다.'
  },
  {
    word: '천신만고(千辛萬苦)',
    question: '<span class="word-highlight">천신만고(千辛萬苦)</span>의 뜻은?',
    hint: '천 가지 괴로움 만 가지 고통',
    choices: ['편안함', '온갖 어려움과 고생', '행복', '순탄함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '千(천 천) 辛(매울 신) 萬(일만 만) 苦(쓸 고) - 수많은 어려움과 고생',
    example: '예문: 천신만고 끝에 성공했다.'
  },
  {
    word: '천재일우(千載一遇)',
    question: '<span class="word-highlight">천재일우(千載一遇)</span>의 뜻은?',
    hint: '천 년에 한 번 만남',
    choices: ['흔한 기회', '좀처럼 만나기 어려운 기회', '자주 옴', '평범한 일'],
    correct: 1,
    koreanLevel: 6,
    explanation: '千(천 천) 載(실을 재) 一(한 일) 遇(만날 우) - 천 년에 한 번 만날 정도의 좋은 기회',
    example: '예문: 천재일우의 기회를 놓쳤다.'
  },
  {
    word: '천진난만(天眞爛漫)',
    question: '<span class="word-highlight">천진난만(天眞爛漫)</span>의 뜻은?',
    hint: '타고난 순진함이 넘침',
    choices: ['거짓됨', '꾸밈없이 자연스럽고 순진함', '계산적', '냉정함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '天(하늘 천) 眞(참 진) 爛(찬란할 란) 漫(넘칠 만) - 꾸밈없이 자연스럽고 순진함',
    example: '예문: 아이의 천진난만한 웃음.'
  },
  {
    word: '천차만별(千差萬別)',
    question: '<span class="word-highlight">천차만별(千差萬別)</span>의 뜻은?',
    hint: '천 가지 차이 만 가지 다름',
    choices: ['모두 같음', '여러 가지로 차이가 많음', '동일함', '획일적임'],
    correct: 1,
    koreanLevel: 6,
    explanation: '千(천 천) 差(다를 차) 萬(일만 만) 別(다를 별) - 가지가지로 모두 다름',
    example: '예문: 사람의 생각은 천차만별이다.'
  },
  {
    word: '철두철미(徹頭徹尾)',
    question: '<span class="word-highlight">철두철미(徹頭徹尾)</span>의 뜻은?',
    hint: '처음부터 끝까지',
    choices: ['대충', '처음부터 끝까지 철저함', '부분적', '중간만'],
    correct: 1,
    koreanLevel: 6,
    explanation: '徹(꿰뚫을 철) 頭(머리 두) 徹(꿰뚫을 철) 尾(꼬리 미) - 처음부터 끝까지 철저함',
    example: '예문: 철두철미하게 준비했다.'
  },
  {
    word: '청산유수(靑山流水)',
    question: '<span class="word-highlight">청산유수(靑山流水)</span>의 뜻은?',
    hint: '푸른 산과 흐르는 물',
    choices: ['말이 막힘', '말을 막힘없이 잘함', '조용함', '말수가 적음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '靑(푸를 청) 山(뫼 산) 流(흐를 류) 水(물 수) - 말이 막힘없이 유창하게 잘 나옴',
    example: '예문: 청산유수로 말했다.'
  },
  {
    word: '청천벽력(靑天霹靂)',
    question: '<span class="word-highlight">청천벽력(靑天霹靂)</span>의 뜻은?',
    hint: '맑은 하늘에 벼락',
    choices: ['예상된 일', '갑자기 일어난 뜻밖의 사태', '순조로움', '평화로움'],
    correct: 1,
    koreanLevel: 6,
    explanation: '靑(푸를 청) 天(하늘 천) 霹(벼락 벽) 靂(벼락 력) - 맑은 하늘에 벼락이 침. 뜻밖의 큰 충격',
    example: '예문: 그 소식은 청천벽력이었다.'
  },
  {
    word: '청출어람(靑出於藍)',
    question: '<span class="word-highlight">청출어람(靑出於藍)</span>의 뜻은?',
    hint: '푸른색은 쪽에서 나옴',
    choices: ['스승이 제자보다 나음', '제자가 스승보다 나음', '비슷함', '변함없음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '靑(푸를 청) 出(날 출) 於(어조사 어) 藍(쪽 람) - 푸른색이 쪽에서 나왔으나 쪽보다 더 푸름. 제자가 스승보다 나음',
    example: '예문: 청출어람이라더니 정말 대단하다.'
  },
  {
    word: '초지일관(初志一貫)',
    question: '<span class="word-highlight">초지일관(初志一貫)</span>의 뜻은?',
    hint: '처음 뜻을 끝까지 관철함',
    choices: ['자주 바뀜', '처음 먹은 뜻을 끝까지 밀고 나감', '포기함', '변덕스러움'],
    correct: 1,
    koreanLevel: 6,
    explanation: '初(처음 초) 志(뜻 지) 一(한 일) 貫(꿸 관) - 처음 세운 뜻을 끝까지 밀고 나감',
    example: '예문: 초지일관의 자세로 임했다.'
  },
  {
    word: '촌철살인(寸鐵殺人)',
    question: '<span class="word-highlight">촌철살인(寸鐵殺人)</span>의 뜻은?',
    hint: '한 치의 쇠로 사람을 죽임',
    choices: ['장황한 말', '간결하고 날카로운 말이 핵심을 찌름', '부드러운 말', '긴 설명'],
    correct: 1,
    koreanLevel: 6,
    explanation: '寸(마디 촌) 鐵(쇠 철) 殺(죽일 살) 人(사람 인) - 짧은 말이 핵심을 날카롭게 찌름',
    example: '예문: 촌철살인의 비평이었다.'
  },
  {
    word: '추풍낙엽(秋風落葉)',
    question: '<span class="word-highlight">추풍낙엽(秋風落葉)</span>의 뜻은?',
    hint: '가을바람에 떨어지는 잎',
    choices: ['번성함', '형세가 약해져 쉽게 쓰러짐', '강해짐', '성장함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '秋(가을 추) 風(바람 풍) 落(떨어질 락) 葉(잎 엽) - 가을바람에 낙엽이 떨어지듯 형세가 쇠하여 쉽게 쓰러짐',
    example: '예문: 적군이 추풍낙엽처럼 무너졌다.'
  },
  {
    word: '칠전팔기(七顚八起)',
    question: '<span class="word-highlight">칠전팔기(七顚八起)</span>의 뜻은?',
    hint: '일곱 번 넘어지고 여덟 번 일어남',
    choices: ['포기함', '여러 번 실패해도 굴하지 않고 일어남', '좌절함', '단념함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '七(일곱 칠) 顚(넘어질 전) 八(여덟 팔) 起(일어날 기) - 여러 번 실패해도 굴하지 않고 다시 일어남',
    example: '예문: 칠전팔기의 정신으로 다시 도전했다.'
  },
  {
    word: '침소봉대(針小棒大)',
    question: '<span class="word-highlight">침소봉대(針小棒大)</span>의 뜻은?',
    hint: '바늘을 몽둥이로 만듦',
    choices: ['축소함', '작은 일을 크게 과장함', '정확함', '사실대로 말함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '針(바늘 침) 小(작을 소) 棒(몽둥이 봉) 大(클 대) - 바늘만한 일을 몽둥이만하게 과장함',
    example: '예문: 침소봉대하지 마라.'
  },
  {
    word: '쾌도난마(快刀亂麻)',
    question: '<span class="word-highlight">쾌도난마(快刀亂麻)</span>의 뜻은?',
    hint: '날카로운 칼로 엉킨 삼을 자름',
    choices: ['복잡하게 만듦', '복잡한 문제를 시원하게 해결함', '어렵게 만듦', '지연시킴'],
    correct: 1,
    koreanLevel: 6,
    explanation: '快(쾌할 쾌) 刀(칼 도) 亂(어지러울 란) 麻(삼 마) - 잘 드는 칼로 엉킨 삼을 자름. 복잡한 문제를 시원하게 해결함',
    example: '예문: 쾌도난마로 문제를 해결했다.'
  },
  {
    word: '타산지석(他山之石)',
    question: '<span class="word-highlight">타산지석(他山之石)</span>의 뜻은?',
    hint: '다른 산의 돌',
    choices: ['쓸모없음', '남의 잘못도 자신을 닦는 데 도움이 됨', '무관심함', '배울 것 없음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '他(다를 타) 山(뫼 산) 之(갈 지) 石(돌 석) - 다른 산의 나쁜 돌도 자신의 옥을 가는 데 쓸 수 있음',
    example: '예문: 그의 실패를 타산지석으로 삼았다.'
  },
  {
    word: '탁상공론(卓上空論)',
    question: '<span class="word-highlight">탁상공론(卓上空論)</span>의 뜻은?',
    hint: '책상 위의 빈 논의',
    choices: ['실질적 논의', '현실성 없는 허황된 이론', '실용적 계획', '구체적 방안'],
    correct: 1,
    koreanLevel: 6,
    explanation: '卓(탁자 탁) 上(위 상) 空(빌 공) 論(논의할 론) - 현실과 동떨어진 쓸모없는 논의',
    example: '예문: 그것은 탁상공론에 불과하다.'
  },
  {
    word: '토사구팽(兎死狗烹)',
    question: '<span class="word-highlight">토사구팽(兎死狗烹)</span>의 뜻은?',
    hint: '토끼가 죽으면 사냥개를 삶음',
    choices: ['은혜를 갚음', '필요 없어지면 버림', '끝까지 함께함', '신의를 지킴'],
    correct: 1,
    koreanLevel: 6,
    explanation: '兎(토끼 토) 死(죽을 사) 狗(개 구) 烹(삶을 팽) - 토끼를 잡으면 사냥개를 삶아 먹음. 쓸모가 없어지면 버림',
    example: '예문: 토사구팽 당할까 걱정이다.'
  },
  {
    word: '파란만장(波瀾萬丈)',
    question: '<span class="word-highlight">파란만장(波瀾萬丈)</span>의 뜻은?',
    hint: '물결이 만 길이나 높음',
    choices: ['평탄함', '일이 많은 변화와 곡절을 겪음', '순조로움', '단조로움'],
    correct: 1,
    koreanLevel: 6,
    explanation: '波(물결 파) 瀾(물결 란) 萬(일만 만) 丈(길 장) - 물결이 만 길이나 일어남. 일의 변화가 심함',
    example: '예문: 파란만장한 인생이었다.'
  },
  {
    word: '파죽지세(破竹之勢)',
    question: '<span class="word-highlight">파죽지세(破竹之勢)</span>의 뜻은?',
    hint: '대나무를 쪼개는 기세',
    choices: ['느린 진행', '거침없이 나아가는 기세', '중단됨', '멈춤'],
    correct: 1,
    koreanLevel: 6,
    explanation: '破(깨뜨릴 파) 竹(대나무 죽) 之(갈 지) 勢(기세 세) - 대를 쪼개듯 거침없이 나아가는 기세',
    example: '예문: 파죽지세로 승리했다.'
  },
  {
    word: '팔방미인(八方美人)',
    question: '<span class="word-highlight">팔방미인(八方美人)</span>의 뜻은?',
    hint: '여덟 방향의 미인',
    choices: ['한 분야 전문가', '여러 방면에 능함 또는 누구에게나 잘함', '특기가 없음', '한 분야만 잘함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '八(여덟 팔) 方(모 방) 美(아름다울 미) 人(사람 인) - 여러 방면에 두루 능함. 또는 누구에게나 좋게 처신함',
    example: '예문: 그녀는 팔방미인이다.'
  },
  {
    word: '풍비박산(風飛雹散)',
    question: '<span class="word-highlight">풍비박산(風飛雹散)</span>의 뜻은?',
    hint: '바람에 날리고 우박처럼 흩어짐',
    choices: ['모임', '산산이 흩어짐', '뭉침', '결합함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '風(바람 풍) 飛(날 비) 雹(우박 박) 散(흩을 산) - 바람에 날리고 우박처럼 흩어짐. 완전히 깨어져 흩어짐',
    example: '예문: 계획이 풍비박산 났다.'
  },
  {
    word: '피골상접(皮骨相接)',
    question: '<span class="word-highlight">피골상접(皮骨相接)</span>의 뜻은?',
    hint: '가죽과 뼈가 서로 붙음',
    choices: ['살이 찜', '몹시 마름', '건강함', '튼튼함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '皮(가죽 피) 骨(뼈 골) 相(서로 상) 接(이을 접) - 살이 빠져 가죽과 뼈만 남음. 몹시 마름',
    example: '예문: 피골상접이 되도록 고생했다.'
  },
  // 201~250번 한자성어
  {
    word: '필부지용(匹夫之勇)',
    question: '<span class="word-highlight">필부지용(匹夫之勇)</span>의 뜻은?',
    hint: '필부의 용기',
    choices: ['지혜로운 용기', '생각 없이 저돌적인 용기', '참된 용기', '신중한 용기'],
    correct: 1,
    koreanLevel: 6,
    explanation: '匹(필 필) 夫(지아비 부) 之(갈 지) 勇(용감할 용) - 혈기만 믿고 함부로 부리는 용기',
    example: '예문: 필부지용으로는 안 된다.'
  },
  {
    word: '하로동선(夏爐冬扇)',
    question: '<span class="word-highlight">하로동선(夏爐冬扇)</span>의 뜻은?',
    hint: '여름 화로 겨울 부채',
    choices: ['적절함', '쓸모없는 것', '유용함', '필요한 것'],
    correct: 1,
    koreanLevel: 6,
    explanation: '夏(여름 하) 爐(화로 로) 冬(겨울 동) 扇(부채 선) - 여름의 화로와 겨울의 부채. 쓸모없는 것',
    example: '예문: 그 물건은 하로동선이다.'
  },
  {
    word: '학수고대(鶴首苦待)',
    question: '<span class="word-highlight">학수고대(鶴首苦待)</span>의 뜻은?',
    hint: '학의 목처럼 목을 빼고 기다림',
    choices: ['무관심함', '몹시 기다림', '포기함', '서두름'],
    correct: 1,
    koreanLevel: 6,
    explanation: '鶴(학 학) 首(머리 수) 苦(괴로울 고) 待(기다릴 대) - 학의 목처럼 목을 빼고 간절히 기다림',
    example: '예문: 학수고대하던 소식이 왔다.'
  },
  {
    word: '한우충동(汗牛充棟)',
    question: '<span class="word-highlight">한우충동(汗牛充棟)</span>의 뜻은?',
    hint: '소가 땀흘리고 들보에 가득함',
    choices: ['책이 적음', '책이 매우 많음', '빈곤함', '물건이 없음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '汗(땀 한) 牛(소 우) 充(채울 충) 棟(마루 동) - 책을 실으면 소가 땀을 흘리고, 쌓으면 들보까지 참. 책이 매우 많음',
    example: '예문: 한우충동의 장서가 있다.'
  },
  {
    word: '함구무언(緘口無言)',
    question: '<span class="word-highlight">함구무언(緘口無言)</span>의 뜻은?',
    hint: '입을 봉하고 말이 없음',
    choices: ['수다스러움', '입을 다물고 말하지 않음', '말이 많음', '떠들썩함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '緘(봉할 함) 口(입 구) 無(없을 무) 言(말씀 언) - 입을 봉하고 말하지 않음',
    example: '예문: 그는 함구무언으로 일관했다.'
  },
  {
    word: '합종연횡(合從連衡)',
    question: '<span class="word-highlight">합종연횡(合從連衡)</span>의 뜻은?',
    hint: '합종과 연횡',
    choices: ['일관된 외교', '때에 따라 이합집산하는 외교술', '변하지 않음', '한 가지 방법만 고수'],
    correct: 1,
    koreanLevel: 6,
    explanation: '合(합할 합) 從(좇을 종) 連(잇닿을 련) 衡(평형 형) - 때에 따라 여러 세력과 이합집산하며 외교함',
    example: '예문: 합종연횡하며 생존했다.'
  },
  {
    word: '허심탄회(虛心坦懷)',
    question: '<span class="word-highlight">허심탄회(虛心坦懷)</span>의 뜻은?',
    hint: '마음을 비우고 품을 열어',
    choices: ['속마음을 숨김', '마음을 터놓고 솔직하게', '경계함', '의심함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '虛(빌 허) 心(마음 심) 坦(평탄할 탄) 懷(품을 회) - 마음을 비우고 솔직하게 터놓음',
    example: '예문: 허심탄회하게 이야기하자.'
  },
  {
    word: '형설지공(螢雪之功)',
    question: '<span class="word-highlight">형설지공(螢雪之功)</span>의 뜻은?',
    hint: '반딧불과 눈빛의 공',
    choices: ['놀며 보낸 시간', '어려운 환경에서 공부한 보람', '쉬운 공부', '노력 없는 성공'],
    correct: 1,
    koreanLevel: 6,
    explanation: '螢(반딧불 형) 雪(눈 설) 之(갈 지) 功(공 공) - 반딧불과 눈빛으로 공부한 노력의 결과. 고생하며 공부한 보람',
    example: '예문: 형설지공으로 합격했다.'
  },
  {
    word: '호가호위(狐假虎威)',
    question: '<span class="word-highlight">호가호위(狐假虎威)</span>의 뜻은?',
    hint: '여우가 호랑이의 위엄을 빌림',
    choices: ['자기 힘으로 함', '남의 권세를 빌려 위세를 부림', '독립적임', '겸손함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '狐(여우 호) 假(빌릴 가) 虎(범 호) 威(위엄 위) - 여우가 호랑이의 위세를 빌림. 남의 권세를 빌려 위세를 부림',
    example: '예문: 호가호위하지 마라.'
  },
  {
    word: '호구지책(糊口之策)',
    question: '<span class="word-highlight">호구지책(糊口之策)</span>의 뜻은?',
    hint: '입에 풀칠하는 방책',
    choices: ['부유하게 사는 법', '겨우 먹고 사는 방도', '저축하는 법', '낭비하는 법'],
    correct: 1,
    koreanLevel: 6,
    explanation: '糊(풀 호) 口(입 구) 之(갈 지) 策(꾀 책) - 겨우 먹고 살아가는 방법',
    example: '예문: 호구지책으로 일했다.'
  },
  {
    word: '호사다마(好事多魔)',
    question: '<span class="word-highlight">호사다마(好事多魔)</span>의 뜻은?',
    hint: '좋은 일에 마가 많음',
    choices: ['좋은 일이 순조로움', '좋은 일에는 방해가 많음', '나쁜 일만 생김', '항상 행운'],
    correct: 1,
    koreanLevel: 6,
    explanation: '好(좋을 호) 事(일 사) 多(많을 다) 魔(마귀 마) - 좋은 일에는 방해가 많음',
    example: '예문: 호사다마라더니 문제가 생겼다.'
  },
  {
    word: '호연지기(浩然之氣)',
    question: '<span class="word-highlight">호연지기(浩然之氣)</span>의 뜻은?',
    hint: '넓고 큰 기운',
    choices: ['소심한 마음', '넓고 큰 정신과 기개', '두려움', '나약함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '浩(넓을 호) 然(그러할 연) 之(갈 지) 氣(기운 기) - 넓고 크게 가득 찬 정신과 기개',
    example: '예문: 호연지기를 길렀다.'
  },
  {
    word: '혼비백산(魂飛魄散)',
    question: '<span class="word-highlight">혼비백산(魂飛魄散)</span>의 뜻은?',
    hint: '혼이 날고 넋이 흩어짐',
    choices: ['차분함', '넋을 잃고 매우 놀람', '용감함', '담대함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '魂(넋 혼) 飛(날 비) 魄(넋 백) 散(흩어질 산) - 혼이 날아가고 넋이 흩어짐. 몹시 놀람',
    example: '예문: 혼비백산하여 도망쳤다.'
  },
  {
    word: '화룡점정(畵龍點睛)',
    question: '<span class="word-highlight">화룡점정(畵龍點睛)</span>의 뜻은?',
    hint: '용을 그리고 눈동자를 찍음',
    choices: ['쓸데없는 일', '가장 중요한 부분을 완성함', '미완성', '시작만 함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '畵(그림 화) 龍(용 룡) 點(점 점) 睛(눈동자 정) - 용을 그리고 눈동자를 찍어 완성함. 가장 핵심적인 마무리',
    example: '예문: 화룡점정으로 마무리했다.'
  },
  {
    word: '화무십일홍(花無十日紅)',
    question: '<span class="word-highlight">화무십일홍(花無十日紅)</span>의 뜻은?',
    hint: '꽃이 열흘 붉지 않음',
    choices: ['영원히 번영함', '좋은 일도 오래 가지 않음', '항상 행복함', '변함없음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '花(꽃 화) 無(없을 무) 十(열 십) 日(날 일) 紅(붉을 홍) - 꽃이 열흘 붉지 않음. 좋은 일은 오래 가지 않음',
    example: '예문: 화무십일홍이라 방심하면 안 된다.'
  },
  {
    word: '화이부동(和而不同)',
    question: '<span class="word-highlight">화이부동(和而不同)</span>의 뜻은?',
    hint: '화합하되 같지 않음',
    choices: ['모두 같아짐', '조화를 이루되 자기 주관을 지킴', '개성을 포기함', '획일적임'],
    correct: 1,
    koreanLevel: 6,
    explanation: '和(화할 화) 而(말 이을 이) 不(아닐 불) 同(같을 동) - 조화를 이루되 자기 주관은 지킴',
    example: '예문: 화이부동의 정신이 필요하다.'
  },
  {
    word: '환골탈태(換骨奪胎)',
    question: '<span class="word-highlight">환골탈태(換骨奪胎)</span>의 뜻은?',
    hint: '뼈를 바꾸고 태를 빼앗음',
    choices: ['변함없음', '완전히 새롭게 바뀜', '그대로 유지', '약간의 변화'],
    correct: 1,
    koreanLevel: 6,
    explanation: '換(바꿀 환) 骨(뼈 골) 奪(빼앗을 탈) 胎(아이밸 태) - 뼈를 바꾸고 태를 빼앗음. 완전히 새롭게 바뀜',
    example: '예문: 환골탈태하여 새 사람이 되었다.'
  },
  {
    word: '황당무계(荒唐無稽)',
    question: '<span class="word-highlight">황당무계(荒唐無稽)</span>의 뜻은?',
    hint: '터무니없고 근거가 없음',
    choices: ['사실적', '말이 허황되고 근거 없음', '논리적', '합리적'],
    correct: 1,
    koreanLevel: 6,
    explanation: '荒(거칠 황) 唐(당나라 당) 無(없을 무) 稽(상고할 계) - 말이나 행동이 허황되고 근거가 없음',
    example: '예문: 황당무계한 소리다.'
  },
  {
    word: '회자정리(會者定離)',
    question: '<span class="word-highlight">회자정리(會者定離)</span>의 뜻은?',
    hint: '만난 자는 반드시 헤어짐',
    choices: ['영원히 함께함', '만남이 있으면 반드시 이별이 있음', '항상 함께함', '헤어지지 않음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '會(모일 회) 者(놈 자) 定(정할 정) 離(떠날 리) - 만남이 있으면 반드시 이별이 있음',
    example: '예문: 회자정리라 언젠가는 헤어진다.'
  },
  {
    word: '후생가외(後生可畏)',
    question: '<span class="word-highlight">후생가외(後生可畏)</span>의 뜻은?',
    hint: '뒤에 난 자가 두려움',
    choices: ['젊은이를 무시함', '젊은이들이 두려울 만큼 대단함', '젊은이가 못함', '어른이 더 나음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '後(뒤 후) 生(날 생) 可(가할 가) 畏(두려울 외) - 뒤에 태어난 젊은이들이 두려울 만큼 대단함',
    example: '예문: 후생가외라더니 대단하다.'
  },
  {
    word: '흥진비래(興盡悲來)',
    question: '<span class="word-highlight">흥진비래(興盡悲來)</span>의 뜻은?',
    hint: '흥이 다하면 슬픔이 옴',
    choices: ['항상 즐거움', '즐거움이 다하면 슬픔이 옴', '슬픔이 없음', '영원한 행복'],
    correct: 1,
    koreanLevel: 6,
    explanation: '興(흥할 흥) 盡(다할 진) 悲(슬플 비) 來(올 래) - 즐거움이 다하면 슬픔이 옴',
    example: '예문: 흥진비래로 기분이 처졌다.'
  },
  {
    word: '가화만사성(家和萬事成)',
    question: '<span class="word-highlight">가화만사성(家和萬事成)</span>의 뜻은?',
    hint: '집안이 화목하면 모든 일이 이루어짐',
    choices: ['집안이 불화하면 성공', '집안이 화목하면 모든 일이 잘됨', '개인의 노력만 필요', '가족이 중요하지 않음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '家(집 가) 和(화할 화) 萬(일만 만) 事(일 사) 成(이룰 성) - 집안이 화목하면 모든 일이 잘 이루어짐',
    example: '예문: 가화만사성이라 했다.'
  },
  {
    word: '격물치지(格物致知)',
    question: '<span class="word-highlight">격물치지(格物致知)</span>의 뜻은?',
    hint: '사물을 연구하여 앎에 이름',
    choices: ['암기만 함', '사물의 이치를 연구하여 지식을 얻음', '느낌으로 앎', '경험 무시'],
    correct: 1,
    koreanLevel: 6,
    explanation: '格(바로잡을 격) 物(물건 물) 致(이룰 치) 知(알 지) - 사물의 이치를 연구하여 앎에 이름',
    example: '예문: 격물치지의 자세로 연구했다.'
  },
  {
    word: '견강부회(牽强附會)',
    question: '<span class="word-highlight">견강부회(牽强附會)</span>의 뜻은?',
    hint: '억지로 끌어 붙임',
    choices: ['자연스러운 연결', '억지로 끌어다 붙임', '논리적 설명', '타당한 추론'],
    correct: 1,
    koreanLevel: 6,
    explanation: '牽(끌 견) 强(강할 강) 附(붙을 부) 會(모일 회) - 이치에 맞지 않는 것을 억지로 끌어다 붙임',
    example: '예문: 견강부회하지 마라.'
  },
  {
    word: '견마지로(犬馬之勞)',
    question: '<span class="word-highlight">견마지로(犬馬之勞)</span>의 뜻은?',
    hint: '개와 말의 수고',
    choices: ['큰 공로', '윗사람을 위한 자신의 노력을 겸손히 이름', '게으름', '봉사 거부'],
    correct: 1,
    koreanLevel: 6,
    explanation: '犬(개 견) 馬(말 마) 之(갈 지) 勞(일할 로) - 개나 말처럼 하찮은 수고. 윗사람을 위한 자신의 노력을 겸손히 이름',
    example: '예문: 견마지로를 다하겠습니다.'
  },
  {
    word: '경거망동(輕擧妄動)',
    question: '<span class="word-highlight">경거망동(輕擧妄動)</span>의 뜻은?',
    hint: '가볍게 거동하고 망령되이 움직임',
    choices: ['신중한 행동', '경솔하고 분별없는 행동', '조심스러움', '사려깊음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '輕(가벼울 경) 擧(들 거) 妄(망령될 망) 動(움직일 동) - 경솔하고 분별없이 함부로 행동함',
    example: '예문: 경거망동하지 마라.'
  },
  {
    word: '경국지색(傾國之色)',
    question: '<span class="word-highlight">경국지색(傾國之色)</span>의 뜻은?',
    hint: '나라를 기울게 하는 미색',
    choices: ['평범한 외모', '나라를 기울게 할 정도의 미인', '못생김', '보통 사람'],
    correct: 1,
    koreanLevel: 6,
    explanation: '傾(기울 경) 國(나라 국) 之(갈 지) 色(빛 색) - 나라를 뒤흔들 만큼 뛰어난 미인',
    example: '예문: 경국지색의 미인이다.'
  },
  {
    word: '경천동지(驚天動地)',
    question: '<span class="word-highlight">경천동지(驚天動地)</span>의 뜻은?',
    hint: '하늘을 놀라게 하고 땅을 움직임',
    choices: ['작은 일', '세상을 크게 놀라게 함', '조용함', '평범함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '驚(놀랄 경) 天(하늘 천) 動(움직일 동) 地(땅 지) - 하늘을 놀라게 하고 땅을 움직임. 세상을 크게 뒤흔듦',
    example: '예문: 경천동지할 사건이 일어났다.'
  },
  {
    word: '고군분투(孤軍奮鬪)',
    question: '<span class="word-highlight">고군분투(孤軍奮鬪)</span>의 뜻은?',
    hint: '외로운 군대가 분발하여 싸움',
    choices: ['도움을 받음', '혼자서 힘껏 싸움', '항복함', '포기함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '孤(외로울 고) 軍(군사 군) 奮(분발할 분) 鬪(싸울 투) - 원군 없이 홀로 힘껏 싸움',
    example: '예문: 고군분투하여 이겼다.'
  },
  {
    word: '고굉지신(股肱之臣)',
    question: '<span class="word-highlight">고굉지신(股肱之臣)</span>의 뜻은?',
    hint: '다리와 팔 같은 신하',
    choices: ['무능한 신하', '가장 믿음직한 신하', '배신자', '적군'],
    correct: 1,
    koreanLevel: 6,
    explanation: '股(넓적다리 고) 肱(팔 굉) 之(갈 지) 臣(신하 신) - 팔다리처럼 믿음직한 신하',
    example: '예문: 그는 임금의 고굉지신이었다.'
  },
  {
    word: '고육지책(苦肉之策)',
    question: '<span class="word-highlight">고육지책(苦肉之策)</span>의 뜻은?',
    hint: '살을 깎는 계책',
    choices: ['쉬운 방법', '자기를 희생하여 적을 속이는 계책', '정정당당함', '편한 길'],
    correct: 1,
    koreanLevel: 6,
    explanation: '苦(괴로울 고) 肉(고기 육) 之(갈 지) 策(꾀 책) - 자신을 괴롭혀 상대를 속이는 계책',
    example: '예문: 고육지책을 썼다.'
  },
  {
    word: '고장난명(孤掌難鳴)',
    question: '<span class="word-highlight">고장난명(孤掌難鳴)</span>의 뜻은?',
    hint: '외손뼉은 울리기 어려움',
    choices: ['혼자서도 가능함', '혼자서는 일을 이루기 어려움', '쉬움', '간단함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '孤(외로울 고) 掌(손바닥 장) 難(어려울 난) 鳴(울 명) - 손뼉은 두 손을 쳐야 울림. 혼자서는 일을 이루기 어려움',
    example: '예문: 고장난명이라 협력해야 한다.'
  },
  {
    word: '곡학아세(曲學阿世)',
    question: '<span class="word-highlight">곡학아세(曲學阿世)</span>의 뜻은?',
    hint: '학문을 굽혀 세상에 아첨함',
    choices: ['정직한 학문', '학문을 왜곡하여 세상에 아첨함', '올바른 연구', '진실된 탐구'],
    correct: 1,
    koreanLevel: 6,
    explanation: '曲(굽을 곡) 學(배울 학) 阿(언덕 아) 世(세상 세) - 학문을 왜곡하여 세상에 아첨함',
    example: '예문: 곡학아세의 학자가 되지 마라.'
  },
  {
    word: '과유불급(過猶不及)',
    question: '<span class="word-highlight">과유불급(過猶不及)</span>의 뜻은?',
    hint: '지나침은 미치지 못함과 같음',
    choices: ['많을수록 좋음', '지나친 것은 부족한 것과 같음', '적을수록 좋음', '항상 많아야 함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '過(지날 과) 猶(오히려 유) 不(아닐 불) 及(미칠 급) - 지나침은 미치지 못함과 같음. 중용이 중요',
    example: '예문: 과유불급이니 적당히 해라.'
  },
  {
    word: '괄목상대(刮目相對)',
    question: '<span class="word-highlight">괄목상대(刮目相對)</span>의 뜻은?',
    hint: '눈을 비비고 상대함',
    choices: ['무시함', '사람의 달라진 모습을 새롭게 봄', '경멸함', '변함없이 봄'],
    correct: 1,
    koreanLevel: 6,
    explanation: '刮(긁을 괄) 目(눈 목) 相(서로 상) 對(대할 대) - 눈을 비비고 다시 봄. 사람의 달라진 모습을 새롭게 봄',
    example: '예문: 괄목상대할 정도로 성장했다.'
  },
  {
    word: '교각살우(矯角殺牛)',
    question: '<span class="word-highlight">교각살우(矯角殺牛)</span>의 뜻은?',
    hint: '뿔을 고치려다 소를 죽임',
    choices: ['작은 것을 고치려다 큰 것을 망침', '완벽하게 고침', '신중함', '성공함'],
    correct: 0,
    koreanLevel: 6,
    explanation: '矯(바로잡을 교) 角(뿔 각) 殺(죽일 살) 牛(소 우) - 뿔을 고치려다 소를 죽임. 작은 것을 고치려다 큰 일을 그르침',
    example: '예문: 교각살우가 되지 않게 조심해라.'
  },
  {
    word: '교언영색(巧言令色)',
    question: '<span class="word-highlight">교언영색(巧言令色)</span>의 뜻은?',
    hint: '교묘한 말과 아양 부리는 표정',
    choices: ['솔직함', '교묘하게 꾸민 말과 아첨하는 태도', '진실됨', '정직함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '巧(공교로울 교) 言(말씀 언) 令(하여금 령) 色(빛 색) - 말을 교묘하게 하고 얼굴빛을 꾸며 아첨함',
    example: '예문: 교언영색으로 사람을 속였다.'
  },
  {
    word: '교우이신(交友以信)',
    question: '<span class="word-highlight">교우이신(交友以信)</span>의 뜻은?',
    hint: '벗을 사귐에 믿음으로 함',
    choices: ['이익으로 사귐', '신의로 친구를 사귐', '속임수로 사귐', '위선으로 사귐'],
    correct: 1,
    koreanLevel: 6,
    explanation: '交(사귈 교) 友(벗 우) 以(써 이) 信(믿을 신) - 친구를 신의로써 사귐',
    example: '예문: 교우이신이 진정한 우정이다.'
  },
  {
    word: '구밀복검(口蜜腹劍)',
    question: '<span class="word-highlight">구밀복검(口蜜腹劍)</span>의 뜻은?',
    hint: '입에는 꿀이요 배에는 칼',
    choices: ['겉과 속이 같음', '겉은 달콤하나 속은 해할 마음을 품음', '순수함', '정직함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '口(입 구) 蜜(꿀 밀) 腹(배 복) 劍(칼 검) - 입에는 꿀, 배에는 칼. 겉으로는 친절하나 속으로는 해칠 마음을 품음',
    example: '예문: 구밀복검인 사람을 조심해라.'
  },
  {
    word: '구상유취(口尚乳臭)',
    question: '<span class="word-highlight">구상유취(口尚乳臭)</span>의 뜻은?',
    hint: '입에서 아직 젖 냄새가 남',
    choices: ['경험이 풍부함', '아직 어리고 철없음', '성숙함', '어른스러움'],
    correct: 1,
    koreanLevel: 6,
    explanation: '口(입 구) 尚(오히려 상) 乳(젖 유) 臭(냄새 취) - 입에서 아직 젖 냄새가 남. 어리고 철이 없음',
    example: '예문: 구상유취인 녀석이 뭘 안다고.'
  },
  {
    word: '구우일모(九牛一毛)',
    question: '<span class="word-highlight">구우일모(九牛一毛)</span>의 뜻은?',
    hint: '아홉 마리 소 중 한 개의 털',
    choices: ['매우 많음', '매우 적거나 하찮음', '중요함', '귀중함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '九(아홉 구) 牛(소 우) 一(한 일) 毛(터럭 모) - 아홉 마리 소의 털 하나. 극히 적음',
    example: '예문: 그것은 구우일모에 불과하다.'
  },
  {
    word: '구절양장(九折羊腸)',
    question: '<span class="word-highlight">구절양장(九折羊腸)</span>의 뜻은?',
    hint: '아홉 번 꺾이는 양의 창자',
    choices: ['평탄한 길', '꼬불꼬불 험한 길', '넓은 길', '바른 길'],
    correct: 1,
    koreanLevel: 6,
    explanation: '九(아홉 구) 折(꺾을 절) 羊(양 양) 腸(창자 장) - 양의 창자처럼 꼬불꼬불한 산길. 매우 험한 길',
    example: '예문: 구절양장의 험한 길을 지났다.'
  },
  {
    word: '권토중래(捲土重來)',
    question: '<span class="word-highlight">권토중래(捲土重來)</span>의 뜻은?',
    hint: '흙먼지를 일으키며 다시 옴',
    choices: ['포기함', '실패 후 다시 힘을 가다듬어 옴', '물러남', '단념함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '捲(말 권) 土(흙 토) 重(거듭 중) 來(올 래) - 흙먼지를 일으키며 다시 옴. 실패 후 재기함',
    example: '예문: 권토중래하여 성공했다.'
  },
  {
    word: '귀감(龜鑑)',
    question: '<span class="word-highlight">귀감(龜鑑)</span>의 뜻은?',
    hint: '거북과 거울',
    choices: ['나쁜 예', '본받을 만한 모범', '경계할 것', '피할 것'],
    correct: 1,
    koreanLevel: 6,
    explanation: '龜(거북 귀) 鑑(거울 감) - 거북의 등과 거울. 본받을 만한 모범',
    example: '예문: 그분은 우리의 귀감이다.'
  },
  {
    word: '금과옥조(金科玉條)',
    question: '<span class="word-highlight">금과옥조(金科玉條)</span>의 뜻은?',
    hint: '황금의 법칙 옥의 조항',
    choices: ['무시해도 됨', '반드시 지켜야 할 법칙', '어겨도 됨', '유연함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '金(쇠 금) 科(과목 과) 玉(구슬 옥) 條(가지 조) - 황금과 옥처럼 귀한 법칙. 꼭 지켜야 할 규범',
    example: '예문: 그것을 금과옥조로 삼았다.'
  },
  {
    word: '금란지교(金蘭之交)',
    question: '<span class="word-highlight">금란지교(金蘭之交)</span>의 뜻은?',
    hint: '황금과 난초의 사귐',
    choices: ['이해관계의 사귐', '매우 깊고 아름다운 우정', '피상적 관계', '일시적 만남'],
    correct: 1,
    koreanLevel: 6,
    explanation: '金(쇠 금) 蘭(난초 란) 之(갈 지) 交(사귈 교) - 황금처럼 굳고 난초처럼 향기로운 사귐. 깊은 우정',
    example: '예문: 우리는 금란지교를 맺었다.'
  },
  // 251~300번 한자성어
  {
    word: '금상첨화(錦上添花)',
    question: '<span class="word-highlight">금상첨화(錦上添花)</span>의 뜻은?',
    hint: '비단 위에 꽃을 더함',
    choices: ['나쁜 일에 더 나쁜 일', '좋은 일에 더 좋은 일이 더해짐', '평범함', '변화 없음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '錦(비단 금) 上(위 상) 添(더할 첨) 花(꽃 화) - 비단 위에 꽃을 더함. 좋은 일에 더 좋은 일이 더해짐',
    example: '예문: 승진에 상금까지, 금상첨화다.'
  },
  {
    word: '금시초문(今始初聞)',
    question: '<span class="word-highlight">금시초문(今始初聞)</span>의 뜻은?',
    hint: '지금 비로소 처음 들음',
    choices: ['예전에 들음', '지금 처음 들음', '자주 들음', '익숙함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '今(이제 금) 始(비로소 시) 初(처음 초) 聞(들을 문) - 지금 비로소 처음 들음',
    example: '예문: 그 소식은 금시초문이다.'
  },
  {
    word: '금의환향(錦衣還鄕)',
    question: '<span class="word-highlight">금의환향(錦衣還鄕)</span>의 뜻은?',
    hint: '비단옷 입고 고향에 돌아감',
    choices: ['실패하여 돌아감', '성공하여 고향에 돌아감', '고향을 떠남', '방랑함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '錦(비단 금) 衣(옷 의) 還(돌아올 환) 鄕(시골 향) - 비단옷을 입고 고향에 돌아감. 성공하여 고향에 돌아감',
    example: '예문: 금의환향하여 부모님께 효도했다.'
  },
  {
    word: '금지옥엽(金枝玉葉)',
    question: '<span class="word-highlight">금지옥엽(金枝玉葉)</span>의 뜻은?',
    hint: '금 가지와 옥 잎',
    choices: ['천한 신분', '귀한 신분이나 자손', '평범한 사람', '가난한 집'],
    correct: 1,
    koreanLevel: 6,
    explanation: '金(쇠 금) 枝(가지 지) 玉(구슬 옥) 葉(잎 엽) - 금으로 된 가지와 옥으로 된 잎. 귀한 신분이나 자손',
    example: '예문: 금지옥엽으로 자랐다.'
  },
  {
    word: '기고만장(氣高萬丈)',
    question: '<span class="word-highlight">기고만장(氣高萬丈)</span>의 뜻은?',
    hint: '기세가 만 길이나 높음',
    choices: ['기가 죽음', '기세가 대단히 높음', '겸손함', '소심함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '氣(기운 기) 高(높을 고) 萬(일만 만) 丈(길 장) - 기세가 만 길이나 높음. 기세등등함',
    example: '예문: 기고만장하게 나섰다.'
  },
  {
    word: '기사회생(起死回生)',
    question: '<span class="word-highlight">기사회생(起死回生)</span>의 뜻은?',
    hint: '죽음에서 일어나 다시 삶',
    choices: ['죽음', '거의 죽게 된 것을 다시 살림', '절망', '포기'],
    correct: 1,
    koreanLevel: 6,
    explanation: '起(일어날 기) 死(죽을 사) 回(돌아올 회) 生(날 생) - 거의 죽게 된 것을 다시 살림',
    example: '예문: 기사회생으로 위기를 넘겼다.'
  },
  {
    word: '기상천외(奇想天外)',
    question: '<span class="word-highlight">기상천외(奇想天外)</span>의 뜻은?',
    hint: '기이한 생각이 하늘 밖',
    choices: ['평범한 생각', '매우 엉뚱하고 기발한 생각', '보통의 아이디어', '흔한 발상'],
    correct: 1,
    koreanLevel: 6,
    explanation: '奇(기이할 기) 想(생각 상) 天(하늘 천) 外(바깥 외) - 생각이 하늘 밖에 있을 만큼 기발함',
    example: '예문: 기상천외한 아이디어다.'
  },
  {
    word: '기승전결(起承轉結)',
    question: '<span class="word-highlight">기승전결(起承轉結)</span>의 뜻은?',
    hint: '일어나고 잇고 구르고 맺음',
    choices: ['순서 없음', '글이나 일의 전개 순서', '혼란스러움', '무질서'],
    correct: 1,
    koreanLevel: 6,
    explanation: '起(일어날 기) 承(이을 승) 轉(구를 전) 結(맺을 결) - 시나 문장의 구성 순서. 일의 전개 단계',
    example: '예문: 기승전결이 분명한 글이다.'
  },
  {
    word: '기우(杞憂)',
    question: '<span class="word-highlight">기우(杞憂)</span>의 뜻은?',
    hint: '기나라 사람의 걱정',
    choices: ['현실적 걱정', '쓸데없는 걱정', '타당한 우려', '중요한 걱정'],
    correct: 1,
    koreanLevel: 6,
    explanation: '杞(기나라 기) 憂(근심 우) - 기나라 사람이 하늘이 무너질까 걱정함. 쓸데없는 걱정',
    example: '예문: 그것은 기우에 불과하다.'
  },
  {
    word: '기진맥진(氣盡脈盡)',
    question: '<span class="word-highlight">기진맥진(氣盡脈盡)</span>의 뜻은?',
    hint: '기운이 다하고 맥이 다함',
    choices: ['힘이 넘침', '기력이 모두 다함', '활력이 있음', '건강함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '氣(기운 기) 盡(다할 진) 脈(맥 맥) 盡(다할 진) - 기운과 맥이 다함. 완전히 지침',
    example: '예문: 기진맥진하여 쓰러졌다.'
  },
  {
    word: '기호지세(騎虎之勢)',
    question: '<span class="word-highlight">기호지세(騎虎之勢)</span>의 뜻은?',
    hint: '호랑이를 탄 형세',
    choices: ['안전한 상황', '중도에서 그만둘 수 없는 상황', '쉬운 일', '여유 있음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '騎(탈 기) 虎(범 호) 之(갈 지) 勢(형세 세) - 호랑이를 탄 형세. 중도에 그만둘 수 없는 상황',
    example: '예문: 기호지세라 멈출 수 없다.'
  },
  {
    word: '난공불락(難攻不落)',
    question: '<span class="word-highlight">난공불락(難攻不落)</span>의 뜻은?',
    hint: '공격하기 어렵고 떨어뜨리기 어려움',
    choices: ['쉽게 무너짐', '공격해도 쉽게 함락되지 않음', '약함', '허술함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '難(어려울 난) 攻(칠 공) 不(아닐 불) 落(떨어질 락) - 공격하기 어렵고 함락시키기 어려움',
    example: '예문: 난공불락의 성이다.'
  },
  {
    word: '난형난제(難兄難弟)',
    question: '<span class="word-highlight">난형난제(難兄難弟)</span>의 뜻은?',
    hint: '형도 어렵고 아우도 어려움',
    choices: ['차이가 큼', '우열을 가리기 어려움', '분명한 차이', '확실한 순위'],
    correct: 1,
    koreanLevel: 6,
    explanation: '難(어려울 난) 兄(형 형) 難(어려울 난) 弟(아우 제) - 형이라 하기도, 아우라 하기도 어려움. 우열을 가리기 어려움',
    example: '예문: 두 사람은 난형난제다.'
  },
  {
    word: '낙화유수(落花流水)',
    question: '<span class="word-highlight">낙화유수(落花流水)</span>의 뜻은?',
    hint: '떨어지는 꽃과 흐르는 물',
    choices: ['무관심', '서로 그리워하는 마음이 잘 맞음', '싫어함', '멀어짐'],
    correct: 1,
    koreanLevel: 6,
    explanation: '落(떨어질 락) 花(꽃 화) 流(흐를 류) 水(물 수) - 떨어지는 꽃과 흐르는 물처럼 서로 그리워하는 마음이 맞음',
    example: '예문: 낙화유수의 정이 있다.'
  },
  {
    word: '남가일몽(南柯一夢)',
    question: '<span class="word-highlight">남가일몽(南柯一夢)</span>의 뜻은?',
    hint: '남쪽 가지의 한 꿈',
    choices: ['실현된 꿈', '헛된 꿈이나 한때의 부귀영화', '영원한 성공', '지속되는 행복'],
    correct: 1,
    koreanLevel: 6,
    explanation: '南(남녘 남) 柯(가지 가) 一(한 일) 夢(꿈 몽) - 남쪽 가지의 한 꿈. 헛된 꿈이나 한때의 부귀영화',
    example: '예문: 그 성공은 남가일몽이었다.'
  },
  {
    word: '남남북녀(南男北女)',
    question: '<span class="word-highlight">남남북녀(南男北女)</span>의 뜻은?',
    hint: '남쪽 남자 북쪽 여자',
    choices: ['남북의 갈등', '남쪽 남자와 북쪽 여자가 잘생기고 예쁨', '남북의 화합', '지역 차별'],
    correct: 1,
    koreanLevel: 6,
    explanation: '南(남녘 남) 男(남자 남) 北(북녘 북) 女(여자 녀) - 남쪽 남자와 북쪽 여자가 잘남',
    example: '예문: 남남북녀라는 말이 있다.'
  },
  {
    word: '남부여대(男負女戴)',
    question: '<span class="word-highlight">남부여대(男負女戴)</span>의 뜻은?',
    hint: '남자는 지고 여자는 임',
    choices: ['편안한 이주', '가난하여 이리저리 떠돌아다님', '안정된 생활', '풍요로움'],
    correct: 1,
    koreanLevel: 6,
    explanation: '男(남자 남) 負(질 부) 女(여자 녀) 戴(일 대) - 남자는 짐을 지고 여자는 짐을 임. 가난하게 떠돌아다님',
    example: '예문: 남부여대하며 피란했다.'
  },
  {
    word: '낭중지추(囊中之錐)',
    question: '<span class="word-highlight">낭중지추(囊中之錐)</span>의 뜻은?',
    hint: '주머니 속의 송곳',
    choices: ['숨겨진 무능', '재능 있는 사람은 저절로 드러남', '감춰진 결점', '드러나지 않음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '囊(주머니 낭) 中(가운데 중) 之(갈 지) 錐(송곳 추) - 주머니 속의 송곳. 재능 있는 사람은 저절로 드러남',
    example: '예문: 낭중지추처럼 두각을 나타냈다.'
  },
  {
    word: '내우외환(內憂外患)',
    question: '<span class="word-highlight">내우외환(內憂外患)</span>의 뜻은?',
    hint: '안의 근심 밖의 걱정',
    choices: ['평화로움', '안팎으로 걱정이 많음', '안정됨', '근심이 없음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '內(안 내) 憂(근심 우) 外(바깥 외) 患(근심 환) - 안과 밖에서 겪는 걱정과 어려움',
    example: '예문: 내우외환에 시달렸다.'
  },
  {
    word: '노발대발(怒發大發)',
    question: '<span class="word-highlight">노발대발(怒發大發)</span>의 뜻은?',
    hint: '노기가 크게 일어남',
    choices: ['차분함', '몹시 화를 냄', '평온함', '침착함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '怒(성낼 노) 發(필 발) 大(클 대) 發(필 발) - 크게 노하여 화를 냄',
    example: '예문: 노발대발하며 화를 냈다.'
  },
  {
    word: '노심초사(勞心焦思)',
    question: '<span class="word-highlight">노심초사(勞心焦思)</span>의 뜻은?',
    hint: '마음을 쓰고 생각을 태움',
    choices: ['편안함', '몹시 애를 태우며 걱정함', '무관심', '느긋함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '勞(일할 로) 心(마음 심) 焦(탈 초) 思(생각 사) - 마음을 쓰고 속을 태움. 몹시 걱정함',
    example: '예문: 노심초사하며 기다렸다.'
  },
  {
    word: '녹림(綠林)',
    question: '<span class="word-highlight">녹림(綠林)</span>의 뜻은?',
    hint: '푸른 숲',
    choices: ['정규군', '도적떼나 의적', '농민', '관리'],
    correct: 1,
    koreanLevel: 6,
    explanation: '綠(푸를 록) 林(수풀 림) - 푸른 숲. 산적이나 의적을 이르는 말',
    example: '예문: 녹림의 호걸이었다.'
  },
  {
    word: '눈엽(嫩葉)',
    question: '<span class="word-highlight">눈엽(嫩葉)</span>은 무슨 뜻인가?',
    hint: '연한 잎',
    choices: ['마른 잎', '새로 돋은 연한 잎', '낙엽', '단풍'],
    correct: 1,
    koreanLevel: 6,
    explanation: '嫩(연할 눈) 葉(잎 엽) - 봄에 새로 돋은 연한 잎',
    example: '예문: 눈엽이 파릇파릇 돋아났다.'
  },
  {
    word: '다기망양(多岐亡羊)',
    question: '<span class="word-highlight">다기망양(多岐亡羊)</span>의 뜻은?',
    hint: '갈림길이 많아 양을 잃음',
    choices: ['목표가 분명함', '방침이 많아 갈피를 못 잡음', '길이 하나임', '단순함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '多(많을 다) 岐(갈림길 기) 亡(잃을 망) 羊(양 양) - 갈림길이 많아 양을 잃음. 방침이 많아 어찌할 바를 모름',
    example: '예문: 다기망양의 상황이다.'
  },
  {
    word: '다다익선(多多益善)',
    question: '<span class="word-highlight">다다익선(多多益善)</span>의 뜻은?',
    hint: '많을수록 더욱 좋음',
    choices: ['적을수록 좋음', '많을수록 좋음', '적당히 있음', '관계없음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '多(많을 다) 多(많을 다) 益(더할 익) 善(착할 선) - 많으면 많을수록 좋음',
    example: '예문: 이런 것은 다다익선이다.'
  },
  {
    word: '다사다난(多事多難)',
    question: '<span class="word-highlight">다사다난(多事多難)</span>의 뜻은?',
    hint: '일도 많고 어려움도 많음',
    choices: ['평탄함', '여러 가지 일과 어려움이 많음', '순조로움', '한가함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '多(많을 다) 事(일 사) 多(많을 다) 難(어려울 난) - 일도 많고 어려움도 많음',
    example: '예문: 다사다난했던 한 해였다.'
  },
  {
    word: '단도직입(單刀直入)',
    question: '<span class="word-highlight">단도직입(單刀直入)</span>의 뜻은?',
    hint: '홀로 칼 들고 곧장 들어감',
    choices: ['에둘러 말함', '바로 핵심을 찌름', '우회함', '복잡하게 말함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '單(홀로 단) 刀(칼 도) 直(곧을 직) 入(들 입) - 혼자 칼을 들고 적진에 들어감. 핵심을 바로 찌름',
    example: '예문: 단도직입적으로 말하겠다.'
  },
  {
    word: '당랑거철(螳螂拒轍)',
    question: '<span class="word-highlight">당랑거철(螳螂拒轍)</span>의 뜻은?',
    hint: '사마귀가 수레바퀴를 막음',
    choices: ['신중함', '제 힘을 모르고 강한 적에게 덤빔', '지혜로움', '승리함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '螳(사마귀 당) 螂(사마귀 랑) 拒(막을 거) 轍(바퀴자국 철) - 사마귀가 수레를 막음. 제 분수를 모르고 덤빔',
    example: '예문: 당랑거철과 같은 행동이다.'
  },
  {
    word: '대기만성(大器晩成)',
    question: '<span class="word-highlight">대기만성(大器晩成)</span>의 뜻은?',
    hint: '큰 그릇은 늦게 이루어짐',
    choices: ['일찍 성공함', '큰 인물은 늦게 이루어짐', '빨리 완성됨', '조기에 성취'],
    correct: 1,
    koreanLevel: 6,
    explanation: '大(큰 대) 器(그릇 기) 晩(늦을 만) 成(이룰 성) - 큰 그릇은 만드는 데 오래 걸림. 큰 인물은 늦게 이루어짐',
    example: '예문: 대기만성이라 믿는다.'
  },
  {
    word: '대동단결(大同團結)',
    question: '<span class="word-highlight">대동단결(大同團結)</span>의 뜻은?',
    hint: '크게 같이 뭉침',
    choices: ['분열함', '같은 목적으로 굳게 뭉침', '해산함', '갈라짐'],
    correct: 1,
    koreanLevel: 6,
    explanation: '大(큰 대) 同(같을 동) 團(둥글 단) 結(맺을 결) - 여러 사람이 같은 목적으로 굳게 뭉침',
    example: '예문: 대동단결하여 이겼다.'
  },
  {
    word: '대동소이(大同小異)',
    question: '<span class="word-highlight">대동소이(大同小異)</span>의 뜻은?',
    hint: '크게 같고 작게 다름',
    choices: ['완전히 다름', '대체로 같고 조금 다름', '전혀 같지 않음', '큰 차이'],
    correct: 1,
    koreanLevel: 6,
    explanation: '大(큰 대) 同(같을 동) 小(작을 소) 異(다를 이) - 크게 보면 같고 작게 보면 다름. 거의 비슷함',
    example: '예문: 두 의견은 대동소이하다.'
  },
  {
    word: '대의명분(大義名分)',
    question: '<span class="word-highlight">대의명분(大義名分)</span>의 뜻은?',
    hint: '큰 의리와 이름의 본분',
    choices: ['사사로운 이익', '사람으로서 마땅히 지켜야 할 도리', '개인적 욕심', '작은 이유'],
    correct: 1,
    koreanLevel: 6,
    explanation: '大(큰 대) 義(옳을 의) 名(이름 명) 分(나눌 분) - 마땅히 지켜야 할 큰 도리와 본분',
    example: '예문: 대의명분을 내세웠다.'
  },
  {
    word: '도청도설(道聽途說)',
    question: '<span class="word-highlight">도청도설(道聽途說)</span>의 뜻은?',
    hint: '길에서 듣고 길에서 말함',
    choices: ['확실한 정보', '길에서 주워들은 소문', '사실', '정확한 뉴스'],
    correct: 1,
    koreanLevel: 6,
    explanation: '道(길 도) 聽(들을 청) 途(길 도) 說(말씀 설) - 길에서 듣고 길에서 말함. 근거 없이 전해지는 말',
    example: '예문: 도청도설에 불과하다.'
  },
  {
    word: '독불장군(獨不將軍)',
    question: '<span class="word-highlight">독불장군(獨不將軍)</span>의 뜻은?',
    hint: '홀로 아닌 장군',
    choices: ['협력함', '혼자서 모든 것을 하려는 사람', '함께함', '양보함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '獨(홀로 독) 不(아닐 불) 將(장수 장) 軍(군사 군) - 혼자서 모든 일을 하려는 사람',
    example: '예문: 독불장군 식으로 행동했다.'
  },
  {
    word: '독서삼매(讀書三昧)',
    question: '<span class="word-highlight">독서삼매(讀書三昧)</span>의 뜻은?',
    hint: '책 읽기에 삼매경',
    choices: ['책을 싫어함', '책 읽기에 깊이 빠짐', '책을 멀리함', '독서를 피함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '讀(읽을 독) 書(글 서) 三(석 삼) 昧(어두울 매) - 책 읽기에 완전히 빠져듦',
    example: '예문: 독서삼매에 빠졌다.'
  },
  {
    word: '동가홍상(同價紅裳)',
    question: '<span class="word-highlight">동가홍상(同價紅裳)</span>의 뜻은?',
    hint: '같은 값이면 붉은 치마',
    choices: ['같은 값이면 나쁜 것', '같은 조건이면 좋은 것을 선택', '차별 없음', '무관심'],
    correct: 1,
    koreanLevel: 6,
    explanation: '同(같을 동) 價(값 가) 紅(붉을 홍) 裳(치마 상) - 같은 값이면 다홍치마. 같은 조건이면 좋은 것을 선택',
    example: '예문: 동가홍상이라고 이것으로 하자.'
  },
  {
    word: '동고동락(同苦同樂)',
    question: '<span class="word-highlight">동고동락(同苦同樂)</span>의 뜻은?',
    hint: '같이 괴로워하고 같이 즐거워함',
    choices: ['혼자만 고생', '함께 괴로움과 즐거움을 나눔', '혼자만 즐김', '따로 지냄'],
    correct: 1,
    koreanLevel: 6,
    explanation: '同(같을 동) 苦(괴로울 고) 同(같을 동) 樂(즐거울 락) - 괴로움과 즐거움을 함께 나눔',
    example: '예문: 동고동락해 온 친구다.'
  },
  {
    word: '동량(棟梁)',
    question: '<span class="word-highlight">동량(棟梁)</span>의 뜻은?',
    hint: '마루대들보',
    choices: ['하찮은 존재', '집안이나 나라의 중심 인물', '미미한 역할', '보조 인물'],
    correct: 1,
    koreanLevel: 6,
    explanation: '棟(마루 동) 梁(들보 량) - 마룻대와 들보. 집안이나 나라를 떠받치는 중심 인물',
    example: '예문: 나라의 동량이 될 인재다.'
  },
  {
    word: '동문서답(東問西答)',
    question: '<span class="word-highlight">동문서답(東問西答)</span>의 뜻은?',
    hint: '동쪽을 묻고 서쪽으로 대답',
    choices: ['정확한 대답', '물음과 대답이 맞지 않음', '올바른 응대', '적절한 답변'],
    correct: 1,
    koreanLevel: 6,
    explanation: '東(동녘 동) 問(물을 문) 西(서녘 서) 答(대답 답) - 동쪽을 물었는데 서쪽으로 대답함. 질문과 대답이 맞지 않음',
    example: '예문: 동문서답하지 마라.'
  },
  {
    word: '동병상련(同病相憐)',
    question: '<span class="word-highlight">동병상련(同病相憐)</span>의 뜻은?',
    hint: '같은 병을 가진 자 서로 불쌍히 여김',
    choices: ['경쟁함', '같은 처지끼리 서로 동정함', '무관심함', '적대시함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '同(같을 동) 病(병 병) 相(서로 상) 憐(불쌍히 여길 련) - 같은 병을 앓는 사람끼리 서로 동정함',
    example: '예문: 동병상련의 마음이다.'
  },
  {
    word: '동분서주(東奔西走)',
    question: '<span class="word-highlight">동분서주(東奔西走)</span>의 뜻은?',
    hint: '동쪽으로 뛰고 서쪽으로 달림',
    choices: ['가만히 있음', '사방으로 이리저리 바쁘게 돌아다님', '정지함', '쉬고 있음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '東(동녘 동) 奔(달릴 분) 西(서녘 서) 走(달릴 주) - 동서로 바쁘게 돌아다님',
    example: '예문: 동분서주하느라 정신없다.'
  },
  {
    word: '동상이몽(同床異夢)',
    question: '<span class="word-highlight">동상이몽(同床異夢)</span>의 뜻은?',
    hint: '같은 자리에서 다른 꿈',
    choices: ['같은 생각', '겉으로는 같이 행동하나 속생각은 다름', '일치함', '한마음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '同(같을 동) 床(평상 상) 異(다를 이) 夢(꿈 몽) - 같은 자리에서 다른 꿈을 꿈. 겉은 같으나 속마음이 다름',
    example: '예문: 동상이몽인 관계다.'
  },
  {
    word: '두문불출(杜門不出)',
    question: '<span class="word-highlight">두문불출(杜門不出)</span>의 뜻은?',
    hint: '문을 닫고 나가지 않음',
    choices: ['활발히 활동함', '집에만 있고 밖에 나가지 않음', '자주 외출함', '바쁘게 다님'],
    correct: 1,
    koreanLevel: 6,
    explanation: '杜(막을 두) 門(문 문) 不(아닐 불) 出(날 출) - 문을 닫고 밖에 나가지 않음',
    example: '예문: 두문불출하며 공부했다.'
  },
  {
    word: '득의양양(得意揚揚)',
    question: '<span class="word-highlight">득의양양(得意揚揚)</span>의 뜻은?',
    hint: '뜻을 얻어 의기가 양양함',
    choices: ['침울함', '뜻을 이루어 우쭐함', '슬픔', '낙담함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '得(얻을 득) 意(뜻 의) 揚(날릴 양) 揚(날릴 양) - 뜻을 이루어 기세가 당당하고 자랑스러움',
    example: '예문: 득의양양하게 걸어갔다.'
  },
  {
    word: '등고자비(登高自卑)',
    question: '<span class="word-highlight">등고자비(登高自卑)</span>의 뜻은?',
    hint: '높이 오르려면 낮은 데서부터',
    choices: ['처음부터 높이', '높은 곳에 오르려면 낮은 곳부터 시작', '단번에 성공', '뛰어넘음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '登(오를 등) 高(높을 고) 自(스스로 자) 卑(낮을 비) - 높이 오르려면 낮은 곳부터. 일은 순서대로 해야 함',
    example: '예문: 등고자비의 자세로 임해라.'
  },
  // 301~350번 한자성어
  {
    word: '등화가친(燈火可親)',
    question: '<span class="word-highlight">등화가친(燈火可親)</span>의 뜻은?',
    hint: '등불을 가까이 할 만함',
    choices: ['더운 여름', '독서하기 좋은 가을', '추운 겨울', '꽃피는 봄'],
    correct: 1,
    koreanLevel: 6,
    explanation: '燈(등불 등) 火(불 화) 可(가할 가) 親(친할 친) - 등불을 가까이 할 만함. 독서하기 좋은 가을밤',
    example: '예문: 등화가친의 계절이다.'
  },
  {
    word: '마이동풍(馬耳東風)',
    question: '<span class="word-highlight">마이동풍(馬耳東風)</span>의 뜻은?',
    hint: '말 귀에 동풍',
    choices: ['귀 기울여 들음', '남의 말을 귀담아듣지 않음', '집중함', '이해함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '馬(말 마) 耳(귀 이) 東(동녘 동) 風(바람 풍) - 말의 귀에 동풍. 남의 말을 귀담아듣지 않음',
    example: '예문: 충고가 마이동풍이다.'
  },
  {
    word: '막상막하(莫上莫下)',
    question: '<span class="word-highlight">막상막하(莫上莫下)</span>의 뜻은?',
    hint: '위도 없고 아래도 없음',
    choices: ['큰 차이', '우열을 가릴 수 없음', '확실한 순위', '분명한 등급'],
    correct: 1,
    koreanLevel: 6,
    explanation: '莫(없을 막) 上(위 상) 莫(없을 막) 下(아래 하) - 위도 아래도 없음. 우열을 가릴 수 없이 비슷함',
    example: '예문: 두 선수는 막상막하다.'
  },
  {
    word: '막역지우(莫逆之友)',
    question: '<span class="word-highlight">막역지우(莫逆之友)</span>의 뜻은?',
    hint: '거스름이 없는 벗',
    choices: ['사이가 나쁜 친구', '허물없이 친한 친구', '적', '경쟁자'],
    correct: 1,
    koreanLevel: 6,
    explanation: '莫(없을 막) 逆(거스를 역) 之(갈 지) 友(벗 우) - 서로 거스르는 것이 없는 벗. 허물없이 친한 친구',
    example: '예문: 그는 나의 막역지우다.'
  },
  {
    word: '만경창파(萬頃蒼波)',
    question: '<span class="word-highlight">만경창파(萬頃蒼波)</span>의 뜻은?',
    hint: '만 이랑의 푸른 물결',
    choices: ['작은 연못', '넓고 푸른 바다', '마른 땅', '사막'],
    correct: 1,
    koreanLevel: 6,
    explanation: '萬(일만 만) 頃(이랑 경) 蒼(푸를 창) 波(물결 파) - 끝없이 넓고 푸른 바다',
    example: '예문: 만경창파가 펼쳐졌다.'
  },
  {
    word: '만고불변(萬古不變)',
    question: '<span class="word-highlight">만고불변(萬古不變)</span>의 뜻은?',
    hint: '만고에 변하지 않음',
    choices: ['자주 변함', '영원히 변하지 않음', '수시로 바뀜', '일시적'],
    correct: 1,
    koreanLevel: 6,
    explanation: '萬(일만 만) 古(옛 고) 不(아닐 불) 變(변할 변) - 영원히 변하지 않음',
    example: '예문: 만고불변의 진리다.'
  },
  {
    word: '만사형통(萬事亨通)',
    question: '<span class="word-highlight">만사형통(萬事亨通)</span>의 뜻은?',
    hint: '모든 일이 형통함',
    choices: ['만사가 막힘', '모든 일이 뜻대로 잘됨', '일이 안 풀림', '어려움이 많음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '萬(일만 만) 事(일 사) 亨(형통할 형) 通(통할 통) - 모든 일이 뜻대로 잘됨',
    example: '예문: 새해 만사형통하세요.'
  },
  {
    word: '만시지탄(晩時之歎)',
    question: '<span class="word-highlight">만시지탄(晩時之歎)</span>의 뜻은?',
    hint: '늦은 때의 한탄',
    choices: ['일찍 한 후회', '때가 늦어 안타까움', '미리 대비', '조기 준비'],
    correct: 1,
    koreanLevel: 6,
    explanation: '晩(늦을 만) 時(때 시) 之(갈 지) 歎(탄식할 탄) - 때가 늦어 안타까워하는 탄식',
    example: '예문: 만시지탄이지만 시작하자.'
  },
  {
    word: '만장일치(滿場一致)',
    question: '<span class="word-highlight">만장일치(滿場一致)</span>의 뜻은?',
    hint: '가득 찬 장이 한결같이',
    choices: ['의견 불일치', '모든 사람이 한 의견으로 일치함', '반대 의견', '의견 충돌'],
    correct: 1,
    koreanLevel: 6,
    explanation: '滿(찰 만) 場(마당 장) 一(한 일) 致(이를 치) - 모든 사람이 한 의견으로 일치함',
    example: '예문: 만장일치로 가결되었다.'
  },
  {
    word: '망양보뢰(亡羊補牢)',
    question: '<span class="word-highlight">망양보뢰(亡羊補牢)</span>의 뜻은?',
    hint: '양을 잃고 우리를 고침',
    choices: ['미리 대비', '일을 그르친 뒤 대책을 세움', '예방함', '선수를 침'],
    correct: 1,
    koreanLevel: 6,
    explanation: '亡(잃을 망) 羊(양 양) 補(기울 보) 牢(우리 뢰) - 양을 잃고 나서 우리를 고침. 실패 후 뒤늦게 대책을 세움',
    example: '예문: 망양보뢰라도 해야 한다.'
  },
  {
    word: '맹모삼천(孟母三遷)',
    question: '<span class="word-highlight">맹모삼천(孟母三遷)</span>의 뜻은?',
    hint: '맹자 어머니가 세 번 이사함',
    choices: ['방치함', '자녀 교육을 위해 환경을 가림', '무관심함', '포기함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '孟(맏 맹) 母(어미 모) 三(석 삼) 遷(옮길 천) - 맹자 어머니가 교육을 위해 세 번 이사함. 교육 환경의 중요성',
    example: '예문: 맹모삼천의 정신으로 노력했다.'
  },
  {
    word: '명경지수(明鏡止水)',
    question: '<span class="word-highlight">명경지수(明鏡止水)</span>의 뜻은?',
    hint: '밝은 거울과 멈춘 물',
    choices: ['흐린 마음', '깨끗하고 고요한 마음', '흔들리는 마음', '욕심 많은 마음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '明(밝을 명) 鏡(거울 경) 止(그칠 지) 水(물 수) - 맑은 거울과 고요한 물. 잡념 없이 맑고 고요한 마음',
    example: '예문: 명경지수 같은 마음이다.'
  },
  {
    word: '명명백백(明明白白)',
    question: '<span class="word-highlight">명명백백(明明白白)</span>의 뜻은?',
    hint: '밝고 밝아 환하고 환함',
    choices: ['모호함', '아주 분명하고 뚜렷함', '불확실함', '애매함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '明(밝을 명) 明(밝을 명) 白(흰 백) 白(흰 백) - 아주 분명하고 뚜렷함',
    example: '예문: 명명백백한 사실이다.'
  },
  {
    word: '명불허전(名不虛傳)',
    question: '<span class="word-highlight">명불허전(名不虛傳)</span>의 뜻은?',
    hint: '이름이 헛되이 전해지지 않음',
    choices: ['이름값 못함', '명성이 헛되지 않음', '과대평가됨', '실망스러움'],
    correct: 1,
    koreanLevel: 6,
    explanation: '名(이름 명) 不(아닐 불) 虛(빌 허) 傳(전할 전) - 이름이 헛되이 전해지지 않음. 명성대로 훌륭함',
    example: '예문: 명불허전이로다.'
  },
  {
    word: '명약관화(明若觀火)',
    question: '<span class="word-highlight">명약관화(明若觀火)</span>의 뜻은?',
    hint: '불을 보듯 밝음',
    choices: ['불분명함', '불을 보듯 뻔함', '모호함', '알 수 없음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '明(밝을 명) 若(같을 약) 觀(볼 관) 火(불 화) - 불을 보는 것처럼 분명함',
    example: '예문: 그 결과는 명약관화하다.'
  },
  {
    word: '명재경각(命在頃刻)',
    question: '<span class="word-highlight">명재경각(命在頃刻)</span>의 뜻은?',
    hint: '목숨이 잠깐 사이에 있음',
    choices: ['안전함', '목숨이 경각에 달림', '건강함', '튼튼함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '命(목숨 명) 在(있을 재) 頃(잠깐 경) 刻(새길 각) - 목숨이 금방이라도 끊어질 위태로운 상태',
    example: '예문: 명재경각의 위기다.'
  },
  {
    word: '모순(矛盾)',
    question: '<span class="word-highlight">모순(矛盾)</span>의 뜻은?',
    hint: '창과 방패',
    choices: ['일치함', '앞뒤가 맞지 않음', '조화로움', '어울림'],
    correct: 1,
    koreanLevel: 6,
    explanation: '矛(창 모) 盾(방패 순) - 창과 방패. 말이나 행동의 앞뒤가 맞지 않음',
    example: '예문: 그의 말에는 모순이 있다.'
  },
  {
    word: '목불인견(目不忍見)',
    question: '<span class="word-highlight">목불인견(目不忍見)</span>의 뜻은?',
    hint: '눈이 차마 볼 수 없음',
    choices: ['보기 좋음', '차마 눈 뜨고 볼 수 없음', '아름다움', '보기 편함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '目(눈 목) 不(아닐 불) 忍(참을 인) 見(볼 견) - 눈으로 차마 볼 수 없을 정도로 비참함',
    example: '예문: 목불인견의 참상이다.'
  },
  {
    word: '무릉도원(武陵桃源)',
    question: '<span class="word-highlight">무릉도원(武陵桃源)</span>의 뜻은?',
    hint: '무릉의 복숭아꽃 동산',
    choices: ['지옥', '이상적인 별천지', '황량한 곳', '위험한 곳'],
    correct: 1,
    koreanLevel: 6,
    explanation: '武(호반 무) 陵(언덕 릉) 桃(복숭아 도) 源(근원 원) - 속세를 떠난 이상적인 별천지',
    example: '예문: 무릉도원 같은 곳이다.'
  },
  {
    word: '무사안일(無事安逸)',
    question: '<span class="word-highlight">무사안일(無事安逸)</span>의 뜻은?',
    hint: '일 없이 편안함',
    choices: ['적극적', '아무 일 없이 편하게 지냄', '열심히 함', '바쁘게 지냄'],
    correct: 1,
    koreanLevel: 6,
    explanation: '無(없을 무) 事(일 사) 安(편안 안) 逸(편안할 일) - 아무 일 없이 편안하게 지내려 함. 소극적 태도',
    example: '예문: 무사안일에 빠졌다.'
  },
  {
    word: '무아지경(無我之境)',
    question: '<span class="word-highlight">무아지경(無我之境)</span>의 뜻은?',
    hint: '나를 잊은 경지',
    choices: ['정신이 맑음', '자신을 잊고 몰두한 경지', '각성함', '깨어 있음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '無(없을 무) 我(나 아) 之(갈 지) 境(지경 경) - 자기를 잊고 완전히 몰두한 경지',
    example: '예문: 무아지경에 빠졌다.'
  },
  {
    word: '무용지물(無用之物)',
    question: '<span class="word-highlight">무용지물(無用之物)</span>의 뜻은?',
    hint: '쓸모없는 물건',
    choices: ['유용함', '아무 쓸모없는 것', '필요함', '가치 있음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '無(없을 무) 用(쓸 용) 之(갈 지) 物(물건 물) - 아무 쓸모없는 물건이나 사람',
    example: '예문: 그것은 무용지물이다.'
  },
  {
    word: '무위도식(無爲徒食)',
    question: '<span class="word-highlight">무위도식(無爲徒食)</span>의 뜻은?',
    hint: '하는 일 없이 헛되이 먹음',
    choices: ['열심히 일함', '하는 일 없이 놀고먹음', '노력함', '성실함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '無(없을 무) 爲(할 위) 徒(헛될 도) 食(먹을 식) - 하는 일 없이 놀고먹음',
    example: '예문: 무위도식하면 안 된다.'
  },
  {
    word: '문경지교(刎頸之交)',
    question: '<span class="word-highlight">문경지교(刎頸之交)</span>의 뜻은?',
    hint: '목을 벨 수 있는 사귐',
    choices: ['피상적 관계', '목숨을 내놓을 수 있는 사이', '적대 관계', '경쟁 관계'],
    correct: 1,
    koreanLevel: 6,
    explanation: '刎(벨 문) 頸(목 경) 之(갈 지) 交(사귈 교) - 목을 베어 줄 수 있을 정도의 친한 사이',
    example: '예문: 문경지교를 맺었다.'
  },
  {
    word: '문외한(門外漢)',
    question: '<span class="word-highlight">문외한(門外漢)</span>의 뜻은?',
    hint: '문 밖의 사람',
    choices: ['전문가', '어떤 분야에 지식이 없는 사람', '박사', '권위자'],
    correct: 1,
    koreanLevel: 6,
    explanation: '門(문 문) 外(바깥 외) 漢(한나라 한) - 문밖에 있는 사람. 어떤 분야에 지식이 없는 사람',
    example: '예문: 나는 그 분야에 문외한이다.'
  },
  {
    word: '문일지십(聞一知十)',
    question: '<span class="word-highlight">문일지십(聞一知十)</span>의 뜻은?',
    hint: '하나를 들으면 열을 앎',
    choices: ['이해가 느림', '매우 총명함', '어리석음', '무지함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '聞(들을 문) 一(한 일) 知(알 지) 十(열 십) - 하나를 들으면 열을 앎. 매우 총명함',
    example: '예문: 문일지십의 재주가 있다.'
  },
  {
    word: '문전성시(門前成市)',
    question: '<span class="word-highlight">문전성시(門前成市)</span>의 뜻은?',
    hint: '문 앞이 시장을 이룸',
    choices: ['한산함', '찾는 사람이 많아 북적임', '적막함', '조용함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '門(문 문) 前(앞 전) 成(이룰 성) 市(저자 시) - 문 앞이 시장처럼 북적임. 찾는 사람이 많음',
    example: '예문: 문전성시를 이루었다.'
  },
  {
    word: '미봉책(彌縫策)',
    question: '<span class="word-highlight">미봉책(彌縫策)</span>의 뜻은?',
    hint: '꿰매어 막는 방책',
    choices: ['근본 해결책', '임시로 겉만 꾸미는 대책', '완전한 해결', '영구적 방안'],
    correct: 1,
    koreanLevel: 6,
    explanation: '彌(미칠 미) 縫(꿰맬 봉) 策(꾀 책) - 임시로 겉만 꾸미는 수습책',
    example: '예문: 미봉책에 불과하다.'
  },
  {
    word: '미풍양속(美風良俗)',
    question: '<span class="word-highlight">미풍양속(美風良俗)</span>의 뜻은?',
    hint: '아름다운 풍습 좋은 풍속',
    choices: ['나쁜 습관', '아름답고 좋은 풍속', '악습', '폐단'],
    correct: 1,
    koreanLevel: 6,
    explanation: '美(아름다울 미) 風(바람 풍) 良(좋을 양) 俗(풍속 속) - 아름답고 좋은 풍속',
    example: '예문: 미풍양속을 지키자.'
  },
  {
    word: '박람강기(博覽强記)',
    question: '<span class="word-highlight">박람강기(博覽强記)</span>의 뜻은?',
    hint: '널리 보고 굳세게 기억함',
    choices: ['무식함', '널리 읽고 잘 기억함', '좁은 지식', '망각함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '博(넓을 박) 覽(볼 람) 强(강할 강) 記(기억할 기) - 책을 많이 읽고 기억력이 좋음',
    example: '예문: 박람강기한 학자다.'
  },
  {
    word: '박장대소(拍掌大笑)',
    question: '<span class="word-highlight">박장대소(拍掌大笑)</span>의 뜻은?',
    hint: '손뼉 치며 크게 웃음',
    choices: ['울음', '손뼉을 치며 크게 웃음', '슬픔', '한탄'],
    correct: 1,
    koreanLevel: 6,
    explanation: '拍(칠 박) 掌(손바닥 장) 大(큰 대) 笑(웃을 소) - 손뼉을 치며 크게 웃음',
    example: '예문: 박장대소했다.'
  },
  {
    word: '반근착절(盤根錯節)',
    question: '<span class="word-highlight">반근착절(盤根錯節)</span>의 뜻은?',
    hint: '서린 뿌리와 엉킨 마디',
    choices: ['쉬운 일', '복잡하게 얽힌 어려운 일', '단순함', '간단함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '盤(소반 반) 根(뿌리 근) 錯(섞일 착) 節(마디 절) - 뿌리와 마디가 얽힘. 복잡하게 얽힌 어려운 일',
    example: '예문: 반근착절의 문제다.'
  },
  {
    word: '반면교사(反面敎師)',
    question: '<span class="word-highlight">반면교사(反面敎師)</span>의 뜻은?',
    hint: '반대 면의 스승',
    choices: ['좋은 본보기', '나쁜 일에서 교훈을 얻는 것', '모범', '이상'],
    correct: 1,
    koreanLevel: 6,
    explanation: '反(돌이킬 반) 面(얼굴 면) 敎(가르칠 교) 師(스승 사) - 잘못된 사례를 보고 교훈을 얻음',
    example: '예문: 그의 실패를 반면교사로 삼았다.'
  },
  {
    word: '반신반의(半信半疑)',
    question: '<span class="word-highlight">반신반의(半信半疑)</span>의 뜻은?',
    hint: '반은 믿고 반은 의심함',
    choices: ['완전히 믿음', '반쯤 믿고 반쯤 의심함', '전혀 안 믿음', '확신함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '半(반 반) 信(믿을 신) 半(반 반) 疑(의심할 의) - 반쯤 믿고 반쯤 의심함',
    example: '예문: 반신반의하며 들었다.'
  },
  {
    word: '발본색원(拔本塞源)',
    question: '<span class="word-highlight">발본색원(拔本塞源)</span>의 뜻은?',
    hint: '근본을 뽑고 근원을 막음',
    choices: ['표면적 해결', '나쁜 것의 근본을 없앰', '임시 조치', '겉치레'],
    correct: 1,
    koreanLevel: 6,
    explanation: '拔(뽑을 발) 本(근본 본) 塞(막을 색) 源(근원 원) - 폐단의 근본을 뽑고 근원을 막음. 근본적으로 해결함',
    example: '예문: 발본색원하여 해결했다.'
  },
  {
    word: '방약무인(傍若無人)',
    question: '<span class="word-highlight">방약무인(傍若無人)</span>의 뜻은?',
    hint: '곁에 사람이 없는 듯함',
    choices: ['겸손함', '주위에 사람이 없는 것처럼 제멋대로 행동함', '배려함', '조심함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '傍(곁 방) 若(같을 약) 無(없을 무) 人(사람 인) - 곁에 사람이 없는 것처럼 제멋대로 행동함',
    example: '예문: 방약무인하게 굴었다.'
  },
  {
    word: '배수진(背水陣)',
    question: '<span class="word-highlight">배수진(背水陣)</span>의 뜻은?',
    hint: '물을 등지고 친 진',
    choices: ['안전한 위치', '물러날 곳 없이 결사적으로 싸움', '유리한 위치', '안전 확보'],
    correct: 1,
    koreanLevel: 6,
    explanation: '背(등 배) 水(물 수) 陣(진 칠 진) - 물을 등지고 진을 침. 물러설 수 없는 결사적인 싸움',
    example: '예문: 배수진을 치고 덤볐다.'
  },
  {
    word: '배은망덕(背恩忘德)',
    question: '<span class="word-highlight">배은망덕(背恩忘德)</span>의 뜻은?',
    hint: '은혜를 배반하고 덕을 잊음',
    choices: ['은혜를 갚음', '은혜를 저버리고 도리어 해침', '감사함', '보답함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '背(등 배) 恩(은혜 은) 忘(잊을 망) 德(덕 덕) - 입은 은혜를 저버리고 도리어 해를 끼침',
    example: '예문: 배은망덕한 사람이다.'
  },
  {
    word: '백골난망(白骨難忘)',
    question: '<span class="word-highlight">백골난망(白骨難忘)</span>의 뜻은?',
    hint: '뼈가 희어져도 잊기 어려움',
    choices: ['쉽게 잊음', '죽어도 은혜를 잊지 못함', '무관심', '망각함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '白(흰 백) 骨(뼈 골) 難(어려울 난) 忘(잊을 망) - 죽어 뼈가 희어져도 잊지 못함. 은혜를 깊이 감사함',
    example: '예문: 백골난망의 은혜입니다.'
  },
  {
    word: '백년대계(百年大計)',
    question: '<span class="word-highlight">백년대계(百年大計)</span>의 뜻은?',
    hint: '백 년의 큰 계획',
    choices: ['단기 계획', '먼 앞날을 내다보는 큰 계획', '임시 방편', '즉흥적 계획'],
    correct: 1,
    koreanLevel: 6,
    explanation: '百(일백 백) 年(해 년) 大(큰 대) 計(셀 계) - 백 년 앞을 내다보는 큰 계획',
    example: '예문: 교육은 백년대계다.'
  },
  {
    word: '백년해로(百年偕老)',
    question: '<span class="word-highlight">백년해로(百年偕老)</span>의 뜻은?',
    hint: '백 년을 함께 늙음',
    choices: ['이별', '부부가 평생 함께 사는 것', '독신', '별거'],
    correct: 1,
    koreanLevel: 6,
    explanation: '百(일백 백) 年(해 년) 偕(함께 해) 老(늙을 로) - 부부가 평생을 함께 해로함',
    example: '예문: 백년해로하세요.'
  },
  {
    word: '백문불여일견(百聞不如一見)',
    question: '<span class="word-highlight">백문불여일견(百聞不如一見)</span>의 뜻은?',
    hint: '백 번 듣는 것이 한 번 봄만 못함',
    choices: ['듣는 것이 최고', '백 번 듣는 것이 한 번 보는 것만 못함', '보는 것이 해롭', '듣는 것이 좋음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '百(일백 백) 聞(들을 문) 不(아닐 불) 如(같을 여) 一(한 일) 見(볼 견) - 백 번 듣는 것보다 한 번 보는 것이 나음',
    example: '예문: 백문불여일견이라 직접 가 보자.'
  },
  {
    word: '백발백중(百發百中)',
    question: '<span class="word-highlight">백발백중(百發百中)</span>의 뜻은?',
    hint: '백 번 쏘아 백 번 맞춤',
    choices: ['실패함', '모두 명중함', '빗나감', '실수함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '百(일백 백) 發(쏠 발) 百(일백 백) 中(맞힐 중) - 백 번 쏘면 백 번 맞힘. 정확히 들어맞음',
    example: '예문: 그의 예측은 백발백중이다.'
  },
  {
    word: '백수건달(白手乾達)',
    question: '<span class="word-highlight">백수건달(白手乾達)</span>의 뜻은?',
    hint: '빈손의 건달',
    choices: ['부자', '직업 없이 빈둥거리는 사람', '성실한 사람', '근면한 사람'],
    correct: 1,
    koreanLevel: 6,
    explanation: '白(흰 백) 手(손 수) 乾(마를 건) 達(통달할 달) - 하는 일 없이 빈둥거리는 사람',
    example: '예문: 백수건달이 되면 안 된다.'
  },
  {
    word: '백안시(白眼視)',
    question: '<span class="word-highlight">백안시(白眼視)</span>의 뜻은?',
    hint: '흰 눈으로 봄',
    choices: ['호의를 보임', '차갑게 대함', '친절함', '환대함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '白(흰 백) 眼(눈 안) 視(볼 시) - 흰 눈으로 봄. 무시하거나 냉대함',
    example: '예문: 백안시하며 대했다.'
  },
  {
    word: '백의종군(白衣從軍)',
    question: '<span class="word-highlight">백의종군(白衣從軍)</span>의 뜻은?',
    hint: '흰 옷 입고 군대를 따름',
    choices: ['장군으로 출정', '관직 없이 전쟁에 참가함', '병사로 입대', '의사로 종군'],
    correct: 1,
    koreanLevel: 6,
    explanation: '白(흰 백) 衣(옷 의) 從(좇을 종) 軍(군사 군) - 벼슬을 잃고 평복 차림으로 종군함',
    example: '예문: 백의종군하여 공을 세웠다.'
  },
  // 351~400번 한자성어
  {
    word: '백전노장(百戰老將)',
    question: '<span class="word-highlight">백전노장(百戰老將)</span>의 뜻은?',
    hint: '백 번 싸운 늙은 장수',
    choices: ['경험 없는 사람', '오랜 경험이 있는 노련한 사람', '초보자', '신참'],
    correct: 1,
    koreanLevel: 6,
    explanation: '百(일백 백) 戰(싸움 전) 老(늙을 로) 將(장수 장) - 수많은 싸움을 겪은 노련한 장수',
    example: '예문: 그는 이 분야의 백전노장이다.'
  },
  {
    word: '백전백승(百戰百勝)',
    question: '<span class="word-highlight">백전백승(百戰百勝)</span>의 뜻은?',
    hint: '백 번 싸워 백 번 이김',
    choices: ['항상 패함', '싸울 때마다 이김', '지기도 함', '반반 승률'],
    correct: 1,
    koreanLevel: 6,
    explanation: '百(일백 백) 戰(싸움 전) 百(일백 백) 勝(이길 승) - 싸울 때마다 모두 이김',
    example: '예문: 백전백승의 기록을 세웠다.'
  },
  {
    word: '백중지세(伯仲之勢)',
    question: '<span class="word-highlight">백중지세(伯仲之勢)</span>의 뜻은?',
    hint: '형과 아우 같은 형세',
    choices: ['큰 차이', '우열을 가리기 어려운 형세', '분명한 승부', '확실한 차이'],
    correct: 1,
    koreanLevel: 6,
    explanation: '伯(맏 백) 仲(버금 중) 之(갈 지) 勢(형세 세) - 형과 아우처럼 우열을 가리기 어려움',
    example: '예문: 백중지세로 경쟁했다.'
  },
  {
    word: '백척간두(百尺竿頭)',
    question: '<span class="word-highlight">백척간두(百尺竿頭)</span>의 뜻은?',
    hint: '백 척 장대 끝',
    choices: ['안전함', '매우 위태로운 상황', '편안함', '여유로움'],
    correct: 1,
    koreanLevel: 6,
    explanation: '百(일백 백) 尺(자 척) 竿(장대 간) 頭(머리 두) - 백 척 장대 끝. 매우 위태롭거나 아슬아슬한 지경',
    example: '예문: 백척간두에서 살아남았다.'
  },
  {
    word: '백팔번뇌(百八煩惱)',
    question: '<span class="word-highlight">백팔번뇌(百八煩惱)</span>의 뜻은?',
    hint: '백팔 가지 번뇌',
    choices: ['깨달음', '인간이 가진 많은 번뇌', '평온함', '해탈'],
    correct: 1,
    koreanLevel: 6,
    explanation: '百(일백 백) 八(여덟 팔) 煩(번거로울 번) 惱(괴로울 뇌) - 불교에서 말하는 108가지 번뇌',
    example: '예문: 백팔번뇌를 떨쳐 버리고 싶다.'
  },
  {
    word: '변화무쌍(變化無雙)',
    question: '<span class="word-highlight">변화무쌍(變化無雙)</span>의 뜻은?',
    hint: '변화가 짝이 없음',
    choices: ['변함없음', '변화가 헤아릴 수 없이 많음', '일정함', '한결같음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '變(변할 변) 化(될 화) 無(없을 무) 雙(쌍 쌍) - 변화가 매우 많아 짐작할 수 없음',
    example: '예문: 변화무쌍한 날씨다.'
  },
  {
    word: '별유천지(別有天地)',
    question: '<span class="word-highlight">별유천지(別有天地)</span>의 뜻은?',
    hint: '따로 하늘과 땅이 있음',
    choices: ['같은 세상', '속세와 다른 별천지', '평범한 곳', '흔한 장소'],
    correct: 1,
    koreanLevel: 6,
    explanation: '別(다를 별) 有(있을 유) 天(하늘 천) 地(땅 지) - 따로 하늘과 땅이 있음. 속세와 다른 별천지',
    example: '예문: 별유천지가 있는 것 같다.'
  },
  {
    word: '병입고황(病入膏肓)',
    question: '<span class="word-highlight">병입고황(病入膏肓)</span>의 뜻은?',
    hint: '병이 고황에 들어감',
    choices: ['쉽게 나음', '병이 깊어 고칠 수 없음', '건강함', '회복됨'],
    correct: 1,
    koreanLevel: 6,
    explanation: '病(병 병) 入(들 입) 膏(기름 고) 肓(명치 황) - 병이 고황에 들어감. 병이 깊어 고칠 수 없음',
    example: '예문: 병입고황이라 손쓸 방법이 없다.'
  },
  {
    word: '부귀영화(富貴榮華)',
    question: '<span class="word-highlight">부귀영화(富貴榮華)</span>의 뜻은?',
    hint: '부유하고 귀하며 영화로움',
    choices: ['가난함', '재산이 많고 지위가 높아 번영함', '비천함', '보잘것없음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '富(부유할 부) 貴(귀할 귀) 榮(영화로울 영) 華(빛날 화) - 재산이 많고 지위가 높아 번영함',
    example: '예문: 부귀영화를 누렸다.'
  },
  {
    word: '부부유별(夫婦有別)',
    question: '<span class="word-highlight">부부유별(夫婦有別)</span>의 뜻은?',
    hint: '부부에 구별이 있음',
    choices: ['평등함', '부부 사이에 구별과 역할이 있음', '같음', '차별 없음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '夫(지아비 부) 婦(며느리 부) 有(있을 유) 別(다를 별) - 부부 사이에 구별과 역할이 있음. 오륜의 하나',
    example: '예문: 부부유별을 지켰다.'
  },
  {
    word: '부전자전(父傳子傳)',
    question: '<span class="word-highlight">부전자전(父傳子傳)</span>의 뜻은?',
    hint: '아버지가 전하고 아들이 전함',
    choices: ['새롭게 시작', '대대로 전함', '단절됨', '처음부터 시작'],
    correct: 1,
    koreanLevel: 6,
    explanation: '父(아비 부) 傳(전할 전) 子(아들 자) 傳(전할 전) - 아버지가 아들에게 대대로 전함',
    example: '예문: 부전자전의 기술이다.'
  },
  {
    word: '부지기수(不知其數)',
    question: '<span class="word-highlight">부지기수(不知其數)</span>의 뜻은?',
    hint: '그 수를 알지 못함',
    choices: ['셀 수 있음', '그 수를 헤아릴 수 없음', '적음', '한정됨'],
    correct: 1,
    koreanLevel: 6,
    explanation: '不(아닐 불) 知(알 지) 其(그 기) 數(셀 수) - 그 수를 헤아릴 수 없을 만큼 많음',
    example: '예문: 부지기수로 많다.'
  },
  {
    word: '부창부수(夫唱婦隨)',
    question: '<span class="word-highlight">부창부수(夫唱婦隨)</span>의 뜻은?',
    hint: '남편이 부르고 아내가 따름',
    choices: ['불화', '부부가 화합함', '갈등', '다툼'],
    correct: 1,
    koreanLevel: 6,
    explanation: '夫(지아비 부) 唱(부를 창) 婦(며느리 부) 隨(따를 수) - 남편이 부르면 아내가 따름. 부부가 화합함',
    example: '예문: 부창부수하는 부부다.'
  },
  {
    word: '부화뇌동(附和雷同)',
    question: '<span class="word-highlight">부화뇌동(附和雷同)</span>의 뜻은?',
    hint: '붙어서 화하고 우레처럼 같이함',
    choices: ['독자적 행동', '주관 없이 남을 따라감', '독립적', '자주적'],
    correct: 1,
    koreanLevel: 6,
    explanation: '附(붙을 부) 和(화할 화) 雷(우레 뢰) 同(같을 동) - 자기 주관 없이 남의 의견에 따라 움직임',
    example: '예문: 부화뇌동하지 마라.'
  },
  {
    word: '북창삼우(北窓三友)',
    question: '<span class="word-highlight">북창삼우(北窓三友)</span>의 뜻은?',
    hint: '북쪽 창의 세 친구',
    choices: ['나쁜 친구', '거문고, 술, 시를 이르는 말', '적', '경쟁자'],
    correct: 1,
    koreanLevel: 6,
    explanation: '北(북녘 북) 窓(창 창) 三(석 삼) 友(벗 우) - 북쪽 창가의 세 친구. 거문고, 술, 시를 이름',
    example: '예문: 북창삼우를 벗 삼았다.'
  },
  {
    word: '분골쇄신(粉骨碎身)',
    question: '<span class="word-highlight">분골쇄신(粉骨碎身)</span>의 뜻은?',
    hint: '뼈를 가루 내고 몸을 부숨',
    choices: ['편하게 지냄', '온 힘을 다하여 노력함', '나태함', '게으름'],
    correct: 1,
    koreanLevel: 6,
    explanation: '粉(가루 분) 骨(뼈 골) 碎(부술 쇄) 身(몸 신) - 뼈를 가루 내고 몸을 부숨. 있는 힘을 다해 노력함',
    example: '예문: 분골쇄신의 각오로 임했다.'
  },
  {
    word: '불가사의(不可思議)',
    question: '<span class="word-highlight">불가사의(不可思議)</span>의 뜻은?',
    hint: '생각하고 논의할 수 없음',
    choices: ['분명함', '생각으로 헤아릴 수 없이 신기함', '당연함', '예상 가능함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '不(아닐 불) 可(가할 가) 思(생각 사) 議(의논할 의) - 생각으로 헤아릴 수 없이 이상하고 신기함',
    example: '예문: 불가사의한 일이다.'
  },
  {
    word: '불가항력(不可抗力)',
    question: '<span class="word-highlight">불가항력(不可抗力)</span>의 뜻은?',
    hint: '거스를 수 없는 힘',
    choices: ['막을 수 있음', '인력으로 어쩔 수 없는 힘', '통제 가능', '지배 가능'],
    correct: 1,
    koreanLevel: 6,
    explanation: '不(아닐 불) 可(가할 가) 抗(막을 항) 力(힘 력) - 사람의 힘으로는 어쩔 수 없는 힘',
    example: '예문: 불가항력으로 취소되었다.'
  },
  {
    word: '불구대천(不俱戴天)',
    question: '<span class="word-highlight">불구대천(不俱戴天)</span>의 뜻은?',
    hint: '함께 하늘을 이지 않음',
    choices: ['화해함', '같은 하늘 아래 살 수 없는 원수', '친함', '사이좋음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '不(아닐 불) 俱(함께 구) 戴(일 대) 天(하늘 천) - 함께 하늘을 이지 못함. 죽여야 할 원수',
    example: '예문: 불구대천의 원수다.'
  },
  {
    word: '불립문자(不立文字)',
    question: '<span class="word-highlight">불립문자(不立文字)</span>의 뜻은?',
    hint: '문자를 세우지 않음',
    choices: ['문자에 의존함', '문자나 말에 의지하지 않고 마음으로 전함', '기록을 중시', '글로만 전함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '不(아닐 불) 立(설 립) 文(글월 문) 字(글자 자) - 문자를 세우지 않음. 마음에서 마음으로 전함',
    example: '예문: 불립문자의 가르침이다.'
  },
  {
    word: '불문곡직(不問曲直)',
    question: '<span class="word-highlight">불문곡직(不問曲直)</span>의 뜻은?',
    hint: '굽고 곧음을 묻지 않음',
    choices: ['따져봄', '옳고 그름을 가리지 않음', '분별함', '판단함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '不(아닐 불) 問(물을 문) 曲(굽을 곡) 直(곧을 직) - 옳고 그름을 따지지 않음',
    example: '예문: 불문곡직하고 혼냈다.'
  },
  {
    word: '불승불의(不勝佛意)',
    question: '<span class="word-highlight">불승불의(不勝佛意)</span>의 뜻은?',
    hint: '뜻을 이기지 못함',
    choices: ['승낙함', '강권에 못 이겨 마지못해 따름', '거절함', '반대함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '不(아닐 불) 勝(이길 승) 佛(아닐 불) 意(뜻 의) - 뜻을 이기지 못함. 마지못해 따름',
    example: '예문: 불승불의로 응했다.'
  },
  {
    word: '불철주야(不撤晝夜)',
    question: '<span class="word-highlight">불철주야(不撤晝夜)</span>의 뜻은?',
    hint: '낮밤을 거두지 않음',
    choices: ['낮에만 일함', '밤낮을 가리지 않고 계속함', '밤에만 일함', '쉬어가며 함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '不(아닐 불) 撤(걷을 철) 晝(낮 주) 夜(밤 야) - 낮밤을 가리지 않고 계속함',
    example: '예문: 불철주야 노력했다.'
  },
  {
    word: '불치하문(不恥下問)',
    question: '<span class="word-highlight">불치하문(不恥下問)</span>의 뜻은?',
    hint: '아래에 묻는 것을 부끄러워하지 않음',
    choices: ['교만함', '아랫사람에게 묻는 것을 부끄러워하지 않음', '거만함', '무시함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '不(아닐 불) 恥(부끄러울 치) 下(아래 하) 問(물을 문) - 아랫사람에게 묻는 것을 부끄러워하지 않음',
    example: '예문: 불치하문의 자세로 배웠다.'
  },
  {
    word: '불편부당(不偏不黨)',
    question: '<span class="word-highlight">불편부당(不偏不黨)</span>의 뜻은?',
    hint: '치우치지도 않고 편들지도 않음',
    choices: ['편파적', '어느 쪽에도 치우치지 않음', '한쪽 편임', '편들음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '不(아닐 불) 偏(치우칠 편) 不(아닐 불) 黨(무리 당) - 어느 쪽에도 치우치거나 편들지 않음. 공정함',
    example: '예문: 불편부당하게 판단했다.'
  },
  {
    word: '비몽사몽(非夢似夢)',
    question: '<span class="word-highlight">비몽사몽(非夢似夢)</span>의 뜻은?',
    hint: '꿈이 아닌 듯 꿈인 듯',
    choices: ['완전히 깨어 있음', '잠이 덜 깬 어렴풋한 상태', '깊은 잠', '정신이 또렷함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '非(아닐 비) 夢(꿈 몽) 似(같을 사) 夢(꿈 몽) - 꿈인지 생시인지 모르는 어렴풋한 상태',
    example: '예문: 비몽사몽간에 들었다.'
  },
  {
    word: '비일비재(非一非再)',
    question: '<span class="word-highlight">비일비재(非一非再)</span>의 뜻은?',
    hint: '한 번이 아니고 두 번이 아님',
    choices: ['드묾', '한두 번이 아님', '처음', '희귀함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '非(아닐 비) 一(한 일) 非(아닐 비) 再(두 재) - 한두 번이 아님. 여러 번임',
    example: '예문: 그런 일이 비일비재하다.'
  },
  {
    word: '빙산일각(氷山一角)',
    question: '<span class="word-highlight">빙산일각(氷山一角)</span>의 뜻은?',
    hint: '빙산의 한 모퉁이',
    choices: ['전체', '드러난 것은 일부분에 불과함', '전부 보임', '완전히 드러남'],
    correct: 1,
    koreanLevel: 6,
    explanation: '氷(얼음 빙) 山(뫼 산) 一(한 일) 角(모 각) - 빙산의 한 모퉁이. 드러난 것은 극히 일부분',
    example: '예문: 이것은 빙산일각에 불과하다.'
  },
  {
    word: '사고무친(四顧無親)',
    question: '<span class="word-highlight">사고무친(四顧無親)</span>의 뜻은?',
    hint: '사방을 돌아봐도 친한 이가 없음',
    choices: ['친척이 많음', '의지할 곳이 없음', '벗이 많음', '도움이 많음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '四(넉 사) 顧(돌아볼 고) 無(없을 무) 親(친할 친) - 사방을 둘러봐도 친한 사람이 없음. 고립무원',
    example: '예문: 사고무친의 처지다.'
  },
  {
    word: '사기충천(士氣衝天)',
    question: '<span class="word-highlight">사기충천(士氣衝天)</span>의 뜻은?',
    hint: '선비의 기세가 하늘을 찌름',
    choices: ['기가 죽음', '사기가 하늘을 찌르듯 높음', '의기소침', '기운 없음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '士(선비 사) 氣(기운 기) 衝(찌를 충) 天(하늘 천) - 사기가 하늘을 찌르듯 높음',
    example: '예문: 사기충천하여 출전했다.'
  },
  {
    word: '사면초가(四面楚歌)',
    question: '<span class="word-highlight">사면초가(四面楚歌)</span>의 뜻은?',
    hint: '사방이 초나라 노래',
    choices: ['도움이 많음', '사방이 적에게 둘러싸임', '협력함', '지원 받음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '四(넉 사) 面(얼굴 면) 楚(초나라 초) 歌(노래 가) - 사방에서 초나라 노래가 들림. 사방이 적에게 둘러싸임',
    example: '예문: 사면초가에 빠졌다.'
  },
  {
    word: '사상누각(沙上樓閣)',
    question: '<span class="word-highlight">사상누각(沙上樓閣)</span>의 뜻은?',
    hint: '모래 위의 누각',
    choices: ['튼튼함', '기초가 없어 오래 못 갈 것', '견고함', '안정적'],
    correct: 1,
    koreanLevel: 6,
    explanation: '沙(모래 사) 上(위 상) 樓(다락 루) 閣(집 각) - 모래 위에 지은 누각. 기초가 튼튼하지 못하여 오래가지 못함',
    example: '예문: 그 계획은 사상누각이다.'
  },
  {
    word: '사생결단(死生決斷)',
    question: '<span class="word-highlight">사생결단(死生決斷)</span>의 뜻은?',
    hint: '죽고 사는 것을 결단함',
    choices: ['망설임', '죽기를 각오하고 결심함', '주저함', '미룸'],
    correct: 1,
    koreanLevel: 6,
    explanation: '死(죽을 사) 生(날 생) 決(결단할 결) 斷(끊을 단) - 죽고 사는 것을 결단함. 목숨을 걸고 결심함',
    example: '예문: 사생결단의 각오로 나섰다.'
  },
  {
    word: '사생취의(捨生取義)',
    question: '<span class="word-highlight">사생취의(捨生取義)</span>의 뜻은?',
    hint: '삶을 버리고 의를 취함',
    choices: ['목숨을 아낌', '목숨을 버리고 의리를 지킴', '이익을 좇음', '편안함을 추구'],
    correct: 1,
    koreanLevel: 6,
    explanation: '捨(버릴 사) 生(날 생) 取(취할 취) 義(옳을 의) - 목숨을 버리고 의리를 지킴',
    example: '예문: 사생취의의 정신이다.'
  },
  {
    word: '사서삼경(四書三經)',
    question: '<span class="word-highlight">사서삼경(四書三經)</span>의 뜻은?',
    hint: '네 책과 세 경전',
    choices: ['서양 서적', '유교의 주요 경전', '불교 서적', '소설'],
    correct: 1,
    koreanLevel: 6,
    explanation: '四(넉 사) 書(글 서) 三(석 삼) 經(경전 경) - 유교의 네 책(논어, 맹자, 대학, 중용)과 세 경전(시경, 서경, 역경)',
    example: '예문: 사서삼경을 공부했다.'
  },
  {
    word: '사숙(私淑)',
    question: '<span class="word-highlight">사숙(私淑)</span>의 뜻은?',
    hint: '사사로이 착함을 배움',
    choices: ['직접 배움', '직접 가르침을 받지 않고 스스로 본받음', '스승과 제자', '정식 교육'],
    correct: 1,
    koreanLevel: 6,
    explanation: '私(사사로울 사) 淑(맑을 숙) - 직접 배우지 않고 그 사람을 스승처럼 본받음',
    example: '예문: 그분을 사숙했다.'
  },
  {
    word: '사이비(似而非)',
    question: '<span class="word-highlight">사이비(似而非)</span>의 뜻은?',
    hint: '비슷하나 아닌 것',
    choices: ['진짜', '겉은 비슷하나 본질이 다름', '진품', '정통'],
    correct: 1,
    koreanLevel: 6,
    explanation: '似(닮을 사) 而(말이을 이) 非(아닐 비) - 비슷하나 아닌 것. 겉만 그럴듯한 가짜',
    example: '예문: 사이비 종교를 조심해라.'
  },
  {
    word: '사자성어(四字成語)',
    question: '<span class="word-highlight">사자성어(四字成語)</span>의 뜻은?',
    hint: '네 글자로 이루어진 말',
    choices: ['긴 문장', '네 글자로 된 관용구', '짧은 문장', '두 글자 말'],
    correct: 1,
    koreanLevel: 6,
    explanation: '四(넉 사) 字(글자 자) 成(이룰 성) 語(말씀 어) - 네 글자로 이루어진 관용적인 말',
    example: '예문: 사자성어를 외웠다.'
  },
  {
    word: '사족(蛇足)',
    question: '<span class="word-highlight">사족(蛇足)</span>의 뜻은?',
    hint: '뱀의 다리',
    choices: ['필요한 것', '쓸데없이 덧붙인 것', '꼭 필요함', '중요함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '蛇(뱀 사) 足(발 족) - 뱀의 다리. 없어도 될 쓸데없는 것',
    example: '예문: 사족을 붙이지 마라.'
  },
  {
    word: '사즉생(死卽生)',
    question: '<span class="word-highlight">사즉생(死卽生)</span>의 뜻은?',
    hint: '죽으면 곧 삼',
    choices: ['도망침', '죽고자 하면 살게 됨', '포기함', '물러남'],
    correct: 1,
    koreanLevel: 6,
    explanation: '死(죽을 사) 卽(곧 즉) 生(날 생) - 죽고자 하면 삶. 필사적으로 노력하면 살길이 열림',
    example: '예문: 사즉생의 각오로 싸웠다.'
  },
  {
    word: '사지(死地)',
    question: '<span class="word-highlight">사지(死地)</span>의 뜻은?',
    hint: '죽을 땅',
    choices: ['안전한 곳', '죽을 곳', '편한 곳', '좋은 곳'],
    correct: 1,
    koreanLevel: 6,
    explanation: '死(죽을 사) 地(땅 지) - 죽을 곳. 매우 위험한 곳이나 상황',
    example: '예문: 사지에서 탈출했다.'
  },
  {
    word: '사촌이남(四寸以南)',
    question: '<span class="word-highlight">사필귀정(事必歸正)</span>의 뜻은?',
    hint: '일은 반드시 바른 데로 돌아감',
    choices: ['불의가 이김', '모든 일은 결국 바르게 됨', '정의가 패함', '악이 승리'],
    correct: 1,
    koreanLevel: 6,
    explanation: '事(일 사) 必(반드시 필) 歸(돌아갈 귀) 正(바를 정) - 모든 일은 결국 바른 데로 돌아감',
    example: '예문: 사필귀정이니 걱정 마라.'
  },
  {
    word: '산전수전(山戰水戰)',
    question: '<span class="word-highlight">산전수전(山戰水戰)</span>의 뜻은?',
    hint: '산에서 싸우고 물에서 싸움',
    choices: ['경험 없음', '세상의 온갖 고생을 겪음', '평탄함', '순조로움'],
    correct: 1,
    koreanLevel: 6,
    explanation: '山(뫼 산) 戰(싸움 전) 水(물 수) 戰(싸움 전) - 산에서도 물에서도 싸움. 세상의 온갖 고생을 겪음',
    example: '예문: 산전수전 다 겪었다.'
  },
  {
    word: '살신성인(殺身成仁)',
    question: '<span class="word-highlight">살신성인(殺身成仁)</span>의 뜻은?',
    hint: '몸을 죽여 인을 이룸',
    choices: ['목숨을 아낌', '목숨을 바쳐 인을 이룸', '안전을 추구', '편안함을 좇음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '殺(죽일 살) 身(몸 신) 成(이룰 성) 仁(어질 인) - 목숨을 바쳐 인을 이룸',
    example: '예문: 살신성인의 정신이다.'
  },
  // 401~450번 한자성어
  {
    word: '삼고초려(三顧草廬)',
    question: '<span class="word-highlight">삼고초려(三顧草廬)</span>의 뜻은?',
    hint: '세 번 초가집을 찾아감',
    choices: ['무시함', '인재를 맞이하기 위해 진심으로 노력함', '경멸함', '무관심'],
    correct: 1,
    koreanLevel: 6,
    explanation: '三(석 삼) 顧(돌아볼 고) 草(풀 초) 廬(오두막 려) - 유비가 제갈량을 세 번 찾아감. 인재를 얻기 위해 정성을 다함',
    example: '예문: 삼고초려의 정성으로 모셨다.'
  },
  {
    word: '삼라만상(森羅萬象)',
    question: '<span class="word-highlight">삼라만상(森羅萬象)</span>의 뜻은?',
    hint: '늘어선 수풀 만 가지 형상',
    choices: ['일부', '우주의 모든 사물과 현상', '작은 것', '한 가지'],
    correct: 1,
    koreanLevel: 6,
    explanation: '森(빽빽할 삼) 羅(벌릴 라) 萬(일만 만) 象(형상 상) - 우주에 가득 찬 온갖 사물과 현상',
    example: '예문: 삼라만상을 관찰했다.'
  },
  {
    word: '삼삼오오(三三五五)',
    question: '<span class="word-highlight">삼삼오오(三三五五)</span>의 뜻은?',
    hint: '셋셋 다섯다섯',
    choices: ['한꺼번에', '서너 명씩 무리 지어', '홀로', '전부 함께'],
    correct: 1,
    koreanLevel: 6,
    explanation: '三(석 삼) 三(석 삼) 五(다섯 오) 五(다섯 오) - 서너 명씩 떼를 지어',
    example: '예문: 삼삼오오 모였다.'
  },
  {
    word: '삼인성호(三人成虎)',
    question: '<span class="word-highlight">삼인성호(三人成虎)</span>의 뜻은?',
    hint: '세 사람이 호랑이를 만듦',
    choices: ['진실', '거짓말도 여러 사람이 하면 믿게 됨', '정직', '사실'],
    correct: 1,
    koreanLevel: 6,
    explanation: '三(석 삼) 人(사람 인) 成(이룰 성) 虎(범 호) - 세 사람이 말하면 없는 호랑이도 있게 됨. 근거 없는 말도 여러 사람이 하면 믿게 됨',
    example: '예문: 삼인성호라 조심해라.'
  },
  {
    word: '상부상조(相扶相助)',
    question: '<span class="word-highlight">상부상조(相扶相助)</span>의 뜻은?',
    hint: '서로 붙들고 서로 도움',
    choices: ['경쟁함', '서로 돕고 의지함', '대립함', '갈등함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '相(서로 상) 扶(붙들 부) 相(서로 상) 助(도울 조) - 서로 붙들어 주고 서로 도움',
    example: '예문: 상부상조하며 살자.'
  },
  {
    word: '상전벽해(桑田碧海)',
    question: '<span class="word-highlight">상전벽해(桑田碧海)</span>의 뜻은?',
    hint: '뽕나무밭이 푸른 바다가 됨',
    choices: ['변함없음', '세상이 크게 변함', '고정됨', '일정함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '桑(뽕나무 상) 田(밭 전) 碧(푸를 벽) 海(바다 해) - 뽕밭이 바다가 됨. 세상의 큰 변화',
    example: '예문: 상전벽해의 변화다.'
  },
  {
    word: '새옹지마(塞翁之馬)',
    question: '<span class="word-highlight">새옹지마(塞翁之馬)</span>의 뜻은?',
    hint: '변방 노인의 말',
    choices: ['일관됨', '인생의 길흉화복을 예측할 수 없음', '정해짐', '확실함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '塞(변방 새) 翁(늙은이 옹) 之(갈 지) 馬(말 마) - 변방 노인의 말. 인생의 길흉화복은 예측할 수 없음',
    example: '예문: 새옹지마라 하지 않았나.'
  },
  {
    word: '생사여탈(生殺與奪)',
    question: '<span class="word-highlight">생사여탈(生殺與奪)</span>의 뜻은?',
    hint: '살리고 죽이고 주고 빼앗음',
    choices: ['권한 없음', '남의 운명을 마음대로 함', '무력함', '무능함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '生(날 생) 殺(죽일 살) 與(줄 여) 奪(빼앗을 탈) - 살리고 죽이고 주고 빼앗음. 절대적인 권력',
    example: '예문: 생사여탈권을 쥐었다.'
  },
  {
    word: '서산대사(西山大師)',
    question: '<span class="word-highlight">선견지명(先見之明)</span>의 뜻은?',
    hint: '미리 보는 밝음',
    choices: ['뒤늦은 깨달음', '앞날을 미리 내다보는 지혜', '후회', '반성'],
    correct: 1,
    koreanLevel: 6,
    explanation: '先(먼저 선) 見(볼 견) 之(갈 지) 明(밝을 명) - 앞일을 미리 내다보는 밝은 지혜',
    example: '예문: 선견지명이 있었다.'
  },
  {
    word: '선공후사(先公後私)',
    question: '<span class="word-highlight">선공후사(先公後私)</span>의 뜻은?',
    hint: '공을 앞세우고 사를 뒤로 함',
    choices: ['사익 우선', '공익을 먼저 생각함', '이기심', '개인주의'],
    correct: 1,
    koreanLevel: 6,
    explanation: '先(먼저 선) 公(공변될 공) 後(뒤 후) 私(사사로울 사) - 공익을 먼저 하고 사익을 뒤로 함',
    example: '예문: 선공후사의 자세다.'
  },
  {
    word: '선남선녀(善男善女)',
    question: '<span class="word-highlight">선남선녀(善男善女)</span>의 뜻은?',
    hint: '착한 남자 착한 여자',
    choices: ['나쁜 사람', '마음이 착하고 곧은 젊은 남녀', '악인', '범죄자'],
    correct: 1,
    koreanLevel: 6,
    explanation: '善(착할 선) 男(남자 남) 善(착할 선) 女(여자 녀) - 착하고 어진 젊은 남녀',
    example: '예문: 선남선녀가 모였다.'
  },
  {
    word: '선입견(先入見)',
    question: '<span class="word-highlight">선입견(先入見)</span>의 뜻은?',
    hint: '먼저 들어온 생각',
    choices: ['객관적 판단', '미리 정해진 고정관념', '열린 마음', '유연한 사고'],
    correct: 1,
    koreanLevel: 6,
    explanation: '先(먼저 선) 入(들 입) 見(볼 견) - 미리 들어온 견해. 미리 정해진 고정관념',
    example: '예문: 선입견을 버려라.'
  },
  {
    word: '설상가상(雪上加霜)',
    question: '<span class="word-highlight">설상가상(雪上加霜)</span>의 뜻은?',
    hint: '눈 위에 서리가 더해짐',
    choices: ['상황 호전', '불행이 겹침', '행운', '좋은 일'],
    correct: 1,
    koreanLevel: 6,
    explanation: '雪(눈 설) 上(위 상) 加(더할 가) 霜(서리 상) - 눈 위에 서리가 더해짐. 불행이 겹침',
    example: '예문: 설상가상으로 비까지 왔다.'
  },
  {
    word: '설왕설래(說往說來)',
    question: '<span class="word-highlight">설왕설래(說往說來)</span>의 뜻은?',
    hint: '말이 가고 말이 옴',
    choices: ['침묵', '말이 오고 감', '조용함', '말이 없음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '說(말씀 설) 往(갈 왕) 說(말씀 설) 來(올 래) - 말이 오고 감. 서로 변론함',
    example: '예문: 설왕설래하다가 합의했다.'
  },
  {
    word: '성자필쇠(盛者必衰)',
    question: '<span class="word-highlight">성자필쇠(盛者必衰)</span>의 뜻은?',
    hint: '성한 자 반드시 쇠함',
    choices: ['영원히 번창', '번성한 것은 반드시 쇠퇴함', '영구적 성공', '불변'],
    correct: 1,
    koreanLevel: 6,
    explanation: '盛(성할 성) 者(놈 자) 必(반드시 필) 衰(쇠할 쇠) - 성한 것은 반드시 쇠함',
    example: '예문: 성자필쇠의 이치다.'
  },
  {
    word: '세대교체(世代交替)',
    question: '<span class="word-highlight">세대교체(世代交替)</span>의 뜻은?',
    hint: '세대가 바뀜',
    choices: ['변함없음', '낡은 세대가 새 세대로 바뀜', '유지됨', '그대로'],
    correct: 1,
    koreanLevel: 6,
    explanation: '世(인간 세) 代(대신할 대) 交(사귈 교) 替(바꿀 체) - 한 세대가 물러나고 새 세대가 등장함',
    example: '예문: 세대교체가 이루어졌다.'
  },
  {
    word: '세월무상(歲月無常)',
    question: '<span class="word-highlight">세월무상(歲月無常)</span>의 뜻은?',
    hint: '세월이 변함없지 않음',
    choices: ['영원함', '세월은 일정하지 않고 변함', '불변', '항구적'],
    correct: 1,
    koreanLevel: 6,
    explanation: '歲(해 세) 月(달 월) 無(없을 무) 常(항상 상) - 세월은 변하여 일정하지 않음',
    example: '예문: 세월무상을 느꼈다.'
  },
  {
    word: '소탐대실(小貪大失)',
    question: '<span class="word-highlight">소탐대실(小貪大失)</span>의 뜻은?',
    hint: '작은 것을 탐하다 큰 것을 잃음',
    choices: ['큰 이익', '작은 이익을 탐하다 큰 것을 잃음', '성공', '이득'],
    correct: 1,
    koreanLevel: 6,
    explanation: '小(작을 소) 貪(탐할 탐) 大(클 대) 失(잃을 실) - 작은 것을 탐하다가 큰 것을 잃음',
    example: '예문: 소탐대실하지 마라.'
  },
  {
    word: '속수무책(束手無策)',
    question: '<span class="word-highlight">속수무책(束手無策)</span>의 뜻은?',
    hint: '손을 묶고 방책이 없음',
    choices: ['해결함', '어찌할 방법이 없음', '대책 있음', '방법 있음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '束(묶을 속) 手(손 수) 無(없을 무) 策(꾀 책) - 손이 묶여 방책이 없음. 어찌할 도리가 없음',
    example: '예문: 속수무책으로 당했다.'
  },
  {
    word: '손망치한(脣亡齒寒)',
    question: '<span class="word-highlight">손망치한(脣亡齒寒)</span>의 뜻은?',
    hint: '입술이 없으면 이가 시림',
    choices: ['독립적', '서로 의지하는 밀접한 관계', '무관함', '관계없음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '脣(입술 순) 亡(망할 망) 齒(이 치) 寒(찰 한) - 입술이 없으면 이가 시림. 서로 밀접하게 관련됨',
    example: '예문: 손망치한의 관계다.'
  },
  {
    word: '송구영신(送舊迎新)',
    question: '<span class="word-highlight">송구영신(送舊迎新)</span>의 뜻은?',
    hint: '옛것을 보내고 새것을 맞음',
    choices: ['과거만 고집', '묵은해를 보내고 새해를 맞음', '미래 거부', '현재만 중시'],
    correct: 1,
    koreanLevel: 6,
    explanation: '送(보낼 송) 舊(옛 구) 迎(맞을 영) 新(새 신) - 묵은해를 보내고 새해를 맞음',
    example: '예문: 송구영신의 인사를 드린다.'
  },
  {
    word: '수구초심(首丘初心)',
    question: '<span class="word-highlight">수구초심(首丘初心)</span>의 뜻은?',
    hint: '머리를 고향 언덕으로 두는 마음',
    choices: ['고향 무관심', '고향을 그리워하는 마음', '고향 싫어함', '떠남'],
    correct: 1,
    koreanLevel: 6,
    explanation: '首(머리 수) 丘(언덕 구) 初(처음 초) 心(마음 심) - 죽을 때 고향을 향해 머리를 둠. 고향을 그리워하는 마음',
    example: '예문: 수구초심으로 고향을 찾았다.'
  },
  {
    word: '수기치인(修己治人)',
    question: '<span class="word-highlight">수기치인(修己治人)</span>의 뜻은?',
    hint: '자기를 닦고 남을 다스림',
    choices: ['이기심', '자기를 수양하고 남을 다스림', '남만 다스림', '자신 무시'],
    correct: 1,
    koreanLevel: 6,
    explanation: '修(닦을 수) 己(몸 기) 治(다스릴 치) 人(사람 인) - 자기를 닦고 남을 다스림. 유교 이념',
    example: '예문: 수기치인의 정신이다.'
  },
  {
    word: '수불석권(手不釋卷)',
    question: '<span class="word-highlight">수불석권(手不釋卷)</span>의 뜻은?',
    hint: '손에서 책을 놓지 않음',
    choices: ['독서 싫어함', '항상 책을 손에 들고 읽음', '책 멀리함', '공부 안 함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '手(손 수) 不(아닐 불) 釋(풀 석) 卷(책 권) - 손에서 책을 놓지 않음. 늘 열심히 책을 읽음',
    example: '예문: 수불석권의 자세다.'
  },
  {
    word: '수어지교(水魚之交)',
    question: '<span class="word-highlight">수어지교(水魚之交)</span>의 뜻은?',
    hint: '물과 물고기의 사귐',
    choices: ['사이 나쁨', '떼려야 뗄 수 없는 친한 사이', '경쟁 관계', '적대 관계'],
    correct: 1,
    koreanLevel: 6,
    explanation: '水(물 수) 魚(물고기 어) 之(갈 지) 交(사귈 교) - 물과 물고기처럼 떼려야 뗄 수 없는 친한 사이',
    example: '예문: 수어지교의 사이다.'
  },
  {
    word: '수원수구(誰怨誰咎)',
    question: '<span class="word-highlight">수원수구(誰怨誰咎)</span>의 뜻은?',
    hint: '누구를 원망하고 누구를 탓하랴',
    choices: ['남 탓', '누구를 원망하고 탓하겠는가', '비난함', '책임 전가'],
    correct: 1,
    koreanLevel: 6,
    explanation: '誰(누구 수) 怨(원망할 원) 誰(누구 수) 咎(허물 구) - 누구를 원망하고 탓하겠는가',
    example: '예문: 수원수구할 일이 아니다.'
  },
  {
    word: '수적천석(水滴穿石)',
    question: '<span class="word-highlight">수적천석(水滴穿石)</span>의 뜻은?',
    hint: '물방울이 돌을 뚫음',
    choices: ['불가능', '작은 노력도 쌓이면 큰일을 이룸', '헛됨', '무력'],
    correct: 1,
    koreanLevel: 6,
    explanation: '水(물 수) 滴(물방울 적) 穿(뚫을 천) 石(돌 석) - 물방울도 꾸준히 떨어지면 돌을 뚫음',
    example: '예문: 수적천석의 각오다.'
  },
  {
    word: '수주대토(守株待兎)',
    question: '<span class="word-highlight">수주대토(守株待兎)</span>의 뜻은?',
    hint: '그루터기를 지키며 토끼를 기다림',
    choices: ['적극적', '우연을 바라며 노력하지 않음', '열심히 함', '노력함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '守(지킬 수) 株(그루터기 주) 待(기다릴 대) 兎(토끼 토) - 그루터기를 지키며 토끼를 기다림. 우연만 바라며 노력하지 않음',
    example: '예문: 수주대토하지 마라.'
  },
  {
    word: '숙맥부지(菽麥不知)',
    question: '<span class="word-highlight">숙맥부지(菽麥不知)</span>의 뜻은?',
    hint: '콩과 보리를 모름',
    choices: ['총명함', '사리 분별을 못함', '지혜로움', '영리함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '菽(콩 숙) 麥(보리 맥) 不(아닐 불) 知(알 지) - 콩과 보리를 구별하지 못함. 어리석음',
    example: '예문: 숙맥부지의 사람이다.'
  },
  {
    word: '순망치한(脣亡齒寒)',
    question: '<span class="word-highlight">시시비비(是是非非)</span>의 뜻은?',
    hint: '옳은 것은 옳고 그른 것은 그르다',
    choices: ['모호함', '옳고 그름을 분명히 가림', '애매함', '불분명'],
    correct: 1,
    koreanLevel: 6,
    explanation: '是(옳을 시) 是(옳을 시) 非(아닐 비) 非(아닐 비) - 옳은 것은 옳다 하고 그른 것은 그르다 함',
    example: '예문: 시시비비를 가리자.'
  },
  {
    word: '시종일관(始終一貫)',
    question: '<span class="word-highlight">시종일관(始終一貫)</span>의 뜻은?',
    hint: '처음부터 끝까지 한결같이',
    choices: ['변덕스러움', '처음부터 끝까지 한결같음', '자주 바뀜', '일관성 없음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '始(비로소 시) 終(끝 종) 一(한 일) 貫(꿸 관) - 처음부터 끝까지 한결같음',
    example: '예문: 시종일관 노력했다.'
  },
  {
    word: '식자우환(識字憂患)',
    question: '<span class="word-highlight">식자우환(識字憂患)</span>의 뜻은?',
    hint: '글자를 알아 근심이 생김',
    choices: ['무식이 좋음', '아는 것이 오히려 걱정이 됨', '지식 무용', '배움 해로움'],
    correct: 1,
    koreanLevel: 6,
    explanation: '識(알 식) 字(글자 자) 憂(근심 우) 患(근심 환) - 글자를 알아 근심이 생김. 아는 것이 도리어 화가 됨',
    example: '예문: 식자우환이라더니.'
  },
  {
    word: '신기루(蜃氣樓)',
    question: '<span class="word-highlight">신기루(蜃氣樓)</span>의 뜻은?',
    hint: '대합 기운의 누각',
    choices: ['실체', '실제가 아닌 허상', '현실', '사실'],
    correct: 1,
    koreanLevel: 6,
    explanation: '蜃(대합 신) 氣(기운 기) 樓(다락 루) - 실제가 아닌 허상이나 허망한 것',
    example: '예문: 그 꿈은 신기루였다.'
  },
  {
    word: '신뢰(信賴)',
    question: '<span class="word-highlight">신상필벌(信賞必罰)</span>의 뜻은?',
    hint: '상을 믿고 벌을 반드시',
    choices: ['불공정', '공을 세우면 반드시 상을 주고 죄를 지으면 반드시 벌을 줌', '편파적', '불평등'],
    correct: 1,
    koreanLevel: 6,
    explanation: '信(믿을 신) 賞(상줄 상) 必(반드시 필) 罰(벌줄 벌) - 공에는 상을, 죄에는 벌을 반드시 줌',
    example: '예문: 신상필벌을 철저히 했다.'
  },
  {
    word: '신언서판(身言書判)',
    question: '<span class="word-highlight">신언서판(身言書判)</span>의 뜻은?',
    hint: '몸 말 글씨 판단',
    choices: ['한 가지 기준', '인물을 평가하는 네 가지 기준', '단일 조건', '하나만 봄'],
    correct: 1,
    koreanLevel: 6,
    explanation: '身(몸 신) 言(말씀 언) 書(글 서) 判(판단할 판) - 용모, 말솜씨, 글씨, 판단력. 인재를 평가하는 네 기준',
    example: '예문: 신언서판을 갖췄다.'
  },
  {
    word: '신출귀몰(神出鬼沒)',
    question: '<span class="word-highlight">신출귀몰(神出鬼沒)</span>의 뜻은?',
    hint: '귀신처럼 나타나고 사라짐',
    choices: ['예측 가능', '나타났다 사라지기를 자유자재로 함', '항상 보임', '일정함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '神(귀신 신) 出(날 출) 鬼(귀신 귀) 沒(빠질 몰) - 귀신처럼 나타났다 사라짐. 자유자재함',
    example: '예문: 신출귀몰하게 움직였다.'
  },
  {
    word: '심기일전(心機一轉)',
    question: '<span class="word-highlight">심기일전(心機一轉)</span>의 뜻은?',
    hint: '마음의 기틀이 한 번 바뀜',
    choices: ['변함없음', '마음을 새롭게 바꿈', '그대로', '유지함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '心(마음 심) 機(틀 기) 一(한 일) 轉(구를 전) - 마음가짐을 완전히 바꿈',
    example: '예문: 심기일전하여 다시 시작했다.'
  },
  {
    word: '심사숙고(深思熟考)',
    question: '<span class="word-highlight">심사숙고(深思熟考)</span>의 뜻은?',
    hint: '깊이 생각하고 익혀 생각함',
    choices: ['충동적', '깊이 생각하고 신중히 헤아림', '즉흥적', '성급함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '深(깊을 심) 思(생각 사) 熟(익을 숙) 考(생각할 고) - 깊이 생각하고 신중하게 헤아림',
    example: '예문: 심사숙고 끝에 결정했다.'
  },
  {
    word: '심심상인(心心相印)',
    question: '<span class="word-highlight">심심상인(心心相印)</span>의 뜻은?',
    hint: '마음과 마음이 서로 찍힘',
    choices: ['마음이 다름', '마음이 서로 통함', '생각이 다름', '의견 충돌'],
    correct: 1,
    koreanLevel: 6,
    explanation: '心(마음 심) 心(마음 심) 相(서로 상) 印(도장 인) - 마음과 마음이 서로 통함',
    example: '예문: 심심상인의 경지다.'
  },
  {
    word: '십년감수(十年減壽)',
    question: '<span class="word-highlight">십년감수(十年減壽)</span>의 뜻은?',
    hint: '십 년의 수명이 줄어듦',
    choices: ['장수함', '크게 놀라거나 걱정함', '건강해짐', '수명 늘어남'],
    correct: 1,
    koreanLevel: 6,
    explanation: '十(열 십) 年(해 년) 減(덜 감) 壽(목숨 수) - 열 해의 수명이 줄 만큼 놀람',
    example: '예문: 십년감수할 뻔했다.'
  },
  {
    word: '십상팔구(十常八九)',
    question: '<span class="word-highlight">십상팔구(十常八九)</span>의 뜻은?',
    hint: '열에 항상 여덟아홉',
    choices: ['드묾', '거의 대부분', '희귀함', '가끔'],
    correct: 1,
    koreanLevel: 6,
    explanation: '十(열 십) 常(항상 상) 八(여덟 팔) 九(아홉 구) - 열에 여덟아홉. 거의 대부분',
    example: '예문: 십상팔구는 그렇다.'
  },
  {
    word: '십시일반(十匙一飯)',
    question: '<span class="word-highlight">십시일반(十匙一飯)</span>의 뜻은?',
    hint: '열 숟가락이 한 끼',
    choices: ['혼자 다 함', '여러 사람이 조금씩 모아 도움', '독점함', '나누지 않음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '十(열 십) 匙(숟가락 시) 一(한 일) 飯(밥 반) - 열 숟가락이면 한 끼. 여럿이 조금씩 모아 도움',
    example: '예문: 십시일반으로 도왔다.'
  },
  {
    word: '십중팔구(十中八九)',
    question: '<span class="word-highlight">십중팔구(十中八九)</span>의 뜻은?',
    hint: '열 중 여덟아홉',
    choices: ['드묾', '거의 틀림없이', '확률 낮음', '가끔'],
    correct: 1,
    koreanLevel: 6,
    explanation: '十(열 십) 中(가운데 중) 八(여덟 팔) 九(아홉 구) - 열에 여덟아홉. 거의 틀림없이',
    example: '예문: 십중팔구 그럴 것이다.'
  },
  {
    word: '아비규환(阿鼻叫喚)',
    question: '<span class="word-highlight">아비규환(阿鼻叫喚)</span>의 뜻은?',
    hint: '아비지옥의 울부짖음',
    choices: ['평화로움', '매우 처참한 지경', '조용함', '안정됨'],
    correct: 1,
    koreanLevel: 6,
    explanation: '阿(언덕 아) 鼻(코 비) 叫(부르짖을 규) 喚(부를 환) - 아비지옥의 고통 소리. 매우 처참함',
    example: '예문: 아비규환의 참상이다.'
  },
  {
    word: '아전인수(我田引水)',
    question: '<span class="word-highlight">아전인수(我田引水)</span>의 뜻은?',
    hint: '내 밭에 물 끌어오기',
    choices: ['공정함', '자기에게 유리하게 함', '공평함', '객관적'],
    correct: 1,
    koreanLevel: 6,
    explanation: '我(나 아) 田(밭 전) 引(끌 인) 水(물 수) - 내 밭에 물을 끌어옴. 자기에게 유리하게 함',
    example: '예문: 아전인수 식으로 해석했다.'
  },
  // 451~500번 한자성어
  {
    word: '안분지족(安分知足)',
    question: '<span class="word-highlight">안분지족(安分知足)</span>의 뜻은?',
    hint: '분수를 편안히 여기고 만족을 앎',
    choices: ['욕심 많음', '분수를 알고 만족함', '탐욕스러움', '불만족'],
    correct: 1,
    koreanLevel: 6,
    explanation: '安(편안 안) 分(나눌 분) 知(알 지) 足(발 족) - 자기 분수를 알고 만족할 줄 앎',
    example: '예문: 안분지족하며 살았다.'
  },
  {
    word: '안빈낙도(安貧樂道)',
    question: '<span class="word-highlight">안빈낙도(安貧樂道)</span>의 뜻은?',
    hint: '가난을 편히 여기고 도를 즐김',
    choices: ['부를 좇음', '가난해도 도를 즐기며 삶', '사치함', '허영'],
    correct: 1,
    koreanLevel: 6,
    explanation: '安(편안 안) 貧(가난할 빈) 樂(즐길 락) 道(길 도) - 가난해도 도를 즐기며 편안하게 삶',
    example: '예문: 안빈낙도의 삶을 살았다.'
  },
  {
    word: '안하무인(眼下無人)',
    question: '<span class="word-highlight">안하무인(眼下無人)</span>의 뜻은?',
    hint: '눈 아래 사람이 없음',
    choices: ['겸손함', '교만하여 남을 업신여김', '낮은 자세', '배려함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '眼(눈 안) 下(아래 하) 無(없을 무) 人(사람 인) - 눈 아래 사람이 없음. 남을 업신여김',
    example: '예문: 안하무인하게 굴었다.'
  },
  {
    word: '애지중지(愛之重之)',
    question: '<span class="word-highlight">애지중지(愛之重之)</span>의 뜻은?',
    hint: '사랑하고 소중히 여김',
    choices: ['무관심', '매우 소중히 여김', '냉대함', '무시함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '愛(사랑 애) 之(갈 지) 重(무거울 중) 之(갈 지) - 매우 사랑하고 소중히 여김',
    example: '예문: 애지중지 키웠다.'
  },
  {
    word: '약방감초(藥房甘草)',
    question: '<span class="word-highlight">약방감초(藥房甘草)</span>의 뜻은?',
    hint: '약방의 감초',
    choices: ['불필요함', '빠지지 않고 꼭 끼는 사람', '필요 없음', '없어도 됨'],
    correct: 1,
    koreanLevel: 6,
    explanation: '藥(약 약) 房(방 방) 甘(달 감) 草(풀 초) - 약방의 감초. 빠짐없이 꼭 끼는 사람이나 물건',
    example: '예문: 그는 약방감초다.'
  },
  {
    word: '약육강식(弱肉强食)',
    question: '<span class="word-highlight">약육강식(弱肉强食)</span>의 뜻은?',
    hint: '약한 자의 고기를 강한 자가 먹음',
    choices: ['평화로움', '강한 자가 약한 자를 억압함', '평등함', '공존'],
    correct: 1,
    koreanLevel: 6,
    explanation: '弱(약할 약) 肉(고기 육) 强(강할 강) 食(먹을 식) - 약한 것이 강한 것에게 먹힘. 적자생존',
    example: '예문: 약육강식의 세계다.'
  },
  {
    word: '양두구육(羊頭狗肉)',
    question: '<span class="word-highlight">양두구육(羊頭狗肉)</span>의 뜻은?',
    hint: '양 머리 걸고 개고기 팔기',
    choices: ['정직함', '겉과 속이 다름', '솔직함', '일치함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '羊(양 양) 頭(머리 두) 狗(개 구) 肉(고기 육) - 양 머리를 걸고 개고기를 팖. 겉과 속이 다름',
    example: '예문: 양두구육 같은 행태다.'
  },
  {
    word: '양상군자(梁上君子)',
    question: '<span class="word-highlight">양상군자(梁上君子)</span>의 뜻은?',
    hint: '들보 위의 군자',
    choices: ['도둑', '점잖은 체 하는 사람', '선비', '학자'],
    correct: 0,
    koreanLevel: 6,
    explanation: '梁(들보 량) 上(위 상) 君(임금 군) 子(아들 자) - 들보 위의 군자. 도둑을 점잖게 이르는 말',
    example: '예문: 양상군자가 들었다.'
  },
  {
    word: '양자택일(兩者擇一)',
    question: '<span class="word-highlight">양자택일(兩者擇一)</span>의 뜻은?',
    hint: '둘 중 하나를 선택함',
    choices: ['전부 선택', '둘 중 하나를 선택함', '모두 버림', '여러 개 선택'],
    correct: 1,
    koreanLevel: 6,
    explanation: '兩(두 양) 者(놈 자) 擇(가릴 택) 一(한 일) - 둘 중 하나를 선택함',
    example: '예문: 양자택일해야 한다.'
  },
  {
    word: '어불성설(語不成說)',
    question: '<span class="word-highlight">어불성설(語不成說)</span>의 뜻은?',
    hint: '말이 이치에 맞지 않음',
    choices: ['논리적', '말이 도무지 이치에 맞지 않음', '합리적', '타당함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '語(말씀 어) 不(아닐 불) 成(이룰 성) 說(말씀 설) - 말이 이치에 맞지 않음',
    example: '예문: 어불성설의 주장이다.'
  },
  {
    word: '어부지리(漁父之利)',
    question: '<span class="word-highlight">어부지리(漁父之利)</span>의 뜻은?',
    hint: '어부의 이익',
    choices: ['힘들게 얻음', '두 사람이 다투는 사이에 제삼자가 이익을 얻음', '노력의 결과', '당연한 이익'],
    correct: 1,
    koreanLevel: 6,
    explanation: '漁(고기잡을 어) 父(아비 부) 之(갈 지) 利(이로울 리) - 조개와 도요새가 다투는 사이에 어부가 이득을 봄',
    example: '예문: 어부지리를 얻었다.'
  },
  {
    word: '언감생심(焉敢生心)',
    question: '<span class="word-highlight">언감생심(焉敢生心)</span>의 뜻은?',
    hint: '어찌 감히 마음을 품으랴',
    choices: ['당연함', '어찌 감히 그런 마음을 품겠는가', '확신함', '자신 있음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '焉(어찌 언) 敢(감히 감) 生(날 생) 心(마음 심) - 어찌 감히 그런 마음을 품겠는가',
    example: '예문: 언감생심 그런 것을.'
  },
  {
    word: '언어도단(言語道斷)',
    question: '<span class="word-highlight">언어도단(言語道斷)</span>의 뜻은?',
    hint: '말의 길이 끊김',
    choices: ['말이 잘 통함', '말할 수 없을 정도로 어이없음', '대화가 됨', '원활한 소통'],
    correct: 1,
    koreanLevel: 6,
    explanation: '言(말씀 언) 語(말씀 어) 道(길 도) 斷(끊을 단) - 말의 길이 끊김. 어이없어 말이 안 나옴',
    example: '예문: 언어도단이다.'
  },
  {
    word: '언중유골(言中有骨)',
    question: '<span class="word-highlight">언중유골(言中有骨)</span>의 뜻은?',
    hint: '말 속에 뼈가 있음',
    choices: ['순한 말', '말 속에 날카로운 속뜻이 있음', '부드러운 말', '친절한 말'],
    correct: 1,
    koreanLevel: 6,
    explanation: '言(말씀 언) 中(가운데 중) 有(있을 유) 骨(뼈 골) - 말 속에 뼈가 있음. 예사로운 말 속에 날카로운 뜻이 있음',
    example: '예문: 언중유골의 말이었다.'
  },
  {
    word: '여반장(如反掌)',
    question: '<span class="word-highlight">여반장(如反掌)</span>의 뜻은?',
    hint: '손바닥 뒤집는 것 같음',
    choices: ['어려움', '매우 쉬움', '힘듦', '복잡함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '如(같을 여) 反(뒤집을 반) 掌(손바닥 장) - 손바닥 뒤집듯 쉬움',
    example: '예문: 그것은 여반장이다.'
  },
  {
    word: '역지사지(易地思之)',
    question: '<span class="word-highlight">역지사지(易地思之)</span>의 뜻은?',
    hint: '처지를 바꾸어 생각함',
    choices: ['자기만 생각', '상대방의 처지에서 생각함', '이기적', '편협함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '易(바꿀 역) 地(땅 지) 思(생각 사) 之(갈 지) - 처지를 바꾸어 생각함',
    example: '예문: 역지사지로 생각해 봐라.'
  },
  {
    word: '연목구어(緣木求魚)',
    question: '<span class="word-highlight">연목구어(緣木求魚)</span>의 뜻은?',
    hint: '나무에서 물고기를 구함',
    choices: ['가능한 일', '불가능한 일을 하려 함', '쉬운 일', '당연한 일'],
    correct: 1,
    koreanLevel: 6,
    explanation: '緣(인연 연) 木(나무 목) 求(구할 구) 魚(물고기 어) - 나무에 올라 물고기를 구함. 불가능한 일',
    example: '예문: 연목구어와 같은 짓이다.'
  },
  {
    word: '영고성쇠(榮枯盛衰)',
    question: '<span class="word-highlight">영고성쇠(榮枯盛衰)</span>의 뜻은?',
    hint: '영화롭고 마르고 성하고 쇠함',
    choices: ['영원한 번영', '성하고 쇠함이 반복됨', '항상 성공', '불변'],
    correct: 1,
    koreanLevel: 6,
    explanation: '榮(영화 영) 枯(마를 고) 盛(성할 성) 衰(쇠할 쇠) - 번영과 쇠퇴의 반복',
    example: '예문: 영고성쇠의 역사다.'
  },
  {
    word: '오리무중(五里霧中)',
    question: '<span class="word-highlight">오리무중(五里霧中)</span>의 뜻은?',
    hint: '오 리 안개 속',
    choices: ['분명함', '알 수 없는 상태', '명확함', '뚜렷함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '五(다섯 오) 里(마을 리) 霧(안개 무) 中(가운데 중) - 오 리나 되는 안개 속. 무엇이 어떻게 되어 가는지 알 수 없음',
    example: '예문: 사건이 오리무중이다.'
  },
  {
    word: '오매불망(寤寐不忘)',
    question: '<span class="word-highlight">오매불망(寤寐不忘)</span>의 뜻은?',
    hint: '자나 깨나 잊지 못함',
    choices: ['쉽게 잊음', '잠을 자나 깨나 잊지 못함', '무관심', '망각'],
    correct: 1,
    koreanLevel: 6,
    explanation: '寤(깰 오) 寐(잘 매) 不(아닐 불) 忘(잊을 망) - 자나 깨나 잊지 못함',
    example: '예문: 오매불망 그리워했다.'
  },
  {
    word: '오비이락(烏飛梨落)',
    question: '<span class="word-highlight">오비이락(烏飛梨落)</span>의 뜻은?',
    hint: '까마귀 날자 배 떨어짐',
    choices: ['인과관계', '우연의 일치로 의심을 받음', '필연', '당연한 결과'],
    correct: 1,
    koreanLevel: 6,
    explanation: '烏(까마귀 오) 飛(날 비) 梨(배 이) 落(떨어질 락) - 까마귀 날자 배가 떨어짐. 우연의 일치로 의심을 받음',
    example: '예문: 오비이락이었다.'
  },
  {
    word: '오상고절(傲霜孤節)',
    question: '<span class="word-highlight">오상고절(傲霜孤節)</span>의 뜻은?',
    hint: '서리에도 꺾이지 않는 외로운 절개',
    choices: ['나약함', '역경에도 굽히지 않는 절개', '쉽게 굴복', '굴함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '傲(오만할 오) 霜(서리 상) 孤(외로울 고) 節(마디 절) - 서리에도 굽히지 않는 절개',
    example: '예문: 오상고절의 선비다.'
  },
  {
    word: '오월동주(吳越同舟)',
    question: '<span class="word-highlight">오월동주(吳越同舟)</span>의 뜻은?',
    hint: '오나라와 월나라가 같은 배를 탐',
    choices: ['친한 사이', '원수지간이 같은 처지가 됨', '협력 관계', '동맹'],
    correct: 1,
    koreanLevel: 6,
    explanation: '吳(오나라 오) 越(월나라 월) 同(같을 동) 舟(배 주) - 원수 사이인 오나라와 월나라 사람이 같은 배를 탐',
    example: '예문: 오월동주의 상황이다.'
  },
  {
    word: '오합지졸(烏合之卒)',
    question: '<span class="word-highlight">오합지졸(烏合之卒)</span>의 뜻은?',
    hint: '까마귀떼처럼 모인 군사',
    choices: ['정예병', '질서 없이 모인 오합지졸', '훈련된 군대', '강한 병사'],
    correct: 1,
    koreanLevel: 6,
    explanation: '烏(까마귀 오) 合(합할 합) 之(갈 지) 卒(군사 졸) - 까마귀떼처럼 모인 군사. 질서 없이 모인 무리',
    example: '예문: 오합지졸에 불과하다.'
  },
  {
    word: '옥석혼효(玉石混淆)',
    question: '<span class="word-highlight">옥석혼효(玉石混淆)</span>의 뜻은?',
    hint: '옥과 돌이 섞임',
    choices: ['분별됨', '좋은 것과 나쁜 것이 뒤섞임', '구별됨', '정리됨'],
    correct: 1,
    koreanLevel: 6,
    explanation: '玉(구슬 옥) 石(돌 석) 混(섞일 혼) 淆(어지러울 효) - 옥과 돌이 섞임. 좋고 나쁜 것이 뒤섞임',
    example: '예문: 옥석혼효한 상태다.'
  },
  {
    word: '와신상담(臥薪嘗膽)',
    question: '<span class="word-highlight">와신상담(臥薪嘗膽)</span>의 뜻은?',
    hint: '섶에 눕고 쓸개를 맛봄',
    choices: ['편하게 지냄', '복수를 위해 고난을 참음', '안락함', '여유로움'],
    correct: 1,
    koreanLevel: 6,
    explanation: '臥(누울 와) 薪(섶 신) 嘗(맛볼 상) 膽(쓸개 담) - 섶에 눕고 쓸개를 맛봄. 복수를 위해 고난을 참음',
    example: '예문: 와신상담의 각오로 버텼다.'
  },
  {
    word: '완물상지(玩物喪志)',
    question: '<span class="word-highlight">완물상지(玩物喪志)</span>의 뜻은?',
    hint: '물건을 가지고 놀다 뜻을 잃음',
    choices: ['집중함', '쓸데없는 것에 빠져 본뜻을 잃음', '목표 달성', '성공함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '玩(희롱할 완) 物(물건 물) 喪(잃을 상) 志(뜻 지) - 쓸데없는 것에 빠져 본뜻을 잃음',
    example: '예문: 완물상지하지 마라.'
  },
  {
    word: '외유내강(外柔內剛)',
    question: '<span class="word-highlight">외유내강(外柔內剛)</span>의 뜻은?',
    hint: '밖은 부드럽고 안은 강함',
    choices: ['겉만 강함', '겉은 부드러우나 속은 강함', '속도 약함', '겉도 약함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '外(바깥 외) 柔(부드러울 유) 內(안 내) 剛(굳셀 강) - 겉은 부드러우나 속은 강함',
    example: '예문: 외유내강한 사람이다.'
  },
  {
    word: '요산요수(樂山樂水)',
    question: '<span class="word-highlight">요산요수(樂山樂水)</span>의 뜻은?',
    hint: '산을 좋아하고 물을 좋아함',
    choices: ['자연 싫어함', '자연을 즐기고 좋아함', '도시 선호', '자연 무관심'],
    correct: 1,
    koreanLevel: 6,
    explanation: '樂(즐길 요) 山(뫼 산) 樂(즐길 요) 水(물 수) - 산과 물을 좋아하고 즐김. 자연을 즐김',
    example: '예문: 요산요수하며 지냈다.'
  },
  {
    word: '요지부동(搖之不動)',
    question: '<span class="word-highlight">요지부동(搖之不動)</span>의 뜻은?',
    hint: '흔들어도 움직이지 않음',
    choices: ['흔들림', '꿈쩍도 하지 않음', '변함', '움직임'],
    correct: 1,
    koreanLevel: 6,
    explanation: '搖(흔들 요) 之(갈 지) 不(아닐 불) 動(움직일 동) - 흔들어도 움직이지 않음. 완고함',
    example: '예문: 요지부동의 자세다.'
  },
  {
    word: '용두사미(龍頭蛇尾)',
    question: '<span class="word-highlight">용두사미(龍頭蛇尾)</span>의 뜻은?',
    hint: '용의 머리 뱀의 꼬리',
    choices: ['시작과 끝이 좋음', '시작은 거창하나 끝이 흐지부지됨', '완벽함', '일관됨'],
    correct: 1,
    koreanLevel: 6,
    explanation: '龍(용 용) 頭(머리 두) 蛇(뱀 사) 尾(꼬리 미) - 용의 머리에 뱀의 꼬리. 시작은 좋으나 끝이 흐지부지',
    example: '예문: 용두사미로 끝났다.'
  },
  {
    word: '우공이산(愚公移山)',
    question: '<span class="word-highlight">우공이산(愚公移山)</span>의 뜻은?',
    hint: '우공이 산을 옮김',
    choices: ['포기함', '끈기 있게 노력하면 큰일을 이룸', '단념함', '중단함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '愚(어리석을 우) 公(공변될 공) 移(옮길 이) 山(뫼 산) - 우공이 산을 옮김. 끈기 있는 노력으로 큰일을 이룸',
    example: '예문: 우공이산의 정신이다.'
  },
  {
    word: '우문현답(愚問賢答)',
    question: '<span class="word-highlight">우문현답(愚問賢答)</span>의 뜻은?',
    hint: '어리석은 물음 현명한 대답',
    choices: ['어리석은 답', '어리석은 물음에 현명한 대답', '현명한 물음', '좋은 질문'],
    correct: 1,
    koreanLevel: 6,
    explanation: '愚(어리석을 우) 問(물을 문) 賢(어질 현) 答(대답 답) - 어리석은 질문에 현명한 대답',
    example: '예문: 우문현답이네요.'
  },
  {
    word: '우왕좌왕(右往左往)',
    question: '<span class="word-highlight">우왕좌왕(右往左往)</span>의 뜻은?',
    hint: '오른쪽으로 갔다 왼쪽으로 갔다',
    choices: ['일관성', '이리저리 갈팡질팡함', '확실함', '결단력'],
    correct: 1,
    koreanLevel: 6,
    explanation: '右(오른 우) 往(갈 왕) 左(왼 좌) 往(갈 왕) - 이리저리 왔다 갔다 함. 갈팡질팡함',
    example: '예문: 우왕좌왕했다.'
  },
  {
    word: '우유부단(優柔不斷)',
    question: '<span class="word-highlight">우유부단(優柔不斷)</span>의 뜻은?',
    hint: '너무 부드러워 끊지 못함',
    choices: ['결단력 있음', '어물어물하여 결단을 내리지 못함', '신속함', '단호함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '優(넉넉할 우) 柔(부드러울 유) 不(아닐 불) 斷(끊을 단) - 결단을 내리지 못하고 어물어물함',
    example: '예문: 우유부단하게 굴었다.'
  },
  {
    word: '우이독경(牛耳讀經)',
    question: '<span class="word-highlight">우이독경(牛耳讀經)</span>의 뜻은?',
    hint: '소 귀에 경 읽기',
    choices: ['잘 알아듣음', '아무리 말해도 알아듣지 못함', '이해함', '깨달음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '牛(소 우) 耳(귀 이) 讀(읽을 독) 經(경전 경) - 소 귀에 경 읽기. 아무리 말해도 알아듣지 못함',
    example: '예문: 우이독경이다.'
  },
  {
    word: '우후죽순(雨後竹筍)',
    question: '<span class="word-highlight">우후죽순(雨後竹筍)</span>의 뜻은?',
    hint: '비 온 뒤 죽순',
    choices: ['드묾', '한꺼번에 많이 생겨남', '적음', '서서히'],
    correct: 1,
    koreanLevel: 6,
    explanation: '雨(비 우) 後(뒤 후) 竹(대나무 죽) 筍(죽순 순) - 비 온 뒤 죽순처럼 많이 생겨남',
    example: '예문: 우후죽순으로 생겨났다.'
  },
  {
    word: '유구무언(有口無言)',
    question: '<span class="word-highlight">유구무언(有口無言)</span>의 뜻은?',
    hint: '입이 있으나 말이 없음',
    choices: ['말이 많음', '변명할 말이 없음', '수다스러움', '떠들썩함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '有(있을 유) 口(입 구) 無(없을 무) 言(말씀 언) - 입은 있으나 말이 없음. 변명할 말이 없음',
    example: '예문: 유구무언이다.'
  },
  {
    word: '유비무환(有備無患)',
    question: '<span class="word-highlight">유비무환(有備無患)</span>의 뜻은?',
    hint: '준비가 있으면 걱정이 없음',
    choices: ['준비 안 함', '미리 준비하면 걱정이 없음', '걱정 많음', '불안함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '有(있을 유) 備(갖출 비) 無(없을 무) 患(근심 환) - 준비가 있으면 걱정이 없음',
    example: '예문: 유비무환이다.'
  },
  {
    word: '유언비어(流言蜚語)',
    question: '<span class="word-highlight">유언비어(流言蜚語)</span>의 뜻은?',
    hint: '떠도는 말 날아다니는 말',
    choices: ['사실', '근거 없이 떠도는 뜬소문', '진실', '정확한 정보'],
    correct: 1,
    koreanLevel: 6,
    explanation: '流(흐를 류) 言(말씀 언) 蜚(날 비) 語(말씀 어) - 근거 없이 떠도는 뜬소문',
    example: '예문: 유언비어를 퍼뜨렸다.'
  },
  {
    word: '유유자적(悠悠自適)',
    question: '<span class="word-highlight">유유자적(悠悠自適)</span>의 뜻은?',
    hint: '멀리 스스로 맞음',
    choices: ['바쁘게 살음', '속세를 떠나 유유히 지냄', '분주함', '정신없음'],
    correct: 1,
    koreanLevel: 6,
    explanation: '悠(멀 유) 悠(멀 유) 自(스스로 자) 適(맞을 적) - 속세를 떠나 유유히 자기 마음대로 지냄',
    example: '예문: 유유자적하게 살았다.'
  },
  {
    word: '유일무이(唯一無二)',
    question: '<span class="word-highlight">유일무이(唯一無二)</span>의 뜻은?',
    hint: '오직 하나뿐이고 둘이 없음',
    choices: ['많음', '오직 하나뿐임', '흔함', '여럿'],
    correct: 1,
    koreanLevel: 6,
    explanation: '唯(오직 유) 一(한 일) 無(없을 무) 二(두 이) - 오직 하나뿐이고 둘이 없음',
    example: '예문: 유일무이한 존재다.'
  },
  {
    word: '음풍농월(吟風弄月)',
    question: '<span class="word-highlight">음풍농월(吟風弄月)</span>의 뜻은?',
    hint: '바람을 읊고 달을 희롱함',
    choices: ['바쁘게 일함', '자연을 벗 삼아 시를 짓고 즐김', '일에 매진', '노동함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '吟(읊을 음) 風(바람 풍) 弄(희롱할 농) 月(달 월) - 바람과 달을 즐기며 시를 읊음',
    example: '예문: 음풍농월하며 지냈다.'
  },
  {
    word: '의기양양(意氣揚揚)',
    question: '<span class="word-highlight">의기양양(意氣揚揚)</span>의 뜻은?',
    hint: '의기가 날리고 날림',
    choices: ['기가 죽음', '의기가 높아 으쓱대는 모양', '우울함', '침울함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '意(뜻 의) 氣(기운 기) 揚(날릴 양) 揚(날릴 양) - 의기가 높아 씩씩하고 자랑스러운 모양',
    example: '예문: 의기양양하게 나타났다.'
  },
  {
    word: '의기투합(意氣投合)',
    question: '<span class="word-highlight">의기투합(意氣投合)</span>의 뜻은?',
    hint: '의기가 투하여 합침',
    choices: ['의견 충돌', '서로 뜻이 맞음', '반대함', '다툼'],
    correct: 1,
    koreanLevel: 6,
    explanation: '意(뜻 의) 氣(기운 기) 投(던질 투) 合(합할 합) - 서로 뜻과 기분이 맞음',
    example: '예문: 의기투합했다.'
  },
  {
    word: '이구동성(異口同聲)',
    question: '<span class="word-highlight">이구동성(異口同聲)</span>의 뜻은?',
    hint: '다른 입 같은 소리',
    choices: ['의견 다름', '여러 사람이 한목소리로 말함', '반대 의견', '논쟁'],
    correct: 1,
    koreanLevel: 6,
    explanation: '異(다를 이) 口(입 구) 同(같을 동) 聲(소리 성) - 다른 입에서 같은 소리. 여러 사람이 한목소리로 말함',
    example: '예문: 이구동성으로 찬성했다.'
  },
  {
    word: '이심전심(以心傳心)',
    question: '<span class="word-highlight">이심전심(以心傳心)</span>의 뜻은?',
    hint: '마음으로써 마음에 전함',
    choices: ['말로 전함', '말 없이 마음으로 통함', '글로 전함', '소리로 전함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '以(써 이) 心(마음 심) 傳(전할 전) 心(마음 심) - 마음에서 마음으로 전함. 말 없이 마음이 통함',
    example: '예문: 이심전심으로 알았다.'
  },
  {
    word: '이열치열(以熱治熱)',
    question: '<span class="word-highlight">이열치열(以熱治熱)</span>의 뜻은?',
    hint: '열로써 열을 다스림',
    choices: ['반대로 대응', '같은 것으로 같은 것을 다스림', '다르게 대처', '피함'],
    correct: 1,
    koreanLevel: 6,
    explanation: '以(써 이) 熱(더울 열) 治(다스릴 치) 熱(더울 열) - 열로써 열을 다스림',
    example: '예문: 이열치열로 더위를 이겼다.'
  },
  {
    word: '인과응보(因果應報)',
    question: '<span class="word-highlight">인과응보(因果應報)</span>의 뜻은?',
    hint: '원인과 결과가 응하여 갚음',
    choices: ['우연', '행한 대로 갚음을 받음', '관계없음', '무작위'],
    correct: 1,
    koreanLevel: 6,
    explanation: '因(인할 인) 果(열매 과) 應(응할 응) 報(갚을 보) - 원인에 따라 결과가 옴. 선악에 따른 보응',
    example: '예문: 인과응보다.'
  }
];

console.log('한자성어 데이터 로드 완료:', HANJA_IDIOM_DATA.length, '개');

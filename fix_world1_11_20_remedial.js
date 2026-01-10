const fs = require('fs');
const path = require('path');

// world1_11~20 보완학습 데이터
// 11: 피터 팬, 12: 로빈슨 크루소, 13: 걸리버 여행기, 14: 톰 소여의 모험, 15: 백설공주
// 16: 신데렐라, 17: 인어공주, 18: 잠자는 숲속의 공주, 19: 빨간 모자, 20: 헨젤과 그레텔

const remedialData = {
  world1_11: { // 피터 팬
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "피터 팬의 특징은?", options: ["영원히 어린이로 남음","빨리 어른이 됨","힘이 셈","날지 못함"], answer: 0, explanation: "피터 팬은 나이를 먹지 않고 영원히 어린이입니다." },
        { q: "피터 팬이 사는 곳은?", options: ["네버랜드","영국","미국","프랑스"], answer: 0, explanation: "피터 팬은 네버랜드에서 삽니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "피터 팬의 장르는?", options: ["판타지 동화","역사 소설","추리 소설","공포 소설"], answer: 0, explanation: "마법의 세계를 배경으로 한 판타지 동화입니다." },
        { q: "웬디가 현실로 돌아오는 것은 무엇을 의미하나?", options: ["성장의 불가피함","모험의 끝","실패","포기"], answer: 0, explanation: "결국 어른이 되어야 함을 상징합니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'네버랜드(Neverland)'의 의미는?", options: ["결코 없는 땅, 환상의 나라","진짜 나라","역사적 장소","바다 이름"], answer: 0, explanation: "현실에 없는 환상의 세계를 의미합니다." },
        { q: "'영원히'의 뜻은?", options: ["끝없이 계속","잠깐","가끔","어쩌다"], answer: 0, explanation: "끝이 없이 계속된다는 의미입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "피터 팬이 어른이 되지 않으려는 이유는?", options: ["어른의 세계를 거부함","병 때문에","마법 때문에","모름"], answer: 0, explanation: "책임과 규칙이 많은 어른 세계를 거부합니다." },
        { q: "후크 선장이 상징하는 것은?", options: ["어른 세계의 위협","친구","도움","행복"], answer: 0, explanation: "어린이를 위협하는 어른 세계를 상징합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "피터 팬이 전하는 메시지는?", options: ["동심을 잃지 말라","어른이 되지 마라","현실을 피해라","혼자 살아라"], answer: 0, explanation: "어른이 되어도 동심을 간직하라는 메시지입니다." },
        { q: "이 작품의 한계로 볼 수 있는 것은?", options: ["성장을 부정적으로만 봄","너무 현실적","교훈 없음","재미없음"], answer: 0, explanation: "성장의 긍정적 측면을 간과할 수 있습니다." }
      ]
    }
  },
  world1_12: { // 로빈슨 크루소
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "로빈슨이 무인도에서 생존한 방법은?", options: ["스스로 노력함","누군가 도와줌","마법을 사용함","금방 구조됨"], answer: 0, explanation: "혼자 힘으로 집을 짓고 농사를 지으며 생존했습니다." },
        { q: "프라이데이는 누구인가?", options: ["로빈슨이 구한 원주민","로빈슨의 친구","배의 선장","동물"], answer: 0, explanation: "로빈슨이 식인종에게서 구해준 원주민입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "로빈슨 크루소의 장르는?", options: ["모험 소설","로맨스","공포 소설","시"], answer: 0, explanation: "무인도 생존을 다룬 모험 소설입니다." },
        { q: "로빈슨의 28년 생존기는 어떤 구조인가?", options: ["시련과 극복의 반복","단순 나열","역순 전개","열린 결말"], answer: 0, explanation: "어려움을 극복해 나가는 과정이 반복됩니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'표류(漂流)'의 뜻은?", options: ["물에 떠서 흘러감","수영함","잠수함","항해함"], answer: 0, explanation: "물 위를 떠서 흘러가는 것입니다." },
        { q: "'자립(自立)'의 의미는?", options: ["스스로 힘으로 섬","남에게 의지함","포기함","실패함"], answer: 0, explanation: "다른 사람의 도움 없이 스스로 사는 것입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "로빈슨이 28년을 버틸 수 있었던 힘은?", options: ["희망과 노력","운만","마법","외부 도움"], answer: 0, explanation: "포기하지 않는 희망과 끊임없는 노력입니다." },
        { q: "프라이데이와의 관계가 보여주는 것은?", options: ["인간의 사회성","혼자가 최고","문명의 우월성","자연의 힘"], answer: 0, explanation: "인간은 사회적 존재임을 보여줍니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "로빈슨 크루소가 전하는 가치는?", options: ["자립과 인내","의존","포기","운명"], answer: 0, explanation: "스스로의 힘으로 어려움을 극복하는 가치입니다." },
        { q: "이 작품에 대한 비판적 시각은?", options: ["식민주의적 관점","너무 짧음","재미없음","교훈 없음"], answer: 0, explanation: "프라이데이를 대하는 태도에서 식민주의적 관점이 보입니다." }
      ]
    }
  },
  world1_13: { // 걸리버 여행기
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "걸리버가 릴리퍼트에서 깨어났을 때 상황은?", options: ["소인들에게 묶여 있었다","자유롭게 돌아다녔다","집에 있었다","배 위에 있었다"], answer: 0, explanation: "작은 줄로 몸이 묶여 있고 소인들이 둘러싸고 있었습니다." },
        { q: "브롭딩낵 나라의 특징은?", options: ["거인들의 나라","소인들의 나라","동물의 나라","로봇의 나라"], answer: 0, explanation: "걸리버보다 훨씬 큰 거인들이 사는 나라입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "걸리버 여행기의 장르는?", options: ["풍자 소설","로맨스","공포 소설","역사 소설"], answer: 0, explanation: "사회를 비판하는 풍자 소설입니다." },
        { q: "여러 나라를 여행하는 구조의 효과는?", options: ["다양한 관점에서 인간 사회 비판","단순한 모험","지리 학습","역사 기록"], answer: 0, explanation: "각 나라를 통해 인간 사회의 다양한 문제를 비판합니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'풍자(諷刺)'의 뜻은?", options: ["비꼬아 비판함","칭찬함","무시함","동의함"], answer: 0, explanation: "문제점을 빗대어 비판하는 것입니다." },
        { q: "'릴리퍼트'가 상징하는 것은?", options: ["옹졸한 인간 사회","이상적 사회","미래 사회","과거 사회"], answer: 0, explanation: "사소한 일로 다투는 옹졸한 인간 사회를 상징합니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "소인국 전쟁의 원인(달걀 깨는 방법)이 풍자하는 것은?", options: ["사소한 이유로 싸우는 인간","진지한 갈등","자연재해","운명"], answer: 0, explanation: "하찮은 이유로 전쟁하는 인간의 어리석음을 풍자합니다." },
        { q: "거인국에서 걸리버가 작아 보이는 것의 의미는?", options: ["인간의 보잘것없음","우연","착시","꿈"], answer: 0, explanation: "거인의 눈에는 인간이 보잘것없어 보임을 보여줍니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "걸리버 여행기가 비판하는 것은?", options: ["인간 사회의 어리석음","자연","동물","날씨"], answer: 0, explanation: "전쟁, 정치, 과학 등 인간 사회의 문제를 비판합니다." },
        { q: "풍자 문학의 가치는?", options: ["사회 문제를 재미있게 비판","단순 오락","역사 기록","자연 묘사"], answer: 0, explanation: "재미있는 이야기로 사회 문제를 지적합니다." }
      ]
    }
  },
  world1_14: { // 톰 소여의 모험
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "톰이 묘지에서 목격한 것은?", options: ["살인 사건","보물","유령","동물"], answer: 0, explanation: "톰은 묘지에서 인디언 조의 살인을 목격했습니다." },
        { q: "톰의 가장 친한 친구는?", options: ["허클베리 핀","베키","폴리 이모","인디언 조"], answer: 0, explanation: "부랑아 허클베리 핀이 톰의 절친입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "톰 소여의 모험의 장르는?", options: ["성장/모험 소설","공포 소설","로맨스","역사 소설"], answer: 0, explanation: "소년의 성장을 다룬 모험 소설입니다." },
        { q: "톰의 장난과 모험이 보여주는 것은?", options: ["어린 시절의 자유로움","어른의 지혜","사회 질서","역사적 사건"], answer: 0, explanation: "규칙에 얽매이지 않는 어린 시절을 보여줍니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'모험(冒險)'의 뜻은?", options: ["위험을 무릅쓰고 행함","안전하게 지냄","공부함","일함"], answer: 0, explanation: "위험을 감수하고 새로운 일을 하는 것입니다." },
        { q: "'목격(目擊)'의 의미는?", options: ["직접 눈으로 봄","들음","상상함","꿈꿈"], answer: 0, explanation: "자기 눈으로 직접 보는 것입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "톰이 진실을 증언한 이유는?", options: ["정의감과 용기","보상을 위해","강요당해서","재미로"], answer: 0, explanation: "무고한 사람을 구하려는 정의감과 용기입니다." },
        { q: "톰과 허크의 우정이 보여주는 것은?", options: ["신분을 초월한 진정한 우정","이익 관계","일시적 관계","경쟁"], answer: 0, explanation: "사회적 지위와 관계없는 진정한 우정입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "톰 소여의 모험이 전하는 가치는?", options: ["자유로움과 정의감","복종","물질적 성공","어른 흉내"], answer: 0, explanation: "자유로운 어린 시절과 정의감의 가치입니다." },
        { q: "마크 트웨인이 비판하는 것은?", options: ["위선적인 어른 사회","어린이","자연","과학"], answer: 0, explanation: "형식적이고 위선적인 어른들의 세계를 비판합니다." }
      ]
    }
  },
  world1_15: { // 백설공주
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "새어머니가 백설공주를 미워한 이유는?", options: ["백설공주가 더 예뻐서","말을 안 들어서","게을러서","거짓말해서"], answer: 0, explanation: "거울이 백설공주가 더 아름답다고 말했기 때문입니다." },
        { q: "백설공주를 도와준 존재는?", options: ["일곱 난쟁이","왕","숲속 동물","요정"], answer: 0, explanation: "숲속에 사는 일곱 난쟁이가 도와주었습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "백설공주의 장르는?", options: ["동화/민담","역사 소설","추리 소설","공포 소설"], answer: 0, explanation: "그림 형제가 정리한 민담/동화입니다." },
        { q: "왕자의 등장은 서사에서 어떤 역할인가?", options: ["구원자/해결자","악역","조연","배경 인물"], answer: 0, explanation: "백설공주를 깨워 문제를 해결하는 구원자입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'질투(嫉妬)'의 뜻은?", options: ["남의 좋은 점을 시기함","기뻐함","축하함","무관심함"], answer: 0, explanation: "남이 잘되는 것을 부러워하고 미워하는 것입니다." },
        { q: "'독(毒)'의 의미는?", options: ["해로운 물질","약","음식","음료"], answer: 0, explanation: "몸에 해를 끼치는 물질입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "왕비가 거울에 집착한 이유는?", options: ["외모에 대한 허영심","정보 수집","습관","우연"], answer: 0, explanation: "아름다움에 대한 지나친 집착과 허영심입니다." },
        { q: "독사과가 상징하는 것은?", options: ["겉모습에 속는 위험","맛있는 음식","건강","행복"], answer: 0, explanation: "아름다운 겉모습에 숨은 위험을 상징합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "백설공주가 전하는 교훈은?", options: ["선은 승리하고 악은 벌받는다","외모가 최고다","남을 믿지 마라","혼자 살아라"], answer: 0, explanation: "권선징악의 교훈을 담고 있습니다." },
        { q: "현대적 관점에서의 비판은?", options: ["외모 중심적 가치관","너무 짧음","재미없음","교훈 없음"], answer: 0, explanation: "아름다움에 과도한 가치를 두는 점이 비판됩니다." }
      ]
    }
  },
  world1_16: { // 신데렐라
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "신데렐라가 무도회에 갈 수 있게 된 계기는?", options: ["요정의 도움","새어머니의 허락","돈을 벌어서","왕자의 초대"], answer: 0, explanation: "요정 대모가 마법으로 드레스와 마차를 만들어 주었습니다." },
        { q: "신데렐라가 12시 전에 돌아와야 했던 이유는?", options: ["마법이 풀리기 때문","약속 때문","피곤해서","싫어서"], answer: 0, explanation: "12시가 되면 마법이 풀리기 때문입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "신데렐라의 장르는?", options: ["동화/민담","역사 소설","추리 소설","공포 소설"], answer: 0, explanation: "전 세계에 퍼진 민담/동화입니다." },
        { q: "유리 구두의 역할은?", options: ["신원 확인의 증거","장식품","마법 도구","무기"], answer: 0, explanation: "신데렐라를 찾는 결정적 증거입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'신데렐라(Cinderella)'의 어원은?", options: ["재 속의 소녀","아름다운 소녀","부자 소녀","행복한 소녀"], answer: 0, explanation: "재(cinder) 속에서 일하는 소녀라는 뜻입니다." },
        { q: "'무도회(舞蹈會)'의 의미는?", options: ["춤을 추는 파티","운동 경기","회의","식사 모임"], answer: 0, explanation: "춤을 추며 즐기는 사교 파티입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "신데렐라가 행복해질 수 있었던 이유는?", options: ["선한 마음과 인내","마법만","운만","외모만"], answer: 0, explanation: "어려움 속에서도 선한 마음을 유지했기 때문입니다." },
        { q: "유리 구두가 신데렐라에게만 맞은 이유는?", options: ["운명적 사랑을 상징","발이 작아서","마법 때문","우연"], answer: 0, explanation: "오직 그녀만을 위한 운명적 사랑을 상징합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "신데렐라가 전하는 교훈은?", options: ["인내와 선함은 보상받는다","외모가 최고다","마법에 의지하라","복수하라"], answer: 0, explanation: "착하게 살면 결국 보상받는다는 교훈입니다." },
        { q: "현대적 관점에서의 비판은?", options: ["수동적 여성상","너무 긴 이야기","재미없음","교훈 없음"], answer: 0, explanation: "스스로 운명을 개척하지 않는 점이 비판됩니다." }
      ]
    }
  },
  world1_17: { // 인어공주
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "인어공주가 다리를 얻은 대가는?", options: ["목소리를 잃음","기억을 잃음","힘을 잃음","눈을 잃음"], answer: 0, explanation: "바다 마녀에게 목소리를 주고 다리를 얻었습니다." },
        { q: "인어공주의 결말은?", options: ["물거품이 됨","왕자와 결혼","바다로 돌아감","마녀가 됨"], answer: 0, explanation: "원작에서 인어공주는 물거품이 됩니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "인어공주의 장르는?", options: ["비극적 동화","희극","역사 소설","추리 소설"], answer: 0, explanation: "슬픈 결말을 가진 안데르센의 동화입니다." },
        { q: "인어공주의 선택들이 보여주는 것은?", options: ["사랑을 위한 희생","이기심","분노","복수"], answer: 0, explanation: "사랑을 위해 모든 것을 희생하는 모습입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'희생(犧牲)'의 뜻은?", options: ["남을 위해 자신을 버림","이기적 행동","무관심","분노"], answer: 0, explanation: "다른 사람이나 목적을 위해 자신을 바치는 것입니다." },
        { q: "'물거품'이 상징하는 것은?", options: ["허무한 소멸","새 시작","성공","행복"], answer: 0, explanation: "흔적 없이 사라지는 허무함을 상징합니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "인어공주가 왕자를 죽이지 않은 이유는?", options: ["진정한 사랑이기 때문","힘이 없어서","기회가 없어서","잊어버려서"], answer: 0, explanation: "진정으로 사랑했기에 해칠 수 없었습니다." },
        { q: "비극적 결말이 주는 효과는?", options: ["사랑의 숭고함 강조","단순한 슬픔","분노 유발","무관심"], answer: 0, explanation: "희생적 사랑의 숭고함을 더 강하게 전달합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "인어공주가 전하는 메시지는?", options: ["진정한 사랑의 가치","포기의 미덕","복수의 정당성","물질의 중요성"], answer: 0, explanation: "대가 없이 주는 사랑의 숭고함을 전합니다." },
        { q: "현대적 관점에서의 비판은?", options: ["일방적 희생 미화","너무 행복함","재미없음","교훈 없음"], answer: 0, explanation: "여성의 일방적 희생을 미화한다는 비판이 있습니다." }
      ]
    }
  },
  world1_18: { // 잠자는 숲속의 공주
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "공주가 100년 동안 잠든 이유는?", options: ["초대받지 못한 요정의 저주","피곤해서","병에 걸려서","마법사의 장난"], answer: 0, explanation: "파티에 초대받지 못한 요정이 저주를 내렸습니다." },
        { q: "공주를 깨운 것은?", options: ["왕자의 키스","약","마법","시간"], answer: 0, explanation: "진정한 사랑의 키스로 잠에서 깨어났습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "잠자는 숲속의 공주의 장르는?", options: ["동화/민담","역사 소설","추리 소설","공포 소설"], answer: 0, explanation: "유럽에 전해지는 민담/동화입니다." },
        { q: "저주와 해제의 구조가 보여주는 것은?", options: ["선과 악의 대립","단순한 사건","역사적 사실","과학적 현상"], answer: 0, explanation: "악의 저주를 선이 극복하는 구조입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'저주(詛呪)'의 뜻은?", options: ["나쁜 일이 일어나길 빎","축복","선물","칭찬"], answer: 0, explanation: "남에게 나쁜 일이 생기기를 바라는 것입니다." },
        { q: "'영원(永遠)'의 의미는?", options: ["끝이 없이 계속됨","잠깐","가끔","드물게"], answer: 0, explanation: "시간의 제한 없이 계속되는 것입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "13번째 요정이 저주를 내린 이유는?", options: ["초대받지 못한 분노","원래 악해서","명령을 받아서","장난으로"], answer: 0, explanation: "혼자만 초대받지 못한 것에 대한 분노입니다." },
        { q: "진정한 사랑의 키스가 의미하는 것은?", options: ["사랑의 힘이 저주를 깸","우연","마법","기술"], answer: 0, explanation: "진정한 사랑이 어떤 저주도 이긴다는 의미입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "이 동화가 전하는 교훈은?", options: ["사랑은 악을 이긴다","잠을 많이 자라","요정을 조심하라","파티를 하지 마라"], answer: 0, explanation: "진정한 사랑의 힘은 어떤 악도 이긴다는 것입니다." },
        { q: "현대적 관점에서의 비판은?", options: ["수동적으로 구원받는 여성상","너무 짧음","재미없음","교훈 없음"], answer: 0, explanation: "공주가 스스로 아무것도 하지 않는 점이 비판됩니다." }
      ]
    }
  },
  world1_19: { // 빨간 모자
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "빨간 모자가 늑대에게 속은 이유는?", options: ["엄마 말을 듣지 않아서","눈이 나빠서","귀가 안 들려서","늑대가 없어서"], answer: 0, explanation: "낯선 사람과 이야기하지 말라는 엄마 말을 어겼습니다." },
        { q: "할머니와 빨간 모자를 구한 사람은?", options: ["사냥꾼","아버지","이웃","왕자"], answer: 0, explanation: "사냥꾼이 늑대 배를 갈라 구해주었습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "빨간 모자의 장르는?", options: ["교훈 동화","역사 소설","추리 소설","로맨스"], answer: 0, explanation: "어린이에게 교훈을 주는 동화입니다." },
        { q: "늑대가 할머니로 변장한 것은 무엇을 상징하나?", options: ["겉모습에 속는 위험","친절함","도움","사랑"], answer: 0, explanation: "겉모습만 보고 믿으면 안 된다는 것을 상징합니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'경계(警戒)'의 뜻은?", options: ["조심하고 주의함","무시함","신뢰함","좋아함"], answer: 0, explanation: "위험에 대비하여 주의하는 것입니다." },
        { q: "'변장(變裝)'의 의미는?", options: ["다른 모습으로 꾸밈","진짜 모습","예쁘게 꾸밈","못생기게 꾸밈"], answer: 0, explanation: "본래 모습을 감추고 다른 모습으로 바꾸는 것입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "이 이야기가 어린이에게 주는 경고는?", options: ["낯선 사람을 조심하라","숲에 가지 마라","할머니를 만나지 마라","빨간색을 피하라"], answer: 0, explanation: "낯선 사람의 유혹에 넘어가지 말라는 경고입니다." },
        { q: "늑대가 상징하는 것은?", options: ["위험한 낯선 사람","귀여운 동물","친구","가족"], answer: 0, explanation: "어린이를 노리는 위험한 존재를 상징합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "빨간 모자가 전하는 교훈은?", options: ["어른 말을 듣고 조심하라","모험하라","낯선 사람과 친해지라","혼자 다녀라"], answer: 0, explanation: "부모님 말씀을 듣고 조심하라는 교훈입니다." },
        { q: "이 동화의 교육적 효과는?", options: ["안전 의식 교육","지리 교육","역사 교육","수학 교육"], answer: 0, explanation: "어린이에게 안전 의식을 심어줍니다." }
      ]
    }
  },
  world1_20: { // 헨젤과 그레텔
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "헨젤이 빵 부스러기로 길을 표시한 결과는?", options: ["새들이 먹어서 실패함","성공함","부모가 찾음","마녀가 도와줌"], answer: 0, explanation: "새들이 빵 부스러기를 먹어서 길을 잃었습니다." },
        { q: "과자집의 주인은?", options: ["마녀","요정","할머니","공주"], answer: 0, explanation: "아이들을 잡아먹으려는 마녀가 살고 있었습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "헨젤과 그레텔의 장르는?", options: ["동화/민담","역사 소설","추리 소설","로맨스"], answer: 0, explanation: "그림 형제가 수집한 민담/동화입니다." },
        { q: "아이들이 집을 떠나는 것은 서사에서 어떤 기능인가?", options: ["시련의 시작","행복한 결말","배경 설명","등장인물 소개"], answer: 0, explanation: "모험과 시련이 시작되는 계기입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'유혹(誘惑)'의 뜻은?", options: ["꾀어서 마음을 끎","도와줌","가르침","칭찬함"], answer: 0, explanation: "좋아 보이는 것으로 마음을 끄는 것입니다." },
        { q: "'기지(機智)'의 의미는?", options: ["재치 있는 지혜","힘","운","돈"], answer: 0, explanation: "상황에 맞게 재치 있게 대처하는 지혜입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "과자집이 상징하는 것은?", options: ["달콤하지만 위험한 유혹","안전한 집","평범한 집","학교"], answer: 0, explanation: "달콤해 보이지만 위험이 숨은 유혹을 상징합니다." },
        { q: "그레텔이 마녀를 물리친 것이 보여주는 것은?", options: ["지혜와 용기로 위기 극복","우연한 행운","마법의 힘","어른의 도움"], answer: 0, explanation: "어린이도 지혜와 용기로 위기를 극복할 수 있음을 보여줍니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "헨젤과 그레텔이 전하는 교훈은?", options: ["유혹에 빠지지 말고 지혜롭게 대처하라","과자를 먹지 마라","숲에 가지 마라","부모를 믿지 마라"], answer: 0, explanation: "위험한 유혹을 경계하고 지혜롭게 대처하라는 것입니다." },
        { q: "남매의 협력이 보여주는 것은?", options: ["함께하면 어려움을 극복할 수 있다","혼자가 최고다","어른에게 맡겨라","포기하라"], answer: 0, explanation: "협력의 힘으로 위기를 극복할 수 있음을 보여줍니다." }
      ]
    }
  }
};

// world1_11~20 파일에 보완학습 데이터 삽입
for (let i = 11; i <= 20; i++) {
  const num = String(i).padStart(2, '0');
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'worldlit', `world1_${num}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const key = `world1_${num}`;
  const data = remedialData[key];

  if (!data) {
    console.log(`[SKIP] ${key} 데이터 없음`);
    continue;
  }

  // 기존 REMEDIAL_BANK 블록 제거
  const existingPattern = /<!-- ✅ 보완학습 데이터 \(learning-common\.js 로드 전에 정의\) -->\s*<script>\s*window\.REMEDIAL_BANK = \{[\s\S]*?\};\s*<\/script>\s*/;
  if (existingPattern.test(content)) {
    content = content.replace(existingPattern, '');
    console.log(`[OK] world1_${num} 기존 REMEDIAL_BANK 블록 제거`);
  }

  // 새 REMEDIAL_BANK 삽입 (learning-common.js 로드 전)
  const remedialScript = `<!-- ✅ 보완학습 데이터 (learning-common.js 로드 전에 정의) -->
<script>
window.REMEDIAL_BANK = ${JSON.stringify(data, null, 2)};
</script>

`;

  const commonJsPattern = /<script src="\/assets\/js\/learning-common\.js[^"]*"><\/script>/;
  if (commonJsPattern.test(content)) {
    content = content.replace(commonJsPattern, (match) => remedialScript + match);
    console.log(`[OK] world1_${num} REMEDIAL_BANK 삽입 완료`);
  } else {
    console.log(`[WARN] world1_${num} learning-common.js 로드 패턴 없음`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

console.log('\n✅ world1_11~20 보완학습 데이터 삽입 완료!');

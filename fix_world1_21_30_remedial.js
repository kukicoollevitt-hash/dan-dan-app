const fs = require('fs');
const path = require('path');

// world1_21~30 보완학습 데이터
// 21: 라푼젤, 22: 잭과 콩나무, 23: 아기 돼지 삼형제, 24: 미운 오리 새끼, 25: 성냥팔이 소녀
// 26: 브레멘 음악대, 27: 개구리 왕자, 28: 피리 부는 사나이, 29: 장화 신은 고양이, 30: 엄지공주

const remedialData = {
  world1_21: { // 라푼젤
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "마녀가 라푼젤을 탑에 가둔 이유는?", options: ["독차지하려고","보호하려고","벌을 주려고","공부시키려고"], answer: 0, explanation: "마녀는 라푼젤을 자기만 갖고 싶어 탑에 가두었습니다." },
        { q: "왕자가 탑에 오른 방법은?", options: ["라푼젤의 긴 머리카락","사다리","마법","날아서"], answer: 0, explanation: "라푼젤의 긴 머리카락을 타고 탑에 올랐습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "라푼젤의 장르는?", options: ["동화/민담","역사 소설","추리 소설","공포 소설"], answer: 0, explanation: "그림 형제가 수집한 민담/동화입니다." },
        { q: "탑이 상징하는 것은?", options: ["세상으로부터의 격리","안전","자유","행복"], answer: 0, explanation: "외부 세계와 차단된 고립을 상징합니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'격리(隔離)'의 뜻은?", options: ["따로 떼어 둠","함께 함","모임","만남"], answer: 0, explanation: "다른 것과 떼어놓아 접촉하지 못하게 하는 것입니다." },
        { q: "'탐욕(貪慾)'의 의미는?", options: ["지나치게 욕심을 부림","만족함","나눔","배려"], answer: 0, explanation: "지나치게 욕심을 부리는 것입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "라푼젤의 눈물이 왕자의 눈을 치유한 것의 의미는?", options: ["진정한 사랑의 힘","우연","마법 약물","기적"], answer: 0, explanation: "진정한 사랑이 가진 치유의 힘을 상징합니다." },
        { q: "마녀의 집착이 결국 가져온 결과는?", options: ["모든 것을 잃음","성공","행복","평화"], answer: 0, explanation: "지나친 집착은 결국 실패로 이어졌습니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "라푼젤이 전하는 교훈은?", options: ["사랑은 어떤 장애도 극복한다","집에 있어라","어른 말을 들어라","혼자 살아라"], answer: 0, explanation: "진정한 사랑은 모든 장애를 극복한다는 것입니다." },
        { q: "마녀가 상징하는 것은?", options: ["과도한 집착과 소유욕","사랑","보호","친절"], answer: 0, explanation: "남을 가두고 소유하려는 지나친 욕심을 상징합니다." }
      ]
    }
  },
  world1_22: { // 잭과 콩나무
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "잭이 마법 콩을 심은 결과는?", options: ["하늘까지 닿는 콩나무가 자람","아무것도 안 남","꽃이 핌","채소가 자람"], answer: 0, explanation: "하룻밤 사이에 하늘까지 닿는 거대한 콩나무가 자랐습니다." },
        { q: "잭이 거인의 성에서 가져온 것은?", options: ["금화, 황금알 낳는 암탉, 하프","음식","옷","무기"], answer: 0, explanation: "금화, 황금알 낳는 암탉, 마법 하프를 가져왔습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "잭과 콩나무의 장르는?", options: ["모험 동화","역사 소설","추리 소설","로맨스"], answer: 0, explanation: "모험과 판타지가 결합된 동화입니다." },
        { q: "콩나무가 하늘로 뻗는 것은 무엇을 의미하나?", options: ["새로운 세계로의 통로","단순한 식물","장식","음식"], answer: 0, explanation: "일상에서 신비한 세계로 가는 통로입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'모험(冒險)'의 뜻은?", options: ["위험을 무릅쓰고 행함","안전하게 지냄","쉬는 것","포기함"], answer: 0, explanation: "위험을 감수하고 새로운 일을 하는 것입니다." },
        { q: "'탐욕(貪慾)'의 의미는?", options: ["지나친 욕심","만족","나눔","검소"], answer: 0, explanation: "지나치게 많이 가지려는 욕심입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "잭이 세 번이나 거인의 성에 간 이유는?", options: ["욕심이 커졌기 때문","호기심","의무","명령"], answer: 0, explanation: "처음에는 생존, 점점 욕심이 커졌습니다." },
        { q: "콩나무를 자른 것의 의미는?", options: ["위험과의 단절","실수","장난","우연"], answer: 0, explanation: "거인의 추격을 막고 위험을 차단하는 결단입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "잭과 콩나무가 전하는 교훈은?", options: ["용기와 기회 포착","도둑질 권장","위험 감수","거짓말"], answer: 0, explanation: "용기 있게 기회를 잡으라는 교훈입니다." },
        { q: "잭의 행동에 대한 비판적 시각은?", options: ["도둑질과 거짓말","영웅적 행동","완벽한 행동","모범적 행동"], answer: 0, explanation: "거인의 물건을 훔친 것은 비판받을 수 있습니다." }
      ]
    }
  },
  world1_23: { // 아기 돼지 삼형제
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "셋째 돼지가 지은 집의 재료는?", options: ["벽돌","짚","나무","풀"], answer: 0, explanation: "셋째 돼지는 시간을 들여 단단한 벽돌집을 지었습니다." },
        { q: "늑대가 집을 무너뜨린 방법은?", options: ["후~하고 불어서","밀어서","불을 질러서","물을 부어서"], answer: 0, explanation: "늑대가 강하게 불어서 짚집과 나무집이 무너졌습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "아기 돼지 삼형제의 장르는?", options: ["교훈 동화","역사 소설","추리 소설","공포 소설"], answer: 0, explanation: "교훈을 담은 동화입니다." },
        { q: "세 돼지의 집이 각각 다른 것은 무엇을 보여주나?", options: ["노력의 차이와 결과","취향 차이","재료 부족","우연"], answer: 0, explanation: "들인 노력에 따라 결과가 달라짐을 보여줍니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'성실(誠實)'의 뜻은?", options: ["정성껏 열심히 함","게으름","대충함","빨리함"], answer: 0, explanation: "진심을 다해 열심히 하는 것입니다." },
        { q: "'견고(堅固)'의 의미는?", options: ["단단하고 튼튼함","약함","부드러움","가벼움"], answer: 0, explanation: "단단하고 튼튼한 것입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "셋째 돼지가 성공한 이유는?", options: ["성실하게 준비했기 때문","운이 좋아서","형들의 도움","마법 때문에"], answer: 0, explanation: "시간이 걸려도 성실하게 튼튼한 집을 지었기 때문입니다." },
        { q: "첫째, 둘째 돼지가 실패한 이유는?", options: ["쉽고 빠른 방법만 선택","재료 부족","늑대가 더 강해서","운이 나빠서"], answer: 0, explanation: "쉽고 빠른 방법만 선택하여 대비가 부족했습니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "아기 돼지 삼형제가 전하는 교훈은?", options: ["성실하게 준비하면 어려움을 이긴다","빨리 끝내라","혼자 살아라","도망가라"], answer: 0, explanation: "성실한 준비가 어려움을 이기게 한다는 것입니다." },
        { q: "현대 사회에 주는 메시지는?", options: ["기초를 탄탄히 하라","대충 해도 된다","운에 맡겨라","남에게 의지하라"], answer: 0, explanation: "기초와 준비의 중요성을 알려줍니다." }
      ]
    }
  },
  world1_24: { // 미운 오리 새끼
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "미운 오리 새끼가 따돌림 받은 이유는?", options: ["다른 오리들과 달라서","게을러서","말을 안 들어서","못되게 굴어서"], answer: 0, explanation: "다른 오리들과 생김새가 달라서 따돌림 받았습니다." },
        { q: "미운 오리 새끼의 진짜 정체는?", options: ["백조","오리","거위","닭"], answer: 0, explanation: "사실은 아름다운 백조였습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "미운 오리 새끼의 장르는?", options: ["동화/우화","역사 소설","추리 소설","공포 소설"], answer: 0, explanation: "안데르센의 동화입니다." },
        { q: "계절의 변화가 의미하는 것은?", options: ["시간의 흐름과 성장","단순한 배경","날씨 변화","장식"], answer: 0, explanation: "시간이 지나며 성장하는 과정을 상징합니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'따돌림'의 뜻은?", options: ["무리에서 제외시킴","환영함","칭찬함","도와줌"], answer: 0, explanation: "무리에서 떼어 놓고 어울리지 못하게 하는 것입니다." },
        { q: "'정체(正體)'의 의미는?", options: ["본래의 모습","거짓 모습","변한 모습","꾸민 모습"], answer: 0, explanation: "본래의 참된 모습입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "미운 오리 새끼가 괴로웠던 진짜 이유는?", options: ["자신을 이해받지 못해서","배고파서","춥어서","심심해서"], answer: 0, explanation: "자신이 누구인지 몰랐고 인정받지 못했기 때문입니다." },
        { q: "백조가 된 것이 주는 메시지는?", options: ["진정한 자신을 발견하게 됨","외모가 변함","마법","운"], answer: 0, explanation: "진정한 자기 자신을 발견하는 것의 기쁨입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "미운 오리 새끼가 전하는 교훈은?", options: ["겉모습으로 판단하지 마라","예뻐지려 노력하라","무리에 맞춰라","참고 살아라"], answer: 0, explanation: "겉모습으로 판단하지 말고 진정한 가치를 보라는 것입니다." },
        { q: "현대 사회에 주는 메시지는?", options: ["다름을 인정하고 존중하라","똑같아지라","숨어 살아라","참고 견뎌라"], answer: 0, explanation: "다양성을 인정하고 존중해야 한다는 것입니다." }
      ]
    }
  },
  world1_25: { // 성냥팔이 소녀
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "소녀가 마지막 성냥을 켜자 나타난 것은?", options: ["돌아가신 할머니","부모님","왕자","요정"], answer: 0, explanation: "따뜻하게 자신을 안아주셨던 할머니가 나타났습니다." },
        { q: "소녀의 결말은?", options: ["추위 속에서 죽음","부자가 됨","구조됨","집으로 돌아감"], answer: 0, explanation: "추운 밤 거리에서 얼어 죽었습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "성냥팔이 소녀의 장르는?", options: ["비극적 동화","희극","영웅담","모험담"], answer: 0, explanation: "안데르센의 슬픈 동화입니다." },
        { q: "성냥불에 보이는 환상의 역할은?", options: ["소녀의 간절한 소망 표현","장식","공포 유발","웃음 유발"], answer: 0, explanation: "소녀가 바라는 것들을 보여줍니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'빈곤(貧困)'의 뜻은?", options: ["가난하고 어려움","부자","행복","건강"], answer: 0, explanation: "살림이 매우 가난하고 어려운 상태입니다." },
        { q: "'환상(幻想)'의 의미는?", options: ["현실이 아닌 상상","현실","역사","과학"], answer: 0, explanation: "실제가 아닌 상상 속의 것입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "성냥불에서 본 것들의 공통점은?", options: ["따뜻함과 사랑","공포","재미","모험"], answer: 0, explanation: "소녀가 갈망하는 따뜻함과 사랑입니다." },
        { q: "소녀가 미소 짓고 죽은 것의 의미는?", options: ["고통에서 해방됨","행복한 삶","구조됨","살아남"], answer: 0, explanation: "현실의 고통에서 벗어나 평화를 찾았다는 것입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "성냥팔이 소녀가 비판하는 것은?", options: ["가난한 자를 외면하는 사회","소녀의 게으름","부모","날씨"], answer: 0, explanation: "가난한 이웃을 외면하는 냉정한 사회를 비판합니다." },
        { q: "이 작품이 주는 메시지는?", options: ["사회적 약자를 돌봐야 함","스스로 노력하라","참고 견뎌라","운명을 받아들여라"], answer: 0, explanation: "힘없는 사람들에 대한 관심과 돌봄의 필요성입니다." }
      ]
    }
  },
  world1_26: { // 브레멘 음악대
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "네 동물이 브레멘으로 가려 한 이유는?", options: ["음악대가 되려고","먹이를 찾으러","주인을 찾으러","집을 찾으러"], answer: 0, explanation: "쫓겨난 동물들이 브레멘에서 음악대가 되려 했습니다." },
        { q: "네 동물은 각각 무엇인가?", options: ["당나귀, 개, 고양이, 수탉","소, 돼지, 닭, 말","양, 염소, 오리, 거위","토끼, 여우, 곰, 늑대"], answer: 0, explanation: "당나귀, 개, 고양이, 수탉입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "브레멘 음악대의 장르는?", options: ["동화/우화","역사 소설","추리 소설","공포 소설"], answer: 0, explanation: "그림 형제가 수집한 동화입니다." },
        { q: "동물들이 도적을 쫓아낸 방법이 보여주는 것은?", options: ["협동의 힘","개인의 힘","마법","운"], answer: 0, explanation: "함께 힘을 합치면 강해진다는 것입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'협동(協同)'의 뜻은?", options: ["함께 힘을 합침","혼자 함","경쟁함","방해함"], answer: 0, explanation: "여러 사람이 힘을 합쳐 일하는 것입니다." },
        { q: "'버림받다'의 의미는?", options: ["필요 없다고 내쳐짐","환영받음","칭찬받음","보호받음"], answer: 0, explanation: "쓸모없다고 여겨져 내침을 당하는 것입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "동물들이 버려진 이유는?", options: ["늙어서 쓸모없어졌기 때문","말을 안 들어서","못되게 굴어서","도망쳤기 때문"], answer: 0, explanation: "나이가 들어 일을 못하게 되자 버려졌습니다." },
        { q: "브레멘에 도착하지 않은 것의 의미는?", options: ["목표보다 함께하는 것이 중요","실패","포기","좌절"], answer: 0, explanation: "목표 달성보다 서로 의지하며 함께 사는 것이 중요합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "브레멘 음악대가 전하는 교훈은?", options: ["함께하면 어려움을 이길 수 있다","혼자가 최고","젊을 때가 좋다","포기하라"], answer: 0, explanation: "약자도 힘을 합치면 강해진다는 것입니다." },
        { q: "이 작품이 비판하는 것은?", options: ["쓸모없으면 버리는 태도","동물 사랑","우정","협동"], answer: 0, explanation: "늙고 쓸모없으면 버리는 이기적 태도를 비판합니다." }
      ]
    }
  },
  world1_27: { // 개구리 왕자
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "공주가 개구리와 약속을 한 이유는?", options: ["황금 공을 찾아달라고","친구가 되려고","노래를 들으려고","장난으로"], answer: 0, explanation: "우물에 빠진 황금 공을 찾아주는 대가로 약속했습니다." },
        { q: "개구리가 왕자로 변한 계기는?", options: ["공주가 던지자/키스하자","시간이 지나서","약을 먹어서","마법사의 도움"], answer: 0, explanation: "공주의 행동으로 마법이 풀렸습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "개구리 왕자의 장르는?", options: ["동화/민담","역사 소설","추리 소설","공포 소설"], answer: 0, explanation: "그림 형제가 수집한 민담/동화입니다." },
        { q: "마법에 걸린 왕자의 설정이 보여주는 것은?", options: ["겉모습과 본질의 차이","단순한 판타지","역사적 사실","과학적 현상"], answer: 0, explanation: "겉모습으로 판단하면 안 됨을 보여줍니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'약속(約束)'의 뜻은?", options: ["지키기로 한 다짐","거짓말","장난","농담"], answer: 0, explanation: "앞으로 어떤 일을 하기로 정하고 다짐하는 것입니다." },
        { q: "'본질(本質)'의 의미는?", options: ["가장 중요한 핵심","겉모습","크기","색깔"], answer: 0, explanation: "사물의 가장 근본적인 성질입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "공주가 약속을 지키기 싫어한 이유는?", options: ["개구리의 추한 외모 때문","바빠서","잊어서","아파서"], answer: 0, explanation: "징그러운 개구리와 함께하기 싫었습니다." },
        { q: "마법이 풀린 것이 의미하는 것은?", options: ["진심이 전해짐","우연","시간의 흐름","다른 마법"], answer: 0, explanation: "진심 어린 행동이 변화를 가져왔습니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "개구리 왕자가 전하는 교훈은?", options: ["약속을 지키고 겉모습으로 판단하지 마라","외모가 중요하다","거짓말해도 된다","약속은 안 지켜도 된다"], answer: 0, explanation: "약속을 지키고 겉모습으로 판단하지 말라는 것입니다." },
        { q: "현대적 관점에서 생각할 점은?", options: ["강요된 약속의 문제","완벽한 교훈","문제없음","현대와 무관"], answer: 0, explanation: "상황에 떠밀려 한 약속의 타당성도 생각해볼 수 있습니다." }
      ]
    }
  },
  world1_28: { // 피리 부는 사나이
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "마을 사람들이 사나이에게 약속을 어긴 결과는?", options: ["아이들이 사라짐","쥐가 돌아옴","금화를 받음","아무 일 없음"], answer: 0, explanation: "약속을 어기자 사나이가 피리를 불어 아이들을 데려갔습니다." },
        { q: "사나이가 처음에 한 일은?", options: ["피리로 쥐를 몰아냄","아이들을 가르침","음악 공연","장사"], answer: 0, explanation: "피리를 불어 마을의 쥐들을 강으로 몰아 없앴습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "피리 부는 사나이의 장르는?", options: ["전설/민담","역사 기록","추리 소설","로맨스"], answer: 0, explanation: "독일 하멜른에 전해지는 전설입니다." },
        { q: "마을 사람들의 약속 위반이 가져온 결과가 보여주는 것은?", options: ["약속의 중요성","우연","행운","무관함"], answer: 0, explanation: "약속을 어기면 대가를 치른다는 것입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'배신(背信)'의 뜻은?", options: ["약속이나 믿음을 저버림","지킴","도움","협력"], answer: 0, explanation: "신뢰나 약속을 저버리는 것입니다." },
        { q: "'대가(代價)'의 의미는?", options: ["행동에 대한 보상이나 결과","무료","선물","우연"], answer: 0, explanation: "어떤 일에 대해 치러야 하는 값입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "마을 사람들이 약속을 어긴 이유는?", options: ["욕심과 이기심","잊어서","아파서","못해서"], answer: 0, explanation: "약속한 돈이 아까웠기 때문입니다." },
        { q: "아이들이 사라진 것이 상징하는 것은?", options: ["미래를 잃음","단순한 벌","우연","자연재해"], answer: 0, explanation: "미래인 아이들을 잃는 것은 가장 큰 벌입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "피리 부는 사나이가 전하는 교훈은?", options: ["약속을 반드시 지켜라","거짓말해도 된다","돈이 최고다","남을 이용하라"], answer: 0, explanation: "약속을 지키지 않으면 큰 대가를 치른다는 것입니다." },
        { q: "사나이의 복수에 대한 생각은?", options: ["지나치지만 어른들의 책임","정당함","필요 없음","이해 안 됨"], answer: 0, explanation: "복수는 지나치지만 근본 원인은 어른들의 약속 위반입니다." }
      ]
    }
  },
  world1_29: { // 장화 신은 고양이
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "고양이가 마법사를 이긴 방법은?", options: ["쥐로 변하게 해서 잡아먹음","싸워서 이김","도망가게 함","협상함"], answer: 0, explanation: "마법사를 꾀어 쥐로 변하게 한 뒤 잡아먹었습니다." },
        { q: "고양이가 주인에게 부탁한 것은?", options: ["장화 한 켤레","음식","집","돈"], answer: 0, explanation: "장화 한 켤레만 달라고 했습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "장화 신은 고양이의 장르는?", options: ["동화/민담","역사 소설","추리 소설","공포 소설"], answer: 0, explanation: "샤를 페로의 동화입니다." },
        { q: "고양이의 계략들이 보여주는 것은?", options: ["지혜와 재치의 힘","운","마법","힘"], answer: 0, explanation: "힘보다 지혜가 중요함을 보여줍니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'지략(智略)'의 뜻은?", options: ["지혜로운 꾀","힘","운","돈"], answer: 0, explanation: "지혜롭게 일을 꾸미는 것입니다." },
        { q: "'충성(忠誠)'의 의미는?", options: ["진심으로 섬김","배신","무관심","거짓"], answer: 0, explanation: "진심을 다해 주인을 섬기는 것입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "고양이가 주인을 위해 노력한 이유는?", options: ["충성심과 감사","보상을 위해","강요","우연"], answer: 0, explanation: "자신을 키워준 주인에 대한 충성심입니다." },
        { q: "장화가 고양이에게 필요했던 이유는?", options: ["신뢰와 권위를 얻기 위해","예뻐서","따뜻해서","편해서"], answer: 0, explanation: "장화를 신고 격식을 갖춰 신뢰를 얻었습니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "장화 신은 고양이가 전하는 교훈은?", options: ["지혜와 충성의 가치","거짓말의 유용성","힘이 최고","돈이 최고"], answer: 0, explanation: "지혜와 충성심의 가치를 전합니다." },
        { q: "고양이의 방법에 대한 비판적 시각은?", options: ["거짓말과 속임수","완벽한 방법","문제없음","최선"], answer: 0, explanation: "거짓말과 속임수를 사용한 점은 비판될 수 있습니다." }
      ]
    }
  },
  world1_30: { // 엄지공주
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "엄지공주가 제비를 도운 결과는?", options: ["따뜻한 나라로 데려다 줌","아무 일 없음","두더지와 결혼함","집으로 돌아감"], answer: 0, explanation: "제비가 은혜를 갚아 따뜻한 나라로 데려다 주었습니다." },
        { q: "엄지공주의 크기는?", options: ["엄지손가락만 함","보통 크기","거인","아이 크기"], answer: 0, explanation: "엄지손가락만큼 아주 작았습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "엄지공주의 장르는?", options: ["동화","역사 소설","추리 소설","공포 소설"], answer: 0, explanation: "안데르센의 동화입니다." },
        { q: "엄지공주의 여정이 의미하는 것은?", options: ["시련 끝에 행복을 찾음","단순한 모험","실패","포기"], answer: 0, explanation: "많은 시련 끝에 진정한 행복을 찾는 과정입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'은혜(恩惠)'의 뜻은?", options: ["베풀어 준 고마운 일","나쁜 일","평범한 일","당연한 일"], answer: 0, explanation: "남에게 베푼 고마운 도움입니다." },
        { q: "'보은(報恩)'의 의미는?", options: ["받은 은혜를 갚음","무시함","잊음","배신함"], answer: 0, explanation: "받은 은혜에 보답하는 것입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "엄지공주가 여러 위기를 겪은 이유는?", options: ["작은 크기로 인한 약함","게을러서","나빠서","운이 없어서"], answer: 0, explanation: "작은 크기 때문에 여러 존재에게 위협받았습니다." },
        { q: "제비가 엄지공주를 도운 이유는?", options: ["받은 도움에 보답","의무","강요","우연"], answer: 0, explanation: "자신을 살려준 은혜에 보답한 것입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "엄지공주가 전하는 교훈은?", options: ["선한 마음은 결국 보상받는다","강해야 산다","남을 이용하라","포기하라"], answer: 0, explanation: "선한 마음으로 행동하면 좋은 결과가 온다는 것입니다." },
        { q: "은혜를 갚는 것의 가치는?", options: ["신뢰와 우정을 쌓음","이익","의무","부담"], answer: 0, explanation: "서로 돕고 은혜를 갚으면 아름다운 관계가 만들어집니다." }
      ]
    }
  }
};

// world1_21~30 파일에 보완학습 데이터 삽입
for (let i = 21; i <= 30; i++) {
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

  const existingPattern = /<!-- ✅ 보완학습 데이터 \(learning-common\.js 로드 전에 정의\) -->\s*<script>\s*window\.REMEDIAL_BANK = \{[\s\S]*?\};\s*<\/script>\s*/;
  if (existingPattern.test(content)) {
    content = content.replace(existingPattern, '');
    console.log(`[OK] world1_${num} 기존 REMEDIAL_BANK 블록 제거`);
  }

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

console.log('\n✅ world1_21~30 보완학습 데이터 삽입 완료!');

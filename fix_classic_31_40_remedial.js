const fs = require('fs');
const path = require('path');

// classic_31~40 보완학습 데이터 (on_classic 기준 작품명)
// 31: 구렁덩덩 신선비, 32: 바리데기, 33: 금방울전, 34: 유충렬전, 35: 조웅전
// 36: 소대성전, 37: 임경업전, 38: 적성의전, 39: 월영낭자전, 40: 이생규장전

const remedialData = {
  classic_31: { // 구렁덩덩 신선비
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "신선비의 정체는?", options: ["구렁이가 변한 것","원래 사람","신선","도깨비"], answer: 0, explanation: "구렁이가 사람으로 변한 것입니다." },
        { q: "셋째 딸이 신선비와 결혼한 이유는?", options: ["부모의 명을 따름","사랑에 빠짐","재물 때문","협박당함"], answer: 0, explanation: "부모의 말씀을 따라 결혼했습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "구렁덩덩 신선비의 서사 유형은?", options: ["이류교혼 설화","역사 소설","영웅 소설","풍자 소설"], answer: 0, explanation: "인간과 동물의 결혼담입니다." },
        { q: "허물을 태운 것은 이야기의 어느 부분에 해당하나?", options: ["위기","발단","전개","결말"], answer: 0, explanation: "허물을 태우면서 위기가 발생합니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'허물'의 뜻은?", options: ["벗는 껍질","죄","옷","집"], answer: 0, explanation: "뱀이나 구렁이가 벗는 껍질입니다." },
        { q: "'이류교혼'의 뜻은?", options: ["다른 종류와 결혼","이중 결혼","재혼","정략결혼"], answer: 0, explanation: "인간과 다른 종(동물, 신)의 결혼을 말합니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "신선비의 허물이 타버린 결과는?", options: ["다시 구렁이가 됨","더 잘생겨짐","죽음","변화 없음"], answer: 0, explanation: "허물이 타면서 영영 사람이 될 수 없게 되었습니다." },
        { q: "셋째 딸이 고난을 겪은 이유는?", options: ["약속을 어김","게으름","거짓말","도둑질"], answer: 0, explanation: "허물을 태우지 말라는 약속을 어겼습니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "이 설화가 전하는 교훈은?", options: ["약속의 중요성","재물의 가치","신분의 중요성","무력의 필요성"], answer: 0, explanation: "약속을 지키는 것의 중요성을 전합니다." },
        { q: "셋째 딸의 태도에서 배울 점은?", options: ["인내와 사랑","복수심","욕심","거짓말"], answer: 0, explanation: "어려움 속에서도 인내하며 사랑을 지켰습니다." }
      ]
    }
  },
  classic_32: { // 바리데기
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "바리데기가 생명수를 구하러 간 이유는?", options: ["부모님을 살리기 위해","자신을 위해","친구를 위해","나라를 위해"], answer: 0, explanation: "버림받았던 부모님을 살리기 위해 떠났습니다." },
        { q: "바리데기가 버림받은 이유는?", options: ["일곱째 딸이라서","장애가 있어서","병에 걸려서","못생겨서"], answer: 0, explanation: "아들을 원했지만 일곱째도 딸이라 버려졌습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "바리데기의 서사 유형은?", options: ["무속 신화","역사 소설","풍자 소설","판소리계 소설"], answer: 0, explanation: "무당의 기원을 설명하는 무속 신화입니다." },
        { q: "생명수를 찾는 여정은 이야기의 어느 부분인가?", options: ["전개","발단","절정","결말"], answer: 0, explanation: "여정을 통해 이야기가 전개됩니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'바리'의 뜻은?", options: ["버리다","받다","빌다","배우다"], answer: 0, explanation: "'버리다'에서 유래한 이름입니다." },
        { q: "'생명수'의 의미는?", options: ["죽은 이를 살리는 물","맛있는 물","강물","빗물"], answer: 0, explanation: "죽은 사람을 살릴 수 있는 신비한 물입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "바리데기가 부모를 용서한 이유는?", options: ["효심 때문에","보상을 원해서","복수를 위해","명령 때문에"], answer: 0, explanation: "원망보다 효심이 더 컸기 때문입니다." },
        { q: "바리데기가 무당신이 된 의미는?", options: ["고난 끝에 신성을 얻음","벌을 받음","평범해짐","사라짐"], answer: 0, explanation: "시련을 통해 신성한 존재가 되었습니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "바리데기 설화가 비판하는 것은?", options: ["남아선호 사상","불효","게으름","거짓말"], answer: 0, explanation: "딸이라고 버리는 남아선호 사상을 비판합니다." },
        { q: "바리데기의 행동에서 배울 점은?", options: ["용서와 효도","복수심","이기심","무관심"], answer: 0, explanation: "버림받았어도 부모를 용서하고 효도했습니다." }
      ]
    }
  },
  classic_33: { // 금방울전
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "금방울이 가진 특별한 능력은?", options: ["흔들면 신비한 일이 일어남","빛이 남","소리가 큼","무거움"], answer: 0, explanation: "금방울을 흔들면 신비한 일이 일어납니다." },
        { q: "해룡이 금방울을 얻은 경위는?", options: ["하늘에서 받음","시장에서 삼","훔침","만듦"], answer: 0, explanation: "하늘에서 내려온 신비한 물건입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "금방울전의 서사 유형은?", options: ["영웅 소설","풍자 소설","역사 소설","판소리계 소설"], answer: 0, explanation: "영웅의 일대기를 다룬 영웅 소설입니다." },
        { q: "금방울의 역할은 무엇인가?", options: ["영웅을 돕는 도구","장애물","적","배경"], answer: 0, explanation: "영웅이 위기를 극복하도록 돕습니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'신이(神異)'의 뜻은?", options: ["신비롭고 기이함","새로움","평범함","지루함"], answer: 0, explanation: "신비롭고 기이한 것을 말합니다." },
        { q: "'변신'의 의미는?", options: ["모습이 바뀜","사라짐","나타남","성장함"], answer: 0, explanation: "모습이 다르게 바뀌는 것입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "금방울 같은 도구가 등장하는 이유는?", options: ["영웅의 비범함을 강조","현실성을 높임","독자를 혼란시킴","작가의 실수"], answer: 0, explanation: "영웅의 비범한 능력을 보조합니다." },
        { q: "해룡이 고난을 극복할 수 있었던 이유는?", options: ["용기와 신이한 도움","행운만","체력만","재물만"], answer: 0, explanation: "용기와 신비한 도움으로 극복했습니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "금방울전이 전하는 가치는?", options: ["선한 사람의 승리","돈의 중요성","복수의 정당성","무력의 필요성"], answer: 0, explanation: "선한 영웅이 결국 승리한다는 가치를 담고 있습니다." },
        { q: "영웅 소설의 한계로 볼 수 있는 것은?", options: ["비현실적 요소가 많음","너무 현실적임","짧음","어려움"], answer: 0, explanation: "신이한 요소가 많아 비현실적입니다." }
      ]
    }
  },
  classic_34: { // 유충렬전
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "유충렬이 충성을 바친 대상은?", options: ["나라와 임금","부모","친구","스승"], answer: 0, explanation: "간신을 물리치고 나라에 충성했습니다." },
        { q: "유충렬 가문이 몰락한 이유는?", options: ["간신의 모함","전쟁 패배","자연재해","왕의 명령"], answer: 0, explanation: "간신의 모함으로 집안이 몰락했습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "유충렬전의 서사 구조는?", options: ["영웅의 일대기","일상의 기록","역사 기록","풍자 이야기"], answer: 0, explanation: "영웅이 고난을 극복하는 일대기 구조입니다." },
        { q: "간신 정한담의 역할은?", options: ["대립자(악역)","조력자","주인공","방관자"], answer: 0, explanation: "주인공과 대립하는 악역입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'충렬(忠烈)'의 뜻은?", options: ["충성스럽고 절개가 굳음","용감함","지혜로움","부지런함"], answer: 0, explanation: "충성스럽고 절개가 굳센 것입니다." },
        { q: "'간신(奸臣)'의 의미는?", options: ["간사한 신하","충성스러운 신하","무능한 신하","젊은 신하"], answer: 0, explanation: "간사하고 나쁜 신하를 말합니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "유충렬이 위기를 극복할 수 있었던 힘은?", options: ["충효 정신과 용기","재물","권력","운"], answer: 0, explanation: "충성과 효도 정신, 용기로 극복했습니다." },
        { q: "간신이 처벌받는 결말의 의미는?", options: ["정의의 실현","우연의 일치","비극적 결말","열린 결말"], answer: 0, explanation: "권선징악의 정의가 실현됩니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "유충렬전이 강조하는 가치는?", options: ["충효와 정의","개인의 자유","재물","명예"], answer: 0, explanation: "충성, 효도, 정의를 강조합니다." },
        { q: "영웅 소설의 공통된 특징은?", options: ["권선징악 구조","비극적 결말","현실 비판","열린 결말"], answer: 0, explanation: "선이 악을 물리치는 권선징악 구조입니다." }
      ]
    }
  },
  classic_35: { // 조웅전
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "조웅이 영웅으로 성장한 계기는?", options: ["아버지의 원수를 갚기 위해","돈을 벌기 위해","여행하기 위해","공부하기 위해"], answer: 0, explanation: "간신에게 해를 당한 아버지의 원수를 갚고자 했습니다." },
        { q: "조웅의 아버지가 해를 당한 이유는?", options: ["간신의 모함","전쟁 패배","범죄","왕명 거역"], answer: 0, explanation: "간신의 모함으로 해를 당했습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "조웅전의 서사 유형은?", options: ["영웅 소설","풍자 소설","역사 소설","애정 소설"], answer: 0, explanation: "영웅의 일대기를 다룬 영웅 소설입니다." },
        { q: "조웅이 고난을 겪는 것은 어느 서사 단계인가?", options: ["전개","발단","절정","결말"], answer: 0, explanation: "고난을 겪으며 이야기가 전개됩니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'웅(雄)'의 뜻은?", options: ["수컷, 영웅","암컷","평범함","약함"], answer: 0, explanation: "수컷 또는 영웅을 의미합니다." },
        { q: "'복수(復讐)'의 의미는?", options: ["원수를 갚음","선물함","용서함","도망침"], answer: 0, explanation: "해를 입힌 자에게 갚는 것입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "조웅이 성공할 수 있었던 원동력은?", options: ["복수심과 정의감","재물","권력","우연"], answer: 0, explanation: "아버지의 원수를 갚으려는 의지가 원동력이었습니다." },
        { q: "조웅전의 결말이 권선징악인 이유는?", options: ["선이 이기고 악이 벌받음","악이 이김","무승부","열린 결말"], answer: 0, explanation: "영웅이 승리하고 간신이 벌을 받습니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "조웅전이 전하는 교훈은?", options: ["정의는 반드시 승리함","복수는 나쁨","권력이 최고","돈이 최고"], answer: 0, explanation: "정의가 결국 승리한다는 교훈을 줍니다." },
        { q: "영웅 소설이 인기 있었던 이유는?", options: ["민중의 희망을 반영","왕의 명령","외국 영향","작가의 유명세"], answer: 0, explanation: "억눌린 민중의 희망을 대리 충족했습니다." }
      ]
    }
  },
  classic_36: { // 소대성전
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "소대성이 어려서 겪은 고난은?", options: ["부모를 잃고 구걸함","공부를 못함","병에 걸림","전쟁에 참여함"], answer: 0, explanation: "어려서 부모를 잃고 거지가 되는 고난을 겪었습니다." },
        { q: "소대성이 영웅이 된 방법은?", options: ["무예를 익혀 공을 세움","장사로 성공","공부로 급제","결혼으로 신분 상승"], answer: 0, explanation: "무예를 익혀 나라에 공을 세웠습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "소대성전의 서사 유형은?", options: ["영웅 소설","풍자 소설","역사 소설","애정 소설"], answer: 0, explanation: "고난을 극복하는 영웅의 일대기입니다." },
        { q: "거지에서 영웅으로의 변화는 어느 단계인가?", options: ["전개~절정","발단","결말","서론"], answer: 0, explanation: "고난을 극복하며 전개되어 절정에 이릅니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'대성(大成)'의 뜻은?", options: ["크게 이룸","작은 성공","실패","평범함"], answer: 0, explanation: "크게 성공하여 이룬다는 뜻입니다." },
        { q: "'고난(苦難)'의 의미는?", options: ["괴롭고 어려운 일","즐거운 일","평범한 일","쉬운 일"], answer: 0, explanation: "괴롭고 힘든 일을 말합니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "소대성이 고난을 극복한 힘은?", options: ["의지와 노력","재물","권력","우연"], answer: 0, explanation: "강한 의지와 끊임없는 노력으로 극복했습니다." },
        { q: "영웅 소설에서 고난의 역할은?", options: ["영웅의 능력을 부각","독자를 지루하게 함","현실성 강화","분량 늘리기"], answer: 0, explanation: "고난을 극복하며 영웅의 능력이 부각됩니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "소대성전이 민중에게 준 희망은?", options: ["신분 극복 가능성","돈의 중요성","권력의 필요성","학문의 중요성"], answer: 0, explanation: "낮은 신분도 노력하면 성공할 수 있다는 희망입니다." },
        { q: "영웅 소설의 한계로 볼 수 있는 것은?", options: ["비현실적 성공담","너무 현실적","교훈이 없음","재미없음"], answer: 0, explanation: "현실에서 이루기 어려운 성공담이 많습니다." }
      ]
    }
  },
  classic_37: { // 임경업전
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "임경업 장군이 청나라에 저항한 이유는?", options: ["조선을 지키기 위해","개인적 복수","돈을 벌려고","유명해지려고"], answer: 0, explanation: "청나라의 침략에 맞서 나라를 지키려 했습니다." },
        { q: "임경업이 비극적 최후를 맞은 이유는?", options: ["간신의 모함","전쟁 패배","질병","사고"], answer: 0, explanation: "간신 김자점의 모함으로 억울하게 죽었습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "임경업전의 특징은?", options: ["역사적 인물을 다룸","완전 허구","외국 배경","현대 배경"], answer: 0, explanation: "실제 역사 인물인 임경업 장군을 다룹니다." },
        { q: "임경업전의 서사 유형은?", options: ["역사 군담 소설","풍자 소설","애정 소설","판소리계 소설"], answer: 0, explanation: "역사적 배경의 군담 소설입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'경업(慶業)'의 뜻은?", options: ["경사스러운 업적","슬픈 일","평범한 일","나쁜 일"], answer: 0, explanation: "경사롭고 훌륭한 업적을 의미합니다." },
        { q: "'충신(忠臣)'의 의미는?", options: ["충성스러운 신하","간사한 신하","무능한 신하","부유한 신하"], answer: 0, explanation: "나라에 충성하는 신하입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "임경업의 죽음이 비극적인 이유는?", options: ["충신이 간신에게 당함","스스로 선택함","자연사함","적에게 당함"], answer: 0, explanation: "충성스러운 장군이 간신의 모함으로 억울하게 죽었습니다." },
        { q: "민중이 임경업을 추모한 이유는?", options: ["억울한 충신에 대한 동정","부자라서","왕이라서","외국인이라서"], answer: 0, explanation: "억울하게 죽은 충신에 대한 동정과 존경입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "임경업전이 비판하는 것은?", options: ["간신의 횡포","백성의 게으름","왕의 무능","외국 문화"], answer: 0, explanation: "간신이 충신을 모함하는 현실을 비판합니다." },
        { q: "역사 소설의 의의는?", options: ["역사적 교훈 전달","단순 오락","현실 도피","외국 문화 소개"], answer: 0, explanation: "역사를 통해 교훈을 전달합니다." }
      ]
    }
  },
  classic_38: { // 적성의전
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "적성의는 어떤 신분에서 시작했나?", options: ["노비","양반","왕족","상인"], answer: 0, explanation: "적성의는 낮은 신분인 노비였습니다." },
        { q: "적성의가 성공한 방법은?", options: ["무예와 지략으로 공을 세움","장사로 부자됨","공부로 급제","결혼으로 신분 상승"], answer: 0, explanation: "무예와 지략으로 나라에 공을 세웠습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "적성의전의 서사 유형은?", options: ["영웅 소설","풍자 소설","역사 소설","애정 소설"], answer: 0, explanation: "신분 극복 영웅의 일대기입니다." },
        { q: "노비에서 영웅으로의 변화가 보여주는 것은?", options: ["신분 극복의 가능성","신분제의 정당성","운명의 불변","권력의 중요성"], answer: 0, explanation: "노력으로 신분을 극복할 수 있음을 보여줍니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'적성(赤誠)'의 뜻은?", options: ["붉은 정성, 진심","거짓","무관심","냉담함"], answer: 0, explanation: "붉은 피처럼 뜨거운 진심을 의미합니다." },
        { q: "'천민(賤民)'의 의미는?", options: ["신분이 낮은 백성","귀족","왕족","외국인"], answer: 0, explanation: "신분이 낮은 사람을 말합니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "적성의가 신분을 극복할 수 있었던 힘은?", options: ["능력과 의지","재물","귀족의 도움","왕의 총애"], answer: 0, explanation: "뛰어난 능력과 강한 의지로 극복했습니다." },
        { q: "적성의전이 민중에게 인기 있었던 이유는?", options: ["신분 극복의 대리 만족","귀족 취향","외국 소설","왕명으로 읽음"], answer: 0, explanation: "신분의 한계를 넘는 이야기에 공감했습니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "적성의전이 비판하는 것은?", options: ["불합리한 신분제","개인의 나태","외국 문화","종교"], answer: 0, explanation: "태어난 신분으로 사람을 판단하는 것을 비판합니다." },
        { q: "적성의전의 한계로 볼 수 있는 것은?", options: ["현실에서 실현 어려움","너무 현실적","재미없음","교훈이 없음"], answer: 0, explanation: "실제로 신분 극복은 매우 어려웠습니다." }
      ]
    }
  },
  classic_39: { // 월영낭자전
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "월영낭자는 어떤 존재인가?", options: ["선녀 또는 신비한 존재","일반 여인","공주","기생"], answer: 0, explanation: "월영낭자는 신비한 존재입니다." },
        { q: "월영낭자와 남주인공의 관계는?", options: ["사랑하는 연인","원수","친구","남매"], answer: 0, explanation: "서로 사랑하는 연인 관계입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "월영낭자전의 서사 유형은?", options: ["애정 소설","영웅 소설","풍자 소설","역사 소설"], answer: 0, explanation: "남녀 간의 사랑을 다룬 애정 소설입니다." },
        { q: "이별과 재회의 구조가 의미하는 것은?", options: ["사랑의 시련과 극복","단순한 우연","현실적 결말","비극적 종결"], answer: 0, explanation: "사랑이 시련을 극복함을 보여줍니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'월영(月影)'의 뜻은?", options: ["달빛 또는 달 그림자","해","별","구름"], answer: 0, explanation: "달의 빛이나 그림자를 의미합니다." },
        { q: "'낭자(娘子)'의 의미는?", options: ["젊은 여성","노인","남성","아이"], answer: 0, explanation: "젊은 여성을 높여 부르는 말입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "월영낭자가 신비한 존재인 이유는?", options: ["비현실적 아름다움 강조","작가의 실수","역사적 사실","독자의 요청"], answer: 0, explanation: "이상적 여인상을 신비하게 표현했습니다." },
        { q: "애정 소설에서 시련의 역할은?", options: ["사랑의 깊이를 보여줌","분량 늘리기","독자를 짜증나게 함","현실성 추가"], answer: 0, explanation: "시련을 통해 사랑의 깊이가 드러납니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "월영낭자전이 전하는 가치는?", options: ["진정한 사랑의 힘","재물의 중요성","신분의 중요성","권력의 필요성"], answer: 0, explanation: "진정한 사랑은 시련을 극복한다는 가치입니다." },
        { q: "고전 애정 소설의 특징은?", options: ["이상적 사랑 추구","현실적 갈등만","비극적 결말만","사랑 없음"], answer: 0, explanation: "이상적이고 아름다운 사랑을 추구합니다." }
      ]
    }
  },
  classic_40: { // 이생규장전
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "이생과 최랑이 처음 만난 곳은?", options: ["담장 너머","시장","학교","궁궐"], answer: 0, explanation: "담장 너머로 서로를 보고 사랑에 빠졌습니다." },
        { q: "최랑이 죽은 후에 일어난 일은?", options: ["귀신이 되어 이생과 재회","완전히 사라짐","다른 사람으로 환생","이생도 함께 죽음"], answer: 0, explanation: "귀신이 되어 이생과 다시 만났습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "이생규장전의 서사 유형은?", options: ["전기 소설(기이한 이야기)","역사 소설","풍자 소설","영웅 소설"], answer: 0, explanation: "기이한 사랑 이야기를 담은 전기 소설입니다." },
        { q: "이 작품이 수록된 작품집은?", options: ["금오신화","삼국유사","동문선","해동가요"], answer: 0, explanation: "김시습의 금오신화에 수록되어 있습니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'규장(窺墻)'의 뜻은?", options: ["담장을 엿봄","창문을 염","문을 닫음","지붕을 오름"], answer: 0, explanation: "담장 너머를 엿본다는 뜻입니다." },
        { q: "'전기(傳奇)'의 의미는?", options: ["기이한 이야기를 전함","역사 기록","일기","편지"], answer: 0, explanation: "신비롭고 기이한 이야기를 전하는 것입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "최랑이 귀신이 되어 돌아온 이유는?", options: ["이생에 대한 사랑","복수","미련","우연"], answer: 0, explanation: "이생을 향한 사랑 때문에 돌아왔습니다." },
        { q: "이생규장전의 결말이 주는 느낌은?", options: ["슬프지만 아름다움","완전한 행복","분노","무관심"], answer: 0, explanation: "슬프지만 진한 사랑의 아름다움을 느낍니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "이생규장전이 전하는 메시지는?", options: ["죽음도 넘는 사랑","현실적 사랑만","사랑은 무의미","권력이 최고"], answer: 0, explanation: "죽음도 초월하는 사랑의 힘을 전합니다." },
        { q: "금오신화의 문학사적 의의는?", options: ["최초의 한문 소설","최초의 한글 소설","최초의 시조","최초의 가사"], answer: 0, explanation: "우리나라 최초의 한문 소설로 평가됩니다." }
      ]
    }
  }
};

// classic_31~40 파일에 보완학습 데이터 삽입
for (let i = 31; i <= 40; i++) {
  const num = String(i).padStart(2, '0');
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'korlit', `classic_${num}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const key = `classic_${num}`;
  const data = remedialData[key];

  if (!data) {
    console.log(`[SKIP] ${key} 데이터 없음`);
    continue;
  }

  // 기존 REMEDIAL_BANK 블록 제거
  const existingPattern = /<!-- ✅ 보완학습 데이터 \(learning-common\.js 로드 전에 정의\) -->\s*<script>\s*window\.REMEDIAL_BANK = \{[\s\S]*?\};\s*<\/script>\s*/;
  if (existingPattern.test(content)) {
    content = content.replace(existingPattern, '');
    console.log(`[OK] classic_${num} 기존 REMEDIAL_BANK 블록 제거`);
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
    console.log(`[OK] classic_${num} REMEDIAL_BANK 삽입 완료`);
  } else {
    console.log(`[WARN] classic_${num} learning-common.js 로드 패턴 없음`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

console.log('\n✅ classic_31~40 보완학습 데이터 삽입 완료!');

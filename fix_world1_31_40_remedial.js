const fs = require('fs');
const path = require('path');

// world1_31~40 보완학습 데이터
// 31: 늑대와 일곱 마리 아기 염소, 32: 호두까기 인형, 33: 빨간 구두, 34: 금도끼 은도끼, 35: 행복한 왕자
// 36: 백조 왕자, 37: 눈의 여왕, 38: 어린 왕자, 39: 양치기 소년, 40: 토끼와 거북이

const remedialData = {
  world1_31: { // 늑대와 일곱 마리 아기 염소
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "늑대가 아기 염소들을 속인 방법은?", options: ["목소리와 발을 바꿈","문을 부숨","열쇠를 훔침","엄마 염소를 잡음"], answer: 0, explanation: "목소리를 부드럽게 하고 발에 밀가루를 묻혀 속였습니다." },
        { q: "아기 염소들 중 살아남은 염소가 숨은 곳은?", options: ["시계 속","침대 밑","옷장 안","부엌"], answer: 0, explanation: "막내 염소가 시계 속에 숨어 살아남았습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "늑대와 일곱 마리 아기 염소의 장르는?", options: ["교훈 동화","역사 소설","추리 소설","로맨스"], answer: 0, explanation: "그림 형제의 교훈 동화입니다." },
        { q: "엄마 염소가 늑대 배를 가르는 것의 의미는?", options: ["악에 대한 응징","단순한 복수","우연","마법"], answer: 0, explanation: "악행에 대한 정당한 응징입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'위장(僞裝)'의 뜻은?", options: ["진짜처럼 꾸밈","솔직함","도망침","숨음"], answer: 0, explanation: "본모습을 숨기고 다르게 꾸미는 것입니다." },
        { q: "'경계(警戒)'의 의미는?", options: ["조심하고 주의함","무시함","환영함","신뢰함"], answer: 0, explanation: "위험에 대비해 조심하는 것입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "엄마 염소가 문을 열지 말라고 한 이유는?", options: ["위험한 존재가 속일 수 있어서","귀찮아서","잠을 자려고","장난으로"], answer: 0, explanation: "늑대 같은 위험한 존재가 속일 수 있기 때문입니다." },
        { q: "늑대가 여러 번 시도한 것이 보여주는 것은?", options: ["악의 집요함","포기","친절","도움"], answer: 0, explanation: "나쁜 의도는 포기하지 않고 집요하게 시도합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "이 동화가 전하는 교훈은?", options: ["낯선 사람을 경계하라","누구나 믿어라","문을 열어라","혼자 있어라"], answer: 0, explanation: "부모 말을 듣고 낯선 사람을 조심하라는 것입니다." },
        { q: "현대 사회에 주는 메시지는?", options: ["사기와 위장에 주의하라","모두 믿어라","문을 열어라","혼자 있어라"], answer: 0, explanation: "겉모습에 속지 말고 경계심을 가지라는 것입니다." }
      ]
    }
  },
  world1_32: { // 호두까기 인형
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "호두까기 인형이 왕자로 변한 계기는?", options: ["클라라의 사랑","마법사의 도움","시간이 지나서","스스로 변함"], answer: 0, explanation: "클라라의 사랑과 용기로 저주가 풀렸습니다." },
        { q: "호두까기 인형이 싸운 상대는?", options: ["쥐 왕","늑대","마녀","거인"], answer: 0, explanation: "쥐 왕과 그의 부하들과 싸웠습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "호두까기 인형의 장르는?", options: ["판타지/발레","역사 소설","추리 소설","로맨스"], answer: 0, explanation: "호프만의 동화로 발레 공연으로 유명합니다." },
        { q: "과자 나라 여행이 의미하는 것은?", options: ["환상과 꿈의 세계","현실","역사","과학"], answer: 0, explanation: "상상력이 펼쳐지는 환상의 세계입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'저주(詛呪)'의 뜻은?", options: ["나쁜 일이 일어나길 빎","축복","선물","칭찬"], answer: 0, explanation: "누군가에게 불행이 닥치기를 바라는 것입니다." },
        { q: "'환상(幻想)'의 의미는?", options: ["현실이 아닌 상상","현실","역사","과학"], answer: 0, explanation: "실제가 아닌 상상 속의 것입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "클라라가 호두까기 인형을 구한 이유는?", options: ["진심 어린 사랑","의무감","명령","보상"], answer: 0, explanation: "호두까기 인형에 대한 진심 어린 사랑입니다." },
        { q: "크리스마스 밤 설정의 의미는?", options: ["마법과 기적의 시간","평범한 날","슬픈 날","무서운 날"], answer: 0, explanation: "기적이 일어나는 특별한 시간입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "호두까기 인형이 전하는 메시지는?", options: ["사랑과 용기의 힘","무력의 중요성","복수","이기심"], answer: 0, explanation: "진정한 사랑과 용기가 기적을 만든다는 것입니다." },
        { q: "이 작품이 크리스마스에 공연되는 이유는?", options: ["희망과 마법의 메시지","단순한 전통","돈을 벌려고","의무"], answer: 0, explanation: "크리스마스의 희망과 마법적 분위기와 어울리기 때문입니다." }
      ]
    }
  },
  world1_33: { // 빨간 구두
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "카렌이 빨간 구두 때문에 겪은 일은?", options: ["멈추지 못하고 계속 춤춤","부자가 됨","예뻐짐","행복해짐"], answer: 0, explanation: "빨간 구두가 저절로 춤을 추게 하여 멈출 수 없었습니다." },
        { q: "카렌이 구두에서 벗어난 방법은?", options: ["발을 자름","구두를 벗음","마법을 품","기도함"], answer: 0, explanation: "사형 집행인에게 발을 잘라달라고 부탁했습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "빨간 구두의 장르는?", options: ["교훈 동화","역사 소설","추리 소설","로맨스"], answer: 0, explanation: "안데르센의 교훈적 동화입니다." },
        { q: "빨간 구두가 상징하는 것은?", options: ["허영과 욕망","사랑","우정","용기"], answer: 0, explanation: "아름다움에 대한 지나친 욕망과 허영심입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'허영(虛榮)'의 뜻은?", options: ["겉치레만 좋아함","검소함","성실함","정직함"], answer: 0, explanation: "실속 없이 겉모습만 꾸미려는 것입니다." },
        { q: "'참회(懺悔)'의 의미는?", options: ["잘못을 뉘우침","자랑함","부인함","숨김"], answer: 0, explanation: "자신의 잘못을 깊이 뉘우치는 것입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "빨간 구두가 계속 춤추게 한 이유는?", options: ["허영에 대한 벌","재미","운동","우연"], answer: 0, explanation: "허영심에 빠진 것에 대한 벌입니다." },
        { q: "카렌이 용서받을 수 있었던 이유는?", options: ["진심으로 참회했기 때문","시간이 지나서","돈을 내서","아무 이유 없이"], answer: 0, explanation: "진심으로 자신의 잘못을 뉘우쳤기 때문입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "빨간 구두가 전하는 교훈은?", options: ["허영심을 경계하라","예뻐지라","춤을 배우라","구두를 사라"], answer: 0, explanation: "겉모습에 대한 지나친 집착을 경계하라는 것입니다." },
        { q: "벌이 가혹하다는 비판에 대해?", options: ["시대적 맥락 이해 필요","정당함","너무 약함","상관없음"], answer: 0, explanation: "당시 종교적 맥락에서의 엄격한 교훈입니다." }
      ]
    }
  },
  world1_34: { // 금도끼 은도끼
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "정직한 나무꾼이 얻은 것은?", options: ["금도끼, 은도끼, 쇠도끼 모두","금도끼만","은도끼만","아무것도 없음"], answer: 0, explanation: "정직하게 대답하자 산신령이 세 도끼 모두 주었습니다." },
        { q: "욕심 많은 나무꾼의 결말은?", options: ["아무것도 못 얻음","금도끼를 얻음","부자가 됨","칭찬받음"], answer: 0, explanation: "거짓말하여 아무것도 얻지 못했습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "금도끼 은도끼의 장르는?", options: ["교훈 우화","역사 소설","추리 소설","로맨스"], answer: 0, explanation: "정직의 가치를 가르치는 교훈 우화입니다." },
        { q: "두 나무꾼의 대비가 보여주는 것은?", options: ["정직과 거짓의 결과 차이","능력 차이","운의 차이","나이 차이"], answer: 0, explanation: "정직하면 복을 받고 거짓말하면 벌을 받습니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'정직(正直)'의 뜻은?", options: ["거짓 없이 바름","거짓말","속임","과장"], answer: 0, explanation: "마음이 바르고 거짓이 없는 것입니다." },
        { q: "'욕심(慾心)'의 의미는?", options: ["지나치게 갖고 싶어함","만족함","나눔","양보"], answer: 0, explanation: "무엇인가를 지나치게 갖고 싶어하는 마음입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "산신령이 나무꾼을 시험한 이유는?", options: ["진정한 성품을 알기 위해","장난으로","심심해서","의무"], answer: 0, explanation: "나무꾼의 진정한 품성을 알아보려는 것입니다." },
        { q: "금도끼를 내 것이라 한 것이 왜 나쁜가?", options: ["거짓말이기 때문","도끼가 못생겨서","산신령이 싫어서","의미 없음"], answer: 0, explanation: "자기 것이 아닌 것을 탐내는 거짓말이기 때문입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "금도끼 은도끼가 전하는 교훈은?", options: ["정직이 최선이다","거짓말해도 된다","욕심을 부려라","남을 속여라"], answer: 0, explanation: "정직하게 살면 복을 받는다는 것입니다." },
        { q: "현대 사회에 주는 메시지는?", options: ["정직의 가치는 변하지 않음","정직은 손해","거짓말이 유리","상관없음"], answer: 0, explanation: "시대가 바뀌어도 정직의 가치는 변하지 않습니다." }
      ]
    }
  },
  world1_35: { // 행복한 왕자
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "행복한 왕자 동상이 가난한 사람들을 도운 방법은?", options: ["몸의 보석을 나눠줌","돈을 벌어줌","일을 도와줌","집을 지어줌"], answer: 0, explanation: "제비에게 부탁해 자신의 보석과 금박을 나눠주었습니다." },
        { q: "제비가 왕자 곁에 남은 이유는?", options: ["왕자를 사랑해서","갈 곳이 없어서","명령 때문에","실수로"], answer: 0, explanation: "왕자를 사랑하여 떠나지 못했습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "행복한 왕자의 장르는?", options: ["동화/우화","역사 소설","추리 소설","로맨스"], answer: 0, explanation: "오스카 와일드의 동화입니다." },
        { q: "왕자와 제비의 죽음 후 결말이 의미하는 것은?", options: ["희생의 가치를 하늘이 인정","비극적 끝","실패","무의미"], answer: 0, explanation: "천국에서 그 희생이 인정받았습니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'희생(犧牲)'의 뜻은?", options: ["남을 위해 자신을 버림","이기심","욕심","무관심"], answer: 0, explanation: "다른 사람을 위해 자신의 것을 바치는 것입니다." },
        { q: "'헌신(獻身)'의 의미는?", options: ["몸과 마음을 바침","이기심","배신","무관심"], answer: 0, explanation: "온 마음을 다해 바치는 것입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "왕자가 동상일 때 슬퍼진 이유는?", options: ["백성들의 고통을 보게 되어서","외로워서","추워서","지루해서"], answer: 0, explanation: "살아있을 때 몰랐던 백성들의 고통을 보게 되었습니다." },
        { q: "시민들이 동상을 녹인 것이 보여주는 것은?", options: ["세상의 무관심","감사","존경","사랑"], answer: 0, explanation: "희생의 가치를 모르는 세상의 무관심입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "행복한 왕자가 전하는 메시지는?", options: ["진정한 행복은 나눔에 있다","물질이 행복","혼자가 좋다","희생하지 마라"], answer: 0, explanation: "진정한 행복은 남을 위한 희생과 나눔에 있습니다." },
        { q: "이 작품이 비판하는 것은?", options: ["물질만 중시하는 사회","가난한 사람들","왕자","제비"], answer: 0, explanation: "겉모습과 물질만 중시하는 사회를 비판합니다." }
      ]
    }
  },
  world1_36: { // 백조 왕자(야생의 백조)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "공주가 오빠들을 구하기 위해 한 일은?", options: ["쐐기풀로 옷을 짬","마법을 씀","왕에게 부탁함","도망침"], answer: 0, explanation: "말을 하지 않고 쐐기풀로 옷을 짜서 오빠들을 구했습니다." },
        { q: "오빠들이 백조가 된 이유는?", options: ["계모의 저주","스스로 변함","여행 때문","사고"], answer: 0, explanation: "새어머니의 저주로 백조가 되었습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "백조 왕자의 장르는?", options: ["동화","역사 소설","추리 소설","로맨스"], answer: 0, explanation: "안데르센의 동화입니다." },
        { q: "공주가 말을 하지 못한 것의 의미는?", options: ["희생의 극대화","편리함","우연","장난"], answer: 0, explanation: "오빠들을 구하기 위해 극심한 희생을 감수했습니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'인내(忍耐)'의 뜻은?", options: ["어려움을 참고 견딤","포기함","화냄","도망침"], answer: 0, explanation: "괴로움을 참고 견디는 것입니다." },
        { q: "'헌신(獻身)'의 의미는?", options: ["몸과 마음을 바침","이기심","배신","무관심"], answer: 0, explanation: "온 마음과 몸을 다해 바치는 것입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "공주가 화형당할 위기에도 말하지 않은 이유는?", options: ["오빠들을 구하기 위해","말을 못해서","잊어서","포기해서"], answer: 0, explanation: "오빠들의 저주를 풀기 위해 끝까지 침묵했습니다." },
        { q: "막내 오빠의 팔이 날개로 남은 이유는?", options: ["옷이 다 완성되지 않아서","원래 그랬음","마법","저주"], answer: 0, explanation: "시간이 부족해 한쪽 옷소매를 완성하지 못했습니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "백조 왕자가 전하는 교훈은?", options: ["인내와 사랑은 시련을 이긴다","포기하라","말을 하라","도망가라"], answer: 0, explanation: "가족을 향한 인내와 사랑의 힘입니다." },
        { q: "공주의 희생이 보여주는 가치는?", options: ["무조건적 사랑","이기심","복수","무관심"], answer: 0, explanation: "가족을 위한 무조건적 사랑과 희생입니다." }
      ]
    }
  },
  world1_37: { // 눈의 여왕
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "게르다가 카이를 구한 힘은?", options: ["뜨거운 눈물","마법","힘","도구"], answer: 0, explanation: "게르다의 뜨거운 눈물이 카이의 얼어붙은 마음을 녹였습니다." },
        { q: "카이의 마음이 얼어붙은 원인은?", options: ["악마의 거울 조각","추위","눈의 여왕","병"], answer: 0, explanation: "악마의 거울 조각이 눈과 가슴에 박혀 차가워졌습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "눈의 여왕의 장르는?", options: ["동화","역사 소설","추리 소설","공포 소설"], answer: 0, explanation: "안데르센의 대표적인 동화입니다." },
        { q: "게르다의 긴 여정이 의미하는 것은?", options: ["사랑을 위한 시련과 성장","단순한 이동","여행","관광"], answer: 0, explanation: "카이를 구하기 위한 시련과 성장의 과정입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'순수(純粹)'의 뜻은?", options: ["맑고 깨끗함","더러움","복잡함","거짓"], answer: 0, explanation: "섞인 것 없이 맑고 깨끗한 것입니다." },
        { q: "'구원(救援)'의 의미는?", options: ["위험에서 건져냄","방치","포기","배신"], answer: 0, explanation: "어려움이나 위험에서 구해내는 것입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "게르다가 어려움을 극복할 수 있었던 힘은?", options: ["카이를 향한 사랑","마법","힘","운"], answer: 0, explanation: "카이를 구하려는 순수한 사랑의 힘입니다." },
        { q: "눈물이 얼음을 녹인 것의 의미는?", options: ["따뜻한 사랑이 차가운 마음을 녹임","우연","마법","과학"], answer: 0, explanation: "진정한 사랑이 냉정함을 녹인다는 상징입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "눈의 여왕이 전하는 메시지는?", options: ["순수한 사랑이 악을 이긴다","추위가 좋다","포기해라","혼자 살아라"], answer: 0, explanation: "진정한 사랑은 어떤 악도 이길 수 있습니다." },
        { q: "악마의 거울이 상징하는 것은?", options: ["세상을 왜곡하는 부정적 시선","정확한 거울","좋은 것","행운"], answer: 0, explanation: "세상을 나쁘게만 보게 하는 부정적 관점입니다." }
      ]
    }
  },
  world1_38: { // 어린 왕자
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "어린 왕자가 자기 별을 떠난 이유는?", options: ["장미와의 갈등","보물을 찾으러","친구를 만나러","여행이 좋아서"], answer: 0, explanation: "장미와의 관계에서 상처받고 별을 떠났습니다." },
        { q: "여우가 어린 왕자에게 알려준 비밀은?", options: ["마음으로 봐야 진정한 것이 보인다","눈으로 잘 봐라","듣지 마라","떠나라"], answer: 0, explanation: "가장 중요한 것은 눈에 보이지 않는다고 했습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "어린 왕자의 장르는?", options: ["철학적 동화","역사 소설","추리 소설","공포 소설"], answer: 0, explanation: "깊은 철학적 메시지를 담은 동화입니다." },
        { q: "여러 별을 여행하는 구조의 의미는?", options: ["다양한 어른의 문제점 제시","단순 이동","관광","모험"], answer: 0, explanation: "각 별의 어른들이 현대인의 문제를 상징합니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'길들이다'의 뜻은?", options: ["관계를 맺어 특별해지다","명령하다","싸우다","떠나다"], answer: 0, explanation: "서로에게 특별한 존재가 되는 것입니다." },
        { q: "'본질(本質)'의 의미는?", options: ["가장 중요한 핵심","겉모습","크기","색깔"], answer: 0, explanation: "사물의 가장 근본적인 성질입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "어린 왕자가 별로 돌아간 이유는?", options: ["장미에 대한 책임감","싫어서","강제로","우연히"], answer: 0, explanation: "자신이 길들인 장미에 대한 책임 때문입니다." },
        { q: "어른들의 별이 보여주는 것은?", options: ["잘못된 가치관","이상적 삶","행복","지혜"], answer: 0, explanation: "권력, 허영, 탐욕에 빠진 현대인의 모습입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "어린 왕자가 비판하는 어른의 모습은?", options: ["숫자와 권력만 중시","친절함","지혜로움","검소함"], answer: 0, explanation: "본질을 잊고 숫자와 권력만 좇는 어른들입니다." },
        { q: "이 작품이 현대인에게 주는 메시지는?", options: ["정말 소중한 것을 돌아보라","바쁘게 살라","돈을 벌라","혼자 살라"], answer: 0, explanation: "진정으로 소중한 것이 무엇인지 성찰하라는 것입니다." }
      ]
    }
  },
  world1_39: { // 양치기 소년
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "양치기 소년이 거짓말을 한 결과는?", options: ["아무도 믿지 않게 됨","유명해짐","상을 받음","친구가 많아짐"], answer: 0, explanation: "계속 거짓말하자 진짜 늑대가 나타났을 때 아무도 믿지 않았습니다." },
        { q: "소년이 '늑대다!'라고 외친 횟수는?", options: ["여러 번","한 번","안 함","모름"], answer: 0, explanation: "재미로 여러 번 거짓말을 했습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "양치기 소년의 장르는?", options: ["이솝 우화","역사 소설","추리 소설","로맨스"], answer: 0, explanation: "이솝의 교훈적 우화입니다." },
        { q: "반복되는 거짓말의 구조가 보여주는 것은?", options: ["신뢰 상실의 과정","재미","모험","성장"], answer: 0, explanation: "거짓말을 반복하면 신뢰를 잃게 됨을 보여줍니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'신뢰(信賴)'의 뜻은?", options: ["믿고 의지함","의심함","무시함","배신함"], answer: 0, explanation: "믿고 의지하는 것입니다." },
        { q: "'거짓말'의 결과는?", options: ["신뢰 상실","이득","칭찬","인기"], answer: 0, explanation: "거짓말은 결국 신뢰를 잃게 합니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "마을 사람들이 오지 않은 이유는?", options: ["더 이상 소년을 믿지 않아서","바빠서","못 들어서","귀찮아서"], answer: 0, explanation: "여러 번 속아서 더 이상 믿지 않았습니다." },
        { q: "소년이 거짓말을 한 이유는?", options: ["심심해서 재미로","필요해서","명령 때문","습관"], answer: 0, explanation: "심심해서 재미로 사람들을 속였습니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "양치기 소년이 전하는 교훈은?", options: ["거짓말하면 신뢰를 잃는다","거짓말해도 된다","재미있게 살라","혼자 살라"], answer: 0, explanation: "거짓말은 결국 자신에게 해가 된다는 것입니다." },
        { q: "현대 사회에 주는 메시지는?", options: ["신뢰의 중요성","거짓말의 유용성","재미가 중요","상관없음"], answer: 0, explanation: "한 번 잃은 신뢰는 되찾기 어렵습니다." }
      ]
    }
  },
  world1_40: { // 토끼와 거북이
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "거북이가 경주에서 이긴 이유는?", options: ["꾸준히 걸었기 때문에","빨라서","토끼가 안 뛰어서","마법을 써서"], answer: 0, explanation: "토끼가 낮잠 자는 동안 거북이가 꾸준히 걸어 이겼습니다." },
        { q: "토끼가 진 이유는?", options: ["자만해서 낮잠을 잤기 때문","느려서","아파서","포기해서"], answer: 0, explanation: "자신의 빠름을 믿고 자만하여 낮잠을 잤습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "토끼와 거북이의 장르는?", options: ["이솝 우화","역사 소설","추리 소설","로맨스"], answer: 0, explanation: "이솝의 대표적인 교훈 우화입니다." },
        { q: "토끼와 거북이의 대비가 보여주는 것은?", options: ["재능 vs 노력","크기 차이","색깔 차이","나이 차이"], answer: 0, explanation: "타고난 재능보다 꾸준한 노력이 중요함을 보여줍니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'자만(自慢)'의 뜻은?", options: ["스스로 잘난 체함","겸손","노력","인내"], answer: 0, explanation: "자기가 잘났다고 뽐내는 것입니다." },
        { q: "'꾸준함'의 의미는?", options: ["변함없이 계속함","변덕","포기","빠름"], answer: 0, explanation: "한결같이 변함없이 계속하는 것입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "토끼가 낮잠을 잔 것이 보여주는 것은?", options: ["자만심의 위험","피곤함","여유","지혜"], answer: 0, explanation: "자만하면 실패한다는 것을 보여줍니다." },
        { q: "거북이의 승리가 주는 교훈은?", options: ["포기하지 않으면 이긴다","느려야 한다","잠을 자지 마라","빨라야 한다"], answer: 0, explanation: "느려도 포기하지 않고 꾸준히 하면 성공합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "토끼와 거북이가 전하는 교훈은?", options: ["꾸준한 노력이 재능을 이긴다","빠른 게 최고","자만해도 된다","포기해도 된다"], answer: 0, explanation: "재능보다 꾸준한 노력이 중요하다는 것입니다." },
        { q: "현대 사회에 주는 메시지는?", options: ["성실함의 가치","빠름의 중요성","재능이 전부","운이 중요"], answer: 0, explanation: "성실하게 노력하면 결국 성공한다는 것입니다." }
      ]
    }
  }
};

// world1_31~40 파일에 보완학습 데이터 삽입
for (let i = 31; i <= 40; i++) {
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

console.log('\n✅ world1_31~40 보완학습 데이터 삽입 완료!');

const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'public', 'BRAINUP', 'science');

// 업생물 01~20 보완학습 문제 데이터 (본문 내용 기반)
const REMEDIAL_DATA = {
  "01": {
    // 생물과 무생물의 구분과 관계
    literal: { title: "보완학습 | 핵심 이해력", problems: [
      { q: "살아 있는 것을 무엇이라 하나요?", options: ["1. 무생물", "2. 생물", "3. 광물", "4. 화석"], answer: 1, explanation: "살아 있는 것을 '생물'이라 합니다." },
      { q: "생물의 특징이 아닌 것은?", options: ["1. 번식한다", "2. 호흡한다", "3. 변하지 않는다", "4. 성장한다"], answer: 2, explanation: "생물은 성장하고 변화합니다." }
    ]},
    structural: { title: "보완학습 | 구조 파악력", problems: [
      { q: "글에서 생물과 무생물을 구분하는 기준은?", options: ["1. 크기", "2. 색깔", "3. 살아 있느냐 아니냐", "4. 무게"], answer: 2, explanation: "살아 있느냐 아니냐가 구분 기준입니다." },
      { q: "2문단에서 설명하는 생물의 특징으로 맞는 것은?", options: ["1. 섭취와 번식", "2. 색깔과 크기", "3. 무게와 높이", "4. 온도와 습도"], answer: 0, explanation: "생물은 섭취와 번식을 합니다." }
    ]},
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [
      { q: "'섭취'의 뜻으로 알맞은 것은?", options: ["1. 버리다", "2. 먹어서 받아들이다", "3. 숨기다", "4. 던지다"], answer: 1, explanation: "섭취는 먹어서 몸에 받아들이는 것입니다." },
      { q: "'균형'과 비슷한 말은?", options: ["1. 불균형", "2. 치우침", "3. 고르게 유지됨", "4. 기울어짐"], answer: 2, explanation: "균형은 고르게 유지되는 상태입니다." }
    ]},
    inferential: { title: "보완학습 | 추론·통합력", problems: [
      { q: "무생물이 사라지면 생물에게 어떤 영향이 있을까요?", options: ["1. 아무 영향 없다", "2. 양분을 얻기 어렵다", "3. 더 잘 자란다", "4. 색깔이 변한다"], answer: 1, explanation: "생물은 무생물에서 양분을 얻습니다." },
      { q: "나무가 이산화탄소를 흡수하면 동물에게 어떤 도움이 될까요?", options: ["1. 먹이가 생긴다", "2. 숨 쉴 산소가 생긴다", "3. 집이 생긴다", "4. 물이 생긴다"], answer: 1, explanation: "나무는 산소를 내뿜어 동물이 숨 쉬게 합니다." }
    ]},
    critical: { title: "보완학습 | 비판·적용력", problems: [
      { q: "자연 보호가 중요한 이유로 알맞은 것은?", options: ["1. 예쁘게 보이려고", "2. 생태계 균형을 위해", "3. 관광객을 위해", "4. 사진 찍으려고"], answer: 1, explanation: "자연 보호는 생태계 균형 유지를 위해 중요합니다." },
      { q: "생물과 무생물의 관계를 이해하면 알 수 있는 것은?", options: ["1. 날씨 예보", "2. 자연 유지 원리", "3. 교통 정보", "4. 경제 상황"], answer: 1, explanation: "생물과 무생물의 관계로 자연 유지 원리를 알 수 있습니다." }
    ]}
  },
  "02": {
    // 동물의 몸과 생활 방식
    literal: { title: "보완학습 | 핵심 이해력", problems: [
      { q: "초식 동물이 주로 먹는 것은?", options: ["1. 고기", "2. 식물", "3. 물고기", "4. 곤충"], answer: 1, explanation: "초식 동물은 식물을 주로 먹습니다." },
      { q: "동물의 감각 기관이 하는 일은?", options: ["1. 소화", "2. 냄새와 소리 감지", "3. 번식", "4. 성장"], answer: 1, explanation: "감각 기관은 냄새, 소리, 빛 등을 느낍니다." }
    ]},
    structural: { title: "보완학습 | 구조 파악력", problems: [
      { q: "글에서 동물의 몸이 다른 이유로 설명한 것은?", options: ["1. 나이 차이", "2. 환경 적응", "3. 색깔 선호", "4. 크기 경쟁"], answer: 1, explanation: "동물은 환경에 맞게 몸을 발달시켰습니다." },
      { q: "2문단의 중심 내용은?", options: ["1. 이동 방식", "2. 소화 기관 차이", "3. 감각 기관", "4. 번식 방법"], answer: 1, explanation: "2문단은 먹이에 따른 소화 기관 차이를 설명합니다." }
    ]},
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [
      { q: "'기관'의 뜻으로 알맞은 것은?", options: ["1. 기계", "2. 특정 기능을 맡은 몸의 부분", "3. 건물", "4. 도구"], answer: 1, explanation: "기관은 몸에서 특정 기능을 맡은 부분입니다." },
      { q: "'초음파'를 이용하는 동물은?", options: ["1. 독수리", "2. 박쥐", "3. 상어", "4. 사자"], answer: 1, explanation: "박쥐는 초음파로 장애물을 감지합니다." }
    ]},
    inferential: { title: "보완학습 | 추론·통합력", problems: [
      { q: "육식 동물의 장이 짧은 이유는?", options: ["1. 식물을 먹어서", "2. 고기를 빨리 소화해야 해서", "3. 물을 많이 마셔서", "4. 잠을 많이 자서"], answer: 1, explanation: "육식 동물은 고기를 빠르게 소화해야 합니다." },
      { q: "산호가 한 자리에서 사는 방법은?", options: ["1. 달리기", "2. 물에 흐르는 먹이를 잡아먹기", "3. 날아다니기", "4. 땅을 파기"], answer: 1, explanation: "산호는 물에 흐르는 작은 먹이를 붙잡아 먹습니다." }
    ]},
    critical: { title: "보완학습 | 비판·적용력", problems: [
      { q: "잡식 동물이 다양한 음식을 먹을 수 있는 이유는?", options: ["1. 입이 커서", "2. 소화 기관이 다양한 특성을 가져서", "3. 눈이 좋아서", "4. 다리가 빨라서"], answer: 1, explanation: "잡식 동물은 두 가지 소화 특성을 갖추고 있습니다." },
      { q: "동물의 다양한 적응을 보여주는 예로 알맞지 않은 것은?", options: ["1. 독수리의 뛰어난 시력", "2. 물고기의 지느러미", "3. 모든 동물의 같은 다리", "4. 박쥐의 초음파"], answer: 2, explanation: "동물의 다리는 환경에 따라 다양합니다." }
    ]}
  },
  "03": {
    // 무척추동물의 세계
    literal: { title: "보완학습 | 핵심 이해력", problems: [
      { q: "등뼈가 없는 동물을 무엇이라 하나요?", options: ["1. 척추동물", "2. 무척추동물", "3. 포유류", "4. 조류"], answer: 1, explanation: "등뼈가 없는 동물을 무척추동물이라 합니다." },
      { q: "척추동물의 다섯 가지 분류에 포함되지 않는 것은?", options: ["1. 포유류", "2. 조류", "3. 곤충류", "4. 양서류"], answer: 2, explanation: "곤충류는 무척추동물입니다." }
    ]},
    structural: { title: "보완학습 | 구조 파악력", problems: [
      { q: "동물을 분류하는 가장 기본적인 기준은?", options: ["1. 크기", "2. 등뼈의 유무", "3. 색깔", "4. 먹이"], answer: 1, explanation: "등뼈의 유무가 가장 기본적인 분류 기준입니다." },
      { q: "3문단에서 설명하는 무척추동물의 예가 아닌 것은?", options: ["1. 곤충", "2. 달팽이", "3. 개구리", "4. 지렁이"], answer: 2, explanation: "개구리는 양서류로 척추동물입니다." }
    ]},
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [
      { q: "'절지동물'의 특징은?", options: ["1. 털이 있다", "2. 딱딱한 껍질과 마디 다리", "3. 깃털이 있다", "4. 비늘이 있다"], answer: 1, explanation: "절지동물은 딱딱한 껍질과 마디가 있는 다리를 가집니다." },
      { q: "'연체동물'의 예로 알맞은 것은?", options: ["1. 개미", "2. 오징어", "3. 참새", "4. 개구리"], answer: 1, explanation: "오징어는 몸이 부드러운 연체동물입니다." }
    ]},
    inferential: { title: "보완학습 | 추론·통합력", problems: [
      { q: "무척추동물이 사라지면 식물에게 어떤 영향이 있을까요?", options: ["1. 꽃가루받이가 안 된다", "2. 더 잘 자란다", "3. 색이 변한다", "4. 영향 없다"], answer: 0, explanation: "꿀벌 같은 무척추동물이 꽃가루를 옮겨줍니다." },
      { q: "지렁이가 땅에서 하는 역할은?", options: ["1. 씨앗 심기", "2. 흙을 기름지게 만들기", "3. 물 저장하기", "4. 바람 막기"], answer: 1, explanation: "지렁이는 땅을 파헤쳐 흙을 기름지게 합니다." }
    ]},
    critical: { title: "보완학습 | 비판·적용력", problems: [
      { q: "무척추동물이 생태계에서 중요한 이유는?", options: ["1. 예쁘기 때문에", "2. 자연의 균형을 유지하기 때문에", "3. 크기 때문에", "4. 소리 때문에"], answer: 1, explanation: "무척추동물은 생태계 균형에 중요한 역할을 합니다." },
      { q: "산호가 바다 생물에게 하는 역할은?", options: ["1. 먹이 제공", "2. 집 제공", "3. 물 정화", "4. 온도 조절"], answer: 1, explanation: "산호는 바다 생물에게 집을 제공합니다." }
    ]}
  },
  "04": {
    // 곤충의 세계
    literal: { title: "보완학습 | 핵심 이해력", problems: [
      { q: "곤충의 다리는 몇 개인가요?", options: ["1. 4개", "2. 6개", "3. 8개", "4. 10개"], answer: 1, explanation: "곤충의 다리는 가슴에서 세 쌍(6개)이 납니다." },
      { q: "곤충의 눈 형태는?", options: ["1. 단눈", "2. 겹눈(복안)", "3. 없음", "4. 하나"], answer: 1, explanation: "곤충의 눈은 수천 개의 낱눈이 모인 겹눈입니다." }
    ]},
    structural: { title: "보완학습 | 구조 파악력", problems: [
      { q: "곤충의 몸은 몇 부분으로 나뉘나요?", options: ["1. 2부분", "2. 3부분", "3. 4부분", "4. 5부분"], answer: 1, explanation: "곤충의 몸은 머리, 가슴, 배 세 부분입니다." },
      { q: "3문단에서 설명하는 곤충의 역할이 아닌 것은?", options: ["1. 분해자", "2. 수분", "3. 먹이", "4. 포식자"], answer: 3, explanation: "곤충은 분해자, 수분, 먹이 역할을 합니다." }
    ]},
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [
      { q: "'더듬이'의 역할은?", options: ["1. 먹기", "2. 냄새와 감촉 느끼기", "3. 걷기", "4. 날기"], answer: 1, explanation: "더듬이는 냄새와 감촉을 느끼는 기관입니다." },
      { q: "'수분(受粉)'의 뜻은?", options: ["1. 물을 주는 것", "2. 꽃가루가 암술에 닿는 것", "3. 씨앗을 심는 것", "4. 잎을 따는 것"], answer: 1, explanation: "수분은 꽃가루가 암술에 닿아 열매가 맺히는 과정입니다." }
    ]},
    inferential: { title: "보완학습 | 추론·통합력", problems: [
      { q: "곤충이 사라지면 농작물에 어떤 영향이 있을까요?", options: ["1. 더 잘 자란다", "2. 열매가 안 맺힌다", "3. 색이 변한다", "4. 영향 없다"], answer: 1, explanation: "곤충이 수분을 해야 열매가 맺힙니다." },
      { q: "거미가 곤충이 아닌 이유는?", options: ["1. 날개가 없어서", "2. 다리가 8개여서", "3. 작아서", "4. 눈이 없어서"], answer: 1, explanation: "거미는 다리가 4쌍(8개)이라 곤충이 아닙니다." }
    ]},
    critical: { title: "보완학습 | 비판·적용력", problems: [
      { q: "곤충 연구가 기술 발전에 도움이 되는 예는?", options: ["1. 요리법 개발", "2. 드론과 로봇 기술", "3. 건축 설계", "4. 음악 작곡"], answer: 1, explanation: "곤충의 비행 능력을 드론과 로봇에 적용합니다." },
      { q: "곤충이 인류에게 기여한 것이 아닌 것은?", options: ["1. 비단 생산", "2. 꿀 제공", "3. 석유 생산", "4. 친환경 단백질"], answer: 2, explanation: "석유는 곤충과 관계없습니다." }
    ]}
  },
  "05": {
    // 완전 탈바꿈과 불완전 탈바꿈
    literal: { title: "보완학습 | 핵심 이해력", problems: [
      { q: "완전 탈바꿈의 순서로 맞는 것은?", options: ["1. 알→번데기→애벌레→어른벌레", "2. 알→애벌레→번데기→어른벌레", "3. 알→어른벌레→애벌레→번데기", "4. 애벌레→알→번데기→어른벌레"], answer: 1, explanation: "완전 탈바꿈은 알→애벌레→번데기→어른벌레 순서입니다." },
      { q: "불완전 탈바꿈을 하는 곤충은?", options: ["1. 나비", "2. 잠자리", "3. 모기", "4. 벌"], answer: 1, explanation: "잠자리는 번데기 단계 없이 불완전 탈바꿈을 합니다." }
    ]},
    structural: { title: "보완학습 | 구조 파악력", problems: [
      { q: "완전 탈바꿈과 불완전 탈바꿈의 차이는?", options: ["1. 번데기 단계 유무", "2. 알 크기", "3. 색깔", "4. 소리"], answer: 0, explanation: "완전 탈바꿈은 번데기 단계가 있습니다." },
      { q: "3문단에서 설명하는 곤충은?", options: ["1. 나비", "2. 잠자리", "3. 매미", "4. 모기"], answer: 2, explanation: "3문단은 매미의 불완전 탈바꿈을 설명합니다." }
    ]},
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [
      { q: "'고치'의 뜻은?", options: ["1. 먹이", "2. 애벌레가 실로 만든 집", "3. 다리", "4. 날개"], answer: 1, explanation: "고치는 애벌레가 실을 뽑아 만든 껍데기입니다." },
      { q: "'탈피'의 뜻은?", options: ["1. 먹이를 먹다", "2. 겉껍질을 벗다", "3. 날아가다", "4. 숨다"], answer: 1, explanation: "탈피는 몸이 자라면서 겉껍질을 벗는 것입니다." }
    ]},
    inferential: { title: "보완학습 | 추론·통합력", problems: [
      { q: "나비 애벌레와 어른 나비의 먹이가 다른 이유는?", options: ["1. 맛이 달라서", "2. 경쟁을 피하기 위해", "3. 색깔 때문에", "4. 크기 때문에"], answer: 1, explanation: "같은 종끼리 먹이 경쟁을 피할 수 있습니다." },
      { q: "매미가 여름에 열정적으로 우는 이유는?", options: ["1. 더워서", "2. 성충 생활이 짧아서", "3. 배고파서", "4. 무서워서"], answer: 1, explanation: "매미 성충은 2~3주밖에 살지 못합니다." }
    ]},
    critical: { title: "보완학습 | 비판·적용력", problems: [
      { q: "불완전 탈바꿈의 장점은?", options: ["1. 더 예쁘다", "2. 번데기 무방비 상태를 피할 수 있다", "3. 더 오래 산다", "4. 더 크다"], answer: 1, explanation: "번데기 단계가 없어 포식자에게 잡힐 위험이 적습니다." },
      { q: "탈바꿈이 곤충에게 주는 이점은?", options: ["1. 색깔 변화", "2. 생존에 유리한 진화 전략", "3. 소리 변화", "4. 크기만 변화"], answer: 1, explanation: "탈바꿈은 생존을 위한 진화 전략입니다." }
    ]}
  },
  "06": {
    // 식물의 구조와 생존 전략
    literal: { title: "보완학습 | 핵심 이해력", problems: [
      { q: "식물의 세 가지 기본 구조는?", options: ["1. 꽃, 열매, 씨앗", "2. 뿌리, 줄기, 잎", "3. 가지, 나무, 숲", "4. 흙, 물, 공기"], answer: 1, explanation: "식물의 기본 구조는 뿌리, 줄기, 잎입니다." },
      { q: "물관과 체관의 역할은?", options: ["1. 광합성", "2. 물과 양분 운반", "3. 호흡", "4. 번식"], answer: 1, explanation: "물관은 물을, 체관은 양분을 운반합니다." }
    ]},
    structural: { title: "보완학습 | 구조 파악력", problems: [
      { q: "뿌리의 역할로 맞는 것은?", options: ["1. 광합성", "2. 물과 양분 흡수", "3. 산소 생성", "4. 꽃 피우기"], answer: 1, explanation: "뿌리는 물과 양분을 흡수하고 식물을 지탱합니다." },
      { q: "3문단에서 설명하는 기관은?", options: ["1. 뿌리", "2. 줄기", "3. 잎", "4. 꽃"], answer: 2, explanation: "3문단은 잎의 광합성을 설명합니다." }
    ]},
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [
      { q: "'기공'의 역할은?", options: ["1. 양분 저장", "2. 기체 교환", "3. 물 흡수", "4. 지지"], answer: 1, explanation: "기공은 잎 표면에서 기체 교환을 담당합니다." },
      { q: "'증산 작용'이란?", options: ["1. 물 흡수", "2. 수분 증발", "3. 양분 저장", "4. 광합성"], answer: 1, explanation: "증산 작용은 잎의 기공으로 수분이 증발하는 현상입니다." }
    ]},
    inferential: { title: "보완학습 | 추론·통합력", problems: [
      { q: "사막 식물의 잎이 가시로 변한 이유는?", options: ["1. 예뻐 보이려고", "2. 수분 손실을 줄이려고", "3. 동물을 유인하려고", "4. 더 크게 자라려고"], answer: 1, explanation: "가시로 변하면 수분 증발을 줄일 수 있습니다." },
      { q: "선인장의 줄기가 굵은 이유는?", options: ["1. 물을 저장하려고", "2. 예뻐 보이려고", "3. 높이 자라려고", "4. 단단해지려고"], answer: 0, explanation: "선인장은 줄기에 물을 저장합니다." }
    ]},
    critical: { title: "보완학습 | 비판·적용력", problems: [
      { q: "식물이 지구 환경에 기여하는 것이 아닌 것은?", options: ["1. 산소 생성", "2. 토양 유실 방지", "3. 석유 생산", "4. 먹이 사슬의 출발점"], answer: 2, explanation: "석유 생산은 식물의 역할이 아닙니다." },
      { q: "뿌리가 흙을 붙잡는 것이 중요한 이유는?", options: ["1. 예뻐 보이려고", "2. 산사태 방지", "3. 색깔 변화", "4. 소리 내기"], answer: 1, explanation: "뿌리는 흙을 붙잡아 산사태를 막습니다." }
    ]}
  },
  "07": {
    // 광합성
    literal: { title: "보완학습 | 핵심 이해력", problems: [
      { q: "광합성이 일어나는 장소는?", options: ["1. 뿌리", "2. 줄기", "3. 엽록체", "4. 꽃"], answer: 2, explanation: "광합성은 잎 속의 엽록체에서 일어납니다." },
      { q: "광합성으로 만들어지는 것은?", options: ["1. 물과 이산화탄소", "2. 포도당과 산소", "3. 녹말과 물", "4. 산소와 질소"], answer: 1, explanation: "광합성으로 포도당과 산소가 만들어집니다." }
    ]},
    structural: { title: "보완학습 | 구조 파악력", problems: [
      { q: "광합성의 재료는?", options: ["1. 포도당과 산소", "2. 이산화탄소와 물", "3. 녹말과 산소", "4. 질소와 물"], answer: 1, explanation: "광합성의 재료는 이산화탄소와 물입니다." },
      { q: "3문단에서 설명하는 내용은?", options: ["1. 광합성의 정의", "2. 광합성의 역사", "3. 광합성에 필요한 조건", "4. 광합성 산물"], answer: 2, explanation: "3문단은 광합성에 필요한 조건을 설명합니다." }
    ]},
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [
      { q: "'엽록소'의 역할은?", options: ["1. 물 흡수", "2. 햇빛 흡수", "3. 양분 저장", "4. 기체 교환"], answer: 1, explanation: "엽록소는 초록색 색소로 햇빛을 흡수합니다." },
      { q: "식물이 초록색인 이유는?", options: ["1. 물 때문에", "2. 엽록소 때문에", "3. 흙 때문에", "4. 공기 때문에"], answer: 1, explanation: "엽록소가 초록색이라 식물이 초록색으로 보입니다." }
    ]},
    inferential: { title: "보완학습 | 추론·통합력", problems: [
      { q: "식물이 밤에 광합성을 못하는 이유는?", options: ["1. 물이 없어서", "2. 빛이 없어서", "3. 흙이 없어서", "4. 공기가 없어서"], answer: 1, explanation: "광합성에는 햇빛이 필요합니다." },
      { q: "숲을 보호해야 하는 이유는?", options: ["1. 예쁘니까", "2. 지구 온난화를 늦추니까", "3. 그늘이 좋으니까", "4. 소리가 좋으니까"], answer: 1, explanation: "식물이 이산화탄소를 흡수해 온난화를 늦춥니다." }
    ]},
    critical: { title: "보완학습 | 비판·적용력", problems: [
      { q: "광합성이 지구 역사에 미친 영향은?", options: ["1. 바다가 생겼다", "2. 산소가 풍부해졌다", "3. 땅이 넓어졌다", "4. 하늘이 높아졌다"], answer: 1, explanation: "광합성으로 대기에 산소가 쌓였습니다." },
      { q: "광합성이 중요한 이유가 아닌 것은?", options: ["1. 산소 생성", "2. 양분 생성", "3. 석유 생성", "4. 이산화탄소 흡수"], answer: 2, explanation: "석유 생성은 광합성의 직접적인 역할이 아닙니다." }
    ]}
  },
  "08": {
    // 세포
    literal: { title: "보완학습 | 핵심 이해력", problems: [
      { q: "생명체를 구성하는 기본 단위는?", options: ["1. 분자", "2. 원자", "3. 세포", "4. 조직"], answer: 2, explanation: "세포는 생명체를 구성하는 기본 단위입니다." },
      { q: "세포의 핵에 들어 있는 것은?", options: ["1. 물", "2. DNA", "3. 녹말", "4. 산소"], answer: 1, explanation: "핵 안에는 유전 정보인 DNA가 있습니다." }
    ]},
    structural: { title: "보완학습 | 구조 파악력", problems: [
      { q: "식물 세포에만 있는 것은?", options: ["1. 핵", "2. 세포막", "3. 세포벽과 엽록체", "4. 세포질"], answer: 2, explanation: "세포벽과 엽록체는 식물 세포에만 있습니다." },
      { q: "2문단에서 설명하는 내용은?", options: ["1. 세포의 정의", "2. 세포의 내부 구조", "3. 세포 분열", "4. 세포의 역사"], answer: 1, explanation: "2문단은 세포의 내부 구조를 설명합니다." }
    ]},
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [
      { q: "'세포막'의 역할은?", options: ["1. 유전 정보 저장", "2. 물질 출입 조절", "3. 광합성", "4. 에너지 생산"], answer: 1, explanation: "세포막은 세포 안팎의 물질 출입을 조절합니다." },
      { q: "'단세포 생물'의 예는?", options: ["1. 사람", "2. 아메바", "3. 나무", "4. 개"], answer: 1, explanation: "아메바는 하나의 세포로 이루어진 단세포 생물입니다." }
    ]},
    inferential: { title: "보완학습 | 추론·통합력", problems: [
      { q: "상처가 치유되는 원리는?", options: ["1. 세포가 죽어서", "2. 세포 분열로 새 세포가 만들어져서", "3. 물이 들어가서", "4. 공기가 들어가서"], answer: 1, explanation: "세포 분열로 새 세포가 만들어져 상처가 치유됩니다." },
      { q: "세포의 발견이 중요한 이유는?", options: ["1. 예뻐서", "2. 생명의 기본 단위를 알게 되어서", "3. 크니까", "4. 색이 좋아서"], answer: 1, explanation: "세포 발견으로 생명의 기본 단위를 이해하게 되었습니다." }
    ]},
    critical: { title: "보완학습 | 비판·적용력", problems: [
      { q: "세포 연구가 도움이 되는 분야는?", options: ["1. 요리", "2. 질병 치료와 생명공학", "3. 음악", "4. 미술"], answer: 1, explanation: "세포 연구는 질병 치료와 생명공학에 기여합니다." },
      { q: "우리 몸의 세포 수는 약 몇 개인가요?", options: ["1. 37개", "2. 370개", "3. 37조 개", "4. 370조 개"], answer: 2, explanation: "우리 몸은 약 37조 개의 세포로 이루어져 있습니다." }
    ]}
  },
  "09": {
    // 세포 분열
    literal: { title: "보완학습 | 핵심 이해력", problems: [
      { q: "세포 분열이란?", options: ["1. 세포가 죽는 것", "2. 세포가 둘로 나누어지는 것", "3. 세포가 합쳐지는 것", "4. 세포가 색이 변하는 것"], answer: 1, explanation: "세포 분열은 하나의 세포가 둘로 나누어지는 과정입니다." },
      { q: "체세포 분열의 결과는?", options: ["1. 염색체가 절반으로 줄어든 세포", "2. 유전 정보가 똑같은 두 세포", "3. 세포가 없어짐", "4. 세포가 세 개로 나뉨"], answer: 1, explanation: "체세포 분열은 유전 정보가 똑같은 두 세포를 만듭니다." }
    ]},
    structural: { title: "보완학습 | 구조 파악력", problems: [
      { q: "감수 분열은 언제 일어나나요?", options: ["1. 성장할 때", "2. 생식 세포를 만들 때", "3. 상처가 났을 때", "4. 잠을 잘 때"], answer: 1, explanation: "감수 분열은 정자와 난자 같은 생식 세포를 만들 때 일어납니다." },
      { q: "3문단에서 설명하는 내용은?", options: ["1. 세포 분열의 정의", "2. 세포 분열의 종류", "3. 세포 분열 조절의 중요성", "4. 세포의 역사"], answer: 2, explanation: "3문단은 세포 분열 조절과 암에 대해 설명합니다." }
    ]},
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [
      { q: "'암'이 생기는 이유는?", options: ["1. 세포가 너무 천천히 분열해서", "2. 세포 분열이 조절되지 않아서", "3. 세포가 분열을 안 해서", "4. 세포가 색이 변해서"], answer: 1, explanation: "암은 세포 분열이 멈추지 않고 계속되면 발생합니다." },
      { q: "'세포 자멸사'란?", options: ["1. 세포가 죽지 않는 것", "2. 비정상 세포가 스스로 죽는 것", "3. 세포가 커지는 것", "4. 세포가 합쳐지는 것"], answer: 1, explanation: "세포 자멸사는 비정상 세포가 스스로 죽는 현상입니다." }
    ]},
    inferential: { title: "보완학습 | 추론·통합력", problems: [
      { q: "감수 분열에서 염색체가 절반으로 줄어드는 이유는?", options: ["1. 세포가 작아지려고", "2. 수정란이 정상 염색체 수를 갖기 위해", "3. 색깔을 바꾸려고", "4. 빨리 자라려고"], answer: 1, explanation: "정자와 난자가 만나 정상 46개 염색체를 유지하기 위해서입니다." },
      { q: "피부 세포가 빠르게 분열하는 이유는?", options: ["1. 자주 손상되어 교체가 필요해서", "2. 예뻐 보이려고", "3. 색을 바꾸려고", "4. 향기를 내려고"], answer: 0, explanation: "피부는 자주 손상되어 빠른 교체가 필요합니다." }
    ]},
    critical: { title: "보완학습 | 비판·적용력", problems: [
      { q: "세포 분열 연구가 중요한 분야는?", options: ["1. 요리", "2. 암 치료와 줄기세포 연구", "3. 음악", "4. 건축"], answer: 1, explanation: "세포 분열 연구는 암 치료와 줄기세포 연구에 기여합니다." },
      { q: "신경 세포가 거의 분열하지 않는 것의 의미는?", options: ["1. 손상되면 회복이 어렵다", "2. 빨리 자란다", "3. 색이 변한다", "4. 소리가 난다"], answer: 0, explanation: "신경 세포는 분열이 적어 손상 시 회복이 어렵습니다." }
    ]}
  },
  "10": {
    // 소화
    literal: { title: "보완학습 | 핵심 이해력", problems: [
      { q: "소화가 시작되는 곳은?", options: ["1. 위", "2. 소장", "3. 입", "4. 대장"], answer: 2, explanation: "소화는 입에서 시작됩니다." },
      { q: "침에 있는 소화 효소는?", options: ["1. 펩신", "2. 아밀레이스", "3. 담즙", "4. 위산"], answer: 1, explanation: "침에는 녹말을 분해하는 아밀레이스가 있습니다." }
    ]},
    structural: { title: "보완학습 | 구조 파악력", problems: [
      { q: "위에서 분해되는 영양소는?", options: ["1. 탄수화물", "2. 단백질", "3. 지방", "4. 비타민"], answer: 1, explanation: "위의 펩신은 단백질을 분해합니다." },
      { q: "소화와 흡수가 주로 일어나는 곳은?", options: ["1. 입", "2. 위", "3. 소장", "4. 대장"], answer: 2, explanation: "소장에서 소화와 흡수의 대부분이 일어납니다." }
    ]},
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [
      { q: "'융모'의 역할은?", options: ["1. 소화액 분비", "2. 흡수 면적 넓히기", "3. 음식 저장", "4. 세균 죽이기"], answer: 1, explanation: "융모는 소장 벽의 돌기로 흡수 면적을 넓힙니다." },
      { q: "'담즙'이 분해하는 것은?", options: ["1. 단백질", "2. 탄수화물", "3. 지방", "4. 비타민"], answer: 2, explanation: "담즙은 지방을 작은 알갱이로 분해합니다." }
    ]},
    inferential: { title: "보완학습 | 추론·통합력", problems: [
      { q: "밥을 오래 씹으면 단맛이 나는 이유는?", options: ["1. 설탕이 들어가서", "2. 아밀레이스가 녹말을 분해해서", "3. 소금이 들어가서", "4. 물이 들어가서"], answer: 1, explanation: "침의 아밀레이스가 녹말을 당으로 분해합니다." },
      { q: "지방이 많은 음식이 위에 오래 머무는 이유는?", options: ["1. 맛있어서", "2. 소화에 시간이 오래 걸려서", "3. 색이 예뻐서", "4. 향이 좋아서"], answer: 1, explanation: "지방은 소화에 시간이 더 걸립니다." }
    ]},
    critical: { title: "보완학습 | 비판·적용력", problems: [
      { q: "건강한 소화를 위해 중요한 것은?", options: ["1. 빨리 먹기", "2. 규칙적 식사와 충분한 수분", "3. 한 가지만 먹기", "4. 굶기"], answer: 1, explanation: "규칙적 식사와 충분한 수분이 소화에 좋습니다." },
      { q: "대장의 유익한 세균이 하는 일은?", options: ["1. 영양소 흡수", "2. 소화를 돕고 면역력 높이기", "3. 음식 저장", "4. 물 분비"], answer: 1, explanation: "대장의 유익균은 소화를 돕고 면역력을 높입니다." }
    ]}
  },
  "11": {
    // 혈액 순환
    literal: { title: "보완학습 | 핵심 이해력", problems: [
      { q: "혈액 순환의 중심 기관은?", options: ["1. 폐", "2. 심장", "3. 간", "4. 신장"], answer: 1, explanation: "심장은 혈액을 온몸으로 밀어내는 펌프 역할을 합니다." },
      { q: "동맥의 역할은?", options: ["1. 심장으로 혈액을 보냄", "2. 심장에서 온몸으로 혈액을 보냄", "3. 혈액을 저장함", "4. 혈액을 만듦"], answer: 1, explanation: "동맥은 심장에서 온몸으로 혈액을 보냅니다." }
    ]},
    structural: { title: "보완학습 | 구조 파악력", problems: [
      { q: "폐순환에서 혈액이 얻는 것은?", options: ["1. 영양분", "2. 산소", "3. 노폐물", "4. 이산화탄소"], answer: 1, explanation: "폐순환에서 혈액은 폐에서 산소를 받아옵니다." },
      { q: "모세 혈관의 역할은?", options: ["1. 혈액 저장", "2. 세포와 물질 교환", "3. 혈액 생산", "4. 심장 보호"], answer: 1, explanation: "모세 혈관에서 산소와 영양분이 세포에 전달됩니다." }
    ]},
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [
      { q: "'적혈구'의 역할은?", options: ["1. 세균과 싸움", "2. 산소 운반", "3. 피 멈춤", "4. 영양분 저장"], answer: 1, explanation: "적혈구는 산소를 운반합니다." },
      { q: "'혈소판'의 역할은?", options: ["1. 산소 운반", "2. 상처 났을 때 피 멈춤", "3. 세균과 싸움", "4. 영양분 운반"], answer: 1, explanation: "혈소판은 상처가 났을 때 피를 멈추게 합니다." }
    ]},
    inferential: { title: "보완학습 | 추론·통합력", problems: [
      { q: "혈액 순환이 안 되면 나타나는 증상은?", options: ["1. 더 건강해짐", "2. 손발이 차가워짐", "3. 키가 커짐", "4. 눈이 좋아짐"], answer: 1, explanation: "혈액 순환이 안 되면 손발이 차가워지고 피로해집니다." },
      { q: "운동이 혈액 순환에 좋은 이유는?", options: ["1. 심장과 혈관을 튼튼하게 해서", "2. 잠이 와서", "3. 배가 고파져서", "4. 목이 말라서"], answer: 0, explanation: "운동은 심장과 혈관을 튼튼하게 합니다." }
    ]},
    critical: { title: "보완학습 | 비판·적용력", problems: [
      { q: "백혈구가 하는 일은?", options: ["1. 산소 운반", "2. 세균과 싸움", "3. 피 멈춤", "4. 영양분 저장"], answer: 1, explanation: "백혈구는 세균과 싸워 몸을 보호합니다." },
      { q: "심장이 하루에 약 몇 번 뛰나요?", options: ["1. 1천 번", "2. 1만 번", "3. 10만 번", "4. 100만 번"], answer: 2, explanation: "심장은 하루에 약 10만 번 뜁니다." }
    ]}
  },
  "12": {
    // 호흡
    literal: { title: "보완학습 | 핵심 이해력", problems: [
      { q: "호흡에서 들이마시는 기체는?", options: ["1. 이산화탄소", "2. 산소", "3. 질소", "4. 수소"], answer: 1, explanation: "호흡에서 산소를 들이마십니다." },
      { q: "폐에서 기체 교환이 일어나는 곳은?", options: ["1. 기관지", "2. 폐포", "3. 코", "4. 목"], answer: 1, explanation: "폐포에서 산소와 이산화탄소가 교환됩니다." }
    ]},
    structural: { title: "보완학습 | 구조 파악력", problems: [
      { q: "코털과 점막의 역할은?", options: ["1. 향기 맡기", "2. 이물질 걸러내기", "3. 소리 내기", "4. 맛 느끼기"], answer: 1, explanation: "코털과 점막은 먼지와 세균을 걸러냅니다." },
      { q: "횡격막이 내려가면 어떻게 되나요?", options: ["1. 숨을 내쉼", "2. 숨을 들이마심", "3. 기침함", "4. 재채기함"], answer: 1, explanation: "횡격막이 내려가면 폐가 확장되어 숨을 들이마십니다." }
    ]},
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [
      { q: "'폐포'의 특징은?", options: ["1. 크고 단단함", "2. 작은 포도송이 모양", "3. 네모난 모양", "4. 세모난 모양"], answer: 1, explanation: "폐포는 작은 포도송이처럼 생긴 공기주머니입니다." },
      { q: "'세포 호흡'이란?", options: ["1. 코로 숨 쉬는 것", "2. 세포에서 에너지를 만드는 것", "3. 입으로 숨 쉬는 것", "4. 잠을 자는 것"], answer: 1, explanation: "세포 호흡은 세포에서 양분을 분해해 에너지를 만드는 과정입니다." }
    ]},
    inferential: { title: "보완학습 | 추론·통합력", problems: [
      { q: "운동할 때 호흡이 빨라지는 이유는?", options: ["1. 산소가 더 많이 필요해서", "2. 잠이 와서", "3. 배가 고파서", "4. 목이 말라서"], answer: 0, explanation: "운동하면 에너지가 많이 필요해 산소 요구량이 늘어납니다." },
      { q: "폐포가 포도송이처럼 많은 이유는?", options: ["1. 예뻐 보이려고", "2. 표면적을 넓혀 기체 교환을 잘하려고", "3. 무거워지려고", "4. 색을 바꾸려고"], answer: 1, explanation: "폐포가 많아 표면적이 넓어 기체 교환이 효율적입니다." }
    ]},
    critical: { title: "보완학습 | 비판·적용력", problems: [
      { q: "담배가 폐에 나쁜 이유는?", options: ["1. 맛이 없어서", "2. 폐포를 손상시켜서", "3. 색이 변해서", "4. 소리가 나서"], answer: 1, explanation: "담배 연기는 폐포를 손상시켜 호흡 기능을 떨어뜨립니다." },
      { q: "호흡이 중요한 이유는?", options: ["1. 소리를 내려고", "2. 세포에 산소를 공급하고 에너지를 만들려고", "3. 색을 바꾸려고", "4. 향기를 맡으려고"], answer: 1, explanation: "호흡으로 산소를 공급받아 에너지를 만듭니다." }
    ]}
  },
  "13": {
    // 배설
    literal: { title: "보완학습 | 핵심 이해력", problems: [
      { q: "노폐물을 걸러내는 기관은?", options: ["1. 심장", "2. 폐", "3. 콩팥(신장)", "4. 위"], answer: 2, explanation: "콩팥(신장)은 혈액에서 노폐물을 걸러냅니다." },
      { q: "콩팥에서 만들어지는 것은?", options: ["1. 혈액", "2. 소변", "3. 담즙", "4. 침"], answer: 1, explanation: "콩팥에서 노폐물과 물이 합쳐져 소변이 됩니다." }
    ]},
    structural: { title: "보완학습 | 구조 파악력", problems: [
      { q: "소변이 저장되는 곳은?", options: ["1. 콩팥", "2. 방광", "3. 요관", "4. 요도"], answer: 1, explanation: "방광은 소변을 저장하는 주머니입니다." },
      { q: "콩팥이 하는 일이 아닌 것은?", options: ["1. 노폐물 제거", "2. 수분 조절", "3. 음식 소화", "4. 혈압 조절"], answer: 2, explanation: "음식 소화는 소화 기관의 역할입니다." }
    ]},
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [
      { q: "'네프론'이란?", options: ["1. 심장의 일부", "2. 콩팥의 기본 단위", "3. 폐의 일부", "4. 위의 일부"], answer: 1, explanation: "네프론은 콩팥에서 노폐물을 걸러내는 기본 단위입니다." },
      { q: "'요소'가 만들어지는 곳은?", options: ["1. 콩팥", "2. 간", "3. 폐", "4. 심장"], answer: 1, explanation: "간에서 암모니아를 요소로 바꿔 콩팥으로 보냅니다." }
    ]},
    inferential: { title: "보완학습 | 추론·통합력", problems: [
      { q: "물을 많이 마시면 소변이 어떻게 되나요?", options: ["1. 진해짐", "2. 양이 많아지고 연해짐", "3. 양이 줄어듦", "4. 색이 짙어짐"], answer: 1, explanation: "물을 많이 마시면 소변 양이 많아지고 연해집니다." },
      { q: "콩팥이 건강해야 하는 이유는?", options: ["1. 예뻐 보이려고", "2. 노폐물을 제대로 제거하려고", "3. 소리를 내려고", "4. 색을 바꾸려고"], answer: 1, explanation: "콩팥이 건강해야 노폐물을 제대로 제거합니다." }
    ]},
    critical: { title: "보완학습 | 비판·적용력", problems: [
      { q: "투석 치료가 필요한 경우는?", options: ["1. 심장이 아플 때", "2. 콩팥이 제 기능을 못할 때", "3. 폐가 아플 때", "4. 위가 아플 때"], answer: 1, explanation: "콩팥이 기능을 못하면 투석으로 노폐물을 제거합니다." },
      { q: "콩팥 건강을 위해 좋은 습관은?", options: ["1. 짠 음식 많이 먹기", "2. 물 충분히 마시고 짠 음식 줄이기", "3. 물 적게 마시기", "4. 소금 많이 먹기"], answer: 1, explanation: "물을 충분히 마시고 짠 음식을 줄이면 콩팥에 좋습니다." }
    ]}
  },
  "14": {
    // 뼈와 근육
    literal: { title: "보완학습 | 핵심 이해력", problems: [
      { q: "사람의 뼈는 약 몇 개인가요?", options: ["1. 106개", "2. 206개", "3. 306개", "4. 406개"], answer: 1, explanation: "어른의 뼈는 약 206개입니다." },
      { q: "뼈가 하는 일이 아닌 것은?", options: ["1. 몸 지탱", "2. 장기 보호", "3. 소화", "4. 혈액 세포 생산"], answer: 2, explanation: "소화는 소화 기관의 역할입니다." }
    ]},
    structural: { title: "보완학습 | 구조 파악력", problems: [
      { q: "관절의 역할은?", options: ["1. 뼈를 만듦", "2. 뼈와 뼈를 연결하고 움직이게 함", "3. 근육을 만듦", "4. 혈액을 만듦"], answer: 1, explanation: "관절은 뼈와 뼈를 연결하여 움직일 수 있게 합니다." },
      { q: "근육이 뼈에 붙는 부분은?", options: ["1. 관절", "2. 힘줄", "3. 인대", "4. 연골"], answer: 1, explanation: "힘줄은 근육을 뼈에 연결합니다." }
    ]},
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [
      { q: "'골수'의 역할은?", options: ["1. 뼈를 단단하게 함", "2. 혈액 세포 생산", "3. 근육을 만듦", "4. 관절을 보호함"], answer: 1, explanation: "골수는 뼈 속에서 혈액 세포를 만듭니다." },
      { q: "'인대'의 역할은?", options: ["1. 근육을 뼈에 연결", "2. 뼈와 뼈를 연결", "3. 혈액 세포 생산", "4. 뼈를 단단하게 함"], answer: 1, explanation: "인대는 뼈와 뼈를 연결합니다." }
    ]},
    inferential: { title: "보완학습 | 추론·통합력", problems: [
      { q: "운동이 뼈에 좋은 이유는?", options: ["1. 뼈가 부러지니까", "2. 뼈를 튼튼하게 자극하니까", "3. 뼈가 작아지니까", "4. 뼈가 없어지니까"], answer: 1, explanation: "운동하면 뼈에 자극이 가해져 더 튼튼해집니다." },
      { q: "어린이의 뼈가 어른보다 많은 이유는?", options: ["1. 더 커서", "2. 여러 뼈가 자라면서 합쳐지기 때문에", "3. 더 가벼워서", "4. 색이 달라서"], answer: 1, explanation: "어린이의 뼈는 성장하면서 일부가 합쳐집니다." }
    ]},
    critical: { title: "보완학습 | 비판·적용력", problems: [
      { q: "골다공증을 예방하려면?", options: ["1. 칼슘이 적은 음식 먹기", "2. 칼슘 섭취와 규칙적 운동", "3. 가만히 있기", "4. 뼈를 쓰지 않기"], answer: 1, explanation: "칼슘 섭취와 운동이 골다공증 예방에 좋습니다." },
      { q: "근육이 쌍으로 작용하는 이유는?", options: ["1. 예뻐 보이려고", "2. 한쪽이 수축하면 다른 쪽이 이완해야 움직이니까", "3. 색을 바꾸려고", "4. 소리를 내려고"], answer: 1, explanation: "근육은 수축과 이완을 통해 움직임을 만듭니다." }
    ]}
  },
  "15": {
    // 감각기관
    literal: { title: "보완학습 | 핵심 이해력", problems: [
      { q: "다섯 가지 감각이 아닌 것은?", options: ["1. 시각", "2. 청각", "3. 중력", "4. 미각"], answer: 2, explanation: "다섯 가지 감각은 시각, 청각, 후각, 미각, 촉각입니다." },
      { q: "눈에서 빛을 감지하는 부분은?", options: ["1. 각막", "2. 망막", "3. 수정체", "4. 홍채"], answer: 1, explanation: "망막에서 빛을 감지하여 뇌로 신호를 보냅니다." }
    ]},
    structural: { title: "보완학습 | 구조 파악력", problems: [
      { q: "귀에서 소리를 전달하는 뼈는?", options: ["1. 달팽이관", "2. 이소골", "3. 고막", "4. 반고리관"], answer: 1, explanation: "이소골은 고막의 진동을 달팽이관으로 전달합니다." },
      { q: "코에서 냄새를 감지하는 곳은?", options: ["1. 콧구멍", "2. 후각 세포", "3. 코털", "4. 점막"], answer: 1, explanation: "후각 세포가 냄새 분자를 감지합니다." }
    ]},
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [
      { q: "'수정체'의 역할은?", options: ["1. 눈을 보호함", "2. 빛을 굴절시켜 초점을 맞춤", "3. 눈 색깔 결정", "4. 눈물 생산"], answer: 1, explanation: "수정체는 빛을 굴절시켜 망막에 초점을 맞춥니다." },
      { q: "'미뢰'가 있는 곳은?", options: ["1. 코", "2. 혀", "3. 귀", "4. 피부"], answer: 1, explanation: "미뢰는 혀에 있는 맛봉오리입니다." }
    ]},
    inferential: { title: "보완학습 | 추론·통합력", problems: [
      { q: "감기에 걸리면 음식 맛이 안 느껴지는 이유는?", options: ["1. 혀가 아파서", "2. 코가 막혀 후각이 안 되어서", "3. 귀가 아파서", "4. 눈이 아파서"], answer: 1, explanation: "미각과 후각이 연결되어 있어 코가 막히면 맛을 잘 못 느낍니다." },
      { q: "시끄러운 소리가 귀에 나쁜 이유는?", options: ["1. 색이 변해서", "2. 청각 세포가 손상되어서", "3. 향기가 나빠서", "4. 맛이 변해서"], answer: 1, explanation: "시끄러운 소리는 청각 세포를 손상시킵니다." }
    ]},
    critical: { title: "보완학습 | 비판·적용력", problems: [
      { q: "눈 건강을 위해 좋은 습관은?", options: ["1. 어두운 곳에서 책 읽기", "2. 적절한 휴식과 먼 곳 바라보기", "3. 오래 화면 보기", "4. 눈 비비기"], answer: 1, explanation: "적절한 휴식과 먼 곳 바라보기가 눈에 좋습니다." },
      { q: "감각기관이 중요한 이유는?", options: ["1. 예뻐 보이려고", "2. 환경 정보를 뇌에 전달해 반응하게 하려고", "3. 색을 바꾸려고", "4. 소리를 내려고"], answer: 1, explanation: "감각기관은 환경 정보를 뇌에 전달합니다." }
    ]}
  },
  "16": {
    // 신경계
    literal: { title: "보완학습 | 핵심 이해력", problems: [
      { q: "신경계의 중심 기관은?", options: ["1. 심장과 폐", "2. 뇌와 척수", "3. 간과 콩팥", "4. 위와 소장"], answer: 1, explanation: "신경계의 중심은 뇌와 척수입니다." },
      { q: "신경 세포 사이에서 신호를 전달하는 곳은?", options: ["1. 세포체", "2. 시냅스", "3. 축삭", "4. 수상돌기"], answer: 1, explanation: "시냅스에서 신경전달물질로 신호가 전달됩니다." }
    ]},
    structural: { title: "보완학습 | 구조 파악력", problems: [
      { q: "대뇌의 역할은?", options: ["1. 심장 박동 조절", "2. 생각, 기억, 감각 처리", "3. 균형 유지", "4. 호르몬 분비"], answer: 1, explanation: "대뇌는 생각, 기억, 감각 처리를 담당합니다." },
      { q: "말초 신경계의 역할은?", options: ["1. 생각하기", "2. 온몸과 중추신경계 연결", "3. 기억하기", "4. 꿈꾸기"], answer: 1, explanation: "말초 신경계는 온몸과 중추신경계를 연결합니다." }
    ]},
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [
      { q: "'반사'의 예는?", options: ["1. 수학 문제 풀기", "2. 뜨거운 것 만지면 손 빼기", "3. 책 읽기", "4. 노래 부르기"], answer: 1, explanation: "반사는 의식하지 않고 빠르게 일어나는 반응입니다." },
      { q: "'자율 신경'이 조절하는 것은?", options: ["1. 손가락 움직임", "2. 심장 박동과 소화", "3. 걷기", "4. 말하기"], answer: 1, explanation: "자율 신경은 심장 박동, 소화 등을 자동으로 조절합니다." }
    ]},
    inferential: { title: "보완학습 | 추론·통합력", problems: [
      { q: "척수가 다치면 어떻게 되나요?", options: ["1. 아무 영향 없음", "2. 몸의 일부가 마비될 수 있음", "3. 더 건강해짐", "4. 키가 커짐"], answer: 1, explanation: "척수가 다치면 신호 전달이 안 되어 마비될 수 있습니다." },
      { q: "수면이 뇌에 중요한 이유는?", options: ["1. 살이 찌려고", "2. 뇌가 휴식하고 기억을 정리하려고", "3. 배가 고파지려고", "4. 목이 마르려고"], answer: 1, explanation: "수면 중에 뇌가 휴식하고 기억을 정리합니다." }
    ]},
    critical: { title: "보완학습 | 비판·적용력", problems: [
      { q: "뇌 건강을 위해 좋은 것은?", options: ["1. 밤새 게임하기", "2. 충분한 수면과 규칙적 운동", "3. 굶기", "4. 가만히 있기"], answer: 1, explanation: "충분한 수면과 운동이 뇌 건강에 좋습니다." },
      { q: "소뇌가 손상되면 어떻게 되나요?", options: ["1. 말을 못함", "2. 균형을 잡기 어려움", "3. 눈이 안 보임", "4. 소리가 안 들림"], answer: 1, explanation: "소뇌가 손상되면 균형과 운동 조절이 어려워집니다." }
    ]}
  },
  "17": {
    // 호르몬
    literal: { title: "보완학습 | 핵심 이해력", problems: [
      { q: "호르몬을 분비하는 기관의 총칭은?", options: ["1. 소화샘", "2. 내분비샘", "3. 땀샘", "4. 침샘"], answer: 1, explanation: "내분비샘에서 호르몬을 분비합니다." },
      { q: "호르몬이 이동하는 경로는?", options: ["1. 신경", "2. 혈액", "3. 림프", "4. 공기"], answer: 1, explanation: "호르몬은 혈액을 통해 온몸으로 이동합니다." }
    ]},
    structural: { title: "보완학습 | 구조 파악력", problems: [
      { q: "성장호르몬을 분비하는 곳은?", options: ["1. 갑상샘", "2. 뇌하수체", "3. 부신", "4. 췌장"], answer: 1, explanation: "뇌하수체에서 성장호르몬을 분비합니다." },
      { q: "인슐린의 역할은?", options: ["1. 키 성장", "2. 혈당 조절", "3. 칼슘 조절", "4. 성장 촉진"], answer: 1, explanation: "인슐린은 혈당을 낮추는 역할을 합니다." }
    ]},
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [
      { q: "'아드레날린'이 분비되는 상황은?", options: ["1. 잠잘 때", "2. 긴장하거나 위험할 때", "3. 밥 먹을 때", "4. 공부할 때"], answer: 1, explanation: "아드레날린은 긴장하거나 위험할 때 분비됩니다." },
      { q: "'갑상샘 호르몬'의 역할은?", options: ["1. 혈당 조절", "2. 대사율 조절", "3. 성장 촉진", "4. 면역력 증가"], answer: 1, explanation: "갑상샘 호르몬은 신체의 대사율을 조절합니다." }
    ]},
    inferential: { title: "보완학습 | 추론·통합력", problems: [
      { q: "인슐린이 부족하면 생기는 병은?", options: ["1. 감기", "2. 당뇨병", "3. 골다공증", "4. 빈혈"], answer: 1, explanation: "인슐린이 부족하면 혈당 조절이 안 되어 당뇨병이 생깁니다." },
      { q: "성장호르몬이 주로 분비되는 시간은?", options: ["1. 아침", "2. 밤 수면 중", "3. 점심", "4. 저녁"], answer: 1, explanation: "성장호르몬은 밤에 자는 동안 주로 분비됩니다." }
    ]},
    critical: { title: "보완학습 | 비판·적용력", problems: [
      { q: "호르몬 균형이 깨지면 어떻게 되나요?", options: ["1. 건강해짐", "2. 여러 가지 질병이 생길 수 있음", "3. 키가 커짐", "4. 더 똑똑해짐"], answer: 1, explanation: "호르몬 균형이 깨지면 다양한 질병이 생길 수 있습니다." },
      { q: "청소년기에 성호르몬의 역할은?", options: ["1. 소화 촉진", "2. 2차 성징 발달", "3. 면역력 증가", "4. 시력 향상"], answer: 1, explanation: "성호르몬은 청소년기 2차 성징 발달에 관여합니다." }
    ]}
  },
  "18": {
    // 면역
    literal: { title: "보완학습 | 핵심 이해력", problems: [
      { q: "면역이란?", options: ["1. 병을 만드는 것", "2. 병원체로부터 몸을 지키는 것", "3. 소화하는 것", "4. 호흡하는 것"], answer: 1, explanation: "면역은 병원체로부터 몸을 보호하는 시스템입니다." },
      { q: "백혈구의 역할은?", options: ["1. 산소 운반", "2. 병원체와 싸움", "3. 혈액 응고", "4. 영양분 운반"], answer: 1, explanation: "백혈구는 세균과 바이러스와 싸웁니다." }
    ]},
    structural: { title: "보완학습 | 구조 파악력", problems: [
      { q: "피부가 면역에서 하는 역할은?", options: ["1. 병원체 생산", "2. 1차 방어벽", "3. 항체 생산", "4. 에너지 생산"], answer: 1, explanation: "피부는 병원체의 침입을 막는 1차 방어벽입니다." },
      { q: "항체를 만드는 세포는?", options: ["1. 적혈구", "2. B림프구", "3. 혈소판", "4. 신경세포"], answer: 1, explanation: "B림프구가 항체를 만들어 병원체를 공격합니다." }
    ]},
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [
      { q: "'항체'의 역할은?", options: ["1. 산소 운반", "2. 특정 병원체에 결합하여 무력화", "3. 혈액 응고", "4. 소화 촉진"], answer: 1, explanation: "항체는 특정 병원체에 결합하여 무력화시킵니다." },
      { q: "'백신'의 원리는?", options: ["1. 병원체를 키움", "2. 약화된 병원체로 면역력을 미리 만듦", "3. 영양분 공급", "4. 호르몬 분비"], answer: 1, explanation: "백신은 약화된 병원체로 미리 면역력을 만듭니다." }
    ]},
    inferential: { title: "보완학습 | 추론·통합력", problems: [
      { q: "같은 병에 두 번 안 걸리는 이유는?", options: ["1. 운이 좋아서", "2. 기억세포가 항체를 빨리 만들어서", "3. 몸이 커져서", "4. 나이가 들어서"], answer: 1, explanation: "기억세포가 병원체를 기억하고 빠르게 대응합니다." },
      { q: "열이 나는 것이 면역에 도움이 되는 이유는?", options: ["1. 예뻐 보이려고", "2. 병원체 활동을 억제하려고", "3. 잠이 오려고", "4. 배가 고파지려고"], answer: 1, explanation: "체온이 올라가면 병원체의 활동이 약해집니다." }
    ]},
    critical: { title: "보완학습 | 비판·적용력", problems: [
      { q: "면역력을 높이는 방법은?", options: ["1. 밤새 안 자기", "2. 충분한 수면과 균형 잡힌 식사", "3. 굶기", "4. 운동 안 하기"], answer: 1, explanation: "충분한 수면과 균형 잡힌 식사가 면역력을 높입니다." },
      { q: "알레르기가 생기는 이유는?", options: ["1. 면역이 너무 약해서", "2. 면역계가 무해한 물질에 과민 반응해서", "3. 병원체가 많아서", "4. 운동을 안 해서"], answer: 1, explanation: "알레르기는 면역계가 무해한 물질에 과민 반응하는 것입니다." }
    ]}
  },
  "19": {
    // 유전
    literal: { title: "보완학습 | 핵심 이해력", problems: [
      { q: "유전 정보를 담고 있는 물질은?", options: ["1. 단백질", "2. DNA", "3. 지방", "4. 탄수화물"], answer: 1, explanation: "DNA는 유전 정보를 담고 있습니다." },
      { q: "DNA가 들어 있는 곳은?", options: ["1. 세포막", "2. 핵", "3. 세포질", "4. 세포벽"], answer: 1, explanation: "DNA는 세포의 핵 안에 있습니다." }
    ]},
    structural: { title: "보완학습 | 구조 파악력", problems: [
      { q: "DNA의 모양은?", options: ["1. 직선", "2. 이중 나선", "3. 원", "4. 삼각형"], answer: 1, explanation: "DNA는 이중 나선 모양입니다." },
      { q: "유전자의 역할은?", options: ["1. 에너지 생산", "2. 특정 형질을 결정하는 정보 제공", "3. 소화 촉진", "4. 호흡 조절"], answer: 1, explanation: "유전자는 특정 형질을 결정하는 정보를 담고 있습니다." }
    ]},
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [
      { q: "'형질'의 예는?", options: ["1. 나이", "2. 눈 색깔, 혈액형", "3. 이름", "4. 사는 곳"], answer: 1, explanation: "형질은 눈 색깔, 혈액형처럼 유전되는 특성입니다." },
      { q: "'염색체'란?", options: ["1. 색깔을 내는 물질", "2. DNA가 뭉쳐 있는 구조물", "3. 영양분", "4. 호르몬"], answer: 1, explanation: "염색체는 DNA가 뭉쳐 있는 구조물입니다." }
    ]},
    inferential: { title: "보완학습 | 추론·통합력", problems: [
      { q: "부모와 자녀가 닮는 이유는?", options: ["1. 같이 살아서", "2. 유전자를 물려받아서", "3. 같은 음식을 먹어서", "4. 같은 옷을 입어서"], answer: 1, explanation: "자녀는 부모로부터 유전자를 물려받아 닮습니다." },
      { q: "일란성 쌍둥이가 매우 닮는 이유는?", options: ["1. 함께 자라서", "2. 같은 DNA를 가져서", "3. 같은 학교를 다녀서", "4. 같은 친구가 있어서"], answer: 1, explanation: "일란성 쌍둥이는 같은 DNA를 가지고 있습니다." }
    ]},
    critical: { title: "보완학습 | 비판·적용력", problems: [
      { q: "유전자 연구가 중요한 분야는?", options: ["1. 요리", "2. 질병 치료와 유전 질환 예방", "3. 음악", "4. 미술"], answer: 1, explanation: "유전자 연구는 질병 치료와 유전 질환 예방에 중요합니다." },
      { q: "환경이 형질에 영향을 주는 예는?", options: ["1. 혈액형", "2. 키와 피부색", "3. 눈 색깔", "4. 귓불 모양"], answer: 1, explanation: "키와 피부색은 영양과 햇빛 등 환경 영향을 받습니다." }
    ]}
  },
  "20": {
    // 생태계
    literal: { title: "보완학습 | 핵심 이해력", problems: [
      { q: "생태계를 구성하는 두 요소는?", options: ["1. 낮과 밤", "2. 생물과 비생물적 환경", "3. 땅과 하늘", "4. 물과 불"], answer: 1, explanation: "생태계는 생물과 비생물적 환경으로 구성됩니다." },
      { q: "먹이 사슬의 출발점은?", options: ["1. 육식동물", "2. 생산자(식물)", "3. 분해자", "4. 소비자"], answer: 1, explanation: "먹이 사슬은 생산자인 식물에서 시작합니다." }
    ]},
    structural: { title: "보완학습 | 구조 파악력", problems: [
      { q: "분해자의 역할은?", options: ["1. 양분 생산", "2. 죽은 생물 분해", "3. 다른 생물 잡아먹기", "4. 광합성"], answer: 1, explanation: "분해자는 죽은 생물을 분해하여 양분으로 돌려줍니다." },
      { q: "생태계 평형이란?", options: ["1. 생물이 모두 같아지는 것", "2. 생물 수와 환경이 안정되게 유지되는 것", "3. 환경이 변하지 않는 것", "4. 생물이 없어지는 것"], answer: 1, explanation: "생태계 평형은 생물 수와 환경이 안정되게 유지되는 상태입니다." }
    ]},
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [
      { q: "'생산자'의 예는?", options: ["1. 사자", "2. 나무와 풀", "3. 곰팡이", "4. 토끼"], answer: 1, explanation: "생산자는 광합성으로 양분을 만드는 식물입니다." },
      { q: "'먹이 그물'이란?", options: ["1. 하나의 먹이 사슬", "2. 여러 먹이 사슬이 복잡하게 연결된 것", "3. 음식을 잡는 그물", "4. 물고기 잡는 그물"], answer: 1, explanation: "먹이 그물은 여러 먹이 사슬이 복잡하게 연결된 것입니다." }
    ]},
    inferential: { title: "보완학습 | 추론·통합력", problems: [
      { q: "한 종이 멸종하면 생태계에 어떤 영향이 있나요?", options: ["1. 아무 영향 없음", "2. 연결된 다른 생물에게 영향을 줌", "3. 더 좋아짐", "4. 환경이 깨끗해짐"], answer: 1, explanation: "한 종의 멸종은 연결된 다른 생물에게 영향을 미칩니다." },
      { q: "숲이 사라지면 어떻게 되나요?", options: ["1. 산소가 많아짐", "2. 산소가 줄고 생물 서식지가 사라짐", "3. 비가 많이 옴", "4. 바람이 세짐"], answer: 1, explanation: "숲이 사라지면 산소가 줄고 많은 생물의 서식지가 사라집니다." }
    ]},
    critical: { title: "보완학습 | 비판·적용력", problems: [
      { q: "생태계 보호를 위해 할 수 있는 일은?", options: ["1. 쓰레기 아무 데나 버리기", "2. 자연 보호와 재활용 실천", "3. 물 많이 쓰기", "4. 일회용품 많이 쓰기"], answer: 1, explanation: "자연 보호와 재활용이 생태계 보호에 도움이 됩니다." },
      { q: "외래종이 생태계에 문제를 일으키는 이유는?", options: ["1. 예뻐서", "2. 토착종과 경쟁하거나 잡아먹어서", "3. 향기가 좋아서", "4. 색이 밝아서"], answer: 1, explanation: "외래종은 토착종과 경쟁하거나 잡아먹어 생태계 균형을 깨뜨립니다." }
    ]}
  }
};

// 보완학습 섹션 생성 함수
function generateRemedialSection(unitData) {
  const categories = ['literal', 'structural', 'lexical', 'inferential', 'critical'];
  let remedialBank = '    const REMEDIAL_BANK = {\n';

  categories.forEach((cat, idx) => {
    const data = unitData[cat];
    remedialBank += `      ${cat}: {\n`;
    remedialBank += `        title: "${data.title}",\n`;
    remedialBank += `        problems: [\n`;
    data.problems.forEach((p, pIdx) => {
      const optionsStr = p.options.map(o => `"${o.replace(/"/g, '\\"')}"`).join(', ');
      remedialBank += `          { q: "${p.q.replace(/"/g, '\\"')}", options: [${optionsStr}], answer: ${p.answer}, explanation: "${p.explanation.replace(/"/g, '\\"')}" }`;
      if (pIdx < data.problems.length - 1) remedialBank += ',';
      remedialBank += '\n';
    });
    remedialBank += `        ]\n`;
    remedialBank += `      }`;
    if (idx < categories.length - 1) remedialBank += ',';
    remedialBank += '\n';
  });

  remedialBank += '    };';
  return remedialBank;
}

// 보완학습 함수들
const remedialFunctions = `
    function openRemedial() {
      const needKeys = [];
      if (typeof reportState !== "undefined") {
        if (!reportState.q1ok) needKeys.push('literal');
        if (!reportState.q2ok) needKeys.push('structural');
        if (!reportState.q3ok) needKeys.push('lexical');
        if (!reportState.q4ok) needKeys.push('inferential');
        if (!reportState.q5ok) needKeys.push('critical');
      }

      const panel = document.getElementById('remedial-panel');
      const body = document.getElementById('remedial-panel-body');
      if (!panel || !body) return;

      if (needKeys.length === 0) {
        body.innerHTML = "<p>보완이 필요한 영역이 없습니다 👏</p>";
        panel.style.display = 'flex';
        return;
      }

      let html = "";
      needKeys.forEach(key => {
        const data = REMEDIAL_BANK[key];
        if (!data) return;
        html += \`<div style="margin-bottom:16px;">
          <h4 style="margin:4px 0 6px; color:#8b2f2f;">\${data.title}</h4>
          <ol style="padding-left:18px;">\`;
        (data.problems || []).forEach((p, idx) => {
          html += \`<li style="margin-bottom:10px;">\${p.q}<br>\`;
          p.options.forEach((opt, optIdx) => {
            html += \`<label style="display:block;font-weight:normal;margin:2px 0;"><input type="radio" name="\${key}-q\${idx}" value="\${optIdx}"> \${opt}</label>\`;
          });
          html += \`</li>\`;
        });
        html += \`</ol></div>\`;
      });

      body.innerHTML = html;
      panel.style.display = 'flex';
    }

    function gradeRemedial() {
      const body = document.getElementById('remedial-panel-body');
      if (!body) return;
      for (const key in REMEDIAL_BANK) {
        const data = REMEDIAL_BANK[key];
        if (!data) continue;
        (data.problems || []).forEach((p, idx) => {
          const name = key + '-q' + idx;
          const inputs = body.querySelectorAll(\`input[name="\${name}"]\`);
          if (!inputs.length) return;
          let selected = -1;
          inputs.forEach((inp, i) => { if (inp.checked) selected = parseInt(inp.value); });
          const li = inputs[0].closest('li');
          if (!li) return;
          const old = li.querySelector('.remed-result');
          if (old) old.remove();
          const explanation = p.explanation ? \`<div style="margin-top:4px; color:#555; font-size:11px; background:#f9f6f0; padding:6px 8px; border-radius:4px;">📝 \${p.explanation}</div>\` : '';
          if (selected === p.answer) {
            li.insertAdjacentHTML('beforeend', \`<div class="remed-result" style="margin-top:3px; color:#157347; font-size:12px;">정답입니다 ✅\${explanation}</div>\`);
          } else {
            const correctText = p.options[p.answer];
            li.insertAdjacentHTML('beforeend', \`<div class="remed-result" style="margin-top:3px; color:#b3261e; font-size:12px;">틀렸어요 ❌ 정답: \${correctText}\${explanation}</div>\`);
          }
        });
      }
    }

    function resetRemedial() {
      const body = document.getElementById('remedial-panel-body');
      if (!body) return;
      body.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
      body.querySelectorAll('.remed-result').forEach(el => el.remove());
    }`;

let successCount = 0;
let failCount = 0;

for (let i = 1; i <= 20; i++) {
  const unit = String(i).padStart(2, '0');
  const filePath = path.join(DIR, `bio_${unit}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ 파일 없음: bio_${unit}.html`);
    failCount++;
    continue;
  }

  let html = fs.readFileSync(filePath, 'utf8');
  const unitData = REMEDIAL_DATA[unit];

  if (!unitData) {
    console.log(`⚠️ 데이터 없음: bio_${unit}`);
    failCount++;
    continue;
  }

  // 1. 기존 REMEDIAL_BANK 교체
  const newRemedialBank = generateRemedialSection(unitData);

  // 기존 REMEDIAL_BANK 패턴 찾기
  const remedialBankPattern = /const REMEDIAL_BANK = \{[\s\S]*?\n    \};/;

  if (remedialBankPattern.test(html)) {
    html = html.replace(remedialBankPattern, newRemedialBank);
  } else {
    console.log(`⚠️ REMEDIAL_BANK 패턴을 찾을 수 없음: bio_${unit}.html`);
    failCount++;
    continue;
  }

  // 2. 기존 openRemedial, gradeRemedial, resetRemedial 함수 교체
  const oldFunctionsPattern = /function openRemedial\(\) \{[\s\S]*?function resetRemedial\(\) \{[\s\S]*?\n    \}/;

  if (oldFunctionsPattern.test(html)) {
    html = html.replace(oldFunctionsPattern, remedialFunctions.trim());
  }

  // 3. 보완학습 버튼 활성화 (display:none 제거)
  const oldButton = `<button class="report-btn-remedial" onclick="openRemedial && openRemedial()" style="display:none;">`;
  const newButton = `<button class="report-btn-remedial" onclick="openRemedial()">`;

  if (html.includes(oldButton)) {
    html = html.replace(oldButton, newButton);
  }

  // 다른 형태의 숨겨진 버튼도 처리
  const oldButton2 = `<button class="report-btn-remedial" onclick="openRemedial()" style="display:none;">`;
  if (html.includes(oldButton2)) {
    html = html.replace(oldButton2, newButton);
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✅ 수정 완료: bio_${unit}.html`);
  successCount++;
}

console.log(`\n🎉 업생물 01~20 보완학습 구현 완료!`);
console.log(`   성공: ${successCount}개, 실패: ${failCount}개`);

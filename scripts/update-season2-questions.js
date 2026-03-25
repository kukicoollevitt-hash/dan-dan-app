const fs = require('fs');
const path = require('path');

// Season 2 질문 업그레이드 데이터 (초5-6학년 수준)
// 각 파일별로 Season 2 질문을 차별화된 내용으로 교체

const season2Updates = {
  // bio10 - 소화
  'bio10_season1_quiz.html': {
    questions: [
      { gate: 1, category: "인물파악", question: "뽀미(빵)가 소화되는 과정에서 가장 먼저 분해되기 시작하는 영양소로 적절한 것은?", options: ["단백질", "탄수화물(녹말)", "지방", "비타민"], correct: 1 },
      { gate: 2, category: "인물파악", question: "위액에 들어 있는 소화효소가 주로 분해하는 영양소로 적절한 것은?", options: ["탄수화물", "단백질", "지방", "무기질"], correct: 1 },
      { gate: 3, category: "내용일치", question: "입에서 침(타액)이 분비되어 녹말을 분해하는 소화효소의 이름으로 옳은 것은?", options: ["펩신", "아밀레이스", "리파아제", "트립신"], correct: 1 },
      { gate: 4, category: "내용일치", question: "소장에서 영양소 흡수가 효율적으로 일어나는 이유로 적절한 것은?", options: ["소장이 가장 길기 때문에", "융모가 있어 표면적이 넓기 때문에", "소장이 가장 두껍기 때문에", "소장에 근육이 없기 때문에"], correct: 1 },
      { gate: 5, category: "내용구조", question: "소화의 두 가지 방법에 대한 설명으로 옳은 것은?", options: ["기계적 소화만 일어난다", "화학적 소화만 일어난다", "기계적 소화(씹기, 위 운동)와 화학적 소화(효소 분해)가 함께 일어난다", "소화효소 없이도 완전한 소화가 가능하다"], correct: 2 },
      { gate: 6, category: "내용구조", question: "간에서 만들어져 지방 소화를 돕는 물질의 이름으로 옳은 것은?", options: ["인슐린", "담즙(쓸개즙)", "위액", "이자액"], correct: 1 },
      { gate: 7, category: "내용어휘", question: "소화효소가 특정 영양소만 분해하는 특성을 무엇이라 하는지 옳은 것은?", options: ["가역성", "기질 특이성", "보편성", "연속성"], correct: 1 },
      { gate: 8, category: "내용어휘", question: "대장에 사는 세균이 하는 역할로 적절한 것은?", options: ["단백질 분해", "비타민 합성과 수분 흡수 도움", "지방 저장", "산소 운반"], correct: 1 },
      { gate: 9, category: "내용추론", question: "음식을 오래 씹으면 단맛이 느껴지는 이유로 적절한 것은?", options: ["침에 설탕이 있어서", "아밀레이스가 녹말을 당으로 분해하기 때문에", "이빨에서 단맛이 나서", "위액이 올라와서"], correct: 1 },
      { gate: 10, category: "내용추론", question: "소화계 질환(소화불량, 위염)을 예방하는 방법으로 적절하지 않은 것은?", options: ["천천히 꼭꼭 씹어 먹기", "규칙적인 식사하기", "급하게 많이 먹기", "자극적인 음식 줄이기"], correct: 2 }
    ]
  },

  // bio11 - 순환
  'bio11_season1_quiz.html': {
    questions: [
      { gate: 1, category: "인물파악", question: "적혈구(리오)가 산소를 운반할 수 있는 이유로 적절한 것은?", options: ["크기가 작아서", "헤모글로빈이라는 단백질이 있어서", "핵이 있어서", "빨간색이어서"], correct: 1 },
      { gate: 2, category: "인물파악", question: "심장이 우리 몸에서 하는 역할로 적절한 것은?", options: ["산소를 만드는 것", "혈액을 온몸으로 펌프질하는 것", "영양소를 분해하는 것", "노폐물을 만드는 것"], correct: 1 },
      { gate: 3, category: "내용일치", question: "동맥과 정맥의 차이점으로 옳은 것은?", options: ["동맥은 심장에서 나가는 혈액, 정맥은 심장으로 들어오는 혈액이 흐른다", "동맥과 정맥은 같은 방향으로 흐른다", "정맥만 산소를 운반한다", "동맥에만 혈액이 흐른다"], correct: 0 },
      { gate: 4, category: "내용일치", question: "백혈구의 역할로 적절한 것은?", options: ["산소 운반", "세균과 바이러스로부터 몸을 보호하는 면역 작용", "혈액 응고", "영양소 운반"], correct: 1 },
      { gate: 5, category: "내용구조", question: "체순환과 폐순환의 차이점으로 옳은 것은?", options: ["체순환은 온몸에, 폐순환은 폐에 혈액을 보낸다", "둘 다 같은 경로로 순환한다", "폐순환만 심장을 지난다", "체순환에서만 산소를 운반한다"], correct: 0 },
      { gate: 6, category: "내용구조", question: "혈소판의 역할로 적절한 것은?", options: ["산소 운반", "면역 작용", "상처 부위에서 혈액 응고(지혈)", "영양소 분해"], correct: 2 },
      { gate: 7, category: "내용어휘", question: "심장의 네 개의 방(심방, 심실)이 규칙적으로 수축하고 이완하는 것을 무엇이라 하는지 옳은 것은?", options: ["호흡", "심장 박동", "소화", "배설"], correct: 1 },
      { gate: 8, category: "내용어휘", question: "모세혈관에서 물질 교환이 일어나는 이유로 적절한 것은?", options: ["가장 굵어서", "벽이 매우 얇아 확산이 쉽기 때문에", "빠르게 흐르기 때문에", "심장과 직접 연결되어서"], correct: 1 },
      { gate: 9, category: "내용추론", question: "빈혈이 생기면 어지럽고 피곤한 이유로 적절한 것은?", options: ["백혈구가 부족해서", "적혈구나 헤모글로빈이 부족해 산소 운반이 잘 안 되기 때문에", "혈소판이 부족해서", "혈장이 부족해서"], correct: 1 },
      { gate: 10, category: "내용추론", question: "심장 건강을 위해 좋은 생활 습관으로 적절하지 않은 것은?", options: ["규칙적인 운동", "균형 잡힌 식사", "흡연과 음주", "충분한 수면"], correct: 2 }
    ]
  },

  // bio12 - 호흡
  'bio12_season1_quiz.html': {
    questions: [
      { gate: 1, category: "인물파악", question: "폐포에서 가스 교환이 일어나는 원리로 적절한 것은?", options: ["능동적으로 에너지를 써서", "농도 차이에 따른 확산으로", "폐포가 움직여서", "심장이 밀어서"], correct: 1 },
      { gate: 2, category: "인물파악", question: "횡격막이 아래로 내려갈 때 일어나는 현상으로 적절한 것은?", options: ["날숨이 일어난다", "들숨이 일어나 폐로 공기가 들어온다", "호흡이 멈춘다", "폐가 작아진다"], correct: 1 },
      { gate: 3, category: "내용일치", question: "들숨과 날숨에서 산소와 이산화탄소의 농도 비교로 옳은 것은?", options: ["들숨은 산소가 많고, 날숨은 이산화탄소가 많다", "들숨과 날숨의 성분은 같다", "날숨에 산소가 더 많다", "들숨에 이산화탄소가 더 많다"], correct: 0 },
      { gate: 4, category: "내용일치", question: "기관과 기관지의 역할로 적절한 것은?", options: ["가스 교환", "공기를 폐로 전달하는 통로", "혈액 운반", "음식 소화"], correct: 1 },
      { gate: 5, category: "내용구조", question: "호흡 운동(들숨-날숨)이 일어나는 원리로 적절한 것은?", options: ["폐 자체가 스스로 수축한다", "횡격막과 갈비뼈 근육의 움직임으로 흉강 부피가 변한다", "심장이 공기를 펌프질한다", "기관이 공기를 밀어낸다"], correct: 1 },
      { gate: 6, category: "내용구조", question: "세포 호흡에서 산소가 사용되는 이유로 적절한 것은?", options: ["세포를 청소하기 위해", "영양소(포도당)를 분해하여 에너지(ATP)를 만들기 위해", "세포를 크게 만들기 위해", "이산화탄소를 만들기 위해"], correct: 1 },
      { gate: 7, category: "내용어휘", question: "폐포가 작은 공기주머니 형태인 이유로 적절한 것은?", options: ["공기를 저장하기 위해", "표면적을 넓혀 가스 교환 효율을 높이기 위해", "공기를 걸러내기 위해", "소리를 내기 위해"], correct: 1 },
      { gate: 8, category: "내용어휘", question: "코털과 점액의 역할로 적절한 것은?", options: ["산소를 만드는 것", "먼지와 세균을 걸러내 폐를 보호하는 것", "공기를 데우는 것", "냄새를 맡는 것"], correct: 1 },
      { gate: 9, category: "내용추론", question: "높은 산에 올라가면 숨이 차는 이유로 적절한 것은?", options: ["산소 농도가 높아서", "기압이 낮아 공기 중 산소가 적기 때문에", "이산화탄소가 많아서", "공기가 뜨거워서"], correct: 1 },
      { gate: 10, category: "내용추론", question: "흡연이 호흡계에 해로운 이유로 적절한 것은?", options: ["폐포를 깨끗하게 해서", "타르와 유해물질이 폐포를 손상시키고 가스 교환을 방해하기 때문에", "산소를 많이 공급해서", "폐를 크게 만들어서"], correct: 1 }
    ]
  },

  // bio13 - 신경계
  'bio13_season1_quiz.html': {
    questions: [
      { gate: 1, category: "인물파악", question: "신경세포 사이에서 신호를 전달하는 화학물질의 이름으로 옳은 것은?", options: ["호르몬", "신경전달물질", "효소", "항체"], correct: 1 },
      { gate: 2, category: "인물파악", question: "뇌에서 생각, 판단, 기억을 담당하는 부분으로 옳은 것은?", options: ["소뇌", "대뇌", "뇌간", "척수"], correct: 1 },
      { gate: 3, category: "내용일치", question: "중추신경계를 구성하는 것으로 옳은 것은?", options: ["뇌와 척수", "감각신경과 운동신경", "눈과 귀", "손과 발"], correct: 0 },
      { gate: 4, category: "내용일치", question: "반사 행동(뜨거운 것에 손 떼기)의 특징으로 옳은 것은?", options: ["천천히 의식적으로 일어난다", "대뇌를 거치지 않고 척수에서 빠르게 일어난다", "학습으로 배운 행동이다", "잠잘 때만 일어난다"], correct: 1 },
      { gate: 5, category: "내용구조", question: "자극 → 반응의 경로로 옳은 것은?", options: ["운동신경 → 중추신경 → 감각신경", "감각기 → 감각신경 → 중추신경 → 운동신경 → 반응기", "반응기 → 감각기 → 중추신경", "중추신경만 사용"], correct: 1 },
      { gate: 6, category: "내용구조", question: "소뇌의 역할로 적절한 것은?", options: ["생각과 판단", "균형 유지와 운동 조절", "생명 유지 활동(호흡, 심장 박동)", "감각 처리"], correct: 1 },
      { gate: 7, category: "내용어휘", question: "뉴런(신경세포)의 구조 중 신호를 받는 부분의 이름으로 옳은 것은?", options: ["축삭돌기", "신경세포체", "가지돌기(수상돌기)", "시냅스"], correct: 2 },
      { gate: 8, category: "내용어휘", question: "시냅스에서 신호 전달이 일어나는 방식으로 옳은 것은?", options: ["전기 신호가 직접 연결된다", "신경전달물질이 분비되어 다음 신경세포에 전달한다", "혈액으로 전달된다", "소리로 전달된다"], correct: 1 },
      { gate: 9, category: "내용추론", question: "수면이 뇌 건강에 중요한 이유로 적절한 것은?", options: ["잠자면 뇌가 멈추기 때문에", "수면 중 기억이 정리되고 뇌가 회복되기 때문에", "잠자면 뇌가 커지기 때문에", "꿈을 꾸기 위해"], correct: 1 },
      { gate: 10, category: "내용추론", question: "스마트폰 과다 사용이 뇌에 미치는 영향으로 적절한 것은?", options: ["집중력 향상", "집중력 저하와 수면 장애 가능성", "기억력 향상", "시력 향상"], correct: 1 }
    ]
  },

  // bio14 - 뼈와 근육
  'bio14_season1_quiz.html': {
    questions: [
      { gate: 1, category: "인물파악", question: "뼈의 역할이 아닌 것은?", options: ["몸을 지지한다", "장기를 보호한다", "산소를 운반한다", "칼슘을 저장한다"], correct: 2 },
      { gate: 2, category: "인물파악", question: "근육이 수축하면 어떤 일이 일어나는지 적절한 것은?", options: ["근육이 늘어난다", "근육이 짧아지며 뼈를 당긴다", "뼈가 사라진다", "관절이 굳어진다"], correct: 1 },
      { gate: 3, category: "내용일치", question: "뼈와 뼈가 연결되는 부분을 무엇이라 하는지 옳은 것은?", options: ["근육", "관절", "인대", "힘줄"], correct: 1 },
      { gate: 4, category: "내용일치", question: "팔을 구부릴 때 이두근(앞팔 근육)이 하는 일로 옳은 것은?", options: ["이완한다", "수축한다", "움직이지 않는다", "사라진다"], correct: 1 },
      { gate: 5, category: "내용구조", question: "근육이 쌍으로 작용하는 이유로 적절한 것은?", options: ["더 예뻐 보이려고", "근육은 수축만 할 수 있어 반대 방향 움직임을 위해 쌍으로 필요", "에너지를 아끼려고", "뼈를 보호하려고"], correct: 1 },
      { gate: 6, category: "내용구조", question: "뼈 속에서 혈액 세포가 만들어지는 곳의 이름으로 옳은 것은?", options: ["뼈 껍질", "골수", "관절", "연골"], correct: 1 },
      { gate: 7, category: "내용어휘", question: "뼈와 근육을 연결하는 구조의 이름으로 옳은 것은?", options: ["인대", "힘줄(건)", "연골", "관절"], correct: 1 },
      { gate: 8, category: "내용어휘", question: "뼈와 뼈 사이의 충격을 흡수하는 부드러운 조직의 이름으로 옳은 것은?", options: ["근육", "연골", "골수", "힘줄"], correct: 1 },
      { gate: 9, category: "내용추론", question: "성장기에 칼슘 섭취가 중요한 이유로 적절한 것은?", options: ["근육을 키우기 위해", "튼튼한 뼈를 만들고 키 성장에 필요하기 때문에", "살을 빼기 위해", "눈이 좋아지기 위해"], correct: 1 },
      { gate: 10, category: "내용추론", question: "운동이 뼈와 근육 건강에 좋은 이유로 적절한 것은?", options: ["뼈가 사라지기 때문에", "뼈와 근육에 자극을 주어 더 강하게 만들기 때문에", "칼슘을 분해하기 때문에", "관절을 없애기 때문에"], correct: 1 }
    ]
  },

  // bio15 - 유전
  'bio15_season1_quiz.html': {
    questions: [
      { gate: 1, category: "인물파악", question: "멘델이 유전 연구에 사용한 생물로 옳은 것은?", options: ["초파리", "완두콩", "쥐", "대장균"], correct: 1 },
      { gate: 2, category: "인물파악", question: "부모의 특성이 자녀에게 전달되는 현상을 무엇이라 하는지 옳은 것은?", options: ["진화", "유전", "돌연변이", "적응"], correct: 1 },
      { gate: 3, category: "내용일치", question: "유전 정보를 담고 있는 물질의 이름으로 옳은 것은?", options: ["단백질", "DNA(유전자)", "포도당", "지방"], correct: 1 },
      { gate: 4, category: "내용일치", question: "우성과 열성에 대한 설명으로 옳은 것은?", options: ["열성이 항상 나타난다", "우성 형질이 열성 형질보다 더 좋다", "우성 형질이 열성 형질을 가릴 때 나타난다", "우성과 열성은 같은 의미이다"], correct: 2 },
      { gate: 5, category: "내용구조", question: "부모로부터 유전자를 받는 비율로 옳은 것은?", options: ["어머니에게서만 받는다", "아버지에게서만 받는다", "부모 각각에게서 절반씩 받는다", "조부모에게서 받는다"], correct: 2 },
      { gate: 6, category: "내용구조", question: "쌍둥이 중 일란성 쌍둥이의 특징으로 옳은 것은?", options: ["서로 다른 유전자를 가진다", "하나의 수정란에서 나뉘어 같은 유전자를 가진다", "성별이 항상 다르다", "외모가 전혀 다르다"], correct: 1 },
      { gate: 7, category: "내용어휘", question: "염색체 안에 있는 유전 정보의 기본 단위를 무엇이라 하는지 옳은 것은?", options: ["세포", "유전자", "단백질", "핵"], correct: 1 },
      { gate: 8, category: "내용어휘", question: "같은 형질을 결정하는 한 쌍의 유전자를 무엇이라 하는지 옳은 것은?", options: ["염색체", "대립유전자", "DNA", "핵산"], correct: 1 },
      { gate: 9, category: "내용추론", question: "형제자매의 외모가 비슷하지만 똑같지 않은 이유로 적절한 것은?", options: ["같은 유전자를 받아서", "부모로부터 받는 유전자 조합이 다르기 때문에", "환경만 다르기 때문에", "나이가 달라서"], correct: 1 },
      { gate: 10, category: "내용추론", question: "유전 연구가 의학에 중요한 이유로 적절한 것은?", options: ["새로운 생물을 만들기 위해", "유전병의 원인을 알고 치료법을 개발할 수 있기 때문에", "외모를 바꾸기 위해", "음식을 만들기 위해"], correct: 1 }
    ]
  },
  // bio08 - 세포 구조
  'bio08_season1_quiz.html': {
    questions: [
      {
        gate: 1,
        category: "인물파악",
        question: "세포의 핵이 '시장님'에 비유된 이유로 적절한 것은?",
        options: [
          "크기가 가장 크기 때문에",
          "세포의 모든 활동을 지휘하는 유전 정보(DNA)가 있기 때문에",
          "에너지를 만들기 때문에",
          "세포 바깥에 있기 때문에"
        ],
        correct: 1
      },
      {
        gate: 2,
        category: "인물파악",
        question: "미토콘드리아가 '발전소'에 비유된 이유로 적절한 것은?",
        options: [
          "전기를 만들기 때문에",
          "포도당을 분해하여 세포가 사용할 에너지(ATP)를 만들기 때문에",
          "빛을 내기 때문에",
          "열을 발생시키기 때문에"
        ],
        correct: 1
      },
      {
        gate: 3,
        category: "내용일치",
        question: "세포막이 '성벽'에 비유된 이유로 적절한 것은?",
        options: [
          "매우 단단하기 때문에",
          "필요한 물질만 선택적으로 통과시켜 세포를 보호하기 때문에",
          "세포를 네모나게 만들기 때문에",
          "에너지를 저장하기 때문에"
        ],
        correct: 1
      },
      {
        gate: 4,
        category: "내용일치",
        question: "식물세포에만 있고 동물세포에는 없는 구조로 옳은 것은?",
        options: [
          "핵과 미토콘드리아",
          "세포벽과 엽록체",
          "세포막과 리보솜",
          "골지체와 소포체"
        ],
        correct: 1
      },
      {
        gate: 5,
        category: "내용구조",
        question: "세포를 '도시'에 비유했을 때, 각 소기관의 역할 분담이 중요한 이유로 적절한 것은?",
        options: [
          "세포가 예쁘게 보이기 위해",
          "각자의 역할을 수행해야 세포가 정상적으로 기능하기 때문에",
          "세포 크기를 줄이기 위해",
          "세포를 더 많이 만들기 위해"
        ],
        correct: 1
      },
      {
        gate: 6,
        category: "내용구조",
        question: "리소좀이 '청소부'에 비유된 이유로 적절한 것은?",
        options: [
          "세포를 깨끗하게 닦기 때문에",
          "낡은 세포 소기관이나 노폐물을 분해하여 재활용하기 때문에",
          "세포 밖으로 쓰레기를 버리기 때문에",
          "세포에 물을 공급하기 때문에"
        ],
        correct: 1
      },
      {
        gate: 7,
        category: "내용어휘",
        question: "세포 소기관 중 단백질을 만드는 '공장' 역할을 하는 것으로 옳은 것은?",
        options: [
          "미토콘드리아",
          "리보솜",
          "골지체",
          "리소좀"
        ],
        correct: 1
      },
      {
        gate: 8,
        category: "내용어휘",
        question: "골지체의 역할로 적절한 것은?",
        options: [
          "에너지 생산",
          "단백질을 포장하고 분류하여 필요한 곳으로 보내는 것",
          "DNA 복제",
          "광합성 수행"
        ],
        correct: 1
      },
      {
        gate: 9,
        category: "내용추론",
        question: "식물세포가 동물세포보다 더 단단한 형태를 유지하는 이유로 적절한 것은?",
        options: [
          "엽록체가 있기 때문에",
          "세포벽이 있어 세포를 지지하기 때문에",
          "핵이 더 크기 때문에",
          "미토콘드리아가 더 많기 때문에"
        ],
        correct: 1
      },
      {
        gate: 10,
        category: "내용추론",
        question: "적혈구에 핵이 없는 이유로 적절한 것은?",
        options: [
          "적혈구는 세포가 아니기 때문에",
          "더 많은 산소를 운반할 공간을 확보하기 위해",
          "핵이 빨간색이어서",
          "적혈구는 분열하지 않기 때문에"
        ],
        correct: 1
      }
    ]
  },

  // bio09 - 세포분열
  'bio09_season1_quiz.html': {
    questions: [
      {
        gate: 1,
        category: "인물파악",
        question: "DNA가 세포분열의 '설계도'라고 불리는 이유로 적절한 것은?",
        options: [
          "세포의 모양을 결정하기 때문에",
          "세포의 유전 정보를 담고 있어 똑같은 세포를 만들 수 있기 때문에",
          "에너지를 만들기 때문에",
          "세포막을 형성하기 때문에"
        ],
        correct: 1
      },
      {
        gate: 2,
        category: "인물파악",
        question: "방추사의 역할로 적절한 것은?",
        options: [
          "DNA를 복제하는 것",
          "염색체를 세포의 양쪽으로 끌어당겨 나누는 것",
          "세포막을 만드는 것",
          "에너지를 공급하는 것"
        ],
        correct: 1
      },
      {
        gate: 3,
        category: "내용일치",
        question: "세포분열 전에 DNA가 복제되어야 하는 이유로 적절한 것은?",
        options: [
          "DNA가 너무 작기 때문에",
          "두 딸세포가 각각 완전한 DNA를 가지기 위해",
          "DNA가 손상되었기 때문에",
          "세포가 더 커지기 위해"
        ],
        correct: 1
      },
      {
        gate: 4,
        category: "내용일치",
        question: "체세포분열의 결과로 옳은 것은?",
        options: [
          "염색체 수가 절반인 세포 4개가 만들어진다",
          "모세포와 같은 염색체 수를 가진 세포 2개가 만들어진다",
          "염색체 수가 2배인 세포 1개가 만들어진다",
          "세포가 사라진다"
        ],
        correct: 1
      },
      {
        gate: 5,
        category: "내용구조",
        question: "세포분열이 필요한 경우가 아닌 것은?",
        options: [
          "어린이가 성장할 때",
          "상처가 아물 때",
          "음식을 소화할 때",
          "머리카락이 자랄 때"
        ],
        correct: 2
      },
      {
        gate: 6,
        category: "내용구조",
        question: "세포주기에서 간기의 역할로 적절한 것은?",
        options: [
          "세포가 분열하는 시기",
          "DNA 복제와 세포 성장이 일어나는 준비 시기",
          "염색체가 나누어지는 시기",
          "세포가 죽는 시기"
        ],
        correct: 1
      },
      {
        gate: 7,
        category: "내용어휘",
        question: "염색체에 대한 설명으로 옳은 것은?",
        options: [
          "세포분열 시에만 보이며 DNA가 응축된 형태이다",
          "항상 풀어져 있으며 세포막에 붙어 있다",
          "단백질로만 이루어져 있다",
          "세포질에 흩어져 있다"
        ],
        correct: 0
      },
      {
        gate: 8,
        category: "내용어휘",
        question: "사람의 체세포에 있는 염색체 수로 옳은 것은?",
        options: [
          "23개",
          "46개",
          "92개",
          "12개"
        ],
        correct: 1
      },
      {
        gate: 9,
        category: "내용추론",
        question: "세포분열이 제대로 조절되지 않으면 생길 수 있는 문제로 적절한 것은?",
        options: [
          "세포가 더 건강해진다",
          "암세포처럼 세포가 무한히 증식할 수 있다",
          "세포가 더 작아진다",
          "세포가 더 천천히 자란다"
        ],
        correct: 1
      },
      {
        gate: 10,
        category: "내용추론",
        question: "피부 세포가 빠르게 분열하는 것이 상처 치유에 중요한 이유로 적절한 것은?",
        options: [
          "피부색을 바꾸기 위해",
          "손상된 부분을 새로운 세포로 채워 회복시키기 때문에",
          "세포를 더 크게 만들기 위해",
          "피부를 더 두껍게 만들기 위해"
        ],
        correct: 1
      }
    ]
  }
};

// 파일 업데이트 함수
function updateSeasonTwo(filePath, questions) {
  let content = fs.readFileSync(filePath, 'utf8');

  // quizDataSeason2 부분 찾기
  const season2Start = content.indexOf('const quizDataSeason2 = [');
  const season3Start = content.indexOf('const quizDataSeason3 = [');

  if (season2Start === -1 || season3Start === -1) {
    console.log(`Skip: ${path.basename(filePath)} - Season2/3 not found`);
    return false;
  }

  // 새로운 Season2 데이터 생성
  const newSeason2 = `const quizDataSeason2 = [
${questions.map((q, i) => `      // ${q.category} (${i + 1}번째)
      {
        gate: ${q.gate},
        category: "${q.category}",
        question: "${q.question}",
        options: [
          "${q.options[0]}",
          "${q.options[1]}",
          "${q.options[2]}",
          "${q.options[3]}"
        ],
        correct: ${q.correct}
      }`).join(',\n')}
    ];

    // 시즌3`;

  // Season2 부분 교체
  const before = content.substring(0, season2Start);
  const after = content.substring(season3Start);

  content = before + newSeason2.replace('// 시즌3', '') + after;

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated: ${path.basename(filePath)}`);
  return true;
}

// 실행
const basePath = '/Users/dandan/Desktop/brainmoon_academy0325/public/creative-book/';

let updated = 0;
for (const [filename, data] of Object.entries(season2Updates)) {
  const filePath = path.join(basePath, filename);
  if (fs.existsSync(filePath)) {
    if (updateSeasonTwo(filePath, data.questions)) {
      updated++;
    }
  } else {
    console.log(`Not found: ${filename}`);
  }
}

console.log(`\n총 ${updated}개 파일 업데이트 완료`);

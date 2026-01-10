const fs = require('fs');
const path = require('path');

// modern_01~10 각 파일의 본문 내용에 맞는 REMEDIAL_BANK 데이터
const REMEDIAL_DATA = {
  modern_01: {
    // 주제: 메밀꽃 필 무렵 (이효석)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "이 작품의 배경이 되는 계절은?", options: ["봄", "여름", "가을", "겨울"], answer: 1, explanation: "메밀꽃이 피는 여름밤이 배경입니다." },
        { q: "허생원이 성서방네 처녀와 인연을 맺은 장소는?", options: ["시장", "봉평 장터 물레방앗간", "학교", "교회"], answer: 1, explanation: "봉평 장터 물레방앗간에서 인연을 맺었습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "이 작품의 서술 방식은?", options: ["1인칭 주인공 시점", "3인칭 전지적 작가 시점", "1인칭 관찰자 시점", "2인칭 시점"], answer: 1, explanation: "3인칭 전지적 작가 시점으로 서술됩니다." },
        { q: "허생원과 동이의 관계가 밝혀지는 구성은?", options: ["병렬 구성", "액자 구성", "역순행적 구성", "점층적 구성"], answer: 2, explanation: "과거 회상을 통해 관계가 밝혀지는 역순행적 구성입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'메밀꽃'이 상징하는 것은?", options: ["슬픔", "순수한 사랑과 아름다운 추억", "분노", "공포"], answer: 1, explanation: "메밀꽃은 순수한 사랑과 아름다운 추억을 상징합니다." },
        { q: "'달밤'의 분위기로 알맞은 것은?", options: ["공포스러움", "서정적이고 낭만적임", "긴장감", "우울함"], answer: 1, explanation: "달밤은 서정적이고 낭만적인 분위기를 조성합니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "허생원이 동이에게 친근감을 느끼는 이유는?", options: ["돈이 많아서", "동이가 자신의 아들일 수 있다는 암시 때문", "같은 고향이라서", "외모가 비슷해서"], answer: 1, explanation: "동이가 허생원의 아들일 수 있다는 암시 때문입니다." },
        { q: "이 작품이 주는 감동의 핵심은?", options: ["복수", "떠돌이 삶 속에서 발견한 인연과 혈육의 정", "성공", "모험"], answer: 1, explanation: "떠돌이 삶 속에서 발견한 인연과 혈육의 정이 감동을 줍니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "이 작품이 한국 문학사에서 높이 평가받는 이유는?", options: ["폭력적 내용", "토속적 서정미와 아름다운 문체", "외국 배경", "SF 요소"], answer: 1, explanation: "토속적 서정미와 아름다운 문체로 높이 평가받습니다." },
        { q: "허생원의 삶을 통해 작가가 말하고자 한 것은?", options: ["돈의 중요성", "떠돌이의 애환과 인간적 그리움", "권력 추구", "복수"], answer: 1, explanation: "떠돌이의 애환과 인간적 그리움을 말하고자 했습니다." }
      ]
    }
  },
  modern_02: {
    // 주제: 소나기 (황순원)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "소녀가 소년에게 처음 건넨 말은?", options: ["안녕", "이 바보", "같이 가자", "뭐 해?"], answer: 1, explanation: "소녀가 소년에게 '이 바보'라고 처음 말했습니다." },
        { q: "소나기를 피한 장소는?", options: ["학교", "수숫단 속", "집", "다리 밑"], answer: 1, explanation: "소년과 소녀는 수숫단 속에서 소나기를 피했습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "이 작품의 시점은?", options: ["1인칭 주인공", "3인칭 관찰자(소년 중심)", "전지적 작가", "2인칭"], answer: 1, explanation: "3인칭 관찰자 시점(소년 중심)으로 서술됩니다." },
        { q: "소녀의 죽음이 직접 묘사되지 않는 이유는?", options: ["작가 실수", "여운과 감동을 주기 위한 생략", "분량 문제", "검열"], answer: 1, explanation: "여운과 감동을 주기 위해 생략했습니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'소나기'가 상징하는 것은?", options: ["일상", "짧고 강렬한 첫사랑", "슬픔", "분노"], answer: 1, explanation: "소나기는 짧고 강렬한 첫사랑을 상징합니다." },
        { q: "'분홍 스웨터'가 의미하는 것은?", options: ["부유함", "소녀의 사랑과 순수함의 상징", "유행", "선물"], answer: 1, explanation: "분홍 스웨터는 소녀의 사랑과 순수함을 상징합니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "소녀의 유언 '그 옷 입혀서 묻어달라'의 의미는?", options: ["옷이 예뻐서", "소년과의 추억을 간직하고 싶은 마음", "부모님 부탁", "유행이라서"], answer: 1, explanation: "소년과의 추억을 간직하고 싶은 마음입니다." },
        { q: "이 작품이 독자에게 주는 정서는?", options: ["공포", "순수하고 아련한 그리움", "분노", "희망"], answer: 1, explanation: "순수하고 아련한 그리움의 정서를 줍니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "이 작품이 오랫동안 사랑받는 이유는?", options: ["폭력성", "누구나 공감하는 순수한 첫사랑의 보편성", "긴 분량", "복잡한 구성"], answer: 1, explanation: "누구나 공감하는 순수한 첫사랑의 보편성 때문입니다." },
        { q: "황순원 문학의 특징으로 알맞은 것은?", options: ["난해함", "간결하고 서정적인 문체", "장황함", "실험적"], answer: 1, explanation: "간결하고 서정적인 문체가 특징입니다." }
      ]
    }
  },
  modern_03: {
    // 주제: 봄봄 (김유정)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "'나'가 봉필이네 집에 있는 이유는?", options: ["친척이라서", "데릴사위로 일하며 점순이와 결혼하기 위해", "직장이라서", "학교 때문에"], answer: 1, explanation: "데릴사위로 일하며 점순이와 결혼하기 위해서입니다." },
        { q: "장인이 결혼을 미루는 핑계는?", options: ["돈이 없어서", "점순이 키가 안 자라서", "나이가 어려서", "집이 없어서"], answer: 1, explanation: "점순이 키가 안 자란다는 핑계로 결혼을 미룹니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "이 작품의 서술 시점은?", options: ["3인칭 전지적", "1인칭 주인공 시점", "3인칭 관찰자", "2인칭"], answer: 1, explanation: "1인칭 주인공 시점으로 서술됩니다." },
        { q: "작품의 결말 특징은?", options: ["해피엔딩", "열린 결말(싸움 장면에서 끝)", "비극적 죽음", "대단원"], answer: 1, explanation: "싸움 장면에서 끝나는 열린 결말입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'봄봄'의 의미는?", options: ["봄이 왔다", "봄이 와도 결혼 못하는 상황의 반복", "꽃이 피다", "새가 운다"], answer: 1, explanation: "봄이 와도 결혼 못하는 상황의 반복을 의미합니다." },
        { q: "'데릴사위'란?", options: ["사위 후보", "처가에서 살며 일하는 사위", "이혼한 사위", "외국 사위"], answer: 1, explanation: "데릴사위는 처가에서 살며 일하는 사위입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "장인이 결혼을 미루는 진짜 이유는?", options: ["점순이 건강", "공짜 일꾼을 계속 부리기 위해", "나이 문제", "집안 반대"], answer: 1, explanation: "공짜 일꾼을 계속 부리기 위해 결혼을 미룹니다." },
        { q: "점순이가 '나'에게 싸움을 부추기는 이유는?", options: ["싸움 구경", "아버지에게 반항하여 결혼하고 싶은 마음", "장난", "복수"], answer: 1, explanation: "아버지에게 반항하여 결혼하고 싶은 마음입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "김유정 문학의 특징은?", options: ["비극적", "해학과 풍자, 토속적 언어", "도시적", "난해함"], answer: 1, explanation: "해학과 풍자, 토속적 언어가 특징입니다." },
        { q: "이 작품이 비판하는 것은?", options: ["청춘", "당시 농촌의 착취와 교활함", "도시 문화", "외국 문화"], answer: 1, explanation: "당시 농촌의 착취와 교활함을 비판합니다." }
      ]
    }
  },
  modern_04: {
    // 주제: 운수 좋은 날 (현진건)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "김첨지의 직업은?", options: ["농부", "인력거꾼", "상인", "공무원"], answer: 1, explanation: "김첨지는 인력거꾼입니다." },
        { q: "김첨지가 '운수 좋은 날'이라고 한 이유는?", options: ["복권 당첨", "평소보다 돈을 많이 벌어서", "승진", "선물 받아서"], answer: 1, explanation: "평소보다 돈을 많이 벌어서 운수 좋은 날이라 했습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "이 작품의 결말은?", options: ["해피엔딩", "아내의 죽음(반전)", "열린 결말", "희망적"], answer: 1, explanation: "아내가 죽는 비극적 반전으로 끝납니다." },
        { q: "'운수 좋은 날'이라는 제목의 효과는?", options: ["기쁨 강조", "행운과 비극의 역설적 대비", "단순 설명", "배경 설명"], answer: 1, explanation: "행운과 비극의 역설적 대비 효과입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'설렁탕'이 상징하는 것은?", options: ["부유함", "아내에 대한 미안함과 사랑", "배고픔", "일상"], answer: 1, explanation: "설렁탕은 아내에 대한 미안함과 사랑을 상징합니다." },
        { q: "'인력거'가 상징하는 시대는?", options: ["현대", "일제강점기 식민지 시대", "조선시대", "미래"], answer: 1, explanation: "인력거는 일제강점기 식민지 시대를 상징합니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "김첨지가 술을 마신 이유는?", options: ["기쁨", "아내 걱정을 잊으려는 불안한 마음", "축하", "습관"], answer: 1, explanation: "아내 걱정을 잊으려는 불안한 마음 때문입니다." },
        { q: "이 작품이 비판하는 것은?", options: ["개인", "가난한 사람들을 짓밟는 사회 구조", "자연", "외국"], answer: 1, explanation: "가난한 사람들을 짓밟는 사회 구조를 비판합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "현진건 문학의 특징은?", options: ["환상적", "사실주의적 묘사와 비판 정신", "낭만적", "실험적"], answer: 1, explanation: "사실주의적 묘사와 비판 정신이 특징입니다." },
        { q: "독자가 결말에서 느끼는 감정은?", options: ["기쁨", "비극적 아이러니에 대한 안타까움", "분노", "무관심"], answer: 1, explanation: "비극적 아이러니에 대한 안타까움을 느낍니다." }
      ]
    }
  },
  modern_05: {
    // 주제: 동백꽃 (김유정)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "점순이가 '나'에게 처음 준 것은?", options: ["돈", "감자", "꽃", "편지"], answer: 1, explanation: "점순이가 '나'에게 감자를 주었습니다." },
        { q: "'나'와 점순이 집의 관계는?", options: ["친척", "마름과 소작인(갑을 관계)", "친구", "이웃"], answer: 1, explanation: "점순이 집이 마름이고 '나' 집이 소작인입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "이 작품의 갈등 원인은?", options: ["돈 문제", "'나'가 점순이 마음을 몰라줌", "가족 문제", "학교 문제"], answer: 1, explanation: "'나'가 점순이의 마음을 몰라주어 갈등이 생깁니다." },
        { q: "닭싸움의 역할은?", options: ["배경", "두 사람의 감정 갈등을 보여주는 장치", "우연", "설명"], answer: 1, explanation: "닭싸움은 두 사람의 감정 갈등을 보여주는 장치입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'동백꽃'(노란 동백꽃)이 상징하는 것은?", options: ["슬픔", "풋풋한 사랑의 감정", "분노", "이별"], answer: 1, explanation: "노란 동백꽃은 풋풋한 사랑의 감정을 상징합니다." },
        { q: "'알 수 없는 향기'의 의미는?", options: ["꽃향기만", "사랑의 감정이 싹트는 순간", "음식 냄새", "봄 냄새"], answer: 1, explanation: "사랑의 감정이 싹트는 순간을 의미합니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "점순이가 '나'를 괴롭히는 진짜 이유는?", options: ["미움", "좋아하는 마음을 표현하는 방식", "복수", "장난"], answer: 1, explanation: "좋아하는 마음을 표현하는 방식입니다." },
        { q: "결말에서 두 사람이 동백꽃 속에 있는 의미는?", options: ["싸움", "서로의 마음이 통하는 화해의 순간", "이별", "갈등"], answer: 1, explanation: "서로의 마음이 통하는 화해의 순간입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "이 작품의 매력은?", options: ["비극", "순박한 시골 남녀의 풋사랑을 해학적으로 표현", "공포", "추리"], answer: 1, explanation: "순박한 시골 남녀의 풋사랑을 해학적으로 표현한 것이 매력입니다." },
        { q: "화자 '나'의 특징은?", options: ["똑똑함", "순진하고 눈치 없는 시골 소년", "악당", "어른"], answer: 1, explanation: "순진하고 눈치 없는 시골 소년입니다." }
      ]
    }
  },
  modern_06: {
    // 주제: 사랑손님과 어머니 (주요섭)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "이 작품의 화자는?", options: ["어머니", "6살 옥희", "사랑손님", "외삼촌"], answer: 1, explanation: "6살 옥희가 화자입니다." },
        { q: "사랑손님의 직업은?", options: ["농부", "대학생(교사 지망)", "상인", "군인"], answer: 1, explanation: "사랑손님은 대학생(교사 지망)입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "어린 화자를 설정한 효과는?", options: ["설명 편리", "어른들의 감정을 순수하게 간접 전달", "유머", "공포"], answer: 1, explanation: "어른들의 감정을 순수하게 간접 전달합니다." },
        { q: "어머니와 사랑손님의 관계가 직접 표현되지 않는 이유는?", options: ["관계 없음", "옥희 시점이라 어른 감정을 모르기 때문", "검열", "실수"], answer: 1, explanation: "옥희 시점이라 어른 감정을 직접 알 수 없기 때문입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'달걀'이 상징하는 것은?", options: ["음식", "어머니와 사랑손님 사이의 교감", "장난", "선물"], answer: 1, explanation: "달걀은 어머니와 사랑손님 사이의 교감을 상징합니다." },
        { q: "'외삼촌'이 사랑손님을 경계하는 이유는?", options: ["싫어서", "과부인 누이의 재가를 막으려는 봉건적 인식", "질투", "돈 문제"], answer: 1, explanation: "과부인 누이의 재가를 막으려는 봉건적 인식 때문입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "어머니가 사랑손님에게 감정을 표현하지 못하는 이유는?", options: ["싫어서", "당시 사회의 봉건적 관습과 시선 때문", "모름", "언어 문제"], answer: 1, explanation: "당시 사회의 봉건적 관습과 시선 때문입니다." },
        { q: "이 작품이 비판하는 것은?", options: ["어린이", "여성의 재혼을 막는 봉건적 사회", "교육", "도시"], answer: 1, explanation: "여성의 재혼을 막는 봉건적 사회를 비판합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "이 작품이 주는 정서는?", options: ["공포", "아련하고 슬픈 감정", "기쁨", "분노"], answer: 1, explanation: "아련하고 슬픈 감정을 줍니다." },
        { q: "옥희가 '나도 사랑손님이 좋아'라고 말하는 의미는?", options: ["장난", "어린이의 순수함으로 어머니의 마음을 대변", "거짓말", "습관"], answer: 1, explanation: "어린이의 순수함으로 어머니의 마음을 대변합니다." }
      ]
    }
  },
  modern_07: {
    // 주제: 감자 (김동인)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "복녀의 원래 성품은?", options: ["악함", "착하고 부지런함", "게으름", "교활함"], answer: 1, explanation: "복녀는 원래 착하고 부지런한 여인이었습니다." },
        { q: "복녀가 타락하게 된 가장 큰 원인은?", options: ["성격", "극심한 가난", "교육 부족", "질병"], answer: 1, explanation: "극심한 가난이 복녀를 타락하게 만들었습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "이 작품의 특징은?", options: ["해피엔딩", "환경결정론적 자연주의", "낭만주의", "환상"], answer: 1, explanation: "환경이 인간을 결정한다는 자연주의적 특징이 있습니다." },
        { q: "복녀의 변화 과정은?", options: ["악→선", "선량함→타락→죽음", "변화 없음", "성공"], answer: 1, explanation: "선량함에서 타락을 거쳐 죽음에 이르는 과정입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'감자'가 상징하는 것은?", options: ["풍요", "가난과 생존을 위한 몸부림", "행복", "사랑"], answer: 1, explanation: "감자는 가난과 생존을 위한 몸부림을 상징합니다." },
        { q: "'칠성문 밖'이 의미하는 것은?", options: ["부유한 곳", "빈민층이 사는 비참한 환경", "학교", "시장"], answer: 1, explanation: "칠성문 밖은 빈민층이 사는 비참한 환경입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "복녀의 타락에 대한 작가의 시선은?", options: ["비난", "환경의 희생자로 보는 연민", "무관심", "칭찬"], answer: 1, explanation: "작가는 복녀를 환경의 희생자로 보며 연민을 보입니다." },
        { q: "이 작품이 비판하는 것은?", options: ["개인", "가난을 만드는 사회 구조", "자연", "문화"], answer: 1, explanation: "가난을 만드는 사회 구조를 비판합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "자연주의 문학의 특징은?", options: ["이상화", "인간을 환경의 산물로 봄", "초자연적", "유머"], answer: 1, explanation: "자연주의는 인간을 환경의 산물로 봅니다." },
        { q: "이 작품이 현대에 주는 시사점은?", options: ["없음", "빈곤 문제와 사회적 책임에 대한 성찰", "오락", "역사 지식"], answer: 1, explanation: "빈곤 문제와 사회적 책임에 대해 성찰하게 합니다." }
      ]
    }
  },
  modern_08: {
    // 주제: 배따라기 (김동인)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "노래 '배따라기'를 부르는 사람은?", options: ["아내", "작가", "형", "주인공"], answer: 2, explanation: "형이 배따라기 노래를 부릅니다." },
        { q: "형이 아우를 미워하게 된 이유는?", options: ["돈 문제", "아내와 아우의 관계 의심", "성격 차이", "직업 문제"], answer: 1, explanation: "아내와 아우의 관계를 의심하여 미워하게 되었습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "이 작품의 구성은?", options: ["단순 구성", "액자식 구성(현재-과거-현재)", "병렬 구성", "역순행"], answer: 1, explanation: "액자식 구성으로 현재-과거-현재로 이어집니다." },
        { q: "형의 고백이 주는 효과는?", options: ["유머", "죄책감과 한의 깊이를 전달", "공포", "희망"], answer: 1, explanation: "죄책감과 한의 깊이를 전달합니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'배따라기'의 의미는?", options: ["배 이름", "슬픈 민요, 떠남과 그리움의 노래", "농기구", "지명"], answer: 1, explanation: "배따라기는 슬픈 민요로 떠남과 그리움을 노래합니다." },
        { q: "'새터'가 의미하는 것은?", options: ["새 집", "비극이 일어난 장소", "학교", "시장"], answer: 1, explanation: "새터는 비극이 일어난 장소입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "형이 평생 떠도는 이유는?", options: ["여행 좋아서", "아우와 아내를 죽인 죄책감과 속죄", "직업", "가난"], answer: 1, explanation: "아우와 아내를 죽인 죄책감과 속죄를 위해 떠돕니다." },
        { q: "이 작품의 비극성은 어디서 오는가?", options: ["자연재해", "오해와 질투로 인한 가족의 파멸", "전쟁", "질병"], answer: 1, explanation: "오해와 질투로 인한 가족의 파멸에서 비극성이 옵니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "이 작품이 주는 교훈은?", options: ["복수", "의심과 질투의 파괴적 결과", "성공", "모험"], answer: 1, explanation: "의심과 질투의 파괴적 결과를 보여줍니다." },
        { q: "김동인 문학의 특징은?", options: ["유머", "인간 심리와 비극에 대한 깊은 탐구", "환상", "SF"], answer: 1, explanation: "인간 심리와 비극에 대한 깊은 탐구가 특징입니다." }
      ]
    }
  },
  modern_09: {
    // 주제: 빈처 (현진건)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "'빈처'의 뜻은?", options: ["빈집", "가난한 아내", "빈터", "빈 그릇"], answer: 1, explanation: "빈처는 가난한 아내라는 뜻입니다." },
        { q: "아내가 한 행동은?", options: ["도망", "머리카락을 잘라 팔아 남편 술값을 마련", "직장 구함", "부모에게 도움 요청"], answer: 1, explanation: "아내가 머리카락을 잘라 팔아 남편 술값을 마련했습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "이 작품의 갈등 구조는?", options: ["외적 갈등만", "가난으로 인한 부부간 내적 갈등", "사회 갈등", "자연 갈등"], answer: 1, explanation: "가난으로 인한 부부간 내적 갈등입니다." },
        { q: "아내의 희생이 주는 효과는?", options: ["분노", "사랑의 깊이와 가난의 비극성 강조", "유머", "공포"], answer: 1, explanation: "사랑의 깊이와 가난의 비극성을 강조합니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'머리카락'이 상징하는 것은?", options: ["미용", "아내의 자존심과 희생", "건강", "유행"], answer: 1, explanation: "머리카락은 아내의 자존심과 희생을 상징합니다." },
        { q: "'술'이 작품에서 의미하는 것은?", options: ["즐거움", "가난한 지식인의 현실 도피와 무력감", "건강", "사교"], answer: 1, explanation: "술은 가난한 지식인의 현실 도피와 무력감을 의미합니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "남편이 아내의 행동을 알고 느끼는 감정은?", options: ["기쁨", "부끄러움과 자책, 아내에 대한 사랑", "분노", "무관심"], answer: 1, explanation: "부끄러움과 자책, 아내에 대한 사랑을 느낍니다." },
        { q: "이 작품이 비판하는 것은?", options: ["아내", "지식인의 무기력과 식민지 현실", "자연", "문화"], answer: 1, explanation: "지식인의 무기력과 식민지 현실을 비판합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "이 작품이 주는 감동은?", options: ["모험", "가난 속에서도 빛나는 부부애", "공포", "유머"], answer: 1, explanation: "가난 속에서도 빛나는 부부애가 감동을 줍니다." },
        { q: "1920년대 지식인의 모습은?", options: ["성공", "식민지 현실에서 무력하고 좌절한 모습", "희망", "풍요"], answer: 1, explanation: "식민지 현실에서 무력하고 좌절한 모습입니다." }
      ]
    }
  },
  modern_10: {
    // 주제: 레디메이드 인생 (채만식)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "'레디메이드'의 뜻은?", options: ["수제품", "기성품, 이미 만들어진 것", "명품", "골동품"], answer: 1, explanation: "레디메이드는 기성품, 이미 만들어진 것입니다." },
        { q: "P의 상황은?", options: ["취업 성공", "고등 교육을 받았지만 실업자 신세", "부자", "농부"], answer: 1, explanation: "P는 고등 교육을 받았지만 실업자 신세입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "P가 아들도 자신처럼 키우겠다는 결말의 의미는?", options: ["희망", "비극의 대물림(세습되는 실업)", "성공", "반전"], answer: 1, explanation: "비극의 대물림, 세습되는 실업을 의미합니다." },
        { q: "이 작품의 어조는?", options: ["낭만적", "자조적이고 풍자적", "희망적", "공포스러운"], answer: 1, explanation: "자조적이고 풍자적인 어조입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'레디메이드 인생'이 의미하는 것은?", options: ["성공한 삶", "쓸모없이 찍어낸 듯한 지식인의 삶", "평범한 삶", "행복한 삶"], answer: 1, explanation: "쓸모없이 찍어낸 듯한 지식인의 삶을 의미합니다." },
        { q: "'고등 룸펜'의 뜻은?", options: ["부자", "교육받은 실업자", "노숙자", "학생"], answer: 1, explanation: "고등 룸펜은 교육받은 실업자입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "P가 자조하는 이유는?", options: ["성공해서", "능력이 있어도 사회가 기회를 주지 않아서", "게을러서", "외국이라서"], answer: 1, explanation: "능력이 있어도 사회가 기회를 주지 않기 때문입니다." },
        { q: "이 작품이 비판하는 것은?", options: ["개인", "일제 식민지 사회의 구조적 모순", "자연", "전통"], answer: 1, explanation: "일제 식민지 사회의 구조적 모순을 비판합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "채만식 문학의 특징은?", options: ["낭만", "풍자와 사회 비판", "환상", "공포"], answer: 1, explanation: "풍자와 사회 비판이 특징입니다." },
        { q: "이 작품이 현대에 주는 의미는?", options: ["없음", "청년 실업 등 사회 문제에 대한 성찰", "오락", "역사"], answer: 1, explanation: "청년 실업 등 사회 문제에 대한 성찰을 줍니다." }
      ]
    }
  }
};

// 각 파일에 REMEDIAL_BANK 데이터 추가
for (let i = 1; i <= 10; i++) {
  const num = String(i).padStart(2, '0');
  const key = `modern_${num}`;
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'korlit', `modern_${num}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  const remedialData = REMEDIAL_DATA[key];
  if (!remedialData) {
    console.log(`[SKIP] modern_${num} - 데이터 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // 이미 window.REMEDIAL_BANK가 head에 있는지 확인
  if (content.includes('<!-- ✅ 보완학습 데이터 (learning-common.js 로드 전에 정의) -->')) {
    console.log(`[SKIP] modern_${num} 이미 REMEDIAL_BANK 있음`);
    continue;
  }

  // learning-common.js 로드 전에 REMEDIAL_BANK 삽입
  const remedialScript = `<!-- ✅ 보완학습 데이터 (learning-common.js 로드 전에 정의) -->
<script>
window.REMEDIAL_BANK = ${JSON.stringify(remedialData, null, 2)};
</script>

`;

  const commonJsPattern = /<script src="\/assets\/js\/learning-common\.js[^"]*"><\/script>/;

  if (commonJsPattern.test(content)) {
    content = content.replace(commonJsPattern, (match) => remedialScript + match);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[OK] modern_${num} REMEDIAL_BANK 데이터 추가 완료`);
  } else {
    console.log(`[SKIP] modern_${num} - learning-common.js 로드 라인 없음`);
  }
}

console.log('\n✅ modern_01~10 REMEDIAL_BANK 데이터 추가 완료!');

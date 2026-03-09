const fs = require('fs');
const path = require('path');

// modern_21~30 각 파일의 본문 내용에 맞는 REMEDIAL_BANK 데이터
const REMEDIAL_DATA = {
  modern_21: {
    // 주제: 광장 (최인훈)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "이명준이 선택한 곳은?", options: ["남한", "북한", "중립국", "미국"], answer: 2, explanation: "이명준은 남도 북도 아닌 중립국을 선택했습니다." },
        { q: "'광장'과 '밀실'이 상징하는 것은?", options: ["건물", "공적 공간(이념)과 사적 공간(개인)", "여행지", "학교"], answer: 1, explanation: "광장은 공적 공간(이념), 밀실은 사적 공간(개인)을 상징합니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "이명준이 남북 모두에서 환멸을 느낀 이유는?", options: ["날씨", "광장과 밀실의 불균형(이념과 개인의 부조화)", "가난", "질병"], answer: 1, explanation: "남과 북 모두 광장과 밀실의 균형이 맞지 않았습니다." },
        { q: "작품의 결말은?", options: ["성공", "이명준의 바다 투신(자살)", "귀향", "결혼"], answer: 1, explanation: "이명준은 바다에 투신하여 생을 마감합니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'광장'이 의미하는 것은?", options: ["넓은 땅", "공적 이념과 집단의 공간", "시장", "공원"], answer: 1, explanation: "광장은 공적 이념과 집단의 공간입니다." },
        { q: "'밀실'이 의미하는 것은?", options: ["감옥", "사적 자유와 개인의 공간", "창고", "사무실"], answer: 1, explanation: "밀실은 사적 자유와 개인의 공간입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "이명준이 중립국을 선택한 이유는?", options: ["경제", "남과 북 어느 쪽에서도 인간다운 삶을 찾지 못해서", "날씨", "친구"], answer: 1, explanation: "남과 북 어느 쪽에서도 인간다운 삶을 찾지 못했습니다." },
        { q: "작가가 말하고자 한 것은?", options: ["이념 찬양", "분단 현실에서 개인의 비극과 이념 비판", "성공담", "로맨스"], answer: 1, explanation: "분단 현실에서 개인의 비극과 이념을 비판합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "이 작품이 분단 문학의 대표작인 이유는?", options: ["길이", "남북 이념을 객관적으로 비판한 최초의 작품", "유머", "로맨스"], answer: 1, explanation: "남북 이념을 객관적으로 비판한 최초의 작품입니다." },
        { q: "현대 사회에서 '광장과 밀실'의 의미는?", options: ["없음", "공동체와 개인의 균형 문제는 여전히 유효함", "옛날 이야기", "정치만"], answer: 1, explanation: "공동체와 개인의 균형 문제는 여전히 유효합니다." }
      ]
    }
  },
  modern_22: {
    // 주제: 오발탄 (이범선)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "철호의 직업은?", options: ["군인", "회계사", "의사", "교사"], answer: 1, explanation: "철호는 회계사입니다." },
        { q: "어머니가 반복하는 말은?", options: ["밥 먹어라", "가자, 가자", "공부해라", "일어나라"], answer: 1, explanation: "어머니는 '가자, 가자'를 반복합니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "'오발탄'이 제목인 이유는?", options: ["총 이야기", "전쟁 후 잘못된 시대에 던져진 사람들의 비극", "사냥", "스포츠"], answer: 1, explanation: "전쟁 후 잘못된 시대에 던져진 사람들의 비극을 의미합니다." },
        { q: "가족 구성원들이 겪는 문제는?", options: ["풍요", "각자 다른 형태의 전쟁 후유증과 고통", "성공", "행복"], answer: 1, explanation: "각자 다른 형태의 전쟁 후유증과 고통을 겪습니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'오발탄'이 상징하는 것은?", options: ["무기", "목표를 잃고 방황하는 전후 세대", "사냥감", "스포츠"], answer: 1, explanation: "오발탄은 목표를 잃고 방황하는 전후 세대를 상징합니다." },
        { q: "'가자'가 의미하는 것은?", options: ["여행", "고향(이북)에 대한 그리움과 광기", "운동", "출근"], answer: 1, explanation: "'가자'는 고향에 대한 그리움과 광기를 의미합니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "철호가 치과에 가지 않는 이유는?", options: ["두려움", "가족을 부양하느라 자신을 돌볼 여유가 없어서", "시간 없음", "비용"], answer: 1, explanation: "가족을 부양하느라 자신을 돌볼 여유가 없습니다." },
        { q: "작가가 비판하는 것은?", options: ["개인", "전쟁이 남긴 상처와 사회의 무관심", "자연", "기술"], answer: 1, explanation: "전쟁이 남긴 상처와 사회의 무관심을 비판합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "이 작품이 전후 문학의 대표작인 이유는?", options: ["길이", "전쟁 후 사회의 비극을 사실적으로 그림", "유머", "환상"], answer: 1, explanation: "전쟁 후 사회의 비극을 사실적으로 그렸습니다." },
        { q: "전쟁의 상처가 현대에도 의미 있는 이유는?", options: ["없음", "전쟁과 분단의 후유증이 아직 남아있기 때문", "옛날", "무관"], answer: 1, explanation: "전쟁과 분단의 후유증이 아직 남아있습니다." }
      ]
    }
  },
  modern_23: {
    // 주제: 수난이대 (하근찬)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "아버지 만도가 팔을 잃은 이유는?", options: ["사고", "일제 징용 중 다이너마이트 사고", "전쟁", "질병"], answer: 1, explanation: "일제 징용 중 다이너마이트 사고로 팔을 잃었습니다." },
        { q: "아들 진수가 다리를 잃은 이유는?", options: ["사고", "6.25 전쟁 참전", "질병", "교통사고"], answer: 1, explanation: "아들은 6.25 전쟁 참전 중 다리를 잃었습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "'수난이대'의 의미는?", options: ["두 세대", "수난이 2대에 걸쳐 이어짐", "두 번째", "이등"], answer: 1, explanation: "수난이 아버지와 아들 2대에 걸쳐 이어집니다." },
        { q: "결말에서 부자가 서로 업는 장면의 의미는?", options: ["장난", "서로의 상처를 보듬는 화해와 연대", "싸움", "이별"], answer: 1, explanation: "서로의 상처를 보듬는 화해와 연대입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'팔'과 '다리'가 상징하는 것은?", options: ["신체", "역사적 수난으로 잃어버린 것들", "건강", "운동"], answer: 1, explanation: "역사적 수난으로 잃어버린 것들을 상징합니다." },
        { q: "'이대'가 강조하는 것은?", options: ["세대", "고통의 반복과 역사의 비극", "성공", "발전"], answer: 1, explanation: "고통의 반복과 역사의 비극을 강조합니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "부자가 처음에 서먹한 이유는?", options: ["싫어서", "오랜 이별과 서로의 상처에 대한 부담감", "모름", "다툼"], answer: 1, explanation: "오랜 이별과 서로의 상처에 대한 부담감입니다." },
        { q: "작가가 말하고자 한 것은?", options: ["복수", "민족이 겪은 역사적 수난과 치유의 필요성", "성공", "모험"], answer: 1, explanation: "민족이 겪은 역사적 수난과 치유의 필요성입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "이 작품의 문학사적 의의는?", options: ["유머", "일제와 전쟁의 수난을 상징적으로 그림", "환상", "추리"], answer: 1, explanation: "일제와 전쟁의 수난을 상징적으로 그렸습니다." },
        { q: "부자의 화해가 주는 희망의 의미는?", options: ["없음", "상처를 치유하고 함께 살아갈 수 있다는 메시지", "포기", "체념"], answer: 1, explanation: "상처를 치유하고 함께 살아갈 수 있다는 메시지입니다." }
      ]
    }
  },
  modern_24: {
    // 주제: 카인의 후예 (황순원)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "훈이 살던 곳의 변화는?", options: ["발전", "북한 토지개혁으로 땅을 빼앗김", "풍요", "평화"], answer: 1, explanation: "북한 토지개혁으로 땅을 빼앗겼습니다." },
        { q: "훈이 결국 선택한 것은?", options: ["순응", "월남(남쪽으로 탈출)", "투쟁", "자살"], answer: 1, explanation: "훈은 월남(남쪽으로 탈출)을 선택했습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "'카인의 후예'라는 제목의 의미는?", options: ["성경 인물", "이념에 의해 추방당한 자들", "범죄자", "영웅"], answer: 1, explanation: "카인처럼 이념에 의해 추방당한 자들을 의미합니다." },
        { q: "도삼이 훈을 감시하는 이유는?", options: ["우정", "계급 투쟁 논리에 따른 적대", "보호", "질투"], answer: 1, explanation: "계급 투쟁 논리에 따라 감시합니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'토지개혁'이 작품에서 의미하는 것은?", options: ["발전", "이념에 의한 삶의 파괴", "농업 발전", "평등"], answer: 1, explanation: "토지개혁은 이념에 의한 삶의 파괴를 보여줍니다." },
        { q: "'월남'이 상징하는 것은?", options: ["여행", "이념을 피한 탈출과 고향 상실", "성공", "모험"], answer: 1, explanation: "월남은 이념을 피한 탈출과 고향 상실입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "훈이 느끼는 비극은?", options: ["가난", "이념 때문에 삶의 터전과 사람들을 잃는 것", "질병", "외로움"], answer: 1, explanation: "이념 때문에 삶의 터전과 사람들을 잃습니다." },
        { q: "작가가 비판하는 것은?", options: ["개인", "인간성을 파괴하는 극단적 이념", "자연", "전통"], answer: 1, explanation: "인간성을 파괴하는 극단적 이념을 비판합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "황순원 문학의 특징은?", options: ["정치적", "서정적이면서도 이념 비판적", "추상적", "실험적"], answer: 1, explanation: "서정적이면서도 이념 비판적입니다." },
        { q: "이 작품이 현대에 주는 의미는?", options: ["없음", "이념보다 인간이 우선이라는 교훈", "정치", "역사"], answer: 1, explanation: "이념보다 인간이 우선이라는 교훈을 줍니다." }
      ]
    }
  },
  modern_25: {
    // 주제: 역마 (김동리)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "'역마'란 무엇인가?", options: ["말 종류", "떠돌이 운명, 한곳에 정착 못하는 팔자", "역참의 말", "경주마"], answer: 1, explanation: "역마는 떠돌이 운명, 한곳에 정착 못하는 팔자입니다." },
        { q: "성기의 어머니 옥화가 떠돌게 된 이유는?", options: ["여행", "무당이라 떠돌이 삶", "직장", "결혼"], answer: 1, explanation: "옥화는 무당이라 떠돌이 삶을 살았습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "성기가 계연을 떠나는 이유는?", options: ["싫어서", "역마살이라는 운명적 힘에 이끌려", "돈 때문", "싸움"], answer: 1, explanation: "역마살이라는 운명적 힘에 이끌렸습니다." },
        { q: "이 작품의 주제 의식은?", options: ["성공", "인간과 운명의 관계 탐구", "복수", "유머"], answer: 1, explanation: "인간과 운명의 관계를 탐구합니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'역마살'이 상징하는 것은?", options: ["행운", "벗어날 수 없는 운명의 굴레", "재물", "건강"], answer: 1, explanation: "역마살은 벗어날 수 없는 운명의 굴레입니다." },
        { q: "'계연'이 의미하는 것은?", options: ["도시", "성기가 정착하려 한 사랑과 안식처", "고향", "직장"], answer: 1, explanation: "계연은 성기가 정착하려 한 사랑과 안식처입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "성기가 결국 떠나는 것이 비극적인 이유는?", options: ["여행", "사랑하면서도 운명을 거스를 수 없어서", "성공", "선택"], answer: 1, explanation: "사랑하면서도 운명을 거스를 수 없어 비극적입니다." },
        { q: "김동리가 말하고자 한 것은?", options: ["노력", "인간 존재와 운명에 대한 탐구", "성공", "부정"], answer: 1, explanation: "인간 존재와 운명에 대해 탐구합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "김동리 문학의 특징은?", options: ["사실주의", "토속적 신비주의와 운명론", "모더니즘", "풍자"], answer: 1, explanation: "토속적 신비주의와 운명론이 특징입니다." },
        { q: "운명 문제가 현대에도 의미 있는 이유는?", options: ["없음", "인간의 한계와 자유의지에 대한 질문은 보편적", "과학 해결", "무의미"], answer: 1, explanation: "인간의 한계와 자유의지에 대한 질문은 보편적입니다." }
      ]
    }
  },
  modern_26: {
    // 주제: 사하촌 (김정한)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "'사하촌'의 뜻은?", options: ["부유한 마을", "절 아래에 있는 가난한 마을", "시골 마을", "도시"], answer: 1, explanation: "사하촌은 절 아래에 있는 가난한 마을입니다." },
        { q: "사하촌 사람들의 처지는?", options: ["풍요", "절의 소작농으로 착취당함", "자유로움", "부유함"], answer: 1, explanation: "절의 소작농으로 착취당합니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "절(종교)이 작품에서 하는 역할은?", options: ["구원", "세속적 권력으로 농민을 착취", "보호", "교육"], answer: 1, explanation: "절은 세속적 권력으로 농민을 착취합니다." },
        { q: "갈등의 구조는?", options: ["세대 갈등", "지배층(절)과 피지배층(농민)의 갈등", "연애 갈등", "친구 갈등"], answer: 1, explanation: "지배층(절)과 피지배층(농민)의 갈등입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'사하'가 아이러니한 이유는?", options: ["좋은 뜻", "절 아래지만 불교 자비와 무관한 착취의 공간", "나쁜 뜻", "중립"], answer: 1, explanation: "절 아래지만 불교 자비와 무관한 착취의 공간입니다." },
        { q: "'소작농'의 의미는?", options: ["지주", "남의 땅을 빌려 농사짓는 가난한 농민", "부자", "상인"], answer: 1, explanation: "소작농은 남의 땅을 빌려 농사짓는 가난한 농민입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "작가가 종교를 비판한 이유는?", options: ["무신론", "종교가 권력이 되어 민중을 착취하기 때문", "신앙심", "전통"], answer: 1, explanation: "종교가 권력이 되어 민중을 착취하기 때문입니다." },
        { q: "이 작품이 말하고자 한 것은?", options: ["종교 찬양", "사회적 모순과 민중의 고통", "성공담", "로맨스"], answer: 1, explanation: "사회적 모순과 민중의 고통을 말합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "김정한 문학의 특징은?", options: ["환상", "민중의 삶에 대한 관심과 사회 비판", "귀족적", "실험적"], answer: 1, explanation: "민중의 삶에 대한 관심과 사회 비판이 특징입니다." },
        { q: "권력과 종교의 결탁 문제가 현대에도 유효한 이유는?", options: ["없음", "권력의 부패는 시대를 초월한 문제", "해결됨", "무관"], answer: 1, explanation: "권력의 부패는 시대를 초월한 문제입니다." }
      ]
    }
  },
  modern_27: {
    // 주제: 학 (황순원)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "성삼과 덕재의 관계는?", options: ["형제", "어린 시절 친구(남북으로 갈라짐)", "부자", "사제"], answer: 1, explanation: "어린 시절 친구로 남북으로 갈라졌습니다." },
        { q: "두 사람이 다시 만난 상황은?", options: ["동창회", "전쟁 중 포로와 감시병으로", "여행", "결혼식"], answer: 1, explanation: "전쟁 중 포로와 감시병으로 다시 만났습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "'학'이 작품에서 하는 역할은?", options: ["배경", "두 사람의 우정을 연결하는 상징", "먹이", "적"], answer: 1, explanation: "학은 두 사람의 우정을 연결하는 상징입니다." },
        { q: "결말의 의미는?", options: ["전쟁 승리", "학을 통해 인간애가 이념을 넘어섬", "이별", "죽음"], answer: 1, explanation: "학을 통해 인간애가 이념을 넘어섭니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'학'이 상징하는 것은?", options: ["전쟁", "순수한 우정과 평화, 자유", "이념", "권력"], answer: 1, explanation: "학은 순수한 우정과 평화, 자유를 상징합니다." },
        { q: "'놓아주다'가 의미하는 것은?", options: ["포기", "이념을 넘어선 인간적 용서와 화해", "실패", "도망"], answer: 1, explanation: "이념을 넘어선 인간적 용서와 화해입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "두 사람이 학을 함께 날리는 의미는?", options: ["장난", "적대적 상황에서도 우정은 살아있음", "사냥", "경쟁"], answer: 1, explanation: "적대적 상황에서도 우정은 살아있음을 보여줍니다." },
        { q: "작가가 말하고자 한 것은?", options: ["이념 찬양", "이념보다 인간애가 소중함", "전쟁 찬양", "복수"], answer: 1, explanation: "이념보다 인간애가 소중함을 말합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "이 작품이 감동을 주는 이유는?", options: ["전쟁 장면", "분단 상황에서도 인간성을 잃지 않는 모습", "폭력", "공포"], answer: 1, explanation: "분단 상황에서도 인간성을 잃지 않는 모습이 감동적입니다." },
        { q: "분단 문학이 필요한 이유는?", options: ["없음", "분단의 상처를 기억하고 화해를 모색하기 위해", "정치", "오락"], answer: 1, explanation: "분단의 상처를 기억하고 화해를 모색하기 위해서입니다." }
      ]
    }
  },
  modern_28: {
    // 주제: 황만근은 이렇게 말했다 (성석제)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "황만근의 성격은?", options: ["교활함", "순박하고 우직함", "영리함", "계산적"], answer: 1, explanation: "황만근은 순박하고 우직합니다." },
        { q: "황만근이 죽게 된 원인은?", options: ["질병", "소를 구하려다 트랙터에 깔림", "노환", "사고"], answer: 1, explanation: "소를 구하려다 트랙터에 깔려 죽었습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "작품의 서술 방식은?", options: ["1인칭", "마을 사람들의 증언 형식(다성적 서술)", "3인칭 전지적", "2인칭"], answer: 1, explanation: "마을 사람들의 증언 형식으로 서술됩니다." },
        { q: "황만근의 죽음이 알려지지 않은 이유는?", options: ["비밀", "홀로 살아 관심받지 못해서", "범죄", "도피"], answer: 1, explanation: "홀로 살아 관심받지 못했습니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'이렇게 말했다'가 아이러니한 이유는?", options: ["유머", "정작 황만근은 말없이 죽었기 때문", "진지함", "희망"], answer: 1, explanation: "정작 황만근은 말없이 죽었습니다." },
        { q: "'소'가 상징하는 것은?", options: ["재산", "황만근의 순박함과 농촌의 삶", "권력", "지식"], answer: 1, explanation: "소는 황만근의 순박함과 농촌의 삶을 상징합니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "마을 사람들이 황만근을 기억하는 방식의 의미는?", options: ["비난", "소외된 사람에 대한 뒤늦은 관심과 미안함", "무관심", "경멸"], answer: 1, explanation: "소외된 사람에 대한 뒤늦은 관심과 미안함입니다." },
        { q: "작가가 말하고자 한 것은?", options: ["성공", "사회에서 소외된 사람들에 대한 관심", "무관심", "체념"], answer: 1, explanation: "사회에서 소외된 사람들에 대한 관심을 말합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "성석제 문학의 특징은?", options: ["도시적", "농촌과 소외된 사람들에 대한 따뜻한 시선", "추상적", "실험적"], answer: 1, explanation: "농촌과 소외된 사람들에 대한 따뜻한 시선이 특징입니다." },
        { q: "이 작품이 현대 사회에 주는 메시지는?", options: ["없음", "우리 주변의 소외된 이웃에 대한 관심", "무관심", "경쟁"], answer: 1, explanation: "우리 주변의 소외된 이웃에 대한 관심을 촉구합니다." }
      ]
    }
  },
  modern_29: {
    // 주제: 아홉 켤레의 구두로 남은 사내 (윤흥길)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "권씨가 만드는 것은?", options: ["가방", "수제 구두", "모자", "옷"], answer: 1, explanation: "권씨는 수제 구두를 만듭니다." },
        { q: "권씨의 상황은?", options: ["부유함", "가난한 가장으로 가족 부양에 시달림", "성공", "은퇴"], answer: 1, explanation: "권씨는 가난한 가장으로 가족 부양에 시달립니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "'아홉 켤레의 구두'가 의미하는 것은?", options: ["제품", "권씨가 남긴 장인 정신의 흔적", "재고", "선물"], answer: 1, explanation: "권씨가 남긴 장인 정신의 흔적입니다." },
        { q: "권씨의 죽음이 비극적인 이유는?", options: ["질병", "성실하게 살았지만 사회에서 인정받지 못함", "사고", "범죄"], answer: 1, explanation: "성실하게 살았지만 사회에서 인정받지 못했습니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'구두'가 상징하는 것은?", options: ["패션", "장인 정신과 노동의 가치", "부", "권력"], answer: 1, explanation: "구두는 장인 정신과 노동의 가치를 상징합니다." },
        { q: "'남은'이 강조하는 것은?", options: ["유산", "사라진 사람과 남겨진 흔적의 안타까움", "재산", "기록"], answer: 1, explanation: "사라진 사람과 남겨진 흔적의 안타까움입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "권씨가 실패한 이유는?", options: ["게으름", "산업화 시대에 장인 정신이 인정받지 못해서", "능력 부족", "운"], answer: 1, explanation: "산업화 시대에 장인 정신이 인정받지 못했습니다." },
        { q: "작가가 비판하는 것은?", options: ["개인", "물질 만능주의와 노동 가치의 상실", "자연", "전통"], answer: 1, explanation: "물질 만능주의와 노동 가치의 상실을 비판합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "이 작품이 1970년대 산업화 시대를 보여주는 방식은?", options: ["찬양", "성실한 노동자의 비극을 통한 비판", "무관심", "유머"], answer: 1, explanation: "성실한 노동자의 비극을 통해 비판합니다." },
        { q: "현대에도 이 작품이 의미 있는 이유는?", options: ["없음", "노동의 가치와 인간 존엄성 문제는 여전히 유효", "옛날 이야기", "무관"], answer: 1, explanation: "노동의 가치와 인간 존엄성 문제는 여전히 유효합니다." }
      ]
    }
  },
  modern_30: {
    // 주제: 엄마의 말뚝 (박완서)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "'말뚝'이 의미하는 것은?", options: ["건축 자재", "엄마의 강인한 생존 의지", "경계표", "기둥"], answer: 1, explanation: "말뚝은 엄마의 강인한 생존 의지입니다." },
        { q: "이 작품의 배경 시대는?", options: ["조선시대", "일제강점기부터 전쟁 이후", "현대", "미래"], answer: 1, explanation: "일제강점기부터 전쟁 이후가 배경입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "엄마가 이사를 반복하는 이유는?", options: ["여행", "전쟁과 가난 속에서 가족을 지키기 위해", "취미", "직장"], answer: 1, explanation: "전쟁과 가난 속에서 가족을 지키기 위해서입니다." },
        { q: "딸의 시선으로 서술한 효과는?", options: ["객관적", "엄마의 삶을 가까이서 생생하게 전달", "거리감", "비판적"], answer: 1, explanation: "엄마의 삶을 가까이서 생생하게 전달합니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'말뚝을 박다'가 상징하는 것은?", options: ["건설", "삶의 터전을 마련하려는 집념", "파괴", "이동"], answer: 1, explanation: "삶의 터전을 마련하려는 집념입니다." },
        { q: "'엄마'가 대표하는 것은?", options: ["개인", "전쟁과 가난을 견딘 한국 여성의 삶", "부자", "지식인"], answer: 1, explanation: "전쟁과 가난을 견딘 한국 여성의 삶을 대표합니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "엄마의 삶이 감동적인 이유는?", options: ["성공", "고난 속에서도 가족을 지키려는 헌신", "부유함", "권력"], answer: 1, explanation: "고난 속에서도 가족을 지키려는 헌신이 감동적입니다." },
        { q: "작가가 말하고자 한 것은?", options: ["개인 성공", "역사의 격변 속 어머니들의 희생과 사랑", "정치", "복수"], answer: 1, explanation: "역사의 격변 속 어머니들의 희생과 사랑입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "박완서 문학의 특징은?", options: ["환상적", "전쟁 체험과 여성의 삶에 대한 깊은 통찰", "추상적", "실험적"], answer: 1, explanation: "전쟁 체험과 여성의 삶에 대한 깊은 통찰이 특징입니다." },
        { q: "이 작품이 현대에 주는 의미는?", options: ["없음", "부모 세대의 희생에 대한 감사와 이해", "무관심", "비판"], answer: 1, explanation: "부모 세대의 희생에 대한 감사와 이해를 줍니다." }
      ]
    }
  }
};

// 각 파일에 REMEDIAL_BANK 데이터 추가
for (let i = 21; i <= 30; i++) {
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

console.log('\n✅ modern_21~30 REMEDIAL_BANK 데이터 추가 완료!');

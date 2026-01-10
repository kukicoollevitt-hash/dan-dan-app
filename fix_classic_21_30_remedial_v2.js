const fs = require('fs');
const path = require('path');

// classic_21~30 목차에 맞는 REMEDIAL_BANK 데이터
// 21: 양반전, 22: 호질, 23: 이춘풍전, 24: 옥단춘전, 25: 숙영낭자전
// 26: 최척전, 27: 김영철전, 28: 홍길동전, 29: 서동지전, 30: (확인 필요)

const REMEDIAL_DATA = {
  classic_21: {
    // 주제: 양반전 (박지원)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "양반이 신분을 판 이유는?", options: ["싫어서", "빚을 갚기 위해", "이사", "결혼"], answer: 1, explanation: "양반이 빚을 갚기 위해 신분을 팔았습니다." },
        { q: "부자가 양반 신분을 산 후 일어난 일은?", options: ["행복", "양반의 의무를 듣고 계약 취소", "성공", "만족"], answer: 1, explanation: "양반의 의무를 듣고 계약을 취소했습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "두 번째 증서의 내용은?", options: ["권리", "양반의 착취와 위선을 폭로", "의무", "혜택"], answer: 1, explanation: "양반의 착취와 위선을 폭로합니다." },
        { q: "이 작품의 풍자 방식은?", options: ["직접 비판", "양반 매매라는 허구적 설정", "폭력", "법률"], answer: 1, explanation: "양반 매매라는 허구적 설정으로 풍자합니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'증서'가 폭로하는 것은?", options: ["계약", "양반 신분의 허구성과 위선", "재산", "권리"], answer: 1, explanation: "양반 신분의 허구성과 위선을 폭로합니다." },
        { q: "'양반'이라는 신분의 실체는?", options: ["고귀함", "의무 없이 특권만 누리는 계층", "노동자", "농민"], answer: 1, explanation: "의무 없이 특권만 누리는 계층입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "박지원이 양반을 비판한 이유는?", options: ["질투", "생산 없이 착취만 하는 기생 계층", "개인적", "오해"], answer: 1, explanation: "생산 없이 착취만 하는 기생 계층이기 때문입니다." },
        { q: "부자가 포기한 것이 의미하는 것은?", options: ["실패", "양반 신분 자체의 무가치함", "성공", "행복"], answer: 1, explanation: "양반 신분 자체의 무가치함입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "양반전의 혁신적 요소는?", options: ["전통 계승", "신분제의 근본적 비판", "보수적", "순응적"], answer: 1, explanation: "신분제를 근본적으로 비판합니다." },
        { q: "현대에 양반전이 의미 있는 이유는?", options: ["무관", "특권 의식에 대한 비판", "옛날", "재미"], answer: 1, explanation: "특권 의식에 대한 비판을 담고 있습니다." }
      ]
    }
  },
  classic_22: {
    // 주제: 호질 (박지원)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "호랑이가 꾸짖은 대상은?", options: ["백성", "위선적인 선비 북곽 선생", "관리", "상인"], answer: 1, explanation: "호랑이가 위선적인 선비 북곽 선생을 꾸짖었습니다." },
        { q: "북곽 선생의 위선이 드러난 상황은?", options: ["강의", "과부 집에 숨어있다 발각됨", "도둑질", "거짓말"], answer: 1, explanation: "과부 집에 숨어있다가 발각되었습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "호랑이를 등장시킨 이유는?", options: ["공포", "동물의 입을 빌려 인간 비판", "재미", "전통"], answer: 1, explanation: "동물의 입을 빌려 인간을 비판합니다." },
        { q: "이 작품의 풍자 방식은?", options: ["직접", "우화(동물 비유)를 통한 간접 비판", "폭력", "법률"], answer: 1, explanation: "우화를 통한 간접 비판입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'호질(虎叱)'의 의미는?", options: ["호랑이 소리", "호랑이의 꾸짖음", "호랑이 울음", "호랑이 공격"], answer: 1, explanation: "호질은 호랑이의 꾸짖음입니다." },
        { q: "'짐승만도 못한 인간'이 가리키는 것은?", options: ["범죄자", "도덕을 말하면서 실천 않는 위선자", "동물", "어린이"], answer: 1, explanation: "도덕을 말하면서 실천하지 않는 위선자입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "박지원이 선비를 비판한 이유는?", options: ["질투", "겉과 속이 다른 위선", "개인적 원한", "오해"], answer: 1, explanation: "겉과 속이 다른 위선 때문입니다." },
        { q: "호랑이가 인간보다 나은 이유는?", options: ["힘", "위선 없이 본성대로 사는 점", "지능", "외모"], answer: 1, explanation: "위선 없이 본성대로 살기 때문입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "호질의 문학사적 의의는?", options: ["전통", "우화 형식으로 사회 비판", "오락", "교육"], answer: 1, explanation: "우화 형식으로 사회를 비판합니다." },
        { q: "현대에 호질이 의미 있는 이유는?", options: ["무관", "위선에 대한 비판은 보편적", "옛날", "동물 이야기"], answer: 1, explanation: "위선에 대한 비판은 보편적입니다." }
      ]
    }
  },
  classic_23: {
    // 주제: 이춘풍전
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "이춘풍이 재산을 탕진한 곳은?", options: ["도박장", "평양 기생집", "술집", "시장"], answer: 1, explanation: "이춘풍은 평양 기생집에서 재산을 탕진했습니다." },
        { q: "춘풍의 아내 김씨가 한 일은?", options: ["포기", "남장하고 평양에 가서 남편을 구출", "이혼", "신고"], answer: 1, explanation: "김씨는 남장하고 평양에 가서 남편을 구출했습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "김씨가 남편을 되찾은 방법은?", options: ["돈", "기지와 지혜로 기생을 이김", "폭력", "협박"], answer: 1, explanation: "기지와 지혜로 기생을 이겼습니다." },
        { q: "이 작품의 결말은?", options: ["이혼", "춘풍이 개과천선하고 부부 화합", "비극", "복수"], answer: 1, explanation: "춘풍이 개과천선하고 부부가 화합합니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'춘풍'이라는 이름이 암시하는 것은?", options: ["계절", "바람기 있고 가벼운 성격", "성공", "귀족"], answer: 1, explanation: "바람기 있고 가벼운 성격을 암시합니다." },
        { q: "'남장'이 상징하는 것은?", options: ["장난", "여성의 적극적 문제 해결 능력", "패션", "신분"], answer: 1, explanation: "여성의 적극적 문제 해결 능력입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "김씨가 진정한 주인공인 이유는?", options: ["미모", "지혜와 행동력으로 문제를 해결", "재산", "신분"], answer: 1, explanation: "지혜와 행동력으로 문제를 해결합니다." },
        { q: "이춘풍전이 여성 독자에게 인기 있었던 이유는?", options: ["로맨스", "현명한 여성의 활약상", "교훈", "강요"], answer: 1, explanation: "현명한 여성의 활약상 때문입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "이춘풍전의 여성관은?", options: ["전통적", "여성이 남성보다 지혜롭고 능동적", "수동적", "보조적"], answer: 1, explanation: "여성이 남성보다 지혜롭고 능동적입니다." },
        { q: "현대에 이 작품이 의미 있는 이유는?", options: ["무관", "여성의 능력과 주체성", "옛날", "재미없음"], answer: 1, explanation: "여성의 능력과 주체성 때문입니다." }
      ]
    }
  },
  classic_24: {
    // 주제: 옥단춘전
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "옥단춘의 신분은?", options: ["양반", "기생", "상인", "농민"], answer: 1, explanation: "옥단춘은 기생입니다." },
        { q: "이혁과 옥단춘의 관계는?", options: ["적", "사랑하는 사이", "가족", "친구"], answer: 1, explanation: "이혁과 옥단춘은 사랑하는 사이입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "두 사람의 사랑을 가로막는 것은?", options: ["거리", "신분 차이와 가난", "나이", "성격"], answer: 1, explanation: "신분 차이와 가난이 사랑을 가로막습니다." },
        { q: "이 작품의 결말은?", options: ["비극", "시련 끝에 결합하여 행복", "이별", "죽음"], answer: 1, explanation: "시련 끝에 결합하여 행복해집니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'옥단춘'이라는 이름의 의미는?", options: ["지역", "옥같이 맑고 아름다운 봄", "직업", "신분"], answer: 1, explanation: "옥같이 맑고 아름다운 봄이라는 뜻입니다." },
        { q: "'기생'이 작품에서 보여주는 것은?", options: ["천함", "진실한 사랑과 의리", "욕망", "배신"], answer: 1, explanation: "진실한 사랑과 의리를 보여줍니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "옥단춘전이 인기 있었던 이유는?", options: ["짧음", "신분을 넘는 순수한 사랑에 대한 공감", "강요", "의무"], answer: 1, explanation: "신분을 넘는 순수한 사랑에 대한 공감입니다." },
        { q: "이 작품이 전하는 메시지는?", options: ["신분 유지", "진실한 사랑은 신분을 초월함", "현실 순응", "포기"], answer: 1, explanation: "진실한 사랑은 신분을 초월한다는 것입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "옥단춘전의 문학적 특징은?", options: ["비극", "애정 소설의 전형적 구조", "역사 소설", "풍자 소설"], answer: 1, explanation: "애정 소설의 전형적 구조입니다." },
        { q: "현대에 이 작품이 의미 있는 이유는?", options: ["무관", "사랑과 차별에 대한 보편적 주제", "옛날", "단순함"], answer: 1, explanation: "사랑과 차별에 대한 보편적 주제입니다." }
      ]
    }
  },
  classic_25: {
    // 주제: 숙영낭자전
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "숙영과 선군의 인연은?", options: ["우연", "전생에 정해진 천상 배필", "가족 소개", "시험"], answer: 1, explanation: "전생에 정해진 천상 배필입니다." },
        { q: "숙영이 겪은 고난은?", options: ["여행", "모함과 누명으로 죽음의 위기", "가난", "질병"], answer: 1, explanation: "모함과 누명으로 죽음의 위기를 겪습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "숙영낭자전의 결말은?", options: ["비극", "누명이 벗겨지고 행복한 결합", "이별", "죽음"], answer: 1, explanation: "누명이 벗겨지고 행복하게 결합합니다." },
        { q: "이 작품의 주제는?", options: ["복수", "운명적 사랑과 시련 극복", "성공", "권력"], answer: 1, explanation: "운명적 사랑과 시련 극복입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'낭자'의 의미는?", options: ["직업", "젊은 여인에 대한 존칭", "지역", "신분"], answer: 1, explanation: "낭자는 젊은 여인에 대한 존칭입니다." },
        { q: "'천상 배필'이 의미하는 것은?", options: ["귀족", "하늘이 정해준 짝", "외국인", "친구"], answer: 1, explanation: "천상 배필은 하늘이 정해준 짝입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "숙영낭자전이 인기 있었던 이유는?", options: ["짧음", "고난 후 행복이라는 희망적 서사", "강요", "의무"], answer: 1, explanation: "고난 후 행복이라는 희망적 서사 때문입니다." },
        { q: "전생 설정의 효과는?", options: ["혼란", "운명적 사랑의 당위성 강화", "공포", "재미"], answer: 1, explanation: "운명적 사랑의 당위성을 강화합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "숙영낭자전의 문학적 특징은?", options: ["사실주의", "전기적 요소와 애정 소설의 결합", "역사", "풍자"], answer: 1, explanation: "전기적 요소와 애정 소설의 결합입니다." },
        { q: "현대에 이 작품이 의미 있는 이유는?", options: ["무관", "시련 극복과 희망의 보편적 주제", "미신", "비현실적"], answer: 1, explanation: "시련 극복과 희망의 보편적 주제 때문입니다." }
      ]
    }
  },
  classic_26: {
    // 주제: 최척전
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "최척과 옥영이 헤어진 원인은?", options: ["싸움", "임진왜란으로 인한 전쟁의 혼란", "이혼", "죽음"], answer: 1, explanation: "임진왜란으로 인해 헤어집니다." },
        { q: "두 사람이 다시 만난 곳은?", options: ["조선", "중국 안남(베트남)", "일본", "몽골"], answer: 1, explanation: "중국 안남(베트남)에서 다시 만납니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "최척전의 서사적 특징은?", options: ["국내", "국제적 배경(조선, 일본, 중국, 베트남)", "가정", "도시"], answer: 1, explanation: "조선, 일본, 중국, 베트남 등 국제적 배경입니다." },
        { q: "이 작품의 주제는?", options: ["복수", "전쟁의 비극과 가족 재회의 감동", "성공", "권력"], answer: 1, explanation: "전쟁의 비극과 가족 재회의 감동입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'임진왜란'이 작품에서 의미하는 것은?", options: ["배경", "가족을 흩어지게 한 비극의 원인", "성공", "행복"], answer: 1, explanation: "가족을 흩어지게 한 비극의 원인입니다." },
        { q: "'재회'가 상징하는 것은?", options: ["우연", "전쟁의 상처를 치유하는 희망", "일상", "포기"], answer: 1, explanation: "전쟁의 상처를 치유하는 희망입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "최척전이 당대 독자에게 감동을 준 이유는?", options: ["재미", "임진왜란의 트라우마를 위로", "강요", "의무"], answer: 1, explanation: "임진왜란의 트라우마를 위로했습니다." },
        { q: "이 작품이 사실주의적인 이유는?", options: ["허구", "실제 역사적 사건을 배경으로 함", "환상", "전설"], answer: 1, explanation: "실제 역사적 사건을 배경으로 합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "최척전의 문학사적 의의는?", options: ["환상 소설", "전쟁의 비극을 사실적으로 그린 소설", "영웅 소설", "풍자 소설"], answer: 1, explanation: "전쟁의 비극을 사실적으로 그렸습니다." },
        { q: "현대에 이 작품이 의미 있는 이유는?", options: ["무관", "전쟁과 이산의 비극은 보편적 주제", "옛날", "외국"], answer: 1, explanation: "전쟁과 이산의 비극은 보편적 주제입니다." }
      ]
    }
  },
  classic_27: {
    // 주제: 김영철전
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "김영철이 겪은 전쟁은?", options: ["임진왜란만", "병자호란과 명청 교체기 전란", "정묘호란", "을미사변"], answer: 1, explanation: "병자호란과 명청 교체기 전란을 겪습니다." },
        { q: "김영철의 행적은?", options: ["은둔", "조선과 청나라를 오가며 파란만장한 삶", "농업", "상업"], answer: 1, explanation: "조선과 청나라를 오가며 파란만장한 삶을 삽니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "김영철전의 서사적 특징은?", options: ["가정 소설", "역사적 격변기 개인의 삶을 그린 전기", "환상 소설", "풍자 소설"], answer: 1, explanation: "역사적 격변기 개인의 삶을 그린 전기입니다." },
        { q: "이 작품의 사실적 요소는?", options: ["환상", "실존 인물을 모델로 함", "전설", "신화"], answer: 1, explanation: "실존 인물을 모델로 했습니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'병자호란'이 작품에서 의미하는 것은?", options: ["배경만", "삶을 송두리째 바꾼 역사적 비극", "성공", "평화"], answer: 1, explanation: "삶을 송두리째 바꾼 역사적 비극입니다." },
        { q: "'유랑'이 상징하는 것은?", options: ["여행", "전쟁으로 인한 삶의 불안정", "성공", "행복"], answer: 1, explanation: "전쟁으로 인한 삶의 불안정입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "김영철전이 전하는 메시지는?", options: ["성공담", "역사의 격변 속 개인의 고난과 생존", "로맨스", "복수"], answer: 1, explanation: "역사의 격변 속 개인의 고난과 생존입니다." },
        { q: "이 작품이 당대에 의미 있었던 이유는?", options: ["재미", "병자호란의 상처를 기록하고 위로", "강요", "의무"], answer: 1, explanation: "병자호란의 상처를 기록하고 위로했습니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "김영철전의 문학사적 의의는?", options: ["영웅 소설", "역사 전기 소설의 사실주의적 성취", "환상 소설", "애정 소설"], answer: 1, explanation: "역사 전기 소설의 사실주의적 성취입니다." },
        { q: "현대에 이 작품이 의미 있는 이유는?", options: ["무관", "역사 속 개인의 삶에 대한 관심", "옛날", "외국"], answer: 1, explanation: "역사 속 개인의 삶에 대한 관심 때문입니다." }
      ]
    }
  },
  classic_28: {
    // 주제: 홍길동전
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "홍길동의 신분적 한계는?", options: ["가난", "서얼(첩의 아들)이라 벼슬 불가", "질병", "나이"], answer: 1, explanation: "홍길동은 서얼이라 벼슬을 할 수 없었습니다." },
        { q: "홍길동이 세운 나라는?", options: ["조선", "율도국", "고려", "명나라"], answer: 1, explanation: "홍길동은 율도국을 세웠습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "'활빈당'의 활동 목적은?", options: ["도둑질", "탐관오리 재물로 가난한 자를 도움", "전쟁", "복수"], answer: 1, explanation: "탐관오리 재물로 가난한 자를 도왔습니다." },
        { q: "홍길동이 조선을 떠난 이유는?", options: ["추방", "신분제 조선에서 뜻을 펼칠 수 없어서", "여행", "질병"], answer: 1, explanation: "신분제 조선에서 뜻을 펼칠 수 없었기 때문입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'호부호형'의 의미는?", options: ["인사", "아버지를 아버지, 형을 형이라 부르는 것", "이름", "별명"], answer: 1, explanation: "아버지를 아버지라, 형을 형이라 부르는 것입니다." },
        { q: "'율도국'이 상징하는 것은?", options: ["외국", "신분 차별 없는 이상 사회", "섬", "꿈"], answer: 1, explanation: "율도국은 신분 차별 없는 이상 사회입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "홍길동전이 최초의 한글 소설로 중요한 이유는?", options: ["길이", "서민도 읽을 수 있게 한글로 씀", "양반 작품", "번역"], answer: 1, explanation: "서민도 읽을 수 있게 한글로 썼습니다." },
        { q: "허균이 이 작품을 쓴 의도는?", options: ["재미", "적서 차별과 신분제 비판", "돈", "명예"], answer: 1, explanation: "적서 차별과 신분제를 비판했습니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "홍길동전의 혁명적 요소는?", options: ["없음", "기존 체제를 부정하고 새 나라 건국", "보수적", "순응적"], answer: 1, explanation: "기존 체제를 부정하고 새 나라를 건국했습니다." },
        { q: "현대에 홍길동이 의미 있는 이유는?", options: ["무관", "불평등에 대한 저항 정신", "옛날", "허구"], answer: 1, explanation: "불평등에 대한 저항 정신 때문입니다." }
      ]
    }
  },
  classic_29: {
    // 주제: 서동지전 (서동요 관련 설화)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "서동(무왕)의 신분은?", options: ["왕자", "마를 캐는 가난한 서민", "귀족", "승려"], answer: 1, explanation: "서동은 마를 캐는 가난한 서민이었습니다." },
        { q: "서동이 선화공주에게 접근한 방법은?", options: ["편지", "서동요를 지어 소문을 퍼뜨림", "선물", "전쟁"], answer: 1, explanation: "서동요를 지어 소문을 퍼뜨렸습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "서동요의 내용은?", options: ["사랑 고백", "선화공주가 서동을 밤에 만난다는 내용", "전쟁 노래", "축하 노래"], answer: 1, explanation: "선화공주가 서동을 밤에 만난다는 내용입니다." },
        { q: "서동지전의 결말은?", options: ["비극", "서동이 백제 무왕이 되어 선화공주와 결혼", "이별", "실패"], answer: 1, explanation: "서동이 백제 무왕이 되어 선화공주와 결혼합니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'서동요'가 의미하는 것은?", options: ["사랑 노래", "서동이 지은 참요(민간에 퍼진 노래)", "군가", "민요"], answer: 1, explanation: "서동이 지은 참요입니다." },
        { q: "'마'가 상징하는 것은?", options: ["음식", "서동의 비천한 출신", "약", "재산"], answer: 1, explanation: "서동의 비천한 출신을 상징합니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "서동이 꾀를 쓴 이유는?", options: ["장난", "신분 차이를 극복하기 위해", "복수", "돈"], answer: 1, explanation: "신분 차이를 극복하기 위해서입니다." },
        { q: "이 이야기가 전하는 메시지는?", options: ["신분 유지", "지혜와 노력으로 운명을 바꿀 수 있음", "포기", "순응"], answer: 1, explanation: "지혜와 노력으로 운명을 바꿀 수 있다는 것입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "서동지전의 문학적 특징은?", options: ["역사서", "설화를 소설화한 작품", "시", "일기"], answer: 1, explanation: "설화를 소설화한 작품입니다." },
        { q: "현대에 이 작품이 의미 있는 이유는?", options: ["무관", "신분을 넘는 사랑과 성공의 희망", "옛날", "미신"], answer: 1, explanation: "신분을 넘는 사랑과 성공의 희망 때문입니다." }
      ]
    }
  },
  classic_30: {
    // 주제: 장끼전 (추가 확인 후 맞춤)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "장끼가 죽게 된 원인은?", options: ["사냥꾼", "아내 말을 무시하고 콩을 먹다가 덫에 걸림", "질병", "싸움"], answer: 1, explanation: "아내 말을 무시하고 콩을 먹다가 덫에 걸렸습니다." },
        { q: "까투리가 장끼에게 경고한 것은?", options: ["날씨", "덫이 있으니 콩을 먹지 말라", "적군", "여행"], answer: 1, explanation: "덫이 있으니 콩을 먹지 말라고 경고했습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "이 작품의 갈등 구조는?", options: ["전쟁", "남편의 고집과 아내의 충고", "가족 다툼", "정치"], answer: 1, explanation: "남편의 고집과 아내의 충고 사이의 갈등입니다." },
        { q: "결말의 교훈은?", options: ["성공", "충고를 무시하면 화를 당함", "행복", "운명"], answer: 1, explanation: "충고를 무시하면 화를 당한다는 교훈입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'장끼'와 '까투리'는 무엇인가?", options: ["이름", "꿩의 수컷과 암컷", "지역", "음식"], answer: 1, explanation: "꿩의 수컷과 암컷입니다." },
        { q: "'콩'이 상징하는 것은?", options: ["음식", "눈앞의 이익(탐욕)", "건강", "자연"], answer: 1, explanation: "콩은 눈앞의 이익(탐욕)을 상징합니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "동물 우화로 쓴 이유는?", options: ["재미", "인간 사회를 간접적으로 비판", "아동용", "전통"], answer: 1, explanation: "인간 사회를 간접적으로 비판하기 위해서입니다." },
        { q: "장끼전이 비판하는 것은?", options: ["자연", "남성의 고집과 아집", "동물", "농업"], answer: 1, explanation: "남성의 고집과 아집을 비판합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "장끼전의 문학적 특징은?", options: ["서정", "우화 소설(동물 비유)", "역사", "전쟁"], answer: 1, explanation: "우화 소설(동물 비유)입니다." },
        { q: "현대에 이 작품이 의미 있는 이유는?", options: ["무관", "경청과 소통의 중요성", "옛날", "동물"], answer: 1, explanation: "경청과 소통의 중요성 때문입니다." }
      ]
    }
  }
};

// 각 파일에 REMEDIAL_BANK 데이터 업데이트 (기존 것 교체)
for (let i = 21; i <= 30; i++) {
  const num = String(i).padStart(2, '0');
  const key = `classic_${num}`;
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'korlit', `classic_${num}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  const remedialData = REMEDIAL_DATA[key];
  if (!remedialData) {
    console.log(`[SKIP] classic_${num} - 데이터 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // 기존 REMEDIAL_BANK 블록 제거
  const existingPattern = /<!-- ✅ 보완학습 데이터 \(learning-common\.js 로드 전에 정의\) -->\s*<script>\s*window\.REMEDIAL_BANK = \{[\s\S]*?\};\s*<\/script>\s*/;

  if (existingPattern.test(content)) {
    content = content.replace(existingPattern, '');
    console.log(`[OK] classic_${num} 기존 REMEDIAL_BANK 제거`);
  }

  // 새로운 REMEDIAL_BANK 삽입
  const remedialScript = `<!-- ✅ 보완학습 데이터 (learning-common.js 로드 전에 정의) -->
<script>
window.REMEDIAL_BANK = ${JSON.stringify(remedialData, null, 2)};
</script>

`;

  const commonJsPattern = /<script src="\/assets\/js\/learning-common\.js[^"]*"><\/script>/;

  if (commonJsPattern.test(content)) {
    content = content.replace(commonJsPattern, (match) => remedialScript + match);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[OK] classic_${num} 새 REMEDIAL_BANK 추가 완료`);
  } else {
    console.log(`[SKIP] classic_${num} - learning-common.js 로드 라인 없음`);
  }
}

console.log('\n✅ classic_21~30 REMEDIAL_BANK 데이터 수정 완료!');

const fs = require('fs');
const path = require('path');

// classic_21~30 각 파일의 본문 내용에 맞는 REMEDIAL_BANK 데이터
// 고전문학 21~30: 유충렬전, 소대성전, 최척전, 김영철전, 임경업전, 전우치전, 장화홍련전, 콩쥐팥쥐전, 심생전, 이생규장전

const REMEDIAL_DATA = {
  classic_21: {
    // 주제: 유충렬전
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "유충렬이 어린 시절 겪은 일은?", options: ["행복", "간신 정한담의 모함으로 아버지 유심 유배", "성공", "유학"], answer: 1, explanation: "간신 정한담의 모함으로 아버지가 유배됩니다." },
        { q: "유충렬의 활약은?", options: ["학문", "영웅으로 성장하여 나라를 구하고 원수를 갚음", "상업", "농업"], answer: 1, explanation: "영웅으로 성장하여 나라를 구하고 원수를 갚습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "유충렬전의 서사 구조는?", options: ["비극", "영웅의 일대기(고난→성장→승리→복수)", "희극", "순환"], answer: 1, explanation: "영웅의 일대기 구조입니다." },
        { q: "정한담의 역할은?", options: ["조력자", "주인공에게 시련을 주는 악인", "구원자", "방관자"], answer: 1, explanation: "주인공에게 시련을 주는 악인입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'충렬'이라는 이름의 의미는?", options: ["지역", "충성스럽고 열렬한 사람", "직업", "신분"], answer: 1, explanation: "충성스럽고 열렬한 사람이라는 뜻입니다." },
        { q: "'간신'이 상징하는 것은?", options: ["충신", "나라를 좀먹는 악한 세력", "영웅", "백성"], answer: 1, explanation: "나라를 좀먹는 악한 세력입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "유충렬전이 인기 있었던 이유는?", options: ["짧음", "영웅에 대한 대리 만족과 권선징악", "강요", "의무"], answer: 1, explanation: "영웅에 대한 대리 만족과 권선징악 때문입니다." },
        { q: "영웅 소설이 유행한 배경은?", options: ["태평", "전란과 혼란 속 강한 영웅에 대한 갈망", "평화", "풍요"], answer: 1, explanation: "전란과 혼란 속 강한 영웅에 대한 갈망입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "유충렬전의 문학사적 의의는?", options: ["외국 영향", "영웅 소설의 대표작", "실화", "역사서"], answer: 1, explanation: "영웅 소설의 대표작입니다." },
        { q: "현대에 영웅 서사가 의미 있는 이유는?", options: ["무관", "정의 실현에 대한 보편적 욕구", "옛날", "비현실적"], answer: 1, explanation: "정의 실현에 대한 보편적 욕구 때문입니다." }
      ]
    }
  },
  classic_22: {
    // 주제: 소대성전
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "소대성이 어린 시절 겪은 고난은?", options: ["풍요", "부모 잃고 거지로 떠돌며 구박받음", "성공", "유학"], answer: 1, explanation: "부모를 잃고 거지로 떠돌며 구박받습니다." },
        { q: "소대성의 성공은?", options: ["실패", "과거 급제와 장원 급제, 영웅적 활약", "은둔", "농업"], answer: 1, explanation: "과거 급제와 장원 급제, 영웅적 활약을 합니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "소대성전의 서사 구조는?", options: ["비극", "빈천한 주인공이 고난을 딛고 성공", "희극만", "순환"], answer: 1, explanation: "빈천한 주인공이 고난을 딛고 성공하는 구조입니다." },
        { q: "이 작품의 교훈은?", options: ["포기", "고난을 이기면 성공할 수 있다", "체념", "운명"], answer: 1, explanation: "고난을 이기면 성공할 수 있다는 교훈입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'대성'이라는 이름의 의미는?", options: ["지역", "크게 이룬다는 뜻", "직업", "신분"], answer: 1, explanation: "크게 이룬다는 뜻입니다." },
        { q: "'입신양명'이 이 작품에서 의미하는 것은?", options: ["실패", "출세하여 이름을 떨침", "은둔", "포기"], answer: 1, explanation: "출세하여 이름을 떨치는 것입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "소대성전이 서민에게 인기 있었던 이유는?", options: ["강요", "신분 상승의 꿈과 희망을 줌", "의무", "짧음"], answer: 1, explanation: "신분 상승의 꿈과 희망을 주기 때문입니다." },
        { q: "고난 극복 서사의 의미는?", options: ["무의미", "어려움을 이기는 희망의 메시지", "체념", "포기"], answer: 1, explanation: "어려움을 이기는 희망의 메시지입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "소대성전의 특징은?", options: ["비극", "영웅 소설과 애정 소설의 결합", "희극만", "풍자"], answer: 1, explanation: "영웅 소설과 애정 소설이 결합되어 있습니다." },
        { q: "현대에 이 작품이 의미 있는 이유는?", options: ["무관", "역경 극복과 성공에 대한 보편적 열망", "옛날", "비현실적"], answer: 1, explanation: "역경 극복과 성공에 대한 보편적 열망 때문입니다." }
      ]
    }
  },
  classic_23: {
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
  classic_24: {
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
  classic_25: {
    // 주제: 임경업전
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "임경업 장군의 역사적 배경은?", options: ["임진왜란", "병자호란 시기의 명장", "정묘호란", "을미사변"], answer: 1, explanation: "임경업은 병자호란 시기의 명장입니다." },
        { q: "임경업이 비극적 최후를 맞은 이유는?", options: ["전사", "간신 김자점의 모함", "질병", "은퇴"], answer: 1, explanation: "간신 김자점의 모함으로 비극적 최후를 맞습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "임경업전의 서사 구조는?", options: ["성공담", "영웅의 활약과 비극적 죽음", "희극", "로맨스"], answer: 1, explanation: "영웅의 활약과 비극적 죽음의 구조입니다." },
        { q: "김자점의 역할은?", options: ["충신", "영웅을 모함하는 간신", "조력자", "방관자"], answer: 1, explanation: "영웅을 모함하는 간신입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'충신'이 이 작품에서 의미하는 것은?", options: ["출세", "나라를 위해 희생하는 인물", "간신", "백성"], answer: 1, explanation: "나라를 위해 희생하는 인물입니다." },
        { q: "'북벌'이 상징하는 것은?", options: ["침략", "병자호란의 치욕을 씻으려는 의지", "평화", "무역"], answer: 1, explanation: "병자호란의 치욕을 씻으려는 의지입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "임경업전이 인기 있었던 이유는?", options: ["재미", "병자호란 치욕에 대한 대리 복수 욕구", "강요", "의무"], answer: 1, explanation: "병자호란 치욕에 대한 대리 복수 욕구입니다." },
        { q: "실존 인물을 소설화한 이유는?", options: ["사실 기록", "영웅에 대한 그리움과 추모", "오락", "비판"], answer: 1, explanation: "영웅에 대한 그리움과 추모입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "임경업전의 문학사적 의의는?", options: ["허구", "역사 영웅 소설의 대표작", "환상", "풍자"], answer: 1, explanation: "역사 영웅 소설의 대표작입니다." },
        { q: "현대에 이 작품이 의미 있는 이유는?", options: ["무관", "정의로운 영웅에 대한 보편적 갈망", "옛날", "외국"], answer: 1, explanation: "정의로운 영웅에 대한 보편적 갈망 때문입니다." }
      ]
    }
  },
  classic_26: {
    // 주제: 전우치전
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "전우치의 능력은?", options: ["무술", "도술(변신, 축지법 등)", "학문", "재산"], answer: 1, explanation: "전우치는 도술(변신, 축지법 등)을 사용합니다." },
        { q: "전우치가 도술로 한 일은?", options: ["전쟁", "탐관오리 골탕먹이고 백성 도움", "출세", "복수만"], answer: 1, explanation: "탐관오리를 골탕먹이고 백성을 도왔습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "전우치전의 서사 구조는?", options: ["비극", "연속적인 에피소드(도술 장난)", "단일 사건", "역사"], answer: 1, explanation: "연속적인 에피소드 구조입니다." },
        { q: "전우치의 풍자 대상은?", options: ["백성", "부패한 권력자와 탐관오리", "도사", "승려"], answer: 1, explanation: "부패한 권력자와 탐관오리입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'도술'이 상징하는 것은?", options: ["마법만", "현실을 뒤집는 저항의 힘", "오락", "공포"], answer: 1, explanation: "현실을 뒤집는 저항의 힘입니다." },
        { q: "'장난'이 이 작품에서 의미하는 것은?", options: ["유치함", "권력에 대한 풍자와 조롱", "실수", "우연"], answer: 1, explanation: "권력에 대한 풍자와 조롱입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "전우치전이 서민에게 인기 있었던 이유는?", options: ["교훈", "권력자를 골탕먹이는 통쾌함", "강요", "의무"], answer: 1, explanation: "권력자를 골탕먹이는 통쾌함 때문입니다." },
        { q: "도술 소설의 사회적 의미는?", options: ["미신", "현실에서 못하는 저항을 상상으로 실현", "오락만", "교육"], answer: 1, explanation: "현실에서 못하는 저항을 상상으로 실현합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "전우치전의 문학적 특징은?", options: ["비극", "도술 소설이자 풍자 소설", "역사 소설", "애정 소설"], answer: 1, explanation: "도술 소설이자 풍자 소설입니다." },
        { q: "현대에 이 작품이 의미 있는 이유는?", options: ["무관", "권력 비판의 상상력", "미신", "비현실적"], answer: 1, explanation: "권력 비판의 상상력 때문입니다." }
      ]
    }
  },
  classic_27: {
    // 주제: 장화홍련전
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "장화와 홍련이 죽은 원인은?", options: ["질병", "계모 허씨의 모함과 학대", "사고", "전쟁"], answer: 1, explanation: "계모 허씨의 모함과 학대로 죽습니다." },
        { q: "두 자매의 원혼이 한 일은?", options: ["복수", "신임 부사에게 억울함을 호소", "저주", "도망"], answer: 1, explanation: "신임 부사에게 억울함을 호소합니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "장화홍련전의 결말은?", options: ["비극만", "원혼이 풀리고 계모가 처벌받음", "미해결", "화해"], answer: 1, explanation: "원혼이 풀리고 계모가 처벌받습니다." },
        { q: "이 작품의 주제는?", options: ["복수만", "계모의 악행과 권선징악", "로맨스", "성공"], answer: 1, explanation: "계모의 악행과 권선징악입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'계모'가 이 작품에서 상징하는 것은?", options: ["어머니", "가정 내 악의 존재", "조력자", "피해자"], answer: 1, explanation: "가정 내 악의 존재입니다." },
        { q: "'원혼'이 나타난 이유는?", options: ["공포", "억울함을 풀기 위해", "저주", "우연"], answer: 1, explanation: "억울함을 풀기 위해서입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "장화홍련전이 인기 있었던 이유는?", options: ["공포", "약자의 억울함이 풀리는 카타르시스", "재미만", "교훈만"], answer: 1, explanation: "약자의 억울함이 풀리는 카타르시스입니다." },
        { q: "원혼 설정의 효과는?", options: ["공포만", "정의 실현의 당위성 강화", "오락", "무의미"], answer: 1, explanation: "정의 실현의 당위성을 강화합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "장화홍련전의 문학적 특징은?", options: ["영웅 소설", "가정 소설이자 원혼 소설", "역사 소설", "풍자 소설"], answer: 1, explanation: "가정 소설이자 원혼 소설입니다." },
        { q: "현대에 이 작품이 의미 있는 이유는?", options: ["무관", "가정 내 폭력 문제의 보편성", "공포물", "미신"], answer: 1, explanation: "가정 내 폭력 문제의 보편성 때문입니다." }
      ]
    }
  },
  classic_28: {
    // 주제: 콩쥐팥쥐전
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "콩쥐가 겪은 고난은?", options: ["가난", "계모와 팥쥐의 구박과 노동 착취", "전쟁", "질병"], answer: 1, explanation: "계모와 팥쥐의 구박과 노동 착취를 겪습니다." },
        { q: "콩쥐를 도와준 존재는?", options: ["친구", "두꺼비, 참새, 소 등 동물과 신이한 존재", "양반", "스승"], answer: 1, explanation: "두꺼비, 참새, 소 등이 도와줍니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "콩쥐팥쥐전의 결말은?", options: ["비극", "콩쥐는 행복, 계모와 팥쥐는 벌", "미해결", "화해"], answer: 1, explanation: "콩쥐는 행복해지고 계모와 팥쥐는 벌받습니다." },
        { q: "이 작품과 비슷한 서양 작품은?", options: ["백설공주", "신데렐라", "잠자는 숲속의 공주", "인어공주"], answer: 1, explanation: "신데렐라와 유사한 구조입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'콩쥐'가 상징하는 것은?", options: ["음식", "선하고 순종적인 피해자", "동물", "직업"], answer: 1, explanation: "선하고 순종적인 피해자입니다." },
        { q: "'팥쥐'가 상징하는 것은?", options: ["음식", "악하고 시기심 많은 존재", "동물", "직업"], answer: 1, explanation: "악하고 시기심 많은 존재입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "동물이 콩쥐를 돕는 의미는?", options: ["우연", "선한 자는 도움받는다는 믿음", "마법", "미신"], answer: 1, explanation: "선한 자는 도움받는다는 믿음입니다." },
        { q: "이 작품이 전하는 교훈은?", options: ["복수", "선은 복받고 악은 벌받는다", "체념", "포기"], answer: 1, explanation: "선은 복받고 악은 벌받는다입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "콩쥐팥쥐전의 문학적 특징은?", options: ["영웅 소설", "계모형 설화의 소설화", "역사 소설", "풍자 소설"], answer: 1, explanation: "계모형 설화의 소설화입니다." },
        { q: "현대에 이 작품이 의미 있는 이유는?", options: ["무관", "가족 갈등과 권선징악의 보편적 주제", "미신", "단순함"], answer: 1, explanation: "가족 갈등과 권선징악의 보편적 주제입니다." }
      ]
    }
  },
  classic_29: {
    // 주제: 심생전 (이옥)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "심생이 사랑한 여인은?", options: ["양반 규수", "기생이나 천민 출신 여인", "외국인", "왕족"], answer: 1, explanation: "기생이나 천민 출신 여인을 사랑합니다." },
        { q: "두 사람의 사랑이 비극적인 이유는?", options: ["성격", "신분 차이와 사회의 장벽", "거리", "나이"], answer: 1, explanation: "신분 차이와 사회의 장벽 때문입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "심생전의 결말은?", options: ["해피엔딩", "비극적 이별 또는 죽음", "화해", "성공"], answer: 1, explanation: "비극적 이별 또는 죽음으로 끝납니다." },
        { q: "이 작품의 주제는?", options: ["성공", "신분제에 가로막힌 비극적 사랑", "복수", "모험"], answer: 1, explanation: "신분제에 가로막힌 비극적 사랑입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'심생'이라는 이름의 의미는?", options: ["직업", "심씨 성을 가진 선비", "지역", "신분"], answer: 1, explanation: "심씨 성을 가진 선비라는 뜻입니다." },
        { q: "'전(傳)'이 의미하는 것은?", options: ["소설", "한 사람의 이야기를 전함", "편지", "일기"], answer: 1, explanation: "한 사람의 이야기를 전하는 것입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "이옥이 비극적 사랑을 쓴 이유는?", options: ["유행", "신분제 비판과 인간 감정의 진실성", "강요", "돈"], answer: 1, explanation: "신분제 비판과 인간 감정의 진실성입니다." },
        { q: "조선 후기 애정 소설의 특징은?", options: ["해피엔딩", "현실적 제약과 비극적 결말 증가", "권선징악", "영웅"], answer: 1, explanation: "현실적 제약과 비극적 결말이 증가합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "심생전의 문학사적 의의는?", options: ["전형적", "사실주의적 애정 소설의 선구", "영웅 소설", "풍자 소설"], answer: 1, explanation: "사실주의적 애정 소설의 선구입니다." },
        { q: "현대에 이 작품이 의미 있는 이유는?", options: ["무관", "사랑과 사회적 장벽의 보편적 갈등", "옛날", "단순"], answer: 1, explanation: "사랑과 사회적 장벽의 보편적 갈등 때문입니다." }
      ]
    }
  },
  classic_30: {
    // 주제: 이생규장전 (금오신화)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "이생이 사랑한 최랑은 어떤 존재인가?", options: ["산 사람", "전쟁으로 죽은 여인의 혼령", "기생", "왕족"], answer: 1, explanation: "최랑은 전쟁으로 죽은 여인의 혼령입니다." },
        { q: "두 사람이 헤어진 원인은?", options: ["싸움", "홍건적의 난으로 최랑이 죽음", "이별", "질병"], answer: 1, explanation: "홍건적의 난으로 최랑이 죽었습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "이생규장전의 특징은?", options: ["해피엔딩", "인귀 교환(사람과 귀신의 사랑)", "영웅담", "풍자"], answer: 1, explanation: "인귀 교환, 사람과 귀신의 사랑입니다." },
        { q: "최랑이 사라지는 이유는?", options: ["싫증", "이승과 저승의 경계를 넘을 수 없어서", "여행", "결혼"], answer: 1, explanation: "이승과 저승의 경계를 넘을 수 없기 때문입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'규장'의 의미는?", options: ["도서관", "규방의 장막(여인의 공간)", "궁궐", "서당"], answer: 1, explanation: "규방의 장막, 여인의 공간입니다." },
        { q: "'전기소설'이 의미하는 것은?", options: ["역사", "기이한 이야기를 담은 소설", "전쟁", "일기"], answer: 1, explanation: "기이한 이야기를 담은 소설입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "귀신과의 사랑이 담고 있는 정서는?", options: ["공포", "죽음도 막을 수 없는 사랑의 간절함", "재미", "교훈"], answer: 1, explanation: "죽음도 막을 수 없는 사랑의 간절함입니다." },
        { q: "전쟁 배경이 주는 효과는?", options: ["재미", "사랑의 비극성을 강화", "역사 교육", "우연"], answer: 1, explanation: "사랑의 비극성을 강화합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "이생규장전의 문학사적 의의는?", options: ["최초의 소설", "한국 전기소설의 대표작", "영웅 소설", "풍자 소설"], answer: 1, explanation: "한국 전기소설의 대표작입니다." },
        { q: "현대에 이 작품이 의미 있는 이유는?", options: ["무관", "사랑과 죽음이라는 보편적 주제", "미신", "공포물"], answer: 1, explanation: "사랑과 죽음이라는 보편적 주제 때문입니다." }
      ]
    }
  }
};

// 각 파일에 REMEDIAL_BANK 데이터 추가
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

  // 이미 window.REMEDIAL_BANK가 head에 있는지 확인
  if (content.includes('<!-- ✅ 보완학습 데이터 (learning-common.js 로드 전에 정의) -->')) {
    console.log(`[SKIP] classic_${num} 이미 REMEDIAL_BANK 있음`);
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
    console.log(`[OK] classic_${num} REMEDIAL_BANK 데이터 추가 완료`);
  } else {
    console.log(`[SKIP] classic_${num} - learning-common.js 로드 라인 없음`);
  }
}

console.log('\n✅ classic_21~30 REMEDIAL_BANK 데이터 추가 완료!');

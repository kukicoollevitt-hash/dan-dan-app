const fs = require('fs');
const path = require('path');

// classic_01~10 각 파일의 본문 내용에 맞는 REMEDIAL_BANK 데이터
// 고전문학 01~10: 춘향전, 심청전, 흥부전, 홍길동전, 구운몽, 사씨남정기, 허생전, 양반전, 호질, 금오신화

const REMEDIAL_DATA = {
  classic_01: {
    // 주제: 춘향전
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "춘향의 신분은?", options: ["양반", "기생의 딸(천민)", "상인", "농민"], answer: 1, explanation: "춘향은 기생 월매의 딸로 천민 신분입니다." },
        { q: "이몽룡이 춘향을 처음 만난 곳은?", options: ["한양", "광한루", "서당", "시장"], answer: 1, explanation: "이몽룡은 광한루에서 춘향을 처음 만났습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "변학도가 춘향을 옥에 가둔 이유는?", options: ["범죄", "수청 거부", "도망", "빚"], answer: 1, explanation: "춘향이 변학도의 수청 요구를 거부했기 때문입니다." },
        { q: "이몽룡이 암행어사가 되어 돌아온 이유는?", options: ["여행", "춘향을 구하고 탐관오리 징벌", "공부", "가족"], answer: 1, explanation: "춘향을 구하고 탐관오리를 징벌하기 위해서입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'수청'의 의미는?", options: ["청소", "관리에게 몸을 바치는 것", "노래", "춤"], answer: 1, explanation: "수청은 관리에게 몸을 바치는 것입니다." },
        { q: "'열녀'가 춘향에게 의미하는 것은?", options: ["직업", "한 남자만을 섬기는 정절", "이름", "신분"], answer: 1, explanation: "열녀는 한 남자만을 섬기는 정절을 의미합니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "춘향전이 신분제를 비판하는 방식은?", options: ["직접 비판", "천민 춘향과 양반의 사랑을 통해", "폭력", "법률"], answer: 1, explanation: "천민 춘향과 양반의 사랑으로 신분제를 비판합니다." },
        { q: "춘향전이 사랑받는 이유는?", options: ["짧아서", "신분을 초월한 사랑과 정의 실현", "무서워서", "쉬워서"], answer: 1, explanation: "신분을 초월한 사랑과 정의 실현 때문입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "춘향전이 판소리로 전해진 의의는?", options: ["길이", "서민들의 욕망과 가치관을 반영", "양반 문학", "외국 영향"], answer: 1, explanation: "서민들의 욕망과 가치관을 반영했습니다." },
        { q: "현대에 춘향전이 의미 있는 이유는?", options: ["없음", "사랑과 정의에 대한 보편적 가치", "옛날 이야기", "재미없음"], answer: 1, explanation: "사랑과 정의에 대한 보편적 가치 때문입니다." }
      ]
    }
  },
  classic_02: {
    // 주제: 심청전
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "심청이 인당수에 빠진 이유는?", options: ["사고", "아버지 눈을 뜨게 하기 위해 공양미 삼백 석", "자살", "처벌"], answer: 1, explanation: "아버지 눈을 뜨게 하기 위해 공양미 삼백 석에 몸을 팔았습니다." },
        { q: "심봉사가 눈을 뜬 계기는?", options: ["약", "맹인 잔치에서 심청을 만나 감격", "수술", "기적"], answer: 1, explanation: "맹인 잔치에서 심청을 만나 감격하여 눈을 떴습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "심청이 환생한 과정은?", options: ["마법", "용궁에서 연꽃으로 다시 태어남", "꿈", "환각"], answer: 1, explanation: "용궁에서 연꽃으로 다시 태어났습니다." },
        { q: "이 작품의 결말이 주는 메시지는?", options: ["비극", "효도는 반드시 보답받는다", "허무", "분노"], answer: 1, explanation: "효도는 반드시 보답받는다는 메시지입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'인당수'가 상징하는 것은?", options: ["바다", "희생과 시련의 공간", "여행지", "놀이터"], answer: 1, explanation: "인당수는 희생과 시련의 공간입니다." },
        { q: "'공양미 삼백 석'이 의미하는 것은?", options: ["음식", "효도를 위한 희생의 대가", "세금", "선물"], answer: 1, explanation: "효도를 위한 희생의 대가입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "심청전이 효 사상을 강조하는 이유는?", options: ["법률", "조선 시대 핵심 가치였기 때문", "유행", "강요"], answer: 1, explanation: "효는 조선 시대 핵심 가치였습니다." },
        { q: "심청의 희생이 현대에 주는 교훈은?", options: ["무의미", "가족 사랑의 소중함", "손해", "어리석음"], answer: 1, explanation: "가족 사랑의 소중함을 알려줍니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "심청전의 비현실적 요소의 역할은?", options: ["재미", "효행에 대한 보상을 극대화", "혼란", "오류"], answer: 1, explanation: "효행에 대한 보상을 극대화합니다." },
        { q: "현대적 관점에서 심청 서사의 문제점은?", options: ["없음", "여성의 희생을 미화할 수 있음", "완벽함", "이상적"], answer: 1, explanation: "여성의 희생을 미화할 수 있다는 비판이 있습니다." }
      ]
    }
  },
  classic_03: {
    // 주제: 흥부전
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "흥부가 복을 받은 계기는?", options: ["돈", "제비 다리를 고쳐줌", "공부", "노동"], answer: 1, explanation: "흥부가 제비 다리를 고쳐주어 복을 받았습니다." },
        { q: "놀부가 벌을 받은 이유는?", options: ["게으름", "제비 다리를 일부러 부러뜨림", "도둑질", "거짓말"], answer: 1, explanation: "놀부가 제비 다리를 일부러 부러뜨렸기 때문입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "흥부 박과 놀부 박의 대조적 결과는?", options: ["같음", "흥부는 보물, 놀부는 재앙", "반대로", "무관"], answer: 1, explanation: "흥부 박에서는 보물, 놀부 박에서는 재앙이 나왔습니다." },
        { q: "권선징악 구조의 의미는?", options: ["우연", "선한 행동은 복, 악한 행동은 벌", "운명", "무의미"], answer: 1, explanation: "선한 행동은 복을, 악한 행동은 벌을 받습니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'박'이 상징하는 것은?", options: ["음식", "행위에 대한 보상(인과응보)", "장식", "도구"], answer: 1, explanation: "박은 행위에 대한 보상을 상징합니다." },
        { q: "'형제'의 대조가 보여주는 것은?", options: ["가족애", "선과 악의 결과 차이", "경쟁", "화해"], answer: 1, explanation: "선과 악의 결과 차이를 보여줍니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "흥부전이 서민에게 인기 있었던 이유는?", options: ["짧아서", "가난해도 선하면 복받는다는 희망", "강요", "의무"], answer: 1, explanation: "가난해도 선하면 복받는다는 희망을 주었습니다." },
        { q: "놀부가 개과천선하는 결말의 의미는?", options: ["비현실", "누구나 변할 수 있다는 교훈", "우연", "실패"], answer: 1, explanation: "누구나 변할 수 있다는 교훈입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "흥부전의 사회 비판적 요소는?", options: ["없음", "형제간 재산 다툼과 빈부 문제", "완벽함", "이상적"], answer: 1, explanation: "형제간 재산 다툼과 빈부 문제를 비판합니다." },
        { q: "현대에 권선징악이 의미 있는 이유는?", options: ["무의미", "정의에 대한 보편적 기대", "옛날", "유치함"], answer: 1, explanation: "정의에 대한 보편적 기대 때문입니다." }
      ]
    }
  },
  classic_04: {
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
  classic_05: {
    // 주제: 구운몽
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "성진이 인간 세상에 태어난 이유는?", options: ["선택", "팔선녀와 만나 번뇌를 일으킨 벌", "사고", "소원"], answer: 1, explanation: "팔선녀와 만나 번뇌를 일으킨 벌입니다." },
        { q: "양소유가 이룬 것은?", options: ["실패", "입신양명과 여덟 부인과의 행복", "가난", "불행"], answer: 1, explanation: "입신양명과 여덟 부인과의 행복을 이루었습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "'구운몽' 제목의 의미는?", options: ["아홉 번의 꿈", "아홉 사람(성진+팔선녀)의 한바탕 꿈", "구름 꿈", "긴 꿈"], answer: 1, explanation: "아홉 사람의 한바탕 꿈이라는 뜻입니다." },
        { q: "꿈에서 깨어난 성진이 깨달은 것은?", options: ["행복", "인생무상, 부귀영화는 허망함", "성공 비결", "사랑"], answer: 1, explanation: "인생무상, 부귀영화는 허망하다는 것입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'몽(夢)'이 상징하는 것은?", options: ["잠", "인생의 허무와 덧없음", "휴식", "행복"], answer: 1, explanation: "인생의 허무와 덧없음을 상징합니다." },
        { q: "'입신양명'이 이 작품에서 의미하는 것은?", options: ["목표", "결국 허망한 세속적 성공", "가치", "행복"], answer: 1, explanation: "결국 허망한 세속적 성공입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "구운몽의 주제 의식은?", options: ["성공 추구", "불교적 공(空) 사상과 인생무상", "유교 충효", "도교 신선"], answer: 1, explanation: "불교적 공 사상과 인생무상입니다." },
        { q: "김만중이 이 작품을 쓴 배경은?", options: ["재미", "유배 중 어머니를 위로하기 위해", "돈", "명예"], answer: 1, explanation: "유배 중 어머니를 위로하기 위해 썼습니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "구운몽의 문학사적 의의는?", options: ["번역물", "한글 소설의 예술적 성취를 높임", "한문 소설", "외국 작품"], answer: 1, explanation: "한글 소설의 예술적 성취를 높였습니다." },
        { q: "현대인에게 '인생무상'이 의미 있는 이유는?", options: ["무의미", "물질 만능 시대에 성찰의 기회", "옛날 사상", "부정적"], answer: 1, explanation: "물질 만능 시대에 성찰의 기회를 줍니다." }
      ]
    }
  },
  classic_06: {
    // 주제: 사씨남정기
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "사씨가 쫓겨난 이유는?", options: ["범죄", "교씨의 모함", "자진", "이혼"], answer: 1, explanation: "사씨는 첩 교씨의 모함으로 쫓겨났습니다." },
        { q: "유연수가 결국 깨달은 것은?", options: ["성공", "사씨의 진심과 교씨의 악행", "실패", "무관심"], answer: 1, explanation: "사씨의 진심과 교씨의 악행을 깨달았습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "사씨와 교씨의 대조적 결말은?", options: ["같음", "사씨는 복귀, 교씨는 처벌", "반대", "무관"], answer: 1, explanation: "사씨는 복귀하고 교씨는 처벌받습니다." },
        { q: "이 작품의 교훈적 구조는?", options: ["비극", "선한 아내는 결국 인정받음", "희극", "무의미"], answer: 1, explanation: "선한 아내는 결국 인정받는다는 교훈입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'남정기'의 의미는?", options: ["여행기", "남쪽으로 쫓겨난 기록", "일기", "편지"], answer: 1, explanation: "남쪽으로 쫓겨난 기록이라는 뜻입니다." },
        { q: "'처첩 갈등'이 상징하는 것은?", options: ["가정", "조선 사회의 가부장제 문제", "사랑", "질투만"], answer: 1, explanation: "조선 사회의 가부장제 문제를 상징합니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "김만중이 이 작품을 쓴 정치적 의도는?", options: ["없음", "인현왕후 폐위에 대한 비판", "왕 찬양", "중립"], answer: 1, explanation: "인현왕후 폐위에 대한 비판입니다." },
        { q: "사씨가 보여주는 여성상은?", options: ["반항적", "인내하며 결국 인정받는 현모양처", "독립적", "자유로운"], answer: 1, explanation: "인내하며 결국 인정받는 현모양처입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "사씨남정기의 한계는?", options: ["완벽함", "여성의 인내만 강조하는 점", "없음", "혁신적"], answer: 1, explanation: "여성의 인내만 강조하는 한계가 있습니다." },
        { q: "현대적 관점에서 이 작품을 읽는 의의는?", options: ["무의미", "가부장제 사회의 문제점 성찰", "옛날", "재미없음"], answer: 1, explanation: "가부장제 사회의 문제점을 성찰할 수 있습니다." }
      ]
    }
  },
  classic_07: {
    // 주제: 허생전
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "허생이 장사로 돈을 번 방법은?", options: ["사기", "매점매석(물건 사재기로 가격 조절)", "노동", "도둑질"], answer: 1, explanation: "허생은 매점매석으로 돈을 벌었습니다." },
        { q: "허생이 이완에게 제안한 것은?", options: ["전쟁", "북벌을 위한 세 가지 계책", "도망", "항복"], answer: 1, explanation: "북벌을 위한 세 가지 계책을 제안했습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "허생이 사라진 이유는?", options: ["죽음", "자신의 계책이 받아들여지지 않아서", "여행", "은퇴"], answer: 1, explanation: "자신의 계책이 받아들여지지 않았기 때문입니다." },
        { q: "이 작품의 풍자 대상은?", options: ["백성", "무능한 양반과 위정자", "상인", "농민"], answer: 1, explanation: "무능한 양반과 위정자를 풍자합니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'북벌'이 당시 의미하는 것은?", options: ["남침", "청나라 정벌(병자호란 치욕 설욕)", "평화", "무역"], answer: 1, explanation: "청나라 정벌로 병자호란 치욕을 설욕하는 것입니다." },
        { q: "'매점매석'이 보여주는 것은?", options: ["정직", "경제를 아는 실용적 지식인", "사기", "무능"], answer: 1, explanation: "경제를 아는 실용적 지식인을 보여줍니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "박지원이 허생을 통해 비판한 것은?", options: ["상업", "실용성 없는 공리공론의 양반", "농업", "서민"], answer: 1, explanation: "실용성 없는 공리공론의 양반을 비판했습니다." },
        { q: "허생전의 실학 사상은?", options: ["유교 강조", "이용후생과 실사구시", "불교", "도교"], answer: 1, explanation: "이용후생과 실사구시를 강조합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "허생전의 문학사적 의의는?", options: ["전통 계승", "실학 사상을 담은 비판 문학", "오락물", "환상물"], answer: 1, explanation: "실학 사상을 담은 비판 문학입니다." },
        { q: "현대에 허생전이 의미 있는 이유는?", options: ["무관", "이론보다 실천의 중요성", "옛날", "재미"], answer: 1, explanation: "이론보다 실천의 중요성을 알려줍니다." }
      ]
    }
  },
  classic_08: {
    // 주제: 양반전
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
  classic_09: {
    // 주제: 호질
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
  classic_10: {
    // 주제: 금오신화
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "금오신화의 저자는?", options: ["허균", "김시습", "박지원", "김만중"], answer: 1, explanation: "금오신화의 저자는 김시습입니다." },
        { q: "'만복사저포기'의 주인공이 만난 것은?", options: ["친구", "죽은 여인의 혼령", "스승", "왕"], answer: 1, explanation: "죽은 여인의 혼령을 만났습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "금오신화의 공통적 특징은?", options: ["현실적", "인간과 귀신의 만남(전기소설)", "역사적", "전쟁"], answer: 1, explanation: "인간과 귀신의 만남을 다루는 전기소설입니다." },
        { q: "비현실적 요소를 사용한 이유는?", options: ["재미", "현실에서 이룰 수 없는 욕망 표현", "무지", "전통"], answer: 1, explanation: "현실에서 이룰 수 없는 욕망을 표현합니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'금오산'이 상징하는 것은?", options: ["여행지", "세상을 등진 은둔의 공간", "수도", "고향"], answer: 1, explanation: "금오산은 세상을 등진 은둔의 공간입니다." },
        { q: "'신화(新話)'의 의미는?", options: ["신화", "새로운 이야기(소설)", "전설", "역사"], answer: 1, explanation: "새로운 이야기, 즉 소설이라는 뜻입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "김시습이 금오산에 은거한 이유는?", options: ["휴양", "세조의 왕위 찬탈에 대한 저항", "공부", "건강"], answer: 1, explanation: "세조의 왕위 찬탈에 대한 저항입니다." },
        { q: "금오신화가 담고 있는 정서는?", options: ["기쁨", "현실에 대한 좌절과 비판", "만족", "희망만"], answer: 1, explanation: "현실에 대한 좌절과 비판을 담고 있습니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "금오신화의 문학사적 의의는?", options: ["번역물", "최초의 한문 소설(전기소설)", "구전 문학", "외국 작품"], answer: 1, explanation: "최초의 한문 소설입니다." },
        { q: "현대에 전기소설이 의미 있는 이유는?", options: ["무의미", "상상력과 현실 비판의 결합", "옛날", "비과학적"], answer: 1, explanation: "상상력과 현실 비판의 결합 때문입니다." }
      ]
    }
  }
};

// 각 파일에 REMEDIAL_BANK 데이터 추가
for (let i = 1; i <= 10; i++) {
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

console.log('\n✅ classic_01~10 REMEDIAL_BANK 데이터 추가 완료!');

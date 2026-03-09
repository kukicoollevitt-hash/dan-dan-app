const fs = require('fs');
const path = require('path');

// modern_31~40 각 파일의 본문 내용에 맞는 REMEDIAL_BANK 데이터
// 현대문학 31~40: 무녀도, 우리들의 일그러진 영웅, 난장이가 쏘아올린 작은 공,
// 원미동 사람들, 관촌수필, 깊은 강, 젊은 느티나무, 불신시대, 서편제, 그 많던 싱아는 누가 다 먹었을까

const REMEDIAL_DATA = {
  modern_31: {
    // 주제: 무녀도 (김동리)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "모화의 직업은?", options: ["농부", "무당", "상인", "교사"], answer: 1, explanation: "모화는 무당입니다." },
        { q: "낭이가 모화를 떠난 이유는?", options: ["돈 때문", "기독교 전도사 욱이와의 사랑", "질병", "여행"], answer: 1, explanation: "낭이는 기독교 전도사 욱이와 사랑에 빠져 떠났습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "무속과 기독교의 대립이 상징하는 것은?", options: ["종교 전쟁", "전통과 근대의 충돌", "가족 싸움", "지역 갈등"], answer: 1, explanation: "무속과 기독교는 전통과 근대의 충돌을 상징합니다." },
        { q: "모화의 결말은?", options: ["성공", "미쳐서 물에 빠져 죽음", "행복", "화해"], answer: 1, explanation: "모화는 미쳐서 물에 빠져 죽습니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'무녀도'의 의미는?", options: ["그림", "무당의 세계를 그린 작품(무녀의 그림)", "지도", "사진"], answer: 1, explanation: "무녀도는 무당의 세계를 그린 작품입니다." },
        { q: "'신내림'이 상징하는 것은?", options: ["질병", "전통적 운명과 정체성", "축복", "벌"], answer: 1, explanation: "신내림은 전통적 운명과 정체성을 상징합니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "모화가 비극적 결말을 맞은 이유는?", options: ["우연", "전통이 근대에 의해 파괴되는 과정", "실수", "선택"], answer: 1, explanation: "전통이 근대에 의해 파괴되는 과정을 보여줍니다." },
        { q: "작가가 말하고자 한 것은?", options: ["종교 비판", "급격한 근대화 속 전통의 비극", "성공담", "로맨스"], answer: 1, explanation: "급격한 근대화 속 전통의 비극을 말합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "김동리 문학의 특징은?", options: ["모더니즘", "토속적 세계와 운명의 탐구", "사실주의", "풍자"], answer: 1, explanation: "토속적 세계와 운명의 탐구가 특징입니다." },
        { q: "전통과 근대의 갈등이 현대에도 의미 있는 이유는?", options: ["없음", "문화 정체성 문제는 여전히 중요하기 때문", "해결됨", "무관"], answer: 1, explanation: "문화 정체성 문제는 여전히 중요합니다." }
      ]
    }
  },
  modern_32: {
    // 주제: 우리들의 일그러진 영웅 (이문열)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "엄석대의 지위는?", options: ["전학생", "반장으로서 절대 권력자", "교사", "학부모"], answer: 1, explanation: "엄석대는 반장으로서 절대 권력자입니다." },
        { q: "한병태가 처음에 저항한 이유는?", options: ["질투", "엄석대의 부당한 권력에 대한 반감", "장난", "오해"], answer: 1, explanation: "엄석대의 부당한 권력에 대한 반감 때문입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "엄석대의 몰락 원인은?", options: ["전학", "새 담임의 공정한 시험으로 부정 발각", "졸업", "사고"], answer: 1, explanation: "새 담임의 공정한 시험으로 부정이 발각되었습니다." },
        { q: "한병태가 결국 굴복한 이유는?", options: ["친해서", "저항의 고립감과 체제의 압력", "돈 때문", "협박"], answer: 1, explanation: "저항의 고립감과 체제의 압력 때문에 굴복했습니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'일그러진 영웅'이 의미하는 것은?", options: ["진짜 영웅", "권력으로 만들어진 가짜 영웅", "실패한 사람", "운동선수"], answer: 1, explanation: "권력으로 만들어진 가짜 영웅을 의미합니다." },
        { q: "'교실'이 상징하는 것은?", options: ["학교", "독재 사회의 축소판", "놀이터", "집"], answer: 1, explanation: "교실은 독재 사회의 축소판입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "이 작품이 알레고리인 이유는?", options: ["환상", "교실이 독재 정권 사회를 상징", "우연", "재미"], answer: 1, explanation: "교실이 독재 정권 사회를 상징하기 때문입니다." },
        { q: "작가가 비판하는 것은?", options: ["학교", "권위주의와 이에 순응하는 대중", "아이들", "교사"], answer: 1, explanation: "권위주의와 이에 순응하는 대중을 비판합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "이 작품이 1980년대에 주목받은 이유는?", options: ["유머", "독재 정권에 대한 우회적 비판", "로맨스", "환상"], answer: 1, explanation: "독재 정권에 대한 우회적 비판으로 주목받았습니다." },
        { q: "현대에도 이 작품이 의미 있는 이유는?", options: ["없음", "권력과 복종의 문제는 보편적", "옛날 이야기", "학교만"], answer: 1, explanation: "권력과 복종의 문제는 보편적입니다." }
      ]
    }
  },
  modern_33: {
    // 주제: 난장이가 쏘아올린 작은 공 (조세희)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "난장이 아버지의 직업은?", options: ["회사원", "공장 노동자 및 잡일", "교사", "의사"], answer: 1, explanation: "난장이 아버지는 공장 노동자 및 잡일을 했습니다." },
        { q: "난장이 가족이 겪는 문제는?", options: ["여행", "철거와 빈곤", "질병", "이사"], answer: 1, explanation: "난장이 가족은 철거와 빈곤을 겪습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "'작은 공'이 상징하는 것은?", options: ["장난감", "가난한 사람들의 희망과 꿈", "스포츠", "우주"], answer: 1, explanation: "작은 공은 가난한 사람들의 희망과 꿈입니다." },
        { q: "연작 소설 형식의 효과는?", options: ["편의", "도시 빈민의 다양한 삶을 입체적으로 보여줌", "길이", "재미"], answer: 1, explanation: "도시 빈민의 다양한 삶을 입체적으로 보여줍니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'난장이'가 상징하는 것은?", options: ["키 작은 사람", "사회에서 소외된 약자", "어린이", "노인"], answer: 1, explanation: "난장이는 사회에서 소외된 약자를 상징합니다." },
        { q: "'쏘아올리다'가 의미하는 것은?", options: ["던지다", "억압에서 벗어나려는 저항", "놀다", "버리다"], answer: 1, explanation: "억압에서 벗어나려는 저항을 의미합니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "1970년대 산업화가 작품에 미친 영향은?", options: ["발전", "빈부격차와 도시 빈민 문제를 부각", "평화", "행복"], answer: 1, explanation: "빈부격차와 도시 빈민 문제를 부각했습니다." },
        { q: "작가가 말하고자 한 것은?", options: ["성공", "산업화의 그늘과 소외된 사람들의 삶", "발전", "희망만"], answer: 1, explanation: "산업화의 그늘과 소외된 사람들의 삶을 말합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "이 작품이 한국 문학사에서 중요한 이유는?", options: ["길이", "산업화 시대 노동자 문학의 대표작", "유머", "환상"], answer: 1, explanation: "산업화 시대 노동자 문학의 대표작입니다." },
        { q: "빈부격차 문제가 현대에도 의미 있는 이유는?", options: ["없음", "양극화는 여전히 사회 문제", "해결됨", "옛날"], answer: 1, explanation: "양극화는 여전히 사회 문제입니다." }
      ]
    }
  },
  modern_34: {
    // 주제: 원미동 사람들 (양귀자)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "'원미동'은 어떤 곳인가?", options: ["부촌", "서민들이 사는 변두리 동네", "농촌", "섬"], answer: 1, explanation: "원미동은 서민들이 사는 변두리 동네입니다." },
        { q: "이 작품의 형식은?", options: ["장편", "연작 소설", "시", "희곡"], answer: 1, explanation: "연작 소설 형식입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "연작 소설 형식의 효과는?", options: ["편의", "다양한 인물들의 삶을 입체적으로 보여줌", "길이", "단순화"], answer: 1, explanation: "다양한 인물들의 삶을 입체적으로 보여줍니다." },
        { q: "원미동 사람들의 공통점은?", options: ["부자", "평범하지만 나름의 애환을 가진 서민", "유명인", "지식인"], answer: 1, explanation: "평범하지만 나름의 애환을 가진 서민들입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'원미동'이 상징하는 것은?", options: ["특별한 곳", "대한민국 어디에나 있는 서민 동네", "부촌", "외국"], answer: 1, explanation: "대한민국 어디에나 있는 서민 동네입니다." },
        { q: "'사람들'이 강조하는 것은?", options: ["개인", "공동체와 이웃의 의미", "고립", "경쟁"], answer: 1, explanation: "공동체와 이웃의 의미를 강조합니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "작가가 서민의 삶을 그린 이유는?", options: ["쉬워서", "소외된 이웃에 대한 관심과 애정", "돈 때문", "유행"], answer: 1, explanation: "소외된 이웃에 대한 관심과 애정 때문입니다." },
        { q: "이 작품이 주는 위로는?", options: ["성공", "힘들어도 함께 살아가는 이웃의 정", "재물", "명예"], answer: 1, explanation: "힘들어도 함께 살아가는 이웃의 정입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "양귀자 문학의 특징은?", options: ["환상적", "서민 삶에 대한 따뜻한 시선", "추상적", "실험적"], answer: 1, explanation: "서민 삶에 대한 따뜻한 시선이 특징입니다." },
        { q: "현대 도시에서 이웃의 의미는?", options: ["없음", "공동체 회복이 필요한 시대", "해결됨", "무관"], answer: 1, explanation: "공동체 회복이 필요한 시대입니다." }
      ]
    }
  },
  modern_35: {
    // 주제: 관촌수필 (이문구)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "'관촌'은 어떤 곳인가?", options: ["도시", "작가의 고향 농촌 마을", "외국", "섬"], answer: 1, explanation: "관촌은 작가의 고향 농촌 마을입니다." },
        { q: "이 작품의 특징적 문체는?", options: ["간결체", "충청도 사투리를 살린 토속적 문체", "외래어", "한문체"], answer: 1, explanation: "충청도 사투리를 살린 토속적 문체입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "연작 형식으로 그리는 것은?", options: ["도시", "농촌 공동체의 변화와 해체 과정", "전쟁", "로맨스"], answer: 1, explanation: "농촌 공동체의 변화와 해체 과정을 그립니다." },
        { q: "'수필'이라는 제목의 의미는?", options: ["장르", "일상적이고 친근한 이야기라는 느낌", "형식", "학문"], answer: 1, explanation: "일상적이고 친근한 이야기라는 느낌을 줍니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "사투리 사용의 효과는?", options: ["어려움", "토속적 정서와 향토색 강화", "웃음", "권위"], answer: 1, explanation: "토속적 정서와 향토색을 강화합니다." },
        { q: "'관촌'이 상징하는 것은?", options: ["특별한 곳", "사라져가는 농촌 공동체", "도시", "미래"], answer: 1, explanation: "사라져가는 농촌 공동체를 상징합니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "작가가 농촌을 그리는 이유는?", options: ["유행", "산업화로 사라지는 공동체에 대한 애도", "돈", "쉬워서"], answer: 1, explanation: "산업화로 사라지는 공동체에 대한 애도입니다." },
        { q: "이 작품이 주는 감동은?", options: ["흥분", "잃어버린 고향에 대한 그리움", "공포", "분노"], answer: 1, explanation: "잃어버린 고향에 대한 그리움입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "이문구 문학의 의의는?", options: ["도시 문학", "농촌 문학의 대표작으로 공동체 가치 환기", "실험 문학", "추상 문학"], answer: 1, explanation: "농촌 문학의 대표작으로 공동체 가치를 환기합니다." },
        { q: "현대에 농촌 문학이 의미 있는 이유는?", options: ["없음", "도시화 속에서 잃어버린 가치를 되돌아보게 함", "무관", "옛날"], answer: 1, explanation: "도시화 속에서 잃어버린 가치를 되돌아보게 합니다." }
      ]
    }
  },
  modern_36: {
    // 주제: 깊은 강 / 토지 (박경리) - 토지로 변경
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "'토지'의 배경 시대는?", options: ["현대", "구한말부터 해방까지", "조선 초기", "미래"], answer: 1, explanation: "구한말부터 해방까지가 배경입니다." },
        { q: "최참판댁 가문의 중심 인물은?", options: ["남자", "서희", "외국인", "왕"], answer: 1, explanation: "서희가 중심 인물입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "'토지'가 대하소설인 이유는?", options: ["짧아서", "여러 세대에 걸친 대서사시", "쉬워서", "유명해서"], answer: 1, explanation: "여러 세대에 걸친 대서사시이기 때문입니다." },
        { q: "서희의 삶이 상징하는 것은?", options: ["개인", "민족의 수난과 극복 의지", "로맨스", "성공"], answer: 1, explanation: "민족의 수난과 극복 의지를 상징합니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'토지'가 상징하는 것은?", options: ["부동산", "삶의 터전이자 민족의 근본", "농업", "재산"], answer: 1, explanation: "토지는 삶의 터전이자 민족의 근본입니다." },
        { q: "'하동 평사리'가 의미하는 것은?", options: ["여행지", "민족 공동체의 원형적 공간", "도시", "외국"], answer: 1, explanation: "민족 공동체의 원형적 공간입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "박경리가 '토지'를 쓴 이유는?", options: ["돈", "민족의 역사와 삶을 총체적으로 그리기 위해", "유행", "취미"], answer: 1, explanation: "민족의 역사와 삶을 총체적으로 그리기 위해서입니다." },
        { q: "이 작품이 주는 감동은?", options: ["공포", "민족의 강인한 생명력과 희망", "분노", "슬픔만"], answer: 1, explanation: "민족의 강인한 생명력과 희망을 줍니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "'토지'의 문학사적 의의는?", options: ["짧은 소설", "한국 문학 최대의 대하소설", "외국 문학", "시"], answer: 1, explanation: "한국 문학 최대의 대하소설입니다." },
        { q: "현대에 '토지'가 의미 있는 이유는?", options: ["없음", "민족 정체성과 역사 인식에 대한 성찰", "무관", "옛날"], answer: 1, explanation: "민족 정체성과 역사 인식에 대한 성찰을 줍니다." }
      ]
    }
  },
  modern_37: {
    // 주제: 젊은 느티나무 (강신재)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "숙희의 상황은?", options: ["부유함", "가난한 대학생으로 과외를 함", "농부", "회사원"], answer: 1, explanation: "숙희는 가난한 대학생으로 과외를 합니다." },
        { q: "현태와 숙희의 관계는?", options: ["가족", "신분 차이를 넘은 사랑", "적", "동료"], answer: 1, explanation: "신분 차이를 넘은 사랑입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "'느티나무'가 상징하는 것은?", options: ["가구", "오래된 전통과 새로운 사랑의 공존", "장식", "그늘"], answer: 1, explanation: "오래된 전통과 새로운 사랑의 공존입니다." },
        { q: "두 사람의 사랑이 어려운 이유는?", options: ["거리", "신분과 환경의 차이", "성격", "나이"], answer: 1, explanation: "신분과 환경의 차이 때문입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'젊은'이 의미하는 것은?", options: ["나이", "새로운 세대의 가치관과 사랑", "건강", "외모"], answer: 1, explanation: "새로운 세대의 가치관과 사랑입니다." },
        { q: "'느티나무'가 대비되는 것은?", options: ["다른 나무", "젊음과 전통의 관계", "계절", "장소"], answer: 1, explanation: "젊음과 전통의 관계를 대비합니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "1960년대에 이 작품이 인기 있었던 이유는?", options: ["유행", "신분을 넘는 순수한 사랑에 대한 공감", "강요", "우연"], answer: 1, explanation: "신분을 넘는 순수한 사랑에 대한 공감입니다." },
        { q: "작가가 말하고자 한 것은?", options: ["신분 유지", "사랑 앞에서 신분은 중요하지 않음", "현실 순응", "포기"], answer: 1, explanation: "사랑 앞에서 신분은 중요하지 않다는 것입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "강신재 문학의 특징은?", options: ["폭력적", "섬세한 심리 묘사와 낭만적 사랑", "추상적", "실험적"], answer: 1, explanation: "섬세한 심리 묘사와 낭만적 사랑이 특징입니다." },
        { q: "현대에도 신분 차이 사랑이 의미 있는 이유는?", options: ["없음", "사회적 편견은 여전히 존재", "해결됨", "무관"], answer: 1, explanation: "사회적 편견은 여전히 존재합니다." }
      ]
    }
  },
  modern_38: {
    // 주제: 불신시대 (박경리)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "진영의 직업은?", options: ["학생", "미장원을 운영하는 여성", "교사", "의사"], answer: 1, explanation: "진영은 미장원을 운영하는 여성입니다." },
        { q: "진영이 겪는 문제는?", options: ["건강", "남편의 외도와 배신", "여행", "공부"], answer: 1, explanation: "진영은 남편의 외도와 배신을 겪습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "'불신시대'라는 제목의 의미는?", options: ["종교", "인간에 대한 신뢰가 무너진 시대", "역사", "과학"], answer: 1, explanation: "인간에 대한 신뢰가 무너진 시대입니다." },
        { q: "진영의 결말이 의미하는 것은?", options: ["행복", "배신 후에도 삶을 이어가는 강인함", "포기", "복수"], answer: 1, explanation: "배신 후에도 삶을 이어가는 강인함입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'불신'이 가리키는 것은?", options: ["종교 불신", "인간관계의 배신과 신뢰 붕괴", "자기 불신", "정치"], answer: 1, explanation: "인간관계의 배신과 신뢰 붕괴입니다." },
        { q: "'미장원'이 상징하는 것은?", options: ["장식", "여성의 경제적 자립 공간", "유행", "사치"], answer: 1, explanation: "여성의 경제적 자립 공간입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "전후 시대와 '불신'의 관계는?", options: ["무관", "전쟁 후 가치관 혼란과 도덕 붕괴", "발전", "평화"], answer: 1, explanation: "전쟁 후 가치관 혼란과 도덕 붕괴입니다." },
        { q: "작가가 말하고자 한 것은?", options: ["희망만", "혼란 속에서도 살아가는 여성의 강인함", "절망", "복수"], answer: 1, explanation: "혼란 속에서도 살아가는 여성의 강인함입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "박경리 초기 문학의 특징은?", options: ["환상", "전후 여성의 삶과 사회 비판", "유머", "실험"], answer: 1, explanation: "전후 여성의 삶과 사회 비판이 특징입니다." },
        { q: "현대에도 '불신시대'가 공감받는 이유는?", options: ["없음", "배신과 신뢰의 문제는 시대를 초월", "해결됨", "무관"], answer: 1, explanation: "배신과 신뢰의 문제는 시대를 초월합니다." }
      ]
    }
  },
  modern_39: {
    // 주제: 서편제 (이청준)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "유봉의 직업은?", options: ["농부", "소리꾼(판소리 명창)", "상인", "교사"], answer: 1, explanation: "유봉은 소리꾼(판소리 명창)입니다." },
        { q: "유봉이 송화의 눈을 멀게 한 이유는?", options: ["사고", "한(恨)을 알게 하여 진정한 소리꾼으로 만들기 위해", "벌", "실수"], answer: 1, explanation: "한을 알게 하여 진정한 소리꾼으로 만들기 위해서입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "'서편제'와 '동편제'의 차이는?", options: ["지역", "슬프고 애절한 소리 vs 웅장한 소리", "장르", "악기"], answer: 1, explanation: "서편제는 슬프고 애절한 소리, 동편제는 웅장한 소리입니다." },
        { q: "동호가 송화를 찾아 헤매는 이유는?", options: ["돈", "어린 시절 헤어진 누이에 대한 그리움", "복수", "일"], answer: 1, explanation: "어린 시절 헤어진 누이에 대한 그리움입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'한(恨)'이 의미하는 것은?", options: ["분노", "풀리지 않는 슬픔과 그리움", "기쁨", "무관심"], answer: 1, explanation: "한은 풀리지 않는 슬픔과 그리움입니다." },
        { q: "'서편제'가 상징하는 것은?", options: ["지역명", "한국적 정서인 한과 슬픔의 미학", "음악 장르", "춤"], answer: 1, explanation: "한국적 정서인 한과 슬픔의 미학입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "유봉의 행동이 논쟁적인 이유는?", options: ["성공", "예술을 위해 인간성을 희생시킨 것", "실패", "포기"], answer: 1, explanation: "예술을 위해 인간성을 희생시켰기 때문입니다." },
        { q: "작가가 말하고자 한 것은?", options: ["성공", "한국 전통 예술의 가치와 예술혼의 의미", "포기", "현실"], answer: 1, explanation: "한국 전통 예술의 가치와 예술혼의 의미입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "이청준 문학의 특징은?", options: ["단순함", "서사적 탐구와 한국적 정서", "외국풍", "유머"], answer: 1, explanation: "서사적 탐구와 한국적 정서가 특징입니다." },
        { q: "전통 예술이 현대에도 의미 있는 이유는?", options: ["없음", "문화 정체성과 정서적 뿌리이기 때문", "무관", "옛날"], answer: 1, explanation: "문화 정체성과 정서적 뿌리이기 때문입니다." }
      ]
    }
  },
  modern_40: {
    // 주제: 그 많던 싱아는 누가 다 먹었을까 (박완서)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "이 작품의 장르는?", options: ["소설", "자전적 소설(자서전적 성장 소설)", "시", "희곡"], answer: 1, explanation: "자전적 소설(자서전적 성장 소설)입니다." },
        { q: "'싱아'는 무엇인가?", options: ["음식", "어린 시절 고향에서 먹던 풀(식물)", "사람", "동물"], answer: 1, explanation: "싱아는 어린 시절 고향에서 먹던 풀입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "이 작품의 시간적 배경은?", options: ["현대", "일제강점기부터 전쟁 후까지의 성장기", "조선시대", "미래"], answer: 1, explanation: "일제강점기부터 전쟁 후까지의 성장기입니다." },
        { q: "'싱아'가 상징하는 것은?", options: ["음식", "잃어버린 순수한 어린 시절과 고향", "돈", "권력"], answer: 1, explanation: "잃어버린 순수한 어린 시절과 고향입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'그 많던'이 강조하는 것은?", options: ["양", "풍요로웠던 과거와 상실감", "숫자", "크기"], answer: 1, explanation: "풍요로웠던 과거와 상실감을 강조합니다." },
        { q: "'누가 다 먹었을까'의 의미는?", options: ["질문", "시간의 흐름에 따른 상실에 대한 탄식", "식욕", "범인 찾기"], answer: 1, explanation: "시간의 흐름에 따른 상실에 대한 탄식입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "작가가 어린 시절을 회상하는 이유는?", options: ["향수", "역사적 격변 속 개인의 성장을 기록하기 위해", "재미", "돈"], answer: 1, explanation: "역사적 격변 속 개인의 성장을 기록하기 위해서입니다." },
        { q: "이 작품이 주는 감동은?", options: ["흥분", "한 시대를 살아낸 개인의 삶에 대한 공감", "공포", "분노"], answer: 1, explanation: "한 시대를 살아낸 개인의 삶에 대한 공감입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "박완서 자전적 소설의 의의는?", options: ["허구", "개인사를 통해 민족사를 조명", "유머", "환상"], answer: 1, explanation: "개인사를 통해 민족사를 조명합니다." },
        { q: "현대에 성장 소설이 의미 있는 이유는?", options: ["없음", "누구나 자신의 성장기를 돌아보게 함", "무관", "옛날"], answer: 1, explanation: "누구나 자신의 성장기를 돌아보게 합니다." }
      ]
    }
  }
};

// 각 파일에 REMEDIAL_BANK 데이터 추가
for (let i = 31; i <= 40; i++) {
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

console.log('\n✅ modern_31~40 REMEDIAL_BANK 데이터 추가 완료!');

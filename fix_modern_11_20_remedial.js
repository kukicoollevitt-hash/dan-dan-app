const fs = require('fs');
const path = require('path');

// modern_11~20 각 파일의 본문 내용에 맞는 REMEDIAL_BANK 데이터
const REMEDIAL_DATA = {
  modern_11: {
    // 주제: 탁류 (채만식)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "초봉이의 직업은?", options: ["교사", "은행원", "기생", "간호사"], answer: 1, explanation: "초봉이는 은행원으로 일했습니다." },
        { q: "'탁류'의 의미는?", options: ["맑은 물", "혼탁하게 흐르는 물", "고인 물", "바닷물"], answer: 1, explanation: "탁류는 혼탁하게 흐르는 물을 의미합니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "이 작품의 배경 시대는?", options: ["조선시대", "일제강점기", "현대", "고려시대"], answer: 1, explanation: "일제강점기를 배경으로 합니다." },
        { q: "초봉이가 타락하게 된 원인은?", options: ["성격", "사회적 환경과 주변 인물들의 착취", "교육 부족", "질병"], answer: 1, explanation: "사회적 환경과 주변 인물들의 착취가 원인입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'탁류'가 상징하는 것은?", options: ["희망", "혼탁한 시대와 불행한 운명", "성공", "사랑"], answer: 1, explanation: "탁류는 혼탁한 시대와 불행한 운명을 상징합니다." },
        { q: "'군산'이 작품에서 의미하는 것은?", options: ["고향", "식민지 수탈의 현장", "유토피아", "학교"], answer: 1, explanation: "군산은 식민지 수탈의 현장입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "초봉이의 비극이 주는 의미는?", options: ["개인 실패", "식민지 시대 여성의 비극적 운명", "성공담", "로맨스"], answer: 1, explanation: "식민지 시대 여성의 비극적 운명을 보여줍니다." },
        { q: "작가가 비판하는 것은?", options: ["자연", "식민지 사회의 부조리와 인간의 탐욕", "교육", "전통"], answer: 1, explanation: "식민지 사회의 부조리와 인간의 탐욕을 비판합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "채만식 문학의 특징은?", options: ["낭만적", "풍자와 사회 비판", "환상적", "서정적"], answer: 1, explanation: "풍자와 사회 비판이 특징입니다." },
        { q: "이 작품이 현대에 주는 시사점은?", options: ["없음", "사회 구조가 개인의 삶에 미치는 영향에 대한 성찰", "오락", "역사"], answer: 1, explanation: "사회 구조가 개인의 삶에 미치는 영향을 성찰하게 합니다." }
      ]
    }
  },
  modern_12: {
    // 주제: 삼대 (염상섭)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "'삼대'가 의미하는 것은?", options: ["세 나라", "조의관-상훈-덕기 3대의 가족", "세 친구", "세 시대"], answer: 1, explanation: "조의관, 상훈, 덕기 3대의 가족을 의미합니다." },
        { q: "덕기의 성격은?", options: ["보수적", "합리적이고 온건한 지식인", "급진적", "무관심"], answer: 1, explanation: "덕기는 합리적이고 온건한 지식인입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "세 세대의 가치관 차이는?", options: ["같음", "봉건-물질-근대 가치관의 충돌", "세대 화합", "무관심"], answer: 1, explanation: "봉건, 물질, 근대 가치관이 충돌합니다." },
        { q: "이 작품의 서술 특징은?", options: ["환상적", "사실주의적 묘사", "추상적", "시적"], answer: 1, explanation: "사실주의적 묘사가 특징입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'삼대'가 상징하는 것은?", options: ["단순 가족", "한국 근대사의 세대 갈등과 변화", "우정", "사랑"], answer: 1, explanation: "한국 근대사의 세대 갈등과 변화를 상징합니다." },
        { q: "'조의관'이 대표하는 가치는?", options: ["근대", "봉건적 가부장제와 전통", "혁명", "자유"], answer: 1, explanation: "조의관은 봉건적 가부장제와 전통을 대표합니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "덕기가 선택한 길의 의미는?", options: ["도피", "극단을 피한 온건한 근대화의 길", "투쟁", "포기"], answer: 1, explanation: "극단을 피한 온건한 근대화의 길입니다." },
        { q: "작품이 보여주는 1930년대 조선 사회는?", options: ["평화로움", "전통과 근대, 다양한 가치관이 충돌하는 혼란기", "발전", "통일"], answer: 1, explanation: "전통과 근대, 다양한 가치관이 충돌하는 혼란기입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "염상섭 문학의 특징은?", options: ["환상", "객관적 사실주의", "낭만", "실험"], answer: 1, explanation: "객관적 사실주의가 특징입니다." },
        { q: "세대 갈등이 현대에도 의미 있는 이유는?", options: ["없음", "가치관 충돌은 시대를 초월한 보편적 문제이기 때문", "옛날 이야기", "역사"], answer: 1, explanation: "가치관 충돌은 시대를 초월한 보편적 문제입니다." }
      ]
    }
  },
  modern_13: {
    // 주제: 태평천하 (채만식)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "윤 직원이 추구하는 것은?", options: ["독립운동", "자신의 재산과 안위만 지키는 것", "교육", "예술"], answer: 1, explanation: "윤 직원은 자신의 재산과 안위만 추구합니다." },
        { q: "'태평천하'의 의미는?", options: ["실제 평화", "윤 직원이 느끼는 거짓 평화(아이러니)", "전쟁", "혁명"], answer: 1, explanation: "윤 직원이 느끼는 거짓 평화로 아이러니입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "이 작품의 어조는?", options: ["비극적", "풍자적이고 냉소적", "서정적", "희망적"], answer: 1, explanation: "풍자적이고 냉소적인 어조입니다." },
        { q: "윤 직원의 자손들이 보여주는 것은?", options: ["효도", "부도덕한 기득권층의 타락", "성공", "화합"], answer: 1, explanation: "부도덕한 기득권층의 타락을 보여줍니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'윤 직원'이 상징하는 것은?", options: ["애국자", "친일 부역자, 기회주의적 기득권층", "혁명가", "지식인"], answer: 1, explanation: "윤 직원은 친일 부역자, 기회주의적 기득권층을 상징합니다." },
        { q: "'직원'이라는 호칭의 의미는?", options: ["현대 직장인", "일제가 준 벼슬(풍자)", "교사", "공무원"], answer: 1, explanation: "일제가 준 벼슬로 풍자적 의미입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "작가가 윤 직원을 희화화한 이유는?", options: ["존경", "친일 기득권층을 신랄하게 비판하기 위해", "동정", "무관심"], answer: 1, explanation: "친일 기득권층을 신랄하게 비판하기 위해서입니다." },
        { q: "손자 종학의 사회주의 운동이 의미하는 것은?", options: ["효도", "기득권 가문 내부의 아이러니한 균열", "성공", "화합"], answer: 1, explanation: "기득권 가문 내부의 아이러니한 균열입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "풍자 문학의 사회적 역할은?", options: ["오락", "사회의 부조리를 비판하고 각성시킴", "역사 기록", "교훈 없음"], answer: 1, explanation: "풍자 문학은 사회의 부조리를 비판하고 각성시킵니다." },
        { q: "이 작품이 현대에 주는 교훈은?", options: ["없음", "기회주의와 이기심에 대한 경계", "성공 비법", "처세술"], answer: 1, explanation: "기회주의와 이기심에 대한 경계를 줍니다." }
      ]
    }
  },
  modern_14: {
    // 주제: 천변풍경 (박태원)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "'천변'은 어디를 가리키는가?", options: ["한강", "청계천 주변", "낙동강", "금강"], answer: 1, explanation: "천변은 청계천 주변을 가리킵니다." },
        { q: "이 작품의 구성 특징은?", options: ["단일 주인공", "여러 인물의 삶을 병렬적으로 나열", "단편", "서간체"], answer: 1, explanation: "여러 인물의 삶을 병렬적으로 나열합니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "이 작품의 서술 기법은?", options: ["전통적", "모더니즘적 기법(카메라 시선)", "고전적", "설화적"], answer: 1, explanation: "모더니즘적 기법으로 카메라 시선처럼 서술합니다." },
        { q: "작품에 중심 서사가 없는 이유는?", options: ["실수", "도시 서민들의 일상 자체가 주제이기 때문", "분량 문제", "검열"], answer: 1, explanation: "도시 서민들의 일상 자체가 주제이기 때문입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'풍경'이 의미하는 것은?", options: ["자연 경치", "서민들의 삶의 모습들", "그림", "사진"], answer: 1, explanation: "풍경은 서민들의 삶의 모습들을 의미합니다." },
        { q: "'빨래터'가 상징하는 것은?", options: ["청결", "서민 여성들의 일상과 소통 공간", "노동", "휴식"], answer: 1, explanation: "빨래터는 서민 여성들의 일상과 소통 공간입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "작가가 평범한 인물들을 선택한 이유는?", options: ["영웅이 없어서", "일상 속 삶의 진실을 보여주기 위해", "유명인 부족", "쉬워서"], answer: 1, explanation: "일상 속 삶의 진실을 보여주기 위해서입니다." },
        { q: "이 작품이 보여주는 1930년대 서울은?", options: ["화려함", "근대화 속 서민들의 애환", "전쟁", "농촌"], answer: 1, explanation: "근대화 속 서민들의 애환을 보여줍니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "박태원의 문학적 특징은?", options: ["전통적", "모더니즘적 실험과 세밀한 묘사", "낭만적", "추상적"], answer: 1, explanation: "모더니즘적 실험과 세밀한 묘사가 특징입니다." },
        { q: "세태 소설의 가치는?", options: ["없음", "당대 사회와 삶의 모습을 생생히 기록", "오락", "교훈"], answer: 1, explanation: "당대 사회와 삶의 모습을 생생히 기록하는 가치가 있습니다." }
      ]
    }
  },
  modern_15: {
    // 주제: 무정 (이광수)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "이형식의 직업은?", options: ["농부", "영어 교사", "의사", "변호사"], answer: 1, explanation: "이형식은 영어 교사입니다." },
        { q: "이형식이 갈등하는 두 여성은?", options: ["영채와 선형", "박영채와 김선형", "순이와 점순", "옥희와 어머니"], answer: 1, explanation: "박영채와 김선형 사이에서 갈등합니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "이 작품의 문학사적 의의는?", options: ["최초의 시", "한국 최초의 근대 장편소설", "최초의 수필", "최초의 희곡"], answer: 1, explanation: "한국 최초의 근대 장편소설입니다." },
        { q: "결말에서 인물들이 향하는 곳과 목적은?", options: ["도피", "미국 유학(계몽과 근대화)", "귀향", "전쟁"], answer: 1, explanation: "미국 유학으로 계몽과 근대화를 목적으로 합니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'무정'이 의미하는 것은?", options: ["사랑 없음", "봉건적 인습과 정 없는 사회", "냉정함", "미움"], answer: 1, explanation: "무정은 봉건적 인습과 정 없는 사회를 의미합니다." },
        { q: "'계몽'이란?", options: ["어둠", "무지를 깨우쳐 새로운 지식을 일깨움", "전통", "복고"], answer: 1, explanation: "계몽은 무지를 깨우쳐 새로운 지식을 일깨우는 것입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "영채가 자살을 시도한 이유는?", options: ["질병", "봉건적 인습과 배신에 대한 절망", "가난", "모험"], answer: 1, explanation: "봉건적 인습과 배신에 대한 절망 때문입니다." },
        { q: "작가가 말하고자 한 것은?", options: ["복고", "구습 타파와 근대적 자아 각성의 필요성", "전통 유지", "체념"], answer: 1, explanation: "구습 타파와 근대적 자아 각성의 필요성입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "이광수 문학의 특징은?", options: ["예술지상주의", "계몽주의적 민족의식", "퇴폐주의", "실험주의"], answer: 1, explanation: "계몽주의적 민족의식이 특징입니다." },
        { q: "이 작품의 한계로 지적되는 것은?", options: ["문체", "지나친 계몽 의식과 관념적 결말", "짧은 분량", "난해함"], answer: 1, explanation: "지나친 계몽 의식과 관념적 결말이 한계로 지적됩니다." }
      ]
    }
  },
  modern_16: {
    // 주제: 만세전 (염상섭)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "주인공 이인화가 귀국하는 이유는?", options: ["여행", "아내의 위독 소식", "취업", "유학"], answer: 1, explanation: "아내의 위독 소식으로 귀국합니다." },
        { q: "'만세전'의 배경 시기는?", options: ["해방 후", "3.1운동 직전", "한국전쟁", "현대"], answer: 1, explanation: "3.1운동 직전이 배경입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "이인화의 여정이 의미하는 것은?", options: ["관광", "식민지 조선의 현실을 목격하는 과정", "도피", "성공"], answer: 1, explanation: "식민지 조선의 현실을 목격하는 과정입니다." },
        { q: "작품의 서술 시점은?", options: ["3인칭 전지적", "1인칭 주인공 시점", "3인칭 관찰자", "2인칭"], answer: 1, explanation: "1인칭 주인공 시점입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'만세전'이라는 제목의 의미는?", options: ["만세 부름", "3.1운동(만세) 이전의 암울한 시기", "축제", "승리"], answer: 1, explanation: "3.1운동 이전의 암울한 시기를 의미합니다." },
        { q: "'묘지'로 비유된 조선의 의미는?", options: ["아름다움", "생기 없이 죽어가는 식민지 현실", "평화", "발전"], answer: 1, explanation: "생기 없이 죽어가는 식민지 현실입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "이인화가 느끼는 '답답함'의 원인은?", options: ["날씨", "식민지 지식인으로서의 무력감과 현실 인식", "질병", "가난"], answer: 1, explanation: "식민지 지식인으로서의 무력감과 현실 인식입니다." },
        { q: "작가가 말하고자 한 것은?", options: ["체념", "식민지 현실에 대한 각성과 비판", "도피", "순응"], answer: 1, explanation: "식민지 현실에 대한 각성과 비판입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "염상섭 문학의 특징은?", options: ["환상적", "냉철한 현실 인식과 사실주의", "낭만적", "실험적"], answer: 1, explanation: "냉철한 현실 인식과 사실주의가 특징입니다." },
        { q: "이 작품이 문학사에서 중요한 이유는?", options: ["길이", "식민지 현실을 사실적으로 그린 선구적 작품", "유머", "판타지"], answer: 1, explanation: "식민지 현실을 사실적으로 그린 선구적 작품입니다." }
      ]
    }
  },
  modern_17: {
    // 주제: 날개 (이상)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "'나'와 아내의 관계는?", options: ["행복한 부부", "아내에게 경제적으로 종속된 무기력한 관계", "연인", "친구"], answer: 1, explanation: "아내에게 경제적으로 종속된 무기력한 관계입니다." },
        { q: "아내의 직업은?", options: ["교사", "사창가 여성(매춘)", "간호사", "상인"], answer: 1, explanation: "아내는 사창가 여성입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "이 작품의 서술 특징은?", options: ["객관적", "의식의 흐름 기법, 심리 묘사", "설명적", "대화 중심"], answer: 1, explanation: "의식의 흐름 기법과 심리 묘사가 특징입니다." },
        { q: "'날개'가 결말에서 의미하는 것은?", options: ["새", "자유와 회복에 대한 갈망", "비행기", "천사"], answer: 1, explanation: "날개는 자유와 회복에 대한 갈망입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'박제가 되어버린 천재'의 의미는?", options: ["성공한 천재", "재능이 있으나 현실에서 무력해진 지식인", "동물 표본", "예술가"], answer: 1, explanation: "재능이 있으나 현실에서 무력해진 지식인입니다." },
        { q: "'아스피린'이 상징하는 것은?", options: ["건강", "현실 도피와 무기력함", "치료", "활력"], answer: 1, explanation: "아스피린은 현실 도피와 무기력함을 상징합니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "'나'가 미쓰코시 백화점 옥상에서 외치는 의미는?", options: ["쇼핑", "억눌린 자아의 비극적 외침과 날고 싶은 갈망", "관광", "자살"], answer: 1, explanation: "억눌린 자아의 비극적 외침과 날고 싶은 갈망입니다." },
        { q: "이 작품이 보여주는 식민지 지식인의 모습은?", options: ["성공", "무력감과 자아 상실", "투쟁", "희망"], answer: 1, explanation: "무력감과 자아 상실을 보여줍니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "이상 문학의 특징은?", options: ["전통적", "실험적이고 난해한 모더니즘", "서정적", "사실적"], answer: 1, explanation: "실험적이고 난해한 모더니즘이 특징입니다." },
        { q: "이 작품이 현대에도 읽히는 이유는?", options: ["쉬워서", "현대인의 소외와 무력감에 대한 보편적 공감", "짧아서", "유명해서"], answer: 1, explanation: "현대인의 소외와 무력감에 대한 보편적 공감 때문입니다." }
      ]
    }
  },
  modern_18: {
    // 주제: 봉별기 (이상)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "'봉별기'의 뜻은?", options: ["별을 보는 기록", "별을 만난 기록(이별 이야기)", "천문 관측", "일기"], answer: 1, explanation: "봉별기는 별을 만난 기록, 즉 이별 이야기입니다." },
        { q: "금홍의 직업은?", options: ["교사", "기생", "간호사", "상인"], answer: 1, explanation: "금홍은 기생입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "이 작품의 형식은?", options: ["소설", "수필적 자전 소설", "시", "희곡"], answer: 1, explanation: "수필적 자전 소설 형식입니다." },
        { q: "작품에서 '나'와 금홍의 관계가 보여주는 것은?", options: ["행복", "사랑과 이별의 아픔, 예술가의 고뇌", "성공", "우정"], answer: 1, explanation: "사랑과 이별의 아픔, 예술가의 고뇌를 보여줍니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'금홍'이 상징하는 것은?", options: ["재물", "아름답지만 닿을 수 없는 존재", "성공", "권력"], answer: 1, explanation: "금홍은 아름답지만 닿을 수 없는 존재입니다." },
        { q: "'별'이 작품에서 의미하는 것은?", options: ["천체", "만남과 이별, 그리운 대상", "과학", "밤"], answer: 1, explanation: "별은 만남과 이별, 그리운 대상을 의미합니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "'나'가 금홍과 헤어진 이유는?", options: ["싫어서", "현실적 한계와 예술가로서의 고뇌", "다른 사람", "부모 반대"], answer: 1, explanation: "현실적 한계와 예술가로서의 고뇌 때문입니다." },
        { q: "이 작품이 주는 정서는?", options: ["희망", "애틋하고 쓸쓸한 그리움", "분노", "기쁨"], answer: 1, explanation: "애틋하고 쓸쓸한 그리움을 줍니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "이상 문학에서 사랑이 갖는 의미는?", options: ["행복", "삶의 고통과 예술적 영감의 원천", "성공", "일상"], answer: 1, explanation: "사랑은 삶의 고통과 예술적 영감의 원천입니다." },
        { q: "자전적 글쓰기의 가치는?", options: ["없음", "작가의 내면과 시대를 깊이 이해할 수 있음", "오락", "정보"], answer: 1, explanation: "작가의 내면과 시대를 깊이 이해할 수 있습니다." }
      ]
    }
  },
  modern_19: {
    // 주제: 삼포 가는 길 (황석영)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "영달과 정씨의 공통점은?", options: ["부자", "떠돌이 노동자(뜨내기)", "학생", "공무원"], answer: 1, explanation: "둘 다 떠돌이 노동자입니다." },
        { q: "정씨가 가려는 '삼포'는?", options: ["도시", "고향 마을", "외국", "학교"], answer: 1, explanation: "삼포는 정씨의 고향 마을입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "이 작품의 배경 시대는?", options: ["조선시대", "1970년대 산업화 시대", "일제강점기", "현대"], answer: 1, explanation: "1970년대 산업화 시대가 배경입니다." },
        { q: "여정(로드무비) 형식의 효과는?", options: ["지루함", "인물들의 삶과 시대상을 자연스럽게 보여줌", "혼란", "단순함"], answer: 1, explanation: "인물들의 삶과 시대상을 자연스럽게 보여줍니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'삼포'가 상징하는 것은?", options: ["성공", "잃어버린 고향과 공동체", "도시", "미래"], answer: 1, explanation: "삼포는 잃어버린 고향과 공동체를 상징합니다." },
        { q: "'뜨내기'의 의미는?", options: ["정착민", "일정한 거처 없이 떠도는 사람", "부자", "학생"], answer: 1, explanation: "뜨내기는 일정한 거처 없이 떠도는 사람입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "삼포가 변해버렸다는 것의 의미는?", options: ["발전", "산업화로 파괴된 공동체와 고향 상실", "평화", "성공"], answer: 1, explanation: "산업화로 파괴된 공동체와 고향 상실을 의미합니다." },
        { q: "작가가 비판하는 것은?", options: ["자연", "급격한 산업화가 가져온 인간 소외", "전통", "교육"], answer: 1, explanation: "급격한 산업화가 가져온 인간 소외를 비판합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "황석영 문학의 특징은?", options: ["환상적", "노동자와 서민의 삶에 대한 관심", "귀족적", "실험적"], answer: 1, explanation: "노동자와 서민의 삶에 대한 관심이 특징입니다." },
        { q: "이 작품이 현대에 주는 의미는?", options: ["없음", "개발과 성장 속에서 잃어버린 것에 대한 성찰", "오락", "정보"], answer: 1, explanation: "개발과 성장 속에서 잃어버린 것에 대해 성찰하게 합니다." }
      ]
    }
  },
  modern_20: {
    // 주제: 장마 (윤흥길)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "외할머니와 친할머니의 갈등 원인은?", options: ["재산", "6.25 전쟁으로 인한 이념 대립(빨치산 vs 국군)", "성격", "종교"], answer: 1, explanation: "6.25 전쟁으로 인한 이념 대립이 원인입니다." },
        { q: "작품의 화자는?", options: ["할머니", "어린 소년 '나'", "삼촌", "아버지"], answer: 1, explanation: "어린 소년 '나'가 화자입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "'장마'가 작품에서 하는 역할은?", options: ["배경만", "갈등의 시작과 화해를 연결하는 상징적 장치", "우연", "장식"], answer: 1, explanation: "장마는 갈등의 시작과 화해를 연결하는 상징적 장치입니다." },
        { q: "어린 화자를 설정한 효과는?", options: ["유머", "이념 갈등을 순수한 눈으로 객관화", "공포", "설명"], answer: 1, explanation: "이념 갈등을 순수한 눈으로 객관화합니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'장마'가 상징하는 것은?", options: ["여름", "전쟁의 상처와 화해의 시간", "농사", "휴가"], answer: 1, explanation: "장마는 전쟁의 상처와 화해의 시간을 상징합니다." },
        { q: "'구렁이'가 의미하는 것은?", options: ["동물", "죽은 삼촌의 영혼, 화해의 매개체", "공포", "악"], answer: 1, explanation: "구렁이는 죽은 삼촌의 영혼이자 화해의 매개체입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "두 할머니가 화해하게 된 계기는?", options: ["돈", "구렁이(삼촌 영혼)를 통한 초월적 경험", "외부 중재", "시간"], answer: 1, explanation: "구렁이를 통한 초월적 경험이 화해의 계기입니다." },
        { q: "작가가 말하고자 한 것은?", options: ["복수", "분단의 상처 치유와 화해의 가능성", "체념", "증오"], answer: 1, explanation: "분단의 상처 치유와 화해의 가능성입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "분단 문학의 의의는?", options: ["오락", "분단의 비극을 기억하고 화해를 모색", "역사 기록", "정치 선전"], answer: 1, explanation: "분단의 비극을 기억하고 화해를 모색하는 의의가 있습니다." },
        { q: "이 작품이 감동을 주는 이유는?", options: ["폭력", "가족애와 화해의 메시지", "공포", "추리"], answer: 1, explanation: "가족애와 화해의 메시지가 감동을 줍니다." }
      ]
    }
  }
};

// 각 파일에 REMEDIAL_BANK 데이터 추가
for (let i = 11; i <= 20; i++) {
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

console.log('\n✅ modern_11~20 REMEDIAL_BANK 데이터 추가 완료!');

const fs = require('fs');
const path = require('path');

// classic_11~20 각 파일의 본문 내용에 맞는 REMEDIAL_BANK 데이터
// 고전문학 11~20: 배비장전, 옹고집전, 장끼전, 토끼전, 박씨전, 운영전, 이춘풍전, 채봉감별곡, 숙향전, 조웅전

const REMEDIAL_DATA = {
  classic_11: {
    // 주제: 배비장전
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "배비장이 자랑한 것은?", options: ["재산", "여색을 멀리하는 청렴함", "학식", "무술"], answer: 1, explanation: "배비장은 여색을 멀리하는 청렴함을 자랑했습니다." },
        { q: "배비장이 빠진 함정은?", options: ["도둑", "기생 애랑의 유혹", "사기", "음모"], answer: 1, explanation: "배비장은 기생 애랑의 유혹에 빠졌습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "배비장이 망신당한 장면은?", options: ["재판", "궤짝에 숨어있다 들킴", "도망", "싸움"], answer: 1, explanation: "배비장은 궤짝에 숨어있다가 들켰습니다." },
        { q: "이 작품의 풍자 대상은?", options: ["백성", "위선적인 양반", "상인", "기생"], answer: 1, explanation: "위선적인 양반을 풍자합니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'비장'의 직책은?", options: ["관리", "지방관의 비서 역할", "군인", "상인"], answer: 1, explanation: "비장은 지방관의 비서 역할입니다." },
        { q: "'궤짝' 장면이 상징하는 것은?", options: ["보물", "위선자의 추락과 망신", "선물", "여행"], answer: 1, explanation: "위선자의 추락과 망신을 상징합니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "배비장전이 희극적인 이유는?", options: ["슬픔", "위선자가 망신당하는 통쾌함", "공포", "감동"], answer: 1, explanation: "위선자가 망신당하는 통쾌함 때문입니다." },
        { q: "서민들이 이 작품을 즐긴 이유는?", options: ["교훈", "양반의 위선을 조롱하는 쾌감", "공부", "의무"], answer: 1, explanation: "양반의 위선을 조롱하는 쾌감 때문입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "배비장전의 문학적 특징은?", options: ["비극", "골계미(해학과 풍자)", "서정", "서사시"], answer: 1, explanation: "골계미(해학과 풍자)가 특징입니다." },
        { q: "현대에 이 작품이 의미 있는 이유는?", options: ["무관", "위선에 대한 비판은 보편적", "옛날", "재미없음"], answer: 1, explanation: "위선에 대한 비판은 보편적입니다." }
      ]
    }
  },
  classic_12: {
    // 주제: 옹고집전
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "옹고집의 성격은?", options: ["착함", "고집 세고 인색함", "온순함", "겸손함"], answer: 1, explanation: "옹고집은 고집 세고 인색합니다." },
        { q: "가짜 옹고집이 나타난 이유는?", options: ["우연", "도사가 진짜를 혼내주기 위해", "복수", "도둑"], answer: 1, explanation: "도사가 진짜 옹고집을 혼내주기 위해서입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "진짜 옹고집이 쫓겨난 후 겪은 일은?", options: ["성공", "거지 생활 후 개과천선", "죽음", "도망"], answer: 1, explanation: "거지 생활 후 개과천선했습니다." },
        { q: "이 작품의 교훈적 구조는?", options: ["비극", "악행 → 징벌 → 개과천선", "희극", "무의미"], answer: 1, explanation: "악행 → 징벌 → 개과천선의 구조입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'옹고집'이라는 이름이 뜻하는 것은?", options: ["직업", "고집 센 사람을 비꼬는 말", "지역", "신분"], answer: 1, explanation: "고집 센 사람을 비꼬는 말입니다." },
        { q: "'가짜'가 상징하는 것은?", options: ["사기", "자신의 악행을 되돌아보게 하는 거울", "복제", "장난"], answer: 1, explanation: "자신의 악행을 되돌아보게 하는 거울입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "옹고집이 변화한 계기는?", options: ["설득", "자신과 똑같은 존재로 인한 고통 체험", "공부", "여행"], answer: 1, explanation: "자신과 똑같은 존재로 인한 고통 체험입니다." },
        { q: "이 작품이 전하는 메시지는?", options: ["고집 유지", "반성과 개선의 가능성", "포기", "복수"], answer: 1, explanation: "반성과 개선의 가능성을 전합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "옹고집전의 환상적 요소의 역할은?", options: ["공포", "교훈을 효과적으로 전달", "혼란", "장식"], answer: 1, explanation: "교훈을 효과적으로 전달합니다." },
        { q: "현대에 이 작품이 의미 있는 이유는?", options: ["무관", "자기 성찰의 중요성", "옛날", "비현실적"], answer: 1, explanation: "자기 성찰의 중요성 때문입니다." }
      ]
    }
  },
  classic_13: {
    // 주제: 장끼전
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
  },
  classic_14: {
    // 주제: 토끼전 (별주부전)
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "용왕이 토끼의 간을 찾는 이유는?", options: ["음식", "병을 고치기 위해", "보물", "장식"], answer: 1, explanation: "용왕이 병을 고치기 위해 토끼 간을 찾습니다." },
        { q: "토끼가 위기에서 벗어난 방법은?", options: ["싸움", "간을 육지에 두고 왔다고 거짓말", "도망", "협상"], answer: 1, explanation: "간을 육지에 두고 왔다고 거짓말했습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "별주부(자라)의 역할은?", options: ["악인", "용왕의 명으로 토끼를 유인", "구원자", "방관자"], answer: 1, explanation: "용왕의 명으로 토끼를 유인합니다." },
        { q: "이 작품의 풍자 대상은?", options: ["동물", "권력자의 횡포와 아첨꾼", "자연", "농민"], answer: 1, explanation: "권력자의 횡포와 아첨꾼을 풍자합니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'별주부'의 의미는?", options: ["별자리", "자라의 벼슬 이름", "이름", "지역"], answer: 1, explanation: "별주부는 자라의 벼슬 이름입니다." },
        { q: "'간'이 상징하는 것은?", options: ["장기", "약자가 가진 귀한 것(생명)", "음식", "보물"], answer: 1, explanation: "간은 약자가 가진 귀한 것(생명)입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "토끼가 살아남은 이유는?", options: ["운", "위기에서 기지를 발휘", "도움", "무력"], answer: 1, explanation: "위기에서 기지를 발휘했기 때문입니다." },
        { q: "용궁이 상징하는 것은?", options: ["바다", "부당한 권력이 횡행하는 공간", "천국", "이상향"], answer: 1, explanation: "부당한 권력이 횡행하는 공간입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "토끼전이 판소리로 인기 있었던 이유는?", options: ["길이", "서민의 권력 비판 욕구 반영", "양반 취향", "명령"], answer: 1, explanation: "서민의 권력 비판 욕구를 반영했습니다." },
        { q: "현대에 토끼전이 의미 있는 이유는?", options: ["무관", "권력 남용에 대한 비판", "옛날", "동물 이야기"], answer: 1, explanation: "권력 남용에 대한 비판이 여전히 유효합니다." }
      ]
    }
  },
  classic_15: {
    // 주제: 박씨전
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "박씨 부인의 처음 외모는?", options: ["미인", "추녀(못생긴 여자)", "평범", "귀족"], answer: 1, explanation: "박씨 부인은 처음에 추녀였습니다." },
        { q: "박씨가 활약한 사건은?", options: ["과거 시험", "병자호란에서 청나라 장수 격퇴", "혼인", "재판"], answer: 1, explanation: "병자호란에서 청나라 장수를 격퇴했습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "박씨가 미인이 된 과정은?", options: ["화장", "허물을 벗고 변신", "수술", "마법"], answer: 1, explanation: "허물을 벗고 미인으로 변신했습니다." },
        { q: "이 작품의 주제 의식은?", options: ["로맨스", "외모보다 내면의 가치와 민족 자긍심", "복수", "성공"], answer: 1, explanation: "외모보다 내면의 가치와 민족 자긍심입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'피화당'이 의미하는 것은?", options: ["꽃집", "박씨가 머무는 별채(피난처)", "병원", "학교"], answer: 1, explanation: "피화당은 박씨가 머무는 별채입니다." },
        { q: "'허물'이 상징하는 것은?", options: ["실수", "겉모습(외양)의 한계", "옷", "피부"], answer: 1, explanation: "허물은 겉모습의 한계를 상징합니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "병자호란 배경이 중요한 이유는?", options: ["역사", "치욕을 문학으로 위로하려는 욕구", "재미", "우연"], answer: 1, explanation: "치욕을 문학으로 위로하려는 욕구입니다." },
        { q: "박씨가 영웅인 이유는?", options: ["미모", "비범한 능력으로 나라를 구함", "재산", "신분"], answer: 1, explanation: "비범한 능력으로 나라를 구했습니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "박씨전이 여성 영웅 소설인 의의는?", options: ["희귀함", "여성이 주체적으로 활약", "남성 소설", "외국 영향"], answer: 1, explanation: "여성이 주체적으로 활약합니다." },
        { q: "현대에 박씨전이 의미 있는 이유는?", options: ["무관", "외모 차별에 대한 비판", "옛날", "전쟁 이야기"], answer: 1, explanation: "외모 차별에 대한 비판이 유효합니다." }
      ]
    }
  },
  classic_16: {
    // 주제: 운영전
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "운영의 신분은?", options: ["양반", "안평대군의 궁녀", "기생", "상인"], answer: 1, explanation: "운영은 안평대군의 궁녀입니다." },
        { q: "운영과 김진사의 관계는?", options: ["가족", "금지된 사랑", "적", "친구"], answer: 1, explanation: "운영과 김진사는 금지된 사랑입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "운영과 김진사의 결말은?", options: ["성공", "발각되어 비극적 죽음", "도망", "용서"], answer: 1, explanation: "발각되어 비극적으로 죽습니다." },
        { q: "이 작품의 서술 구조는?", options: ["단순", "액자 구조(유영이 귀신 만남)", "대화체", "편지"], answer: 1, explanation: "액자 구조로 유영이 귀신을 만납니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'수성궁'이 상징하는 것은?", options: ["아름다움", "억압과 구속의 공간", "자유", "천국"], answer: 1, explanation: "수성궁은 억압과 구속의 공간입니다." },
        { q: "'비단 주머니'가 의미하는 것은?", options: ["선물", "비밀 연애의 매개체", "돈", "장식"], answer: 1, explanation: "비밀 연애의 매개체입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "운영전이 비극인 이유는?", options: ["실패", "신분제가 사랑을 막았기 때문", "우연", "선택"], answer: 1, explanation: "신분제가 사랑을 막았기 때문입니다." },
        { q: "작가가 비판한 것은?", options: ["사랑", "인간의 자유를 억압하는 신분제", "궁녀", "왕"], answer: 1, explanation: "인간의 자유를 억압하는 신분제입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "운영전의 문학사적 의의는?", options: ["해피엔딩", "최초의 비극적 애정 소설", "희극", "교훈"], answer: 1, explanation: "최초의 비극적 애정 소설입니다." },
        { q: "현대에 운영전이 의미 있는 이유는?", options: ["무관", "자유와 사랑에 대한 보편적 갈망", "옛날", "귀신 이야기"], answer: 1, explanation: "자유와 사랑에 대한 보편적 갈망 때문입니다." }
      ]
    }
  },
  classic_17: {
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
  classic_18: {
    // 주제: 채봉감별곡
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "채봉의 신분은?", options: ["양반", "기생 또는 천민 출신", "왕족", "상인"], answer: 1, explanation: "채봉은 기생 또는 천민 출신입니다." },
        { q: "채봉과 필성의 갈등 원인은?", options: ["성격", "신분 차이로 인한 사랑의 장애", "돈", "거리"], answer: 1, explanation: "신분 차이로 인한 사랑의 장애입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "이 작품의 결말은?", options: ["비극", "시련 끝에 두 사람이 결합", "이별", "죽음"], answer: 1, explanation: "시련 끝에 두 사람이 결합합니다." },
        { q: "이 작품의 주제는?", options: ["복수", "신분을 초월한 사랑", "성공", "가족"], answer: 1, explanation: "신분을 초월한 사랑입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'감별곡'의 의미는?", options: ["노래 제목", "이별을 슬퍼하는 노래", "지역명", "인명"], answer: 1, explanation: "감별곡은 이별을 슬퍼하는 노래입니다." },
        { q: "'채봉'이라는 이름의 의미는?", options: ["직업", "아름다운 봉황을 뜻함", "지역", "신분"], answer: 1, explanation: "아름다운 봉황을 뜻합니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "채봉감별곡이 인기 있었던 이유는?", options: ["짧음", "신분 극복 로맨스에 대한 공감", "강요", "의무"], answer: 1, explanation: "신분 극복 로맨스에 대한 공감 때문입니다." },
        { q: "이 작품이 비판하는 것은?", options: ["사랑", "사랑을 가로막는 신분제", "여성", "남성"], answer: 1, explanation: "사랑을 가로막는 신분제입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "채봉감별곡의 문학적 특징은?", options: ["비극", "애정 소설의 전형적 구조", "풍자", "우화"], answer: 1, explanation: "애정 소설의 전형적 구조입니다." },
        { q: "현대에 이 작품이 의미 있는 이유는?", options: ["무관", "사랑과 차별에 대한 보편적 주제", "옛날", "단순함"], answer: 1, explanation: "사랑과 차별에 대한 보편적 주제 때문입니다." }
      ]
    }
  },
  classic_19: {
    // 주제: 숙향전
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "숙향이 어린 시절 겪은 일은?", options: ["행복", "부모와 헤어지고 온갖 고난", "성공", "여행"], answer: 1, explanation: "숙향은 부모와 헤어지고 온갖 고난을 겪습니다." },
        { q: "숙향과 이선의 인연은?", options: ["우연", "전생에 정해진 천상 배필", "가족 소개", "시험"], answer: 1, explanation: "전생에 정해진 천상 배필입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "숙향이 시련을 극복한 방법은?", options: ["포기", "신이한 도움과 본인의 덕", "폭력", "도망"], answer: 1, explanation: "신이한 도움과 본인의 덕으로 극복합니다." },
        { q: "이 작품의 결말은?", options: ["비극", "숙향과 이선의 결합, 가족 상봉", "이별", "죽음"], answer: 1, explanation: "숙향과 이선이 결합하고 가족과 상봉합니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'천상 배필'이 의미하는 것은?", options: ["귀족", "하늘이 정해준 짝", "외국인", "친구"], answer: 1, explanation: "천상 배필은 하늘이 정해준 짝입니다." },
        { q: "'숙향'이라는 이름의 의미는?", options: ["지역", "맑고 향기로운 덕성", "직업", "신분"], answer: 1, explanation: "맑고 향기로운 덕성을 의미합니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "숙향전이 인기 있었던 이유는?", options: ["짧음", "고난 후 행복이라는 희망적 서사", "강요", "의무"], answer: 1, explanation: "고난 후 행복이라는 희망적 서사 때문입니다." },
        { q: "전생과 천상의 설정이 주는 효과는?", options: ["혼란", "운명적 사랑의 당위성 강화", "공포", "재미"], answer: 1, explanation: "운명적 사랑의 당위성을 강화합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "숙향전의 문학적 특징은?", options: ["사실주의", "전기적 요소와 애정 소설의 결합", "역사", "풍자"], answer: 1, explanation: "전기적 요소와 애정 소설의 결합입니다." },
        { q: "현대에 이 작품이 의미 있는 이유는?", options: ["무관", "시련 극복과 희망의 보편적 주제", "미신", "비현실적"], answer: 1, explanation: "시련 극복과 희망의 보편적 주제 때문입니다." }
      ]
    }
  },
  classic_20: {
    // 주제: 조웅전
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "조웅이 어린 시절 겪은 일은?", options: ["행복", "간신의 모함으로 아버지 죽고 피난", "성공", "유학"], answer: 1, explanation: "간신의 모함으로 아버지가 죽고 피난갑니다." },
        { q: "조웅의 활약은?", options: ["학문", "영웅으로 성장하여 나라를 구함", "상업", "농업"], answer: 1, explanation: "영웅으로 성장하여 나라를 구합니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "조웅전의 서사 구조는?", options: ["비극", "영웅의 일대기(고난→성장→승리)", "희극", "순환"], answer: 1, explanation: "영웅의 일대기(고난→성장→승리)입니다." },
        { q: "간신 이두병의 역할은?", options: ["조력자", "주인공에게 시련을 주는 악인", "구원자", "방관자"], answer: 1, explanation: "주인공에게 시련을 주는 악인입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'영웅 소설'의 특징은?", options: ["비극", "비범한 주인공의 고난 극복과 성공", "일상", "로맨스만"], answer: 1, explanation: "비범한 주인공의 고난 극복과 성공입니다." },
        { q: "'간신'이 상징하는 것은?", options: ["충신", "나라를 망치는 악한 세력", "영웅", "백성"], answer: 1, explanation: "나라를 망치는 악한 세력입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "조웅전이 인기 있었던 이유는?", options: ["짧음", "영웅에 대한 대리 만족", "강요", "의무"], answer: 1, explanation: "영웅에 대한 대리 만족 때문입니다." },
        { q: "영웅 소설이 유행한 시대적 배경은?", options: ["태평성대", "전란과 혼란 속 영웅 갈망", "평화", "풍요"], answer: 1, explanation: "전란과 혼란 속 영웅에 대한 갈망입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "조웅전의 문학사적 의의는?", options: ["외국 영향", "영웅 소설의 전형적 작품", "실화", "역사서"], answer: 1, explanation: "영웅 소설의 전형적 작품입니다." },
        { q: "현대에 영웅 서사가 의미 있는 이유는?", options: ["무관", "희망과 정의에 대한 보편적 욕구", "옛날", "비현실적"], answer: 1, explanation: "희망과 정의에 대한 보편적 욕구 때문입니다." }
      ]
    }
  }
};

// 각 파일에 REMEDIAL_BANK 데이터 추가
for (let i = 11; i <= 20; i++) {
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

console.log('\n✅ classic_11~20 REMEDIAL_BANK 데이터 추가 완료!');

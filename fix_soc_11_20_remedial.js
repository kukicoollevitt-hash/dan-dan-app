const fs = require('fs');
const path = require('path');

// soc_11~20 REMEDIAL_BANK 데이터
const REMEDIAL_DATA = {
  // soc_11: K-드라마는 왜 세계를 사로잡았을까?
  soc_11: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "한류란?", options: ["한국의 강", "한국 대중문화가 세계적으로 인기를 얻는 현상", "한국의 날씨", "한국의 음식만"], answer: 1, explanation: "한류는 한국 대중문화(드라마, 음악, 영화 등)가 세계적으로 인기를 얻는 현상입니다." },
        { q: "K-드라마가 세계적으로 인기를 얻은 이유 중 하나는?", options: ["값이 싸서", "보편적 감정과 독특한 스토리텔링", "영어로만 제작되어서", "광고가 많아서"], answer: 1, explanation: "K-드라마는 사랑, 가족, 성장 등 보편적 감정과 독특한 스토리텔링으로 세계인의 공감을 얻었습니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "K-드라마의 성공 요인으로 언급된 것이 아닌 것은?", options: ["감성적 스토리", "높은 제작 품질", "OTT 플랫폼의 역할", "국내 시청자만 타깃"], answer: 3, explanation: "K-드라마는 넷플릭스 등 OTT 플랫폼을 통해 전 세계로 확산되었습니다." },
        { q: "문화 콘텐츠 산업의 특징으로 알맞은 것은?", options: ["일회성으로 끝남", "경제적 가치와 국가 이미지 향상에 기여", "제조업과 동일", "수출이 불가능"], answer: 1, explanation: "문화 콘텐츠 산업은 경제적 가치 창출과 국가 이미지 향상에 기여합니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'OTT'란?", options: ["인터넷을 통해 영상을 제공하는 서비스", "텔레비전 방송국", "영화관", "라디오 방송"], answer: 0, explanation: "OTT(Over The Top)는 인터넷을 통해 영상 콘텐츠를 제공하는 서비스입니다." },
        { q: "'소프트 파워'의 의미는?", options: ["군사력", "문화, 가치관 등으로 다른 나라에 영향을 미치는 힘", "경제력만", "물리적 힘"], answer: 1, explanation: "소프트 파워는 문화, 가치관 등으로 다른 나라에 영향을 미치는 힘입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "K-드라마의 인기가 한국에 미치는 긍정적 영향은?", options: ["아무 영향 없음", "한국 문화와 제품에 대한 관심 증가", "외국인 방문 감소", "경제 침체"], answer: 1, explanation: "K-드라마 인기는 한국 문화, 관광, 제품에 대한 세계적 관심을 높입니다." },
        { q: "문화 다양성 관점에서 한류를 바라볼 때 중요한 것은?", options: ["한국 문화만 우월", "일방적 전파", "상호 문화 교류와 존중", "다른 문화 무시"], answer: 2, explanation: "한류를 통해 상호 문화 교류와 존중이 이루어지는 것이 중요합니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "K-드라마 속 한국 문화를 볼 때 주의할 점은?", options: ["모든 것이 현실과 동일", "드라마는 현실을 각색한 것임을 인식", "비판 없이 수용", "무조건 따라하기"], answer: 1, explanation: "드라마는 현실을 각색한 것이므로 비판적으로 볼 필요가 있습니다." },
        { q: "문화 콘텐츠의 지속적 발전을 위해 필요한 것은?", options: ["과거 성공에만 의존", "창의성과 다양성 추구", "모방만 하기", "변화 거부"], answer: 1, explanation: "문화 콘텐츠의 지속적 발전을 위해서는 창의성과 다양성 추구가 필요합니다." }
      ]
    }
  },

  // soc_12: 가짜 뉴스를 구별하는 법
  soc_12: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "가짜 뉴스란?", options: ["진짜 뉴스", "거짓 정보를 진짜처럼 꾸민 뉴스", "오래된 뉴스", "외국 뉴스"], answer: 1, explanation: "가짜 뉴스는 거짓 정보를 진짜 뉴스처럼 꾸며 퍼뜨리는 것입니다." },
        { q: "가짜 뉴스가 퍼지는 주요 경로는?", options: ["도서관", "SNS와 인터넷", "학교 수업", "신문 배달"], answer: 1, explanation: "가짜 뉴스는 SNS와 인터넷을 통해 빠르게 퍼집니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "가짜 뉴스의 특징이 아닌 것은?", options: ["자극적인 제목", "출처 불분명", "팩트체크 완료", "감정에 호소"], answer: 2, explanation: "가짜 뉴스는 보통 팩트체크가 되지 않은 상태로 퍼집니다." },
        { q: "가짜 뉴스를 만드는 목적으로 언급된 것은?", options: ["정확한 정보 전달", "클릭 유도, 여론 조작, 금전적 이익", "교육 목적", "과학 연구"], answer: 1, explanation: "가짜 뉴스는 클릭 유도, 여론 조작, 금전적 이익 등을 목적으로 만들어집니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'팩트체크'란?", options: ["사실 여부를 확인하는 것", "뉴스 삭제", "뉴스 공유", "뉴스 작성"], answer: 0, explanation: "팩트체크는 뉴스나 정보의 사실 여부를 확인하는 것입니다." },
        { q: "'미디어 리터러시'란?", options: ["글씨를 읽는 능력", "미디어를 비판적으로 이해하고 활용하는 능력", "영상 제작 기술", "컴퓨터 수리"], answer: 1, explanation: "미디어 리터러시는 미디어를 비판적으로 이해하고 활용하는 능력입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "가짜 뉴스가 사회에 미치는 영향은?", options: ["긍정적 영향만", "혼란과 갈등 유발, 민주주의 위협", "아무 영향 없음", "경제 성장"], answer: 1, explanation: "가짜 뉴스는 사회적 혼란과 갈등을 유발하고 민주주의를 위협합니다." },
        { q: "뉴스를 볼 때 출처를 확인해야 하는 이유는?", options: ["귀찮아서", "정보의 신뢰성을 판단하기 위해", "시간 낭비", "필요 없음"], answer: 1, explanation: "출처 확인은 정보의 신뢰성을 판단하는 중요한 방법입니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "가짜 뉴스를 예방하기 위한 개인의 역할은?", options: ["무조건 공유", "비판적 사고와 팩트체크 습관화", "모든 뉴스 불신", "뉴스 안 보기"], answer: 1, explanation: "비판적 사고와 팩트체크 습관이 가짜 뉴스 예방에 중요합니다." },
        { q: "뉴스 소비자로서 바람직한 태도는?", options: ["자극적인 뉴스만 선호", "다양한 매체를 비교하며 사실 확인", "하나의 매체만 신뢰", "뉴스에 무관심"], answer: 1, explanation: "다양한 매체를 비교하며 사실을 확인하는 것이 바람직합니다." }
      ]
    }
  },

  // soc_13: 18세 선거권, 우리의 목소리
  soc_13: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "우리나라에서 18세 선거권이 시행된 해는?", options: ["2015년", "2019년", "2022년", "2010년"], answer: 1, explanation: "우리나라는 2019년부터 만 18세 선거권을 시행했습니다." },
        { q: "선거권의 의미는?", options: ["세금을 내는 권리", "대표자를 뽑을 수 있는 권리", "교육받을 권리", "재산을 가질 권리"], answer: 1, explanation: "선거권은 선거에서 투표하여 대표자를 뽑을 수 있는 권리입니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "18세 선거권의 의의로 알맞은 것은?", options: ["청소년 배제", "청소년의 정치 참여 기회 확대", "투표율 감소", "어른만의 권리"], answer: 1, explanation: "18세 선거권은 청소년의 정치 참여 기회를 확대하는 의미가 있습니다." },
        { q: "민주주의에서 선거가 중요한 이유는?", options: ["형식적 절차", "국민의 의사가 정치에 반영되는 핵심 수단", "의무만 있음", "관심 가질 필요 없음"], answer: 1, explanation: "선거는 국민의 의사가 정치에 반영되는 민주주의의 핵심 수단입니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'참정권'이란?", options: ["재산을 가질 권리", "정치에 참여할 수 있는 권리", "교육받을 권리", "일할 권리"], answer: 1, explanation: "참정권은 선거권, 피선거권 등 정치에 참여할 수 있는 권리입니다." },
        { q: "'정치적 효능감'이란?", options: ["정치에 무관심", "자신의 참여가 정치에 영향을 미친다는 믿음", "정치 불신", "투표 거부"], answer: 1, explanation: "정치적 효능감은 자신의 참여가 정치에 영향을 미친다는 믿음입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "청소년이 정치에 관심을 가져야 하는 이유는?", options: ["관심 가질 필요 없음", "미래 사회의 주인공으로서 목소리를 낼 권리가 있어서", "어른이 알아서 함", "공부만 하면 됨"], answer: 1, explanation: "청소년도 미래 사회의 주인공으로서 정치에 목소리를 낼 권리가 있습니다." },
        { q: "투표 연령 하향이 가져올 수 있는 긍정적 효과는?", options: ["정치 무관심 증가", "청소년 관련 정책에 대한 관심 증가", "아무 변화 없음", "갈등만 증가"], answer: 1, explanation: "투표 연령 하향은 청소년 관련 정책에 대한 정치권의 관심을 높일 수 있습니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "청소년 유권자로서 바람직한 자세는?", options: ["어른 따라 투표", "정책과 공약을 비교하며 스스로 판단", "투표 안 하기", "무관심"], answer: 1, explanation: "정책과 공약을 비교하며 스스로 판단하는 것이 바람직한 유권자의 자세입니다." },
        { q: "선거권과 함께 가져야 할 책임은?", options: ["책임 없음", "정치에 관심을 갖고 정보를 습득하려는 노력", "무조건 기권", "비판만 하기"], answer: 1, explanation: "선거권과 함께 정치에 관심을 갖고 정보를 습득하려는 책임이 따릅니다." }
      ]
    }
  },

  // soc_14: 정의란 무엇인가? 공정한 사회를 향하여
  soc_14: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "정의란?", options: ["강한 자의 이익", "사회 구성원 모두에게 공정하게 몫을 나누는 것", "부자만을 위한 것", "법을 어기는 것"], answer: 1, explanation: "정의는 사회 구성원 모두에게 공정하게 권리와 의무를 나누는 것입니다." },
        { q: "공정한 사회의 특징으로 알맞은 것은?", options: ["차별이 많음", "기회의 평등과 결과의 정당성이 보장됨", "부의 세습만 인정", "경쟁 없음"], answer: 1, explanation: "공정한 사회는 기회의 평등과 결과의 정당성이 보장되는 사회입니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "정의의 두 가지 측면으로 언급된 것은?", options: ["부와 권력", "절차적 정의와 분배적 정의", "개인과 국가", "과거와 미래"], answer: 1, explanation: "정의에는 절차적 정의(과정의 공정함)와 분배적 정의(결과의 공정함)가 있습니다." },
        { q: "사회적 약자를 배려하는 것이 정의로운 이유는?", options: ["불평등해서", "출발선이 다른 사람들에게 실질적 평등을 보장하기 위해", "필요 없음", "역차별이라서"], answer: 1, explanation: "사회적 약자 배려는 출발선이 다른 사람들에게 실질적 평등을 보장합니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'공정'의 의미는?", options: ["한쪽에 치우침", "어느 쪽으로도 치우치지 않고 올바름", "강자 우선", "약자 무시"], answer: 1, explanation: "공정은 어느 쪽으로도 치우치지 않고 올바른 것을 의미합니다." },
        { q: "'분배적 정의'란?", options: ["모두에게 똑같이 나눔", "각자의 필요와 기여에 따라 적절하게 나눔", "아무에게도 안 줌", "강자에게만 줌"], answer: 1, explanation: "분배적 정의는 각자의 필요와 기여에 따라 적절하게 나누는 것입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "정의로운 사회를 만들기 위해 필요한 것은?", options: ["무관심", "시민들의 관심과 참여, 제도적 보완", "차별 유지", "경쟁만 강조"], answer: 1, explanation: "정의로운 사회를 위해서는 시민들의 관심과 참여, 제도적 보완이 필요합니다." },
        { q: "능력주의만 강조했을 때의 문제점은?", options: ["문제없음", "출발선의 차이를 무시하여 불평등 심화", "모두 평등해짐", "경쟁 사라짐"], answer: 1, explanation: "능력주의만 강조하면 출발선의 차이를 무시하여 불평등이 심화될 수 있습니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "정의에 대한 바람직한 태도는?", options: ["남의 일로 여김", "다양한 관점에서 생각하고 토론하는 자세", "한 가지 정답만 고집", "무관심"], answer: 1, explanation: "정의에 대해 다양한 관점에서 생각하고 토론하는 자세가 바람직합니다." },
        { q: "공정에 대한 논쟁이 발생하는 이유는?", options: ["공정은 명확해서", "상황과 관점에 따라 공정의 기준이 다를 수 있어서", "논쟁할 필요 없어서", "모두 동의해서"], answer: 1, explanation: "공정의 기준은 상황과 관점에 따라 다를 수 있어 논쟁이 발생합니다." }
      ]
    }
  },

  // soc_15: 기후 위기와 미래 세대의 책임
  soc_15: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "기후 위기의 주요 원인은?", options: ["화산 폭발", "온실가스 배출 증가로 인한 지구 온난화", "지구 자전", "태양 활동"], answer: 1, explanation: "기후 위기의 주요 원인은 인간 활동에 의한 온실가스 배출 증가입니다." },
        { q: "기후 위기로 인한 현상이 아닌 것은?", options: ["해수면 상승", "이상 기후", "생물 다양성 감소", "인구 증가"], answer: 3, explanation: "기후 위기로 해수면 상승, 이상 기후, 생물 다양성 감소 등이 발생합니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "기후 위기 대응의 두 가지 방향은?", options: ["무시와 방치", "완화(온실가스 감축)와 적응(피해 최소화)", "개발과 성장", "과거와 현재"], answer: 1, explanation: "기후 위기 대응은 완화(온실가스 감축)와 적응(피해 최소화) 두 방향이 있습니다." },
        { q: "기후 위기가 '세대 간 정의' 문제인 이유는?", options: ["현세대만의 문제", "현세대의 행동이 미래 세대의 환경에 영향을 미쳐서", "미래 세대만의 문제", "관계없음"], answer: 1, explanation: "현세대의 행동이 미래 세대의 환경에 영향을 미치므로 세대 간 정의 문제입니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'탄소 중립'이란?", options: ["탄소 배출을 늘리는 것", "배출한 탄소를 흡수하여 순배출을 0으로 만드는 것", "탄소 무시", "화석연료 증가"], answer: 1, explanation: "탄소 중립은 배출한 탄소를 흡수하여 순배출을 0으로 만드는 것입니다." },
        { q: "'지속가능한 발전'이란?", options: ["무한 성장", "미래 세대의 필요를 해치지 않으면서 현재 세대의 필요를 충족하는 발전", "환경 파괴", "현재만 중시"], answer: 1, explanation: "지속가능한 발전은 미래 세대를 고려하며 현재의 필요를 충족하는 발전입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "청소년이 기후 행동에 나서는 이유는?", options: ["관심 없음", "기후 위기의 직접적 피해자가 될 미래 세대이므로", "어른이 시켜서", "유행이라서"], answer: 1, explanation: "청소년은 기후 위기의 직접적 피해자가 될 미래 세대이므로 행동에 나섭니다." },
        { q: "기후 위기 대응에서 개인과 사회의 역할 관계는?", options: ["개인만 노력", "사회만 노력", "개인의 노력과 사회 시스템 변화가 함께 필요", "아무도 노력 불필요"], answer: 2, explanation: "기후 위기 대응에는 개인의 노력과 사회 시스템 변화가 함께 필요합니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "기후 위기에 대한 바람직한 자세는?", options: ["나 하나 바뀐다고 달라지지 않음", "작은 실천부터 시작하고 사회적 변화를 요구", "무관심", "미래 세대 문제로 미룸"], answer: 1, explanation: "작은 실천부터 시작하고 사회적 변화를 요구하는 자세가 바람직합니다." },
        { q: "기후 위기 대응에서 '정의'가 중요한 이유는?", options: ["관계없음", "피해와 책임이 불평등하게 분배되어 있어서", "모두 평등해서", "경제만 중요"], answer: 1, explanation: "기후 위기의 피해와 책임이 불평등하게 분배되어 있어 정의가 중요합니다." }
      ]
    }
  },

  // soc_16: 국제사회와 글로벌 시민
  soc_16: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "글로벌 시민이란?", options: ["자국민만 생각하는 사람", "국경을 넘어 인류 공동의 문제에 관심을 갖는 사람", "여행을 좋아하는 사람", "외국어만 잘하는 사람"], answer: 1, explanation: "글로벌 시민은 국경을 넘어 인류 공동의 문제에 관심을 갖고 행동하는 사람입니다." },
        { q: "국제사회의 주요 행위자로 언급된 것은?", options: ["개인만", "국가, 국제기구, NGO, 다국적 기업 등", "국가만", "기업만"], answer: 1, explanation: "국제사회의 행위자는 국가, 국제기구, NGO, 다국적 기업 등 다양합니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "국제사회에서 협력이 필요한 이유는?", options: ["협력 불필요", "기후변화, 빈곤 등 한 나라로 해결 못하는 문제가 많아서", "경쟁만 하면 됨", "각자 해결"], answer: 1, explanation: "기후변화, 빈곤 등 국경을 넘는 문제는 국제 협력이 필요합니다." },
        { q: "UN(국제연합)의 역할로 알맞은 것은?", options: ["특정 국가 지배", "세계 평화와 안전, 인권 보호 등을 위한 국제 협력", "경제만 담당", "군사력 행사"], answer: 1, explanation: "UN은 세계 평화, 안전, 인권 보호 등을 위한 국제 협력을 촉진합니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'세계화'란?", options: ["자국 고립", "국가 간 경제, 문화, 정치적 교류가 증가하는 현상", "쇄국 정책", "무역 금지"], answer: 1, explanation: "세계화는 국가 간 경제, 문화, 정치적 교류가 증가하는 현상입니다." },
        { q: "'NGO'란?", options: ["정부 기관", "비정부 기구(민간 단체)", "기업", "군대"], answer: 1, explanation: "NGO는 Non-Governmental Organization, 즉 비정부 기구(민간 단체)입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "글로벌 시민 의식이 중요해진 이유는?", options: ["중요하지 않음", "세계화로 국가 간 상호의존성이 높아졌기 때문", "국가만 중요", "개인은 무력"], answer: 1, explanation: "세계화로 국가 간 상호의존성이 높아져 글로벌 시민 의식이 중요해졌습니다." },
        { q: "청소년이 글로벌 시민으로서 할 수 있는 일은?", options: ["아무것도 없음", "공정무역 제품 사용, 국제 문제 관심, 온라인 캠페인 참여 등", "어른이 될 때까지 대기", "무관심"], answer: 1, explanation: "청소년도 공정무역 제품 사용, 국제 문제 관심 등으로 글로벌 시민 역할을 할 수 있습니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "세계화의 문제점으로 지적되는 것은?", options: ["문제 없음", "빈부 격차 확대, 문화 획일화 우려", "모두에게 이익", "환경 개선"], answer: 1, explanation: "세계화로 인해 빈부 격차 확대, 문화 획일화 등의 우려가 있습니다." },
        { q: "국제사회의 문제 해결에서 중요한 자세는?", options: ["자국 이익만 추구", "상호 존중과 협력, 다양성 인정", "힘의 논리", "무관심"], answer: 1, explanation: "국제 문제 해결에는 상호 존중과 협력, 다양성 인정이 중요합니다." }
      ]
    }
  },

  // soc_17: 과학기술이 바꾸는 일상
  soc_17: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "4차 산업혁명의 핵심 기술이 아닌 것은?", options: ["인공지능", "사물인터넷", "증기기관", "빅데이터"], answer: 2, explanation: "증기기관은 1차 산업혁명의 기술이며, 4차 산업혁명은 AI, IoT, 빅데이터 등이 핵심입니다." },
        { q: "과학기술 발전이 일상에 미친 영향으로 알맞은 것은?", options: ["변화 없음", "생활 편의 증가, 소통 방식 변화", "불편함만 증가", "기술 퇴보"], answer: 1, explanation: "과학기술 발전으로 생활 편의가 증가하고 소통 방식이 변화했습니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "과학기술의 양면성이란?", options: ["장점만 있음", "긍정적 측면과 부정적 측면이 공존함", "단점만 있음", "관계없음"], answer: 1, explanation: "과학기술은 편리함을 주지만 부작용도 있어 양면성을 가집니다." },
        { q: "과학기술 발전에 따른 사회 변화로 언급된 것은?", options: ["변화 없음", "직업 변화, 프라이버시 문제, 디지털 격차", "모든 문제 해결", "기술 거부"], answer: 1, explanation: "과학기술 발전으로 직업 변화, 프라이버시 문제, 디지털 격차 등이 발생합니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'인공지능(AI)'이란?", options: ["인간만의 지능", "인간의 학습, 추론 능력을 컴퓨터로 구현한 기술", "자연 지능", "동물 지능"], answer: 1, explanation: "인공지능은 인간의 학습, 추론 능력을 컴퓨터로 구현한 기술입니다." },
        { q: "'디지털 격차'란?", options: ["디지털 기술 평등", "정보 기술 접근과 활용 능력의 차이", "디지털 기기 가격", "인터넷 속도"], answer: 1, explanation: "디지털 격차는 정보 기술에 대한 접근과 활용 능력의 차이를 말합니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "AI 발전으로 사라질 수 있는 직업과 새로 생길 직업에 대해 생각해볼 때 중요한 것은?", options: ["무관심", "변화에 적응하는 능력과 평생 학습", "기술 거부", "과거 직업 고수"], answer: 1, explanation: "기술 변화에 적응하는 능력과 평생 학습 자세가 중요합니다." },
        { q: "과학기술의 혜택이 모두에게 돌아가려면 필요한 것은?", options: ["시장에 맡김", "디지털 격차 해소 노력과 정책", "기술 독점", "무관심"], answer: 1, explanation: "과학기술 혜택의 공평한 분배를 위해 디지털 격차 해소 노력이 필요합니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "과학기술을 대하는 바람직한 자세는?", options: ["무조건 수용", "비판적 수용과 윤리적 사용", "무조건 거부", "무관심"], answer: 1, explanation: "과학기술을 비판적으로 수용하고 윤리적으로 사용하는 자세가 바람직합니다." },
        { q: "AI 윤리가 중요한 이유는?", options: ["중요하지 않음", "기술이 인간의 가치와 권리를 침해할 수 있어서", "기술만 중요", "윤리는 구식"], answer: 1, explanation: "AI 기술이 인간의 가치와 권리를 침해하지 않도록 윤리가 중요합니다." }
      ]
    }
  },

  // soc_18: 복지란 무엇인가? 함께 사는 사회
  soc_18: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "복지란?", options: ["부자만을 위한 것", "모든 국민이 인간다운 삶을 누릴 수 있도록 하는 것", "가난한 사람에게만 해당", "경제 성장만"], answer: 1, explanation: "복지는 모든 국민이 인간다운 삶을 누릴 수 있도록 하는 사회적 노력입니다." },
        { q: "사회 보장 제도의 예가 아닌 것은?", options: ["건강보험", "국민연금", "기초생활보장", "주식 투자"], answer: 3, explanation: "건강보험, 국민연금, 기초생활보장은 사회 보장 제도의 예입니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "사회 보장 제도의 유형으로 언급된 것은?", options: ["저축만", "사회보험, 공공부조, 사회서비스", "기부만", "자선만"], answer: 1, explanation: "사회 보장 제도는 사회보험, 공공부조, 사회서비스로 구분됩니다." },
        { q: "복지 국가의 목표로 알맞은 것은?", options: ["빈부 격차 확대", "국민의 기본적 생활 보장과 삶의 질 향상", "경쟁만 강조", "개인 책임만 강조"], answer: 1, explanation: "복지 국가는 국민의 기본적 생활 보장과 삶의 질 향상을 목표로 합니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'사회보험'이란?", options: ["개인 저축", "국가가 운영하고 국민이 보험료를 납부하여 위험에 대비하는 제도", "민간 보험만", "투자 상품"], answer: 1, explanation: "사회보험은 국가가 운영하고 국민이 보험료를 납부하여 질병, 노령 등 위험에 대비하는 제도입니다." },
        { q: "'공공부조'란?", options: ["부자 지원", "생활이 어려운 국민에게 국가가 최저 생활을 보장하는 제도", "기업 지원", "세금 감면"], answer: 1, explanation: "공공부조는 생활이 어려운 국민에게 국가가 최저 생활을 보장하는 제도입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "복지가 사회 통합에 기여하는 이유는?", options: ["기여하지 않음", "사회적 안전망이 갈등을 줄이고 연대를 강화해서", "갈등만 증가", "분열만 초래"], answer: 1, explanation: "복지는 사회적 안전망을 제공하여 갈등을 줄이고 사회 연대를 강화합니다." },
        { q: "고령화 사회에서 복지의 중요성이 커지는 이유는?", options: ["관계없음", "노인 인구 증가로 돌봄과 연금 등의 필요가 커져서", "젊은 층만 중요", "복지 축소 필요"], answer: 1, explanation: "고령화로 노인 인구가 증가하면서 돌봄, 연금 등 복지 수요가 커집니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "복지에 대한 바람직한 인식은?", options: ["시혜가 아닌 권리로 인식", "부끄러운 것", "특정 계층만의 것", "경제 성장과 무관"], answer: 0, explanation: "복지는 시혜가 아니라 국민의 권리로 인식해야 합니다." },
        { q: "복지 정책에서 균형이 필요한 이유는?", options: ["균형 불필요", "재정 건전성과 복지 확대 사이의 조화가 필요해서", "복지만 중요", "경제만 중요"], answer: 1, explanation: "복지 정책은 재정 건전성과 복지 확대 사이의 균형이 필요합니다." }
      ]
    }
  },

  // soc_19: 지속가능한 삶, 환경과 경제의 균형
  soc_19: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "지속가능한 발전이란?", options: ["경제 성장만 추구", "환경을 보전하면서 현재와 미래 세대의 필요를 충족하는 발전", "환경만 보호", "개발 중단"], answer: 1, explanation: "지속가능한 발전은 환경을 보전하면서 현재와 미래 세대의 필요를 충족하는 발전입니다." },
        { q: "환경 문제와 경제 발전의 관계로 알맞은 것은?", options: ["관계없음", "상충될 수 있지만 균형을 찾아야 함", "항상 대립", "경제만 중요"], answer: 1, explanation: "환경과 경제는 상충될 수 있지만 균형을 찾아 지속가능한 발전을 추구해야 합니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "지속가능발전목표(SDGs)의 특징으로 알맞은 것은?", options: ["환경만 다룸", "경제, 사회, 환경을 통합적으로 다룸", "선진국만 대상", "단기 목표"], answer: 1, explanation: "SDGs는 경제, 사회, 환경을 통합적으로 다루는 17개 목표입니다." },
        { q: "순환 경제의 특징은?", options: ["자원 낭비", "자원의 재사용과 재활용을 통해 폐기물을 최소화", "일회용 중심", "대량 생산만"], answer: 1, explanation: "순환 경제는 자원의 재사용과 재활용을 통해 폐기물을 최소화하는 경제 모델입니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'ESG'란?", options: ["경제 성장만", "환경(E), 사회(S), 지배구조(G)를 고려한 경영", "기술 개발", "마케팅 전략"], answer: 1, explanation: "ESG는 환경, 사회, 지배구조를 고려한 지속가능 경영을 말합니다." },
        { q: "'그린워싱'이란?", options: ["환경 보호", "실제로는 환경에 해로우면서 친환경인 척하는 것", "녹색 세탁", "에너지 절약"], answer: 1, explanation: "그린워싱은 실제로는 환경에 해로우면서 친환경인 척 홍보하는 것입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "소비자가 지속가능한 소비를 해야 하는 이유는?", options: ["필요 없음", "소비 선택이 기업과 사회의 변화를 이끌 수 있어서", "가격만 중요", "편리함만 추구"], answer: 1, explanation: "소비자의 선택이 기업과 사회의 지속가능한 변화를 이끌 수 있습니다." },
        { q: "환경과 경제의 균형을 위해 필요한 것은?", options: ["한쪽만 선택", "장기적 관점과 다양한 이해관계자의 협력", "단기 이익 추구", "환경 무시"], answer: 1, explanation: "환경과 경제의 균형을 위해 장기적 관점과 협력이 필요합니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "기업의 친환경 주장을 대할 때 필요한 자세는?", options: ["무조건 신뢰", "그린워싱 여부를 비판적으로 확인", "무조건 불신", "무관심"], answer: 1, explanation: "기업의 친환경 주장은 그린워싱 여부를 비판적으로 확인해야 합니다." },
        { q: "개인의 실천과 사회 구조 변화 중 더 중요한 것은?", options: ["개인만 중요", "사회만 중요", "둘 다 중요하며 함께 필요", "둘 다 불필요"], answer: 2, explanation: "지속가능한 사회를 위해 개인의 실천과 사회 구조 변화가 함께 필요합니다." }
      ]
    }
  },

  // soc_20: 미래 사회, 우리가 만들어갈 세상
  soc_20: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "미래 사회의 특징으로 언급된 것은?", options: ["변화 없음", "기술 발전, 인구 변화, 환경 문제 등 다양한 변화", "과거로 회귀", "정체"], answer: 1, explanation: "미래 사회는 기술 발전, 인구 변화, 환경 문제 등 다양한 변화가 예상됩니다." },
        { q: "미래 사회에서 시민의 역할로 알맞은 것은?", options: ["수동적 관찰자", "사회 문제에 관심을 갖고 참여하는 적극적 주체", "무관심", "방관"], answer: 1, explanation: "미래 사회에서 시민은 사회 문제에 관심을 갖고 참여하는 적극적 주체가 되어야 합니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "미래 사회 변화의 원동력으로 언급된 것은?", options: ["과거 관습", "기술 혁신, 가치관 변화, 시민 참여", "변화 거부", "고립"], answer: 1, explanation: "미래 사회 변화의 원동력은 기술 혁신, 가치관 변화, 시민 참여 등입니다." },
        { q: "민주 시민으로서 갖춰야 할 역량은?", options: ["무관심", "비판적 사고, 참여 의식, 협력 능력", "순종만", "경쟁만"], answer: 1, explanation: "민주 시민으로서 비판적 사고, 참여 의식, 협력 능력이 필요합니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'민주 시민'이란?", options: ["투표만 하는 사람", "민주주의 원리에 따라 권리를 행사하고 의무를 다하는 시민", "정치에 무관심한 사람", "법만 지키는 사람"], answer: 1, explanation: "민주 시민은 민주주의 원리에 따라 권리를 행사하고 의무를 다하는 시민입니다." },
        { q: "'시민 의식'이란?", options: ["이기적 태도", "공동체의 규칙을 지키고 다른 사람의 권리를 존중하는 마음", "무관심", "개인주의만"], answer: 1, explanation: "시민 의식은 공동체의 규칙을 지키고 다른 사람의 권리를 존중하는 마음입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "청소년이 미래 사회를 준비하기 위해 필요한 것은?", options: ["공부만 하기", "다양한 문제에 관심을 갖고 참여 경험 쌓기", "무관심", "어른이 될 때까지 대기"], answer: 1, explanation: "청소년은 다양한 문제에 관심을 갖고 참여 경험을 쌓아 미래를 준비할 수 있습니다." },
        { q: "오늘의 작은 관심이 내일의 큰 변화를 만드는 이유는?", options: ["관계없음", "작은 참여가 모여 사회 변화를 이끌기 때문", "개인은 무력", "변화 불가능"], answer: 1, explanation: "작은 참여가 모여 큰 사회 변화를 이끌 수 있습니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "미래 사회에 대한 바람직한 자세는?", options: ["두려움만", "변화를 기회로 삼고 적극적으로 대비하는 자세", "회피", "무관심"], answer: 1, explanation: "미래 사회의 변화를 기회로 삼고 적극적으로 대비하는 자세가 바람직합니다." },
        { q: "더 나은 미래 사회를 위해 가장 중요한 것은?", options: ["기술만 발전", "물질적 풍요만", "시민들의 관심과 참여, 연대", "경쟁만 강조"], answer: 2, explanation: "더 나은 미래 사회를 위해 시민들의 관심과 참여, 연대가 가장 중요합니다." }
      ]
    }
  }
};

// 보완학습 함수 템플릿
const REMEDIAL_FUNCTIONS = `
    /* ======= 보완학습 함수 ======= */
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
        const data = window.REMEDIAL_BANK[key];
        if (!data) return;
        html += \`<div style="margin-bottom:16px;">
          <h4 style="margin:4px 0 6px; color:#8b2f2f;">\${data.title}</h4>
          <ol style="padding-left:18px;">\`;
        (data.problems || []).forEach((p, idx) => {
          html += \`<li style="margin-bottom:6px;">\${p.q}<br>\`;
          p.options.forEach((opt, optIdx) => {
            html += \`<label style="display:block;font-weight:normal;"><input type="radio" name="\${key}-q\${idx}" value="\${optIdx}"> \${["①","②","③","④"][optIdx]} \${opt}</label>\`;
          });
          html += \`</li>\`;
        });
        html += \`</ol></div>\`;
      });

      body.innerHTML = html;
      panel.style.display = 'flex';
    }

    // 보완학습 채점/리셋
    function gradeRemedial() {
      const body = document.getElementById('remedial-panel-body');
      if (!body) return;
      for (const key in window.REMEDIAL_BANK) {
        const data = window.REMEDIAL_BANK[key];
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
          if (selected === p.answer) {
            li.insertAdjacentHTML('beforeend', '<div class="remed-result" style="margin-top:3px; color:#157347; font-size:12px;">정답입니다 ✅ <span style="color:#555;">| ' + (p.explanation || '') + '</span></div>');
          } else {
            const correctText = p.options[p.answer];
            li.insertAdjacentHTML('beforeend', \`<div class="remed-result" style="margin-top:3px; color:#b3261e; font-size:12px;">틀렸어요 ❌ 정답: \${correctText} <span style="color:#555;">| \${p.explanation || ''}</span></div>\`);
          }
        });
      }
    }
    function resetRemedial() {
      const body = document.getElementById('remedial-panel-body');
      if (!body) return;
      body.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
      body.querySelectorAll('.remed-result').forEach(el => el.remove());
    }
`;

for (let i = 11; i <= 20; i++) {
  const num = String(i).padStart(2, '0');
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'social', `soc_${num}.html`);
  const unitKey = `soc_${i}`;

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const remedialData = REMEDIAL_DATA[unitKey];

  if (!remedialData) {
    console.log(`[SKIP] soc_${num} REMEDIAL_DATA 없음`);
    continue;
  }

  // 이미 REMEDIAL_BANK가 있는지 확인
  if (content.includes('window.REMEDIAL_BANK') || content.includes('const REMEDIAL_BANK')) {
    console.log(`[SKIP] soc_${num} 이미 REMEDIAL_BANK 있음`);
    continue;
  }

  // REMEDIAL_BANK 스크립트 생성
  const remedialScript = `
  <!-- ✅ 단원 인식 (HTML에서 먼저 설정) -->
  <script>
  window.REMEDIAL_BANK = ${JSON.stringify(remedialData, null, 2)};
${REMEDIAL_FUNCTIONS}
  </script>

`;

  // <link rel="icon" 다음에 삽입
  const insertPoint = content.indexOf('<link rel="icon"');
  if (insertPoint === -1) {
    console.log(`[FAIL] soc_${num} <link rel="icon"> 못 찾음`);
    continue;
  }

  // 해당 줄의 끝을 찾아서 그 다음에 삽입
  const lineEnd = content.indexOf('>', insertPoint) + 1;
  content = content.slice(0, lineEnd) + '\n' + remedialScript + content.slice(lineEnd);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`[OK] soc_${num} REMEDIAL_BANK 및 함수 추가 완료`);
}

console.log('\n✅ soc_11~20 보완학습 기능 추가 완료!');

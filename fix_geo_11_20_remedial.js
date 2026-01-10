const fs = require('fs');
const path = require('path');

// geo_11~20 REMEDIAL_BANK 데이터
const REMEDIAL_DATA = {
  // geo_11: 도시는 왜 커질까? 도시화의 빛과 그림자
  geo_11: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "도시화란?", options: ["농촌 인구 증가", "도시에 인구와 산업이 집중되는 현상", "도시 인구 감소", "자연환경 보존"], answer: 1, explanation: "도시화는 도시에 인구와 산업이 집중되는 현상입니다." },
        { q: "도시화의 원인으로 알맞은 것은?", options: ["농업 발전", "일자리, 교육, 문화 시설의 집중", "인구 감소", "자연재해"], answer: 1, explanation: "도시에는 일자리, 교육, 문화 시설이 집중되어 있어 사람들이 모여듭니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "도시화의 긍정적 측면은?", options: ["교통 혼잡", "편리한 생활과 다양한 기회 제공", "환경 오염", "주거 문제"], answer: 1, explanation: "도시화는 편리한 생활과 다양한 기회를 제공합니다." },
        { q: "도시화의 부정적 측면이 아닌 것은?", options: ["교통 혼잡", "환경 오염", "문화 시설 증가", "주거비 상승"], answer: 2, explanation: "문화 시설 증가는 도시화의 긍정적 측면입니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'과밀화'란?", options: ["인구가 적은 상태", "한 지역에 인구나 시설이 지나치게 집중된 상태", "균형 발전", "인구 분산"], answer: 1, explanation: "과밀화는 한 지역에 인구나 시설이 지나치게 집중된 상태입니다." },
        { q: "'슬럼'이란?", options: ["고급 주거 지역", "도시 내 낙후되고 열악한 주거 지역", "공원", "상업 지역"], answer: 1, explanation: "슬럼은 도시 내 낙후되고 열악한 주거 지역입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "도시화가 계속되면 농촌에는 어떤 문제가 생길까요?", options: ["인구 증가", "인구 감소와 고령화, 지역 공동화", "경제 성장", "환경 개선"], answer: 1, explanation: "도시화가 계속되면 농촌은 인구 감소, 고령화, 지역 공동화 문제를 겪습니다." },
        { q: "도시 문제를 해결하기 위한 방법은?", options: ["더 많은 인구 유입", "대중교통 확충, 녹지 조성, 주거 정책 개선", "방치", "농촌 이주 금지"], answer: 1, explanation: "대중교통 확충, 녹지 조성, 주거 정책 개선 등이 도시 문제 해결 방법입니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "지속가능한 도시 발전을 위해 필요한 것은?", options: ["무분별한 개발", "환경과 삶의 질을 고려한 균형 있는 발전", "인구 집중 가속화", "녹지 감소"], answer: 1, explanation: "지속가능한 발전을 위해 환경과 삶의 질을 고려한 균형이 필요합니다." },
        { q: "도시와 농촌의 상생을 위해 필요한 자세는?", options: ["도시만 발전", "농촌만 지원", "상호 교류와 균형 발전 추구", "경쟁만 강조"], answer: 2, explanation: "도시와 농촌의 상호 교류와 균형 발전이 필요합니다." }
      ]
    }
  },

  // geo_12: 인구 이동, 사람들은 왜 움직일까?
  geo_12: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "인구 이동이란?", options: ["인구가 변하지 않는 것", "사람들이 거주지를 옮기는 것", "출생률 증가", "사망률 감소"], answer: 1, explanation: "인구 이동은 사람들이 거주지를 옮기는 것입니다." },
        { q: "인구 이동의 원인으로 알맞지 않은 것은?", options: ["일자리", "교육", "기후", "혈액형"], answer: 3, explanation: "일자리, 교육, 기후 등이 인구 이동의 원인이며 혈액형은 관련이 없습니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "인구 유입 지역의 특징은?", options: ["일자리 부족", "일자리와 편의 시설이 풍부", "자연재해 빈번", "기후 불량"], answer: 1, explanation: "인구 유입 지역은 일자리와 편의 시설이 풍부합니다." },
        { q: "인구 유출 지역에서 나타나는 현상은?", options: ["인구 증가", "경제 활성화", "인구 감소와 지역 쇠퇴", "교통 혼잡"], answer: 2, explanation: "인구 유출 지역은 인구 감소와 지역 쇠퇴가 나타납니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'이촌향도'란?", options: ["도시에서 농촌으로 이동", "농촌에서 도시로 이동하는 현상", "외국 이민", "국내 여행"], answer: 1, explanation: "이촌향도는 농촌(촌)을 떠나 도시(도)로 이동하는 현상입니다." },
        { q: "'인구 유출'이란?", options: ["인구가 들어오는 것", "인구가 빠져나가는 것", "출생률 증가", "사망률 감소"], answer: 1, explanation: "인구 유출은 인구가 한 지역에서 빠져나가는 것입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "저출산·고령화 시대에 인구 이동이 중요한 이유는?", options: ["중요하지 않음", "지역 간 인구 불균형이 심화되어 국토 균형 발전에 영향", "인구가 많아서", "출생률이 높아서"], answer: 1, explanation: "저출산·고령화로 지역 간 인구 불균형이 심화되어 국토 균형 발전이 중요합니다." },
        { q: "외국인 노동자 유입이 우리 사회에 미치는 영향은?", options: ["영향 없음", "노동력 보충과 문화 다양성 증가", "부정적 영향만", "경제 침체"], answer: 1, explanation: "외국인 노동자는 노동력을 보충하고 문화 다양성을 증가시킵니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "인구 감소 지역 활성화를 위한 정책으로 알맞은 것은?", options: ["방치", "일자리 창출, 정주 여건 개선, 귀농귀촌 지원", "인구 유출 가속화", "지역 폐쇄"], answer: 1, explanation: "일자리 창출, 정주 여건 개선, 귀농귀촌 지원 등이 필요합니다." },
        { q: "다문화 사회에서 필요한 자세는?", options: ["차별", "다양성 존중과 상호 이해", "배타적 태도", "무관심"], answer: 1, explanation: "다문화 사회에서는 다양성 존중과 상호 이해가 필요합니다." }
      ]
    }
  },

  // geo_13: 세계는 하나로, 교통과 통신의 발달
  geo_13: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "교통 발달이 가져온 변화로 알맞은 것은?", options: ["이동 시간 증가", "이동 시간 단축과 활동 범위 확대", "고립 심화", "교류 감소"], answer: 1, explanation: "교통 발달로 이동 시간이 단축되고 활동 범위가 확대되었습니다." },
        { q: "통신 발달의 예로 알맞은 것은?", options: ["자동차", "인터넷, 스마트폰", "비행기", "선박"], answer: 1, explanation: "인터넷, 스마트폰 등이 통신 발달의 예입니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "교통·통신 발달이 세계화에 미친 영향은?", options: ["세계화 저해", "국가 간 교류 증가와 세계화 촉진", "고립 심화", "교역 감소"], answer: 1, explanation: "교통·통신 발달은 국가 간 교류를 증가시켜 세계화를 촉진했습니다." },
        { q: "교통 수단별 특징으로 알맞지 않은 것은?", options: ["항공: 빠르지만 비용 높음", "해운: 대량 수송에 유리", "철도: 정시성 높음", "자동차: 해상 운송에 적합"], answer: 3, explanation: "자동차는 육상 운송에 적합하며 해상 운송은 선박의 특징입니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'시공간 압축'이란?", options: ["시간과 공간이 늘어남", "교통·통신 발달로 시간과 거리의 제약이 줄어드는 현상", "시간 증가", "공간 확대"], answer: 1, explanation: "시공간 압축은 교통·통신 발달로 시간과 거리의 제약이 줄어드는 현상입니다." },
        { q: "'물류'란?", options: ["물을 흘려보내는 것", "상품의 이동과 보관 등 유통 활동", "정보 전달", "여객 운송"], answer: 1, explanation: "물류는 상품의 이동, 보관, 포장 등 유통 활동입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "교통·통신 발달로 변화한 생활 모습은?", options: ["변화 없음", "온라인 쇼핑, 재택근무, 화상 회의 등", "오프라인만 이용", "편지만 사용"], answer: 1, explanation: "온라인 쇼핑, 재택근무, 화상 회의 등이 가능해졌습니다." },
        { q: "교통 발달이 관광 산업에 미치는 영향은?", options: ["영향 없음", "해외여행 증가와 관광 산업 성장", "관광 감소", "국내 여행만 가능"], answer: 1, explanation: "교통 발달로 해외여행이 증가하고 관광 산업이 성장했습니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "교통 발달의 부작용으로 알맞은 것은?", options: ["부작용 없음", "환경 오염, 교통 혼잡, 에너지 소비 증가", "환경 개선", "에너지 절약"], answer: 1, explanation: "교통 발달의 부작용으로 환경 오염, 교통 혼잡 등이 있습니다." },
        { q: "지속가능한 교통 체계를 위해 필요한 것은?", options: ["자가용만 사용", "대중교통 활성화, 친환경 교통수단 개발", "도로만 확충", "항공만 이용"], answer: 1, explanation: "대중교통 활성화와 친환경 교통수단 개발이 필요합니다." }
      ]
    }
  },

  // geo_14: 지도 속 보물찾기, 지리 정보 기술
  geo_14: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "GIS란?", options: ["게임 시스템", "지리 정보 시스템(Geographic Information System)", "글로벌 인터넷 서비스", "일반 정보 시스템"], answer: 1, explanation: "GIS는 지리 정보 시스템(Geographic Information System)입니다." },
        { q: "GPS의 기능으로 알맞은 것은?", options: ["음악 재생", "위성을 이용한 위치 측정", "사진 촬영", "문서 작성"], answer: 1, explanation: "GPS는 위성을 이용해 정확한 위치를 측정합니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "지리 정보 기술의 활용 분야가 아닌 것은?", options: ["내비게이션", "재난 관리", "도시 계획", "요리 레시피"], answer: 3, explanation: "지리 정보 기술은 내비게이션, 재난 관리, 도시 계획 등에 활용됩니다." },
        { q: "원격 탐사의 특징으로 알맞은 것은?", options: ["직접 방문 필수", "인공위성이나 항공기로 먼 거리에서 정보 수집", "근거리만 탐사", "사람이 직접 측정"], answer: 1, explanation: "원격 탐사는 인공위성이나 항공기로 먼 거리에서 정보를 수집합니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'원격 탐사'란?", options: ["가까이서 조사", "멀리서 센서를 이용해 지표 정보를 수집하는 기술", "직접 측량", "설문 조사"], answer: 1, explanation: "원격 탐사는 멀리서 센서를 이용해 지표 정보를 수집하는 기술입니다." },
        { q: "'빅데이터'란?", options: ["작은 데이터", "방대한 양의 데이터를 분석하여 가치를 창출하는 기술", "단순 저장", "삭제된 데이터"], answer: 1, explanation: "빅데이터는 방대한 양의 데이터를 분석하여 가치를 창출하는 기술입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "지리 정보 기술이 일상생활에 미치는 영향은?", options: ["영향 없음", "길 찾기, 배달 서비스, 부동산 정보 등 편의 증가", "불편함 증가", "정보 감소"], answer: 1, explanation: "지리 정보 기술로 길 찾기, 배달, 부동산 정보 등 편의가 증가했습니다." },
        { q: "재난 발생 시 GIS가 활용되는 방법은?", options: ["활용 불가", "피해 지역 파악, 대피 경로 안내, 구조 활동 지원", "음악 재생", "게임 제공"], answer: 1, explanation: "GIS는 재난 시 피해 지역 파악, 대피 경로 안내 등에 활용됩니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "지리 정보 기술 활용 시 주의해야 할 점은?", options: ["주의 불필요", "개인 정보 보호와 프라이버시 침해 우려", "무제한 사용", "정보 공개 의무"], answer: 1, explanation: "지리 정보 기술 사용 시 개인 정보 보호와 프라이버시에 주의해야 합니다." },
        { q: "지리 정보 기술의 미래 전망으로 알맞은 것은?", options: ["사라질 것", "자율주행, 스마트시티 등 더욱 확대될 것", "변화 없음", "축소될 것"], answer: 1, explanation: "지리 정보 기술은 자율주행, 스마트시티 등으로 더욱 확대될 전망입니다." }
      ]
    }
  },

  // geo_15: 자원은 어디에? 에너지와 자원의 분포
  geo_15: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "자원의 특성으로 알맞은 것은?", options: ["무한함", "유한하고 지역적으로 편재됨", "어디에나 균등 분포", "재생 불가능만"], answer: 1, explanation: "자원은 유한하고 지역적으로 편재(편중)되어 있습니다." },
        { q: "화석 연료에 해당하는 것은?", options: ["태양광", "석유, 석탄, 천연가스", "풍력", "수력"], answer: 1, explanation: "화석 연료에는 석유, 석탄, 천연가스가 있습니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "자원의 분류로 알맞지 않은 것은?", options: ["에너지 자원", "광물 자원", "생물 자원", "감정 자원"], answer: 3, explanation: "자원은 에너지 자원, 광물 자원, 생물 자원 등으로 분류됩니다." },
        { q: "자원 부존량이 풍부한 지역의 특징은?", options: ["가난함", "자원 수출국으로 경제력 보유 가능", "자원 수입 필수", "산업 불가능"], answer: 1, explanation: "자원 부존량이 풍부하면 자원 수출국으로 경제력을 가질 수 있습니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'편재'란?", options: ["균등 분포", "한쪽으로 치우쳐 있음", "없음", "풍부함"], answer: 1, explanation: "편재는 한쪽으로 치우쳐 분포하는 것을 의미합니다." },
        { q: "'매장량'이란?", options: ["사용한 양", "땅속에 묻혀 있는 자원의 양", "수출한 양", "수입한 양"], answer: 1, explanation: "매장량은 땅속에 묻혀 있는 자원의 양입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "자원이 편재되어 있어 생기는 문제는?", options: ["문제없음", "자원을 둘러싼 국가 간 갈등과 자원 민족주의", "평화 증진", "협력 강화만"], answer: 1, explanation: "자원 편재로 국가 간 갈등과 자원 민족주의가 발생할 수 있습니다." },
        { q: "우리나라가 에너지 자원 대부분을 수입하는 이유는?", options: ["수입이 싸서", "국내 자원 부존량이 적기 때문", "수출이 어려워서", "기술 부족"], answer: 1, explanation: "우리나라는 국내 자원 부존량이 적어 대부분 수입합니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "자원 안보를 위해 필요한 것은?", options: ["한 국가 의존", "수입선 다변화, 비축, 대체 에너지 개발", "자원 낭비", "수입 중단"], answer: 1, explanation: "자원 안보를 위해 수입선 다변화, 비축, 대체 에너지 개발이 필요합니다." },
        { q: "자원 개발과 환경 보전의 관계에서 중요한 것은?", options: ["개발만 중시", "환경만 중시", "균형 있는 개발과 지속가능성 고려", "방치"], answer: 2, explanation: "자원 개발 시 환경 보전과의 균형과 지속가능성을 고려해야 합니다." }
      ]
    }
  },

  // geo_16: 석유가 사라진다면? 에너지의 미래
  geo_16: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "화석 연료의 문제점으로 알맞은 것은?", options: ["무한함", "고갈 가능성과 환경 오염", "깨끗함", "재생 가능"], answer: 1, explanation: "화석 연료는 고갈 가능성이 있고 환경 오염을 유발합니다." },
        { q: "신재생 에너지에 해당하는 것은?", options: ["석유", "태양광, 풍력, 수력", "석탄", "천연가스"], answer: 1, explanation: "태양광, 풍력, 수력 등이 신재생 에너지입니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "에너지 전환이 필요한 이유는?", options: ["필요 없음", "화석 연료 고갈과 기후변화 대응을 위해", "비용 절감만", "기술 발전만"], answer: 1, explanation: "화석 연료 고갈과 기후변화 대응을 위해 에너지 전환이 필요합니다." },
        { q: "신재생 에너지의 특징으로 알맞은 것은?", options: ["고갈됨", "환경 친화적이고 재생 가능", "환경 오염 심함", "유한함"], answer: 1, explanation: "신재생 에너지는 환경 친화적이고 재생 가능합니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'탄소 중립'이란?", options: ["탄소 배출 증가", "탄소 배출량과 흡수량을 같게 하여 순배출을 0으로 만드는 것", "탄소 무시", "탄소 저장만"], answer: 1, explanation: "탄소 중립은 탄소 배출량과 흡수량을 같게 하여 순배출을 0으로 만드는 것입니다." },
        { q: "'에너지 믹스'란?", options: ["에너지 혼합 음료", "다양한 에너지원을 조합하여 사용하는 것", "단일 에너지 사용", "에너지 폐기"], answer: 1, explanation: "에너지 믹스는 다양한 에너지원을 조합하여 사용하는 것입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "신재생 에너지 확대가 어려운 이유는?", options: ["어려움 없음", "초기 투자 비용, 기술 한계, 지역적 조건", "환경 오염", "자원 풍부"], answer: 1, explanation: "초기 투자 비용, 기술 한계, 지역적 조건 등이 신재생 에너지 확대의 어려움입니다." },
        { q: "에너지 절약이 중요한 이유는?", options: ["중요하지 않음", "자원 보존과 환경 보호, 비용 절감", "에너지 풍부해서", "절약 불가능"], answer: 1, explanation: "에너지 절약은 자원 보존, 환경 보호, 비용 절감에 중요합니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "원자력 에너지에 대한 균형 잡힌 시각은?", options: ["무조건 찬성", "무조건 반대", "발전 효율과 안전성, 폐기물 문제를 종합적으로 고려", "무관심"], answer: 2, explanation: "원자력은 발전 효율과 안전성, 폐기물 문제를 종합적으로 고려해야 합니다." },
        { q: "미래 에너지 사회를 위해 개인이 할 수 있는 일은?", options: ["할 일 없음", "에너지 절약, 친환경 제품 사용, 관심과 참여", "에너지 낭비", "무관심"], answer: 1, explanation: "에너지 절약, 친환경 제품 사용, 관심과 참여가 필요합니다." }
      ]
    }
  },

  // geo_17: 바다는 무한한 보물창고일까?
  geo_17: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "바다가 인간에게 주는 혜택이 아닌 것은?", options: ["식량 자원", "해상 교통로", "기후 조절", "사막화"], answer: 3, explanation: "바다는 식량 자원, 해상 교통로, 기후 조절 등의 혜택을 줍니다." },
        { q: "해양 자원의 예로 알맞은 것은?", options: ["석유 시추", "수산물, 해저 광물, 해양 에너지", "산림 자원", "토양"], answer: 1, explanation: "해양 자원에는 수산물, 해저 광물, 해양 에너지 등이 있습니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "해양 오염의 원인으로 알맞지 않은 것은?", options: ["플라스틱 쓰레기", "기름 유출", "생활 하수", "해양 생물 보호"], answer: 3, explanation: "플라스틱, 기름 유출, 생활 하수 등이 해양 오염의 원인입니다." },
        { q: "배타적 경제수역(EEZ)이란?", options: ["누구나 이용 가능", "연안국이 자원 개발 권리를 갖는 200해리 수역", "영토와 같음", "공해"], answer: 1, explanation: "EEZ는 연안국이 자원 개발 권리를 갖는 200해리 이내 수역입니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'지속가능한 어업'이란?", options: ["무한 포획", "미래 세대도 이용할 수 있도록 자원을 관리하며 하는 어업", "남획", "멸종 유도"], answer: 1, explanation: "지속가능한 어업은 미래 세대도 이용할 수 있도록 자원을 관리하는 어업입니다." },
        { q: "'해양 생태계'란?", options: ["육지 생태계", "바다에서 생물과 환경이 상호작용하는 시스템", "사막 생태계", "도시 생태계"], answer: 1, explanation: "해양 생태계는 바다에서 생물과 환경이 상호작용하는 시스템입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "해양 오염이 인간에게 미치는 영향은?", options: ["영향 없음", "먹이사슬을 통한 건강 위협, 수산 자원 감소", "건강 개선", "자원 증가"], answer: 1, explanation: "해양 오염은 먹이사슬을 통해 인간 건강을 위협하고 수산 자원을 감소시킵니다." },
        { q: "해양 영토 분쟁이 발생하는 이유는?", options: ["이유 없음", "해양 자원과 전략적 가치 때문", "바다가 넓어서", "관심 없어서"], answer: 1, explanation: "해양 영토 분쟁은 해양 자원과 전략적 가치 때문에 발생합니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "바다를 '무한한 보물창고'라고만 보면 안 되는 이유는?", options: ["무한하므로 괜찮음", "남용하면 고갈되고 오염되어 지속가능하지 않음", "보물이 아니라서", "가치가 없어서"], answer: 1, explanation: "바다 자원도 남용하면 고갈되고 오염되어 지속가능하지 않습니다." },
        { q: "해양 보전을 위해 국제 협력이 필요한 이유는?", options: ["필요 없음", "바다는 국경이 없이 연결되어 있어 한 나라만으로 해결 불가", "각자 해결 가능", "협력이 어려움"], answer: 1, explanation: "바다는 국경 없이 연결되어 있어 국제 협력이 필요합니다." }
      ]
    }
  },

  // geo_18: 땅이 흔들리고 하늘이 무너질 때
  geo_18: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "자연재해의 예로 알맞지 않은 것은?", options: ["지진", "태풍", "홍수", "교통사고"], answer: 3, explanation: "지진, 태풍, 홍수는 자연재해이고, 교통사고는 인위적 재해입니다." },
        { q: "지진이 발생하는 원인은?", options: ["비가 많이 와서", "지각판의 이동과 충돌", "바람이 강해서", "기온 상승"], answer: 1, explanation: "지진은 지각판의 이동과 충돌로 발생합니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "자연재해 피해를 줄이기 위한 대비가 아닌 것은?", options: ["재난 대피 훈련", "내진 설계", "기상 예보", "재해 방치"], answer: 3, explanation: "재난 대피 훈련, 내진 설계, 기상 예보 등이 피해를 줄이는 대비입니다." },
        { q: "기후변화로 증가하는 자연재해는?", options: ["감소함", "폭염, 홍수, 가뭄 등 극단적 기상 현상", "지진", "화산 폭발"], answer: 1, explanation: "기후변화로 폭염, 홍수, 가뭄 등 극단적 기상 현상이 증가합니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'내진 설계'란?", options: ["건물을 예쁘게 짓는 것", "지진에 견딜 수 있도록 건물을 설계하는 것", "건물을 높이 짓는 것", "건물을 빨리 짓는 것"], answer: 1, explanation: "내진 설계는 지진에 견딜 수 있도록 건물을 설계하는 것입니다." },
        { q: "'재난 대응'이란?", options: ["재난 무시", "재난 발생 시 피해를 최소화하기 위한 대처 활동", "재난 유발", "재난 확대"], answer: 1, explanation: "재난 대응은 재난 발생 시 피해를 최소화하기 위한 대처 활동입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "같은 규모의 자연재해에서 피해 차이가 나는 이유는?", options: ["우연", "대비 수준, 인프라, 대응 체계의 차이", "자연재해의 성격", "지역 크기만"], answer: 1, explanation: "대비 수준, 인프라, 대응 체계의 차이로 피해가 달라집니다." },
        { q: "자연재해 발생 시 개인이 해야 할 행동은?", options: ["패닉", "대피 요령 숙지, 정확한 정보 확인, 침착한 대응", "방관", "무관심"], answer: 1, explanation: "대피 요령 숙지, 정확한 정보 확인, 침착한 대응이 필요합니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "자연재해 대비에서 정부와 개인의 역할은?", options: ["정부만 책임", "개인만 책임", "정부의 제도적 대비와 개인의 인식·훈련이 모두 필요", "책임 없음"], answer: 2, explanation: "정부의 제도적 대비와 개인의 인식·훈련이 모두 필요합니다." },
        { q: "기후변화와 자연재해의 관계에서 중요한 것은?", options: ["관계없음", "기후변화 대응이 자연재해 피해 감소와 연결됨을 인식", "자연재해만 대비", "기후변화 무시"], answer: 1, explanation: "기후변화 대응이 자연재해 피해 감소와 연결됨을 인식해야 합니다." }
      ]
    }
  },

  // geo_19: 전 세계가 이웃이 된 시대, 세계화
  geo_19: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "세계화란?", options: ["국가 간 단절", "국가 간 경제·문화·정치적 교류가 증가하는 현상", "쇄국 정책", "고립주의"], answer: 1, explanation: "세계화는 국가 간 경제·문화·정치적 교류가 증가하는 현상입니다." },
        { q: "세계화를 촉진한 요인으로 알맞은 것은?", options: ["국경 폐쇄", "교통·통신의 발달, 무역 장벽 완화", "전쟁", "고립"], answer: 1, explanation: "교통·통신의 발달, 무역 장벽 완화 등이 세계화를 촉진했습니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "세계화의 긍정적 측면은?", options: ["갈등만 증가", "문화 교류, 경제 성장, 기술 발전", "빈부 격차만 확대", "환경 파괴만"], answer: 1, explanation: "세계화는 문화 교류, 경제 성장, 기술 발전 등의 긍정적 측면이 있습니다." },
        { q: "세계화의 부정적 측면으로 알맞은 것은?", options: ["없음", "빈부 격차 확대, 문화 획일화, 환경 문제", "모두 긍정적", "갈등 감소"], answer: 1, explanation: "세계화의 부정적 측면으로 빈부 격차, 문화 획일화 등이 있습니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'다국적 기업'이란?", options: ["한 나라에서만 활동", "여러 나라에 걸쳐 생산·판매 활동을 하는 기업", "소규모 가게", "정부 기관"], answer: 1, explanation: "다국적 기업은 여러 나라에 걸쳐 생산·판매 활동을 하는 기업입니다." },
        { q: "'문화 획일화'란?", options: ["문화 다양화", "전 세계 문화가 비슷해지는 현상", "문화 보존", "전통 강화"], answer: 1, explanation: "문화 획일화는 세계화로 전 세계 문화가 비슷해지는 현상입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "세계화 시대에 영어가 중요해진 이유는?", options: ["관계없음", "국제 공용어로 소통과 교류에 필수적이므로", "영어만 사용", "다른 언어 소멸"], answer: 1, explanation: "영어는 국제 공용어로 세계화 시대 소통과 교류에 중요합니다." },
        { q: "세계화로 한국 문화(한류)가 확산된 이유는?", options: ["우연", "미디어·인터넷 발달과 문화 콘텐츠의 경쟁력", "정부 강요", "다른 문화 부재"], answer: 1, explanation: "미디어·인터넷 발달과 한국 문화 콘텐츠의 경쟁력 덕분입니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "세계화 시대에 필요한 자세는?", options: ["자국만 중시", "개방적 자세와 자국 문화 정체성 보존의 균형", "무조건 수용", "완전 고립"], answer: 1, explanation: "개방적 자세와 자국 문화 정체성 보존의 균형이 필요합니다." },
        { q: "세계화의 혜택이 공평하게 분배되려면 필요한 것은?", options: ["필요 없음", "국제 협력과 공정한 무역 규칙", "강대국 독점", "약소국 배제"], answer: 1, explanation: "국제 협력과 공정한 무역 규칙으로 혜택의 공평한 분배가 가능합니다." }
      ]
    }
  },

  // geo_20: 100년 후에도 살 수 있을까? 지구의 미래
  geo_20: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "지구가 직면한 환경 문제가 아닌 것은?", options: ["기후변화", "자원 고갈", "환경 오염", "인구 균형"], answer: 3, explanation: "기후변화, 자원 고갈, 환경 오염이 지구가 직면한 환경 문제입니다." },
        { q: "지속가능한 발전의 의미는?", options: ["현재만 고려", "미래 세대의 필요를 해치지 않으면서 현재 세대의 필요를 충족", "환경 무시", "개발만 중시"], answer: 1, explanation: "지속가능한 발전은 미래 세대를 고려하며 현재의 필요를 충족하는 것입니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "환경 문제 해결을 위한 노력으로 알맞은 것은?", options: ["방치", "국제 협약, 기술 개발, 생활 습관 변화", "더 많은 개발", "자원 낭비"], answer: 1, explanation: "국제 협약, 기술 개발, 생활 습관 변화 등이 환경 문제 해결 노력입니다." },
        { q: "파리협정의 목표는?", options: ["환경 파괴", "지구 평균 기온 상승을 1.5~2°C 이내로 제한", "온실가스 증가", "화석연료 증가"], answer: 1, explanation: "파리협정은 지구 평균 기온 상승을 1.5~2°C 이내로 제한하는 것이 목표입니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'생태 발자국'이란?", options: ["발 크기", "인간 활동이 환경에 미치는 영향을 나타내는 지표", "동물 발자국", "화석"], answer: 1, explanation: "생태 발자국은 인간 활동이 환경에 미치는 영향을 나타내는 지표입니다." },
        { q: "'순환 경제'란?", options: ["일회용 경제", "자원을 재사용·재활용하여 폐기물을 최소화하는 경제", "낭비 경제", "소비 경제"], answer: 1, explanation: "순환 경제는 자원을 재사용·재활용하여 폐기물을 최소화하는 경제입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "환경 문제가 세대 간 정의와 관련 있는 이유는?", options: ["관련 없음", "현세대의 행동이 미래 세대의 환경에 영향을 미치므로", "현세대만 중요", "미래 세대만 책임"], answer: 1, explanation: "현세대의 행동이 미래 세대의 환경에 영향을 미쳐 세대 간 정의와 관련됩니다." },
        { q: "개인의 작은 실천이 중요한 이유는?", options: ["중요하지 않음", "작은 실천이 모여 큰 변화를 만들 수 있으므로", "개인은 무력", "실천 불가능"], answer: 1, explanation: "작은 실천이 모여 큰 변화를 만들 수 있습니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "100년 후에도 살 수 있으려면 가장 중요한 것은?", options: ["현재만 즐기기", "지속가능한 발전과 환경 보전에 대한 인식과 실천", "기술만 발전", "경제 성장만"], answer: 1, explanation: "지속가능한 발전과 환경 보전에 대한 인식과 실천이 가장 중요합니다." },
        { q: "지구의 미래를 위해 청소년이 할 수 있는 일은?", options: ["할 일 없음", "환경 문제에 관심, 생활 속 실천, 목소리 내기", "어른만 책임", "무관심"], answer: 1, explanation: "환경 문제에 관심을 갖고 생활 속에서 실천하며 목소리를 내야 합니다." }
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
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'social', `geo_${num}.html`);
  const unitKey = `geo_${i}`;

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const remedialData = REMEDIAL_DATA[unitKey];

  if (!remedialData) {
    console.log(`[SKIP] geo_${num} REMEDIAL_DATA 없음`);
    continue;
  }

  // 이미 window.REMEDIAL_BANK가 있는지 확인
  if (content.includes('window.REMEDIAL_BANK')) {
    console.log(`[SKIP] geo_${num} 이미 window.REMEDIAL_BANK 있음`);
    continue;
  }

  // const REMEDIAL_BANK가 있으면 window.REMEDIAL_BANK로 변경
  if (content.includes('const REMEDIAL_BANK')) {
    content = content.replace('const REMEDIAL_BANK', 'window.REMEDIAL_BANK');
    content = content.replace(/const data = REMEDIAL_BANK\[key\];/g, 'const data = window.REMEDIAL_BANK[key];');
    content = content.replace(/for \(const key in REMEDIAL_BANK\)/g, 'for (const key in window.REMEDIAL_BANK)');
    console.log(`[OK] geo_${num} 기존 REMEDIAL_BANK를 window.REMEDIAL_BANK로 변경`);
    fs.writeFileSync(filePath, content, 'utf8');
    continue;
  }

  // REMEDIAL_BANK 스크립트 생성
  const remedialScript = `
  <!-- ✅ 보완학습 데이터 -->
  <script>
  window.REMEDIAL_BANK = ${JSON.stringify(remedialData, null, 2)};
${REMEDIAL_FUNCTIONS}
  </script>

`;

  // <link rel="icon" 다음에 삽입
  const insertPoint = content.indexOf('<link rel="icon"');
  if (insertPoint === -1) {
    console.log(`[FAIL] geo_${num} <link rel="icon"> 못 찾음`);
    continue;
  }

  // 해당 줄의 끝을 찾아서 그 다음에 삽입
  const lineEnd = content.indexOf('>', insertPoint) + 1;
  content = content.slice(0, lineEnd) + '\n' + remedialScript + content.slice(lineEnd);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`[OK] geo_${num} REMEDIAL_BANK 및 함수 추가 완료`);
}

console.log('\n✅ geo_11~20 보완학습 기능 추가 완료!');

const fs = require('fs');
const path = require('path');

// law_01~10 REMEDIAL_BANK 데이터
const REMEDIAL_DATA = {
  // law_01: 사람이라면 누구나 누리는 소중한 권리, 인권
  law_01: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "인권이란?", options: ["부자만 가지는 권리", "사람이라면 누구나 태어날 때부터 가지는 권리", "법으로 주어지는 권리", "국가가 선별적으로 주는 권리"], answer: 1, explanation: "인권은 사람이라면 누구나 태어날 때부터 가지는 권리입니다." },
        { q: "인권의 특징으로 알맞은 것은?", options: ["양도 가능", "보편성, 천부성, 불가침성", "국가마다 다름", "특정인만 해당"], answer: 1, explanation: "인권은 보편성, 천부성, 불가침성의 특징을 가집니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "인권이 보장되어야 하는 이유는?", options: ["법에 써 있어서", "인간의 존엄성을 지키기 위해", "정부가 원해서", "전통이라서"], answer: 1, explanation: "인권은 인간의 존엄성을 지키기 위해 보장되어야 합니다." },
        { q: "인권 보장의 주체로 알맞은 것은?", options: ["개인만", "국가만", "국가와 사회, 개인 모두", "기업만"], answer: 2, explanation: "인권 보장은 국가, 사회, 개인 모두의 책임입니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'천부인권'이란?", options: ["하늘이 내린 천재", "사람이 태어날 때부터 가지는 권리", "법으로 만든 권리", "국가가 준 권리"], answer: 1, explanation: "천부인권은 사람이 태어날 때부터 하늘로부터 부여받은 권리라는 의미입니다." },
        { q: "'존엄성'이란?", options: ["높은 지위", "인간으로서 마땅히 존중받아야 할 가치", "재산", "권력"], answer: 1, explanation: "존엄성은 인간으로서 마땅히 존중받아야 할 가치입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "인권이 침해되면 어떤 일이 생길까요?", options: ["아무 일 없음", "인간 존엄성 훼손과 사회 갈등 발생", "경제 성장", "평화 증진"], answer: 1, explanation: "인권이 침해되면 인간 존엄성이 훼손되고 사회 갈등이 발생합니다." },
        { q: "인권이 중요해진 역사적 배경은?", options: ["우연", "전쟁과 차별의 비극을 경험한 후 인권의 소중함을 깨달음", "경제 발전", "기술 발전"], answer: 1, explanation: "전쟁과 차별의 비극을 경험한 후 인권의 소중함을 깨달았습니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "인권을 지키기 위해 개인이 할 수 있는 일은?", options: ["무관심", "타인의 인권 존중, 차별과 폭력에 반대", "자신만 생각", "권리만 주장"], answer: 1, explanation: "타인의 인권을 존중하고 차별과 폭력에 반대하는 것이 중요합니다." },
        { q: "인권과 의무의 관계로 알맞은 것은?", options: ["관계없음", "권리를 누리면서 타인의 권리도 존중할 의무가 있음", "의무만 있음", "권리만 있음"], answer: 1, explanation: "권리를 누리면서 타인의 권리도 존중할 의무가 있습니다." }
      ]
    }
  },

  // law_02: 평등을 향한 오랜 여정
  law_02: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "평등권이란?", options: ["모두 똑같아지는 것", "합리적 이유 없이 차별받지 않을 권리", "부자가 되는 권리", "특별 대우받는 권리"], answer: 1, explanation: "평등권은 합리적 이유 없이 차별받지 않을 권리입니다." },
        { q: "차별의 예로 알맞은 것은?", options: ["능력에 따른 평가", "성별, 인종, 장애 등을 이유로 불이익을 주는 것", "노력에 따른 보상", "법에 따른 처벌"], answer: 1, explanation: "성별, 인종, 장애 등을 이유로 불이익을 주는 것이 차별입니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "평등의 의미 변화로 알맞은 것은?", options: ["변화 없음", "형식적 평등에서 실질적 평등으로 발전", "실질적 평등에서 형식적 평등으로", "평등 포기"], answer: 1, explanation: "평등의 개념은 형식적 평등에서 실질적 평등으로 발전했습니다." },
        { q: "실질적 평등을 위한 정책의 예는?", options: ["모두 똑같이 대우", "사회적 약자를 위한 적극적 우대 조치", "차별 유지", "경쟁만 강조"], answer: 1, explanation: "사회적 약자를 위한 적극적 우대 조치가 실질적 평등을 위한 정책입니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'형식적 평등'이란?", options: ["실제로 평등", "법 앞에 모든 사람을 같게 대우하는 것", "차별하는 것", "특별 대우"], answer: 1, explanation: "형식적 평등은 법 앞에 모든 사람을 같게 대우하는 것입니다." },
        { q: "'적극적 우대 조치'란?", options: ["역차별", "차별받아 온 집단에 기회를 더 주어 실질적 평등을 이루려는 정책", "차별 강화", "평등 포기"], answer: 1, explanation: "적극적 우대 조치는 차별받아 온 집단에 기회를 더 주는 정책입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "형식적 평등만으로 부족한 이유는?", options: ["충분함", "출발선이 다른 사람들에게는 실질적 불평등이 생기기 때문", "형식이 중요해서", "법만 중요해서"], answer: 1, explanation: "출발선이 다른 사람들에게는 형식적 평등만으로 실질적 불평등이 생깁니다." },
        { q: "장애인 주차 구역을 따로 마련하는 이유는?", options: ["차별", "장애인의 이동권 보장을 위한 실질적 평등 실현", "특혜", "분리"], answer: 1, explanation: "장애인 주차 구역은 이동권 보장을 위한 실질적 평등 실현입니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "적극적 우대 조치에 대한 논쟁이 있는 이유는?", options: ["논쟁 없음", "역차별 우려와 실질적 평등의 필요성 사이 의견 차이", "모두 찬성", "모두 반대"], answer: 1, explanation: "역차별 우려와 실질적 평등 필요성 사이에 의견 차이가 있습니다." },
        { q: "평등한 사회를 위해 필요한 자세는?", options: ["무관심", "차별에 민감하게 반응하고 다양성을 존중", "차별 방관", "자신만 생각"], answer: 1, explanation: "차별에 민감하게 반응하고 다양성을 존중하는 자세가 필요합니다." }
      ]
    }
  },

  // law_03: 우리 곁의 인권, 어떻게 지켜졌을까?
  law_03: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "인권 보장을 위한 제도가 아닌 것은?", options: ["헌법", "국가인권위원회", "법원", "인권 침해"], answer: 3, explanation: "헌법, 국가인권위원회, 법원 등이 인권 보장 제도입니다." },
        { q: "세계인권선언이 채택된 해는?", options: ["1945년", "1948년", "1960년", "2000년"], answer: 1, explanation: "세계인권선언은 1948년에 유엔에서 채택되었습니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "인권 보장의 역사적 발전 순서로 알맞은 것은?", options: ["현대→근대→고대", "신분제→시민혁명→인권선언→현대 인권", "변화 없음", "현대→시민혁명"], answer: 1, explanation: "신분제 사회에서 시민혁명, 인권선언을 거쳐 현대 인권으로 발전했습니다." },
        { q: "국가인권위원회의 역할은?", options: ["법 제정", "인권 침해 조사와 권고", "재판", "법 집행"], answer: 1, explanation: "국가인권위원회는 인권 침해를 조사하고 권고하는 역할을 합니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'시민혁명'이란?", options: ["군사 쿠데타", "시민이 전제 권력에 맞서 자유와 권리를 쟁취한 혁명", "왕의 개혁", "외국 침략"], answer: 1, explanation: "시민혁명은 시민이 전제 권력에 맞서 자유와 권리를 쟁취한 혁명입니다." },
        { q: "'인권 침해'란?", options: ["인권 보장", "인권을 부당하게 빼앗거나 제한하는 것", "인권 존중", "인권 확대"], answer: 1, explanation: "인권 침해는 인권을 부당하게 빼앗거나 제한하는 것입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "인권이 법으로 보장되어야 하는 이유는?", options: ["형식적으로", "국가 권력으로부터 개인의 권리를 지키기 위해", "전통이라서", "필요 없음"], answer: 1, explanation: "법으로 보장해야 국가 권력으로부터 개인의 권리를 지킬 수 있습니다." },
        { q: "인권 보장이 민주주의와 관련 있는 이유는?", options: ["관련 없음", "민주주의는 국민의 기본권 보장을 전제로 하기 때문", "독재와 관련", "경제와만 관련"], answer: 1, explanation: "민주주의는 국민의 기본권 보장을 전제로 합니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "인권 보장 제도가 있어도 인권 침해가 발생하는 이유는?", options: ["제도가 완벽해서", "제도의 한계와 인식 부족, 권력 남용 등", "침해가 없어서", "법이 없어서"], answer: 1, explanation: "제도의 한계, 인식 부족, 권력 남용 등으로 인권 침해가 발생합니다." },
        { q: "인권 보장을 위해 시민의 역할은?", options: ["정부만 책임", "인권에 관심을 갖고 감시하며 참여", "무관심", "방관"], answer: 1, explanation: "시민은 인권에 관심을 갖고 감시하며 참여해야 합니다." }
      ]
    }
  },

  // law_04: 사이버 폭력에서 아동 학대까지, 인권 보호의 중요성
  law_04: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "사이버 폭력의 예로 알맞은 것은?", options: ["직접 폭행", "온라인 욕설, 따돌림, 개인정보 유출", "친절한 댓글", "정보 공유"], answer: 1, explanation: "온라인 욕설, 따돌림, 개인정보 유출 등이 사이버 폭력입니다." },
        { q: "아동 학대란?", options: ["아동 보호", "아동에게 신체적·정서적 해를 가하는 행위", "아동 교육", "아동 양육"], answer: 1, explanation: "아동 학대는 아동에게 신체적·정서적 해를 가하는 행위입니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "인권 침해 유형으로 알맞지 않은 것은?", options: ["사이버 폭력", "아동 학대", "혐오 표현", "봉사 활동"], answer: 3, explanation: "사이버 폭력, 아동 학대, 혐오 표현이 인권 침해 유형입니다." },
        { q: "인권 침해 발생 시 대응 방법으로 알맞은 것은?", options: ["방관", "신고, 상담, 법적 조치 등", "보복", "숨기기"], answer: 1, explanation: "인권 침해 시 신고, 상담, 법적 조치 등으로 대응해야 합니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'혐오 표현'이란?", options: ["칭찬", "특정 집단에 대한 차별과 증오를 담은 표현", "객관적 비판", "정보 전달"], answer: 1, explanation: "혐오 표현은 특정 집단에 대한 차별과 증오를 담은 표현입니다." },
        { q: "'2차 피해'란?", options: ["첫 번째 피해", "피해 사실이 알려지면서 추가로 받는 피해", "가해자 피해", "제3자 피해"], answer: 1, explanation: "2차 피해는 피해 사실이 알려지면서 추가로 받는 피해입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "사이버 폭력이 심각한 이유는?", options: ["심각하지 않음", "빠른 확산, 익명성, 지속적 피해 가능", "오프라인보다 약해서", "법이 없어서"], answer: 1, explanation: "사이버 폭력은 빠른 확산, 익명성, 지속적 피해 가능성으로 심각합니다." },
        { q: "아동 학대 예방을 위해 필요한 것은?", options: ["방관", "신고 의무화, 인식 개선, 지원 시스템 강화", "숨기기", "가정 내 문제로 방치"], answer: 1, explanation: "신고 의무화, 인식 개선, 지원 시스템 강화가 필요합니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "인권 침해 예방을 위해 개인이 할 수 있는 일은?", options: ["방관자 되기", "인권 감수성 키우기, 차별·폭력에 반대하기", "가해 행위", "무관심"], answer: 1, explanation: "인권 감수성을 키우고 차별·폭력에 반대해야 합니다." },
        { q: "표현의 자유와 혐오 표현의 관계는?", options: ["표현의 자유는 무제한", "표현의 자유도 타인의 인권을 침해하면 제한될 수 있음", "혐오 표현도 보호", "관계없음"], answer: 1, explanation: "표현의 자유도 타인의 인권을 침해하면 제한될 수 있습니다." }
      ]
    }
  },

  // law_05: 삼복 제도와 조선의 신중한 재판 방식
  law_05: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "삼복 제도란?", options: ["세 번 처벌", "중요한 사건을 세 번 심리하는 조선 시대 재판 제도", "세 명이 재판", "복수 제도"], answer: 1, explanation: "삼복 제도는 중요한 사건을 세 번 심리하는 조선 시대 재판 제도입니다." },
        { q: "삼복 제도의 목적은?", options: ["빠른 재판", "신중한 재판으로 억울한 피해자 방지", "가혹한 처벌", "왕의 권위 강화"], answer: 1, explanation: "삼복 제도는 신중한 재판으로 억울한 피해자를 방지하기 위한 것입니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "조선 시대 재판 제도의 특징으로 알맞은 것은?", options: ["즉결 처분", "신문고, 삼복 제도 등 억울함을 호소할 기회 제공", "재판 없음", "왕이 직접 모든 재판"], answer: 1, explanation: "신문고, 삼복 제도 등으로 억울함을 호소할 기회를 제공했습니다." },
        { q: "삼복 제도가 현대 제도와 비슷한 점은?", options: ["없음", "삼심 제도(3번의 재판 기회)와 유사", "즉결 심판과 유사", "배심원 제도와 유사"], answer: 1, explanation: "삼복 제도는 현대의 삼심 제도와 유사합니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'신문고'란?", options: ["신문을 만드는 곳", "백성이 억울함을 호소할 수 있도록 설치한 북", "뉴스 매체", "왕의 명령 전달 수단"], answer: 1, explanation: "신문고는 백성이 억울함을 호소할 수 있도록 설치한 북입니다." },
        { q: "'심리'란 재판에서?", options: ["심리 상담", "사건 내용을 자세히 조사하고 판단하는 것", "심장 치료", "마음 연구"], answer: 1, explanation: "심리는 재판에서 사건 내용을 자세히 조사하고 판단하는 것입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "삼복 제도가 필요했던 이유는?", options: ["형벌이 가벼워서", "사형 등 중대한 형벌의 오판을 방지하기 위해", "재판이 빨라서", "범죄가 없어서"], answer: 1, explanation: "사형 등 중대한 형벌의 오판을 방지하기 위해 필요했습니다." },
        { q: "조선의 재판 제도에서 배울 점은?", options: ["없음", "신중한 재판과 억울함 호소 기회의 중요성", "빠른 처벌", "엄격한 형벌만"], answer: 1, explanation: "신중한 재판과 억울함을 호소할 기회의 중요성을 배울 수 있습니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "조선 시대 재판 제도의 한계는?", options: ["한계 없음", "신분에 따른 차별, 고문 사용 등", "완벽함", "현대와 동일"], answer: 1, explanation: "신분에 따른 차별, 고문 사용 등의 한계가 있었습니다." },
        { q: "현대 재판 제도가 발전한 점은?", options: ["발전 없음", "인권 보장, 공정한 재판 원칙, 변호인 제도 등", "퇴보", "조선과 동일"], answer: 1, explanation: "인권 보장, 공정한 재판 원칙, 변호인 제도 등이 발전했습니다." }
      ]
    }
  },

  // law_06: 헌법, 나라의 가장 높은 약속
  law_06: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "헌법이란?", options: ["일반 법률", "국가의 기본 원리와 국민의 기본권을 정한 최고 법", "시행령", "조례"], answer: 1, explanation: "헌법은 국가의 기본 원리와 국민의 기본권을 정한 최고 법입니다." },
        { q: "헌법의 특징으로 알맞은 것은?", options: ["다른 법보다 하위", "최고 법으로 다른 모든 법의 기준", "자주 바뀜", "국회만 해당"], answer: 1, explanation: "헌법은 최고 법으로 다른 모든 법의 기준이 됩니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "헌법에 규정된 내용이 아닌 것은?", options: ["국민의 기본권", "국가 조직", "통치 구조", "교통 법규 세부 사항"], answer: 3, explanation: "헌법에는 기본권, 국가 조직, 통치 구조 등이 규정됩니다." },
        { q: "헌법 개정이 어려운 이유는?", options: ["쉬움", "국가의 기본 원리를 함부로 바꾸지 않기 위해", "관심이 없어서", "필요 없어서"], answer: 1, explanation: "국가의 기본 원리를 함부로 바꾸지 않기 위해 개정이 어렵습니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'기본권'이란?", options: ["기본적인 의무", "헌법이 보장하는 국민의 기본적 권리", "기초 학력", "기본 급여"], answer: 1, explanation: "기본권은 헌법이 보장하는 국민의 기본적 권리입니다." },
        { q: "'위헌'이란?", options: ["헌법을 지키는 것", "헌법에 어긋나는 것", "헌법 개정", "헌법 제정"], answer: 1, explanation: "위헌은 헌법에 어긋나는 것을 말합니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "헌법이 최고 법인 이유는?", options: ["오래되어서", "국민의 기본권과 국가 운영의 근본을 정하기 때문", "분량이 많아서", "외국에서 만들어서"], answer: 1, explanation: "헌법은 국민의 기본권과 국가 운영의 근본을 정하기 때문에 최고 법입니다." },
        { q: "헌법재판소의 역할은?", options: ["일반 재판", "법률이 헌법에 맞는지 심판", "법률 제정", "대통령 선출"], answer: 1, explanation: "헌법재판소는 법률이 헌법에 맞는지 심판합니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "헌법이 국민의 삶에 중요한 이유는?", options: ["중요하지 않음", "국민의 권리와 자유를 보장하는 근거이기 때문", "정부만 해당", "공무원만 해당"], answer: 1, explanation: "헌법은 국민의 권리와 자유를 보장하는 근거입니다." },
        { q: "헌법 정신을 지키기 위해 필요한 것은?", options: ["무관심", "헌법에 대한 이해와 관심, 위헌 행위 감시", "정부만 책임", "전문가만 알면 됨"], answer: 1, explanation: "헌법에 대한 이해와 관심, 위헌 행위 감시가 필요합니다." }
      ]
    }
  },

  // law_07: 법은 어떻게 만들어질까?
  law_07: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "법률을 만드는 기관은?", options: ["행정부", "국회(입법부)", "법원", "대통령"], answer: 1, explanation: "법률은 국회(입법부)에서 만듭니다." },
        { q: "법률안을 제출할 수 있는 주체는?", options: ["국민만", "국회의원, 정부", "법원", "기업"], answer: 1, explanation: "법률안은 국회의원이나 정부가 제출할 수 있습니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "법률 제정 과정으로 알맞은 순서는?", options: ["공포→심의→제출", "법률안 제출→위원회 심사→본회의 의결→공포", "의결→제출→심사", "공포→의결→제출"], answer: 1, explanation: "법률안 제출→위원회 심사→본회의 의결→공포 순서입니다." },
        { q: "대통령의 법률안 거부권이란?", options: ["법 제정권", "국회가 의결한 법률안에 이의를 제기하고 재의를 요구하는 권한", "법 폐지권", "법 집행권"], answer: 1, explanation: "거부권은 법률안에 이의를 제기하고 재의를 요구하는 권한입니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'입법'이란?", options: ["법 집행", "법을 만드는 것", "법 해석", "법 폐지"], answer: 1, explanation: "입법은 법을 만드는 것입니다." },
        { q: "'공포'란 법에서?", options: ["무서움", "법률을 국민에게 알리는 것", "법 폐지", "법 숨기기"], answer: 1, explanation: "공포는 제정된 법률을 국민에게 알리는 것입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "법률 제정에 여러 단계가 필요한 이유는?", options: ["시간 끌기", "신중한 검토와 다양한 의견 반영을 위해", "형식적 절차", "필요 없음"], answer: 1, explanation: "신중한 검토와 다양한 의견 반영을 위해 여러 단계가 필요합니다." },
        { q: "국민이 법률 제정에 참여하는 방법은?", options: ["참여 불가", "청원, 여론 형성, 선거를 통한 대표자 선출", "직접 투표만", "방법 없음"], answer: 1, explanation: "청원, 여론 형성, 선거를 통한 대표자 선출로 참여합니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "좋은 법이 만들어지려면 필요한 것은?", options: ["빠른 통과", "국민의 관심과 참여, 충분한 논의", "전문가만 참여", "비밀 제정"], answer: 1, explanation: "국민의 관심과 참여, 충분한 논의가 필요합니다." },
        { q: "법이 현실과 맞지 않을 때 해야 할 일은?", options: ["그대로 유지", "개정이나 폐지를 통해 현실에 맞게 변화", "무시", "위반"], answer: 1, explanation: "개정이나 폐지를 통해 현실에 맞게 변화해야 합니다." }
      ]
    }
  },

  // law_08: 법원과 재판, 정의를 찾아서
  law_08: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "법원의 역할은?", options: ["법률 제정", "법에 따라 분쟁을 해결하고 재판하는 것", "법률 집행", "법률 홍보"], answer: 1, explanation: "법원은 법에 따라 분쟁을 해결하고 재판합니다." },
        { q: "삼심 제도란?", options: ["세 명이 재판", "한 사건에 대해 세 번까지 재판받을 수 있는 제도", "세 가지 법", "세 번 처벌"], answer: 1, explanation: "삼심 제도는 한 사건에 대해 세 번까지 재판받을 수 있는 제도입니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "법원의 종류로 알맞지 않은 것은?", options: ["대법원", "고등법원", "지방법원", "입법원"], answer: 3, explanation: "대법원, 고등법원, 지방법원이 법원의 종류입니다." },
        { q: "삼심 제도의 순서로 알맞은 것은?", options: ["대법원→고등법원→지방법원", "지방법원→고등법원→대법원", "고등법원→대법원→지방법원", "순서 없음"], answer: 1, explanation: "지방법원(1심)→고등법원(2심)→대법원(3심) 순서입니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'항소'란?", options: ["재판 포기", "1심 판결에 불복하여 2심을 청구하는 것", "재판 종료", "합의"], answer: 1, explanation: "항소는 1심 판결에 불복하여 2심을 청구하는 것입니다." },
        { q: "'판결'이란?", options: ["재판 시작", "재판에서 법원이 내리는 최종 결정", "재판 연기", "재판 취소"], answer: 1, explanation: "판결은 재판에서 법원이 내리는 최종 결정입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "삼심 제도가 필요한 이유는?", options: ["시간 끌기", "재판의 오류를 바로잡고 공정성을 높이기 위해", "판사가 많아서", "형식적 절차"], answer: 1, explanation: "재판의 오류를 바로잡고 공정성을 높이기 위해 삼심 제도가 필요합니다." },
        { q: "재판이 공개되는 이유는?", options: ["구경거리", "재판의 공정성을 감시하고 투명성을 확보하기 위해", "법원 홍보", "의무 없음"], answer: 1, explanation: "재판 공개는 공정성을 감시하고 투명성을 확보하기 위한 것입니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "사법부 독립이 중요한 이유는?", options: ["중요하지 않음", "외부 압력 없이 공정한 재판을 위해", "판사 특권", "형식적"], answer: 1, explanation: "사법부 독립은 외부 압력 없이 공정한 재판을 위해 중요합니다." },
        { q: "재판 결과에 불만이 있을 때 할 수 있는 일은?", options: ["아무것도 없음", "상소(항소, 상고)를 통해 다시 재판 청구", "법 무시", "자력 구제"], answer: 1, explanation: "상소(항소, 상고)를 통해 다시 재판을 청구할 수 있습니다." }
      ]
    }
  },

  // law_09: 범죄와 형벌, 왜 처벌할까?
  law_09: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "형벌의 목적으로 알맞은 것은?", options: ["복수", "범죄 예방, 사회 질서 유지, 범죄자 교화", "고통 주기", "격리만"], answer: 1, explanation: "형벌의 목적은 범죄 예방, 사회 질서 유지, 범죄자 교화입니다." },
        { q: "죄형법정주의란?", options: ["판사 마음대로", "범죄와 형벌은 법률로 미리 정해져야 한다는 원칙", "사후 처벌", "관습에 따름"], answer: 1, explanation: "죄형법정주의는 범죄와 형벌이 법률로 미리 정해져야 한다는 원칙입니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "형벌의 종류로 알맞지 않은 것은?", options: ["징역", "벌금", "보상금", "사형"], answer: 2, explanation: "형벌에는 징역, 벌금, 사형 등이 있으며 보상금은 형벌이 아닙니다." },
        { q: "형사 재판 절차로 알맞은 것은?", options: ["판결→수사→기소", "수사→기소→재판→판결", "기소→수사→판결", "판결→기소→수사"], answer: 1, explanation: "수사→기소→재판→판결 순서입니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'기소'란?", options: ["재판 종료", "검사가 피의자를 법원에 재판을 청구하는 것", "무죄 선고", "석방"], answer: 1, explanation: "기소는 검사가 피의자를 법원에 재판을 청구하는 것입니다." },
        { q: "'무죄 추정의 원칙'이란?", options: ["유죄 추정", "유죄 판결 전까지 무죄로 추정하는 원칙", "의심하면 유죄", "추정 금지"], answer: 1, explanation: "무죄 추정의 원칙은 유죄 판결 전까지 무죄로 추정하는 것입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "죄형법정주의가 필요한 이유는?", options: ["필요 없음", "국가 권력의 자의적 처벌을 막고 국민의 자유를 보장하기 위해", "처벌 강화", "빠른 재판"], answer: 1, explanation: "국가 권력의 자의적 처벌을 막고 국민의 자유를 보장하기 위해 필요합니다." },
        { q: "형벌이 교화를 목적으로 해야 하는 이유는?", options: ["필요 없음", "범죄자의 사회 복귀와 재범 방지를 위해", "고통만 주면 됨", "격리만 하면 됨"], answer: 1, explanation: "범죄자의 사회 복귀와 재범 방지를 위해 교화가 중요합니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "사형제에 대한 논쟁이 있는 이유는?", options: ["논쟁 없음", "생명권 침해 vs 흉악범죄 억제 효과에 대한 의견 차이", "모두 찬성", "모두 반대"], answer: 1, explanation: "생명권 침해와 범죄 억제 효과에 대한 의견 차이로 논쟁이 있습니다." },
        { q: "형벌 외에 범죄 예방을 위해 필요한 것은?", options: ["처벌 강화만", "교육, 복지, 사회 안전망 강화 등 근본적 대책", "방치", "격리만"], answer: 1, explanation: "교육, 복지, 사회 안전망 강화 등 근본적 대책이 필요합니다." }
      ]
    }
  },

  // law_10: 청소년도 법의 보호를 받아요
  law_10: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "소년법의 목적은?", options: ["엄벌", "청소년의 건전한 성장과 환경 조성", "성인과 동일 처벌", "방치"], answer: 1, explanation: "소년법은 청소년의 건전한 성장과 환경 조성을 목적으로 합니다." },
        { q: "소년법 적용 대상은?", options: ["성인", "19세 미만의 소년", "60세 이상", "모든 연령"], answer: 1, explanation: "소년법은 19세 미만의 소년에게 적용됩니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "청소년 보호 제도로 알맞지 않은 것은?", options: ["소년법", "학교폭력예방법", "청소년보호법", "주류 판매 허용"], answer: 3, explanation: "소년법, 학교폭력예방법, 청소년보호법이 청소년 보호 제도입니다." },
        { q: "소년 보호 처분의 예로 알맞은 것은?", options: ["사형", "보호 관찰, 사회봉사, 소년원 송치", "무기징역", "벌금형"], answer: 1, explanation: "보호 관찰, 사회봉사, 소년원 송치 등이 소년 보호 처분입니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'촉법소년'이란?", options: ["성인 범죄자", "만 10세 이상 14세 미만으로 형사 책임이 없는 소년", "모든 청소년", "피해자"], answer: 1, explanation: "촉법소년은 만 10세 이상 14세 미만으로 형사 책임이 없는 소년입니다." },
        { q: "'보호 처분'이란?", options: ["형벌", "청소년의 교화와 보호를 위한 처분", "석방", "무죄 선고"], answer: 1, explanation: "보호 처분은 청소년의 교화와 보호를 위한 처분입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "청소년에게 성인과 다른 처벌을 적용하는 이유는?", options: ["차별", "성장 과정에 있어 교화 가능성이 높기 때문", "범죄가 가벼워서", "법이 없어서"], answer: 1, explanation: "청소년은 성장 과정에 있어 교화 가능성이 높기 때문입니다." },
        { q: "청소년 범죄 예방을 위해 필요한 것은?", options: ["엄벌만", "가정, 학교, 사회의 관심과 지원", "방치", "격리만"], answer: 1, explanation: "가정, 학교, 사회의 관심과 지원이 청소년 범죄 예방에 필요합니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "촉법소년 연령 기준에 대한 논쟁이 있는 이유는?", options: ["논쟁 없음", "청소년 범죄 흉포화와 교화 가능성 사이의 의견 차이", "모두 찬성", "모두 반대"], answer: 1, explanation: "청소년 범죄 흉포화와 교화 가능성에 대한 의견 차이로 논쟁이 있습니다." },
        { q: "청소년의 권리와 책임에 대해 알맞은 것은?", options: ["권리만 있음", "권리와 함께 책임도 인식하며 성장해야 함", "책임만 있음", "둘 다 없음"], answer: 1, explanation: "청소년은 권리와 함께 책임도 인식하며 성장해야 합니다." }
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

for (let i = 1; i <= 10; i++) {
  const num = String(i).padStart(2, '0');
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'social', `law_${num}.html`);
  const unitKey = `law_${num}`;

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const remedialData = REMEDIAL_DATA[unitKey];

  if (!remedialData) {
    console.log(`[SKIP] law_${num} REMEDIAL_DATA 없음`);
    continue;
  }

  // 이미 window.REMEDIAL_BANK가 있는지 확인
  if (content.includes('window.REMEDIAL_BANK')) {
    console.log(`[SKIP] law_${num} 이미 window.REMEDIAL_BANK 있음`);
    continue;
  }

  // const REMEDIAL_BANK가 있으면 window.REMEDIAL_BANK로 변경
  if (content.includes('const REMEDIAL_BANK')) {
    content = content.replace('const REMEDIAL_BANK', 'window.REMEDIAL_BANK');
    content = content.replace(/const data = REMEDIAL_BANK\[key\];/g, 'const data = window.REMEDIAL_BANK[key];');
    content = content.replace(/for \(const key in REMEDIAL_BANK\)/g, 'for (const key in window.REMEDIAL_BANK)');
    console.log(`[OK] law_${num} 기존 REMEDIAL_BANK를 window.REMEDIAL_BANK로 변경`);
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
    console.log(`[FAIL] law_${num} <link rel="icon"> 못 찾음`);
    continue;
  }

  // 해당 줄의 끝을 찾아서 그 다음에 삽입
  const lineEnd = content.indexOf('>', insertPoint) + 1;
  content = content.slice(0, lineEnd) + '\n' + remedialScript + content.slice(lineEnd);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`[OK] law_${num} REMEDIAL_BANK 및 함수 추가 완료`);
}

console.log('\n✅ law_01~10 보완학습 기능 추가 완료!');

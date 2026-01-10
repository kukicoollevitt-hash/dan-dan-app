const fs = require('fs');
const path = require('path');

// law_11~20 각 파일의 본문 내용에 맞는 REMEDIAL_BANK 데이터
const REMEDIAL_DATA = {
  law_11: {
    // 주제: 계약과 소비자의 권리
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "계약이란 무엇인가요?", options: ["일방적인 약속", "두 사람 이상이 서로 합의하여 권리와 의무를 정하는 것", "법원의 판결", "정부의 명령"], answer: 1, explanation: "계약은 두 사람 이상이 서로 합의하여 권리와 의무를 정하는 것입니다." },
        { q: "소비자 권리로 알맞은 것은?", options: ["무조건 환불", "안전할 권리, 알 권리, 선택할 권리, 피해구제 권리 등", "무한 요구 권리", "판매자 통제 권리"], answer: 1, explanation: "소비자는 안전할 권리, 알 권리, 선택할 권리, 피해구제 권리 등이 있습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "계약이 성립하려면 필요한 것은?", options: ["한쪽 의사만", "청약과 승낙의 합치", "문서만", "돈만"], answer: 1, explanation: "계약은 청약(제안)과 승낙(동의)이 합쳐져야 성립합니다." },
        { q: "소비자 보호 제도가 필요한 이유는?", options: ["소비자가 강해서", "사업자와 소비자 간 정보와 힘의 불균형 때문", "전통", "형식"], answer: 1, explanation: "사업자와 소비자 간 정보와 힘의 불균형 때문에 소비자 보호가 필요합니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'청약철회권'이란?", options: ["판매 취소", "일정 기간 내 소비자가 계약을 취소할 수 있는 권리", "환불 거부", "판매 강제"], answer: 1, explanation: "청약철회권은 일정 기간 내 소비자가 계약을 취소할 수 있는 권리입니다." },
        { q: "'불공정 약관'이란?", options: ["공정한 계약", "소비자에게 일방적으로 불리한 계약 조건", "좋은 조건", "협의된 조건"], answer: 1, explanation: "불공정 약관은 소비자에게 일방적으로 불리한 계약 조건입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "미성년자의 계약이 제한되는 이유는?", options: ["차별", "판단 능력이 미숙하여 보호가 필요하기 때문", "돈이 없어서", "권리가 없어서"], answer: 1, explanation: "미성년자는 판단 능력이 미숙하여 보호가 필요합니다." },
        { q: "온라인 쇼핑에서 청약철회가 중요한 이유는?", options: ["필요 없음", "직접 보지 않고 구매하므로 반품 기회가 필요", "판매자 보호", "형식"], answer: 1, explanation: "온라인에서는 직접 보지 않고 구매하므로 반품 기회가 필요합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "현명한 소비자가 되기 위해 필요한 것은?", options: ["무조건 구매", "계약 내용을 꼼꼼히 확인하고 권리를 알기", "충동 구매", "광고만 믿기"], answer: 1, explanation: "계약 내용을 꼼꼼히 확인하고 권리를 아는 것이 중요합니다." },
        { q: "소비자 피해 시 대처 방법으로 알맞은 것은?", options: ["포기", "소비자보호원, 공정거래위원회 등에 신고", "무시", "참기"], answer: 1, explanation: "소비자보호원, 공정거래위원회 등에 신고하여 피해를 구제받을 수 있습니다." }
      ]
    }
  },
  law_12: {
    // 주제: 불법 행위와 손해 배상
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "불법 행위란?", options: ["합법적 행동", "고의나 과실로 타인에게 손해를 끼치는 행위", "좋은 행동", "계약 이행"], answer: 1, explanation: "불법 행위는 고의나 과실로 타인에게 손해를 끼치는 행위입니다." },
        { q: "손해 배상이란?", options: ["보상 거부", "끼친 손해를 금전 등으로 보상하는 것", "처벌", "형벌"], answer: 1, explanation: "손해 배상은 끼친 손해를 금전 등으로 보상하는 것입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "불법 행위 책임이 성립하려면 필요한 요건은?", options: ["없음", "고의·과실, 위법성, 손해 발생, 인과관계", "의도만", "결과만"], answer: 1, explanation: "불법 행위 책임에는 고의·과실, 위법성, 손해 발생, 인과관계가 필요합니다." },
        { q: "형사 책임과 민사 책임의 차이는?", options: ["같음", "형사는 처벌, 민사는 손해 배상", "형사만 있음", "민사만 있음"], answer: 1, explanation: "형사 책임은 처벌, 민사 책임은 손해 배상입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'과실'의 뜻은?", options: ["고의", "주의를 다하지 않아 잘못을 저지름", "성공", "노력"], answer: 1, explanation: "과실은 주의를 다하지 않아 잘못을 저지르는 것입니다." },
        { q: "'인과관계'란?", options: ["우연", "원인과 결과의 연결 관계", "관계없음", "필연"], answer: 1, explanation: "인과관계는 원인과 결과의 연결 관계입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "손해 배상 제도가 필요한 이유는?", options: ["복수", "피해자의 손해를 회복하고 사회 정의 실현", "가해자 보호", "형식"], answer: 1, explanation: "손해 배상은 피해자의 손해를 회복하고 사회 정의를 실현합니다." },
        { q: "미성년자가 불법 행위를 하면 누가 책임지나요?", options: ["아무도", "경우에 따라 부모나 보호자가 감독 책임", "미성년자만", "국가"], answer: 1, explanation: "경우에 따라 부모나 보호자가 감독 책임을 질 수 있습니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "일상에서 불법 행위를 예방하는 방법은?", options: ["무관심", "타인의 권리를 존중하고 주의 의무 다하기", "마음대로 행동", "법 무시"], answer: 1, explanation: "타인의 권리를 존중하고 주의 의무를 다하는 것이 중요합니다." },
        { q: "피해를 입었을 때 증거가 중요한 이유는?", options: ["필요 없음", "손해와 인과관계를 입증해야 배상받을 수 있음", "형식", "관습"], answer: 1, explanation: "손해와 인과관계를 입증해야 배상받을 수 있습니다." }
      ]
    }
  },
  law_13: {
    // 주제: 가족과 법
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "가족법이 다루는 내용은?", options: ["형벌", "결혼, 이혼, 상속, 부양 등 가족 관계", "국제 관계", "경제 정책"], answer: 1, explanation: "가족법은 결혼, 이혼, 상속, 부양 등 가족 관계를 다룹니다." },
        { q: "법적으로 혼인이 성립하려면?", options: ["사랑만", "혼인신고를 해야 함", "동거만", "약속만"], answer: 1, explanation: "법적 혼인은 혼인신고를 해야 성립합니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "가족법의 목적은?", options: ["통제", "가족 구성원의 권리 보호와 가정의 안정", "처벌", "분쟁 유발"], answer: 1, explanation: "가족법은 가족 구성원의 권리 보호와 가정의 안정을 목적으로 합니다." },
        { q: "상속의 순서로 알맞은 것은?", options: ["무작위", "배우자, 직계비속, 직계존속, 형제자매 순", "친구 먼저", "국가 먼저"], answer: 1, explanation: "상속은 배우자, 직계비속, 직계존속, 형제자매 순으로 이루어집니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'부양 의무'란?", options: ["버리는 것", "가족을 경제적으로 돌볼 의무", "혼자 살기", "무관심"], answer: 1, explanation: "부양 의무는 가족을 경제적으로 돌볼 의무입니다." },
        { q: "'친권'이란?", options: ["재산권", "부모가 미성년 자녀를 보호·양육할 권리와 의무", "투표권", "선거권"], answer: 1, explanation: "친권은 부모가 미성년 자녀를 보호·양육할 권리와 의무입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "가족법이 변화하는 이유는?", options: ["변하지 않음", "사회와 가족 형태가 다양해지기 때문", "전통 유지", "정부 명령"], answer: 1, explanation: "사회와 가족 형태가 다양해지면서 가족법도 변화합니다." },
        { q: "이혼 시 자녀 양육권 결정의 기준은?", options: ["부모 편의", "자녀의 복리(행복과 이익) 최우선", "재산", "나이"], answer: 1, explanation: "이혼 시 자녀의 복리(행복과 이익)가 최우선입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "다양한 가족 형태에 대한 바람직한 인식은?", options: ["비정상", "다양한 가족도 존중받아야 함", "무시", "차별"], answer: 1, explanation: "다양한 가족 형태도 존중받아야 합니다." },
        { q: "가족 내 갈등 해결에서 법의 역할은?", options: ["갈등 유발", "권리 보호와 공정한 해결 기준 제시", "무시", "회피"], answer: 1, explanation: "법은 권리 보호와 공정한 해결 기준을 제시합니다." }
      ]
    }
  },
  law_14: {
    // 주제: 노동법
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "노동법이란?", options: ["기업 이익법", "근로자의 권리를 보호하는 법", "세금법", "무역법"], answer: 1, explanation: "노동법은 근로자의 권리를 보호하는 법입니다." },
        { q: "근로자의 기본적 권리 3가지는?", options: ["재산권, 투표권, 선거권", "단결권, 단체교섭권, 단체행동권", "소유권, 사용권, 처분권", "입법권, 사법권, 행정권"], answer: 1, explanation: "근로자의 기본권은 단결권, 단체교섭권, 단체행동권입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "노동법이 필요한 이유는?", options: ["불필요", "고용주와 근로자 간 힘의 불균형을 보완하기 위해", "고용주 보호", "형식"], answer: 1, explanation: "고용주와 근로자 간 힘의 불균형을 보완하기 위해 노동법이 필요합니다." },
        { q: "근로계약서에 포함되어야 할 내용은?", options: ["이름만", "임금, 근로시간, 휴일, 업무 내용 등", "주소만", "나이만"], answer: 1, explanation: "근로계약서에는 임금, 근로시간, 휴일, 업무 내용 등이 포함됩니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'최저임금'이란?", options: ["최고 임금", "법으로 정한 최소한의 임금", "평균 임금", "희망 임금"], answer: 1, explanation: "최저임금은 법으로 정한 최소한의 임금입니다." },
        { q: "'부당 해고'란?", options: ["정당한 해고", "정당한 이유 없이 근로자를 해고하는 것", "퇴직", "사직"], answer: 1, explanation: "부당 해고는 정당한 이유 없이 근로자를 해고하는 것입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "청소년 근로가 특별히 보호받는 이유는?", options: ["차별", "성장기이며 학업과 건강 보호가 필요하기 때문", "능력 부족", "권리 없음"], answer: 1, explanation: "청소년은 성장기이며 학업과 건강 보호가 필요합니다." },
        { q: "노동조합이 중요한 이유는?", options: ["불필요", "개별 근로자보다 단체로 협상할 때 힘이 커지기 때문", "회사 이익", "정부 지시"], answer: 1, explanation: "개별 근로자보다 단체로 협상할 때 힘이 커집니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "아르바이트할 때 알아야 할 권리는?", options: ["없음", "최저임금, 근로계약서, 휴식 시간, 부당 대우 신고 등", "의무만", "시키는 대로"], answer: 1, explanation: "최저임금, 근로계약서, 휴식 시간, 부당 대우 신고 등을 알아야 합니다." },
        { q: "노동 문제 발생 시 도움받을 수 있는 곳은?", options: ["없음", "고용노동부, 근로복지공단, 노동위원회 등", "경찰만", "회사만"], answer: 1, explanation: "고용노동부, 근로복지공단, 노동위원회 등에서 도움받을 수 있습니다." }
      ]
    }
  },
  law_15: {
    // 주제: 국제법과 세계 시민의 권리
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "국제법이란?", options: ["한 나라의 법", "국가 간의 관계를 규율하는 법", "지방법", "가정법"], answer: 1, explanation: "국제법은 국가 간의 관계를 규율하는 법입니다." },
        { q: "국제인권법의 목적은?", options: ["전쟁", "전 세계 모든 사람의 인권 보호", "무역", "경쟁"], answer: 1, explanation: "국제인권법은 전 세계 모든 사람의 인권을 보호합니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "국제법의 주요 원천은?", options: ["한 나라 법", "조약, 국제관습법, 법의 일반원칙", "개인 약속", "기업 규정"], answer: 1, explanation: "국제법의 원천은 조약, 국제관습법, 법의 일반원칙입니다." },
        { q: "유엔(UN)의 역할은?", options: ["전쟁 유발", "국제 평화와 안전 유지, 인권 보호", "무역만", "스포츠"], answer: 1, explanation: "유엔은 국제 평화와 안전 유지, 인권 보호를 위해 노력합니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'조약'이란?", options: ["개인 약속", "국가 간에 맺는 공식적인 합의", "비공식 대화", "소문"], answer: 1, explanation: "조약은 국가 간에 맺는 공식적인 합의입니다." },
        { q: "'세계 시민'이란?", options: ["특정 국가만", "국경을 넘어 인류 전체의 문제에 관심을 갖는 사람", "여행자만", "외교관만"], answer: 1, explanation: "세계 시민은 국경을 넘어 인류 전체의 문제에 관심을 갖는 사람입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "국제법이 중요해진 이유는?", options: ["중요하지 않음", "세계화로 국가 간 교류와 문제가 늘어났기 때문", "과거 때문", "형식"], answer: 1, explanation: "세계화로 국가 간 교류와 문제가 늘어나면서 국제법이 중요해졌습니다." },
        { q: "난민 보호가 국제법에서 중요한 이유는?", options: ["필요 없음", "자국을 떠난 사람들의 기본권 보호가 필요하기 때문", "경제 이익", "형식"], answer: 1, explanation: "자국을 떠난 사람들의 기본권 보호가 필요합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "세계 시민으로서 할 수 있는 일은?", options: ["무관심", "국제 문제에 관심 갖고 참여, 다양성 존중", "자국만 생각", "회피"], answer: 1, explanation: "국제 문제에 관심을 갖고 참여하며 다양성을 존중하는 것이 중요합니다." },
        { q: "국제법의 한계로 지적되는 것은?", options: ["완벽함", "강제력이 약하고 강대국의 영향을 받을 수 있음", "너무 강함", "불필요"], answer: 1, explanation: "국제법은 강제력이 약하고 강대국의 영향을 받을 수 있습니다." }
      ]
    }
  },
  law_16: {
    // 주제: 환경법
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "환경법의 목적은?", options: ["개발 촉진", "환경을 보전하고 국민의 건강과 쾌적한 환경 보장", "산업 우선", "이익 추구"], answer: 1, explanation: "환경법은 환경을 보전하고 국민의 건강과 쾌적한 환경을 보장합니다." },
        { q: "환경영향평가란?", options: ["개발 허가", "개발 전에 환경에 미칠 영향을 미리 조사·평가", "사후 조사", "홍보"], answer: 1, explanation: "환경영향평가는 개발 전에 환경에 미칠 영향을 미리 조사·평가하는 것입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "환경법이 필요한 이유는?", options: ["불필요", "환경은 공공재이므로 법으로 보호해야 하기 때문", "기업 이익", "형식"], answer: 1, explanation: "환경은 공공재이므로 법으로 보호해야 합니다." },
        { q: "'오염원인자 부담 원칙'이란?", options: ["국가 부담", "환경을 오염시킨 자가 비용을 부담", "피해자 부담", "무상"], answer: 1, explanation: "오염원인자 부담 원칙은 환경을 오염시킨 자가 비용을 부담하는 것입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'지속가능한 발전'이란?", options: ["무한 개발", "미래 세대도 사용할 수 있도록 환경을 보전하며 발전", "현재만 생각", "환경 파괴"], answer: 1, explanation: "지속가능한 발전은 미래 세대도 사용할 수 있도록 환경을 보전하며 발전하는 것입니다." },
        { q: "'환경권'이란?", options: ["재산권", "깨끗하고 쾌적한 환경에서 살 권리", "개발권", "소유권"], answer: 1, explanation: "환경권은 깨끗하고 쾌적한 환경에서 살 권리입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "기후변화 대응을 위해 국제 협력이 필요한 이유는?", options: ["불필요", "환경 문제는 국경을 넘어 전 지구적으로 영향을 미치기 때문", "한 나라만", "형식"], answer: 1, explanation: "환경 문제는 국경을 넘어 전 지구적으로 영향을 미칩니다." },
        { q: "환경 규제가 경제에 미치는 영향에 대한 논쟁이 있는 이유는?", options: ["논쟁 없음", "환경 보호와 경제 발전 사이의 균형 문제 때문", "모두 찬성", "모두 반대"], answer: 1, explanation: "환경 보호와 경제 발전 사이의 균형 문제로 논쟁이 있습니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "환경 보호를 위해 개인이 할 수 있는 일은?", options: ["무관심", "분리수거, 에너지 절약, 환경 문제에 관심 갖기", "낭비", "무시"], answer: 1, explanation: "분리수거, 에너지 절약, 환경 문제에 관심을 갖는 것이 중요합니다." },
        { q: "환경법을 배우는 의의는?", options: ["시험용", "환경의 중요성을 알고 보호에 참여하기 위해", "암기", "형식"], answer: 1, explanation: "환경의 중요성을 알고 보호에 참여하기 위해 환경법을 배웁니다." }
      ]
    }
  },
  law_17: {
    // 주제: 지식재산권
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "지식재산권이란?", options: ["물건 소유권", "창작물이나 발명에 대한 권리", "토지 소유권", "금융 자산"], answer: 1, explanation: "지식재산권은 창작물이나 발명에 대한 권리입니다." },
        { q: "지식재산권의 종류가 아닌 것은?", options: ["특허권", "저작권", "상표권", "투표권"], answer: 3, explanation: "투표권은 지식재산권이 아닙니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "지식재산권이 보호받는 이유는?", options: ["독점", "창작과 발명을 장려하기 위해", "통제", "형식"], answer: 1, explanation: "지식재산권은 창작과 발명을 장려하기 위해 보호됩니다." },
        { q: "저작권과 특허권의 차이는?", options: ["같음", "저작권은 창작물, 특허권은 발명을 보호", "반대", "관계없음"], answer: 1, explanation: "저작권은 창작물을, 특허권은 발명을 보호합니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'저작권'이란?", options: ["복사권", "문학, 예술 등 창작물을 만든 사람의 권리", "판매권", "소유권"], answer: 1, explanation: "저작권은 문학, 예술 등 창작물을 만든 사람의 권리입니다." },
        { q: "'표절'이란?", options: ["창작", "남의 작품을 자기 것처럼 사용하는 것", "인용", "참고"], answer: 1, explanation: "표절은 남의 작품을 자기 것처럼 사용하는 것입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "디지털 시대에 저작권 문제가 커진 이유는?", options: ["줄어듦", "복제와 공유가 쉬워져 침해가 늘어났기 때문", "기술 부족", "관심 감소"], answer: 1, explanation: "복제와 공유가 쉬워져 저작권 침해가 늘어났습니다." },
        { q: "오픈소스, CCL(크리에이티브 커먼즈)의 의미는?", options: ["모든 권리 포기", "일정 조건 하에 자유로운 사용을 허락하는 방식", "저작권 강화", "불법"], answer: 1, explanation: "오픈소스, CCL은 일정 조건 하에 자유로운 사용을 허락합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "지식재산권을 존중하는 방법은?", options: ["무단 복제", "출처 표시, 허락 받고 사용, 정품 구매", "불법 다운로드", "무시"], answer: 1, explanation: "출처 표시, 허락 받고 사용, 정품 구매가 지식재산권 존중입니다." },
        { q: "지식재산권과 정보 공유의 균형이 필요한 이유는?", options: ["불필요", "창작 보호와 지식 확산 모두 중요하기 때문", "보호만 중요", "공유만 중요"], answer: 1, explanation: "창작 보호와 지식 확산 모두 중요합니다." }
      ]
    }
  },
  law_18: {
    // 주제: 정보와 개인정보 보호
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "개인정보란?", options: ["공개 정보", "특정 개인을 식별할 수 있는 정보", "기업 정보", "국가 기밀"], answer: 1, explanation: "개인정보는 특정 개인을 식별할 수 있는 정보입니다." },
        { q: "개인정보 보호법의 목적은?", options: ["정보 공개", "개인정보의 수집·이용·제공 등을 규율하여 권리 보호", "정보 판매", "감시"], answer: 1, explanation: "개인정보 보호법은 개인정보를 규율하여 권리를 보호합니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "개인정보 처리의 원칙은?", options: ["무제한", "목적 명확, 최소 수집, 동의 기반, 안전 관리", "무단 수집", "마음대로"], answer: 1, explanation: "개인정보는 목적 명확, 최소 수집, 동의 기반, 안전 관리 원칙이 있습니다." },
        { q: "정보 주체의 권리가 아닌 것은?", options: ["열람권", "정정권", "삭제권", "무단 판매권"], answer: 3, explanation: "무단 판매권은 정보 주체의 권리가 아닙니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'정보 자기결정권'이란?", options: ["정보 포기", "자신의 정보에 대해 스스로 통제할 권리", "정보 공개 의무", "감시 허용"], answer: 1, explanation: "정보 자기결정권은 자신의 정보에 대해 스스로 통제할 권리입니다." },
        { q: "'개인정보 유출'이란?", options: ["정상 제공", "허락 없이 개인정보가 외부로 새어나가는 것", "정보 보호", "정보 삭제"], answer: 1, explanation: "개인정보 유출은 허락 없이 개인정보가 외부로 새어나가는 것입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "디지털 시대에 개인정보 보호가 중요해진 이유는?", options: ["중요하지 않음", "온라인 활동 증가로 정보 수집과 유출 위험이 커졌기 때문", "기술 부족", "관심 감소"], answer: 1, explanation: "온라인 활동 증가로 정보 수집과 유출 위험이 커졌습니다." },
        { q: "SNS 사용 시 개인정보 주의가 필요한 이유는?", options: ["필요 없음", "공개된 정보가 악용될 수 있기 때문", "재미있어서", "인기 때문"], answer: 1, explanation: "공개된 정보가 악용될 수 있습니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "개인정보 보호를 위해 할 수 있는 일은?", options: ["무관심", "비밀번호 관리, 개인정보 제공 시 주의, 이용약관 확인", "모든 정보 공개", "비밀번호 공유"], answer: 1, explanation: "비밀번호 관리, 개인정보 제공 시 주의, 이용약관 확인이 중요합니다." },
        { q: "기업의 개인정보 활용과 보호의 균형이 필요한 이유는?", options: ["불필요", "서비스 편의와 개인 권리 보호 모두 중요하기 때문", "기업만 중요", "개인만 중요"], answer: 1, explanation: "서비스 편의와 개인 권리 보호 모두 중요합니다." }
      ]
    }
  },
  law_19: {
    // 주제: 분쟁 해결, 소송과 조정
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "소송이란?", options: ["대화", "법원에 재판을 청구하여 분쟁을 해결하는 방법", "합의", "중재"], answer: 1, explanation: "소송은 법원에 재판을 청구하여 분쟁을 해결하는 방법입니다." },
        { q: "조정이란?", options: ["재판", "제3자가 중간에서 당사자 간 합의를 돕는 방법", "판결", "처벌"], answer: 1, explanation: "조정은 제3자가 중간에서 당사자 간 합의를 돕는 방법입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "분쟁 해결 방법의 종류는?", options: ["소송만", "협상, 조정, 중재, 소송 등 다양함", "폭력", "무시"], answer: 1, explanation: "분쟁 해결에는 협상, 조정, 중재, 소송 등이 있습니다." },
        { q: "소송 전 조정이나 중재를 하는 이유는?", options: ["시간 낭비", "시간과 비용을 절약하고 원만한 해결 가능", "법 무시", "형식"], answer: 1, explanation: "조정이나 중재로 시간과 비용을 절약하고 원만한 해결이 가능합니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'중재'란?", options: ["재판", "제3자가 분쟁을 판정하여 해결하는 방법", "협상", "조정"], answer: 1, explanation: "중재는 제3자가 분쟁을 판정하여 해결하는 방법입니다." },
        { q: "'합의'란?", options: ["일방 결정", "당사자들이 서로 양보하여 의견을 맞추는 것", "판결", "명령"], answer: 1, explanation: "합의는 당사자들이 서로 양보하여 의견을 맞추는 것입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "모든 분쟁을 소송으로 해결하지 않는 이유는?", options: ["소송이 최고", "시간, 비용, 관계 악화 등의 부담 때문", "법원 부족", "형식"], answer: 1, explanation: "시간, 비용, 관계 악화 등의 부담 때문에 다른 방법도 사용합니다." },
        { q: "온라인 분쟁 해결(ODR)이 등장한 이유는?", options: ["불필요", "인터넷 거래 증가로 온라인 분쟁이 늘어났기 때문", "오프라인만", "형식"], answer: 1, explanation: "인터넷 거래 증가로 온라인 분쟁이 늘어나 ODR이 등장했습니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "분쟁 발생 시 바람직한 대처는?", options: ["무조건 소송", "상황에 맞는 적절한 해결 방법 선택", "폭력", "회피"], answer: 1, explanation: "상황에 맞는 적절한 해결 방법을 선택하는 것이 좋습니다." },
        { q: "법적 분쟁을 예방하는 방법은?", options: ["계약 무시", "계약서 작성, 증거 보관, 약속 이행", "구두 약속만", "무관심"], answer: 1, explanation: "계약서 작성, 증거 보관, 약속 이행이 분쟁 예방에 도움됩니다." }
      ]
    }
  },
  law_20: {
    // 주제: 법과 정의
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "법의 목적으로 알맞은 것은?", options: ["통제만", "사회 질서 유지와 정의 실현", "처벌만", "강제만"], answer: 1, explanation: "법의 목적은 사회 질서 유지와 정의 실현입니다." },
        { q: "정의란?", options: ["강자의 이익", "각자에게 마땅히 돌아가야 할 것을 주는 것", "불평등", "차별"], answer: 1, explanation: "정의는 각자에게 마땅히 돌아가야 할 것을 주는 것입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "법과 정의의 관계는?", options: ["무관", "법은 정의를 실현하기 위한 수단", "반대", "법이 정의"], answer: 1, explanation: "법은 정의를 실현하기 위한 수단입니다." },
        { q: "정의로운 법의 조건으로 알맞은 것은?", options: ["강자 편", "공정성, 인권 존중, 민주적 절차로 제정", "비밀리에 제정", "일부만 적용"], answer: 1, explanation: "정의로운 법은 공정성, 인권 존중, 민주적 절차로 제정됩니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'법치주의'란?", options: ["인치", "법에 따라 국가를 운영하는 원리", "무법", "독재"], answer: 1, explanation: "법치주의는 법에 따라 국가를 운영하는 원리입니다." },
        { q: "'절차적 정의'란?", options: ["결과만 중요", "과정과 절차가 공정해야 한다는 원칙", "형식만", "내용만"], answer: 1, explanation: "절차적 정의는 과정과 절차가 공정해야 한다는 원칙입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "악법도 법인가에 대한 논쟁이 있는 이유는?", options: ["논쟁 없음", "법의 형식과 정의의 내용 사이 갈등 때문", "모두 찬성", "모두 반대"], answer: 1, explanation: "법의 형식과 정의의 내용 사이에 갈등이 있기 때문입니다." },
        { q: "법이 시대에 따라 변하는 이유는?", options: ["변하지 않음", "사회의 가치관과 상황이 변하기 때문", "형식", "전통"], answer: 1, explanation: "사회의 가치관과 상황이 변하면서 법도 변합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "더 나은 사회를 위해 시민이 해야 할 일은?", options: ["무관심", "법에 관심 갖고 참여, 불합리한 법 개선 요구", "순응만", "회피"], answer: 1, explanation: "법에 관심을 갖고 참여하며 불합리한 법 개선을 요구하는 것이 중요합니다." },
        { q: "법 앞의 평등이 중요한 이유는?", options: ["형식", "모든 사람이 공정한 대우를 받아야 정의로운 사회", "강자 우선", "차별 허용"], answer: 1, explanation: "모든 사람이 공정한 대우를 받아야 정의로운 사회입니다." }
      ]
    }
  }
};

// 보완학습 함수들 (동그라미 번호, 해설 포함)
const REMEDIAL_FUNCTIONS = `
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

// 각 파일에 REMEDIAL_BANK 데이터 및 함수 추가
for (let i = 11; i <= 20; i++) {
  const num = String(i).padStart(2, '0');
  const key = `law_${num}`;
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'social', `law_${num}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  const remedialData = REMEDIAL_DATA[key];
  if (!remedialData) {
    console.log(`[SKIP] law_${num} - 데이터 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // 이미 window.REMEDIAL_BANK가 있는지 확인
  if (content.includes('window.REMEDIAL_BANK')) {
    console.log(`[SKIP] law_${num} 이미 window.REMEDIAL_BANK 있음`);
    continue;
  }

  // 기존 const REMEDIAL_BANK가 있으면 window.REMEDIAL_BANK로 변경
  if (content.includes('const REMEDIAL_BANK')) {
    content = content.replace(/const REMEDIAL_BANK/g, 'window.REMEDIAL_BANK');
    console.log(`[OK] law_${num} const REMEDIAL_BANK → window.REMEDIAL_BANK 변경`);
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
    console.log(`[OK] law_${num} REMEDIAL_BANK 데이터 추가 완료`);
  } else {
    console.log(`[SKIP] law_${num} - learning-common.js 로드 라인 없음`);
  }
}

console.log('\n✅ law_11~20 REMEDIAL_BANK 데이터 추가 완료!');

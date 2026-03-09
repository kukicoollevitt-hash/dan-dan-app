const fs = require('fs');
const path = require('path');

// fit_chem_11~20 올바른 화학 보완학습 데이터
const CHEM_DATA = {
  fit_chem_11: {
    title: '🧲 금속과 비금속, 물질의 두 얼굴',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "금속의 공통적인 특징이 아닌 것은?", options: ["전기가 잘 통함", "열을 잘 전달함", "광택이 있음", "잘 부서짐"], answer: 3, explanation: "금속은 연성과 전성이 있어 잘 늘어나고 펴지지만, 잘 부서지지 않습니다." },
          { q: "비금속 원소의 예는?", options: ["철", "구리", "산소", "금"], answer: 2, explanation: "산소는 대표적인 비금속 원소입니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "금속이 전기를 잘 통하는 이유는?", options: ["무거워서", "자유 전자가 있어서", "딱딱해서", "반짝여서"], answer: 1, explanation: "금속 내부의 자유 전자가 전류를 운반합니다." },
          { q: "주기율표에서 금속과 비금속의 경계는?", options: ["맨 왼쪽", "계단 모양 선 주변", "맨 오른쪽", "맨 아래"], answer: 1, explanation: "주기율표의 계단 모양 경계선 주변에 준금속이 위치합니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'연성'의 의미로 알맞은 것은?", options: ["잘 부서지는 성질", "얇게 펴지는 성질", "전기가 통하는 성질", "빛나는 성질"], answer: 1, explanation: "연성은 금속을 얇은 판으로 펼 수 있는 성질입니다." },
          { q: "'전성'의 뜻으로 알맞은 것은?", options: ["가루가 되는 성질", "가늘게 늘어나는 성질", "녹는 성질", "타는 성질"], answer: 1, explanation: "전성은 금속을 가는 선으로 뽑을 수 있는 성질입니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "전선이 구리로 만들어지는 이유는?", options: ["예뻐서", "전기 전도성이 좋고 전성이 있어서", "가벼워서", "단단해서"], answer: 1, explanation: "구리는 전기가 잘 통하고 가는 선으로 뽑을 수 있어 전선에 적합합니다." },
          { q: "알루미늄 호일이 얇게 만들어지는 이유는?", options: ["알루미늄이 가벼워서", "알루미늄의 연성 때문에", "알루미늄이 비싸서", "알루미늄이 투명해서"], answer: 1, explanation: "알루미늄은 연성이 좋아 매우 얇은 호일로 만들 수 있습니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "냄비 손잡이를 플라스틱으로 만드는 이유는?", options: ["예뻐서", "열을 잘 전달하지 않아서", "무거워서", "반짝여서"], answer: 1, explanation: "비금속인 플라스틱은 열전도율이 낮아 손을 보호합니다." },
          { q: "반도체 소자에 실리콘을 사용하는 이유는?", options: ["금속이라서", "준금속으로 전기 전도를 조절할 수 있어서", "비싸서", "예뻐서"], answer: 1, explanation: "실리콘은 준금속으로 조건에 따라 전기 전도성을 조절할 수 있습니다." }
        ]
      }
    }
  },
  fit_chem_12: {
    title: '💎 결정과 비결정, 물질의 규칙성',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "결정의 정의로 알맞은 것은?", options: ["불규칙한 배열", "원자가 규칙적으로 배열된 고체", "액체 상태", "기체 상태"], answer: 1, explanation: "결정은 원자나 분자가 규칙적으로 배열된 고체입니다." },
          { q: "비결정(무정형) 물질의 예는?", options: ["소금", "다이아몬드", "유리", "설탕"], answer: 2, explanation: "유리는 원자 배열이 불규칙한 비결정 물질입니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "결정이 특정 모양을 가지는 이유는?", options: ["우연히", "내부 원자 배열이 규칙적이라서", "외부에서 깎아서", "열을 가해서"], answer: 1, explanation: "결정의 외부 모양은 내부의 규칙적인 원자 배열을 반영합니다." },
          { q: "소금 결정이 정육면체인 이유는?", options: ["사람이 자른 것", "나트륨과 염소 이온이 정육면체로 배열되어서", "물에 녹았다 나와서", "뜨거워서"], answer: 1, explanation: "소금의 이온들이 정육면체 구조로 배열되어 있습니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'단위 세포'의 의미로 알맞은 것은?", options: ["가장 큰 덩어리", "결정 구조의 반복 단위", "액체 방울", "기체 분자"], answer: 1, explanation: "단위 세포는 결정 구조에서 반복되는 가장 작은 단위입니다." },
          { q: "'무정형'의 뜻으로 알맞은 것은?", options: ["규칙적인 모양", "일정한 형태가 없음", "단단한 모양", "둥근 모양"], answer: 1, explanation: "무정형은 원자 배열에 규칙성이 없어 일정한 형태가 없는 상태입니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "눈 결정이 육각형인 이유는?", options: ["차가워서", "물 분자가 육각형으로 결합하기 때문", "하늘에서 내려와서", "바람 때문에"], answer: 1, explanation: "물 분자의 결합 각도로 인해 눈 결정은 육각형을 이룹니다." },
          { q: "유리를 천천히 식히면 결정이 될 수 있는 이유는?", options: ["색이 변해서", "원자들이 규칙적으로 배열될 시간이 있어서", "무거워져서", "녹아서"], answer: 1, explanation: "천천히 식으면 원자들이 규칙적 위치를 찾아 결정을 형성할 수 있습니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "보석이 아름다운 이유와 결정의 관계는?", options: ["비싸서", "규칙적 결정 구조가 빛을 특별하게 반사/굴절시켜서", "무거워서", "차가워서"], answer: 1, explanation: "보석의 규칙적인 결정 구조가 빛을 아름답게 반사하고 굴절시킵니다." },
          { q: "강화 유리가 일반 유리보다 강한 이유는?", options: ["더 두꺼워서", "표면에 압축 응력을 만들어서", "더 예뻐서", "더 무거워서"], answer: 1, explanation: "급냉 처리로 표면에 압축 응력을 형성하여 강도를 높입니다." }
        ]
      }
    }
  },
  fit_chem_13: {
    title: '🌊 용액과 농도, 섞임의 정량화',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "용액의 정의로 알맞은 것은?", options: ["섞이지 않는 혼합물", "용질이 용매에 균일하게 녹은 혼합물", "고체만 있는 것", "기체만 있는 것"], answer: 1, explanation: "용액은 용질이 용매에 균일하게 녹아 있는 혼합물입니다." },
          { q: "퍼센트 농도 20%의 의미는?", options: ["용질 20g", "용액 100g 중 용질 20g", "물 20g", "전체 200g"], answer: 1, explanation: "퍼센트 농도는 용액 100g 중 용질의 질량(g)입니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "용액에서 '용질'과 '용매'의 관계는?", options: ["용질이 용매를 녹임", "용매가 용질을 녹임", "둘 다 녹지 않음", "둘 다 기체"], answer: 1, explanation: "용매(주로 물)가 용질을 녹여 용액을 만듭니다." },
          { q: "몰 농도(M)의 정의는?", options: ["용액 1L 중 용질의 몰 수", "용질 1g의 농도", "물 1L의 양", "용질의 질량"], answer: 0, explanation: "몰 농도(M)는 용액 1L에 녹아 있는 용질의 몰 수입니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'포화 용액'의 의미로 알맞은 것은?", options: ["물이 없는 용액", "더 이상 용질이 녹지 않는 용액", "용질이 없는 용액", "색이 진한 용액"], answer: 1, explanation: "포화 용액은 일정 온도에서 용질이 최대로 녹아 있는 상태입니다." },
          { q: "'희석'의 뜻으로 알맞은 것은?", options: ["농도를 높이는 것", "용매를 더해 농도를 낮추는 것", "끓이는 것", "얼리는 것"], answer: 1, explanation: "희석은 용매를 추가하여 농도를 낮추는 것입니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "뜨거운 물에 설탕이 더 잘 녹는 이유는?", options: ["설탕이 녹아서", "온도가 높으면 용해도가 증가해서", "물이 증발해서", "설탕이 가벼워서"], answer: 1, explanation: "대부분의 고체는 온도가 높을수록 용해도가 증가합니다." },
          { q: "10% 소금물 200g에 들어있는 소금의 양은?", options: ["10g", "20g", "100g", "200g"], answer: 1, explanation: "200g × 0.1 = 20g의 소금이 들어 있습니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "의약품 농도를 정확히 맞추는 것이 중요한 이유는?", options: ["예뻐 보이려고", "너무 진하면 위험하고 너무 묽으면 효과가 없어서", "값이 비싸서", "색깔 때문에"], answer: 1, explanation: "의약품은 정확한 농도에서 효과를 발휘하고 안전합니다." },
          { q: "과포화 용액에서 결정이 생기는 조건은?", options: ["가열할 때", "자극(씨결정, 흔들기)을 줄 때", "물을 더할 때", "빛을 비출 때"], answer: 1, explanation: "과포화 용액은 자극에 의해 과잉 용질이 결정으로 석출됩니다." }
        ]
      }
    }
  },
  fit_chem_14: {
    title: '⚖️ 화학 반응식, 물질 변화의 언어',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "화학 반응식에서 계수의 의미는?", options: ["원자 번호", "분자의 개수 비", "온도", "압력"], answer: 1, explanation: "계수는 반응하는 분자의 개수 비를 나타냅니다." },
          { q: "화학 반응식의 균형을 맞추는 이유는?", options: ["예쁘게 보이려고", "질량 보존 법칙을 만족시키려고", "간단하게 하려고", "길게 만들려고"], answer: 1, explanation: "반응 전후 원자의 종류와 개수가 같아야 질량이 보존됩니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "2H₂ + O₂ → 2H₂O에서 수소 분자는 몇 개?", options: ["1개", "2개", "4개", "8개"], answer: 1, explanation: "계수 2는 수소 분자가 2개임을 의미합니다." },
          { q: "반응식에서 '→'의 의미는?", options: ["같다", "반응이 진행됨", "더하기", "빼기"], answer: 1, explanation: "화살표는 반응물이 생성물로 변화함을 나타냅니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'계수'의 의미로 알맞은 것은?", options: ["온도 수치", "분자 앞의 숫자로 개수 비를 나타냄", "원자의 질량", "전자의 수"], answer: 1, explanation: "계수는 화학식 앞에 써서 분자 개수의 비를 나타내는 숫자입니다." },
          { q: "'몰비'의 뜻으로 알맞은 것은?", options: ["질량의 비", "반응하는 물질의 몰 수 비", "부피의 비", "온도의 비"], answer: 1, explanation: "몰비는 반응에 참여하는 물질의 몰 수 비율입니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "수소 4몰과 산소 2몰이 반응하면 물은 몇 몰 생성?", options: ["2몰", "4몰", "6몰", "8몰"], answer: 1, explanation: "2H₂ + O₂ → 2H₂O이므로 4몰 H₂와 2몰 O₂는 4몰 H₂O를 생성합니다." },
          { q: "반응식을 통해 알 수 있는 것이 아닌 것은?", options: ["반응물과 생성물", "몰비", "반응 속도", "원자의 보존"], answer: 2, explanation: "화학 반응식만으로는 반응 속도를 알 수 없습니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "공장에서 화학 반응식이 중요한 이유는?", options: ["장식용", "필요한 원료와 생성물의 양을 계산할 수 있어서", "색깔 때문에", "냄새 때문에"], answer: 1, explanation: "반응식으로 원료량과 생산량을 정확히 계산할 수 있습니다." },
          { q: "한정 반응물이 중요한 이유는?", options: ["가장 비싸서", "반응을 제한하고 생성물의 양을 결정해서", "가장 무거워서", "가장 가벼워서"], answer: 1, explanation: "한정 반응물이 먼저 소모되면 반응이 멈추고 생성물 양이 결정됩니다." }
        ]
      }
    }
  },
  fit_chem_15: {
    title: '⏱️ 반응 속도, 빠름과 느림의 화학',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "반응 속도의 정의로 알맞은 것은?", options: ["반응물의 양", "단위 시간당 반응물 또는 생성물의 농도 변화", "온도의 변화", "압력의 변화"], answer: 1, explanation: "반응 속도는 단위 시간당 반응물 감소나 생성물 증가량입니다." },
          { q: "반응 속도를 빠르게 하는 조건이 아닌 것은?", options: ["온도 높이기", "농도 높이기", "촉매 사용", "압력 낮추기(기체)"], answer: 3, explanation: "기체 반응에서 압력을 높이면(낮추는 것이 아님) 속도가 빨라집니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "온도가 높으면 반응이 빨라지는 이유는?", options: ["분자가 커져서", "분자 운동이 활발해지고 충돌이 많아져서", "분자가 없어져서", "빛이 나서"], answer: 1, explanation: "온도가 높으면 분자 운동이 활발해져 충돌 횟수와 에너지가 증가합니다." },
          { q: "표면적이 넓으면 반응이 빨라지는 이유는?", options: ["예뻐져서", "반응할 수 있는 면이 많아져서", "무거워져서", "색이 변해서"], answer: 1, explanation: "표면적이 넓으면 반응물 접촉 면적이 커져 반응이 빨라집니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'촉매'의 역할로 알맞은 것은?", options: ["반응에 참여하고 소모됨", "반응 속도를 바꾸지만 자신은 변하지 않음", "반응을 막음", "열을 발생시킴"], answer: 1, explanation: "촉매는 반응 속도를 변화시키지만 자신은 소모되지 않습니다." },
          { q: "'활성화 에너지'와 반응 속도의 관계는?", options: ["관계 없음", "활성화 에너지가 낮을수록 반응이 빠름", "활성화 에너지가 높을수록 반응이 빠름", "같음"], answer: 1, explanation: "활성화 에너지가 낮으면 더 많은 분자가 반응할 수 있어 속도가 빨라집니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "냉장고가 음식을 오래 보관하는 원리는?", options: ["음식을 얼려서", "낮은 온도로 화학 반응(부패)을 늦춰서", "공기를 없애서", "빛을 차단해서"], answer: 1, explanation: "낮은 온도에서는 화학 반응 속도가 느려져 부패가 지연됩니다." },
          { q: "알약을 가루로 만들면 효과가 빨라지는 이유는?", options: ["맛있어져서", "표면적이 넓어져 반응이 빨라져서", "가벼워져서", "색이 변해서"], answer: 1, explanation: "가루는 표면적이 넓어 체내에서 빠르게 반응합니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "자동차 배기가스 정화 장치에 촉매가 사용되는 이유는?", options: ["예쁘게 하려고", "유해 물질을 빠르게 분해하기 위해", "소리를 줄이려고", "연료를 절약하려고"], answer: 1, explanation: "촉매 변환 장치가 유해 가스를 빠르게 무해한 물질로 전환합니다." },
          { q: "불꽃놀이에서 금속 가루를 사용하는 이유는?", options: ["무거워서", "표면적이 넓어 빠르게 연소하여 밝은 빛을 내서", "싸서", "안전해서"], answer: 1, explanation: "금속 가루는 표면적이 넓어 빠르게 연소하며 밝은 빛을 냅니다." }
        ]
      }
    }
  },
  fit_chem_16: {
    title: '⚖️ 화학 평형, 반응의 균형 상태',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "화학 평형의 정의로 알맞은 것은?", options: ["반응이 멈춘 상태", "정반응과 역반응 속도가 같은 상태", "반응물만 있는 상태", "생성물만 있는 상태"], answer: 1, explanation: "화학 평형은 정반응과 역반응 속도가 같아 농도가 일정한 상태입니다." },
          { q: "평형 상태에서 반응은?", options: ["완전히 멈춤", "계속 일어남(동적 평형)", "역반응만 일어남", "정반응만 일어남"], answer: 1, explanation: "평형 상태에서도 정반응과 역반응이 같은 속도로 계속 일어납니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "가역 반응의 특징은?", options: ["한 방향으로만 진행", "정반응과 역반응이 모두 일어남", "반응이 안 일어남", "폭발함"], answer: 1, explanation: "가역 반응은 정반응과 역반응이 모두 일어날 수 있습니다." },
          { q: "평형 상수(K)가 큰 반응의 특징은?", options: ["생성물이 적음", "생성물이 많음", "반응이 안 일어남", "반응물만 있음"], answer: 1, explanation: "K가 크면 평형에서 생성물 쪽으로 치우쳐 있습니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'동적 평형'의 의미로 알맞은 것은?", options: ["반응이 멈춤", "반응이 진행 중이지만 농도가 일정함", "움직이는 물체", "평형이 아님"], answer: 1, explanation: "동적 평형은 반응이 계속되지만 전체적으로 변화가 없는 상태입니다." },
          { q: "'르샤틀리에 원리'의 뜻은?", options: ["반응이 멈추는 법칙", "평형이 방해 요인을 줄이는 방향으로 이동", "에너지 보존 법칙", "질량 보존 법칙"], answer: 1, explanation: "르샤틀리에 원리: 평형은 외부 변화를 상쇄하는 방향으로 이동합니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "평형에서 온도를 높이면 흡열 반응 방향으로 이동하는 이유는?", options: ["우연히", "열을 흡수하여 온도 상승을 상쇄하려고", "열을 방출하려고", "압력 때문에"], answer: 1, explanation: "르샤틀리에 원리에 따라 열을 흡수하는 방향으로 평형이 이동합니다." },
          { q: "압력을 높이면 평형이 기체 분자 수가 적은 쪽으로 이동하는 이유는?", options: ["분자가 무거워서", "압력 증가를 줄이려고", "온도가 변해서", "색이 변해서"], answer: 1, explanation: "기체 분자 수가 줄면 압력이 감소하므로 그 방향으로 이동합니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "암모니아 합성(하버 공정)에서 고압을 사용하는 이유는?", options: ["싸서", "기체 몰 수가 적은 생성물 쪽으로 평형을 이동시키려고", "안전해서", "예뻐서"], answer: 1, explanation: "N₂ + 3H₂ ⇌ 2NH₃에서 고압은 분자 수가 적은 NH₃ 쪽으로 평형을 이동시킵니다." },
          { q: "혈액의 pH가 일정하게 유지되는 원리는?", options: ["운동 때문", "완충 용액으로서 화학 평형이 pH 변화를 상쇄", "물을 마셔서", "숨을 쉬어서만"], answer: 1, explanation: "혈액은 완충 용액으로 화학 평형을 통해 pH를 일정하게 유지합니다." }
        ]
      }
    }
  },
  fit_chem_17: {
    title: '🔌 전기화학, 전기와 화학의 만남',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "전지의 원리는?", options: ["열에너지를 전기로 변환", "화학 에너지를 전기 에너지로 변환", "빛에너지를 전기로 변환", "운동에너지를 전기로 변환"], answer: 1, explanation: "전지는 화학 반응의 에너지를 전기 에너지로 바꿉니다." },
          { q: "전기 분해와 전지의 차이는?", options: ["같다", "전기 분해는 전기로 반응을 일으키고 전지는 반응으로 전기를 생성", "둘 다 빛을 사용", "둘 다 열을 사용"], answer: 1, explanation: "전기 분해는 전기→화학, 전지는 화학→전기 변환입니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "전지에서 (-)극에서 일어나는 반응은?", options: ["환원", "산화", "중화", "용해"], answer: 1, explanation: "(-)극에서는 금속이 전자를 잃는 산화 반응이 일어납니다." },
          { q: "전지에서 (+)극에서 일어나는 반응은?", options: ["산화", "환원", "연소", "용해"], answer: 1, explanation: "(+)극에서는 이온이 전자를 얻는 환원 반응이 일어납니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'전해질'과 전지의 관계는?", options: ["관계 없음", "전해질이 이온을 전달하여 회로를 완성", "전해질이 전기를 막음", "전해질이 열을 발생"], answer: 1, explanation: "전해질은 이온을 통해 전하를 운반하여 전지 회로를 완성합니다." },
          { q: "'갈바니 전지'의 특징은?", options: ["전기를 사용함", "자발적 반응으로 전기를 생성", "열만 발생", "빛만 발생"], answer: 1, explanation: "갈바니 전지는 자발적 화학 반응으로 전기를 생성합니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "건전지가 다 쓰면 작동 안 하는 이유는?", options: ["무거워져서", "화학 반응에 필요한 물질이 소모되어서", "모양이 변해서", "색이 변해서"], answer: 1, explanation: "반응물이 소모되면 더 이상 화학 반응이 일어나지 않습니다." },
          { q: "충전지가 재사용 가능한 이유는?", options: ["새 물질이 들어와서", "전기를 가하면 반응이 역으로 진행되어 반응물이 재생되어서", "크기가 변해서", "온도가 변해서"], answer: 1, explanation: "충전 시 역반응이 일어나 원래 반응물이 재생됩니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "전기차 배터리로 리튬이온 전지가 사용되는 이유는?", options: ["예뻐서", "에너지 밀도가 높고 충전이 가능해서", "싸서", "무거워서"], answer: 1, explanation: "리튬이온 전지는 가볍고 에너지 밀도가 높으며 충전이 가능합니다." },
          { q: "연료 전지가 친환경적인 이유는?", options: ["비싸서", "수소와 산소 반응으로 물만 배출해서", "크기가 커서", "소리가 커서"], answer: 1, explanation: "연료 전지는 수소와 산소가 반응하여 물만 생성하므로 오염이 없습니다." }
        ]
      }
    }
  },
  fit_chem_18: {
    title: '🧴 고분자 화합물, 거대 분자의 세계',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "고분자의 정의로 알맞은 것은?", options: ["작은 분자", "단위체가 반복 연결된 큰 분자", "원자 하나", "이온"], answer: 1, explanation: "고분자는 단위체(모노머)가 많이 연결된 거대 분자입니다." },
          { q: "천연 고분자의 예가 아닌 것은?", options: ["단백질", "녹말", "셀룰로오스", "플라스틱"], answer: 3, explanation: "플라스틱은 합성 고분자이고, 나머지는 천연 고분자입니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "단위체(모노머)와 중합체(폴리머)의 관계는?", options: ["같다", "단위체가 연결되어 중합체가 됨", "중합체가 쪼개져 단위체가 됨", "관계 없음"], answer: 1, explanation: "많은 단위체가 화학 결합으로 연결되어 중합체를 형성합니다." },
          { q: "열가소성 플라스틱의 특징은?", options: ["열을 가해도 변하지 않음", "열을 가하면 녹아 다시 성형 가능", "열에 타버림", "열을 가하면 단단해짐"], answer: 1, explanation: "열가소성 플라스틱은 열을 가하면 녹고 식으면 굳어 재성형이 가능합니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'중합 반응'의 의미로 알맞은 것은?", options: ["분해 반응", "단위체가 연결되어 고분자를 만드는 반응", "연소 반응", "중화 반응"], answer: 1, explanation: "중합 반응은 작은 분자들이 연결되어 큰 분자를 만드는 반응입니다." },
          { q: "'열경화성'의 뜻으로 알맞은 것은?", options: ["열로 녹음", "한번 굳으면 열을 가해도 녹지 않음", "열에 약함", "열을 흡수함"], answer: 1, explanation: "열경화성 플라스틱은 한번 성형되면 열을 가해도 녹지 않습니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "페트병 재활용이 가능한 이유는?", options: ["천연 물질이라", "열가소성이라 녹여서 다시 성형할 수 있어서", "비싸서", "무거워서"], answer: 1, explanation: "페트(PET)는 열가소성 플라스틱으로 녹여서 재활용할 수 있습니다." },
          { q: "고무가 탄력이 있는 이유는?", options: ["딱딱해서", "고분자 사슬이 구부러지고 펴질 수 있어서", "액체라서", "기체라서"], answer: 1, explanation: "고무의 긴 고분자 사슬이 늘어났다 원래대로 돌아오는 탄성을 줍니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "생분해성 플라스틱의 장점은?", options: ["더 단단함", "미생물에 의해 분해되어 환경 오염을 줄임", "더 예쁨", "더 저렴함"], answer: 1, explanation: "생분해성 플라스틱은 자연에서 분해되어 환경 부담을 줄입니다." },
          { q: "나일론이 천연 섬유를 대체한 이유는?", options: ["자연에서 나서", "강하고 탄력 있으며 대량 생산이 가능해서", "무거워서", "비싸서"], answer: 1, explanation: "나일론은 강도와 탄력이 우수하고 대량 생산이 가능합니다." }
        ]
      }
    }
  },
  fit_chem_19: {
    title: '💊 생활 속 화학, 일상의 과학',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "세제가 때를 빼는 원리는?", options: ["때를 태움", "계면활성제가 물과 기름을 섞이게 해서", "때를 얼림", "때를 녹임"], answer: 1, explanation: "계면활성제가 물과 기름 모두에 친화력이 있어 때를 제거합니다." },
          { q: "표백제의 작용 원리는?", options: ["색소를 칠함", "산화 또는 환원으로 색소를 분해", "색소를 흡수", "색소를 숨김"], answer: 1, explanation: "표백제는 색소를 산화 또는 환원시켜 무색으로 만듭니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "계면활성제의 구조적 특징은?", options: ["전부 물을 좋아함", "친수성 부분과 친유성 부분이 함께 있음", "전부 기름을 좋아함", "둘 다 싫어함"], answer: 1, explanation: "계면활성제는 물을 좋아하는 부분과 기름을 좋아하는 부분이 모두 있습니다." },
          { q: "산성 세제와 염기성 세제의 용도 차이는?", options: ["같다", "산성은 물때, 염기성은 기름때 제거에 효과적", "둘 다 물때 제거", "둘 다 기름때 제거"], answer: 1, explanation: "산성 세제는 물때(칼슘), 염기성 세제는 기름때에 효과적입니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'계면활성제'의 '계면'이 의미하는 것은?", options: ["표면 전체", "두 물질이 만나는 경계면", "물 속", "공기 중"], answer: 1, explanation: "계면은 물과 기름처럼 서로 다른 물질이 만나는 경계면입니다." },
          { q: "'방부제'의 역할로 알맞은 것은?", options: ["맛을 좋게 함", "미생물 번식을 억제하여 부패를 방지", "색을 예쁘게 함", "영양을 높임"], answer: 1, explanation: "방부제는 식품의 미생물 번식을 억제하여 신선도를 유지합니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "비누로 손을 씻으면 세균이 제거되는 이유는?", options: ["비누가 세균을 태워서", "계면활성제가 세균과 기름막을 물에 씻겨 나가게 해서", "비누가 세균을 먹어서", "비누가 세균을 얼려서"], answer: 1, explanation: "비누의 계면활성 작용이 세균을 둘러싼 기름막과 함께 씻어냅니다." },
          { q: "냉장고에서 음식 냄새가 섞이지 않게 하려면?", options: ["문을 열어두기", "밀폐 용기 사용", "음식을 섞기", "냉장고를 끄기"], answer: 1, explanation: "밀폐 용기로 냄새 분자의 이동을 차단합니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "세제를 너무 많이 쓰면 안 좋은 이유는?", options: ["돈이 아까워서", "수질 오염과 잔류 성분 문제", "효과가 떨어져서", "색이 변해서"], answer: 1, explanation: "과다 사용은 수질 오염을 일으키고 옷에 잔류할 수 있습니다." },
          { q: "염소계 표백제와 산성 세제를 섞으면 위험한 이유는?", options: ["효과가 좋아서", "유독한 염소 가스가 발생해서", "색이 변해서", "냄새가 좋아서"], answer: 1, explanation: "두 물질이 반응하여 유독한 염소 가스가 발생합니다." }
        ]
      }
    }
  },
  fit_chem_20: {
    title: '🌍 환경과 화학, 지구를 지키는 과학',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "지구 온난화의 주요 원인 물질은?", options: ["산소", "이산화탄소", "질소", "헬륨"], answer: 1, explanation: "이산화탄소 등 온실가스가 지구 온난화의 주요 원인입니다." },
          { q: "오존층 파괴의 주요 원인 물질은?", options: ["산소", "이산화탄소", "프레온가스(CFCs)", "질소"], answer: 2, explanation: "프레온가스(염화불화탄소)가 오존층을 파괴합니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "온실효과의 원리는?", options: ["열을 반사", "온실가스가 지구 복사열을 흡수하여 대기를 따뜻하게 함", "열을 우주로 방출", "열을 차단"], answer: 1, explanation: "온실가스가 지구에서 나가는 열을 흡수하여 대기를 따뜻하게 합니다." },
          { q: "산성비가 생기는 과정은?", options: ["물이 증발해서", "대기 오염 물질이 빗물에 녹아 산성이 됨", "비가 산을 통과해서", "햇빛 때문에"], answer: 1, explanation: "대기 중 SO₂, NOₓ 등이 빗물에 녹아 산성비가 됩니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'온실가스'의 예로 알맞은 것은?", options: ["산소", "질소", "메탄", "헬륨"], answer: 2, explanation: "메탄, 이산화탄소, 아산화질소 등이 온실가스입니다." },
          { q: "'탄소 발자국'의 의미는?", options: ["발자국 모양", "개인이나 활동이 배출하는 온실가스 양", "탄소의 크기", "탄소의 색깔"], answer: 1, explanation: "탄소 발자국은 활동으로 인해 발생하는 온실가스 총량입니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "화석 연료 사용을 줄이면 좋은 이유는?", options: ["비싸서", "온실가스와 대기 오염을 줄일 수 있어서", "불편해서", "예뻐서"], answer: 1, explanation: "화석 연료 연소는 온실가스와 오염 물질의 주요 원인입니다." },
          { q: "재활용이 환경에 좋은 이유는?", options: ["재미있어서", "자원과 에너지 절약, 폐기물 감소", "더 비싸서", "더 무거워서"], answer: 1, explanation: "재활용은 새 자원 채취와 에너지 사용을 줄이고 폐기물을 감소시킵니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "탄소 중립이 중요한 이유는?", options: ["돈을 벌려고", "배출 탄소와 흡수 탄소를 같게 하여 온난화를 막기 위해", "탄소가 예뻐서", "탄소가 비싸서"], answer: 1, explanation: "탄소 중립은 온실가스 순배출을 0으로 만들어 온난화를 막습니다." },
          { q: "친환경 에너지로 전환해야 하는 이유는?", options: ["전통적이라서", "온실가스와 환경오염을 줄여 지속가능한 발전을 위해", "더 비싸서", "더 불편해서"], answer: 1, explanation: "친환경 에너지는 환경 오염 없이 지속 가능한 발전을 가능하게 합니다." }
        ]
      }
    }
  }
};

// 교체 실행
for (let i = 11; i <= 20; i++) {
  const num = String(i).padStart(2, '0');
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'science', `fit_chem_${num}.html`);
  const key = `fit_chem_${num}`;

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  if (!CHEM_DATA[key]) {
    console.log(`[SKIP] ${key} 데이터 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const chemData = CHEM_DATA[key];

  // 기존 잘못된 REMEDIAL_BANK 블록 찾기 (여러 패턴)
  const inlinePattern = /\/\/ ===== 보완학습 문제 뱅크 \(객관식 2문제씩\) =====\s*\/\/ window 객체로 덮어써서[^\n]*\n\s*window\.REMEDIAL_BANK = \{[\s\S]*?\n    \};/;

  const inlinePattern2 = /\/\/ ===== 보완학습 문제 뱅크 \(객관식 2문제씩\) =====\s*window\.REMEDIAL_BANK = \{[\s\S]*?\n    \};/;

  // 패턴 3: const REMEDIAL_BANK (window 없이 선언된 경우)
  const inlinePattern3 = /\/\/ ===== 보완학습 문제 뱅크 \(객관식 2문제씩\) =====\s*const REMEDIAL_BANK = \{[\s\S]*?\n    \};/;

  // 새로운 REMEDIAL_BANK 블록 생성
  const newBlock = `// ===== 보완학습 문제 뱅크 (객관식 2문제씩) =====
    // window 객체로 덮어써서 페이지별 문제 뱅크 사용 - ${chemData.title}
    window.REMEDIAL_BANK = {
      "literal": {
            "title": "${chemData.problems.literal.title}",
            "problems": [
                  ${chemData.problems.literal.problems.map(p => `{
                        "q": "${p.q}",
                        "options": ${JSON.stringify(p.options)},
                        "answer": ${p.answer},
                        "explanation": "${p.explanation}"
                  }`).join(',\n                  ')}
            ]
      },
      "structural": {
            "title": "${chemData.problems.structural.title}",
            "problems": [
                  ${chemData.problems.structural.problems.map(p => `{
                        "q": "${p.q}",
                        "options": ${JSON.stringify(p.options)},
                        "answer": ${p.answer},
                        "explanation": "${p.explanation}"
                  }`).join(',\n                  ')}
            ]
      },
      "lexical": {
            "title": "${chemData.problems.lexical.title}",
            "problems": [
                  ${chemData.problems.lexical.problems.map(p => `{
                        "q": "${p.q}",
                        "options": ${JSON.stringify(p.options)},
                        "answer": ${p.answer},
                        "explanation": "${p.explanation}"
                  }`).join(',\n                  ')}
            ]
      },
      "inferential": {
            "title": "${chemData.problems.inferential.title}",
            "problems": [
                  ${chemData.problems.inferential.problems.map(p => `{
                        "q": "${p.q}",
                        "options": ${JSON.stringify(p.options)},
                        "answer": ${p.answer},
                        "explanation": "${p.explanation}"
                  }`).join(',\n                  ')}
            ]
      },
      "critical": {
            "title": "${chemData.problems.critical.title}",
            "problems": [
                  ${chemData.problems.critical.problems.map(p => `{
                        "q": "${p.q}",
                        "options": ${JSON.stringify(p.options)},
                        "answer": ${p.answer},
                        "explanation": "${p.explanation}"
                  }`).join(',\n                  ')}
            ]
      }
    };`;

  let modified = false;

  if (inlinePattern.test(content)) {
    content = content.replace(inlinePattern, newBlock);
    modified = true;
  } else if (inlinePattern2.test(content)) {
    content = content.replace(inlinePattern2, newBlock);
    modified = true;
  } else if (inlinePattern3.test(content)) {
    content = content.replace(inlinePattern3, newBlock);
    modified = true;
  }

  // REMEDIAL_BANK 참조를 window.REMEDIAL_BANK로 수정
  if (modified) {
    content = content.replace(/const data = REMEDIAL_BANK\[key\];/g, 'const data = window.REMEDIAL_BANK[key];');
    content = content.replace(/for \(const key in REMEDIAL_BANK\)/g, 'for (const key in window.REMEDIAL_BANK)');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[OK] fit_chem_${num} REMEDIAL_BANK 교체 완료 - ${chemData.title}`);
  } else {
    console.log(`[SKIP] fit_chem_${num} 패턴 불일치 - 수동 확인 필요`);
  }
}

console.log('\n✅ fit_chem_11~20 REMEDIAL_BANK 교체 완료!');

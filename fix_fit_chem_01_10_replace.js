const fs = require('fs');
const path = require('path');

// fit_chem_01~10 올바른 화학 보완학습 데이터
const CHEM_DATA = {
  fit_chem_01: {
    title: '⚗️ 물질의 성질, 세상을 이루는 다양한 물질',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "물질의 정의로 알맞은 것은?", options: ["눈에 보이는 것만", "공간을 차지하고 질량을 가진 것", "만질 수 있는 것만", "색깔이 있는 것"], answer: 1, explanation: "물질은 공간을 차지하고 질량을 가진 모든 것입니다." },
          { q: "물질의 세 가지 상태가 아닌 것은?", options: ["고체", "액체", "기체", "빛"], answer: 3, explanation: "물질의 세 가지 상태는 고체, 액체, 기체입니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "이 글에서 물질의 성질로 설명한 것은?", options: ["색깔, 냄새, 맛", "크기만", "무게만", "모양만"], answer: 0, explanation: "물질의 성질에는 색깔, 냄새, 맛 등이 포함됩니다." },
          { q: "물질을 구분하는 기준으로 알맞지 않은 것은?", options: ["녹는점", "끓는점", "밀도", "기분"], answer: 3, explanation: "물질은 녹는점, 끓는점, 밀도 등 물리적 성질로 구분합니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'밀도'의 의미로 알맞은 것은?", options: ["물질의 색깔", "단위 부피당 질량", "물질의 온도", "물질의 크기"], answer: 1, explanation: "밀도는 단위 부피당 질량으로, 물질의 빽빽한 정도를 나타냅니다." },
          { q: "'용해'의 뜻으로 알맞은 것은?", options: ["물질이 녹아 섞이는 것", "물질이 굳는 것", "물질이 타는 것", "물질이 얼어붙는 것"], answer: 0, explanation: "용해는 물질이 액체에 녹아 고르게 섞이는 현상입니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "얼음이 물에 뜨는 이유는?", options: ["얼음이 가벼워서", "얼음의 밀도가 물보다 작아서", "물이 무거워서", "얼음이 차가워서"], answer: 1, explanation: "얼음은 물보다 밀도가 작아서 물에 뜹니다." },
          { q: "설탕이 물에 녹으면 설탕은?", options: ["사라진다", "물과 함께 존재한다", "기체가 된다", "더 무거워진다"], answer: 1, explanation: "설탕은 물에 녹아도 사라지지 않고 물과 함께 존재합니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "금과 구리를 구별하는 가장 좋은 방법은?", options: ["크기 비교", "밀도 측정", "냄새 맡기", "소리 듣기"], answer: 1, explanation: "밀도는 물질마다 고유하므로 밀도 측정으로 구별할 수 있습니다." },
          { q: "요리할 때 소금이 물에 녹는 것을 활용하는 예는?", options: ["국에 간을 맞출 때", "불을 끌 때", "채소를 자를 때", "접시를 닦을 때"], answer: 0, explanation: "소금이 물에 녹는 성질을 이용해 국에 간을 맞춥니다." }
        ]
      }
    }
  },
  fit_chem_02: {
    title: '🔬 원소와 원자, 물질을 이루는 가장 작은 단위',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "원자의 정의로 알맞은 것은?", options: ["큰 덩어리", "물질을 이루는 가장 작은 단위", "눈에 보이는 알갱이", "공기의 일종"], answer: 1, explanation: "원자는 물질을 이루는 가장 작은 단위입니다." },
          { q: "원소란 무엇인가요?", options: ["여러 원자가 섞인 것", "같은 종류의 원자로만 이루어진 물질", "분자의 일종", "혼합물"], answer: 1, explanation: "원소는 한 종류의 원자로만 이루어진 순수한 물질입니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "원자의 구조에서 중심에 있는 것은?", options: ["전자", "원자핵", "분자", "이온"], answer: 1, explanation: "원자의 중심에는 양성자와 중성자로 이루어진 원자핵이 있습니다." },
          { q: "전자가 있는 위치는?", options: ["원자핵 안", "원자핵 주위", "원자 밖", "분자 안"], answer: 1, explanation: "전자는 원자핵 주위를 돌고 있습니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'양성자'의 특징은?", options: ["(-)전하를 띰", "(+)전하를 띰", "전하가 없음", "원자 밖에 있음"], answer: 1, explanation: "양성자는 (+)전하를 띠며 원자핵 안에 있습니다." },
          { q: "'중성자'의 뜻으로 알맞은 것은?", options: ["전하를 띠지 않는 입자", "(+)전하 입자", "(-)전하 입자", "전자와 같은 입자"], answer: 0, explanation: "중성자는 전하를 띠지 않는 중성 입자입니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "원자 번호가 같으면 어떤 것이 같나요?", options: ["질량수", "양성자 수", "중성자 수", "전자 수만"], answer: 1, explanation: "원자 번호는 양성자 수와 같습니다." },
          { q: "탄소 원자가 모여 만들어질 수 있는 것은?", options: ["물", "다이아몬드", "소금", "설탕"], answer: 1, explanation: "다이아몬드는 탄소 원자만으로 이루어져 있습니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "금 원자를 쪼개면 금이 아니게 되는 이유는?", options: ["색이 변해서", "원자가 원소의 성질을 결정하므로", "크기가 작아져서", "무게가 줄어서"], answer: 1, explanation: "원소의 성질은 그 원소를 이루는 원자에 의해 결정됩니다." },
          { q: "주기율표에서 같은 세로줄에 있는 원소들의 공통점은?", options: ["질량이 같다", "화학적 성질이 비슷하다", "색깔이 같다", "크기가 같다"], answer: 1, explanation: "같은 족(세로줄) 원소들은 화학적 성질이 비슷합니다." }
        ]
      }
    }
  },
  fit_chem_03: {
    title: '🧪 분자의 세계, 원자들의 결합',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "분자의 정의로 알맞은 것은?", options: ["원자 하나", "두 개 이상의 원자가 결합한 것", "원소의 다른 이름", "이온의 집합"], answer: 1, explanation: "분자는 두 개 이상의 원자가 화학 결합으로 이어진 것입니다." },
          { q: "물 분자(H₂O)를 이루는 원소는?", options: ["수소와 산소", "수소와 질소", "탄소와 산소", "탄소와 수소"], answer: 0, explanation: "물 분자는 수소 원자 2개와 산소 원자 1개로 이루어져 있습니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "이산화탄소(CO₂)의 구조는?", options: ["탄소 1개, 산소 2개", "탄소 2개, 산소 1개", "탄소 2개, 산소 2개", "탄소 1개, 산소 1개"], answer: 0, explanation: "CO₂는 탄소 원자 1개에 산소 원자 2개가 결합한 구조입니다." },
          { q: "분자식 H₂에서 아래 숫자 2가 의미하는 것은?", options: ["분자 2개", "수소 원자 2개", "수소의 무게", "산소 2개"], answer: 1, explanation: "아래 첨자 2는 수소 원자가 2개임을 나타냅니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'화학 결합'의 의미로 알맞은 것은?", options: ["원자들이 힘으로 연결되는 것", "원자들이 멀어지는 것", "원자가 사라지는 것", "분자가 커지는 것"], answer: 0, explanation: "화학 결합은 원자들이 전자를 공유하거나 주고받아 연결되는 것입니다." },
          { q: "'공유 결합'의 뜻으로 알맞은 것은?", options: ["전자를 뺏는 것", "전자를 함께 나누어 쓰는 결합", "양이온끼리의 결합", "금속 결합"], answer: 1, explanation: "공유 결합은 원자들이 전자를 함께 나누어 쓰는 결합입니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "산소 기체(O₂)와 오존(O₃)이 다른 이유는?", options: ["원소가 달라서", "원자 배열과 개수가 달라서", "색깔이 달라서", "온도가 달라서"], answer: 1, explanation: "같은 산소 원자지만 결합한 개수와 배열이 달라 성질이 다릅니다." },
          { q: "포도당(C₆H₁₂O₆)을 이루는 원소의 종류는?", options: ["1가지", "2가지", "3가지", "6가지"], answer: 2, explanation: "포도당은 탄소(C), 수소(H), 산소(O) 3가지 원소로 이루어져 있습니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "다이아몬드와 흑연이 같은 원소로 되어 있지만 다른 이유는?", options: ["원자 개수가 달라서", "원자 배열 구조가 달라서", "원자 색깔이 달라서", "원자 크기가 달라서"], answer: 1, explanation: "탄소 원자의 배열 구조 차이로 성질이 완전히 달라집니다." },
          { q: "분자 모형을 만들 때 공과 막대를 사용하는 이유는?", options: ["예쁘게 보이려고", "원자와 결합을 표현하기 위해", "크기를 재려고", "색을 나타내려고"], answer: 1, explanation: "공은 원자를, 막대는 원자 간의 결합을 나타냅니다." }
        ]
      }
    }
  },
  fit_chem_04: {
    title: '🔥 화학 반응, 물질의 변신',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "화학 반응의 정의로 알맞은 것은?", options: ["물질의 모양만 변하는 것", "물질이 다른 물질로 변하는 것", "물질의 온도만 변하는 것", "물질의 위치가 변하는 것"], answer: 1, explanation: "화학 반응은 물질이 완전히 다른 성질의 물질로 변하는 것입니다." },
          { q: "연소 반응에 필요한 것이 아닌 것은?", options: ["산소", "열", "탈 물질", "물"], answer: 3, explanation: "연소에는 산소, 열, 탈 물질(연료)이 필요합니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "화학 반응식에서 화살표(→)의 의미는?", options: ["같다", "반응 방향", "더하기", "빼기"], answer: 1, explanation: "화살표는 반응물이 생성물로 변하는 방향을 나타냅니다." },
          { q: "화학 반응에서 변하지 않는 것은?", options: ["물질의 성질", "원자의 종류와 개수", "분자의 모양", "물질의 색깔"], answer: 1, explanation: "화학 반응에서 원자는 새로 생기거나 없어지지 않습니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'반응물'의 의미로 알맞은 것은?", options: ["반응 후 생기는 물질", "반응 전의 물질", "촉매", "용매"], answer: 1, explanation: "반응물은 화학 반응이 일어나기 전 처음에 있는 물질입니다." },
          { q: "'생성물'의 뜻으로 알맞은 것은?", options: ["반응 전 물질", "반응 후 새로 만들어진 물질", "변하지 않는 물질", "원래 물질"], answer: 1, explanation: "생성물은 화학 반응 후 새로 만들어진 물질입니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "양초가 탈 때 줄어드는 이유는?", options: ["녹아서 흘러내려서", "기체로 변해 날아가서", "빛이 되어서", "열이 되어서"], answer: 1, explanation: "양초가 타면 이산화탄소와 수증기(기체)로 변해 공기 중으로 날아갑니다." },
          { q: "쇠가 녹스는 것도 화학 반응인 이유는?", options: ["색만 변해서", "쇠가 산소와 결합해 새로운 물질이 되어서", "모양이 변해서", "크기가 줄어서"], answer: 1, explanation: "녹은 철과 산소가 결합해 산화철이라는 새 물질이 생깁니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "음식물이 상하는 것을 늦추려면?", options: ["햇빛에 두기", "냉장 보관하기", "따뜻한 곳에 두기", "물에 담그기"], answer: 1, explanation: "낮은 온도에서는 화학 반응(부패)이 느려집니다." },
          { q: "베이킹파우더가 빵을 부풀게 하는 원리는?", options: ["물을 흡수해서", "화학 반응으로 기체가 생겨서", "열을 내서", "색이 변해서"], answer: 1, explanation: "베이킹파우더가 반응하며 이산화탄소 기체가 생겨 빵이 부풉니다." }
        ]
      }
    }
  },
  fit_chem_05: {
    title: '💧 산과 염기, 신맛과 쓴맛의 비밀',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "산성 물질의 공통적인 맛은?", options: ["단맛", "신맛", "쓴맛", "짠맛"], answer: 1, explanation: "산성 물질은 대체로 신맛이 납니다." },
          { q: "염기성 물질의 특징은?", options: ["신맛", "미끌미끌한 느낌", "달콤한 맛", "바삭한 느낌"], answer: 1, explanation: "염기성 물질은 만지면 미끌미끌한 느낌이 납니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "pH가 7보다 작으면?", options: ["중성", "산성", "염기성", "알 수 없음"], answer: 1, explanation: "pH 7 미만은 산성입니다." },
          { q: "pH가 7보다 크면?", options: ["산성", "중성", "염기성", "약산성"], answer: 2, explanation: "pH 7 초과는 염기성(알칼리성)입니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'중화 반응'의 의미로 알맞은 것은?", options: ["산과 염기가 만나 성질이 약해지는 반응", "물이 끓는 반응", "금속이 녹는 반응", "기체가 생기는 반응"], answer: 0, explanation: "중화 반응은 산과 염기가 만나 서로의 성질을 약화시키는 반응입니다." },
          { q: "'지시약'의 뜻으로 알맞은 것은?", options: ["물을 표시하는 약", "산과 염기를 구별하는 약품", "음식을 만드는 약", "병을 치료하는 약"], answer: 1, explanation: "지시약은 용액이 산성인지 염기성인지 색 변화로 알려주는 물질입니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "레몬즙에 리트머스 종이를 넣으면?", options: ["파란색으로 변함", "붉은색으로 변함", "변하지 않음", "녹색으로 변함"], answer: 1, explanation: "레몬즙은 산성이라 파란 리트머스 종이를 붉게 변화시킵니다." },
          { q: "속 쓰릴 때 제산제를 먹는 이유는?", options: ["영양 보충", "염기성 약으로 위산을 중화하려고", "단맛을 내려고", "수분 보충"], answer: 1, explanation: "제산제는 염기성이라 위의 과다한 산을 중화시킵니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "산성비가 대리석 조각상을 손상시키는 이유는?", options: ["비가 무거워서", "산이 대리석을 화학적으로 녹이기 때문", "비가 차가워서", "바람이 불어서"], answer: 1, explanation: "산성비의 산 성분이 대리석(탄산칼슘)과 반응해 녹입니다." },
          { q: "손 세정제가 미끌미끌한 이유는?", options: ["물이 많아서", "염기성 성분이 있어서", "기름이 있어서", "향이 있어서"], answer: 1, explanation: "대부분의 세정제에는 염기성 성분이 포함되어 있습니다." }
        ]
      }
    }
  },
  fit_chem_06: {
    title: '⚡ 산화와 환원, 전자의 이동',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "산화의 정의로 알맞은 것은?", options: ["산소를 잃는 것", "산소와 결합하거나 전자를 잃는 것", "물과 결합하는 것", "열을 잃는 것"], answer: 1, explanation: "산화는 산소와 결합하거나 전자를 잃는 반응입니다." },
          { q: "환원의 정의로 알맞은 것은?", options: ["산소와 결합", "산소를 잃거나 전자를 얻는 것", "물을 흡수하는 것", "열을 얻는 것"], answer: 1, explanation: "환원은 산소를 잃거나 전자를 얻는 반응입니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "산화와 환원이 항상 함께 일어나는 이유는?", options: ["우연히", "한쪽이 전자를 잃으면 다른 쪽이 얻기 때문", "열 때문에", "빛 때문에"], answer: 1, explanation: "산화 환원 반응에서 전자는 이동하므로 한쪽이 잃으면 다른 쪽이 얻습니다." },
          { q: "연소 반응에서 산화되는 것은?", options: ["산소", "연료(탈 물질)", "물", "이산화탄소"], answer: 1, explanation: "연료가 산소와 결합하므로 연료가 산화됩니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'녹'의 화학적 의미는?", options: ["금속이 물에 녹음", "금속이 산화된 것", "금속이 녹아내림", "금속이 부서짐"], answer: 1, explanation: "녹은 철이 산소와 반응하여 산화된 산화철입니다." },
          { q: "'부식'의 뜻으로 알맞은 것은?", options: ["물체가 커지는 것", "금속이 화학 반응으로 손상되는 것", "물체가 딱딱해지는 것", "색이 변하는 것"], answer: 1, explanation: "부식은 금속이 산화 등 화학 반응으로 손상되는 현상입니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "철에 페인트를 칠하면 녹이 덜 스는 이유는?", options: ["예뻐져서", "공기(산소)와의 접촉을 막아서", "무거워져서", "차가워져서"], answer: 1, explanation: "페인트가 철과 산소의 접촉을 막아 산화를 방지합니다." },
          { q: "광합성에서 이산화탄소에 일어나는 반응은?", options: ["산화", "환원", "중화", "용해"], answer: 1, explanation: "광합성에서 이산화탄소는 산소를 잃고 포도당이 되므로 환원됩니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "과일을 자른 후 갈변하는 것을 막으려면?", options: ["햇빛에 두기", "레몬즙 뿌리기(산화 방지)", "따뜻한 곳에 두기", "오래 방치하기"], answer: 1, explanation: "레몬즙의 비타민C가 산화를 막아 갈변을 늦춥니다." },
          { q: "손난로가 따뜻해지는 원리는?", options: ["물이 끓어서", "철 가루가 산화하며 열을 내서", "전기가 흘러서", "압력이 높아져서"], answer: 1, explanation: "손난로 안의 철 가루가 산소와 반응(산화)하며 열이 발생합니다." }
        ]
      }
    }
  },
  fit_chem_07: {
    title: '🔋 전기 분해, 전기로 물질을 나누다',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "전기 분해의 정의로 알맞은 것은?", options: ["전기로 물질을 합치는 것", "전기를 이용해 화합물을 분해하는 것", "전기로 물질을 가열하는 것", "전기로 물질을 섞는 것"], answer: 1, explanation: "전기 분해는 전기 에너지를 이용해 화합물을 분해하는 과정입니다." },
          { q: "물을 전기 분해하면 생기는 기체는?", options: ["산소만", "수소만", "수소와 산소", "이산화탄소"], answer: 2, explanation: "물(H₂O)을 전기 분해하면 수소와 산소 기체가 발생합니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "전기 분해 시 (+)극에서 일어나는 일은?", options: ["환원 반응", "산화 반응", "중화 반응", "용해"], answer: 1, explanation: "(+)극에서는 산화 반응이 일어납니다." },
          { q: "물의 전기 분해에서 수소와 산소의 부피비는?", options: ["1:1", "2:1", "1:2", "3:1"], answer: 1, explanation: "수소:산소 = 2:1의 부피비로 발생합니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'전극'의 의미로 알맞은 것은?", options: ["전기를 막는 장치", "전류가 드나드는 부분", "전기를 저장하는 곳", "전기를 측정하는 기구"], answer: 1, explanation: "전극은 전해질 용액에서 전류가 드나드는 부분입니다." },
          { q: "'전해질'의 뜻으로 알맞은 것은?", options: ["전기가 통하지 않는 물질", "물에 녹아 전류가 흐르게 하는 물질", "금속만을 말함", "기체 상태의 물질"], answer: 1, explanation: "전해질은 물에 녹으면 이온을 만들어 전류가 흐르게 합니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "순수한 물에 전류가 잘 안 흐르는 이유는?", options: ["너무 차가워서", "이온이 거의 없어서", "너무 무거워서", "투명해서"], answer: 1, explanation: "순수한 물에는 이온이 거의 없어 전류가 잘 흐르지 않습니다." },
          { q: "알루미늄을 전기 분해로 얻는 이유는?", options: ["간단해서", "알루미늄 광석이 안정해서 화학적으로 분리하기 어렵기 때문", "값이 싸서", "예쁘게 만들려고"], answer: 1, explanation: "알루미늄 산화물은 매우 안정해서 전기 분해가 필요합니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "수소 연료 전지차가 친환경적인 이유는?", options: ["빨라서", "물을 분해해 얻은 수소를 연료로 쓰고 물만 배출해서", "조용해서", "저렴해서"], answer: 1, explanation: "수소가 산소와 반응하면 물만 생성되어 오염 물질이 없습니다." },
          { q: "구리를 전기 도금할 때 도금할 물체를 어느 극에 연결하나요?", options: ["(+)극", "(-)극", "어느 쪽이든", "연결 안 함"], answer: 1, explanation: "(-)극에 물체를 연결하면 구리 이온이 환원되어 물체에 코팅됩니다." }
        ]
      }
    }
  },
  fit_chem_08: {
    title: '🧂 이온과 염, 물에 녹은 알갱이들',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "이온의 정의로 알맞은 것은?", options: ["전하를 띠지 않는 원자", "전자를 잃거나 얻어 전하를 띠는 입자", "원자핵만 있는 것", "분자의 일종"], answer: 1, explanation: "이온은 원자가 전자를 잃거나 얻어 전하를 띠게 된 입자입니다." },
          { q: "양이온의 특징은?", options: ["(-)전하", "(+)전하", "전하 없음", "중성"], answer: 1, explanation: "양이온은 전자를 잃어 (+)전하를 띱니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "소금(NaCl)이 물에 녹으면?", options: ["Na와 Cl 분자로 분리", "Na⁺ 이온과 Cl⁻ 이온으로 분리", "변화 없음", "기체로 변함"], answer: 1, explanation: "소금은 물에 녹으면 나트륨 양이온(Na⁺)과 염화 음이온(Cl⁻)으로 분리됩니다." },
          { q: "염(소금 류)이 형성되는 반응은?", options: ["용해 반응", "중화 반응", "연소 반응", "광합성"], answer: 1, explanation: "산과 염기가 중화 반응을 하면 염과 물이 생성됩니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'음이온'의 특징은?", options: ["전자를 잃음", "전자를 얻어 (-)전하를 띔", "전하가 없음", "양성자가 많음"], answer: 1, explanation: "음이온은 전자를 얻어 (-)전하를 띠는 이온입니다." },
          { q: "'전해질'과 '비전해질'의 차이는?", options: ["크기 차이", "물에 녹아 이온이 생기느냐의 차이", "색깔 차이", "냄새 차이"], answer: 1, explanation: "전해질은 물에 녹으면 이온이 생기고, 비전해질은 이온이 생기지 않습니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "소금물에 전류가 흐르는 이유는?", options: ["물이 많아서", "소금이 이온으로 분리되어 전하를 운반하기 때문", "소금이 무거워서", "따뜻해서"], answer: 1, explanation: "녹은 소금이 이온으로 분리되어 전류를 운반합니다." },
          { q: "설탕물에 전류가 안 흐르는 이유는?", options: ["설탕이 달아서", "설탕이 물에 녹아도 이온이 안 생겨서", "설탕이 가벼워서", "물이 부족해서"], answer: 1, explanation: "설탕은 비전해질이라 물에 녹아도 이온이 생기지 않습니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "스포츠 음료에 전해질이 포함된 이유는?", options: ["맛을 위해", "운동 후 손실된 이온을 보충하려고", "색을 내려고", "거품을 만들려고"], answer: 1, explanation: "땀으로 잃은 나트륨, 칼륨 등의 이온을 보충하기 위해서입니다." },
          { q: "앙금 생성 반응으로 수질 검사를 할 수 있는 이유는?", options: ["물이 변해서", "특정 이온이 있으면 침전물(앙금)이 생겨 확인 가능해서", "색이 예뻐서", "냄새가 나서"], answer: 1, explanation: "특정 이온끼리 만나면 앙금(침전물)이 생겨 이온의 존재를 확인할 수 있습니다." }
        ]
      }
    }
  },
  fit_chem_09: {
    title: '🌡️ 열과 화학 반응, 에너지의 출입',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "발열 반응의 정의로 알맞은 것은?", options: ["열을 흡수하는 반응", "열을 방출하는 반응", "빛을 내는 반응", "소리를 내는 반응"], answer: 1, explanation: "발열 반응은 에너지를 열로 방출하는 화학 반응입니다." },
          { q: "흡열 반응의 예는?", options: ["연소", "냉찜질 팩", "폭발", "녹슬기"], answer: 1, explanation: "냉찜질 팩은 주변의 열을 흡수하여 차가워지는 흡열 반응입니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "발열 반응에서 에너지 변화는?", options: ["에너지 증가", "에너지 방출로 주변 온도 상승", "에너지 변화 없음", "에너지 흡수"], answer: 1, explanation: "발열 반응은 에너지를 방출하여 주변 온도가 올라갑니다." },
          { q: "흡열 반응의 에너지 흐름은?", options: ["열 방출", "주변에서 열을 흡수", "에너지 생성", "에너지 소멸"], answer: 1, explanation: "흡열 반응은 주변에서 열에너지를 흡수합니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'활성화 에너지'의 의미는?", options: ["반응 후 남는 에너지", "반응을 시작하는 데 필요한 최소 에너지", "열에너지", "운동에너지"], answer: 1, explanation: "활성화 에너지는 화학 반응이 시작되기 위해 필요한 최소한의 에너지입니다." },
          { q: "'촉매'의 역할로 알맞은 것은?", options: ["반응을 막음", "반응 속도를 빠르게 함", "열을 발생시킴", "반응물을 늘림"], answer: 1, explanation: "촉매는 자신은 변하지 않으면서 반응 속도를 빠르게 합니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "손난로가 뜨거워지는 것은 어떤 반응인가요?", options: ["흡열 반응", "발열 반응", "중화 반응", "환원 반응"], answer: 1, explanation: "철이 산화되며 열을 방출하는 발열 반응입니다." },
          { q: "광합성은 어떤 반응인가요?", options: ["발열 반응", "흡열 반응", "연소 반응", "중화 반응"], answer: 1, explanation: "광합성은 빛에너지를 흡수하는 흡열 반응입니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "자동차 에어백이 순식간에 부풀어 오르는 원리는?", options: ["물이 끓어서", "화학 반응으로 기체가 빠르게 생성되어서", "공기가 들어와서", "열이 식어서"], answer: 1, explanation: "에어백 내부의 화학 반응이 순식간에 질소 기체를 생성합니다." },
          { q: "냉동실 없이 아이스크림을 만들 때 소금을 쓰는 이유는?", options: ["맛을 위해", "소금이 얼음에 녹으며 열을 흡수해 온도를 낮추므로", "색을 위해", "냄새 제거"], answer: 1, explanation: "소금이 얼음에 녹는 흡열 반응으로 온도가 더 낮아집니다." }
        ]
      }
    }
  },
  fit_chem_10: {
    title: '🧬 탄소 화합물, 생명의 기본 재료',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "탄소 화합물의 정의로 알맞은 것은?", options: ["산소만 포함한 물질", "탄소를 기본으로 하는 화합물", "금속으로 만든 물질", "물만 포함한 물질"], answer: 1, explanation: "탄소 화합물은 탄소 원자를 기본 골격으로 하는 화합물입니다." },
          { q: "탄소가 다양한 화합물을 만드는 이유는?", options: ["색이 예뻐서", "다른 원자와 4개의 결합을 할 수 있어서", "가벼워서", "비싸서"], answer: 1, explanation: "탄소는 최대 4개의 결합을 형성할 수 있어 다양한 구조가 가능합니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "탄화수소의 구성 원소는?", options: ["탄소, 산소", "탄소, 수소", "수소, 산소", "탄소, 질소"], answer: 1, explanation: "탄화수소는 탄소(C)와 수소(H)로만 이루어진 화합물입니다." },
          { q: "유기물과 무기물의 가장 큰 차이는?", options: ["크기", "탄소 포함 여부", "색깔", "냄새"], answer: 1, explanation: "유기물은 탄소를 포함하고, 무기물은 대체로 탄소를 포함하지 않습니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'고분자'의 의미로 알맞은 것은?", options: ["작은 분자", "수많은 작은 단위가 연결된 큰 분자", "원자 하나", "금속 물질"], answer: 1, explanation: "고분자는 단위체(모노머)가 많이 연결되어 만들어진 큰 분자입니다." },
          { q: "'유기물'의 뜻으로 알맞은 것은?", options: ["생물과 관계없는 물질", "탄소를 기본으로 하는 물질", "금속 물질", "기체 상태 물질"], answer: 1, explanation: "유기물은 탄소를 기본 골격으로 하는 화합물입니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "플라스틱이 석유에서 만들어지는 이유는?", options: ["석유가 비싸서", "석유가 탄화수소로 이루어져 탄소 화합물의 원료가 되기 때문", "석유가 예뻐서", "석유가 가벼워서"], answer: 1, explanation: "석유의 탄화수소를 화학 반응시켜 플라스틱(고분자)을 만듭니다." },
          { q: "우리 몸의 주요 성분(단백질, DNA 등)이 탄소 화합물인 이유는?", options: ["탄소가 비싸서", "탄소가 다양한 구조를 만들 수 있어 복잡한 생체 분자 형성이 가능해서", "탄소가 가벼워서", "우연히"], answer: 1, explanation: "탄소의 다양한 결합 능력이 복잡한 생체 분자를 가능하게 합니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "플라스틱이 환경 문제가 되는 이유는?", options: ["예뻐서", "잘 분해되지 않아서", "가벼워서", "비싸서"], answer: 1, explanation: "플라스틱은 자연에서 분해되는 데 수백 년이 걸려 환경 오염을 일으킵니다." },
          { q: "바이오 플라스틱의 장점은?", options: ["더 단단함", "생분해가 가능하여 환경 부담이 적음", "더 예쁨", "더 저렴함"], answer: 1, explanation: "바이오 플라스틱은 미생물에 의해 분해되어 환경 오염을 줄입니다." }
        ]
      }
    }
  }
};

// 교체 실행
for (let i = 1; i <= 10; i++) {
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
    // const data = REMEDIAL_BANK[key]; → window.REMEDIAL_BANK[key];
    content = content.replace(/const data = REMEDIAL_BANK\[key\];/g, 'const data = window.REMEDIAL_BANK[key];');
    // for (const key in REMEDIAL_BANK) → window.REMEDIAL_BANK
    content = content.replace(/for \(const key in REMEDIAL_BANK\)/g, 'for (const key in window.REMEDIAL_BANK)');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[OK] fit_chem_${num} REMEDIAL_BANK 교체 완료 - ${chemData.title}`);
  } else {
    console.log(`[SKIP] fit_chem_${num} 패턴 불일치 - 수동 확인 필요`);
  }
}

console.log('\n✅ fit_chem_01~10 REMEDIAL_BANK 교체 완료!');

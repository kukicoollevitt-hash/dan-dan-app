const fs = require('fs');
const path = require('path');

// fit_chem_01~10 본문 내용에 맞는 보완학습 데이터
const CHEM_DATA = {
  fit_chem_01: {
    title: '🧪 물체와 물질 구별법',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "물체의 정의로 알맞은 것은?", options: ["물체를 이루는 재료", "모양이 있고 공간을 차지하는 것", "물질의 성질", "재료의 종류"], answer: 1, explanation: "물체는 모양이 있고 공간을 차지하며 손으로 만질 수 있는 것입니다." },
          { q: "물질의 정의로 알맞은 것은?", options: ["완성된 물건 그 자체", "물체를 이루는 재료", "물체의 모양", "물건의 용도"], answer: 1, explanation: "물질은 물체를 이루는 재료입니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "탁구공과 농구공이 다른 이유는?", options: ["크기만 다름", "만든 재료(물질)가 다름", "색깔만 다름", "이름만 다름"], answer: 1, explanation: "같은 공이라도 만든 물질(재료)에 따라 성질이 달라집니다." },
          { q: "물체의 모양이 결정되는 기준은?", options: ["색깔", "무게", "쓰임새(용도)", "냄새"], answer: 2, explanation: "물체의 모양은 어떤 용도로 사용되는지에 따라 결정됩니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'탄성'의 의미로 알맞은 것은?", options: ["빛이 통과하는 성질", "늘어났다 원래대로 돌아오는 성질", "단단한 성질", "가벼운 성질"], answer: 1, explanation: "탄성은 늘어나거나 줄어든 물체가 원래대로 돌아가려는 성질입니다." },
          { q: "'투명'의 뜻으로 알맞은 것은?", options: ["빛을 막는 것", "빛이 통과하여 반대쪽이 보이는 상태", "어두운 상태", "색이 진한 것"], answer: 1, explanation: "투명은 빛이 통과하여 반대쪽이 보이는 상태입니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "타이어에 고무를 사용하는 이유는?", options: ["예뻐서", "탄성이 좋아 충격을 흡수하기 때문", "무거워서", "투명해서"], answer: 1, explanation: "고무는 탄성이 좋아 충격을 흡수하므로 타이어에 적합합니다." },
          { q: "창문에 유리를 사용하는 이유는?", options: ["무거워서", "투명해서 빛이 통과하기 때문", "탄성이 좋아서", "철보다 단단해서"], answer: 1, explanation: "유리는 투명해서 빛이 통과하므로 창문에 적합합니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "건물 뼈대에 철을 사용하는 이유는?", options: ["가벼워서", "투명해서", "단단하고 튼튼해서", "잘 늘어나서"], answer: 2, explanation: "철은 무겁지만 단단하여 건물의 뼈대에 적합합니다." },
          { q: "플라스틱 장난감의 장점은?", options: ["무겁고 단단함", "가볍고 여러 형태로 가공 가능", "투명하고 깨지기 쉬움", "탄성이 없음"], answer: 1, explanation: "플라스틱은 가볍고 다양한 형태로 가공할 수 있어 장난감에 많이 사용됩니다." }
        ]
      }
    }
  },
  fit_chem_02: {
    title: '🍬 용해 - 설탕이 물에 녹는 현상',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "용해의 정의로 알맞은 것은?", options: ["물질이 사라지는 것", "한 물질이 다른 물질 속에 골고루 녹는 현상", "물질이 타는 것", "물질이 얼어붙는 것"], answer: 1, explanation: "용해는 한 물질이 다른 물질 속에 골고루 섞여 녹는 현상입니다." },
          { q: "용질과 용매의 관계로 알맞은 것은?", options: ["용질이 용매를 녹임", "용매가 용질을 녹임", "둘 다 녹지 않음", "둘 다 사라짐"], answer: 1, explanation: "용매(물)가 용질(설탕)을 녹여 용액을 만듭니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "설탕이 물에 녹아도 사라지지 않은 증거는?", options: ["색이 변함", "단맛이 남", "냄새가 남", "소리가 남"], answer: 1, explanation: "설탕이 녹아도 단맛이 나므로 설탕은 사라지지 않고 존재합니다." },
          { q: "설탕물을 증발시키면 어떻게 되나요?", options: ["아무것도 안 남음", "물만 남음", "설탕만 남음", "다른 물질이 생김"], answer: 2, explanation: "물이 증발하면 녹아있던 설탕이 다시 나타납니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'용질'의 의미로 알맞은 것은?", options: ["녹이는 물질", "녹아 들어가는 물질", "녹지 않는 물질", "기체 상태의 물질"], answer: 1, explanation: "용질은 용매에 녹아 들어가는 물질입니다." },
          { q: "'증발'의 뜻으로 알맞은 것은?", options: ["고체가 되는 것", "액체가 기체로 변해 날아가는 것", "기체가 액체가 되는 것", "물질이 사라지는 것"], answer: 1, explanation: "증발은 액체가 기체로 변해 공기 중으로 날아가는 현상입니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "모래가 물에 녹지 않는 이유는?", options: ["너무 무거워서", "물질마다 녹는 성질이 다르기 때문", "모래가 너무 커서", "물이 차가워서"], answer: 1, explanation: "물질마다 물에 녹는 성질이 달라서 모래는 녹지 않습니다." },
          { q: "따뜻한 물에서 설탕이 더 잘 녹는 이유는?", options: ["물이 더 무거워서", "온도가 높으면 용해가 빨라서", "물이 줄어들어서", "설탕이 가벼워져서"], answer: 1, explanation: "온도가 높으면 분자 운동이 활발해져 용해가 빨라집니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "음식에 간을 맞출 때 소금을 물에 녹이는 이유는?", options: ["예쁘게 보이려고", "골고루 간이 배게 하려고", "소금이 사라지게 하려고", "물맛을 없애려고"], answer: 1, explanation: "소금이 녹으면 골고루 퍼져 음식 전체에 간이 배게 됩니다." },
          { q: "물과 식용유가 섞이지 않는 이유는?", options: ["색이 달라서", "성질이 달라 서로 녹지 않기 때문", "무게가 같아서", "온도가 달라서"], answer: 1, explanation: "물과 기름은 성질이 달라서 서로 녹지 않고 분리됩니다." }
        ]
      }
    }
  },
  fit_chem_03: {
    title: '💧 액체의 성질 - 물과 기름',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "액체의 특징으로 알맞은 것은?", options: ["모양이 일정함", "담는 용기에 따라 모양이 달라짐", "공간을 차지하지 않음", "항상 고체로 변함"], answer: 1, explanation: "액체는 담는 용기에 따라 모양이 달라지지만 양은 변하지 않습니다." },
          { q: "밀도가 높은 액체는 어떻게 되나요?", options: ["위로 뜸", "아래로 가라앉음", "사라짐", "기체가 됨"], answer: 1, explanation: "밀도가 높은 액체는 아래로 가라앉고, 밀도가 낮은 액체는 위로 뜹니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "꿀이 물보다 천천히 흐르는 이유는?", options: ["색이 진해서", "점성이 크기 때문", "온도가 낮아서", "밀도가 낮아서"], answer: 1, explanation: "점성이 크면 끈적끈적해서 천천히 흐릅니다." },
          { q: "물과 식용유를 섞으면 어떻게 되나요?", options: ["골고루 섞임", "두 층으로 분리됨", "색이 변함", "기체가 됨"], answer: 1, explanation: "물과 식용유는 성질이 달라 섞이지 않고 층으로 분리됩니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'점성'의 의미로 알맞은 것은?", options: ["투명한 정도", "액체가 끈적끈적하게 흐르는 정도", "무게", "온도"], answer: 1, explanation: "점성은 액체가 끈적끈적하게 흐르는 정도입니다." },
          { q: "'밀도'의 뜻으로 알맞은 것은?", options: ["물의 양", "같은 부피에서 얼마나 무거운지", "액체의 색깔", "흐르는 속도"], answer: 1, explanation: "밀도는 같은 부피에서 물질이 얼마나 무거운지를 나타냅니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "빨래가 마르는 이유는?", options: ["물이 땅으로 스며들어서", "물이 수증기로 변해 날아가서", "옷이 물을 흡수해서", "바람이 물을 밀어서"], answer: 1, explanation: "물이 증발하여 수증기로 변해 공기 중으로 날아갑니다." },
          { q: "물 위에 식용유가 뜨는 이유는?", options: ["식용유가 더 가벼워서(밀도가 낮아서)", "식용유가 더 무거워서", "물이 기름을 밀어서", "온도 차이 때문에"], answer: 0, explanation: "식용유의 밀도가 물보다 낮아서 물 위에 뜹니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "기름기 있는 국물에서 기름을 걷어내는 원리는?", options: ["기름이 사라져서", "기름이 물보다 위에 떠서 분리 가능", "기름이 밑으로 가라앉아서", "기름이 고체가 되어서"], answer: 1, explanation: "기름은 물보다 밀도가 낮아 위에 뜨므로 쉽게 걷어낼 수 있습니다." },
          { q: "건조한 날 빨래가 빨리 마르는 이유는?", options: ["온도가 낮아서", "습도가 낮아 증발이 빨라서", "바람이 없어서", "물이 무거워서"], answer: 1, explanation: "건조하고 바람이 부는 날에는 증발이 더 빨리 일어납니다." }
        ]
      }
    }
  },
  fit_chem_04: {
    title: '🎈 기체의 성질 - 공기와 압력',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "기체의 특징으로 알맞은 것은?", options: ["모양이 일정함", "일정한 형태가 없고 용기 전체로 퍼짐", "압력을 받아도 부피가 변하지 않음", "무게가 없음"], answer: 1, explanation: "기체는 일정한 형태가 없고 담는 용기 전체로 퍼지는 성질이 있습니다." },
          { q: "기체가 압력을 받으면 어떻게 되나요?", options: ["부피가 커짐", "부피가 작아짐", "변화 없음", "액체가 됨"], answer: 1, explanation: "기체는 압력을 받으면 부피가 작아집니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "양팔저울에서 공기가 든 풍선 쪽이 기우는 이유는?", options: ["풍선이 예뻐서", "공기에 무게가 있기 때문", "풍선 고무가 무거워서", "우연히"], answer: 1, explanation: "공기도 무게가 있어서 공기가 든 풍선이 더 무겁습니다." },
          { q: "컵을 거꾸로 물에 넣어도 안의 종이가 젖지 않는 이유는?", options: ["종이가 방수라서", "컵 속 공기가 물을 막기 때문", "물이 무거워서", "컵이 특수 재질이라서"], answer: 1, explanation: "컵 속의 공기가 공간을 차지하고 있어 물이 들어오지 못합니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'압력'의 의미로 알맞은 것은?", options: ["물질의 무게", "물체나 기체에 가해지는 힘", "물질의 부피", "기체의 색깔"], answer: 1, explanation: "압력은 물체나 기체에 가해지는 힘입니다." },
          { q: "'대기압'의 뜻으로 알맞은 것은?", options: ["물의 압력", "공기가 지표면을 누르는 압력", "기체의 부피", "바람의 세기"], answer: 1, explanation: "대기압은 공기가 지표면을 누르는 압력입니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "높은 산에서 귀가 먹먹해지는 이유는?", options: ["온도가 낮아서", "대기압 차이 때문", "공기가 없어서", "바람이 강해서"], answer: 1, explanation: "높은 곳은 대기압이 낮아 귀 안팎의 압력 차이가 생깁니다." },
          { q: "페트병을 누르면 찌그러지는 이유는?", options: ["플라스틱이 약해서", "안의 공기가 압축되기 때문", "물이 들어 있어서", "온도가 높아서"], answer: 1, explanation: "기체인 공기가 압력을 받으면 부피가 줄어들어 찌그러집니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "자동차 타이어에 공기를 넣는 이유는?", options: ["예쁘게 보이려고", "공기의 탄성으로 충격을 흡수하려고", "타이어를 무겁게 하려고", "색을 바꾸려고"], answer: 1, explanation: "기체의 압축 성질을 이용해 충격을 흡수합니다." },
          { q: "에어백이 사고 시 부풀어 오르는 원리는?", options: ["물이 들어가서", "기체가 빠르게 채워져서", "고체가 팽창해서", "열이 나서"], answer: 1, explanation: "화학 반응으로 기체가 빠르게 생성되어 에어백이 부풀어 오릅니다." }
        ]
      }
    }
  },
  fit_chem_05: {
    title: '🧊 상태 변화 - 융해, 응고, 증발, 액화',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "융해의 정의로 알맞은 것은?", options: ["액체가 고체로 변하는 것", "고체가 열을 받아 액체로 변하는 것", "액체가 기체로 변하는 것", "기체가 액체로 변하는 것"], answer: 1, explanation: "융해는 고체가 열을 받아 액체로 변하는 현상입니다." },
          { q: "응고의 정의로 알맞은 것은?", options: ["고체가 액체로 변하는 것", "액체가 열을 잃어 고체로 변하는 것", "기체가 고체로 변하는 것", "액체가 기체로 변하는 것"], answer: 1, explanation: "응고는 액체가 열을 잃어 고체로 변하는 과정입니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "얼음이 물이 되는 현상은?", options: ["응고", "융해", "증발", "액화"], answer: 1, explanation: "고체인 얼음이 액체인 물로 변하는 것은 융해입니다." },
          { q: "물이 수증기가 되는 현상은?", options: ["응고", "융해", "증발", "액화"], answer: 2, explanation: "액체인 물이 기체인 수증기로 변하는 것은 증발입니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'액화'의 의미로 알맞은 것은?", options: ["고체가 액체로 변하는 것", "기체가 액체로 변하는 것", "액체가 고체로 변하는 것", "액체가 기체로 변하는 것"], answer: 1, explanation: "액화는 기체가 액체로 변하는 현상입니다." },
          { q: "'상태 변화'의 뜻으로 알맞은 것은?", options: ["물질이 다른 물질로 변하는 것", "물질이 고체·액체·기체로 변하는 것", "물질이 사라지는 것", "물질의 색이 변하는 것"], answer: 1, explanation: "상태 변화는 물질이 고체, 액체, 기체 사이를 변하는 것입니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "차가운 유리컵 표면에 물방울이 맺히는 이유는?", options: ["컵에서 물이 새서", "공기 중 수증기가 액화해서", "컵이 녹아서", "물이 증발해서"], answer: 1, explanation: "공기 중의 수증기가 차가운 컵 표면에서 액화하여 물방울이 됩니다." },
          { q: "물이 얼음이 되어도 같은 물질인 이유는?", options: ["색이 같아서", "상태만 변하고 물질 자체는 그대로이기 때문", "무게가 변하지 않아서", "온도가 같아서"], answer: 1, explanation: "상태 변화에서는 형태만 바뀔 뿐 물질 자체는 변하지 않습니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "냉동실에서 얼음을 만드는 원리는?", options: ["융해", "응고", "증발", "기화"], answer: 1, explanation: "물이 열을 잃어 고체인 얼음으로 변하는 응고 현상입니다." },
          { q: "빨래가 마르는 것은 어떤 상태 변화인가요?", options: ["융해", "응고", "증발", "액화"], answer: 2, explanation: "물이 기체인 수증기로 변해 날아가는 증발 현상입니다." }
        ]
      }
    }
  },
  fit_chem_06: {
    title: '⚗️ 원소 118가지',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "원소의 정의로 알맞은 것은?", options: ["여러 물질이 섞인 것", "더 이상 쪼갤 수 없는 기본 물질", "물질의 혼합물", "화합물의 일종"], answer: 1, explanation: "원소는 더 이상 다른 물질로 쪼갤 수 없는 기본 물질입니다." },
          { q: "현재 알려진 원소의 개수는?", options: ["약 50개", "약 80개", "약 118개", "약 200개"], answer: 2, explanation: "현재 약 118종의 원소가 알려져 있습니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "주기율표에서 같은 세로줄(족) 원소들의 공통점은?", options: ["색깔이 같음", "화학적 성질이 비슷함", "무게가 같음", "크기가 같음"], answer: 1, explanation: "같은 족의 원소들은 화학적 성질이 비슷합니다." },
          { q: "원소 기호가 필요한 이유는?", options: ["예쁘게 보이려고", "세계 공통으로 원소를 표시하기 위해", "숫자를 쓰기 위해", "색을 구분하기 위해"], answer: 1, explanation: "원소 기호를 사용하면 전 세계에서 같은 원소를 표시할 수 있습니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'주기율표'의 의미로 알맞은 것은?", options: ["원소들을 정리한 표", "화학식을 모은 책", "실험 결과표", "온도를 기록한 표"], answer: 0, explanation: "주기율표는 원소들을 성질에 따라 정리한 표입니다." },
          { q: "'금속 원소'의 특징으로 알맞은 것은?", options: ["전기가 안 통함", "광택이 있고 전기가 잘 통함", "투명함", "가볍고 잘 부서짐"], answer: 1, explanation: "금속 원소는 광택이 있고 전기와 열을 잘 전달합니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "산소(O)와 수소(H)가 결합하면 무엇이 되나요?", options: ["이산화탄소", "물", "소금", "설탕"], answer: 1, explanation: "수소 2개와 산소 1개가 결합하면 물(H₂O)이 됩니다." },
          { q: "철(Fe)이 녹슬 때 결합하는 원소는?", options: ["수소", "질소", "산소", "탄소"], answer: 2, explanation: "철이 산소와 결합하면 산화철(녹)이 됩니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "헬륨(He)이 풍선에 사용되는 이유는?", options: ["색이 예뻐서", "공기보다 가벼워서", "냄새가 좋아서", "값이 싸서"], answer: 1, explanation: "헬륨은 공기보다 가벼워서 풍선을 띄울 수 있습니다." },
          { q: "네온(Ne)이 간판에 사용되는 이유는?", options: ["값이 싸서", "전기를 통하면 빛을 내서", "무거워서", "냄새가 나서"], answer: 1, explanation: "네온은 전기를 통하면 특유의 색 빛을 내어 간판에 사용됩니다." }
        ]
      }
    }
  },
  fit_chem_07: {
    title: '⚛️ 원자의 정체',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "원자의 정의로 알맞은 것은?", options: ["가장 큰 물질", "물질을 이루는 가장 작은 단위", "눈에 보이는 알갱이", "분자의 다른 이름"], answer: 1, explanation: "원자는 물질을 이루는 가장 작은 단위입니다." },
          { q: "원자의 중심에 있는 것은?", options: ["전자", "원자핵", "분자", "이온"], answer: 1, explanation: "원자의 중심에는 양성자와 중성자로 이루어진 원자핵이 있습니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "원자핵을 이루는 입자는?", options: ["전자와 양성자", "양성자와 중성자", "전자와 중성자", "양성자만"], answer: 1, explanation: "원자핵은 양성자와 중성자로 이루어져 있습니다." },
          { q: "전자가 있는 위치는?", options: ["원자핵 안", "원자핵 주위", "원자 밖", "다른 원자 안"], answer: 1, explanation: "전자는 원자핵 주위를 돌고 있습니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'양성자'의 전하는?", options: ["(-)전하", "(+)전하", "전하 없음", "가변적"], answer: 1, explanation: "양성자는 (+)전하를 띱니다." },
          { q: "'중성자'의 특징은?", options: ["(+)전하", "(-)전하", "전하가 없음", "원자 밖에 있음"], answer: 2, explanation: "중성자는 전하를 띠지 않는 중성 입자입니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "원자 번호가 같으면 같은 원소인 이유는?", options: ["전자 수가 같아서", "양성자 수가 같아서", "중성자 수가 같아서", "질량이 같아서"], answer: 1, explanation: "원자 번호는 양성자 수와 같고, 이것이 원소를 결정합니다." },
          { q: "원자가 전기적으로 중성인 이유는?", options: ["전자가 없어서", "양성자와 전자 수가 같아서", "중성자만 있어서", "양성자가 없어서"], answer: 1, explanation: "(+)전하의 양성자 수와 (-)전하의 전자 수가 같아 전체적으로 중성입니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "원자를 눈으로 볼 수 없는 이유는?", options: ["투명해서", "너무 작아서", "빠르게 움직여서", "빛이 없어서"], answer: 1, explanation: "원자는 매우 작아서 일반 현미경으로도 볼 수 없습니다." },
          { q: "같은 원소의 원자들이 같은 성질을 가지는 이유는?", options: ["색이 같아서", "양성자 수가 같기 때문", "크기가 같아서", "우연히"], answer: 1, explanation: "같은 원소는 양성자 수가 같아 화학적 성질이 동일합니다." }
        ]
      }
    }
  },
  fit_chem_08: {
    title: '🔗 분자 - 원자들의 결합',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "분자의 정의로 알맞은 것은?", options: ["원자 하나", "두 개 이상의 원자가 결합한 것", "원소의 다른 이름", "이온"], answer: 1, explanation: "분자는 두 개 이상의 원자가 화학 결합으로 이어진 것입니다." },
          { q: "물 분자(H₂O)를 이루는 원자는?", options: ["수소 2개, 산소 1개", "수소 1개, 산소 2개", "수소 2개, 산소 2개", "산소만 3개"], answer: 0, explanation: "물 분자는 수소 원자 2개와 산소 원자 1개로 이루어져 있습니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "이산화탄소(CO₂)의 구성은?", options: ["탄소 1개, 산소 2개", "탄소 2개, 산소 1개", "탄소 2개, 산소 2개", "산소만 3개"], answer: 0, explanation: "CO₂는 탄소 원자 1개에 산소 원자 2개가 결합한 구조입니다." },
          { q: "분자식에서 아래 첨자 숫자의 의미는?", options: ["분자의 개수", "해당 원자의 개수", "원소의 무게", "분자의 크기"], answer: 1, explanation: "아래 첨자는 해당 원자가 몇 개인지를 나타냅니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'화학 결합'의 의미로 알맞은 것은?", options: ["원자들이 힘으로 연결되는 것", "원자들이 멀어지는 것", "분자가 쪼개지는 것", "원소가 사라지는 것"], answer: 0, explanation: "화학 결합은 원자들이 전자를 공유하거나 주고받아 연결되는 것입니다." },
          { q: "'분자식'의 뜻으로 알맞은 것은?", options: ["분자의 색깔", "분자를 구성하는 원자의 종류와 개수를 나타낸 식", "분자의 무게", "분자의 크기"], answer: 1, explanation: "분자식은 분자를 이루는 원자의 종류와 개수를 기호로 나타낸 것입니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "산소 기체(O₂)와 오존(O₃)이 다른 이유는?", options: ["원소가 달라서", "산소 원자의 개수가 달라서", "색깔이 달라서", "온도가 달라서"], answer: 1, explanation: "같은 산소 원자지만 결합한 개수가 달라 성질이 다릅니다." },
          { q: "다이아몬드와 흑연이 같은 원소지만 다른 이유는?", options: ["원자 종류가 달라서", "원자 배열 구조가 달라서", "원자 색깔이 달라서", "원자 무게가 달라서"], answer: 1, explanation: "같은 탄소 원자지만 배열 구조가 달라 성질이 완전히 다릅니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "분자 모형에서 공과 막대를 사용하는 이유는?", options: ["예쁘게 보이려고", "원자와 결합을 표현하기 위해", "크기를 재려고", "색을 나타내려고"], answer: 1, explanation: "공은 원자를, 막대는 원자 간의 결합을 나타냅니다." },
          { q: "포도당(C₆H₁₂O₆)을 이루는 원소의 종류는?", options: ["1가지", "2가지", "3가지", "6가지"], answer: 2, explanation: "포도당은 탄소(C), 수소(H), 산소(O) 3가지 원소로 이루어져 있습니다." }
        ]
      }
    }
  },
  fit_chem_09: {
    title: '⚖️ 질량 보존 법칙',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "질량 보존 법칙이란?", options: ["반응 후 질량이 늘어남", "반응 전후 총 질량이 같음", "반응 후 질량이 줄어듦", "질량은 측정할 수 없음"], answer: 1, explanation: "화학 반응 전후 물질의 총 질량은 변하지 않습니다." },
          { q: "양초가 탈 때 질량이 줄어드는 것처럼 보이는 이유는?", options: ["물질이 사라져서", "생성된 기체가 공기 중으로 날아가서", "빛이 되어서", "열이 되어서"], answer: 1, explanation: "양초가 타면 이산화탄소와 수증기가 공기 중으로 날아가 질량이 줄어든 것처럼 보입니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "밀폐된 용기에서 반응시키면 질량 변화는?", options: ["증가함", "감소함", "변화 없음", "알 수 없음"], answer: 2, explanation: "밀폐 용기에서는 기체도 빠져나가지 않아 질량 변화가 없습니다." },
          { q: "철이 녹슬면 무게가 늘어나는 이유는?", options: ["철이 커져서", "산소가 결합하기 때문", "물이 들어가서", "열이 더해져서"], answer: 1, explanation: "철에 산소가 결합하여 산화철이 되므로 그만큼 무게가 늘어납니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'질량'의 의미로 알맞은 것은?", options: ["물체의 크기", "물질이 가진 고유한 양", "물체의 색깔", "물체의 온도"], answer: 1, explanation: "질량은 물질이 가진 고유한 양으로, 어디서나 변하지 않습니다." },
          { q: "'보존'의 뜻으로 알맞은 것은?", options: ["없어지는 것", "변하지 않고 유지되는 것", "늘어나는 것", "줄어드는 것"], answer: 1, explanation: "보존은 변하지 않고 그대로 유지되는 것을 의미합니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "나무를 태운 후 재만 남으면 질량 보존 법칙에 어긋나는 것인가요?", options: ["예, 어긋남", "아니오, 기체가 날아갔기 때문", "질량이 늘어남", "알 수 없음"], answer: 1, explanation: "이산화탄소와 수증기가 공기 중으로 날아가서 줄어든 것처럼 보이지만, 전체 질량은 보존됩니다." },
          { q: "앙금 생성 반응 전후 질량은?", options: ["줄어듦", "늘어남", "같음", "반응마다 다름"], answer: 2, explanation: "앙금 생성 반응도 질량 보존 법칙을 따라 전후 질량이 같습니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "로켓이 연료를 태우면 가벼워지는 이유는?", options: ["연료가 사라져서", "연소 생성물이 밖으로 배출되기 때문", "열이 질량을 줄여서", "속도가 빨라져서"], answer: 1, explanation: "연소 생성물(기체)이 로켓 밖으로 배출되어 로켓 자체 질량은 줄어듭니다." },
          { q: "질량 보존 법칙을 발견한 과학자는?", options: ["뉴턴", "라부아지에", "아인슈타인", "멘델레예프"], answer: 1, explanation: "라부아지에가 정밀한 실험을 통해 질량 보존 법칙을 확립했습니다." }
        ]
      }
    }
  },
  fit_chem_10: {
    title: '🍋 산과 염기 - 레몬과 비누',
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
          { q: "리트머스 종이가 붉게 변하면?", options: ["중성", "염기성", "산성", "알 수 없음"], answer: 2, explanation: "산성 용액은 파란 리트머스 종이를 붉게 변화시킵니다." },
          { q: "리트머스 종이가 푸르게 변하면?", options: ["산성", "중성", "염기성", "알 수 없음"], answer: 2, explanation: "염기성 용액은 붉은 리트머스 종이를 푸르게 변화시킵니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'중화 반응'의 의미로 알맞은 것은?", options: ["산만 남는 반응", "산과 염기가 만나 성질이 약해지는 반응", "염기만 남는 반응", "물이 생기지 않는 반응"], answer: 1, explanation: "중화 반응은 산과 염기가 만나 서로의 성질을 약화시키는 반응입니다." },
          { q: "'지시약'의 뜻으로 알맞은 것은?", options: ["물을 표시하는 약", "산성/염기성을 색 변화로 구별하는 물질", "음식을 만드는 약", "병을 치료하는 약"], answer: 1, explanation: "지시약은 용액이 산성인지 염기성인지 색 변화로 알려주는 물질입니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "레몬즙이 산성인 증거는?", options: ["달콤한 맛", "신맛과 리트머스 종이 색 변화", "미끌미끌함", "쓴맛"], answer: 1, explanation: "레몬즙은 신맛이 나고 파란 리트머스 종이를 붉게 변화시켜 산성임을 알 수 있습니다." },
          { q: "속 쓰릴 때 제산제를 먹는 이유는?", options: ["영양 보충", "염기성 약으로 위산을 중화하려고", "단맛을 내려고", "수분 보충"], answer: 1, explanation: "제산제는 염기성이라 위의 과다한 산을 중화시킵니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "비누가 미끌미끌한 이유는?", options: ["물이 많아서", "염기성 성분이 있어서", "기름이 있어서", "색소 때문에"], answer: 1, explanation: "비누에는 염기성 성분이 포함되어 있어 미끌미끌합니다." },
          { q: "산성비가 건물을 손상시키는 이유는?", options: ["비가 무거워서", "산이 건물 재료와 반응하기 때문", "비가 차가워서", "바람이 강해서"], answer: 1, explanation: "산성비의 산 성분이 대리석 등 건물 재료와 화학 반응을 일으켜 손상시킵니다." }
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

  // 기존 REMEDIAL_BANK 블록 찾기 (여러 패턴)
  const patterns = [
    /\/\/ ===== 보완학습 문제 뱅크 \(객관식 2문제씩\) =====\s*\/\/ window 객체로 덮어써서[^\n]*\n\s*window\.REMEDIAL_BANK = \{[\s\S]*?\n    \};/,
    /\/\/ ===== 보완학습 문제 뱅크 \(객관식 2문제씩\) =====\s*window\.REMEDIAL_BANK = \{[\s\S]*?\n    \};/,
    /\/\/ ===== 보완학습 문제 뱅크 \(객관식 2문제씩\) =====\s*const REMEDIAL_BANK = \{[\s\S]*?\n    \};/
  ];

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

  for (const pattern of patterns) {
    if (pattern.test(content)) {
      content = content.replace(pattern, newBlock);
      modified = true;
      break;
    }
  }

  if (modified) {
    // REMEDIAL_BANK 참조를 window.REMEDIAL_BANK로 수정
    content = content.replace(/const data = REMEDIAL_BANK\[key\];/g, 'const data = window.REMEDIAL_BANK[key];');
    content = content.replace(/for \(const key in REMEDIAL_BANK\)/g, 'for (const key in window.REMEDIAL_BANK)');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[OK] fit_chem_${num} REMEDIAL_BANK 교체 완료 - ${chemData.title}`);
  } else {
    console.log(`[SKIP] fit_chem_${num} 패턴 불일치 - 수동 확인 필요`);
  }
}

console.log('\n✅ fit_chem_01~10 본문 맞춤 보완학습 교체 완료!');

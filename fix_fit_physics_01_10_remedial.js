const fs = require('fs');
const path = require('path');

// fit_physics_01~10 보완학습 REMEDIAL_BANK 데이터
const PHYSICS_DATA = {
  fit_physics_01: {
    title: '힘, 세상을 움직이는 보이지 않는 손',
    problems: {
      literal: {
        title: '핵심 이해력',
        problems: [
          { q: '힘의 단위로 사용되는 것은?', options: ['미터(m)', '킬로그램(kg)', '뉴턴(N)', '초(s)'], answer: 2, explanation: '힘의 크기는 뉴턴(N)이라는 단위로 나타냅니다.' },
          { q: '마찰력이 작으면 어떻게 되는가?', options: ['잘 걸을 수 있다', '미끄러진다', '물체가 무거워진다', '물체가 빨라진다'], answer: 1, explanation: '마찰력이 작으면 얼음판처럼 미끄러집니다.' }
        ]
      },
      structural: {
        title: '구조 파악력',
        problems: [
          { q: '글의 전개 순서로 옳은 것은?', options: ['힘의 개념→힘의 예시→중력과 마찰력→탄성력, 전기력, 자기력', '중력→마찰력→힘의 개념→탄성력', '탄성력→전기력→자기력→힘의 개념', '힘의 예시→힘의 개념→자기력→중력'], answer: 0, explanation: '1문단 힘의 개념, 2문단 예시, 3문단 중력/마찰력, 4문단 탄성력/전기력/자기력 순입니다.' },
          { q: '중력에 대해 설명한 문단은?', options: ['1문단', '2문단', '3문단', '4문단'], answer: 2, explanation: '3문단에서 중력과 마찰력을 설명합니다.' }
        ]
      },
      lexical: {
        title: '어휘 맥락력',
        problems: [
          { q: '"탄성력"의 의미로 옳은 것은?', options: ['물체를 끌어당기는 힘', '움직임을 방해하는 힘', '원래 모양으로 돌아가려는 힘', '전기를 띤 물체 사이의 힘'], answer: 2, explanation: '탄성력은 늘어나거나 찌그러진 물체가 원래 모양으로 돌아가려는 힘입니다.' },
          { q: '"중력"이 작용하는 방향은?', options: ['위쪽', '옆쪽', '아래쪽(지구 중심)', '모든 방향'], answer: 2, explanation: '중력은 지구가 물체를 중심 방향(아래쪽)으로 끌어당기는 힘입니다.' }
        ]
      },
      inferential: {
        title: '추론·통합력',
        problems: [
          { q: '고무 바닥 신발이 미끄러지지 않는 이유는?', options: ['중력이 크기 때문', '마찰력이 크기 때문', '탄성력이 크기 때문', '전기력이 크기 때문'], answer: 1, explanation: '고무 바닥은 마찰력이 커서 잘 미끄러지지 않습니다.' },
          { q: '풍선을 머리카락에 문지르면 머리카락이 붙는 이유는?', options: ['중력', '마찰력', '탄성력', '전기력'], answer: 3, explanation: '풍선과 머리카락 사이에 전기력이 작용하기 때문입니다.' }
        ]
      },
      critical: {
        title: '비판·적용력',
        problems: [
          { q: '트램펄린에서 높이 뛰어오를 수 있는 이유와 관련된 힘은?', options: ['중력', '마찰력', '탄성력', '자기력'], answer: 2, explanation: '트램펄린은 탄성력을 이용해 사람을 높이 튀어 오르게 합니다.' },
          { q: '자석의 같은 극끼리는 어떻게 되는가?', options: ['끌어당긴다', '밀어낸다', '변화 없다', '붙는다'], answer: 1, explanation: '자석의 같은 극끼리는 서로 밀어냅니다.' }
        ]
      }
    }
  },
  fit_physics_02: {
    title: '사과가 떨어진 이유, 중력의 발견',
    problems: {
      literal: {
        title: '핵심 이해력',
        problems: [
          { q: '뉴턴이 중력의 원리를 무엇이라 불렀는가?', options: ['탄성력', '만유인력', '마찰력', '전기력'], answer: 1, explanation: '뉴턴은 모든 물체가 서로 끌어당기는 힘을 만유인력이라 불렀습니다.' },
          { q: '달의 중력이 일으키는 현상은?', options: ['지진', '조석 현상', '폭풍', '화산'], answer: 1, explanation: '달의 중력은 바닷물을 끌어당겨 밀물과 썰물을 일으킵니다.' }
        ]
      },
      structural: {
        title: '구조 파악력',
        problems: [
          { q: '글의 전개 순서로 옳은 것은?', options: ['중력 개념→우주의 중력→만유인력→과학 혁명', '만유인력→중력 개념→과학 혁명→우주의 중력', '과학 혁명→중력 개념→우주의 중력→만유인력', '우주의 중력→과학 혁명→만유인력→중력 개념'], answer: 0, explanation: '1문단 중력 개념, 2문단 우주의 중력, 3문단 만유인력, 4문단 과학 혁명 순입니다.' },
          { q: '과학 혁명에 대해 설명한 문단은?', options: ['1문단', '2문단', '3문단', '4문단'], answer: 3, explanation: '4문단에서 뉴턴의 발견이 과학 혁명의 시작이었다고 설명합니다.' }
        ]
      },
      lexical: {
        title: '어휘 맥락력',
        problems: [
          { q: '"궤도"의 의미로 옳은 것은?', options: ['물체의 무게', '천체가 다른 천체 주위를 도는 길', '물체의 색깔', '힘의 단위'], answer: 1, explanation: '궤도는 천체가 다른 천체 주위를 도는 경로입니다.' },
          { q: '"질량"의 의미로 옳은 것은?', options: ['물체가 받는 중력', '물체가 가진 물질의 양', '물체의 속도', '물체의 크기'], answer: 1, explanation: '질량은 물체가 가지고 있는 물질의 양입니다.' }
        ]
      },
      inferential: {
        title: '추론·통합력',
        problems: [
          { q: '중력이 없다면 물은 어떻게 될까?', options: ['아래로 흐른다', '위로 올라간다', '둥둥 떠다닌다', '얼어붙는다'], answer: 2, explanation: '중력이 없으면 물이 한곳에 모이지 않고 둥둥 떠다닙니다.' },
          { q: '달이 지구 주위를 도는 이유는?', options: ['달의 중력', '지구의 중력', '태양의 중력', '마찰력'], answer: 1, explanation: '지구의 중력이 달을 끌어당겨 궤도를 따라 돌게 합니다.' }
        ]
      },
      critical: {
        title: '비판·적용력',
        problems: [
          { q: '인공위성이 지구 주위를 도는 원리와 관련된 힘은?', options: ['마찰력', '탄성력', '중력', '전기력'], answer: 2, explanation: '인공위성은 지구의 중력에 의해 궤도를 따라 돕니다.' },
          { q: '뉴턴 이전에 사람들이 믿었던 것은?', options: ['하늘과 땅이 같은 법칙', '하늘과 땅이 다른 법칙', '중력이 없다', '만유인력'], answer: 1, explanation: '뉴턴 이전에는 하늘의 별과 땅의 물체가 다른 법칙으로 움직인다고 생각했습니다.' }
        ]
      }
    }
  },
  fit_physics_03: {
    title: '달에서는 점프왕! 무게 vs 질량',
    problems: {
      literal: {
        title: '핵심 이해력',
        problems: [
          { q: '달의 중력은 지구의 약 몇 분의 1인가?', options: ['2분의 1', '4분의 1', '6분의 1', '10분의 1'], answer: 2, explanation: '달의 중력은 지구의 약 6분의 1 수준입니다.' },
          { q: '질량의 단위로 옳은 것은?', options: ['N', 'kgf', 'kg', 'V'], answer: 2, explanation: '질량은 kg이나 g처럼 양을 나타내는 단위로 표시합니다.' }
        ]
      },
      structural: {
        title: '구조 파악력',
        problems: [
          { q: '글의 전개 순서로 옳은 것은?', options: ['무게와 중력→장소에 따른 무게 변화→질량의 특징→우주 탐사', '질량→무게→중력→우주 탐사', '우주 탐사→무게→질량→중력', '중력→우주 탐사→무게→질량'], answer: 0, explanation: '1문단 무게와 중력, 2문단 장소에 따른 무게 변화, 3문단 질량, 4문단 우주 탐사 순입니다.' },
          { q: '질량의 특징을 설명한 문단은?', options: ['1문단', '2문단', '3문단', '4문단'], answer: 2, explanation: '3문단에서 질량은 장소가 바뀌어도 변하지 않는다고 설명합니다.' }
        ]
      },
      lexical: {
        title: '어휘 맥락력',
        problems: [
          { q: '"무게"의 의미로 옳은 것은?', options: ['물질의 양', '중력에 의해 받는 힘의 크기', '물체의 속도', '물체의 크기'], answer: 1, explanation: '무게는 중력에 의해 물체가 받는 힘의 크기입니다.' },
          { q: '"질량"과 "무게"의 차이로 옳은 것은?', options: ['같은 의미이다', '질량은 변하고 무게는 변하지 않는다', '질량은 변하지 않고 무게는 장소에 따라 변한다', '둘 다 장소에 따라 변한다'], answer: 2, explanation: '질량은 일정하지만 무게는 중력에 따라 변합니다.' }
        ]
      },
      inferential: {
        title: '추론·통합력',
        problems: [
          { q: '달에서 높이 점프할 수 있는 이유는?', options: ['질량이 줄어서', '중력이 약해서 무게가 가벼워져서', '공기가 없어서', '마찰력이 없어서'], answer: 1, explanation: '달의 중력이 약해 무게가 가벼워지기 때문입니다.' },
          { q: '목성에서 몸무게는 어떻게 될까?', options: ['가벼워진다', '무거워진다', '변하지 않는다', '0이 된다'], answer: 1, explanation: '목성은 중력이 강해서 같은 사람도 더 무겁게 느껴집니다.' }
        ]
      },
      critical: {
        title: '비판·적용력',
        problems: [
          { q: '지구에서 60kg인 사람이 달에서의 무게는 약 얼마인가?', options: ['60kg', '30kg', '10kg', '6kg'], answer: 2, explanation: '달의 중력이 1/6이므로 약 10kg 정도가 됩니다.' },
          { q: '우주 비행사가 우주에서 물건을 쉽게 옮길 수 있는 이유는?', options: ['질량이 0이라서', '무게가 거의 0이라서', '힘이 세져서', '물건이 작아져서'], answer: 1, explanation: '무중력 상태에서는 무게가 거의 0이지만 질량은 그대로입니다.' }
        ]
      }
    }
  },
  fit_physics_04: {
    title: '시소의 과학, 지렛대와 균형',
    problems: {
      literal: {
        title: '핵심 이해력',
        problems: [
          { q: '물체가 수평을 이루기 위한 요소가 아닌 것은?', options: ['받침점', '무게', '거리', '색깔'], answer: 3, explanation: '수평을 위해서는 받침점, 무게, 거리가 중요합니다.' },
          { q: '무게가 다른 두 물체가 균형을 이루려면?', options: ['같은 거리에 있어야 한다', '무거운 물체는 받침점 가까이', '가벼운 물체는 받침점 가까이', '무게는 관계없다'], answer: 1, explanation: '무거운 물체는 받침점 가까이, 가벼운 물체는 멀리 있어야 합니다.' }
        ]
      },
      structural: {
        title: '구조 파악력',
        problems: [
          { q: '글의 전개 순서로 옳은 것은?', options: ['균형 개념→균형 조건→실생활 적용→일상 활용', '실생활 적용→균형 개념→균형 조건→일상 활용', '일상 활용→균형 조건→균형 개념→실생활 적용', '균형 조건→일상 활용→실생활 적용→균형 개념'], answer: 0, explanation: '1문단 균형 개념, 2문단 균형 조건, 3문단 실생활 적용, 4문단 일상 활용 순입니다.' },
          { q: '시소와 저울의 예시가 나오는 문단은?', options: ['1문단', '2문단', '3문단', '4문단'], answer: 2, explanation: '3문단에서 시소, 저울, 크레인 등의 예시가 나옵니다.' }
        ]
      },
      lexical: {
        title: '어휘 맥락력',
        problems: [
          { q: '"받침점"의 의미로 옳은 것은?', options: ['물체의 무게', '물체와 받침점 사이의 간격', '물체가 회전하거나 지탱하는 중심', '구조물이 견디는 힘'], answer: 2, explanation: '받침점은 물체가 회전하거나 지탱하는 중심 부분입니다.' },
          { q: '"하중"의 의미로 옳은 것은?', options: ['물체의 색깔', '구조물이 견뎌야 하는 무게나 힘', '물체의 속도', '물체의 크기'], answer: 1, explanation: '하중은 구조물이 견뎌야 하는 무게나 힘입니다.' }
        ]
      },
      inferential: {
        title: '추론·통합력',
        problems: [
          { q: '양팔저울에서 무게가 같은 물체는 어떻게 배치해야 할까?', options: ['한쪽에만', '받침점에서 다른 거리에', '받침점에서 같은 거리에', '거리 상관없이'], answer: 2, explanation: '무게가 같은 물체는 받침점에서 같은 거리에 있어야 균형이 맞습니다.' },
          { q: '크레인이 무거운 물건을 들 수 있는 원리는?', options: ['전기력', '자기력', '지렛대 원리와 균형', '마찰력'], answer: 2, explanation: '크레인은 지렛대 원리와 균형을 이용해 무거운 물건을 들어올립니다.' }
        ]
      },
      critical: {
        title: '비판·적용력',
        problems: [
          { q: '모빌이 한쪽으로 기울지 않는 이유는?', options: ['무게가 모두 같아서', '각 조각이 균형을 이뤄서', '바람이 불어서', '실이 튼튼해서'], answer: 1, explanation: '모빌은 각 조각이 무게와 거리의 비율로 균형을 이루기 때문입니다.' },
          { q: '자전거를 탈 때 넘어지지 않으려면?', options: ['빠르게 달리기', '균형 유지하기', '무거운 짐 싣기', '앞만 보기'], answer: 1, explanation: '자전거는 균형을 유지해야 넘어지지 않습니다.' }
        ]
      }
    }
  },
  fit_physics_05: {
    title: '속력, 거리, 시간의 삼각관계',
    problems: {
      literal: {
        title: '핵심 이해력',
        problems: [
          { q: '과학에서 말하는 운동의 의미는?', options: ['달리기', '점프', '물체의 위치가 변하는 현상', '운동 경기'], answer: 2, explanation: '과학에서 운동은 시간이 지남에 따라 물체의 위치가 변하는 현상입니다.' },
          { q: '속력을 계산하는 방법은?', options: ['거리 ÷ 시간', '시간 ÷ 거리', '거리 × 시간', '거리 + 시간'], answer: 0, explanation: '속력은 일정한 시간 동안 이동한 거리로 계산합니다.' }
        ]
      },
      structural: {
        title: '구조 파악력',
        problems: [
          { q: '글의 전개 순서로 옳은 것은?', options: ['운동의 정의→기준점과 관찰자→운동의 세 요소→속력', '속력→운동의 정의→기준점→운동의 세 요소', '기준점→속력→운동의 정의→운동의 세 요소', '운동의 세 요소→기준점→속력→운동의 정의'], answer: 0, explanation: '1문단 운동의 정의, 2문단 기준점/관찰자, 3문단 세 요소, 4문단 속력 순입니다.' },
          { q: '속력에 대해 설명한 문단은?', options: ['1문단', '2문단', '3문단', '4문단'], answer: 3, explanation: '4문단에서 속력과 그 계산 방법을 설명합니다.' }
        ]
      },
      lexical: {
        title: '어휘 맥락력',
        problems: [
          { q: '"기준점"의 의미로 옳은 것은?', options: ['이동한 거리', '움직임을 판단하는 비교 기준 위치', '물체의 속도', '운동의 방향'], answer: 1, explanation: '기준점은 움직임을 판단하기 위한 비교 기준이 되는 위치입니다.' },
          { q: '"관찰자"의 역할로 옳은 것은?', options: ['물체를 움직이게 한다', '움직임을 바라보는 사람', '속력을 계산한다', '기준점을 정한다'], answer: 1, explanation: '관찰자는 움직임이나 현상을 바라보는 사람입니다.' }
        ]
      },
      inferential: {
        title: '추론·통합력',
        problems: [
          { q: '달리는 기차 안에서 창밖을 보면?', options: ['나무가 정지해 보인다', '나무가 움직이는 것처럼 보인다', '기차가 정지해 보인다', '변화가 없다'], answer: 1, explanation: '관찰자의 기준점에 따라 나무가 움직이는 것처럼 보입니다.' },
          { q: '같은 거리를 더 짧은 시간에 이동하면?', options: ['속력이 느려진다', '속력이 빨라진다', '속력은 변하지 않는다', '거리가 줄어든다'], answer: 1, explanation: '같은 거리를 더 짧은 시간에 이동하면 속력이 빨라집니다.' }
        ]
      },
      critical: {
        title: '비판·적용력',
        problems: [
          { q: '자동차가 1시간에 80km를 이동했다면 속력은?', options: ['80km/h', '40km/h', '160km/h', '80km'], answer: 0, explanation: '거리 80km ÷ 시간 1시간 = 시속 80km입니다.' },
          { q: '운동을 정확히 설명하기 위해 필요한 세 가지는?', options: ['속력, 무게, 색깔', '기준점, 방향, 거리', '시간, 무게, 크기', '방향, 색깔, 무게'], answer: 1, explanation: '운동을 설명하려면 기준점, 방향, 거리가 필요합니다.' }
        ]
      }
    }
  },
  fit_physics_06: {
    title: '전자들의 대이동, 전류와 전압',
    problems: {
      literal: {
        title: '핵심 이해력',
        problems: [
          { q: '전류의 단위는?', options: ['볼트(V)', '암페어(A)', '옴(Ω)', '와트(W)'], answer: 1, explanation: '전류의 세기는 암페어(A)로 나타냅니다.' },
          { q: '전압의 단위는?', options: ['암페어(A)', '볼트(V)', '옴(Ω)', '와트(W)'], answer: 1, explanation: '전압의 크기는 볼트(V)로 나타냅니다.' }
        ]
      },
      structural: {
        title: '구조 파악력',
        problems: [
          { q: '글의 전개 순서로 옳은 것은?', options: ['전류 개념→전압→옴의 법칙→안전 주의', '전압→전류→안전 주의→옴의 법칙', '옴의 법칙→전류→전압→안전 주의', '안전 주의→옴의 법칙→전류→전압'], answer: 0, explanation: '1문단 전류, 2문단 전압, 3문단 옴의 법칙, 4문단 안전 주의 순입니다.' },
          { q: '옴의 법칙을 설명한 문단은?', options: ['1문단', '2문단', '3문단', '4문단'], answer: 2, explanation: '3문단에서 전압, 전류, 저항의 관계(옴의 법칙)를 설명합니다.' }
        ]
      },
      lexical: {
        title: '어휘 맥락력',
        problems: [
          { q: '"저항"의 의미로 옳은 것은?', options: ['전류를 흐르게 하는 힘', '전류의 흐름을 방해하는 정도', '전자가 이동하는 것', '전기의 양'], answer: 1, explanation: '저항은 전류의 흐름을 방해하는 정도입니다.' },
          { q: '"전류"의 의미로 옳은 것은?', options: ['전압을 높이는 힘', '전자가 도선을 따라 흐르는 것', '저항을 줄이는 것', '전기를 저장하는 것'], answer: 1, explanation: '전류는 전자가 도선을 따라 이동하는 것입니다.' }
        ]
      },
      inferential: {
        title: '추론·통합력',
        problems: [
          { q: '전압이 높아지면 전류는?', options: ['줄어든다', '변하지 않는다', '더 세게 흐른다', '멈춘다'], answer: 2, explanation: '전압이 높을수록 전류가 더 세게 흐릅니다.' },
          { q: '저항이 커지면 같은 전압에서 전류는?', options: ['많아진다', '줄어든다', '변하지 않는다', '0이 된다'], answer: 1, explanation: '옴의 법칙에 따라 저항이 크면 전류가 줄어듭니다.' }
        ]
      },
      critical: {
        title: '비판·적용력',
        problems: [
          { q: '젖은 손으로 전기 기구를 만지면 안 되는 이유는?', options: ['전기가 안 통해서', '감전될 수 있어서', '기구가 고장 나서', '손이 더러워져서'], answer: 1, explanation: '물은 전기가 잘 통해서 감전될 위험이 있습니다.' },
          { q: '가정용 콘센트(220V)가 건전지(1.5V)보다 위험한 이유는?', options: ['크기가 커서', '전압이 높아서', '모양이 달라서', '위치가 높아서'], answer: 1, explanation: '220V는 1.5V보다 훨씬 높은 전압으로 위험합니다.' }
        ]
      }
    }
  },
  fit_physics_07: {
    title: '불이 켜지는 길, 전기 회로',
    problems: {
      literal: {
        title: '핵심 이해력',
        problems: [
          { q: '전류가 끊김 없이 흐를 수 있는 회로를 무엇이라 하는가?', options: ['개방 회로', '폐회로', '직렬 회로', '병렬 회로'], answer: 1, explanation: '전류가 끊김 없이 흐를 수 있는 닫힌 회로를 폐회로라고 합니다.' },
          { q: '직렬 연결에서 전구 하나가 고장 나면?', options: ['다른 전구도 꺼진다', '다른 전구는 켜져 있다', '더 밝아진다', '변화 없다'], answer: 0, explanation: '직렬 연결에서는 하나가 고장 나면 전체가 끊어집니다.' }
        ]
      },
      structural: {
        title: '구조 파악력',
        problems: [
          { q: '글의 전개 순서로 옳은 것은?', options: ['전기 회로 구성→회로도→직렬/병렬 연결→안전', '회로도→전기 회로 구성→안전→직렬/병렬', '안전→직렬/병렬→전기 회로 구성→회로도', '직렬/병렬→안전→회로도→전기 회로 구성'], answer: 0, explanation: '1문단 전기 회로, 2문단 회로도, 3문단 직렬/병렬, 4문단 안전 순입니다.' },
          { q: '직렬 연결과 병렬 연결을 설명한 문단은?', options: ['1문단', '2문단', '3문단', '4문단'], answer: 2, explanation: '3문단에서 직렬 연결과 병렬 연결을 비교 설명합니다.' }
        ]
      },
      lexical: {
        title: '어휘 맥락력',
        problems: [
          { q: '"병렬 연결"의 특징으로 옳은 것은?', options: ['한 줄로 이어 연결', '하나 고장 나면 전체 꺼짐', '따로따로 갈래지어 연결', '전류가 안 흐름'], answer: 2, explanation: '병렬 연결은 전기 부품을 따로따로 갈래지어 연결합니다.' },
          { q: '"퓨즈"의 역할로 옳은 것은?', options: ['전압을 높인다', '과전류 시 회로를 끊는다', '전류를 저장한다', '전기를 만든다'], answer: 1, explanation: '퓨즈는 과전류가 흐르면 녹아서 회로를 끊는 안전장치입니다.' }
        ]
      },
      inferential: {
        title: '추론·통합력',
        problems: [
          { q: '집의 전등이 병렬로 연결된 이유는?', options: ['전기를 아끼려고', '한 방 불이 꺼져도 다른 방은 영향 없게', '더 밝게 하려고', '설치가 쉬워서'], answer: 1, explanation: '병렬 연결은 하나가 꺼져도 다른 것에 영향을 주지 않습니다.' },
          { q: '스위치를 열면 어떻게 되는가?', options: ['폐회로가 된다', '개방 회로가 된다', '전류가 더 흐른다', '변화 없다'], answer: 1, explanation: '스위치를 열면 회로가 끊어져 개방 회로가 됩니다.' }
        ]
      },
      critical: {
        title: '비판·적용력',
        problems: [
          { q: '회로도의 전기 기호가 전 세계에서 같은 이유는?', options: ['예뻐서', '언어가 달라도 이해할 수 있게', '만들기 쉬워서', '전통이라서'], answer: 1, explanation: '같은 기호를 사용하면 언어가 달라도 회로를 이해할 수 있습니다.' },
          { q: '합선이 일어나면 어떤 문제가 발생하는가?', options: ['전기가 안 흐른다', '화재가 발생할 수 있다', '더 밝아진다', '전압이 낮아진다'], answer: 1, explanation: '합선이 일어나면 과열되어 화재가 발생할 수 있습니다.' }
        ]
      }
    }
  },
  fit_physics_08: {
    title: '끌어당기고 밀어내는 자석의 힘',
    problems: {
      literal: {
        title: '핵심 이해력',
        problems: [
          { q: '자석의 같은 극끼리는 어떻게 되는가?', options: ['끌어당긴다', '밀어낸다', '변화 없다', '붙는다'], answer: 1, explanation: '같은 극끼리는 서로 밀어내고(척력), 다른 극끼리는 끌어당깁니다(인력).' },
          { q: '자기력선의 방향은?', options: ['S극에서 N극으로', 'N극에서 S극으로', '위에서 아래로', '양쪽 모두에서'], answer: 1, explanation: '자기력선은 항상 N극에서 나와 S극으로 들어갑니다.' }
        ]
      },
      structural: {
        title: '구조 파악력',
        problems: [
          { q: '글의 전개 순서로 옳은 것은?', options: ['자석의 극→자기장→지구 자기장→자석 활용', '자기장→자석의 극→자석 활용→지구 자기장', '자석 활용→지구 자기장→자석의 극→자기장', '지구 자기장→자석 활용→자기장→자석의 극'], answer: 0, explanation: '1문단 자석의 극, 2문단 자기장, 3문단 지구 자기장, 4문단 자석 활용 순입니다.' },
          { q: '지구 자기장에 대해 설명한 문단은?', options: ['1문단', '2문단', '3문단', '4문단'], answer: 2, explanation: '3문단에서 지구 자기장과 나침반의 원리를 설명합니다.' }
        ]
      },
      lexical: {
        title: '어휘 맥락력',
        problems: [
          { q: '"자기장"의 의미로 옳은 것은?', options: ['자석의 극', '자석 주변에 자기력이 작용하는 공간', '자석의 색깔', '자석의 무게'], answer: 1, explanation: '자기장은 자석 주변에 자기력이 작용하는 공간입니다.' },
          { q: '"척력"의 의미로 옳은 것은?', options: ['끌어당기는 힘', '밀어내는 힘', '회전하는 힘', '떨어지는 힘'], answer: 1, explanation: '척력은 서로 밀어내는 힘입니다.' }
        ]
      },
      inferential: {
        title: '추론·통합력',
        problems: [
          { q: '자석을 반으로 쪼개면?', options: ['N극만 남는다', 'S극만 남는다', '각 조각에 N극과 S극이 생긴다', '자성이 사라진다'], answer: 2, explanation: '자석을 쪼개도 각 조각에 다시 N극과 S극이 생깁니다.' },
          { q: '나침반의 N극이 북쪽을 향하는 이유는?', options: ['지구 북극 근처에 S극이 있어서', '지구 북극 근처에 N극이 있어서', '태양의 영향', '달의 영향'], answer: 0, explanation: '지구의 북극 근처에 자석의 S극 역할을 하는 부분이 있기 때문입니다.' }
        ]
      },
      critical: {
        title: '비판·적용력',
        problems: [
          { q: '자기 부상 열차가 빠른 이유는?', options: ['무거워서', '마찰이 거의 없어서', '전기를 많이 써서', '바퀴가 많아서'], answer: 1, explanation: '자석의 척력으로 레일 위에 떠서 달리므로 마찰이 거의 없습니다.' },
          { q: '지구 자기장이 없다면 어떤 문제가 생길까?', options: ['나침반이 작동 안 함', '태양의 해로운 입자가 직접 도달', '철새가 길을 잃음', '이 모든 것'], answer: 3, explanation: '지구 자기장은 나침반, 생명체 보호, 철새 이동에 모두 중요합니다.' }
        ]
      }
    }
  },
  fit_physics_09: {
    title: '자석으로 전기를 만든다! 전자기 유도',
    problems: {
      literal: {
        title: '핵심 이해력',
        problems: [
          { q: '전자기 유도를 발견한 과학자는?', options: ['뉴턴', '갈릴레오', '패러데이', '아인슈타인'], answer: 2, explanation: '1831년 영국의 과학자 패러데이가 전자기 유도를 발견했습니다.' },
          { q: '발전기의 원리로 옳은 것은?', options: ['전기를 운동으로 바꾸기', '운동을 전기로 바꾸기', '열을 전기로 바꾸기', '빛을 전기로 바꾸기'], answer: 1, explanation: '발전기는 전자기 유도로 운동을 전기로 바꿉니다.' }
        ]
      },
      structural: {
        title: '구조 파악력',
        problems: [
          { q: '글의 전개 순서로 옳은 것은?', options: ['전자기 유도 발견→발전기→전동기/변압기→무선 충전', '발전기→전자기 유도→무선 충전→전동기', '전동기→발전기→전자기 유도→무선 충전', '무선 충전→전동기→발전기→전자기 유도'], answer: 0, explanation: '1문단 전자기 유도, 2문단 발전기, 3문단 전동기/변압기, 4문단 무선 충전 순입니다.' },
          { q: '무선 충전에 대해 설명한 문단은?', options: ['1문단', '2문단', '3문단', '4문단'], answer: 3, explanation: '4문단에서 무선 충전과 교통카드의 원리를 설명합니다.' }
        ]
      },
      lexical: {
        title: '어휘 맥락력',
        problems: [
          { q: '"전동기"의 역할로 옳은 것은?', options: ['운동을 전기로', '전기를 운동으로', '전압을 높이기', '전류를 저장하기'], answer: 1, explanation: '전동기는 전기 에너지를 운동 에너지로 바꾸는 장치입니다.' },
          { q: '"변압기"의 역할로 옳은 것은?', options: ['전류를 만들기', '전압을 높이거나 낮추기', '저항을 바꾸기', '에너지를 저장하기'], answer: 1, explanation: '변압기는 전압을 높이거나 낮추는 장치입니다.' }
        ]
      },
      inferential: {
        title: '추론·통합력',
        problems: [
          { q: '자석이 멈춰 있으면 전류는?', options: ['더 세게 흐른다', '흐르지 않는다', '방향이 바뀐다', '일정하게 흐른다'], answer: 1, explanation: '자석이 멈춰 있으면 자기장의 변화가 없어 전류가 흐르지 않습니다.' },
          { q: '전자기 유도가 발견되지 않았다면?', options: ['발전소가 없다', '전동기가 없다', '무선 충전이 없다', '이 모든 것'], answer: 3, explanation: '전자기 유도는 발전기, 전동기, 무선 충전의 기본 원리입니다.' }
        ]
      },
      critical: {
        title: '비판·적용력',
        problems: [
          { q: '선풍기가 돌아가는 원리와 관련된 것은?', options: ['발전기', '전동기', '변압기', '콘센트'], answer: 1, explanation: '선풍기는 전동기를 이용해 전기를 회전 운동으로 바꿉니다.' },
          { q: '무선 충전기 위에 스마트폰을 올려놓으면 충전되는 원리는?', options: ['마찰력', '중력', '전자기 유도', '탄성력'], answer: 2, explanation: '충전기의 자기장이 스마트폰 코일에 전류를 유도합니다.' }
        ]
      }
    }
  },
  fit_physics_10: {
    title: '출렁이며 퍼져나가는 파동',
    problems: {
      literal: {
        title: '핵심 이해력',
        problems: [
          { q: '파동에서 가장 높은 부분을 무엇이라 하는가?', options: ['골', '마루', '파장', '진동수'], answer: 1, explanation: '파동에서 가장 높은 부분을 마루, 가장 낮은 부분을 골이라고 합니다.' },
          { q: '소리는 어떤 종류의 파동인가?', options: ['횡파', '종파', '전자기파', '초음파'], answer: 1, explanation: '소리는 종파로, 공기 분자가 앞뒤로 진동하면서 전달됩니다.' }
        ]
      },
      structural: {
        title: '구조 파악력',
        problems: [
          { q: '글의 전개 순서로 옳은 것은?', options: ['파동 개념→횡파/종파→소리와 빛→파동 활용', '횡파/종파→파동 개념→파동 활용→소리와 빛', '소리와 빛→파동 활용→파동 개념→횡파/종파', '파동 활용→소리와 빛→횡파/종파→파동 개념'], answer: 0, explanation: '1문단 파동 개념, 2문단 횡파/종파, 3문단 소리/빛, 4문단 파동 활용 순입니다.' },
          { q: '초음파 검사에 대해 설명한 문단은?', options: ['1문단', '2문단', '3문단', '4문단'], answer: 3, explanation: '4문단에서 초음파 검사와 박쥐, 지진파 등을 설명합니다.' }
        ]
      },
      lexical: {
        title: '어휘 맥락력',
        problems: [
          { q: '"횡파"의 특징으로 옳은 것은?', options: ['진동 방향이 진행 방향과 같다', '진동 방향이 진행 방향과 수직', '소리가 대표적이다', '공기가 필요 없다'], answer: 1, explanation: '횡파는 진동 방향이 파동의 진행 방향과 수직입니다.' },
          { q: '"파장"의 의미로 옳은 것은?', options: ['파동의 높이', '마루에서 마루까지의 거리', '1초에 진동하는 횟수', '파동의 속도'], answer: 1, explanation: '파장은 마루에서 마루까지(또는 골에서 골까지)의 거리입니다.' }
        ]
      },
      inferential: {
        title: '추론·통합력',
        problems: [
          { q: '진동수가 높은 소리는?', options: ['낮은음', '높은음', '작은 소리', '큰 소리'], answer: 1, explanation: '진동수가 클수록 높은 소리가 납니다.' },
          { q: '빛이 진공에서도 전달될 수 있는 이유는?', options: ['종파이기 때문', '전자기파이기 때문', '공기가 있기 때문', '물이 있기 때문'], answer: 1, explanation: '빛은 전자기파로 매질 없이도 전달됩니다.' }
        ]
      },
      critical: {
        title: '비판·적용력',
        problems: [
          { q: '초음파 검사가 가능한 이유는?', options: ['소리가 반사되기 때문', '빛이 굴절되기 때문', '열이 전달되기 때문', '전류가 흐르기 때문'], answer: 0, explanation: '초음파는 몸 안에서 반사되어 돌아오는 것을 분석합니다.' },
          { q: '지진파를 분석하면 알 수 있는 것은?', options: ['날씨', '지구 내부 구조', '바다의 깊이', '공기의 온도'], answer: 1, explanation: '과학자들은 지진파를 분석해 지구 내부 구조를 연구합니다.' }
        ]
      }
    }
  }
};

// 패턴: learning-common.js 로드 전에 REMEDIAL_BANK 삽입
const learningCommonPattern = /(<script[^>]*src="[^"]*learning-common\.js[^"]*"[^>]*><\/script>)/;

for (let i = 1; i <= 10; i++) {
  const num = String(i).padStart(2, '0');
  const unitKey = `fit_physics_${num}`;
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'science', `fit_physics_${num}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // 이미 window.REMEDIAL_BANK가 있는지 확인
  if (content.includes('window.REMEDIAL_BANK')) {
    console.log(`[SKIP] fit_physics_${num} 이미 REMEDIAL_BANK 존재`);
    continue;
  }

  const physicsData = PHYSICS_DATA[unitKey];
  if (!physicsData) {
    console.log(`[SKIP] fit_physics_${num} 데이터 없음`);
    continue;
  }

  const match = content.match(learningCommonPattern);
  if (!match) {
    console.log(`[WARN] fit_physics_${num} learning-common.js 패턴 없음`);
    continue;
  }

  // REMEDIAL_BANK 스크립트 삽입
  const remedialScript = `<!-- ✅ 보완학습 데이터 (learning-common.js 로드 전에 정의) -->
<script>
window.REMEDIAL_BANK = ${JSON.stringify(physicsData.problems, null, 2)};
</script>

${match[0]}`;

  content = content.replace(learningCommonPattern, remedialScript);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`[OK] fit_physics_${num} REMEDIAL_BANK 추가 완료 (${physicsData.title})`);
}

console.log('\n✅ fit_physics_01~10 보완학습 데이터 추가 완료!');

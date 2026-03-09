const fs = require('fs');
const path = require('path');

// fit_physics_01~10 올바른 물리 보완학습 데이터
const PHYSICS_DATA = {
  fit_physics_01: {
    title: '💪 힘, 세상을 움직이는 보이지 않는 손',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "힘의 정의로 알맞은 것은?", options: ["물체의 무게", "물체의 운동 상태를 변화시키는 작용", "물체의 크기", "물체의 색깔"], answer: 1, explanation: "힘은 물체의 운동 상태를 변화시키는 작용입니다." },
          { q: "힘의 단위는 무엇인가요?", options: ["미터(m)", "킬로그램(kg)", "뉴턴(N)", "초(s)"], answer: 2, explanation: "힘의 단위는 뉴턴(N)입니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "이 글에서 힘의 효과로 설명한 것이 아닌 것은?", options: ["물체를 움직이게 함", "물체의 모양을 변화시킴", "물체의 색을 바꿈", "물체의 속도를 변화시킴"], answer: 2, explanation: "힘은 물체의 운동 상태나 모양을 변화시키지만, 색을 바꾸지는 않습니다." },
          { q: "힘의 세 가지 요소에 해당하지 않는 것은?", options: ["크기", "방향", "작용점", "색깔"], answer: 3, explanation: "힘의 세 가지 요소는 크기, 방향, 작용점입니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'마찰력'의 의미로 알맞은 것은?", options: ["물체를 밀어내는 힘", "물체의 운동을 방해하는 힘", "물체를 당기는 힘", "물체를 회전시키는 힘"], answer: 1, explanation: "마찰력은 두 물체가 접촉할 때 운동을 방해하는 힘입니다." },
          { q: "'중력'의 뜻으로 알맞은 것은?", options: ["위로 당기는 힘", "옆으로 미는 힘", "지구가 물체를 끌어당기는 힘", "공기가 미는 힘"], answer: 2, explanation: "중력은 지구가 물체를 아래로 끌어당기는 힘입니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "축구공을 발로 차면 공이 날아가는 이유는?", options: ["공이 가벼워서", "힘이 공의 운동 상태를 바꾸기 때문", "공기가 밀어서", "중력 때문"], answer: 1, explanation: "발로 공을 차면 힘이 작용하여 공의 운동 상태가 변합니다." },
          { q: "같은 힘으로 무거운 물체와 가벼운 물체를 밀면?", options: ["무거운 물체가 더 빨리 움직임", "가벼운 물체가 더 빨리 움직임", "둘 다 같이 움직임", "둘 다 안 움직임"], answer: 1, explanation: "같은 힘이면 질량이 작은(가벼운) 물체가 더 빨리 움직입니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "빙판길에서 미끄러지지 않으려면?", options: ["빨리 뛰어야 함", "마찰력이 큰 신발을 신어야 함", "점프하며 걸어야 함", "눈을 감아야 함"], answer: 1, explanation: "마찰력이 큰 신발을 신으면 미끄러지지 않습니다." },
          { q: "문을 열 때 손잡이를 잡는 위치가 중요한 이유는?", options: ["예쁘게 보이려고", "작용점에 따라 힘의 효과가 달라지기 때문", "문이 망가지지 않게", "소리가 안 나게"], answer: 1, explanation: "힘의 작용점 위치에 따라 회전 효과가 달라집니다." }
        ]
      }
    }
  },
  fit_physics_02: {
    title: '🍎 사과가 떨어진 이유, 중력의 발견',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "중력을 발견한 과학자는?", options: ["갈릴레오", "뉴턴", "아인슈타인", "에디슨"], answer: 1, explanation: "아이작 뉴턴이 사과가 떨어지는 것을 보고 중력을 발견했습니다." },
          { q: "중력이 작용하는 방향은?", options: ["위쪽", "옆쪽", "아래쪽(지구 중심)", "모든 방향"], answer: 2, explanation: "중력은 항상 지구 중심 방향, 즉 아래쪽으로 작용합니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "이 글에서 중력의 영향을 받는 현상으로 설명한 것은?", options: ["물체가 떠오름", "물체가 아래로 떨어짐", "물체가 옆으로 이동", "물체가 회전함"], answer: 1, explanation: "중력 때문에 물체는 아래로 떨어집니다." },
          { q: "중력의 크기에 영향을 주는 요소는?", options: ["물체의 색깔", "물체의 질량", "물체의 모양", "물체의 온도"], answer: 1, explanation: "중력의 크기는 물체의 질량에 비례합니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'만유인력'의 의미로 알맞은 것은?", options: ["지구만 당기는 힘", "모든 물체 사이에 작용하는 끌어당기는 힘", "자석의 힘", "전기의 힘"], answer: 1, explanation: "만유인력은 모든 물체 사이에 작용하는 서로 끌어당기는 힘입니다." },
          { q: "'자유 낙하'의 뜻으로 알맞은 것은?", options: ["물체가 위로 올라가는 것", "물체가 공기 저항 없이 떨어지는 것", "물체가 옆으로 이동하는 것", "물체가 정지하는 것"], answer: 1, explanation: "자유 낙하는 중력만 작용하여 물체가 떨어지는 현상입니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "달에서 물체를 떨어뜨리면 지구보다 어떻게 될까요?", options: ["더 빨리 떨어짐", "더 천천히 떨어짐", "똑같이 떨어짐", "떨어지지 않음"], answer: 1, explanation: "달의 중력이 지구보다 약해서 더 천천히 떨어집니다." },
          { q: "지구가 태양 주위를 도는 이유는?", options: ["바람 때문에", "태양의 중력이 지구를 끌어당기기 때문", "지구가 스스로 돌기 때문", "달이 밀기 때문"], answer: 1, explanation: "태양의 중력이 지구를 끌어당겨 공전하게 합니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "우주정거장에서 물체가 둥둥 뜨는 이유는?", options: ["중력이 없어서", "중력과 원심력이 균형을 이뤄 무중력 상태이기 때문", "공기가 없어서", "온도가 낮아서"], answer: 1, explanation: "우주정거장은 지구 주위를 돌며 중력과 원심력이 균형을 이뤄 무중력 상태가 됩니다." },
          { q: "낙하산이 천천히 떨어지는 원리는?", options: ["중력이 약해져서", "공기 저항이 커져서 낙하 속도가 줄어듦", "질량이 변해서", "부력 때문에"], answer: 1, explanation: "낙하산은 넓은 면적으로 공기 저항을 크게 받아 천천히 떨어집니다." }
        ]
      }
    }
  },
  fit_physics_03: {
    title: '🌙 달에서는 점프왕! 무게 vs 질량',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "질량의 정의로 알맞은 것은?", options: ["물체에 작용하는 중력의 크기", "물체가 가진 물질의 양", "물체의 부피", "물체의 속도"], answer: 1, explanation: "질량은 물체가 가진 물질의 양입니다." },
          { q: "무게의 단위는?", options: ["킬로그램(kg)", "뉴턴(N)", "미터(m)", "리터(L)"], answer: 1, explanation: "무게는 힘이므로 단위는 뉴턴(N)입니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "질량과 무게의 차이점으로 알맞은 것은?", options: ["둘 다 장소에 따라 변함", "질량은 변하지 않고 무게는 장소에 따라 변함", "둘 다 변하지 않음", "무게는 변하지 않고 질량이 변함"], answer: 1, explanation: "질량은 어디서나 같지만, 무게는 중력에 따라 달라집니다." },
          { q: "무게를 측정하는 도구는?", options: ["윗접시 저울", "용수철 저울", "양팔 저울", "눈금 실린더"], answer: 1, explanation: "용수철 저울은 중력(무게)을 측정합니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'무중력'의 의미로 알맞은 것은?", options: ["무게가 매우 큰 상태", "중력이 느껴지지 않는 상태", "질량이 없는 상태", "물체가 정지한 상태"], answer: 1, explanation: "무중력은 중력이 작용하지 않는 것처럼 느껴지는 상태입니다." },
          { q: "'중력 가속도'의 뜻으로 알맞은 것은?", options: ["물체의 질량", "중력에 의해 물체가 빨라지는 정도", "물체의 속도", "물체의 방향"], answer: 1, explanation: "중력 가속도는 중력에 의해 물체가 1초마다 빨라지는 정도입니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "달에서 지구보다 높이 점프할 수 있는 이유는?", options: ["달의 질량이 커서", "달의 중력이 약해서 무게가 가벼워지기 때문", "달에 공기가 없어서", "달이 작아서"], answer: 1, explanation: "달의 중력이 지구의 약 1/6이라 무게가 가벼워져 높이 뛸 수 있습니다." },
          { q: "지구에서 60kg인 사람이 달에 가면?", options: ["질량과 무게 모두 줄어듦", "질량은 같고 무게만 줄어듦", "질량과 무게 모두 늘어남", "질량만 줄어듦"], answer: 1, explanation: "질량(60kg)은 그대로이지만, 무게는 약 1/6로 줄어듭니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "양팔 저울로 측정하는 것은?", options: ["무게", "질량", "부피", "길이"], answer: 1, explanation: "양팔 저울은 기준 추와 비교하여 질량을 측정합니다." },
          { q: "우주에서 체중계에 올라가면?", options: ["몸무게가 늘어남", "몸무게가 0에 가까워짐", "몸무게가 변하지 않음", "체중계가 작동 안 함"], answer: 1, explanation: "무중력 상태에서는 무게가 거의 0이 됩니다." }
        ]
      }
    }
  },
  fit_physics_04: {
    title: '⚖️ 시소의 과학, 지렛대와 균형',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "지렛대의 세 가지 요소가 아닌 것은?", options: ["받침점", "힘점", "작용점", "출발점"], answer: 3, explanation: "지렛대의 세 요소는 받침점, 힘점, 작용점입니다." },
          { q: "지렛대를 사용하면 좋은 점은?", options: ["물체가 가벼워짐", "작은 힘으로 무거운 물체를 들 수 있음", "물체가 사라짐", "물체가 빨라짐"], answer: 1, explanation: "지렛대를 이용하면 작은 힘으로 무거운 물체를 움직일 수 있습니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "시소가 균형을 이루려면?", options: ["한쪽만 무거우면 됨", "양쪽의 (무게×거리)가 같아야 함", "받침점이 없어야 함", "한쪽만 앉으면 됨"], answer: 1, explanation: "시소는 양쪽의 (무게×받침점까지 거리)가 같을 때 균형을 이룹니다." },
          { q: "1종 지렛대의 특징은?", options: ["받침점이 중간에 있음", "힘점이 중간에 있음", "작용점이 중간에 있음", "세 점이 모두 같은 위치"], answer: 0, explanation: "1종 지렛대는 받침점이 힘점과 작용점 사이에 있습니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'받침점'의 의미로 알맞은 것은?", options: ["힘을 가하는 점", "물체가 놓인 점", "지렛대가 회전하는 중심점", "힘이 작용하는 점"], answer: 2, explanation: "받침점은 지렛대가 회전하는 중심이 되는 점입니다." },
          { q: "'토크'(돌림힘)의 뜻으로 알맞은 것은?", options: ["직선으로 미는 힘", "물체를 회전시키는 힘", "물체를 정지시키는 힘", "물체를 당기는 힘"], answer: 1, explanation: "토크는 물체를 회전시키려는 힘의 효과입니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "시소에서 무거운 사람이 균형을 맞추려면?", options: ["받침점에서 더 멀리 앉아야 함", "받침점에서 더 가까이 앉아야 함", "일어서야 함", "점프해야 함"], answer: 1, explanation: "무거운 사람은 받침점에 가까이 앉아야 균형이 맞습니다." },
          { q: "병따개가 작은 힘으로 뚜껑을 열 수 있는 이유는?", options: ["뚜껑이 약해서", "지렛대 원리로 힘이 증폭되기 때문", "마찰력 때문", "중력 때문"], answer: 1, explanation: "병따개는 지렛대 원리를 이용해 작은 힘을 큰 힘으로 바꿉니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "손톱깎이에 적용된 원리는?", options: ["도르래", "지렛대", "빗면", "바퀴와 축"], answer: 1, explanation: "손톱깎이는 지렛대 원리를 이용합니다." },
          { q: "무거운 바위를 들어올리려면 막대를 어떻게 놓아야 할까요?", options: ["받침점을 바위에서 멀리", "받침점을 바위 가까이에", "막대를 짧게", "막대를 세워서"], answer: 1, explanation: "받침점을 바위 가까이 놓으면 작은 힘으로 들 수 있습니다." }
        ]
      }
    }
  },
  fit_physics_05: {
    title: '🏃 속력, 거리, 시간의 삼각관계',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "속력을 구하는 공식은?", options: ["속력 = 거리 × 시간", "속력 = 거리 ÷ 시간", "속력 = 시간 ÷ 거리", "속력 = 거리 + 시간"], answer: 1, explanation: "속력 = 거리 ÷ 시간입니다." },
          { q: "속력의 단위로 알맞은 것은?", options: ["m, km", "s, h", "m/s, km/h", "kg, g"], answer: 2, explanation: "속력의 단위는 m/s(미터 매 초)나 km/h(킬로미터 매 시)입니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "속력이 일정할 때 거리와 시간의 관계는?", options: ["거리가 늘면 시간이 줄어듦", "거리가 늘면 시간도 늘어남", "거리와 시간은 관계없음", "시간이 늘면 거리가 줄어듦"], answer: 1, explanation: "속력이 일정하면 거리가 늘어날수록 시간도 늘어납니다." },
          { q: "평균 속력과 순간 속력의 차이는?", options: ["둘 다 같음", "평균 속력은 전체 이동의 평균, 순간 속력은 특정 순간의 속력", "순간 속력은 항상 더 느림", "평균 속력은 측정 불가"], answer: 1, explanation: "평균 속력은 전체 거리를 전체 시간으로 나눈 것이고, 순간 속력은 특정 순간의 빠르기입니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'등속 운동'의 의미로 알맞은 것은?", options: ["점점 빨라지는 운동", "속력이 일정한 운동", "점점 느려지는 운동", "정지한 상태"], answer: 1, explanation: "등속 운동은 속력이 변하지 않고 일정하게 움직이는 것입니다." },
          { q: "'가속'의 뜻으로 알맞은 것은?", options: ["속력이 줄어드는 것", "속력이 늘어나는 것", "방향이 바뀌는 것", "정지하는 것"], answer: 1, explanation: "가속은 속력이 점점 빨라지는 것입니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "100m를 10초에 달리면 속력은?", options: ["10 m/s", "100 m/s", "1000 m/s", "1 m/s"], answer: 0, explanation: "속력 = 100m ÷ 10s = 10 m/s입니다." },
          { q: "같은 거리를 더 짧은 시간에 이동하면?", options: ["속력이 느려짐", "속력이 빨라짐", "속력이 같음", "거리가 줄어듦"], answer: 1, explanation: "같은 거리를 더 짧은 시간에 가면 속력이 빨라집니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "자동차 속도계가 보여주는 것은?", options: ["평균 속력", "순간 속력", "총 이동 거리", "남은 연료"], answer: 1, explanation: "자동차 속도계는 그 순간의 속력(순간 속력)을 보여줍니다." },
          { q: "마라톤 선수가 42km를 2시간에 완주했다면 평균 속력은?", options: ["84 km/h", "21 km/h", "42 km/h", "20 km/h"], answer: 1, explanation: "평균 속력 = 42km ÷ 2h = 21 km/h입니다." }
        ]
      }
    }
  },
  fit_physics_06: {
    title: '⚡ 전자들의 대이동, 전류와 전압',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "전류의 정의로 알맞은 것은?", options: ["전자가 정지한 상태", "전자의 흐름", "전자의 크기", "전자의 색깔"], answer: 1, explanation: "전류는 전자가 도선을 따라 이동하는 흐름입니다." },
          { q: "전류의 단위는?", options: ["볼트(V)", "암페어(A)", "옴(Ω)", "와트(W)"], answer: 1, explanation: "전류의 단위는 암페어(A)입니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "전압과 전류의 관계로 알맞은 것은?", options: ["전압이 높으면 전류가 줄어듦", "전압이 높으면 전류가 많이 흐름", "전압과 전류는 관계없음", "전류가 많으면 전압이 낮아짐"], answer: 1, explanation: "전압이 높을수록 전류가 많이 흐릅니다." },
          { q: "전압의 역할은?", options: ["전자를 멈추게 함", "전자를 밀어주는 힘 제공", "전자를 없앰", "전자를 만듦"], answer: 1, explanation: "전압은 전자를 밀어주어 전류가 흐르게 하는 힘입니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'전압'의 의미로 알맞은 것은?", options: ["전자의 개수", "전류를 흐르게 하는 압력", "전선의 굵기", "전자의 속도"], answer: 1, explanation: "전압은 전류를 흐르게 하는 전기적 압력입니다." },
          { q: "'저항'의 뜻으로 알맞은 것은?", options: ["전류를 잘 흐르게 함", "전류의 흐름을 방해하는 정도", "전압을 높임", "전자를 만듦"], answer: 1, explanation: "저항은 전류의 흐름을 방해하는 정도입니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "건전지 2개를 직렬로 연결하면?", options: ["전압이 낮아짐", "전압이 높아짐", "전압이 그대로", "전류가 0이 됨"], answer: 1, explanation: "건전지를 직렬로 연결하면 전압이 더해집니다." },
          { q: "전선이 굵으면 저항이 어떻게 될까요?", options: ["저항이 커짐", "저항이 작아짐", "저항이 그대로", "전압이 낮아짐"], answer: 1, explanation: "전선이 굵으면 전류가 지나갈 공간이 넓어 저항이 작아집니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "물탱크와 전기회로를 비교할 때 물높이에 해당하는 것은?", options: ["전류", "전압", "저항", "전력"], answer: 1, explanation: "물탱크의 물높이(수압)는 전기회로의 전압에 해당합니다." },
          { q: "전구에 더 밝은 빛을 내려면?", options: ["전압을 낮춤", "전압을 높임", "전선을 길게 함", "스위치를 끔"], answer: 1, explanation: "전압을 높이면 전류가 많이 흘러 전구가 더 밝아집니다." }
        ]
      }
    }
  },
  fit_physics_07: {
    title: '💡 불이 켜지는 길, 전기 회로',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "전기 회로가 작동하려면?", options: ["회로가 끊어져야 함", "회로가 닫혀 있어야 함", "스위치가 열려 있어야 함", "전구가 없어야 함"], answer: 1, explanation: "전기 회로는 닫혀 있어야 전류가 흐릅니다." },
          { q: "직렬 연결의 특징은?", options: ["전구가 하나 꺼지면 다 꺼짐", "전구가 하나 꺼져도 나머지는 켜짐", "전압이 나눠지지 않음", "전류가 나눠짐"], answer: 0, explanation: "직렬 연결에서는 한 전구가 꺼지면 회로가 끊겨 모두 꺼집니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "병렬 연결의 장점은?", options: ["전구가 더 밝아짐", "한 전구가 꺼져도 나머지는 켜짐", "전기를 더 많이 사용함", "배선이 간단함"], answer: 1, explanation: "병렬 연결에서는 한 전구가 꺼져도 다른 전구는 계속 켜집니다." },
          { q: "가정의 전기 배선은 주로 어떤 방식?", options: ["직렬 연결", "병렬 연결", "혼합 연결만", "연결 안 됨"], answer: 1, explanation: "가정은 한 기기가 꺼져도 다른 기기가 작동하도록 병렬 연결입니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'단락'(합선)의 의미로 알맞은 것은?", options: ["회로가 정상 작동하는 것", "저항 없이 전류가 직접 흐르는 것", "전류가 멈추는 것", "전압이 높아지는 것"], answer: 1, explanation: "단락은 전선이 직접 연결되어 저항 없이 큰 전류가 흐르는 위험한 상황입니다." },
          { q: "'도체'의 뜻으로 알맞은 것은?", options: ["전기가 안 통하는 물질", "전기가 잘 통하는 물질", "빛이 통과하는 물질", "열이 안 전달되는 물질"], answer: 1, explanation: "도체는 구리, 철처럼 전기가 잘 통하는 물질입니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "전구 2개를 직렬로 연결하면 밝기는?", options: ["각각 연결할 때보다 밝아짐", "각각 연결할 때보다 어두워짐", "밝기가 같음", "불이 안 켜짐"], answer: 1, explanation: "직렬 연결에서는 전압이 나눠져 각 전구가 어두워집니다." },
          { q: "스위치의 역할은?", options: ["전압을 높임", "회로를 열고 닫아 전류를 제어", "저항을 없앰", "전구를 밝게 함"], answer: 1, explanation: "스위치는 회로를 열거나 닫아 전류의 흐름을 제어합니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "크리스마스 트리 전구가 하나 꺼지면 다 꺼지는 경우, 연결 방식은?", options: ["병렬", "직렬", "혼합", "무선"], answer: 1, explanation: "하나가 꺼지면 다 꺼지는 것은 직렬 연결의 특징입니다." },
          { q: "멀티탭에 여러 기기를 꽂을 수 있는 이유는?", options: ["직렬 연결이라서", "병렬 연결이라서", "전압이 높아서", "저항이 없어서"], answer: 1, explanation: "멀티탭은 병렬 연결로 각 기기가 독립적으로 작동합니다." }
        ]
      }
    }
  },
  fit_physics_08: {
    title: '🧲 끌어당기고 밀어내는 자석의 힘',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "자석의 양 끝을 무엇이라 하나요?", options: ["중심", "극", "축", "면"], answer: 1, explanation: "자석의 양 끝을 극(N극, S극)이라고 합니다." },
          { q: "같은 극끼리는 어떤 힘이 작용하나요?", options: ["끌어당기는 힘", "밀어내는 힘", "힘이 없음", "회전하는 힘"], answer: 1, explanation: "같은 극(N-N, S-S)끼리는 서로 밀어냅니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "자석이 끌어당기는 물질은?", options: ["나무", "플라스틱", "철, 니켈, 코발트", "유리"], answer: 2, explanation: "자석은 철, 니켈, 코발트 같은 자성체를 끌어당깁니다." },
          { q: "자기장의 방향은?", options: ["S극에서 N극으로", "N극에서 S극으로", "위에서 아래로", "무작위"], answer: 1, explanation: "자기장은 N극에서 나와 S극으로 들어갑니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'자기장'의 의미로 알맞은 것은?", options: ["자석의 크기", "자석의 힘이 작용하는 공간", "자석의 색깔", "자석의 무게"], answer: 1, explanation: "자기장은 자석의 힘이 미치는 공간입니다." },
          { q: "'영구 자석'의 뜻으로 알맞은 것은?", options: ["잠시만 자석인 것", "항상 자석 성질을 유지하는 것", "전기가 필요한 자석", "녹슨 자석"], answer: 1, explanation: "영구 자석은 외부 힘 없이도 계속 자석 성질을 유지합니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "나침반의 N극이 북쪽을 가리키는 이유는?", options: ["나침반이 가벼워서", "지구 자체가 큰 자석이기 때문", "바람 때문", "중력 때문"], answer: 1, explanation: "지구가 큰 자석이라 나침반의 N극이 지구의 자북극을 가리킵니다." },
          { q: "자석을 반으로 자르면?", options: ["자석이 아니게 됨", "두 개의 자석이 됨", "한쪽만 자석임", "자기장이 사라짐"], answer: 1, explanation: "자석을 자르면 각 조각이 N극과 S극을 가진 새로운 자석이 됩니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "자기 부상 열차의 원리는?", options: ["바퀴가 빨리 돌아서", "자석의 밀어내는 힘으로 떠서", "프로펠러로 날아서", "중력이 없어서"], answer: 1, explanation: "같은 극의 밀어내는 힘으로 열차가 레일 위에 떠서 달립니다." },
          { q: "신용카드 뒤의 검은 띠에 자석을 대면 안 되는 이유는?", options: ["카드가 녹아서", "자기 정보가 지워질 수 있어서", "카드가 무거워져서", "색이 변해서"], answer: 1, explanation: "검은 띠에는 자기 정보가 저장되어 있어 자석이 정보를 손상시킬 수 있습니다." }
        ]
      }
    }
  },
  fit_physics_09: {
    title: '🔄 자석으로 전기를 만든다! 전자기 유도',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "전자기 유도를 발견한 과학자는?", options: ["뉴턴", "패러데이", "에디슨", "갈릴레오"], answer: 1, explanation: "마이클 패러데이가 전자기 유도 현상을 발견했습니다." },
          { q: "전자기 유도란?", options: ["자석이 전류를 끌어당김", "자기장 변화로 전류가 발생하는 현상", "전류가 자석을 만드는 것", "전기가 사라지는 현상"], answer: 1, explanation: "전자기 유도는 자기장의 변화로 전류가 유도되는 현상입니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "발전기의 작동 원리는?", options: ["전류로 자석을 만듦", "자석을 회전시켜 전류 생산", "열로 전기를 만듦", "빛으로 전기를 만듦"], answer: 1, explanation: "발전기는 자석이나 코일을 회전시켜 전자기 유도로 전류를 생산합니다." },
          { q: "전동기(모터)와 발전기의 관계는?", options: ["전혀 다른 원리", "반대 과정: 전동기는 전기→운동, 발전기는 운동→전기", "같은 기계임", "둘 다 열을 만듦"], answer: 1, explanation: "전동기는 전기로 운동을, 발전기는 운동으로 전기를 만듭니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'유도 전류'의 의미로 알맞은 것은?", options: ["항상 흐르는 전류", "자기장 변화로 생기는 전류", "건전지에서 나오는 전류", "정지한 전류"], answer: 1, explanation: "유도 전류는 자기장이 변할 때 생기는 전류입니다." },
          { q: "'전자석'의 뜻으로 알맞은 것은?", options: ["영구 자석", "전류가 흐를 때만 자석이 되는 것", "자연에서 발견되는 자석", "플라스틱 자석"], answer: 1, explanation: "전자석은 코일에 전류가 흐를 때만 자석 성질을 가집니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "자전거 발전기(다이나모)로 불을 켜는 원리는?", options: ["배터리에서 전기 공급", "바퀴 회전으로 자석이 돌아 전류 발생", "태양열로 발전", "바람으로 발전"], answer: 1, explanation: "바퀴가 돌면 발전기 안의 자석이 회전해 전자기 유도로 전류가 생깁니다." },
          { q: "코일을 더 빨리 회전시키면?", options: ["전류가 줄어듦", "전류가 늘어남", "전류가 그대로", "자석이 사라짐"], answer: 1, explanation: "자기장 변화가 빨라지면 더 많은 전류가 유도됩니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "무선 충전기의 작동 원리는?", options: ["전선으로 전달", "전자기 유도로 전력 전달", "빛으로 충전", "열로 충전"], answer: 1, explanation: "무선 충전기는 전자기 유도로 코일 사이에 전력을 전달합니다." },
          { q: "화력발전소에서 터빈을 돌리는 이유는?", options: ["열을 식히려고", "발전기를 돌려 전자기 유도로 전기를 만들려고", "물을 끓이려고", "연기를 내보내려고"], answer: 1, explanation: "터빈이 발전기를 돌려 전자기 유도로 전기를 생산합니다." }
        ]
      }
    }
  },
  fit_physics_10: {
    title: '🌊 출렁이며 퍼져나가는 파동',
    problems: {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "파동의 정의로 알맞은 것은?", options: ["물체의 이동", "에너지가 전달되며 퍼져나가는 현상", "빛의 색깔", "소리의 크기"], answer: 1, explanation: "파동은 에너지가 매질을 통해 퍼져나가는 현상입니다." },
          { q: "파동의 가장 높은 부분을 무엇이라 하나요?", options: ["골", "마루", "진폭", "파장"], answer: 1, explanation: "파동의 가장 높은 부분을 마루, 가장 낮은 부분을 골이라 합니다." }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "횡파와 종파의 차이는?", options: ["둘 다 같은 방향으로 진동", "횡파는 수직, 종파는 평행하게 진동", "종파만 에너지 전달", "횡파만 매질 필요"], answer: 1, explanation: "횡파는 진행 방향과 수직으로, 종파는 평행하게 진동합니다." },
          { q: "파장이란?", options: ["파동의 높이", "마루에서 다음 마루까지의 거리", "파동의 세기", "진동 횟수"], answer: 1, explanation: "파장은 마루에서 다음 마루(또는 골에서 골)까지의 거리입니다." }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "'진폭'의 의미로 알맞은 것은?", options: ["파동의 길이", "평형 위치에서 마루(또는 골)까지의 거리", "파동의 속도", "진동 횟수"], answer: 1, explanation: "진폭은 평형 위치에서 최대 변위까지의 거리입니다." },
          { q: "'진동수'의 뜻으로 알맞은 것은?", options: ["1초에 진동하는 횟수", "파동의 높이", "파동의 길이", "파동의 방향"], answer: 0, explanation: "진동수는 1초 동안 진동하는 횟수이며 단위는 헤르츠(Hz)입니다." }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "진폭이 커지면 파동의 어떤 성질이 변하나요?", options: ["속도가 빨라짐", "에너지(세기)가 커짐", "파장이 길어짐", "진동수가 늘어남"], answer: 1, explanation: "진폭이 크면 파동이 전달하는 에너지가 커집니다." },
          { q: "물결파가 퍼질 때 물 입자는?", options: ["파동과 함께 멀리 이동", "제자리에서 위아래로 진동", "파동 반대 방향으로 이동", "정지해 있음"], answer: 1, explanation: "물 입자는 제자리에서 진동하고 에너지만 전달됩니다." }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "지진파 중 S파가 액체를 통과하지 못하는 이유는?", options: ["속도가 너무 빨라서", "S파는 횡파인데 액체는 횡파를 전달 못 해서", "액체가 너무 가벼워서", "S파가 약해서"], answer: 1, explanation: "횡파인 S파는 액체에서 전달되지 않습니다." },
          { q: "라디오 주파수에서 주파수가 높으면?", options: ["파장이 길어짐", "파장이 짧아짐", "파장이 그대로", "소리가 작아짐"], answer: 1, explanation: "주파수와 파장은 반비례하여 주파수가 높으면 파장이 짧아집니다." }
        ]
      }
    }
  }
};

// 스크립트 실행: 기존 잘못된 REMEDIAL_BANK 제거 후 올바른 내용 삽입
for (let i = 1; i <= 10; i++) {
  const num = String(i).padStart(2, '0');
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'science', `fit_physics_${num}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const physicsData = PHYSICS_DATA[`fit_physics_${num}`];

  if (!physicsData) {
    console.log(`[SKIP] fit_physics_${num} 데이터 없음`);
    continue;
  }

  // 기존 인라인 REMEDIAL_BANK 블록 제거 (window.REMEDIAL_BANK = { ... }; 패턴)
  const inlinePattern = /\/\/ ===== 보완학습 문제 뱅크 \(객관식 2문제씩\) =====\s*\/\/ window 객체로 덮어써서[^\n]*\n\s*window\.REMEDIAL_BANK = \{[\s\S]*?\n    \};/;

  if (inlinePattern.test(content)) {
    content = content.replace(inlinePattern, `// ===== 보완학습 문제 뱅크 (객관식 2문제씩) =====
    // window 객체로 덮어써서 페이지별 문제 뱅크 사용
    window.REMEDIAL_BANK = ${JSON.stringify(physicsData.problems, null, 6).replace(/\n/g, '\n    ')}`);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[OK] fit_physics_${num} REMEDIAL_BANK 교체 완료 - ${physicsData.title}`);
  } else {
    console.log(`[WARN] fit_physics_${num} 패턴 불일치, 다른 방법 시도`);

    // 대체 패턴: window.REMEDIAL_BANK = { 로 시작하는 블록 찾기
    const altPattern = /window\.REMEDIAL_BANK = \{[\s\S]*?critical:[\s\S]*?\}\s*\};/;
    if (altPattern.test(content)) {
      content = content.replace(altPattern, `window.REMEDIAL_BANK = ${JSON.stringify(physicsData.problems, null, 6).replace(/\n/g, '\n    ')};`);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`[OK] fit_physics_${num} REMEDIAL_BANK 교체 완료 (대체 패턴) - ${physicsData.title}`);
    } else {
      console.log(`[FAIL] fit_physics_${num} 교체 실패`);
    }
  }
}

console.log('\n✅ fit_physics_01~10 REMEDIAL_BANK 교체 완료!');

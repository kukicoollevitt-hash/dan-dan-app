const fs = require('fs');
const path = require('path');

// earth_01~10 각 단원별 보완학습 문제 뱅크
const REMEDIAL_BANKS = {
  earth_01: {
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "지구가 처음 만들어졌을 때 표면은 어떤 상태였나요?", options: ["① 얼음으로 덮여 있었다", "② 마그마로 덮여 있었다", "③ 풀과 나무로 덮여 있었다", "④ 모래로 덮여 있었다"], answer: 1, explanation: "정답은 ②번. 처음 지구는 뜨거운 마그마로 덮인 불덩이였습니다." },
        { q: "지구의 나이는 약 몇 억 년인가요?", options: ["① 약 10억 년", "② 약 46억 년", "③ 약 100억 년", "④ 약 1억 년"], answer: 1, explanation: "정답은 ②번. 지구는 약 46억 년 전에 만들어졌습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "글에서 지구 형성 과정의 순서로 알맞은 것은?", options: ["① 성운→원시 지구→마그마→지각", "② 지각→마그마→성운→원시 지구", "③ 마그마→지각→성운→원시 지구", "④ 원시 지구→성운→지각→마그마"], answer: 0, explanation: "정답은 ①번. 성운에서 원시 지구가 만들어지고, 마그마 상태를 거쳐 지각이 형성되었습니다." },
        { q: "무거운 물질(철, 니켈)은 지구 어디로 이동했나요?", options: ["① 하늘로", "② 바다로", "③ 지구 중심(핵)으로", "④ 지표면으로"], answer: 2, explanation: "정답은 ③번. 무거운 철과 니켈은 지구 중심으로 가라앉아 핵을 이루었습니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'성운'의 뜻으로 알맞은 것은?", options: ["① 별이 모인 무리", "② 가스와 먼지로 이루어진 거대한 구름", "③ 단단한 암석 덩어리", "④ 차가운 얼음 덩어리"], answer: 1, explanation: "정답은 ②번. 성운은 가스와 먼지로 이루어진 거대한 구름입니다." },
        { q: "'지각'이 의미하는 것은?", options: ["① 지구의 중심부", "② 지구의 가장 바깥 껍질", "③ 바다 밑의 모래", "④ 하늘의 구름"], answer: 1, explanation: "정답은 ②번. 지각은 지구의 가장 바깥 부분인 단단한 껍질입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "지구가 식지 않았다면 어떤 일이 일어났을까요?", options: ["① 바다가 더 빨리 생겼다", "② 생명체가 살 수 없었다", "③ 더 많은 식물이 자랐다", "④ 날씨가 더 추워졌다"], answer: 1, explanation: "정답은 ②번. 지구가 식지 않았다면 마그마 상태가 지속되어 생명체가 살 수 없었을 것입니다." },
        { q: "바다가 생긴 후 지구에 어떤 변화가 있었나요?", options: ["① 온도가 더 높아졌다", "② 온도가 더 빨리 낮아졌다", "③ 마그마가 더 많아졌다", "④ 하늘이 더 뜨거워졌다"], answer: 1, explanation: "정답은 ②번. 바다가 생기면서 지구의 온도는 더 빨리 낮아졌습니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "지구의 탄생 과정을 연구하는 이유로 알맞은 것은?", options: ["① 다른 행성도 이해하기 위해", "② 날씨를 예측하기 위해", "③ 교통을 편리하게 하기 위해", "④ 음식을 만들기 위해"], answer: 0, explanation: "정답은 ①번. 지구 탄생 과정 연구는 다른 행성의 형성도 이해하는 데 도움이 됩니다." },
        { q: "지구가 '살아있는 행성'이라 불리는 이유는?", options: ["① 사람이 살기 때문에", "② 내부가 여전히 뜨겁고 변화하기 때문에", "③ 나무가 많기 때문에", "④ 물이 있기 때문에"], answer: 1, explanation: "정답은 ②번. 지구 내부는 여전히 뜨겁고, 화산과 지진 등 변화가 계속되고 있습니다." }
      ]
    }
  },

  earth_02: {
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "마그마가 지표로 나오면 무엇이라 부르나요?", options: ["① 화산재", "② 용암", "③ 지각", "④ 먼지"], answer: 1, explanation: "정답은 ②번. 마그마가 지표로 나오면 용암이라고 부릅니다." },
        { q: "화산 폭발이 일어나는 직접적인 원인은?", options: ["① 바람이 불어서", "② 압력이 높아져서", "③ 비가 많이 와서", "④ 지진이 먼저 일어나서"], answer: 1, explanation: "정답은 ②번. 마그마가 모여 압력이 높아지면 화산이 폭발합니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "글에서 화산 폭발의 순서로 알맞은 것은?", options: ["① 마그마 이동→압력 상승→지각 틈→폭발", "② 폭발→마그마 이동→압력 상승→지각 틈", "③ 지각 틈→폭발→마그마 이동→압력 상승", "④ 압력 상승→지각 틈→폭발→마그마 이동"], answer: 0, explanation: "정답은 ①번. 마그마가 모여 압력이 높아지고 지각 틈을 통해 폭발합니다." },
        { q: "본문에서 화산의 긍정적 영향이 아닌 것은?", options: ["① 지열 발전", "② 온천", "③ 비옥한 토양", "④ 건물 파괴"], answer: 3, explanation: "정답은 ④번. 건물 파괴는 화산의 부정적 영향입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'압력'의 뜻으로 알맞은 것은?", options: ["① 떨어지는 힘", "② 누르는 힘", "③ 당기는 힘", "④ 미는 힘"], answer: 1, explanation: "정답은 ②번. 압력은 누르는 힘을 의미합니다." },
        { q: "'지열 발전소'가 하는 일은?", options: ["① 바람으로 전기를 만든다", "② 물로 전기를 만든다", "③ 땅속 열로 전기를 만든다", "④ 태양으로 전기를 만든다"], answer: 2, explanation: "정답은 ③번. 지열 발전소는 땅속 열을 이용해 전기를 만듭니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "제주도 감귤이 잘 자라는 이유는?", options: ["① 바람이 많이 불어서", "② 화산 토양이 비옥해서", "③ 비가 적게 와서", "④ 겨울이 추워서"], answer: 1, explanation: "정답은 ②번. 화산회토는 미네랄이 풍부해 농작물이 잘 자랍니다." },
        { q: "화산 주변에 지진계를 설치하는 이유는?", options: ["① 관광객 수를 세기 위해", "② 폭발을 미리 예측하기 위해", "③ 날씨를 예보하기 위해", "④ 용암 온도를 재기 위해"], answer: 1, explanation: "정답은 ②번. 지진계로 작은 지진을 감지해 화산 폭발을 예측합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "화산 지역에 사는 사람들이 준비해야 할 것은?", options: ["① 수영복", "② 대피 경로 확인", "③ 등산 장비", "④ 카메라"], answer: 1, explanation: "정답은 ②번. 화산 지역에서는 대피 경로를 미리 확인해야 합니다." },
        { q: "화산을 '두 얼굴의 자연'이라 부를 수 있는 이유는?", options: ["① 낮과 밤이 달라서", "② 파괴와 창조 두 가지 면이 있어서", "③ 크기가 계속 변해서", "④ 색깔이 두 가지여서"], answer: 1, explanation: "정답은 ②번. 화산은 파괴를 일으키지만 새로운 땅과 자원도 만들어 냅니다." }
      ]
    }
  },

  earth_03: {
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "마그마가 식어서 굳은 암석은 무엇인가요?", options: ["① 퇴적암", "② 변성암", "③ 화성암", "④ 석회암"], answer: 2, explanation: "정답은 ③번. 마그마가 식어서 굳은 암석은 화성암입니다." },
        { q: "흙과 모래가 쌓여 굳어진 암석은?", options: ["① 화성암", "② 퇴적암", "③ 변성암", "④ 화강암"], answer: 1, explanation: "정답은 ②번. 흙과 모래가 쌓여 굳어진 암석은 퇴적암입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "심성암과 화산암의 차이점은?", options: ["① 색깔이 다르다", "② 식는 속도와 알갱이 크기가 다르다", "③ 만들어진 시대가 다르다", "④ 무게가 다르다"], answer: 1, explanation: "정답은 ②번. 심성암은 천천히 식어 알갱이가 크고, 화산암은 빨리 식어 알갱이가 작습니다." },
        { q: "퇴적암에서 화석이 발견되는 이유는?", options: ["① 마그마가 생물을 녹였기 때문에", "② 퇴적물이 생물을 덮어 보존했기 때문에", "③ 열과 압력이 생물을 만들었기 때문에", "④ 바람이 생물을 날랐기 때문에"], answer: 1, explanation: "정답은 ②번. 퇴적물이 쌓이면서 생물을 덮어 화석으로 보존했습니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'변성암'의 '변성'이 의미하는 것은?", options: ["① 색깔이 변함", "② 성질이 변함", "③ 크기가 변함", "④ 무게가 변함"], answer: 1, explanation: "정답은 ②번. 변성은 성질이 변한다는 뜻입니다." },
        { q: "'암석의 순환'이 의미하는 것은?", options: ["① 암석이 돌아다니는 것", "② 암석이 서로 다른 종류로 변하는 과정", "③ 암석의 색깔이 바뀌는 것", "④ 암석이 사라지는 것"], answer: 1, explanation: "정답은 ②번. 암석의 순환은 암석이 환경에 따라 다른 종류로 변하는 과정입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "화강암이 건축에 많이 쓰이는 이유는?", options: ["① 가볍기 때문에", "② 단단하고 아름답기 때문에", "③ 구하기 쉽기 때문에", "④ 색깔이 변하기 때문에"], answer: 1, explanation: "정답은 ②번. 화강암은 단단하고 무늬가 아름다워 건축에 많이 사용됩니다." },
        { q: "사암이 열과 압력을 받으면 무엇이 되나요?", options: ["① 화강암", "② 현무암", "③ 규암", "④ 석회암"], answer: 2, explanation: "정답은 ③번. 사암이 열과 압력을 받으면 규암이 됩니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "암석 연구가 중요한 이유는?", options: ["① 예쁜 돌을 찾기 위해", "② 과거 지구의 환경과 역사를 알기 위해", "③ 건축 재료만 찾기 위해", "④ 돌의 무게를 재기 위해"], answer: 1, explanation: "정답은 ②번. 암석 연구를 통해 과거 지구의 환경과 역사를 알 수 있습니다." },
        { q: "제주도 돌담이 검은색인 이유는?", options: ["① 페인트를 칠해서", "② 현무암으로 만들어서", "③ 오래되어서", "④ 흙이 묻어서"], answer: 1, explanation: "정답은 ②번. 제주도 돌담은 화산 폭발로 만들어진 검은색 현무암입니다." }
      ]
    }
  },

  earth_04: {
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "암석이 자연의 힘으로 부서지는 과정은?", options: ["① 침식 작용", "② 퇴적 작용", "③ 풍화 작용", "④ 용융 작용"], answer: 2, explanation: "정답은 ③번. 암석이 자연의 힘으로 부서지는 과정은 풍화 작용입니다." },
        { q: "온도 변화로 암석이 커졌다 작아지는 현상은?", options: ["① 용해", "② 팽창과 수축", "③ 증발", "④ 응결"], answer: 1, explanation: "정답은 ②번. 온도 변화로 물질이 커졌다 작아지는 현상은 팽창과 수축입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "본문에서 설명하는 풍화의 종류가 아닌 것은?", options: ["① 온도 변화", "② 물과 강", "③ 식물 뿌리", "④ 태양빛 색깔"], answer: 3, explanation: "정답은 ④번. 본문에서 태양빛 색깔은 풍화의 원인으로 설명되지 않았습니다." },
        { q: "암석의 순환 과정으로 알맞은 것은?", options: ["① 암석→풍화→흙→퇴적→암석", "② 흙→암석→풍화→퇴적", "③ 퇴적→흙→암석→풍화", "④ 풍화→퇴적→흙→암석"], answer: 0, explanation: "정답은 ①번. 암석이 풍화되어 흙이 되고, 흙이 쌓여 다시 암석이 됩니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'하류'가 의미하는 것은?", options: ["① 강의 시작 부분", "② 강의 아래쪽 방향", "③ 강의 가장 깊은 곳", "④ 강의 가장 넓은 곳"], answer: 1, explanation: "정답은 ②번. 하류는 강물의 흐름에서 아래쪽 방향입니다." },
        { q: "'화학 반응'이 암석에 미치는 영향은?", options: ["① 암석을 더 단단하게 한다", "② 암석을 녹이거나 약하게 만든다", "③ 암석을 더 무겁게 한다", "④ 암석 색깔만 바꾼다"], answer: 1, explanation: "정답은 ②번. 화학 반응은 암석을 녹이거나 약하게 만듭니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "식물 뿌리가 바위를 부수는 원리는?", options: ["① 뿌리가 바위를 녹여서", "② 뿌리가 자라면서 틈을 벌려서", "③ 뿌리가 바위를 밀어서", "④ 뿌리가 바위를 당겨서"], answer: 1, explanation: "정답은 ②번. 뿌리가 틈새로 자라며 굵어지면서 바위를 부숩니다." },
        { q: "강 하류에서 돌이 둥글어지는 이유는?", options: ["① 물이 차가워서", "② 돌끼리 부딪히며 마찰이 일어나서", "③ 햇빛이 강해서", "④ 바람이 세게 불어서"], answer: 1, explanation: "정답은 ②번. 강물에 휩쓸려 돌끼리 부딪히며 모서리가 깎입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "흙이 귀중한 이유로 알맞은 것은?", options: ["① 빨리 만들어지기 때문에", "② 수천 년의 자연 변화로 만들어졌기 때문에", "③ 어디서나 구할 수 있기 때문에", "④ 가격이 비싸기 때문에"], answer: 1, explanation: "정답은 ②번. 흙은 수천 년의 풍화 과정을 거쳐 만들어진 귀중한 결과물입니다." },
        { q: "풍화 작용이 없다면 어떤 일이 일어날까요?", options: ["① 흙이 만들어지지 않는다", "② 바위가 더 빨리 부서진다", "③ 식물이 더 잘 자란다", "④ 강이 더 깊어진다"], answer: 0, explanation: "정답은 ①번. 풍화 작용이 없으면 암석이 부서지지 않아 흙이 만들어지지 않습니다." }
      ]
    }
  },

  earth_05: {
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "물이 흙과 돌을 깎아 내리는 작용은?", options: ["① 퇴적", "② 침식", "③ 풍화", "④ 증발"], answer: 1, explanation: "정답은 ②번. 물이 흙과 돌을 깎아 내리는 것은 침식 작용입니다." },
        { q: "물이 느리게 흐르는 곳에서 일어나는 작용은?", options: ["① 침식", "② 증발", "③ 퇴적", "④ 용해"], answer: 2, explanation: "정답은 ③번. 물이 천천히 흐르면 흙과 자갈이 쌓이는 퇴적 작용이 일어납니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "V자 계곡이 만들어지는 곳은?", options: ["① 바다 근처", "② 경사가 급한 산", "③ 평평한 평야", "④ 호수 주변"], answer: 1, explanation: "정답은 ②번. 경사가 급한 산에서 물이 빠르게 흘러 V자 계곡이 만들어집니다." },
        { q: "삼각주가 형성되는 장소는?", options: ["① 산꼭대기", "② 강이 바다와 만나는 곳", "③ 사막 한가운데", "④ 폭포 아래"], answer: 1, explanation: "정답은 ②번. 삼각주는 강이 바다와 만나는 곳에서 퇴적물이 쌓여 형성됩니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'유속'이 의미하는 것은?", options: ["① 물의 양", "② 물이 흐르는 속도", "③ 물의 온도", "④ 물의 색깔"], answer: 1, explanation: "정답은 ②번. 유속은 물이 흐르는 속도를 의미합니다." },
        { q: "'선상지'의 모양은?", options: ["① 삼각형", "② 원형", "③ 부채꼴", "④ 직사각형"], answer: 2, explanation: "정답은 ③번. 선상지는 산 아래 평지에 부채꼴 모양으로 퇴적된 지형입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "곡류 하천 바깥쪽에서 일어나는 일은?", options: ["① 퇴적", "② 침식", "③ 증발", "④ 풍화"], answer: 1, explanation: "정답은 ②번. 곡류 하천 바깥쪽은 물살이 강해 침식이 일어납니다." },
        { q: "나일강 삼각주에서 농사가 발달한 이유는?", options: ["① 비가 많이 와서", "② 퇴적된 토양이 비옥해서", "③ 기온이 낮아서", "④ 바람이 적어서"], answer: 1, explanation: "정답은 ②번. 삼각주에 쌓인 퇴적토는 비옥해서 농사가 잘 됩니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "강이 만든 지형이 인간 생활에 미친 영향은?", options: ["① 사람들이 피해 다녔다", "② 농사와 정착에 도움이 되었다", "③ 이동을 어렵게 했다", "④ 기후를 추워지게 했다"], answer: 1, explanation: "정답은 ②번. 선상지와 삼각주 같은 평평한 땅은 농사와 정착에 도움이 되었습니다." },
        { q: "우각호가 생기는 과정으로 알맞은 것은?", options: ["① 호수에 물이 차올라서", "② 곡류 하천의 물길이 끊어져서", "③ 비가 많이 와서", "④ 지진이 일어나서"], answer: 1, explanation: "정답은 ②번. 곡류 하천이 흐르다가 물길이 끊어지면 초승달 모양의 우각호가 생깁니다." }
      ]
    }
  },

  earth_06: {
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "지구 표면을 이루는 거대한 암석 조각은?", options: ["① 마그마", "② 판", "③ 맨틀", "④ 핵"], answer: 1, explanation: "정답은 ②번. 지구 표면은 여러 개의 거대한 판으로 이루어져 있습니다." },
        { q: "지진이 발생하는 원인은?", options: ["① 바람이 세게 불어서", "② 판들이 움직이며 에너지가 발생해서", "③ 비가 많이 와서", "④ 태양이 뜨거워서"], answer: 1, explanation: "정답은 ②번. 판들이 부딪치거나 움직일 때 에너지가 발생해 지진이 일어납니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "마그마와 용암의 차이점은?", options: ["① 온도가 다르다", "② 지하와 지표의 위치가 다르다", "③ 색깔이 다르다", "④ 무게가 다르다"], answer: 1, explanation: "정답은 ②번. 마그마는 지하에 있고, 용암은 지표로 나온 마그마입니다." },
        { q: "'환태평양 화산대'의 다른 이름은?", options: ["① 물의 고리", "② 불의 고리", "③ 바람의 고리", "④ 흙의 고리"], answer: 1, explanation: "정답은 ②번. 환태평양 화산대는 '불의 고리'라고도 불립니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'맨틀'이 있는 위치는?", options: ["① 지각 위", "② 지각 아래", "③ 하늘", "④ 바다"], answer: 1, explanation: "정답은 ②번. 맨틀은 지각 아래에 있는 뜨거운 암석층입니다." },
        { q: "'진앙'이 의미하는 것은?", options: ["① 지진이 끝난 지점", "② 지진이 처음 시작된 지표면 지점", "③ 지진의 세기", "④ 지진이 가장 강한 곳"], answer: 1, explanation: "정답은 ②번. 진앙은 지진이 처음 시작된 지표면의 지점입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "일본에 지진이 자주 발생하는 이유는?", options: ["① 섬나라여서", "② 환태평양 화산대에 있어서", "③ 비가 많이 와서", "④ 산이 많아서"], answer: 1, explanation: "정답은 ②번. 일본은 환태평양 화산대에 위치해 지진과 화산 활동이 잦습니다." },
        { q: "지진 발생 전에 나타나는 현상은?", options: ["① 하늘이 맑아진다", "② 작은 지진이 자주 일어난다", "③ 기온이 높아진다", "④ 바람이 세진다"], answer: 1, explanation: "정답은 ②번. 지진 전에는 작은 지진이 자주 일어나는 전조 현상이 나타납니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "지진 발생 시 가장 먼저 해야 할 행동은?", options: ["① 밖으로 뛰어나간다", "② 책상 아래로 들어가 머리를 보호한다", "③ 창문을 연다", "④ 전화를 건다"], answer: 1, explanation: "정답은 ②번. 지진 시에는 책상 아래로 들어가 머리를 보호해야 합니다." },
        { q: "화산과 지진을 연구하는 이유로 알맞은 것은?", options: ["① 관광지를 개발하기 위해", "② 피해를 예방하고 줄이기 위해", "③ 사진을 찍기 위해", "④ 역사를 기록하기 위해"], answer: 1, explanation: "정답은 ②번. 화산과 지진 연구는 피해 예방과 대피에 도움이 됩니다." }
      ]
    }
  },

  earth_07: {
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "땅이 위로 솟아오르는 현상은?", options: ["① 침식", "② 퇴적", "③ 융기", "④ 풍화"], answer: 2, explanation: "정답은 ③번. 땅이 위로 솟아오르는 현상은 융기입니다." },
        { q: "히말라야 산맥이 만들어진 원인은?", options: ["① 화산 폭발", "② 판의 충돌", "③ 강물 침식", "④ 바람 작용"], answer: 1, explanation: "정답은 ②번. 히말라야는 인도 판과 유라시아 판의 충돌로 만들어졌습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "대륙붕, 대륙사면, 해구의 위치 순서로 알맞은 것은?", options: ["① 얕은 곳→깊은 곳→가장 깊은 곳", "② 깊은 곳→얕은 곳→가장 깊은 곳", "③ 가장 깊은 곳→얕은 곳→깊은 곳", "④ 깊은 곳→가장 깊은 곳→얕은 곳"], answer: 0, explanation: "정답은 ①번. 대륙붕(얕음)→대륙사면(급경사)→해구(가장 깊음) 순입니다." },
        { q: "'판게아'가 의미하는 것은?", options: ["① 가장 깊은 바다", "② 모든 대륙이 하나로 붙어 있던 상태", "③ 가장 높은 산", "④ 가장 큰 호수"], answer: 1, explanation: "정답은 ②번. 판게아는 과거에 모든 대륙이 하나로 붙어 있던 상태입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'습곡 산맥'에서 '습곡'이 의미하는 것은?", options: ["① 물에 젖은", "② 땅이 접힌", "③ 바람에 깎인", "④ 열에 녹은"], answer: 1, explanation: "정답은 ②번. 습곡은 땅이 접히듯 휘어진 것을 의미합니다." },
        { q: "'해령'이 있는 곳은?", options: ["① 산꼭대기", "② 바다 밑", "③ 강바닥", "④ 사막"], answer: 1, explanation: "정답은 ②번. 해령은 바다 밑에 있는 해저 산맥입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "대륙붕에 물고기가 많은 이유는?", options: ["① 물이 깊어서", "② 수심이 얕아 햇빛이 잘 들어서", "③ 물이 차가워서", "④ 바람이 세서"], answer: 1, explanation: "정답은 ②번. 대륙붕은 얕아서 햇빛이 잘 들고 영양분이 풍부합니다." },
        { q: "수억 년 후 대륙의 모습은 어떨까요?", options: ["① 지금과 똑같다", "② 계속 움직여 다른 모습이 된다", "③ 모두 사라진다", "④ 더 작아진다"], answer: 1, explanation: "정답은 ②번. 대륙은 계속 움직여서 미래에는 지금과 다른 모습이 됩니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "히말라야가 지금도 높아지고 있다는 것이 의미하는 바는?", options: ["① 지구가 죽어가고 있다", "② 판의 움직임이 계속되고 있다", "③ 지진이 줄어들고 있다", "④ 바다가 넓어지고 있다"], answer: 1, explanation: "정답은 ②번. 히말라야가 높아지는 것은 판이 계속 충돌하고 있기 때문입니다." },
        { q: "풍화와 침식을 연구하면 알 수 있는 것은?", options: ["① 미래 날씨", "② 지형이 어떻게 변해왔는지", "③ 동물의 종류", "④ 식물의 색깔"], answer: 1, explanation: "정답은 ②번. 풍화와 침식 연구로 지형 변화의 역사를 알 수 있습니다." }
      ]
    }
  },

  earth_08: {
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "마그마가 천천히 식어서 만들어진 암석은?", options: ["① 현무암", "② 화강암", "③ 사암", "④ 대리암"], answer: 1, explanation: "정답은 ②번. 마그마가 땅속에서 천천히 식으면 화강암이 됩니다." },
        { q: "생물 잔해가 쌓여 만들어진 퇴적암은?", options: ["① 사암", "② 셰일", "③ 석회암", "④ 규암"], answer: 2, explanation: "정답은 ③번. 조개껍데기나 산호 같은 생물 잔해가 쌓여 석회암이 됩니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "화강암과 현무암의 공통점은?", options: ["① 둘 다 퇴적암이다", "② 둘 다 화성암이다", "③ 둘 다 변성암이다", "④ 둘 다 같은 색이다"], answer: 1, explanation: "정답은 ②번. 화강암과 현무암은 모두 마그마/용암이 식어서 만들어진 화성암입니다." },
        { q: "암석의 순환 순서로 알맞은 것은?", options: ["① 화성암→풍화→퇴적암→변성암→마그마→화성암", "② 퇴적암→화성암→변성암→마그마", "③ 변성암→퇴적암→화성암→마그마", "④ 마그마→변성암→퇴적암→화성암"], answer: 0, explanation: "정답은 ①번. 암석은 화성암→풍화→퇴적암→변성암→마그마→화성암 순으로 순환합니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'대리암'이 만들어지려면 무엇이 필요한가요?", options: ["① 물과 바람", "② 열과 압력", "③ 생물의 잔해", "④ 마그마"], answer: 1, explanation: "정답은 ②번. 대리암은 석회암이 열과 압력을 받아 변성되어 만들어집니다." },
        { q: "'화석'이 주로 발견되는 암석은?", options: ["① 화성암", "② 변성암", "③ 퇴적암", "④ 화강암"], answer: 2, explanation: "정답은 ③번. 화석은 주로 퇴적암에서 발견됩니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "어떤 지역에 석회암이 많다면 과거에 그곳은?", options: ["① 사막이었다", "② 바다였다", "③ 화산이었다", "④ 빙하였다"], answer: 1, explanation: "정답은 ②번. 석회암은 바다 생물 잔해로 만들어지므로 과거에 바다였음을 알 수 있습니다." },
        { q: "대리암으로 조각품을 많이 만드는 이유는?", options: ["① 가벼워서", "② 아름다운 광택이 있어서", "③ 투명해서", "④ 부드러워서"], answer: 1, explanation: "정답은 ②번. 대리암은 아름다운 광택이 있어 조각품에 많이 사용됩니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "암석을 '지구의 역사책'이라 부를 수 있는 이유는?", options: ["① 글자가 써 있어서", "② 과거 환경과 생물 정보가 담겨 있어서", "③ 오래되어서", "④ 단단해서"], answer: 1, explanation: "정답은 ②번. 암석에는 과거 지구의 환경과 생물 정보가 기록되어 있습니다." },
        { q: "제주도 돌담(현무암)이 구멍이 많은 이유는?", options: ["① 벌레가 파먹어서", "② 용암이 식을 때 가스가 빠져나가서", "③ 비에 녹아서", "④ 사람이 뚫어서"], answer: 1, explanation: "정답은 ②번. 용암이 빠르게 식을 때 가스가 빠져나가면서 구멍이 생겼습니다." }
      ]
    }
  },

  earth_09: {
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "화석이 주로 발견되는 암석은?", options: ["① 화성암", "② 변성암", "③ 퇴적암", "④ 화강암"], answer: 2, explanation: "정답은 ③번. 화석은 퇴적물이 생물을 덮어 보존하므로 주로 퇴적암에서 발견됩니다." },
        { q: "공룡이 지배한 시대는?", options: ["① 선캄브리아대", "② 고생대", "③ 중생대", "④ 신생대"], answer: 2, explanation: "정답은 ③번. 중생대는 공룡이 지배한 시대입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "지질 시대의 순서로 알맞은 것은?", options: ["① 고생대→중생대→신생대", "② 중생대→고생대→신생대", "③ 신생대→중생대→고생대", "④ 고생대→신생대→중생대"], answer: 0, explanation: "정답은 ①번. 지질 시대는 고생대→중생대→신생대 순입니다." },
        { q: "표준 화석과 시상 화석의 차이점은?", options: ["① 크기가 다르다", "② 알려주는 정보가 다르다(시대 vs 환경)", "③ 색깔이 다르다", "④ 발견 장소가 다르다"], answer: 1, explanation: "정답은 ②번. 표준 화석은 시대를, 시상 화석은 환경을 알려줍니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'삼엽충'이 살던 시대는?", options: ["① 선캄브리아대", "② 고생대", "③ 중생대", "④ 신생대"], answer: 1, explanation: "정답은 ②번. 삼엽충은 고생대를 대표하는 화석입니다." },
        { q: "'진화'가 의미하는 것은?", options: ["① 생물이 사라지는 것", "② 생물이 변해 발전하는 것", "③ 생물이 태어나는 것", "④ 생물이 이동하는 것"], answer: 1, explanation: "정답은 ②번. 진화는 생물이 시간에 따라 변해 발전하는 과정입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "산에서 조개 화석이 발견되었다면?", options: ["① 그곳은 항상 산이었다", "② 과거에 바다였다가 융기했다", "③ 조개가 산에 살았다", "④ 누군가 옮겨 놓았다"], answer: 1, explanation: "정답은 ②번. 산에서 조개 화석이 나오면 과거에 바다였다가 융기한 것입니다." },
        { q: "공룡이 멸종한 원인으로 알려진 것은?", options: ["① 추위", "② 소행성 충돌", "③ 홍수", "④ 질병"], answer: 1, explanation: "정답은 ②번. 약 6600만 년 전 소행성 충돌로 공룡이 멸종했습니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "화석 연구가 중요한 이유는?", options: ["① 보석을 찾기 위해", "② 과거 생물과 환경을 알기 위해", "③ 돌 수집을 위해", "④ 그림을 그리기 위해"], answer: 1, explanation: "정답은 ②번. 화석 연구로 과거 생물의 모습과 지구 환경 변화를 알 수 있습니다." },
        { q: "우리나라에서 공룡 화석이 발견된 곳은?", options: ["① 서울", "② 경남 고성, 전남 해남", "③ 부산", "④ 제주도"], answer: 1, explanation: "정답은 ②번. 경남 고성, 전남 해남 등에서 공룡 발자국과 뼈 화석이 발견되었습니다." }
      ]
    }
  },

  earth_10: {
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "지구 자기장이 만들어지는 곳은?", options: ["① 지각", "② 맨틀", "③ 외핵", "④ 대기"], answer: 2, explanation: "정답은 ③번. 지구 자기장은 외핵의 액체 금속이 움직이면서 만들어집니다." },
        { q: "오로라가 주로 나타나는 곳은?", options: ["① 적도", "② 사막", "③ 극지방", "④ 열대 우림"], answer: 2, explanation: "정답은 ③번. 오로라는 태양풍 입자가 극지방 대기와 부딪혀 나타납니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "지구 자기장의 역할로 알맞은 것은?", options: ["① 날씨를 만든다", "② 태양풍과 우주 방사선을 막는다", "③ 물을 끌어당긴다", "④ 산을 만든다"], answer: 1, explanation: "정답은 ②번. 지구 자기장은 태양풍과 우주 방사선으로부터 지구를 보호합니다." },
        { q: "'지자기 역전'이 의미하는 것은?", options: ["① 자석이 사라지는 것", "② 자기장 방향이 바뀌는 것", "③ 지구가 멈추는 것", "④ 자기장이 강해지는 것"], answer: 1, explanation: "정답은 ②번. 지자기 역전은 자북과 자남이 뒤바뀌는 현상입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘 맥락력",
      problems: [
        { q: "'태양풍'이 의미하는 것은?", options: ["① 태양에서 부는 바람", "② 태양에서 방출되는 고에너지 입자", "③ 태양 주변의 구름", "④ 태양의 빛"], answer: 1, explanation: "정답은 ②번. 태양풍은 태양에서 방출되는 고에너지 입자입니다." },
        { q: "'외핵'이 액체인 이유와 관련된 것은?", options: ["① 물이 많아서", "② 온도가 높아 녹아 있어서", "③ 가스로 되어 있어서", "④ 바람이 불어서"], answer: 1, explanation: "정답은 ②번. 외핵은 온도가 높아 철과 니켈이 녹아 액체 상태입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론·통합력",
      problems: [
        { q: "철새가 먼 거리를 이동할 때 길을 찾는 방법은?", options: ["① 냄새로", "② 지구 자기장 감지", "③ 소리로", "④ 색깔로"], answer: 1, explanation: "정답은 ②번. 철새나 바다거북은 지구 자기장을 감지해 방향을 찾습니다." },
        { q: "해저 암석에서 줄무늬 자기장 기록이 발견되는 이유는?", options: ["① 페인트를 칠해서", "② 지자기 역전이 반복되어서", "③ 물에 씻겨서", "④ 생물이 살아서"], answer: 1, explanation: "정답은 ②번. 해저가 확장될 때 지자기 역전이 줄무늬처럼 기록되었습니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판·적용력",
      problems: [
        { q: "지구 자기장이 사라지면 나타날 수 있는 현상은?", options: ["① 날씨가 좋아진다", "② 생물에게 해로운 방사선이 들어온다", "③ 물이 더 맑아진다", "④ 산이 더 높아진다"], answer: 1, explanation: "정답은 ②번. 자기장이 없으면 태양풍과 방사선이 직접 지표에 도달해 해롭습니다." },
        { q: "휴대폰 나침반이 작동하는 원리는?", options: ["① GPS 신호", "② 지구 자기장 감지", "③ 중력", "④ 기압"], answer: 1, explanation: "정답은 ②번. 휴대폰 나침반은 지구 자기장을 이용해 방향을 알려줍니다." }
      ]
    }
  }
};

// 각 파일의 REMEDIAL_BANK 교체
for (let i = 1; i <= 10; i++) {
  const num = String(i).padStart(2, '0');
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'science', `earth_${num}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  const bankKey = `earth_${num}`;
  const newBank = REMEDIAL_BANKS[bankKey];

  if (!newBank) {
    console.log(`[SKIP] ${bankKey} 데이터 없음`);
    continue;
  }

  // REMEDIAL_BANK 문자열 생성
  const bankStr = `const REMEDIAL_BANK = {
      literal: {
        title: "${newBank.literal.title}",
        problems: [
          { q: "${newBank.literal.problems[0].q}", options: ${JSON.stringify(newBank.literal.problems[0].options)}, answer: ${newBank.literal.problems[0].answer}, explanation: "${newBank.literal.problems[0].explanation}" },
          { q: "${newBank.literal.problems[1].q}", options: ${JSON.stringify(newBank.literal.problems[1].options)}, answer: ${newBank.literal.problems[1].answer}, explanation: "${newBank.literal.problems[1].explanation}" }
        ]
      },
      structural: {
        title: "${newBank.structural.title}",
        problems: [
          { q: "${newBank.structural.problems[0].q}", options: ${JSON.stringify(newBank.structural.problems[0].options)}, answer: ${newBank.structural.problems[0].answer}, explanation: "${newBank.structural.problems[0].explanation}" },
          { q: "${newBank.structural.problems[1].q}", options: ${JSON.stringify(newBank.structural.problems[1].options)}, answer: ${newBank.structural.problems[1].answer}, explanation: "${newBank.structural.problems[1].explanation}" }
        ]
      },
      lexical: {
        title: "${newBank.lexical.title}",
        problems: [
          { q: "${newBank.lexical.problems[0].q}", options: ${JSON.stringify(newBank.lexical.problems[0].options)}, answer: ${newBank.lexical.problems[0].answer}, explanation: "${newBank.lexical.problems[0].explanation}" },
          { q: "${newBank.lexical.problems[1].q}", options: ${JSON.stringify(newBank.lexical.problems[1].options)}, answer: ${newBank.lexical.problems[1].answer}, explanation: "${newBank.lexical.problems[1].explanation}" }
        ]
      },
      inferential: {
        title: "${newBank.inferential.title}",
        problems: [
          { q: "${newBank.inferential.problems[0].q}", options: ${JSON.stringify(newBank.inferential.problems[0].options)}, answer: ${newBank.inferential.problems[0].answer}, explanation: "${newBank.inferential.problems[0].explanation}" },
          { q: "${newBank.inferential.problems[1].q}", options: ${JSON.stringify(newBank.inferential.problems[1].options)}, answer: ${newBank.inferential.problems[1].answer}, explanation: "${newBank.inferential.problems[1].explanation}" }
        ]
      },
      critical: {
        title: "${newBank.critical.title}",
        problems: [
          { q: "${newBank.critical.problems[0].q}", options: ${JSON.stringify(newBank.critical.problems[0].options)}, answer: ${newBank.critical.problems[0].answer}, explanation: "${newBank.critical.problems[0].explanation}" },
          { q: "${newBank.critical.problems[1].q}", options: ${JSON.stringify(newBank.critical.problems[1].options)}, answer: ${newBank.critical.problems[1].answer}, explanation: "${newBank.critical.problems[1].explanation}" }
        ]
      }
    };`;

  // 기존 REMEDIAL_BANK 패턴 찾기
  const bankPattern = /const REMEDIAL_BANK = \{[\s\S]*?\n    \};/;

  if (bankPattern.test(content)) {
    content = content.replace(bankPattern, bankStr);
    console.log(`[OK] ${bankKey} REMEDIAL_BANK 교체 완료`);
  } else {
    console.log(`[WARN] ${bankKey} REMEDIAL_BANK 패턴 못 찾음`);
  }

  // gradeRemedial 함수가 explanation을 표시하도록 업데이트
  // bio_01처럼 explanation 표시하는 코드가 있는지 확인
  if (!content.includes('p.explanation')) {
    // gradeRemedial 함수 업데이트
    const oldGradePattern = /if \(selected === p\.answer\) \{\s*li\.insertAdjacentHTML\('beforeend', '<div class="remed-result" style="margin-top:3px; color:#157347; font-size:12px;">정답입니다 ✅<\/div>'\);/;
    const newGradeCorrect = `const explanation = p.explanation ? \`<div style="margin-top:4px; color:#555; font-size:11px; background:#f9f6f0; padding:6px 8px; border-radius:4px;">📝 \${p.explanation}</div>\` : '';
          if (selected === p.answer) {
            li.insertAdjacentHTML('beforeend', \`<div class="remed-result" style="margin-top:3px; color:#157347; font-size:12px;">정답입니다 ✅\${explanation}</div>\`);`;

    if (oldGradePattern.test(content)) {
      content = content.replace(oldGradePattern, newGradeCorrect);
    }

    // 오답 부분도 업데이트
    const oldWrongPattern = /li\.insertAdjacentHTML\('beforeend', `<div class="remed-result" style="margin-top:3px; color:#b3261e; font-size:12px;">틀렸어요 ❌ 정답: \$\{correctText\}<\/div>`\);/;
    const newGradeWrong = `li.insertAdjacentHTML('beforeend', \`<div class="remed-result" style="margin-top:3px; color:#b3261e; font-size:12px;">오답입니다 ❌\${explanation}</div>\`);`;

    if (oldWrongPattern.test(content)) {
      content = content.replace(oldWrongPattern, newGradeWrong);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

console.log('\n✅ earth_01~10 보완학습 구현 완료!');

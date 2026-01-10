const fs = require('fs');
const path = require('path');

// geo_01~10 REMEDIAL_BANK 데이터
const REMEDIAL_DATA = {
  // geo_01: 지도를 통해 세상을 이해하다
  geo_01: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "지도란?", options: ["그림만 있는 것", "지표면의 모습을 일정한 약속에 따라 줄여서 나타낸 것", "사진", "글만 있는 것"], answer: 1, explanation: "지도는 지표면의 모습을 일정한 약속에 따라 줄여서 평면에 나타낸 것입니다." },
        { q: "지도에서 방위를 나타내는 기호가 없을 때 위쪽은 어느 방향인가요?", options: ["남쪽", "동쪽", "북쪽", "서쪽"], answer: 2, explanation: "지도에서 방위 기호가 없으면 위쪽이 북쪽입니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "지도의 기본 요소가 아닌 것은?", options: ["축척", "방위", "범례", "날씨"], answer: 3, explanation: "지도의 기본 요소는 축척, 방위, 범례(기호) 등입니다." },
        { q: "지도가 실생활에서 사용되는 예로 알맞지 않은 것은?", options: ["길 찾기", "여행 계획", "날씨 예보", "요리 레시피"], answer: 3, explanation: "지도는 길 찾기, 여행 계획, 위치 파악 등에 사용됩니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'축척'이란?", options: ["방향을 나타내는 것", "실제 거리를 지도에서 줄인 비율", "기호 설명", "색깔 표시"], answer: 1, explanation: "축척은 실제 거리를 지도에서 얼마나 줄였는지 나타내는 비율입니다." },
        { q: "'범례'란?", options: ["지도의 제목", "지도에 사용된 기호의 뜻을 설명한 것", "지도의 크기", "지도의 색깔"], answer: 1, explanation: "범례는 지도에 사용된 기호의 뜻을 설명한 것입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "축척이 큰 지도와 작은 지도의 차이점은?", options: ["같음", "축척이 크면 좁은 지역을 자세히, 작으면 넓은 지역을 간략히 표현", "색깔 차이만", "방위 차이만"], answer: 1, explanation: "축척이 크면 좁은 지역을 자세히, 축척이 작으면 넓은 지역을 간략히 표현합니다." },
        { q: "지도를 볼 때 방위를 먼저 확인해야 하는 이유는?", options: ["예쁘게 보려고", "방향을 정확히 파악하기 위해", "색깔을 보려고", "글씨를 읽으려고"], answer: 1, explanation: "방위를 확인해야 지도에서 방향을 정확히 파악할 수 있습니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "지도를 볼 때 주의할 점으로 알맞은 것은?", options: ["무조건 믿기", "제작 시기와 목적에 따라 정보가 다를 수 있음을 인식", "색깔만 보기", "글씨만 읽기"], answer: 1, explanation: "지도는 제작 시기와 목적에 따라 정보가 다를 수 있습니다." },
        { q: "디지털 지도(네비게이션 등)의 장점은?", options: ["변하지 않음", "실시간 정보 업데이트와 편리한 검색", "종이보다 무거움", "정보가 적음"], answer: 1, explanation: "디지털 지도는 실시간 정보 업데이트와 편리한 검색이 장점입니다." }
      ]
    }
  },

  // geo_02: 지도에 담긴 약속과 표현
  geo_02: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "지도에서 기호를 사용하는 이유는?", options: ["예쁘게 하려고", "복잡한 정보를 간단하게 나타내기 위해", "색을 넣으려고", "그림을 그리려고"], answer: 1, explanation: "지도 기호는 복잡한 정보를 간단하고 보기 쉽게 나타내기 위해 사용합니다." },
        { q: "등고선이란?", options: ["강을 나타내는 선", "높이가 같은 지점을 연결한 선", "도로를 나타내는 선", "국경을 나타내는 선"], answer: 1, explanation: "등고선은 높이가 같은 지점을 연결한 선으로, 지형의 높낮이를 나타냅니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "등고선 간격이 좁으면 지형이 어떤가요?", options: ["평평함", "경사가 급함", "물이 많음", "나무가 많음"], answer: 1, explanation: "등고선 간격이 좁으면 경사가 급하고, 넓으면 경사가 완만합니다." },
        { q: "지도 기호의 종류로 알맞지 않은 것은?", options: ["점 기호", "선 기호", "면 기호", "소리 기호"], answer: 3, explanation: "지도 기호는 점, 선, 면 기호로 구분됩니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'등고선 간격'이란?", options: ["등고선의 색깔", "등고선 사이의 높이 차이", "등고선의 길이", "등고선의 두께"], answer: 1, explanation: "등고선 간격은 등고선 사이의 높이 차이를 말합니다." },
        { q: "'경사'란?", options: ["평평한 정도", "땅이 기울어진 정도", "물의 깊이", "나무의 높이"], answer: 1, explanation: "경사는 땅이 기울어진 정도를 말합니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "산 정상 부근의 등고선 모양은 어떤가요?", options: ["직선", "동심원(원 모양)으로 닫힌 형태", "물결 모양", "사각형"], answer: 1, explanation: "산 정상 부근은 등고선이 동심원 형태로 닫혀 있습니다." },
        { q: "지도 기호가 통일되어 있으면 좋은 점은?", options: ["예쁨", "누구나 같은 의미로 이해할 수 있음", "색이 많음", "글씨가 많음"], answer: 1, explanation: "통일된 기호는 누구나 같은 의미로 이해할 수 있게 합니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "지도를 만들 때 약속된 기호를 사용하는 까닭은?", options: ["보기 좋으려고", "정보 전달을 명확하고 일관되게 하기 위해", "값싸게 하려고", "사진처럼 하려고"], answer: 1, explanation: "약속된 기호는 정보 전달을 명확하고 일관되게 합니다." },
        { q: "등고선 지도를 읽을 때 주의할 점은?", options: ["색깔만 보기", "등고선 간격과 모양을 함께 분석해야 함", "글씨만 읽기", "방위만 확인"], answer: 1, explanation: "등고선의 간격과 모양을 함께 분석해야 지형을 정확히 파악할 수 있습니다." }
      ]
    }
  },

  // geo_03: 우리 고장의 상징과 유래
  geo_03: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "고장의 상징물에 해당하는 것은?", options: ["아파트", "시·군의 마크, 깃발, 상징 동식물", "자동차", "가방"], answer: 1, explanation: "고장의 상징물에는 시·군의 마크, 깃발, 상징 동식물 등이 있습니다." },
        { q: "지명의 유래란?", options: ["지명의 색깔", "지명이 생겨난 이유와 역사", "지명의 크기", "지명의 모양"], answer: 1, explanation: "지명의 유래는 지명이 어떻게 생겨났는지에 대한 이유와 역사입니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "지명이 생기는 요인으로 알맞지 않은 것은?", options: ["지형", "역사적 사건", "인물", "날씨 변화"], answer: 3, explanation: "지명은 지형, 역사적 사건, 인물, 전설 등에서 유래합니다." },
        { q: "고장의 상징물이 중요한 이유는?", options: ["예쁘기 때문", "고장의 정체성과 특색을 나타내기 때문", "비싸기 때문", "크기가 크기 때문"], answer: 1, explanation: "상징물은 고장의 정체성과 특색을 나타내어 소속감을 줍니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'유래'란?", options: ["미래의 계획", "사물이나 이름이 생겨난 내력", "현재 상태", "외국어 번역"], answer: 1, explanation: "유래는 사물이나 이름이 생겨난 내력을 말합니다." },
        { q: "'정체성'이란?", options: ["숨기는 것", "고유한 특성이나 성질", "복사하는 것", "변하는 것"], answer: 1, explanation: "정체성은 다른 것과 구별되는 고유한 특성이나 성질입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "지명을 통해 알 수 있는 것은?", options: ["날씨", "그 지역의 역사, 자연환경, 문화", "인구 수", "경제 규모"], answer: 1, explanation: "지명을 통해 그 지역의 역사, 자연환경, 문화를 알 수 있습니다." },
        { q: "고장의 상징물을 알면 좋은 점은?", options: ["시험 점수 향상", "고장에 대한 이해와 애향심 증가", "돈을 벌 수 있음", "친구가 많아짐"], answer: 1, explanation: "상징물을 알면 고장에 대한 이해와 애향심이 증가합니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "지명이 바뀌는 경우 고려해야 할 점은?", options: ["무조건 바꾸기", "역사적 의미와 주민 의견을 고려해야 함", "예쁜 이름으로만", "외국어로만"], answer: 1, explanation: "지명 변경 시 역사적 의미와 주민 의견을 고려해야 합니다." },
        { q: "고장의 상징물 선정 시 중요한 점은?", options: ["비싼 것", "고장의 특색과 주민 공감을 반영", "유행하는 것", "다른 지역과 같은 것"], answer: 1, explanation: "상징물은 고장의 특색을 반영하고 주민의 공감을 얻어야 합니다." }
      ]
    }
  },

  // geo_04: 우리 동네는 왜 불편할까? 지역 문제 살펴보기
  geo_04: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "지역 문제의 예로 알맞은 것은?", options: ["우주 탐사", "교통 불편, 환경 오염, 안전 문제", "외국 여행", "온라인 게임"], answer: 1, explanation: "지역 문제에는 교통 불편, 환경 오염, 안전 문제 등이 있습니다." },
        { q: "지역 문제를 해결하는 주체로 알맞은 것은?", options: ["외국인", "지방자치단체, 주민, 시민단체", "다른 나라 정부", "우주인"], answer: 1, explanation: "지역 문제는 지방자치단체, 주민, 시민단체 등이 함께 해결합니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "지역 문제 해결 과정으로 알맞은 순서는?", options: ["해결→발견→분석", "발견→분석→해결 방안 마련→실행", "실행→발견→분석", "분석→실행→발견"], answer: 1, explanation: "지역 문제 해결은 발견→분석→해결 방안 마련→실행의 순서로 진행됩니다." },
        { q: "지역 문제 해결에 주민 참여가 중요한 이유는?", options: ["형식적 절차", "문제를 가장 잘 알고 해결에 당사자이기 때문", "시간 낭비", "책임 회피"], answer: 1, explanation: "주민은 문제를 가장 잘 알고 해결의 당사자이므로 참여가 중요합니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'지방자치단체'란?", options: ["중앙정부", "일정 지역을 다스리는 지방 정부 조직", "외국 정부", "기업"], answer: 1, explanation: "지방자치단체는 일정 지역의 행정을 담당하는 지방 정부 조직입니다." },
        { q: "'주민 참여'란?", options: ["관람만 하는 것", "주민이 직접 의견을 내고 활동에 참여하는 것", "방관하는 것", "불평만 하는 것"], answer: 1, explanation: "주민 참여는 주민이 직접 의견을 내고 활동에 참여하는 것입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "지역 문제가 해결되지 않으면 어떤 일이 생길까요?", options: ["좋아짐", "주민 생활의 질 저하와 갈등 증가", "변화 없음", "자동 해결"], answer: 1, explanation: "문제가 해결되지 않으면 주민 생활의 질이 떨어지고 갈등이 커집니다." },
        { q: "청소년이 지역 문제 해결에 참여할 수 있는 방법은?", options: ["참여 불가", "의견 제시, 캠페인 참여, 봉사활동 등", "어른만 참여", "무관심"], answer: 1, explanation: "청소년도 의견 제시, 캠페인 참여, 봉사활동 등으로 참여할 수 있습니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "지역 문제 해결 시 갈등이 생기는 이유는?", options: ["갈등 없음", "이해관계와 의견이 다를 수 있어서", "모두 동의해서", "무관심해서"], answer: 1, explanation: "이해관계와 의견이 다르면 갈등이 생길 수 있습니다." },
        { q: "지역 문제 해결에서 소통이 중요한 이유는?", options: ["시간 낭비", "다양한 의견을 조율하고 합의를 이끌기 위해", "형식적 절차", "불필요함"], answer: 1, explanation: "소통은 다양한 의견을 조율하고 합의를 이끌기 위해 중요합니다." }
      ]
    }
  },

  // geo_05: 시대와 함께 발전하는 시골 마을
  geo_05: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "촌락의 특징으로 알맞은 것은?", options: ["인구가 많고 밀집", "농업, 어업 등 1차 산업 중심, 자연환경 의존", "공장이 많음", "고층 건물이 많음"], answer: 1, explanation: "촌락은 농업, 어업 등 1차 산업 중심이고 자연환경에 의존합니다." },
        { q: "촌락이 변화하는 이유로 알맞은 것은?", options: ["변화 없음", "도시화, 고령화, 기술 발전 등", "인구 증가만", "자연재해만"], answer: 1, explanation: "촌락은 도시화, 고령화, 기술 발전 등으로 변화하고 있습니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "촌락 문제로 언급된 것이 아닌 것은?", options: ["인구 감소", "고령화", "교통 혼잡", "의료·교육 시설 부족"], answer: 2, explanation: "촌락 문제에는 인구 감소, 고령화, 의료·교육 시설 부족 등이 있습니다." },
        { q: "촌락 활성화 방안으로 알맞은 것은?", options: ["방치", "귀농·귀촌 지원, 관광 개발, 스마트팜 등", "인구 이동 금지", "도시로 이주 권장"], answer: 1, explanation: "귀농·귀촌 지원, 관광 개발, 스마트팜 등이 촌락 활성화 방안입니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'귀농'이란?", options: ["도시로 이사", "도시에서 농촌으로 돌아가 농사를 짓는 것", "외국 이민", "여행"], answer: 1, explanation: "귀농은 도시에서 농촌으로 돌아가 농사를 짓는 것입니다." },
        { q: "'스마트팜'이란?", options: ["전통 농업", "ICT 기술을 활용한 첨단 농업", "수작업 농업", "유기농만"], answer: 1, explanation: "스마트팜은 ICT 기술을 활용한 첨단 농업 시스템입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "촌락의 고령화가 심해지면 생기는 문제는?", options: ["문제없음", "노동력 부족, 지역 활력 저하", "인구 증가", "경제 성장"], answer: 1, explanation: "고령화가 심해지면 노동력이 부족해지고 지역 활력이 저하됩니다." },
        { q: "촌락과 도시의 교류가 활발해지면 좋은 점은?", options: ["좋은 점 없음", "촌락 경제 활성화와 도시민 휴식 공간 제공", "갈등만 증가", "환경 파괴"], answer: 1, explanation: "교류가 활발해지면 촌락 경제가 활성화되고 도시민에게 휴식 공간을 제공합니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "촌락 개발 시 주의해야 할 점은?", options: ["무분별한 개발", "자연환경 보전과 주민 의견 반영", "외부 자본만 유치", "전통 무시"], answer: 1, explanation: "촌락 개발 시 자연환경 보전과 주민 의견 반영이 중요합니다." },
        { q: "촌락 문제 해결에서 정부와 주민의 역할은?", options: ["정부만 책임", "정부 지원과 주민의 자발적 노력이 함께 필요", "주민만 책임", "방치"], answer: 1, explanation: "정부 지원과 주민의 자발적 노력이 함께 필요합니다." }
      ]
    }
  },

  // geo_06: 지구에 주소가 있다고? 위도와 경도의 비밀
  geo_06: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "위도란?", options: ["동서 방향 위치", "적도를 기준으로 남북 방향 위치를 나타내는 것", "높이", "깊이"], answer: 1, explanation: "위도는 적도를 기준으로 남북 방향의 위치를 나타냅니다." },
        { q: "경도란?", options: ["남북 방향 위치", "본초자오선을 기준으로 동서 방향 위치를 나타내는 것", "높이", "깊이"], answer: 1, explanation: "경도는 본초자오선을 기준으로 동서 방향의 위치를 나타냅니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "적도의 위도는?", options: ["90도", "0도", "180도", "45도"], answer: 1, explanation: "적도는 위도 0도입니다." },
        { q: "경도에 따라 달라지는 것은?", options: ["계절", "시간(시차)", "기온", "강수량"], answer: 1, explanation: "경도가 다르면 시간(시차)이 달라집니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'본초자오선'이란?", options: ["적도", "경도 0도를 지나는 선(영국 그리니치 천문대 기준)", "날짜변경선", "북극선"], answer: 1, explanation: "본초자오선은 경도 0도를 지나는 선으로 영국 그리니치 천문대를 기준으로 합니다." },
        { q: "'시차'란?", options: ["나이 차이", "지역 간 시간의 차이", "키 차이", "온도 차이"], answer: 1, explanation: "시차는 경도 차이로 인한 지역 간 시간의 차이입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "우리나라가 영국보다 시간이 빠른 이유는?", options: ["위도가 높아서", "우리나라가 영국보다 동쪽에 있어서", "우리나라가 영국보다 북쪽에 있어서", "기후가 달라서"], answer: 1, explanation: "우리나라가 영국보다 동쪽(경도가 큼)에 있어 시간이 빠릅니다." },
        { q: "위도가 높아지면 일반적으로 기온이 어떻게 될까요?", options: ["높아짐", "낮아짐", "변화 없음", "예측 불가"], answer: 1, explanation: "일반적으로 위도가 높아지면 기온이 낮아집니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "위도와 경도를 아는 것이 중요한 이유는?", options: ["중요하지 않음", "정확한 위치 파악과 내비게이션, 국제 교류에 필수", "단순 암기 지식", "시험용 지식"], answer: 1, explanation: "위도와 경도는 정확한 위치 파악과 내비게이션, 국제 교류에 필수입니다." },
        { q: "GPS가 위도·경도를 활용하는 방식에서 중요한 점은?", options: ["중요하지 않음", "위성을 통해 실시간으로 정확한 위치를 제공", "과거 정보만 제공", "대략적 위치만"], answer: 1, explanation: "GPS는 위성을 통해 위도·경도 기반으로 실시간 정확한 위치를 제공합니다." }
      ]
    }
  },

  // geo_07: 지구의 얼굴, 대륙과 바다 이야기
  geo_07: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "지구의 대륙은 몇 개인가요?", options: ["5개", "6개", "7개", "8개"], answer: 1, explanation: "지구의 대륙은 6개(아시아, 유럽, 아프리카, 북아메리카, 남아메리카, 오세아니아)입니다. (남극 포함 시 7개)" },
        { q: "지구에서 가장 큰 대륙은?", options: ["아프리카", "아시아", "유럽", "북아메리카"], answer: 1, explanation: "아시아가 지구에서 가장 큰 대륙입니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "5대양에 해당하지 않는 것은?", options: ["태평양", "대서양", "지중해", "인도양"], answer: 2, explanation: "5대양은 태평양, 대서양, 인도양, 북극해, 남극해입니다." },
        { q: "대륙과 바다의 분포에서 특징적인 점은?", options: ["균등하게 분포", "북반구에 대륙이 더 많이 분포", "남반구에 대륙이 더 많이 분포", "대륙과 바다가 같은 면적"], answer: 1, explanation: "북반구에 대륙이 더 많이 분포해 있습니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'대륙'이란?", options: ["작은 섬", "바다로 둘러싸인 넓은 땅덩어리", "강", "호수"], answer: 1, explanation: "대륙은 바다로 둘러싸인 넓은 땅덩어리입니다." },
        { q: "'해류'란?", options: ["바다의 색깔", "바닷물이 일정한 방향으로 흐르는 것", "파도", "조수"], answer: 1, explanation: "해류는 바닷물이 일정한 방향으로 흐르는 것입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "바다가 기후에 미치는 영향은?", options: ["영향 없음", "기온 조절, 강수량 영향 등", "기온만 높임", "강수량만 줄임"], answer: 1, explanation: "바다는 기온을 조절하고 강수량에 영향을 미칩니다." },
        { q: "대륙의 위치가 문화에 미치는 영향은?", options: ["영향 없음", "교류와 문화 전파에 영향", "언어만 영향", "음식만 영향"], answer: 1, explanation: "대륙의 위치는 교류와 문화 전파에 영향을 미칩니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "바다 보전이 중요한 이유는?", options: ["중요하지 않음", "해양 생태계와 기후, 인간 생활에 필수적이므로", "육지만 중요", "경제적 가치만"], answer: 1, explanation: "바다는 해양 생태계와 기후, 인간 생활에 필수적입니다." },
        { q: "대륙 이동설이 우리에게 알려주는 것은?", options: ["대륙은 고정됨", "지구의 지형은 오랜 시간에 걸쳐 변화해왔음", "변화 없음", "최근에만 변화"], answer: 1, explanation: "대륙 이동설은 지구의 지형이 오랜 시간에 걸쳐 변화해왔음을 알려줍니다." }
      ]
    }
  },

  // geo_08: 우리나라는 어디에 있을까? 한반도의 위치
  geo_08: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "우리나라의 위치적 특징으로 알맞은 것은?", options: ["섬나라", "유라시아 대륙 동쪽, 삼면이 바다인 반도", "내륙국", "적도에 위치"], answer: 1, explanation: "우리나라는 유라시아 대륙 동쪽에 위치한 삼면이 바다인 반도입니다." },
        { q: "우리나라와 접하는 바다가 아닌 것은?", options: ["동해", "서해(황해)", "남해", "북극해"], answer: 3, explanation: "우리나라는 동해, 서해(황해), 남해와 접해 있습니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "반도 국가의 장점으로 알맞은 것은?", options: ["고립됨", "대륙과 해양으로 진출이 모두 가능", "무역 불가", "교류 어려움"], answer: 1, explanation: "반도 국가는 대륙과 해양으로 모두 진출이 가능합니다." },
        { q: "우리나라의 이웃 나라로 알맞은 것은?", options: ["미국, 영국", "중국, 일본, 러시아", "브라질, 아르헨티나", "호주, 뉴질랜드"], answer: 1, explanation: "우리나라의 이웃 나라는 중국, 일본, 러시아 등입니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'반도'란?", options: ["완전히 바다로 둘러싸인 땅", "삼면이 바다로 둘러싸이고 한 면이 대륙과 연결된 땅", "내륙 지역", "섬"], answer: 1, explanation: "반도는 삼면이 바다로 둘러싸이고 한 면이 대륙과 연결된 땅입니다." },
        { q: "'지정학적'이란?", options: ["지질을 연구하는", "지리적 위치가 정치·경제에 미치는 영향을 다루는", "지도 제작", "지명 연구"], answer: 1, explanation: "지정학은 지리적 위치가 정치·경제에 미치는 영향을 다룹니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "우리나라의 위치가 역사에 미친 영향은?", options: ["영향 없음", "대륙과 해양 세력의 교차점으로 다양한 문화 교류와 갈등 경험", "고립됨", "영향 적음"], answer: 1, explanation: "우리나라는 대륙과 해양 세력의 교차점으로 다양한 문화 교류와 갈등을 경험했습니다." },
        { q: "남북 분단이 우리나라의 지정학적 위치에 미치는 영향은?", options: ["영향 없음", "대륙으로의 육로 연결이 막혀 반도의 장점 활용이 제한됨", "해양 진출 불가", "완전 고립"], answer: 1, explanation: "남북 분단으로 대륙으로의 육로 연결이 막혀 반도의 장점 활용이 제한됩니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "우리나라의 위치적 장점을 살리기 위해 필요한 것은?", options: ["고립 정책", "이웃 나라와의 평화적 협력과 교류", "무역 중단", "국경 폐쇄"], answer: 1, explanation: "위치적 장점을 살리려면 이웃 나라와의 평화적 협력과 교류가 필요합니다." },
        { q: "동북아시아 허브로서 우리나라의 가능성은?", options: ["가능성 없음", "지리적 이점을 활용한 물류·금융·문화 허브 가능성", "이미 완성됨", "다른 나라만 가능"], answer: 1, explanation: "우리나라는 지리적 이점을 활용해 물류·금융·문화 허브가 될 가능성이 있습니다." }
      ]
    }
  },

  // geo_09: 백두산에서 한라산까지, 국토 여행
  geo_09: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "우리나라 국토의 지형적 특징으로 알맞은 것은?", options: ["평야만 있음", "동쪽이 높고 서쪽이 낮은 동고서저 지형", "서쪽이 높고 동쪽이 낮음", "모두 평탄함"], answer: 1, explanation: "우리나라는 동쪽이 높고 서쪽이 낮은 동고서저 지형입니다." },
        { q: "우리나라에서 가장 높은 산은?", options: ["한라산", "지리산", "백두산", "설악산"], answer: 2, explanation: "백두산(2,744m)이 우리나라에서 가장 높은 산입니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "우리나라의 주요 하천이 서해로 흐르는 이유는?", options: ["우연", "동고서저 지형 때문", "인공적으로 만들어서", "바람 때문"], answer: 1, explanation: "동고서저 지형 때문에 주요 하천이 서해로 흐릅니다." },
        { q: "우리나라의 해안선 특징으로 알맞은 것은?", options: ["단조로움", "동해안은 단조롭고, 서·남해안은 복잡함", "모두 복잡함", "모두 직선"], answer: 1, explanation: "동해안은 단조롭고, 서·남해안은 리아스식 해안으로 복잡합니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'동고서저'란?", options: ["동쪽이 낮고 서쪽이 높음", "동쪽이 높고 서쪽이 낮음", "남북 방향 경사", "평탄한 지형"], answer: 1, explanation: "동고서저는 동쪽이 높고 서쪽이 낮은 지형을 말합니다." },
        { q: "'리아스식 해안'이란?", options: ["직선 해안", "산지가 침강하여 생긴 복잡한 해안", "사막 해안", "빙하 해안"], answer: 1, explanation: "리아스식 해안은 산지가 침강하여 형성된 복잡한 해안입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "서·남해안에 갯벌이 발달한 이유는?", options: ["우연", "조수 간만의 차가 크고 해안이 완만해서", "파도가 강해서", "수심이 깊어서"], answer: 1, explanation: "조수 간만의 차가 크고 해안이 완만해 갯벌이 발달했습니다." },
        { q: "국토의 지형이 산업에 미치는 영향은?", options: ["영향 없음", "평야는 농업, 해안은 어업·항만, 산지는 관광 등에 활용", "모든 곳이 동일", "지형은 산업과 무관"], answer: 1, explanation: "지형에 따라 농업, 어업, 관광 등 다양한 산업이 발달합니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "국토 개발 시 고려해야 할 점은?", options: ["개발만 중시", "자연환경 보전과 지속가능한 개발의 균형", "보전만 중시", "무계획 개발"], answer: 1, explanation: "국토 개발 시 자연환경 보전과 지속가능한 개발의 균형이 필요합니다." },
        { q: "우리 국토를 소중히 여겨야 하는 이유는?", options: ["영토 확장을 위해", "우리 삶의 터전이자 후손에게 물려줄 유산이므로", "다른 나라에 자랑하려고", "경제적 가치만"], answer: 1, explanation: "국토는 우리 삶의 터전이자 후손에게 물려줄 소중한 유산입니다." }
      ]
    }
  },

  // geo_10: 왜 제주도는 서울보다 따뜻할까?
  geo_10: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "우리나라의 기후 특징으로 알맞은 것은?", options: ["열대 기후", "사계절이 뚜렷한 온대 계절풍 기후", "한대 기후", "건조 기후"], answer: 1, explanation: "우리나라는 사계절이 뚜렷한 온대 계절풍 기후입니다." },
        { q: "제주도가 서울보다 따뜻한 주된 이유는?", options: ["바람 때문", "위도가 낮아 태양 고도가 높기 때문", "산이 많아서", "비가 많이 와서"], answer: 1, explanation: "제주도는 서울보다 위도가 낮아 태양 고도가 높아서 따뜻합니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "기온에 영향을 미치는 요인으로 알맞지 않은 것은?", options: ["위도", "해발 고도", "언어", "해류"], answer: 2, explanation: "기온에 영향을 미치는 요인은 위도, 해발 고도, 해류, 수륙 분포 등입니다." },
        { q: "우리나라의 강수량 특징으로 알맞은 것은?", options: ["연중 균등", "여름에 집중(계절풍과 장마 영향)", "겨울에 집중", "봄에 집중"], answer: 1, explanation: "우리나라는 여름에 계절풍과 장마로 강수량이 집중됩니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'계절풍'이란?", options: ["일정한 바람", "계절에 따라 방향이 바뀌는 바람", "강한 바람만", "약한 바람만"], answer: 1, explanation: "계절풍은 계절에 따라 방향이 바뀌는 바람입니다." },
        { q: "'해발 고도'란?", options: ["바다의 깊이", "평균 해수면을 기준으로 잰 높이", "산의 넓이", "강의 길이"], answer: 1, explanation: "해발 고도는 평균 해수면을 기준으로 잰 높이입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "산간 지역이 평지보다 기온이 낮은 이유는?", options: ["바람 때문", "해발 고도가 높아 기온이 낮아지므로", "비가 많아서", "사람이 적어서"], answer: 1, explanation: "해발 고도가 높아지면 기온이 낮아집니다(100m당 약 0.6도)." },
        { q: "동해안이 서해안보다 겨울에 따뜻한 이유는?", options: ["위도가 낮아서", "난류의 영향을 받기 때문", "산이 없어서", "비가 많아서"], answer: 1, explanation: "동해안은 난류(따뜻한 해류)의 영향으로 겨울에 더 따뜻합니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "기후 변화가 우리나라에 미치는 영향은?", options: ["영향 없음", "폭염, 집중호우, 아열대화 등 이상 기후 증가", "기후가 더 안정됨", "사계절이 더 뚜렷해짐"], answer: 1, explanation: "기후 변화로 폭염, 집중호우, 아열대화 등 이상 기후가 증가하고 있습니다." },
        { q: "기후에 적응한 생활 모습의 예로 알맞은 것은?", options: ["기후와 무관한 생활", "온돌 난방, 처마의 발달, 계절 음식 등", "모든 지역 동일 생활", "기후 무시"], answer: 1, explanation: "온돌 난방, 처마, 계절 음식 등은 기후에 적응한 생활 모습입니다." }
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
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'social', `geo_${num}.html`);
  const unitKey = `geo_${num}`;

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

console.log('\n✅ geo_01~10 보완학습 기능 추가 완료!');

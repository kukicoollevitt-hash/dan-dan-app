const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'public', 'BRAINUP', 'person');

// 21~40 단원별 보완학습 데이터
const REMEDIAL_DATA = {
  "21": {
    // 안중근
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "안중근이 이토 히로부미를 처단한 장소는?", options: ["서울","도쿄","하얼빈","블라디보스토크"], answer: 2, explanation: "안중근은 중국 하얼빈 역에서 이토 히로부미를 처단했습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "안중근의 활동이 소개된 순서로 알맞은 것은?", options: ["의병활동-하얼빈 의거-재판-순국","재판-의병활동-순국-하얼빈 의거","순국-재판-하얼빈 의거-의병활동","하얼빈 의거-순국-의병활동-재판"], answer: 0, explanation: "의병 활동 후 하얼빈 의거를 일으키고 재판을 받은 뒤 순국했습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'순국'의 뜻으로 알맞은 것은?", options: ["나라를 떠나다","나라를 위해 목숨을 바치다","나라를 세우다","나라를 팔다"], answer: 1, explanation: "순국은 나라를 위해 목숨을 바치는 것입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "안중근이 '동양평화론'을 쓴 이유는?", options: ["돈을 벌기 위해","진정한 동양 평화를 주장하기 위해","탈출하기 위해","유명해지기 위해"], answer: 1, explanation: "침략이 아닌 진정한 동양 평화를 주장했습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "안중근에게서 배울 수 있는 점은?", options: ["폭력이 해결책이다","나라를 위한 희생정신","개인의 이익이 중요하다","외국에서 살아야 한다"], answer: 1, explanation: "나라의 독립을 위해 목숨을 바쳤습니다." }] }
  },
  "22": {
    // 유관순
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "유관순이 만세 운동을 이끈 장소는?", options: ["서울 광화문","천안 아우내 장터","평양","부산"], answer: 1, explanation: "유관순은 고향 천안 아우내 장터에서 만세운동을 이끌었습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "유관순의 활동이 소개된 순서는?", options: ["서울 만세시위 참여-고향에서 만세운동-체포-순국","체포-서울 만세시위-순국-고향 만세운동","순국-체포-고향 만세운동-서울 만세시위","고향 만세운동-서울 만세시위-순국-체포"], answer: 0, explanation: "서울에서 만세시위에 참여한 후 고향에서 만세운동을 이끌다 체포되었습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'휴교'의 뜻으로 알맞은 것은?", options: ["학교를 새로 짓다","학교 수업을 쉬다","학교를 졸업하다","학교에 입학하다"], answer: 1, explanation: "휴교는 학교 수업을 일시적으로 쉬는 것입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "유관순이 고향에서 만세운동을 한 이유는?", options: ["서울이 위험해서","더 많은 사람들과 함께하기 위해","숨기 위해","부모님을 만나기 위해"], answer: 1, explanation: "고향 장터에서 많은 사람들과 함께 만세를 외치기 위해서입니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "유관순에게서 배울 수 있는 점은?", options: ["어린 나이에는 아무것도 못한다","용기와 나라 사랑","위험한 일은 피해야 한다","혼자서는 아무것도 못한다"], answer: 1, explanation: "어린 나이에도 나라를 위해 용기 있게 행동했습니다." }] }
  },
  "23": {
    // 윤봉길
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "윤봉길이 폭탄을 던진 장소는?", options: ["서울","상하이 훙커우 공원","도쿄","하얼빈"], answer: 1, explanation: "윤봉길은 상하이 훙커우 공원에서 의거를 일으켰습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "윤봉길의 생애가 소개된 순서는?", options: ["농촌계몽-중국 망명-훙커우 의거-순국","중국 망명-농촌계몽-순국-훙커우 의거","훙커우 의거-농촌계몽-중국 망명-순국","순국-훙커우 의거-농촌계몽-중국 망명"], answer: 0, explanation: "농촌계몽 활동 후 중국으로 망명하여 의거를 일으켰습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'의거'의 뜻으로 알맞은 것은?", options: ["정의로운 일어남","의자에 앉음","거짓말하기","거리에서 시위하기"], answer: 0, explanation: "의거는 정의를 위해 일어나는 행동입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "윤봉길 의거가 독립운동에 미친 영향은?", options: ["독립운동 포기","한국 독립 의지를 세계에 알림","일본과 화해","아무 영향 없음"], answer: 1, explanation: "중국과 세계에 한국의 독립 의지를 알렸습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "윤봉길에게서 배울 수 있는 점은?", options: ["폭력이 정답이다","나라를 위한 희생정신","개인의 안전이 최우선","외국에서 편히 살기"], answer: 1, explanation: "젊은 나이에 나라를 위해 목숨을 바쳤습니다." }] }
  },
  "24": {
    // 김구
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "김구가 이끈 단체의 이름은?", options: ["의열단","대한민국 임시정부","동학당","독립협회"], answer: 1, explanation: "김구는 대한민국 임시정부의 주석이었습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "김구의 활동이 소개된 순서는?", options: ["동학농민운동-임시정부-한인애국단-광복","임시정부-동학농민운동-광복-한인애국단","광복-임시정부-한인애국단-동학농민운동","한인애국단-동학농민운동-광복-임시정부"], answer: 0, explanation: "동학농민운동 참여부터 임시정부 활동까지 시간 순서로 소개됩니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'백범'의 의미로 알맞은 것은?", options: ["백 번 범죄자","평범한 백성","하얀 호랑이","백 가지 법"], answer: 1, explanation: "백범은 '가장 평범한 백성'이라는 뜻입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "김구가 '나의 소원'에서 바란 것은?", options: ["부강한 나라","문화 강국","군사 강국","큰 영토"], answer: 1, explanation: "높은 문화의 힘으로 세계에 기여하길 바랐습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "김구에게서 배울 수 있는 점은?", options: ["무력만이 답이다","문화와 평화의 중요성","개인의 영달 추구","외국에 의존하기"], answer: 1, explanation: "문화의 힘과 평화를 중시했습니다." }] }
  },
  "25": {
    // 한석봉
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "한석봉이 뛰어났던 분야는?", options: ["그림","글씨(서예)","음악","무술"], answer: 1, explanation: "한석봉은 조선 시대 최고의 명필로 글씨에 뛰어났습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "한석봉 일화의 순서로 알맞은 것은?", options: ["절에서 공부-집에 돌아옴-어머니와 시합-다시 공부","어머니와 시합-절에서 공부-다시 공부-집에 돌아옴","다시 공부-집에 돌아옴-어머니와 시합-절에서 공부","집에 돌아옴-다시 공부-절에서 공부-어머니와 시합"], answer: 0, explanation: "절에서 공부하다 집에 돌아와 어머니와 시합 후 다시 공부했습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'명필'의 뜻으로 알맞은 것은?", options: ["유명한 붓","글씨를 아주 잘 쓰는 사람","비싼 종이","좋은 먹"], answer: 1, explanation: "명필은 글씨를 아주 잘 쓰는 사람입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "어머니가 한석봉을 다시 절로 보낸 이유는?", options: ["미워해서","아직 노력이 부족하다고 생각해서","돈이 없어서","절이 좋아서"], answer: 1, explanation: "어머니의 떡보다 한석봉의 글씨가 못해서 더 노력하라는 의미였습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "한석봉의 이야기에서 배울 수 있는 점은?", options: ["재능만 있으면 된다","꾸준한 노력의 중요성","어머니 말은 무시해도 된다","빨리 포기하는 것이 좋다"], answer: 1, explanation: "꾸준한 노력으로 최고의 명필이 되었습니다." }] }
  },
  "26": {
    // 김홍도
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "김홍도가 주로 그린 그림의 종류는?", options: ["산수화","초상화","풍속화","정물화"], answer: 2, explanation: "김홍도는 서민들의 일상을 담은 풍속화를 주로 그렸습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "김홍도의 대표작으로 언급된 것은?", options: ["미인도, 월하정인","씨름, 서당, 무동","금강전도, 인왕제색도","몽유도원도"], answer: 1, explanation: "씨름, 서당, 무동 등이 김홍도의 대표적인 풍속화입니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'풍속화'의 뜻으로 알맞은 것은?", options: ["바람을 그린 그림","사람들의 생활 모습을 그린 그림","풍경을 그린 그림","동물을 그린 그림"], answer: 1, explanation: "풍속화는 당시 사람들의 생활 모습을 그린 그림입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "김홍도가 서민들의 모습을 그린 이유는?", options: ["돈을 많이 받아서","서민들의 삶에 관심이 있어서","왕이 시켜서","다른 그림을 못 그려서"], answer: 1, explanation: "김홍도는 평범한 사람들의 삶에 깊은 관심을 가졌습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "김홍도의 그림이 오늘날 중요한 이유는?", options: ["비싸기 때문에","조선 시대 사람들의 생활을 알 수 있어서","외국에서 유명해서","색깔이 예뻐서"], answer: 1, explanation: "김홍도의 그림으로 조선 시대 사람들의 생활을 알 수 있습니다." }] }
  },
  "27": {
    // 신윤복
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "신윤복이 주로 그린 대상은?", options: ["농부와 어부","양반과 기녀","왕과 신하","동물과 식물"], answer: 1, explanation: "신윤복은 양반과 기녀들의 모습, 남녀 간의 사랑을 주로 그렸습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "신윤복의 대표작으로 언급된 것은?", options: ["씨름, 서당","미인도, 월하정인, 단오풍정","금강전도","몽유도원도"], answer: 1, explanation: "미인도, 월하정인, 단오풍정이 신윤복의 대표작입니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'섬세하다'의 뜻으로 알맞은 것은?", options: ["크고 대담하다","작고 정교하다","빠르다","느리다"], answer: 1, explanation: "섬세하다는 작은 부분까지 정교하고 세밀하다는 뜻입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "신윤복이 당시로서는 파격적이었던 이유는?", options: ["그림을 못 그려서","다루기 어려운 주제를 그렸기 때문에","외국 그림을 따라해서","그림을 팔지 않아서"], answer: 1, explanation: "당시에는 다루기 어려웠던 남녀 간의 사랑 등을 그렸습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "신윤복과 김홍도의 공통점은?", options: ["같은 대상을 그림","조선의 풍속화를 완성함","같은 스타일로 그림","같은 시대에 살지 않음"], answer: 1, explanation: "서로 다른 스타일로 조선의 풍속화를 완성한 두 거장입니다." }] }
  },
  "28": {
    // 박지원
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "박지원이 쓴 기행문의 이름은?", options: ["동의보감","열하일기","목민심서","백범일지"], answer: 1, explanation: "박지원은 청나라 여행을 기록한 열하일기를 썼습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "박지원의 소설이 아닌 것은?", options: ["허생전","양반전","호질","홍길동전"], answer: 3, explanation: "홍길동전은 허균의 작품입니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'풍자'의 뜻으로 알맞은 것은?", options: ["칭찬하기","비웃으며 비판하기","설명하기","묘사하기"], answer: 1, explanation: "풍자는 사회의 문제를 빗대어 비판하는 것입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "박지원이 열하일기를 쓴 목적은?", options: ["여행 자랑","청나라의 발전된 문물을 소개하고 개혁 촉구","돈을 벌기 위해","외국에서 살기 위해"], answer: 1, explanation: "청나라의 발전된 모습을 보고 조선의 개혁을 촉구했습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "박지원에게서 배울 수 있는 점은?", options: ["외국 것은 무조건 좋다","비판 정신으로 사회 문제 지적하기","글쓰기는 쓸모없다","여행은 시간 낭비다"], answer: 1, explanation: "비판 정신으로 조선 사회의 문제점을 지적하고 개혁을 요구했습니다." }] }
  },
  "29": {
    // 김대건
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "김대건은 어떤 종교의 첫 한국인 사제인가요?", options: ["불교","개신교","가톨릭(천주교)","유교"], answer: 2, explanation: "김대건은 한국인 최초의 가톨릭 사제(신부)입니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "김대건의 생애 순서로 알맞은 것은?", options: ["유학-사제 서품-선교 활동-순교","선교 활동-유학-순교-사제 서품","순교-사제 서품-유학-선교 활동","사제 서품-순교-선교 활동-유학"], answer: 0, explanation: "중국 유학 후 사제가 되어 선교 활동을 하다 순교했습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'박해'의 뜻으로 알맞은 것은?", options: ["보호하다","괴롭히고 핍박하다","칭찬하다","도와주다"], answer: 1, explanation: "박해는 괴롭히고 핍박하는 것입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "김대건이 신앙을 포기하지 않은 이유는?", options: ["무서워서","천주를 위해 죽으면 영원한 생명을 얻는다고 믿어서","도망칠 수 없어서","가족 때문에"], answer: 1, explanation: "영원한 생명에 대한 믿음으로 신앙을 지켰습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "김대건 신부에게서 배울 수 있는 점은?", options: ["위험하면 포기하기","신념을 위한 헌신","편안한 삶 추구","남의 말 듣지 않기"], answer: 1, explanation: "신앙의 자유를 위해 목숨을 바쳤습니다." }] }
  },
  "30": {
    // 주시경
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "주시경이 연구하고 체계화한 것은?", options: ["수학","한글","영어","한문"], answer: 1, explanation: "주시경은 한글을 연구하고 체계화했습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "주시경의 활동 순서로 알맞은 것은?", options: ["한글 연구-문법 정리-제자 양성","제자 양성-문법 정리-한글 연구","문법 정리-한글 연구-제자 양성","제자 양성-한글 연구-문법 정리"], answer: 0, explanation: "한글 연구부터 제자 양성까지 체계적으로 활동했습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'정립'의 뜻으로 알맞은 것은?", options: ["허물다","바르게 세우다","숨기다","잊어버리다"], answer: 1, explanation: "정립은 바르게 세워 확립하는 것입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "주시경이 한글 연구에 힘쓴 이유는?", options: ["돈을 벌기 위해","우리말과 글을 지키기 위해","외국에 알리기 위해","취미로"], answer: 1, explanation: "일제강점기에 우리말을 지키려 했습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "주시경에게서 배울 수 있는 점은?", options: ["외국어가 더 중요하다","우리말을 사랑하고 지키기","한글은 불편하다","언어는 중요하지 않다"], answer: 1, explanation: "우리말을 사랑하고 연구하여 지켰습니다." }] }
  },
  "31": {
    // 방정환
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "방정환이 만든 어린이 잡지의 이름은?", options: ["소년","어린이","아이들","동심"], answer: 1, explanation: "방정환은 '어린이' 잡지를 창간했습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "방정환의 활동이 소개된 순서는?", options: ["어린이 운동-잡지 창간-어린이날 제정-동화 구연","잡지 창간-어린이날 제정-동화 구연-어린이 운동","동화 구연-어린이 운동-잡지 창간-어린이날 제정","어린이날 제정-잡지 창간-어린이 운동-동화 구연"], answer: 0, explanation: "어린이 운동을 시작으로 여러 활동을 펼쳤습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'동화 구연'의 뜻으로 알맞은 것은?", options: ["동화책 쓰기","동화를 말로 들려주기","동화책 읽기","동화 그림 그리기"], answer: 1, explanation: "구연은 이야기를 말로 들려주는 것입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "방정환이 '어린이'라는 말을 만든 이유는?", options: ["재미있어서","아이들을 존중하기 위해","외국어를 따라서","어른들이 시켜서"], answer: 1, explanation: "아이들도 인격체로 존중받아야 한다고 생각했습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "방정환에게서 배울 수 있는 점은?", options: ["아이들은 어른 말만 들어야 한다","어린이 존중과 사랑","어린이에게 관심 갖지 않기","공부만 시키기"], answer: 1, explanation: "어린이의 인격과 권리를 존중했습니다." }] }
  },
  "32": {
    // 장보고
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "장보고가 설치한 군사 기지의 이름은?", options: ["한양","청해진","평양성","안시성"], answer: 1, explanation: "장보고는 청해진(지금의 완도)에 군사 기지를 설치했습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "장보고의 활동 순서로 알맞은 것은?", options: ["당나라 군대 활동-귀국-청해진 설치-해적 소탕","청해진 설치-당나라 군대 활동-귀국-해적 소탕","해적 소탕-귀국-당나라 군대 활동-청해진 설치","귀국-해적 소탕-청해진 설치-당나라 군대 활동"], answer: 0, explanation: "당나라에서 활동 후 귀국하여 청해진을 설치하고 해적을 소탕했습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'소탕'의 뜻으로 알맞은 것은?", options: ["청소하다","적을 완전히 없애다","탕을 끓이다","도망치다"], answer: 1, explanation: "소탕은 적이나 나쁜 무리를 완전히 없애는 것입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "장보고가 청해진을 설치한 이유는?", options: ["휴식을 위해","신라인이 노예로 팔려가는 것을 막기 위해","외국에 가기 위해","돈을 벌기 위해"], answer: 1, explanation: "해적에 의해 신라인들이 노예로 팔려가는 것을 막으려 했습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "장보고에게서 배울 수 있는 점은?", options: ["권력만 추구하기","백성을 보호하려는 리더십","바다는 위험하다","외국에서만 살기"], answer: 1, explanation: "백성들을 보호하고 동아시아 무역을 발전시켰습니다." }] }
  },
  "33": {
    // 선덕여왕
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "선덕여왕이 세운 탑의 이름은?", options: ["다보탑","석가탑","첨성대","황룡사 9층 목탑"], answer: 3, explanation: "선덕여왕은 황룡사 9층 목탑을 세웠습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "선덕여왕의 업적이 소개된 순서는?", options: ["즉위-첨성대 건립-인재 등용-사찰 건립","사찰 건립-즉위-인재 등용-첨성대 건립","인재 등용-사찰 건립-첨성대 건립-즉위","즉위-인재 등용-사찰 건립-첨성대 건립"], answer: 0, explanation: "즉위 후 첨성대, 사찰 건립과 인재 등용을 했습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'첨성대'의 역할로 알맞은 것은?", options: ["적을 감시하기","별을 관측하기","불을 지피기","곡식을 저장하기"], answer: 1, explanation: "첨성대는 별을 관측하는 천문대입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "선덕여왕이 김춘추, 김유신을 등용한 결과는?", options: ["신라가 약해짐","삼국 통일의 기반이 됨","전쟁에서 패함","아무 일도 없음"], answer: 1, explanation: "이들은 후에 삼국 통일의 주역이 되었습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "선덕여왕에게서 배울 수 있는 점은?", options: ["여성은 리더가 될 수 없다","시대의 편견을 극복하고 나라를 이끈 지도력","과학은 필요 없다","인재는 중요하지 않다"], answer: 1, explanation: "여성으로서 편견을 극복하고 나라를 이끌었습니다." }] }
  },
  "34": {
    // 연개소문
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "연개소문이 막아낸 나라는?", options: ["신라","백제","당나라","일본"], answer: 2, explanation: "연개소문은 당나라의 침략을 막아냈습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "연개소문 관련 사건의 순서는?", options: ["정변-대막리지 등극-당 침략-안시성 전투","안시성 전투-정변-대막리지 등극-당 침략","대막리지 등극-안시성 전투-정변-당 침략","당 침략-안시성 전투-정변-대막리지 등극"], answer: 0, explanation: "정변으로 권력을 잡은 후 당나라 침략을 막았습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'격퇴'의 뜻으로 알맞은 것은?", options: ["환영하다","쳐서 물리치다","도망치다","항복하다"], answer: 1, explanation: "격퇴는 적을 쳐서 물리치는 것입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "연개소문 사후 고구려가 멸망한 이유는?", options: ["연개소문이 약해서","아들들이 권력 다툼을 해서","당나라가 강해져서","신라가 배신해서"], answer: 1, explanation: "연개소문 사후 아들들의 권력 다툼으로 고구려가 약해졌습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "연개소문에 대한 평가로 적절한 것은?", options: ["완벽한 영웅","독재자로 비판받기도 하지만 고구려를 지킨 장군","실패한 지도자","평범한 인물"], answer: 1, explanation: "독재자로 비판받기도 하지만 고구려의 마지막 영광을 지켰습니다." }] }
  },
  "35": {
    // 계백
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "계백이 이끈 결사대의 수는?", options: ["1,000명","5,000명","10,000명","50,000명"], answer: 1, explanation: "계백은 5,000명의 결사대를 이끌었습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "황산벌 전투의 과정으로 알맞은 것은?", options: ["결사대 출정-네 번 승리-관창 전사-총공격으로 패배","총공격-결사대 출정-네 번 승리-관창 전사","관창 전사-결사대 출정-총공격-네 번 승리","네 번 승리-관창 전사-결사대 출정-총공격"], answer: 0, explanation: "계백의 결사대가 네 번 승리했으나 결국 패배했습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'결사대'의 뜻으로 알맞은 것은?", options: ["평화를 지키는 부대","죽음을 각오하고 싸우는 부대","항복하는 부대","도망치는 부대"], answer: 1, explanation: "결사대는 죽음을 각오하고 싸우는 부대입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "계백이 가족을 죽인 이유는?", options: ["미워해서","전쟁에서 지면 적에게 치욕당할까 봐","도망치려고","명령을 받아서"], answer: 1, explanation: "패배 시 가족이 적에게 치욕당하는 것을 두려워했습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "계백에게서 배울 수 있는 점은?", options: ["포기해도 된다","끝까지 나라를 위해 싸우는 충절","전쟁은 피해야 한다","혼자서는 안 된다"], answer: 1, explanation: "나라를 위해 끝까지 싸운 충절의 상징입니다." }] }
  },
  "36": {
    // 최영
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "최영의 아버지가 남긴 유언은?", options: ["돈을 많이 벌어라","황금 보기를 돌같이 하라","권력을 잡아라","외국으로 가라"], answer: 1, explanation: "최영의 아버지는 '황금 보기를 돌같이 하라'는 유언을 남겼습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "최영 관련 사건의 순서는?", options: ["왜구 토벌-요동 정벌 주장-위화도 회군-처형","위화도 회군-왜구 토벌-처형-요동 정벌 주장","처형-요동 정벌 주장-왜구 토벌-위화도 회군","요동 정벌 주장-처형-위화도 회군-왜구 토벌"], answer: 0, explanation: "왜구 토벌 후 요동 정벌을 주장했으나 위화도 회군으로 패배했습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'청렴'의 뜻으로 알맞은 것은?", options: ["재물을 탐하다","마음이 맑고 욕심이 없다","게으르다","거짓말하다"], answer: 1, explanation: "청렴은 마음이 맑고 재물에 욕심이 없는 것입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "최영이 이성계에게 패한 이유는?", options: ["싸움을 못해서","위화도 회군으로 기습당해서","도망쳤기 때문에","항복해서"], answer: 1, explanation: "이성계가 위화도에서 군대를 돌려 개경을 공격했습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "최영에게서 배울 수 있는 점은?", options: ["권력이 최고다","청렴함과 나라에 대한 충성","돈을 많이 벌어야 한다","상황에 맞게 변해야 한다"], answer: 1, explanation: "청렴함과 고려에 대한 충성을 끝까지 지켰습니다." }] }
  },
  "37": {
    // 권율
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "권율이 대승을 거둔 전투의 이름은?", options: ["한산도 대첩","행주대첩","노량 해전","진주성 전투"], answer: 1, explanation: "권율은 행주산성에서 행주대첩의 승리를 거두었습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "행주대첩의 과정으로 알맞은 것은?", options: ["일본군 포위-아홉 번 공격-격퇴-승리","승리-일본군 포위-격퇴-아홉 번 공격","격퇴-승리-아홉 번 공격-일본군 포위","아홉 번 공격-일본군 포위-승리-격퇴"], answer: 0, explanation: "일본군 3만이 포위하고 아홉 번 공격했으나 모두 격퇴했습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'대첩'의 뜻으로 알맞은 것은?", options: ["작은 승리","크게 이긴 싸움","비긴 싸움","진 싸움"], answer: 1, explanation: "대첩은 크게 이긴 싸움입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "권율이 적은 병력으로 승리한 이유는?", options: ["운이 좋아서","뛰어난 전략과 병사들의 단결","적이 약해서","도망쳤기 때문에"], answer: 1, explanation: "뛰어난 전략과 병사들의 단결로 대승을 거두었습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "행주대첩이 중요한 이유는?", options: ["전쟁이 끝나서","조선의 사기를 크게 올렸기 때문에","일본과 화해해서","별로 중요하지 않다"], answer: 1, explanation: "임진왜란 3대 대첩 중 하나로 조선의 사기를 올렸습니다." }] }
  },
  "38": {
    // 곽재우
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "곽재우의 별명은?", options: ["백의장군","홍의장군","청의장군","흑의장군"], answer: 1, explanation: "곽재우는 붉은 옷을 입어 '홍의장군'이라 불렸습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "곽재우의 활동 순서로 알맞은 것은?", options: ["임진왜란 발발-의병 조직-게릴라 전술-정암진 전투","정암진 전투-임진왜란 발발-의병 조직-게릴라 전술","게릴라 전술-정암진 전투-의병 조직-임진왜란 발발","의병 조직-임진왜란 발발-정암진 전투-게릴라 전술"], answer: 0, explanation: "임진왜란 발발 후 의병을 조직하고 게릴라 전술로 싸웠습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'의병'의 뜻으로 알맞은 것은?", options: ["정규 군대","나라를 위해 스스로 일어난 민간 군대","외국 군대","도망친 군인"], answer: 1, explanation: "의병은 나라를 위해 백성들이 스스로 일어난 군대입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "곽재우의 의병 활동이 중요한 이유는?", options: ["돈을 많이 벌어서","조선이 반격할 시간을 벌어줘서","전쟁을 끝내서","일본과 협상해서"], answer: 1, explanation: "의병 활동으로 일본군의 진격을 막고 반격 시간을 벌었습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "곽재우에게서 배울 수 있는 점은?", options: ["위험하면 피하기","나라를 위해 자발적으로 일어나는 용기","명예와 권력 추구","군인만 싸워야 한다"], answer: 1, explanation: "관군이 무너진 상황에서 최초로 일어나 저항했습니다." }] }
  },
  "39": {
    // 문익점
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "문익점이 가져온 것은?", options: ["쌀","목화씨","비단","차"], answer: 1, explanation: "문익점은 원나라에서 목화씨를 가져왔습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "문익점 관련 사건의 순서는?", options: ["원나라 방문-목화씨 발견-붓대에 숨김-귀국 후 재배","귀국 후 재배-원나라 방문-붓대에 숨김-목화씨 발견","붓대에 숨김-귀국 후 재배-목화씨 발견-원나라 방문","목화씨 발견-귀국 후 재배-원나라 방문-붓대에 숨김"], answer: 0, explanation: "원나라에서 목화를 보고 씨앗을 숨겨 가져와 재배했습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'무명'의 뜻으로 알맞은 것은?", options: ["이름이 없는 것","목화로 만든 면직물","비단","삼베"], answer: 1, explanation: "무명은 목화에서 얻은 면직물입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "문익점이 목화씨를 가져온 결과는?", options: ["변화 없음","백성들의 의생활이 크게 개선됨","전쟁이 일어남","식량이 늘어남"], answer: 1, explanation: "따뜻한 무명옷으로 백성들의 의생활이 개선되었습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "문익점에게서 배울 수 있는 점은?", options: ["위험한 일은 피하기","백성을 위한 용기와 헌신","외국 것은 가져오면 안 된다","자신만 생각하기"], answer: 1, explanation: "위험을 무릅쓰고 백성들의 생활을 위해 목화씨를 가져왔습니다." }] }
  },
  "40": {
    // 허난설헌
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "허난설헌의 남동생이 쓴 소설은?", options: ["춘향전","홍길동전","심청전","흥부전"], answer: 1, explanation: "허난설헌의 남동생 허균이 홍길동전을 썼습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "허난설헌의 생애 순서로 알맞은 것은?", options: ["어린 시절 신동-결혼-자녀 사망-순세","결혼-어린 시절 신동-순세-자녀 사망","자녀 사망-순세-결혼-어린 시절 신동","순세-자녀 사망-어린 시절 신동-결혼"], answer: 0, explanation: "어린 시절 신동으로 불리다 결혼 후 힘든 삶을 살았습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'여류 시인'의 뜻으로 알맞은 것은?", options: ["남성 시인","여성 시인","외국 시인","어린이 시인"], answer: 1, explanation: "여류 시인은 여성 시인을 말합니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "허난설헌의 시가 해외에서 먼저 인정받은 이유는?", options: ["조선에서는 여성의 글이 인정받기 어려웠기 때문에","해외에서 돈을 많이 줘서","조선 사람들이 싫어해서","허균이 숨겨서"], answer: 0, explanation: "조선에서는 여성의 문학적 재능이 인정받기 어려웠습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "허난설헌에게서 배울 수 있는 점은?", options: ["여성은 글을 쓰면 안 된다","어려운 환경에서도 예술적 재능을 펼침","슬픔은 숨겨야 한다","시는 쓸모없다"], answer: 1, explanation: "힘든 삶 속에서도 뛰어난 문학적 재능을 펼쳤습니다." }] }
  }
};

// on_world1_01.html과 동일한 구조로 보완학습 부분 생성
function generateRemedialSection(unitNo) {
  const data = REMEDIAL_DATA[unitNo];
  if (!data) return null;

  return `/* ======= (임시 alert 버전 openRemedial 삭제) ======= */
    // ===== 보완학습 문제 뱅크 (객관식 2문제씩) =====
    const REMEDIAL_BANK = {
      literal: {
        title: "${data.literal.title}",
        problems: [
          { q: "${data.literal.problems[0].q}", options: ${JSON.stringify(data.literal.problems[0].options)}, answer: ${data.literal.problems[0].answer}, explanation: "${data.literal.problems[0].explanation}" }
        ]
      },
      structural: {
        title: "${data.structural.title}",
        problems: [
          { q: "${data.structural.problems[0].q}", options: ${JSON.stringify(data.structural.problems[0].options)}, answer: ${data.structural.problems[0].answer}, explanation: "${data.structural.problems[0].explanation}" }
        ]
      },
      lexical: {
        title: "${data.lexical.title}",
        problems: [
          { q: "${data.lexical.problems[0].q}", options: ${JSON.stringify(data.lexical.problems[0].options)}, answer: ${data.lexical.problems[0].answer}, explanation: "${data.lexical.problems[0].explanation}" }
        ]
      },
      inferential: {
        title: "${data.inferential.title}",
        problems: [
          { q: "${data.inferential.problems[0].q}", options: ${JSON.stringify(data.inferential.problems[0].options)}, answer: ${data.inferential.problems[0].answer}, explanation: "${data.inferential.problems[0].explanation}" }
        ]
      },
      critical: {
        title: "${data.critical.title}",
        problems: [
          { q: "${data.critical.problems[0].q}", options: ${JSON.stringify(data.critical.problems[0].options)}, answer: ${data.critical.problems[0].answer}, explanation: "${data.critical.problems[0].explanation}" }
        ]
      }
    };

    // ===== 보완학습 열기 =====
    const NUM_CIRCLE = ['①', '②', '③', '④'];
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
        const data = REMEDIAL_BANK[key];
        if (!data) return;
        html += \`<div style="margin-bottom:16px;">
          <h4 style="margin:4px 0 6px; color:#8b2f2f;">\${data.title}</h4>\`;
        const p = data.problems[0];
        if (p) {
          html += \`<p style="margin:0 0 6px; font-weight:600;">\${p.q}</p>\`;
          html += \`<div style="margin-left:8px;">\`;
          p.options.forEach((opt, idx) => {
            html += \`<label style="display:block;font-weight:normal;margin:2px 0;cursor:pointer;">
              <input type="radio" name="\${key}" value="\${idx}" style="margin-right:6px;">\${NUM_CIRCLE[idx]} \${opt}
            </label>\`;
          });
          html += \`</div><div id="\${key}-result" style="margin-top:6px;font-weight:bold;"></div>\`;
        }
        html += \`</div>\`;
      });

      html += \`<div style="text-align:center;margin-top:12px;">
        <button onclick="gradeRemedial()" style="padding:8px 24px;background:#8b2f2f;color:#fff;border:none;border-radius:8px;font-size:15px;cursor:pointer;">채점하기</button>
        <button onclick="resetRemedial()" style="padding:8px 24px;background:#666;color:#fff;border:none;border-radius:8px;font-size:15px;cursor:pointer;margin-left:8px;">다시 풀기</button>
      </div>\`;

      body.innerHTML = html;
      panel.style.display = 'flex';
    }

    // 보완학습 채점
    function gradeRemedial() {
      for (const key in REMEDIAL_BANK) {
        const data = REMEDIAL_BANK[key];
        if (!data) continue;
        const p = data.problems[0];
        const inputs = document.querySelectorAll(\`input[name="\${key}"]\`);
        if (!inputs.length) continue;
        let selected = -1;
        inputs.forEach((inp, i) => { if (inp.checked) selected = i; });
        const resultDiv = document.getElementById(\`\${key}-result\`);
        if (!resultDiv) continue;
        if (selected === -1) {
          resultDiv.innerHTML = '<span style="color:#666;font-size:12px;">선택해주세요</span>';
        } else if (selected === p.answer) {
          resultDiv.innerHTML = '<span style="color:#157347;font-size:12px;">정답입니다 ✅</span>';
        } else {
          resultDiv.innerHTML = \`<span style="color:#b3261e;font-size:12px;">틀렸어요 ❌ 정답: \${NUM_CIRCLE[p.answer]} \${p.options[p.answer]}</span><br><span style="color:#555;font-size:11px;">\${p.explanation}</span>\`;
        }
      }
    }

    // 보완학습 리셋
    function resetRemedial() {
      const body = document.getElementById('remedial-panel-body');
      if (!body) return;
      body.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
      for (const key in REMEDIAL_BANK) {
        const resultDiv = document.getElementById(\`\${key}-result\`);
        if (resultDiv) resultDiv.innerHTML = '';
      }
    }`;
}

for (let i = 21; i <= 40; i++) {
  const no = String(i).padStart(2, '0');
  const filePath = path.join(DIR, `on_people1_${no}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ 파일 없음: on_people1_${no}.html`);
    continue;
  }

  let html = fs.readFileSync(filePath, 'utf8');

  // 기존 보완학습 관련 코드 모두 제거
  const cleanupPattern = /\/\* =+ \(임시 alert 버전 openRemedial 삭제\) =+ \*\/[\s\S]*?(?=<\/script>)/g;
  html = html.replace(cleanupPattern, '');

  // 중복된 함수들 제거
  html = html.replace(/function openRemedial\(\)\s*\{[\s\S]*?\n\s{4}\}/g, '');
  html = html.replace(/window\.openRemedial\s*=\s*function\(\)\s*\{[\s\S]*?\n\s{4}\}/g, '');
  html = html.replace(/window\.gradeRemedial\s*=\s*function\(\)\s*\{[\s\S]*?\n\s{4}\}/g, '');
  html = html.replace(/window\.resetRemedial\s*=\s*function\(\)\s*\{[\s\S]*?\n\s{4}\}/g, '');
  html = html.replace(/const REMEDIAL_BANK\s*=\s*\{[\s\S]*?\n\s{4}\};/g, '');
  html = html.replace(/const NUM_CIRCLE\s*=\s*\[[\s\S]*?\];/g, '');

  // 빈 줄 정리
  html = html.replace(/\n{3,}/g, '\n\n');

  // 새로운 보완학습 코드 삽입 위치 찾기: renderFeedback 함수 뒤
  const insertPoint = html.indexOf('renderFeedback(scores)');
  if (insertPoint === -1) {
    console.log(`⚠️ renderFeedback 함수를 찾을 수 없음: on_people1_${no}.html`);
    continue;
  }

  // renderFeedback 함수의 닫는 괄호 찾기
  let braceCount = 0;
  let funcEnd = insertPoint;
  let foundStart = false;

  for (let j = insertPoint; j < html.length; j++) {
    if (html[j] === '{') {
      braceCount++;
      foundStart = true;
    } else if (html[j] === '}') {
      braceCount--;
      if (foundStart && braceCount === 0) {
        funcEnd = j + 1;
        break;
      }
    }
  }

  // 새 보완학습 코드 생성
  const newRemedialCode = generateRemedialSection(no);
  if (!newRemedialCode) {
    console.log(`⚠️ 보완학습 데이터 없음: on_people1_${no}.html`);
    continue;
  }

  // 삽입
  html = html.slice(0, funcEnd) + '\n\n    ' + newRemedialCode + '\n\n' + html.slice(funcEnd);

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✅ 수정 완료: on_people1_${no}.html`);
}

console.log('\n🎉 온한국인물 21~40 보완학습 구현 완료!');
console.log('- on_world1_01.html과 동일한 구조로 구현됨');
console.log('- 각 단원별 고유 문제 적용:');
console.log('  21: 안중근, 22: 유관순, 23: 윤봉길, 24: 김구, 25: 한석봉');
console.log('  26: 김홍도, 27: 신윤복, 28: 박지원, 29: 김대건, 30: 주시경');
console.log('  31: 방정환, 32: 장보고, 33: 선덕여왕, 34: 연개소문, 35: 계백');
console.log('  36: 최영, 37: 권율, 38: 곽재우, 39: 문익점, 40: 허난설헌');

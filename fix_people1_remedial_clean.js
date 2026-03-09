const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'public', 'BRAINUP', 'person');

// 각 단원별 보완학습 데이터 (김유신, 문무왕, 원효, ...)
const REMEDIAL_DATA = {
  "01": {
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "김유신이 열다섯 살에 가입한 신라의 청소년 수련 단체는?", options: ["삼랑","화랑","소년단","기마대"], answer: 1, explanation: "김유신은 열다섯 살에 화랑이 되어 큰 기대를 받았습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "김유신이 반성하고 결심을 굳히게 된 직접적인 계기는?", options: ["어머니의 꾸중","전투의 승리","말이 여인의 집 앞으로 간 것","왕의 명령"], answer: 2, explanation: "말이 습관대로 여인의 집으로 가자 김유신은 자신의 마음이 바로서지 않았음을 깨달았습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'꾸짖다'의 뜻으로 알맞은 것은?", options: ["칭찬하다","격려하다","잘못을 엄하게 나무라다","조용히 타이르다"], answer: 2, explanation: "'꾸짖다'는 잘못을 이야기하며 엄하게 나무라는 것입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "김유신의 말이 여인의 집을 찾아간 이유로 추론할 수 있는 것은?", options: ["말이 똑똒해서","주인의 습관을 기억했기 때문에","길을 잃어서","여인이 말을 불렀기 때문에"], answer: 1, explanation: "본문에서 '말까지 이 길을 기억하는구나'라고 한 것에서 추론할 수 있습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "이 글에서 배울 수 있는 교훈으로 가장 알맞은 것은?", options: ["결심만 하면 된다","한순간의 결심보다 꾸준한 노력이 중요하다","다른 사람의 말은 무시해도 된다","재능이 가장 중요하다"], answer: 1, explanation: "김유신은 결심을 행동으로 옮기고 꾸준히 노력하여 성장했습니다." }] }
  },
  "02": {
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "문무왕이 바다에 묻어 달라고 한 이유는?", options: ["바다를 좋아해서","용이 되어 나라를 지키기 위해","수영을 잘해서","배를 만들기 위해"], answer: 1, explanation: "문무왕은 죽어서 용이 되어 왜적을 물리치겠다고 했습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "이 글에서 문무왕의 유언이 등장하는 위치는?", options: ["처음","중간","끝","없다"], answer: 2, explanation: "문무왕의 유언은 글의 후반부에 등장합니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'수호하다'의 뜻으로 알맞은 것은?", options: ["공격하다","지키다","버리다","숨기다"], answer: 1, explanation: "'수호하다'는 소중히 지키고 보호한다는 뜻입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "문무왕이 삼국통일 후에도 걱정한 것은?", options: ["재물 부족","왜적의 침입","가뭄","후계자 문제"], answer: 1, explanation: "삼국통일 후에도 왜적의 침입을 걱정하여 호국의 뜻을 세웠습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "문무왕의 행동에서 배울 수 있는 점은?", options: ["자신의 이익만 생각하기","나라와 백성을 위한 희생정신","편하게 살기","남의 일에 신경 쓰지 않기"], answer: 1, explanation: "문무왕은 죽어서도 나라를 지키겠다는 희생정신을 보여주었습니다." }] }
  },
  "03": {
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "원효가 깨달음을 얻은 장소는?", options: ["절","동굴","해골 바가지","궁궐"], answer: 2, explanation: "원효는 해골 바가지의 물을 마신 뒤 깨달음을 얻었습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "원효의 깨달음 과정을 순서대로 나열한 것은?", options: ["동굴-물 마심-아침에 해골 발견-깨달음","해골 발견-물 마심-깨달음-동굴","깨달음-동굴-물 마심-해골 발견","물 마심-깨달음-동굴-해골 발견"], answer: 0, explanation: "밤에 맛있게 마신 물이 아침에 해골에 담긴 물임을 알고 깨달았습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'일체유심조'의 뜻으로 알맞은 것은?", options: ["모든 것은 물질이다","모든 것은 마음이 만든다","모든 것은 우연이다","모든 것은 정해져 있다"], answer: 1, explanation: "일체유심조는 '모든 것이 마음먹기에 달렸다'는 뜻입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "원효가 당나라 유학을 포기한 이유는?", options: ["돈이 없어서","당나라가 위험해서","마음의 깨달음으로 충분해서","친구가 말려서"], answer: 2, explanation: "마음의 진리를 깨달아 더 이상 당나라에 갈 필요가 없었습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "원효의 이야기에서 배울 수 있는 교훈은?", options: ["물은 깨끗한 것만 마셔야 한다","마음가짐에 따라 모든 것이 달라진다","여행은 혼자 해야 한다","깨달음은 책에서만 얻는다"], answer: 1, explanation: "같은 물도 마음에 따라 달게도 역겹게도 느껴집니다." }] }
  },
  "04": {
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "장영실이 만든 물시계의 이름은?", options: ["해시계","자격루","물레방아","측우기"], answer: 1, explanation: "장영실은 스스로 시간을 알려주는 자격루를 만들었습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "장영실의 발명품이 소개된 순서는?", options: ["자격루-측우기-해시계","해시계-자격루-측우기","측우기-해시계-자격루","자격루-해시계-측우기"], answer: 0, explanation: "자격루를 먼저 만들고 이후 다른 발명품을 만들었습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'천민'의 뜻으로 알맞은 것은?", options: ["하늘의 백성","가장 낮은 신분","외국인","귀족"], answer: 1, explanation: "천민은 조선시대 가장 낮은 신분 계층입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "세종대왕이 장영실을 등용한 이유는?", options: ["신분이 높아서","뛰어난 재능 때문에","부자여서","외모가 뛰어나서"], answer: 1, explanation: "세종은 신분보다 재능을 중시하여 장영실을 등용했습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "장영실의 이야기에서 배울 수 있는 점은?", options: ["신분이 가장 중요하다","노력과 재능으로 한계를 극복할 수 있다","발명은 쉽다","포기하면 편하다"], answer: 1, explanation: "장영실은 낮은 신분에도 노력으로 위대한 업적을 남겼습니다." }] }
  },
  "05": {
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "이순신이 거북선을 만든 목적은?", options: ["관광용","왜적을 물리치기 위해","낚시용","무역용"], answer: 1, explanation: "이순신은 왜적의 침략에 대비하여 거북선을 만들었습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "이순신의 업적이 소개된 순서는?", options: ["거북선 제작-한산도 대첩-노량 해전","노량 해전-거북선 제작-한산도 대첩","한산도 대첩-노량 해전-거북선 제작","거북선 제작-노량 해전-한산도 대첩"], answer: 0, explanation: "거북선을 만든 후 해전에서 승리를 거두었습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'불패'의 뜻으로 알맞은 것은?", options: ["자주 지는 것","한 번도 지지 않는 것","가끔 이기는 것","항상 비기는 것"], answer: 1, explanation: "불패는 한 번도 지지 않음을 뜻합니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "이순신이 죽음을 알리지 말라고 한 이유는?", options: ["부끄러워서","군사들의 사기가 떨어질까 봐","비밀이 좋아서","적이 들을까 봐"], answer: 1, explanation: "전투 중 사기 저하를 막기 위해 죽음을 알리지 말라 했습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "이순신에게서 배울 수 있는 점은?", options: ["전쟁은 피해야 한다","철저한 준비와 책임감이 중요하다","혼자서 모든 것을 해야 한다","무기만 좋으면 된다"], answer: 1, explanation: "이순신은 철저한 준비와 책임감으로 나라를 지켰습니다." }] }
  },
  "06": {
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "세종대왕이 만든 문자의 이름은?", options: ["한문","훈민정음","가나","알파벳"], answer: 1, explanation: "세종대왕은 백성을 위해 훈민정음을 창제했습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "훈민정음 창제 과정의 순서로 알맞은 것은?", options: ["연구-반대-창제-반포","반대-연구-반포-창제","창제-연구-반대-반포","연구-창제-반대-반포"], answer: 3, explanation: "연구와 창제 후 신하들의 반대에도 반포했습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'창제'의 뜻으로 알맞은 것은?", options: ["처음으로 만들다","고치다","없애다","빌리다"], answer: 0, explanation: "창제는 처음으로 만들어 낸다는 뜻입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "세종대왕이 한글을 만든 이유는?", options: ["외국어를 배우기 위해","백성이 쉽게 글을 쓰도록","신하들을 위해","자신의 명예를 위해"], answer: 1, explanation: "한문을 모르는 백성들이 뜻을 전할 수 있도록 만들었습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "세종대왕의 업적에서 배울 수 있는 점은?", options: ["권력이 가장 중요하다","백성을 위한 마음이 중요하다","반대는 무시해야 한다","혼자 일하는 것이 좋다"], answer: 1, explanation: "세종은 백성을 사랑하는 마음으로 한글을 만들었습니다." }] }
  },
  "07": {
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "신사임당이 뛰어났던 분야는?", options: ["무술","그림과 글씨","요리","건축"], answer: 1, explanation: "신사임당은 그림과 글씨에 뛰어난 예술가였습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "신사임당의 삶이 소개된 순서는?", options: ["어린시절-결혼-자녀교육-작품활동","결혼-어린시절-작품활동-자녀교육","작품활동-결혼-어린시절-자녀교육","자녀교육-어린시절-결혼-작품활동"], answer: 0, explanation: "어린 시절부터 결혼 후까지 시간 순서로 소개됩니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'현모양처'의 뜻으로 알맞은 것은?", options: ["유명한 화가","어질고 착한 어머니와 아내","엄격한 스승","부지런한 농부"], answer: 1, explanation: "현모양처는 어진 어머니이자 좋은 아내를 말합니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "신사임당의 자녀 교육 방식은?", options: ["엄하게 때리기","모범을 보이며 가르치기","방임하기","남에게 맡기기"], answer: 1, explanation: "스스로 모범을 보이며 자녀를 가르쳤습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "신사임당에게서 배울 수 있는 점은?", options: ["재능만 있으면 된다","여러 역할을 성실히 수행하는 것","공부는 필요 없다","자녀 교육은 남에게 맡겨야 한다"], answer: 1, explanation: "예술가이자 어머니로서 역할을 훌륭히 수행했습니다." }] }
  },
  "08": {
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "정약용이 설계한 기계의 이름은?", options: ["자격루","거중기","측우기","비거"], answer: 1, explanation: "정약용은 수원 화성 건설에 거중기를 설계했습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "정약용의 업적이 소개된 순서는?", options: ["유배-거중기-책 저술","거중기-유배-책 저술","책 저술-거중기-유배","유배-책 저술-거중기"], answer: 0, explanation: "거중기 설계 후 유배 생활 중 많은 책을 썼습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'유배'의 뜻으로 알맞은 것은?", options: ["여행을 가다","죄인을 먼 곳으로 보내다","승진하다","상을 받다"], answer: 1, explanation: "유배는 죄인을 먼 지방으로 보내는 형벌입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "정약용이 유배 중에도 책을 쓴 이유는?", options: ["돈을 벌기 위해","백성을 위한 마음 때문에","심심해서","명령을 받아서"], answer: 1, explanation: "어려운 상황에서도 백성을 위한 학문을 연구했습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "정약용에게서 배울 수 있는 점은?", options: ["어려운 상황에서 포기하기","역경 속에서도 배움을 멈추지 않기","권력을 추구하기","혼자만 알고 있기"], answer: 1, explanation: "유배 중에도 500여 권의 책을 저술했습니다." }] }
  },
  "09": {
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "안중근이 이토 히로부미를 처단한 장소는?", options: ["서울","도쿄","하얼빈","블라디보스토크"], answer: 2, explanation: "안중근은 하얼빈 역에서 이토 히로부미를 처단했습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "안중근의 생애가 소개된 순서는?", options: ["교육활동-의병활동-하얼빈 의거-순국","의병활동-교육활동-순국-하얼빈 의거","하얼빈 의거-의병활동-교육활동-순국","순국-하얼빈 의거-의병활동-교육활동"], answer: 0, explanation: "교육과 의병 활동 후 하얼빈 의거를 일으켰습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'순국'의 뜻으로 알맞은 것은?", options: ["나라를 떠나다","나라를 위해 목숨을 바치다","나라를 세우다","나라를 팔다"], answer: 1, explanation: "순국은 나라를 위해 목숨을 바치는 것입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "안중근이 '동양평화론'을 쓴 이유는?", options: ["돈을 벌기 위해","진정한 평화를 설명하기 위해","탈출하기 위해","유명해지기 위해"], answer: 1, explanation: "침략이 아닌 진정한 동양 평화를 주장했습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "안중근에게서 배울 수 있는 점은?", options: ["폭력이 해결책이다","나라를 위한 희생정신","개인의 이익이 중요하다","외국에서 살아야 한다"], answer: 1, explanation: "나라의 독립을 위해 목숨을 바쳤습니다." }] }
  },
  "10": {
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "유관순이 만세 운동을 벌인 날은?", options: ["삼일절","광복절","한글날","개천절"], answer: 0, explanation: "유관순은 1919년 3.1운동에 참여했습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "유관순의 활동이 소개된 순서는?", options: ["학교-고향-체포-순국","체포-학교-순국-고향","고향-학교-순국-체포","순국-고향-체포-학교"], answer: 0, explanation: "학교에서 시작해 고향에서 만세운동을 이끌었습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'만세'를 외친 이유로 알맞은 것은?", options: ["축하하기 위해","독립을 바라며","즐거워서","인사하기 위해"], answer: 1, explanation: "나라의 독립을 바라는 마음으로 만세를 외쳤습니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "유관순이 고향에서 만세운동을 한 이유는?", options: ["서울이 위험해서","더 많은 사람을 모으기 위해","숨기 위해","부모님을 만나기 위해"], answer: 1, explanation: "고향 아우내 장터에서 많은 사람들과 함께했습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "유관순에게서 배울 수 있는 점은?", options: ["어린 나이에는 아무것도 못한다","용기와 나라 사랑","위험한 일은 피해야 한다","혼자서는 아무것도 못한다"], answer: 1, explanation: "어린 나이에도 나라를 위해 용기 있게 행동했습니다." }] }
  },
  "11": {
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "김구가 이끈 단체의 이름은?", options: ["의열단","대한민국 임시정부","동학당","독립협회"], answer: 1, explanation: "김구는 대한민국 임시정부의 주석이었습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "김구의 활동이 소개된 순서는?", options: ["동학-투옥-임시정부-광복","임시정부-동학-광복-투옥","광복-임시정부-투옥-동학","투옥-동학-광복-임시정부"], answer: 0, explanation: "동학 활동부터 임시정부까지 시간 순서로 소개됩니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'백범'의 의미로 알맞은 것은?", options: ["백 번 범죄자","평범한 백성","하얀 호랑이","백 가지 법"], answer: 1, explanation: "백범은 '가장 평범한 백성'이라는 뜻입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "김구가 '나의 소원'에서 바란 것은?", options: ["부강한 나라","문화 강국","군사 강국","큰 영토"], answer: 1, explanation: "높은 문화의 힘으로 세계에 기여하길 바랐습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "김구에게서 배울 수 있는 점은?", options: ["무력만이 답이다","문화와 평화의 중요성","개인의 영달 추구","외국에 의존하기"], answer: 1, explanation: "문화의 힘과 평화를 중시했습니다." }] }
  },
  "12": {
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "윤봉길이 폭탄을 던진 장소는?", options: ["서울","상하이 훙커우 공원","도쿄","하얼빈"], answer: 1, explanation: "윤봉길은 상하이 훙커우 공원에서 의거를 일으켰습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "윤봉길의 생애가 소개된 순서는?", options: ["농촌계몽-중국 망명-훙커우 의거-순국","중국 망명-농촌계몽-순국-훙커우 의거","훙커우 의거-농촌계몽-중국 망명-순국","순국-훙커우 의거-농촌계몽-중국 망명"], answer: 0, explanation: "농촌계몽 활동 후 중국으로 망명하여 의거를 일으켰습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'의거'의 뜻으로 알맞은 것은?", options: ["정의로운 일어남","의자에 앉음","거짓말하기","거리에서 시위하기"], answer: 0, explanation: "의거는 정의를 위해 일어나는 행동입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "윤봉길 의거가 독립운동에 미친 영향은?", options: ["독립운동 포기","한국 독립 의지를 세계에 알림","일본과 화해","아무 영향 없음"], answer: 1, explanation: "중국과 세계에 한국의 독립 의지를 알렸습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "윤봉길에게서 배울 수 있는 점은?", options: ["폭력이 정답이다","나라를 위한 희생정신","개인의 안전이 최우선","외국에서 편히 살기"], answer: 1, explanation: "젊은 나이에 나라를 위해 목숨을 바쳤습니다." }] }
  },
  "13": {
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "허준이 쓴 의학서의 이름은?", options: ["본초강목","동의보감","의방유취","향약집성방"], answer: 1, explanation: "허준은 동의보감을 저술했습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "허준의 업적이 소개된 순서는?", options: ["궁중 의원-전염병 치료-동의보감 편찬","동의보감 편찬-궁중 의원-전염병 치료","전염병 치료-동의보감 편찬-궁중 의원","궁중 의원-동의보감 편찬-전염병 치료"], answer: 0, explanation: "궁중 의원으로 일하며 동의보감을 완성했습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'보감'의 뜻으로 알맞은 것은?", options: ["보물 거울","귀한 책","아름다운 그림","비싼 약"], answer: 1, explanation: "보감은 귀중한 책이라는 뜻입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "동의보감이 중요한 이유는?", options: ["그림이 예뻐서","우리나라 약재로 병을 치료할 수 있어서","외국에서 왔기 때문에","비싸기 때문에"], answer: 1, explanation: "우리 땅의 약재로 백성을 치료할 수 있게 했습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "허준에게서 배울 수 있는 점은?", options: ["높은 신분이 중요하다","백성을 위한 헌신","명예만 추구하기","쉬운 길만 가기"], answer: 1, explanation: "낮은 신분에도 백성을 위해 의술에 헌신했습니다." }] }
  },
  "14": {
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "이황이 강조한 것은?", options: ["무술","경(敬)과 성리학","상업","군사력"], answer: 1, explanation: "이황은 경을 통해 마음을 바로잡는 것을 강조했습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "이황의 학문 활동이 소개된 순서는?", options: ["관직생활-낙향-제자양성-저술활동","저술활동-관직생활-낙향-제자양성","제자양성-저술활동-관직생활-낙향","낙향-제자양성-저술활동-관직생활"], answer: 0, explanation: "관직 후 고향으로 돌아가 제자를 양성했습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'도산서원'의 '서원'이 뜻하는 것은?", options: ["절","학교","시장","궁궐"], answer: 1, explanation: "서원은 유학을 가르치는 교육 기관입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "이황이 관직을 사양하고 고향에 머문 이유는?", options: ["게을러서","학문과 제자 양성에 집중하기 위해","건강 때문에","돈 때문에"], answer: 1, explanation: "학문 연구와 후학 양성에 전념하고자 했습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "이황에게서 배울 수 있는 점은?", options: ["권력이 최고다","학문과 인격 수양의 중요성","관직만 중요하다","명예를 추구해야 한다"], answer: 1, explanation: "평생 학문을 연구하고 후학을 양성했습니다." }] }
  },
  "15": {
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "이이가 주장한 개혁안의 이름은?", options: ["십만양병설","북벌론","실학사상","동도서기론"], answer: 0, explanation: "이이는 십만 군사를 기르자는 십만양병설을 주장했습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "이이의 활동이 소개된 순서는?", options: ["학문연구-관직생활-개혁주장-저술활동","관직생활-학문연구-저술활동-개혁주장","저술활동-개혁주장-학문연구-관직생활","개혁주장-저술활동-관직생활-학문연구"], answer: 0, explanation: "학문 연구 후 관직에서 개혁을 주장했습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'양병'의 뜻으로 알맞은 것은?", options: ["병을 치료하다","군사를 기르다","약을 먹다","병원을 세우다"], answer: 1, explanation: "양병은 군사를 기르고 훈련시키는 것입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "이이가 십만양병설을 주장한 이유는?", options: ["전쟁을 좋아해서","일본의 침략에 대비하기 위해","군인이 되고 싶어서","명나라를 공격하기 위해"], answer: 1, explanation: "일본의 침략을 예상하고 대비를 주장했습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "이이에게서 배울 수 있는 점은?", options: ["현실에 안주하기","미래를 내다보는 혜안","전쟁만 해야 한다","개혁은 필요 없다"], answer: 1, explanation: "미래를 예측하고 대비를 주장한 선견지명이 있었습니다." }] }
  },
  "16": {
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "김정호가 만든 지도의 이름은?", options: ["혼일강리역대국도지도","대동여지도","천하도","해동지도"], answer: 1, explanation: "김정호는 대동여지도를 제작했습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "김정호의 업적이 소개된 순서는?", options: ["전국답사-자료수집-지도제작-완성","자료수집-지도제작-전국답사-완성","지도제작-전국답사-자료수집-완성","완성-전국답사-자료수집-지도제작"], answer: 0, explanation: "전국을 답사하고 자료를 모아 지도를 만들었습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'여지'의 뜻으로 알맞은 것은?", options: ["여유","땅의 형세","여자의 뜻","나머지"], answer: 1, explanation: "여지는 땅의 형세와 지리를 뜻합니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "김정호가 정확한 지도 제작에 힘쓴 이유는?", options: ["돈을 벌기 위해","나라와 백성에게 도움이 되기 위해","유명해지기 위해","외국에 팔기 위해"], answer: 1, explanation: "정확한 지도가 나라에 필요하다고 생각했습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "김정호에게서 배울 수 있는 점은?", options: ["빨리 대충 하기","한 분야에 대한 끈기와 노력","남의 것 베끼기","포기하면 편하다"], answer: 1, explanation: "평생을 지도 제작에 바친 노력과 끈기가 있었습니다." }] }
  },
  "17": {
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "방정환이 만든 어린이 잡지의 이름은?", options: ["소년","어린이","아이들","동심"], answer: 1, explanation: "방정환은 '어린이' 잡지를 창간했습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "방정환의 활동이 소개된 순서는?", options: ["어린이 운동-잡지 창간-동화 구연-어린이날 제정","잡지 창간-어린이날 제정-동화 구연-어린이 운동","동화 구연-어린이 운동-잡지 창간-어린이날 제정","어린이날 제정-잡지 창간-어린이 운동-동화 구연"], answer: 0, explanation: "어린이 운동을 시작으로 여러 활동을 펼쳤습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'동화 구연'의 뜻으로 알맞은 것은?", options: ["동화책 쓰기","동화를 말로 들려주기","동화책 읽기","동화 그림 그리기"], answer: 1, explanation: "구연은 이야기를 말로 들려주는 것입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "방정환이 '어린이'라는 말을 만든 이유는?", options: ["재미있어서","아이들을 존중하기 위해","외국어를 따라서","어른들이 시켜서"], answer: 1, explanation: "아이들도 인격체로 존중받아야 한다고 생각했습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "방정환에게서 배울 수 있는 점은?", options: ["아이들은 어른 말만 들어야 한다","어린이 존중과 사랑","어린이에게 관심 갖지 않기","공부만 시키기"], answer: 1, explanation: "어린이의 인격과 권리를 존중했습니다." }] }
  },
  "18": {
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "한용운이 쓴 시집의 이름은?", options: ["님의 침묵","진달래꽃","윤동주 시집","청록집"], answer: 0, explanation: "한용운은 '님의 침묵'이라는 시집을 썼습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "한용운의 활동이 소개된 순서는?", options: ["출가-3.1운동 참여-시 창작-독립운동","시 창작-출가-독립운동-3.1운동 참여","3.1운동 참여-출가-시 창작-독립운동","독립운동-시 창작-출가-3.1운동 참여"], answer: 0, explanation: "스님이 된 후 3.1운동에 참여하고 문학 활동을 했습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'님'이 상징하는 것으로 알맞은 것은?", options: ["연인만","조국, 부처, 이상 등 다양한 대상","스님","어머니"], answer: 1, explanation: "'님'은 조국, 부처 등 다양한 의미를 담고 있습니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "한용운이 조선총독부를 등지고 집을 지은 이유는?", options: ["경치 때문에","일제에 대한 저항 의지 표현","우연히","건축 실수"], answer: 1, explanation: "조선총독부를 보지 않겠다는 저항 정신의 표현입니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "한용운에게서 배울 수 있는 점은?", options: ["문학은 현실과 무관하다","문학과 행동으로 신념을 지키기","타협이 최선이다","침묵만 하기"], answer: 1, explanation: "시와 행동으로 독립 의지를 표현했습니다." }] }
  },
  "19": {
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "주시경이 연구한 것은?", options: ["수학","한글","영어","한문"], answer: 1, explanation: "주시경은 한글을 연구하고 체계화했습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "주시경의 활동이 소개된 순서는?", options: ["한글 연구-문법 정리-제자 양성-국어사전 편찬 시작","국어사전 편찬-한글 연구-제자 양성-문법 정리","제자 양성-문법 정리-한글 연구-국어사전 편찬","문법 정리-국어사전 편찬-제자 양성-한글 연구"], answer: 0, explanation: "한글 연구부터 사전 편찬까지 체계적으로 활동했습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'한글'이라는 이름의 뜻으로 알맞은 것은?", options: ["한나라 글자","크고 바른 글자","한가한 글자","어려운 글자"], answer: 1, explanation: "한글의 '한'은 크다, 바르다는 뜻입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "주시경이 한글 연구에 힘쓴 이유는?", options: ["돈을 벌기 위해","우리말과 글을 지키기 위해","외국에 알리기 위해","취미로"], answer: 1, explanation: "일제강점기에 우리말을 지키려 했습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "주시경에게서 배울 수 있는 점은?", options: ["외국어가 더 중요하다","우리말을 사랑하고 지키기","한글은 불편하다","언어는 중요하지 않다"], answer: 1, explanation: "우리말을 사랑하고 연구하여 지켰습니다." }] }
  },
  "20": {
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "윤동주의 대표 시는?", options: ["서시","님의 침묵","진달래꽃","귀뚜라미"], answer: 0, explanation: "윤동주의 대표작은 '서시'입니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "윤동주의 생애가 소개된 순서는?", options: ["유년기-연희전문-일본 유학-순국","일본 유학-유년기-연희전문-순국","연희전문-유년기-순국-일본 유학","순국-일본 유학-연희전문-유년기"], answer: 0, explanation: "유년기부터 순국까지 시간 순서로 소개됩니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'서시'의 '서'가 뜻하는 것은?", options: ["서쪽","책의 머리말","슬픔","서울"], answer: 1, explanation: "서시는 시집의 첫머리에 쓰는 시입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "윤동주가 '부끄럽지 않은 삶'을 노래한 이유는?", options: ["자랑하려고","일제 시대에 양심을 지키려는 의지","유명해지려고","돈을 벌려고"], answer: 1, explanation: "어두운 시대에 양심과 순수함을 지키려 했습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "윤동주에게서 배울 수 있는 점은?", options: ["시는 현실과 무관하다","맑은 양심과 자기 성찰","타협이 최선이다","외국어로 글 쓰기"], answer: 1, explanation: "어려운 시대에도 맑은 양심을 지키려 했습니다." }] }
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

for (let i = 1; i <= 20; i++) {
  const no = String(i).padStart(2, '0');
  const filePath = path.join(DIR, `on_people1_${no}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ 파일 없음: on_people1_${no}.html`);
    continue;
  }

  let html = fs.readFileSync(filePath, 'utf8');

  // 기존 보완학습 관련 코드 모두 제거 (중복 코드 포함)
  // 패턴: /* ======= (임시 alert 버전 openRemedial 삭제) ======= */ 부터 </script> 직전까지의 보완학습 관련 코드

  // 1. 기존 REMEDIAL_BANK 및 관련 함수들 제거
  const cleanupPattern = /\/\* =+ \(임시 alert 버전 openRemedial 삭제\) =+ \*\/[\s\S]*?(?=<\/script>)/g;
  html = html.replace(cleanupPattern, '');

  // 2. 중복된 openRemedial, gradeRemedial, resetRemedial 함수들 제거
  html = html.replace(/function openRemedial\(\)\s*\{[\s\S]*?\n\s{4}\}/g, '');
  html = html.replace(/window\.openRemedial\s*=\s*function\(\)\s*\{[\s\S]*?\n\s{4}\}/g, '');
  html = html.replace(/window\.gradeRemedial\s*=\s*function\(\)\s*\{[\s\S]*?\n\s{4}\}/g, '');
  html = html.replace(/window\.resetRemedial\s*=\s*function\(\)\s*\{[\s\S]*?\n\s{4}\}/g, '');
  html = html.replace(/const REMEDIAL_BANK\s*=\s*\{[\s\S]*?\n\s{4}\};/g, '');
  html = html.replace(/const NUM_CIRCLE\s*=\s*\[[\s\S]*?\];/g, '');

  // 3. 빈 줄 정리
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

console.log('\n🎉 온한국인물 01~20 보완학습 구조 정비 완료!');
console.log('- on_world1_01.html과 동일한 구조로 수정됨');
console.log('- 각 단원별 고유 문제 적용');

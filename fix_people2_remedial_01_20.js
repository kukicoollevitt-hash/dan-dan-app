const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'public', 'BRAINUP', 'person');

// 온세계인물 01~20 보완학습 데이터
const REMEDIAL_DATA = {
  "01": {
    // 레오나르도 다빈치
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "레오나르도 다빈치가 활동한 시대는?", options: ["고대 그리스","르네상스","산업혁명","현대"], answer: 1, explanation: "레오나르도 다빈치는 이탈리아 르네상스 시대의 위대한 천재입니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "레오나르도 다빈치의 활동 분야로 알맞은 것은?", options: ["화가만","발명가만","화가이자 발명가","음악가"], answer: 2, explanation: "레오나르도는 화가이자 발명가로 여러 분야에서 활동했습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'관찰'의 뜻으로 알맞은 것은?", options: ["대충 보기","주의 깊게 살펴보기","무시하기","빨리 지나가기"], answer: 1, explanation: "관찰은 사물이나 현상을 주의 깊게 살펴보는 것입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "레오나르도가 비행 기계를 설계한 이유는?", options: ["돈을 벌기 위해","하늘을 날고 싶은 꿈 때문에","왕의 명령 때문에","전쟁을 위해"], answer: 1, explanation: "하늘을 날고 싶다는 꿈을 품고 새의 날개를 연구했습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "레오나르도에게서 배울 수 있는 점은?", options: ["한 가지만 잘하면 된다","호기심과 끈기로 세상을 탐구하기","그림만 잘 그리면 된다","공부는 필요 없다"], answer: 1, explanation: "호기심과 끈기로 세상을 탐구한 사람이었습니다." }] }
  },
  "02": {
    // 미켈란젤로
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "미켈란젤로가 천장화를 그린 장소는?", options: ["루브르 박물관","시스티나 성당","피렌체 대성당","바티칸 광장"], answer: 1, explanation: "미켈란젤로는 시스티나 성당의 천장화를 그렸습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "미켈란젤로의 대표작으로 언급된 것은?", options: ["모나리자, 최후의 만찬","다비드 조각상, 아담의 창조","별이 빛나는 밤","해바라기"], answer: 1, explanation: "다비드 조각상과 천장화의 아담의 창조가 대표작입니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'걸작'의 뜻으로 알맞은 것은?", options: ["평범한 작품","매우 뛰어난 예술 작품","실패한 작품","미완성 작품"], answer: 1, explanation: "걸작은 매우 뛰어난 예술 작품입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "미켈란젤로가 천장화 작업 중 겪은 어려움은?", options: ["돈이 없어서","4년간 목과 등이 아플 정도로 힘든 자세","그림을 못 그려서","도구가 없어서"], answer: 1, explanation: "비계 위에서 4년 동안 목과 등이 아플 정도로 고난을 겪었습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "미켈란젤로의 업적이 보여주는 것은?", options: ["재능만 있으면 된다","예술은 노력과 열정으로 완성된다","쉬운 일만 해야 한다","포기해도 된다"], answer: 1, explanation: "예술이 인간의 노력과 열정으로 완성된다는 것을 보여줍니다." }] }
  },
  "03": {
    // 셰익스피어
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "셰익스피어가 런던에서 처음 한 일은?", options: ["바로 극작가가 됨","말 돌보기, 관객 안내 등 허드렛일","왕궁에서 일함","학교 선생님"], answer: 1, explanation: "처음에는 말을 돌보거나 관객의 자리를 안내하는 허드렛일부터 시작했습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "셰익스피어의 성장 과정 순서는?", options: ["런던-스트랫퍼드-극작가","스트랫퍼드-런던-허드렛일-극작가","극작가-런던-스트랫퍼드","허드렛일-스트랫퍼드-런던"], answer: 1, explanation: "스트랫퍼드에서 태어나 런던으로 가서 허드렛일 후 극작가가 되었습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'극작가'의 뜻으로 알맞은 것은?", options: ["연극 배우","연극의 대본을 쓰는 사람","무대 감독","관객"], answer: 1, explanation: "극작가는 연극의 대본을 쓰는 사람입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "셰익스피어의 작품이 성공한 이유는?", options: ["돈을 많이 들여서","사람들의 감정이 생생하게 담겨 있어서","외국어로 써서","짧아서"], answer: 1, explanation: "사람들의 기쁨, 슬픔, 사랑, 분노 같은 감정이 생생하게 담겨 있었습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "셰익스피어에게서 배울 수 있는 점은?", options: ["처음부터 잘해야 한다","작은 일도 성실히 하며 꿈을 향해 나아가기","허드렛일은 피해야 한다","빨리 유명해져야 한다"], answer: 1, explanation: "작은 일도 성실하게 해내며 극장의 모든 것을 배워 나갔습니다." }] }
  },
  "04": {
    // 모차르트
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "모차르트가 태어난 나라는?", options: ["독일","이탈리아","오스트리아","프랑스"], answer: 2, explanation: "모차르트는 오스트리아에서 태어났습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "모차르트의 어린 시절 활동으로 알맞은 것은?", options: ["학교에서만 공부","유럽 궁정 순회 공연","농사일","군인 생활"], answer: 1, explanation: "어린 시절 유럽 각국의 궁정을 돌며 공연했습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'신동'의 뜻으로 알맞은 것은?", options: ["새로운 동물","나이가 어린데도 뛰어난 재능을 가진 사람","느린 사람","평범한 어린이"], answer: 1, explanation: "신동은 나이가 어린데도 뛰어난 재능을 가진 사람입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "모차르트가 어린 나이에 작곡할 수 있었던 이유는?", options: ["운이 좋아서","타고난 재능과 아버지의 교육","돈이 많아서","친구가 도와줘서"], answer: 1, explanation: "타고난 재능과 음악가인 아버지의 교육 덕분입니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "모차르트의 삶에서 배울 수 있는 점은?", options: ["재능만 있으면 된다","재능을 키우기 위한 노력의 중요성","공연은 필요 없다","혼자서만 연습해야 한다"], answer: 1, explanation: "타고난 재능을 노력으로 키워 위대한 음악가가 되었습니다." }] }
  },
  "05": {
    // 아인슈타인
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "아인슈타인이 발견한 유명한 공식은?", options: ["피타고라스 정리","E=mc²","만유인력 법칙","뉴턴의 운동법칙"], answer: 1, explanation: "아인슈타인은 E=mc² 공식을 발견했습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "아인슈타인의 어린 시절 특징은?", options: ["모든 과목을 잘함","산만하고 학교 성적이 좋지 않았음","운동을 잘함","말을 일찍 함"], answer: 1, explanation: "어린 시절 산만하고 학교 성적이 좋지 않았습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'혁명적'의 뜻으로 알맞은 것은?", options: ["평범한","완전히 새롭게 바꾸는","조금 다른","옛날 방식의"], answer: 1, explanation: "혁명적은 기존의 것을 완전히 새롭게 바꾸는 것입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "아인슈타인이 위대한 발견을 할 수 있었던 이유는?", options: ["학교 성적이 좋아서","상상력과 끊임없는 질문 덕분에","돈이 많아서","운이 좋아서"], answer: 1, explanation: "상상력을 발휘하고 끊임없이 질문했기 때문입니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "아인슈타인에게서 배울 수 있는 점은?", options: ["학교 성적이 가장 중요하다","상상력과 호기심의 중요성","질문하지 않아야 한다","남들과 같이 생각해야 한다"], answer: 1, explanation: "상상력과 호기심으로 세상을 바꾸는 발견을 했습니다." }] }
  },
  "06": {
    // 마리 퀴리
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "마리 퀴리가 발견한 원소는?", options: ["산소, 수소","폴로늄, 라듐","철, 금","탄소, 질소"], answer: 1, explanation: "마리 퀴리는 폴로늄과 라듐을 발견했습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "마리 퀴리의 업적 순서로 알맞은 것은?", options: ["노벨상-발견-연구","연구-발견-노벨상","노벨상-연구-발견","발견-연구-노벨상"], answer: 1, explanation: "방사능을 연구하고 원소를 발견한 후 노벨상을 받았습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'방사능'의 뜻으로 알맞은 것은?", options: ["빛을 내는 것","어떤 물질에서 나오는 보이지 않는 에너지","소리를 내는 것","열을 내는 것"], answer: 1, explanation: "방사능은 어떤 물질에서 나오는 보이지 않는 에너지입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "마리 퀴리가 폴로늄이라는 이름을 붙인 이유는?", options: ["예쁜 이름이어서","조국 폴란드를 기리기 위해","남편 이름에서","우연히"], answer: 1, explanation: "나라 잃은 슬픔 속에서도 조국 폴란드를 잊지 않는 마음이 담겨 있습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "마리 퀴리의 삶이 보여주는 것은?", options: ["과학은 남자만 할 수 있다","여성도 무엇이든 할 수 있다","쉬운 길만 가야 한다","포기하면 편하다"], answer: 1, explanation: "여성도 무엇이든 할 수 있다는 것을 보여준 위대한 도전의 역사입니다." }] }
  },
  "07": {
    // 간디
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "간디가 이끈 유명한 행진의 이름은?", options: ["자유 행진","소금 행진","평화 행진","독립 행진"], answer: 1, explanation: "간디는 소금에 세금을 부과하는 법에 항의해 '소금 행진'을 벌였습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "간디의 활동 순서로 알맞은 것은?", options: ["인도 독립-소금 행진-남아공","남아공 차별 경험-인도 귀국-독립운동","독립운동-남아공-소금 행진","소금 행진-남아공-독립운동"], answer: 1, explanation: "남아공에서 차별을 겪고 인도로 돌아와 독립운동을 이끌었습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'비폭력'의 뜻으로 알맞은 것은?", options: ["폭력을 사용하는 것","폭력을 사용하지 않는 것","강하게 싸우는 것","무기를 사용하는 것"], answer: 1, explanation: "비폭력은 폭력을 사용하지 않는 것입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "간디가 비폭력 저항을 선택한 이유는?", options: ["싸움을 못해서","폭력 대신 평화로운 방법으로 세상을 바꾸려 해서","돈이 없어서","명령을 받아서"], answer: 1, explanation: "눈에는 눈으로 대응하면 온 세상이 눈멀게 된다며 평화로운 방법을 택했습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "간디에게서 배울 수 있는 점은?", options: ["폭력이 가장 좋은 방법이다","평화로운 방법으로도 위대한 변화를 만들 수 있다","혼자서 모든 것을 해야 한다","포기하면 편하다"], answer: 1, explanation: "총이나 칼 없이도 위대한 변화를 만들 수 있다는 것을 보여주었습니다." }] }
  },
  "08": {
    // 라이트 형제
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "라이트 형제가 최초로 비행에 성공한 연도는?", options: ["1893년","1903년","1913년","1923년"], answer: 1, explanation: "1903년 12월 17일 인류 최초의 동력 비행에 성공했습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "라이트 형제의 비행기 이름은?", options: ["보잉 호","플라이어 호","점보 호","독수리 호"], answer: 1, explanation: "라이트 형제가 만든 비행기의 이름은 플라이어 호입니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'풍동'의 뜻으로 알맞은 것은?", options: ["바람이 부는 동굴","바람을 일으켜 실험하는 장치","바람막이","바람개비"], answer: 1, explanation: "풍동은 바람을 일으켜 비행 실험을 하는 장치입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "라이트 형제가 성공할 수 있었던 이유는?", options: ["운이 좋아서","수많은 실패에도 포기하지 않았기 때문에","돈이 많아서","남이 시켜서"], answer: 1, explanation: "끈질긴 노력과 수많은 실패에서 배우며 포기하지 않았습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "라이트 형제의 이야기가 주는 교훈은?", options: ["실패하면 포기해야 한다","불가능해 보이는 꿈도 포기하지 않으면 이룰 수 있다","혼자서 해야 성공한다","빨리 성공해야 한다"], answer: 1, explanation: "불가능해 보이는 꿈도 포기하지 않으면 이룰 수 있다는 교훈을 줍니다." }] }
  },
  "09": {
    // 헬렌 켈러
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "헬렌 켈러가 처음 깨달은 단어는?", options: ["엄마","물(WATER)","선생님","사랑"], answer: 1, explanation: "펌프에서 물이 쏟아질 때 '물(WATER)'이라는 단어를 깨달았습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "헬렌 켈러의 성장 과정 순서는?", options: ["대학 졸업-선생님 만남-단어 깨달음","병으로 시청각 상실-선생님 만남-단어 깨달음-대학 졸업","선생님 만남-병-대학 졸업","대학 졸업-병-선생님 만남"], answer: 1, explanation: "병으로 시청각을 잃고 선생님을 만나 깨달음을 얻어 대학까지 졸업했습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'점자'의 뜻으로 알맞은 것은?", options: ["작은 점","시각장애인이 손으로 읽는 글자","큰 글씨","그림 문자"], answer: 1, explanation: "점자는 시각장애인이 손끝으로 읽을 수 있도록 만든 글자입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "헬렌 켈러가 대학을 졸업할 수 있었던 이유는?", options: ["장애가 없어서","엄청난 노력과 배움에 대한 열정 덕분에","운이 좋아서","쉬웠기 때문에"], answer: 1, explanation: "엄청난 노력 끝에 우등으로 졸업한 최초의 시청각 장애인이 되었습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "헬렌 켈러의 삶이 주는 교훈은?", options: ["장애가 있으면 아무것도 못한다","어떤 어려움도 극복할 수 있다","혼자서는 안 된다","포기하면 편하다"], answer: 1, explanation: "어둠 속에서도 희망을 잃지 않으면 빛을 찾을 수 있다는 것을 보여줍니다." }] }
  },
  "10": {
    // 반 고흐
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "반 고흐의 대표작으로 알맞은 것은?", options: ["모나리자","해바라기, 별이 빛나는 밤","천지창조","게르니카"], answer: 1, explanation: "해바라기 연작과 별이 빛나는 밤이 반 고흐의 대표작입니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "반 고흐의 삶에 대한 설명으로 알맞은 것은?", options: ["살아서 많은 인정을 받음","살아 있는 동안 인정받지 못함","부자로 살았음","오래 살았음"], answer: 1, explanation: "살아 있는 동안 인정받지 못한 불운한 예술가였습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'천직'의 뜻으로 알맞은 것은?", options: ["하늘의 직업","자신에게 딱 맞는 직업","어려운 직업","쉬운 직업"], answer: 1, explanation: "천직은 하늘이 정해 준 것처럼 자신에게 딱 맞는 직업입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "반 고흐가 그림에 매달린 이유는?", options: ["돈을 벌기 위해","그림 그리는 것이 숨 쉬는 것만큼 자연스러워서","명예를 위해","시켜서"], answer: 1, explanation: "그림 그리는 일이 숨 쉬는 것만큼 자연스럽다고 말했습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "반 고흐의 삶이 주는 교훈은?", options: ["살아서 인정받아야 한다","열정을 가지고 끝까지 하면 가치를 인정받는다","그림은 돈이 안 된다","포기하는 것이 좋다"], answer: 1, explanation: "진정한 열정은 언젠가 세상에 인정받는다는 것을 보여줍니다." }] }
  },
  "11": {
    // 나이팅게일
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "나이팅게일이 활동한 전쟁은?", options: ["제1차 세계대전","크림 전쟁","제2차 세계대전","한국 전쟁"], answer: 1, explanation: "나이팅게일은 크림 전쟁에서 간호 활동을 했습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "나이팅게일의 업적 순서로 알맞은 것은?", options: ["간호학교 설립-전쟁 참여-위생 개선","전쟁 참여-위생 개선-사망률 감소-간호학교 설립","간호학교 설립-위생 개선-전쟁","사망률 감소-간호학교 설립-전쟁"], answer: 1, explanation: "전쟁에서 위생을 개선하여 사망률을 낮추고 후에 간호학교를 설립했습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'헌신'의 뜻으로 알맞은 것은?", options: ["포기하는 것","자신을 바쳐 힘쓰는 것","쉬는 것","피하는 것"], answer: 1, explanation: "헌신은 자신을 바쳐 힘쓰는 것입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "나이팅게일이 사망률을 낮춘 방법은?", options: ["약을 많이 줘서","위생을 철저히 해서","수술을 많이 해서","환자를 내보내서"], answer: 1, explanation: "위생을 철저히 하여 사망률을 42%에서 2%로 낮췄습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "나이팅게일에게서 배울 수 있는 점은?", options: ["편한 삶이 최고다","헌신과 과학적 접근의 중요성","간호는 쉬운 일이다","통계는 필요 없다"], answer: 1, explanation: "헌신적인 노력과 통계를 활용한 과학적 접근이 중요합니다." }] }
  },
  "12": {
    // 넬슨 만델라
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "넬슨 만델라가 감옥에서 보낸 기간은?", options: ["7년","17년","27년","37년"], answer: 2, explanation: "만델라는 27년이라는 긴 세월을 감옥에서 보냈습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "만델라의 삶 순서로 알맞은 것은?", options: ["대통령-감옥-인권운동","인권운동-감옥-석방-대통령","감옥-인권운동-대통령","대통령-인권운동-감옥"], answer: 1, explanation: "인권운동 후 감옥에 갇혔다가 석방되어 대통령이 되었습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'아파르트헤이트'의 뜻으로 알맞은 것은?", options: ["평등 정책","남아공의 인종 차별 정책","교육 정책","경제 정책"], answer: 1, explanation: "아파르트헤이트는 남아공의 인종 차별 정책입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "만델라가 자신을 가둔 사람들을 용서한 이유는?", options: ["약해서","복수가 아닌 화해가 나라를 치유할 수 있다고 믿어서","잊어버려서","명령을 받아서"], answer: 1, explanation: "복수가 아닌 화해가 나라를 치유할 수 있다고 믿었습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "만델라의 삶이 보여주는 것은?", options: ["복수가 정답이다","인내와 용서의 힘","포기해야 한다","혼자서 해야 한다"], answer: 1, explanation: "인내와 용서의 힘으로 더 나은 세상을 만들 수 있음을 보여줍니다." }] }
  },
  "13": {
    // 스티브 잡스
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "스티브 잡스가 만든 혁신적인 제품은?", options: ["윈도우","아이폰","갤럭시","안드로이드"], answer: 1, explanation: "잡스는 아이폰을 만들어 전화기의 개념을 바꾸었습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "잡스의 삶 순서로 알맞은 것은?", options: ["애플 창업-해고-복귀-아이폰","아이폰-애플 창업-해고-복귀","해고-애플 창업-아이폰-복귀","복귀-해고-애플 창업-아이폰"], answer: 0, explanation: "애플을 창업하고 해고된 후 복귀하여 아이폰을 만들었습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'혁신'의 뜻으로 알맞은 것은?", options: ["조금 바꾸는 것","완전히 새롭게 바꾸는 것","그대로 두는 것","되돌리는 것"], answer: 1, explanation: "혁신은 완전히 새롭게 바꾸는 것입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "잡스가 해고 후에도 성공할 수 있었던 이유는?", options: ["운이 좋아서","포기하지 않고 새로운 도전을 했기 때문에","돈이 많아서","남이 도와줘서"], answer: 1, explanation: "포기하지 않고 픽사 등 새로운 회사를 만들어 도전했습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "잡스의 'Think Different'가 주는 교훈은?", options: ["남들과 똑같이 해야 한다","다르게 생각하고 도전하는 것의 가치","쉬운 길만 가야 한다","포기하면 편하다"], answer: 1, explanation: "다르게 생각하고 끊임없이 도전하는 것의 가치를 보여줍니다." }] }
  },
  "14": {
    // 마더 테레사
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "마더 테레사가 설립한 단체의 이름은?", options: ["적십자","사랑의 선교회","유니세프","평화봉사단"], answer: 1, explanation: "마더 테레사는 '사랑의 선교회'를 설립했습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "마더 테레사의 활동 순서로 알맞은 것은?", options: ["노벨상-수녀-봉사활동","수녀-학교 교사-빈민가 봉사-노벨상","빈민가 봉사-수녀-노벨상-학교 교사","학교 교사-노벨상-수녀-빈민가 봉사"], answer: 1, explanation: "수녀가 되어 학교에서 가르치다 빈민가로 가서 봉사하고 노벨상을 받았습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'봉사'의 뜻으로 알맞은 것은?", options: ["돈을 받고 일함","대가 없이 남을 위해 일함","자기만 생각함","쉬는 것"], answer: 1, explanation: "봉사는 대가 없이 남을 위해 일하는 것입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "마더 테레사가 노벨상 연회 대신 기부를 요청한 이유는?", options: ["연회가 싫어서","가난한 이들을 더 돕기 위해","바빠서","명령을 받아서"], answer: 1, explanation: "화려한 연회 대신 가난한 이들을 위해 기부해 달라고 요청했습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "마더 테레사의 삶이 보여주는 것은?", options: ["큰일만 해야 한다","큰 사랑으로 작은 일을 하는 것의 가치","자신만 생각해야 한다","명예가 중요하다"], answer: 1, explanation: "큰 사랑으로 작은 일을 하는 것이 진정한 봉사임을 보여줍니다." }] }
  },
  "15": {
    // 피카소
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "피카소가 창시한 미술 사조는?", options: ["인상파","입체파","추상화","사실주의"], answer: 1, explanation: "피카소는 입체파를 창시했습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "피카소의 대표작으로 언급된 것은?", options: ["모나리자","게르니카","해바라기","별이 빛나는 밤"], answer: 1, explanation: "전쟁의 참혹함을 표현한 게르니카가 대표작으로 언급됩니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'입체파'의 특징으로 알맞은 것은?", options: ["한 방향에서만 그림","여러 각도를 한 화면에 담음","색을 사용하지 않음","사진처럼 그림"], answer: 1, explanation: "입체파는 여러 각도에서 본 모습을 한 화면에 담는 것입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "피카소가 게르니카를 그린 이유는?", options: ["돈을 벌기 위해","전쟁의 참혹함과 평화의 메시지를 전하기 위해","연습하려고","시켜서"], answer: 1, explanation: "스페인 내전 중 폭격의 참혹함과 평화의 메시지를 담았습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "피카소의 삶이 주는 교훈은?", options: ["익숙한 것만 해야 한다","계속 새로운 것에 도전하고 창조하기","전통을 따라야 한다","한 가지만 잘하면 된다"], answer: 1, explanation: "익숙한 것에 안주하지 않고 계속 창조하는 것의 가치를 보여줍니다." }] }
  },
  "16": {
    // 월트 디즈니
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "월트 디즈니가 만든 유명한 캐릭터는?", options: ["스누피","미키 마우스","톰과 제리","피카츄"], answer: 1, explanation: "월트 디즈니가 만든 캐릭터는 미키 마우스입니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "디즈니의 업적 순서로 알맞은 것은?", options: ["디즈니랜드-미키 마우스-백설 공주","미키 마우스-백설 공주-디즈니랜드","백설 공주-미키 마우스-디즈니랜드","디즈니랜드-백설 공주-미키 마우스"], answer: 1, explanation: "미키 마우스를 만들고 백설 공주를 제작한 후 디즈니랜드를 열었습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'테마파크'의 뜻으로 알맞은 것은?", options: ["일반 공원","특정 주제로 꾸민 놀이공원","동물원","식물원"], answer: 1, explanation: "테마파크는 특정 주제로 꾸민 놀이공원입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "디즈니가 '디즈니의 망상'이라는 비웃음에도 성공한 이유는?", options: ["운이 좋아서","꿈을 포기하지 않고 도전했기 때문에","돈이 많아서","쉬운 일이어서"], answer: 1, explanation: "모두가 불가능하다고 했지만 포기하지 않고 도전했습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "디즈니의 '꿈꿀 수 있다면 이룰 수 있다'가 주는 교훈은?", options: ["꿈은 꾸지 말아야 한다","실패를 두려워하지 않고 꿈을 향해 도전하기","현실만 보아야 한다","포기하면 편하다"], answer: 1, explanation: "실패를 두려워하지 않고 꿈을 향해 끊임없이 도전해야 합니다." }] }
  },
  "17": {
    // 루이 파스퇴르
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "파스퇴르가 개발한 것은?", options: ["비행기","백신","전화기","컴퓨터"], answer: 1, explanation: "파스퇴르는 탄저병과 광견병 백신을 개발했습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "파스퇴르의 업적 순서로 알맞은 것은?", options: ["백신 개발-미생물 발견-살균법","미생물 발견-살균법 개발-백신 개발","살균법-백신 개발-미생물 발견","백신 개발-살균법-미생물 발견"], answer: 1, explanation: "미생물을 발견하고 살균법을 개발한 후 백신을 만들었습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'살균'의 뜻으로 알맞은 것은?", options: ["세균을 키우는 것","세균을 죽이는 것","세균을 보는 것","세균을 옮기는 것"], answer: 1, explanation: "살균은 세균을 죽이는 것입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "파스퇴르의 발견이 의학에 미친 영향은?", options: ["아무 영향 없음","손 씻기와 소독의 중요성을 알림","병을 더 많이 만듦","의사가 필요 없어짐"], answer: 1, explanation: "세균이 병을 일으킨다는 것을 증명해 위생의 중요성을 알렸습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "파스퇴르에게서 배울 수 있는 점은?", options: ["과학은 어렵다","끈기 있는 관찰과 실험의 중요성","실험은 필요 없다","남의 연구만 따라하면 된다"], answer: 1, explanation: "끈기 있는 관찰과 실험이 인류의 건강을 바꿀 수 있음을 보여줍니다." }] }
  },
  "18": {
    // 앤 설리번
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "앤 설리번이 가르친 유명한 학생은?", options: ["마리 퀴리","헬렌 켈러","나이팅게일","마더 테레사"], answer: 1, explanation: "앤 설리번은 헬렌 켈러의 가정교사였습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "앤 설리번의 삶 순서로 알맞은 것은?", options: ["헬렌 교육-맹학교-구빈원","구빈원-맹학교 졸업-헬렌 교육","맹학교-구빈원-헬렌 교육","헬렌 교육-구빈원-맹학교"], answer: 1, explanation: "구빈원에서 힘든 시간 후 맹학교를 졸업하고 헬렌을 가르쳤습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'기적'의 뜻으로 알맞은 것은?", options: ["평범한 일","불가능해 보이는 일이 일어남","실패하는 것","쉬운 일"], answer: 1, explanation: "기적은 불가능해 보이는 일이 일어나는 것입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "앤 설리번이 헬렌을 가르칠 수 있었던 이유는?", options: ["쉬운 일이어서","자신도 시각 장애를 겪어 이해할 수 있었기 때문에","돈을 많이 받아서","명령을 받아서"], answer: 1, explanation: "자신도 눈이 거의 안 보였던 경험으로 헬렌을 이해하고 가르칠 수 있었습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "앤 설리번의 삶이 보여주는 것은?", options: ["포기해야 한다","끈기와 사랑이 기적을 만든다","혼자서 해야 한다","쉬운 길만 가야 한다"], answer: 1, explanation: "끈기와 사랑이 기적을 만들 수 있다는 것을 보여줍니다." }] }
  },
  "19": {
    // 찰리 채플린
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "찰리 채플린이 만든 유명한 캐릭터는?", options: ["슈퍼맨","떠돌이","배트맨","스파이더맨"], answer: 1, explanation: "채플린은 꽁무니 콧수염, 헐렁한 바지의 '떠돌이' 캐릭터를 만들었습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "채플린의 대표작으로 언급된 것은?", options: ["타이타닉","모던 타임스, 위대한 독재자","스타워즈","해리 포터"], answer: 1, explanation: "모던 타임스, 위대한 독재자 등이 대표작입니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'풍자'의 뜻으로 알맞은 것은?", options: ["칭찬하기","비웃으며 비판하기","설명하기","따라하기"], answer: 1, explanation: "풍자는 사회 문제를 빗대어 비판하는 것입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "채플린의 영화가 특별한 이유는?", options: ["그냥 웃기기만 함","웃음 속에 사회 비판과 희망이 담겨 있음","슬프기만 함","지루함"], answer: 1, explanation: "단순히 웃기는 것이 아니라 사회 문제를 비판하고 희망을 주었습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "채플린의 삶이 보여주는 것은?", options: ["힘든 환경에서는 아무것도 못한다","힘든 환경에서도 예술로 세상을 따뜻하게 할 수 있다","웃음은 가치 없다","혼자서만 해야 한다"], answer: 1, explanation: "힘든 환경에서도 예술로 세상을 따뜻하게 할 수 있음을 보여줍니다." }] }
  },
  "20": {
    // 제인 구달
    literal: { title: "보완학습 | 핵심 이해력", problems: [{ q: "제인 구달이 연구한 동물은?", options: ["고릴라","침팬지","사자","코끼리"], answer: 1, explanation: "제인 구달은 탄자니아에서 침팬지를 연구했습니다." }] },
    structural: { title: "보완학습 | 구조 파악력", problems: [{ q: "제인 구달의 활동 순서로 알맞은 것은?", options: ["침팬지 연구-아프리카 도착-발견","아프리카 도착-침팬지 연구 시작-도구 사용 발견","발견-아프리카 도착-연구","연구-발견-아프리카 도착"], answer: 1, explanation: "아프리카에 가서 침팬지 연구를 시작하고 도구 사용을 발견했습니다." }] },
    lexical: { title: "보완학습 | 어휘 맥락력", problems: [{ q: "'파격적'의 뜻으로 알맞은 것은?", options: ["전통적인","기존의 틀을 깨는 새로운 방식","평범한","옛날 방식"], answer: 1, explanation: "파격적은 기존의 틀을 깨는 새로운 방식입니다." }] },
    inferential: { title: "보완학습 | 추론·통합력", problems: [{ q: "제인 구달의 발견이 놀라웠던 이유는?", options: ["침팬지가 예뻐서","도구 사용은 인간만의 특징이라고 여겨졌기 때문에","침팬지가 말해서","별로 놀랍지 않았음"], answer: 1, explanation: "당시 도구 사용은 인간만의 특징이라고 여겨졌기에 큰 발견이었습니다." }] },
    critical: { title: "보완학습 | 비판·적용력", problems: [{ q: "제인 구달에게서 배울 수 있는 점은?", options: ["동물은 연구할 필요 없다","끈기 있는 관찰과 동물에 대한 존중","동물에게 번호만 붙여야 한다","멀리서만 봐야 한다"], answer: 1, explanation: "끈기 있게 관찰하고 동물 각각의 개성을 존중했습니다." }] }
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
  const filePath = path.join(DIR, `on_people2_${no}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ 파일 없음: on_people2_${no}.html`);
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
    console.log(`⚠️ renderFeedback 함수를 찾을 수 없음: on_people2_${no}.html`);
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
    console.log(`⚠️ 보완학습 데이터 없음: on_people2_${no}.html`);
    continue;
  }

  // 삽입
  html = html.slice(0, funcEnd) + '\n\n    ' + newRemedialCode + '\n\n' + html.slice(funcEnd);

  // 보완학습 버튼 수정 (display:none 제거)
  html = html.replace(
    /<button class="report-btn-remedial" onclick="openRemedial && openRemedial\(\)" style="display:none;">/g,
    '<button class="report-btn-remedial" onclick="openRemedial()">'
  );
  html = html.replace(
    /<button class="report-btn-remedial" onclick="openRemedial && openRemedial\(\)">/g,
    '<button class="report-btn-remedial" onclick="openRemedial()">'
  );

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✅ 수정 완료: on_people2_${no}.html`);
}

console.log('\n🎉 온세계인물 01~20 보완학습 구현 완료!');
console.log('- on_world1_01.html과 동일한 구조로 구현됨');
console.log('- 보완학습 버튼 활성화됨');
console.log('- 각 단원별 고유 문제 적용:');
console.log('  01: 레오나르도 다빈치, 02: 미켈란젤로, 03: 셰익스피어, 04: 모차르트, 05: 아인슈타인');
console.log('  06: 마리 퀴리, 07: 간디, 08: 라이트 형제, 09: 헬렌 켈러, 10: 반 고흐');
console.log('  11: 나이팅게일, 12: 넬슨 만델라, 13: 스티브 잡스, 14: 마더 테레사, 15: 피카소');
console.log('  16: 월트 디즈니, 17: 루이 파스퇴르, 18: 앤 설리번, 19: 찰리 채플린, 20: 제인 구달');

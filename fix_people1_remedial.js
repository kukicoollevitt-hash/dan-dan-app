const fs = require('fs');
const path = require('path');

// 온한국인물(1) 01~20 보완학습 데이터 (본문 기반, 5개 지수, 각 1문제, 번호+해설)
const REMEDIAL_DATA = {
  '01': {
    // 김유신 - 다짐으로 다시 태어난 김유신
    literal: { q: "김유신이 열다섯 살에 가입한 신라의 청소년 수련 단체는?", options: ["삼랑","화랑","소년단","기마대"], answer: 1, explanation: "김유신은 열다섯 살에 화랑이 되어 큰 기대를 받았습니다." },
    structural: { q: "김유신이 반성하고 결심을 굳히게 된 직접적인 계기는?", options: ["어머니의 꾸중","전투의 승리","말이 여인의 집 앞으로 간 것","왕의 명령"], answer: 2, explanation: "말이 습관대로 여인의 집으로 가자 김유신은 자신의 마음이 바로서지 않았음을 깨달았습니다." },
    lexical: { q: "'꾸짖다'의 뜻으로 알맞은 것은?", options: ["칭찬하다","격려하다","잘못을 엄하게 나무라다","조용히 타이르다"], answer: 2, explanation: "'꾸짖다'는 잘못을 이야기하며 엄하게 나무라는 것입니다." },
    inferential: { q: "김유신의 말이 여인의 집을 찾아간 이유로 추론할 수 있는 것은?", options: ["말이 똑똒해서","주인의 습관을 기억했기 때문에","길을 잃어서","여인이 말을 불렀기 때문에"], answer: 1, explanation: "본문에서 '말까지 이 길을 기억하는구나'라고 한 것에서 추론할 수 있습니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈으로 가장 알맞은 것은?", options: ["결심만 하면 된다","한순간의 결심보다 꾸준한 노력이 중요하다","다른 사람의 말은 무시해도 된다","재능이 가장 중요하다"], answer: 1, explanation: "김유신은 결심을 행동으로 옮기고 꾸준히 노력하여 성장했습니다." }
  },
  '02': {
    // 문무왕 - 아버지의 뜻을 잇는 왕
    literal: { q: "문무왕의 아버지는 누구인가?", options: ["김유신","무열왕(김춘추)","선덕여왕","진흥왕"], answer: 1, explanation: "문무왕은 무열왕(김춘추)의 아들로, 아버지의 뜻을 이어 삼국 통일을 이루었습니다." },
    structural: { q: "고구려 멸망 후 신라가 새로운 전쟁을 준비한 이유는?", options: ["백제가 다시 일어나서","당나라가 땅을 차지하려 했기 때문에","일본이 침략해서","고구려 유민이 반란을 일으켜서"], answer: 1, explanation: "당나라가 고구려와 백제의 땅을 직접 다스리려는 속셈을 드러냈기 때문입니다." },
    lexical: { q: "'함락'의 뜻으로 알맞은 것은?", options: ["성을 새로 짓다","성이 적에게 무너져 넘어가다","성을 지키다","성을 수리하다"], answer: 1, explanation: "'함락'은 적에게 성이나 지역이 무너져 넘어가는 것입니다." },
    inferential: { q: "문무왕이 동해에 묻히길 원한 이유로 추론할 수 있는 것은?", options: ["바다를 좋아해서","죽어서도 나라를 지키고 싶어서","고향이 바닷가여서","신하들이 권해서"], answer: 1, explanation: "문무왕은 죽어서도 나라를 지키겠다는 유언을 남겼습니다." },
    critical: { q: "문무왕의 이야기에서 배울 수 있는 점은?", options: ["혼자 모든 것을 해결해야 한다","부모의 뜻을 이어받아 끝까지 노력하는 자세","전쟁이 가장 좋은 해결책이다","포기도 용기이다"], answer: 1, explanation: "문무왕은 아버지의 뜻을 이어 어려움을 극복하고 삼국 통일을 이루었습니다." }
  },
  '03': {
    // 원효 - 해골 물에서 얻은 깨달음
    literal: { q: "원효가 당나라 유학길에 함께한 승려는?", options: ["혜초","의상","지눌","일연"], answer: 1, explanation: "원효는 의상 스님과 함께 당나라로 유학을 떠나려 했습니다." },
    structural: { q: "원효가 당나라 유학을 포기한 이유는?", options: ["병이 나서","깨달음을 얻었기 때문에","돈이 없어서","전쟁이 나서"], answer: 1, explanation: "해골 물 사건으로 모든 것은 마음에 달렸다는 깨달음을 얻어 유학을 포기했습니다." },
    lexical: { q: "'칠흑'의 뜻으로 알맞은 것은?", options: ["칠처럼 아주 새까만 어둠","붉은 빛","칠을 바른 상태","낮처럼 밝은 것"], answer: 0, explanation: "'칠흑'은 칠처럼 아주 새까맣게 어두운 것을 뜻합니다." },
    inferential: { q: "원효의 깨달음에서 추론할 수 있는 내용은?", options: ["물의 맛은 항상 같다","모든 것은 마음먹기에 달려 있다","밤에 물을 마시면 안 된다","동굴에서 자면 안 된다"], answer: 1, explanation: "같은 물이 마음에 따라 다르게 느껴지듯 기쁨과 괴로움도 마음에 달려 있습니다." },
    critical: { q: "원효의 깨달음을 일상에 적용할 때 알맞은 것은?", options: ["힘든 일도 긍정적으로 생각하면 극복할 수 있다","모든 것을 부정적으로 봐야 한다","마음은 바꿀 수 없다","환경이 전부다"], answer: 0, explanation: "원효의 깨달음은 마음가짐에 따라 같은 상황도 다르게 느껴진다는 것입니다." }
  },
  '04': {
    // 혜초 - 우물 안 개구리를 벗어난 혜초의 모험
    literal: { q: "혜초가 쓴 해외 여행기의 이름은?", options: ["삼국유사","왕오천축국전","해동고승전","동국통감"], answer: 1, explanation: "혜초는 여행 경험을 정리하여 《왕오천축국전》을 썼습니다." },
    structural: { q: "혜초가 인도로 떠나게 된 계기는?", options: ["왕의 명령","고승에게 배우며 부처의 땅을 알고 싶어져서","부모님의 권유","장사를 위해"], answer: 1, explanation: "당나라에서 인도 고승에게 배우며 부처가 태어난 땅을 알고 싶어졌습니다." },
    lexical: { q: "'상단'의 뜻으로 알맞은 것은?", options: ["군사들의 무리","승려들의 모임","상인들의 무리","학자들의 모임"], answer: 2, explanation: "'상단'은 먼 지역을 다니며 물건을 사고파는 상인들의 무리입니다." },
    inferential: { q: "혜초가 자신을 '우물 안 개구리'라고 한 이유는?", options: ["개구리를 좋아해서","넓은 세상을 모르고 살았다는 것을 깨달아서","우물에서 살았어서","개구리처럼 뛰어서"], answer: 1, explanation: "여행을 통해 넓은 세상을 보고 자신의 시야가 좁았음을 깨달았습니다." },
    critical: { q: "혜초의 이야기에서 배울 수 있는 점은?", options: ["집에만 있어야 한다","새로운 세상을 경험하면 시야가 넓어진다","여행은 위험하다","기록은 필요 없다"], answer: 1, explanation: "혜초는 험난한 여행을 통해 시야를 넓히고 귀중한 기록을 남겼습니다." }
  },
  '05': {
    // 장영실 - 노비 출신 천재 과학자
    literal: { q: "장영실을 궁궐로 불러들인 왕은?", options: ["태종","세종대왕","정조","영조"], answer: 1, explanation: "세종대왕은 신하들의 반대에도 불구하고 장영실을 궁궐로 불러들였습니다." },
    structural: { q: "장영실이 성공할 수 있었던 가장 큰 요인은?", options: ["양반 출신이어서","세종대왕의 후원과 본인의 재능","외국 기술을 배워서","부모님의 재산"], answer: 1, explanation: "세종대왕의 전폭적인 후원과 장영실 본인의 뛰어난 재능이 결합되었습니다." },
    lexical: { q: "'자격루'의 설명으로 알맞은 것은?", options: ["해의 그림자로 시간을 재는 기구","물의 힘으로 저절로 시간을 알려주는 물시계","비의 양을 재는 기구","별을 관측하는 기구"], answer: 1, explanation: "'자격루'는 물의 힘으로 저절로 시간을 알려주는 물시계입니다." },
    inferential: { q: "세종대왕이 장영실을 등용한 것에서 알 수 있는 점은?", options: ["신분보다 능력을 중시했다","노비만 등용했다","외국인만 등용했다","신분을 가장 중시했다"], answer: 0, explanation: "세종대왕은 '사람의 가치는 신분이 아니라 능력으로 판단해야 한다'고 했습니다." },
    critical: { q: "장영실의 이야기에서 배울 수 있는 점은?", options: ["신분이 전부다","재능과 노력으로 한계를 극복할 수 있다","포기가 답이다","혼자서는 안 된다"], answer: 1, explanation: "장영실은 낮은 신분에도 재능과 노력으로 위대한 업적을 남겼습니다." }
  },
  '06': {
    // 이순신 - 바다를 지킨 영웅
    literal: { q: "이순신이 한산대첩에서 사용한 진법은?", options: ["어린진","학익진","장사진","원진"], answer: 1, explanation: "이순신은 학의 날개처럼 진을 펼치는 학익진으로 왜군을 무찔렀습니다." },
    structural: { q: "이순신이 백의종군하게 된 이유는?", options: ["스스로 원해서","조정의 모함 때문에","부상을 당해서","은퇴해서"], answer: 1, explanation: "조정의 모함으로 파직되어 백의종군하는 고통을 겪었습니다." },
    lexical: { q: "'백의종군'의 뜻으로 알맞은 것은?", options: ["흰 옷을 입고 싸우다","벼슬 없이 일반 병사로 따라가다","백 명을 이끌다","뒤에서 지휘하다"], answer: 1, explanation: "'백의종군'은 벼슬 없이 일반 병사로 군대를 따라가는 것입니다." },
    inferential: { q: "이순신이 죽음을 알리지 말라고 한 이유는?", options: ["부끄러워서","병사들의 사기가 떨어질까 봐","비밀 작전이어서","적을 속이려고"], answer: 1, explanation: "전투 중 자신의 죽음이 알려지면 병사들의 사기가 떨어질 것을 걱정했습니다." },
    critical: { q: "이순신의 리더십에서 배울 수 있는 점은?", options: ["자기만 생각한다","어려움 속에서도 포기하지 않고 책임을 다한다","명령만 내린다","혼자 모든 것을 한다"], answer: 1, explanation: "파직과 시련 속에서도 나라를 위해 끝까지 싸운 이순신의 모습을 배울 수 있습니다." }
  },
  '07': {
    // 세종대왕 - 백성을 사랑한 임금
    literal: { q: "세종대왕이 훈민정음을 반포한 연도는?", options: ["1443년","1446년","1450년","1392년"], answer: 1, explanation: "세종대왕은 1446년에 훈민정음을 세상에 반포했습니다." },
    structural: { q: "세종대왕이 한글을 만든 가장 큰 이유는?", options: ["중국과 다르게 하려고","백성들이 쉽게 글을 읽고 쓸 수 있게 하려고","학자들만 쓰게 하려고","외국에 자랑하려고"], answer: 1, explanation: "글을 모르는 백성들이 억울한 일을 당해도 호소할 방법이 없어 안타까워했습니다." },
    lexical: { q: "'반포'의 뜻으로 알맞은 것은?", options: ["숨기다","널리 세상에 알리다","불태우다","고치다"], answer: 1, explanation: "'반포'는 널리 세상에 알리는 것입니다." },
    inferential: { q: "일부 신하들이 훈민정음 창제를 반대한 이유로 추론할 수 있는 것은?", options: ["백성을 사랑해서","중국의 눈치를 보거나 기존 질서를 지키려 해서","글자가 너무 예뻐서","만들기 쉬워서"], answer: 1, explanation: "당시 한자를 쓰던 기존 질서와 중국과의 관계를 걱정했을 것으로 추론됩니다." },
    critical: { q: "세종대왕의 이야기에서 배울 수 있는 점은?", options: ["반대가 있으면 포기해야 한다","옳다고 믿는 일은 끝까지 밀고 나가는 용기","다른 사람 말을 따라야 한다","쉬운 길을 선택해야 한다"], answer: 1, explanation: "신하들의 반대에도 흔들리지 않고 백성을 위해 한글을 완성했습니다." }
  },
  '08': {
    // 허준 - 백성의 병을 고친 의원
    literal: { q: "허준이 쓴 의학 백과사전의 이름은?", options: ["본초강목","동의보감","의방유취","향약집성방"], answer: 1, explanation: "허준은 15년 동안 심혈을 기울여 동의보감을 완성했습니다." },
    structural: { q: "허준이 동의보감을 쓰게 된 계기는?", options: ["스스로 원해서","선조 임금의 명령","외국의 요청","상을 받으려고"], answer: 1, explanation: "선조는 허준에게 백성들을 위한 의학책을 만들라고 명령했습니다." },
    lexical: { q: "'서얼'의 뜻으로 알맞은 것은?", options: ["양반 출신","양반과 천민 사이에서 태어난 자녀","천민 출신","왕족"], answer: 1, explanation: "'서얼'은 양반과 천민 사이에서 태어난 자녀를 뜻합니다." },
    inferential: { q: "허준이 향약을 중심으로 처방을 기록한 이유는?", options: ["외국 약재가 더 좋아서","가난한 백성도 쉽게 구할 수 있어서","향약이 비싸서","임금이 명령해서"], answer: 1, explanation: "가난한 백성들도 쉽게 구할 수 있는 우리나라 약재를 중심으로 했습니다." },
    critical: { q: "허준의 이야기에서 배울 수 있는 점은?", options: ["신분이 전부다","낮은 신분도 열정과 노력으로 극복할 수 있다","의학만 중요하다","혼자 공부해야 한다"], answer: 1, explanation: "서얼이라는 낮은 신분에도 불구하고 뛰어난 업적을 남겼습니다." }
  },
  '09': {
    // 신사임당 - 그림과 학문으로 빛난
    literal: { q: "신사임당의 아들 중 조선 최고의 유학자가 된 사람은?", options: ["이이(율곡)","이황","정약용","허준"], answer: 0, explanation: "신사임당의 아들 율곡 이이는 조선 최고의 유학자가 되었습니다." },
    structural: { q: "신사임당이 학문과 예술을 배울 수 있었던 이유는?", options: ["왕실 출신이어서","아버지의 지원 덕분에","혼자 독학해서","외국에서 배워서"], answer: 1, explanation: "아버지가 딸의 재능을 알아보고 학문과 예술을 배울 수 있도록 지원했습니다." },
    lexical: { q: "'초충도'의 뜻으로 알맞은 것은?", options: ["산수를 그린 그림","풀과 벌레를 그린 그림","인물을 그린 그림","건물을 그린 그림"], answer: 1, explanation: "'초충도'는 풀(草)과 벌레(蟲)를 그린 그림입니다." },
    inferential: { q: "신사임당의 포도 그림에 새가 날아와 쪼았다는 전설이 의미하는 것은?", options: ["그림이 못생겼다","그림이 너무 사실적이고 생생했다","새가 배고팠다","포도가 맛있었다"], answer: 1, explanation: "그림이 너무 생생하고 사실적이어서 새도 속았다는 뜻입니다." },
    critical: { q: "신사임당의 이야기에서 배울 수 있는 점은?", options: ["여성은 공부하면 안 된다","재능을 발견하고 꾸준히 키우면 뛰어난 성취를 이룰 수 있다","자녀 교육은 중요하지 않다","예술만 중요하다"], answer: 1, explanation: "어려운 환경에서도 재능을 키워 학문과 예술에서 뛰어난 성취를 이루었습니다." }
  },
  '10': {
    // 이황 - 조선 성리학의 거장
    literal: { q: "이황이 제자들을 가르치기 위해 세운 서원은?", options: ["소수서원","도산서원","옥산서원","병산서원"], answer: 1, explanation: "이황은 도산서원을 세워 많은 제자들을 가르쳤습니다." },
    structural: { q: "이황이 관직보다 학문 연구를 중시한 이유는?", options: ["관직이 힘들어서","후학 양성이 나라에 더 큰 공헌이라 믿어서","돈이 없어서","건강이 나빠서"], answer: 1, explanation: "학문 연구와 후학 양성이 나라와 사회에 더 큰 공헌이라 믿었습니다." },
    lexical: { q: "'호(號)'의 뜻으로 알맞은 것은?", options: ["본명","본명 대신 쓰는 별명","성씨","직책"], answer: 1, explanation: "'호'는 본명 대신 쓰는 별명이나 이름입니다. 이황의 호는 퇴계입니다." },
    inferential: { q: "일본에서 이황을 '동방의 주자'라고 부른 이유는?", options: ["일본에서 태어나서","성리학을 깊이 연구하여 큰 영향을 미쳤기 때문에","일본어를 잘해서","일본을 여행해서"], answer: 1, explanation: "이황의 성리학 연구가 일본 유학자들에게 큰 영향을 미쳤기 때문입니다." },
    critical: { q: "이황의 이야기에서 배울 수 있는 점은?", options: ["출세가 가장 중요하다","꾸준한 학문 연구와 겸손한 자세의 중요성","혼자 공부해야 한다","책만 읽으면 된다"], answer: 1, explanation: "평생 겸손한 자세로 학문에 정진하고 후학을 양성했습니다." }
  },
  '11': {
    // 이이 - 실천하는 학자 율곡 이이
    literal: { q: "이이가 과거 시험에서 장원을 차지한 횟수는?", options: ["5번","7번","9번","11번"], answer: 2, explanation: "이이는 과거 시험에서 아홉 번이나 장원을 차지하여 구도장원공이라 불렸습니다." },
    structural: { q: "이이의 10만 양병설이 받아들여지지 않은 결과는?", options: ["일본과 친해졌다","임진왜란에 대비하지 못했다","조선이 강해졌다","아무 일도 없었다"], answer: 1, explanation: "양병 주장이 받아들여지지 않아 8년 후 임진왜란 때 큰 피해를 입었습니다." },
    lexical: { q: "'양병'의 뜻으로 알맞은 것은?", options: ["병을 치료함","군사를 기름","병을 앓음","약을 먹음"], answer: 1, explanation: "'양병'은 군사를 기르는 것입니다." },
    inferential: { q: "이이가 일본의 침략을 예상할 수 있었던 이유는?", options: ["점을 쳐서","국제 정세를 파악하는 통찰력이 있었기 때문에","일본에서 통보받아서","운이 좋아서"], answer: 1, explanation: "이이는 국제 정세를 분석하고 미래를 내다보는 통찰력이 있었습니다." },
    critical: { q: "이이의 이야기에서 배울 수 있는 점은?", options: ["이론만 중요하다","학문과 실천을 모두 중시해야 한다","실천만 중요하다","미래는 예측할 수 없다"], answer: 1, explanation: "이이는 학문만 한 것이 아니라 현실 정치에도 적극 참여했습니다." }
  },
  '12': {
    // 정약용 - 백성을 위한 실학자
    literal: { q: "정약용이 수원 화성 공사에서 발명한 기계는?", options: ["자격루","측우기","거중기","혼천의"], answer: 2, explanation: "정약용은 무거운 돌을 쉽게 들어 올리는 거중기를 발명했습니다." },
    structural: { q: "정약용이 18년간 유배 생활을 하게 된 이유는?", options: ["반역죄","천주교를 믿었다는 이유","도둑질","무능함"], answer: 1, explanation: "정조가 세상을 떠난 후 천주교를 믿었다는 이유로 유배를 당했습니다." },
    lexical: { q: "'실학'의 뜻으로 알맞은 것은?", options: ["실제 생활에 도움이 되는 실용적인 학문","이론만 연구하는 학문","외국 학문","종교 학문"], answer: 0, explanation: "'실학'은 실제 생활에 도움이 되는 실용적인 학문입니다." },
    inferential: { q: "정약용이 유배 중에도 500권 넘는 책을 쓸 수 있었던 이유는?", options: ["시간이 남아서","좌절하지 않고 학문에 몰두했기 때문에","다른 할 일이 없어서","강제로 써야 해서"], answer: 1, explanation: "어려운 상황에서도 좌절하지 않고 학문 연구에 바쳤습니다." },
    critical: { q: "정약용의 이야기에서 배울 수 있는 점은?", options: ["힘들면 포기해야 한다","어려운 상황에서도 포기하지 않으면 큰 업적을 이룰 수 있다","유배는 좋은 것이다","책만 쓰면 된다"], answer: 1, explanation: "18년 유배 생활 중에도 포기하지 않고 연구하여 위대한 업적을 남겼습니다." }
  },
  '13': {
    // 광개토대왕 - 영토를 넓힌 광개토대왕
    literal: { q: "광개토대왕이 신라를 도와 물리친 적은?", options: ["백제","당나라","왜구","거란"], answer: 2, explanation: "광개토대왕은 5만 대군을 보내 왜구를 격퇴하여 신라를 도왔습니다." },
    structural: { q: "광개토대왕릉비를 세운 사람은?", options: ["광개토대왕 본인","아들 장수왕","손자","신하"], answer: 1, explanation: "아들 장수왕이 아버지의 업적을 기리기 위해 비석을 세웠습니다." },
    lexical: { q: "'정복'의 뜻으로 알맞은 것은?", options: ["평화롭게 협상하다","무력으로 땅이나 나라를 차지하다","도망가다","항복하다"], answer: 1, explanation: "'정복'은 다른 나라를 무력으로 차지하는 것입니다." },
    inferential: { q: "광개토대왕이 어린 나이에 위대한 업적을 남길 수 있었던 이유는?", options: ["운이 좋아서","뛰어난 리더십과 군사 전략","다른 나라가 약해서","신하들이 잘해서"], answer: 1, explanation: "열여덟 살에 왕이 되었지만 뛰어난 리더십과 군사 전략으로 성공했습니다." },
    critical: { q: "광개토대왕의 이야기에서 배울 수 있는 점은?", options: ["나이가 많아야 성공한다","나이와 상관없이 능력과 리더십이 중요하다","전쟁만 중요하다","영토만 중요하다"], answer: 1, explanation: "어린 나이에도 뛰어난 능력으로 위대한 업적을 남겼습니다." }
  },
  '14': {
    // 장수왕 - 고구려를 빛낸 장수왕
    literal: { q: "장수왕이 평양으로 수도를 옮긴 이유는?", options: ["날씨가 좋아서","남쪽으로 영토를 넓히기 위해","아버지의 유언","적을 피하려고"], answer: 1, explanation: "장수왕은 남진 정책을 위해 수도를 평양으로 옮겼습니다." },
    structural: { q: "장수왕이 외교를 중시한 이유는?", options: ["전쟁이 싫어서","강한 나라들 사이에서 균형을 유지하기 위해","돈이 없어서","신하들이 원해서"], answer: 1, explanation: "중국의 남북조와 유목민족 등 강한 나라들 사이에서 균형을 유지했습니다." },
    lexical: { q: "'남진'의 뜻으로 알맞은 것은?", options: ["북쪽으로 나아감","남쪽으로 나아감","동쪽으로 나아감","제자리에 있음"], answer: 1, explanation: "'남진'은 남쪽으로 나아가는 것입니다." },
    inferential: { q: "장수왕이 79년간 왕위를 유지할 수 있었던 이유는?", options: ["운이 좋아서","뛰어난 외교력과 통치력","다른 왕이 없어서","전쟁만 해서"], answer: 1, explanation: "뛰어난 외교력과 통치력으로 오랜 기간 안정적으로 나라를 다스렸습니다." },
    critical: { q: "장수왕의 이야기에서 배울 수 있는 점은?", options: ["전쟁만 중요하다","무력과 외교를 적절히 활용하는 지혜","외교는 필요 없다","힘만 있으면 된다"], answer: 1, explanation: "무력뿐 아니라 외교를 통해 나라를 강하게 만들었습니다." }
  },
  '15': {
    // 선덕여왕 - 신라 최초의 여왕
    literal: { q: "선덕여왕이 세운 탑은?", options: ["다보탑","석가탑","황룡사 구층목탑","첨성대"], answer: 2, explanation: "선덕여왕은 황룡사 구층목탑을 세워 나라의 위엄을 높였습니다." },
    structural: { q: "선덕여왕이 여왕이 될 수 있었던 이유는?", options: ["전쟁에서 이겨서","성골 남자가 없었고 뛰어난 능력이 있어서","외국의 도움","반란을 일으켜서"], answer: 1, explanation: "성골 남자가 없는 상황에서 뛰어난 능력으로 왕위에 올랐습니다." },
    lexical: { q: "'첨성대'의 용도로 알맞은 것은?", options: ["군사 훈련장","천문 관측대","왕의 무덤","절"], answer: 1, explanation: "첨성대는 별을 관측하는 천문대입니다." },
    inferential: { q: "선덕여왕이 김유신, 김춘추 같은 인재를 등용한 이유는?", options: ["친척이어서","나라를 강하게 만들기 위해","다른 사람이 없어서","강제로"], answer: 1, explanation: "뛰어난 인재를 등용하여 신라를 강하게 만들었습니다." },
    critical: { q: "선덕여왕의 이야기에서 배울 수 있는 점은?", options: ["성별이 가장 중요하다","능력과 지혜가 있으면 어떤 위치에서도 성공할 수 있다","여왕은 안 된다","남자만 왕이 될 수 있다"], answer: 1, explanation: "여성이라는 한계를 극복하고 뛰어난 통치력을 보여주었습니다." }
  },
  '16': {
    // 대조영 - 발해를 세운 대조영
    literal: { q: "대조영이 세운 나라는?", options: ["고구려","백제","발해","신라"], answer: 2, explanation: "대조영은 698년에 발해를 건국했습니다." },
    structural: { q: "대조영이 발해를 세울 수 있었던 배경은?", options: ["당나라의 도움","고구려 멸망 후 유민을 이끌어","신라의 도움","외국 군대"], answer: 1, explanation: "고구려가 멸망한 후 유민들을 이끌고 새 나라를 세웠습니다." },
    lexical: { q: "'유민'의 뜻으로 알맞은 것은?", options: ["왕족","나라가 망해 떠돌게 된 백성","군인","상인"], answer: 1, explanation: "'유민'은 나라가 망해 떠돌게 된 백성을 뜻합니다." },
    inferential: { q: "발해가 '해동성국'이라 불린 이유는?", options: ["바다가 많아서","동쪽 바다의 번성한 나라라는 의미","성이 많아서","왕의 이름이어서"], answer: 1, explanation: "발해가 크게 번성하여 '동쪽 바다의 번성한 나라'라는 의미입니다." },
    critical: { q: "대조영의 이야기에서 배울 수 있는 점은?", options: ["나라가 망하면 끝이다","절망 속에서도 새로운 희망을 만들 수 있다","혼자 해야 한다","포기가 답이다"], answer: 1, explanation: "고구려 멸망의 절망 속에서 새 나라를 세운 희망의 이야기입니다." }
  },
  '17': {
    // 왕건 - 고려를 세운 왕건
    literal: { q: "왕건이 세운 나라는?", options: ["고구려","고려","조선","백제"], answer: 1, explanation: "왕건은 918년에 고려를 건국했습니다." },
    structural: { q: "왕건이 후삼국을 통일할 수 있었던 비결은?", options: ["무력만 사용","포용 정책과 화합","외국의 도움","운"], answer: 1, explanation: "왕건은 적도 포용하는 화합의 정치로 후삼국을 통일했습니다." },
    lexical: { q: "'호족'의 뜻으로 알맞은 것은?", options: ["왕족","지방의 유력한 세력가","승려","군인"], answer: 1, explanation: "'호족'은 지방에서 세력을 가진 유력한 가문을 뜻합니다." },
    inferential: { q: "왕건이 '훈요십조'를 남긴 이유는?", options: ["자랑하려고","후손들에게 나라를 다스리는 가르침을 주려고","벌을 주려고","비밀로 하려고"], answer: 1, explanation: "후손들에게 나라를 다스리는 지침을 남기기 위해 훈요십조를 작성했습니다." },
    critical: { q: "왕건의 이야기에서 배울 수 있는 점은?", options: ["힘으로 모든 것을 해결한다","포용과 화합이 진정한 통일의 힘이다","적을 모두 없애야 한다","혼자 결정해야 한다"], answer: 1, explanation: "왕건은 적도 포용하는 화합의 정치로 성공했습니다." }
  },
  '18': {
    // 을지문덕 - 살수대첩의 영웅
    literal: { q: "을지문덕이 수나라 군대를 크게 무찌른 전투는?", options: ["한산대첩","살수대첩","행주대첩","명량대첩"], answer: 1, explanation: "을지문덕은 살수(청천강)에서 수나라 30만 대군을 무찔렀습니다." },
    structural: { q: "을지문덕이 후퇴 전술을 사용한 이유는?", options: ["겁이 나서","적을 유인하여 지치게 만들기 위해","항복하려고","길을 몰라서"], answer: 1, explanation: "일부러 후퇴하며 적을 깊이 유인하여 지치게 만든 후 공격했습니다." },
    lexical: { q: "'유인'의 뜻으로 알맞은 것은?", options: ["도망가다","꾀로 이끌어 들이다","숨다","공격하다"], answer: 1, explanation: "'유인'은 꾀나 계략으로 이끌어 들이는 것입니다." },
    inferential: { q: "수나라가 113만 대군을 동원했음에도 패배한 이유는?", options: ["날씨가 나빠서","을지문덕의 뛰어난 전략 때문에","군사가 적어서","무기가 없어서"], answer: 1, explanation: "을지문덕의 유인 전술과 뛰어난 전략 때문에 대군도 패배했습니다." },
    critical: { q: "을지문덕의 이야기에서 배울 수 있는 점은?", options: ["숫자가 전부다","지혜로운 전략이 숫자보다 중요할 수 있다","항상 후퇴해야 한다","전쟁은 피해야 한다"], answer: 1, explanation: "적은 군대로도 뛰어난 전략으로 대군을 물리칠 수 있습니다." }
  },
  '19': {
    // 연개소문 - 강인한 고구려 연개소문
    literal: { q: "연개소문이 당나라 군대를 물리친 전투는?", options: ["살수대첩","안시성 전투","한산대첩","행주대첩"], answer: 1, explanation: "연개소문은 안시성 전투에서 당 태종의 침략을 막아냈습니다." },
    structural: { q: "연개소문이 정변을 일으킨 이유는?", options: ["권력욕만으로","나약한 귀족 정치를 개혁하고 당나라에 맞서기 위해","외국의 명령","돈을 위해"], answer: 1, explanation: "당나라의 위협에 맞서 강력한 지도력이 필요하다고 판단했습니다." },
    lexical: { q: "'정변'의 뜻으로 알맞은 것은?", options: ["평화로운 변화","무력으로 정권을 바꿈","선거","협상"], answer: 1, explanation: "'정변'은 무력을 써서 정권을 바꾸는 것입니다." },
    inferential: { q: "연개소문이 강경한 정책을 펼친 이유는?", options: ["성격이 나빠서","당나라의 침략 위협에 맞서기 위해","전쟁을 좋아해서","신하들이 원해서"], answer: 1, explanation: "당나라의 침략 위협이 커지는 상황에서 강한 대응이 필요했습니다." },
    critical: { q: "연개소문의 이야기에서 생각해볼 점은?", options: ["무력만이 답이다","나라를 지키기 위한 강한 의지의 중요성","평화만 추구해야 한다","외국에 항복해야 한다"], answer: 1, explanation: "외세의 위협에 맞서 나라를 지키려는 강한 의지가 있었습니다." }
  },
  '20': {
    // 계백 - 백제 최후의 장군
    literal: { q: "계백이 이끈 결사대의 수는?", options: ["1,000명","3,000명","5,000명","10,000명"], answer: 2, explanation: "계백은 5천 결사대를 이끌고 황산벌에서 싸웠습니다." },
    structural: { q: "계백이 가족을 먼저 보낸 이유는?", options: ["미워해서","죽음을 각오하고 싸우기 위해","도망가라고","부자여서"], answer: 1, explanation: "뒤를 걱정하지 않고 오직 나라를 위해 싸우겠다는 각오였습니다." },
    lexical: { q: "'결사대'의 뜻으로 알맞은 것은?", options: ["훈련병","죽음을 각오하고 싸우는 부대","경비병","예비군"], answer: 1, explanation: "'결사대'는 죽음을 각오하고 싸우는 부대입니다." },
    inferential: { q: "계백이 5만 대군에 맞서 싸운 이유는?", options: ["이길 수 있어서","나라를 향한 충성심 때문에","상을 받으려고","명령이어서"], answer: 1, explanation: "승산이 없어도 나라를 위해 끝까지 싸운 충성심 때문입니다." },
    critical: { q: "계백의 이야기에서 배울 수 있는 점은?", options: ["포기가 답이다","어려운 상황에서도 끝까지 책임을 다하는 자세","숫자가 전부다","가족을 버려야 한다"], answer: 1, explanation: "승산이 없는 상황에서도 끝까지 나라를 위해 싸운 계백의 충성심입니다." }
  }
};

const DIR = path.join(__dirname, 'public', 'BRAINUP', 'person');
const NUM_CIRCLE = "const NUM_CIRCLE = ['①', '②', '③', '④'];";

for (let i = 1; i <= 20; i++) {
  const no = String(i).padStart(2, '0');
  const filePath = path.join(DIR, `on_people1_${no}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ 파일 없음: on_people1_${no}.html`);
    continue;
  }

  let html = fs.readFileSync(filePath, 'utf8');
  const data = REMEDIAL_DATA[no];

  if (!data) {
    console.log(`⚠️ 데이터 없음: ${no}`);
    continue;
  }

  // 새로운 REMEDIAL_BANK 생성
  const newBank = `const REMEDIAL_BANK = {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "${data.literal.q}", options: ${JSON.stringify(data.literal.options)}, answer: ${data.literal.answer}, explanation: "${data.literal.explanation}" }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "${data.structural.q}", options: ${JSON.stringify(data.structural.options)}, answer: ${data.structural.answer}, explanation: "${data.structural.explanation}" }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "${data.lexical.q}", options: ${JSON.stringify(data.lexical.options)}, answer: ${data.lexical.answer}, explanation: "${data.lexical.explanation}" }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "${data.inferential.q}", options: ${JSON.stringify(data.inferential.options)}, answer: ${data.inferential.answer}, explanation: "${data.inferential.explanation}" }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "${data.critical.q}", options: ${JSON.stringify(data.critical.options)}, answer: ${data.critical.answer}, explanation: "${data.critical.explanation}" }
        ]
      }
    };
    ${NUM_CIRCLE}`;

  // 기존 REMEDIAL_BANK 교체
  const bankRegex = /const REMEDIAL_BANK\s*=\s*\{[\s\S]*?\};(\s*const NUM_CIRCLE[\s\S]*?;)?/;
  if (bankRegex.test(html)) {
    html = html.replace(bankRegex, newBank);
  } else {
    // REMEDIAL_BANK가 없으면 </script> 앞에 추가
    const scriptEnd = html.lastIndexOf('</script>');
    if (scriptEnd > 0) {
      html = html.slice(0, scriptEnd) + '\n    ' + newBank + '\n  ' + html.slice(scriptEnd);
    }
  }

  // NUM_CIRCLE이 없으면 추가 확인
  if (!html.includes('NUM_CIRCLE')) {
    html = html.replace('const REMEDIAL_BANK', `${NUM_CIRCLE}\n    const REMEDIAL_BANK`);
  }

  // openRemedial 함수 교체 (새로운 형식으로)
  const newOpenRemedial = `function openRemedial() {
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
        const p = data.problems[0];
        html += \`<div style="margin-bottom:18px; padding:14px; background:#faf6f0; border-radius:10px;">
          <h4 style="margin:0 0 10px; color:#8b2f2f; font-size:15px;">\${data.title}</h4>
          <p style="margin:0 0 10px; font-size:14px; color:#333;">\${p.q}</p>
          <div id="remedial-\${key}" style="display:flex; flex-direction:column; gap:6px;">\`;
        p.options.forEach((opt, idx) => {
          html += \`<label style="display:flex; align-items:center; font-size:13px; cursor:pointer;">
            <input type="radio" name="\${key}" value="\${idx}" style="margin-right:6px;">\${NUM_CIRCLE[idx]} \${opt}
          </label>\`;
        });
        html += \`</div><div id="result-\${key}" style="margin-top:8px;"></div></div>\`;
      });

      body.innerHTML = html;
      panel.style.display = 'flex';
    }`;

  const openRemedialRegex = /function openRemedial\(\)\s*\{[\s\S]*?\n\s*\}/;
  if (openRemedialRegex.test(html)) {
    html = html.replace(openRemedialRegex, newOpenRemedial);
  }

  // gradeRemedial 함수 교체
  const newGradeRemedial = `function gradeRemedial() {
      for (const key in REMEDIAL_BANK) {
        const data = REMEDIAL_BANK[key];
        if (!data) continue;
        const p = data.problems[0];
        const inputs = document.querySelectorAll(\`input[name="\${key}"]\`);
        if (!inputs.length) continue;
        let selected = -1;
        inputs.forEach((inp, i) => { if (inp.checked) selected = i; });
        const resultDiv = document.getElementById(\`result-\${key}\`);
        if (!resultDiv) continue;
        if (selected === -1) {
          resultDiv.innerHTML = '<span style="color:#666;font-size:12px;">선택해주세요</span>';
        } else if (selected === p.answer) {
          resultDiv.innerHTML = '<span style="color:#157347;font-size:12px;">정답입니다 ✅</span>';
        } else {
          resultDiv.innerHTML = \`<span style="color:#b3261e;font-size:12px;">틀렸어요 ❌ 정답: \${NUM_CIRCLE[p.answer]} \${p.options[p.answer]}</span><br><span style="color:#555;font-size:11px;">\${p.explanation}</span>\`;
        }
      }
    }`;

  const gradeRemedialRegex = /function gradeRemedial\(\)\s*\{[\s\S]*?\n\s*\}/;
  if (gradeRemedialRegex.test(html)) {
    html = html.replace(gradeRemedialRegex, newGradeRemedial);
  }

  // resetRemedial 함수 교체
  const newResetRemedial = `function resetRemedial() {
      const body = document.getElementById('remedial-panel-body');
      if (!body) return;
      body.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
      for (const key in REMEDIAL_BANK) {
        const resultDiv = document.getElementById(\`result-\${key}\`);
        if (resultDiv) resultDiv.innerHTML = '';
      }
    }`;

  const resetRemedialRegex = /function resetRemedial\(\)\s*\{[\s\S]*?\n\s*\}/;
  if (resetRemedialRegex.test(html)) {
    html = html.replace(resetRemedialRegex, newResetRemedial);
  }

  // 보완학습 버튼 활성화 (display:none 제거)
  html = html.replace(/class="report-btn-remedial"[^>]*style="[^"]*display:\s*none[^"]*"/g, 'class="report-btn-remedial"');
  html = html.replace(/(class="report-btn-remedial"[^>]*)style="display:\s*none;?\s*"/g, '$1');

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✅ 수정 완료: on_people1_${no}.html`);
}

console.log('\n🎉 온한국인물(1) 01~20 보완학습 구현 완료!');
console.log('- 각 지수별 문제 1개씩 (5개 지수)');
console.log('- 선지 번호 ①②③④ 표시');
console.log('- 해설(explanation) 포함');
console.log('- 보완학습하기 버튼 활성화');

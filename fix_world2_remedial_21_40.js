const fs = require('fs');
const path = require('path');

const worldlitDir = path.join(__dirname, 'public/BRAINUP/worldlit');

// 각 단원별 보완학습 문제 (본문 내용 기반, 5개 지수별 1문제씩, 해설 포함)
const REMEDIAL_DATA = {
  '21': {
    // 무인도에서 살아남기 (로빈슨 크루소)
    literal: { q: "로빈슨이 구한 사람의 이름은?", options: ["산초","프라이데이","짐","톰"], answer: 1, explanation: "로빈슨은 금요일에 구한 사람에게 '프라이데이'라는 이름을 지어주었습니다." },
    structural: { q: "로빈슨이 무인도에서 한 일로 알맞지 않은 것은?", options: ["집을 지음","농사를 지음","달력을 만듦","비행기를 만듦"], answer: 3, explanation: "로빈슨은 집, 농사, 달력을 만들었지만 비행기는 만들지 않았습니다." },
    lexical: { q: "'표류'의 뜻으로 알맞은 것은?", options: ["헤엄치는 것","물결에 떠밀려 떠다니는 것","잠수하는 것","배를 만드는 것"], answer: 1, explanation: "표류는 물결에 떠밀려 정처 없이 떠다니는 것입니다." },
    inferential: { q: "로빈슨이 28년 동안 살아남을 수 있었던 이유는?", options: ["다른 사람이 도와줘서","포기하지 않고 스스로 노력했기 때문에","섬에 식당이 있어서","배가 금방 왔기 때문에"], answer: 1, explanation: "로빈슨은 지혜와 근면함으로 스스로 생활을 개척했습니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["어려운 상황에서도 포기하지 않으면 살아남을 수 있다","섬에서 사는 것이 좋다","혼자 있는 것이 편하다","모험은 위험하다"], answer: 0, explanation: "희망을 잃지 않고 노력하면 어려운 상황을 극복할 수 있습니다." }
  },
  '22': {
    // 거인과 소인의 나라 (걸리버 여행기)
    literal: { q: "걸리버가 처음 도착한 소인국의 이름은?", options: ["브롭딩낵","릴리펏","라퓨타","후이넘"], answer: 1, explanation: "걸리버가 처음 도착한 소인국은 릴리펏입니다." },
    structural: { q: "걸리버 여행기가 비판하는 것은?", options: ["여행의 즐거움","인간 사회의 어리석음과 부조리","소인국의 아름다움","거인의 힘"], answer: 1, explanation: "작가는 풍자를 통해 인간 사회의 어리석음과 부조리를 비판했습니다." },
    lexical: { q: "'풍자'의 뜻으로 알맞은 것은?", options: ["칭찬하는 것","사회의 결점을 빗대어 비웃는 것","여행하는 것","노래하는 것"], answer: 1, explanation: "풍자는 사회의 결점을 빗대어 비웃는 것입니다." },
    inferential: { q: "걸리버가 여러 나라를 여행하며 느낀 것은?", options: ["소인이 최고다","거인이 최고다","인간 사회의 문제점을 다른 시각에서 보게 됨","여행이 싫어짐"], answer: 2, explanation: "걸리버는 다른 나라에서 인간 사회를 객관적으로 바라보게 되었습니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["크기가 중요하다","다양한 관점에서 세상을 바라보는 것이 중요하다","여행은 위험하다","소인이 되고 싶다"], answer: 1, explanation: "다양한 관점에서 세상을 바라보면 우리 사회를 더 잘 이해할 수 있습니다." }
  },
  '23': {
    // 이상과 현실 사이의 기사 (돈키호테)
    literal: { q: "돈키호테가 풍차를 무엇으로 착각했나요?", options: ["집","거인","배","말"], answer: 1, explanation: "돈키호테는 풍차를 거인으로 착각하고 돌진했습니다." },
    structural: { q: "돈키호테가 기사가 되기로 한 이유는?", options: ["돈을 벌려고","기사 소설을 너무 많이 읽어서","부모님이 시켜서","친구가 권해서"], answer: 1, explanation: "기사 소설을 너무 많이 읽어 자신이 진짜 기사라고 믿게 되었습니다." },
    lexical: { q: "'이상'의 뜻으로 알맞은 것은?", options: ["현실","마음속에 그리는 완벽한 상태","슬픔","음식"], answer: 1, explanation: "이상은 마음속에 그리는 완벽한 상태입니다." },
    inferential: { q: "돈키호테의 행동이 어리석으면서도 아름다운 이유는?", options: ["돈을 많이 벌어서","정의와 명예에 대한 순수한 믿음이 있어서","풍차를 이겨서","사람들이 칭찬해서"], answer: 1, explanation: "비록 현실과 맞지 않지만 정의를 향한 순수한 마음이 있었습니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["이상과 현실 사이에서 균형을 찾는 것이 중요하다","풍차와 싸우면 이긴다","책을 읽으면 안 된다","현실만 중요하다"], answer: 0, explanation: "꿈을 가지되 현실과의 균형을 찾는 것이 중요합니다." }
  },
  '24': {
    // 가슴에 새긴 죄의 글자 (주홍글씨)
    literal: { q: "헤스터가 가슴에 달아야 했던 글자는?", options: ["A","B","C","D"], answer: 0, explanation: "헤스터는 간통(Adultery)의 'A' 글자를 달아야 했습니다." },
    structural: { q: "딤즈데일이 고통받은 이유는?", options: ["돈이 없어서","죄를 숨기고 죄책감에 시달려서","병에 걸려서","여행을 못 가서"], answer: 1, explanation: "딤즈데일은 죄를 밝히지 못하고 죄책감에 시달렸습니다." },
    lexical: { q: "'위선'의 뜻으로 알맞은 것은?", options: ["진심으로 착한 것","겉으로만 착한 척하고 속은 다른 것","용감한 것","슬픈 것"], answer: 1, explanation: "위선은 겉으로만 착한 척하고 속은 다른 것입니다." },
    inferential: { q: "헤스터가 시간이 지나며 존경받게 된 이유는?", options: ["도망갔기 때문에","성실하게 살며 남을 도왔기 때문에","거짓말을 했기 때문에","부자가 되었기 때문에"], answer: 1, explanation: "헤스터는 벌을 받으면서도 성실하게 살아 존경을 얻었습니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["죄를 숨기면 좋다","진정한 속죄는 스스로 뉘우치고 고백하는 것이다","남의 죄를 밝히는 것이 좋다","빨간색은 나쁘다"], answer: 1, explanation: "진정한 속죄는 벌을 받는 것이 아니라 스스로 뉘우치는 것입니다." }
  },
  '25': {
    // 첫인상을 넘어서 (오만과 편견)
    literal: { q: "엘리자베스가 처음에 다아시를 싫어한 이유는?", options: ["가난해서","거만해 보여서","못생겨서","말이 없어서"], answer: 1, explanation: "엘리자베스는 다아시가 거만하고 도도해 보여서 싫어했습니다." },
    structural: { q: "다아시의 진짜 성격은 어떠했나요?", options: ["거만하고 나쁜 사람","내성적이고 부끄러움 타는 사람","거짓말쟁이","말이 많은 사람"], answer: 1, explanation: "다아시는 사실 내성적이고 부끄러움을 많이 타는 성격이었습니다." },
    lexical: { q: "'편견'의 뜻으로 알맞은 것은?", options: ["공정한 판단","한쪽으로 치우친 잘못된 생각","좋은 인상","정확한 정보"], answer: 1, explanation: "편견은 한쪽으로 치우친 잘못된 생각입니다." },
    inferential: { q: "엘리자베스와 다아시가 서로를 이해하게 된 계기는?", options: ["처음부터 좋아해서","서로의 진짜 모습을 알게 되면서","돈 때문에","부모님이 시켜서"], answer: 1, explanation: "서로를 알아가면서 오해와 편견이 사라졌습니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["첫인상이 가장 중요하다","겉모습이나 첫인상으로 사람을 판단하면 안 된다","부자와 결혼해야 한다","오만한 것이 좋다"], answer: 1, explanation: "첫인상에 속지 말고 진정한 모습을 보아야 합니다." }
  },
  '26': {
    // 악마와의 거래 (파우스트)
    literal: { q: "파우스트가 악마와 거래한 대가는?", options: ["돈","영혼","집","음식"], answer: 1, explanation: "파우스트는 자신의 영혼을 대가로 악마와 거래했습니다." },
    structural: { q: "파우스트가 악마와 거래한 이유는?", options: ["돈이 필요해서","지식으로 채울 수 없는 공허함 때문에","친구가 시켜서","장난으로"], answer: 1, explanation: "파우스트는 학문으로 채울 수 없는 공허함에 악마와 거래했습니다." },
    lexical: { q: "'유혹'의 뜻으로 알맞은 것은?", options: ["거절하는 것","꾀어서 마음을 끄는 것","도망치는 것","칭찬하는 것"], answer: 1, explanation: "유혹은 꾀어서 마음을 끄는 것입니다." },
    inferential: { q: "파우스트 이야기가 경고하는 것은?", options: ["공부를 많이 하라","순간의 욕망을 위해 소중한 것을 포기하지 말라","악마와 친해지라","돈을 많이 벌어라"], answer: 1, explanation: "순간의 쾌락을 위해 영혼처럼 소중한 것을 잃으면 안 됩니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["유혹에 넘어가면 안 된다","악마와 친해지면 좋다","지식은 필요 없다","욕심을 많이 부리면 좋다"], answer: 0, explanation: "순간의 유혹에 넘어가 소중한 것을 잃으면 안 됩니다." }
  },
  '27': {
    // 은촛대의 기적 (레미제라블)
    literal: { q: "미리엘 주교가 장발장에게 준 것은?", options: ["돈","은촛대","음식","옷"], answer: 1, explanation: "미리엘 주교는 장발장에게 은촛대를 주었습니다." },
    structural: { q: "장발장이 감옥에 갇혔던 이유는?", options: ["살인","빵 한 조각을 훔쳐서","거짓말","사기"], answer: 1, explanation: "장발장은 굶주린 조카를 위해 빵을 훔쳐 감옥에 갔습니다." },
    lexical: { q: "'구원'의 뜻으로 알맞은 것은?", options: ["벌을 주는 것","어려움에서 구해주는 것","숨기는 것","도망치는 것"], answer: 1, explanation: "구원은 어려움에서 구해주는 것입니다." },
    inferential: { q: "주교의 용서가 장발장에게 미친 영향은?", options: ["더 나쁜 사람이 됨","새 사람으로 변화하여 선하게 살게 됨","도망감","아무 영향 없음"], answer: 1, explanation: "주교의 용서로 장발장은 새 사람이 되어 선하게 살았습니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["용서와 사랑이 사람을 변화시킬 수 있다","도둑질해도 된다","벌이 중요하다","돈이 최고다"], answer: 0, explanation: "용서와 사랑이 사람을 변화시키는 힘이 있습니다." }
  },
  '28': {
    // 운명의 기차 (안나 카레니나)
    literal: { q: "안나가 사랑에 빠진 사람은?", options: ["카레닌","브론스키","레빈","오블론스키"], answer: 1, explanation: "안나는 젊은 장교 브론스키와 사랑에 빠졌습니다." },
    structural: { q: "안나의 사랑이 비극으로 끝난 이유는?", options: ["행복해서","사회의 비난과 브론스키의 변심으로 절망했기 때문에","돈이 많아서","친구가 많아서"], answer: 1, explanation: "사회의 비난과 사랑의 불안으로 안나는 절망에 빠졌습니다." },
    lexical: { q: "'비극'의 뜻으로 알맞은 것은?", options: ["행복한 이야기","슬프고 불행한 이야기","재미있는 이야기","긴 이야기"], answer: 1, explanation: "비극은 슬프고 불행한 결말의 이야기입니다." },
    inferential: { q: "레빈과 키티의 이야기가 안나와 대비되는 이유는?", options: ["둘 다 불행해서","레빈과 키티는 진실한 사랑으로 행복을 찾았기 때문에","레빈도 비극적으로 끝나서","관계없는 이야기여서"], answer: 1, explanation: "레빈과 키티는 진실한 사랑과 노력으로 행복을 찾았습니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["사랑만 있으면 된다","진정한 행복은 진실한 사랑과 삶의 의미에서 온다","불륜은 괜찮다","사회 규범은 중요하지 않다"], answer: 1, explanation: "진정한 행복은 순간의 열정이 아닌 진실한 사랑에서 옵니다." }
  },
  '29': {
    // 양심의 무게 (죄와 벌)
    literal: { q: "라스콜니코프가 저지른 범죄는?", options: ["도둑질","살인","사기","거짓말"], answer: 1, explanation: "라스콜니코프는 전당포 노파를 살해했습니다." },
    structural: { q: "라스콜니코프가 자수하게 된 계기는?", options: ["경찰에 잡혀서","소냐의 사랑과 양심의 가책으로","돈이 없어서","친구가 신고해서"], answer: 1, explanation: "소냐의 사랑과 양심의 가책으로 자수를 결심했습니다." },
    lexical: { q: "'양심'의 뜻으로 알맞은 것은?", options: ["돈","옳고 그름을 판단하는 마음","힘","음식"], answer: 1, explanation: "양심은 옳고 그름을 판단하는 마음입니다." },
    inferential: { q: "라스콜니코프의 '비범인 이론'이 틀린 이유는?", options: ["똑똒해서","인간은 누구도 남의 생명을 빼앗을 권리가 없기 때문에","그가 힘이 약해서","법이 없어서"], answer: 1, explanation: "어떤 이유로도 타인의 생명을 빼앗을 권리는 없습니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["양심을 거스르면 고통받는다","범죄해도 괜찮다","똑똒하면 벌 안 받는다","돈이 최고다"], answer: 0, explanation: "양심을 거스르는 행동은 결국 자신을 고통스럽게 합니다." }
  },
  '30': {
    // 어느 날 아침 벌레가 되다 (변신)
    literal: { q: "그레고르가 어느 날 아침 변한 모습은?", options: ["새","벌레","물고기","나무"], answer: 1, explanation: "그레고르는 어느 날 아침 거대한 벌레로 변해 있었습니다." },
    structural: { q: "가족들이 그레고르를 대한 태도의 변화는?", options: ["처음부터 끝까지 사랑함","처음에는 돌봤지만 점점 짐스러워함","처음부터 싫어함","관심 없음"], answer: 1, explanation: "처음에는 돌봤지만 시간이 지나며 짐스러워했습니다." },
    lexical: { q: "'소외'의 뜻으로 알맞은 것은?", options: ["함께하는 것","따돌려져 홀로 남겨지는 것","사랑받는 것","존경받는 것"], answer: 1, explanation: "소외는 따돌려져 홀로 남겨지는 것입니다." },
    inferential: { q: "카프카가 이 작품을 통해 말하고자 한 것은?", options: ["벌레가 되면 좋다","현대 사회에서 인간이 느끼는 소외와 고독","가족이 좋다","변신은 재미있다"], answer: 1, explanation: "현대 사회에서 인간이 느끼는 소외와 고독을 표현했습니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["가족의 사랑은 조건 없어야 한다","벌레가 되면 좋다","일만 열심히 하면 된다","돈만 벌면 된다"], answer: 0, explanation: "진정한 가족의 사랑은 조건 없이 서로를 받아들이는 것입니다." }
  },
  '31': {
    // 토끼굴 속으로 (이상한 나라의 앨리스)
    literal: { q: "앨리스가 이상한 나라에 가게 된 경로는?", options: ["문을 열고","토끼굴에 빠져서","비행기 타고","배 타고"], answer: 1, explanation: "앨리스는 토끼굴에 빠져 이상한 나라에 가게 되었습니다." },
    structural: { q: "이상한 나라에서 앨리스가 겪은 일은?", options: ["공부함","몸이 커지고 작아지며 신기한 존재들을 만남","잠만 잤음","집에만 있음"], answer: 1, explanation: "앨리스는 몸이 변하며 다양한 신기한 존재들을 만났습니다." },
    lexical: { q: "'상상력'의 뜻으로 알맞은 것은?", options: ["현실만 보는 것","마음속에 새로운 것을 그리는 힘","잠자는 것","먹는 것"], answer: 1, explanation: "상상력은 마음속에 새로운 것을 그리는 힘입니다." },
    inferential: { q: "이 작품이 전하는 메시지는?", options: ["토끼를 따라가면 안 된다","상상력과 호기심으로 세상을 바라보면 새로운 것을 발견할 수 있다","꿈을 꾸면 안 된다","현실만 중요하다"], answer: 1, explanation: "상상력과 호기심이 새로운 세상을 열어줍니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["상상력과 호기심이 중요하다","토끼를 잡아야 한다","꿈은 나쁘다","현실에서 벗어나면 안 된다"], answer: 0, explanation: "상상력과 호기심으로 세상을 더 재미있게 볼 수 있습니다." }
  },
  '32': {
    // 하얀 고래를 쫓아서 (모비딕)
    literal: { q: "에이해브 선장이 쫓는 하얀 고래의 이름은?", options: ["짐","모비 딕","네모","프라이데이"], answer: 1, explanation: "에이해브 선장이 쫓는 하얀 고래의 이름은 모비 딕입니다." },
    structural: { q: "에이해브 선장이 모비 딕에게 복수하려는 이유는?", options: ["고래가 예뻐서","모비 딕에게 다리를 잃었기 때문에","돈을 벌려고","친구가 시켜서"], answer: 1, explanation: "에이해브는 모비 딕에게 한쪽 다리를 잃어 복수심에 불탔습니다." },
    lexical: { q: "'집착'의 뜻으로 알맞은 것은?", options: ["포기하는 것","한 가지 생각에 사로잡혀 벗어나지 못하는 것","여행하는 것","친구 사귀는 것"], answer: 1, explanation: "집착은 한 가지 생각에 사로잡혀 벗어나지 못하는 것입니다." },
    inferential: { q: "에이해브의 복수가 비극으로 끝난 이유는?", options: ["고래가 착해서","맹목적인 집착이 자신과 선원들을 파멸로 이끌었기 때문에","배가 좋아서","날씨가 좋아서"], answer: 1, explanation: "복수에 대한 집착이 모두를 파멸로 이끌었습니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["복수는 좋은 것이다","맹목적인 집착과 복수는 파멸을 부른다","고래 사냥은 쉽다","혼자 사는 것이 좋다"], answer: 1, explanation: "맹목적인 집착과 복수는 자신을 파멸로 이끕니다." }
  },
  '33': {
    // 마법사의 섬 (템페스트)
    literal: { q: "프로스페로가 마법을 사용한 목적은?", options: ["세계 정복","자신을 배신한 자들에게 복수하고 딸의 행복을 위해","돈 벌기","장난"], answer: 1, explanation: "프로스페로는 배신자들에게 복수하고 딸의 행복을 위해 마법을 썼습니다." },
    structural: { q: "프로스페로가 마지막에 선택한 것은?", options: ["더 강한 복수","용서와 화해","도망","계속된 마법 사용"], answer: 1, explanation: "프로스페로는 복수 대신 용서와 화해를 선택했습니다." },
    lexical: { q: "'화해'의 뜻으로 알맞은 것은?", options: ["더 싸우는 것","다툼을 풀고 사이좋게 지내는 것","도망치는 것","숨는 것"], answer: 1, explanation: "화해는 다툼을 풀고 사이좋게 지내는 것입니다." },
    inferential: { q: "프로스페로가 마법을 포기한 이유는?", options: ["마법이 약해져서","복수보다 용서가 더 위대하다는 것을 깨달아서","마법이 싫어져서","딸이 싫어해서"], answer: 1, explanation: "복수보다 용서가 더 위대하다는 것을 깨달았습니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["복수가 최고다","용서와 화해가 복수보다 위대하다","마법을 배워야 한다","섬에서 살아야 한다"], answer: 1, explanation: "진정한 힘은 복수가 아니라 용서에서 나옵니다." }
  },
  '34': {
    // 어른이 되기 싫어 (호밀밭의 파수꾼)
    literal: { q: "홀든이 싫어하는 것은?", options: ["아이들","어른들의 위선과 가식","음식","동물"], answer: 1, explanation: "홀든은 어른들의 위선과 가식을 싫어합니다." },
    structural: { q: "홀든이 되고 싶어 하는 '호밀밭의 파수꾼'은 무엇을 의미하나요?", options: ["농부","아이들이 순수함을 잃지 않게 지켜주는 사람","경찰","선생님"], answer: 1, explanation: "아이들이 위험한 어른 세계로 떨어지지 않게 지켜주는 사람입니다." },
    lexical: { q: "'순수'의 뜻으로 알맞은 것은?", options: ["거짓된 것","섞임이 없이 깨끗한 것","더러운 것","복잡한 것"], answer: 1, explanation: "순수는 섞임이 없이 깨끗한 것입니다." },
    inferential: { q: "홀든의 방황이 보여주는 것은?", options: ["여행의 즐거움","청소년기의 혼란과 성장통","어른이 되기 쉬움","학교가 재미있음"], answer: 1, explanation: "청소년기에 느끼는 혼란과 성장의 아픔을 보여줍니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["어른이 되는 것은 무조건 나쁘다","순수함을 간직하며 성장하는 것이 중요하다","학교를 그만두어야 한다","위선적으로 살아야 한다"], answer: 1, explanation: "성장하면서도 순수한 마음을 잃지 않는 것이 중요합니다." }
  },
  '35': {
    // 포기하지 않는 노인 (노인과 바다)
    literal: { q: "산티아고 노인이 잡은 물고기는?", options: ["고래","상어","거대한 청새치","참치"], answer: 2, explanation: "산티아고 노인은 거대한 청새치(마린)를 잡았습니다." },
    structural: { q: "노인이 상어들과 싸운 이유는?", options: ["상어가 좋아서","잡은 청새치를 지키기 위해","장난으로","돈을 벌려고"], answer: 1, explanation: "노인은 힘들게 잡은 청새치를 상어들로부터 지키려 싸웠습니다." },
    lexical: { q: "'불굴'의 뜻으로 알맞은 것은?", options: ["쉽게 포기하는 것","굽히지 않고 꿋꿋이 버티는 것","도망치는 것","숨는 것"], answer: 1, explanation: "불굴은 어려움에 굽히지 않고 꿋꿋이 버티는 것입니다." },
    inferential: { q: "노인이 뼈만 남은 청새치를 가지고 돌아온 것이 의미하는 바는?", options: ["실패","결과보다 포기하지 않는 과정이 중요하다","쓸모없음","노인이 약해서"], answer: 1, explanation: "결과가 남지 않아도 포기하지 않은 과정 자체가 승리입니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["포기하는 것이 좋다","인간은 패배하지 않는다, 다만 파괴될 뿐이다","낚시는 쉽다","혼자 사는 것이 좋다"], answer: 1, explanation: "진정한 패배는 포기하는 것이지, 결과가 없는 것이 아닙니다." }
  },
  '36': {
    // 동물들의 혁명 (동물농장)
    literal: { q: "동물들이 혁명을 일으킨 이유는?", options: ["놀고 싶어서","인간의 착취에서 벗어나기 위해","음식이 맛없어서","농장이 싫어서"], answer: 1, explanation: "동물들은 인간 주인의 착취에서 벗어나기 위해 혁명을 일으켰습니다." },
    structural: { q: "혁명 후 농장이 변한 모습은?", options: ["모두 평등해짐","돼지들이 인간처럼 특권층이 됨","더 좋아짐","변화 없음"], answer: 1, explanation: "혁명 후 돼지들이 권력을 잡고 인간처럼 행동했습니다." },
    lexical: { q: "'독재'의 뜻으로 알맞은 것은?", options: ["민주주의","한 사람이나 집단이 모든 권력을 쥐고 휘두르는 것","평등","자유"], answer: 1, explanation: "독재는 한 사람이나 집단이 모든 권력을 휘두르는 것입니다." },
    inferential: { q: "오웰이 이 작품을 통해 비판하는 것은?", options: ["동물","혁명의 이상이 왜곡되어 독재로 변하는 것","농장 생활","음식"], answer: 1, explanation: "혁명의 이상이 왜곡되어 새로운 독재가 되는 것을 비판합니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["권력은 감시하지 않으면 부패한다","동물이 인간보다 낫다","혁명은 나쁘다","돼지가 똒똒하다"], answer: 0, explanation: "권력은 견제하지 않으면 부패하고 독재로 변할 수 있습니다." }
  },
  '37': {
    // 초록빛 불빛을 향해 (위대한 개츠비)
    literal: { q: "개츠비가 바라보는 초록빛 불빛은 누구의 집에 있나요?", options: ["닉","톰","데이지","조던"], answer: 2, explanation: "초록빛 불빛은 개츠비가 사랑하는 데이지의 집에 있습니다." },
    structural: { q: "개츠비가 부자가 된 이유는?", options: ["물려받아서","데이지를 다시 만나기 위해","운이 좋아서","공부를 잘해서"], answer: 1, explanation: "개츠비는 옛 연인 데이지를 되찾기 위해 부자가 되었습니다." },
    lexical: { q: "'아메리칸 드림'의 의미는?", options: ["미국에서 자는 것","노력하면 누구나 성공할 수 있다는 꿈","미국 여행","미국 음식"], answer: 1, explanation: "아메리칸 드림은 노력으로 성공할 수 있다는 믿음입니다." },
    inferential: { q: "개츠비의 비극이 말해주는 것은?", options: ["돈이면 다 된다","물질적 성공만으로는 진정한 행복을 얻을 수 없다","파티는 좋다","부자가 되기 쉽다"], answer: 1, explanation: "물질적 성공이 진정한 행복을 보장하지 않습니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["돈이 최고다","과거에 집착하면 안 되고 진정한 가치를 찾아야 한다","파티를 많이 하면 좋다","초록 불빛을 달아야 한다"], answer: 1, explanation: "과거에 집착하기보다 현재의 진정한 가치를 찾아야 합니다." }
  },
  '38': {
    // 정의를 위한 변호 (앵무새 죽이기)
    literal: { q: "애티커스 핀치의 직업은?", options: ["의사","변호사","선생님","경찰"], answer: 1, explanation: "애티커스 핀치는 변호사입니다." },
    structural: { q: "애티커스가 톰 로빈슨을 변호한 이유는?", options: ["돈 때문에","무고한 사람을 정의를 위해 변호해야 하므로","강요당해서","친구여서"], answer: 1, explanation: "무고한 사람을 위해 정의를 실천하기 위함이었습니다." },
    lexical: { q: "'편견'의 뜻으로 알맞은 것은?", options: ["공정한 판단","한쪽으로 치우친 잘못된 생각","좋은 인상","정확한 정보"], answer: 1, explanation: "편견은 한쪽으로 치우친 잘못된 생각입니다." },
    inferential: { q: "스카웃이 아버지를 통해 배운 것은?", options: ["싸우는 법","용기와 정의, 편견 없이 사람을 대하는 것","돈 버는 법","거짓말하는 법"], answer: 1, explanation: "스카웃은 아버지를 통해 용기와 정의를 배웠습니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["편견에 맞서 정의를 실천하는 것이 중요하다","다수가 항상 옳다","소수는 무시해도 된다","법은 항상 공정하다"], answer: 0, explanation: "편견에 맞서 정의를 실천하는 용기가 중요합니다." }
  },
  '39': {
    // 빅 브라더가 보고 있다 (1984)
    literal: { q: "'빅 브라더'가 의미하는 것은?", options: ["친절한 형","모든 것을 감시하는 독재 권력","좋은 친구","선생님"], answer: 1, explanation: "빅 브라더는 모든 것을 감시하는 독재 권력을 상징합니다." },
    structural: { q: "윈스턴이 저항하려 한 것은?", options: ["음식","당의 감시와 사상 통제","날씨","운동"], answer: 1, explanation: "윈스턴은 당의 전체주의적 감시와 통제에 저항하려 했습니다." },
    lexical: { q: "'전체주의'의 뜻으로 알맞은 것은?", options: ["모두가 자유로운 것","국가가 개인의 모든 것을 통제하는 체제","민주주의","평등"], answer: 1, explanation: "전체주의는 국가가 개인의 모든 것을 통제하는 체제입니다." },
    inferential: { q: "오웰이 이 작품을 통해 경고하는 것은?", options: ["기술 발전","개인의 자유가 억압되는 전체주의의 위험성","여행","음식"], answer: 1, explanation: "개인의 자유가 억압되는 전체주의의 위험성을 경고합니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["자유와 진실을 지키는 것이 중요하다","감시당하는 것이 좋다","생각하면 안 된다","권력에 복종해야 한다"], answer: 0, explanation: "개인의 자유와 진실을 지키는 것이 중요합니다." }
  },
  '40': {
    // 소년들의 섬 (파리대왕)
    literal: { q: "소년들이 무인도에 오게 된 경위는?", options: ["여행 중","비행기 추락 사고로","배가 침몰해서","자발적으로"], answer: 1, explanation: "소년들은 비행기 추락 사고로 무인도에 오게 되었습니다." },
    structural: { q: "소년들 사이에서 일어난 갈등은?", options: ["음식 싸움","문명과 질서를 지키려는 랄프와 야만적 본능을 따르는 잭의 대립","놀이 싸움","공부 싸움"], answer: 1, explanation: "랄프의 질서와 잭의 야만적 본능이 대립했습니다." },
    lexical: { q: "'야만'의 뜻으로 알맞은 것은?", options: ["문명적인 것","교양이 없고 거친 상태","친절한 것","똑똑한 것"], answer: 1, explanation: "야만은 교양이 없고 거친 상태입니다." },
    inferential: { q: "골딩이 이 작품을 통해 말하고자 한 것은?", options: ["섬 생활이 좋다","인간 내면에 숨어있는 악의 본성","아이들이 착하다","어른이 필요 없다"], answer: 1, explanation: "인간 내면에 잠재된 악의 본성을 보여줍니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["문명과 규칙이 없으면 인간은 야만으로 돌아갈 수 있다","무인도 생활이 좋다","아이들끼리 살면 좋다","규칙은 필요 없다"], answer: 0, explanation: "문명과 규칙이 인간의 야만적 본성을 억제합니다." }
  }
};

// 새로운 openRemedial 함수 (on_world1_01과 동일한 형식)
const newOpenRemedialFunc = `
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
      const body = document.getElementById('remedial-panel-body');
      if (!body) return;
      for (const key in REMEDIAL_BANK) {
        const data = REMEDIAL_BANK[key];
        if (!data || !data.problems || !data.problems[0]) continue;
        const p = data.problems[0];
        const inputs = body.querySelectorAll(\`input[name="\${key}"]\`);
        if (!inputs.length) continue;
        let selected = -1;
        inputs.forEach((inp, i) => { if (inp.checked) selected = parseInt(inp.value); });
        const resultDiv = document.getElementById(\`\${key}-result\`);
        if (!resultDiv) continue;
        if (selected === -1) {
          resultDiv.innerHTML = '<span style="color:#666;font-size:12px;">답을 선택해주세요.</span>';
        } else if (selected === p.answer) {
          resultDiv.innerHTML = \`<span style="color:#157347;font-size:12px;">정답입니다 ✅</span><br><span style="color:#555;font-size:11px;">\${p.explanation}</span>\`;
        } else {
          resultDiv.innerHTML = \`<span style="color:#b3261e;font-size:12px;">틀렸어요 ❌ 정답: \${NUM_CIRCLE[p.answer]} \${p.options[p.answer]}</span><br><span style="color:#555;font-size:11px;">\${p.explanation}</span>\`;
        }
      }
    }

    // 보완학습 다시풀기
    function resetRemedial() {
      const body = document.getElementById('remedial-panel-body');
      if (!body) return;
      body.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
      for (const key in REMEDIAL_BANK) {
        const resultDiv = document.getElementById(\`\${key}-result\`);
        if (resultDiv) resultDiv.innerHTML = '';
      }
    }
`;

// on_world2_21 ~ on_world2_40 파일 처리
for (let i = 21; i <= 40; i++) {
  const num = i.toString().padStart(2, '0');
  const filename = `on_world2_${num}.html`;
  const filepath = path.join(worldlitDir, filename);

  if (!fs.existsSync(filepath)) {
    console.log(`❌ 파일 없음: ${filename}`);
    continue;
  }

  let content = fs.readFileSync(filepath, 'utf8');
  const remedialData = REMEDIAL_DATA[num];

  if (!remedialData) {
    console.log(`⚠️ 보완학습 데이터 없음: ${filename}`);
    continue;
  }

  // 새로운 REMEDIAL_BANK 생성
  const newRemedialBank = `
    // ===== 보완학습 문제 뱅크 (각 지수별 1문제, 해설 포함) =====
    const REMEDIAL_BANK = {
      literal: {
        title: "보완학습 | 핵심 이해력",
        problems: [
          { q: "${remedialData.literal.q}", options: ${JSON.stringify(remedialData.literal.options)}, answer: ${remedialData.literal.answer}, explanation: "${remedialData.literal.explanation}" }
        ]
      },
      structural: {
        title: "보완학습 | 구조 파악력",
        problems: [
          { q: "${remedialData.structural.q}", options: ${JSON.stringify(remedialData.structural.options)}, answer: ${remedialData.structural.answer}, explanation: "${remedialData.structural.explanation}" }
        ]
      },
      lexical: {
        title: "보완학습 | 어휘 맥락력",
        problems: [
          { q: "${remedialData.lexical.q}", options: ${JSON.stringify(remedialData.lexical.options)}, answer: ${remedialData.lexical.answer}, explanation: "${remedialData.lexical.explanation}" }
        ]
      },
      inferential: {
        title: "보완학습 | 추론·통합력",
        problems: [
          { q: "${remedialData.inferential.q}", options: ${JSON.stringify(remedialData.inferential.options)}, answer: ${remedialData.inferential.answer}, explanation: "${remedialData.inferential.explanation}" }
        ]
      },
      critical: {
        title: "보완학습 | 비판·적용력",
        problems: [
          { q: "${remedialData.critical.q}", options: ${JSON.stringify(remedialData.critical.options)}, answer: ${remedialData.critical.answer}, explanation: "${remedialData.critical.explanation}" }
        ]
      }
    };
`;

  // 기존 REMEDIAL_BANK 및 관련 함수 교체
  const oldPatternStart = /\/\/ ===== 보완학습 문제 뱅크.*?\n\s*const REMEDIAL_BANK = \{[\s\S]*?\};\s*\n\s*\/\/ ===== 보완학습 열기[\s\S]*?function resetRemedial\(\)[\s\S]*?\}\s*\n/;
  const oldPatternStart2 = /\/\*.*?임시 alert.*?\*\/\s*\n\s*\/\/ ===== 보완학습 문제 뱅크.*?\n\s*const REMEDIAL_BANK = \{[\s\S]*?\};\s*\n\s*\/\/ ===== 보완학습 열기[\s\S]*?function resetRemedial\(\)[\s\S]*?\}\s*\n/;

  const replacement = newRemedialBank + newOpenRemedialFunc;

  if (content.match(oldPatternStart2)) {
    content = content.replace(oldPatternStart2, replacement);
  } else if (content.match(oldPatternStart)) {
    content = content.replace(oldPatternStart, replacement);
  } else {
    console.log(`⚠️ 패턴 매칭 실패: ${filename} - 수동 확인 필요`);
    continue;
  }

  // 보완학습 버튼 활성화 (display:none 제거)
  const btnPattern = /<button class="report-btn-remedial" onclick="openRemedial && openRemedial\(\)" style="display:none;">/g;
  const btnReplacement = '<button class="report-btn-remedial" onclick="openRemedial && openRemedial()" >';
  content = content.replace(btnPattern, btnReplacement);

  fs.writeFileSync(filepath, content, 'utf8');
  console.log(`✅ 수정 완료: ${filename}`);
}

console.log('\n🎉 온세계문학(2) 21~40 보완학습 구현 완료!');
console.log('- 각 지수별 문제 1개씩 (5개 지수)');
console.log('- 선지 번호 ①②③④ 표시');
console.log('- 해설(explanation) 포함');
console.log('- 보완학습하기 버튼 활성화');

const fs = require('fs');
const path = require('path');

const worldlitDir = path.join(__dirname, 'public/BRAINUP/worldlit');

// 각 단원별 보완학습 문제 (본문 내용 기반, 5개 지수별 1문제씩, 해설 포함)
const REMEDIAL_DATA = {
  '01': {
    // 텔의 용기와 두려움 (윌리엄 텔)
    literal: { q: "텔이 화살 두 개를 준비한 이유는?", options: ["사과를 두 개 맞히려고","아들이 다치면 총독을 쏘려고","활 솜씨를 자랑하려고","예비용으로 가져갔다"], answer: 1, explanation: "텔은 아들이 다치면 총독을 쏘려고 두 번째 화살을 준비했습니다." },
    structural: { q: "이 글의 전개 순서로 알맞은 것은?", options: ["총독의 분노→사과 맞히기→화살 두 개의 이유","사과 맞히기→총독의 분노→화살 준비","화살 준비→총독의 분노→사과 맞히기","화살 두 개의 이유→사과 맞히기→총독의 분노"], answer: 0, explanation: "총독이 화를 내고, 사과를 맞히고, 화살 두 개의 이유를 밝히는 순서입니다." },
    lexical: { q: "'묘안'의 뜻으로 알맞은 것은?", options: ["나쁜 계획","좋은 생각이나 방법","슬픈 감정","평범한 행동"], answer: 1, explanation: "묘안은 일을 잘 해결할 수 있는 좋은 생각이나 방법입니다." },
    inferential: { q: "텔이 총독 앞에서 고개를 숙이지 않은 이유로 추론할 수 있는 것은?", options: ["총독이 무서워서","자유를 향한 의지가 있어서","총독과 친해서","활을 쏘고 싶어서"], answer: 1, explanation: "텔은 굴복하지 않는 정신과 자유를 향한 의지를 가지고 있었습니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["두려움 앞에서 용기를 내면 극복할 수 있다","힘센 사람에게 무조건 복종해야 한다","혼자서 모든 것을 해결해야 한다","가족보다 자신이 더 중요하다"], answer: 0, explanation: "텔은 두려움 속에서도 용기를 내어 아들을 지키고 자유를 지켰습니다." }
  },
  '02': {
    // 소년들의 용기와 케이트의 눈물 (15소년 표류기)
    literal: { q: "케이트가 눈물을 글썽인 이유는?", options: ["소년들이 무서워서","어린 소년들의 용기와 협력에 감동해서","악당들에게 쫓겨서","배가 고파서"], answer: 1, explanation: "어린 소년들이 2년간 힘을 합쳐 살아남았다는 사실에 감동했습니다." },
    structural: { q: "브리앙이 드니팬 일행을 찾아가려 한 이유는?", options: ["싸우려고","그들이 악당들의 방향과 같아 위험해서","음식을 가져가려고","혼자 살려고"], answer: 1, explanation: "드니팬 일행이 떠난 방향이 악당들의 방향과 같아 위험했기 때문입니다." },
    lexical: { q: "'은신처'의 뜻으로 알맞은 것은?", options: ["적을 공격하는 곳","숨어 있거나 몸을 피할 수 있는 곳","음식을 저장하는 곳","배가 정박하는 곳"], answer: 1, explanation: "은신처는 숨어 있거나 몸을 피할 수 있는 곳입니다." },
    inferential: { q: "브리앙이 밤에 출발하기로 한 이유로 추론할 수 있는 것은?", options: ["낮에는 덥기 때문에","악당들에게 들키지 않으려고","밤이 더 시원해서","드니팬이 밤에만 깨어 있어서"], answer: 1, explanation: "악당들에게 들키지 않으려면 밤에 움직여야 했습니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["갈등보다 협력이 중요하다","혼자서 해결하는 것이 좋다","위험할 때는 도망가야 한다","과거의 갈등을 잊으면 안 된다"], answer: 0, explanation: "과거의 갈등을 넘어 협력하는 것이 모두를 지키는 길입니다." }
  },
  '03': {
    // 로빈 후드의 은밀한 재판
    literal: { q: "로빈 후드가 주교의 돈을 어떻게 나누었나요?", options: ["전부 자신이 가졌다","삼분의 일씩 만찬, 리처드 경, 주교에게 나누었다","절반은 주교, 절반은 리처드 경에게 주었다","전부 가난한 사람들에게 나누었다"], answer: 1, explanation: "삼분의 일씩 만찬 대가, 리처드 경, 주교에게 나누었습니다." },
    structural: { q: "이 글에서 주교의 부패가 드러난 장면은?", options: ["활쏘기를 할 때","금고에서 1500파운드가 발견되었을 때","만찬을 먹을 때","숲을 떠날 때"], answer: 1, explanation: "청빈하다던 주교의 금고에서 많은 돈이 발견되어 부패가 드러났습니다." },
    lexical: { q: "'저당'의 뜻으로 알맞은 것은?", options: ["돈을 빌릴 때 담보로 맡기는 것","선물을 주는 것","물건을 훔치는 것","빚을 갚는 것"], answer: 0, explanation: "저당은 돈을 빌릴 때 담보로 맡기는 것입니다." },
    inferential: { q: "로빈 후드가 '의적'으로 불리는 이유로 추론할 수 있는 것은?", options: ["부자들만 도와서","가난한 사람들을 위해 정의를 실천해서","법을 철저히 지켜서","왕의 명령을 따라서"], answer: 1, explanation: "부패한 권력자의 재물로 어려운 사람을 도우며 정의를 실천했습니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["어려운 사람을 돕는 것이 중요하다","부자는 항상 옳다","법은 무조건 따라야 한다","자신만 생각해야 한다"], answer: 0, explanation: "어려운 사람을 돕는 나눔과 정의가 중요하다는 교훈입니다." }
  },
  '04': {
    // 말괄량이 카타리나를 둘러싼 오해와 진실
    literal: { q: "카타리나가 '말괄량이'로 불린 이유는?", options: ["조용하고 얌전해서","성격이 거칠고 반항적이어서","공부를 잘해서","노래를 잘해서"], answer: 1, explanation: "카타리나는 거칠고 반항적인 성격 때문에 말괄량이로 불렸습니다." },
    structural: { q: "페트루키오가 카타리나를 대한 방식은?", options: ["무시하고 피했다","그녀의 말괄량이 행동을 거울처럼 보여주었다","소리를 지르며 싸웠다","도망갔다"], answer: 1, explanation: "페트루키오는 카타리나의 행동을 거울처럼 보여주어 깨닫게 했습니다." },
    lexical: { q: "'오해'의 뜻으로 알맞은 것은?", options: ["바르게 이해하는 것","잘못 이해하는 것","전혀 모르는 것","자세히 설명하는 것"], answer: 1, explanation: "오해는 상대방의 말이나 행동을 잘못 이해하는 것입니다." },
    inferential: { q: "카타리나가 변화한 이유로 추론할 수 있는 것은?", options: ["벌을 받아서","자신의 모습을 객관적으로 보게 되어서","돈을 받아서","부모님이 강요해서"], answer: 1, explanation: "페트루키오를 통해 자신의 모습을 보고 스스로 변화했습니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["자신을 돌아보면 변화할 수 있다","남의 말을 무시해야 한다","화를 내는 것이 좋다","변하지 않는 것이 좋다"], answer: 0, explanation: "자신의 모습을 객관적으로 보고 변화할 수 있다는 교훈입니다." }
  },
  '05': {
    // 올리버의 용기 있는 한마디 (올리버 트위스트)
    literal: { q: "올리버가 '죽 좀 더 주세요'라고 말한 이유는?", options: ["욕심이 많아서","배가 너무 고파서","장난을 치려고","다른 아이를 도우려고"], answer: 1, explanation: "올리버는 구빈원에서 배고픔을 견디다 못해 용기를 냈습니다." },
    structural: { q: "올리버의 말에 어른들이 보인 반응은?", options: ["칭찬했다","크게 화를 내고 벌을 주었다","더 많이 주었다","무시했다"], answer: 1, explanation: "어른들은 올리버의 말에 크게 화를 내고 벌을 주었습니다." },
    lexical: { q: "'구빈원'의 뜻으로 알맞은 것은?", options: ["부자들이 사는 곳","가난한 사람들을 수용하는 시설","학교","병원"], answer: 1, explanation: "구빈원은 가난한 사람들을 수용하던 시설입니다." },
    inferential: { q: "올리버의 행동이 용기 있다고 할 수 있는 이유는?", options: ["벌을 받을 것을 알면서도 말했기 때문에","아무도 신경 쓰지 않았기 때문에","쉬운 일이었기 때문에","다른 사람이 시켜서 한 일이기 때문에"], answer: 0, explanation: "벌을 받을 것을 알면서도 배고픔을 참지 못해 말한 것이 용기입니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["불합리한 것에 용기 있게 말할 수 있어야 한다","항상 참는 것이 좋다","어른 말은 무조건 따라야 한다","욕심을 부리면 안 된다"], answer: 0, explanation: "불합리한 상황에서 용기 있게 목소리를 내는 것이 중요합니다." }
  },
  '06': {
    // 자유를 찾아 떠난 소년 (허클베리 핀의 모험)
    literal: { q: "허클베리 핀이 집을 떠난 이유는?", options: ["여행을 하고 싶어서","아버지의 폭력과 속박에서 벗어나려고","친구를 만나러","학교에 가려고"], answer: 1, explanation: "핀은 아버지의 폭력과 속박에서 벗어나 자유를 찾아 떠났습니다." },
    structural: { q: "핀이 짐과 함께한 여정의 의미는?", options: ["단순한 놀이","인종을 넘어선 우정과 자유를 향한 여정","돈을 벌기 위한 일","복수를 위한 여행"], answer: 1, explanation: "핀과 짐의 여정은 인종을 넘어선 우정과 자유를 상징합니다." },
    lexical: { q: "'속박'의 뜻으로 알맞은 것은?", options: ["자유롭게 하는 것","얽매어 자유롭지 못하게 하는 것","도와주는 것","칭찬하는 것"], answer: 1, explanation: "속박은 얽매어 자유롭지 못하게 하는 것입니다." },
    inferential: { q: "핀이 짐을 돕기로 한 이유로 추론할 수 있는 것은?", options: ["돈을 받으려고","짐도 자유를 원하는 같은 처지였기 때문에","짐이 무서워서","다른 사람이 시켜서"], answer: 1, explanation: "핀은 짐도 자유를 원하는 같은 처지임을 알고 함께했습니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["진정한 자유는 서로를 존중하는 것에서 시작된다","혼자만 자유로우면 된다","규칙을 무조건 따라야 한다","편견을 가져도 괜찮다"], answer: 0, explanation: "서로를 존중하고 편견을 넘어서는 것이 진정한 자유입니다." }
  },
  '07': {
    // 잠든 정원이 깨어나다 (비밀의 화원)
    literal: { q: "메리가 비밀 정원을 발견하게 된 계기는?", options: ["지도를 보고","울새를 따라가다가","어른이 알려줘서","책에서 읽고"], answer: 1, explanation: "메리는 울새를 따라가다 비밀 정원의 열쇠와 문을 발견했습니다." },
    structural: { q: "정원을 가꾸면서 아이들에게 일어난 변화는?", options: ["더 아프게 되었다","몸과 마음이 건강해졌다","정원을 싫어하게 되었다","변화가 없었다"], answer: 1, explanation: "정원을 가꾸며 메리와 콜린 모두 몸과 마음이 건강해졌습니다." },
    lexical: { q: "'황폐하다'의 뜻으로 알맞은 것은?", options: ["아름답게 가꾸어진","거칠고 쓸쓸하게 버려진","새로 만들어진","깨끗하게 정리된"], answer: 1, explanation: "황폐하다는 거칠고 쓸쓸하게 버려진 상태를 뜻합니다." },
    inferential: { q: "비밀 정원이 '비밀'로 남아있던 이유로 추론할 수 있는 것은?", options: ["아무도 관심이 없어서","주인이 슬픈 기억 때문에 닫아두었기 때문에","정원이 너무 작아서","열쇠가 없어서"], answer: 1, explanation: "콜린의 어머니가 돌아가신 후 슬픔 때문에 닫혀 있었습니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["자연과 함께하면 마음이 치유될 수 있다","정원은 쓸모없다","혼자 있는 것이 좋다","변화는 나쁜 것이다"], answer: 0, explanation: "자연과 교감하며 마음의 상처가 치유될 수 있다는 교훈입니다." }
  },
  '08': {
    // 시간을 다투는 대모험 (80일간의 세계일주)
    literal: { q: "포그가 80일간 세계일주를 하게 된 이유는?", options: ["여행이 좋아서","내기에서 이기려고","도망치려고","일 때문에"], answer: 1, explanation: "포그는 80일 안에 세계일주가 가능하다는 내기를 했습니다." },
    structural: { q: "여행 중 겪은 주요 어려움은?", options: ["음식이 맛없어서","교통수단의 문제와 형사의 추적","날씨가 좋아서","돈이 너무 많아서"], answer: 1, explanation: "교통수단 문제와 형사 픽스의 추적으로 어려움을 겪었습니다." },
    lexical: { q: "'내기'의 뜻으로 알맞은 것은?", options: ["선물을 주는 것","승부를 겨루어 이긴 쪽이 상을 받는 것","함께 여행하는 것","약속을 지키는 것"], answer: 1, explanation: "내기는 승부를 겨루어 이긴 쪽이 상을 받는 것입니다." },
    inferential: { q: "포그가 끝까지 포기하지 않은 이유로 추론할 수 있는 것은?", options: ["벌을 받을까 봐","자신의 약속과 명예를 지키려고","다른 할 일이 없어서","파스파르투가 강요해서"], answer: 1, explanation: "포그는 자신의 약속과 명예를 지키기 위해 끝까지 노력했습니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["포기하지 않으면 불가능해 보이는 일도 이룰 수 있다","내기는 나쁜 것이다","여행은 위험하다","혼자서는 아무것도 못한다"], answer: 0, explanation: "끝까지 포기하지 않으면 목표를 달성할 수 있다는 교훈입니다." }
  },
  '09': {
    // 신비로운 바닷속 세계 (해저 2만리)
    literal: { q: "노틸러스호의 선장 이름은?", options: ["아로낙스","네드 랜드","네모","콩세유"], answer: 2, explanation: "노틸러스호의 선장은 네모 선장입니다." },
    structural: { q: "아로낙스 일행이 노틸러스호에 머물게 된 상황은?", options: ["자발적으로 승선했다","구조되었지만 떠나지 못하게 되었다","여행 상품을 구매했다","선장의 친구여서"], answer: 1, explanation: "바다에서 구조되었지만 비밀 유지를 위해 떠나지 못했습니다." },
    lexical: { q: "'잠수함'의 뜻으로 알맞은 것은?", options: ["하늘을 나는 배","물속으로 다닐 수 있는 배","육지를 달리는 배","작은 보트"], answer: 1, explanation: "잠수함은 물속으로 다닐 수 있는 배입니다." },
    inferential: { q: "네모 선장이 육지를 떠나 바다에서 사는 이유로 추론할 수 있는 것은?", options: ["수영을 좋아해서","육지 세상에 대한 분노와 실망 때문에","돈을 벌려고","친구들과 놀려고"], answer: 1, explanation: "네모 선장은 육지 세상에 대한 분노와 실망으로 바다를 선택했습니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["미지의 세계에 대한 호기심과 탐구 정신이 중요하다","바다는 위험하니 가면 안 된다","과학 기술은 나쁘다","혼자 사는 것이 좋다"], answer: 0, explanation: "미지의 세계에 대한 호기심과 탐구 정신의 중요성을 보여줍니다." }
  },
  '10': {
    // 바뀐 운명, 바뀐 세상 (왕자와 거지)
    literal: { q: "왕자와 거지가 서로 옷을 바꾼 이유는?", options: ["도망치려고","서로의 삶이 궁금해서","부모님이 시켜서","벌을 받아서"], answer: 1, explanation: "왕자와 거지는 서로의 삶이 궁금해서 옷을 바꾸었습니다." },
    structural: { q: "옷을 바꾼 후 두 소년에게 일어난 일은?", options: ["바로 다시 바꾸었다","서로의 삶을 살게 되었다","함께 도망쳤다","아무 일도 없었다"], answer: 1, explanation: "옷을 바꾼 후 왕자는 거지로, 거지는 왕자로 살게 되었습니다." },
    lexical: { q: "'신분'의 뜻으로 알맞은 것은?", options: ["키와 몸무게","사회에서의 지위나 계급","이름","나이"], answer: 1, explanation: "신분은 사회에서의 지위나 계급을 뜻합니다." },
    inferential: { q: "왕자가 거지의 삶을 경험하며 느낀 것으로 추론할 수 있는 것은?", options: ["거지 생활이 더 좋다","가난한 백성들의 고통을 알게 되었다","왕이 되고 싶지 않다","아무것도 느끼지 못했다"], answer: 1, explanation: "왕자는 거지로 살며 가난한 백성들의 고통을 직접 경험했습니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["다른 사람의 처지를 이해하려면 그 입장이 되어봐야 한다","신분은 바꿀 수 없다","가난한 사람은 도울 필요 없다","왕은 백성을 몰라도 된다"], answer: 0, explanation: "다른 사람의 입장이 되어봐야 진정으로 이해할 수 있습니다." }
  },
  '11': {
    // 미시시피 강의 장난꾸러기 (톰 소여의 모험)
    literal: { q: "톰 소여가 울타리 페인트칠을 친구들에게 시킨 방법은?", options: ["돈을 주고","협박해서","재미있는 일인 것처럼 꾸며서","선생님이 시켜서"], answer: 2, explanation: "톰은 페인트칠이 특별하고 재미있는 일인 것처럼 친구들을 속였습니다." },
    structural: { q: "톰이 벌을 기회로 바꾼 과정은?", options: ["도망쳤다","벌을 재미있는 특권으로 포장했다","울었다","어른에게 부탁했다"], answer: 1, explanation: "톰은 벌인 페인트칠을 특별한 기회처럼 포장하여 친구들이 하고 싶게 만들었습니다." },
    lexical: { q: "'꾀'의 뜻으로 알맞은 것은?", options: ["힘","영리하게 일을 처리하는 슬기","돈","친구"], answer: 1, explanation: "꾀는 영리하게 일을 처리하는 슬기입니다." },
    inferential: { q: "톰의 행동에서 알 수 있는 그의 성격은?", options: ["소심하고 겁이 많다","영리하고 재치 있다","게으르고 무책임하다","착하고 정직하다"], answer: 1, explanation: "톰은 영리하고 재치 있게 상황을 자신에게 유리하게 바꾸었습니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["생각을 바꾸면 어려운 상황도 기회가 될 수 있다","거짓말은 항상 좋다","일은 남에게 시키는 것이 좋다","벌은 피해야 한다"], answer: 0, explanation: "관점을 바꾸면 어려운 상황도 기회로 만들 수 있다는 교훈입니다." }
  },
  '12': {
    // 정글의 아이 모글리 (정글북)
    literal: { q: "모글리를 키운 동물은?", options: ["호랑이","늑대","곰","표범"], answer: 1, explanation: "모글리는 늑대 가족에게 키워졌습니다." },
    structural: { q: "시어 칸이 모글리를 노리는 이유는?", options: ["친구가 되고 싶어서","인간 아이를 먹으려고","정글을 떠나라고","장난을 치려고"], answer: 1, explanation: "호랑이 시어 칸은 인간 아이 모글리를 먹으려고 노렸습니다." },
    lexical: { q: "'정글의 법'이 의미하는 것은?", options: ["정글에서의 규칙과 질서","책 이름","호랑이의 명령","인간의 법률"], answer: 0, explanation: "정글의 법은 정글에서 살아가는 동물들의 규칙과 질서입니다." },
    inferential: { q: "모글리가 정글에서 살아남을 수 있었던 이유로 추론할 수 있는 것은?", options: ["혼자 강해서","늑대 가족과 친구들의 도움 덕분에","시어 칸이 도와줘서","정글이 안전해서"], answer: 1, explanation: "늑대 가족, 곰 발루, 표범 바기라 등의 도움으로 살아남았습니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["가족과 공동체의 소중함","혼자 사는 것이 좋다","동물은 위험하다","인간만이 최고다"], answer: 0, explanation: "가족과 공동체의 사랑과 보호가 중요하다는 교훈입니다." }
  },
  '13': {
    // 영원히 자라지 않는 소년 (피터 팬)
    literal: { q: "피터 팬이 사는 곳은?", options: ["런던","네버랜드","바다","숲속"], answer: 1, explanation: "피터 팬은 네버랜드에서 살고 있습니다." },
    structural: { q: "웬디가 피터 팬을 따라간 이유는?", options: ["부모님이 싫어서","신비로운 모험에 대한 호기심 때문에","학교가 싫어서","동생들이 가자고 해서"], answer: 1, explanation: "웬디는 신비로운 네버랜드와 모험에 대한 호기심으로 따라갔습니다." },
    lexical: { q: "'영원히'의 뜻으로 알맞은 것은?", options: ["잠깐 동안","끝없이 오래도록","한 번만","가끔"], answer: 1, explanation: "영원히는 끝없이 오래도록을 뜻합니다." },
    inferential: { q: "피터 팬이 어른이 되지 않으려는 이유로 추론할 수 있는 것은?", options: ["병에 걸려서","어른이 되면 잃어버리는 것들이 싫어서","방법을 몰라서","웬디가 싫어해서"], answer: 1, explanation: "피터 팬은 어른이 되면 잃어버리는 순수함과 자유를 지키고 싶었습니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["어린 시절의 순수함과 상상력을 소중히 해야 한다","어른이 되면 안 된다","현실은 중요하지 않다","모험은 위험하다"], answer: 0, explanation: "어린 시절의 순수함과 상상력의 소중함을 보여줍니다." }
  },
  '14': {
    // 보물을 찾아 떠난 모험 (보물섬)
    literal: { q: "짐이 보물 지도를 얻게 된 경위는?", options: ["직접 그렸다","죽은 해적에게서 얻었다","가게에서 샀다","친구에게 받았다"], answer: 1, explanation: "짐은 여관에서 죽은 해적에게서 보물 지도를 얻었습니다." },
    structural: { q: "항해 중 짐이 알게 된 사실은?", options: ["보물이 없다는 것","롱 존 실버 일당이 해적이라는 것","배가 고장났다는 것","섬이 사라졌다는 것"], answer: 1, explanation: "짐은 롱 존 실버 일당이 해적임을 알게 되었습니다." },
    lexical: { q: "'반란'의 뜻으로 알맞은 것은?", options: ["순종하는 것","권위에 맞서 일어나는 것","도망치는 것","숨는 것"], answer: 1, explanation: "반란은 권위나 권력에 맞서 일어나는 것입니다." },
    inferential: { q: "짐이 위험을 무릅쓰고 모험을 계속한 이유로 추론할 수 있는 것은?", options: ["돈이 필요해서만","용기와 정의감, 호기심 때문에","도망칠 수 없어서","어른들이 시켜서"], answer: 1, explanation: "짐은 용기와 정의감, 모험에 대한 호기심으로 끝까지 싸웠습니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["용기를 가지고 어려움에 맞서면 이겨낼 수 있다","보물만 중요하다","어른 말은 무조건 들어야 한다","모험은 피해야 한다"], answer: 0, explanation: "용기를 가지고 어려움에 맞서는 것이 중요하다는 교훈입니다." }
  },
  '15': {
    // 무지개 너머 마법의 나라 (오즈의 마법사)
    literal: { q: "도로시가 오즈의 나라에 가게 된 이유는?", options: ["비행기를 타고","회오리바람에 휩쓸려서","걸어서","배를 타고"], answer: 1, explanation: "도로시는 회오리바람에 휩쓸려 오즈의 나라에 가게 되었습니다." },
    structural: { q: "도로시의 친구들이 마법사에게 원한 것은?", options: ["돈","허수아비는 뇌, 양철 나무꾼은 심장, 겁쟁이 사자는 용기","음식","집"], answer: 1, explanation: "허수아비는 뇌를, 양철 나무꾼은 심장을, 사자는 용기를 원했습니다." },
    lexical: { q: "'용기'의 뜻으로 알맞은 것은?", options: ["두려움","씩씩하고 굳센 마음","슬픔","게으름"], answer: 1, explanation: "용기는 씩씩하고 굳센 마음입니다." },
    inferential: { q: "친구들이 이미 원하는 것을 가지고 있었다는 것의 의미는?", options: ["마법사가 거짓말을 했다","스스로 깨닫지 못했을 뿐 이미 가지고 있었다","아무것도 못 얻었다","오즈가 주었다"], answer: 1, explanation: "친구들은 여정을 통해 이미 가지고 있던 것을 깨달았습니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["원하는 것은 이미 내 안에 있을 수 있다","마법이 모든 것을 해결한다","집은 중요하지 않다","친구는 필요 없다"], answer: 0, explanation: "원하는 것은 이미 내 안에 있으며 스스로 깨달아야 한다는 교훈입니다." }
  },
  '16': {
    // 두 얼굴을 가진 의사 (지킬 박사와 하이드)
    literal: { q: "지킬 박사가 만든 약의 효과는?", options: ["병을 치료한다","선한 자아와 악한 자아를 분리한다","젊어지게 한다","힘이 세진다"], answer: 1, explanation: "지킬 박사의 약은 선한 자아와 악한 자아를 분리시켰습니다." },
    structural: { q: "하이드가 점점 강해진 결과는?", options: ["지킬이 더 건강해졌다","지킬이 하이드를 통제할 수 없게 되었다","하이드가 사라졌다","둘이 친구가 되었다"], answer: 1, explanation: "하이드가 강해지면서 지킬은 통제력을 잃어갔습니다." },
    lexical: { q: "'이중성'의 뜻으로 알맞은 것은?", options: ["하나의 성격만 있는 것","두 가지 상반된 성질을 가진 것","성격이 없는 것","매우 착한 것"], answer: 1, explanation: "이중성은 두 가지 상반된 성질을 가진 것을 뜻합니다." },
    inferential: { q: "지킬 박사의 실험이 실패한 이유로 추론할 수 있는 것은?", options: ["약이 부족해서","인간의 선과 악은 분리할 수 없기 때문에","하이드가 도망가서","다른 사람이 방해해서"], answer: 1, explanation: "인간 내면의 선과 악은 분리할 수 없음을 보여줍니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["인간 내면의 어둠을 인정하고 조절해야 한다","악한 면을 없앨 수 있다","과학은 모든 것을 해결한다","선한 것만 가지면 된다"], answer: 0, explanation: "내면의 어둠을 인정하고 조절하는 것이 중요하다는 교훈입니다." }
  },
  '17': {
    // 네 자매의 성장 이야기 (작은 아씨들)
    literal: { q: "마치 가족의 네 자매 이름은?", options: ["메그, 조, 베스, 에이미","앨리스, 웬디, 도로시, 메리","제인, 사라, 엠마, 루시","안나, 엘사, 벨, 신데렐라"], answer: 0, explanation: "네 자매는 메그, 조, 베스, 에이미입니다." },
    structural: { q: "자매들이 가난 속에서도 행복할 수 있었던 이유는?", options: ["돈이 많아서","서로를 사랑하고 의지했기 때문에","아무것도 몰라서","혼자 살아서"], answer: 1, explanation: "자매들은 서로 사랑하고 의지하며 행복을 찾았습니다." },
    lexical: { q: "'성장'의 뜻으로 알맞은 것은?", options: ["줄어드는 것","자라서 발전하는 것","그대로 있는 것","사라지는 것"], answer: 1, explanation: "성장은 자라서 발전하는 것입니다." },
    inferential: { q: "조가 글쓰기를 계속한 이유로 추론할 수 있는 것은?", options: ["돈만 벌려고","자신의 꿈을 이루고 가족을 돕기 위해","할 일이 없어서","부모님이 시켜서"], answer: 1, explanation: "조는 자신의 꿈과 가족을 위해 글쓰기를 계속했습니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["가족의 사랑과 각자의 꿈을 향한 노력이 중요하다","돈이 가장 중요하다","혼자 사는 것이 좋다","꿈은 포기해야 한다"], answer: 0, explanation: "가족의 사랑과 꿈을 향한 노력의 중요성을 보여줍니다." }
  },
  '18': {
    // 황야의 비극적 사랑 (폭풍의 언덕)
    literal: { q: "히스클리프가 어린 시절 겪은 일은?", options: ["왕자로 자랐다","고아로 언쇼 가문에 입양되었다","부자 집에서 태어났다","행복하게 자랐다"], answer: 1, explanation: "히스클리프는 고아로 언쇼 가문에 입양되어 자랐습니다." },
    structural: { q: "히스클리프와 캐서린의 관계가 비극으로 끝난 이유는?", options: ["서로 싫어해서","신분 차이와 오해 때문에","멀리 떠나서","행복해서"], answer: 1, explanation: "신분 차이와 오해로 인해 둘의 사랑은 비극으로 끝났습니다." },
    lexical: { q: "'복수'의 뜻으로 알맞은 것은?", options: ["용서하는 것","받은 해를 되갚아 주는 것","잊어버리는 것","도와주는 것"], answer: 1, explanation: "복수는 받은 해를 되갚아 주는 것입니다." },
    inferential: { q: "히스클리프가 복수에 집착한 이유로 추론할 수 있는 것은?", options: ["재미있어서","어린 시절의 상처와 잃어버린 사랑 때문에","돈이 필요해서","다른 사람이 시켜서"], answer: 1, explanation: "어린 시절 받은 상처와 잃어버린 사랑이 복수심을 키웠습니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["복수와 증오는 결국 자신을 파괴한다","복수는 좋은 것이다","사랑은 중요하지 않다","상처는 잊으면 된다"], answer: 0, explanation: "복수와 증오는 결국 자신과 주변을 파괴한다는 교훈입니다." }
  },
  '19': {
    // 자존심을 지킨 여인 (오만과 편견)
    literal: { q: "엘리자베스가 처음에 다아시를 싫어한 이유는?", options: ["못생겨서","오만하고 거만해 보여서","가난해서","말을 안 해서"], answer: 1, explanation: "엘리자베스는 다아시가 오만하고 거만해 보여서 싫어했습니다." },
    structural: { q: "엘리자베스와 다아시의 관계가 변한 계기는?", options: ["돈을 받고","서로를 더 알게 되면서 편견이 사라지고","싸움을 해서","이사를 가서"], answer: 1, explanation: "서로를 알아가면서 오해와 편견이 사라졌습니다." },
    lexical: { q: "'편견'의 뜻으로 알맞은 것은?", options: ["바른 판단","한쪽으로 치우친 잘못된 생각","정확한 정보","좋은 인상"], answer: 1, explanation: "편견은 한쪽으로 치우친 잘못된 생각입니다." },
    inferential: { q: "엘리자베스가 자존심을 지킨 행동의 의미는?", options: ["거만한 것","자신의 가치를 알고 쉽게 굽히지 않는 것","무례한 것","포기하는 것"], answer: 1, explanation: "자신의 가치를 알고 당당하게 행동하는 것입니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["첫인상에 대한 편견을 버리고 상대를 이해해야 한다","첫인상이 가장 중요하다","자존심은 버려야 한다","부자만 좋은 사람이다"], answer: 0, explanation: "편견을 버리고 상대를 제대로 이해하는 것이 중요합니다." }
  },
  '20': {
    // 복수의 백작 (몬테크리스토 백작)
    literal: { q: "에드몽 단테스가 감옥에 갇힌 이유는?", options: ["범죄를 저질러서","누명을 쓰고 모함당해서","도망치다가","자수해서"], answer: 1, explanation: "에드몽은 억울한 누명을 쓰고 감옥에 갇혔습니다." },
    structural: { q: "감옥에서 에드몽이 얻은 것은?", options: ["아무것도 없다","파리아 신부에게서 지식과 보물 위치를 배웠다","병에 걸렸다","친구를 잃었다"], answer: 1, explanation: "파리아 신부에게서 지식과 보물의 위치를 알게 되었습니다." },
    lexical: { q: "'누명'의 뜻으로 알맞은 것은?", options: ["칭찬","억울하게 뒤집어쓴 죄","상","선물"], answer: 1, explanation: "누명은 억울하게 뒤집어쓴 죄입니다." },
    inferential: { q: "에드몽이 복수를 결심한 이유로 추론할 수 있는 것은?", options: ["재미있어서","자신을 모함한 자들에 대한 분노 때문에","돈이 필요해서","친구가 시켜서"], answer: 1, explanation: "자신을 모함하고 인생을 망친 자들에 대한 분노 때문입니다." },
    critical: { q: "이 글에서 배울 수 있는 교훈은?", options: ["복수는 달콤하지만 공허함을 남길 수 있다","복수는 항상 좋다","모함당하면 포기해야 한다","감옥은 좋은 곳이다"], answer: 0, explanation: "복수를 이루어도 공허함이 남을 수 있다는 교훈입니다." }
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

// on_world2_01 ~ on_world2_20 파일 처리
for (let i = 1; i <= 20; i++) {
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
  // 패턴: /* ======= (임시 alert 버전 openRemedial 삭제) ======= */ 부터 </script> 직전까지

  // 1. 기존 보완학습 관련 코드 블록 찾기 및 교체
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

  fs.writeFileSync(filepath, content, 'utf8');
  console.log(`✅ 수정 완료: ${filename}`);
}

console.log('\n🎉 온세계문학(2) 01~20 보완학습 구조 수정 완료!');
console.log('- 각 지수별 문제 1개씩 (5개 지수)');
console.log('- 선지 번호 ①②③④ 표시');
console.log('- 해설(explanation) 포함');

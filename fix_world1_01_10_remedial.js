const fs = require('fs');
const path = require('path');

// world1_01~10 보완학습 데이터 (on_world1 기준 작품명)
// 01: 데미안, 02: 15소년 표류기, 03: 꿀벌 마야의 모험, 04: 마술피리, 05: 어린 왕자
// 06: 보물섬, 07: 피노키오, 08: 오즈의 마법사, 09: 이상한 나라의 앨리스, 10: 정글북

const remedialData = {
  world1_01: { // 데미안
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "데미안이 싱클레어에게 전한 핵심 메시지는?", options: ["새는 알을 깨고 나온다","혼자 해결하라","두려워하지 마라","친구를 사귀어라"], answer: 0, explanation: "새로운 세계로 나아가려면 기존의 껍질을 깨야 한다는 의미입니다." },
        { q: "싱클레어가 데미안을 처음 만난 곳은?", options: ["학교","집","교회","시장"], answer: 0, explanation: "학교에서 데미안을 처음 만났습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "데미안의 서사 구조는?", options: ["성장 소설","영웅 소설","추리 소설","역사 소설"], answer: 0, explanation: "주인공의 내면적 성장을 다룬 성장 소설입니다." },
        { q: "'두 세계'가 의미하는 것은?", options: ["밝은 세계와 어두운 세계","한국과 외국","과거와 미래","현실과 꿈"], answer: 0, explanation: "선한 질서의 세계와 혼란스러운 세계를 의미합니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'아브락사스'의 의미는?", options: ["선악을 초월한 신","악마","천사","인간"], answer: 0, explanation: "선과 악을 모두 포함하는 신적 존재입니다." },
        { q: "'카인의 표'가 상징하는 것은?", options: ["다른 사람과 구별되는 표시","범죄자","영웅","신"], answer: 0, explanation: "평범한 사람들과 다른 특별한 존재를 상징합니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "싱클레어에게 데미안이 필요했던 이유는?", options: ["내면의 성장을 이끌어주는 인도자","돈을 빌려주는 친구","숙제를 도와주는 친구","운동을 가르쳐주는 친구"], answer: 0, explanation: "데미안은 싱클레어의 정신적 성장을 이끄는 인도자였습니다." },
        { q: "새가 알을 깨고 나오는 것의 의미는?", options: ["기존의 틀을 벗어나 성장함","물리적 탄생","죽음","실패"], answer: 0, explanation: "익숙한 세계를 벗어나 새로운 자신으로 성장하는 것입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "데미안이 청소년에게 주는 메시지는?", options: ["자기 자신을 찾아가라","어른 말을 따르라","친구를 많이 사귀어라","공부만 해라"], answer: 0, explanation: "진정한 자아를 찾아가는 것의 중요성을 전합니다." },
        { q: "이 작품의 문학사적 의의는?", options: ["내면 심리를 깊이 탐구","역사적 사실 기록","사회 풍자","자연 묘사"], answer: 0, explanation: "인간 내면의 심리를 깊이 있게 탐구한 작품입니다." }
      ]
    }
  },
  world1_02: { // 15소년 표류기
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "소년들이 무인도에서 생존한 방법은?", options: ["서로 협력함","어른의 도움을 받음","혼자서 해결함","배가 와서 구조됨"], answer: 0, explanation: "15명의 소년들이 서로 협력하여 무인도에서 생존했습니다." },
        { q: "소년들이 표류하게 된 원인은?", options: ["폭풍으로 배가 떠내려감","해적에게 습격","고장난 배","일부러 떠남"], answer: 0, explanation: "폭풍으로 인해 배가 표류하게 되었습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "15소년 표류기의 장르는?", options: ["모험 소설","공포 소설","로맨스","역사 소설"], answer: 0, explanation: "무인도에서의 생존을 다룬 모험 소설입니다." },
        { q: "소년들의 갈등과 화합은 어떤 역할을 하나?", options: ["성장의 계기","단순한 에피소드","배경 설명","결말 복선"], answer: 0, explanation: "갈등을 해결하며 소년들이 성장합니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'표류(漂流)'의 뜻은?", options: ["물 위에서 떠다님","수영함","침몰함","항해함"], answer: 0, explanation: "물 위를 떠다니며 흘러가는 것입니다." },
        { q: "'무인도(無人島)'의 의미는?", options: ["사람이 살지 않는 섬","사람이 많은 섬","큰 섬","작은 섬"], answer: 0, explanation: "사람이 살지 않는 섬을 말합니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "소년들이 위기를 극복할 수 있었던 힘은?", options: ["협동과 우정","개인의 능력만","운","어른의 지시"], answer: 0, explanation: "서로 협력하고 우정을 나누며 위기를 극복했습니다." },
        { q: "리더십이 중요했던 이유는?", options: ["질서를 유지하고 역할을 분담하기 위해","혼자 결정하기 위해","명령하기 위해","싸우기 위해"], answer: 0, explanation: "집단을 이끌고 역할을 분담하는 데 필요했습니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "이 작품이 전하는 가치는?", options: ["협동과 용기","개인주의","물질적 성공","경쟁"], answer: 0, explanation: "협동과 용기의 중요성을 전합니다." },
        { q: "현대 사회에 주는 교훈은?", options: ["함께 힘을 합치면 어려움을 극복할 수 있다","혼자가 최고다","어른에게만 의지하라","포기해라"], answer: 0, explanation: "협력의 힘으로 어려움을 극복할 수 있음을 보여줍니다." }
      ]
    }
  },
  world1_03: { // 꿀벌 마야의 모험
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "마야가 모험을 통해 얻은 것은?", options: ["성장과 지혜","꿀","친구","집"], answer: 0, explanation: "마야는 모험을 통해 어린 꿀벌에서 성장하고 지혜를 얻었습니다." },
        { q: "마야가 벌집을 떠난 이유는?", options: ["바깥세상이 궁금해서","쫓겨나서","꿀을 찾으러","친구를 만나러"], answer: 0, explanation: "호기심 많은 마야는 바깥세상이 궁금했습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "꿀벌 마야의 모험의 장르는?", options: ["동화/우화","역사 소설","추리 소설","공포 소설"], answer: 0, explanation: "동물을 의인화한 동화입니다." },
        { q: "마야의 여정은 어떤 구조인가?", options: ["출발-모험-귀환","기승전결","순환 구조","열린 결말"], answer: 0, explanation: "집을 떠나 모험하고 다시 돌아오는 구조입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'모험(冒險)'의 뜻은?", options: ["위험을 무릅쓰고 행함","안전하게 지냄","쉬는 것","일하는 것"], answer: 0, explanation: "위험을 무릅쓰고 새로운 일을 하는 것입니다." },
        { q: "'호기심(好奇心)'의 의미는?", options: ["새로운 것을 알고 싶어하는 마음","두려운 마음","슬픈 마음","화난 마음"], answer: 0, explanation: "새롭고 신기한 것에 관심을 갖는 마음입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "마야가 벌집으로 돌아온 이유는?", options: ["공동체의 소중함을 깨달아서","강제로 끌려와서","먹이가 없어서","길을 잃어서"], answer: 0, explanation: "모험 끝에 공동체의 소중함을 알게 되었습니다." },
        { q: "마야의 모험이 주는 의미는?", options: ["경험을 통한 성장","단순한 재미","위험의 경고","집의 편안함"], answer: 0, explanation: "직접 경험하며 성장하는 것의 가치를 보여줍니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "이 작품이 어린이에게 전하는 메시지는?", options: ["호기심을 갖고 세상을 탐험하라","집에만 있어라","위험한 곳에 가지 마라","어른 말만 들어라"], answer: 0, explanation: "호기심을 갖고 세상을 경험하라는 메시지입니다." },
        { q: "동화에서 동물 의인화의 효과는?", options: ["친근하게 교훈을 전달","현실감 증가","공포감 조성","역사 기록"], answer: 0, explanation: "동물을 통해 친근하게 교훈을 전달합니다." }
      ]
    }
  },
  world1_04: { // 마술피리
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "타미노가 마술피리를 사용한 목적은?", options: ["위기를 극복하기 위해","연주하려고","팔려고","숨기려고"], answer: 0, explanation: "마술피리로 위험을 물리치고 시련을 극복했습니다." },
        { q: "타미노가 구하려 한 사람은?", options: ["파미나 공주","밤의 여왕","파파게노","자라스트로"], answer: 0, explanation: "파미나 공주를 구하러 갔습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "마술피리의 장르는?", options: ["오페라(음악극)","소설","시","수필"], answer: 0, explanation: "모차르트가 작곡한 오페라입니다." },
        { q: "선과 악의 대립 구조에서 최종 승리자는?", options: ["자라스트로(선)","밤의 여왕(악)","타미노","파파게노"], answer: 0, explanation: "선의 상징인 자라스트로가 승리합니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'마술(魔術)'의 뜻은?", options: ["신비한 힘을 부리는 기술","요리 기술","운동 기술","공부 기술"], answer: 0, explanation: "신비롭고 초자연적인 힘을 사용하는 것입니다." },
        { q: "'시련(試鍊)'의 의미는?", options: ["어려운 시험과 고난","즐거운 일","쉬운 일","일상적인 일"], answer: 0, explanation: "능력이나 자격을 시험받는 어려운 과정입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "타미노가 시련을 통과한 의미는?", options: ["진정한 사랑과 용기를 증명","단순한 통과 의례","실패","포기"], answer: 0, explanation: "시련을 통해 진정한 자격을 갖추었음을 증명했습니다." },
        { q: "마술피리가 상징하는 것은?", options: ["예술과 조화의 힘","무기","돈","권력"], answer: 0, explanation: "음악(예술)이 가진 조화와 치유의 힘을 상징합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "마술피리가 전하는 가치는?", options: ["사랑, 용기, 진실의 승리","복수의 정당성","물질적 성공","권력의 중요성"], answer: 0, explanation: "사랑과 용기, 진실이 결국 승리한다는 가치입니다." },
        { q: "오페라라는 형식의 효과는?", options: ["음악으로 감동을 극대화","글로만 전달","그림으로만 전달","대사 없이 진행"], answer: 0, explanation: "음악이 더해져 감동이 극대화됩니다." }
      ]
    }
  },
  world1_05: { // 어린 왕자
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "여우가 어린 왕자에게 부탁한 것은?", options: ["길들여 달라","먹이를 달라","집을 지어달라","떠나달라"], answer: 0, explanation: "여우는 어린 왕자에게 자신을 길들여 달라고 부탁했습니다." },
        { q: "어린 왕자가 지구에 온 이유는?", options: ["장미와의 갈등으로 떠남","추방당함","여행이 목적","일하러 옴"], answer: 0, explanation: "자신의 별에 있던 장미와 갈등 후 여행을 떠났습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "어린 왕자의 장르는?", options: ["우화/철학적 동화","역사 소설","추리 소설","공포 소설"], answer: 0, explanation: "상징과 철학적 메시지를 담은 우화입니다." },
        { q: "여러 별을 여행하는 구조의 의미는?", options: ["다양한 인간 유형을 보여줌","단순한 이동","시간 순서","지리 설명"], answer: 0, explanation: "각 별의 어른들은 다양한 인간 유형을 상징합니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'길들이다'의 의미는?", options: ["관계를 맺어 특별해지다","명령하다","싸우다","떠나다"], answer: 0, explanation: "서로 관계를 맺어 서로에게 특별한 존재가 되는 것입니다." },
        { q: "'본질(本質)'의 뜻은?", options: ["가장 중요한 핵심","겉모습","크기","색깔"], answer: 0, explanation: "사물의 가장 근본적이고 핵심적인 성질입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "'가장 중요한 것은 눈에 보이지 않아'의 의미는?", options: ["진정한 가치는 마음으로 봐야 함","눈을 감아라","어둠 속에 있다","숨겨져 있다"], answer: 0, explanation: "눈에 보이는 것보다 마음으로 느끼는 것이 중요합니다." },
        { q: "어린 왕자가 자기 별로 돌아간 이유는?", options: ["장미에 대한 책임감","싫어서","강제로","우연히"], answer: 0, explanation: "자신이 길들인 장미에 대한 책임을 다하기 위해서입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "어린 왕자가 비판하는 어른의 모습은?", options: ["본질을 잃고 허영에 빠진 모습","열심히 일하는 모습","친절한 모습","검소한 모습"], answer: 0, explanation: "숫자, 권력, 허영에 빠진 어른들을 비판합니다." },
        { q: "이 작품이 현대인에게 주는 메시지는?", options: ["진정으로 소중한 것을 돌아보라","돈을 많이 벌어라","바쁘게 살아라","혼자 살아라"], answer: 0, explanation: "삶에서 진정으로 소중한 것이 무엇인지 성찰하게 합니다." }
      ]
    }
  },
  world1_06: { // 보물섬
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "짐 호킨스가 보물 지도를 얻은 경위는?", options: ["빌리 본즈의 짐에서","바다에서 주워서","직접 그려서","가게에서 사서"], answer: 0, explanation: "선원 빌리 본즈가 남긴 짐에서 보물 지도를 발견했습니다." },
        { q: "롱 존 실버의 정체는?", options: ["해적","선장","상인","어부"], answer: 0, explanation: "한쪽 다리가 없는 해적입니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "보물섬의 장르는?", options: ["모험 소설","로맨스","역사 소설","공포 소설"], answer: 0, explanation: "보물을 찾아 떠나는 모험 소설입니다." },
        { q: "짐 호킨스의 역할은?", options: ["주인공이자 화자","조연","악역","배경 인물"], answer: 0, explanation: "이야기를 이끄는 주인공이자 화자입니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'해적(海賊)'의 뜻은?", options: ["바다에서 약탈하는 도적","어부","선원","상인"], answer: 0, explanation: "바다에서 배를 습격하여 약탈하는 도적입니다." },
        { q: "'보물(寶物)'의 의미는?", options: ["귀중한 물건","쓸모없는 것","평범한 것","위험한 것"], answer: 0, explanation: "매우 귀중하고 값진 물건입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "짐이 모험을 통해 얻은 것은?", options: ["성장과 용기","보물만","친구만","아무것도 없음"], answer: 0, explanation: "보물뿐 아니라 모험을 통해 성장하고 용기를 얻었습니다." },
        { q: "롱 존 실버가 매력적인 악역인 이유는?", options: ["악하지만 지혜롭고 복잡한 인물","단순한 악당","완전한 선인","무능한 인물"], answer: 0, explanation: "단순한 악당이 아닌 복잡하고 입체적인 인물입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "보물섬이 전하는 메시지는?", options: ["모험과 도전의 가치","돈이 최고","범죄도 괜찮다","위험을 피해라"], answer: 0, explanation: "모험과 도전을 통한 성장의 가치를 전합니다." },
        { q: "모험 소설의 매력은?", options: ["일상을 벗어난 흥미진진함","지루함","교훈만 있음","현실적임"], answer: 0, explanation: "일상에서 경험할 수 없는 흥미진진한 이야기입니다." }
      ]
    }
  },
  world1_07: { // 피노키오
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "피노키오가 거짓말을 하면 어떻게 되었나?", options: ["코가 길어짐","키가 커짐","눈이 커짐","귀가 커짐"], answer: 0, explanation: "피노키오는 거짓말을 할 때마다 코가 길어졌습니다." },
        { q: "피노키오를 만든 사람은?", options: ["제페토 할아버지","요정","왕","마법사"], answer: 0, explanation: "목수인 제페토 할아버지가 만들었습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "피노키오의 장르는?", options: ["동화/우화","역사 소설","추리 소설","로맨스"], answer: 0, explanation: "교훈을 담은 동화입니다." },
        { q: "피노키오가 진짜 소년이 되는 과정은?", options: ["시련을 겪으며 성장함","처음부터 소년임","마법으로 갑자기","꿈에서만"], answer: 0, explanation: "여러 시련을 겪으며 진정한 소년으로 성장합니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'양심(良心)'의 뜻은?", options: ["옳고 그름을 판단하는 마음","욕심","슬픔","분노"], answer: 0, explanation: "선악을 구별하고 옳은 일을 하려는 마음입니다." },
        { q: "'유혹(誘惑)'의 의미는?", options: ["나쁜 길로 꾀어냄","도와줌","가르침","칭찬함"], answer: 0, explanation: "좋지 않은 방향으로 마음을 끄는 것입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "피노키오가 진짜 소년이 될 수 있었던 이유는?", options: ["정직하고 착하게 변했기 때문","거짓말을 잘해서","도망을 잘 다녀서","운이 좋아서"], answer: 0, explanation: "정직하고 착한 마음을 갖게 되어 진짜 소년이 되었습니다." },
        { q: "귀뚜라미(지미니)의 역할은?", options: ["양심의 목소리","악역","주인공","배경 인물"], answer: 0, explanation: "피노키오의 양심을 대변하는 역할입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "피노키오가 전하는 교훈은?", options: ["정직과 성실의 중요성","거짓말의 이점","유혹에 빠져도 됨","놀기만 해도 됨"], answer: 0, explanation: "정직하고 성실하게 살아야 한다는 교훈입니다." },
        { q: "코가 길어지는 설정의 효과는?", options: ["거짓말의 결과를 눈에 보이게 함","공포감 조성","웃음 유발만","의미 없음"], answer: 0, explanation: "거짓말의 결과를 시각적으로 명확하게 보여줍니다." }
      ]
    }
  },
  world1_08: { // 오즈의 마법사
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "도로시가 오즈의 나라에 가게 된 계기는?", options: ["회오리바람에 휩쓸려서","비행기를 타고","걸어서","배를 타고"], answer: 0, explanation: "회오리바람에 집째로 휩쓸려 오즈의 나라에 갔습니다." },
        { q: "도로시가 집으로 돌아가기 위해 만난 마법사는?", options: ["오즈의 마법사","서쪽 마녀","동쪽 마녀","북쪽 마녀"], answer: 0, explanation: "에메랄드 성의 오즈의 마법사를 찾아갔습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "오즈의 마법사의 장르는?", options: ["판타지 동화","역사 소설","추리 소설","공포 소설"], answer: 0, explanation: "마법의 세계를 배경으로 한 판타지 동화입니다." },
        { q: "허수아비, 양철 나무꾼, 겁쟁이 사자의 공통점은?", options: ["자신에게 없다고 생각하는 것을 원함","이미 가진 것을 원함","아무것도 원하지 않음","도로시를 방해함"], answer: 0, explanation: "각각 뇌, 심장, 용기를 원했지만 이미 가지고 있었습니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'마법사(魔法師)'의 뜻은?", options: ["마법을 부리는 사람","과학자","의사","선생님"], answer: 0, explanation: "신비한 마법의 힘을 사용하는 사람입니다." },
        { q: "'용기(勇氣)'의 의미는?", options: ["두려움을 이기는 힘","겁쟁이","무모함","분노"], answer: 0, explanation: "두려움에 맞서 행동할 수 있는 마음의 힘입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "동료들이 원하던 것을 이미 가지고 있었다는 의미는?", options: ["자신의 가치를 몰랐다","마법사가 속임","없는 것을 얻음","꿈이었다"], answer: 0, explanation: "이미 가진 것의 소중함을 몰랐던 것입니다." },
        { q: "도로시가 집으로 돌아갈 수 있었던 방법은?", options: ["루비 구두를 세 번 부딪침","마법사의 도움","비행기","도보"], answer: 0, explanation: "루비 구두의 힘으로 집으로 돌아갔습니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "오즈의 마법사가 전하는 메시지는?", options: ["찾는 것은 이미 내 안에 있다","마법에 의지하라","집을 떠나라","혼자 해결하라"], answer: 0, explanation: "원하는 것은 이미 자신 안에 있다는 메시지입니다." },
        { q: "'집만한 곳은 없다'의 의미는?", options: ["가장 소중한 곳은 가정","여행하지 마라","집에만 있어라","모험은 나쁘다"], answer: 0, explanation: "모험 후 집과 가족의 소중함을 깨닫는다는 의미입니다." }
      ]
    }
  },
  world1_09: { // 이상한 나라의 앨리스
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "앨리스가 이상한 나라에 간 방법은?", options: ["토끼 굴로 떨어져서","문을 열고","비행기로","배로"], answer: 0, explanation: "하얀 토끼를 따라 토끼 굴로 뛰어들었습니다." },
        { q: "앨리스가 마신 음료의 효과는?", options: ["몸이 커지거나 작아짐","날 수 있게 됨","투명해짐","잠이 듦"], answer: 0, explanation: "음료를 마시면 몸이 커지거나 작아졌습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "이상한 나라의 앨리스의 장르는?", options: ["판타지/넌센스 문학","역사 소설","추리 소설","로맨스"], answer: 0, explanation: "논리를 벗어난 넌센스 판타지입니다." },
        { q: "이 작품의 특징적인 구조는?", options: ["꿈과 현실의 경계가 모호함","시간 순서대로 진행","역사적 사실 기록","논리적 전개"], answer: 0, explanation: "꿈속 세계로 현실의 논리가 적용되지 않습니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'넌센스(nonsense)'의 뜻은?", options: ["논리에 맞지 않는 말이나 행동","논리적임","평범함","슬픔"], answer: 0, explanation: "상식이나 논리에 맞지 않는 것입니다." },
        { q: "'환상(幻想)'의 의미는?", options: ["현실이 아닌 상상의 세계","현실","역사","과학"], answer: 0, explanation: "현실에는 없는 상상 속의 세계입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "이상한 나라가 현실 세계와 다른 점은?", options: ["논리와 상식이 통하지 않음","더 논리적임","더 현실적임","차이 없음"], answer: 0, explanation: "현실의 논리와 규칙이 적용되지 않는 세계입니다." },
        { q: "앨리스가 겪는 혼란의 의미는?", options: ["성장 과정의 정체성 혼란","단순한 꿈","장난","실수"], answer: 0, explanation: "성장하며 겪는 정체성의 혼란을 상징합니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "이 작품이 비판하는 것은?", options: ["권위와 규칙의 무의미함","어린이","모험","상상력"], answer: 0, explanation: "어른들의 권위와 형식적 규칙을 풍자합니다." },
        { q: "넌센스 문학의 가치는?", options: ["고정관념을 깨고 상상력을 자극","교훈 전달","역사 기록","현실 묘사"], answer: 0, explanation: "틀에 박힌 사고를 벗어나 상상력을 자극합니다." }
      ]
    }
  },
  world1_10: { // 정글북
    literal: {
      title: "보완학습 | 핵심 이해력",
      problems: [
        { q: "모글리가 자란 곳은?", options: ["늑대 무리 속","인간 마을","도시","바다"], answer: 0, explanation: "모글리는 늑대들에게 길러져 정글에서 자랐습니다." },
        { q: "모글리를 위협하는 호랑이의 이름은?", options: ["쉬어 칸","발루","바기라","카아"], answer: 0, explanation: "호랑이 쉬어 칸이 모글리를 위협했습니다." }
      ]
    },
    structural: {
      title: "보완학습 | 구조 파악력",
      problems: [
        { q: "정글북의 장르는?", options: ["동물 소설/모험 소설","역사 소설","추리 소설","로맨스"], answer: 0, explanation: "정글을 배경으로 한 동물 모험 소설입니다." },
        { q: "모글리의 성장 과정은 어떤 구조인가?", options: ["정글에서 자라 정체성을 찾아감","태어날 때부터 완성됨","퇴보함","변화 없음"], answer: 0, explanation: "정글에서 자라며 자신이 누구인지 찾아갑니다." }
      ]
    },
    lexical: {
      title: "보완학습 | 어휘력",
      problems: [
        { q: "'정글(jungle)'의 뜻은?", options: ["열대의 밀림","사막","바다","도시"], answer: 0, explanation: "나무와 덤불이 빽빽한 열대 지방의 숲입니다." },
        { q: "'정글의 법칙'이 의미하는 것은?", options: ["약육강식의 생존 규칙","친절함","평화","사랑"], answer: 0, explanation: "강한 자가 살아남는 자연의 법칙입니다." }
      ]
    },
    inferential: {
      title: "보완학습 | 추론력",
      problems: [
        { q: "모글리가 인간 마을로 가게 된 이유는?", options: ["자신의 정체성을 찾기 위해","쫓겨나서","먹을 것이 없어서","심심해서"], answer: 0, explanation: "자신이 누구인지, 어디에 속하는지 알기 위해서입니다." },
        { q: "발루와 바기라가 모글리를 돕는 이유는?", options: ["사랑과 우정","의무감만","보상을 위해","두려움 때문에"], answer: 0, explanation: "모글리에 대한 진정한 사랑과 우정 때문입니다." }
      ]
    },
    critical: {
      title: "보완학습 | 비판력",
      problems: [
        { q: "정글북이 전하는 메시지는?", options: ["자신의 정체성을 찾는 것의 중요성","동물이 인간보다 낫다","문명을 거부하라","혼자 살아라"], answer: 0, explanation: "자신이 누구인지 찾아가는 여정의 중요성입니다." },
        { q: "인간과 동물 세계 사이의 모글리가 상징하는 것은?", options: ["두 세계 사이에서의 정체성 고민","단순한 설정","역사적 사실","과학적 실험"], answer: 0, explanation: "어디에도 완전히 속하지 못하는 정체성의 고민입니다." }
      ]
    }
  }
};

// world1_01~10 파일에 보완학습 데이터 삽입
for (let i = 1; i <= 10; i++) {
  const num = String(i).padStart(2, '0');
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'worldlit', `world1_${num}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const key = `world1_${num}`;
  const data = remedialData[key];

  if (!data) {
    console.log(`[SKIP] ${key} 데이터 없음`);
    continue;
  }

  // 기존 REMEDIAL_BANK 블록 제거
  const existingPattern = /<!-- ✅ 보완학습 데이터 \(learning-common\.js 로드 전에 정의\) -->\s*<script>\s*window\.REMEDIAL_BANK = \{[\s\S]*?\};\s*<\/script>\s*/;
  if (existingPattern.test(content)) {
    content = content.replace(existingPattern, '');
    console.log(`[OK] world1_${num} 기존 REMEDIAL_BANK 블록 제거`);
  }

  // 새 REMEDIAL_BANK 삽입 (learning-common.js 로드 전)
  const remedialScript = `<!-- ✅ 보완학습 데이터 (learning-common.js 로드 전에 정의) -->
<script>
window.REMEDIAL_BANK = ${JSON.stringify(data, null, 2)};
</script>

`;

  const commonJsPattern = /<script src="\/assets\/js\/learning-common\.js[^"]*"><\/script>/;
  if (commonJsPattern.test(content)) {
    content = content.replace(commonJsPattern, (match) => remedialScript + match);
    console.log(`[OK] world1_${num} REMEDIAL_BANK 삽입 완료`);
  } else {
    console.log(`[WARN] world1_${num} learning-common.js 로드 패턴 없음`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

console.log('\n✅ world1_01~10 보완학습 데이터 삽입 완료!');

const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/worldlit/deep_world2_content.js", "utf8");

// 1. passage에서 태그 제거
const passageOnlyTags = [
  // deep_world2_01
  '윌리엄 텔', '미천한', '횡포', '얕잡아 본', '두려워하지', '기도', '잔혹한', '폭정', '지그시 바라보며', '수상쩍다는', '복수', '담대한', '전해져',
  // deep_world2_02
  '케이트', '끈기', '낯설고', '악당', '어둠', '용감한',
  // deep_world2_03
  '불편한', '못마땅한', '의로운',
  // deep_world2_04
  '자신감', '놀라웠', '믿기 어렵다는', '예상치 못한', '어색', '교육 방법',
  // deep_world2_05
  '비참했어요', '죽', '벌을 주었어요', '가혹한', '감옥', '간절', '반응', '두근거렸', '억울', '부당함', '도둑', '목소리',
  // deep_world2_06
  '생활', '꾸미고', '모험', '판단', '죄', '친구', '노예 사냥꾼', '확신', '용기',
  // deep_world2_07
  '까다로운', '평범하게', '신비로운', '무성', '사랑', '대화', '구별', '콜린', '응원',
  // deep_world2_08
  '파스파르투', '수에즈 운하', '대륙 횡단 열차',
  // deep_world2_09
  '소문', '노틸러스', '신비로운', '경이로운', '자유', '오징어', '분노', '운명',
  // deep_world2_10
  '에드워드', '톰', '영리한', '미친', '백성', '기사', '친절', '공정',
  // deep_world2_11
  '의욕적', '영리함', '솔직한', '목격', '가출', '연인', '모험', '우정', '말썽',
  // deep_world2_12
  '모글리', '늑대', '신성한', '최후', '고민', '가족', '용감한', '다리',
  // deep_world2_13
  '피터팬', '네버랜드', '팅커벨', '후크 선장', '용감', '어른', '거부', '꿈', '소년',
  // deep_world2_14
  '히스패니올라', '롱 존 실버', '용감한', '감동', '용기', '영웅', '우정',
  // deep_world2_15
  '겁쟁이 사자', '위협', '가지고', '집', '추억',
  // deep_world2_16
  '지킬', '하이드', '도덕적', '범죄', '재료', '비극', '받아들이고',
  // deep_world2_17
  '메그', '온화한', '조', '베스', '에이미', '성격', '로리', '사랑', '의미',
  // deep_world2_18
  '히스클리프', '캐서린', '신사', '무지', '쓸쓸', '사랑', '복수',
  // deep_world2_19
  '제인 에어', '로체스터', '행복', '굶주림',
  // deep_world2_20
  '단테스', '감옥', '치밀', '파산',
  // deep_world2_21
  '로빈슨 크루소', '만족', '공포', '프라이데이', '우정', '인내',
  // deep_world2_22
  '걸리버', '릴리펏', '탈출', '거인', '다툼', '욕심', '브롭딩낵', '라퓨타', '슬픔',
  // deep_world2_23
  '돈키호테', '산초 판사', '꿈', '아름다움',
  // deep_world2_24
  '처벌', '괴로움', '악마', '잔인', '뉘우치',
  // deep_world2_25
  '거부', '부끄러움', '사랑',
  // deep_world2_26
  '메피스토펠레스'
];

let tagRemoveCount = 0;
passageOnlyTags.forEach(tag => {
  const regex = new RegExp(`<b>${tag.replace(/[()]/g, '\\$&')}</b>`, 'g');
  const before = content;
  content = content.replace(regex, tag);
  if (before !== content) {
    tagRemoveCount++;
    console.log(`태그 제거: <b>${tag}</b> -> ${tag}`);
  }
});

// 2. passage에 태그 추가
const addTags = [
  // deep_world2_03
  { unit: 'deep_world2_03', search: '셔우드 숲' },
  // deep_world2_05
  { unit: 'deep_world2_05', search: '벌' },
  { unit: 'deep_world2_05', search: '허기' },
  // deep_world2_06
  { unit: 'deep_world2_06', search: '허클베리 핀' },
  { unit: 'deep_world2_06', search: '미시시피 강' },
  { unit: 'deep_world2_06', search: '노예' },
  { unit: 'deep_world2_06', search: '자유' },
  { unit: 'deep_world2_06', search: '양심' },
  // deep_world2_07
  { unit: 'deep_world2_07', search: '저택' },
  { unit: 'deep_world2_07', search: '전염병' },
  { unit: 'deep_world2_07', search: '담쟁이덩굴' },
  { unit: 'deep_world2_07', search: '생기' },
  // deep_world2_08
  { unit: 'deep_world2_08', search: '하인' },
  { unit: 'deep_world2_08', search: '화장터' },
  { unit: 'deep_world2_08', search: '대륙 횡단' },
  // deep_world2_09
  { unit: 'deep_world2_09', search: '해양 생물학자' },
  { unit: 'deep_world2_09', search: '자급자족' },
  { unit: 'deep_world2_09', search: '산호초' },
  { unit: 'deep_world2_09', search: '유적' },
  { unit: 'deep_world2_09', search: '소용돌이' },
  // deep_world2_10
  { unit: 'deep_world2_10', search: '멸시' },
  { unit: 'deep_world2_10', search: '대관식' },
  { unit: 'deep_world2_10', search: '국새' },
  // deep_world2_11
  { unit: 'deep_world2_11', search: '양심의 가책' },
  // deep_world2_12
  { unit: 'deep_world2_12', search: '무리' },
  { unit: 'deep_world2_12', search: '법칙' },
  // deep_world2_13
  { unit: 'deep_world2_13', search: '요정' },
  { unit: 'deep_world2_13', search: '그림자' },
  { unit: 'deep_world2_13', search: '영원히' },
  // deep_world2_22
  { unit: 'deep_world2_22', search: '소인국' },
  { unit: 'deep_world2_22', search: '거인국' },
  // deep_world2_23
  { unit: 'deep_world2_23', search: '우정' },
  // deep_world2_26
  { unit: 'deep_world2_26', search: '절망' },
  { unit: 'deep_world2_26', search: '공허' },
  { unit: 'deep_world2_26', search: '욕망' },
  { unit: 'deep_world2_26', search: '깨달음' },
  // deep_world2_27
  { unit: 'deep_world2_27', search: '고백' },
  { unit: 'deep_world2_27', search: '규율' },
  { unit: 'deep_world2_27', search: '봉기' },
  { unit: 'deep_world2_27', search: '성실' },
  { unit: 'deep_world2_27', search: '감동' },
  // deep_world2_28
  { unit: 'deep_world2_28', search: '열정' },
  { unit: 'deep_world2_28', search: '욕망' },
  { unit: 'deep_world2_28', search: '일상' },
  { unit: 'deep_world2_28', search: '행복' },
  // deep_world2_29
  { unit: 'deep_world2_29', search: '대문호' },
  { unit: 'deep_world2_29', search: '주인공' },
  { unit: 'deep_world2_29', search: '평범' },
  { unit: 'deep_world2_29', search: '비범' },
  { unit: 'deep_world2_29', search: '영웅' },
  // deep_world2_30
  { unit: 'deep_world2_30', search: '청년' },
  { unit: 'deep_world2_30', search: '경악' },
  { unit: 'deep_world2_30', search: '가구' },
  { unit: 'deep_world2_30', search: '존재' },
  // deep_world2_31
  { unit: 'deep_world2_31', search: '목격' },
  { unit: 'deep_world2_31', search: '평범' },
  { unit: 'deep_world2_31', search: '소녀' },
  { unit: 'deep_world2_31', search: '판타지' },
  // deep_world2_32
  { unit: 'deep_world2_32', search: '선원' },
  { unit: 'deep_world2_32', search: '선장' },
  { unit: 'deep_world2_32', search: '침몰' },
  // deep_world2_33
  { unit: 'deep_world2_33', search: '학자' },
  { unit: 'deep_world2_33', search: '대문호' },
  { unit: 'deep_world2_33', search: '희곡' },
  // deep_world2_34
  { unit: 'deep_world2_34', search: '작가' },
  { unit: 'deep_world2_34', search: '소년' },
  { unit: 'deep_world2_34', search: '기숙학교' },
  // deep_world2_35
  { unit: 'deep_world2_35', search: '어부' },
  { unit: 'deep_world2_35', search: '작살' },
  { unit: 'deep_world2_35', search: '항구' },
  { unit: 'deep_world2_35', search: '노벨문학상' },
  // deep_world2_36
  { unit: 'deep_world2_36', search: '배신' },
  // deep_world2_38
  { unit: 'deep_world2_38', search: '차별' },
  { unit: 'deep_world2_38', search: '증거' },
  // deep_world2_39
  { unit: 'deep_world2_39', search: '배신' },
  { unit: 'deep_world2_39', search: '고문' },
  // deep_world2_40
  { unit: 'deep_world2_40', search: '구조' },
  { unit: 'deep_world2_40', search: '야수' }
];

let tagAddCount = 0;
addTags.forEach(item => {
  const unitStart = content.indexOf(item.unit + ':');
  if (unitStart === -1) {
    console.log(`유닛 없음: ${item.unit}`);
    return;
  }

  const nextUnitNum = parseInt(item.unit.split('_')[2]) + 1;
  const nextUnit = 'deep_world2_' + String(nextUnitNum).padStart(2, '0');
  const nextUnitStart = content.indexOf(nextUnit + ':', unitStart);

  const passageStart = content.indexOf('passage:', unitStart);
  const vocabStart = content.indexOf('vocab:', passageStart);

  if (passageStart === -1 || vocabStart === -1) {
    console.log(`passage/vocab 없음: ${item.unit}`);
    return;
  }

  const effectiveVocabStart = (nextUnitStart !== -1 && vocabStart > nextUnitStart) ? nextUnitStart : vocabStart;
  const passageSection = content.substring(passageStart, effectiveVocabStart);

  if (passageSection.includes(`<b>${item.search}</b>`)) {
    console.log(`이미 태그 있음: ${item.unit} - ${item.search}`);
    return;
  }

  if (passageSection.includes(item.search)) {
    const newPassage = passageSection.replace(item.search, `<b>${item.search}</b>`);
    content = content.substring(0, passageStart) + newPassage + content.substring(effectiveVocabStart);
    tagAddCount++;
    console.log(`태그 추가: ${item.unit} - ${item.search}`);
  } else {
    console.log(`단어 없음: ${item.unit} - ${item.search}`);
  }
});

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/worldlit/deep_world2_content.js", content);
console.log(`\n태그 제거: ${tagRemoveCount}개, 태그 추가: ${tagAddCount}개 완료!`);

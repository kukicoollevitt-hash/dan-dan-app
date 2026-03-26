const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/worldlit/fit_world2_content.js", "utf8");

// 1. passage에서 태그 제거
const passageOnlyTags = [
  '윌리엄 텔', '미천한', '총독', '얕잡아 본', '지그시 바라보며', '복수',  // fit_world2_01
  '케이트', '악당', '어둠',  // fit_world2_02
  '연회', '전갈', '어색',  // fit_world2_04
  '비참했어요', '죽', '벌을 주었어요', '간절', '억울', '부당함', '소동', '도둑',  // fit_world2_05
  '생활', '꾸미고', '모험', '판단', '죄', '친구', '용기',  // fit_world2_06
  '까다로운', '신비로운', '무성', '대화', '콜린', '응원',  // fit_world2_07
  '파스파르투', '수에즈 운하', '대륙 횡단 열차', '포기',  // fit_world2_08
  '소문', '노틸러스', '경이로운', '자유', '분노', '운명',  // fit_world2_09 (신비로운 중복)
  '에드워드', '톰', '백성', '기사', '공정',  // fit_world2_10
  '허클베리', '목격', '우정',  // fit_world2_11 (모험 중복)
  '모글리', '늑대', '신성한', '최후', '가족',  // fit_world2_12
  '피터팬', '네버랜드', '팅커벨', '후크 선장', '용감', '어른', '거부', '꿈',  // fit_world2_13
  '히스패니올라', '롱 존 실버', '용감한',  // fit_world2_14 (용기 중복)
  '영웅', '겁쟁이 사자', '위협', '집',  // fit_world2_15
  '지킬', '자비로운', '하이드',  // fit_world2_16
  '메그', '조', '베스', '에이미', '로리', '낭만적인', '사랑',  // fit_world2_17
  '히스클리프', '캐서린', '신사', '무지', '쓸쓸',  // fit_world2_18 (사랑, 복수 중복)
  '제인 에어', '로체스터',  // fit_world2_19
  '단테스', '감옥', '치밀',  // fit_world2_20
  '로빈슨 크루소', '공포', '프라이데이',  // fit_world2_21
  '걸리버', '릴리펏', '탈출', '브롭딩낵', '라퓨타',  // fit_world2_22
  '돈키호테', '산초 판사',  // fit_world2_23
  '메피스토펠레스',  // fit_world2_26
  '돌봐',  // fit_world2_30
  '광란',  // fit_world2_31
  '간청', '충돌',  // fit_world2_32
  '혼란', '회개',  // fit_world2_33
  '순수', '행복',  // fit_world2_34
  // fit_world2_35 (포기 중복)
  '제안',  // fit_world2_36
  '거짓말',  // fit_world2_37
  '폭행', '논리',  // fit_world2_38
  '반항',  // fit_world2_39
  '지지'  // fit_world2_40
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
  { unit: 'fit_world2_05', search: '벌' },
  { unit: 'fit_world2_05', search: '허기' },
  { unit: 'fit_world2_06', search: '허클베리 핀' },
  { unit: 'fit_world2_06', search: '미시시피 강' },
  { unit: 'fit_world2_06', search: '노예' },
  { unit: 'fit_world2_06', search: '자유' },
  { unit: 'fit_world2_06', search: '양심' },
  { unit: 'fit_world2_07', search: '저택' },
  { unit: 'fit_world2_07', search: '전염병' },
  { unit: 'fit_world2_07', search: '담쟁이덩굴' },
  { unit: 'fit_world2_07', search: '생기' },
  { unit: 'fit_world2_08', search: '하인' },
  { unit: 'fit_world2_08', search: '화장터' },
  { unit: 'fit_world2_08', search: '대륙 횡단' },
  { unit: 'fit_world2_09', search: '해양 생물학자' },
  { unit: 'fit_world2_09', search: '자급자족' },
  { unit: 'fit_world2_09', search: '산호초' },
  { unit: 'fit_world2_09', search: '유적' },
  { unit: 'fit_world2_09', search: '소용돌이' },
  { unit: 'fit_world2_10', search: '멸시' },
  { unit: 'fit_world2_10', search: '대관식' },
  { unit: 'fit_world2_10', search: '국새' },
  { unit: 'fit_world2_11', search: '양심의 가책' },
  { unit: 'fit_world2_12', search: '무리' },
  { unit: 'fit_world2_12', search: '법칙' },
  { unit: 'fit_world2_12', search: '번영' },
  { unit: 'fit_world2_12', search: '일원' },
  { unit: 'fit_world2_13', search: '요정' },
  { unit: 'fit_world2_13', search: '그림자' },
  { unit: 'fit_world2_13', search: '영원히' },
  { unit: 'fit_world2_13', search: '모험' },
  { unit: 'fit_world2_14', search: '해적' },
  { unit: 'fit_world2_14', search: '선원' },
  { unit: 'fit_world2_15', search: '마법사' },
  { unit: 'fit_world2_17', search: '성장' },
  { unit: 'fit_world2_17', search: '야심' },
  { unit: 'fit_world2_17', search: '수줍음' },
  { unit: 'fit_world2_18', search: '비극' },
  { unit: 'fit_world2_18', search: '용서' },
  { unit: 'fit_world2_19', search: '구박' },
  { unit: 'fit_world2_19', search: '청혼' },
  { unit: 'fit_world2_22', search: '소인국' },
  { unit: 'fit_world2_22', search: '거인국' },
  { unit: 'fit_world2_23', search: '순수' }
];

let tagAddCount = 0;
addTags.forEach(item => {
  const unitStart = content.indexOf(item.unit + ':');
  if (unitStart === -1) {
    console.log(`유닛 없음: ${item.unit}`);
    return;
  }

  const passageStart = content.indexOf('passage:', unitStart);
  const vocabStart = content.indexOf('vocab:', passageStart);

  if (passageStart === -1 || vocabStart === -1) {
    console.log(`passage/vocab 없음: ${item.unit}`);
    return;
  }

  const passageSection = content.substring(passageStart, vocabStart);

  if (passageSection.includes(`<b>${item.search}</b>`)) {
    console.log(`이미 태그 있음: ${item.unit} - ${item.search}`);
    return;
  }

  if (passageSection.includes(item.search)) {
    const newPassage = passageSection.replace(item.search, `<b>${item.search}</b>`);
    content = content.substring(0, passageStart) + newPassage + content.substring(vocabStart);
    tagAddCount++;
    console.log(`태그 추가: ${item.unit} - ${item.search}`);
  } else {
    console.log(`단어 없음: ${item.unit} - ${item.search}`);
  }
});

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/worldlit/fit_world2_content.js", content);
console.log(`\n태그 제거: ${tagRemoveCount}개, 태그 추가: ${tagAddCount}개 완료!`);

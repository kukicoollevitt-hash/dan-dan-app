const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/worldlit/world2_content.js", "utf8");

// passage에서 태그 제거 (passage에만 있는 것들)
const passageOnlyTags = [
  // world2_04
  '연회',
  // world2_05
  '비참했어요', '죽', '벌을 주었어요', '차가운', '고요해졌어요', '부당함', '비참', '부당',
  // world2_06
  '사기꾼', '유산', '죄', '친구', '용기',
  // world2_07
  '까다로운', '모습을 드러냈어요', '부드러워졌어요', '메마른',
  // world2_08
  '파스파르투', '대륙 횡단 열차', '시간', '침착',
  // world2_09
  '노틸러스', '신비로운', '경이로운', '자유', '해양', '갈망',
  // world2_10
  '에드워드', '톰', '백성', '숨겨진', '공정',
  // world2_11
  '허클베리', '모험', '우정', '목격',
  // world2_12
  '모글리', '늑대', '가족',
  // world2_13
  '피터팬', '네버랜드', '후크 선장', '용감', '어른', '꿈', '자유', '거부', '존중', '자유로운',
  // world2_14
  '히스패니올라', '롱 존 실버', '용감한', '용기', '용감',
  // world2_15
  '겁쟁이 사자', '집',
  // world2_16
  '지킬', '하이드',
  // world2_17
  '메그', '조', '베스', '에이미', '로리', '사랑', '온화',
  // world2_18
  '히스클리프', '캐서린', '쓸쓸', '사랑', '복수',
  // world2_19
  '제인 에어', '로체스터',
  // world2_20
  '단테스',
  // world2_21
  '로빈슨 크루소', '프라이데이',
  // world2_22
  '걸리버', '릴리펏', '브롭딩낵',
  // world2_23
  '돈키호테', '산초 판사'
];

// 태그 제거
passageOnlyTags.forEach(tag => {
  const regex = new RegExp(`<b>${tag}</b>`, 'g');
  const before = content;
  content = content.replace(regex, tag);
  if (before !== content) {
    console.log(`태그 제거: <b>${tag}</b> -> ${tag}`);
  }
});

// passage에 태그 추가 (vocab에는 있지만 passage에 태그 없는 것들)
const addTags = [
  // world2_02
  { search: '항해사', unit: 'world2_02' },
  // world2_05
  { search: '벌', unit: 'world2_05' },
  // world2_08
  { search: '화장터', unit: 'world2_08' },
  // world2_09
  { search: '해양 생물학자', unit: 'world2_09' },
  // world2_11
  { search: '맹세', unit: 'world2_11' }
];

addTags.forEach(item => {
  // 해당 유닛의 passage 범위 찾기
  const unitStart = content.indexOf(item.unit + ':');
  if (unitStart === -1) return;

  const passageStart = content.indexOf('passage:', unitStart);
  const vocabStart = content.indexOf('vocab:', passageStart);

  if (passageStart === -1 || vocabStart === -1) return;

  const passageSection = content.substring(passageStart, vocabStart);

  // 이미 태그가 있으면 스킵
  if (passageSection.includes(`<b>${item.search}</b>`)) {
    console.log(`이미 태그 있음: ${item.unit} - ${item.search}`);
    return;
  }

  // 태그 없는 단어 찾아서 첫 번째만 태그 추가
  if (passageSection.includes(item.search)) {
    const newPassage = passageSection.replace(item.search, `<b>${item.search}</b>`);
    content = content.substring(0, passageStart) + newPassage + content.substring(vocabStart);
    console.log(`태그 추가: ${item.unit} - ${item.search}`);
  }
});

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/worldlit/world2_content.js", content);
console.log("\n완료!");

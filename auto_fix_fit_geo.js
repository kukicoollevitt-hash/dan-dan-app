const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/social/fit_geo_content.js", "utf8");

// 1. passage에서 태그 제거
const passageOnlyTags = [
  '탐색',                     // fit_geo_01
  '역사책',                   // fit_geo_03
  '지역 문제', '촌락', '도시', // fit_geo_04
  '트랙터', '냉동 시설',      // fit_geo_05
  '그리니치 천문대', 'GPS',   // fit_geo_06
  '6대륙', '북아메리카', '남아메리카', '남극', '5대양', '북극해', '남극해', '항공로', '해운', // fit_geo_07
  '북위', '동경', '동해', '서해', '남해', // fit_geo_08
  '백두산', '한라산', '계단식 논', // fit_geo_09
  '해양의 영향', '장마', '계절에 따른 기후 변화', // fit_geo_10
  '도시 재생', '지역 특화 산업', // fit_geo_11
  '저출산·고령화', '노동력', // fit_geo_12
  '드론', '5G',               // fit_geo_13
  '위성 영상',                // fit_geo_14
  '석탄', '자원 외교', '희토류', // fit_geo_15
  '석유', '천연가스', '수력 에너지', '핵융합 에너지', '에너지 저장 시스템(ESS)', '스마트 그리드', // fit_geo_16
  '어업', '녹조', '해양 바이오', '망간 단괴', '해양 풍력', '조력 발전', // fit_geo_17
  '판', '재해 예보', '열대야', '폭염', '게릴라성 호우', '조기 경보 시스템', // fit_geo_18
  '다양성', '국제 협력', '국제기구', '공정 무역', // fit_geo_19
  '지속 가능 발전 목표(SDGs)', '지속 가능한 발전', '다회용품', '친환경 에너지', '전기차', '업사이클링', 'ESG 경영' // fit_geo_20
];

passageOnlyTags.forEach(tag => {
  const escapedTag = tag.replace(/[()·]/g, '\\$&');
  const regex = new RegExp(`<b>${escapedTag}</b>`, 'g');
  const before = content;
  content = content.replace(regex, tag);
  if (before !== content) {
    console.log(`태그 제거: <b>${tag}</b> -> ${tag}`);
  }
});

// 2. passage에 태그 추가
const addTags = [
  { unit: 'fit_geo_01', search: '지도' },
  { unit: 'fit_geo_02', search: '지도' },
  { unit: 'fit_geo_03', search: '공동체' },
  { unit: 'fit_geo_05', search: '촌락' },
  { unit: 'fit_geo_06', search: '북위' },
  { unit: 'fit_geo_06', search: '남위' },
  { unit: 'fit_geo_06', search: '동경' },
  { unit: 'fit_geo_06', search: '서경' },
  { unit: 'fit_geo_11', search: '고령화' },
  { unit: 'fit_geo_12', search: '이민' },
  { unit: 'fit_geo_14', search: '인공위성' },
  { unit: 'fit_geo_14', search: '내비게이션' },
  { unit: 'fit_geo_14', search: '실시간' },
  { unit: 'fit_geo_16', search: '지구 온난화' },
  { unit: 'fit_geo_19', search: '편견' },
  { unit: 'fit_geo_20', search: '지속 가능 발전' },
  { unit: 'fit_geo_20', search: 'SDGs' }
];

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
    console.log(`태그 추가: ${item.unit} - ${item.search}`);
  } else {
    console.log(`단어 없음: ${item.unit} - ${item.search}`);
  }
});

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/social/fit_geo_content.js", content);
console.log("\n태그 수정 완료!");

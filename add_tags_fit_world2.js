const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/worldlit/fit_world2_content.js", "utf8");

// 1. 추가 태그 제거
const removeMoreTags = ['갈등', '구원', '항해'];
removeMoreTags.forEach(tag => {
  const regex = new RegExp(`<b>${tag}</b>`, 'g');
  const before = content;
  content = content.replace(regex, tag);
  if (before !== content) {
    console.log(`태그 제거: <b>${tag}</b> -> ${tag}`);
  }
});

// 2. passage에 태그 추가
const addTags = [
  { unit: 'fit_world2_01', search: '제안' },
  { unit: 'fit_world2_01', search: '자유' },
  { unit: 'fit_world2_05', search: '용기' },
  { unit: 'fit_world2_06', search: '우정' },
  { unit: 'fit_world2_10', search: '운명' },
  { unit: 'fit_world2_11', search: '복수' },
  { unit: 'fit_world2_11', search: '영웅' },
  { unit: 'fit_world2_12', search: '위협' },
  { unit: 'fit_world2_12', search: '용기' },
  { unit: 'fit_world2_17', search: '가족' },
  { unit: 'fit_world2_20', search: '탈출' },
  { unit: 'fit_world2_20', search: '복수' },
  { unit: 'fit_world2_21', search: '용기' },
  { unit: 'fit_world2_22', search: '위협' },
  { unit: 'fit_world2_29', search: '회개' },
  { unit: 'fit_world2_31', search: '모험' },
  { unit: 'fit_world2_31', search: '꿈' },
  { unit: 'fit_world2_32', search: '운명' },
  { unit: 'fit_world2_33', search: '복수' },
  { unit: 'fit_world2_36', search: '거짓말' },
  { unit: 'fit_world2_37', search: '신비로운' },
  { unit: 'fit_world2_37', search: '사랑' },
  { unit: 'fit_world2_38', search: '용기' },
  { unit: 'fit_world2_38', search: '억울' },
  { unit: 'fit_world2_39', search: '자유' },
  { unit: 'fit_world2_39', search: '공포' },
  { unit: 'fit_world2_40', search: '광란' },
  { unit: 'fit_world2_40', search: '공포' }
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
console.log(`\n태그 추가: ${tagAddCount}개 완료!`);

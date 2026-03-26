const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/korlit/fit_modern_content.js", "utf8");

// 1. 추가 태그 제거
const removeMoreTags = ['순박하다', '창백하다'];
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
  { unit: 'fit_modern_10', search: '좌절' },
  { unit: 'fit_modern_14', search: '군상' },
  { unit: 'fit_modern_14', search: '세태소설' },
  { unit: 'fit_modern_14', search: '풍경' },
  { unit: 'fit_modern_15', search: '기생' },
  { unit: 'fit_modern_15', search: '갈등' },
  { unit: 'fit_modern_16', search: '지식인' },
  { unit: 'fit_modern_20', search: '갈등' },
  { unit: 'fit_modern_21', search: '반향' },
  { unit: 'fit_modern_22', search: '허무' },
  { unit: 'fit_modern_22', search: '희생양' },
  { unit: 'fit_modern_26', search: '토지' },
  { unit: 'fit_modern_27', search: '상징' },
  { unit: 'fit_modern_27', search: '비극' },
  { unit: 'fit_modern_29', search: '이면' },
  { unit: 'fit_modern_32', search: '저항' },
  { unit: 'fit_modern_32', search: '허무' },
  { unit: 'fit_modern_33', search: '애도' },
  { unit: 'fit_modern_36', search: '민중' },
  { unit: 'fit_modern_36', search: '정체성' },
  { unit: 'fit_modern_37', search: '사투리' },
  { unit: 'fit_modern_39', search: '저항' },
  { unit: 'fit_modern_39', search: '상징' },
  { unit: 'fit_modern_40', search: '감자' },
  { unit: 'fit_modern_40', search: '명작' },
  { unit: 'fit_modern_40', search: '사투리' }
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/korlit/fit_modern_content.js", content);
console.log(`\n태그 추가: ${tagAddCount}개 완료!`);

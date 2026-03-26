const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/worldlit/fit_world1_content.js", "utf8");

// 1. 추가 태그 제거
const removeMoreTags = ['표류', '길들이다'];
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
  { unit: 'fit_world1_03', search: '행복' },
  { unit: 'fit_world1_04', search: '명령' },
  { unit: 'fit_world1_07', search: '거짓말' },
  { unit: 'fit_world1_07', search: '행복' },
  { unit: 'fit_world1_10', search: '사냥' },
  { unit: 'fit_world1_12', search: '친구' },
  { unit: 'fit_world1_15', search: '마법' },
  { unit: 'fit_world1_18', search: '명령' },
  { unit: 'fit_world1_21', search: '사막' },
  { unit: 'fit_world1_22', search: '성' },
  { unit: 'fit_world1_23', search: '엄마' },
  { unit: 'fit_world1_23', search: '독립' },
  { unit: 'fit_world1_28', search: '시장' },
  { unit: 'fit_world1_28', search: '교훈' },
  { unit: 'fit_world1_28', search: '후회' },
  { unit: 'fit_world1_30', search: '결혼' },
  { unit: 'fit_world1_34', search: '교훈' },
  { unit: 'fit_world1_36', search: '행복' },
  { unit: 'fit_world1_38', search: '여우' },
  { unit: 'fit_world1_38', search: '시간' },
  { unit: 'fit_world1_38', search: '유일한' },
  { unit: 'fit_world1_39', search: '거짓말' },
  { unit: 'fit_world1_39', search: '후회' }
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/worldlit/fit_world1_content.js", content);
console.log(`\n태그 추가: ${tagAddCount}개 완료!`);

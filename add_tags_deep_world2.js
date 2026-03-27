const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/worldlit/deep_world2_content.js", "utf8");

// 1. passage에서 추가 태그 제거
const passageOnlyTags = [
  // deep_world2_02
  '갈등',
  // deep_world2_06
  '양심',
  // deep_world2_26
  '구원',
  // deep_world2_29
  '양심', '구원',
  // deep_world2_32
  '항해',
  // deep_world2_37
  '갈등'
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
  // deep_world2_01
  { unit: 'deep_world2_01', search: '자유' },
  { unit: 'deep_world2_01', search: '위협' },
  // deep_world2_02
  { unit: 'deep_world2_02', search: '공포' },
  { unit: 'deep_world2_02', search: '인내' },
  // deep_world2_05
  { unit: 'deep_world2_05', search: '용기' },
  { unit: 'deep_world2_05', search: '범죄' },
  // deep_world2_06
  { unit: 'deep_world2_06', search: '우정' },
  { unit: 'deep_world2_06', search: '탈출' },
  // deep_world2_07
  { unit: 'deep_world2_07', search: '감동' },
  // deep_world2_08
  { unit: 'deep_world2_08', search: '끈기' },
  { unit: 'deep_world2_08', search: '용기' },
  // deep_world2_10
  { unit: 'deep_world2_10', search: '굶주림' },
  { unit: 'deep_world2_10', search: '운명' },
  // deep_world2_11
  { unit: 'deep_world2_11', search: '복수' },
  { unit: 'deep_world2_11', search: '영웅' },
  // deep_world2_12
  { unit: 'deep_world2_12', search: '위협' },
  { unit: 'deep_world2_12', search: '용기' },
  // deep_world2_13
  { unit: 'deep_world2_13', search: '모험' },
  { unit: 'deep_world2_13', search: '자유' },
  { unit: 'deep_world2_13', search: '추억' },
  // deep_world2_14
  { unit: 'deep_world2_14', search: '모험' },
  { unit: 'deep_world2_14', search: '공포' },
  // deep_world2_15
  { unit: 'deep_world2_15', search: '영웅' },
  { unit: 'deep_world2_15', search: '가족' },
  // deep_world2_16
  { unit: 'deep_world2_16', search: '고민' },
  { unit: 'deep_world2_16', search: '신사' },
  // deep_world2_17
  { unit: 'deep_world2_17', search: '가족' },
  { unit: 'deep_world2_17', search: '감동' },
  // deep_world2_18
  { unit: 'deep_world2_18', search: '비극' },
  { unit: 'deep_world2_18', search: '파산' },
  { unit: 'deep_world2_18', search: '만족' },
  // deep_world2_20
  { unit: 'deep_world2_20', search: '탈출' },
  { unit: 'deep_world2_20', search: '복수' },
  { unit: 'deep_world2_20', search: '고민' },
  // deep_world2_21
  { unit: 'deep_world2_21', search: '용기' },
  // deep_world2_22
  { unit: 'deep_world2_22', search: '위협' },
  // deep_world2_23
  { unit: 'deep_world2_23', search: '용기' },
  // deep_world2_26
  { unit: 'deep_world2_26', search: '만족' },
  // deep_world2_28
  { unit: 'deep_world2_28', search: '비극' },
  // deep_world2_30
  { unit: 'deep_world2_30', search: '추억' },
  // deep_world2_31
  { unit: 'deep_world2_31', search: '모험' },
  { unit: 'deep_world2_31', search: '꿈' },
  // deep_world2_32
  { unit: 'deep_world2_32', search: '운명' },
  // deep_world2_33
  { unit: 'deep_world2_33', search: '복수' },
  // deep_world2_34
  { unit: 'deep_world2_34', search: '행복' },
  // deep_world2_35
  { unit: 'deep_world2_35', search: '인내' },
  // deep_world2_37
  { unit: 'deep_world2_37', search: '신비로운' },
  { unit: 'deep_world2_37', search: '비극' },
  { unit: 'deep_world2_37', search: '사랑' },
  // deep_world2_38
  { unit: 'deep_world2_38', search: '인종차별' },
  { unit: 'deep_world2_38', search: '용기' },
  { unit: 'deep_world2_38', search: '억울' },
  // deep_world2_39
  { unit: 'deep_world2_39', search: '자유' },
  { unit: 'deep_world2_39', search: '공포' },
  // deep_world2_40
  { unit: 'deep_world2_40', search: '공포' }
];

let tagAddCount = 0;
let notFoundList = [];

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
    notFoundList.push(`${item.unit} - ${item.search}`);
  }
});

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/worldlit/deep_world2_content.js", content);
console.log(`\n태그 제거: ${tagRemoveCount}개, 태그 추가: ${tagAddCount}개 완료!`);

if (notFoundList.length > 0) {
  console.log(`\n단어 없음 (${notFoundList.length}개):`);
  notFoundList.forEach(item => console.log(`  ${item}`));
}

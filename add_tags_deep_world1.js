const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/worldlit/deep_world1_content.js", "utf8");

// 1. passage에서 추가 태그 제거
const passageOnlyTags = [
  // deep_world1_02
  '위기', '협력',
  // deep_world1_04
  '지혜', '명령', '용기',
  // deep_world1_05
  '관계',
  // deep_world1_06
  '용기',
  // deep_world1_07
  '성공',
  // deep_world1_08
  '지혜', '용기', '마법',
  // deep_world1_11
  '복수',
  // deep_world1_13
  '표류', '겸손',
  // deep_world1_14
  '재미', '지혜', '상징', '용기',
  // deep_world1_15
  '명령', '마법',
  // deep_world1_17
  '고통', '구원자', '칼',
  // deep_world1_18
  '저주', '명령',
  // deep_world1_19
  '구출',
  // deep_world1_20
  '용기', '구출',
  // deep_world1_26
  '용기',
  // deep_world1_27
  '저주',
  // deep_world1_33
  '저주',
  // deep_world1_36
  '저주', '인내',
  // deep_world1_37
  '용기',
  // deep_world1_38
  '길들이다'
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
  // deep_world1_03
  { unit: 'deep_world1_03', search: '행복' },
  // deep_world1_07
  { unit: 'deep_world1_07', search: '행복' },
  // deep_world1_21
  { unit: 'deep_world1_21', search: '행복' },
  // deep_world1_23
  { unit: 'deep_world1_23', search: '독립' },
  // deep_world1_24
  { unit: 'deep_world1_24', search: '행복' },
  // deep_world1_34
  { unit: 'deep_world1_34', search: '행복' },
  // deep_world1_36
  { unit: 'deep_world1_36', search: '행복' },
  // deep_world1_38
  { unit: 'deep_world1_38', search: '여우' },
  { unit: 'deep_world1_38', search: '시간' },
  { unit: 'deep_world1_38', search: '유일한' }
];

let tagAddCount = 0;
addTags.forEach(item => {
  const unitStart = content.indexOf(item.unit + ':');
  if (unitStart === -1) {
    console.log(`유닛 없음: ${item.unit}`);
    return;
  }

  const nextUnitNum = parseInt(item.unit.split('_')[2]) + 1;
  const nextUnit = 'deep_world1_' + String(nextUnitNum).padStart(2, '0');
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/worldlit/deep_world1_content.js", content);
console.log(`\n태그 제거: ${tagRemoveCount}개, 태그 추가: ${tagAddCount}개 완료!`);

const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/worldlit/world2_content.js", "utf8");

// passage에 태그 추가가 필요한 항목들
const addTags = [
  { unit: 'world2_05', search: '용기' },
  { unit: 'world2_06', search: '자유' },
  { unit: 'world2_06', search: '우정' },
  { unit: 'world2_11', search: '복수' },
  { unit: 'world2_12', search: '용기' },
  { unit: 'world2_13', search: '모험' },
  { unit: 'world2_17', search: '가족' },
  { unit: 'world2_19', search: '유산' },
  { unit: 'world2_20', search: '복수' },
  { unit: 'world2_31', search: '모험' },
  { unit: 'world2_31', search: '꿈' },
  { unit: 'world2_33', search: '복수' },
  { unit: 'world2_37', search: '신비로운' },
  { unit: 'world2_37', search: '사랑' },
  { unit: 'world2_38', search: '용기' },
  { unit: 'world2_39', search: '자유' }
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
  } else {
    console.log(`단어 없음: ${item.unit} - ${item.search}`);
  }
});

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/worldlit/world2_content.js", content);
console.log("\n완료!");

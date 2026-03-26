const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/social/deep_soc_content.js", "utf8");

// passage에 태그 추가
const addTags = [
  { unit: 'deep_soc_01', search: '기능론' },
  { unit: 'deep_soc_01', search: '갈등론' },
  { unit: 'deep_soc_11', search: '사회 불평등' },
  { unit: 'deep_soc_11', search: '기능론적 관점' },
  { unit: 'deep_soc_11', search: '갈등론적 관점' },
  { unit: 'deep_soc_16', search: '사회 문제' },
  { unit: 'deep_soc_16', search: '기능론적 관점' },
  { unit: 'deep_soc_16', search: '갈등론적 관점' },
  { unit: 'deep_soc_19', search: '헌법' }
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/social/deep_soc_content.js", content);
console.log(`\n태그 추가: ${tagAddCount}개 완료!`);

const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/social/fit_law_content.js", "utf8");

const addTags = [
  { unit: 'fit_law_01', search: '존중' },
  { unit: 'fit_law_01', search: '아동 권리 협약' },
  { unit: 'fit_law_02', search: '신분' },
  { unit: 'fit_law_02', search: '평등' },
  { unit: 'fit_law_02', search: '국제 연합' },
  { unit: 'fit_law_08', search: '항소' },
  { unit: 'fit_law_09', search: '형벌' },
  { unit: 'fit_law_10', search: '따돌림' }
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/social/fit_law_content.js", content);
console.log("\n완료!");

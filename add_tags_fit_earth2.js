const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/science/fit_earth_content.js", "utf8");

const addTags = [
  { unit: 'fit_earth_01', search: '마그마' },
  { unit: 'fit_earth_02', search: '마그마' },
  { unit: 'fit_earth_03', search: '마그마' },
  { unit: 'fit_earth_03', search: '퇴적암' },
  { unit: 'fit_earth_03', search: '화석' },
  { unit: 'fit_earth_04', search: '이산화탄소' },
  { unit: 'fit_earth_06', search: '마그마' },
  { unit: 'fit_earth_07', search: '퇴적암' },
  { unit: 'fit_earth_08', search: '퇴적암' },
  { unit: 'fit_earth_08', search: '사암' },
  { unit: 'fit_earth_08', search: '석회암' },
  { unit: 'fit_earth_09', search: '화석' },
  { unit: 'fit_earth_11', search: '날씨' },
  { unit: 'fit_earth_12', search: '응결' },
  { unit: 'fit_earth_18', search: '화석' },
  { unit: 'fit_earth_18', search: '소행성' },
  { unit: 'fit_earth_19', search: '화성' },
  { unit: 'fit_earth_20', search: '진도' }
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/science/fit_earth_content.js", content);
console.log("\n완료!");

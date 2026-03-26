const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/science/deep_earth_content.js", "utf8");

// passage에 태그 추가
const addTags = [
  { unit: 'deep_earth_02', search: '맨틀 대류' },
  { unit: 'deep_earth_02', search: '지열 에너지' },
  { unit: 'deep_earth_06', search: '내진 설계' },
  { unit: 'deep_earth_06', search: '단층' },
  { unit: 'deep_earth_07', search: '판구조론' },
  { unit: 'deep_earth_07', search: '발산 경계' },
  { unit: 'deep_earth_07', search: '수렴 경계' },
  { unit: 'deep_earth_07', search: '변환 경계' },
  { unit: 'deep_earth_08', search: '지층 누중의 법칙' },
  { unit: 'deep_earth_09', search: '화석' },
  { unit: 'deep_earth_09', search: '삼엽충' },
  { unit: 'deep_earth_10', search: '대륙 이동설' },
  { unit: 'deep_earth_11', search: '무역풍' },
  { unit: 'deep_earth_11', search: '편서풍' },
  { unit: 'deep_earth_12', search: '적란운' },
  { unit: 'deep_earth_16', search: '호상 철광층' },
  { unit: 'deep_earth_17', search: '조력 발전' },
  { unit: 'deep_earth_17', search: '파력 발전' },
  { unit: 'deep_earth_18', search: '대산화 사건' },
  { unit: 'deep_earth_18', search: '표준 화석' },
  { unit: 'deep_earth_18', search: '제4기' }
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/science/deep_earth_content.js", content);
console.log(`\n태그 추가: ${tagAddCount}개 완료!`);

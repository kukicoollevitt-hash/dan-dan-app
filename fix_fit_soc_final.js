const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/social/fit_soc_content.js", "utf8");

// fit_soc_15에서 태그 제거
['온실가스', '생태계'].forEach(tag => {
  const regex = new RegExp(`<b>${tag}</b>`, 'g');
  const before = content;
  content = content.replace(regex, tag);
  if (before !== content) {
    console.log(`태그 제거: <b>${tag}</b> -> ${tag}`);
  }
});

// fit_soc_08에서 '인공지능(AI)' vocab/vocabFill 제거
const escapedWord = '인공지능\\(AI\\)';
const vocabRegex = new RegExp(`\\s*\\['${escapedWord}',\\s*'[^']*'\\],?\\n?`, 'g');
let before = content;
content = content.replace(vocabRegex, '');
if (before !== content) {
  console.log(`vocab 제거: fit_soc_08 - 인공지능(AI)`);
}

// 태그 추가
const addTags = [
  { unit: 'fit_soc_01', search: '책임' },
  { unit: 'fit_soc_02', search: '공동체' },
  { unit: 'fit_soc_03', search: '존중' },
  { unit: 'fit_soc_08', search: '학습' },
  { unit: 'fit_soc_08', search: '책임' },
  { unit: 'fit_soc_16', search: '협력' }
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/social/fit_soc_content.js", content);
console.log("\n완료!");

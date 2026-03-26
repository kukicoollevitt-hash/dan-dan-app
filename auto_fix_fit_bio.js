const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/science/fit_bio_content.js", "utf8");

// 1. passage에서 태그 제거 (vocab에 없는 것들)
const passageOnlyTags = [
  '결혼 비행',    // fit_bio_04
  '덩굴줄기',     // fit_bio_06
  '생존 전략',    // fit_bio_06
  '에너지원',     // fit_bio_07
  '햇빛',         // fit_bio_07
  '온도',         // fit_bio_07
  '물질대사',     // fit_bio_08
  '정자',         // fit_bio_09
  '난자',         // fit_bio_09
  '대장',         // fit_bio_10
  '이산화탄소',   // fit_bio_11
  '산소',         // fit_bio_12
  '방광',         // fit_bio_12
  '오염',         // fit_bio_17
  '서식지를 이동' // fit_bio_19
];

passageOnlyTags.forEach(tag => {
  const regex = new RegExp(`<b>${tag}</b>`, 'g');
  const before = content;
  content = content.replace(regex, tag);
  if (before !== content) {
    console.log(`태그 제거: <b>${tag}</b> -> ${tag}`);
  }
});

// 2. passage에 태그 추가 (vocab에 있지만 태그 없는 것들)
const addTags = [
  { unit: 'fit_bio_03', search: '진화' },
  { unit: 'fit_bio_04', search: '먹이 사슬' },
  { unit: 'fit_bio_06', search: '관다발' },
  { unit: 'fit_bio_07', search: '에너지' },
  { unit: 'fit_bio_09', search: '생식 세포' },
  { unit: 'fit_bio_12', search: '배설' },
  { unit: 'fit_bio_12', search: '오줌' },
  { unit: 'fit_bio_14', search: '칼슘' },
  { unit: 'fit_bio_17', search: '환경 오염' },
  { unit: 'fit_bio_17', search: '분리수거' }
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/science/fit_bio_content.js", content);
console.log("\n태그 수정 완료!");

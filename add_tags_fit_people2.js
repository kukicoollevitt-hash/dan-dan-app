const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/person/fit_people2_content.js", "utf8");

// passage에 태그 추가
const addTags = [
  { unit: 'fit_people2_01', search: '르네상스' },
  { unit: 'fit_people2_01', search: '감동' },
  { unit: 'fit_people2_02', search: '르네상스' },
  { unit: 'fit_people2_02', search: '완성' },
  { unit: 'fit_people2_03', search: '감동' },
  { unit: 'fit_people2_06', search: '도전' },
  { unit: 'fit_people2_07', search: '차별' },
  { unit: 'fit_people2_09', search: '좌절' },
  { unit: 'fit_people2_12', search: '인내' },
  { unit: 'fit_people2_13', search: '도전' },
  { unit: 'fit_people2_14', search: '빈민가' },
  { unit: 'fit_people2_15', search: '도전' },
  { unit: 'fit_people2_16', search: '도전' },
  { unit: 'fit_people2_18', search: '인내' },
  { unit: 'fit_people2_19', search: '고아원' },
  { unit: 'fit_people2_27', search: '신학' },
  { unit: 'fit_people2_34', search: '도전' },
  { unit: 'fit_people2_35', search: '기부' },
  { unit: 'fit_people2_38', search: '고고학자' }
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/person/fit_people2_content.js", content);
console.log(`\n태그 추가: ${tagAddCount}개 완료!`);

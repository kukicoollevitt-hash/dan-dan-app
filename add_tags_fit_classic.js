const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/korlit/fit_classic_content.js", "utf8");

// passage에 태그 추가
const addTags = [
  { unit: 'fit_classic_01', search: '기생' },
  { unit: 'fit_classic_01', search: '관아' },
  { unit: 'fit_classic_01', search: '약속' },
  { unit: 'fit_classic_01', search: '벼슬' },
  { unit: 'fit_classic_04', search: '선비' },
  { unit: 'fit_classic_04', search: '관직' },
  { unit: 'fit_classic_04', search: '제자' },
  { unit: 'fit_classic_05', search: '모함' },
  { unit: 'fit_classic_06', search: '시주' },
  { unit: 'fit_classic_07', search: '박씨' },
  { unit: 'fit_classic_08', search: '용궁' },
  { unit: 'fit_classic_08', search: '지혜' },
  { unit: 'fit_classic_08', search: '의인화' },
  { unit: 'fit_classic_09', search: '억울함' },
  { unit: 'fit_classic_09', search: '모함' },
  { unit: 'fit_classic_13', search: '허물' },
  { unit: 'fit_classic_14', search: '총애' },
  { unit: 'fit_classic_14', search: '신분 제도' },
  { unit: 'fit_classic_15', search: '기생' },
  { unit: 'fit_classic_15', search: '과거' },
  { unit: 'fit_classic_15', search: '통곡' },
  { unit: 'fit_classic_17', search: '첩' },
  { unit: 'fit_classic_17', search: '간악' },
  { unit: 'fit_classic_17', search: '모함' },
  { unit: 'fit_classic_17', search: '명예' },
  { unit: 'fit_classic_20', search: '선비' },
  { unit: 'fit_classic_21', search: '양반' },
  { unit: 'fit_classic_21', search: '신분 제도' },
  { unit: 'fit_classic_23', search: '기생' },
  { unit: 'fit_classic_24', search: '선비' },
  { unit: 'fit_classic_24', search: '과거' },
  { unit: 'fit_classic_24', search: '재산' },
  { unit: 'fit_classic_25', search: '모함' },
  { unit: 'fit_classic_25', search: '인연' },
  { unit: 'fit_classic_31', search: '허물' },
  { unit: 'fit_classic_32', search: '저승' },
  { unit: 'fit_classic_33', search: '벼슬' },
  { unit: 'fit_classic_33', search: '명예' },
  { unit: 'fit_classic_34', search: '명예' },
  { unit: 'fit_classic_34', search: '충성' },
  { unit: 'fit_classic_35', search: '모함' },
  { unit: 'fit_classic_35', search: '처벌' },
  { unit: 'fit_classic_35', search: '벼슬' },
  { unit: 'fit_classic_38', search: '모함' },
  { unit: 'fit_classic_38', search: '명예' },
  { unit: 'fit_classic_38', search: '정의' },
  { unit: 'fit_classic_39', search: '선비' },
  { unit: 'fit_classic_39', search: '비밀' },
  { unit: 'fit_classic_39', search: '약속' }
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/korlit/fit_classic_content.js", content);
console.log(`\n태그 추가: ${tagAddCount}개 완료!`);

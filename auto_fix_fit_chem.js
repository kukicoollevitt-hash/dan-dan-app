const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/science/fit_chem_content.js", "utf8");

// 1. passage에서 태그 제거
const passageOnlyTags = [
  '용도', '매끄러워', '원리',  // fit_chem_01
  '시럽',                      // fit_chem_03
  '공간을 차지',               // fit_chem_04
  '원자량',                    // fit_chem_06
  '계수 맞추기',               // fit_chem_09
  'pH 미터', '만능 지시약',    // fit_chem_10
  '산소', '도금',              // fit_chem_11
  '전기 에너지를 화학 에너지로', '화학 에너지를 전기 에너지로', // fit_chem_12
  '보편적 용매', '불포화 용액', // fit_chem_13
  '기압(atm)', '파스칼(Pa)', '보일', '압력과 부피는 반비례', '샤를', '온도와 부피는 비례', '팽창', // fit_chem_14
  '촉매 변환기',               // fit_chem_15
  '촉매',                      // fit_chem_18
  '성분 분석',                 // fit_chem_19
  '나노 의약품'                // fit_chem_20
];

passageOnlyTags.forEach(tag => {
  const escapedTag = tag.replace(/[()]/g, '\\$&');
  const regex = new RegExp(`<b>${escapedTag}</b>`, 'g');
  const before = content;
  content = content.replace(regex, tag);
  if (before !== content) {
    console.log(`태그 제거: <b>${tag}</b> -> ${tag}`);
  }
});

// 2. passage에 태그 추가
const addTags = [
  { unit: 'fit_chem_05', search: '기체' },
  { unit: 'fit_chem_05', search: '액체' },
  { unit: 'fit_chem_05', search: '고체' },
  { unit: 'fit_chem_07', search: '전하' },
  { unit: 'fit_chem_08', search: '녹는점' },
  { unit: 'fit_chem_09', search: '정량적' },
  { unit: 'fit_chem_10', search: '제산제' },
  { unit: 'fit_chem_11', search: '산화물' },
  { unit: 'fit_chem_11', search: '녹' },
  { unit: 'fit_chem_11', search: '제철' },
  { unit: 'fit_chem_14', search: '기압' },
  { unit: 'fit_chem_14', search: '파스칼' },
  { unit: 'fit_chem_14', search: '반비례' },
  { unit: 'fit_chem_14', search: '비례' },
  { unit: 'fit_chem_15', search: '반응열' }
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/science/fit_chem_content.js", content);
console.log("\n태그 수정 완료!");

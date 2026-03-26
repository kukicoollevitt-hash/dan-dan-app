const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/social/fit_soc_content.js", "utf8");

// 1. passage에서 태그 제거
const passageOnlyTags = [
  '아끼고', '단위',                    // fit_soc_01
  '다양화', '존중',                    // fit_soc_02
  '책임감',                            // fit_soc_03, fit_soc_06
  '공동체',                            // fit_soc_05
  '자기 통제력', '오프라인',           // fit_soc_07
  '윤리', '창의성', '협력',            // fit_soc_08
  '편견',                              // fit_soc_09
  '라면', '문화적 의미', '라면 문화', '학습', '전승', '변동', // fit_soc_10
  '오징어 게임', '제작 품질', '창작자', '경제적 효과', '문화의 경제적 파급효과', '문화 교류', // fit_soc_11
  '클릭', '분노', '공포', '민주주의', '알고리즘', // fit_soc_12
  '선거 연령', '목소리',               // fit_soc_13
  '공정으로서의 정의', '토론',         // fit_soc_14
  '동식물', '실천', '책임', 'ESG 경영', '인류', // fit_soc_15
  '고유문화',                          // fit_soc_16
  '인공지능(AI)', '사물인터넷(IoT)', '창의력', // fit_soc_17
  '복지 전달 체계',                    // fit_soc_18
  '지속가능발전목표(SDGs)', '녹색 소비', // fit_soc_19
  '협업 능력', '창의적 문제 해결력'    // fit_soc_20
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
  { unit: 'fit_soc_11', search: '파급효과' },
  { unit: 'fit_soc_15', search: '생태계' },
  { unit: 'fit_soc_16', search: '공정무역' },
  { unit: 'fit_soc_17', search: '인공지능' },
  { unit: 'fit_soc_17', search: '사물인터넷' },
  { unit: 'fit_soc_19', search: '지속가능발전목표' },
  { unit: 'fit_soc_19', search: '재활용' },
  { unit: 'fit_soc_20', search: '투표' },
  { unit: 'fit_soc_20', search: '공동체' },
  { unit: 'fit_soc_20', search: '권리' }
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
console.log("\n태그 수정 완료!");

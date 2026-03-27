const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/person/deep_people2_content.js", "utf8");

// passage에 태그 추가 - vocabOnly 단어들
const addTags = [
  // deep_people2_01
  { unit: 'deep_people2_01', search: '천재' },
  { unit: 'deep_people2_01', search: '르네상스' },
  { unit: 'deep_people2_01', search: '관찰' },
  { unit: 'deep_people2_01', search: '탐구' },
  { unit: 'deep_people2_01', search: '발명가' },
  { unit: 'deep_people2_01', search: '해부학' },
  { unit: 'deep_people2_01', search: '감동' },
  { unit: 'deep_people2_01', search: '공방' },
  // deep_people2_04
  { unit: 'deep_people2_04', search: '공연' },
  // deep_people2_05
  { unit: 'deep_people2_05', search: '천재' },
  // deep_people2_06
  { unit: 'deep_people2_06', search: '열정' },
  { unit: 'deep_people2_06', search: '도전' },
  { unit: 'deep_people2_06', search: '실험' },
  { unit: 'deep_people2_06', search: '발견' },
  { unit: 'deep_people2_06', search: '업적' },
  { unit: 'deep_people2_06', search: '인도주의자' },
  // deep_people2_07
  { unit: 'deep_people2_07', search: '변호사' },
  // deep_people2_08
  { unit: 'deep_people2_08', search: '실험' },
  { unit: 'deep_people2_08', search: '도전' },
  { unit: 'deep_people2_08', search: '교훈' },
  // deep_people2_09
  { unit: 'deep_people2_09', search: '청력' },
  { unit: 'deep_people2_09', search: '좌절' },
  { unit: 'deep_people2_09', search: '인내' },
  { unit: 'deep_people2_09', search: '열정' },
  { unit: 'deep_people2_09', search: '노력' },
  // deep_people2_10
  { unit: 'deep_people2_10', search: '열정' },
  { unit: 'deep_people2_10', search: '외로움' },
  { unit: 'deep_people2_10', search: '걸작' },
  { unit: 'deep_people2_10', search: '혁신' },
  { unit: 'deep_people2_10', search: '교훈' },
  { unit: 'deep_people2_10', search: '상징' },
  // deep_people2_11
  { unit: 'deep_people2_11', search: '업적' },
  // deep_people2_12
  { unit: 'deep_people2_12', search: '자유' },
  // deep_people2_13
  { unit: 'deep_people2_13', search: '혁신' },
  { unit: 'deep_people2_13', search: '메시지' },
  { unit: 'deep_people2_13', search: '도전' },
  // deep_people2_15
  { unit: 'deep_people2_15', search: '재능' },
  { unit: 'deep_people2_15', search: '시도' },
  { unit: 'deep_people2_15', search: '혁명' },
  { unit: 'deep_people2_15', search: '도전' },
  { unit: 'deep_people2_15', search: '조각' },
  { unit: 'deep_people2_15', search: '비극' },
  // deep_people2_16
  { unit: 'deep_people2_16', search: '예술' },
  { unit: 'deep_people2_16', search: '혁신' },
  { unit: 'deep_people2_16', search: '영감' },
  // deep_people2_17
  { unit: 'deep_people2_17', search: '재능' },
  { unit: 'deep_people2_17', search: '혁명' },
  { unit: 'deep_people2_17', search: '백신' },
  { unit: 'deep_people2_17', search: '관찰' },
  { unit: 'deep_people2_17', search: '실험' },
  // deep_people2_18
  { unit: 'deep_people2_18', search: '기적' },
  { unit: 'deep_people2_18', search: '인내' },
  { unit: 'deep_people2_18', search: '열정' },
  { unit: 'deep_people2_18', search: '도전' },
  // deep_people2_19
  { unit: 'deep_people2_19', search: '고아원' },
  { unit: 'deep_people2_19', search: '슬픔' },
  { unit: 'deep_people2_19', search: '비극' },
  { unit: 'deep_people2_19', search: '희망' },
  { unit: 'deep_people2_19', search: '재능' },
  { unit: 'deep_people2_19', search: '감동' },
  // deep_people2_20
  { unit: 'deep_people2_20', search: '관찰' },
  { unit: 'deep_people2_20', search: '발견' },
  { unit: 'deep_people2_20', search: '인내' },
  // deep_people2_21
  { unit: 'deep_people2_21', search: '공방' },
  // deep_people2_22
  { unit: 'deep_people2_22', search: '열정' },
  { unit: 'deep_people2_22', search: '재능' },
  { unit: 'deep_people2_22', search: '고통' },
  { unit: 'deep_people2_22', search: '후원' },
  // deep_people2_23
  { unit: 'deep_people2_23', search: '공방' },
  { unit: 'deep_people2_23', search: '표정' },
  { unit: 'deep_people2_23', search: '발명가' },
  { unit: 'deep_people2_23', search: '관찰' },
  { unit: 'deep_people2_23', search: '공증인' },
  { unit: 'deep_people2_23', search: '해부학' },
  { unit: 'deep_people2_23', search: '르네상스' },
  // deep_people2_24
  { unit: 'deep_people2_24', search: '유산' },
  // deep_people2_25
  { unit: 'deep_people2_25', search: '생계' },
  { unit: 'deep_people2_25', search: '평등' },
  // deep_people2_27
  { unit: 'deep_people2_27', search: '신학' },
  { unit: 'deep_people2_27', search: '평등' },
  // deep_people2_29
  { unit: 'deep_people2_29', search: '혁신' },
  { unit: 'deep_people2_29', search: '열정' },
  // deep_people2_30
  { unit: 'deep_people2_30', search: '용기' },
  { unit: 'deep_people2_30', search: '업적' },
  // deep_people2_33
  { unit: 'deep_people2_33', search: '토대' },
  // deep_people2_34
  { unit: 'deep_people2_34', search: '도전' },
  { unit: 'deep_people2_34', search: '혁신' },
  { unit: 'deep_people2_34', search: '충격' },
  // deep_people2_35
  { unit: 'deep_people2_35', search: '변호사' },
  { unit: 'deep_people2_35', search: '혁신' },
  { unit: 'deep_people2_35', search: '기부' },
  // deep_people2_36
  { unit: 'deep_people2_36', search: '영감' },
  // deep_people2_37
  { unit: 'deep_people2_37', search: '평등' },
  { unit: 'deep_people2_37', search: '명예' },
  { unit: 'deep_people2_37', search: '영감' },
  // deep_people2_38
  { unit: 'deep_people2_38', search: '파라오' },
  { unit: 'deep_people2_38', search: '고고학자' },
  // deep_people2_39
  { unit: 'deep_people2_39', search: '관찰' },
  { unit: 'deep_people2_39', search: '실험' },
  // deep_people2_40
  { unit: 'deep_people2_40', search: '천재' }
];

let tagAddCount = 0;
let notFoundList = [];

addTags.forEach(item => {
  const unitStart = content.indexOf(item.unit + ':');
  if (unitStart === -1) return;

  const nextUnitNum = parseInt(item.unit.split('_')[2]) + 1;
  const nextUnit = 'deep_people2_' + String(nextUnitNum).padStart(2, '0');
  const nextUnitStart = content.indexOf(nextUnit + ':', unitStart);

  const passageStart = content.indexOf('passage:', unitStart);
  const vocabStart = content.indexOf('vocab:', passageStart);

  if (passageStart === -1 || vocabStart === -1) return;

  const effectiveVocabStart = (nextUnitStart !== -1 && vocabStart > nextUnitStart) ? nextUnitStart : vocabStart;
  const passageSection = content.substring(passageStart, effectiveVocabStart);

  if (passageSection.includes(`<b>${item.search}</b>`)) return;

  if (passageSection.includes(item.search)) {
    const newPassage = passageSection.replace(item.search, `<b>${item.search}</b>`);
    content = content.substring(0, passageStart) + newPassage + content.substring(effectiveVocabStart);
    tagAddCount++;
    console.log(`태그 추가: ${item.unit} - ${item.search}`);
  } else {
    notFoundList.push(`${item.unit} - ${item.search}`);
  }
});

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/person/deep_people2_content.js", content);
console.log(`\n태그 추가: ${tagAddCount}개 완료!`);

if (notFoundList.length > 0) {
  console.log(`\n단어 없음 (${notFoundList.length}개):`);
  notFoundList.forEach(item => console.log(`  ${item}`));
}

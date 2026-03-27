const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/korlit/deep_classic_content.js", "utf8");

// passage에 태그 추가
const addTags = [
  // deep_classic_01
  { unit: 'deep_classic_01', search: '기생' },
  { unit: 'deep_classic_01', search: '관아' },
  { unit: 'deep_classic_01', search: '약속' },
  { unit: 'deep_classic_01', search: '벼슬' },
  { unit: 'deep_classic_01', search: '양반' },
  { unit: 'deep_classic_01', search: '인연' },
  // deep_classic_03
  { unit: 'deep_classic_03', search: '영웅' },
  // deep_classic_04
  { unit: 'deep_classic_04', search: '선비' },
  { unit: 'deep_classic_04', search: '겸손' },
  // deep_classic_05
  { unit: 'deep_classic_05', search: '모함' },
  { unit: 'deep_classic_05', search: '억울함' },
  // deep_classic_06
  { unit: 'deep_classic_06', search: '시주' },
  { unit: 'deep_classic_06', search: '기적' },
  // deep_classic_07
  { unit: 'deep_classic_07', search: '박씨' },
  { unit: 'deep_classic_07', search: '탐욕' },
  // deep_classic_08
  { unit: 'deep_classic_08', search: '지혜' },
  { unit: 'deep_classic_08', search: '의인화' },
  { unit: 'deep_classic_08', search: '벼슬' },
  { unit: 'deep_classic_08', search: '위기' },
  // deep_classic_09
  { unit: 'deep_classic_09', search: '억울함' },
  { unit: 'deep_classic_09', search: '모함' },
  // deep_classic_11
  { unit: 'deep_classic_11', search: '유혹' },
  // deep_classic_12
  { unit: 'deep_classic_12', search: '탐욕' },
  // deep_classic_13
  { unit: 'deep_classic_13', search: '치욕' },
  // deep_classic_14
  { unit: 'deep_classic_14', search: '밀회' },
  // deep_classic_15
  { unit: 'deep_classic_15', search: '기생' },
  { unit: 'deep_classic_15', search: '과거' },
  { unit: 'deep_classic_15', search: '그리움' },
  { unit: 'deep_classic_15', search: '효도' },
  { unit: 'deep_classic_15', search: '통곡' },
  // deep_classic_16
  { unit: 'deep_classic_16', search: '김만중' },
  // deep_classic_17
  { unit: 'deep_classic_17', search: '첩' },
  { unit: 'deep_classic_17', search: '간악' },
  { unit: 'deep_classic_17', search: '모함' },
  { unit: 'deep_classic_17', search: '명예' },
  // deep_classic_18
  { unit: 'deep_classic_18', search: '도리' },
  // deep_classic_20
  { unit: 'deep_classic_20', search: '선비' },
  { unit: 'deep_classic_20', search: '조언' },
  { unit: 'deep_classic_20', search: '비판' },
  // deep_classic_21
  { unit: 'deep_classic_21', search: '양반' },
  // deep_classic_22
  { unit: 'deep_classic_22', search: '비판' },
  { unit: 'deep_classic_22', search: '탐욕' },
  // deep_classic_23
  { unit: 'deep_classic_23', search: '기생' },
  { unit: 'deep_classic_23', search: '현명' },
  // deep_classic_24
  { unit: 'deep_classic_24', search: '선비' },
  { unit: 'deep_classic_24', search: '과거' },
  { unit: 'deep_classic_24', search: '화목' },
  { unit: 'deep_classic_24', search: '보은' },
  { unit: 'deep_classic_24', search: '재산' },
  { unit: 'deep_classic_24', search: '감동' },
  { unit: 'deep_classic_24', search: '존경' },
  // deep_classic_25
  { unit: 'deep_classic_25', search: '모함' },
  { unit: 'deep_classic_25', search: '인연' },
  { unit: 'deep_classic_25', search: '과거' },
  // deep_classic_26
  { unit: 'deep_classic_26', search: '기적' },
  { unit: 'deep_classic_26', search: '희망' },
  { unit: 'deep_classic_26', search: '풍랑' },
  // deep_classic_27
  { unit: 'deep_classic_27', search: '혼란' },
  // deep_classic_28
  { unit: 'deep_classic_28', search: '평등' },
  // deep_classic_30
  { unit: 'deep_classic_30', search: '교훈' },
  // deep_classic_31
  { unit: 'deep_classic_31', search: '용기' },
  { unit: 'deep_classic_31', search: '위험' },
  // deep_classic_32
  { unit: 'deep_classic_32', search: '기적' },
  { unit: 'deep_classic_32', search: '존경' },
  { unit: 'deep_classic_32', search: '교훈' },
  // deep_classic_33
  { unit: 'deep_classic_33', search: '벼슬' },
  { unit: 'deep_classic_33', search: '명예' },
  { unit: 'deep_classic_33', search: '존경' },
  // deep_classic_34
  { unit: 'deep_classic_34', search: '명예' },
  { unit: 'deep_classic_34', search: '충성' },
  // deep_classic_35
  { unit: 'deep_classic_35', search: '모함' },
  { unit: 'deep_classic_35', search: '벼슬' },
  // deep_classic_36
  { unit: 'deep_classic_36', search: '굶주림' },
  { unit: 'deep_classic_36', search: '능력' },
  // deep_classic_37
  { unit: 'deep_classic_37', search: '과거' },
  { unit: 'deep_classic_37', search: '치욕' },
  // deep_classic_38
  { unit: 'deep_classic_38', search: '모함' },
  { unit: 'deep_classic_38', search: '설움' },
  { unit: 'deep_classic_38', search: '의지' },
  { unit: 'deep_classic_38', search: '복수' },
  { unit: 'deep_classic_38', search: '벼슬' },
  { unit: 'deep_classic_38', search: '명예' },
  // deep_classic_39
  { unit: 'deep_classic_39', search: '선비' },
  { unit: 'deep_classic_39', search: '행복' },
  { unit: 'deep_classic_39', search: '비밀' },
  { unit: 'deep_classic_39', search: '약속' }
];

let tagAddCount = 0;
let notFoundList = [];

addTags.forEach(item => {
  const unitStart = content.indexOf(item.unit + ':');
  if (unitStart === -1) {
    console.log(`유닛 없음: ${item.unit}`);
    return;
  }

  const nextUnitNum = parseInt(item.unit.split('_')[2]) + 1;
  const nextUnit = 'deep_classic_' + String(nextUnitNum).padStart(2, '0');
  const nextUnitStart = content.indexOf(nextUnit + ':', unitStart);

  const passageStart = content.indexOf('passage:', unitStart);
  const vocabStart = content.indexOf('vocab:', passageStart);

  if (passageStart === -1 || vocabStart === -1) {
    console.log(`passage/vocab 없음: ${item.unit}`);
    return;
  }

  // 현재 유닛 범위 내에서만 처리
  const effectiveVocabStart = (nextUnitStart !== -1 && vocabStart > nextUnitStart) ? nextUnitStart : vocabStart;
  const passageSection = content.substring(passageStart, effectiveVocabStart);

  if (passageSection.includes(`<b>${item.search}</b>`)) {
    console.log(`이미 태그 있음: ${item.unit} - ${item.search}`);
    return;
  }

  if (passageSection.includes(item.search)) {
    const newPassage = passageSection.replace(item.search, `<b>${item.search}</b>`);
    content = content.substring(0, passageStart) + newPassage + content.substring(effectiveVocabStart);
    tagAddCount++;
    console.log(`태그 추가: ${item.unit} - ${item.search}`);
  } else {
    notFoundList.push(`${item.unit} - ${item.search}`);
  }
});

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/korlit/deep_classic_content.js", content);
console.log(`\n태그 추가: ${tagAddCount}개 완료!`);

if (notFoundList.length > 0) {
  console.log(`\n단어 없음 (${notFoundList.length}개):`);
  notFoundList.forEach(item => console.log(`  ${item}`));
}

const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/person/deep_people1_content.js", "utf8");

// 1. 추가 passage 태그 제거
const passageOnlyTags = ['전시'];

let tagRemoveCount = 0;
passageOnlyTags.forEach(tag => {
  const regex = new RegExp(`<b>${tag.replace(/[()]/g, '\\$&')}</b>`, 'g');
  const before = content;
  content = content.replace(regex, tag);
  if (before !== content) {
    tagRemoveCount++;
    console.log(`태그 제거: <b>${tag}</b> -> ${tag}`);
  }
});

// 2. passage에 태그 추가 - vocabOnly 단어들
const addTags = [
  // deep_people1_01
  { unit: 'deep_people1_01', search: '결심' },
  { unit: 'deep_people1_01', search: '의지' },
  // deep_people1_02
  { unit: 'deep_people1_02', search: '각오' },
  { unit: 'deep_people1_02', search: '전투' },
  { unit: 'deep_people1_02', search: '위협' },
  // deep_people1_03
  { unit: 'deep_people1_03', search: '가르침' },
  { unit: 'deep_people1_03', search: '백성' },
  { unit: 'deep_people1_03', search: '진리' },
  // deep_people1_04
  { unit: 'deep_people1_04', search: '지형' },
  { unit: 'deep_people1_04', search: '관찰' },
  { unit: 'deep_people1_04', search: '문화유산' },
  { unit: 'deep_people1_04', search: '감동' },
  // deep_people1_05
  { unit: 'deep_people1_05', search: '등용' },
  { unit: 'deep_people1_05', search: '자격루' },
  { unit: 'deep_people1_05', search: '기술' },
  // deep_people1_06
  { unit: 'deep_people1_06', search: '전략' },
  { unit: 'deep_people1_06', search: '격파' },
  // deep_people1_07
  { unit: 'deep_people1_07', search: '학문' },
  { unit: 'deep_people1_07', search: '업적' },
  // deep_people1_08
  { unit: 'deep_people1_08', search: '헌신' },
  { unit: 'deep_people1_08', search: '존경' },
  // deep_people1_09
  { unit: 'deep_people1_09', search: '존경' },
  { unit: 'deep_people1_09', search: '재능' },
  { unit: 'deep_people1_09', search: '학문' },
  { unit: 'deep_people1_09', search: '사실적' },
  { unit: 'deep_people1_09', search: '교육' },
  { unit: 'deep_people1_09', search: '열정' },
  { unit: 'deep_people1_09', search: '초상' },
  // deep_people1_10
  { unit: 'deep_people1_10', search: '학문' },
  { unit: 'deep_people1_10', search: '정진' },
  { unit: 'deep_people1_10', search: '철학' },
  { unit: 'deep_people1_10', search: '교육' },
  // deep_people1_11
  { unit: 'deep_people1_11', search: '정치' },
  { unit: 'deep_people1_11', search: '보좌' },
  { unit: 'deep_people1_11', search: '침략' },
  // deep_people1_12
  { unit: 'deep_people1_12', search: '재주' },
  { unit: 'deep_people1_12', search: '화성' },
  // deep_people1_13
  { unit: 'deep_people1_13', search: '개척' },
  { unit: 'deep_people1_13', search: '시호' },
  { unit: 'deep_people1_13', search: '리더십' },
  { unit: 'deep_people1_13', search: '정복' },
  { unit: 'deep_people1_13', search: '용맹' },
  { unit: 'deep_people1_13', search: '침입' },
  // deep_people1_14
  { unit: 'deep_people1_14', search: '침략' },
  { unit: 'deep_people1_14', search: '전략' },
  { unit: 'deep_people1_14', search: '보급' },
  { unit: 'deep_people1_14', search: '분노' },
  // deep_people1_15
  { unit: 'deep_people1_15', search: '행정' },
  { unit: 'deep_people1_15', search: '장수' },
  { unit: 'deep_people1_15', search: '경험' },
  { unit: 'deep_people1_15', search: '전략' },
  // deep_people1_16
  { unit: 'deep_people1_16', search: '확신' },
  { unit: 'deep_people1_16', search: '결심' },
  // deep_people1_17
  { unit: 'deep_people1_17', search: '충신' },
  { unit: 'deep_people1_17', search: '인재' },
  { unit: 'deep_people1_17', search: '암살' },
  { unit: 'deep_people1_17', search: '신념' },
  { unit: 'deep_people1_17', search: '계승' },
  // deep_people1_18
  { unit: 'deep_people1_18', search: '청렴' },
  { unit: 'deep_people1_18', search: '헌신' },
  { unit: 'deep_people1_18', search: '공정' },
  // deep_people1_19
  { unit: 'deep_people1_19', search: '복속' },
  { unit: 'deep_people1_19', search: '용맹' },
  { unit: 'deep_people1_19', search: '사명감' },
  { unit: 'deep_people1_19', search: '지혜' },
  { unit: 'deep_people1_19', search: '위협' },
  { unit: 'deep_people1_19', search: '항복' },
  // deep_people1_20
  { unit: 'deep_people1_20', search: '실용적' },
  { unit: 'deep_people1_20', search: '열정' },
  { unit: 'deep_people1_20', search: '헌신' },
  // deep_people1_21
  { unit: 'deep_people1_21', search: '침략' },
  { unit: 'deep_people1_21', search: '애국심' },
  // deep_people1_22
  { unit: 'deep_people1_22', search: '설득' },
  { unit: 'deep_people1_22', search: '희생' },
  { unit: 'deep_people1_22', search: '고문' },
  { unit: 'deep_people1_22', search: '용기' },
  { unit: 'deep_people1_22', search: '상징' },
  // deep_people1_23
  { unit: 'deep_people1_23', search: '독립' },
  { unit: 'deep_people1_23', search: '전승' },
  { unit: 'deep_people1_23', search: '희생' },
  { unit: 'deep_people1_23', search: '전환점' },
  // deep_people1_24
  { unit: 'deep_people1_24', search: '독립' },
  { unit: 'deep_people1_24', search: '문화' },
  // deep_people1_25
  { unit: 'deep_people1_25', search: '열정' },
  { unit: 'deep_people1_25', search: '희생' },
  { unit: 'deep_people1_25', search: '정진' },
  { unit: 'deep_people1_25', search: '인내' },
  // deep_people1_26
  { unit: 'deep_people1_26', search: '재능' },
  { unit: 'deep_people1_26', search: '탁월' },
  { unit: 'deep_people1_26', search: '걸작' },
  // deep_people1_27
  { unit: 'deep_people1_27', search: '걸작' },
  { unit: 'deep_people1_27', search: '파격적' },
  { unit: 'deep_people1_27', search: '세밀' },
  // deep_people1_28
  { unit: 'deep_people1_28', search: '문물' },
  { unit: 'deep_people1_28', search: '관찰력' },
  { unit: 'deep_people1_28', search: '개방' },
  { unit: 'deep_people1_28', search: '소설' },
  { unit: 'deep_people1_28', search: '비판' },
  // deep_people1_29
  { unit: 'deep_people1_29', search: '기도' },
  // deep_people1_30
  { unit: 'deep_people1_30', search: '저술' },
  { unit: 'deep_people1_30', search: '공헌' },
  { unit: 'deep_people1_30', search: '보급' },
  { unit: 'deep_people1_30', search: '유지' },
  { unit: 'deep_people1_30', search: '헌신' },
  // deep_people1_31
  { unit: 'deep_people1_31', search: '철학' },
  { unit: 'deep_people1_31', search: '사랑' },
  // deep_people1_32
  { unit: 'deep_people1_32', search: '군사' },
  { unit: 'deep_people1_32', search: '계승' },
  { unit: 'deep_people1_32', search: '선구자' },
  { unit: 'deep_people1_32', search: '도전' },
  // deep_people1_33
  { unit: 'deep_people1_33', search: '지혜' },
  { unit: 'deep_people1_33', search: '문화' },
  { unit: 'deep_people1_33', search: '인재' },
  { unit: 'deep_people1_33', search: '영감' },
  { unit: 'deep_people1_33', search: '업적' },
  // deep_people1_34
  { unit: 'deep_people1_34', search: '침략' },
  { unit: 'deep_people1_34', search: '전략' },
  { unit: 'deep_people1_34', search: '리더십' },
  { unit: 'deep_people1_34', search: '멸망' },
  { unit: 'deep_people1_34', search: '영광' },
  // deep_people1_35
  { unit: 'deep_people1_35', search: '충신' },
  { unit: 'deep_people1_35', search: '용기' },
  { unit: 'deep_people1_35', search: '의지' },
  { unit: 'deep_people1_35', search: '사기' },
  { unit: 'deep_people1_35', search: '전사' },
  { unit: 'deep_people1_35', search: '표본' },
  { unit: 'deep_people1_35', search: '유산' },
  // deep_people1_36
  { unit: 'deep_people1_36', search: '충성' },
  { unit: 'deep_people1_36', search: '청렴' },
  { unit: 'deep_people1_36', search: '영웅' },
  { unit: 'deep_people1_36', search: '벼슬' },
  { unit: 'deep_people1_36', search: '귀감' },
  // deep_people1_37
  { unit: 'deep_people1_37', search: '전략' },
  { unit: 'deep_people1_37', search: '단결' },
  { unit: 'deep_people1_37', search: '사기' },
  { unit: 'deep_people1_37', search: '용기' },
  { unit: 'deep_people1_37', search: '모범' },
  // deep_people1_38
  { unit: 'deep_people1_38', search: '저항' },
  { unit: 'deep_people1_38', search: '보급로' },
  { unit: 'deep_people1_38', search: '매복' },
  { unit: 'deep_people1_38', search: '사기' },
  { unit: 'deep_people1_38', search: '계기' },
  { unit: 'deep_people1_38', search: '선비' },
  { unit: 'deep_people1_38', search: '상징' },
  // deep_people1_39
  { unit: 'deep_people1_39', search: '귀양' },
  { unit: 'deep_people1_39', search: '보급' },
  { unit: 'deep_people1_39', search: '헌신' },
  // deep_people1_40
  { unit: 'deep_people1_40', search: '재능' },
  { unit: 'deep_people1_40', search: '슬픔' },
  { unit: 'deep_people1_40', search: '유산' },
  { unit: 'deep_people1_40', search: '업적' }
];

let tagAddCount = 0;
let notFoundList = [];

addTags.forEach(item => {
  const unitStart = content.indexOf(item.unit + ':');
  if (unitStart === -1) return;

  const nextUnitNum = parseInt(item.unit.split('_')[2]) + 1;
  const nextUnit = 'deep_people1_' + String(nextUnitNum).padStart(2, '0');
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/person/deep_people1_content.js", content);
console.log(`\n태그 제거: ${tagRemoveCount}개, 태그 추가: ${tagAddCount}개 완료!`);

if (notFoundList.length > 0) {
  console.log(`\n단어 없음 (${notFoundList.length}개):`);
  notFoundList.forEach(item => console.log(`  ${item}`));
}

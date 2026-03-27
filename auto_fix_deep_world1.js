const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/worldlit/deep_world1_content.js", "utf8");

// 1. passage에서 태그 제거
const passageOnlyTags = [
  // deep_world1_01
  '불안', '싱클레어', '고백하기로', '세상',
  // deep_world1_02
  '독립', '의지',
  // deep_world1_03
  '용감', '혼란', '고귀한', '간절히', '황홀한',
  // deep_world1_04
  '사제', '결혼', '시험', '어둠', '엄숙한', '인도', '빛',
  // deep_world1_05
  '관심', '애썼', '외로워', '북적', '여우', '길들여', '유일한', '깨달았', '시간',
  // deep_world1_06
  '수상한',
  // deep_world1_07
  '신기', '뉘우치고',
  // deep_world1_08
  '신비로운',
  // deep_world1_11
  '이야기',
  // deep_world1_19
  '모자',
  // deep_world1_28
  '마을 사람', '아이들',
  // deep_world1_33
  '교훈',
  // deep_world1_35
  '행복'
];

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

// 2. passage에 태그 추가
const addTags = [
  // deep_world1_06
  { unit: 'deep_world1_06', search: '보물' },
  // deep_world1_07
  { unit: 'deep_world1_07', search: '제페토' },
  // deep_world1_08
  { unit: 'deep_world1_08', search: '극복' },
  // deep_world1_09
  { unit: 'deep_world1_09', search: '여왕' },
  // deep_world1_10
  { unit: 'deep_world1_10', search: '규칙' },
  { unit: 'deep_world1_10', search: '순종' },
  { unit: 'deep_world1_10', search: '모글리' },
  // deep_world1_15
  { unit: 'deep_world1_15', search: '독' },
  { unit: 'deep_world1_15', search: '잠' },
  // deep_world1_16
  { unit: 'deep_world1_16', search: '왕자' },
  { unit: 'deep_world1_16', search: '마차' },
  { unit: 'deep_world1_16', search: '왕비' },
  { unit: 'deep_world1_16', search: '궁전' },
  // deep_world1_18
  { unit: 'deep_world1_18', search: '바늘' },
  { unit: 'deep_world1_18', search: '공주' },
  { unit: 'deep_world1_18', search: '호기심' },
  // deep_world1_19
  { unit: 'deep_world1_19', search: '숲' },
  { unit: 'deep_world1_19', search: '마을' },
  { unit: 'deep_world1_19', search: '위험' },
  { unit: 'deep_world1_19', search: '낯선' },
  // deep_world1_20
  { unit: 'deep_world1_20', search: '숲' },
  { unit: 'deep_world1_20', search: '용기' },
  // deep_world1_21
  { unit: 'deep_world1_21', search: '자유' },
  { unit: 'deep_world1_21', search: '재회' },
  { unit: 'deep_world1_21', search: '가시덤불' },
  // deep_world1_22
  { unit: 'deep_world1_22', search: '구름' },
  { unit: 'deep_world1_22', search: '보물' },
  // deep_world1_23
  { unit: 'deep_world1_23', search: '부지런' },
  { unit: 'deep_world1_23', search: '튼튼' },
  { unit: 'deep_world1_23', search: '준비' },
  // deep_world1_24
  { unit: 'deep_world1_24', search: '변화' },
  { unit: 'deep_world1_24', search: '가치' },
  // deep_world1_25
  { unit: 'deep_world1_25', search: '추위' },
  { unit: 'deep_world1_25', search: '불빛' },
  { unit: 'deep_world1_25', search: '미소' },
  { unit: 'deep_world1_25', search: '평화' },
  // deep_world1_26
  { unit: 'deep_world1_26', search: '여행' },
  { unit: 'deep_world1_26', search: '용기' },
  // deep_world1_27
  { unit: 'deep_world1_27', search: '마녀' },
  { unit: 'deep_world1_27', search: '사랑' },
  // deep_world1_28
  { unit: 'deep_world1_28', search: '하멜른' },
  { unit: 'deep_world1_28', search: '동굴' },
  { unit: 'deep_world1_28', search: '마을' },
  // deep_world1_29
  { unit: 'deep_world1_29', search: '카라바스' },
  // deep_world1_30
  { unit: 'deep_world1_30', search: '날개' },
  { unit: 'deep_world1_30', search: '친절' },
  // deep_world1_31
  { unit: 'deep_world1_31', search: '방앗간' },
  { unit: 'deep_world1_31', search: '엉망진창' },
  // deep_world1_32
  { unit: 'deep_world1_32', search: '드로셀마이어' },
  { unit: 'deep_world1_32', search: '장인' },
  { unit: 'deep_world1_32', search: '환영' },
  { unit: 'deep_world1_32', search: '황홀' },
  // deep_world1_34
  { unit: 'deep_world1_34', search: '도끼' },
  // deep_world1_38
  { unit: 'deep_world1_38', search: '비밀' },
  { unit: 'deep_world1_38', search: '특별한' },
  // deep_world1_39
  { unit: 'deep_world1_39', search: '진실' }
];

let tagAddCount = 0;
addTags.forEach(item => {
  const unitStart = content.indexOf(item.unit + ':');
  if (unitStart === -1) {
    console.log(`유닛 없음: ${item.unit}`);
    return;
  }

  const nextUnitNum = parseInt(item.unit.split('_')[2]) + 1;
  const nextUnit = 'deep_world1_' + String(nextUnitNum).padStart(2, '0');
  const nextUnitStart = content.indexOf(nextUnit + ':', unitStart);

  const passageStart = content.indexOf('passage:', unitStart);
  const vocabStart = content.indexOf('vocab:', passageStart);

  if (passageStart === -1 || vocabStart === -1) {
    console.log(`passage/vocab 없음: ${item.unit}`);
    return;
  }

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
    console.log(`단어 없음: ${item.unit} - ${item.search}`);
  }
});

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/worldlit/deep_world1_content.js", content);
console.log(`\n태그 제거: ${tagRemoveCount}개, 태그 추가: ${tagAddCount}개 완료!`);

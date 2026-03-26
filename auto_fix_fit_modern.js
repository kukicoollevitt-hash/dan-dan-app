const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/korlit/fit_modern_content.js", "utf8");

// 1. passage에서 태그 제거
const passageOnlyTags = [
  '은은히', '하얗게', '쫓겨나', '헛디뎌', '풍경', '머뭇거렸다',  // fit_modern_01
  '창백했다', '잊을 수 없는',  // fit_modern_02
  '노려보았다',  // fit_modern_03
  '싸늘하게', '쏟아지는',  // fit_modern_04
  '흐느끼는',  // fit_modern_06
  '순박한', '감자',  // fit_modern_07
  '감돌았다',  // fit_modern_08
  '포기', '먹먹하다', '좌절',  // fit_modern_09
  '권유', '대량 생산', '허무',  // fit_modern_10
  '얼굴이 고와', '방탕한', '저항', '세태소설',  // fit_modern_11
  '기생', '방황', '사실주의', '탐욕',  // fit_modern_12
  '축내는', '이기적',  // fit_modern_13
  '공간', '모더니스트',  // fit_modern_14
  '인습',  // fit_modern_15
  '모순',  // fit_modern_16
  '생각하지 않았다', '자유', '모더니즘 문학', '지식인', '위기',  // fit_modern_17
  '헤어지게', '아름다운 서정성', '수필', '이별', '갈등',  // fit_modern_18
  '지친', '사라져', '정체성', '압축적', '희생양',  // fit_modern_19
  '용서', '분단소설', '순수한', '매개체',  // fit_modern_20
  '광장', '비극', '철학적인', '상징', '거부', '선구자적',  // fit_modern_21 (허무는 중복 제거)
  '오발탄', '전후문학', '군상', '명작',  // fit_modern_22
  '수난이대', '극복', '사투리', '맥락',  // fit_modern_23 (전후문학, 압축적 중복)
  '카인의 후예', '짓밟는', '혼란', '함축적', '인간적',  // fit_modern_24
  '역마', '샤머니즘', '운명',  // fit_modern_25 (저항 중복)
  '사하촌', '무력', '농민문학', '민중', '수탈',  // fit_modern_26
  '학', '압축', '도덕적',  // fit_modern_27
  '황만근은 이렇게 말했다', '진실', '감동', '인간',  // fit_modern_28
  '아홉 켤레의 구두로 남은 사내', '책임',  // fit_modern_29 (비극 중복)
  '엄마의 말뚝', '경험', '뿌리',  // fit_modern_30
  '난장이가 쏘아올린 작은 공', '그늘', '고전',  // fit_modern_31 (압축 중복)
  '우리들의 일그러진 영웅', '반향', '양면', '약함',  // fit_modern_32 (상징 중복)
  '깃발 없는 기수', '기회', '성과', '이면',  // fit_modern_33
  '객지', '분위기', '기념비', '미화',  // fit_modern_34
  '서편제', '흥행', '무관심',  // fit_modern_35
  '토지', '금자탑',  // fit_modern_36
  '혼불', '애도',  // fit_modern_37
  '태백산맥', '총구',  // fit_modern_38
  '무녀도', '정신', '선구',  // fit_modern_39
  '주인공', '억울', '이미지'  // fit_modern_40
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
  { unit: 'fit_modern_05', search: '마름' },
  { unit: 'fit_modern_18', search: '서정성' },
  { unit: 'fit_modern_21', search: '선구자' },
  { unit: 'fit_modern_27', search: '사살' },
  { unit: 'fit_modern_32', search: '각성' }
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/korlit/fit_modern_content.js", content);
console.log(`\n태그 제거: ${tagRemoveCount}개, 태그 추가: ${tagAddCount}개 완료!`);

const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/worldlit/fit_world1_content.js", "utf8");

// 1. passage에서 태그 제거
const passageOnlyTags = [
  '불안', '싱클레어', '고백하기로', '세상',  // fit_world1_01
  '독립', '의지',  // fit_world1_02
  '용감', '경험', '혼란', '고귀한', '간절히', '황홀한',  // fit_world1_03
  '사제', '결혼', '시험', '어둠', '빛',  // fit_world1_04
  '관심', '외로워', '북적', '여우', '길들여', '유일한', '시간',  // fit_world1_05
  '수상한', '죽음', '플린트 선장', '롱 존 실버',  // fit_world1_06
  '신기', '실수', '성공',  // fit_world1_07
  '신비로운', '마법', '가족',  // fit_world1_08
  '걱정', '동물', '크로켓',  // fit_world1_09
  '원숭이', '지도자',  // fit_world1_10
  '이야기', '엄마',  // fit_world1_11
  '안정', '스스로', '프라이데이', '사냥',  // fit_world1_12
  '어리석음', '브로브딩낵', '탐욕',  // fit_world1_13
  '재미', '상징',  // fit_world1_14
  '명령', '광산',  // fit_world1_15
  // fit_world1_16 (결혼 중복)
  '사랑', '고통', '구원자', '칼',  // fit_world1_17 (결혼 중복)
  '입맞춤',  // fit_world1_18 (결혼 중복)
  '모자',  // fit_world1_19
  '달빛', '구출',  // fit_world1_20
  '노래', '행복',  // fit_world1_21
  '노인', '거위',  // fit_world1_22
  '교훈',  // fit_world1_23
  '아름다운',  // fit_world1_24 (행복 중복)
  '하늘',  // fit_world1_25
  '친구',  // fit_world1_26
  '식사',  // fit_world1_27 (결혼 중복)
  '독일', '망토', '마을 사람', '아이들',  // fit_world1_28
  '비단', '성',  // fit_world1_29 (결혼 중복)
  '아주머니', '꽃의 나라',  // fit_world1_30
  '시장',  // fit_world1_31 (가족 중복)
  '대부', '슬리퍼',  // fit_world1_32
  '후회', '욕심',  // fit_world1_33
  '거짓말', '손해',  // fit_world1_34 (행복 중복)
  '기둥',  // fit_world1_35 (입맞춤, 행복 중복)
  '얼음',  // fit_world1_37
  '사막', '어른',  // fit_world1_38
  '마을', '언덕',  // fit_world1_39
  '도전', '승리'  // fit_world1_40
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
  { unit: 'fit_world1_28', search: '하멜른' },
  { unit: 'fit_world1_28', search: '동굴' },
  { unit: 'fit_world1_32', search: '드로셀마이어' },
  { unit: 'fit_world1_32', search: '저주' },
  { unit: 'fit_world1_33', search: '춤' },
  { unit: 'fit_world1_33', search: '용서' },
  { unit: 'fit_world1_34', search: '도끼' },
  { unit: 'fit_world1_35', search: '나눔' },
  { unit: 'fit_world1_36', search: '희생' }
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/worldlit/fit_world1_content.js", content);
console.log(`\n태그 제거: ${tagRemoveCount}개, 태그 추가: ${tagAddCount}개 완료!`);

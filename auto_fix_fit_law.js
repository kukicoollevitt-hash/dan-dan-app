const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/social/fit_law_content.js", "utf8");

// 1. passage에서 태그 제거
const passageOnlyTags = [
  '자연스럽게', '국제 연합',  // fit_law_01
  '존중',                     // fit_law_02
  '신분', '따돌림',           // fit_law_03
  '아동 권리 협약',           // fit_law_04
  '국민신문고',               // fit_law_05
  '개정', '투표',             // fit_law_06
  '대의 민주주의', '입법부', '행정부', '사법부', '청원', '국민 발안', '국민 투표', // fit_law_07
  '형벌', '행정 재판', '재판 공개의 원칙', '사법권의 독립', '변호사', '배심원', '국민 참여 재판', // fit_law_08
  '예방', '사형', '금고', '벌금', '과료', '자격정지', '형사 미성년자', '보호 관찰', '사회봉사 명령', // fit_law_09
  '유엔 아동 권리 협약',      // fit_law_10
  '소비자 상담 센터', '취소', '미성년자 취소권', // fit_law_11
  '협의', '증명', '소멸 시효', // fit_law_12
  '재판 이혼', '평등',        // fit_law_13
  '주휴일', '연차 휴가', '단체 교섭', '쟁의 행위', '산재 보험', // fit_law_14
  '난민 협약', '국제형사재판소', '여론', '제재', // fit_law_15
  '환경 오염 피해 배상',      // fit_law_16
  '저작권료',                 // fit_law_17
  '명예훼손',                 // fit_law_18
  '형사 소송', '소액 심판', '행정 소송', '항소', '법률 구조 공단', // fit_law_19
  '국민 청원', '헌법 소원', '법적 소양' // fit_law_20
];

passageOnlyTags.forEach(tag => {
  const regex = new RegExp(`<b>${tag}</b>`, 'g');
  const before = content;
  content = content.replace(regex, tag);
  if (before !== content) {
    console.log(`태그 제거: <b>${tag}</b> -> ${tag}`);
  }
});

// 2. passage에 태그 추가
const addTags = [
  { unit: 'fit_law_06', search: '민주공화국' },
  { unit: 'fit_law_11', search: '불량품' },
  { unit: 'fit_law_17', search: '창작물' },
  { unit: 'fit_law_19', search: '합의' }
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/social/fit_law_content.js", content);
console.log("\n태그 수정 완료!");

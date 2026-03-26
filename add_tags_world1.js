const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/worldlit/world1_content.js", "utf8");

// 태그 추가가 필요한 항목들 (passage에 존재하는 것만)
const tagsToAdd = [
  [6, '해적', '해적'],
  [7, '행복', '행복'],
  [9, '꿈', '꿈'],
  [19, '할머니', '할머니'],
  [19, '바구니', '바구니'],
  [23, '굴뚝', '굴뚝'],
  [24, '미운 오리 새끼', '미운 오리 새끼'],
  [24, '봄', '봄'],
  [24, '호수', '호수'],
  [25, '난로', '난로'],
  [25, '맨발', '맨발'],
  [25, '크리스마스트리', '크리스마스트리'],
  [26, '사냥개', '사냥개'],
  [26, '고양이', '고양이'],
  [26, '수탉', '수탉'],
  [27, '공주', '공주'],
  [27, '왕', '왕'],
  [28, '금화', '금화'],
  [28, '시장', '시장'],
  [29, '방앗간', '방앗간'],
  [29, '왕', '왕'],
  [30, '들쥐', '들쥐'],
  [31, '엄마 염소', '엄마 염소'],
  [31, '아기 염소', '아기 염소'],
  [31, '돌', '돌'],
  [34, '나무꾼', '나무꾼'],
  [34, '도끼', '도끼'],
  [34, '쇠도끼', '쇠도끼'],
  [34, '욕심쟁이', '욕심쟁이'],
  [36, '행복', '행복'],
  [38, '여우', '여우'],
  [38, '시간', '시간'],
  [39, '양치기 소년', '양치기 소년'],
  [40, '토끼', '토끼'],
  [40, '거북이', '거북이'],
  [40, '결승선', '결승선']
];

// 각 유닛에 대해 처리
for (const [unitNum, vocabWord, searchWord] of tagsToAdd) {
  const unitKey = 'world1_' + String(unitNum).padStart(2, '0');
  const unitStart = content.indexOf(unitKey + ':');
  if (unitStart === -1) {
    console.log(`${unitKey}: 찾을 수 없음`);
    continue;
  }

  // 유닛 끝 찾기
  const nextUnitKey = 'world1_' + String(unitNum + 1).padStart(2, '0');
  let unitEnd = content.indexOf(nextUnitKey + ':', unitStart);
  if (unitEnd === -1) unitEnd = content.length;

  // passage 영역 찾기
  const passageStart = content.indexOf('passage:', unitStart);
  const vocabStart = content.indexOf('vocab:', passageStart);

  if (passageStart === -1 || vocabStart === -1 || passageStart > unitEnd) {
    console.log(`${unitKey}: passage 영역 찾을 수 없음`);
    continue;
  }

  let passageSection = content.substring(passageStart, vocabStart);

  // 이미 태그가 있는지 확인
  if (passageSection.includes(`<b>${vocabWord}</b>`)) {
    console.log(`${unitKey}: "${vocabWord}" 태그 이미 있음`);
    continue;
  }

  // searchWord 찾기 (태그 없이)
  const taggedWord = `<b>${searchWord}</b>`;
  if (passageSection.includes(taggedWord)) {
    console.log(`${unitKey}: "${searchWord}" 태그 이미 있음`);
    continue;
  }

  // 첫 번째 등장에 태그 추가
  const searchIdx = passageSection.indexOf(searchWord);
  if (searchIdx === -1) {
    console.log(`${unitKey}: "${searchWord}" 찾을 수 없음`);
    continue;
  }

  // 태그 추가
  const before = passageSection.substring(0, searchIdx);
  const after = passageSection.substring(searchIdx + searchWord.length);
  const newPassageSection = before + `<b>${searchWord}</b>` + after;

  // 원본 교체
  content = content.substring(0, passageStart) + newPassageSection + content.substring(vocabStart);
  console.log(`${unitKey}: "${searchWord}" 태그 추가됨`);
}

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/worldlit/world1_content.js", content);
console.log("\n완료!");

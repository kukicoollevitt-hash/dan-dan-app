const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/korlit/classic_content.js", "utf8");

// 각 단어를 passage에서 찾아 첫 번째 등장에 태그 추가
// 형식: [unitNum, word, searchPattern]
const tagsToAdd = [
  [8, '용궁', '용궁'],
  [8, '지혜', '지혜'],
  [9, '억울함', '억울함'],
  [10, '혼인', '혼인'],
  [14, '신분 제도', '신분 제도'],
  [15, '기생', '기생'],
  [15, '원망', '원망'],
  [15, '과거', '과거'],
  [15, '안타까움', '안타까움'],
  [16, '부귀영화', '부귀영화'],
  [17, '첩', '첩'],
  [17, '악행', '악행'],
  [17, '명예', '명예'],
  [18, '봉양', '봉양'],
  [20, '선비', '선비'],
  [20, '비판', '비판'],
  [21, '양반', '양반'],
  [21, '점잖다', '점잖'],
  [21, '신분 제도', '신분 제도'],
  [22, '꾸짖다', '꾸짖'],
  [22, '위선', '위선'],
  [22, '비판', '비판'],
  [22, '탐욕', '탐욕'],
  [23, '기생', '기생'],
  [23, '탕진', '탕진'],
  [23, '방탕', '방탕'],
  [24, '선비', '선비'],
  [24, '과거', '과거'],
  [24, '은혜', '은혜'],
  [24, '재산', '재산'],
  [25, '간악하다', '간악'],
  [25, '혼인', '혼인'],
  [26, '표류', '표류'],
  [26, '비극', '비극'],
  [26, '희망', '희망'],
  [27, '병자호란', '병자호란'],
  [27, '원정', '원정'],
  [27, '강인하다', '강인'],
  [28, '탐관오리', '탐관오리'],
  [29, '과잉', '과잉'],
  [30, '우화', '우화'],
  [30, '풍자', '풍자'],
  [30, '어리석다', '어리석'],
  [31, '혼인', '혼인'],
  [31, '허물', '허물'],
  [32, '효성', '효성'],
  [32, '저승', '저승'],
  [32, '원망', '원망'],
  [33, '장수', '장수'],
  [33, '무찌르다', '무찌'],
  [33, '벼슬', '벼슬'],
  [33, '명예', '명예'],
  [33, '권선징악', '권선징악'],
  [34, '명예', '명예'],
  [34, '충성', '충성'],
  [35, '간신', '간신'],
  [35, '모함', '모함'],
  [35, '신선', '신선'],
  [35, '처벌', '처벌'],
  [35, '벼슬', '벼슬'],
  [35, '효도', '효도'],
  [36, '미천하다', '미천'],
  [37, '병자호란', '병자호란'],
  [38, '명예', '명예'],
  [38, '비천하다', '비천'],
  [38, '정의', '정의'],
  [39, '선비', '선비'],
  [39, '선녀', '선녀'],
  [39, '비밀', '비밀'],
  [39, '그리워하다', '그리워'],
  [39, '낭만', '낭만'],
  [40, '금오신화', '금오신화']
];

// 각 유닛에 대해 처리
for (const [unitNum, vocabWord, searchWord] of tagsToAdd) {
  const unitKey = 'classic_' + String(unitNum).padStart(2, '0');
  const unitStart = content.indexOf(unitKey + ':');
  if (unitStart === -1) {
    console.log(`${unitKey}: 찾을 수 없음`);
    continue;
  }

  // 유닛 끝 찾기
  const nextUnitKey = 'classic_' + String(unitNum + 1).padStart(2, '0');
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/korlit/classic_content.js", content);
console.log("\n완료!");

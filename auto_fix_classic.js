const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/korlit/classic_content.js", "utf8");

// vocab에만 있는 항목들과 passage에서 태그 추가가 필요한 부분을 찾아서 출력
const fixes = [
  { unit: 8, word: '용궁', search: '용궁' },
  { unit: 8, word: '지혜', search: '지혜' },
  { unit: 9, word: '억울함', search: '억울함' },
  { unit: 10, word: '혼인', search: '혼인' },
  { unit: 14, word: '신분 제도', search: '신분 제도' },
  { unit: 15, word: '기생', search: '기생' },
  { unit: 15, word: '원망', search: '원망' },
  { unit: 15, word: '과거', search: '과거' },
  { unit: 15, word: '안타까움', search: '안타까움' },
  { unit: 16, word: '부귀영화', search: '부귀영화' },
  { unit: 17, word: '첩', search: '첩' },
  { unit: 17, word: '악행', search: '악행' },
  { unit: 17, word: '명예', search: '명예' },
  { unit: 18, word: '봉양', search: '봉양' },
  { unit: 20, word: '선비', search: '선비' },
  { unit: 20, word: '비판', search: '비판' },
  { unit: 21, word: '양반', search: '양반' },
  { unit: 21, word: '점잖다', search: '점잖' },
  { unit: 21, word: '신분 제도', search: '신분 제도' },
  { unit: 22, word: '꾸짖다', search: '꾸짖' },
  { unit: 22, word: '위선', search: '위선' },
  { unit: 22, word: '비판', search: '비판' },
  { unit: 22, word: '탐욕', search: '탐욕' },
  { unit: 23, word: '기생', search: '기생' },
  { unit: 23, word: '탕진', search: '탕진' },
  { unit: 23, word: '뉘우치다', search: '뉘우치' },
  { unit: 23, word: '방탕', search: '방탕' },
  { unit: 24, word: '선비', search: '선비' },
  { unit: 24, word: '과거', search: '과거' },
  { unit: 24, word: '은혜', search: '은혜' },
  { unit: 24, word: '재산', search: '재산' },
  { unit: 25, word: '간악하다', search: '간악' },
  { unit: 25, word: '혼인', search: '혼인' },
  { unit: 26, word: '표류', search: '표류' },
  { unit: 26, word: '비극', search: '비극' },
  { unit: 26, word: '희망', search: '희망' },
  { unit: 27, word: '병자호란', search: '병자호란' },
  { unit: 27, word: '원정', search: '원정' },
  { unit: 27, word: '강인하다', search: '강인' },
  { unit: 28, word: '탐관오리', search: '탐관오리' },
  { unit: 29, word: '과잉', search: '과잉' },
  { unit: 30, word: '우화', search: '우화' },
  { unit: 30, word: '풍자', search: '풍자' },
  { unit: 30, word: '어리석다', search: '어리석' },
  { unit: 31, word: '혼인', search: '혼인' },
  { unit: 31, word: '허물', search: '허물' },
  { unit: 32, word: '효성', search: '효성' },
  { unit: 32, word: '저승', search: '저승' },
  { unit: 32, word: '원망', search: '원망' },
  { unit: 33, word: '장수', search: '장수' },
  { unit: 33, word: '무찌르다', search: '무찌' },
  { unit: 33, word: '벼슬', search: '벼슬' },
  { unit: 33, word: '명예', search: '명예' },
  { unit: 33, word: '권선징악', search: '권선징악' },
  { unit: 34, word: '명예', search: '명예' },
  { unit: 34, word: '충성', search: '충성' },
  { unit: 35, word: '간신', search: '간신' },
  { unit: 35, word: '모함', search: '모함' },
  { unit: 35, word: '신선', search: '신선' },
  { unit: 35, word: '처벌', search: '처벌' },
  { unit: 35, word: '벼슬', search: '벼슬' },
  { unit: 35, word: '효도', search: '효도' },
  { unit: 36, word: '무찌르다', search: '무찌' },
  { unit: 36, word: '미천하다', search: '미천' },
  { unit: 37, word: '병자호란', search: '병자호란' },
  { unit: 38, word: '명예', search: '명예' },
  { unit: 38, word: '비천하다', search: '비천' },
  { unit: 38, word: '정의', search: '정의' },
  { unit: 39, word: '선비', search: '선비' },
  { unit: 39, word: '선녀', search: '선녀' },
  { unit: 39, word: '비밀', search: '비밀' },
  { unit: 39, word: '그리워하다', search: '그리워' },
  { unit: 39, word: '낭만', search: '낭만' },
  { unit: 40, word: '금오신화', search: '금오신화' }
];

// 각 유닛에 대해 passage 영역에서 검색어를 찾아 태그 추가
fixes.forEach(fix => {
  const unitKey = 'classic_' + String(fix.unit).padStart(2, '0');
  const unitStart = content.indexOf(unitKey + ':');
  if (unitStart === -1) return;

  const passageStart = content.indexOf('passage:', unitStart);
  const vocabStart = content.indexOf('vocab:', passageStart);

  if (passageStart === -1 || vocabStart === -1) return;

  const passageSection = content.substring(passageStart, vocabStart);

  // 태그가 이미 있는지 확인
  if (passageSection.includes(`<b>${fix.search}</b>`)) {
    return; // 이미 태그가 있음
  }

  // 검색어가 passage에 있는지 확인
  if (!passageSection.includes(fix.search)) {
    console.log(`${unitKey}: "${fix.word}" - passage에 "${fix.search}" 없음, vocab에서 제거 필요`);
    return;
  }

  console.log(`${unitKey}: "${fix.word}" - passage에서 "${fix.search}" 찾음, 태그 추가 필요`);
});

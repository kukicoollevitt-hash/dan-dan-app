const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/person/fit_people2_content.js", "utf8");

// passage에서 태그 제거
const passageOnlyTags = [
  // fit_people2_06
  '바르샤바', '지배', '유학', '소르본', '광석', '정제', '사고', '교수', '편견',
  // fit_people2_07
  '구자라트', '변호사', '물레', '세금', '단식', '검소', '극단주의자',
  // fit_people2_08
  '오하이오주', '단언', '자전거', '글라이더', '분석', '순간', '도전', '졸업장',
  // fit_people2_09
  '앨라배마주', '분노', '인내', '점자', '졸업', '장애인', '장애',
  // fit_people2_10
  '네덜란드', '화랑', '신학', '붓터치', '아를', '연작',
  // fit_people2_11
  '이탈리아', '반대', '야전병원', '정책',
  // fit_people2_12
  '추장', '투표권', '예의', '처벌',
  // fit_people2_13
  '캘리포니아', '기계', '충돌', '터치스크린', '예술', '췌장암',
  // fit_people2_14
  '오스만 제국', '신앙심', '고아원', '기부',
  // fit_people2_15
  '말라가', '물감', '각도', '흑백',
  // fit_people2_16
  '시카고', '애니메이션', '장편', '마법',
  // fit_people2_17
  '무두장이', '탄저병', '인류',
  // fit_people2_18
  '트라코마', '구빈원', '손가락', '좌절', '진학',
  // fit_people2_19
  '빈민가', '품위', '감동',
  // fit_people2_20
  '경찰', '고고학자', '국립공원',
  // fit_people2_21
  '완성', '비싼', '연주자',
  // fit_people2_22
  '피아노', '진동',
  // fit_people2_23
  '공증인', '르네상스',
  // fit_people2_24
  '농부', '결핵',
  // fit_people2_25
  '통나무집',
  // fit_people2_26
  '발음', '작전',
  // fit_people2_27
  '차별',
  // fit_people2_29
  '고전',
  // fit_people2_39
  '수학', '목성', '과학',
  // fit_people2_40
  '크로아티아', '코일', '과학자'
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/person/fit_people2_content.js", content);
console.log(`\n태그 제거: ${tagRemoveCount}개 완료!`);

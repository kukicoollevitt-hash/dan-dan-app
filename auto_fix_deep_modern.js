const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/korlit/deep_modern_content.js", "utf8");

// 1. passage에서 태그 제거
const passageOnlyTags = [
  // deep_modern_01
  '순박한', '왁자지껄한', '은은히', '하얗게', '고운', '아른거렸다', '쫓겨나', '심상치 않은', '헛디뎌', '허우적거리며', '뜨거운', '우연', '풍경', '출렁이고', '머뭇거렸다', '덜커덕', '묘한',
  // deep_modern_02
  '차가웠으며', '수줍은', '또렷이', '여리었다', '창백했다', '주룩주룩', '아련히', '잊을 수 없는', '비쳐', '유일한', '그리워할',
  // deep_modern_03
  '해맑은', '야무지게', '앙큼한', '얼얼하게', '통쾌한', '노려보았다',
  // deep_modern_04
  '설렁탕', '불길한', '싸늘하게', '울부짖었다', '쏟아지는', '허무하게',
  // deep_modern_05
  '품을 팔며', '얄미운', '두리번', '발그레', '중얼거렸다',
  // deep_modern_06
  '재미난', '보송보송한', '날카로웠다', '떨리는', '흐느끼는', '온화한', '가혹한',
  // deep_modern_07
  '순박한', '성실한', '헐벗던', '사치', '감자', '나뒹굴고', '빈곤', '적나라하게', '성찰', '웅변',
  // deep_modern_08
  '감돌았다',
  // deep_modern_09
  '포기', '먹먹하다', '좌절',
  // deep_modern_10
  '권유', '대량 생산', '허무',
  // deep_modern_11
  '얼굴이 고와', '방탕한', '쫓겨나', '세태소설', '암울한',
  // deep_modern_12
  '기생', '방황', '시대의 축소판', '사실주의', '탐욕',
  // deep_modern_13
  '축내는', '이기적', '꾸짖다', '대변',
  // deep_modern_14
  '공간', '한숨', '산책', '모더니스트', '이별',
  // deep_modern_15
  '인습', '전환점',
  // deep_modern_16
  '모순',
  // deep_modern_17
  '생각하지 않았다', '자유', '모더니즘 문학', '지식인', '위기',
  // deep_modern_18
  '헤어지게', '아름다운 서정성', '수필', '갈등', '실제 경험',
  // deep_modern_19
  '지친', '사라져', '정체성', '압축적',
  // deep_modern_20
  '영혼', '받아들이게', '용서',
  // deep_modern_21
  '광장', '허무', '비극', '철학적인', '상징', '거부', '선구자적',
  // deep_modern_22
  '오발탄', '전후문학', '명작',
  // deep_modern_23
  '수난이대', '사투리',
  // deep_modern_24
  '카인의 후예', '짓밟는', '혼란', '인간적',
  // deep_modern_25
  '역마', '운명',
  // deep_modern_26
  '사하촌', '사실적', '농민문학',
  // deep_modern_27
  '학',
  // deep_modern_28
  '황만근은 이렇게 말했다', '감동', '인간',
  // deep_modern_29
  '아홉 켤레의 구두로 남은 사내',
  // deep_modern_30
  '엄마의 말뚝', '경험',
  // deep_modern_31
  '난장이가 쏘아올린 작은 공', '그늘',
  // deep_modern_32
  '우리들의 일그러진 영웅', '편', '반향', '양면', '약함', '용기',
  // deep_modern_33
  '깃발 없는 기수', '기회', '성과', '이면', '현실',
  // deep_modern_34
  '객지', '사고', '분위기', '기념비',
  // deep_modern_35
  '서편제', '흥행', '심청가', '무관심',
  // deep_modern_36
  '토지', '빼앗긴',
  // deep_modern_37
  '혼불', '아름다움',
  // deep_modern_38
  '태백산맥', '얽혀',
  // deep_modern_39
  '무녀도', '정신',
  // deep_modern_40
  '주인공'
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
  // deep_modern_16
  { unit: 'deep_modern_16', search: '비참한' },
  { unit: 'deep_modern_16', search: '적막' },
  { unit: 'deep_modern_16', search: '병폐' },
  // deep_modern_17
  { unit: 'deep_modern_17', search: '박제' },
  { unit: 'deep_modern_17', search: '주체성' },
  // deep_modern_18
  { unit: 'deep_modern_18', search: '서정성' },
  { unit: 'deep_modern_18', search: '요양' },
  { unit: 'deep_modern_18', search: '헌신' },
  // deep_modern_21
  { unit: 'deep_modern_21', search: '선구자' },
  { unit: 'deep_modern_21', search: '전체주의' },
  // deep_modern_24
  { unit: 'deep_modern_24', search: '왜곡' },
  // deep_modern_27
  { unit: 'deep_modern_27', search: '사살' },
  { unit: 'deep_modern_27', search: '역설' },
  // deep_modern_28
  { unit: 'deep_modern_28', search: '수용적' },
  // deep_modern_29
  { unit: 'deep_modern_29', search: '대물림' },
  // deep_modern_30
  { unit: 'deep_modern_30', search: '투영' },
  // deep_modern_32
  { unit: 'deep_modern_32', search: '각성' },
  { unit: 'deep_modern_32', search: '고립' },
  { unit: 'deep_modern_32', search: '횡포' },
  { unit: 'deep_modern_32', search: '우회' },
  // deep_modern_38
  { unit: 'deep_modern_38', search: '혼란' }
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/korlit/deep_modern_content.js", content);
console.log(`\n태그 제거: ${tagRemoveCount}개, 태그 추가: ${tagAddCount}개 완료!`);

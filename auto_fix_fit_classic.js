const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/korlit/fit_classic_content.js", "utf8");

// 1. passage에서 태그 제거
const passageOnlyTags = [
  '남원', '월매', '변학도', '의지',  // fit_classic_01
  '과거', '횡포',  // fit_classic_02
  '귀하게', '관직', '영웅',  // fit_classic_03
  '해적', '선관', '서화담',  // fit_classic_04
  '선비', '거북', '홍수', '이선', '기이한',  // fit_classic_05
  '봉사', '맹인 잔치',  // fit_classic_06
  '심술', '제비', '거지',  // fit_classic_07
  '꾀', '벼슬', '위기',  // fit_classic_08
  '좌수', '구박', '조사', '가정',  // fit_classic_09
  '김매기', '삼베', '하늘', '참새', '원님',  // fit_classic_10
  '아리따운', '교태', '눈멂', '관아', '웃음거리',  // fit_classic_11
  '시주', '가혹', '가짜 옹고집', '분별', '수모',  // fit_classic_12
  '박처사', '못생긴', '박씨', '이시백', '본분', '미인', '용골대', '치욕',  // fit_classic_13
  '수성궁', '운영', '김진사', '사모', '금지', '사통', '유영', '액자식 구성',  // fit_classic_14
  '채봉', '필선', '천한', '허락', '신분 제도', '체면',  // fit_classic_15
  '육관대사', '성진', '용궁', '꾸짖고', '양소유', '꿈', '부귀', '덧없는', '깨우쳤어요', '김만중',  // fit_classic_16
  '유연수', '사씨', '교씨', '소문', '쫓겨나', '탕진', '처벌',  // fit_classic_17
  '화진', '화춘', '첩', '심씨', '단합', '뉘우치고', '가족 갈등', '가치관',  // fit_classic_18
  '도요토미 히데요시', '선조', '이순신', '곽재우', '홍의장군', '김시민', '서산대사', '사명대사', '노량해전', '유언',  // fit_classic_19
  '허생', '가난', '변씨', '자신만만', '시장', '말총', '도둑', '이완', '박지원', '실천적',  // fit_classic_20
  '고을', '무시', '종종걸음', '점잖게',  // fit_classic_21 (가난, 박지원 중복)
  '북곽 선생', '탄로', '호랑이', '꾸짖었어요', '의리', '위선적', '허물', '위선자',  // fit_classic_22 (선비, 박지원 중복)
  '이춘풍', '돈', '김 씨', '흥청망청', '재산', '내쫓았어요', '어리석음', '뉘우쳤어요', '지혜',  // fit_classic_23
  '이혁', '명문가', '기생', '사랑', '잊어버렸어요',  // fit_classic_24
  '인간', '재능', '백 도령', '간악', '진상',  // fit_classic_25 (사랑, 과거 중복)
  '최척', '옥영', '일본', '풍랑',  // fit_classic_26 (사랑 중복)
  '김영철', '고향', '강인',  // fit_classic_27 (일본, 지혜 중복)
  '홍길동', '양반', '신분', '명작',  // fit_classic_28 (벼슬 중복)
  '서동지', '순박', '어수룩', '엉뚱', '인연',  // fit_classic_29
  '꿩', '콩', '욕심', '사냥꾼', '통곡', '의인화',  // fit_classic_30 (어리석음 중복)
  '노부부', '비밀', '약속',  // fit_classic_31 (사랑 중복)
  '실망', '꿋꿋이', '명의', '상처',  // fit_classic_32
  '김 장군', '금방울', '모함', '무찌르고', '정의',  // fit_classic_33
  '유심', '유충렬',  // fit_classic_34 (위기, 정의, 영웅 중복)
  '조웅', '이두병', '총애', '억울함', '결의', '제자', '반란군', '명예', '효자', '영웅소설',  // fit_classic_35
  '소대성', '노인', '비범함', '계시', '은인', '미천한', '용기',  // fit_classic_36
  '임경업', '역사소설',  // fit_classic_37 (과거, 치욕, 의지 중복)
  '적성의', '수련', '충성', '비천한',  // fit_classic_38 (의지, 벼슬 중복)
  '보름달', '노랫소리', '행복', '그리워', '전기소설', '배경',  // fit_classic_39 (사랑 중복)
  '편지', '위협', '저승', '한문소설'  // fit_classic_40 (전기소설 중복)
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
  { unit: 'fit_classic_12', search: '가짜' },
  { unit: 'fit_classic_20', search: '풍자' },
  { unit: 'fit_classic_20', search: '개혁' },
  { unit: 'fit_classic_22', search: '위선' },
  { unit: 'fit_classic_23', search: '탕진' },
  { unit: 'fit_classic_35', search: '간신' }
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/korlit/fit_classic_content.js", content);
console.log(`\n태그 제거: ${tagRemoveCount}개, 태그 추가: ${tagAddCount}개 완료!`);

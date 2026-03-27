const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/korlit/deep_classic_content.js", "utf8");

// 1. passage에서 태그 제거
const passageOnlyTags = [
  // deep_classic_01
  '남원', '월매', '변학도', '의지',
  // deep_classic_02
  '과거',
  // deep_classic_03
  '귀하게',
  // deep_classic_04
  '해적', '선관', '모독', '서화담',
  // deep_classic_05
  '선비', '거북', '홍수', '이선', '기이한',
  // deep_classic_06
  '봉사', '맹인 잔치',
  // deep_classic_07
  '헤아렸',
  // deep_classic_08
  '궁전', '꾀',
  // deep_classic_11
  '아리따운', '교태', '눈멂', '관아', '웃음거리', '치욕', '판소리', '익살', '결함', '허위의식', '탐욕',
  // deep_classic_12
  '시주', '가혹', '가짜 옹고집', '분별', '관아', '수모',
  // deep_classic_13
  '박처사', '못생긴', '박씨', '이시백', '본분', '첩', '무시', '미인', '신병', '풍우', '능력', '경탄', '도리', '용골대', '어리석', '재능', '용기', '사죄', '존중', '전해', '지혜', '힘', '민족적', '가르침',
  // deep_classic_14
  '수성궁', '운영', '문학적 재능', '김진사', '사모', '금지', '학식', '지혜로운', '절절한', '슬픔', '간절히', '사통', '죽음', '변치 않는', '유영', '방문', '신비로운', '세상에 전해 달라', '억울함', '그리움', '후회', '사랑', '액자식 구성', '자신의 감정', '당당하게', '목숨', '봉건적', '비판', '본능적', '옹호',
  // deep_classic_15
  '채봉', '필선',
  // deep_classic_16
  '성진', '꾸짖고', '양소유', '덧없는', '깨우쳤어요',
  // deep_classic_17
  '사씨', '쫓겨나', '김만중',
  // deep_classic_18
  '첩', '심씨', '뉘우치고',
  // deep_classic_19
  '이순신', '곽재우', '김시민', '서산대사', '사명대사',
  // deep_classic_20
  '허생', '가난', '자신만만', '박지원', '실천적',
  // deep_classic_21
  '가난', '무시', '점잖게', '박지원',
  // deep_classic_22
  '북곽 선생', '선비', '겸손', '부도덕', '탄로', '호랑이', '꾸짖었어요', '의리', '울려', '수치', '위선적', '박지원', '모순', '진실', '위선자',
  // deep_classic_23
  '이춘풍', '돈', '김 씨', '흥청망청', '미안', '참고', '재산', '내쫓았어요', '어리석음', '꾸짖으며', '뉘우쳤어요', '지혜',
  // deep_classic_24
  '이혁', '명문가', '기생', '사랑', '기다렸지요', '불안', '잊어버렸어요', '낮은',
  // deep_classic_25
  '단정', '인간', '재능', '그리움', '백 도령', '흠모', '사랑', '학식', '벼슬', '간악', '밀회', '모략', '명예', '신령', '증거', '편견', '문과', '축하', '화목', '조작', '방해', '교훈',
  // deep_classic_26
  '최척', '옥영', '다정', '아비규환', '일본', '믿음', '고통', '사랑', '대변',
  // deep_classic_27
  '김영철', '행복', '수확', '소중', '부유', '주름', '희망', '감시', '굶주림', '동상', '일본', '풍랑', '지혜', '인간미', '성실', '짐', '정직', '고향', '절', '험난', '기원', '강인', '환향녀', '고통', '처절', '존엄', '역사', '불굴', '그리움', '증거',
  // deep_classic_28
  '홍길동', '양반', '존칭', '천재', '숙달', '특권', '한탄', '결연', '동참', '소식', '구원', '환호', '혼란', '우려', '벼슬', '제안', '거절', '신분', '재능', '노력', '현명', '존경', '설움', '계급', '혁명', '파격', '진보', '저항', '정의', '명작',
  // deep_classic_29
  '서동지', '순박', '어수룩', '엉뚱', '황당', '효도', '감싸', '의아', '인연', '눈치', '선행', '믿음', '위로', '지혜',
  // deep_classic_30
  '꿩', '함정', '위험', '의심', '경고', '무시', '애절', '조언', '사냥꾼', '통곡', '어리석음', '깨달았', '후회', '슬픔', '의인화', '충고', '이익', '유혹', '부부',
  // deep_classic_31
  '노부부', '뜻', '비밀', '약속', '흔들렸', '사랑',
  // deep_classic_32
  '실망', '가르쳤', '꿋꿋이', '상처',
  // deep_classic_33
  '김 장군', '금방울', '모함', '무찌르고', '정의',
  // deep_classic_34
  '유심', '유충렬', '위기', '정의', '뉘우쳤', '영웅',
  // deep_classic_35
  '조웅', '이두병', '추격', '억울함', '결의', '연구', '간절히', '낱낱이', '명예', '인기', '효도',
  // deep_classic_36
  '소대성', '비범함', '정통', '계시', '보은', '기적', '미천한', '용기', '평등',
  // deep_classic_37
  '임경업', '의지', '복수', '사랑', '위로', '귀감',
  // deep_classic_38
  '적성의', '놀라운', '해소', '충성', '희망', '비천한', '정의', '위안', '포기',
  // deep_classic_39
  '신비롭게', '그리워', '사랑', '슬픔', '전기소설', '배경', '표현', '메시지',
  // deep_classic_40
  '용기', '막을', '그리움', '힘', '한문소설', '전기소설', '감동', '증명'
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
  // deep_classic_02
  { unit: 'deep_classic_02', search: '변장' },
  { unit: 'deep_classic_02', search: '관아' },
  { unit: 'deep_classic_02', search: '파직' },
  { unit: 'deep_classic_02', search: '유배' },
  // deep_classic_03
  { unit: 'deep_classic_03', search: '군법' },
  // deep_classic_09
  { unit: 'deep_classic_09', search: '진상' },
  // deep_classic_12
  { unit: 'deep_classic_12', search: '가짜' },
  // deep_classic_15
  { unit: 'deep_classic_15', search: '비겁함' },
  // deep_classic_20
  { unit: 'deep_classic_20', search: '풍자' },
  { unit: 'deep_classic_20', search: '개혁' },
  // deep_classic_21
  { unit: 'deep_classic_21', search: '명문가' },
  { unit: 'deep_classic_21', search: '권위' },
  { unit: 'deep_classic_21', search: '체면' },
  // deep_classic_22
  { unit: 'deep_classic_22', search: '위선' },
  // deep_classic_23
  { unit: 'deep_classic_23', search: '탕진' },
  // deep_classic_35
  { unit: 'deep_classic_35', search: '간신' }
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/korlit/deep_classic_content.js", content);
console.log(`\n태그 제거: ${tagRemoveCount}개, 태그 추가: ${tagAddCount}개 완료!`);

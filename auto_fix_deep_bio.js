const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/science/deep_bio_content.js", "utf8");

// 1. passage에서 태그 제거
const passageOnlyTags = [
  // deep_bio_02
  '유연', '정교', '의존',
  // deep_bio_03
  '조류', '파충류', '양서류', '어류', '절지동물', '연체동물',
  // deep_bio_04
  '꽃가루', '암술', '파괴적', '생태적 가치',
  // deep_bio_05
  '꿀', '지상 생활',
  // deep_bio_06
  '영양 기관', '무기 양분', '저장 조직', '공기뿌리', '목본 식물', '나이테', '초본 식물', '덩굴줄기', '덩이줄기', '흡인력', '책상 조직', '해면 조직', '선인장', '착생 식물', '수련', '파리지옥', '끈끈이주걱', '질소',
  // deep_bio_07
  'ATP', 'NADPH', '스트로마', '빛의 세기', '이산화탄소 농도', '온도',
  // deep_bio_08
  '로버트 훅', '셀라', '슐라이덴', '슈반', '피르호', '선택적 투과성', '세포 소기관', '단백질', '핵막', '염색체', '셀룰로스', '엽록소', '자극 반응', '이화 작용', '동화 작용', '면역 세포',
  // deep_bio_09
  'DNA 중합효소', '돌연변이', '오류 교정', '전기', '중기', '후기', '말기', '세포질 분열', '정자', '난자', '수정',
  // deep_bio_10
  '고분자 화합물', '엿당', '위', '위샘', '펩시노겐', '펩타이드 결합', '뮤신', '소장', '십이지장', '췌장', '췌액', '유화제', '탄산수소 나트륨', '포도당', '아미노산', '지방산', '글리세롤', '대장', '대변',
  // deep_bio_11
  '혈액', '심장', '동방결절', '혈관', '확산', '대동맥', '대정맥', '폐동맥', '폐정맥', '심근 경색',
  // deep_bio_12
  '코', '인두', '후두', '기관', '기관지', '폐', '성대', '모세 혈관', '에리트로포이에틴', '피부',
  // deep_bio_13
  '말초 신경계', '뇌', '척수', '대뇌', '소뇌', '뇌간', '세포체', '랑비에 결절', '소포', '시냅스 틈', '세로토닌', '체성 신경계', '자율 신경계', '감각 신경', '운동 신경',
  // deep_bio_14
  '뼈', '칼슘', '콜라겐', '조골 세포', '파골 세포', '볼과 소켓 관절', '경첩 관절', '연골', '관절낭', '활액', '염좌', '근육계', '심장근', '평활근', '가로무늬근', '활주 필라멘트 이론', '지렛대', '저항 운동', '근비대',
  // deep_bio_15
  '유전', '상보적 염기쌍', '이중 나선', '히스톤', '동형 접합', '이형 접합', '그레고어 멘델', '독립의 법칙', '단성 잡종 교배', '전사', '번역', 'mRNA', '리보솜', '코돈', '유전자 편집',
  // deep_bio_16
  '비생물적 환경', '독립영양생물', '먹이 사슬', '질소 순환', '탈질소 세균',
  // deep_bio_17
  '수질 오염', '지하수 오염',
  // deep_bio_18
  '공급 서비스', '조절 서비스', '문화 서비스', '지지 서비스', '생물권 보전 지역',
  // deep_bio_19
  '이동 시기', '기후 피난처', '분포역 이동', '특수종', '국가 온실가스 감축 목표',
  // deep_bio_20
  '체세포 편집', '배아줄기세포', '전능성', '유전자 회로', '바이오연료', '자율성 존중', '선행', '악행 금지', '정의'
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
  { unit: 'deep_bio_05', search: '외골격' },
  { unit: 'deep_bio_10', search: '간문맥' }
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/science/deep_bio_content.js", content);
console.log(`\n태그 제거: ${tagRemoveCount}개, 태그 추가: ${tagAddCount}개 완료!`);

const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/social/deep_soc_content.js", "utf8");

// 1. passage에서 태그 제거
const passageOnlyTags = [
  // deep_soc_08
  '정보화 사회',
  // deep_soc_09
  '치료적·교육적 접근',
  // deep_soc_10
  '기능론', '갈등론', '선발', '사회 불평등',
  // deep_soc_11
  '하강 이동',
  // deep_soc_12
  '기술 발전', '인구 변화', '가치관의 변화', '사회 문제',
  // deep_soc_13
  '기능론적 관점', '갈등론적 관점',
  // deep_soc_14
  '교통', '통신', '자유 무역 협정(FTA)', '긍정적 효과', '부정적 측면',
  // deep_soc_15
  '선거의 4대 원칙', '청원', '집회', '시위', '정치적 무관심', '민주 시민 교육',
  // deep_soc_16
  '정부', '기업',
  // deep_soc_17
  '산업재해보상보험', '노인장기요양보험', '기여', '강제성',
  // deep_soc_18
  '대기 오염', '수질 오염', '토양 오염', '생물 다양성 감소', '전 지구적 성격', '불가역성', '세대 간 문제', '지속가능발전목표(SDGs)',
  // deep_soc_19
  '위헌법률심사제도', '형사법', '민사법', '사적 자치의 원칙',
  // deep_soc_20
  '헌법', '위헌법률심판', '비정부기구(NGO)'
];

let tagRemoveCount = 0;
passageOnlyTags.forEach(tag => {
  const regex = new RegExp(`<b>${tag.replace(/[()·]/g, '\\$&')}</b>`, 'g');
  const before = content;
  content = content.replace(regex, tag);
  if (before !== content) {
    tagRemoveCount++;
    console.log(`태그 제거: <b>${tag}</b> -> ${tag}`);
  }
});

// 2. passage에 태그 추가
const addTags = [
  // deep_soc_01
  { unit: 'deep_soc_01', search: '유기체' },
  { unit: 'deep_soc_01', search: '사회 변동' },
  { unit: 'deep_soc_01', search: '주관적' },
  { unit: 'deep_soc_01', search: '역동성' },
  // deep_soc_02
  { unit: 'deep_soc_02', search: '변인' },
  { unit: 'deep_soc_02', search: '객관성' },
  // deep_soc_03
  { unit: 'deep_soc_03', search: '연구 부정행위' },
  { unit: 'deep_soc_03', search: '이해관계' },
  { unit: 'deep_soc_03', search: '학문적 신뢰' },
  { unit: 'deep_soc_03', search: '사회적 책임' },
  { unit: 'deep_soc_03', search: '검증' },
  // deep_soc_04
  { unit: 'deep_soc_04', search: '내면화' },
  { unit: 'deep_soc_04', search: '또래 집단' },
  { unit: 'deep_soc_04', search: '정체성 혼란' },
  { unit: 'deep_soc_04', search: '규범' },
  { unit: 'deep_soc_04', search: '가치관' },
  // deep_soc_05
  { unit: 'deep_soc_05', search: '역할 기대' },
  { unit: 'deep_soc_05', search: '전통 사회' },
  { unit: 'deep_soc_05', search: '현대 사회' },
  { unit: 'deep_soc_05', search: '유연 근무제' },
  // deep_soc_06
  { unit: 'deep_soc_06', search: '소속감' },
  { unit: 'deep_soc_06', search: '유대' },
  { unit: 'deep_soc_06', search: '동질감' },
  { unit: 'deep_soc_06', search: '이질감' },
  { unit: 'deep_soc_06', search: '공식적' },
  { unit: 'deep_soc_06', search: '대면 접촉' },
  { unit: 'deep_soc_06', search: '사회화' },
  // deep_soc_07
  { unit: 'deep_soc_07', search: '공사의 구분' },
  { unit: 'deep_soc_07', search: '연속성' },
  // deep_soc_08
  { unit: 'deep_soc_08', search: '피싱' },
  { unit: 'deep_soc_08', search: '프라이버시' },
  { unit: 'deep_soc_08', search: '정보 소외 계층' },
  { unit: 'deep_soc_08', search: '온라인 커뮤니티' },
  // deep_soc_09
  { unit: 'deep_soc_09', search: '규범' },
  { unit: 'deep_soc_09', search: '재사회화' },
  { unit: 'deep_soc_09', search: '비행' },
  { unit: 'deep_soc_09', search: '합법적 수단' },
  { unit: 'deep_soc_09', search: '기회 구조' },
  // deep_soc_10
  { unit: 'deep_soc_10', search: '사회 이동' },
  { unit: 'deep_soc_10', search: '이데올로기' },
  { unit: 'deep_soc_10', search: '능력주의' },
  { unit: 'deep_soc_10', search: '잠재력' },
  { unit: 'deep_soc_10', search: '민주 시민' },
  // deep_soc_12
  { unit: 'deep_soc_12', search: '산업화' },
  { unit: 'deep_soc_12', search: '도시화' },
  { unit: 'deep_soc_12', search: '평생 학습' },
  // deep_soc_14
  { unit: 'deep_soc_14', search: '자유 무역 협정' },
  { unit: 'deep_soc_14', search: '세계 시민' },
  // deep_soc_15
  { unit: 'deep_soc_15', search: '정치적 효능감' },
  // deep_soc_16
  { unit: 'deep_soc_16', search: '사회적 책임' },
  // deep_soc_18
  { unit: 'deep_soc_18', search: '생물 다양성' },
  { unit: 'deep_soc_18', search: '지속가능발전목표' },
  // deep_soc_19
  { unit: 'deep_soc_19', search: '위헌법률심사' },
  { unit: 'deep_soc_19', search: '사적 자치' },
  // deep_soc_20
  { unit: 'deep_soc_20', search: '비정부기구' }
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/social/deep_soc_content.js", content);
console.log(`\n태그 제거: ${tagRemoveCount}개, 태그 추가: ${tagAddCount}개 완료!`);

const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/science/deep_chem_content.js", "utf8");

// 1. passage에서 태그 제거
const passageOnlyTags = [
  // deep_chem_01
  '족', '비활성 기체', '원자의 종류와 개수는 변하지 않는다',
  // deep_chem_02
  '질량수', '알칼리 금속', '할로젠', '주기성', '원자 반지름',
  // deep_chem_03
  '옥텟 구조', '취성', '분자간 힘',
  // deep_chem_04
  '화학 반응식을 완결', '몰(mol)',
  // deep_chem_05
  '퍼센트 농도', '몰 농도(M)', '몰랄 농도(m)', '몰랄 끓는점 오름 상수', '몰랄 어는점 내림 상수',
  // deep_chem_06
  '루이스 정의', '강염기', '약염기', '발열 반응',
  // deep_chem_07
  '전자의 이동', '레독스 반응', '금속의 이온화 경향',
  // deep_chem_08
  '갈바니 전지',
  // deep_chem_09
  '농도', '온도',
  // deep_chem_10
  '르샤틀리에의 원리', '압력',
  // deep_chem_11
  '음식의 열량',
  // deep_chem_12
  '기체 법칙', '기체 분자 운동론',
  // deep_chem_13
  '탄소', '포화 탄화수소', '카보닐기', '에스터기', '아미노기',
  // deep_chem_14
  '단위체(모노머)', '중합체(폴리머)', '폴리프로필렌', '폴리염화비닐(PVC)', '폴리스티렌',
  // deep_chem_15
  '유기화합물', '이당류', '1차 구조', '2차 구조', '3차 구조', '4차 구조', '저해제', '중성지방', '포화 지방산', '불포화 지방산', '이중층',
  // deep_chem_16
  '환경 오염', '휘발성 유기화합물(VOCs)', '오존층 파괴', '프레온 가스(CFCs)', '탄소-산소 결합', '탄소 포집 저장(CCS)', '재생 가능 원료', '수소 에너지',
  // deep_chem_17
  '분석 시료', '적정(titration)', '종말점', '착물 적정(킬레이트 적정)', '경도', '기기 분석', '자외선-가시광선 분광법(UV-Vis)', '적외선 분광법(IR)', '핵자기공명 분광법(NMR)', '기체 크로마토그래피(GC)', '액체 크로마토그래피(HPLC)', '질량 분석법(MS)',
  // deep_chem_18
  '금속', '양이온', '전기 전도성', '열 전도성', '반응성', '탄소강', '니크롬', '초전도 합금',
  // deep_chem_19
  '비누와 세제', '친수성 머리', '소수성(친유성) 꼬리', '미셀(micelle)', '약리작용', '프로스타글란딘', '방부제', '감미료', '착색료', '일일섭취허용량(ADI)',
  // deep_chem_20
  '표면적 대 부피 비', '양자점(quantum dot)', '풀러렌', '탄소 나노튜브(CNT)', '카본 나노섬유', '탄소 섬유 강화 복합재(CFRP)', '광전 효과', '페로브스카이트 태양전지', '나노 의약품', '약물 전달 시스템(DDS)'
];

let tagRemoveCount = 0;
passageOnlyTags.forEach(tag => {
  const regex = new RegExp(`<b>${tag.replace(/[()\\-]/g, '\\$&')}</b>`, 'g');
  const before = content;
  content = content.replace(regex, tag);
  if (before !== content) {
    tagRemoveCount++;
    console.log(`태그 제거: <b>${tag}</b> -> ${tag}`);
  }
});

// 2. passage에 태그 추가
const addTags = [
  { unit: 'deep_chem_04', search: '반응물' },
  { unit: 'deep_chem_04', search: '생성물' },
  { unit: 'deep_chem_05', search: '몰 농도' },
  { unit: 'deep_chem_05', search: '몰랄 농도' },
  { unit: 'deep_chem_05', search: '반투막' },
  { unit: 'deep_chem_05', search: '비휘발성 용질' },
  { unit: 'deep_chem_07', search: '이온화 경향' },
  { unit: 'deep_chem_08', search: '환원 전위' },
  { unit: 'deep_chem_10', search: '르샤틀리에 원리' },
  { unit: 'deep_chem_10', search: '정반응' },
  { unit: 'deep_chem_10', search: '역반응' },
  { unit: 'deep_chem_10', search: '발열 반응' },
  { unit: 'deep_chem_10', search: '흡열 반응' },
  { unit: 'deep_chem_10', search: '수율' },
  { unit: 'deep_chem_11', search: '열량계' },
  { unit: 'deep_chem_11', search: '상태 함수' },
  { unit: 'deep_chem_11', search: '칼로리' },
  { unit: 'deep_chem_11', search: '킬로줄' },
  { unit: 'deep_chem_14', search: '단위체' },
  { unit: 'deep_chem_14', search: '중합체' },
  { unit: 'deep_chem_14', search: '가교 결합' },
  { unit: 'deep_chem_14', search: '생분해성 고분자' },
  { unit: 'deep_chem_15', search: '이중 나선' },
  { unit: 'deep_chem_15', search: '상보적 염기쌍' },
  { unit: 'deep_chem_16', search: '오존층' },
  { unit: 'deep_chem_16', search: '프레온 가스' },
  { unit: 'deep_chem_16', search: '탄소 포집 저장' },
  { unit: 'deep_chem_16', search: '휘발성 유기화합물' },
  { unit: 'deep_chem_16', search: '원자 경제성' },
  { unit: 'deep_chem_16', search: '생분해성' },
  { unit: 'deep_chem_17', search: '적정' },
  { unit: 'deep_chem_17', search: '질량 분석법' },
  { unit: 'deep_chem_19', search: '미셀' },
  { unit: 'deep_chem_19', search: '일일섭취허용량' },
  { unit: 'deep_chem_19', search: '친수성' },
  { unit: 'deep_chem_20', search: '양자점' },
  { unit: 'deep_chem_20', search: '탄소 나노튜브' }
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/science/deep_chem_content.js", content);
console.log(`\n태그 제거: ${tagRemoveCount}개, 태그 추가: ${tagAddCount}개 완료!`);

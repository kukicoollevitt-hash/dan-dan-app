const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/social/deep_geo_content.js", "utf8");

// 1. passage에서 태그 제거
const passageOnlyTags = [
  // deep_geo_01
  '지리정보시스템(GIS)',
  // deep_geo_02
  '자연환경', '정치·경제·문화적 관계', '통일', '운명',
  // deep_geo_03
  '퇴적', '선캄브리아기', '고생대', '중생대', '비대칭', '신생대', '백두산', '제주도', '울릉도', '화산 지형', '천지', '한라산', '오름', '낭림산맥', '태백산맥', '함경산맥', '북고남저', '범람원', '삼각주', '사빈',
  // deep_geo_04
  '하천', '폭포', '동강', '공격 사면', '포인트 바', '구하도', '파식대', '해식 동굴', '시 스택', '사주', '사취', '육계도',
  // deep_geo_05
  '날씨', '바람', '습도', '해발 고도', '지형', '해류', '태양 복사 에너지', '여름 강수 집중',
  // deep_geo_06
  '극한 환경', '수도 이전', '신도시 개발', '국제 이주', '인구 감소', '지역 특화 산업',
  // deep_geo_07
  '초기 단계', '가속화 단계', '종착 단계', '행정 도시', '공업 도시', '상업 도시', '관광 도시', '도심', '부도심', '주거 지역', '공업 지역', '도시 문제', '주택 문제', '교통 문제', '환경 문제', '도시 빈곤', '녹지 공간',
  // deep_geo_08
  '도농 격차', '의료 취약지', '교육 불평등', '귀농·귀촌', '농촌 융복합산업',
  // deep_geo_09
  '지역 개발', '지역 불균형', '수도권 집중', '성장 거점 개발', '균형 개발', '통합적 지역 개발', '지역 상생 발전', '스마트 시티', '삶의 질',
  // deep_geo_10
  '자원의 가변성', '화석 연료', '에너지 안보', '지구 온난화', '고갈성 자원', '태양광 에너지', '풍력 에너지', '수력 에너지', '에너지 전환', '원자력 에너지', '에너지 믹스',
  // deep_geo_11
  '국제 무역', '세계무역기구(WTO)', '경제적 불평등', '문화 획일화', '문화 제국주의', '전염 효과', '로컬 푸드', '지리적 표시제', '인류무형문화유산', '세방화(Glocalization)', '장소 마케팅',
  // deep_geo_12
  '고속철도(KTX)', '시간 거리', '비용 거리', '정보화 사회', '원격 근무', '화상 회의', '공간의 압축', '교통 결절점', '접근성 격차', '도심항공교통(UAM)', '5G', '6G',
  // deep_geo_13
  '열대 기후', '사바나 기후', '건조 기후', '사막 기후', '스텝 기후', '온대 기후', '서안 해양성 기후', '지중해성 기후', '온대 계절풍 기후', '냉대 기후', '한대 기후', '영구 동토층',
  // deep_geo_15
  '주택 문제', '교통 문제', '환경 문제',
  // deep_geo_16
  '지리 정보 시스템(GIS)', '위성 위치 확인 시스템(GPS)', '도시 계획', '환경 관리', '물류와 유통', '인공지능', '증강 현실(AR)', '가상 현실(VR)', '자율주행 자동차',
  // deep_geo_17
  '배타적 경제 수역(EEZ)', '북극해 자원', '국제연합(UN)', '국제사법재판소(ICJ)',
  // deep_geo_18
  '생물 다양성 감소', '전기차', '수소차', 'ESG 경영',
  // deep_geo_19
  '석탄', '수력 에너지', '지열 에너지', '바이오 에너지',
  // deep_geo_20
  '세계화', '정체성', '프로방스', '순천만 습지', 'SNS', '인플루언서'
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
  // deep_geo_01
  { unit: 'deep_geo_01', search: '지리정보시스템' },
  // deep_geo_09
  { unit: 'deep_geo_09', search: '메가시티' },
  // deep_geo_11
  { unit: 'deep_geo_11', search: '세계무역기구' },
  { unit: 'deep_geo_11', search: '세방화' },
  // deep_geo_12
  { unit: 'deep_geo_12', search: '고속철도' },
  { unit: 'deep_geo_12', search: '접근성' },
  { unit: 'deep_geo_12', search: '도심항공교통' },
  // deep_geo_14
  { unit: 'deep_geo_14', search: '출생률' },
  { unit: 'deep_geo_14', search: '사망률' },
  { unit: 'deep_geo_14', search: '생산 가능 인구' },
  // deep_geo_16
  { unit: 'deep_geo_16', search: '지리 정보 시스템' },
  { unit: 'deep_geo_16', search: '위성 위치 확인 시스템' },
  { unit: 'deep_geo_16', search: '증강 현실' },
  { unit: 'deep_geo_16', search: '가상 현실' },
  { unit: 'deep_geo_16', search: '자율주행' },
  { unit: 'deep_geo_16', search: '데이터 윤리' },
  // deep_geo_17
  { unit: 'deep_geo_17', search: '배타적 경제 수역' },
  { unit: 'deep_geo_17', search: '국제연합' },
  { unit: 'deep_geo_17', search: '국제사법재판소' },
  { unit: 'deep_geo_17', search: '평화유지군' },
  { unit: 'deep_geo_17', search: '난민' },
  // deep_geo_18
  { unit: 'deep_geo_18', search: '생물 다양성' }
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/social/deep_geo_content.js", content);
console.log(`\n태그 제거: ${tagRemoveCount}개, 태그 추가: ${tagAddCount}개 완료!`);

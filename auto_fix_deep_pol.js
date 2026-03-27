const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/social/deep_pol_content.js", "utf8");

// 1. passage에서 태그 제거
const passageOnlyTags = [
  // deep_pol_01
  '몽테스키외', '실질적법치주의',
  // deep_pol_03
  '대통령 선거', '국회의원 선거', '지방선거', '선거구제', '대표제', '정치 캠페인', '시민단체',
  // deep_pol_05
  '지방자치단체장', '자치입법권', '자치행정권', '자치재정권',
  // deep_pol_06
  '선택', '정부', '세금', '비용-편익 분석', '제한된 합리성',
  // deep_pol_07
  '가격', '수요곡선', '공급곡선', '균형점',
  // deep_pol_08
  '완전 경쟁 시장', '가격 수용자', '독점 시장', '과점 시장', '가격 설정자', '자연 독점', '독점적 경쟁 시장', '제품 차별화', '진입 장벽',
  // deep_pol_09
  '시장 실패', '외부 효과', '부정적 외부 효과', '긍정적 외부 효과', '정보의 비대칭성', '도덕적 해이', '정부 실패',
  // deep_pol_10
  '국내총생산(GDP)', '이중 계산', '1인당 GDP', '국민총소득(GNI)', '경제 성장', '기술 혁신', '경제 성장의 한계', '소득 불평등', '지속 가능한 발전', '행복 지수',
  // deep_pol_11
  '소비자물가지수(CPI)', '수요 견인 인플레이션', '비용 인상 인플레이션', '화폐의 구매력',
  // deep_pol_12
  '마찰적 실업', '구조적 실업', '경기적 실업', '자연 실업률', '청년 실업', '적극적 노동시장 정책', '소극적 노동시장 정책', '실업 급여',
  // deep_pol_13
  '실업률', '물가 상승률', '경제 안정화 정책',
  // deep_pol_14
  '잘 만드는 물건',
  // deep_pol_15
  '외국환', '강세', '약세',
  // deep_pol_16
  '도전', '창의성', '생산', '기업의 사회적 책임(CSR)',
  // deep_pol_17
  '위험',
  // deep_pol_18
  '재산세', '법인세', '사회 간접 자본', '감사원',
  // deep_pol_20
  '자유 무역 협정(FTA)', '세계 무역 기구(WTO)', '유엔(UN)', '세계보건기구(WHO)'
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
  // deep_pol_03
  { unit: 'deep_pol_03', search: '사표' },
  { unit: 'deep_pol_03', search: '유권자' },
  { unit: 'deep_pol_03', search: '공직자' },
  // deep_pol_04
  { unit: 'deep_pol_04', search: '공천' },
  { unit: 'deep_pol_04', search: '다원주의' },
  { unit: 'deep_pol_04', search: '공익' },
  // deep_pol_05
  { unit: 'deep_pol_05', search: '조례' },
  // deep_pol_08
  { unit: 'deep_pol_08', search: '담합' },
  // deep_pol_09
  { unit: 'deep_pol_09', search: '규제' },
  // deep_pol_10
  { unit: 'deep_pol_10', search: '국내총생산' },
  { unit: 'deep_pol_10', search: '국민총소득' },
  { unit: 'deep_pol_10', search: '생산성' },
  // deep_pol_11
  { unit: 'deep_pol_11', search: '소비자물가지수' },
  { unit: 'deep_pol_11', search: '총수요' },
  // deep_pol_12
  { unit: 'deep_pol_12', search: '노동시장' },
  // deep_pol_15
  { unit: 'deep_pol_15', search: '가격 경쟁력' },
  // deep_pol_16
  { unit: 'deep_pol_16', search: '기업의 사회적 책임' },
  // deep_pol_17
  { unit: 'deep_pol_17', search: '원금' },
  { unit: 'deep_pol_17', search: '연체' },
  // deep_pol_19
  { unit: 'deep_pol_19', search: '규제' },
  { unit: 'deep_pol_19', search: '중앙은행' },
  { unit: 'deep_pol_19', search: '담합' },
  // deep_pol_20
  { unit: 'deep_pol_20', search: '자유 무역 협정' },
  { unit: 'deep_pol_20', search: '세계 무역 기구' },
  { unit: 'deep_pol_20', search: '유엔' },
  { unit: 'deep_pol_20', search: '국제기구' },
  { unit: 'deep_pol_20', search: '세계 시민' }
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/social/deep_pol_content.js", content);
console.log(`\n태그 제거: ${tagRemoveCount}개, 태그 추가: ${tagAddCount}개 완료!`);

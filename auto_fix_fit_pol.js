const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/social/fit_pol_content.js", "utf8");

// 1. passage에서 태그 제거
const passageOnlyTags = [
  '조정', '논의', '참여', '규칙', '협력',  // fit_pol_01
  '기회', '소수의 의견',                   // fit_pol_02
  '노력',                                  // fit_pol_03
  '의사', '숙의 민주주의',                 // fit_pol_04
  '기권',                                  // fit_pol_05
  '몽테스키외', '부패',                    // fit_pol_06
  '관심',                                  // fit_pol_07
  '책임', '국방의 의무', '교육의 의무', '근로의 의무', '무제한', '질서 유지', // fit_pol_08
  '기후 변화', '지구촌',                   // fit_pol_09
  '경제적', '국방비', '통합',              // fit_pol_10
  '상품', '현명한 소비자',                 // fit_pol_11
  '그래프', '균형 가격',                   // fit_pol_12
  '구매력', '중앙은행',                    // fit_pol_13
  '물물 교환', '가치의 저장', '핀테크',    // fit_pol_14
  '계획적', '체크카드',                    // fit_pol_15
  '주식',                                  // fit_pol_16
  'GDP', '경제 정책', '한국은행', '소득', '환경 오염', // fit_pol_17
  '사회 간접 자본', '예산', '감사',        // fit_pol_18
  '자유 무역 협정(FTA)', '세계 무역 기구(WTO)', '흑자', '적자', // fit_pol_19
  '인공지능(AI)', '로봇', '빅데이터', '디지털 역량' // fit_pol_20
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
  { unit: 'fit_pol_07', search: '주민 자치' },
  { unit: 'fit_pol_09', search: '국제법' },
  { unit: 'fit_pol_11', search: '자원' },
  { unit: 'fit_pol_11', search: '효율적' },
  { unit: 'fit_pol_12', search: '생산자' },
  { unit: 'fit_pol_13', search: '시장 경제' },
  { unit: 'fit_pol_15', search: '예산' },
  { unit: 'fit_pol_16', search: '소비자' },
  { unit: 'fit_pol_19', search: '자유 무역 협정' },
  { unit: 'fit_pol_19', search: '세계 무역 기구' },
  { unit: 'fit_pol_20', search: '인공지능' }
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/social/fit_pol_content.js", content);
console.log(`\n태그 제거: ${tagRemoveCount}개, 태그 추가: ${tagAddCount}개 완료!`);

const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/social/deep_geo_content.js", "utf8");

// passage에 태그 추가
const addTags = [
  // deep_geo_04
  { unit: 'deep_geo_04', search: '퇴적' },
  { unit: 'deep_geo_04', search: '범람원' },
  { unit: 'deep_geo_04', search: '삼각주' },
  { unit: 'deep_geo_04', search: '사빈' },
  // deep_geo_05
  { unit: 'deep_geo_05', search: '온대 계절풍 기후' },
  // deep_geo_06
  { unit: 'deep_geo_06', search: '수도권 집중' },
  // deep_geo_07
  { unit: 'deep_geo_07', search: '스마트 시티' },
  { unit: 'deep_geo_07', search: '삶의 질' },
  // deep_geo_10
  { unit: 'deep_geo_10', search: '석탄' },
  // deep_geo_11
  { unit: 'deep_geo_11', search: '세계화' },
  // deep_geo_15
  { unit: 'deep_geo_15', search: '도시 문제' },
  { unit: 'deep_geo_15', search: '도심' },
  { unit: 'deep_geo_15', search: '스마트 시티' },
  // deep_geo_18
  { unit: 'deep_geo_18', search: '환경 문제' },
  { unit: 'deep_geo_18', search: '지구 온난화' },
  // deep_geo_19
  { unit: 'deep_geo_19', search: '고갈성 자원' },
  { unit: 'deep_geo_19', search: '에너지 전환' },
  { unit: 'deep_geo_19', search: '에너지 안보' },
  { unit: 'deep_geo_19', search: '태양광 에너지' },
  { unit: 'deep_geo_19', search: '풍력 에너지' },
  { unit: 'deep_geo_19', search: '원자력 에너지' },
  // deep_geo_20
  { unit: 'deep_geo_20', search: '장소 마케팅' },
  { unit: 'deep_geo_20', search: '로컬 푸드' }
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
console.log(`\n태그 추가: ${tagAddCount}개 완료!`);

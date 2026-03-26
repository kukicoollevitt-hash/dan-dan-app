const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/science/fit_earth_content.js", "utf8");

// 1. passage에서 태그 제거 (vocab에 없는 것들)
const passageOnlyTags = [
  '중력', '냉각',                    // fit_earth_01
  '사암', '석회암', '규암',           // fit_earth_03
  '흙',                              // fit_earth_04
  '에너지', '진도', '진원', '지진파', // fit_earth_06
  '마그마',                          // fit_earth_07
  '셰일', '화석', '편암',            // fit_earth_08
  '퇴적암',                          // fit_earth_09
  '자석',                            // fit_earth_10
  '구름', '태양 에너지', '산곡풍', '기상학', // fit_earth_11
  '물방울', '얼음 알갱이', '상승', '기온 감률', '고적운', '고층운', // fit_earth_12
  '응결',                            // fit_earth_13
  '날씨', '해발 고도', '기후 변화', '이산화탄소', '파리 협정', // fit_earth_14
  '태양', '수성', '금성', '지구', '화성', '목성', '토성', '천왕성', '해왕성', '물', '대기', // fit_earth_15
  '광물 자원', '에너지 자원', '생물 자원', '천연가스', '화석 연료', '자원의 분포', // fit_earth_16
  '조경 수역', '멕시코 만류', '페루 해류', '조력 발전소', // fit_earth_17
  '양치식물', '공룡',                // fit_earth_18
  '국제우주정거장', '소행성',        // fit_earth_19
  '지진 해일(쓰나미)', '태풍의 눈'   // fit_earth_20
];

passageOnlyTags.forEach(tag => {
  const escapedTag = tag.replace(/[()]/g, '\\$&');
  const regex = new RegExp(`<b>${escapedTag}</b>`, 'g');
  const before = content;
  content = content.replace(regex, tag);
  if (before !== content) {
    console.log(`태그 제거: <b>${tag}</b> -> ${tag}`);
  }
});

// 2. passage에 태그 추가 (vocab에 있지만 태그 없는 것들)
const addTags = [
  { unit: 'fit_earth_02', search: '화석연료' },
  { unit: 'fit_earth_10', search: '해령' },
  { unit: 'fit_earth_13', search: '태풍' },
  { unit: 'fit_earth_16', search: '광물' },
  { unit: 'fit_earth_16', search: '분포' },
  { unit: 'fit_earth_19', search: '우주정거장' },
  { unit: 'fit_earth_19', search: '궤도' }
];

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
    console.log(`태그 추가: ${item.unit} - ${item.search}`);
  } else {
    console.log(`단어 없음: ${item.unit} - ${item.search}`);
  }
});

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/science/fit_earth_content.js", content);
console.log("\n태그 수정 완료!");

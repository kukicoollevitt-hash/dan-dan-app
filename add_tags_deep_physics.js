const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/science/deep_physics_content.js", "utf8");

// passage에 태그 추가
const addTags = [
  { unit: 'deep_physics_03', search: '속도' },
  { unit: 'deep_physics_03', search: '가속도' },
  { unit: 'deep_physics_04', search: '관성' },
  { unit: 'deep_physics_04', search: '마찰력' },
  { unit: 'deep_physics_05', search: '공기 저항' },
  { unit: 'deep_physics_06', search: '진동수' },
  { unit: 'deep_physics_08', search: '운동량' },
  { unit: 'deep_physics_10', search: '진동수' },
  { unit: 'deep_physics_10', search: '회절' },
  { unit: 'deep_physics_11', search: '진동수' },
  { unit: 'deep_physics_12', search: '굴절' },
  { unit: 'deep_physics_12', search: '전반사' },
  { unit: 'deep_physics_12', search: '회절' },
  { unit: 'deep_physics_12', search: '간섭' },
  { unit: 'deep_physics_12', search: '광전 효과' },
  { unit: 'deep_physics_13', search: '도체' },
  { unit: 'deep_physics_13', search: '부도체' },
  { unit: 'deep_physics_14', search: '교류' },
  { unit: 'deep_physics_17', search: '광전 효과' },
  { unit: 'deep_physics_17', search: '중첩' },
  { unit: 'deep_physics_18', search: '양성자' },
  { unit: 'deep_physics_18', search: '질량 결손' },
  { unit: 'deep_physics_18', search: '핵융합' },
  { unit: 'deep_physics_19', search: '반도체' },
  { unit: 'deep_physics_19', search: '트랜지스터' },
  { unit: 'deep_physics_20', search: '초전도체' }
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/science/deep_physics_content.js", content);
console.log(`\n태그 추가: ${tagAddCount}개 완료!`);

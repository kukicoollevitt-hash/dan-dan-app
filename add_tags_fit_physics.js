const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/science/fit_physics_content.js", "utf8");

const addTags = [
  { unit: 'fit_physics_01', search: '원래' },
  { unit: 'fit_physics_05', search: '현상' },
  { unit: 'fit_physics_06', search: '도선' },
  { unit: 'fit_physics_06', search: '전자' },
  { unit: 'fit_physics_06', search: '감전' },
  { unit: 'fit_physics_07', search: '스위치' },
  { unit: 'fit_physics_07', search: '도선' },
  { unit: 'fit_physics_08', search: '자기 부상' },
  { unit: 'fit_physics_09', search: '코일' },
  { unit: 'fit_physics_09', search: '수력 발전' },
  { unit: 'fit_physics_09', search: '화력 발전' },
  { unit: 'fit_physics_09', search: '풍력 발전' },
  { unit: 'fit_physics_09', search: '무선 충전' },
  { unit: 'fit_physics_13', search: '진폭' },
  { unit: 'fit_physics_14', search: '섭씨' },
  { unit: 'fit_physics_14', search: '절대온도' },
  { unit: 'fit_physics_14', search: '보온병' },
  { unit: 'fit_physics_16', search: '원소' },
  { unit: 'fit_physics_16', search: '결합' },
  { unit: 'fit_physics_17', search: '파스칼' },
  { unit: 'fit_physics_17', search: '유체' },
  { unit: 'fit_physics_17', search: '밀도' },
  { unit: 'fit_physics_18', search: '저항' },
  { unit: 'fit_physics_18', search: '과전류' },
  { unit: 'fit_physics_18', search: '피복' },
  { unit: 'fit_physics_19', search: '팽창' },
  { unit: 'fit_physics_20', search: '재사용 로켓' },
  { unit: 'fit_physics_20', search: '인공지능' },
  { unit: 'fit_physics_20', search: '시뮬레이션' },
  { unit: 'fit_physics_20', search: '트랜지스터' }
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/science/fit_physics_content.js", content);
console.log("\n태그 추가 완료!");

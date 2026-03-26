const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/science/fit_physics_content.js", "utf8");

// 1. passage에서 태그 제거 (vocab에 없는 것들)
const passageOnlyTags = [
  '과학 혁명',           // fit_physics_02
  '균형', '받침점', '중심', // fit_physics_04
  '운동',                // fit_physics_05
  '주의 사항', '전기 기구', // fit_physics_06
  '안전', '합선',        // fit_physics_07
  '활용', '잠금장치',    // fit_physics_08
  '유도', '작동',        // fit_physics_09
  '밀', '소', '빛', '지진파', // fit_physics_10
  '반사의 법칙', '만화경', '백미러', // fit_physics_11
  '돋보기', '카메라', '프로젝터', // fit_physics_12
  '방음재',              // fit_physics_13
  '난방', '냉장고',      // fit_physics_14
  '빛에너지', '풍력 발전', // fit_physics_15
  '의약품', '반도체', '신소재', // fit_physics_16
  '파스칼(Pa)', '비행기', '주사기', '진공청소기', // fit_physics_17
  '전선',                // fit_physics_18
  '우주 망원경', '탐사선', // fit_physics_19
  '우주 탐사', '인공지능(AI)', '나노기술', '메타물질' // fit_physics_20
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

// '활용' 태그는 여러 유닛에서 나옴
const before = content;
content = content.replace(/<b>활용<\/b>/g, '활용');
if (before !== content) {
  console.log(`태그 제거: <b>활용</b> -> 활용 (전체)`);
}

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/science/fit_physics_content.js", content);
console.log("\n태그 제거 완료!");

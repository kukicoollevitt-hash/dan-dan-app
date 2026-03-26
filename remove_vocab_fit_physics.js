const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/science/fit_physics_content.js", "utf8");

// vocab과 vocabFill에서 제거할 항목들
const removals = {
  'fit_physics_01': ['작용하다', '끌어당기다', '방해하다'],
  'fit_physics_04': ['균형(밸런스)', '받침점(지렛점)', '중심축'],
  'fit_physics_05': ['운동(運動)', '위치 변화', '이동 경로'],
  'fit_physics_17': ['대기압'],
  'fit_physics_19': ['광년', '항성']
};

Object.entries(removals).forEach(([unit, words]) => {
  words.forEach(word => {
    // vocab 배열에서 제거
    const escapedWord = word.replace(/[()]/g, '\\$&');
    const vocabRegex = new RegExp(`\\s*\\['${escapedWord}',\\s*'[^']*'\\],?\\n?`, 'g');
    const before = content;
    content = content.replace(vocabRegex, '');
    if (before !== content) {
      console.log(`vocab 제거: ${unit} - ${word}`);
    }

    // vocabFill에서 제거
    const vocabFillRegex = new RegExp(`\\s*\\{\\s*no:\\s*\\d+,\\s*text:\\s*'[^']*',\\s*answer:\\s*'${escapedWord}'[^}]*\\},?\\n?`, 'g');
    const before2 = content;
    content = content.replace(vocabFillRegex, '');
    if (before2 !== content) {
      console.log(`vocabFill 제거: ${unit} - ${word}`);
    }
  });
});

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/science/fit_physics_content.js", content);
console.log("\nvocab 제거 완료!");

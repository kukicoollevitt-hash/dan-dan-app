const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/science/fit_earth_content.js", "utf8");

// vocab과 vocabFill에서 제거할 항목들
const removals = {
  'fit_earth_15': ['공전']
};

Object.entries(removals).forEach(([unit, words]) => {
  words.forEach(word => {
    // vocab 배열에서 제거
    const vocabRegex = new RegExp(`\\s*\\['${word}',\\s*'[^']*'\\],?\\n?`, 'g');
    const before = content;
    content = content.replace(vocabRegex, '');
    if (before !== content) {
      console.log(`vocab 제거: ${unit} - ${word}`);
    }

    // vocabFill에서 제거
    const vocabFillRegex = new RegExp(`\\s*\\{\\s*no:\\s*\\d+,\\s*text:\\s*'[^']*',\\s*answer:\\s*'${word}'[^}]*\\},?\\n?`, 'g');
    const before2 = content;
    content = content.replace(vocabFillRegex, '');
    if (before2 !== content) {
      console.log(`vocabFill 제거: ${unit} - ${word}`);
    }
  });
});

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/science/fit_earth_content.js", content);
console.log("\nvocab 제거 완료!");

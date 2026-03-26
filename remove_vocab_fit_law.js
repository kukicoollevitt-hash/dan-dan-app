const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/social/fit_law_content.js", "utf8");

// vocab과 vocabFill에서 제거할 항목들
const removals = {
  'fit_law_01': ['자연스럽다'],
  'fit_law_03': ['신분 제도', '불평등', '약자'],
  'fit_law_04': ['사회 보장 제도'],
  'fit_law_07': ['국민 청원']
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/social/fit_law_content.js", content);
console.log("\nvocab 제거 완료!");

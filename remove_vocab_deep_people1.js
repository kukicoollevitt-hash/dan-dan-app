const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/person/deep_people1_content.js", "utf8");

// vocab과 vocabFill에서 제거할 항목들 (vocabFill 미사용)
const removals = {
  'deep_people1_01': ['꾸짖다', '한눈팔다'],
  'deep_people1_16': ['매달리다']
};

Object.entries(removals).forEach(([unit, words]) => {
  words.forEach(word => {
    const escapedWord = word.replace(/[()]/g, '\\$&');
    const vocabRegex = new RegExp(`\\s*\\['${escapedWord}',\\s*'[^']*'\\],?\\n?`, 'g');
    const before = content;
    content = content.replace(vocabRegex, '');
    if (before !== content) {
      console.log(`vocab 제거: ${unit} - ${word}`);
    }

    const vocabFillRegex = new RegExp(`\\s*\\{\\s*no:\\s*\\d+,\\s*text:\\s*'[^']*',\\s*answer:\\s*'${escapedWord}'[^}]*\\},?\\n?`, 'g');
    const before2 = content;
    content = content.replace(vocabFillRegex, '');
    if (before2 !== content) {
      console.log(`vocabFill 제거: ${unit} - ${word}`);
    }
  });
});

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/person/deep_people1_content.js", content);
console.log("\nvocab 제거 완료!");

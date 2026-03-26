const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/social/fit_pol_content.js", "utf8");

// vocab과 vocabFill에서 제거할 항목들
const removals = {
  'fit_pol_01': ['조정하다', '논의하다', '참여하다'],
  'fit_pol_02': ['기회 평등'],
  'fit_pol_04': ['의사(意思)'],
  'fit_pol_05': ['유권자'],
  'fit_pol_10': ['평화 공존'],
  'fit_pol_19': ['무역 흑자'],
  'fit_pol_20': ['기후 변화']
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/social/fit_pol_content.js", content);
console.log("\nvocab 제거 완료!");

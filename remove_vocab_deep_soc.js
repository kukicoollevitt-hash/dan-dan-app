const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/social/deep_soc_content.js", "utf8");

// vocab과 vocabFill에서 제거할 항목들
const removals = {
  'deep_soc_02': ['표본', '모집단'],
  'deep_soc_05': ['지위 불일치', '사회적 상호작용', '연극적 접근'],
  'deep_soc_06': ['비공식적'],
  'deep_soc_09': ['치료적 접근'],
  'deep_soc_10': ['선발 기능'],
  'deep_soc_13': ['문화 지체'],
  'deep_soc_18': ['생태 발자국'],
  'deep_soc_19': ['강제성']
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/social/deep_soc_content.js", content);
console.log("\nvocab 제거 완료!");

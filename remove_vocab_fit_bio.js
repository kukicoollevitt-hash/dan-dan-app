const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/science/fit_bio_content.js", "utf8");

// vocab과 vocabFill에서 제거할 항목들
const removals = {
  'fit_bio_05': ['부화'],
  'fit_bio_15': ['이중 나선'],
  'fit_bio_16': ['생태계 평형'],
  'fit_bio_19': ['서식지 이동', '해수면 상승'],
  'fit_bio_20': ['장기 재생']
};

Object.entries(removals).forEach(([unit, words]) => {
  words.forEach(word => {
    // vocab 배열에서 제거: ['word', 'definition'],
    const vocabRegex = new RegExp(`\\s*\\['${word.replace(/[()]/g, '\\$&')}',\\s*'[^']*'\\],?\\n?`, 'g');
    const before = content;
    content = content.replace(vocabRegex, '');
    if (before !== content) {
      console.log(`vocab 제거: ${unit} - ${word}`);
    }

    // vocabFill에서 제거
    const vocabFillRegex = new RegExp(`\\s*\\{\\s*no:\\s*\\d+,\\s*text:\\s*'[^']*',\\s*answer:\\s*'${word.replace(/[()]/g, '\\$&')}'[^}]*\\},?\\n?`, 'g');
    const before2 = content;
    content = content.replace(vocabFillRegex, '');
    if (before2 !== content) {
      console.log(`vocabFill 제거: ${unit} - ${word}`);
    }
  });
});

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/science/fit_bio_content.js", content);
console.log("\nvocab 제거 완료!");
